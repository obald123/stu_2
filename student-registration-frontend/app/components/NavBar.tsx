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
      position="fixed"
      elevation={0} 
      component="nav"
      aria-label="Main navigation"
      sx={{
        bgcolor: 'rgba(255,255,255,0.95)',
        color: '#222',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        borderBottom: '1px solid #e0e7ef',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        width: showSidebar ? {
          xs: '100%',
          md: `calc(100% - ${isCollapsed ? '80px' : '260px'})`
        } : '100%',
        left: showSidebar ? {
          xs: 0,
          md: isCollapsed ? '80px' : '260px'
        } : 0,
        transition: 'all 0.3s ease'
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
        mx: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Logo size={32} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800, 
              ml: { xs: 1, sm: 2 }, 
              color: '#6366f1', 
              letterSpacing: 1, 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Student Registration
          </Typography>
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
                color: pathname === link.href ? '#6366f1' : '#222',
                fontWeight: 600,
                borderRadius: 2,
                px: { sm: 1.5, md: 2 },
                py: 1,
                fontSize: { sm: '0.875rem', md: '1rem' },
                background: pathname === link.href ? alpha('#6366f1', 0.08) : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: alpha('#6366f1', 0.12),
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
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: { sm: 1.5, md: 2 },
                  py: 1,
                  fontSize: { sm: '0.875rem', md: '1rem' }
                }}
              >
                {user?.firstName} {user?.lastName}
              </Button>
              <Button 
                color="inherit" 
                onClick={logout} 
                startIcon={<FaSignOutAlt />} 
                sx={{ 
                  color: '#e11d48', 
                  fontWeight: 600, 
                  borderRadius: 2, 
                  px: { sm: 1.5, md: 2 }, 
                  py: 1,
                  ml: { sm: 0.5, md: 1 },
                  fontSize: { sm: '0.875rem', md: '1rem' },
                  '&:hover': { 
                    background: alpha('#e11d48', 0.08),
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
              borderRadius: 2,
              '&:hover': {
                background: alpha('#6366f1', 0.08)
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
                borderTopLeftRadius: { xs: '1rem', sm: 0 },
                borderBottomLeftRadius: { xs: '1rem', sm: 0 },
                mt: { xs: '64px', sm: '72px' },
                height: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 72px)' }
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Logo size={32} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1' }}>
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
                        borderRadius: 2,
                        mb: 1,
                        color: pathname === link.href ? '#6366f1' : '#222',
                        bgcolor: pathname === link.href ? alpha('#6366f1', 0.08) : 'transparent',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha('#6366f1', 0.12),
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
                        borderRadius: 2,
                        color: '#e11d48',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha('#e11d48', 0.08),
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
