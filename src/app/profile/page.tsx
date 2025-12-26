'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, UserPen, Settings } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <div className="px-8">
      <div className="flex items-center  px-6 pt-5  border-b border-gray-200">
          <div className="flex items-center gap-2 py-2">
            
            <h2 className="text-lg font-semibold text-gray-900 ">Micheal Jordan</h2>
          </div>
        </div>

        <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
             <ArrowLeftIcon/> Back
          </button>
         
        </div>

        <div className="bg-white p-6 ">
          <div className="flex items-center mb-6 border-b pb-4 border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gray-200 mr-6 flex items-center justify-center">
              <Image src="/login-pic.png" alt="Micheal Jordan" width={96} height={96} className="rounded-full" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">Micheal Jordan</p>
              <p className="text-sm text-gray-600"><span className='font-semibold'>Location:</span> Hanley Pond, Stoke-on-trent, Staffordshire</p>
              <p className="text-sm text-gray-600"><span className='font-semibold'>Phone Number:</span> +44 7823495738</p>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2">
              <UserPen size={20} /> Edit Profile
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-2">
              <Settings size={20} /> Settings
            </button>
          </div>

          <div className='bg-gray-100 py-12 px-8 rounded-2xl w-full'>
            <h2 className="text-lg font-semibold mb-1 border-b border-gray-200 py-4">Your medical information</h2>
            <p className="py-4 mb-2 border-b border-gray-200  mb-1"><span className="font-medium  ">Blood Type:</span> O+</p>
            <p className="py-4 mb-2 border-b border-gray-200  mb-1"><span className="font-medium  ">Allergies:</span> Lactose Intolerant, do not eat nuts</p>
            <p className="py-4 mb-2 border-b border-gray-200  mb-1"><span className="font-medium  ">Conditions:</span> ADHD, Hepatitis B</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

