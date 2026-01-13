import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationsPanel from './NotificationsPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-black relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-lg font-semibold">Guardian</h1>
        
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg relative"
          aria-label="Toggle notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 lg:w-[20%] lg:min-w-[240px]
          bg-white shadow-md lg:shadow-md
          pt-16 lg:pt-[2.5%]
          overflow-y-auto
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:w-[45%] flex flex-col lg:border-r border-gray-200 pt-16 lg:pt-[2.5%] overflow-y-auto">
        <div className="flex-1 px-4 lg:px-0">
          {children}
        </div>
      </main>

      {/* Mobile Notifications Overlay */}
      {isNotificationsOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsNotificationsOpen(false)}
        />
      )}

      {/* Notifications Panel */}
      <div
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isNotificationsOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          w-80 lg:w-[35%] lg:min-w-[320px]
          bg-white shadow-md lg:shadow-none
          pt-16 lg:pt-[5%]
          overflow-y-auto
        `}
      >
        <NotificationsPanel />
      </div>
    </div>
  );
};

export default Layout;