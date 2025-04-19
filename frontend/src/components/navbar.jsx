import { useState } from 'react';
import { LayoutDashboard, User, UserCog, Bell, MessageSquare, Home, Menu, X, ShoppingCart, AlertTriangle, Star, Truck, CreditCard, Map, Users, Settings, Warehouse, DollarSign, LogOut, UtensilsCrossed } from 'lucide-react';

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

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
    }
  ];

  const unreadCount = notifications.length;

  // Menu items with submenus
  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/chat'
    },
    
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard'
    },
    {
      id: 'customer-service',
      label: 'Customer Service',
      icon: <Users className="h-5 w-5" />,
      href: '/customer-service'
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: <DollarSign className="h-5 w-5" />,
      submenu: [
        {
          label: 'Sales & Income',
          icon: <DollarSign className="h-4 w-4" />,
          href: '/sales-income'
        },
        {
          label: 'Menu',
          icon: <UtensilsCrossed className="h-4 w-4" />,
          href: '/menu'
        },
        {
          label: 'Inventory',
          icon: <Warehouse className="h-4 w-4" />,
          href: '/inventory'
        }
      ]
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: <UserCog className="h-5 w-5" />,
      href: '/staff-manager'
    }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/30"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/grab-transparent.png"
              alt="Grab logo"
            />
            <span className="ml-3 text-xl font-semibold text-gray-900">
              MEX Assistant
            </span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 flex flex-col">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div className="mb-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-900 hover:text-green-600 hover:bg-gray-50 rounded-md">
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </button>
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
                        onClick={toggleMobileMenu}
                      >
                        {subItem.icon}
                        <span className="ml-2">{subItem.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-green-600 hover:bg-gray-50 rounded-md mb-2"
                  onClick={toggleMobileMenu}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              )}
            </div>
          ))}
          <a
            href="/logout"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-green-600 hover:bg-gray-50 rounded-md mt-2"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Log Out</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky w-full top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
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
                  MEX Assistant
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex space-x-2">
                {menuItems.map((item) => (
                  <div 
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <a
                      href={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                        hoveredItem === item.id ? 'text-green-600' : 'text-gray-900'
                      } hover:text-green-600 transition-colors`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </a>
                    
                    {item.submenu && hoveredItem === item.id && (
                      <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          {item.submenu.map((subItem) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
                            >
                              {subItem.icon}
                              <span className="ml-2">{subItem.label}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-colors relative"
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
                                <button className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 px-2 py-1 rounded transition-colors hover:cursor-pointer">
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
              
              <a
                href="/profile"
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-colors"
                aria-label="Profile"
              >
                <User size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}