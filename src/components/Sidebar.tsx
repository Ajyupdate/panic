import React from 'react';
import { Home, Users, Phone, FileText, MapPin, Bell } from 'lucide-react';
import Image from 'next/image';

const Sidebar = () => {
  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col px-8">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 px-4 py-4">  
        <Image
              className="h-8 w-auto"
              src="/guard1.png"
              alt="Guardian"
              width={50}
              height={50}
            />
        <h2 className="text-2xl font-bold text-gray-900">Guardian</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <a href="/" className="flex items-center gap-3 py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Home size={20} />
              <span className="font-medium">Home</span>
            </a>
          </li>
          <li>
            <a href="/emergency-contacts" className=" flex items-center gap-3 py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Phone size={20} />
              <span className="font-medium">Emergency Contacts</span>
            </a>
          </li>
          <li>
            <a href="/incident-logs" className="flex items-center gap-3 py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText size={20} />
              <span className="font-medium">Incident Logs</span>
            </a>
          </li>
          <li>
            <a href="/trusted-locations" className="flex items-center gap-3 py-3 px-4 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <MapPin size={20} />
              <span className="font-medium">Trusted Locations</span>
            </a>
          </li>
        </ul>
      </nav>

    
      {/* Panic Alert Button */}
      <div className="my-8">
        <button className="w-full flex flex-col items-center justify-center py-6 px-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-3 shadow-lg">
            {/* <Bell size={32} className="text-white" /> */}
          </div>
          <span className="font-semibold text-gray-900">Panic Alert</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="pt-4  bg-gray-100 rounded-xl">
        <a href="/profile" className="flex items-center gap-6 pb-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
          </div>
          <span className="font-medium text-gray-900 ">Micheal Jordan</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;