'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaUserEdit, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  
  const NAVBAR_HEIGHT = typeof window !== 'undefined' && window.innerWidth < 600 ? 56 : 64;



  if (!isAdmin) return null;

  // Sidebar links for admin dashboard
  const sidebarLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <FaUsers /> },
    { label: 'User Management', href: '/admin/dashboard#users', icon: <FaUserEdit /> },
    { label: 'Audit Log', href: '/admin/audit-log', icon: <FaClipboardList /> },
    { label: 'Settings', href: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: NAVBAR_HEIGHT, left: 16, zIndex: 1300 }}>
        <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
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
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: '#fff',
            color: '#111',
            borderRight: '1px solid #e0e7ef',
            boxShadow: 2,
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            position: 'sticky',
            alignSelf: 'flex-start',
            transition: 'top 0.2s',
          }
        }}
        open
      >
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
      </Drawer>
    </>
  );
}
