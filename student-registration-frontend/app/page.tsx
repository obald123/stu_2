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
    <Box sx={{ minHeight: '100vh', bgcolor: '', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      {loading ? (
      <LoadingSpinner size={56} />
      ) : isAuthenticated && isAdmin ? (
      // Admin Home
      <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 4, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Logo size={56} />
        <Typography variant="h4" fontWeight={800} color="primary" align="center" sx={{ letterSpacing: 1 }}>
        Welcome, Admin {user?.firstName}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
        Manage users, view analytics, and oversee registrations from your dashboard.
        </Typography>
        <Button href="/admin/dashboard" component={Link} variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem', mt: 2 }}>
        Go to Admin Dashboard
        </Button>
      </Box>
      ) : isAuthenticated ? (
      // Student Home
      <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 4, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Logo size={56} />
        <Typography variant="h4" fontWeight={800} color="primary" align="center" sx={{ letterSpacing: 1 }}>
        Welcome, {user?.firstName}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
        View and update your profile, check your registration status, and manage your student information.
        </Typography>
        <Button href="/profile" component={Link} variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem', mt: 2 }}>
        Go to My Profile
        </Button>
      </Box>
      ) : (
      // Unsigned-in Home (Marketing)
      <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', bgcolor: '#fff', border: '1px solid #e0e7ef', boxShadow: 2, borderRadius: 4, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Logo size={56} />
        <Typography variant="h3" fontWeight={800} color="primary" align="center" sx={{ letterSpacing: 1, fontSize: '2.5rem' }}>
        Student Registration, Simplified
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Effortlessly manage student profiles, registration, and campus life. Fast, secure, and accessible for everyone.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <Link href="/register" style={{ textDecoration: 'none', flex: 1 }}>
          <Button fullWidth variant="contained" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem' }}>
          Get Started
          </Button>
        </Link>
        <Link href="/login" style={{ textDecoration: 'none', flex: 1 }}>
          <Button fullWidth variant="outlined" color="primary" size="large" sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem', borderColor: '#6366f1' }}>
          Sign In
          </Button>
        </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, bgcolor: 'indigo.50', borderRadius: 2, p: 2, width: '100%' }}>
        <FaUniversity style={{ color: '#6366f1', fontSize: 28 }} />
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          “Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”
        </Typography>
        </Box>
      </Box>
      )}
      <Box sx={{ mt: 6, textAlign: 'center', color: 'grey.600' }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Trusted by students and staff at INES-Ruhengeri
      </Typography>
      </Box>
    </Box>
  );
}