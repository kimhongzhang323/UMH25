import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    loading: true,
    salesData: [],
    topItems: [],
    customerData: [],
    timeData: []
  });

  const navigate = useNavigate();

  // Simulate data loading
  useEffect(() => {
    const fetchReportData = async () => {
      // In a real app, you would fetch this from your API
      setTimeout(() => {
        setReportData({
          loading: false,
          salesData: [
            { name: 'Mon', sales: 12 },
            { name: 'Tue', sales: 19 },
            { name: 'Wed', sales: 15 },
            { name: 'Thu', sales: 24 },
            { name: 'Fri', sales: 32 },
            { name: 'Sat', sales: 28 },
            { name: 'Sun', sales: 18 }
          ],
          topItems: [
            { name: 'Steamed BBQ Pork Buns', orders: 142, revenue: 674.50 },
            { name: 'Pork Siu Mai', orders: 128, revenue: 640.00 },
            { name: 'Mango Pudding', orders: 115, revenue: 402.50 },
            { name: 'Shrimp Dumplings', orders: 98, revenue: 539.00 },
            { name: 'Egg Tarts', orders: 87, revenue: 304.50 }
          ],
          customerData: [
            { name: 'Returning', value: 65 },
            { name: 'New', value: 35 }
          ],
          timeData: [
            { time: '11:00-13:00', orders: 45 },
            { time: '13:00-15:00', orders: 32 },
            { time: '15:00-17:00', orders: 18 },
            { time: '17:00-19:00', orders: 52 },
            { time: '19:00-21:00', orders: 38 }
          ]
        });
      }, 800);
    };

    fetchReportData();
  }, []);

  if (reportData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Loading Reports...</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detailed Analytics Reports</h1>
            <p className="text-gray-500 mt-2">Comprehensive insights for Dim Sum Delights</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weekly Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#4f46e5" name="Daily Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grid of other reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Top Selling Items</h2>
            <div className="space-y-4">
              {reportData.topItems.map((item, index) => (
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
                    <p className="text-sm text-gray-500">{item.orders} orders (${item.revenue.toFixed(2)})</p>
                  </div>
                  <div className="text-gray-800 font-medium">
                    ${(item.revenue / item.orders).toFixed(2)} avg
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segmentation */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Segmentation</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" name="Percentage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Busy Times Report */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Peak Order Times</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#f59e0b" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;