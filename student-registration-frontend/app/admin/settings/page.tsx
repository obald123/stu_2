'use client';
import { Box, Typography, Paper, Button } from '@mui/material';
import { FaCog } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 
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
              <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
                No settings available at this time. Settings panel will be implemented in future updates.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  Configure Settings
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
