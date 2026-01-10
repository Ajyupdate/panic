'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '@/app/api/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/AuthContext';

export default function LoginPage() {
  const router = useRouter()
  const {signIn} = useAuthContext()
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
    loginAs: Yup.string().required('Please select login type'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      loginAs: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
         console.log(data)
         signIn(data.data.tokens.accessToken, data.data.tokens.refreshToken, data.data.user)
          toast.success('Login successful!');
          
          // Redirect based on login type
          if (values.loginAs === 'respondent') {
            router.push('/respondents/dashboard')
          } else {
            router.push('/')
          }
        } else {
          
          setErrors({ email: data.message || 'Login failed' });
          toast.error(data.message || 'Login failed.');
         
          
        }
      } catch (error) {
        
        setErrors({ email: 'Network error' });
        toast.error('Network error. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row">
      <div className=" flex-1 flex flex-col justify-center py-12 px-2 sm:px-6 lg:flex-none lg:px-10 xl:px-10 bg-white text-black lg:w-2/5">
        <div className="px-6 ">
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
           
            <h2 className="mt-6 text-xl  ">It's nice having you back on Guardian Angel</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="loginAs" className="block text-sm font-medium text-gray-700 mb-1">
                    Login as
                  </label>
                  <select
                    id="loginAs"
                    name="loginAs"
                    value={formik.values.loginAs}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.loginAs && formik.errors.loginAs ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select login type</option>
                    <option value="patient">Patient</option>
                    <option value="respondent">Respondent</option>
                  </select>
                  {formik.touched.loginAs && formik.errors.loginAs && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.loginAs}</p>
                  )}
                </div>

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
                    className={`w-full px-3 py-4  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
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
                    autoComplete="current-password"
                    placeholder="********"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-4 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
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
                    {formik.isSubmitting ? "Logging in" : "Login"} <span className="ml-2">&rarr;</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6  text-sm text-black ">
              You don't have an account? click on{' '}
              <Link href="/auth/register" className="font-bold text-[#002147] hover:text-indigo-500">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:w-3/5 lg:min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
        <Image
          src="/login-pic.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}