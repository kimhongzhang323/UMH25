import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCheck, FiLoader, FiDownload, FiLayout, FiImage, FiEdit2, FiTrash2, FiSearch, FiPieChart, FiTrendingUp, FiStar, FiInfo } from 'react-icons/fi';

const MenuGenerator = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuStyle, setMenuStyle] = useState('modern');
  const [menuTheme, setMenuTheme] = useState('light');
  const [salesData, setSalesData] = useState(null);
  const [menuOptions, setMenuOptions] = useState({
    includeLowPerformers: false,
    optimizeForProfit: true,
    suggestNewItems: true,
    showPopularityBadges: true
  });
  const [generationType, setGenerationType] = useState('bestsellers');
  const [isLoading, setIsLoading] = useState(true);

  // Menu styles
  const menuStyles = [
    { id: 'modern', name: 'Modern', icon: <FiLayout /> },
    { id: 'classic', name: 'Classic', icon: <FiImage /> },
    { id: 'minimalist', name: 'Minimalist', icon: <FiEdit2 /> }
  ];

  // Generation types
  const generationTypes = [
    { id: 'bestsellers', name: 'Best Sellers', description: 'Menu with top-selling items', icon: <FiStar /> },
    { id: 'profit', name: 'Profit Optimized', description: 'Menu focused on high-margin items', icon: <FiTrendingUp /> },
    { id: 'balanced', name: 'Balanced Menu', description: 'Combination of popular and profitable items', icon: <FiPieChart /> },
    { id: 'seasonal', name: 'Seasonal Menu', description: 'Items that perform well in current season', icon: <FiRefreshCw /> }
  ];
  
  // Load sales data on component mount
  useEffect(() => {
    // In a real implementation, we would fetch the sales data from an API
    // Here we'll simulate loading sales data
    setIsLoading(true);
    
    // Simulating API call delay
    setTimeout(() => {
      analyzeSalesData();
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Analyze sales data to determine best-selling items
  const analyzeSalesData = () => {
    // This would be fetched from the backend in a real implementation
    // For now, we'll simulate the result of sales data analysis for Dim Sum Delight
    
    // Based on the CSV data, we can see these as the top items:
    const topItems = [
      {
        id: 113,
        name: "Pork Siu Mai",
        description: "Steamed dumpling with pork and shrimp filling, topped with fish roe",
        price: 5.0,
        category: "chinese",
        popular: true,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 358,
        revenue: 1790.0,
        profitMargin: "High"
      },
      {
        id: 304,
        name: "Steamed BBQ Pork Buns",
        description: "Fluffy steamed buns filled with sweet and savory barbecue pork",
        price: 4.75,
        category: "chinese",
        popular: true,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 272,
        revenue: 1292.0,
        profitMargin: "Medium"
      },
      {
        id: 138,
        name: "Shrimp Har Gow",
        description: "Translucent steamed dumplings filled with tender shrimp",
        price: 5.50,
        category: "chinese",
        popular: true,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 203,
        revenue: 1116.5,
        profitMargin: "High"
      },
      {
        id: 114,
        name: "Mango Pudding",
        description: "Sweet and refreshing dessert made with fresh mangoes and cream",
        price: 3.50,
        category: "dessert",
        popular: true,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 189,
        revenue: 661.5,
        profitMargin: "Very High"
      },
      {
        id: 201,
        name: "Egg Tarts",
        description: "Flaky pastry shells filled with sweet egg custard",
        price: 3.75,
        category: "dessert",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 156,
        revenue: 585.0,
        profitMargin: "Medium"
      },
      {
        id: 125,
        name: "Sticky Rice in Lotus Leaf",
        description: "Glutinous rice with chicken, mushrooms and Chinese sausage wrapped in lotus leaf",
        price: 6.25,
        category: "chinese",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 142,
        revenue: 887.5,
        profitMargin: "Medium"
      },
      {
        id: 217,
        name: "Chive Dumplings",
        description: "Pan-fried dumplings filled with chives and shrimp",
        price: 4.95,
        category: "chinese",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 135,
        revenue: 668.25,
        profitMargin: "Low"
      },
      {
        id: 189,
        name: "Beef Rice Noodle Roll",
        description: "Steamed rice noodles filled with marinated beef and scallions",
        price: 5.25,
        category: "chinese",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        orderCount: 128,
        revenue: 672.0,
        profitMargin: "Medium"
      }
    ];

    // Simulate AI-generated suggested items
    const suggestedItems = [
      {
        id: 'new-1',
        name: "Truffle Mushroom Dumplings",
        description: "Luxurious steamed dumplings with shiitake mushrooms and truffle essence",
        price: 6.75,
        category: "chinese",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        isNew: true,
        aiSuggested: true,
        similarToId: 113,
        reasonForSuggestion: "Customers who enjoy Pork Siu Mai often order mushroom dishes"
      },
      {
        id: 'new-2',
        name: "Mango Sago with Pomelo",
        description: "Refreshing dessert with fresh mango, sago pearls and pomelo pulp",
        price: 4.50,
        category: "dessert",
        popular: false,
        imageUrl: "https://via.placeholder.com/150",
        isNew: true,
        aiSuggested: true,
        similarToId: 114,
        reasonForSuggestion: "Extension of popular Mango Pudding dessert line"
      }
    ];

    // Set the sales data
    setSalesData({
      topItems,
      suggestedItems,
      totalOrders: 2145,
      totalRevenue: 9876.50,
      averageOrderValue: 28.35,
      mostProfitableCategory: "Desserts",
      bestSellingCategory: "Chinese Dumplings",
      bestDayOfWeek: "Sunday",
      bestTimeOfDay: "11:00 - 14:00"
    });
  };

  // Generate menu based on sales data and options
  const generateMenu = async () => {
    if (!salesData) {
      setError('Sales data not available');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we'd call the backend:
      // const response = await fetch('/api/generate-menu', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     generationType,
      //     menuOptions
      //   })
      // });
      // const data = await response.json();
      // setMenuItems(data.items);
      
      // For demo purposes, we'll use the sales data directly
      let generatedItems = [...salesData.topItems];
      
      // Add suggested items if option selected
      if (menuOptions.suggestNewItems) {
        generatedItems = [...generatedItems, ...salesData.suggestedItems];
      }
      
      // Sort based on generation type
      if (generationType === 'bestsellers') {
        generatedItems.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
      } else if (generationType === 'profit') {
        // Sort by profit margin and price
        const profitRank = { "Very High": 4, "High": 3, "Medium": 2, "Low": 1 };
        generatedItems.sort((a, b) => {
          return (profitRank[b.profitMargin] || 0) - (profitRank[a.profitMargin] || 0) ||
                 b.price - a.price;
        });
      } else if (generationType === 'balanced') {
        // Mix of popular and profitable items
        generatedItems.sort((a, b) => {
          const aScore = (a.orderCount || 0) * (a.price || 0);
          const bScore = (b.orderCount || 0) * (b.price || 0);
          return bScore - aScore;
        });
      } else if (generationType === 'seasonal') {
        // For demo purposes, we'll just randomize for "seasonal"
        generatedItems.sort(() => Math.random() - 0.5);
      }
      
      // Remove low performers if option not selected
      if (!menuOptions.includeLowPerformers) {
        generatedItems = generatedItems.filter(item => 
          (item.orderCount || 0) > 100 || item.aiSuggested || item.isNew);
      }
      
      setMenuItems(generatedItems);
      setSuccess(true);
    } catch (error) {
      setError('Failed to generate menu. Please try again.');
      console.error('Error generating menu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateClick = () => {
    generateMenu();
  };

  const exportMenu = () => {
    // Create a printable version or download as PDF
    // This is a placeholder function
    alert('Export functionality would go here - would generate a PDF or printable version');
  };

  // Filter menu items based on active cuisine and search term
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCuisine = activeCuisine === 'all' || item.category === activeCuisine;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className={`min-h-screen p-4 md:p-8 bg-gray-50 ${menuTheme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Dim Sum Delight Menu Generator</h1>
        <p className="text-gray-600 mb-8">Create an AI-optimized menu based on sales data analysis</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            {/* Sales Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiPieChart className="mr-2 text-blue-500" />
                Sales Analysis
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <FiLoader className="animate-spin text-blue-500 mr-2" />
                  <span>Loading sales data...</span>
                </div>
              ) : salesData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h3 className="text-sm text-gray-500">Total Orders</h3>
                      <p className="text-xl font-medium">{salesData.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="text-sm text-gray-500">Revenue</h3>
                      <p className="text-xl font-medium">RM {salesData.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Selling Item:</span>
                      <span className="font-medium">{salesData.topItems[0].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Category:</span>
                      <span className="font-medium">{salesData.bestSellingCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Most Profitable:</span>
                      <span className="font-medium">{salesData.mostProfitableCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Time:</span>
                      <span className="font-medium">{salesData.bestTimeOfDay}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No sales data available
                </div>
              )}
            </div>

            {/* Generation Options */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Menu Generation</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Generation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {generationTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setGenerationType(type.id)}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                        generationType === type.id 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{type.icon}</div>
                      <span className="text-sm">{type.name}</span>
                    </button>
                  ))}
                </div>
                {generationType && (
                  <p className="mt-2 text-xs text-gray-500">
                    {generationTypes.find(t => t.id === generationType)?.description}
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={menuOptions.includeLowPerformers}
                      onChange={() => setMenuOptions(prev => ({
                        ...prev,
                        includeLowPerformers: !prev.includeLowPerformers
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Include low-performing items</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={menuOptions.optimizeForProfit}
                      onChange={() => setMenuOptions(prev => ({
                        ...prev,
                        optimizeForProfit: !prev.optimizeForProfit
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Optimize for profit</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={menuOptions.suggestNewItems}
                      onChange={() => setMenuOptions(prev => ({
                        ...prev,
                        suggestNewItems: !prev.suggestNewItems
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Suggest new items</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={menuOptions.showPopularityBadges}
                      onChange={() => setMenuOptions(prev => ({
                        ...prev,
                        showPopularityBadges: !prev.showPopularityBadges
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Show popularity badges</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGenerateClick}
                disabled={isGenerating || isLoading}
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiRefreshCw className="mr-2" />
                    Generate Menu
                  </>
                )}
              </button>
            </div>

            {/* Menu Style Options */}
            {menuItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Menu Style</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Design</label>
                  <div className="grid grid-cols-3 gap-3">
                    {menuStyles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setMenuStyle(style.id)}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                          menuStyle === style.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl mb-1">{style.icon}</div>
                        <span className="text-sm">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMenuTheme('light')}
                      className={`flex-1 p-3 border rounded-lg text-center transition-all ${
                        menuTheme === 'light' 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setMenuTheme('dark')}
                      className={`flex-1 p-3 border rounded-lg text-center transition-all ${
                        menuTheme === 'dark' 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-800 text-white'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={exportMenu}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors"
                >
                  <FiDownload className="mr-2" />
                  Export Menu
                </button>
              </div>
            )}
          </div>

          {/* Menu Preview */}
          <div className="lg:col-span-2">
            {menuItems.length > 0 ? (
              <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                menuTheme === 'dark' ? 'bg-gray-800' : ''
              }`}>
                <div className={`p-6 border-b ${
                  menuTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <h2 className={`text-2xl font-bold ${
                      menuTheme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Dim Sum Delight Menu
                    </h2>
                    <div className="text-sm text-gray-500">
                      {success && (
                        <span className="flex items-center text-green-600">
                          <FiCheck className="mr-1" /> Generated successfully
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className={`mt-1 text-sm ${
                    menuTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {generationTypes.find(t => t.id === generationType)?.name} • {salesData?.totalOrders.toLocaleString()} orders analyzed
                  </p>
                </div>

                {/* Search and Filter */}
                <div className={`p-4 border-b ${
                  menuTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className={`h-5 w-5 ${
                          menuTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        className={`pl-10 w-full p-2 border rounded-lg ${
                          menuTheme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'border-gray-300 placeholder-gray-500'
                        }`}
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                      <button
                        onClick={() => setActiveCuisine('all')}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                          activeCuisine === 'all' 
                            ? menuTheme === 'dark' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-800'
                            : menuTheme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        All Items
                      </button>
                      {[...new Set(menuItems.map(item => item.category))].map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveCuisine(category)}
                          className={`px-3 py-1 rounded-full text-sm capitalize whitespace-nowrap ${
                            activeCuisine === category 
                              ? menuTheme === 'dark' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-100 text-blue-800'
                              : menuTheme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className={`p-6 ${
                  menuStyle === 'modern' ? 'space-y-6' : 
                  menuStyle === 'classic' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' :
                  'space-y-4'
                }`}>
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`${
                          menuStyle === 'modern' 
                            ? 'flex items-center border-b pb-6 last:border-0 last:pb-0' : 
                          menuStyle === 'classic' 
                            ? 'border rounded-lg overflow-hidden' :
                          'flex items-center'
                        } ${menuTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        {menuStyle !== 'minimalist' && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className={`${
                              menuStyle === 'modern' 
                                ? 'w-20 h-20 rounded-lg mr-4 object-cover' : 
                              menuStyle === 'classic' 
                                ? 'w-full h-48 object-cover' :
                              'hidden'
                            }`} 
                          />
                        )}
                        <div className={`flex-1 ${
                          menuStyle === 'classic' ? 'p-4' : ''
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-semibold flex items-center ${
                                menuTheme === 'dark' ? 'text-white' : 'text-gray-800'
                              }`}>
                                {item.name}
                                {item.isNew && (
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    menuTheme === 'dark' 
                                      ? 'bg-blue-700 text-blue-100' 
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    NEW
                                  </span>
                                )}
                              </h3>
                              <p className={`text-sm mt-1 ${
                                menuTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {item.description}
                              </p>
                            </div>
                            <div className={`font-medium ${
                              menuTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`}>
                              RM {item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {menuOptions.showPopularityBadges && item.popular && (
                              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                menuTheme === 'dark' 
                                  ? 'bg-yellow-700 text-yellow-100' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                <FiStar className="mr-1" /> Popular
                              </span>
                            )}
                            
                            {item.aiSuggested && (
                              <span className={`text-xs px-2 py-1 rounded-full flex items-center cursor-pointer group relative ${
                                menuTheme === 'dark' 
                                  ? 'bg-purple-700 text-purple-100' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                <FiInfo className="mr-1" /> AI Suggested
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 p-2 rounded bg-gray-800 text-white text-xs w-48 z-10">
                                  {item.reasonForSuggestion}
                                </span>
                              </span>
                            )}
                            
                            {item.orderCount && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                menuTheme === 'dark' 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.orderCount} orders
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-8 ${
                      menuTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No menu items match your search
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center h-96">
                <div className="text-5xl text-gray-300 mb-4">
                  <FiLayout />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Menu Preview</h3>
                <p className="text-gray-500 mb-6">
                  {isLoading 
                    ? "Loading sales data..." 
                    : "Generate a menu based on sales data to see it here"}
                </p>
                {!isLoading && (
                  <button
                    onClick={handleGenerateClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Menu
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuGenerator;