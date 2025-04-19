import os
import json
import faiss
import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Load .env variables
load_dotenv()
API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)

# Load QA pairs
with open("data/qa_pairs.json", "r") as f:
    qa_data = json.load(f)

qa_texts = [f"Q: {item['question']} A: {item['answer']}" for item in qa_data]

# Generate embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")
qa_embeddings = model.encode(qa_texts)

# Setup FAISS
dimension = qa_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(qa_embeddings))

# Initialize chat history
chat_history = []

# Query function
def query_rag(user_query):
    global chat_history  # Use the global chat history

    # Generate embedding for the user query
    query_embedding = model.encode([user_query])
    D, I = index.search(np.array(query_embedding), k=3)

    # Retrieve top QA chunks
    top_k_qa = [qa_texts[i] for i in I[0]]
    context = "\n".join(top_k_qa)

    # Include chat history in the context
    history_context = "\n".join([f"User: {q}\nAssistant: {a}" for q, a in chat_history])
    full_context = f"{history_context}\n\nContext:\n{context}"

    # Prompt with chat history
    prompt = f"""
You are an intelligent assistant tasked with answering user questions based on the provided context and chat history. Follow these guidelines strictly:

1. Always respond in the same language as the user's input. If the context is in English but the input is in another language, translate the response to match the input language.
2. Use the vector database to find the most similar question-answer pair based on the user's query. If the similarity score is below 70%, inform the user to consult the support staff at this "url" in a professional tone.
3. Provide concise and accurate answers without asking follow-up questions.
4. Ensure the response is professional and easy to understand.

Chat History:
{history_context}

Context:
{context}

User Question: {user_query}

Answer:
"""

    # Use Gemini to generate the answer
    generation_model = genai.GenerativeModel("gemini-2.0-flash")
    response = generation_model.generate_content(prompt)

    # Update chat history
    chat_history.append((user_query, response.text))

    return response.text

# Interactive CLI
if __name__ == "__main__":
    while True:
        user_query = input("\nAsk a question (or type 'exit'): ")
        if user_query.lower() == "exit":
            break
        answer = query_rag(user_query)
        print(f"\n🧠 Answer: {answer}")
