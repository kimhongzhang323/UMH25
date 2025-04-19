import json
import faiss
import numpy as np
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict, Union
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import pandas as pd
from langdetect import detect
from googletrans import Translator
from datetime import datetime, timedelta

class BusinessQASystem:
    def __init__(self, qa_path: str = 'data/qa_pairs.json', hf_token: str = None, data_path: str = 'data/DimSumDelight_Full.csv'):
        # Initialize models
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.translator = Translator()
        
        # Load data
        self.qa_pairs = self._load_qa(qa_path)
        self.sales_data = pd.read_csv(data_path, parse_dates=['order_time'])
        self.index, self.answers = self._build_index()
        
        # Initialize LLM
        self.llm, self.tokenizer = self._init_llm(hf_token)
        
    def _load_qa(self, path: str) -> List[Dict]:
        with open(path, 'r') as f:
            return json.load(f)
    
    def _build_index(self):
        questions = [pair['question'] for pair in self.qa_pairs]
        answers = np.array([json.dumps(pair['answer']) for pair in self.qa_pairs])
        embeddings = self.embedding_model.encode(questions)
        
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(np.array(embeddings))
        return index, answers
    
    def _init_llm(self, hf_token: str):
        if not hf_token or not torch.cuda.is_available():
            print("LLM disabled - no token or CUDA unavailable")
            return None, None
            
        try:
            model_name = "meta-llama/Meta-Llama-3-8B-Instruct"
            tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
            llm = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.bfloat16,
                device_map="auto",
                token=hf_token
            )
            print("Llama 3-8B initialized successfully")
            return llm, tokenizer
        except Exception as e:
            print(f"Error initializing LLM: {e}")
            return None, None
    
    def _detect_language(self, text: str) -> str:
        try:
            return detect(text)
        except:
            return 'en'
    
    def _translate_to_english(self, text: str) -> str:
        if self._detect_language(text) == 'en':
            return text
        try:
            return self.translator.translate(text, dest='en').text
        except:
            return text
    
    def _translate_to_target(self, text: str, target_lang: str) -> str:
        if target_lang == 'en':
            return text
        try:
            return self.translator.translate(text, dest=target_lang).text
        except:
            return text
    
    def _generate_sales_report(self, time_period: str = 'week', lang: str = 'en') -> Dict:
        """Generate dynamic sales report with visualization"""
        end_date = datetime.now()
        
        if time_period == 'week':
            start_date = end_date - timedelta(days=7)
            title = "Weekly Sales Trend"
        elif time_period == 'month':
            start_date = end_date - timedelta(days=30)
            title = "Monthly Sales Trend"
        else:  # default to daily
            start_date = end_date - timedelta(days=1)
            title = "Daily Sales"
        
        period_data = self.sales_data[
            (self.sales_data['order_time'] >= start_date) & 
            (self.sales_data['order_time'] <= end_date)
        ]
        
        if time_period == 'week':
            grouped = period_data.groupby(period_data['order_time'].dt.day_name())['order_value'].sum()
            grouped = grouped.reindex(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        elif time_period == 'month':
            grouped = period_data.groupby(period_data['order_time'].dt.day)['order_value'].sum()
        else:
            grouped = period_data.groupby(period_data['order_time'].dt.hour)['order_value'].sum()
        
        # Generate visualization
        plt.figure(figsize=(10, 5))
        grouped.plot(kind='bar' if time_period in ['week', 'month'] else 'line', 
                    color='#00B14F', 
                    marker='o' if time_period == 'day' else None)
        plt.title(title)
        plt.xlabel('Day' if time_period == 'week' else 'Date' if time_period == 'month' else 'Hour')
        plt.ylabel('Sales ($)')
        plt.grid(True)
        plt.tight_layout()
        
        # Save to buffer
        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        
        # Calculate insights
        total_sales = period_data['order_value'].sum()
        avg_order = period_data['order_value'].mean()
        peak_value = grouped.max()
        peak_time = grouped.idxmax()
        
        return {
            'text': self._translate_to_target(f"Your {time_period}ly sales report", lang),
            'image': base64.b64encode(buf.read()).decode('utf-8'),
            'insight': self._translate_to_target(
                f"Total sales: ${total_sales:,.2f} | "
                f"Avg order: ${avg_order:,.2f} | "
                f"Peak {time_period}: {peak_time} (${peak_value:,.2f})", 
                lang
            ),
            'type': 'visualization'
        }
    
    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        # Detect language
        lang = self._detect_language(query)
        english_query = self._translate_to_english(query)
        
        # Handle specific business queries
        if any(phrase in english_query.lower() for phrase in ['how are my sales', 'sales report', 'sales performance']):
            time_period = 'week'
            if 'daily' in english_query.lower():
                time_period = 'day'
            elif 'monthly' in english_query.lower():
                time_period = 'month'
            return [self._generate_sales_report(time_period, lang)]
        
        # Normal vector search
        query_embed = self.embedding_model.encode([english_query])
        distances, indices = self.index.search(np.array(query_embed), top_k)
        
        results = []
        for i, dist in zip(indices[0], distances[0]):
            answer = json.loads(self.answers[i])
            if answer.get('type') == 'visualization':
                try:
                    local_vars = {'pd': pd, 'plt': plt, 'df': self.sales_data}
                    exec(answer['code'], globals(), local_vars)
                    
                    buf = BytesIO()
                    plt.savefig(buf, format='png')
                    plt.close()
                    buf.seek(0)
                    
                    insight = answer.get('insight', '')
                    if '{' in insight:
                        insight = insight.format(**local_vars)
                    
                    results.append({
                        'text': self._translate_to_target(answer['text'], lang),
                        'image': base64.b64encode(buf.read()).decode('utf-8'),
                        'insight': self._translate_to_target(insight, lang),
                        'type': 'visualization'
                    })
                except Exception as e:
                    print(f"Visualization failed: {e}")
            else:
                results.append({
                    'text': self._translate_to_target(answer['text'], lang),
                    'type': 'text'
                })
        
        return results

if __name__ == "__main__":
    HF_TOKEN = ""
    qa_system = BusinessQASystem(
        qa_path='data/qa_pairs.json',
        hf_token=HF_TOKEN,
        data_path='data/DimSumDelight_Full.csv'
    )
    
    print("🌟 Business Intelligence System Ready 🌟")
    print("Ask about sales, performance, or business insights in any language!")
    
    while True:
        try:
            query = input("\nAsk a question (or 'quit'): ").strip()
            if query.lower() == 'quit':
                break
                
            results = qa_system.search(query)
            
            if results:
                response = results[0]
                if response['type'] == 'visualization':
                    print(f"\n{response['text']}")
                    print(f"💡 {response['insight']}")
                    print("[Sales visualization would be displayed here]")
                else:
                    print(f"\n{response['text']}")
            else:
                print("\nI couldn't find relevant sales data. Try asking about your sales performance.")
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {str(e)}")