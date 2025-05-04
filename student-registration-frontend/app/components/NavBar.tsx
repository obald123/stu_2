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

export default function NavBar({ 
  isCollapsed = false, 
  showSidebar = false,
  isMobile = false
}: { 
  isCollapsed?: boolean;
  showSidebar?: boolean;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClose = () => {
    setMobileOpen(false);
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
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
      position="fixed"
      elevation={0} 
      component="nav"
      aria-label="Main navigation"
      sx={{
        bgcolor: 'rgba(255,255,255,0.98)',
        color: '#222',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
        zIndex: 1200,
        width: showSidebar ? {
          xs: '100%',
          md: `calc(100% - ${isCollapsed ? '80px' : '260px'})`
        } : '100%',
        left: showSidebar ? {
          xs: 0,
          md: isCollapsed ? '80px' : '260px'
        } : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { 
          xs: 2, 
          sm: 3, 
          md: showSidebar ? (isCollapsed ? 4 : 3) : 4, 
          lg: 6 
        },
        minHeight: { xs: '64px', sm: '72px', md: '80px' },
        maxWidth: { 
          xs: '100%',
          sm: showSidebar ? 
            (isCollapsed ? '900px' : '800px') : 
            '600px',
          md: showSidebar ? 
            (isCollapsed ? '1200px' : '1100px') : 
            '900px',
          lg: showSidebar ? 
            (isCollapsed ? '1400px' : '1300px') : 
            '1200px'
        },
        width: '100%',
        mx: 'auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)'
            }
          }}>
            <Logo size={32} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Student Registration
            </Typography>
          </Box>
        </Box>

        {/* Desktop Nav */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: { sm: 1, md: 2 },
          alignItems: 'center'
        }}>
          {navLinks.map((link) => (
            <Button
              key={link.href}
              color="inherit"
              component={Link}
              href={link.href}
              startIcon={link.icon}
              sx={{
                color: pathname === link.href ? '#6366f1' : '#374151',
                fontWeight: 600,
                borderRadius: '12px',
                px: { sm: 2, md: 2.5 },
                py: 1.25,
                fontSize: { sm: '0.875rem', md: '0.9375rem' },
                background: pathname === link.href ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#6366f1',
                  transform: 'translateY(-1px)'
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
                  color: '#374151',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: { sm: 2, md: 2.5 },
                  py: 1.25,
                  fontSize: { sm: '0.875rem', md: '0.9375rem' },
                  ml: { sm: 0.5, md: 1 },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    background: 'rgba(99, 102, 241, 0.08)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {user?.firstName} {user?.lastName}
              </Button>
              <Button 
                color="inherit" 
                onClick={logout} 
                startIcon={<FaSignOutAlt />} 
                sx={{ 
                  color: '#dc2626',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: { sm: 2, md: 2.5 },
                  py: 1.25,
                  fontSize: { sm: '0.875rem', md: '0.9375rem' },
                  ml: { sm: 0.5, md: 1 },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    background: 'rgba(220, 38, 38, 0.08)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Nav */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton 
            color="inherit" 
            edge="end" 
            onClick={() => setMobileOpen(true)}
            data-testid="mobile-menu-button"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              color: '#374151',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.08)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer 
            anchor="right" 
            open={mobileOpen} 
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: { xs: '100%', sm: 320 },
                borderTopLeftRadius: { xs: '16px', sm: 0 },
                borderBottomLeftRadius: { xs: '16px', sm: 0 },
                mt: { xs: '64px', sm: '72px' },
                height: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 72px)' },
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: '-4px 0 30px rgba(0, 0, 0, 0.03)'
              }
            }}
            onClick={handleClickOutside}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 4,
                pb: 2,
                borderBottom: '1px solid rgba(231, 235, 240, 0.8)'
              }}>
                <Logo size={32} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Student Registration
                </Typography>
              </Box>
              <List>
                {navLinks.map((link) => (
                  <ListItem key={link.href} disablePadding>
                    <ListItemButton 
                      component={Link} 
                      href={link.href} 
                      selected={pathname === link.href}
                      sx={{ 
                        borderRadius: '12px',
                        mb: 1,
                        color: pathname === link.href ? '#6366f1' : '#374151',
                        bgcolor: pathname === link.href ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                        fontWeight: 600,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.12)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      {link.icon}
                      <ListItemText primary={link.label} sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {isAuthenticated && (
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={logout}
                      sx={{ 
                        borderRadius: '12px',
                        color: '#dc2626',
                        fontWeight: 600,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: 'rgba(220, 38, 38, 0.08)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <FaSignOutAlt />
                      <ListItemText primary="Logout" sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
