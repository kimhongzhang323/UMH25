import json
import faiss
import numpy as np
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import pandas as pd
from googletrans import Translator
from datetime import datetime, timedelta

class BusinessQASystem:
    def __init__(self, qa_path: str = 'data/qa_pairs.json', hf_token: str = None, data_path: str = 'data/DimSumDelight_Full.csv'):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2').to(self.device)
        self.translator = Translator()
        
        self.qa_pairs = self._load_qa(qa_path)
        try:
            self.sales_data = pd.read_csv(data_path, parse_dates=['order_time'])
        except Exception as e:
            print(f"Error loading sales data: {e}")
            self.sales_data = pd.DataFrame()
        self.index, self.answers = self._build_index()
        
        self.llm, self.tokenizer = self._init_llm(hf_token)

        self.supported_langs = {
            'en': 'English',
            'zh': 'Chinese',
            'id': 'Indonesian',
            'ms': 'Malay',
            'vi': 'Vietnamese',
            'th': 'Thai'
        }

    def _load_qa(self, path: str) -> List[Dict]:
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading QA pairs: {e}")
            return []

    def _build_index(self):
        questions = [pair['question'] for pair in self.qa_pairs]
        answers = [json.dumps(pair['answer']) if isinstance(pair['answer'], dict)
                  else json.dumps({'text': str(pair['answer']), 'type': 'text'})
                  for pair in self.qa_pairs]
        embeddings = self.embedding_model.encode(questions)
        index = faiss.IndexFlatL2(embeddings.shape[1])
        index.add(np.array(embeddings))
        return index, np.array(answers)

    def _init_llm(self, hf_token: str):
        if not hf_token or self.device != 'cuda':
            print("LLM disabled - no token or CUDA unavailable")
            return None, None
        try:
            model_name = "meta-llama/Meta-Llama-3-8B-Instruct"
            tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
            llm = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.bfloat16,
                device_map="balanced",
                token=hf_token
            )
            print("Llama 3-8B initialized successfully")
            return llm, tokenizer
        except Exception as e:
            print(f"Error initializing LLM: {e}")
            return None, None

    def _contains_chinese(self, text: str) -> bool:
        return any('\u4e00' <= ch <= '\u9fff' for ch in text)

    def _detect_language(self, text: str) -> str:
        try:
            if self._contains_chinese(text):
                return 'zh'
                
            detected = self.translator.detect(text)
            if detected.lang in self.supported_langs:
                return detected.lang
                
            if any(word in text.lower() for word in ['apa', 'khabar']):
                return 'ms'
            if any(word in text.lower() for word in ['tôi', 'bạn']):
                return 'vi'
                
            return 'en'
        except Exception as e:
            print(f"Language detection error: {e}")
            return 'en'

    def _translate_to_english(self, text: str) -> str:
        lang = self._detect_language(text)
        if lang == 'en':
            return text
        try:
            return self.translator.translate(text, src=lang, dest='en').text
        except:
            return text

    def _translate_to_target(self, text: str, target_lang: str) -> str:
        if target_lang == 'en':
            return text
        try:
            if target_lang == 'zh':
                return self.translator.translate(text, src='en', dest='zh-cn').text
            return self.translator.translate(text, src='en', dest=target_lang).text
        except Exception as e:
            print(f"Translation error (en→{target_lang}): {e}")
            return text

    def _generate_customer_report(self, time_period: str, lang: str) -> Dict:
        if self.sales_data.empty:
            return {'text': self._translate_to_target("No customer data available", lang), 'type': 'text'}

        end_date = datetime.now()
        if time_period == 'week':
            start_date = end_date - timedelta(days=7)
            title = self._translate_to_target("Weekly New Customers", lang)
            xlabel = self._translate_to_target("Day of Week", lang)
            size = 7
        else:
            start_date = end_date - timedelta(days=30)
            title = self._translate_to_target("Monthly New Customers", lang)
            xlabel = self._translate_to_target("Day of Month", lang)
            size = 30

        try:
            plt.figure(figsize=(10, 5))
            dummy_data = pd.Series(np.random.randint(10, 50, size=size))
            plot_type = 'bar' if time_period == 'week' else 'line'
            dummy_data.plot(kind=plot_type, color='#00B14F', marker='o' if time_period == 'month' else None)
            
            plt.title(title)
            plt.xlabel(xlabel)
            plt.ylabel(self._translate_to_target("New Customers", lang))
            plt.grid(True)
            plt.tight_layout()

            buf = BytesIO()
            plt.savefig(buf, format='png')
            plt.close()
            buf.seek(0)

            total_new = dummy_data.sum()
            peak_value = dummy_data.max()
            peak_day = dummy_data.idxmax() + 1  # Day number

            return {
                'text': self._translate_to_target(f"Your {time_period}ly new customer report", lang),
                'image': base64.b64encode(buf.read()).decode('utf-8'),
                'insight': self._translate_to_target(
                    f"Total new customers: {total_new} | Peak day: {peak_day} ({peak_value} customers)", 
                    lang
                ),
                'type': 'visualization'
            }
        except Exception as e:
            print(f"Error generating customer report: {e}")
            return {'text': self._translate_to_target("Error generating report", lang), 'type': 'text'}

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        input_lang = self._detect_language(query)
        english_query = self._translate_to_english(query)

        # Handle Chinese customer queries
        if input_lang == 'zh' and any(term in query for term in ['新顾客', '新客户']):
            time_period = 'week' if '周' in query else 'month'
            return [self._generate_customer_report(time_period, 'zh')]

        # Handle English/other language customer queries
        if any(phrase in english_query.lower() for phrase in ['new customers', 'recent customers']):
            time_period = 'week' if 'week' in english_query.lower() else 'month'
            return [self._generate_customer_report(time_period, input_lang)]

        # Vector search for other queries
        query_embed = self.embedding_model.encode([english_query])
        distances, indices = self.index.search(np.array(query_embed), top_k)

        results = []
        for i, dist in zip(indices[0], distances[0]):
            try:
                answer = json.loads(self.answers[i])
                if not isinstance(answer, dict):
                    answer = {'text': str(answer), 'type': 'text'}

                results.append({
                    'text': self._translate_to_target(answer.get('text', ''), input_lang),
                    'type': answer.get('type', 'text'),
                    'insight': self._translate_to_target(answer.get('insight', ''), input_lang) if 'insight' in answer else None
                })
            except Exception as e:
                print(f"Error processing answer: {e}")
                continue

        return results if results else [{'text': self._translate_to_target("No results found", input_lang), 'type': 'text'}]

if __name__ == "__main__":
    HF_TOKEN = ""
    qa_system = BusinessQASystem(
        qa_path='data/qa_pairs.json',
        hf_token=HF_TOKEN,
        data_path='data/DimSumDelight_Full.csv'
    )

    print("🌏 SEA Business Intelligence System Ready")
    print("Supported languages: English, Chinese, Malay, Vietnamese, Thai")

    while True:
        try:
            query = input("\nAsk a question (or 'quit'): ").strip()
            if query.lower() == 'quit':
                break

            results = qa_system.search(query)
            response = results[0]

            if response['type'] == 'visualization':
                print(f"\n{response['text']}")
                print(f"💡 {response.get('insight', '')}")
                print("[Visualization would be displayed in app]")
            else:
                print(f"\n{response['text']}")

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {e}")