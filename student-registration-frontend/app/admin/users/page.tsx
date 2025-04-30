"use client";
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUserEdit, FaTrash, FaUserShield, FaUserGraduate, FaUsers } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import UserModal from '../../components/UserModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Divider, Button } from '@mui/material';
import Sidebar from '../../components/Sidebar';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  registrationNumber: string;
};

export default function UserManagementPage() {
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
    staleTime: 5000,
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

  const filteredUsers = data?.users.filter((user: User) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fb' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 4, py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
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
          user={
            selectedUser
              ? {
                  id: selectedUser.id,
                  firstName: selectedUser.firstName,
                  lastName: selectedUser.lastName,
                  email: selectedUser.email,
                  dateOfBirth: (selectedUser as any).dateOfBirth ?? ''
                }
              : null
          }
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

