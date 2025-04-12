# **Grab MEX AI Assistant**  
### *Empowering Southeast Asian Merchants with AI-Driven Economic Growth*  

---

## **Overview**  
The **Grab MEX AI Assistant** is an intelligent, chat-based business advisor designed to help merchants across Southeast Asia optimize their operations, increase sales, and make data-driven decisions. Leveraging **Generative AI**, it provides **real-time insights, personalized recommendations, and automated alerts**—helping merchants scale their businesses efficiently.  

Built with **React.js, Tailwind CSS, and AI-powered analytics**, this dashboard integrates seamlessly with Grab’s merchant ecosystem, offering:  
✅ **Automated Sales & Inventory Reports**  
✅ **AI-Powered Business Recommendations**  
✅ **Multilingual & Colloquial Support**  
✅ **Anomaly Detection & Proactive Alerts**  

---

## **Key Features**  

### **📊 Real-Time Business Insights**  
- **Sales Performance Tracking** – Monitor daily/weekly revenue trends  
- **Peak Hour Analysis** – Identify best times for promotions  
- **Customer Behavior Insights** – Understand buying patterns  
- **Inventory Alerts** – Prevent stockouts or overstocking  

### **🤖 AI-Powered Merchant Guidance**  
- **Personalized Recommendations** – Tailored to business type (F&B, Retail, Services)  
- **Menu Optimization** – AI suggests best-performing items & combos  
- **Competitive Benchmarking** – Compare performance with similar merchants  
- **Sales Forecasting** – Predict future demand with confidence intervals  

### **💬 Intuitive Chat Interface**  
- **Natural Language Queries** – Ask questions like:  
  - *"Why did my sales drop yesterday?"*  
  - *"What’s the best promo to run this weekend?"*  
- **Multilingual Support** – Works in English, Bahasa, Thai, Vietnamese, and more  
- **Visual Summaries** – Charts & graphs for easy understanding  

### **⚠️ Anomaly Detection & Alerts**  
- **Unusual Sales Dips** – Get notified of sudden changes  
- **Low Inventory Warnings** – Avoid stockouts before they happen  
- **Staffing Recommendations** – Optimize shifts based on demand  

---

## **Technology Stack**  
| Category       | Technology |
|---------------|------------|
| **Frontend**  | React.js, Tailwind CSS |
| **Charts**    | Recharts, Chart.js |
| **AI**        | OpenAI API (or custom LLM) |
| **State Mgmt**| React Hooks, Zustand |
| **Backend** (Simulated) | Mock Service Worker (MSW) |
| **Build Tool**| Vite |

---

## **Installation & Setup**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/grab-tech/mex-ai-assistant.git
cd mex-ai-assistant
```

### **2. Install Dependencies**  
```bash
npm install
```

### **3. Configure Environment Variables**  
Create a `.env` file:  
```env
VITE_OPENAI_API_KEY=your_api_key_here  # For real AI integration
VITE_API_BASE_URL=http://localhost:3000/api
```

### **4. Run the Development Server**  
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view the dashboard.  

---

## **Data Integration (Real vs. Mock)**  
### **Option 1: Mock Data (Default)**  
- Uses **simulated merchant transactions** (`src/mock/data.json`)  
- No backend required  

### **Option 2: Connect to Real APIs**  
Replace mock API calls in `src/api/merchantService.js`:  
```javascript
// Real API Example
export const fetchSalesData = async (merchantId) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sales/${merchantId}`);
  return response.json();
};
```

---

## **AI Service Integration**  
To enable **real AI insights**, configure:  

### **1. OpenAI (GPT-4) for Chat & Recommendations**  
```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const getAISuggestion = async (query) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: query }],
  });
  return response.choices[0].message.content;
};
```

### **2. Custom AI Models (Optional)**  
- **Sales Forecasting** → TensorFlow.js / AWS Forecast  
- **Inventory Optimization** → Python backend (Flask/FastAPI)  

---

## **Customization**  
### **1. Theming (KFC/Grab Branding)**  
Modify `tailwind.config.js`:  
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#00B14F", // Grab Green
        secondary: "#FFC72C", // KFC Yellow
      },
    },
  },
};
```

### **2. Adding New Metrics**  
1. **Create a new chart component** (`src/components/charts/NewMetric.jsx`)  
2. **Add to dashboard state** (`src/store/dashboardStore.js`)  
3. **Embed in the UI**  

---

## **Deployment**  
### **1. Build for Production**  
```bash
npm run build
```

### **2. Deploy to**  
- **Vercel** (`vercel deploy`)  
- **AWS S3** (Static Hosting)  
- **Firebase Hosting**  

---

## **Roadmap**  
- [ ] **Multilingual Chat Expansion** (Thai, Vietnamese, Bahasa)  
- [ ] **WhatsApp/Telegram Integration**  
- [ ] **Voice Assistant (for hands-free use)**  
- [ ] **Advanced Predictive Analytics**  

---

## **Why This Matters**  
✅ **Economic Empowerment** – Helps small merchants compete like big businesses  
✅ **AI for Good** – Democratizes access to advanced analytics  
✅ **Scalable Across SEA** – Works for Grab’s diverse merchant base  

---

## **License**  
MIT License. See **[LICENSE](LICENSE)** for details.  

## **Contact**  
- **Grab Tech Team** → tech-innovation@grab.com  
- **GitHub Repo** → [github.com/grab-tech/mex-ai-assistant](https://github.com/grab-tech/mex-ai-assistant)  

---

### **🚀 Let’s Build the Future of Merchant Growth with AI!**
