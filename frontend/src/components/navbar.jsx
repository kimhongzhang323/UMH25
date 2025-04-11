import { useState } from 'react';
import { Bell, MessageSquare, Home } from 'lucide-react';

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <nav className="relative top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Original Grab logo with HEX Assistant text */}
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

            {/* Navigation Links */}
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
            </div>
          </div>

          {/* Right side - Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {/* Notification indicator */}
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-500">No new notifications</p>
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <a 
                    href="#" 
                    className="text-xs font-medium text-green-600 hover:text-green-800"
                  >
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex justify-center pt-2 pb-4">
          <div className="flex space-x-8">
            <a 
              href="/" 
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 hover:text-green-600 hover:bg-gray-50 rounded-md"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </a>
            <a 
              href="/chat" 
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 hover:text-green-600 hover:bg-gray-50 rounded-md"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}