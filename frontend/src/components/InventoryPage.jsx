import React, { useState, useEffect } from 'react';
import { 
  FiAlertTriangle, 
  FiPackage, 
  FiPlus, 
  FiSearch, 
  FiTrendingUp,
  FiCheckCircle,
  FiRefreshCw
} from 'react-icons/fi';

const InventoryPage = () => {
  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockInventory = [
          {
            id: 1,
            name: "Zinger Burger Patty",
            category: "Chicken",
            currentStock: 42,
            minStock: 50,
            unit: "pieces",
            lastDelivery: "2025-04-08",
            nextDelivery: "2025-04-15",
            usageRate: "15/day",
            status: "low"
          },
          {
            id: 2,
            name: "Original Recipe Coating",
            category: "Ingredients",
            currentStock: 25,
            minStock: 20,
            unit: "kg",
            lastDelivery: "2025-04-10",
            nextDelivery: "2025-04-17",
            usageRate: "3kg/day",
            status: "adequate"
          },
          {
            id: 3,
            name: "Potatoes",
            category: "Ingredients",
            currentStock: 120,
            minStock: 100,
            unit: "kg",
            lastDelivery: "2025-04-09",
            nextDelivery: "2025-04-16",
            usageRate: "20kg/day",
            status: "adequate"
          },
          {
            id: 4,
            name: "Coleslaw Mix",
            category: "Ingredients",
            currentStock: 8,
            minStock: 15,
            unit: "kg",
            lastDelivery: "2025-04-05",
            nextDelivery: "2025-04-12",
            usageRate: "2kg/day",
            status: "low"
          },
          {
            id: 5,
            name: "Cheese Slices",
            category: "Dairy",
            currentStock: 200,
            minStock: 150,
            unit: "pieces",
            lastDelivery: "2025-04-11",
            nextDelivery: "2025-04-18",
            usageRate: "30/day",
            status: "adequate"
          },
          {
            id: 6,
            name: "Buns",
            category: "Bakery",
            currentStock: 60,
            minStock: 80,
            unit: "dozen",
            lastDelivery: "2025-04-10",
            nextDelivery: "2025-04-17",
            usageRate: "10 dozen/day",
            status: "low"
          },
          {
            id: 7,
            name: "Pepsi Syrup",
            category: "Beverages",
            currentStock: 5,
            minStock: 5,
            unit: "liters",
            lastDelivery: "2025-04-07",
            nextDelivery: "2025-04-14",
            usageRate: "1 liter/day",
            status: "critical"
          },
          {
            id: 8,
            name: "Hot & Spicy Marinade",
            category: "Sauces",
            currentStock: 12,
            minStock: 10,
            unit: "liters",
            lastDelivery: "2025-04-09",
            nextDelivery: "2025-04-16",
            usageRate: "2 liters/day",
            status: "adequate"
          }
        ];
        
        setInventory(mockInventory);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter inventory based on search and filter
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate inventory summary
  const inventorySummary = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.status === 'low').length,
    criticalStock: inventory.filter(item => item.status === 'critical').length,
    adequateStock: inventory.filter(item => item.status === 'adequate').length
  };

  // Handle reorder
  const handleReorder = (item) => {
    setSelectedItem(item);
    setReorderModalOpen(true);
  };

  const confirmReorder = () => {
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          currentStock: item.currentStock + (orderQuantity * getDefaultOrderQuantity(item)),
          status: calculateStatus(item.currentStock + (orderQuantity * getDefaultOrderQuantity(item)), item.minStock)
        };
      }
      return item;
    });
    
    setInventory(updatedInventory);
    setReorderModalOpen(false);
    setSelectedItem(null);
    setOrderQuantity(1);
  };

  // Helper functions
  const calculateStatus = (current, min) => {
    if (current <= min * 0.3) return 'critical';
    if (current <= min) return 'low';
    return 'adequate';
  };

  const getDefaultOrderQuantity = (item) => {
    if (item.unit === 'kg' || item.unit === 'liters') return 5;
    if (item.unit === 'dozen') return 2;
    return 20;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-amber-100 text-amber-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'critical': return 'Critical';
      case 'low': return 'Low';
      default: return 'Adequate';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <button 
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert('Add new item functionality would go here')}
          >
            <FiPlus className="mr-2" />
            Add New Item
          </button>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-medium">{inventorySummary.totalItems}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FiPackage size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Adequate Stock</p>
                <p className="text-2xl font-medium text-green-600">{inventorySummary.adequateStock}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FiCheckCircle size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-medium text-amber-600">{inventorySummary.lowStock}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <FiAlertTriangle size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Critical Stock</p>
                <p className="text-2xl font-medium text-red-600">{inventorySummary.criticalStock}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <FiAlertTriangle size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setFilter('adequate')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === 'adequate' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Adequate
              </button>
              <button
                onClick={() => setFilter('low')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === 'low' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === 'critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                Critical
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Required</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Delivery</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.usageRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(item.nextDelivery).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleReorder(item)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Reorder
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() => alert('Edit functionality would go here')}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No items found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-purple-500" />
            AI Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Increase Orders</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Zinger Patty (+20%)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Buns (+15%)</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Reduce Waste</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Coleslaw Mix (-25%)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Potatoes (-10%)</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Supplier Options</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  <span>Supplier B (8% cheaper)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  <span>Supplier C (5% cheaper)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reorder Modal */}
        {reorderModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Reorder {selectedItem.name}
                </h3>
                
                <div className="mb-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Current Stock:</span> {selectedItem.currentStock} {selectedItem.unit}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Minimum Required:</span> {selectedItem.minStock} {selectedItem.unit}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Usage Rate:</span> {selectedItem.usageRate}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Quantity (x{getDefaultOrderQuantity(selectedItem)} {selectedItem.unit})
                  </label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="border-t border-b border-gray-300 px-3 py-1 w-16 text-center"
                    />
                    <button 
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    Ordering {orderQuantity * getDefaultOrderQuantity(selectedItem)} {selectedItem.unit}. 
                    Delivery by {new Date(selectedItem.nextDelivery).toLocaleDateString()}.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setReorderModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReorder}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;