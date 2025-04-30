'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserEdit, FaTrash, FaUserShield, FaUserGraduate, FaUsers, FaCog } from 'react-icons/fa';
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
import { Box, Paper, Typography, Grid, Button, Select, MenuItem, InputBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Divider } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fb' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Summary cards with analytics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <FaUsers style={{ color: '#6366f1', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalUsers ?? totalUsers}</Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <FaUserShield style={{ color: '#22c55e', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalAdmins ?? totalAdmins}</Typography>
                <Typography color="text.secondary">Admins</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <FaUserGraduate style={{ color: '#3b82f6', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalStudents ?? totalStudents}</Typography>
                <Typography color="text.secondary">Students</Typography>
              </Box>
            </Grid>
          </Grid>
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
          {/* User Table */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaUsers style={{ color: '#6366f1', fontSize: 22 }} />
              <Typography variant="h6" fontWeight={600}>User Management</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Reg. Number</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user: User) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.role === 'admin' ? (
                            <FaUserShield style={{ color: '#22c55e' }} />
                          ) : (
                            <FaUserGraduate style={{ color: '#3b82f6' }} />
                          )}
                          <Typography fontWeight={500}>{user.firstName} {user.lastName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.registrationNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          color={user.role === 'admin' ? 'success' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<FaUserEdit />}
                          onClick={() => router.push(`/admin/edit/${user.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<FaTrash />}
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing <b>{(page - 1) * 10 + 1}</b> to <b>{Math.min(page * 10, data?.pagination?.total ?? 0)}</b> of <b>{data?.pagination?.total ?? 0}</b> users
              </Typography>
              <Pagination
                count={data?.pagination?.totalPages ?? 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          </Box>
        </Box>

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
      </Box>
    </Box>
  );
}