'use client';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton } from '@mui/material';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

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
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{ sx: { width: 260, bgcolor: 'background.paper', borderRight: 1, borderColor: 'grey.200', boxShadow: 3 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24 }} />
        <span style={{ fontWeight: 'bold', fontSize: 20 }}>Admin Panel</span>
      </Box>
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/dashboard" selected={pathname === '/admin/dashboard'}>
            <ListItemIcon><FaUsers /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/audit-log" selected={pathname === '/admin/audit-log'}>
            <ListItemIcon><FaClipboardList /></ListItemIcon>
            <ListItemText primary="Audit Log" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/admin/settings" selected={pathname === '/admin/settings'}>
            <ListItemIcon><FaTachometerAlt /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <Button onClick={logout} color="error" variant="outlined" startIcon={<FaSignOutAlt />} fullWidth>
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
