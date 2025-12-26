import React from 'react';
import { Bell, Trash2 } from 'lucide-react';

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      name: 'Sarah',
      organization: 'J & J medical center',
      message: 'is 4min close to you',
      image: '/guard1.png',
      time: 'recent'
    },
    {
      id: 2,
      name: 'Asiyam',
      organization: 'J & J medical center',
      message: 'has arrived',
      image: '/guard1.png',
      time: 'recent'
    }
  ];

  return (
    <aside className="h-screen bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6  border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <a href="#" className="text-sm text-gray-500 hover:text-gray-700">View all</a>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className="flex items-start mx-4 gap-3 p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-orange-300 to-pink-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-2">
              <p className="text-sm text-gray-900 leading-relaxed">
                <span className="font-semibold ">{notification.name}</span>
                {' '}from {notification.organization}{' '}
                {notification.message}
              </p>
            </div>

            {/* Delete button */}
            <button 
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
              aria-label="Delete notification"
            >
              <Trash2 size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NotificationsPanel;