import { useState } from 'react';
import { Bell, MessageSquare, Home, Menu, X, ShoppingCart, AlertTriangle, Star, Truck, CreditCard, Map, Users,Settings,Warehouse } from 'lucide-react';

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      type: 'message',
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: 'New customer message',
      content: 'You have 3 unread messages from customers',
      time: '5 min ago',
      action: 'View messages'
    },
    {
      id: 2,
      type: 'order',
      icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
      title: 'New order received',
      content: 'Order #4567 for RM 85.50 from John D.',
      time: '15 min ago',
      action: 'View order'
    },
    {
      id: 3,
      type: 'alert',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      title: 'Low stock alert',
      content: 'Only 2 portions of Nasi Lemak remaining',
      time: '1 hour ago',
      action: 'Restock now'
    },
    {
      id: 4,
      type: 'review',
      icon: <Star className="h-5 w-5 text-amber-500" />,
      title: 'New 5-star review',
      content: 'Customer rated their experience 5 stars',
      time: '2 hours ago',
      action: 'See review'
    },
    {
      id: 5,
      type: 'delivery',
      icon: <Truck className="h-5 w-5 text-purple-500" />,
      title: 'Delivery update',
      content: 'Order #4561 is out for delivery',
      time: '3 hours ago',
      action: 'Track order'
    },
    {
      id: 6,
      type: 'payment',
      icon: <CreditCard className="h-5 w-5 text-emerald-500" />,
      title: 'Payment received',
      content: 'RM 120.80 payment processed successfully',
      time: '1 day ago',
      action: 'View receipt'
    }
  ];

  const unreadCount = notifications.length; // In real app, filter for unread

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              className="h-8 w-auto" 
              src="/grab-transparent.png" 
              alt="Grab logo" 
            />
            <span className="ml-3 text-xl font-semibold text-gray-900">
              HEX Assistant
            </span>
          </div>
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <a 
            href="/" 
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-green-600 hover:bg-gray-50 rounded-md mb-2"
            onClick={toggleMobileMenu}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </a>
          <a 
            href="/chat" 
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
            onClick={toggleMobileMenu}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Chat
          </a>
          <a 
            href="/orders" 
            className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
          >
            <Map className="mr-2 h-4 w-4" />
            Map
          </a>
          <a 
                  href="/customer-service" 
                  className="flex items-center pb-1 pr-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Customer Service
          </a>
          <a 
                  href="/inventory" 
                  className="flex items-center pb-1 pr-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <Warehouse className="mr-3 h-5 w-5" />
                  Inventory
          </a>
          <a 
            href="/profile" 
            className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            Profile
          </a>          


        </div>
      </div>

      {/* Main Navbar */}
      <nav className="relative w-full top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="flex items-center">
                <img 
                  className="h-8 w-auto" 
                  src="/grab-transparent.png" 
                  alt="Grab logo" 
                />
                <span className="ml-3 text-xl font-semibold text-gray-900 hidden md:block">
                  HEX Assistant
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-6">
                <a 
                  href="/" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-green-600 transition-colors"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </a>
                <a 
                  href="/chat" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </a>
                <a 
                  href="/orders" 
                  className="flex items-center pb-1 pr-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <Map className="mr-3 h-5 w-5" />
                  Map
                </a>
                <a 
                  href="/customer-service" 
                  className="flex items-center pb-1 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Customer Service
                </a>
                <a 
                  href="/inventory" 
                  className="flex items-center pb-1 pr-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <Warehouse className="mr-3 h-5 w-5" />
                  Inventory
                </a>
                <a 
                  href="/profile" 
                  className="inline-flex items-center pt-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </a>  
              </div>
            </div>

            {/* Right side - Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">{unreadCount} unread notifications</p>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {notification.icon}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.content}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-gray-400">
                                {notification.time}
                              </p>
                              <button className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded transition-colors">
                                {notification.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                    <a 
                      href="#" 
                      className="text-xs font-medium text-green-600 hover:text-green-800 block text-center"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}