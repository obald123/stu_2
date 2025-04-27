'use client';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaQuoteLeft } from 'react-icons/fa';
import Logo from './components/Logo';
import { Box, Typography } from '@mui/material';

export default function Home() {
  const { isAuthenticated, isAdmin, logout, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size={56} />
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, mb: 6 }}>
        <Logo size={64} />
        <FaUniversity style={{ color: '#6366f1', fontSize: 40, margin: '16px 0' }} />
        <Typography variant="h3" fontWeight={800} color="primary" align="center" gutterBottom>
          Welcome to Student Registration System
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
          Easily manage your student profile, registration, and more!
        </Typography>
        {isAuthenticated ? (
          <div className="flex flex-col items-center bg-white/80 rounded-lg shadow-lg p-6 mb-4 w-full max-w-xl">
            <span className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-2"><FaUserCircle className="text-indigo-500" />Hello, {user?.firstName} {user?.lastName}</span>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {isAdmin && (
                <Link href="/admin/dashboard" className="btn-secondary flex items-center gap-2"><FaTachometerAlt /> Admin Dashboard</Link>
              )}
              <Link href="/profile" className="btn-secondary flex items-center gap-2"><FaUserCircle /> Profile</Link>
              <button onClick={logout} className="btn-secondary flex items-center gap-2"><FaSignOutAlt /> Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-white/80 rounded-lg shadow-lg p-6 mb-4 w-full max-w-xl">
            <div className="flex gap-4 mb-4">
              <Link href="/login" className="btn-primary flex items-center gap-2 text-lg min-w-[120px]"><FaSignInAlt /> Login</Link>
              <Link href="/register" className="btn-secondary flex items-center gap-2 text-lg min-w-[120px]"><FaUserPlus /> Register</Link>
            </div>
          </div>
        )}
      </Box>
      <div className="w-full flex flex-col items-center mt-4 text-center">
        <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <FaUniversity style={{ color: '#6366f1' }} /> INES-Ruhengeri
        </Typography>
        <Typography variant="body1" color="primary" fontWeight={500} sx={{ mt: 2 }}>
          Empowering students and lecturers for a better campus experience in INES-Ruhengeri
        </Typography>
        <Box sx={{ mt: 6, maxWidth: 600, mx: 'auto', bgcolor: 'indigo.50', borderRadius: 2, p: 3, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 1 }}>
          <FaQuoteLeft style={{ color: '#6366f1', fontSize: 24 }} />
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            “Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”
          </Typography>
        </Box>
      </div>
    </Box>
  );
}