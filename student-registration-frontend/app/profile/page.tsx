'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import UserModal from '../components/UserModal';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <FaUserCircle className="text-indigo-500 text-6xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <span className="text-sm text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1"><FaEnvelope /> Email</span>
              <span className="text-base font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1"><FaIdBadge /> Registration #</span>
              <span className="text-base font-medium text-gray-900">{user.registrationNumber}</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">Date of Birth</span>
              <span className="text-base font-medium text-gray-900">
                {(user as any).dateOfBirth ? format(new Date((user as any).dateOfBirth), 'yyyy-MM-dd') : '-'}
              </span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">Joined</span>
              <span className="text-base font-medium text-gray-900">
                {(user as any).createdAt ? format(new Date((user as any).createdAt), 'yyyy-MM-dd') : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}