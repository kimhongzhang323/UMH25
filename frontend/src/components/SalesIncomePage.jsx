import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiShoppingBag, 
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiZap
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const SalesIncomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // State for sales data
  const [salesData, setSalesData] = useState({
    loading: true,
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topSellingItems: [],
    salesTrend: [],
    stockPrediction: [],
    grabAdPerformance: null
  });

  // State for time period filter
  const [timePeriod, setTimePeriod] = useState('week');
  const [adBudget, setAdBudget] = useState(500);
  const [showAdModal, setShowAdModal] = useState(false);

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      // Simulate API call
      setSalesData(prev => ({ ...prev, loading: true }));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data based on time period
      const mockData = {
        week: {
          totalRevenue: 12500,
          totalOrders: 385,
          avgOrderValue: 32.47,
          topSellingItems: [
            { name: "Steamed BBQ Pork Buns", sales: 142, revenue: 4615 },
            { name: "Pork Siu Mai", sales: 128, revenue: 4160 },
            { name: "Shrimp Har Gow", sales: 115, revenue: 3450 }
          ],
          salesTrend: [
            { day: "Mon", sales: 45, revenue: 1462.5 },
            { day: "Tue", sales: 52, revenue: 1690 },
            { day: "Wed", sales: 60, revenue: 1950 },
            { day: "Thu", sales: 55, revenue: 1787.5 },
            { day: "Fri", sales: 68, revenue: 2210 },
            { day: "Sat", sales: 75, revenue: 2437.5 },
            { day: "Sun", sales: 30, revenue: 975 }
          ],
          stockPrediction: [
            { item: "Dumpling Wrappers", current: 500, predicted: 1800, status: "critical" },
            { item: "Ground Pork", current: 25, predicted: 40, status: "low" },
            { item: "Shrimp", current: 30, predicted: 35, status: "adequate" }
          ],
          grabAdPerformance: {
            impressions: 1250,
            clicks: 85,
            conversions: 32,
            roi: 3.2
          }
        },
        month: {
          totalRevenue: 48750,
          totalOrders: 1500,
          avgOrderValue: 32.50,
          topSellingItems: [
            { name: "Steamed BBQ Pork Buns", sales: 550, revenue: 17875 },
            { name: "Pork Siu Mai", sales: 500, revenue: 16250 },
            { name: "Shrimp Har Gow", sales: 450, revenue: 14625 }
          ],
          salesTrend: [
            { week: "Week 1", sales: 350, revenue: 11375 },
            { week: "Week 2", sales: 375, revenue: 12187.5 },
            { week: "Week 3", sales: 400, revenue: 13000 },
            { week: "Week 4", sales: 375, revenue: 12187.5 }
          ],
          stockPrediction: [
            { item: "Dumpling Wrappers", current: 500, predicted: 2000, status: "critical" },
            { item: "Ground Pork", current: 25, predicted: 45, status: "low" },
            { item: "Shrimp", current: 30, predicted: 40, status: "adequate" }
          ],
          grabAdPerformance: {
            impressions: 5200,
            clicks: 350,
            conversions: 125,
            roi: 3.8
          }
        }
      };

      setSalesData({
        ...mockData[timePeriod],
        loading: false
      });
    };

    fetchSalesData();
  }, [timePeriod]);

  // Chart data for sales trend
  const salesTrendChart = {
    labels: salesData.salesTrend.map(item => item.day || item.week),
    datasets: [
      {
        label: 'Sales Volume',
        data: salesData.salesTrend.map(item => item.sales),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        yAxisID: 'y'
      },
      {
        label: 'Revenue (MYR)',
        data: salesData.salesTrend.map(item => item.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        type: 'line',
        yAxisID: 'y1'
      }
    ]
  };

  // Chart data for stock prediction
  const stockPredictionChart = {
    labels: salesData.stockPrediction.map(item => item.item),
    datasets: [
      {
        label: 'Current Stock',
        data: salesData.stockPrediction.map(item => item.current),
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      },
      {
        label: 'Predicted Need',
        data: salesData.stockPrediction.map(item => item.predicted),
        backgroundColor: 'rgba(245, 158, 11, 0.7)'
      }
    ]
  };

  // Handle Grab Ad campaign launch
  const launchGrabAd = () => {
    // In a real app, this would call an API
    setSalesData(prev => ({
      ...prev,
      grabAdPerformance: {
        ...prev.grabAdPerformance,
        budget: adBudget,
        estimatedImpressions: Math.floor(adBudget * 2.5),
        estimatedClicks: Math.floor(adBudget * 0.17),
        estimatedConversions: Math.floor(adBudget * 0.064)
      }
    }));
    setShowAdModal(false);
  };

  if (salesData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-8">Sales & Income Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-light text-gray-800">Sales & Income Analytics</h1>
            <p className="text-gray-500 mt-2">AI-powered insights and predictions</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/ads')} // Redirect to /ads
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiZap className="mr-2" />
              Try Grab Ads
            </button>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiDollarSign className="text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Total Revenue</h3>
            </div>
            <p className="text-2xl font-light text-gray-900 mb-1">MYR {salesData.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">+12.5% from previous {timePeriod}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiShoppingBag className="text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Total Orders</h3>
            </div>
            <p className="text-2xl font-light text-gray-900 mb-1">{salesData.totalOrders}</p>
            <p className="text-sm text-green-600">+8.2% from previous {timePeriod}</p>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiTrendingUp className="text-purple-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Avg Order Value</h3>
            </div>
            <p className="text-2xl font-light text-gray-900 mb-1">MYR {salesData.avgOrderValue.toFixed(2)}</p>
            <p className="text-sm text-green-600">+4.1% from previous {timePeriod}</p>
          </div>

          {/* Grab Ad Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiZap className="text-amber-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-800">Grab Ad ROI</h3>
            </div>
            <p className="text-2xl font-light text-gray-900 mb-1">{salesData.grabAdPerformance?.roi.toFixed(1)}x</p>
            <p className="text-sm text-gray-500">
              {salesData.grabAdPerformance?.conversions} conversions
            </p>
          </div>
        </div>
            
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-gray-800">Sales Trend</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1" />
                {timePeriod === 'week' ? 'Daily' : 'Weekly'} View
              </div>
            </div>
            <div className="h-80">
              <Line 
                data={salesTrendChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Sales Volume'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Revenue (MYR)'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Stock Prediction */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-gray-800">Stock Prediction</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FiBarChart2 className="mr-1" />
                AI Projection
              </div>
            </div>
            <div className="h-80">
              <Bar 
                data={stockPredictionChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Quantity'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-xl font-light text-gray-800 mb-6">Top Selling Items</h2>
            <div className="space-y-4">
              {salesData.topSellingItems.map((item, index) => (
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
                    <p className="text-sm text-gray-500">{item.sales} sold (MYR {item.revenue})</p>
                  </div>
                  <div className="text-gray-800">
                    {((item.sales / salesData.totalOrders) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-light text-gray-800 mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-purple-500" />
              AI Recommendations
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-1">Increase Steamed BBQ Pork Buns Stock</h4>
                <p className="text-sm text-purple-700">
                  Projected to sell {Math.round(salesData.topSellingItems[0].sales * 1.15)} next {timePeriod}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Promote Pork Siu Mai</h4>
                <p className="text-sm text-blue-700">
                  High margin item with 15% conversion potential
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Optimize Grab Ad Budget</h4>
                <p className="text-sm text-green-700">
                  Current ROI: {salesData.grabAdPerformance.roi.toFixed(1)}x
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grab Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Grab Ad Campaign</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Budget (MYR)
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={adBudget}
                  onChange={(e) => setAdBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span>MYR 100</span>
                  <span className="font-medium">MYR {adBudget}</span>
                  <span>MYR 2000</span>
                </div>
              </div>
              
              <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Estimated Results</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Impressions</p>
                    <p className="font-medium">{Math.floor(adBudget * 2.5).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Clicks</p>
                    <p className="font-medium">{Math.floor(adBudget * 0.17)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Orders</p>
                    <p className="font-medium">{Math.floor(adBudget * 0.064)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAdModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={launchGrabAd}
                  className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                >
                  Launch Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesIncomePage;