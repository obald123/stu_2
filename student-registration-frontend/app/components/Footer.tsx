import { Box, Typography, Link as MuiLink } from '@mui/material';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaReact } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box component="footer" sx={{ width: '100%', bgcolor: '#fff', color: '#111', py: 4, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto', fontSize: '0.95rem', borderTop: '1px solid #e0e7ef' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: 2, width: '100%', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 } }}>
          <FaMapMarkerAlt style={{ color: '#6366f1' }} />
          <MuiLink href="https://maps.google.com/?q=Kigali,Rwanda" target="_blank" rel="noopener noreferrer" sx={{ color: '#111', fontWeight: 600 }} underline="hover">Kigali, Rwanda</MuiLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaEnvelope style={{ color: '#6366f1' }} />
            <MuiLink href="mailto:simuoba123@gmail.com" sx={{ color: '#111', fontWeight: 600 }} underline="hover">simuoba123@gmail.com</MuiLink>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaPhoneAlt style={{ color: '#6366f1' }} />
            <MuiLink href="tel:+250789934421" sx={{ color: '#111', fontWeight: 600 }} underline="hover">+250 789 934 421</MuiLink>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography component="span">&copy; 2025 All Rights Reserved</Typography>
      </Box>
    </Box>
  );
}
