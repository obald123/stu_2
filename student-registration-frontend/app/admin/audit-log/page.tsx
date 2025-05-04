'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FaClipboardList } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import Sidebar from '../../components/Sidebar';
import { format } from 'date-fns';

export default function AuditLogPage() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audit-log'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-log');
      return res.data.log;
    },
    staleTime: 10000,
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      window.location.href = '/';
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading || isLoading) {
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
              <FaClipboardList style={{ color: '#6366f1', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>Audit Log</Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Performed By</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((log: any) => (
                    <TableRow 
                      key={log.id}
                      hover
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'rgba(99, 102, 241, 0.04)' 
                        } 
                      }}
                    >
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell sx={{ color: '#4b5563', fontWeight: 500 }}>{log.action}</TableCell>
                      <TableCell>{log.performedBy}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          maxWidth: 400,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
