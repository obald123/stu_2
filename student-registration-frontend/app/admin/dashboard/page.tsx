'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserEdit, FaTrash, FaUserShield, FaUserGraduate, FaUsers } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import UserModal from '../../components/UserModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { useNotification } from '../../context/NotificationContext';


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
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { notify } = useNotification();

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

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data;
    },
    staleTime: 10000,
  });

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        notify('User deleted successfully', 'success');
        refetch();
      } catch (error) {
        notify('Failed to delete user', 'error');
      }
    }
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  }

  // Filtered users
  const filteredUsers = data?.users.filter((user: User) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  // Summary stats
  const totalUsers = data?.pagination.total || 0;
  const totalAdmins = data?.users.filter((u: User) => u.role === 'admin').length || 0;
  const totalStudents = data?.users.filter((u: User) => u.role === 'student').length || 0;

  // Prepare chart data
  const pieData = [
    { name: 'Admins', value: analytics?.totalAdmins ?? totalAdmins },
    { name: 'Students', value: analytics?.totalStudents ?? totalStudents },
  ];
  const COLORS = ['#34d399', '#60a5fa'];
  const barData = analytics?.recentUsers?.map((u: any) => ({
    name: `${u.firstName} ${u.lastName}`,
    date: format(new Date(u.createdAt), 'MM-dd'),
  })) || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
          <FaUsers className="text-indigo-500 text-2xl" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="flex-1 px-6 py-4 flex flex-col gap-2">
          <button className="flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-50 transition" disabled>
            <FaUsers /> User Management
          </button>
          {/* Add more sidebar links here */}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-8 py-8 flex flex-col gap-8">
          {/* Summary cards with analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2 border border-gray-200">
              <FaUsers className="text-indigo-500 text-2xl" />
              <span className="text-2xl font-bold">{analyticsLoading ? '...' : analytics?.totalUsers ?? totalUsers}</span>
              <span className="text-gray-500">Total Users</span>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2 border border-gray-200">
              <FaUserShield className="text-green-500 text-2xl" />
              <span className="text-2xl font-bold">{analyticsLoading ? '...' : analytics?.totalAdmins ?? totalAdmins}</span>
              <span className="text-gray-500">Admins</span>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2 border border-gray-200">
              <FaUserGraduate className="text-blue-500 text-2xl" />
              <span className="text-2xl font-bold">{analyticsLoading ? '...' : analytics?.totalStudents ?? totalStudents}</span>
              <span className="text-gray-500">Students</span>
            </div>
          </div>
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col items-center">
              <h4 className="text-lg font-semibold mb-4 text-indigo-700">User Role Distribution</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200 flex flex-col items-center">
              <h4 className="text-lg font-semibold mb-4 text-indigo-700">Recent Registrations</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="name" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Recent registrations (optional) */}
          {analytics?.recentUsers && (
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h4 className="text-lg font-semibold mb-4 text-indigo-700">Recent Registrations</h4>
              <ul className="divide-y divide-gray-200">
                {analytics.recentUsers.map((u: any) => (
                  <li key={u.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium">{u.firstName} {u.lastName}</span>
                    <span className="text-sm text-gray-500">{u.email}</span>
                    <span className="text-xs text-gray-400">{format(new Date(u.createdAt), 'yyyy-MM-dd')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
          {/* User Table */}
          <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
            <div className="px-4 py-5 border-b border-gray-200 flex items-center gap-2">
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
                {filteredUsers.map((user: User) => (
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
                    onClick={() => router.push(`/admin/edit/${user.id}`)}
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
      </main>
    </div>
  );
}