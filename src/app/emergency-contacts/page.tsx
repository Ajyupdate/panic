'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeft, ArrowLeftIcon, PhoneCall } from 'lucide-react';

const EmergencyContactsPage: React.FC = () => {
  const contacts = [
    { id: 1, name: 'Sarah Churchill', role: 'care supporter', image: '/guard1.png' },
    { id: 2, name: 'Amitabh Bachchan', role: 'Doctor', image: '/login-pic.png' },
    { id: 3, name: 'Sydney Sweeney', role: 'Sister', image: '/guard1.png' },
    { id: 4, name: 'Jacob Jordan', role: 'Father', image: '/login-pic.png' },
  ];

  return (
    <Layout>

      <div className="px-8">
      <div className="flex items-center  px-6 pt-5  border-b border-gray-200">
        <div className="flex items-center gap-2 py-2">
          <PhoneCall size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900 ">Emergency Contacts</h2>
        </div>
        
      </div>
        <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
             <ArrowLeftIcon/> Back
          </button>
         
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 border-b border-gray-100 ">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <Image src={contact.image} alt={contact.name} width={48} height={48} className="rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-500">
                {/* Call icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyContactsPage;

