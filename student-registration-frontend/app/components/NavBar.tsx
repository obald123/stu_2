"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaCog, FaUniversity } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, ClickAwayListener } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClose = () => {
    setMobileOpen(false);
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking outside the menu
    if ((event.target as HTMLElement).closest('[data-testid="mobile-menu"]') === null) {
      handleClose();
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: <FaUniversity /> },
    ...(!isAuthenticated ? [
      { label: 'Login', href: '/login', icon: <FaSignInAlt /> },
      { label: 'Register', href: '/register', icon: <FaUserPlus /> },
    ] : []),
    ...(isAuthenticated && isAdmin ? [
      { label: 'Profile', href: '/profile', icon: <FaUserCircle /> },
    ] : []),
    ...(isAuthenticated && !isAdmin ? [
      { label: 'Profile', href: '/profile', icon: <FaUserCircle /> },
    ] : []),
    ...(isAuthenticated && isAdmin && pathname === '/profile' ? [
      { label: 'Admin Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
    ] : []),
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      component="nav"
      aria-label="Main navigation"
      className="bg-transparent"
      sx={{
        bgcolor: 'rgba(255,255,255,0.95)',
        color: '#222',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        borderBottom: '1px solid #e0e7ef',
        backdropFilter: 'blur(8px)',
        zIndex: 1201
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 3 },
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logo size={40} />
          <Typography variant="h6" sx={{ fontWeight: 800, ml: 1, color: '#6366f1', letterSpacing: 1, display: { xs: 'none', sm: 'block' } }}>
            Student Registration
          </Typography>
        </Box>
        {/* Desktop Nav */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.href}
              color="inherit"
              component={Link}
              href={link.href}
              startIcon={link.icon}
              sx={{
                color: pathname === link.href ? '#6366f1' : '#222',
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 1,
                background: pathname === link.href ? alpha('#6366f1', 0.08) : 'transparent',
                transition: 'background 0.2s',
                '&:hover': {
                  background: alpha('#6366f1', 0.12),
                  color: '#6366f1',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
          {isAuthenticated && (
            <>
              <Button 
                color="inherit" 
                aria-label="user menu"
                sx={{ 
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 1
                }}
              >
                {user?.firstName} {user?.lastName}
                {user?.hasNewMessages && (
                  <span data-testid="notification-badge" className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
              <Button 
                color="inherit" 
                onClick={logout} 
                startIcon={<FaSignOutAlt />} 
                sx={{ 
                  color: '#e11d48', 
                  fontWeight: 600, 
                  borderRadius: 2, 
                  px: 2, 
                  py: 1, 
                  ml: 1, 
                  '&:hover': { 
                    background: alpha('#e11d48', 0.08) 
                  } 
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
        {/* Mobile Nav */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton 
            color="inherit" 
            edge="end" 
            onClick={() => setMobileOpen(true)}
            data-testid="mobile-menu-button"
          >
            <MenuIcon />
          </IconButton>
          <Drawer 
            anchor="right" 
            open={mobileOpen} 
            onClose={handleClose}
            ModalProps={{
              keepMounted: true,
              disablePortal: true
            }}
            PaperProps={{
              'data-testid': 'mobile-menu'
            }}
          >
            <Box 
              sx={{ width: 240, pt: 2 }} 
              role="presentation"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pl: 2 }}>
                <Logo size={32} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1' }}>Student Registration</Typography>
              </Box>
              <List>
                {navLinks.map((link) => (
                  <ListItem key={link.href} disablePadding>
                    <ListItemButton component={Link} href={link.href} selected={pathname === link.href} sx={{ borderRadius: 2, color: pathname === link.href ? '#6366f1' : '#222', fontWeight: 600 }}>
                      {link.icon}
                      <ListItemText primary={link.label} sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: '#e11d48', fontWeight: 600 }}>
                      <FaSignOutAlt />
                      <ListItemText primary="Logout" sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
              <Divider sx={{ my: 1 }} />
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
