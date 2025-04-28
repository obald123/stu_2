import { Box, Typography } from '@mui/material';
import { FaCog } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

export default function AdminSettingsPage() {
 
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fb' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 5 }, borderRadius: 4, bgcolor: '#fff', color: '#111', boxShadow: 2, border: '1px solid #e0e7ef' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <FaCog style={{ color: '#6366f1', fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700}>Admin Settings</Typography>
          </Box>
          <Typography color="text.secondary" align="center">No settings available at this time.</Typography>
        </Box>
      </Box>
    </Box>
  );
}
