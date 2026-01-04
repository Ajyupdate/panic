'use client';

import { useAuth } from '@/app/api/hooks/useAuth';
import { useAuthContext } from '@/AuthContext';
import { useMutation } from '@tanstack/react-query';
import {
  Home,
  Users,
  Phone,
  FileText,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const { client } = useAuth();
  const { user } = useAuthContext();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Emergency Contacts', href: '/emergency-contacts', icon: Phone },
    { name: 'Incident Logs', href: '/incident-logs', icon: FileText },
    { name: 'Trusted Locations', href: '/trusted-locations', icon: MapPin },
   
  ];

  const getUserLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      }
    });
  };

  const {
    mutate: triggerPanicAlert,
    isPending: isPanicLoading,
  } = useMutation({
    mutationKey: ['panic-alert'],
    mutationFn: async () => {
      const { latitude, longitude } = await getUserLocation();
      const { data } = await client.post('/alert/panic', {
        coordinates: [latitude, longitude],
        accuracy: 15,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Panic alert sent 🚨');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    },
  });

  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col px-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 px-4 py-4">
        <Image
          className="h-8 w-auto"
          src="/guard1.png"
          alt="Guardian"
          width={50}
          height={50}
        />
        <h2 className="text-2xl font-bold text-gray-900">Guardian</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={name}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-gray-100 font-semibold text-gray-900 border-l-4 border-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Panic Alert */}
        <div className="mt-6">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to trigger the panic alert?')) {
                triggerPanicAlert();
              }
            }}
            disabled={isPanicLoading}
            className="w-full flex flex-col items-center justify-center py-4 px-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-3 shadow-lg" />
            <span className="font-semibold text-gray-900">
              {isPanicLoading ? 'Sending Alert...' : 'Panic Alert'}
            </span>
          </button>

            {/* User Profile */}
          <div className="mt-2 pt-4 bg-gray-100 rounded-xl">
            <Link
              href="/profile"
              className="flex items-center gap-6 pb-2 px-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
              </div>
              <span className="font-medium text-gray-900">
                {user?.fullName || 'Username not available'}
              </span>
            </Link>
          </div>
        </div>
      </nav>

  
    </aside>
  );
};

export default Sidebar;
