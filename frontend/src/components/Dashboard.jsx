import React from 'react'
import PeakHoursChart from '../charts/PeakHoursChart'
import OrderVolumeChart from '../charts/OrderVolumeChart'


//  Things needed:
//  - Total sales this week (transaction_data.csv)
//  - Best-selling items (keywords.csv, items.csv)
//  - Order volume trend (chart showing orders over time)  (transaction_data.csv)
//  - Peak hours (what time of the day does merchant sell the most - can present in a chart) (transaction_data.csv)
//  - Extra insights: inventory levels (?), leaderboard by revenue (?), unique customers in last week


//  hardcode data for now
const peakHoursData = [
  { "hour": 0, "orders": 5 }, { "hour": 1, "orders": 2 }, { "hour": 2, "orders": 1 },
  { "hour": 3, "orders": 0 }, { "hour": 4, "orders": 0 }, { "hour": 5, "orders": 3 },
  { "hour": 6, "orders": 8 }, { "hour": 7, "orders": 15 }, { "hour": 8, "orders": 25 },
  { "hour": 9, "orders": 30 }, { "hour": 10, "orders": 40 }, { "hour": 11, "orders": 55 },
  { "hour": 12, "orders": 70 }, { "hour": 13, "orders": 65 }, { "hour": 14, "orders": 50 },
  { "hour": 15, "orders": 45 }, { "hour": 16, "orders": 40 }, { "hour": 17, "orders": 42 },
  { "hour": 18, "orders": 55 }, { "hour": 19, "orders": 60 }, { "hour": 20, "orders": 45 },
  { "hour": 21, "orders": 30 }, { "hour": 22, "orders": 20 }, { "hour": 23, "orders": 10 }
]

//  hardcode data for now
const orderVolumeData = [
  { "date": "2025-04-03", "orders": 45 },
  { "date": "2025-04-04", "orders": 52 },
  { "date": "2025-04-05", "orders": 60 },
  { "date": "2025-04-06", "orders": 55 },
  { "date": "2025-04-07", "orders": 68 },
  { "date": "2025-04-08", "orders": 75 },
  { "date": "2025-04-09", "orders": 30 }
]

//  hardcode orders data for now
const ordersData = [
  { "orderTime": "2023-07-05", "orderValue": 10.46, "eaterId": 1 },
  { "orderTime": "2023-07-06", "orderValue": 10.46, "eaterId": 2 },
  { "orderTime": "2023-07-09", "orderValue": 6.46, "eaterId": 3 },
  { "orderTime": "2023-07-05", "orderValue": 20.46, "eaterId": 1 },
  { "orderTime": "2023-07-07", "orderValue": 60.4, "eaterId": 2 },
  { "orderTime": "2023-07-06", "orderValue": 40.00, "eaterId": 4 },
  { "orderTime": "2023-07-06", "orderValue": 50.46, "eaterId": 4 },
  { "orderTime": "2023-07-05", "orderValue": 17.6, "eaterId": 1 },
]

function Dashboard() {
  function calculateTotalOrders() {
    return orderVolumeData.reduce((total, order) => total + order.orders, 0)
  }

  function calculateAverageOrderValue() {
    const totalRevenue = 12500;
    return (totalRevenue / calculateTotalOrders()).toFixed(2)
  }

  function calculateUniqueCustomers() {
    const uniqueCustomers = new Set(ordersData.map(order => order.eaterId));
    return uniqueCustomers.size;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 font-sans">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 text-white">Merchant Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">

        {/* Total Sales Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-pink-600">
          <h2 className="text-base md:text-2xl font-medium text-indigo-300 mb-2">Total Sales This Week</h2>
          <p className="text-2xl md:text-3xl font-bold text-white">RM 12500</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-indigo-500">
          <h2 className="text-base md:text-2xl font-medium text-indigo-300 mb-2">Total Orders This Week</h2>
          <p className="text-2xl md:text-3xl font-bold text-white">{calculateTotalOrders()}</p>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-emerald-500">
          <h2 className="text-base md:text-2xl font-medium text-emerald-300 mb-2">Average Order Value</h2>
          <p className="text-2xl md:text-3xl font-bold text-white">RM {calculateAverageOrderValue()}</p>
        </div>

        {/* Top Selling Items Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-amber-500">
          <h2 className="text-base md:text-2xl font-medium text-amber-300 mb-2">Top Selling Items</h2>
          <ol className="space-y-1 text-white">
            <li className="flex items-center">
              <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mr-2">1</span>
              <p className="text-xl">Fried Spring Rolls</p>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-2">2</span>
              <p className="text-xl">Fried Rice</p>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 bg-amber-800 rounded-full flex items-center justify-center mr-2">3</span>
              <p className="text-xl">Nasi Lemak</p>
            </li>
          </ol>
        </div>

        {/* Unique Customers Card */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-cyan-600">
          <h2 className="text-base md:text-2xl font-medium text-cyan-400 mb-2">Unique Customers In the Last Week</h2>
          <p className="text-2xl md:text-3xl font-bold text-white">{calculateUniqueCustomers()}</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8 min-w-[300px]">
        {/* Order Volume Trend Chart */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-medium text-indigo-300 mb-4">Order Volume Trend</h2>
          <div className="h-72 md:h-96">
            <OrderVolumeChart data={orderVolumeData} />
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
          <h2 className="text-lg md:text-xl font-medium text-indigo-300 mb-4">Peak Hours</h2>
          {/* Increased height */}
          <div className="h-72 md:h-96">
            <PeakHoursChart data={peakHoursData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard