// src/pages/GrabAdsPage.jsx
import { useState, useEffect } from 'react';
import { Tabs, Card, Button, Select, Slider, DatePicker, Input, Radio, Table, Tag, Progress, Divider, Alert } from 'antd';
import { 
  RiseOutlined, 
  BarChartOutlined, 
  DollarOutlined, 
  ScheduleOutlined,
  CheckCircleOutlined,
  ThunderboltFilled,
  RobotOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const GrabAdsPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [campaignType, setCampaignType] = useState('visibility');
  const [budget, setBudget] = useState(500);
  const [duration, setDuration] = useState(7);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [targeting, setTargeting] = useState({
    location: 'all',
    customerType: 'all',
    device: 'all',
  });

  // Mock data for campaigns
  const activeCampaigns = [
    {
      id: 1,
      name: 'Raya Special',
      type: 'Conversion',
      status: 'active',
      budget: 1500,
      spent: 875,
      impressions: 12500,
      clicks: 420,
      ctr: 3.36,
      startDate: '2023-05-01',
      endDate: '2023-05-31'
    },
    {
      id: 2,
      name: 'New Store Boost',
      type: 'Visibility',
      status: 'active',
      budget: 500,
      spent: 125,
      impressions: 8400,
      clicks: 210,
      ctr: 2.50,
      startDate: '2023-05-15',
      endDate: '2023-05-22'
    }
  ];

  const campaignTypes = [
    {
      value: 'visibility',
      label: 'Visibility Boost',
      description: 'Increase your store appearance in search results',
      icon: <RiseOutlined className="text-blue-500" />
    },
    {
      value: 'conversion',
      label: 'Conversion Boost',
      description: 'Promote specific products to drive purchases',
      icon: <DollarOutlined className="text-green-500" />
    },
    {
      value: 'launch',
      label: 'New Store Launch',
      description: 'Special package for new merchant onboarding',
      icon: <ThunderboltFilled className="text-purple-500" />
    }
  ];

  // Format currency in Malaysian Ringgit
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // AI Analysis Simulation
  const generateAiAnalysis = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiInsights({
        recommendation: "Increase your budget to RM800 for better visibility during peak hours (12PM-2PM, 7PM-9PM)",
        predictedResults: {
          impressions: "18,500-22,000",
          clicks: "580-720",
          ctr: "3.1%-3.3%"
        },
        optimizationTips: [
          "Use more vibrant food images - our AI detected 25% better CTR with high-contrast visuals",
          "Add 'Free Delivery' call-to-action - converts 18% better than discount-based promotions",
          "Target returning customers - they have 32% higher conversion rate"
        ]
      });
      setLoadingAi(false);
    }, 1500);
  };

  useEffect(() => {
    if (activeTab === 'create') {
      generateAiAnalysis();
    }
  }, [budget, duration, campaignType]);

  const columns = [
    {
      title: 'Campaign',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.type}</div>
        </div>
      )
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget) => formatCurrency(budget)
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-xs">
            <span className="font-medium">{record.impressions.toLocaleString()}</span> impressions
          </div>
          <div className="text-xs">
            <span className="font-medium">{record.clicks}</span> clicks
          </div>
          <div className="text-xs">
            <span className="font-medium">{record.ctr}%</span> CTR
          </div>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          View Details
        </Button>
      )
    }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <RiseOutlined className="mr-2" />
            Grab Ads Boosting (MY)
          </h1>
          <Button type="primary" icon={<BarChartOutlined />}>
            Performance Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Create New Campaign" key="create">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Setup */}
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold mb-4">Campaign Setup</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium">Campaign Name</label>
                      <Input 
                        placeholder="E.g. Raya Special Promo" 
                        size="large"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Campaign Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {campaignTypes.map((type) => (
                          <Card
                            key={type.value}
                            hoverable
                            className={`text-center cursor-pointer ${
                              campaignType === type.value ? 'border-blue-500' : ''
                            }`}
                            onClick={() => setCampaignType(type.value)}
                          >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <h3 className="font-medium">{type.label}</h3>
                            <p className="text-sm text-gray-500">{type.description}</p>
                            {campaignType === type.value && (
                              <CheckCircleOutlined className="text-blue-500 mt-2" />
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>

                    {campaignType === 'conversion' && (
                      <div>
                        <label className="block mb-2 font-medium">Products to Promote</label>
                        <Select
                          mode="multiple"
                          placeholder="Select products"
                          size="large"
                          style={{ width: '100%' }}
                        >
                          <Select.Option value="product1">Nasi Lemak Special</Select.Option>
                          <Select.Option value="product2">Satay Set</Select.Option>
                          <Select.Option value="product3">Teh Tarik</Select.Option>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget & Targeting */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Budget & Targeting</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium">
                        Daily Budget
                        <Tag color="orange" className="ml-2">
                          Min. RM50
                        </Tag>
                      </label>
                      <Slider
                        min={50}
                        max={1000}
                        step={50}
                        value={budget}
                        onChange={setBudget}
                        tooltip={{ formatter: (value) => formatCurrency(value) }}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">RM50</span>
                        <span className="font-medium">{formatCurrency(budget)}</span>
                        <span className="text-sm text-gray-500">RM1,000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Total Estimated Spend</label>
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(budget * duration)}
                        </div>
                        <div className="text-sm text-gray-500">
                          For {duration} days at {formatCurrency(budget)}/day
                        </div>
                      </div>
                    </div>

                    <Divider />

                    {/* AI Analysis Section */}
                    <div>
                      <label className="mb-2 font-medium flex items-center">
                        <RobotOutlined className="mr-2 text-purple-500" />
                        AI Campaign Analysis
                      </label>
                      {loadingAi ? (
                        <div className="text-center py-4">
                          <Progress type="circle" percent={75} size={50} />
                          <p className="mt-2">Analyzing your campaign...</p>
                        </div>
                      ) : aiInsights ? (
                        <div className="space-y-3">
                          <Alert
                            message="Recommendation"
                            description={aiInsights.recommendation}
                            type="info"
                            showIcon
                          />
                          
                          <Card size="small" title="Predicted Results">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="font-bold">Impressions</div>
                                <div>{aiInsights.predictedResults.impressions}</div>
                              </div>
                              <div>
                                <div className="font-bold">Clicks</div>
                                <div>{aiInsights.predictedResults.clicks}</div>
                              </div>
                              <div>
                                <div className="font-bold">CTR</div>
                                <div>{aiInsights.predictedResults.ctr}</div>
                              </div>
                            </div>
                          </Card>

                          <Card size="small" title="Optimization Tips">
                            <ul className="list-disc pl-4 space-y-1">
                              {aiInsights.optimizationTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </Card>
                        </div>
                      ) : null}
                    </div>

                    <Button 
                      type="primary" 
                      block 
                      size="large"
                      onClick={generateAiAnalysis}
                      loading={loadingAi}
                    >
                      Launch Campaign
                    </Button>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Active Campaigns" key="active">
              <Table 
                columns={columns} 
                dataSource={activeCampaigns} 
                rowKey="id"
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* AI-Powered Tips */}
        <Card 
          title={
            <span>
              <RobotOutlined className="mr-2 text-purple-500" />
              AI-Powered Marketing Tips
            </span>
          } 
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <div className="text-purple-500 text-xl mb-2">
                <RobotOutlined />
              </div>
              <h3 className="font-medium mb-1">Peak Hours Analysis</h3>
              <p className="text-sm text-gray-600">
                AI detected your conversion rate is 28% higher between 7PM-9PM
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <div className="text-purple-500 text-xl mb-2">
                <RobotOutlined />
              </div>
              <h3 className="font-medium mb-1">Creative Optimization</h3>
              <p className="text-sm text-gray-600">
                Campaigns with "Limited Time Offer" badges perform 42% better
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <div className="text-purple-500 text-xl mb-2">
                <RobotOutlined />
              </div>
              <h3 className="font-medium mb-1">Competitor Benchmark</h3>
              <p className="text-sm text-gray-600">
                Similar stores spend RM650-RM850 daily for optimal visibility
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GrabAdsPage;