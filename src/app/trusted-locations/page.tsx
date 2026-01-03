'use client'
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../api/hooks/useAuth';
import Layout from '@/components/Layout';


const TrustedLocationsPage = () => {
  const { client } = useAuth();
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const { data: locationsData, isLoading, error } = useQuery({
    queryKey: ['trusted-locations'],
    queryFn: async () => {
      const { data } = await client.get('/trusted-location');
      return data;
    },
  });

  const locations = locationsData?.data?.locations || [];

  const handleAddLocation = () => {
    setIsAddingLocation(true);
    window.location.href = '/trusted-locations/add-trusted-location';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-8">
          <div className="flex items-center px-6 pt-5 border-b border-gray-200">
            <div className="flex items-center gap-2 py-2">
              <MapPin size={20} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Trusted Location</h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-8">
          <div className="flex items-center px-6 pt-5 border-b border-gray-200">
            <div className="flex items-center gap-2 py-2">
              <MapPin size={20} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Trusted Location</h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <p className="text-red-600">Failed to load locations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="px-8">
          <div className="flex items-center px-6 pt-5 border-b border-gray-200">
            <div className="flex items-center gap-2 py-2">
              <MapPin size={20} className="text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Trusted Location</h2>
            </div>
          </div>

          <div className="flex items-center justify-between my-6">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleAddLocation}
              disabled={isAddingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              <span>Add Location</span>
            </button>
          </div>

          {locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trusted Locations</h3>
              <p className="text-gray-500 mb-6">Add your first trusted location to get started</p>
              <button
                onClick={handleAddLocation}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Add Location</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-8">
              {locations.map((location: { _id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; coordinates: { coordinates: number[]; }; radius: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; distanceFromCurrent: number; }) => (
                <div 
                  key={location._id} 
                  className="flex items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-2"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
                    <MapPin size={24} className="text-gray-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{location.name}</p>
                    <p className="text-sm text-gray-600">
                      Coordinates: {location.coordinates.coordinates[1].toFixed(6)}, {location.coordinates.coordinates[0].toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Radius: {location.radius}m
                      {location.distanceFromCurrent && (
                        <span> • {location.distanceFromCurrent.toFixed(2)}km away</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrustedLocationsPage;