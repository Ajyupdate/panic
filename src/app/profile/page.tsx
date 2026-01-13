'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, UserPen, Settings, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../api/hooks/useAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const ProfilePage: React.FC = () => {
  const {client} = useAuth()
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
   
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    medicalInfo: {
      bloodType: '',
      allergies: [] as string[],
      conditions: [] as string[],
    },
    settings: {
      alertPreferences: {
        sms: true,
        push: true,
        email: true,
      },
      enableFallDetection: false,
      trustedLocations: [] as string[],
    },
  });

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

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await client.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const openEditModal = () => {
    if (profile) {
      // Split fullName into firstName and lastName
      const nameParts = profile.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        email: profile.email || '',
   
        firstName: firstName,
        lastName: lastName,
        phone: profile.phone || '',
        role: profile.role || 'user',
        medicalInfo: {
          bloodType: profile.medicalInfo?.bloodType || '',
          allergies: profile.medicalInfo?.allergies || [],
          conditions: profile.medicalInfo?.conditions || [],
        },
        settings: {
          alertPreferences: {
            sms: profile.settings?.alertPreferences?.sms ?? true,
            push: profile.settings?.alertPreferences?.push ?? true,
            email: profile.settings?.alertPreferences?.email ?? true,
          },
          enableFallDetection: profile.settings?.enableFallDetection ?? false,
          trustedLocations: profile.settings?.trustedLocations || [],
        },
      });
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('alertPreferences.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          alertPreferences: {
            ...prev.settings.alertPreferences,
            [key]: checked,
          },
        },
      }));
    } else if (name === 'enableFallDetection') {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          enableFallDetection: checked,
        },
      }));
    } else if (name.startsWith('medicalInfo.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleArrayInputChange = (field: 'allergies' | 'conditions', value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData((prev) => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        [field]: arrayValue,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <button 
              onClick={openEditModal}
              className="bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <UserPen size={20} /> Edit Profile
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center gap-2 w-full sm:w-auto">
              <Settings size={20} /> Settings
            </button>
            <button onClick={() => router.push('/respondents/register')} className="bg-green-500 text-black px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center gap-2 w-full sm:w-auto">
              Sign up as a respondent
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={updateProfileMutation.isPending}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-2">
              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Personal Information</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updateProfileMutation.isPending}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updateProfileMutation.isPending}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateProfileMutation.isPending}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateProfileMutation.isPending}
                    required
                  />
                </div>

                
              </div>

              {/* Medical Information */}
              <div className="mb-6 border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Medical Information</h4>
                
                <div className="mb-4">
                  <label htmlFor="medicalInfo.bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Type
                  </label>
                  <input
                    type="text"
                    id="medicalInfo.bloodType"
                    name="medicalInfo.bloodType"
                    value={formData.medicalInfo.bloodType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateProfileMutation.isPending}
                    placeholder="e.g., O+, A-, AB+"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    value={formData.medicalInfo.allergies.join(', ')}
                    onChange={(e) => handleArrayInputChange('allergies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateProfileMutation.isPending}
                    placeholder="e.g., Peanuts, Gluten, Shellfish"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="conditions"
                    value={formData.medicalInfo.conditions.join(', ')}
                    onChange={(e) => handleArrayInputChange('conditions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateProfileMutation.isPending}
                    placeholder="e.g., Diabetes, Asthma"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="mb-6 border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-lg">Settings</h4>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Alert Preferences</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="alertPreferences.sms"
                        checked={formData.settings.alertPreferences.sms}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={updateProfileMutation.isPending}
                      />
                      <span className="text-sm text-gray-700">SMS Alerts</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="alertPreferences.push"
                        checked={formData.settings.alertPreferences.push}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={updateProfileMutation.isPending}
                      />
                      <span className="text-sm text-gray-700">Push Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="alertPreferences.email"
                        checked={formData.settings.alertPreferences.email}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={updateProfileMutation.isPending}
                      />
                      <span className="text-sm text-gray-700">Email Alerts</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableFallDetection"
                      checked={formData.settings.enableFallDetection}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={updateProfileMutation.isPending}
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Fall Detection</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;