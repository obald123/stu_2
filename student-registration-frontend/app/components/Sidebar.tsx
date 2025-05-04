'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaUserEdit, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: { isCollapsed?: boolean; onToggleCollapse?: () => void }) {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const NAVBAR_HEIGHT = typeof window !== 'undefined' && window.innerWidth < 600 ? 56 : 64;

  if (!isAdmin) return null;

  const sidebarLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <FaUsers /> },
    { label: 'User Management', href: '/admin/users', icon: <FaUserEdit /> },
    { label: 'Audit Log', href: '/admin/audit-log', icon: <FaClipboardList /> },
    { label: 'Settings', href: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: NAVBAR_HEIGHT, left: 0, zIndex: 1300 }}>
        <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ ml: 2 }}>
          <MenuIcon />
        </IconButton>
        <Drawer 
          anchor="left" 
          open={mobileOpen} 
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: 260,
              border: 'none',
              top: NAVBAR_HEIGHT,
              height: `calc(100% - ${NAVBAR_HEIGHT}px)`
            }
          }}
        >
          <Box sx={{ width: 260 }} role="presentation" onClick={() => setMobileOpen(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: '#e0e7ef' }}>
              <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24 }} />
              <span style={{ fontWeight: 'bold', fontSize: 20, color: '#111' }}>Admin Panel</span>
            </Box>
            <List sx={{ flex: 1, px: 1, py: 2 }}>
              {sidebarLinks.map(link => (
                <ListItem disablePadding key={link.label}>
                  <ListItemButton component="a" href={link.href} selected={pathname === link.href} sx={{ color: '#111', fontWeight: 600 }}>
                    <ListItemIcon sx={{ color: '#6366f1' }}>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ px: 3, py: 2 }}>
              <Button onClick={logout} color="error" variant="outlined" startIcon={<FaSignOutAlt />} fullWidth sx={{ fontWeight: 600 }}>
                Logout
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: 'none', sm: 'block' },
          position: 'fixed',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? 80 : 260,
            bgcolor: '#fff',
            color: '#111',
            borderRight: '1px solid #e0e7ef',
            boxShadow: 'none',
            top: 0,
            height: '100vh',
            position: 'fixed',
            left: 0,
            transition: theme => theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          }
        }}
        open
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          px: isCollapsed ? 2 : 3, 
          py: 3, 
          borderBottom: 1, 
          borderColor: '#e0e7ef',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          minHeight: 64
        }}>
          <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24, flexShrink: 0 }} />
          {!isCollapsed && <span style={{ fontWeight: 'bold', fontSize: 20, color: '#111' }}>Admin Panel</span>}
        </Box>
        <List sx={{ flex: 1, px: 1, py: 2 }}>
          {sidebarLinks.map(link => (
            <ListItem disablePadding key={link.label}>
              <ListItemButton 
                component="a" 
                href={link.href} 
                selected={pathname === link.href} 
                sx={{ 
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 2 : 3,
                  py: 1.5,
                  borderRadius: '10px',
                  mb: 0.5,
                  color: pathname === link.href ? '#6366f1' : '#111',
                  bgcolor: pathname === link.href ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.12)',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isCollapsed ? 0 : 40,
                  color: pathname === link.href ? '#6366f1' : '#666',
                  mr: isCollapsed ? 0 : 2 
                }}>
                  {link.icon}
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={link.label} sx={{ m: 0 }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            onClick={onToggleCollapse}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 0,
              p: 1,
              borderRadius: '10px',
              color: '#666',
              borderColor: 'rgba(0,0,0,0.12)',
              justifyContent: 'center',
              '&:hover': {
                borderColor: '#6366f1',
                color: '#6366f1',
              }
            }}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </Button>
          {!isCollapsed && (
            <Button 
              onClick={logout} 
              color="error" 
              variant="outlined" 
              startIcon={<FaSignOutAlt />} 
              fullWidth 
              sx={{ 
                fontWeight: 600,
                borderRadius: '10px',
              }}
            >
              Logout
            </Button>
          )}
          {isCollapsed && (
            <Button
              onClick={logout}
              color="error"
              variant="outlined"
              sx={{
                minWidth: 0,
                p: 1,
                borderRadius: '10px',
                justifyContent: 'center',
              }}
            >
              <FaSignOutAlt />
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
