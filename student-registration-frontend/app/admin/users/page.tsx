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
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Divider, Button, TextField } from '@mui/material';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const response = await api.get(`/api/admin/users?page=${page}&limit=10`);
      return response.data;
    },
    staleTime: 5000,
  });

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        notify('User deleted successfully', 'success');
        refetch();
      } catch (error) {
        notify('Failed to delete user', 'error');
      }
    }
  };

  if (loading || isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
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
          <Box sx={{ 
            bgcolor: '#fff', 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid rgba(231, 235, 240, 0.8)'
          }}>
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <FaUsers style={{ color: '#6366f1', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>User Management</Typography>
            </Box>

            <Box sx={{ 
              p: 3,
              borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <TextField
                placeholder="Search users..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ 
                  minWidth: 240,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff'
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant={filterRole === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilterRole('all')}
                  sx={{ 
                    bgcolor: filterRole === 'all' ? '#6366f1' : 'transparent',
                    '&:hover': {
                      bgcolor: filterRole === 'all' ? '#4f46e5' : 'rgba(99, 102, 241, 0.08)'
                    }
                  }}
                >
                  All
                </Button>
                <Button
                  size="small"
                  variant={filterRole === 'admin' ? 'contained' : 'outlined'}
                  onClick={() => setFilterRole('admin')}
                  sx={{ 
                    bgcolor: filterRole === 'admin' ? '#6366f1' : 'transparent',
                    '&:hover': {
                      bgcolor: filterRole === 'admin' ? '#4f46e5' : 'rgba(99, 102, 241, 0.08)'
                    }
                  }}
                >
                  Admins
                </Button>
                <Button
                  size="small"
                  variant={filterRole === 'student' ? 'contained' : 'outlined'}
                  onClick={() => setFilterRole('student')}
                  sx={{ 
                    bgcolor: filterRole === 'student' ? '#6366f1' : 'transparent',
                    '&:hover': {
                      bgcolor: filterRole === 'student' ? '#4f46e5' : 'rgba(99, 102, 241, 0.08)'
                    }
                  }}
                >
                  Students
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Reg. Number</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user: User) => (
                    <TableRow 
                      key={user.id} 
                      hover 
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'rgba(99, 102, 241, 0.04)' 
                        } 
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.role === 'admin' ? (
                            <FaUserShield style={{ color: '#22c55e' }} />
                          ) : (
                            <FaUserGraduate style={{ color: '#3b82f6' }} />
                          )}
                          <Typography>{user.firstName} {user.lastName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.registrationNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          color={user.role === 'admin' ? 'success' : 'primary'}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            bgcolor: user.role === 'admin' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                            color: user.role === 'admin' ? '#15803d' : '#1d4ed8',
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<FaUserEdit />}
                            onClick={() => router.push(`/admin/edit/${user.id}`)}
                            sx={{ 
                              color: '#6366f1',
                              '&:hover': {
                                bgcolor: 'rgba(99, 102, 241, 0.08)'
                              }
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<FaTrash />}
                            onClick={() => handleDelete(user.id)}
                            sx={{ 
                              color: '#ef4444',
                              '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.08)'
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              px: 3, 
              py: 2,
              borderTop: '1px solid rgba(231, 235, 240, 0.8)'
            }}>
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
      </Box>
      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser ? {
          id: selectedUser.id,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          dateOfBirth: (selectedUser as any).dateOfBirth ?? ''
        } : null}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </Box>
  );
}

