import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Filter, Search, Clock, User, ShoppingBag,
  ChevronDown, ChevronUp
} from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Icons
const orderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const merchantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const OrdersMapView = () => {
  const [orders] = useState([
    {
      id: 1,
      customer: 'Ahmad bin Ali',
      address: '123 Jalan Ampang, Kuala Lumpur',
      status: 'preparing',
      items: ['Zinger Burger', 'Cheese Fries', 'Pepsi'],
      total: 18.5,
      location: [3.1590, 101.7120],
      timePlaced: '2023-05-15T10:30:00',
      deliveryTime: '30-45 mins'
    },
    {
      id: 2,
      customer: 'Siti Nurhaliza',
      address: '456 Jalan Tun Razak, Kuala Lumpur',
      status: 'on-the-way',
      items: ['Twister Wrap', 'Coleslaw'],
      total: 12.75,
      location: [3.1520, 101.7170],
      timePlaced: '2023-05-15T10:45:00',
      deliveryTime: '15-30 mins'
    },
    {
      id: 3,
      customer: 'Rajesh Kumar',
      address: '789 Jalan Bukit Bintang, Kuala Lumpur',
      status: 'delivered',
      items: ['3pc Chicken Meal', 'Mashed Potato', 'Cola'],
      total: 24.9,
      location: [3.1480, 101.7130],
      timePlaced: '2023-05-15T10:15:00',
      deliveryTime: 'Delivered'
    },
    {
      id: 4,
      customer: 'Jennifer Lim',
      address: '321 Jalan Sultan Ismail, Kuala Lumpur',
      status: 'preparing',
      items: ['Popcorn Chicken', 'Milo'],
      total: 22.4,
      location: [3.1450, 101.7100],
      timePlaced: '2023-05-15T11:00:00',
      deliveryTime: '45-60 mins'
    }
  ]);

  const merchantBranches = [
    {
      id: 'm1',
      name: 'KFC KLCC',
      location: [3.1575, 101.7125],
    },
    {
      id: 'm2',
      name: 'KFC Pavilion',
      location: [3.1490, 101.7135],
    }
  ];

  const trafficData = [
    {
      from: [3.1500, 101.7120],
      to: [3.1550, 101.7150],
      congestion: 'high'
    },
    {
      from: [3.1480, 101.7100],
      to: [3.1520, 101.7170],
      congestion: 'medium'
    }
  ];

  const getTrafficColor = (level) => {
    switch (level) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const [filters, setFilters] = useState({
    status: 'all',
    timeRange: 'all',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const [mapCenter] = useState([3.1575, 101.7125]);
  const [mapZoom] = useState(14);

  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) {
      return false;
    }

    if (filters.timeRange !== 'all') {
      const now = new Date();
      const orderTime = new Date(order.timePlaced);
      const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));

      if (filters.timeRange === 'last30' && diffMinutes > 30) return false;
      if (filters.timeRange === 'last60' && diffMinutes > 60) return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !order.customer.toLowerCase().includes(query) &&
          !order.address.toLowerCase().includes(query) &&
          !order.items.some(item => item.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'on-the-way': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Preparing';
      case 'on-the-way': return 'On the way';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">KFC Active Orders Map</h1>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-1" />
            Filters
            {showFilters ? <ChevronUp className="h-5 w-5 ml-1" /> : <ChevronDown className="h-5 w-5 ml-1" />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md sm:text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="preparing">Preparing</option>
                <option value="on-the-way">On the Way</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md sm:text-sm"
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Minutes</option>
                <option value="last60">Last Hour</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Map + Legend + Orders */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="h-96 md:h-full md:w-2/3 relative">
          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded shadow-md text-sm z-[1000]">
            <div className="flex items-center space-x-2">
              <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" className="h-5" />
              <span>KFC Branch</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <img src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" className="h-5" />
              <span>Order Location</span>
            </div>
            <div className="mt-2">
              <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span> Low Traffic<br />
              <span className="inline-block w-3 h-3 bg-orange-500 mr-1 rounded-sm"></span> Medium Traffic<br />
              <span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span> High Traffic
            </div>
          </div>

          {/* Map */}
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Merchant Markers */}
            {merchantBranches.map(branch => (
              <Marker key={branch.id} position={branch.location} icon={merchantIcon}>
                <Popup>
                  <strong>{branch.name}</strong><br />
                  KFC Branch
                </Popup>
              </Marker>
            ))}

            {/* Order Markers */}
            {filteredOrders.map(order => (
              <Marker key={order.id} position={order.location} icon={orderIcon}>
                <Popup>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {order.customer}
                      </div>
                      <div className="truncate">{order.address}</div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {order.deliveryTime}
                      </div>
                      <div className="mt-1 font-medium">Items:</div>
                      <ul className="list-disc list-inside">
                        {order.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <div className="text-sm font-medium mt-1">
                        Total: RM{order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Simulated Traffic */}
            {trafficData.map((line, i) => (
              <Polyline
                key={i}
                positions={[line.from, line.to]}
                color={getTrafficColor(line.congestion)}
                weight={6}
                opacity={0.6}
              />
            ))}
          </MapContainer>
        </div>

        {/* Order List */}
        <div className="hidden md:block md:w-1/3 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Orders ({filteredOrders.length})
            </h2>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders match your filters</div>
            ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {order.customer}
                        </div>
                        <div className="truncate">{order.address}</div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {order.deliveryTime}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        {order.items.length} items
                      </div>
                      <div className="mt-2 text-right font-medium">
                        RM{order.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersMapView;
