'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaUserGraduate, FaUsers } from 'react-icons/fa';
import { useEffect } from 'react';
import { format } from 'date-fns';
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
import { Box, Typography, Grid } from '@mui/material';
import Sidebar from '../../components/Sidebar';

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
  const { notify } = useNotification();
  // Only keep analytics-related state and queries
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin]);

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data;
    },
    staleTime: 10000,
  });

  if (loading || analyticsLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  }

  // Prepare chart data
  const pieData = [
    { name: 'Admins', value: analytics?.totalAdmins ?? 0 },
    { name: 'Students', value: analytics?.totalStudents ?? 0 },
  ];
  const COLORS = ['#34d399', '#60a5fa'];
  const barData = analytics?.recentUsers?.map((u: any) => ({
    name: `${u.firstName} ${u.lastName}`,
    date: format(new Date(u.createdAt), 'MM-dd'),
  })) || [];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fb' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Summary cards with analytics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <FaUsers style={{ color: '#6366f1', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>{analytics?.totalUsers ?? 0}</Typography>
              <Typography color="text.secondary">Total Users</Typography>
            </Box>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <FaUserShield style={{ color: '#22c55e', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>{analytics?.totalAdmins ?? 0}</Typography>
              <Typography color="text.secondary">Admins</Typography>
            </Box>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <FaUserGraduate style={{ color: '#3b82f6', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>{analytics?.totalStudents ?? 0}</Typography>
              <Typography color="text.secondary">Students</Typography>
            </Box>
          </Box>
          {/* Analytics Charts */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            </Box>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}