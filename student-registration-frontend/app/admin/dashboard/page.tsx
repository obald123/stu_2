'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaUserGraduate, FaUsers } from 'react-icons/fa';
import { useEffect, useState } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/analytics');
      return response.data;
    },
    staleTime: 10000,
  });

  if (loading || analyticsLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          pt: { xs: '64px', sm: '72px', md: '80px' },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          ml: { xs: 0, md: isSidebarCollapsed ? '80px' : '260px' },
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1400, 
          mx: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          gap: 4 
        }}>
          {/* Summary cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 3 
          }}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3,
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(231, 235, 240, 0.8)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: 'rgba(99,102,241,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUsers style={{ color: '#6366f1', fontSize: 28 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1a202c' }}>
                {analytics?.totalUsers ?? 0}
              </Typography>
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                Total Users
              </Typography>
            </Box>

            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3,
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(231, 235, 240, 0.8)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: 'rgba(34,197,94,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUserShield style={{ color: '#22c55e', fontSize: 28 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1a202c' }}>
                {analytics?.totalAdmins ?? 0}
              </Typography>
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                Admins
              </Typography>
            </Box>

            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3,
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(231, 235, 240, 0.8)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: 'rgba(59,130,246,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUserGraduate style={{ color: '#3b82f6', fontSize: 28 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1a202c' }}>
                {analytics?.totalStudents ?? 0}
              </Typography>
              <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
                Students
              </Typography>
            </Box>
          </Box>

          {/* Analytics Charts */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 4 
          }}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3,
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(231, 235, 240, 0.8)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                sx={{ 
                  mb: 4, 
                  color: '#1a202c',
                  alignSelf: 'flex-start'
                }}
              >
                User Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3,
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid rgba(231, 235, 240, 0.8)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                sx={{ 
                  mb: 4, 
                  color: '#1a202c',
                  alignSelf: 'flex-start'
                }}
              >
                Recent Registrations
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="name" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}