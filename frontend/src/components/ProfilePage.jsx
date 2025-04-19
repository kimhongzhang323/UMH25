import React, { useState } from 'react';
import { FiAward, FiBarChart2, FiCheckCircle, FiGift, FiStar, FiTrendingUp } from 'react-icons/fi';

const ProfilePage = () => {
  // Merchant data with gamification elements
  const [merchant, setMerchant] = useState({
    name: "Dim Sum Delights",
    location: "Petaling Jaya, Selangor",
    joinDate: "2024-01-10",
    avatar: "https://logo.clearbit.com/dimsumdelight.com",
    tier: "Gold",
    level: 3,
    points: 1250,
    nextLevelPoints: 1500,
    performance: {
      sales: 4.8,
      service: 4.5,
      cleanliness: 4.7,
      avgRating: 4.67
    },
    achievements: [
      { id: 1, name: "First 100 Sales", earned: true, date: "2024-02-01" },
      { id: 2, name: "5-Star Rating Week", earned: true, date: "2024-03-15" },
      { id: 3, name: "Top Performer", earned: true, date: "2024-04-20" },
      { id: 4, name: "Customer Favorite", earned: false },
      { id: 5, name: "Elite Seller", earned: false },
      { id: 6, name: "Perfect Month", earned: false }
    ],
    recentActivities: [
      { id: 1, type: "rating", text: "Received 5-star rating from customer", date: "2 hours ago", points: 10 },
      { id: 2, type: "sale", text: "Achieved daily sales target", date: "1 day ago", points: 20 },
      { id: 3, type: "level", text: "Reached Gold Tier", date: "1 week ago", points: 100 },
      { id: 4, type: "training", text: "Completed service training", date: "2 weeks ago", points: 30 }
    ],
    tierBenefits: {
      Bronze: ["Basic analytics", "Monthly report"],
      Silver: ["Advanced analytics", "Weekly report", "Priority support"],
      Gold: ["Premium analytics", "Daily report", "VIP support", "Menu optimization"],
      Platinum: ["All Gold benefits", "Dedicated account manager", "Early access to new features"]
    }
  });

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((merchant.points / merchant.nextLevelPoints) * 100));

  // Get tier color
  const getTierColor = () => {
    switch(merchant.tier) {
      case "Bronze": return "bg-amber-600";
      case "Silver": return "bg-gray-400";
      case "Gold": return "bg-yellow-500";
      case "Platinum": return "bg-blue-400";
      default: return "bg-gray-500";
    }
  };

  // Get tier icon
  const getTierIcon = () => {
    switch(merchant.tier) {
      case "Bronze": return "🥉";
      case "Silver": return "🥈";
      case "Gold": return "🥇";
      case "Platinum": return "💎";
      default: return "🏆";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light text-gray-800 mb-6">Merchant Profile</h1>
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0 md:w-1/3">
              <img 
                src={merchant.avatar} 
                alt={merchant.name} 
                className="w-16 h-16 rounded-full object-contain mr-4 border border-gray-200"
              />
              <div>
                <h2 className="text-xl font-medium text-gray-800">{merchant.name}</h2>
                <p className="text-gray-500">{merchant.location}</p>
                <p className="text-sm text-gray-400">Member since {new Date(merchant.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Tier Badge */}
            <div className="md:w-1/3 flex justify-center">
              <div className={`px-4 py-2 rounded-full text-white ${getTierColor()} flex items-center`}>
                <span className="text-xl mr-2">{getTierIcon()}</span>
                <span className="font-medium">{merchant.tier} Tier Merchant</span>
              </div>
            </div>
            
            {/* Performance Stats */}
            <div className="md:w-1/3 mt-4 md:mt-0">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="text-2xl font-medium">{merchant.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-2xl font-medium">{merchant.points}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Avg Rating</p>
                  <div className="flex items-center justify-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="text-2xl font-medium">{merchant.performance.avgRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-blue-500" />
                Progress to Next Level
              </h3>
              
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>Level {merchant.level}</span>
                <span>{merchant.points}/{merchant.nextLevelPoints} points</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                    <FiBarChart2 />
                  </div>
                  <p className="text-xs text-gray-600">Sales Target</p>
                  <p className="text-sm font-medium">85%</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1">
                    <FiStar />
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="text-sm font-medium">{merchant.performance.avgRating}/5</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                    <FiCheckCircle />
                  </div>
                  <p className="text-xs text-gray-600">Completion</p>
                  <p className="text-sm font-medium">{progressPercentage}%</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                    <FiGift />
                  </div>
                  <p className="text-xs text-gray-600">Next Reward</p>
                  <p className="text-sm font-medium">250 pts</p>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-700">Sales Performance</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      merchant.performance.sales >= 4.5 
                        ? 'bg-green-100 text-green-800' 
                        : merchant.performance.sales >= 3.5 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {merchant.performance.sales >= 4.5 ? 'Excellent' : merchant.performance.sales >= 3.5 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(merchant.performance.sales / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{merchant.performance.sales}/5</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-700">Service Quality</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      merchant.performance.service >= 4.5 
                        ? 'bg-green-100 text-green-800' 
                        : merchant.performance.service >= 3.5 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {merchant.performance.service >= 4.5 ? 'Excellent' : merchant.performance.service >= 3.5 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(merchant.performance.service / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{merchant.performance.service}/5</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-700">Cleanliness</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      merchant.performance.cleanliness >= 4.5 
                        ? 'bg-green-100 text-green-800' 
                        : merchant.performance.cleanliness >= 3.5 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {merchant.performance.cleanliness >= 4.5 ? 'Excellent' : merchant.performance.cleanliness >= 3.5 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(merchant.performance.cleanliness / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{merchant.performance.cleanliness}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activities</h3>
              
              <div className="space-y-4">
                {merchant.recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full mr-3 ${
                      activity.type === 'rating' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'sale' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'level' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'rating' ? <FiStar /> :
                       activity.type === 'sale' ? <FiBarChart2 /> :
                       activity.type === 'level' ? <FiTrendingUp /> : <FiCheckCircle />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        +{activity.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <FiAward className="mr-2 text-amber-500" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {merchant.achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                        achievement.earned 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {achievement.earned ? <FiCheckCircle size={14} /> : <FiAward size={14} />}
                      </div>
                      <h4 className={`text-sm font-medium ${
                        achievement.earned ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                    </div>
                    {achievement.earned && (
                      <p className="text-xs text-gray-500">Earned on {new Date(achievement.date).toLocaleDateString()}</p>
                    )}
                    {!achievement.earned && (
                      <p className="text-xs text-gray-400">Locked</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tier Benefits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Tier Benefits</h3>
              
              <div className="space-y-4">
                {Object.entries(merchant.tierBenefits).map(([tier, benefits]) => (
                  <div 
                    key={tier} 
                    className={`border rounded-lg p-4 ${
                      tier === merchant.tier 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`font-medium ${
                        tier === merchant.tier ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {tier} Tier
                      </h4>
                      {tier === merchant.tier && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Current Tier
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`mr-2 ${
                            tier === merchant.tier ? 'text-blue-500' : 'text-gray-400'
                          }`}>
                            {tier === merchant.tier ? '✓' : '•'}
                          </span>
                          <span className={`text-sm ${
                            tier === merchant.tier ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Next Tier: Platinum</h4>
                <p className="text-xs text-gray-500">
                  Reach 2000 points and maintain 4.8+ rating for 3 months to unlock Platinum Tier benefits
                </p>
              </div>
            </div>
            
            {/* Rewards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Available Rewards</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 mr-2 flex items-center justify-center">
                      <FiGift size={14} />
                    </div>
                    <h4 className="text-sm font-medium text-gray-800">Free Dessert</h4>
                  </div>
                  <p className="text-xs text-gray-500">1000 points</p>
                </div>
                
                <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center">
                      <FiGift size={14} />
                    </div>
                    <h4 className="text-sm font-medium text-gray-800">Marketing Boost</h4>
                  </div>
                  <p className="text-xs text-gray-500">1500 points</p>
                </div>
                
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 mr-2 flex items-center justify-center">
                      <FiGift size={14} />
                    </div>
                    <h4 className="text-sm font-medium text-gray-800">Staff Training</h4>
                  </div>
                  <p className="text-xs text-gray-500">1800 points</p>
                </div>
                
                <div className="border border-amber-200 rounded-lg p-3 bg-amber-50">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 mr-2 flex items-center justify-center">
                      <FiGift size={14} />
                    </div>
                    <h4 className="text-sm font-medium text-gray-800">Menu Consultation</h4>
                  </div>
                  <p className="text-xs text-gray-500">2000 points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;