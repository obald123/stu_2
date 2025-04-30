import { Box, Typography, Link as MuiLink } from '@mui/material';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      bgcolor: 'rgba(245,247,250,0.95)',
      color: '#222',
      py: 4,
      px: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 'auto',
      fontSize: '1rem',
      borderTop: '1px solid #e0e7ef',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.03)'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: { xs: 2, sm: 4 },
        mb: 2,
        width: '100%',
        justifyContent: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaMapMarkerAlt style={{ color: '#6366f1' }} />
          <MuiLink href="https://maps.google.com/?q=Kigali,Rwanda" target="_blank" rel="noopener noreferrer" sx={{ color: '#222', fontWeight: 600 }} underline="hover">Kigali, Rwanda</MuiLink>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaEnvelope style={{ color: '#6366f1' }} />
            <MuiLink href="mailto:simuoba123@gmail.com" sx={{ color: '#222', fontWeight: 600 }} underline="hover">simuoba123@gmail.com</MuiLink>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaPhoneAlt style={{ color: '#6366f1' }} />
            <MuiLink href="tel:+250789934421" sx={{ color: '#222', fontWeight: 600 }} underline="hover">+250 789 934 421</MuiLink>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 2, sm: 0 } }}>
          <MuiLink href="https://github.com/obald123/stu_2" target="_blank" rel="noopener" sx={{ color: '#6366f1', fontSize: 22 }}><FaGithub /></MuiLink>
          <MuiLink href="https://twitter.com/" target="_blank" rel="noopener" sx={{ color: '#6366f1', fontSize: 22 }}><FaTwitter /></MuiLink>
          <MuiLink href="https://linkedin.com/" target="_blank" rel="noopener" sx={{ color: '#6366f1', fontSize: 22 }}><FaLinkedin /></MuiLink>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, fontSize: 15, color: 'grey.600' }}>
        <Typography component="span">&copy; 2025 Student Registration System. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
}
