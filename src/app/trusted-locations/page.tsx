'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, Map, MapPin } from 'lucide-react';

const TrustedLocationsPage: React.FC = () => {
  return (
    <Layout>
      <div className="px-8">
      <div className="flex items-center  px-6 pt-5  border-b border-gray-200">
        <div className="flex items-center gap-2 py-2">
          <MapPin size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900 ">Trusted Location</h2>
        </div>
        
      </div>

      <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
             <ArrowLeftIcon/> Back
          </button>
         
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <Image src="/globe.svg" alt="Home Address" width={48} height={48} className="rounded-full" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Home Address</p>
              <p className="text-sm text-gray-600">Hanley Park, Stoke-on-trent, Staffordshire, UK</p>
            </div>
          </div>

          <div className="flex items-center py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <Image src="/globe.svg" alt="Work Address" width={48} height={48} className="rounded-full" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Work Address</p>
              <p className="text-sm text-gray-600">Hanley Park, Stoke-on-trent, Staffordshire, UK</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrustedLocationsPage;

