import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
from typing import List, Dict, Tuple
import time
from pathlib import Path

class EnhancedQAVectorDB:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.answers = None
        self.questions = None
    
    def build_from_json(self, json_path: str, index_dir: str = "vector_db"):
        """Build FAISS index from JSON Q&A pairs"""
        start_time = time.time()
        
        # Create directory if not exists
        Path(index_dir).mkdir(parents=True, exist_ok=True)
        
        # Load and validate Q&A pairs
        with open(json_path, 'r') as f:
            qa_pairs = json.load(f)
        
        if not isinstance(qa_pairs, list) or len(qa_pairs) == 0:
            raise ValueError("Invalid Q&A pairs format - expected non-empty list")
            
        self.questions = [pair['question'] for pair in qa_pairs]
        self.answers = np.array([pair['answer'] for pair in qa_pairs])
        
        # Generate embeddings
        print(f"Generating embeddings for {len(self.questions)} questions...")
        embeddings = self.model.encode(self.questions, 
                                     show_progress_bar=True,
                                     convert_to_numpy=True)
        
        # Create and save FAISS index
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dim)  # Using Inner Product for similarity
        faiss.normalize_L2(embeddings)  # Normalize for cosine similarity
        self.index.add(embeddings)
        
        # Save artifacts
        faiss.write_index(self.index, f"{index_dir}/faiss.index")
        np.save(f"{index_dir}/answers.npy", self.answers)
        with open(f"{index_dir}/questions.json", 'w') as f:
            json.dump(self.questions, f)
        
        print(f"Built index with {len(self.questions)} entries in {time.time()-start_time:.2f}s")
    
    def load_db(self, index_dir: str = "vector_db"):
        """Load pre-built FAISS index and answers"""
        if not os.path.exists(index_dir):
            raise FileNotFoundError(f"Vector DB directory not found: {index_dir}")
            
        self.index = faiss.read_index(f"{index_dir}/faiss.index")
        self.answers = np.load(f"{index_dir}/answers.npy", allow_pickle=True)
        with open(f"{index_dir}/questions.json", 'r') as f:
            self.questions = json.load(f)
        print(f"Loaded vector DB with {len(self.questions)} Q&A pairs")
    
    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        """Search for similar questions and return answers"""
        if self.index is None or self.answers is None:
            raise ValueError("Vector DB not loaded - call load_db() first")
            
        # Encode query and search
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_embedding)
        
        # Get top K matches
        distances, indices = self.index.search(query_embedding, k=top_k)
        
        # Format results
        results = []
        for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
            if idx >= len(self.answers):  # Handle invalid index
                continue
            results.append({
                'question': self.questions[idx],
                'answer': self.answers[idx],
                'score': float(dist),
                'rank': i+1
            })
        
        return results
    
    def add_new_pair(self, question: str, answer: str, index_dir: str = "vector_db"):
        """Add a new Q&A pair to the existing index"""
        if self.index is None:
            self.load_db(index_dir)
            
        # Encode new question
        new_embedding = self.model.encode([question], convert_to_numpy=True)
        faiss.normalize_L2(new_embedding)
        
        # Update index
        self.index.add(new_embedding)
        
        # Update questions and answers
        self.questions.append(question)
        self.answers = np.append(self.answers, answer)
        
        # Save updated artifacts
        self._save_updates(index_dir)
        
    def _save_updates(self, index_dir: str):
        """Helper method to save updated artifacts"""
        faiss.write_index(self.index, f"{index_dir}/faiss.index")
        np.save(f"{index_dir}/answers.npy", self.answers)
        with open(f"{index_dir}/questions.json", 'w') as f:
            json.dump(self.questions, f)


# Example Usage
if __name__ == "__main__":
    # Initialize the vector DB system
    qa_db = EnhancedQAVectorDB()
    
    # Build the initial database (only need to do this once)
    if not os.path.exists("vector_db/faiss.index"):
        print("Building vector database...")
        qa_db.build_from_json('data/qa_pairs.json')
    else:
        print("Loading existing vector database...")
        qa_db.load_db()
    
    # Interactive search demo
    print("\nInteractive Q&A Search (type 'quit' to exit)")
    while True:
        query = input("\nYour question: ").strip()
        if query.lower() in ['quit', 'exit']:
            break
            
        results = qa_db.search(query)
        
        if not results:
            print("No results found")
            continue
            
        print(f"\nTop result (score: {results[0]['score']:.3f}):")
        print(f"Q: {results[0]['question']}")
        print(f"A: {results[0]['answer']}")
        
        if len(results) > 1:
            print(f"\nFound {len(results)} similar questions:")
            for i, r in enumerate(results[1:], 2):
                print(f"{i}. {r['question']} (score: {r['score']:.3f})")