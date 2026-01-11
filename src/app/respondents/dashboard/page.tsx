'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/api/hooks/useAuth';

import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Navigation,
  Heart,
  Activity,
  Siren
} from 'lucide-react';
import { toast } from 'react-toastify';

const RespondentDashboardPage = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Fetch respondent profile
  const { data: profileData } = useQuery({
    queryKey: ['respondent-profile'],
    queryFn: async () => {
      const { data } = await client.get('/responder/profile');
      return data;
    },
  });

  const profile = profileData?.data;

  // Fetch assigned alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['assigned-alerts'],
    queryFn: async () => {
      const { data } = await client.get('/responder/alerts/assigned-alerts');
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const alerts = alertsData?.data || [];

  // Acknowledge alert mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await client.post(`/responder/alerts/acknowledge/${alertId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Alert acknowledged successfully');
      queryClient.invalidateQueries({ queryKey: ['assigned-alerts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to acknowledge alert');
    },
  });

  // Resolve alert mutation
  const resolveMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await client.post(`/responder/alerts/resolve/${alertId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Alert resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['assigned-alerts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve alert');
    },
  });

  // Cancel alert mutation
  const cancelMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await client.post(`/responder/alerts/cancel/${alertId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Alert cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['assigned-alerts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel alert');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-[#FF0000] border-yellow-300';
      case 'acknowledged':
        return 'bg-blue-100 text-[#EEC408] border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-[#47D63A] border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-[#3A3A3A] border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'panic':
        return <Siren className="text-red-600" size={24} />;
      case 'manual':
        return <AlertCircle className="text-orange-600" size={24} />;
      default:
        return <AlertCircle className="text-gray-600" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Respondent Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile?.fullName || 'Respondent'}!</p>
        </div>

        {/* Profile Summary Card */}
        {profile && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User size={24} className="text-indigo-600" />
              My Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  profile.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {profile.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="font-semibold capitalize">{profile.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold">{profile.experienceYears} years</p>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Alerts */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity size={28} className="text-indigo-600" />
            Assigned Alerts
            <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
              {alerts.length}
            </span>
          </h2>

          {alertsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Alerts Assigned</h3>
              <p className="text-gray-500">You'll see new alerts here when they're assigned to you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: { _id: string;
               type: string; status: string; createdAt: string | number | Date; userId: { fullName: any; phone: any; medicalInfo: { bloodType: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; conditions: any[]; allergies: any[]; }; }; location: { geocodedData: { formattedAddress: any; city: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; state: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; address: any; coordinates: number[]; }; assignedResponder: { routeInfo: { distance: { text: any; }; duration: { text: any; }; estimatedArrival: string | number | Date; }; }; }) => (
                <div 
                  key={alert._id} 
                  className="bg-white rounded-lg shadow-sm border-l-4 border-indigo-600 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Alert Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        {getAlertTypeIcon(alert.type)}
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            Alert #{alert._id.slice(-6).toUpperCase()}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">{alert.type} Alert</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium">{new Date(alert.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User size={18} className="text-gray-600" />
                        Patient Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold">{alert.userId?.fullName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Phone size={16} />
                            {alert.userId?.phone || 'N/A'}
                          </p>
                        </div>
                        {alert.userId?.medicalInfo?.bloodType && (
                          <div>
                            <p className="text-sm text-gray-600">Blood Type</p>
                            <p className="font-semibold">{alert.userId.medicalInfo.bloodType}</p>
                          </div>
                        )}
                        {alert.userId?.medicalInfo?.conditions?.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600">Conditions</p>
                            <p className="font-semibold">{alert.userId.medicalInfo.conditions.join(', ')}</p>
                          </div>
                        )}
                        {alert.userId?.medicalInfo?.allergies?.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Allergies</p>
                            <p className="font-semibold text-red-600">{alert.userId.medicalInfo.allergies.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        Location
                      </h4>
                      <p className="text-sm mb-2">{alert.location?.geocodedData?.formattedAddress || alert.location?.address || 'Location unavailable'}</p>
                      {alert.location?.geocodedData && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="text-gray-600">City:</span> {alert.location.geocodedData.city}</p>
                          <p><span className="text-gray-600">State:</span> {alert.location.geocodedData.state}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Coordinates: {alert.location?.coordinates?.[1]?.toFixed(6)}, {alert.location?.coordinates?.[0]?.toFixed(6)}
                      </p>
                    </div>

                    {/* Route Info */}
                    {alert.assignedResponder?.routeInfo && (
                      <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Navigation size={18} className="text-green-600" />
                          Route Information
                        </h4>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Distance</p>
                            <p className="font-semibold">{alert.assignedResponder.routeInfo.distance?.text || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-semibold">{alert.assignedResponder.routeInfo.duration?.text || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">ETA</p>
                            <p className="font-semibold">
                              {alert.assignedResponder.routeInfo.estimatedArrival 
                                ? new Date(alert.assignedResponder.routeInfo.estimatedArrival).toLocaleTimeString()
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      {alert.status === 'active' && (
                        <>
                          <button
                            onClick={() => acknowledgeMutation.mutate(alert._id)}
                            disabled={acknowledgeMutation.isPending}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={20} />
                            {acknowledgeMutation.isPending ? 'Acknowledging...' : 'Acknowledge'}
                          </button>
                          <button
                            onClick={() => cancelMutation.mutate(alert._id)}
                            disabled={cancelMutation.isPending}
                            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle size={20} />
                            {cancelMutation.isPending ? 'Cancelling...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <button
                          onClick={() => resolveMutation.mutate(alert._id)}
                          disabled={resolveMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart size={20} />
                          {resolveMutation.isPending ? 'Resolving...' : 'Mark as Resolved'}
                        </button>
                      )}
                      {(alert.status === 'resolved' || alert.status === 'cancelled') && (
                        <div className="flex-1 text-center py-3">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            alert.status === 'resolved' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {alert.status === 'resolved' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            {alert.status === 'resolved' ? 'Completed' : 'Cancelled'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live Tracking Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={28} className="text-indigo-600" />
            Live Alert Tracking
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Live tracking map will appear here</p>
            <p className="text-sm text-gray-400 mt-2">Integration with map component coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RespondentDashboardPage;