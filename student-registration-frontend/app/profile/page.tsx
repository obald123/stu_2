'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile by ID
  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      try {
        const res = await api.get(`/users/${user.id}`);
        setProfile(res.data);
        setError(null);
      } catch (e: any) {
        setProfile(null);
        setError('Failed to load profile. Please try again later.');
      }
    }
    if (user?.id) fetchProfile();
  }, [user]);

  // Fetch QR code by user ID
  useEffect(() => {
    async function fetchQrCode() {
      if (!user?.id) return;
      try {
        const res = await api.get(`/users/${user.id}/qrcode`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        setQrCodeUrl(url);
      } catch (e) {
        setQrCodeUrl(null);
      }
    }
    if (user?.id) fetchQrCode();
  }, [user]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'error.main' }}>{error}</Box>;
  }

  if (!user || !profile) {
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
          <Typography variant="h5" fontWeight={700} align="center">{profile.firstName} {profile.lastName}</Typography>
          <Typography variant="body2" color="text.secondary" align="center">{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Typography>
          <Box sx={{ width: '100%' }}>
            <Grid container columns={12} spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaEnvelope /> Email</Typography>
                  <Typography fontWeight={500}>{profile.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FaIdBadge /> Registration #</Typography>
                  <Typography fontWeight={500}>{profile.registrationNumber}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                  <Typography fontWeight={500}>{profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'yyyy-MM-dd') : '-'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'indigo.50', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Joined</Typography>
                  <Typography fontWeight={500}>{profile.createdAt ? format(new Date(profile.createdAt), 'yyyy-MM-dd') : '-'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {qrCodeUrl && (
            <Box sx={{ mt: 3, mb: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                My Registration QR Code
              </Typography>
              <img src={qrCodeUrl} alt="QR Code" style={{ width: 180, height: 180, borderRadius: 8, border: '1px solid #e0e7ef', background: '#f4f6fb' }} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}