'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/api/hooks/useAuth';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  hospital: Yup.string().optional(),
  certifications: Yup.array()
    .optional(),
  experienceYears: Yup.number()
    .required('Experience years is required')
    .min(0, 'Experience must be at least 0 years')
    .max(50, 'Experience must be at most 50 years'),
  vehicleType: Yup.string()
    .required('Vehicle type is required')
    .oneOf(['car', 'motorcycle', 'bicycle', 'foot'], 'Invalid vehicle type'),
  licenseNumber: Yup.string()
    .required('License number is required')
    .min(3, 'License number must be at least 3 characters'),
  maxDistance: Yup.number()
    .required('Maximum distance is required')
    .min(1, 'Distance must be at least 1 km')
    .max(100, 'Distance must be at most 100 km'),
  bio: Yup.string()
    .optional(),
  currentLocation: Yup.object({
    coordinates: Yup.array()
      .of(Yup.number())
      .length(2, 'Coordinates must have longitude and latitude')
      .required('Location coordinates are required'),
  }).required('Current location is required'),
});

const RespondentRegisterPage = () => {
  const {client} = useAuth()
  const queryClient = useQueryClient();
  const router = useRouter();
  const [certificationInput, setCertificationInput] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Fetch hospitals list
  const { data: hospitalsData, isLoading: hospitalsLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data } = await client.get('/hospitals');
      return data;
    },
  });

  const hospitals = [{_id: '6957de6aa160fdace7e54d96', name: 'Default Hospital'}];

  // Create default availability (all false)
  const createDefaultAvailability = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availability: { [key: string]: boolean[] } = {};
    days.forEach(day => {
      availability[day] = Array(24).fill(false);
    });
    return availability;
  };

  const registerRespondentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await client.post('/responder/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Respondent registration successful!');
      router.push('/respondents/dashboard');
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    },
  });

  const formik = useFormik({
    initialValues: {
      hospital: '6957de6aa160fdace7e54d96',
      certifications: [],
      experienceYears: 0,
      vehicleType: 'car',
      licenseNumber: '',
      maxDistance: 25,
      bio: '',
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0],
      },
      availability: createDefaultAvailability(),
    },
    validationSchema,
    onSubmit: (values) => {
      registerRespondentMutation.mutate(values);
    },
  });

  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      const newCerts = [...formik.values.certifications, certificationInput.trim()];
      formik.setFieldValue('certifications', newCerts);
      setCertificationInput('');
    }
  };

  const handleRemoveCertification = (index: number) => {
    const newCerts = formik.values.certifications.filter((_, i) => i !== index);
    formik.setFieldValue('certifications', newCerts);
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          formik.setFieldValue('currentLocation.coordinates', [
            position.coords.longitude,
            position.coords.latitude,
          ]);
          setIsGettingLocation(false);
          toast.success('Location captured successfully');
        },
        (error) => {
          setIsGettingLocation(false);
          toast.error('Failed to get location. Please enable location services.');
        }
      );
    } else {
      setIsGettingLocation(false);
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const toggleAvailability = (day: string, hour: number) => {
    const newAvailability = { ...formik.values.availability };
    newAvailability[day][hour] = !newAvailability[day][hour];
    formik.setFieldValue('availability', newAvailability);
  };

  const setDayAvailability = (day: string, available: boolean) => {
    const newAvailability = { ...formik.values.availability };
    newAvailability[day] = Array(24).fill(available);
    formik.setFieldValue('availability', newAvailability);
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-white text-black">
      <div className="flex-1 flex flex-col justify-center py-12 px-2 sm:px-6 lg:flex-none lg:px-10 xl:px-10 bg-white text-black lg:w-2/5">
        <div className="px-6">
          <div>
            <div className="flex gap-2">
              <Image
                className="h-8 w-auto"
                src="/guard1.png"
                alt="Guardian"
                width={50}
                height={50}
              />
              <h2 className="text-2xl font-extrabold text-dark">Guardian</h2>
            </div>
            <h2 className="mt-6 text-xl">Join Guardian Angel - Respondent Network</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-6">
                {/* Hospital Selection */}
                <div>
                  <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="hospital"
                    name="hospital"
                    value={formik.values.hospital}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={hospitalsLoading}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.hospital && formik.errors.hospital ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a hospital</option>
                    {hospitals.map((hospital: any) => (
                      <option key={hospital._id} value={hospital._id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.hospital && formik.errors.hospital && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.hospital}</p>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                      placeholder="e.g., CPR, First Aid, EMT"
                      className="flex-1 bg-gray-100 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddCertification}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formik.values.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {formik.touched.certifications && formik.errors.certifications && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.certifications}</p>
                  )}
                </div>

                {/* Experience Years */}
                <div>
                  <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    value={formik.values.experienceYears}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.experienceYears && formik.errors.experienceYears ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.experienceYears && formik.errors.experienceYears && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.experienceYears}</p>
                  )}
                </div>

                {/* Vehicle Type */}
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formik.values.vehicleType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.vehicleType && formik.errors.vehicleType ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="foot">On Foot</option>
                  </select>
                  {formik.touched.vehicleType && formik.errors.vehicleType && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.vehicleType}</p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    placeholder="MED12345"
                    value={formik.values.licenseNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.licenseNumber && formik.errors.licenseNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.licenseNumber}</p>
                  )}
                </div>

                {/* Max Distance */}
                <div>
                  <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Response Distance (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="maxDistance"
                    name="maxDistance"
                    type="number"
                    value={formik.values.maxDistance}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.maxDistance && formik.errors.maxDistance ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.maxDistance && formik.errors.maxDistance && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.maxDistance}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell us about your experience and skills..."
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none ${
                      formik.touched.bio && formik.errors.bio ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.bio && formik.errors.bio && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.bio}</p>
                  )}
                </div>

                {/* Current Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 px-3 py-4 rounded-md shadow-sm hover:bg-gray-200 transition-colors"
                  >
                    <MapPin size={20} />
                    {isGettingLocation ? 'Getting location...' : 
                      formik.values.currentLocation.coordinates[0] !== 0 
                        ? `Location captured: ${formik.values.currentLocation.coordinates[1].toFixed(6)}, ${formik.values.currentLocation.coordinates[0].toFixed(6)}`
                        : 'Capture Current Location'}
                  </button>
                  {formik.touched.currentLocation && formik.errors.currentLocation && typeof formik.errors.currentLocation === 'string' && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.currentLocation}</p>
                  )}
                </div>

                {/* Availability Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Weekly Availability
                  </label>
                  <div className="space-y-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{day}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDayAvailability(day, true)}
                              className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                            >
                              All Day
                            </button>
                            <button
                              type="button"
                              onClick={() => setDayAvailability(day, false)}
                              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-1">
                          {Array.from({ length: 24 }).map((_, hour) => (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => toggleAvailability(day, hour)}
                              className={`text-xs p-1 rounded ${
                                formik.values.availability[day][hour]
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                              title={`${hour}:00`}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => formik.handleSubmit()}
                    disabled={registerRespondentMutation.isPending}
                    className="flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002147] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full"
                  >
                    {registerRespondentMutation.isPending ? 'Registering...' : 'Register'} <span className="ml-2">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:w-3/5 lg:min-h-screen">
        <Image src="/signup-pic.png" alt="" fill className="object-cover" />
      </div>
    </div>
  );
};

export default RespondentRegisterPage;