'use client';
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Box, Divider, ListItemButton, Typography, Avatar, Tooltip, Badge } from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList, FaUserEdit, FaCog, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isAdmin) return null;
  const unreadCount = notifications.length;

  const sidebarLinks = [
    { 
      label: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: <FaTachometerAlt data-testid="dashboard-icon" /> 
    },
    { 
      label: 'User Management', 
      href: '/admin/users', 
      icon: <FaUserEdit data-testid="users-icon" />
    },
    { 
      label: 'Audit Log', 
      href: '/admin/audit-log', 
      icon: <FaClipboardList data-testid="audit-icon" /> 
    },
    { 
      label: 'Settings',
      href: '/admin/settings',
      icon: <FaCog data-testid="settings-icon" />
    },
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
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: isCollapsed && !isHovered ? 80 : 260,
          bgcolor: '#fff',
          color: '#1a202c',
          borderRight: '1px solid rgba(231, 235, 240, 0.8)',
          boxShadow: '1px 0 8px rgba(0,0,0,0.05)',
          position: 'fixed',
          top: 0,
          height: '100vh',
          zIndex: 1200,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden'
        }
      }}
      open
      data-testid="desktop-sidebar"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <Box sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
          minHeight: { xs: '64px', sm: '72px', md: '80px' }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            opacity: isCollapsed && !isHovered ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}>
            <FaTachometerAlt style={{ color: '#6366f1', fontSize: 24 }} />
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{
                color: '#1a202c',
                whiteSpace: 'nowrap',
                opacity: isCollapsed && !isHovered ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              Admin Panel
            </Typography>
          </Box>
          <IconButton 
            onClick={onToggleCollapse}
            sx={{ 
              color: '#64748b',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isCollapsed ? 'rotate(180deg)' : 'none'
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        {/* Navigation Links */}
        <List sx={{ 
          flex: 1, 
          px: 2, 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          {sidebarLinks.map(link => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                sx={{
                  borderRadius: 2,
                  color: pathname === link.href ? '#6366f1' : '#64748b',
                  bgcolor: pathname === link.href ? 'rgba(99,102,241,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  minHeight: 44,
                  '&:hover': {
                    bgcolor: 'rgba(99,102,241,0.08)',
                    color: '#6366f1',
                    transform: 'translateX(4px)'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(99,102,241,0.12)',
                    '&:hover': {
                      bgcolor: 'rgba(99,102,241,0.16)'
                    }
                  }
                }}
                data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: isCollapsed && !isHovered ? 'auto' : 40,
                    color: 'inherit',
                    transition: 'min-width 0.3s ease',
                    justifyContent: isCollapsed && !isHovered ? 'center' : 'flex-start',
                    mr: isCollapsed && !isHovered ? 0 : 2
                  }}
                >
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={link.label}
                  sx={{
                    opacity: isCollapsed && !isHovered ? 0 : 1,
                    visibility: isCollapsed && !isHovered ? 'hidden' : 'visible',
                    transition: 'all 0.3s ease',
                    m: 0,
                    '& .MuiTypography-root': {
                      fontWeight: 600,
                      fontSize: '0.9375rem'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Logout Section */}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid rgba(231, 235, 240, 0.8)'
        }}>
          <Button
            onClick={logout}
            color="error"
            variant="outlined"
            startIcon={isCollapsed && !isHovered ? null : <FaSignOutAlt />}
            fullWidth
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              minHeight: 42,
              justifyContent: isCollapsed && !isHovered ? 'center' : 'flex-start',
              '& .MuiButton-startIcon': {
                opacity: isCollapsed && !isHovered ? 0 : 1,
                visibility: isCollapsed && !isHovered ? 'hidden' : 'visible',
                transition: 'all 0.3s ease',
              },
              '& .MuiButton-endIcon': {
                ml: isCollapsed && !isHovered ? 0 : 'auto'
              },
              '&:hover': {
                backgroundColor: 'rgba(239,68,68,0.08)',
                borderColor: '#dc2626'
              }
            }}
            data-testid="sidebar-logout-button"
          >
            {isCollapsed && !isHovered ? <FaSignOutAlt /> : 'Logout'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
