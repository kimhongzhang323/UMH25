# **Grab MEX AI Assistant**  
### *The Complete AI-Powered Merchant Growth Platform*  

---

## **Table of Contents**
1. [System Overview](#system-overview)  
2. [Key Features](#key-features)  
3. [Technology Architecture](#technology-architecture)  
4. [Installation Guide](#installation-guide)  
5. [AI Services Integration](#ai-services-integration)  
6. [Customization](#customization)  
7. [Deployment](#deployment)  
8. [Security Configuration](#security-configuration)  
9. [API Documentation](#api-documentation)  
10. [License & Contact](#license--contact)  

---

<a name="system-overview"></a>
## **1. System Overview**  
The **Grab MEX AI Assistant** is an end-to-end merchant support platform combining:  

- **Conversational AI** (Gemini 2.0 Flash + RAG Pipeline)  
- **Visual Content Generation** (Stable Diffusion XL)
- **Advanced Analytics** (DeepSeek + TimescaleDB)
- **Real-time Monitoring** (FastAPI + WebSocket)

### **Technical Stack**
- **Frontend**: React 18+, Vite, TailwindCSS, Zustand
- **Backend**: Python 3.10+, FastAPI, PostgreSQL
- **AI Models**: Gemini 2.0, Llama 2, Stable Diffusion XL, DeepSeek
- **Infrastructure**: Docker, Kubernetes-ready

### **Core Benefits**  

The **Grab MEX AI Assistant** offers a comprehensive suite of benefits tailored to empower merchants and streamline operations:  

✔ **24/7 Multilingual Business Advisory**  
  - Supports English, Bahasa, Thai, and Vietnamese for seamless communication across regions.  
  - RAG-enhanced responses for accurate local context
  - Real-time translation capabilities

✔ **Predictive Financial Insights**  
  - Leverage advanced analytics to forecast revenue and optimize financial planning.  
  - 30/60/90 day predictions with confidence intervals
  - Anomaly detection and early warning system

✔ **Real-Time Inventory and Sales Monitoring**  
  - Stay updated with live data on stock levels and sales performance.  
  - Smart reorder predictions
  - Automated stockout prevention

✔ **Customizable AI Models for Regional Business Needs**  
  - Fine-tune AI models to align with local market trends and merchant requirements.  
  - Region-specific pricing optimization
  - Local customer preference analysis

✔ **Scalable Architecture for Growing Businesses**  
  - Designed to handle increasing workloads as your business expands.  
  - Microservices-ready architecture
  - Horizontal scaling capabilities

✔ **Enhanced Data Security with On-Premise Options**  
  - Protect sensitive business data with secure, on-premise deployment options.  
  - End-to-end encryption
  - GDPR and PDPA compliant

✔ **User-Friendly Interface for Non-Technical Users**  
  - Intuitive design ensures accessibility for all users, regardless of technical expertise.  
  - Context-aware help system
  - Step-by-step guided workflows

---

<a name="key-features"></a>
## **2. Key Features**  

### **🛠️ Merchant Toolkit**  
| Feature | Description | AI Models Used |  
|---------|-------------|----------------|  
| **Smart Chat** | Natural language Q&A about sales, inventory, etc. | Gemini 2.0 Flash |  
| **Smart Inventory System** | 30/60/90 day predictions with confidence intervals | DeepSeek Finance |  
| **Menu Optimizer** | Identify best-performing items and combos | Llama 2 + DeepSeek |  
| **Marketing Assistant** | Generate promotional content and campaign ideas | Stable Diffusion + Llama 2 |  
| **Competitor Analysis** | Track and analyze nearby business performance | DeepSeek Analytics |  
| **Financial Forecaster** | Revenue predictions and expense management tools | DeepSeek Finance |  
| **Customer Insights** | Analyze feedback and identify improvement opportunities | Gemini 2.0 Flash |  

### **⚠️ Alert System**  
- Real-time notifications for:  
  - Abnormal sales patterns   
  - AI Anomaly Detection  
  - Payment delays  
  - Price fluctuations in key ingredients
  - Staff scheduling conflicts
  - Competitor promotion activities
  - Negative customer reviews
  - System maintenance windows
  - Security incidents
- Customizable alert thresholds and notification channels:
  - SMS
  - Email
  - Push notifications
  - In-app alerts
  - Telegram/WhatsApp integration
- Alert prioritization framework:
  - Critical (immediate action required)
  - Warning (attention needed)
  - Informational (for awareness)


---

<a name="technology-architecture"></a>
## **3. Technology Architecture**  

```mermaid
graph TD
    A[React Frontend] -->|HTTP| B[FastAPI Backend]
    B --> C[Llama 2 Service]
    B --> D[Stable Diffusion]
    B --> E[DeepSeek Analytics]
    B --> F[(PostgreSQL Database)]
    C --> F
    D --> G[(S3 Storage)]
    E --> F
    F --> H[TimescaleDB Extension]
```

**Component Details:**  

| Layer | Technology | Purpose |  
|-------|------------|---------|  
| **UI** | React.js + Tailwind | Dashboard and chat interface |  
| **State** | Zustand | Client-side state management |  
| **API** | FastAPI | Python backend services |  
| **AI** | See below | - |  

**AI Model Matrix:**  

| Model | Version | Deployment | Hardware Requirements |  
|-------|---------|------------|-----------------------|  
| Gemini | 2.0 Flash | GCP API | None (Cloud API) |
| Llama 2 | 7B Chat | Local/Cloud | 16GB VRAM for FP16 |
| Stable Diffusion | XL 1.0 | Local/Cloud | 12GB VRAM for FP16 |
| DeepSeek | Finance/Analytics | Local/Cloud | 8GB VRAM for FP16 |

**System Requirements:**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 16GB | 32GB+ |
| GPU | NVIDIA with 8GB VRAM | NVIDIA RTX 3080+ |
| Storage | 100GB SSD | 500GB NVMe SSD |
| Network | 100Mbps | 1Gbps |

**Database Schema:**

- **PostgreSQL + TimescaleDB**
  - Time-series data for analytics
  - Real-time metrics tracking
  - Historical performance analysis

- **Vector Store (FAISS)**
  - Document embeddings
  - Semantic search
  - RAG context storage

**API Endpoints:**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/chat` | POST | Chat completion with RAG |
| `/api/sd` | POST | Image generation |
| `/api/analytics` | GET | Business metrics |
| `/api/inventory` | GET/POST | Inventory management |

---

<a name="installation-guide"></a>
## **4. Installation Guide**  

### **Prerequisites**  
- Node.js v18+  
- Python 3.10+  
- NVIDIA GPU (for local AI models)
- Docker (optional, for containerized deployment)
- PostgreSQL 14+ with TimescaleDB extension
- Redis (for caching and session management)

### **Setup Process**  

**1. Clone Repository**  
```bash
git clone https://github.com/kimhongzhang323/UMH25.git
cd UMH25
```

**2. Configure Environment**  
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

**Sample .env Configuration:**  
```ini
# Frontend
VITE_HF_API_KEY=your_huggingface_key
VITE_API_BASE=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key

# Backend
HF_TOKEN=your_huggingface_key
API_KEY=your_genai_api
DATABASE_URL=postgresql://user:password@localhost:5432/mexdb
REDIS_URL=redis://localhost:6379
```

**3. Database Setup**
```bash
# Install TimescaleDB extension
psql -U postgres -d mexdb -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"

# Run migrations
cd backend
alembic upgrade head
```

**4. Install Dependencies**  
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

**5. Setup AI Models**
```bash
# Download and configure models (if running locally)
python setup_models.py --models llama2,sd,deepseek

# Or use cloud APIs (recommended for production)
# Configure in .env file
```

**6. Run Development Servers**  
```bash
# Terminal 1 (Backend)
uvicorn main:app --reload --workers 4

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

**7. Verify Installation**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs
- Database: psql -U postgres -d mexdb
- Redis: redis-cli ping

---

<a name="ai-services-integration"></a>
## **5. AI Services Integration**  

### **A. Gemini 2.0 Flash Chat Implementation**  

**Frontend (React):**  
```javascript
// src/services/llamaService.js
export const queryLlama = async (messages) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/llama`, {
    method: "POST",
    body: JSON.stringify({ messages })
  });
  return response.json();
};
```

**Backend (FastAPI):**  
```python
# backend/llama_router.py
@router.post("/llama")
async def chat_endpoint(request: Request):
    data = await request.json()
    inputs = tokenizer.apply_chat_template(
        data["messages"],
        return_tensors="pt"
    ).to("cuda")
    
    outputs = model.generate(inputs, max_new_tokens=256)
    return {"response": tokenizer.decode(outputs[0])}
```

### **B. Stable Diffusion Image Generation**  

**Frontend Component:**  
```javascript
// src/components/SDGenerator.jsx
const generateImage = async () => {
  const imgUrl = await fetch(`${import.meta.env.VITE_API_BASE}/sd`, {
    method: "POST",
    body: JSON.stringify({ prompt })
  }).then(r => r.blob());
  
  setGeneratedImage(URL.createObjectURL(imgUrl));
};
```

**Backend Handler:**  
```python
# backend/sd_router.py
from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

@router.post("/sd")
async def generate_image(prompt: str):
    image = pipe(prompt).images[0]
    return StreamingResponse(image, media_type="image/png")
```

### **C. DeepSeek Financial Analysis**  

**Backend Service:**  
```python
# backend/deepseek_service.py
class FinancialAnalyzer:
    def __init__(self):
        self.model = load_deepseek_model()
    
    def forecast(self, history):
        return self.model.predict(
            query="30_day_forecast",
            data=history
        )
```

---

<a name="customization"></a>
## **6. Customization**  

### **A. Theming**  
**1. Brand Colors**  
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'grab-green': '#00B14F',
        'grab-dark': '#003D2A'
      }
    }
  }
}
```  

**2. Localization**  
```json
// src/locales/id.json
{
  "salesDashboard": "Dasbor Penjualan",
  "inventoryAlerts": "Peringatan Inventaris"
}
```  

### **B. Model Fine-Tuning**  
**Llama 2 for SEA Merchant Lingo:**  
```bash
python -m llama_finetuning \
    --base_model meta-llama/Llama-2-7b-chat-hf \
    --dataset ./data/merchant_chats.json
```  

---

<a name="deployment"></a>
## **7. Deployment**  

### **Production Build**  
```bash
# Frontend
npm run build

# Backend
docker build -t mex-ai-backend .
```  

### **Infrastructure Setup**

**1. Docker Deployment**
```dockerfile
# Production-ready Dockerfile included
# Build with GPU support:
docker build -t mex-ai-backend:gpu -f Dockerfile.gpu .

# Build CPU-only version:
docker build -t mex-ai-backend:cpu -f Dockerfile.cpu .
```

**2. Kubernetes Configuration**
```yaml
# Sample deployment for high availability
replicas: 3
resources:
  requests:
    cpu: 2
    memory: 8Gi
    nvidia.com/gpu: 1
  limits:
    cpu: 4
    memory: 16Gi
    nvidia.com/gpu: 1
```

**3. Load Balancing**
- NGINX Ingress Controller
- SSL/TLS termination
- WebSocket support for real-time features

**4. Monitoring Stack**
- Prometheus for metrics
- Grafana dashboards
- ELK Stack for logs
- New Relic APM (optional)

**5. Backup Strategy**
- PostgreSQL streaming replication
- Daily automated backups
- Point-in-time recovery
- Multi-region failover

**6. CI/CD Pipeline**
```yaml
stages:
  - test
  - build
  - deploy
  - monitor
```

**7. Production Checklist**
- [ ] SSL/TLS certificates
- [ ] Database backups
- [ ] Rate limiting
- [ ] API authentication
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Auto-scaling rules
- [ ] Security scanning

---

<a name="security-configuration"></a>
## **8. Security Configuration**

**1. Authentication**
```ini
# Supabase Auth Configuration
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Security
API_KEY_HEADER=X-API-Key
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60
```

**2. Data Protection**
- End-to-end encryption for sensitive data
- Data masking for PII
- Regular security audits
- Compliance with GDPR and PDPA

**3. Error Handling**
```javascript
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { /* Additional error context */ }
  }
}
```

---

<a name="api-documentation"></a>
## **9. API Documentation**

**Authentication Endpoints:**
```http
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
```

**Chat Endpoints:**
```http
POST /api/chat
GET /api/chat/history
DELETE /api/chat/{chatId}
```

**Analytics Endpoints:**
```http
GET /api/analytics/sales
GET /api/analytics/inventory
GET /api/analytics/customers
```

For additional technical documentation, please refer to the [Wiki](https://github.com/kimhongzhang323/UMH25/wiki).

---

<a name="license--contact"></a>
## **10. License & Contact**  
**License:** MIT  
**Contact:** kim.hong.zhang323@gmail.com  
**Repository:** [github.com/kimhongzhang323/UMH25](https://github.com/kimhongzhang323/UMH25)  

---

### **🚀 Revolutionizing Merchant Success Through Open AI**  

This documentation now provides:  
1. **End-to-end technical specifications**  
2. **Complete implementation examples**  
3. **Production-grade deployment guidance**  
4. **Maintainable architecture patterns**  

For additional support, please file an issue in the GitHub repository.
