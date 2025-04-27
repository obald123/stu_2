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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'grey.50' }}>
      {/* Sidebar */}
      <Box component="aside" sx={{ width: 260, minHeight: '100vh', bgcolor: 'background.paper', borderRight: 1, borderColor: 'grey.200', boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: 'grey.200' }}>
          <FaUsers style={{ color: '#6366f1', fontSize: 24 }} />
          <Typography fontWeight="bold" fontSize={20}>Admin Panel</Typography>
        </Box>
        <Box sx={{ flex: 1, px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button startIcon={<FaUsers />} variant="outlined" color="primary" disabled>User Management</Button>
          {/* Add more sidebar links here */}
        </Box>
      </Box>
      {/* Main content */}
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Summary cards with analytics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, borderRadius: 3 }}>
                <FaUsers style={{ color: '#6366f1', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalUsers ?? totalUsers}</Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, borderRadius: 3 }}>
                <FaUserShield style={{ color: '#22c55e', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalAdmins ?? totalAdmins}</Typography>
                <Typography color="text.secondary">Admins</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, borderRadius: 3 }}>
                <FaUserGraduate style={{ color: '#3b82f6', fontSize: 24 }} />
                <Typography variant="h5" fontWeight={700}>{analyticsLoading ? '...' : analytics?.totalStudents ?? totalStudents}</Typography>
                <Typography color="text.secondary">Students</Typography>
              </Paper>
            </Grid>
          </Grid>
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', mb: 3 }}>
            <InputBase
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: 2,
                px: 2,
                py: 1,
                width: { xs: '100%', sm: 240 },
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
              inputProps={{ 'aria-label': 'search users' }}
            />
            <Select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
                width: { xs: '100%', sm: 180 },
                boxShadow: 1,
              }}
              size="small"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </Box>
          {/* User Table */}
          <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 3 }}>
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
                Showing <b>{(page - 1) * 10 + 1}</b> to <b>{Math.min(page * 10, data.pagination.total)}</b> of <b>{data.pagination.total}</b> users
              </Typography>
              <Pagination
                count={data.pagination.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          </Paper>
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