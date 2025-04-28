"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaCog, FaUniversity } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <AppBar position="static" sx={{ mb: 2, bgcolor: '#fff', color: '#111', boxShadow: 2, borderBottom: '1px solid #e0e7ef' }}>
      <Toolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 3 } }}>
        <Logo size={36} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, ml: 2, color: '#111', display: { xs: 'none', sm: 'block' } }}>
          Student Registration System
        </Typography>
        {/* Desktop Nav */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button key={link.href} color="inherit" component={Link} href={link.href} startIcon={link.icon} sx={{ color: '#111', fontWeight: 600 }}>
              {link.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button color="inherit" onClick={logout} startIcon={<FaSignOutAlt />} sx={{ color: '#111', fontWeight: 600 }}>Logout</Button>
          )}
        </Box>
        {/* Mobile Nav */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton color="inherit" edge="end" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
            <Box sx={{ width: 240 }} role="presentation" onClick={() => setMobileOpen(false)}>
              <List>
                {navLinks.map((link) => (
                  <ListItem key={link.href} disablePadding>
                    <ListItemButton component={Link} href={link.href}>
                      {link.icon}
                      <ListItemText primary={link.label} sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={logout}>
                      <FaSignOutAlt />
                      <ListItemText primary="Logout" sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
              <Divider />
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
