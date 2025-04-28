'use client';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaClipboardList } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AuditLogPage() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fb', py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 4, borderRadius: 4, bgcolor: '#fff', color: '#111', boxShadow: 2, border: '1px solid #e0e7ef' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FaClipboardList style={{ color: '#6366f1', fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>Audit Log</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 ? data.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.userId || '-'}</TableCell>
                  <TableCell>{log.performedBy}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.details ? JSON.stringify(log.details) : '-'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary' }}>No audit log entries found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
