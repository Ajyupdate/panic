'use client'
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Home, Briefcase, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/api/hooks/useAuth';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';


const validationSchema = Yup.object({
  name: Yup.string()
    .required('Location name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  
  isHome: Yup.boolean(),
  notes: Yup.string()
    .max(200, 'Notes must be at most 200 characters'),
});

const AddTrustedLocationPage = () => {
    const { client } = useAuth();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<'home' | 'work' | 'custom'>('custom');

  const addLocationMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
   
      isHome: boolean;
      notes?: string;
    }) => {
      const response = await client.post('/trusted-location', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Trusted location added successfully');
      queryClient.invalidateQueries({ queryKey: ['trusted-locations'] });
      window.history.back();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add trusted location');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
     
      isHome: false,
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      addLocationMutation.mutate(values);
    },
  });

  const handleLocationTypeSelect = (type: 'home' | 'work' | 'custom') => {
    setSelectedType(type);
    if (type === 'home') {
      formik.setFieldValue('name', 'Home');
      formik.setFieldValue('isHome', true);
    } else if (type === 'work') {
      formik.setFieldValue('name', 'Work');
      formik.setFieldValue('isHome', false);
    } else {
      formik.setFieldValue('name', '');
      formik.setFieldValue('isHome', false);
    }
  };

  return (
    <Layout>
        <div className="min-h-screen bg-white">
            <div className="px-8">
                <div className="flex items-center px-6 pt-5 border-b border-gray-200">
                <div className="flex items-center gap-2 py-2">
                    <MapPin size={20} className="text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-900">Add Trusted Location</h2>
                </div>
                </div>

                <div className="flex items-center my-6">
                <button 
                    onClick={() => window.history.back()} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
                </div>

                <div className="max-w-2xl">
                {/* Location Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => handleLocationTypeSelect('home')}
                        className={`flex flex-col items-center justify-center py-4 px-3 border-2 rounded-lg transition-all ${
                        selectedType === 'home'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Home size={24} className={selectedType === 'home' ? 'text-blue-600' : 'text-gray-600'} />
                        <span className={`mt-2 text-sm font-medium ${selectedType === 'home' ? 'text-blue-600' : 'text-gray-700'}`}>
                        Home
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleLocationTypeSelect('work')}
                        className={`flex flex-col items-center justify-center py-4 px-3 border-2 rounded-lg transition-all ${
                        selectedType === 'work'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Briefcase size={24} className={selectedType === 'work' ? 'text-blue-600' : 'text-gray-600'} />
                        <span className={`mt-2 text-sm font-medium ${selectedType === 'work' ? 'text-blue-600' : 'text-gray-700'}`}>
                        Work
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleLocationTypeSelect('custom')}
                        className={`flex flex-col items-center justify-center py-4 px-3 border-2 rounded-lg transition-all ${
                        selectedType === 'custom'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <MapPin size={24} className={selectedType === 'custom' ? 'text-blue-600' : 'text-gray-600'} />
                        <span className={`mt-2 text-sm font-medium ${selectedType === 'custom' ? 'text-blue-600' : 'text-gray-700'}`}>
                        Custom
                        </span>
                    </button>
                    </div>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name <span className="text-red-500">*</span>
                    </label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Home, Work, Gym"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        formik.touched.name && formik.errors.name
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    />
                    {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                    )}
                </div>

                {/* Address Field */}
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="e.g., 123 Main St, New York, NY 10001"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                        formik.touched.address && formik.errors.address
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    />
                    {formik.touched.address && formik.errors.address && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
                    )}
                </div>

                

                {/* Notes Field */}
                <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                    </label>
                    <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Add any additional notes about this location"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                        formik.touched.notes && formik.errors.notes
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    />
                    {formik.touched.notes && formik.errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.notes}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={addLocationMutation.isPending}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Cancel
                    </button>
                    <button
                    type="button"
                    onClick={() => formik.handleSubmit()}
                    disabled={addLocationMutation.isPending || !formik.isValid}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                    {addLocationMutation.isPending ? (
                        <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Adding...</span>
                        </>
                    ) : (
                        <span>Add Location</span>
                    )}
                    </button>
                </div>
                </div>
            </div>
        </div>
    </Layout>
    
  );
};

export default AddTrustedLocationPage;