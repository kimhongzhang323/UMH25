from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Form, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Annotated
# from transformers import AutoTokenizer, AutoModelForCausalLM # Comment out real imports
# from sentence_transformers import SentenceTransformer # Comment out real imports
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import io
import csv
from fastapi.middleware.cors import CORSMiddleware
import time
import os
import json
import logging

import customer_service
from chat_database import Chat, ChatDatabase, Message
from rag_pipeline import query_rag  # Import the query_rag function

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Llama RAG API with CSV Support (Mocked)",
    description="Retrieval-Augmented Generation API using mocked Llama for testing",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    # Add your production frontend URLs here when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(customer_service.router)


# Create tmp dir
os.makedirs("tmp", exist_ok=True)

# Serving static files
app.mount("/tmp", StaticFiles(directory="tmp"), name="tmp")

chat_db = ChatDatabase(chats=[], messages={})

# Configuration
MODEL_NAME = "meta-llama/Llama-2-7b-chat-hf"  # Keep for reference
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"  # Keep for reference
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MAX_NEW_TOKENS = 512
TEMPERATURE = 0.7
CSV_CHUNK_SIZE = 1000  # Number of rows to process at a time for large CSVs

# Load models (mocked for testing)
TESTING = True

if not TESTING:
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        from sentence_transformers import SentenceTransformer
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(DEVICE)
        embedding_model = SentenceTransformer(EMBEDDING_MODEL, device=DEVICE)
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {str(e)}")
else:
    print("Running in TESTING mode: Using mock models.")

    class MockTokenizer:
        def __init__(self, model_name):
            self.model_name = model_name

        def __call__(self, prompt, return_tensors="pt"):
            return {"input_ids": torch.tensor([[1, 2, 3]])}  # Dummy input IDs

        def decode(self, output_ids, skip_special_tokens=True):
            return "Mock Llama Response"

    class MockModel:
        def __init__(self, model_name):
            self.model_name = model_name

        def generate(self, input_ids, max_new_tokens, temperature, do_sample):
            return torch.tensor([[4, 5, 6]])  # Dummy output IDs

    class MockEmbeddingModel:
        def __init__(self, model_name, device):
            self.model_name = model_name
            self.device = device

        def encode(self, text):
            return np.array([0.1, 0.2, 0.3])  # Dummy embedding

    tokenizer = MockTokenizer(MODEL_NAME)
    model = MockModel(MODEL_NAME)
    embedding_model = MockEmbeddingModel(EMBEDDING_MODEL, DEVICE)


class Query(BaseModel):
    question: str
    context: Optional[List[str]] = None
    max_tokens: Optional[int] = MAX_NEW_TOKENS
    temperature: Optional[float] = TEMPERATURE
    use_csv_context: Optional[bool] = True  # Whether to use CSV data in RAG


class CSVConfig(BaseModel):
    text_columns: List[str]  # Columns to use for text content
    id_column: Optional[str] = None  # Optional unique identifier column
    metadata_columns: Optional[List[str]] = None  # Columns to include as metadata


class Document(BaseModel):
    text: str
    metadata: Optional[dict] = None
    source: Optional[str] = "csv"  # Track source of document


class DocumentStore:
    def __init__(self):
        self.documents = []
        self.embeddings = None
        self.document_ids = []

    def add_document(self, document: Document):
        self.documents.append(document)
        text_embedding = embedding_model.encode(document.text)
        if self.embeddings is None:
            self.embeddings = text_embedding.reshape(1, -1)
        else:
            self.embeddings = np.vstack([self.embeddings, text_embedding])
        self.document_ids.append(document.metadata.get("id", len(self.documents)))

    def retrieve_relevant(self, query: str, top_k: int = 3) -> List[str]:
        query_embedding = embedding_model.encode(query).reshape(1, -1)
        similarities = cosine_similarity(query_embedding, self.embeddings)[0]
        top_indices = similarities.argsort()[-top_k:][::-1]
        return [self.documents[i].text for i in top_indices]

    def clear_csv_documents(self):
        """Remove all documents that came from CSV sources"""
        indices_to_keep = [i for i, doc in enumerate(self.documents) if doc.source != "csv"]
        self.documents = [self.documents[i] for i in indices_to_keep]
        if len(indices_to_keep) > 0:
            self.embeddings = self.embeddings[indices_to_keep]
        else:
            self.embeddings = None
        self.document_ids = [self.document_ids[i] for i in indices_to_keep]


document_store = DocumentStore()


# Used by MerchantInfo
class Location(BaseModel):
    region: str
    market_type: str


class MerchantInfo(BaseModel):
    merchant_type: str
    product_type: str
    business_size: str
    challenges: List[str]
    location: Location
    language: str


def generate_unix_timestamp() -> int:
    # 1 billion nanoseconds = 1 second
    value = int(time.time())
    return value


# Menu Item Models
class MenuItemBase(BaseModel):
    item_id: int
    name: str
    cuisine_tag: str
    price: float


class MenuItem(MenuItemBase):
    current_stock: int = 0
    min_stock: int = 10
    status: str = "adequate"


def process_csv_row(row: dict, config: CSVConfig) -> Document:
    """Convert a CSV row into a Document"""
    # Combine specified text columns
    text = " ".join(str(row[col]) for col in config.text_columns if col in row)

    # Extract metadata
    metadata = {}
    if config.id_column and config.id_column in row:
        metadata["id"] = row[config.id_column]
    if config.metadata_columns:
        for col in config.metadata_columns:
            if col in row:
                metadata[col] = row[col]

    return Document(text=text, metadata=metadata, source="csv")


@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(status_code=200)


@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


def generate_prompt(question: str, context: List[str] = None) -> str:
    if context:
        context_str = "\n".join([f"Context {i + 1}: {c}" for i, c in enumerate(context)])
        return f"""Answer the following question based on the provided context.

        {context_str}

        Question: {question}

        Answer:"""
    else:
        return f"""Answer the following question.

        Question: {question}

        {context_str}

        Question: {question}

        Answer:"""


@app.post("/query")
async def query_llama(query: Query):
    try:
        # Retrieve relevant documents if no context provided and use_csv_context is True
        if not query.context and query.use_csv_context:
            query.context = document_store.retrieve_relevant(query.question)

        # Generate prompt
        prompt = generate_prompt(query.question, query.context)

        # Tokenize and generate
        inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=query.max_tokens,
            temperature=query.temperature,
            do_sample=True
        )

        # Decode and clean up response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("Answer:")[-1].strip()

        return {
            "response": response,
            "context_used": query.context,
            "context_source": "csv" if query.use_csv_context else "user_provided"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload_csv")
async def upload_csv(
    file: UploadFile = File(...),
    text_columns: str = "",  # Comma-separated list of columns
    id_column: Optional[str] = None,
    metadata_columns: Optional[str] = None  # Comma-separated list
):
    try:
        # Parse CSV configuration
        config = CSVConfig(
            text_columns=[col.strip() for col in text_columns.split(",") if col.strip()],
            id_column=id_column,
            metadata_columns=[col.strip() for col in metadata_columns.split(",")] if metadata_columns else None
        )

        # Clear existing CSV documents
        document_store.clear_csv_documents()

        # Process CSV in chunks for memory efficiency
        contents = await file.read()
        csv_text = io.StringIO(contents.decode('utf-8'))

        # Clear existing CSV documents
        document_store.clear_csv_documents()

        # Process CSV in chunks for memory efficiency
        contents = await file.read()
        csv_text = io.StringIO(contents.decode('utf-8'))

        # Detect if file has header
        sniffer = csv.Sniffer()
        has_header = sniffer.has_header(csv_text.read(1024))
        csv_text.seek(0)

        # Read CSV
        df_chunks = pd.read_csv(
            csv_text,
            chunksize=CSV_CHUNK_SIZE,
            header=0 if has_header else None
        )

        total_rows = 0
        for chunk in df_chunks:
            # Convert each row to a document
            for _, row in chunk.iterrows():
                document = process_csv_row(row.to_dict(), config)
                document_store.add_document(document)
            total_rows += len(chunk)

        return {
            "status": "success",
            "message": f"CSV processed successfully. Added {total_rows} documents.",
            "columns_used": config.text_columns,
            "metadata_columns": config.metadata_columns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/csv_columns")
async def get_csv_columns(file: UploadFile = File(...)):
    """Endpoint to preview CSV columns"""
    try:
        contents = await file.read()
        csv_text = io.StringIO(contents.decode('utf-8'))
        df = pd.read_csv(csv_text, nrows=1)  # Just read header
        return {"columns": list(df.columns)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/document_count")
async def get_document_count():
    return {
        "total_documents": len(document_store.documents),
        "csv_documents": sum(1 for doc in document_store.documents if doc.source == "csv")
    }


@app.put("/update_merchant_info")
async def update_merchant_info(merchant_info: MerchantInfo):
    # Update merchant info somewhere
    # Possibly just a global variable or database
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/send_chat")
async def chat_to_llm(
    message: Annotated[str, Form()],
    chat_id: Annotated[str, Form()],
    file: Annotated[UploadFile, File()] = None
):
    # Send data to LLM for processing
    # Save chat to database
    return Message(
        id="51fb3990-9997-4351-b0a1-bf13a6499651",
        text="Womp Womp",
        sender="bot",
        timestamp=generate_unix_timestamp(),
        image_url="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpadoru.wiki%2Fimages%2Fpadoru.png&f=1&nofb=1&ipt=a7cff58e3937272582c2417e06a3dd748494dd39be4a5678c62df4687eb1c3c8"
    )


@app.get("/menu/items", response_model=List[MenuItem])
async def get_menu_items():
    """Get all menu items"""
    df = pd.read_csv('data/DimSumDelight_Full.csv')
    # Get unique items and their latest prices
    items = df.groupby(['item_id', 'item_name', 'cuisine_tag', 'item_price']).size().reset_index()

    return [
        MenuItem(
            item_id=row['item_id'],
            name=row['item_name'],
            cuisine_tag=row['cuisine_tag'],
            price=row['item_price'],
        )
        for _, row in items.iterrows()
    ]


@app.get("/menu/items/{item_id}", response_model=MenuItem)
async def get_menu_item(item_id: int):
    """Get a specific menu item by ID"""
    df = pd.read_csv('data/DimSumDelight_Full.csv')
    item = df[df['item_id'] == item_id].iloc[0]

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return MenuItem(
        item_id=item['item_id'],
        name=item['item_name'],
        cuisine_tag=item['cuisine_tag'],
        price=item['item_price']
    )


@app.get("/get_all_chats")
async def get_all_chats() -> List[Chat]:
    return chat_db.get_all_chats()


@app.get("/get_all_messages")
async def get_all_messages(chat_id: str) -> List[Message]:
    return chat_db.get_all_messages(chat_id)


@app.post("/new_chat")
async def new_chat(chat: Chat):
    chat_db.add_new_chat(chat)


class ChatRequest(BaseModel):
    query: str
    chat_id: str = "default"


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Fetch the response from the RAG pipeline
        response_text = query_rag(request.query).replace('\'', '"')
        try:
            data = json.loads(response_text)

            return JSONResponse(content={
                "response": data["text"],
                "image_url": "http://localhost:8000" + data["image"]})
        except Exception as e:
            logger.error(e)
            return JSONResponse(content={
                "response": response_text})

    except Exception as e:
        logger.error(e)
        # Handle errors and return a meaningful message
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
