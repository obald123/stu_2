'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton, Typography, Avatar, Tooltip, Badge } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaUserEdit, FaCog, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ 
  isCollapsed = false, 
  onToggleCollapse 
}: { 
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { isAdmin, logout } = useAuth();
  const { notifications } = useNotification();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
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
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: isCollapsed && !isHovered ? 80 : 260,
            bgcolor: '#fff',
            color: '#111',
            borderRight: '1px solid #e0e7ef',
            boxShadow: '4px 0 8px rgba(0,0,0,0.03)',
            position: 'fixed',
            top: 0,
            height: '100vh',
            zIndex: 1300,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden'
          }
        }}
        open
        data-testid="desktop-sidebar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          transition: 'all 0.2s ease'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            px: 3, 
            py: { xs: 2, sm: 3 }, 
            borderBottom: 1, 
            borderColor: '#e0e7ef', 
            bgcolor: '#6366f1', 
            justifyContent: 'space-between',
            minHeight: { xs: '64px', sm: '72px', md: '80px' },
            transition: 'all 0.3s ease'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              transition: 'all 0.3s ease',
              overflow: 'hidden'
            }}>
              <Avatar sx={{ 
                bgcolor: '#fff', 
                color: '#6366f1', 
                fontWeight: 700,
                flexShrink: 0
              }}>A</Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#fff',
                  opacity: isCollapsed && !isHovered ? 0 : 1,
                  transform: isCollapsed && !isHovered ? 'translateX(-20px)' : 'translateX(0)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap'
                }}
              >
                Admin Panel
              </Typography>
            </Box>
            <IconButton 
              onClick={onToggleCollapse}
              sx={{ 
                color: '#fff',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isCollapsed ? 'rotate(180deg)' : 'none',
                opacity: isHovered || !isCollapsed ? 1 : 0
              }}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', py: { xs: 2, sm: 3 } }}>
            <List sx={{ px: 2 }}>
              {sidebarLinks.map(link => (
                <ListItem disablePadding key={link.label}>
                  <Tooltip title={isCollapsed && !isHovered ? link.label : ''} placement="right">
                    <ListItemButton 
                      component="a" 
                      href={link.href} 
                      selected={pathname === link.href} 
                      sx={{ 
                        color: pathname === link.href ? '#6366f1' : '#111', 
                        fontWeight: 600, 
                        borderRadius: 2, 
                        mb: 1,
                        px: 2,
                        py: 1.5,
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': { 
                          bgcolor: alpha('#6366f1', 0.08)
                        },
                        '&:hover': {
                          bgcolor: alpha('#6366f1', 0.08),
                          transform: 'translateX(4px)'
                        }
                      }}
                      data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ListItemIcon 
                        sx={{ 
                          color: pathname === link.href ? '#6366f1' : '#6366f1',
                          minWidth: isCollapsed && !isHovered ? 'auto' : 40,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={link.label}
                        sx={{
                          opacity: isCollapsed && !isHovered ? 0 : 1,
                          transform: isCollapsed && !isHovered ? 'translateX(-20px)' : 'translateX(0)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '.MuiListItemText-primary': {
                            fontWeight: 600
                          }
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Tooltip title={isCollapsed && !isHovered ? 'Logout' : ''} placement="right">
              <Button 
                onClick={logout} 
                color="error" 
                variant="outlined" 
                startIcon={!isCollapsed && <FaSignOutAlt />} 
                fullWidth 
                sx={{ 
                  fontWeight: 600,
                  minWidth: 'auto',
                  ...(isCollapsed && !isHovered && {
                    '& .MuiButton-startIcon': { margin: 0 }
                  })
                }}
                data-testid="sidebar-logout-button"
              >
                {isCollapsed && !isHovered ? <FaSignOutAlt /> : 'Logout'}
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
