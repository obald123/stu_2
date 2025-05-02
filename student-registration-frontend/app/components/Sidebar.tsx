'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton, Typography, Avatar, Tooltip, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaUserEdit, FaCog, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const { notifications } = useNotification();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const NAVBAR_HEIGHT = typeof window !== 'undefined' && window.innerWidth < 600 ? 56 : 64;

  if (!isAdmin) return null;
  const unreadCount = notifications.length;

  const sidebarLinks = [
      { label: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt data-testid="dashboard-icon" /> },
    { 
      label: 'User Management', 
      href: '/admin/users', 
      icon: (
        <Badge badgeContent={unreadCount} color="error" data-testid="notifications-badge">
          <FaUserEdit data-testid="users-icon" />
        </Badge>
      )
    },
    { label: 'Audit Log', href: '/admin/audit-log', icon: <FaClipboardList data-testid="audit-icon" /> },
    { 
      label: 'Notifications', 
      href: '/admin/notifications', 
      icon: (
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          data-testid="notifications-badge"
          sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}
        >
          <FaBell />
        </Badge>
      )
    },
    { label: 'Settings', href: '/admin/settings', icon: <FaCog data-testid="settings-icon" /> },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', top: NAVBAR_HEIGHT, left: 16, zIndex: 1300 }}>
        <IconButton 
          color="inherit" 
          onClick={() => setMobileOpen(true)}
          data-testid="mobile-menu-button"
          aria-label="Open menu"
        >
          <MenuIcon sx={{ color: '#6366f1' }} />
        </IconButton>
        <Drawer 
          anchor="left" 
          open={mobileOpen} 
          onClose={() => setMobileOpen(false)}
          data-testid="mobile-sidebar"
        >
          <Box sx={{ width: 260 }} role="presentation" onClick={() => setMobileOpen(false)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: '#e0e7ef' }}>
              <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24 }} />
              <span style={{ fontWeight: 'bold', fontSize: 20, color: '#111' }}>Admin Panel</span>
            </Box>
            <List sx={{ flex: 1, px: 1, py: 2 }}>
              {sidebarLinks.map(link => (
                <ListItem disablePadding key={link.label}>
                  <ListItemButton 
                    component="a" 
                    href={link.href} 
                    selected={pathname === link.href} 
                    sx={{ color: '#111', fontWeight: 600 }}
                    data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <ListItemIcon sx={{ color: '#6366f1' }}>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ px: 3, py: 2 }}>
              <Button onClick={logout} color="error" variant="outlined" startIcon={<FaSignOutAlt />} fullWidth sx={{ fontWeight: 600 }} data-testid="sidebar-logout-button">
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
            width: isCollapsed ? 80 : 260,
            bgcolor: '#f8fafc',
            color: '#111',
            borderRight: '1px solid #e0e7ef',
            boxShadow: 2,
            position: 'fixed',
            top: 0,
            height: '100vh',
            zIndex: 1100,
            transition: 'width 0.2s'
          }
        }}
        open
        data-testid="desktop-sidebar"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3, borderBottom: 1, borderColor: '#e0e7ef', bgcolor: '#6366f1', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#fff', color: '#6366f1', fontWeight: 700 }}>A</Avatar>
            {!isCollapsed && (
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>Admin Panel</Typography>
            )}
          </Box>
          <IconButton 
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ color: '#fff' }}
            aria-label="toggle sidebar"
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        <List sx={{ flex: 1, px: 1, py: 2 }}>
          {sidebarLinks.map(link => (
            <ListItem disablePadding key={link.label}>
              <Tooltip title={isCollapsed ? link.label : ''} placement="right">
                <ListItemButton 
                  component="a" 
                  href={link.href} 
                  selected={pathname === link.href} 
                  sx={{ 
                    color: pathname === link.href ? '#6366f1' : '#111', 
                    fontWeight: 600, 
                    borderRadius: 2, 
                    mb: 1, 
                    '&.Mui-selected': { 
                      bgcolor: '#e0e7ef' 
                    }
                  }}
                  data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ListItemIcon sx={{ color: pathname === link.href ? '#6366f1' : '#6366f1', minWidth: isCollapsed ? 'auto' : 40 }}>
                    {link.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={link.label} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ px: 3, py: 2 }}>
          <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
            <Button 
              onClick={logout} 
              color="error" 
              variant="outlined" 
              startIcon={!isCollapsed && <FaSignOutAlt />} 
              fullWidth 
              sx={{ 
                fontWeight: 600,
                minWidth: 'auto',
                ...(isCollapsed && {
                  '& .MuiButton-startIcon': { margin: 0 }
                })
              }}
              data-testid="sidebar-logout-button"
            >
              {isCollapsed ? <FaSignOutAlt /> : 'Logout'}
            </Button>
          </Tooltip>
        </Box>
      </Drawer>
    </>
  );
}
