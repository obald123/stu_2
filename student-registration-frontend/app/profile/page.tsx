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
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile by ID or all users if admin
  useEffect(() => {
    async function fetchProfileOrUsers() {
      if (!user) return;
      if (user.role === 'admin') {
        try {
          const res = await api.get('/admin/users?page=1&limit=100');
          setAllUsers(res.data.users || []);
          setError(null);
        } catch (e: any) {
          setAllUsers([]);
          setError('Failed to load users.');
        }
      } else {
        try {
          const res = await api.get(`/users/${user.id}`);
          setProfile(res.data);
          setError(null);
        } catch (e: any) {
          setProfile(null);
          setError('Failed to load profile. Please try again later.');
        }
      }
    }
    fetchProfileOrUsers();
  }, [user]);

  // Fetch QR code by user ID (only for students)
  useEffect(() => {
    async function fetchQrCode() {
      if (!user?.id || user.role === 'admin') return;
      try {
        const res = await api.get(`/users/${user.id}/qrcode`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        setQrCodeUrl(url);
      } catch (e) {
        setQrCodeUrl(null);
      }
    }
    fetchQrCode();
  }, [user]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'error.main' }}>{error}</Box>;
  }

  if (!user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

  // Only show Sidebar for admin and on large screens
  const showSidebar = user.role === 'admin' && typeof window !== 'undefined' && window.innerWidth >= 600;

  // Admin: show all users with QR codes
  if (user.role === 'admin') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '' }}>
        {showSidebar && <Sidebar />}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 6 }}>
          <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: 'grey.900', boxShadow: 2, border: '1px solid #e0e7ef' }}>
            <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 3 }}>All Users</Typography>
            <Grid container spacing={3}>
              {allUsers.map((u) => (
                <Grid item xs={12} sm={6} md={4} key={u.id}>
                  <UserCard user={u} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }

  // Student: show own profile
  if (!profile) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

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

// UserCard component for admin view
function UserCard({ user }: { user: any }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  useEffect(() => {
    async function fetchQr() {
      try {
        const res = await api.get(`/users/${user.id}/qrcode`, { responseType: 'blob' });
        setQrUrl(URL.createObjectURL(res.data));
      } catch {
        setQrUrl(null);
      }
    }
    fetchQr();
  }, [user.id]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${user.firstName}_${user.lastName}_QRCode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e7ef', borderRadius: 3, bgcolor: 'indigo.50', boxShadow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <FaUserCircle style={{ color: '#6366f1', fontSize: 48, marginBottom: 8 }} />
      <Typography fontWeight={700} fontSize={18}>{user.firstName} {user.lastName}</Typography>
      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
      <Typography variant="body2" color="text.secondary">Reg #: {user.registrationNumber}</Typography>
      <Typography variant="body2" color="text.secondary">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
      {qrUrl && (
        <Box sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
          <img src={qrUrl} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 8, border: '1px solid #e0e7ef', background: '#fff' }} />
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={handleDownload}>Download QR</Button>
        </Box>
      )}
    </Box>
  );
}