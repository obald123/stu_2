'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle dark mode on the body
  const handleDarkMode = () => {
    setDarkMode((d) => {
      if (!d) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return !d;
    });
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Mobile Sidebar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1300 }}>
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
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/dashboard" selected={pathname === '/admin/dashboard'} sx={{ color: '#111', fontWeight: 600 }}>
                  <ListItemIcon sx={{ color: '#6366f1' }}><FaUsers /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/audit-log" selected={pathname === '/admin/audit-log'} sx={{ color: '#111', fontWeight: 600 }}>
                  <ListItemIcon sx={{ color: '#6366f1' }}><FaClipboardList /></ListItemIcon>
                  <ListItemText primary="Audit Log" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="/admin/settings" selected={pathname === '/admin/settings'} sx={{ color: '#111', fontWeight: 600 }}>
                  <ListItemIcon sx={{ color: '#6366f1' }}><FaTachometerAlt /></ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
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
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: 260, bgcolor: '#fff', color: '#111', borderRight: '1px solid #e0e7ef', boxShadow: 2 } }}
        open
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: '#e0e7ef' }}>
          <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24 }} />
          <span style={{ fontWeight: 'bold', fontSize: 20, color: '#111' }}>Admin Panel</span>
        </Box>
        <List sx={{ flex: 1, px: 1, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/admin/dashboard" selected={pathname === '/admin/dashboard'} sx={{ color: '#111', fontWeight: 600 }}>
              <ListItemIcon sx={{ color: '#6366f1' }}><FaUsers /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/admin/audit-log" selected={pathname === '/admin/audit-log'} sx={{ color: '#111', fontWeight: 600 }}>
              <ListItemIcon sx={{ color: '#6366f1' }}><FaClipboardList /></ListItemIcon>
              <ListItemText primary="Audit Log" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/admin/settings" selected={pathname === '/admin/settings'} sx={{ color: '#111', fontWeight: 600 }}>
              <ListItemIcon sx={{ color: '#6366f1' }}><FaTachometerAlt /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
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
