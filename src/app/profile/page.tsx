'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, UserPen, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../api/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const {client} = useAuth()
  const {
    data: profile,
    isError: isProfileError,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await client.get("/auth/profile");
      return response.data.data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  
  console.log(profile)

  // Show loading state
  if (isProfileLoading) {
    return (
      <Layout>
        <div className="px-8 py-8">
          <p className="text-center text-gray-600">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (isProfileError || !profile) {
    return (
      <Layout>
        <div className="px-8 py-8">
          <p className="text-center text-red-600">Failed to load profile. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-8">
        <div className="flex items-center px-6 pt-5 border-b border-gray-200">
          <div className="flex items-center gap-2 py-2">
            <h2 className="text-lg font-semibold text-gray-900">{profile.fullName}</h2>
          </div>
        </div>

        <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon/> Back
          </button>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-center mb-6 border-b pb-4 border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gray-200 mr-6 flex items-center justify-center">
              <Image 
                src="/login-pic.png" 
                alt={profile.fullName} 
                width={96} 
                height={96} 
                className="rounded-full" 
              />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">{profile.fullName}</p>
              <p className="text-sm text-gray-600">
                <span className='font-semibold'>Email:</span> {profile.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className='font-semibold'>Phone Number:</span> {profile.phone}
              </p>
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
            <p className="py-4 mb-2 border-b border-gray-200">
              <span className="font-medium">Blood Type:</span> {profile.medicalInfo.bloodType || 'Not specified'}
            </p>
            <p className="py-4 mb-2 border-b border-gray-200">
              <span className="font-medium">Allergies:</span> {
                profile.medicalInfo.allergies.length > 0 
                  ? profile.medicalInfo.allergies.join(', ') 
                  : 'None specified'
              }
            </p>
            <p className="py-4 mb-2 border-b border-gray-200">
              <span className="font-medium">Conditions:</span> {
                profile.medicalInfo.conditions.length > 0 
                  ? profile.medicalInfo.conditions.join(', ') 
                  : 'None specified'
              }
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;