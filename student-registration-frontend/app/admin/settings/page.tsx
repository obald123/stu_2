import { Box, Typography, Paper } from '@mui/material';
import { FaCog } from 'react-icons/fa';

export default function AdminSettingsPage() {
 
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', py: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <FaCog style={{ color: '#6366f1', fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>Admin Settings</Typography>
      </Box>
      <Paper sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 5, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: 2 }}>
        <Typography color="text.secondary" align="center">No settings available at this time.</Typography>
      </Paper>
    </Box>
  );
}
