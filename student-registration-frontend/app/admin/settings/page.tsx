'use client';
import { Box, Typography, Paper, Switch, TextField, Button, FormControlLabel, Divider, Alert } from '@mui/material';
import { FaCog, FaBell, FaShieldAlt, FaUserGraduate } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SettingsState {
  emailNotifications: boolean;
  autoApproveRegistrations: boolean;
  maxStudentsPerClass: number;
  registrationPrefix: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { notify } = useNotification();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    autoApproveRegistrations: false,
    maxStudentsPerClass: 30,
    registrationPrefix: 'STU',
    maintenanceMode: false
  });

  // Fetch settings
  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await api.get('/api/admin/settings');
      return response.data;
    }
  });

  // Update local state when settings data is loaded
  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

  // Update settings mutation
  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (newSettings: SettingsState) => {
      const response = await api.put('/api/admin/settings', newSettings);
      return response.data;
    },
    onSuccess: () => {
      notify('Settings saved successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => {
      notify('Failed to save settings', 'error');
    }
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  const handleSaveSettings = () => {
    updateSettings(settings);
  };

  if (loading || isLoadingSettings) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  }

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
          maxWidth: 1400, 
          mx: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          gap: 4 
        }}>
          <Box sx={{ 
            bgcolor: '#fff', 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid rgba(231, 235, 240, 0.8)'
          }}>
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(231, 235, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <FaCog style={{ color: '#6366f1', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>Admin Settings</Typography>
            </Box>

            <Box sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 4 }}>
                These settings affect how the system behaves. Changes will take effect immediately after saving.
              </Alert>

              {/* Notifications Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaBell /> Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Enable email notifications for new registrations"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Registration Settings */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaUserGraduate /> Registration Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoApproveRegistrations}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoApproveRegistrations: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label="Auto-approve new student registrations"
                  />
                  <TextField
                    label="Maximum Students per Class"
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxStudentsPerClass: parseInt(e.target.value) || 0 }))}
                    sx={{ maxWidth: 200 }}
                  />
                  <TextField
                    label="Registration Number Prefix"
                    value={settings.registrationPrefix}
                    onChange={(e) => setSettings(prev => ({ ...prev, registrationPrefix: e.target.value }))}
                    sx={{ maxWidth: 200 }}
                    helperText="Prefix used for student registration numbers"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* System Settings */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FaShieldAlt /> System Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                      color="warning"
                    />
                  }
                  label="Enable Maintenance Mode"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={isUpdating}
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4,
                    bgcolor: '#6366f1',
                    '&:hover': {
                      bgcolor: '#4f46e5'
                    }
                  }}
                >
                  {isUpdating ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
