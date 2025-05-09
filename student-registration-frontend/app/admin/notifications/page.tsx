'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { NotificationType } from '../../context/NotificationContext';

interface SystemNotification {
  id: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>(['success', 'error', 'info', 'warning']);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin]);

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['system-notifications'],
    queryFn: async () => {
      const response = await api.get('/admin/notifications');
      return response.data as SystemNotification[];
    },
    staleTime: 30000,
  });

  const handleTypeFilter = (
    _event: React.MouseEvent<HTMLElement>,
    newTypes: NotificationType[],
  ) => {
    setSelectedTypes(newTypes.length ? newTypes : ['success', 'error', 'info', 'warning']);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      // Invalidate and refetch notifications
      // Note: You'll need to set up a queryClient to use this
      // queryClient.invalidateQueries(['system-notifications']);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      // Invalidate and refetch notifications
      // queryClient.invalidateQueries(['system-notifications']);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  if (loading || notificationsLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

  const filteredNotifications = notifications?.filter(
    (notification) => selectedTypes.includes(notification.type)
  ) || [];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: '64px', sm: '72px', md: '80px' },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          ml: { xs: 0, md: isSidebarCollapsed ? '80px' : '260px' },
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Box sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1a202c' }}>
              System Notifications
            </Typography>
            <ToggleButtonGroup
              value={selectedTypes}
              onChange={handleTypeFilter}
              aria-label="notification type filter"
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="success" aria-label="success notifications">
                <SuccessIcon sx={{ mr: 1 }} />
                Success
              </ToggleButton>
              <ToggleButton value="error" aria-label="error notifications">
                <ErrorIcon sx={{ mr: 1 }} />
                Error
              </ToggleButton>
              <ToggleButton value="warning" aria-label="warning notifications">
                <WarningIcon sx={{ mr: 1 }} />
                Warning
              </ToggleButton>
              <ToggleButton value="info" aria-label="info notifications">
                <InfoIcon sx={{ mr: 1 }} />
                Info
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
            {filteredNotifications.length === 0 ? (
              <ListItem>
                <Typography sx={{ color: '#64748b' }}>
                  No notifications found
                </Typography>
              </ListItem>
            ) : (
              filteredNotifications.map((notification) => (
                <Paper
                  key={notification.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    bgcolor: notification.read ? 'background.paper' : 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      py: 2,
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(notification.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                      {getNotificationIcon(notification.type)}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#1a202c',
                            fontWeight: notification.read ? 400 : 500,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                </Paper>
              ))
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
}