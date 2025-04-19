import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
  const navigate = useNavigate();
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    currentStock: '',
    minStock: '',
    unit: '',
    usageRate: ''
  });

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

  const calculateStatus = (current, min) => {
    if (current <= min * 0.3) return 'critical';
    if (current <= min) return 'low';
    return 'adequate';
  };

  const handleNewItemSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Get existing inventory from localStorage
      const existingInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      
      // Ensure usage rate includes /day
      const usageRate = newItem.usageRate.includes('/day') 
        ? newItem.usageRate 
        : `${newItem.usageRate}/day`;
      
      // Create new item with all required properties
      const itemToAdd = {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category,
        currentStock: Number(newItem.currentStock),
        minStock: Number(newItem.minStock),
        unit: newItem.unit,
        status: calculateStatus(Number(newItem.currentStock), Number(newItem.minStock)),
        usageRate: usageRate,
        lastDelivery: new Date().toISOString().split('T')[0],
        nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // Add new item to inventory
      const updatedInventory = [...existingInventory, itemToAdd];
      
      // Save to localStorage
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));

      // Navigate back to inventory page
      navigate('/inventory');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
        </div>

        <form onSubmit={handleNewItemSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
              <input
                type="number"
                value={newItem.currentStock}
                onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock</label>
              <input
                type="number"
                value={newItem.minStock}
                onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usage Rate</label>
              <input
                type="text"
                value={newItem.usageRate}
                onChange={(e) => setNewItem({ ...newItem, usageRate: e.target.value })}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10/day"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;