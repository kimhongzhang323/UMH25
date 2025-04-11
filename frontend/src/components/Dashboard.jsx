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
    orderVolume: []
  });

  // Mock API fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in a real app, this would come from an API
      const mockData = {
        totalSales: 12500,
        totalOrders: 385,
        averageOrderValue: 32.47,
        topSellingItems: [
          { name: "Fried Spring Rolls", sales: 142 },
          { name: "Fried Rice", sales: 128 },
          { name: "Nasi Lemak", sales: 115 },
          { name: "Chicken Satay", sales: 98 },
          { name: "Mee Goreng", sales: 87 }
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
        ]
      };

      setDashboardData({
        ...mockData,
        loading: false
      });
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Loading skeleton
  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-8">Merchant Analytics</h1>
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
          <h1 className="text-3xl font-light text-gray-800">Merchant Analytics</h1>
          <p className="text-gray-500 mt-2">Insights and trends for your business</p>
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