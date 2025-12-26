
import React from 'react';
import Sidebar from './Sidebar';
import NotificationsPanel from './NotificationsPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar - approximately 20% */}
      <div className="shadow-md w-[25%] min-w-[240px] pt-[2.5%]">
        <Sidebar />
      </div>

      {/* Main content - approximately 45% */}
      <main className="w-[40%] flex flex-col border-r border-gray-200 pt-[2.5%] ">
        <div className="flex-1 ">
          {children}
        </div>
      </main>

      {/* Notifications Panel - approximately 35% */}
      <div className="w-[35%] min-w-[320px] pt-[5%]">
        <NotificationsPanel />
      </div>
    </div>
  );
};

export default Layout;

