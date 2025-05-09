"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { FaUserCircle, FaIdBadge, FaEnvelope, FaCalendar } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../lib/api';
import { format } from 'date-fns';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registrationNumber: string;
  dateOfBirth: string;
  createdAt: string;
  name?: string;
  image?: string;
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
      
      try {
        const userResponse = await api.get(`/api/users/${id}`, {
          withCredentials: true
        });
        setUser(userResponse.data);

        if (userResponse.data.role !== 'admin') {
          const qrResponse = await api.get(`/api/users/${id}/qrcode`, {
            responseType: 'blob',
            withCredentials: true
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
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.default',
      p: 3,
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <Paper sx={{ 
        maxWidth: { xs: 340, sm: 480 }, 
        width: '100%', 
        p: { xs: 3, sm: 4 }, 
        borderRadius: 4, 
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 3 
      }}>
        <Box sx={{ 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          background: user.image ? 'none' : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 1,
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
          overflow: 'hidden'
        }}>
          {user.image ? (
            <Box
              component="img"
              src={user.image}
              alt={user.name || `${user.firstName} ${user.lastName}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <FaUserCircle style={{ color: '#fff', fontSize: 72 }} />
          )}
        </Box>

        <Typography 
          variant="h5" 
          fontWeight={700} 
          align="center"
          sx={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {user.name || `${user.firstName} ${user.lastName}`}
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 500
          }} 
          align="center"
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mt: 1
          }}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaEnvelope style={{ color: '#6366f1' }} /> Email
              </Typography>
              <Typography fontWeight={500}>{user.email}</Typography>
            </Paper>

            <Paper sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaIdBadge style={{ color: '#6366f1' }} /> Registration #
              </Typography>
              <Typography fontWeight={500}>{user.registrationNumber}</Typography>
            </Paper>

            <Paper sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }
            }}>
              <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
              <Typography fontWeight={500}>
                {user.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '-'}
              </Typography>
            </Paper>

            <Paper sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }
            }}>
              <Typography variant="caption" color="text.secondary">Joined</Typography>
              <Typography fontWeight={500}>
                {user.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : '-'}
              </Typography>
            </Paper>
          </Box>
        </Box>

        {qrCodeUrl && (
          <Box sx={{ mt: 3, mb: 1, textAlign: 'center' }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                color: '#6366f1'
              }}
            >
              My Profile QR Code
            </Typography>
            <Paper sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: '#fff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              display: 'inline-block'
            }}>
              <Box
                component="img"
                src={qrCodeUrl}
                alt="QR Code"
                sx={{ 
                  width: 180, 
                  height: 180, 
                  borderRadius: 8,
                  display: 'block'
                }}
              />
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserProfile;
