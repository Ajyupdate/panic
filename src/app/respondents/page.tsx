'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import ConnectingToRespondentModal from '@/components/ConnectingToRespondentModal';
import { Search, SearchCodeIcon } from 'lucide-react';
import Layout from '@/components/Layout';

const RespondentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const medicalCenters = [
    { name: 'J & J Medical center', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
    { name: 'Royal Stoke University...', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
    { name: 'Harplands Hospital', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
    { name: 'Mount Sinai Beth Israel...', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
    { name: 'NYU Langone Health', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
    { name: 'Lagos EKO Hospital', address: '550 First Avenue, New York, NY', distance: '0.34km away' },
  ];

  return (
    <Layout>
      <div className="px-8 pt-10">
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder='Search Respondent'
            className="flex-1 px-2 border-b border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      
        <div className="grid grid-cols-1 gap-4">
          {medicalCenters.map((center, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-4">
                  {/* Placeholder for hospital logo */}
                  <Image src="/respondent-image.png" alt="Hospital Logo" width={60} height={60} className="rounded" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{center.name}</p>
                  <p className="text-sm text-black">{center.address}</p>
                  <div className="flex items-center text-xs text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{center.distance}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleRequestClick}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Request
              </button>
            </div>
          ))}
        </div>

        <ConnectingToRespondentModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default RespondentsPage;

