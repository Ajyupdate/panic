'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { ArrowLeftIcon, PhoneCall, X, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../api/hooks/useAuth';
import { toast } from 'react-toastify';


const EmergencyContactsPage: React.FC = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const contacts = [
    { id: 1, name: 'Sarah Churchill', role: 'care supporter', image: '/guard1.png' },
    { id: 2, name: 'Amitabh Bachchan', role: 'Doctor', image: '/login-pic.png' },
    { id: 3, name: 'Sydney Sweeney', role: 'Sister', image: '/guard1.png' },
    { id: 4, name: 'Jacob Jordan', role: 'Father', image: '/login-pic.png' },
  ];

  const addContactMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; relationship: string }) => {
      const response = await client.post('/user/emergency-contacts', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Emergency contact added successfully');
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', relationship: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add emergency contact');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.relationship) {
      toast.error('Please fill in all fields');
      return;
    }

    addContactMutation.mutate(formData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', relationship: '' });
  };

  return (
    <Layout>
      <div className="px-8">
        <div className="flex items-center px-6 pt-5 border-b border-gray-200">
          <div className="flex items-center gap-2 py-2">
            <PhoneCall size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Emergency Contacts</h2>
          </div>
        </div>

        <div className="flex items-center justify-between my-6">
          <button
            onClick={() => window.history.back()}
            className="flex gap-4 mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon /> Back
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#002147] text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={20} />
            Add emergency contact
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 border-b border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <Image
                    src={contact.image}
                    alt={contact.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Emergency Contact</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={addContactMutation.isPending}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact name"
                  disabled={addContactMutation.isPending}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  disabled={addContactMutation.isPending}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Father, Sister, Doctor"
                  disabled={addContactMutation.isPending}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={addContactMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#002147] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={addContactMutation.isPending}
                >
                  {addContactMutation.isPending ? 'Adding...' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmergencyContactsPage;