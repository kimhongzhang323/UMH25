import React from 'react'
import '../styles/dashboard.css'
import PeakHoursChart from '../charts/PeakHoursChart'
import OrderVolumeChart from '../charts/OrderVolumeChart'

//  Things needed:
//  - Total sales this week (transaction_data.csv)
//  - Best-selling items (keywords.csv, items.csv)
//  - Order volume trend (chart showing orders over time)  (transaction_data.csv)
//  - Peak hours (what time of the day does merchant sell the most - can present in a chart) (transaction_data.csv)

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

const orderVolumeData = [
  { "date": "2025-04-03", "orders": 45 },
  { "date": "2025-04-04", "orders": 52 },
  { "date": "2025-04-05", "orders": 60 },
  { "date": "2025-04-06", "orders": 55 },
  { "date": "2025-04-07", "orders": 68 },
  { "date": "2025-04-08", "orders": 75 },
  { "date": "2025-04-09", "orders": 30 } 
]

function Dashboard() {

  function calculateTotalOrders() {
    const sum = orderVolumeData.reduce((total, order) => {
      return total += order.orders
    }, 0)
    return sum
  }

  return (
    <div className="dashboard-container">
      <h1>Merchant Analytics</h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h2>Total Orders This Week</h2>
          <p>{calculateTotalOrders()}</p>
        </div>

        <div className="dashboard-card">
          <h2>Average Order Value</h2>
          <p>RM 37.23</p>
        </div>

        <div className="dashboard-card">
          <h2>Top Selling items</h2>
          <ol>
            <li>Fried Spring Rolls</li>
            <li>Fried Rice</li>
            <li>Nasi Lemak</li>
          </ol>
        </div>
      </div>

      <div className="chart-container">
        <h2>Order Volume Trend</h2>
        {/* Chart would go here */}
        <OrderVolumeChart data={orderVolumeData} />
      </div>

      <div className="chart-container">
        <h2>Peak Hours</h2>
        {/* Peak hour line chart data here */}
        <PeakHoursChart data={peakHoursData} />
      </div>
    </div>
  )
}

export default Dashboard