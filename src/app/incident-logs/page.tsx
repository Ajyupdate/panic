'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, Clock } from 'lucide-react';

const IncidentLogsPage: React.FC = () => {
  const incidents = [
    { id: 1, type: 'Panic Attack', location: 'Hanley Park, Stoke-on-trent, Staffordshire, UK', status: 'Active' },
    { id: 2, type: 'Panic Attack', location: 'Hanley Park, Stoke-on-trent, Staffordshire, UK', status: 'Resolved' },
    { id: 3, type: 'Panic Attack', location: 'Hanley Park, Stoke-on-trent, Staffordshire, UK', status: 'Cancelled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-500';
      case 'Resolved':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="px-8">
        <div className="flex items-center  px-6 pt-5  border-b border-gray-200">
          <div className="flex items-center gap-2 py-2">
            <Clock size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900 ">Incident Logs</h2>
          </div>
        </div>

        <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
             <ArrowLeftIcon/> Back
          </button>
         
        </div>

        <div className="grid grid-cols-1 gap-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between  p-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <Image src="/globe.svg" alt="Map" width={48} height={48} className="rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{incident.type}</p>
                  <p className="text-sm text-gray-600">{incident.location}</p>
                  <div className="bg-gray-50 w-fit flex items-center mt-1 px-2 py-1 rounded-md">
                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(incident.status)}`}></span>
                    <span className="text-xs text-gray-500">{incident.status}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500">
                {/* Delete icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default IncidentLogsPage;

