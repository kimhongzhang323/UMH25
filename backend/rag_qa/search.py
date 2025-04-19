import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load index and answer map
index = faiss.read_index("faiss.index")
answers = np.load("answers.npy", allow_pickle=True)
model = SentenceTransformer("all-MiniLM-L6-v2")

def search_qa(user_question, top_k=3):
    q_embedding = model.encode([user_question])
    D, I = index.search(np.array(q_embedding), k=top_k)
    
    results = [answers[i] for i in I[0]]
    return results

# Example
if __name__ == "__main__":
    while True:
        q = input("Ask a question: ")
        top_answers = search_qa(q)
        print("Top Match:")
        print(top_answers[0])
