import React, { useState, useEffect } from 'react';
import PeakHoursChart from '../charts/PeakHoursChart';
import OrderVolumeChart from '../charts/OrderVolumeChart';

const Dashboard = () => {
  // State for all dashboard data
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    uniqueCustomers: 0,
    peakHours: [],
    orderVolume: [],
    recentOrders: []
  });

  // AI Features State
  const [salesPredictions, setSalesPredictions] = useState({
    nextWeekPrediction: 0,
    confidenceLevel: 0,
    recommendedPrep: {}
  });

  const [menuRecommendations, setMenuRecommendations] = useState({
    bestPerformers: [],
    underperformers: [],
    suggestedCombos: []
  });

  const [customerInsights, setCustomerInsights] = useState({
    customerSegments: [],
    popularTimes: [],
    sentimentAnalysis: {}
  });

  const [anomalies, setAnomalies] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Mock API fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API loading
      // await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockData = {
        totalSales: 12500,
        totalOrders: 385,
        averageOrderValue: 32.47,
        topSellingItems: [
          { name: "Zinger Burger", sales: 142 },
          { name: "Hot & Spicy Chicken", sales: 128 },
          { name: "Popcorn Chicken", sales: 115 },
          { name: "Twister Wrap", sales: 98 },
          { name: "Cheese Fries", sales: 87 }
        ],
        uniqueCustomers: 243,
        peakHours: [
          { "hour": 0, "orders": 5 }, { "hour": 1, "orders": 2 }, { "hour": 2, "orders": 1 },
          { "hour": 3, "orders": 0 }, { "hour": 4, "orders": 0 }, { "hour": 5, "orders": 3 },
          { "hour": 6, "orders": 8 }, { "hour": 7, "orders": 15 }, { "hour": 8, "orders": 25 },
          { "hour": 9, "orders": 30 }, { "hour": 10, "orders": 40 }, { "hour": 11, "orders": 55 },
          { "hour": 12, "orders": 70 }, { "hour": 13, "orders": 65 }, { "hour": 14, "orders": 50 },
          { "hour": 15, "orders": 45 }, { "hour": 16, "orders": 40 }, { "hour": 17, "orders": 42 },
          { "hour": 18, "orders": 55 }, { "hour": 19, "orders": 60 }, { "hour": 20, "orders": 45 },
          { "hour": 21, "orders": 30 }, { "hour": 22, "orders": 20 }, { "hour": 23, "orders": 10 }
        ],
        orderVolume: [
          { "date": "2025-04-03", "orders": 45 },
          { "date": "2025-04-04", "orders": 52 },
          { "date": "2025-04-05", "orders": 60 },
          { "date": "2025-04-06", "orders": 55 },
          { "date": "2025-04-07", "orders": 68 },
          { "date": "2025-04-08", "orders": 75 },
          { "date": "2025-04-09", "orders": 30 }
        ],
        recentOrders: [
          {
            id: "ORD-385",
            customer: "Ahmad bin Ali",
            items: ["Zinger Burger", "Fries", "Pepsi"],
            amount: 18.90,
            status: "preparing",
            time: "2 min ago"
          },
          {
            id: "ORD-384",
            customer: "Siti Nurhaliza",
            items: ["Twister Wrap", "Coleslaw"],
            amount: 12.50,
            status: "preparing",
            time: "5 min ago"
          },
          {
            id: "ORD-383",
            customer: "Rajesh Kumar",
            items: ["3pc Chicken Meal", "Mashed Potato"],
            amount: 24.90,
            status: "ready",
            time: "8 min ago"
          },
          {
            id: "ORD-382",
            customer: "Jennifer Lim",
            items: ["Popcorn Chicken (Large)", "Cheese Fries"],
            amount: 16.80,
            status: "delivered",
            time: "12 min ago"
          },
          {
            id: "ORD-381",
            customer: "Mohd Faris",
            items: ["Zinger Stacker Box", "Cola"],
            amount: 22.50,
            status: "delivered",
            time: "15 min ago"
          }
        ]
      };

      setDashboardData({
        ...mockData,
        loading: false
      });

      // Initialize AI data
      setSalesPredictions({
        nextWeekPrediction: 14250,
        confidenceLevel: 85,
        recommendedPrep: {
          inventoryIncrease: "20%",
          staffIncrease: "2 extra staff",
          timing: "Friday dinner rush"
        }
      });

      setMenuRecommendations({
        bestPerformers: ["Zinger Burger", "Hot & Spicy Chicken", "Popcorn Chicken"],
        underperformers: ["Coleslaw", "Mashed Potato", "Corn on the Cob"],
        suggestedCombos: [
          { items: ["Zinger Burger", "Fries", "Pepsi"], projectedIncrease: 15 },
          { items: ["Popcorn Chicken", "Cheese Fries"], projectedIncrease: 10 },
          { items: ["Twister Wrap", "Coleslaw", "Pepsi"], projectedIncrease: 8 }
        ]
      });

      setCustomerInsights({
        customerSegments: [
          { type: "Young Adults", percentage: 45 },
          { type: "Families", percentage: 30 },
          { type: "Professionals", percentage: 25 }
        ],
        popularTimes: [
          { period: "12:00-14:00", percentage: 35 },
          { period: "18:00-20:00", percentage: 40 },
          { period: "20:00-22:00", percentage: 25 }
        ],
        sentimentAnalysis: {
          positive: 78,
          neutral: 18,
          negative: 4
        }
      });

      setAnomalies([
        {
          type: "Inventory Shortage",
          description: "Zinger Burger patties running low (12% below optimal)",
          severity: "High",
          time: "10:30 AM"
        },
        {
          type: "Staffing Alert",
          description: "Predicted understaffing during Friday dinner rush",
          severity: "Medium",
          time: "Yesterday"
        }
      ]);
    };

    fetchDashboardData();
  }, []);

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    const socket = {
      onmessage: null,
      send: () => {},
      close: () => {}
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newOrder = generateMockOrder(dashboardData.totalOrders + 1);
        
        setDashboardData(prev => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          totalSales: prev.totalSales + newOrder.amount,
          averageOrderValue: ((prev.totalSales + newOrder.amount) / (prev.totalOrders + 1)),
          recentOrders: [newOrder, ...prev.recentOrders.slice(0, 9)]
        }));
      }
    }, 10000);

    // Update AI predictions periodically
    const aiUpdateInterval = setInterval(() => {
      setSalesPredictions(prev => ({
        ...prev,
        nextWeekPrediction: prev.nextWeekPrediction * (0.98 + Math.random() * 0.04),
        confidenceLevel: Math.min(95, Math.max(75, prev.confidenceLevel + (Math.random() * 10 - 5)))
      }));
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(aiUpdateInterval);
      socket.close();
    };
  }, [dashboardData.totalOrders, dashboardData.totalSales]);

  // Generate a mock order
  const generateMockOrder = (orderNumber) => {
    const menuItems = [
      { name: "Zinger Burger", price: 8.90 },
      { name: "Twister Wrap", price: 7.50 },
      { name: "Popcorn Chicken", price: 6.80 },
      { name: "3pc Chicken Meal", price: 15.90 },
      { name: "Cheese Fries", price: 5.50 },
      { name: "Coleslaw", price: 3.50 },
      { name: "Pepsi", price: 3.00 },
      { name: "Zinger Stacker Box", price: 14.50 }
    ];
    
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let i = 0; i < itemCount; i++) {
      const item = menuItems[Math.floor(Math.random() * menuItems.length)];
      items.push(item.name);
      total += item.price;
    }
    
    const customers = ["Ahmad", "Siti", "Rajesh", "Jennifer", "Faris", "Wei Jian", "Amir", "Nurul", "James", "Priya"];
    const statuses = ["preparing", "ready", "delivered"];
    
    return {
      id: `ORD-${orderNumber}`,
      customer: `${customers[Math.floor(Math.random() * customers.length)]} ${Math.random() > 0.5 ? "bin" : "binti"} ${customers[Math.floor(Math.random() * customers.length)]}`,
      items,
      amount: parseFloat(total.toFixed(2)),
      status: statuses[Math.floor(Math.random() * 2)],
      time: "just now"
    };
  };

  // Get AI response for chat
  const getAIResponse = (question) => {
    const responses = {
      "sales": "Current sales trends show a 12% increase week-over-week, with peak hours between 12-2pm and 6-8pm.",
      "inventory": "Inventory levels are optimal except for Zinger Burger patties which are 12% below recommended levels.",
      "staff": "Based on predicted order volume, I recommend scheduling 2 additional staff members for Friday dinner service.",
      "menu": "Our top performing items are Zinger Burger and Hot & Spicy Chicken. Consider promoting these more.",
      "default": "I can help you analyze sales trends, inventory levels, staffing needs, and menu performance. What would you like to know?"
    };

    question = question.toLowerCase();
    if (question.includes("sales")) return responses.sales;
    if (question.includes("invent")) return responses.inventory;
    if (question.includes("staff")) return responses.staff;
    if (question.includes("menu")) return responses.menu;
    return responses.default;
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading skeleton
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-8">KFC Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-32 animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 h-96 animate-pulse"></div>
            <div className="bg-white rounded-lg shadow-sm p-6 h-96 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-800">KFC Analytics</h1>
          <p className="text-gray-500 mt-2">AI-powered insights and trends for your KFC restaurant</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
          {/* Total Sales */}
          <MetricCard 
            title="Total Sales" 
            value={formatCurrency(dashboardData.totalSales)} 
            change="+12.5% from last week" 
            icon={
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Total Orders */}
          <MetricCard 
            title="Total Orders" 
            value={dashboardData.totalOrders} 
            change="+8.2% from last week" 
            icon={
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          {/* Average Order Value */}
          <MetricCard 
            title="Avg. Order Value" 
            value={formatCurrency(dashboardData.averageOrderValue)} 
            change="+4.1% from last week" 
            icon={
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Unique Customers */}
          <MetricCard 
            title="Unique Customers" 
            value={dashboardData.uniqueCustomers} 
            change="+15.3% from last week" 
            icon={
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />

          {/* Top Selling Item */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">Top Seller</h3>
            </div>
            <p className="text-xl font-light text-gray-900 mb-1">{dashboardData.topSellingItems[0].name}</p>
            <p className="text-gray-500">{dashboardData.topSellingItems[0].sales} orders this week</p>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Sales Predictions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">AI Sales Forecast</h3>
            </div>
            <p className="text-xl font-light text-gray-900 mb-2">
              Predicted sales next week: {formatCurrency(salesPredictions.nextWeekPrediction)}
            </p>
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{width: `${salesPredictions.confidenceLevel}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Confidence level: {salesPredictions.confidenceLevel}%
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">AI Recommendation</h4>
              <p className="text-sm text-purple-700">
                Increase inventory of Zinger Burgers by {salesPredictions.recommendedPrep.inventoryIncrease} and schedule {salesPredictions.recommendedPrep.staffIncrease} for {salesPredictions.recommendedPrep.timing}.
              </p>
            </div>
          </div>

          {/* AI Menu Optimizer */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">AI Menu Optimizer</h3>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Top Performers</h4>
              <div className="flex flex-wrap gap-2">
                {menuRecommendations.bestPerformers.map(item => (
                  <span key={item} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Underperformers</h4>
              <div className="flex flex-wrap gap-2">
                {menuRecommendations.underperformers.map(item => (
                  <span key={item} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Suggested Combos</h4>
              <ul className="space-y-2">
                {menuRecommendations.suggestedCombos.map((combo, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2 text-blue-500">✓</span>
                    <span>{combo.items.join(" + ")}</span>
                    <span className="ml-auto text-sm text-gray-500">+{combo.projectedIncrease}% sales</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Anomaly Detector */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">AI Anomaly Detection</h3>
            </div>
            
            {anomalies.length > 0 ? (
              <div className="space-y-3">
                {anomalies.map((anomaly, i) => (
                  <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-red-800">{anomaly.type}</h4>
                        <p className="text-sm text-red-600">{anomaly.description}</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {anomaly.severity}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Detected at {anomaly.time}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No anomalies detected in the last 24 hours</p>
              </div>
            )}
          </div>
        </div>
            
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Volume Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-gray-800">Order Volume Trend</h2>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last quarter</option>
              </select>
            </div>
            <div className="h-80">
              <OrderVolumeChart data={dashboardData.orderVolume} />
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-gray-800">Peak Order Hours</h2>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This week</option>
                <option>Last week</option>
                <option>Last month</option>
              </select>
            </div>
            <div className="h-80">
              <PeakHoursChart data={dashboardData.peakHours} />
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-light text-gray-800">AI Customer Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Customer Segments</h3>
              <div className="grid grid-cols-3 gap-2">
                {customerInsights.customerSegments.map(segment => (
                  <div key={segment.type} className="p-2 bg-blue-50 rounded-lg text-center">
                    <p className="font-medium text-blue-800">{segment.percentage}%</p>
                    <p className="text-xs text-blue-600">{segment.type}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Customer Sentiment</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{width: `${customerInsights.sentimentAnalysis.positive}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {customerInsights.sentimentAnalysis.positive}% Positive
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{width: `${customerInsights.sentimentAnalysis.neutral}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {customerInsights.sentimentAnalysis.neutral}% Neutral
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{width: `${customerInsights.sentimentAnalysis.negative}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {customerInsights.sentimentAnalysis.negative}% Negative
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Popular Visit Times</h3>
              <ul className="space-y-2">
                {customerInsights.popularTimes.map((time, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{time.period}</span>
                    <span className="font-medium">{time.percentage}% of customers</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Realtime Orders Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-light text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Real-time updates of incoming orders</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {order.items.map((item, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                  <span className="font-medium">{dashboardData.recentOrders.length}</span> orders
                </p>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all orders →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-xl font-light text-gray-800 mb-6">Top Selling Items</h2>
            <div className="space-y-4">
              {dashboardData.topSellingItems.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    index === 0 ? 'bg-red-100 text-red-600' : 
                    index === 1 ? 'bg-blue-100 text-blue-600' : 
                    index === 2 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sales} orders</p>
                  </div>
                  <div className="text-gray-800">
                    {formatCurrency(item.sales * dashboardData.averageOrderValue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-light text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <span>View Detailed Reports</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <span>Export Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <span>Manage Inventory</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-medium">HEX Assistant</h3>
            <button onClick={() => setChatOpen(false)} className="text-white hover:text-blue-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3 h-64 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.sender === 'AI' ? 'text-left' : 'text-right'}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'AI' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <form onSubmit={(e) => {
              e.preventDefault();
              setChatMessages([...chatMessages, {sender: 'User', text: userInput}]);
              setTimeout(() => {
                setChatMessages(prev => [...prev, {sender: 'AI', text: getAIResponse(userInput)}]);
              }, 1000);
              setUserInput('');
            }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about sales, inventory, or trends..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>
      )}

      {/* Floating chat button */}
      <button 
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

// Reusable metric card component
const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change.includes('+');
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium text-gray-800 ml-2">{title}</h3>
      </div>
      <p className="text-2xl font-light text-gray-900 mb-1">{value}</p>
      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};

export default Dashboard;