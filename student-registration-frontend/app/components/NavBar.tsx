"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaCog, FaUniversity } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar>
        <Logo size={36} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, ml: 2 }}>
          Student Registration System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
          color="inherit"
          component={Link}
          href="/"
          startIcon={<FaUniversity />}
        >
          Home
        </Button>
          {/* Home Page */}
          {pathname === '/' && (
            <>
              {!isAuthenticated && (
                <>
                  <Button color="inherit" component={Link} href="/login" startIcon={<FaSignInAlt />}>Login</Button>
                  <Button color="inherit" component={Link} href="/register" startIcon={<FaUserPlus />}>Register</Button>
                </>
              )}
            </>
          )}
          {/* Admin Dashboard */}
          {pathname === '/admin/dashboard' && isAdmin && (
            <Button color="inherit" component={Link} href="/profile" startIcon={<FaUserCircle />}>Profile</Button>
          )}
          {/* Profile Page */}
          {pathname === '/profile' && isAdmin && (
            <Button color="inherit" component={Link} href="/admin/dashboard" startIcon={<FaTachometerAlt />}>Admin Dashboard</Button>
          )}
          {pathname === '/profile' && !isAdmin && isAuthenticated && (
            <Button color="inherit" component={Link} href="/" startIcon={<FaTachometerAlt />}>Home</Button>
          )}
          {isAuthenticated && (
            <Button color="inherit" onClick={logout} startIcon={<FaSignOutAlt />}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
