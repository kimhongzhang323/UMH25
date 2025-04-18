// src/pages/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { Select, Table, Card, Alert, Tag, Progress } from 'antd';
import { CrownFilled, TrophyFilled, StarFilled } from '@ant-design/icons';

// Mock data with detailed metrics
const mockLeaderboardData = {
  current_month: [
    { 
      merchant_id: 101, 
      merchant_name: "Bakmi GM", 
      city_id: "JKT-01",
      total_sales: 12500000, 
      order_count: 420, 
      rank: 1 
    },
    { 
      merchant_id: 102, 
      merchant_name: "Kopi Kenangan", 
      city_id: "JKT-01",
      total_sales: 11800000, 
      order_count: 380, 
      rank: 2 
    },
    { 
      merchant_id: 103, 
      merchant_name: "Martabak San Francisco", 
      city_id: "BDG-02",
      total_sales: 9750000, 
      order_count: 310, 
      rank: 3 
    },
    { 
      merchant_id: 104, 
      merchant_name: "Your Business", 
      city_id: "JKT-01",
      total_sales: 8200000, 
      order_count: 275, 
      rank: 4 
    },
  ],
  last_month: [
    { 
      merchant_id: 102, 
      merchant_name: "Kopi Kenangan", 
      city_id: "JKT-01",
      total_sales: 10900000, 
      order_count: 350, 
      rank: 1 
    },
    { 
      merchant_id: 101, 
      merchant_name: "Bakmi GM", 
      city_id: "JKT-01",
      total_sales: 10500000, 
      order_count: 395, 
      rank: 2 
    },
    { 
      merchant_id: 104, 
      merchant_name: "Your Business", 
      city_id: "JKT-01",
      total_sales: 7800000, 
      order_count: 240, 
      rank: 3 
    },
  ]
};

const mockAIAdvice = {
  current_month: "Your order volume is 34% below the leader. Consider running a 'Buy 1 Get 1' promotion during dinner hours to boost transactions.",
  last_month: "You ranked #3 last month with 240 orders. To move up, focus on delivery speed - top merchants average 18% faster preparation times."
};

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState('current_month');
  const [data, setData] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulate API fetch
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(mockLeaderboardData[timeRange]);
      setAiAdvice(mockAIAdvice[timeRange]);
      setLoading(false);
    }, 500);
  }, [timeRange]);

  const columns = [
    { 
      title: 'Rank', 
      dataIndex: 'rank', 
      key: 'rank',
      width: 80,
      render: (rank) => (
        <div className="text-center">
          {rank === 1 ? (
            <CrownFilled className="text-2xl text-yellow-500" />
          ) : rank === 2 ? (
            <TrophyFilled className="text-xl text-gray-400" />
          ) : rank === 3 ? (
            <StarFilled className="text-lg text-amber-600" />
          ) : (
            <span className="text-gray-500">{rank}</span>
          )}
        </div>
      )
    },
    { 
      title: 'Merchant', 
      dataIndex: 'merchant_name', 
      key: 'merchant_name',
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">City: {record.city_id}</div>
        </div>
      )
    },
    { 
      title: 'Sales', 
      dataIndex: 'total_sales', 
      key: 'total_sales',
      render: (sales) => (
        <div className="font-mono">
          RM{sales.toLocaleString('id-ID')}
        </div>
      ),
      sorter: (a, b) => a.total_sales - b.total_sales,
      defaultSortOrder: 'descend'
    },
    { 
      title: 'Orders', 
      dataIndex: 'order_count', 
      key: 'order_count',
      render: (count) => (
        <div className="text-center">
          <Tag color="blue">{count}</Tag>
        </div>
      )
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <Progress 
          percent={Math.min(100, (record.total_sales / mockLeaderboardData[timeRange][0].total_sales) * 100)}
          status="active"
          showInfo={false}
          strokeColor={
            record.rank === 1 ? '#ffd700' : 
            record.rank === 2 ? '#c0c0c0' : 
            record.rank === 3 ? '#cd7f32' : '#1890ff'
          }
        />
      )
    }
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Card 
        title={
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Merchant Performance Leaderboard</h2>
              <p className="text-sm text-gray-500">Compare your performance with other merchants</p>
            </div>
            <Select
              defaultValue="current_month"
              onChange={setTimeRange}
              options={[
                { label: 'This Month', value: 'current_month' },
                { label: 'Last Month', value: 'last_month' }
              ]}
              style={{ width: 150 }}
              className="min-w-[150px]"
            />
          </div>
        }
        loading={loading}
        bordered={false}
        className="shadow-sm"
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="merchant_id"
          pagination={false}
          rowClassName={(record) => 
            record.merchant_name === "Your Business" ? 'bg-blue-50 font-semibold' : ''
          }
          scroll={{ x: true }}
        />

        {aiAdvice && (
          <Alert
            type="info"
            message="AI-Powered Business Advice"
            description={
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg">✨</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{aiAdvice}</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                    Show me how to implement →
                  </button>
                </div>
              </div>
            }
            className="mt-6 border-0 bg-blue-50"
            showIcon={false}
          />
        )}
      </Card>
    </div>
  );
}