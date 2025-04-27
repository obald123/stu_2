'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import UserModal from '../components/UserModal';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';

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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', py: 6 }}>
      <Box sx={{ maxWidth: 480, width: '100%', mx: 'auto' }}>
        <Paper elevation={3} sx={{ borderRadius: 4, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: 'indigo.50', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <FaUserCircle style={{ color: '#6366f1', fontSize: 64 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>{user.firstName} {user.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
          </Box>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaEnvelope /> Email</Typography>
                <Typography fontWeight={500}>{user.email}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaIdBadge /> Registration #</Typography>
                <Typography fontWeight={500}>{user.registrationNumber}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50' }}>
                <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                <Typography fontWeight={500}>{(user as any).dateOfBirth ? format(new Date((user as any).dateOfBirth), 'yyyy-MM-dd') : '-'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50' }}>
                <Typography variant="caption" color="text.secondary">Joined</Typography>
                <Typography fontWeight={500}>{(user as any).createdAt ? format(new Date((user as any).createdAt), 'yyyy-MM-dd') : '-'}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}