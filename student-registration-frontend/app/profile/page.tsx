'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaUserCircle, FaIdBadge, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';
import type { User, UserRole } from '../context/AuthContext';

function isAdmin(role: UserRole): role is 'admin' {
  return role === 'admin';
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch user profile by ID or all users if admin
  useEffect(() => {
    async function fetchProfileOrUsers() {
      if (!user) return;
      if (isAdmin(user.role)) {
        try {
          const res = await api.get('/api/admin/users?page=1&limit=100');
          setAllUsers(res.data.users || []);
          setError(null);
        } catch (e: any) {
          setAllUsers([]);
          setError('Failed to load users.');
        }
      } else {
        try {
          const res = await api.get(`/api/users/${user.id}`);
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
    let qrUrl: string | null = null;

    async function fetchQrCode() {
      if (!user?.id || isAdmin(user.role)) return;
      try {
        const res = await api.get(`/api/users/${user.id}/qrcode`, { responseType: 'blob' });
        qrUrl = URL.createObjectURL(res.data);
        setQrCodeUrl(qrUrl);
      } catch (e) {
        setQrCodeUrl(null);
        setError('Failed to load QR code');
      }
    }

    fetchQrCode();

    // Cleanup URL object when component unmounts
    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
      }
    };
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

  // Admin: show all users with QR codes
  if (isAdmin(user.role)) {
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
          <Paper sx={{ 
            width: '100%', 
            maxWidth: 1200, 
            p: { xs: 2, sm: 4 }, 
            borderRadius: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              align="center" 
              sx={{ 
                mb: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              User Management Dashboard
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3
            }}>
              {allUsers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  // Student: show own profile
  if (!profile) {
    return <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #f6f8ff 0%, #f0f4ff 100%)'
    }}>
      <LoadingSpinner size={56} />
    </Box>;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      bgcolor: '#f8fafc',
    }}>
      {isAdmin(user.role) && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          pt: { xs: '64px', sm: '72px', md: '80px' },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          ml: isAdmin(user.role) ? { 
            xs: 0, 
            md: isSidebarCollapsed ? '80px' : '260px' 
          } : 0,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
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
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 1,
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
          }}>
            <FaUserCircle style={{ color: '#fff', fontSize: 72 }} />
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
            {profile?.firstName} {profile?.lastName}
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
            {profile?.role.charAt(0).toUpperCase() + profile.role.slice(1)}
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
                <Typography fontWeight={500}>{profile?.email}</Typography>
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
                <Typography fontWeight={500}>{profile?.registrationNumber}</Typography>
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
                <Typography fontWeight={500}>{profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'yyyy-MM-dd') : '-'}</Typography>
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
                <Typography fontWeight={500}>{profile?.createdAt ? format(new Date(profile.createdAt), 'yyyy-MM-dd') : '-'}</Typography>
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
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  style={{ 
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
    </Box>
  );
}

// UserCard component for admin view
function UserCard({ user }: { user: User }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  
  useEffect(() => {
    let url: string | null = null;
    
    async function fetchQr() {
      try {
        const res = await api.get(`/api/users/${user.id}/qrcode`, { responseType: 'blob' });
        url = URL.createObjectURL(res.data);
        setQrUrl(url);
      } catch {
        setQrUrl(null);
      }
    }
    
    fetchQr();
    
    // Cleanup URL object when component unmounts or user changes
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [user.id]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${user.firstName}_${user.lastName}_QR_${dateStr}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 3, 
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <Box sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
      }}>
        <FaUserCircle style={{ color: '#fff', fontSize: 48 }} />
      </Box>
      <Typography 
        fontWeight={700} 
        fontSize={18}
        sx={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
      <Typography variant="body2" color="text.secondary">Reg #: {user.registrationNumber}</Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          bgcolor: 'rgba(99, 102, 241, 0.1)',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontWeight: 500
        }}
      >
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Typography>
      {qrUrl && (
        <Box sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            mb: 2
          }}>
            <img 
              src={qrUrl} 
              alt="QR Code" 
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 8,
                display: 'block'
              }} 
            />
          </Paper>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleDownload}
            sx={{
              borderColor: '#6366f1',
              color: '#6366f1',
              '&:hover': {
                borderColor: '#4338ca',
                bgcolor: 'rgba(99, 102, 241, 0.05)'
              }
            }}
          >
            Download QR
          </Button>
        </Box>
      )}
    </Paper>
  );
}