import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiAlertTriangle, 
  FiPackage, 
  FiPlus, 
  FiSearch, 
  FiTrendingUp,
  FiCheckCircle,
  FiRefreshCw,
  FiXCircle
} from 'react-icons/fi';

const InventoryPage = () => {
  const navigate = useNavigate();
  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pendingOrdersModalOpen, setPendingOrdersModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [editedItem, setEditedItem] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);

  const deleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      const updatedInventory = inventory.filter((i) => i.id !== item.id);
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setEditModalOpen(false);
      setSelectedItem(null);
      setEditedItem(null);
    }
  };

  const categories = [
    'Dumpling Ingredients',
    'BBQ Pork Ingredients',
    'Shrimp Ingredients',
    'Dessert Ingredients',
    'Wrappers/Dough',
    'Sauces/Dips',
    'Other'
  ];

  const units = [
    'kg',
    'pieces',
    'liters',
    'packs',
    'boxes',
    'dozen'
  ];

  const mockInventory = [
    {
      id: 1,
      name: "Ground Pork",
      category: "Dumpling Ingredients",
      currentStock: 25,
      minStock: 20,
      unit: "kg",
      lastDelivery: "2025-04-15",
      nextDelivery: "2025-04-25",
      usageRate: "3/day",
      status: "adequate"
    },
    {
      id: 2,
      name: "Shrimp",
      category: "Shrimp Ingredients",
      currentStock: 15,
      minStock: 20,
      unit: "kg",
      lastDelivery: "2025-04-10",
      nextDelivery: "2025-04-22",
      usageRate: "4/day",
      status: "low"
    },
    {
      id: 3,
      name: "Dumpling Wrappers",
      category: "Wrappers/Dough",
      currentStock: 500,
      minStock: 2000,
      unit: "pieces",
      lastDelivery: "2025-04-12",
      nextDelivery: "2025-04-21",
      usageRate: "300/day",
      status: "critical"
    },
    {
      id: 4,
      name: "BBQ Pork",
      category: "BBQ Pork Ingredients",
      currentStock: 30,
      minStock: 25,
      unit: "kg",
      lastDelivery: "2025-04-18",
      nextDelivery: "2025-04-28",
      usageRate: "5/day",
      status: "adequate"
    },
    {
      id: 5,
      name: "Soy Sauce",
      category: "Sauces/Dips",
      currentStock: 8,
      minStock: 10,
      unit: "liters",
      lastDelivery: "2025-04-14",
      nextDelivery: "2025-04-24",
      usageRate: "1/day",
      status: "low"
    },
    {
      id: 6,
      name: "Mango Puree",
      category: "Dessert Ingredients",
      currentStock: 5,
      minStock: 15,
      unit: "kg",
      lastDelivery: "2025-04-16",
      nextDelivery: "2025-04-23",
      usageRate: "2/day",
      status: "critical"
    }
  ];

  // Fetch inventory data
  useEffect(() => {
    // Instead of fetching from CSV, use mock data
    try {
      setLoading(true);
      setInventory(mockInventory);
      localStorage.setItem('inventory', JSON.stringify(mockInventory));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Filter inventory based on search and filter
  const filteredInventory = inventory.filter(item => {
    if (!item) return false;
    const matchesSearch = item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
                         item?.category?.toLowerCase()?.includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item?.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate inventory summary
  const inventorySummary = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item?.status === 'low').length,
    criticalStock: inventory.filter(item => item?.status === 'critical').length,
    adequateStock: inventory.filter(item => item?.status === 'adequate').length
  };

  // Handle reorder
  const handleReorder = (item) => {
    setSelectedItem(item);
    setReorderModalOpen(true);
  };

  const confirmReorder = () => {
    // Add to pending orders
    const newOrder = {
      id: Date.now(),
      itemName: selectedItem.name,
      quantity: orderQuantity * getDefaultOrderQuantity(selectedItem),
      unit: selectedItem.unit,
      orderDate: new Date().toISOString(),
      expectedDelivery: selectedItem.nextDelivery,
      status: 'pending'
    };
    setPendingOrders(prev => [...prev, newOrder]);
    
    setReorderModalOpen(false);
    setSelectedItem(null);
    setOrderQuantity(1);
  };

  // Handle edit
  const handleEdit = (item) => {
    const strippedUsageRate = item.usageRate.replace(/\s*\/day$/i, '');
    setSelectedItem(item);
    setEditedItem({ ...item, usageRate: strippedUsageRate });
    setEditModalOpen(true);
  };

  const confirmEdit = () => {
    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        const formattedUsageRate = editedItem.usageRate.includes('/day') ? 
          editedItem.usageRate : 
          `${editedItem.usageRate}/day`;
        const newStatus = calculateStatus(editedItem.currentStock, editedItem.minStock);
        return {
          ...editedItem,
          usageRate: formattedUsageRate,
          status: newStatus
        };
      }
      return item;
    });
    
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setEditModalOpen(false);
    setSelectedItem(null);
    setEditedItem(null);
  };

  // Helper functions
  const calculateStatus = (current, min) => {
    if (current <= min * 0.3) return 'critical';
    if (current <= min) return 'low';
    return 'adequate';
  };

  const getDefaultOrderQuantity = (item) => {
    if (item.unit === 'kg' || item.unit === 'liters') return 5;
    if (item.unit === 'pieces' || item.unit === 'packs') return 100;
    if (item.unit === 'boxes') return 2;
    return 1;
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

  const formatUsageRate = (rate) => {
    return rate.replace(/\s*\/day$/i, '');
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
          <h1 className="text-2xl font-bold text-gray-800">Dim Sum Inventory Management</h1>
          <div className="flex gap-3">
            <button 
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setPendingOrdersModalOpen(true)}
            >
              <FiRefreshCw className="mr-2" />
              Pending Orders
            </button>
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/add-item')}
            >
              <FiPlus className="mr-2" />
              Add New Item
            </button>
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatUsageRate(item.usageRate)}/day</td>
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
                          className="text-gray-600 hover:text-gray-800 mr-3"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => deleteItem(item)}
                        >
                          Delete
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
            AI Recommendations for Your Best Sellers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Pork Siu Mai</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Order more Siu Mai wrappers (+2000)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Switch to Supplier B for ground pork (8% cheaper)</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">BBQ Pork Buns</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Increase BBQ pork order by 20%</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Try premium bun flour for softer texture</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Shrimp Har Gow & Mango Pudding</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  <span>Bulk order whole shrimp (15% discount)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  <span>Seasonal mango supplier available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reorder Modal */}
        {reorderModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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

        {/* Edit Modal */}
        {editModalOpen && editedItem && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Edit {editedItem.name}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editedItem.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={editedItem.category}
                      onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stock
                      </label>
                      <input
                        type="number"
                        value={editedItem.currentStock}
                        onChange={(e) => setEditedItem({ ...editedItem, currentStock: parseInt(e.target.value) || 0 })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock
                      </label>
                      <input
                        type="number"
                        value={editedItem.minStock}
                        onChange={(e) => setEditedItem({ ...editedItem, minStock: parseInt(e.target.value) || 0 })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={editedItem.unit}
                        onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Rate
                      </label>
                      <input
                        type="text"
                        value={editedItem.usageRate}
                        onChange={(e) => setEditedItem({ ...editedItem, usageRate: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEdit}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Orders Modal */}
        {pendingOrdersModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Pending Orders
                  </h3>
                  <button
                    onClick={() => setPendingOrdersModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingOrders.length > 0 ? (
                        pendingOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-medium text-gray-900">{order.itemName}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {order.quantity} {order.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(order.expectedDelivery).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No pending orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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