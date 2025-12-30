'use client'
import React from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeft, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/api/hooks/useAuth';
import { toast } from 'react-toastify';

interface Alert {
  _id: string;
  type: string;
  status: string;
  location: {
    geocodedData: {
      formattedAddress: string;
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    coordinates: [number, number];
    staticMapUrl: string;
  };
  createdAt: string;
  assignedResponder?: {
    responderId: {
      fullName: string;
      phone: string;
    };
    routeInfo: {
      duration: {
        text: string;
      };
    };
  };
}

const IncidentLogsPage: React.FC = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['user-alerts'],
    queryFn: async () => {
      const { data } = await client.get('/alert/user-alerts');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { data } = await client.delete(`/alert/${alertId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Alert deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['user-alerts'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete alert');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-500';
      case 'resolved':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAlertType = (type: string) => {
    return type === 'manual' ? 'Panic Alert' : type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleDelete = (alertId: string) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      deleteMutation.mutate(alertId);
    }
  };

  const incidents: Alert[] = alertsData?.data || [];

  return (
    <Layout>
      <div className="px-8">
        <div className="flex items-center px-6 pt-5 border-b border-gray-200">
          <div className="flex items-center gap-2 py-2">
            <Clock size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Incident Logs</h2>
          </div>
        </div>

        <div className="flex items-center my-6">
          <button onClick={() => window.history.back()} className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft /> Back
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Loading incidents...</div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">No incidents found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incidents.map((incident) => (
              <div key={incident._id} className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    <Image 
                      src={incident.location.staticMapUrl || "/globe.svg"} 
                      alt="Location Map" 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{getAlertType(incident.type)}</p>
                    <p className="text-sm text-gray-600">{incident.location.geocodedData.formattedAddress}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-gray-50 w-fit flex items-center px-2 py-1 rounded-md">
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(incident.status)}`}></span>
                        <span className="text-xs text-gray-500 capitalize">{incident.status}</span>
                      </div>
                      {incident.assignedResponder && (
                        <div className="bg-blue-50 w-fit flex items-center px-2 py-1 rounded-md">
                          <span className="text-xs text-blue-600">
                            Responder: {incident.assignedResponder.responderId.fullName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(incident._id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IncidentLogsPage;