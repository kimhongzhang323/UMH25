# KFC Analytics Dashboard with AI Merchant Features

## Overview

The Grab HEX Assistant Dashboard is a comprehensive business intelligence tool designed to help merchant owners and managers optimize operations, increase sales, and improve customer satisfaction through data-driven insights and AI-powered recommendations.

## Key Features

### 📊 Real-time Analytics
- Sales performance tracking
- Order volume trends
- Customer behavior insights
- Peak hour identification

### 🤖 AI-Powered Merchant Tools
- **Sales Forecasting**: Predicts future sales with confidence intervals
- **Menu Optimization**: Recommends best-performing items and combos
- **Anomaly Detection**: Alerts for inventory, staffing, and sales anomalies
- **Customer Insights**: Segmentation and sentiment analysis
- **AI Assistant**: Chat-based interface for business queries

### 📈 Data Visualization
- Interactive charts and graphs
- Customizable time periods
- Exportable reports

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Charts**: Custom React chart components
- **AI Integration**: Simulated AI (can connect to real AI services)
- **State Management**: React Hooks
- **Build Tool**: Vite or Create-React-App

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/UMH25.git
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to:
   ```
   http://localhost:3000
   ```

## Configuration

Create a `.env` file in the root directory with your configuration:

```env
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
# Add other environment variables as needed
```

## Connecting to Real Data Sources

To connect to actual backend services:

1. Implement API calls in `src/api.js`
2. Replace mock data in `Dashboard.js` with real API calls
3. Configure WebSocket for real-time updates

Example API integration:
```javascript
// Replace mock data fetch with real API call
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/dashboard`);
    const data = await response.json();
    setDashboardData(data);
  };
  fetchData();
}, []);
```

## AI Services Integration

To connect to real AI services:

1. **Sales Predictions**: Integrate with TensorFlow Serving or AWS Forecast
2. **Menu Optimization**: Connect to custom recommendation engines
3. **Chat Assistant**: Implement Dialogflow or custom LLM API

Example AI service call:
```javascript
const fetchAIPredictions = async () => {
  const response = await fetch(`${process.env.REACT_APP_AI_SERVICE}/predict`, {
    method: 'POST',
    body: JSON.stringify({ historicalData: dashboardData })
  });
  const predictions = await response.json();
  setSalesPredictions(predictions);
};
```

## Customization

### Theming
Modify colors in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'kfc-red': '#E4002B',
        'kfc-blue': '#005FAB',
      },
    },
  },
}
```

### Adding New Metrics
1. Create new chart components in `src/charts/`
2. Add to dashboard state
3. Create new visualization panels

## Deployment

Build for production:
```bash
npm run build
```

Deploy the `build` folder to your preferred hosting service:
- Vercel
- Netlify
- AWS S3
- Firebase Hosting

## Roadmap

- [ ] Real API integration
- [ ] Advanced AI model training
- [ ] Mobile app version
- [ ] Multi-location support
- [ ] Staff performance tracking

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Maintainer - [Your Name](mailto:your.email@example.com)

Project Link: [https://github.com/your-repo/kfc-analytics-dashboard](https://github.com/your-repo/kfc-analytics-dashboard)
