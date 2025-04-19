import os
import json
import numpy as np
import faiss
from pathlib import Path
from typing import Dict, List, Optional
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import torch
from langdetect import detect
from googletrans import Translator

class BaseAgent:
    def __init__(self, name: str):
        self.name = name
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')  # Multilingual model
        self.index = None
        self.responses = None
        self._initialize_knowledge_base()
        self.translator = Translator()

    def _initialize_knowledge_base(self):
        """Initialize or create knowledge base for the agent"""
        os.makedirs("vector_db", exist_ok=True)
        index_path = f"vector_db/{self.name}_faiss.index"
        responses_path = f"vector_db/{self.name}_responses.npy"
        
        if not os.path.exists(index_path) or not os.path.exists(responses_path):
            print(f"No existing knowledge base found for {self.name}. Creating new...")
            self._create_new_knowledge_base()
        else:
            try:
                self.index = faiss.read_index(index_path)
                self.responses = np.load(responses_path, allow_pickle=True)
                print(f"Loaded knowledge base for {self.name} agent")
            except Exception as e:
                print(f"Error loading knowledge base for {self.name}: {str(e)}")
                self._create_new_knowledge_base()

    def _create_new_knowledge_base(self):
        """Create a new empty knowledge base"""
        dim = self.model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatIP(dim)
        self.responses = np.array([], dtype=object)
        self._save_knowledge_base()

    def _save_knowledge_base(self):
        """Save the current knowledge base to disk"""
        faiss.write_index(self.index, f"vector_db/{self.name}_faiss.index")
        np.save(f"vector_db/{self.name}_responses.npy", self.responses)

    def add_knowledge(self, questions: List[str], answers: List[str]):
        """Add new Q&A pairs to the knowledge base"""
        if len(questions) != len(answers):
            raise ValueError("Questions and answers must be of equal length")
            
        new_embeddings = self.model.encode(questions)
        faiss.normalize_L2(new_embeddings)
        self.index.add(new_embeddings)
        self.responses = np.concatenate([self.responses, np.array(answers)])
        self._save_knowledge_base()

    def detect_language(self, text: str) -> str:
        """Detect language of input text"""
        try:
            return detect(text)
        except:
            return 'en'  # Default to English if detection fails

    def translate_to_english(self, text: str) -> str:
        """Translate non-English text to English for processing"""
        if self.detect_language(text) == 'en':
            return text
        try:
            return self.translator.translate(text, dest='en').text
        except:
            return text  # Fallback to original if translation fails

    def translate_to_target(self, text: str, target_lang: str) -> str:
        """Translate English text to target language"""
        if target_lang == 'en':
            return text
        try:
            return self.translator.translate(text, dest=target_lang).text
        except:
            return text  # Fallback to English if translation fails

    def respond(self, query: str, top_k: int = 1) -> Optional[str]:
        """Generate response to query in the same language as the query"""
        if not self.index or len(self.responses) == 0:
            return f"{self.name} agent doesn't have any knowledge yet."
            
        # Detect and process in user's language
        user_lang = self.detect_language(query)
        english_query = self.translate_to_english(query)
        
        query_embedding = self.model.encode([english_query])
        faiss.normalize_L2(query_embedding)
        
        try:
            _, indices = self.index.search(query_embedding, k=top_k)
            english_response = "\n".join([self.responses[i] for i in indices[0]])
            return self.translate_to_target(english_response, user_lang)
        except Exception as e:
            print(f"Error in search: {str(e)}")
            return None

class CustomerServiceAgent(BaseAgent):
    def __init__(self):
        super().__init__("customer_service")
    
    def respond(self, query: str) -> str:
        response = super().respond(query)
        user_lang = self.detect_language(query)
        if not response:
            no_answer = "I need more training to answer that."
            return f"🔹 Customer Service:\n{self.translate_to_target(no_answer, user_lang)}"
        return f"🔹 Customer Service:\n{response}"

class DataAnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__("data_analysis")
    
    def respond(self, query: str) -> str:
        response = super().respond(query)
        user_lang = self.detect_language(query)
        if not response:
            no_answer = "I don't have data on this yet."
            base = self.translate_to_target(no_answer, user_lang)
        else:
            base = response
        note = "I can generate SQL or pandas code if needed"
        return f"📊 Data Analysis:\n{base}\n[{self.translate_to_target(note, user_lang)}]"

class MarketingAgent(BaseAgent):
    def __init__(self):
        super().__init__("marketing")
    
    def respond(self, query: str) -> str:
        response = super().respond(query)
        user_lang = self.detect_language(query)
        if not response:
            no_answer = "No campaign data available."
            return f"📢 Marketing:\n{self.translate_to_target(no_answer, user_lang)}"
        return f"📢 Marketing:\n{response}"

class TechnicalSupportAgent(BaseAgent):
    def __init__(self):
        super().__init__("tech_support")
    
    def respond(self, query: str) -> str:
        response = super().respond(query)
        user_lang = self.detect_language(query)
        if not response:
            no_answer = "I need more technical details."
            return f"🛠️ Technical Support:\n{self.translate_to_target(no_answer, user_lang)}"
        return f"🛠️ Technical Support:\n{response}"

class FeedbackAgent(BaseAgent):
    def __init__(self):
        super().__init__("feedback")
    
    def respond(self, query: str) -> str:
        response = super().respond(query)
        user_lang = self.detect_language(query)
        if not response:
            no_answer = "No feedback analysis available."
            return f"💬 Product Feedback:\n{self.translate_to_target(no_answer, user_lang)}"
        return f"💬 Product Feedback:\n{response}"

class Router:
    def __init__(self, hf_token: str = None):
        self.agents = {
            'customer': CustomerServiceAgent(),
            'pandas': DataAnalysisAgent(),
            'campaign': MarketingAgent(),
            'support': TechnicalSupportAgent(),
            'feedback': FeedbackAgent()
        }
        
        # Initialize LLM for routing
        self.llm = self._initialize_llm(hf_token)
        self.translator = Translator()
    
    def _initialize_llm(self, hf_token: str = None):
        """Initialize the LLM with fallback options"""
        try:
            if hf_token:
                return pipeline(
                    "text-generation",
                    model="meta-llama/Meta-Llama-3-8B",
                    use_auth_token=hf_token,
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
            return pipeline("text-generation", model="gpt2")  # Fallback
        except Exception as e:
            print(f"LLM initialization error: {str(e)}")
            return None
    
    def detect_language(self, text: str) -> str:
        """Detect language of input text"""
        try:
            return detect(text)
        except:
            return 'en'  # Default to English if detection fails

    def translate_to_english(self, text: str) -> str:
        """Translate non-English text to English for processing"""
        if self.detect_language(text) == 'en':
            return text
        try:
            return self.translator.translate(text, dest='en').text
        except:
            return text  # Fallback to original if translation fails

    def route(self, question: str) -> str:
        """Route question to appropriate agent in user's language"""
        user_lang = self.detect_language(question)
        english_question = self.translate_to_english(question)
        
        if not self.llm:
            response = self._fallback_route(english_question)
        else:            
            try:
                classification = self._classify_question(english_question)
                response = self.agents[classification].respond(english_question)
            except Exception as e:
                print(f"Routing error: {str(e)}")
                response = self._fallback_response(english_question)
        
        # Translate response back to user's language
        if user_lang != 'en':
            try:
                return self.translator.translate(response, dest=user_lang).text
            except:
                return response  # Fallback to English if translation fails
        return response
    
    def _classify_question(self, question: str) -> str:
        """Classify question using LLM"""
        prompt = f"""Classify this question into one category:
        1. Customer Service - account issues, orders, payments
        2. Data/Sales Analysis - reports, metrics, analytics
        3. Marketing Campaign - promotions, ads, campaigns
        4. Technical Support - bugs, errors, technical issues
        5. Product Feedback - suggestions, reviews, complaints
        
        Respond with exactly one word: 'customer', 'pandas', 'campaign', 'support', or 'feedback'.
        
        Question: {question}
        Classification:"""
        
        result = self.llm(prompt, max_new_tokens=10)[0]['generated_text']
        return self._parse_classification(result)
    
    def _parse_classification(self, text: str) -> str:
        """Parse LLM classification output"""
        text = text.lower()
        if "pandas" in text or "data" in text or "sales" in text or "sql" in text or "analys" in text:
            return 'pandas'
        elif "campaign" in text or "market" in text or "promo" in text:
            return 'campaign'
        elif "support" in text or "technical" in text or "bug" in text or "error" in text:
            return 'support'
        elif "feedback" in text or "product" in text or "review" in text or "suggest" in text:
            return 'feedback'
        return 'customer'  # default fallback
    
    def _fallback_route(self, question: str) -> str:
        """Fallback routing without LLM"""
        question_lower = question.lower()
        if any(word in question_lower for word in ['data', 'report', 'analys', 'sql']):
            return self.agents['pandas'].respond(question)
        elif any(word in question_lower for word in ['campaign', 'market', 'promo', 'ad']):
            return self.agents['campaign'].respond(question)
        elif any(word in question_lower for word in ['bug', 'error', 'tech', 'support']):
            return self.agents['support'].respond(question)
        elif any(word in question_lower for word in ['feedback', 'review', 'suggest']):
            return self.agents['feedback'].respond(question)
        return self.agents['customer'].respond(question)
    
    def _fallback_response(self, question: str) -> str:
        """Final fallback response if everything fails"""
        return "I'm having trouble processing your request. Please try again or contact support."

def initialize_agents():
    """Initialize all agents with sample data if empty"""
    agents = [
        CustomerServiceAgent(),
        DataAnalysisAgent(),
        MarketingAgent(),
        TechnicalSupportAgent(),
        FeedbackAgent()
    ]
    
    # Add sample knowledge if agents are empty
    for agent in agents:
        if len(agent.responses) == 0:
            sample_path = f"data/{agent.name}_sample.json"
            if os.path.exists(sample_path):
                with open(sample_path) as f:
                    qa_pairs = json.load(f)
                agent.add_knowledge(
                    [q['question'] for q in qa_pairs],
                    [q['answer'] for q in qa_pairs]
                )
                print(f"Added sample knowledge to {agent.name}")

if __name__ == "__main__":
    # Install required packages if not already installed
    try:
        import langdetect
        import googletrans
    except ImportError:
        print("Installing required language packages...")
        os.system("pip install langdetect googletrans==4.0.0-rc1")
    
    # Set your Hugging Face token if using Llama
    HF_TOKEN = "="
    
    # Initialize all agents (will create knowledge bases if they don't exist)
    initialize_agents()
    
    # Create router
    router = Router(hf_token=HF_TOKEN)
    
    print("\n🌟 Multilingual Multi-Agent System Ready 🌟")
    print("Type your question in any language or 'exit' to quit\n")
    
    while True:
        try:
            query = input("You: ").strip()
            if query.lower() in ['exit', 'quit']:
                break
                
            if not query:
                continue
                
            response = router.route(query)
            print(f"\nAssistant: {response}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"System error: {str(e)}")
            continue