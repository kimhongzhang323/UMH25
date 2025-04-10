import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6 items-center">
          <img className="w-15 h-auto" src="public/grab-transparent.png" alt="Logo of Grab but transparent" />
          <p className='font-bold font-sans-serif text-xl'>HEX Assistant</p>
          <div className="flex space-x-4">
            <a href="/" className="hover:text-blue-300 transition-colors">Home</a>
            <a href="/chat" className="hover:text-blue-300 transition-colors">Chat</a>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-md shadow-lg p-2 z-10">
              <div className="p-2 border-b border-slate-200">
                <h3 className="font-bold">Notifications</h3>
              </div>
              <div className="p-2">
                <p className="text-sm text-slate-600">No new notifications</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
