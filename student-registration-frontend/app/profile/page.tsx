'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';

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
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

  // Only show Sidebar for admin and on large screens
  const showSidebar = user.role === 'admin' && typeof window !== 'undefined' && window.innerWidth >= 600;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '' }}>
      {showSidebar && <Sidebar />}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Box sx={{ maxWidth: { xs: 340, sm: 480 }, width: '100%', mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: 'grey.900', boxShadow: 2, border: '1px solid #e0e7ef', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: 'indigo.50', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <FaUserCircle style={{ color: '#6366f1', fontSize: 64 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} align="center">{user.firstName} {user.lastName}</Typography>
          <Typography variant="body2" color="text.secondary" align="center">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaEnvelope /> Email</Typography>
                  <Typography fontWeight={500}>{user.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaIdBadge /> Registration #</Typography>
                  <Typography fontWeight={500}>{user.registrationNumber}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                  <Typography fontWeight={500}>{user.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '-'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Joined</Typography>
                  <Typography fontWeight={500}>{user.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : '-'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}