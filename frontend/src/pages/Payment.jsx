// src/pages/PaymentPage.jsx
import { useState } from 'react';
import { Card, Radio, Button, Divider, Tooltip, Badge, Tag } from 'antd';
import { 
  CreditCardOutlined, 
  BankOutlined, 
  QrcodeOutlined,
  GiftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const PaymentPage = () => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Subscription plans data
  const plans = {
    trial: {
      name: "Starter",
      price: 0,
      period: billingCycle,
      features: [
        "Basic analytics dashboard",
        "Up to 50 monthly orders",
        "Email support",
        "Limited AI features"
      ],
      cta: "Start Free Trial"
    },
    basic: {
      name: "Basic",
      price: billingCycle === 'yearly' ? 249 : 299, // Prices in RM
      period: billingCycle,
      features: [
        "Advanced analytics",
        "Up to 200 monthly orders",
        "Priority email support",
        "Basic AI recommendations"
      ],
      cta: "Subscribe Now"
    },
    premium: {
      name: "Premium",
      price: billingCycle === 'yearly' ? 499 : 599, // Prices in RM
      period: billingCycle,
      features: [
        "Full analytics suite",
        "Unlimited orders",
        "24/7 chat support",
        "Advanced AI tools",
        "API access",
        "Dedicated account manager"
      ],
      cta: "Get Premium"
    }
  };

  // Payment methods data (Malaysian banking methods)
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      icon: <CreditCardOutlined className="text-blue-500" />,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'maybank',
      name: 'Maybank2U',
      icon: <BankOutlined className="text-yellow-500" />,
      description: 'Pay via Maybank2U'
    },
    {
      id: 'cimb',
      name: 'CIMB Clicks',
      icon: <BankOutlined className="text-red-500" />,
      description: 'Pay via CIMB Clicks'
    },
    {
      id: 'qris',
      name: 'QR Pay',
      icon: <QrcodeOutlined className="text-purple-500" />,
      description: 'Scan QR to pay'
    }
  ];

  const formatPrice = (price) => {
    return `RM${price.toLocaleString('en-MY', {
      minimumFractionDigits: 2
    })}`;
  };

  const calculateSavings = () => {
    if (billingCycle === 'yearly') {
      return 12 * plans.premium.price - 10 * plans.premium.price; // 2 months free
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Choose Your Plan</h1>
          <p className="text-gray-600 mt-2">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <Radio.Group 
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value)}
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="monthly">Monthly Billing</Radio.Button>
            <Radio.Button value="yearly">
              <div className="flex items-center">
                <span>Yearly Billing</span>
                <Tag color="green" className="ml-2">
                  Save 20%
                </Tag>
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              hoverable
              className={`border-2 ${selectedPlan === key ? 'border-blue-500' : 'border-gray-200'}`}
              onClick={() => setSelectedPlan(key)}
              title={
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {key === 'trial' && (
                    <Tag color="blue" className="mt-2">
                      FREE FOR 14 DAYS
                    </Tag>
                  )}
                </div>
              }
              extra={
                selectedPlan === key && (
                  <CheckCircleOutlined className="text-blue-500 text-xl" />
                )
              }
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800">
                  {key === 'trial' ? 'FREE' : formatPrice(plan.price)}
                </div>
                <div className="text-gray-500">
                  {key === 'trial' ? '' : `per ${billingCycle === 'monthly' ? 'month' : 'year'}`}
                </div>
                {key !== 'trial' && billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 mt-1">
                    {formatPrice(plan.price / 12)}/mo effectively
                  </div>
                )}
              </div>

              <Divider />

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleOutlined className="text-green-500 mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                type={selectedPlan === key ? 'primary' : 'default'}
                block
                size="large"
                className={`mt-auto ${selectedPlan === key ? 'bg-blue-600' : ''}`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <Card title="Payment Method" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{method.icon}</div>
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Details Form (would conditionally render based on method) */}
          {paymentMethod === 'credit_card' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-4">Card Details</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-3 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-3 border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Order Summary */}
        <Card title="Order Summary">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">
                {plans[selectedPlan].name} ({billingCycle})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">
                {formatPrice(plans[selectedPlan].price)}
              </span>
            </div>
            {billingCycle === 'yearly' && selectedPlan !== 'trial' && (
              <div className="flex justify-between text-green-600">
                <span>Yearly Savings:</span>
                <span className="font-medium">
                  {formatPrice(calculateSavings())}
                </span>
              </div>
            )}
            <Divider />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {selectedPlan === 'trial' ? 'FREE' : formatPrice(plans[selectedPlan].price)}
              </span>
            </div>
            <Button
              type="primary"
              block
              size="large"
              className="mt-4 bg-blue-600 hover:bg-blue-700 h-12"
            >
              {selectedPlan === 'trial' ? 'Start Free Trial' : 'Complete Payment'}
            </Button>
            <div className="text-center text-sm text-gray-500 mt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </Card>

        {/* Promo Code */}
        <div className="mt-4 flex justify-end">
          <Tooltip title="Have a promo code?">
            <Button type="text" icon={<GiftOutlined />}>
              Apply Promo Code
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;