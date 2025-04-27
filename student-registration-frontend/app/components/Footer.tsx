import { Box, Typography, Link as MuiLink } from '@mui/material';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaReact } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box component="footer" sx={{ width: '100%', bgcolor: 'primary.main', color: 'white', py: 4, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto', fontSize: '0.95rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaMapMarkerAlt style={{ color: '#FFD600' }} />
          <MuiLink href="https://maps.google.com/?q=Kigali,Rwanda" target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">Kigali, Rwanda</MuiLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaEnvelope style={{ color: '#FFD600' }} />
            <MuiLink href="mailto:simuoba123@gmail.com" color="inherit" underline="hover">simuoba123@gmail.com</MuiLink>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaPhoneAlt style={{ color: '#FFD600' }} />
            <MuiLink href="tel:+250789934421" color="inherit" underline="hover">+250 789 934 421</MuiLink>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography component="span">&copy; 2025 All Rights Reserved</Typography>
      </Box>
    </Box>
  );
}
