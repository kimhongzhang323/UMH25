import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { 
  FiAlertTriangle, 
  FiPackage, 
  FiCheckCircle,
} from 'react-icons/fi';
import PeakHoursChart from '../charts/PeakHoursChart';
import OrderVolumeChart from '../charts/OrderVolumeChart';
import jsPDF from 'jspdf';

const Dashboard = () => {
    // AI Features State
  // Function to handle PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add dashboard content to PDF
    doc.text('Dim Sum Delights Analytics Report', 10, 10);
    doc.text(`Total Sales: ${formatCurrency(dashboardData.totalSales)}`, 10, 20);
    doc.text(`Total Orders: ${dashboardData.totalOrders}`, 10, 30);
    doc.text(`Average Order Value: ${formatCurrency(dashboardData.averageOrderValue)}`, 10, 40);

    // Add top selling items
    doc.text('Top Selling Items:', 10, 50);
    dashboardData.topSellingItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}: ${item.sales} orders`, 15, 60 + (index * 10));
    });

    // Save the PDF
    doc.save('dimsum-analytics-report.pdf');
  };

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

  // AI Features State (retained for later implementation)
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
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Process CSV data
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // In a real app, you would fetch this from your backend API
        // For now, we'll use a simulated import of CSV data
        const response = await fetch('/data/DimSumDelight_Full.csv');
        const csvData = await response.text();

        // Parse CSV data
        const rows = csvData.split('\n').slice(1); // Skip header row
        const orders = [];
        const itemsMap = new Map();
        const customers = new Set();
        let totalSales = 0;

        // Process each row
        rows.forEach(row => {
          if (!row.trim()) return; // Skip empty rows

          const columns = row.split(',');
          if (columns.length < 15) return; // Skip malformed rows

          // Safely parse date with fallback
          let orderTime;
          try {
            orderTime = new Date(columns[9]);
            if (isNaN(orderTime.getTime())) {
              // If date is invalid, use current date as fallback
              orderTime = new Date();
            }
          } catch (e) {
            orderTime = new Date();
          }

          const hour = orderTime.getHours();
          let dateStr;
          try {
            dateStr = orderTime.toISOString().split('T')[0];
          } catch (e) {
            // Fallback to current date if ISO string conversion fails
            dateStr = new Date().toISOString().split('T')[0];
          }

          const itemName = columns[6] || 'Unknown Item';
          const itemPrice = parseFloat(columns[7]) || 0;
          const orderValue = parseFloat(columns[13]) || 0;
          const eaterId = columns[14] || 'unknown-customer';

          // Track unique customers
          customers.add(eaterId);

          // Track item sales
          if (itemsMap.has(itemName)) {
            const itemData = itemsMap.get(itemName);
            itemData.count++;
            itemData.totalRevenue += itemPrice;
          } else {
            itemsMap.set(itemName, {
              count: 1,
              totalRevenue: itemPrice
            });
          }

          // Add to total sales
          totalSales += orderValue;

          // Create order object
          orders.push({
            id: columns[8] || `order-${Math.random().toString(36).substr(2, 8)}`,
            customer: `Customer ${eaterId.slice(-4)}`,
            items: [itemName],
            amount: orderValue,
            status: 'delivered',
            time: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A',
            date: dateStr,
            hour: hour
          });
        });

        // Calculate peak hours
        const hourCounts = Array(24).fill(0).map((_, hour) => ({
          hour,
          orders: 0
        }));

        orders.forEach(order => {
          if (order.hour >= 0 && order.hour < 24) {
            hourCounts[order.hour].orders++;
          }
        });

        // Calculate order volume by date
        const dateCounts = {};
        orders.forEach(order => {
          if (dateCounts[order.date]) {
            dateCounts[order.date]++;
          } else {
            dateCounts[order.date] = 1;
          }
        });

        // Convert to array for chart
        const orderVolumeData = Object.keys(dateCounts)
          .map(date => ({
            date,
            orders: dateCounts[date]
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7); // Last 7 days

        // Get top selling items
        const topSellingItems = Array.from(itemsMap.entries())
          .map(([name, data]) => ({
            name,
            sales: data.count,
            revenue: data.totalRevenue
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        // Calculate average order value
        const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a, b) => {
            try {
              return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
            } catch (e) {
              return 0;
            }
          })
          .slice(0, 5);

        // Set dashboard data
        setDashboardData({
          loading: false,
          totalSales,
          totalOrders: orders.length,
          averageOrderValue,
          topSellingItems,
          uniqueCustomers: customers.size,
          peakHours: hourCounts,
          orderVolume: orderVolumeData,
          recentOrders
        });
        setSalesPredictions({
          nextWeekPrediction: 48471.25,
          confidenceLevel: 85,
          recommendedPrep: {
            inventoryIncrease: "20%",
            staffIncrease: "2 extra staff",
            timing: "Friday dinner rush"
          }
        });
        setMenuRecommendations({
          bestPerformers: ["Pork Siu Mai", "Steamed BBQ Pork Buns", "Shrimp Har Gow"],
          underperformers: ["BBQ Chicken Feet", "Century Egg Porridge"],
          suggestedCombos: [
            { items: ["Shrimp Har Gow", "Century Egg Porridge"], projectedIncrease: 15 },
            { items: ["BBQ Chicken Feet", "Mango Pudding"], projectedIncrease: 10 },
            { items: ["Pork Siu Mai", "Steamed BBQ Pork Buns"], projectedIncrease: 8 }
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
            description: "Pork Siu Mai running low (12% below optimal)",
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

        // ... rest of your AI initialization code ...
      } catch (error) {
        console.error("Error processing data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAndProcessData();
  }, []);

    // Fetch inventory data
    useEffect(() => {
      const fetchInventory = async () => {
        try {
          setLoading(true);
          // Get data from localStorage
          const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
          if (savedInventory.length === 0) {
            // If no data in localStorage, use mock data
            const mockInventory = [
              {
                id: 1,
                name: "Zinger Burger Patty",
                category: "Chicken",
                currentStock: 42,
                minStock: 50,
                unit: "pieces",
                lastDelivery: "2025-04-08",
                nextDelivery: "2025-04-15",
                usageRate: "15/day",
                status: "low"
              },
              {
                id: 2,
                name: "Original Recipe Coating",
                category: "Ingredients",
                currentStock: 25,
                minStock: 20,
                unit: "kg",
                lastDelivery: "2025-04-10",
                nextDelivery: "2025-04-17",
                usageRate: "3kg/day",
                status: "adequate"
              },
              {
                id: 3,
                name: "Potatoes",
                category: "Ingredients",
                currentStock: 120,
                minStock: 100,
                unit: "kg",
                lastDelivery: "2025-04-09",
                nextDelivery: "2025-04-16",
                usageRate: "20kg/day",
                status: "adequate"
              },
              {
                id: 4,
                name: "Coleslaw Mix",
                category: "Ingredients",
                currentStock: 8,
                minStock: 15,
                unit: "kg",
                lastDelivery: "2025-04-05",
                nextDelivery: "2025-04-12",
                usageRate: "2kg/day",
                status: "low"
              },
              {
                id: 5,
                name: "Cheese Slices",
                category: "Dairy",
                currentStock: 200,
                minStock: 150,
                unit: "pieces",
                lastDelivery: "2025-04-11",
                nextDelivery: "2025-04-18",
                usageRate: "30/day",
                status: "adequate"
              },
              {
                id: 6,
                name: "Buns",
                category: "Bakery",
                currentStock: 60,
                minStock: 80,
                unit: "dozen",
                lastDelivery: "2025-04-10",
                nextDelivery: "2025-04-17",
                usageRate: "10 dozen/day",
                status: "low"
              },
              {
                id: 7,
                name: "Pepsi Syrup",
                category: "Beverages",
                currentStock: 5,
                minStock: 5,
                unit: "liters",
                lastDelivery: "2025-04-07",
                nextDelivery: "2025-04-14",
                usageRate: "1 liter/day",
                status: "critical"
              },
              {
                id: 8,
                name: "Hot & Spicy Marinade",
                category: "Sauces",
                currentStock: 12,
                minStock: 10,
                unit: "liters",
                lastDelivery: "2025-04-09",
                nextDelivery: "2025-04-16",
                usageRate: "2 liters/day",
                status: "adequate"
              }
            ];
            setInventory(mockInventory);
            // Save mock data to localStorage for future use
            localStorage.setItem('inventory', JSON.stringify(mockInventory));
          } else {
            setInventory(savedInventory);
          }
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchInventory();
    }, []);

    // Calculate inventory summary
    const inventorySummary = {
      totalItems: inventory.length,
      lowStock: inventory.filter(item => item.status === 'low').length,
      criticalStock: inventory.filter(item => item.status === 'critical').length,
      adequateStock: inventory.filter(item => item.status === 'adequate').length
    };
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Changed from MYR to USD as currency isn't specified in CSV
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

  // Loading skeleton (unchanged)
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-8">Dim Sum Delights Analytics</h1>
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
        {/* Header - Updated title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-800">Dim Sum Delights Analytics</h1>
          <p className="text-gray-500 mt-2">AI-powered insights and trends for your restaurant</p>
        </div>

        {/* Metrics Grid - Updated with real data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
          {/* Total Sales */}
          <MetricCard
            title="Total Sales"
            value={formatCurrency(dashboardData.totalSales)}
            change="+10% predicted next week"
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
            change={`${dashboardData.uniqueCustomers} unique customers`}
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
            change="Based on recent trends"
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
            change={`${Math.round((dashboardData.uniqueCustomers / dashboardData.totalOrders) * 100)}% of orders`}
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
            <p className="text-xl font-light text-gray-900 mb-1">{dashboardData.topSellingItems[0]?.name || 'Loading...'}</p>
            <p className="text-gray-500">{dashboardData.topSellingItems[0]?.sales || 0} orders</p>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-light text-gray-800">Inventory Summary</h2>
          <a href="/inventory">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md" 
          >
           Manage Inventory
          </button>
          </a>
        </div>
        
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Items</p>
                        <p className="text-2xl font-medium">{inventorySummary.totalItems}</p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <FiPackage size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Adequate Stock</p>
                        <p className="text-2xl font-medium text-green-600">{inventorySummary.adequateStock}</p>
                      </div>
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <FiCheckCircle size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Low Stock</p>
                        <p className="text-2xl font-medium text-amber-600">{inventorySummary.lowStock}</p>
                      </div>
                      <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                        <FiAlertTriangle size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Critical Stock</p>
                        <p className="text-2xl font-medium text-red-600">{inventorySummary.criticalStock}</p>
                      </div>
                      <div className="p-2 rounded-full bg-red-100 text-red-600">
                        <FiAlertTriangle size={20} />
                      </div>
                    </div>
                  </div>
                </div>
        {/* AI Features Section - Retained for later implementation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Sales Predictions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">AI Sales Prediction</h3>
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
                Increase inventory by {salesPredictions.recommendedPrep.inventoryIncrease} and schedule {salesPredictions.recommendedPrep.staffIncrease} for {salesPredictions.recommendedPrep.timing}.
              </p>
            </div>
          </div>

          {/* AI Menu Optimizer */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">AI Menu Helper</h3>
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
              <h3 className="text-lg font-medium text-gray-800">AI Alerts</h3>
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

        {/* Charts Section - Using real data */}
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
            <p className="text-sm text-gray-500 mt-1">Recent customer orders</p>
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
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer">
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
                    <p className="text-sm text-gray-500">{item.sales} orders (${item.revenue.toFixed(2)})</p>
                  </div>
                  <div className="text-gray-800">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-light text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-5">
              <a
                href="/reports"
                className="block w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <span>View Detailed Reports</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="#"
                onClick={handleExportPDF}
                className="block w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <span>Export Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <a
                href="/inventory"
                className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <span>Manage Inventory</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button onClick={() => setChatOpen(false)} className="text-white hover:text-blue-200 ">
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

    </div>
  );
};

// Reusable metric card component
const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change && change.includes('+');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium text-gray-800 ml-2">{title}</h3>
      </div>
      <p className="text-2xl font-light text-gray-900 mb-1">{value}</p>
      {change && (
        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      )}
    </div>
  );
};

export default Dashboard;