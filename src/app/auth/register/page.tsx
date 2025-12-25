'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { SuccessAlert, ErrorAlert } from '@/components/Alert';
import { apiUrl, useAuth } from '@/app/api/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter()
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    fullName: Yup.string().required('Required'),
    phone: Yup.string()
      .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number')
      .required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });


  const formik = useFormik({
    initialValues: {
      email: '',
      fullName: '',
      phone: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
         
          setAlertMessage({ type: 'success', message: 'Registration successful!' });
          setTimeout(() => setAlertMessage(null), 3000); // Clear after 3 seconds
          router.push('/auth/login')
        } else {
         
          setErrors({ email: data.message || 'Registration failed' });
          setAlertMessage({ type: 'error', message: data.data[0].message || data.message || 'Registration failed.' });
          setTimeout(() => setAlertMessage(null), 3000); // Clear after 3 seconds
        }
      } catch (error) {
       
        setErrors({ email: 'Network error' });
        setAlertMessage({ type: 'error', message: 'Network error. Please try again.' });
        setTimeout(() => setAlertMessage(null), 3000); // Clear after 3 seconds
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      {alertMessage && alertMessage.type === 'success' && (
              <SuccessAlert message={alertMessage.message} onClose={() => setAlertMessage(null)} />
            )}
            {alertMessage && alertMessage.type === 'error' && (
              <ErrorAlert message={alertMessage.message} onClose={() => setAlertMessage(null)} />
            )}
  
    <div className="min-h-screen flex bg-white text-black">

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white text-black">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex gap-2">  
               <Image
              className="h-8 w-auto"
              src="/guard1.png"
              alt="Guardian"
              width={50}
              height={50}
            />

            <h2 className="text-2xl font-extrabold text-dark">Guardian </h2>
            </div>
           
            <h2 className="mt-6 text-xl ">Join Guardian Angel - Your Safety Network</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* 
                  FIX: Ensure Input is imported at the top of the file. 
                */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seunodesuo@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Seun Odueso"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+44 ---- -----"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="********"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-gray-100 px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className=" flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002147] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Register <span className="ml-2">&rarr;</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 text-sm text-black">
              You already have an account? click on{' '}
              <Link href="/auth/login" className="font-medium text-[#002147] hover:text-indigo-500">
                Login
              </Link>
            </div>
            
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-900 to-indigo-900">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/heart-hands-register.svg"
          alt=""
          layout="fill"
        />
      </div>
    </div>
    </div>
  );
}

