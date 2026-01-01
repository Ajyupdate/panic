'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ConnectingToRespondentModal from '@/components/ConnectingToRespondentModal';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/api/hooks/useAuth';
import { toast } from 'react-toastify';

interface Responder {
  id: string;
  name: string;
  googlePlaceId: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: string;
  services: string[];
  emergencyServices: boolean;
  registrationStatus: string;
  country: string;
  city: string;
  distance: number;
  formattedDistance: string;
  availableResponders: number;
  totalAssignments: number;
  successfulAssignments: number;
}

const RespondentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { client } = useAuth();

  const getUserLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  useEffect(() => {
    getUserLocation()
      .then((location) => setUserLocation(location))
      .catch((error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to get your location');
      });
  }, []);

  const { data: respondersData, isLoading } = useQuery({
    queryKey: ['available-responders', userLocation],
    queryFn: async () => {
      if (!userLocation) return null;
      const { data } = await client.get(
        `/alert/available-responders?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );
      return data;
    },
    enabled: !!userLocation,
  });

  const handleRequestClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const responders: Responder[] = respondersData?.data?.facilities || [];

  const filteredResponders = responders.filter((responder) =>
    responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responder.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responder.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-8 pt-10">
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search Medical Facilities"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!userLocation ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Getting your location...</div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading medical facilities...</div>
          </div>
        ) : filteredResponders.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">
              {searchTerm ? 'No facilities found matching your search' : 'No medical facilities available nearby'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredResponders.map((facility) => (
              <div key={facility.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-4">
                    <Image 
                      src="/respondent-image.png" 
                      alt="Facility" 
                      width={60} 
                      height={60} 
                      className="rounded" 
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{facility.name}</p>
                    <p className="text-sm text-black">{facility.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-xs text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{facility.formattedDistance} away</span>
                      </div>
                      {facility.emergencyServices && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Emergency</span>
                      )}
                      {facility.availableResponders > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {facility.availableResponders} responder{facility.availableResponders > 1 ? 's' : ''} available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRequestClick}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        )}

        <ConnectingToRespondentModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </Layout>
  );
};

export default RespondentsPage;