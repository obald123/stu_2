'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import UserModal from '../../components/UserModal';
import { FaUserEdit, FaTrash, FaUserShield, FaUserGraduate, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';


type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  dateOfBirth: string;
  role: 'admin' | 'student';
  createdAt: string;
};

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const response = await api.get(`/admin/users?page=${page}&limit=10`);
      return response.data;
    },
    staleTime: 5000, // Adjust the stale time as needed
  });

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  }

  return (
    <div className="min-h-screen bg-red-to-br from-indigo-100 to-white flex justify-center items-center">
      <div className="max-w-7xl w-full py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-indigo-100">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center gap-2">
          <FaUsers className="text-indigo-500 text-2xl" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Management
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reg. Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.users.map((user: User) => (
            <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                <FaUserShield className="text-green-500" />
                ) : (
                <FaUserGraduate className="text-blue-500" />
                )}
                <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
                </div>
              </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 font-semibold">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 font-semibold">{user.registrationNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-6 font-medium rounded-full shadow-md transition-all duration-200 ${
                user.role === 'admin'
                  ? 'bg-green-200 text-green-900 hover:bg-green-300'
                  : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
              <button
                onClick={() => {
                setSelectedUser(user);
                setIsModalOpen(true);
                }}
                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition-colors duration-150"
              >
                <FaUserEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors duration-150"
              >
                <FaTrash /> Delete
              </button>
              </td>
            </tr>
            ))}
          </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * 10, data.pagination.total)}
            </span>{' '}
            of <span className="font-medium">{data.pagination.total}</span> users
            </p>
          </div>
          <div>
            <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
            >
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              &lt;
            </button>
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map(
              (_, i) => {
              const pageNumber =
                data.pagination.totalPages <= 5
                ? i + 1
                : page <= 3
                ? i + 1
                : page >= data.pagination.totalPages - 2
                ? data.pagination.totalPages - 4 + i
                : page - 2 + i;
              return (
                <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                aria-current={page === pageNumber ? 'page' : undefined}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === pageNumber
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
                >
                {pageNumber}
                </button>
              );
              }
            )}
            <button
              onClick={() => setPage((old) => (!data.pagination.hasNext ? old : old + 1))}
              disabled={!data.pagination.hasNext}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              &gt;
            </button>
            </nav>
          </div>
          </div>
        </div>
        </div>
      </div>
      </div>

      <UserModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedUser(null);
      }}
      user={selectedUser}
      onSuccess={() => {
        refetch();
        setIsModalOpen(false);
        setSelectedUser(null);
      }}
      />
    </div>
  );
}