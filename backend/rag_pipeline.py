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

# Query function
def query_rag(user_query):
    query_embedding = model.encode([user_query])
    D, I = index.search(np.array(query_embedding), k=3)

    # Retrieve top QA chunks
    top_k_qa = [qa_texts[i] for i in I[0]]
    context = "\n".join(top_k_qa)

    prompt = f"""Use the following question-answer pairs to help answer the user's question.Make sure use the same language as input.Answer the question concisely without asking follow up question.Understand the user question and query in the vector database and find the most similar answer for it using english and response in the same language as input.Give the response as the same language as input. ITS A MUST to use same language. If from the vector database its in english make it into the input language.Calculate the similarities of the question by the user and the question in vector db, if its lesser then 70% u shud generate a text to tell the user to consult the support staff in this "url", make the notice professional

Context:
{context}

User Question: {user_query}
Answer:"""

    # Use Gemini to generate the answer
    generation_model = genai.GenerativeModel("gemini-2.0-flash")
    response = generation_model.generate_content(prompt)
    return response.text

# Interactive CLI
if __name__ == "__main__":
    while True:
        user_query = input("\nAsk a question (or type 'exit'): ")
        if user_query.lower() == "exit":
            break
        answer = query_rag(user_query)
        print(f"\n🧠 Answer: {answer}")
