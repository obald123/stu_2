'use client';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaQuoteLeft } from 'react-icons/fa';
import Logo from './components/Logo';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  const { isAuthenticated, isAdmin, logout, user, loading } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 50%, #a1c4fd 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient background overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 60%), url(/bgpic.png) center 10% no-repeat',
          backgroundSize: { xs: '90vw', md: '60vw' },
          opacity: 0.09,
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'pulseBg 12s ease-in-out infinite',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 700, mx: 'auto', mt: { xs: 8, md: 0 } }}>
        {loading ? (
          <LoadingSpinner size={56} />
        ) : isAuthenticated && isAdmin ? (
          <Box sx={{ bgcolor: '#fff', borderRadius: 6, boxShadow: 4, p: { xs: 3, sm: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Logo size={56} />
            <Typography variant="h3" fontWeight={900} color="primary" align="center" sx={{ letterSpacing: 1 }}>
              Welcome, Admin {user?.firstName}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Manage users, view analytics, and oversee registrations from your dashboard.
            </Typography>
            <Button href="/admin/dashboard" component={Link} variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem', mt: 2, boxShadow: 2 }}>
              Go to Admin Dashboard
            </Button>
          </Box>
        ) : isAuthenticated ? (
          <Box sx={{ bgcolor: '#fff', borderRadius: 6, boxShadow: 4, p: { xs: 3, sm: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Logo size={56} />
            <Typography variant="h3" fontWeight={900} color="primary" align="center" sx={{ letterSpacing: 1 }}>
              Welcome, {user?.firstName}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              View and update your profile, check your registration status, and manage your student information.
            </Typography>
            <Button href="/profile" component={Link} variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem', mt: 2, boxShadow: 2 }}>
              Go to My Profile
            </Button>
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.97)', borderRadius: 6, boxShadow: 6, p: { xs: 3, sm: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Logo size={72} />
            <Typography variant="h2" fontWeight={900} color="primary" align="center" sx={{ letterSpacing: 1, fontSize: { xs: '2.2rem', sm: '3rem' } }}>
              Welcome to INES Student Portal
            </Typography>
            <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 2, fontWeight: 500 }}>
              Fast, secure, and easy student registration and management for INES-Ruhengeri.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
              <Link href="/register" style={{ textDecoration: 'none', flex: 1 }}>
                <Button fullWidth variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem', boxShadow: 2 }}>
                  Get Started
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none', flex: 1 }}>
                <Button fullWidth variant="outlined" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem', borderColor: '#6366f1', boxShadow: 1 }}>
                  Sign In
                </Button>
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, bgcolor: 'indigo.50', borderRadius: 3, p: 2, width: '100%' }}>
              <FaUniversity style={{ color: '#6366f1', fontSize: 32 }} />
              <Typography variant="body1" color="text.secondary" fontStyle="italic" sx={{ fontWeight: 500 }}>
                “Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”
              </Typography>
            </Box>
            {/* Features section */}
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography variant="h6" color="primary" fontWeight={700} align="center" sx={{ mb: 2 }}>
                Why use our portal?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
                <Box sx={{ flex: 1, bgcolor: 'indigo.50', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                  <FaUserPlus style={{ color: '#6366f1', fontSize: 28, marginBottom: 8 }} />
                  <Typography fontWeight={700}>Easy Registration</Typography>
                  <Typography variant="body2" color="text.secondary">Sign up in minutes and manage your student journey online.</Typography>
                </Box>
                <Box sx={{ flex: 1, bgcolor: 'indigo.50', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                  <FaTachometerAlt style={{ color: '#6366f1', fontSize: 28, marginBottom: 8 }} />
                  <Typography fontWeight={700}>Admin Dashboard</Typography>
                  <Typography variant="body2" color="text.secondary">Admins get powerful tools for analytics and user management.</Typography>
                </Box>
                <Box sx={{ flex: 1, bgcolor: 'indigo.50', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: 1 }}>
                  <FaUserCircle style={{ color: '#6366f1', fontSize: 28, marginBottom: 8 }} />
                  <Typography fontWeight={700}>Profile Management</Typography>
                  <Typography variant="body2" color="text.secondary">Students can view  their registration info in different ways.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Box sx={{ mt: 6, textAlign: 'center', color: 'grey.600' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Trusted by students and staff at INES-Ruhengeri
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

