"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../lib/api';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registrationNumber: string;
  dateOfBirth: string;
}

const UserProfile = () => {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndQR() {
      if (!id) return;
      
      try {        // Fetch user data
        const userResponse = await api.get(`/api/users/${id}`, {
          withCredentials: true // Include cookies for session authentication
        });
        setUser(userResponse.data);

        // Fetch QR code if user is not admin
        if (userResponse.data.role !== 'admin') {
          const qrResponse = await api.get(`/api/users/${id}/qrcode`, {
            responseType: 'blob',
            withCredentials: true // Include cookies for session authentication
          });
          const qrUrl = URL.createObjectURL(qrResponse.data);
          setQrCodeUrl(qrUrl);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndQR();

    // Cleanup QR code URL on unmount
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner size={56} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'error.main' }}>
        {error}
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 800, 
          width: '100%', 
          mx: 'auto',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <FaUserCircle size={80} color="#1976d2" />
          
          <Typography variant="h4" component="h1" gutterBottom>
            {user.firstName} {user.lastName}
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaEnvelope size={20} />
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaIdBadge size={20} />
              <Typography>
                <strong>Registration Number:</strong> {user.registrationNumber}
              </Typography>
            </Box>

            <Typography>
              <strong>Role:</strong> {user.role}
            </Typography>

            <Typography>
              <strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Box>

          {qrCodeUrl && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                QR Code
              </Typography>
              <Box
                component="img"
                src={qrCodeUrl}
                alt="QR Code"
                sx={{
                  width: 200,
                  height: 200,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 2
                }}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
