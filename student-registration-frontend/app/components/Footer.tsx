import { Box, Typography, Link as MuiLink, Tooltip } from '@mui/material';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function Footer({ 
  isCollapsed = false,
  showSidebar = false
}: { 
  isCollapsed?: boolean;
  showSidebar?: boolean;
}) {
  return (
    <Box 
      component="footer" 
      data-testid="footer-container"
      sx={{
        width: showSidebar ? {
          xs: '100%',
          md: `calc(100% - ${isCollapsed ? '80px' : '260px'})`
        } : '100%',
        ml: showSidebar ? {
          xs: 0,
          md: isCollapsed ? '80px' : '260px'
        } : 0,
        bgcolor: '#fff',
        color: '#6366f1',
        borderTop: '1px solid #e0e7ef',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.03)',
        mt: 'auto',
        position: 'relative',
        zIndex: 1100,
        transition: 'all 0.3s ease'
      }}
    >
      <Box
        sx={{
          maxWidth: { 
            xs: '100%',
            sm: showSidebar ? 
              (isCollapsed ? '900px' : '800px') : 
              '600px',
            md: showSidebar ? 
              (isCollapsed ? '1200px' : '1100px') : 
              '900px',
            lg: showSidebar ? 
              (isCollapsed ? '1400px' : '1300px') : 
              '1200px'
          },
          mx: 'auto',
          px: { 
            xs: 2, 
            sm: 3, 
            md: showSidebar ? (isCollapsed ? 4 : 3) : 4, 
            lg: 6 
          },
          py: { xs: 2, sm: 2.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          transition: 'all 0.3s ease'
        }}
      >
        <Typography 
          component="span" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '0.813rem', sm: '0.875rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          &copy; 2025 Student Registration System
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 3, sm: 2, md: 3 },
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Tooltip title="Call us">
            <MuiLink 
              href="tel:+250789934421" 
              target="_blank" 
              rel="noopener" 
              sx={{ 
                color: '#6366f1', 
                fontSize: { xs: 20, sm: 18 },
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4f46e5',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <FaPhone />
            </MuiLink>
          </Tooltip>
          <Tooltip title="Contact us">
            <MuiLink 
              href="mailto:simugomwaobald250@gmail.com" 
              target="_blank" 
              rel="noopener" 
              sx={{ 
                color: '#6366f1', 
                fontSize: { xs: 20, sm: 18 },
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4f46e5',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <FaEnvelope />
            </MuiLink>
          </Tooltip>
          <Tooltip title="Find us">
            <MuiLink 
              href="https://www.google.com/maps/place/Institute+of+Applied+Sciences+%2F+Institut+d%E2%80%99Enseignement+Superieur+-+INES+Ruhengeri./@-1.5010983,29.6087225,17z/data=!4m14!1m7!3m6!1s0x19dc5a70e0183efd:0xfdd704e5bf52a900!2sInstitute+of+Applied+Sciences+%2F+Institut+d%E2%80%99Enseignement+Superieur+-+INES+Ruhengeri.!8m2!3d-1.5010983!4d29.6112974!16s%2Fg%2F1yg56hx9d!3m5!1s0x19dc5a70e0183efd:0xfdd704e5bf52a900!8m2!3d-1.5010983!4d29.6112974!16s%2Fg%2F1yg56hx9d?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener" 
              sx={{ 
                color: '#6366f1', 
                fontSize: { xs: 20, sm: 18 },
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#4f46e5',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <FaMapMarkerAlt />
            </MuiLink>
          </Tooltip>
          {[
            { icon: <FaGithub />, href: "https://github.com/obald123/stu_2", label: "GitHub" },
            { icon: <FaTwitter />, href: "https://x.com/Simugomwa_obald", label: "Twitter" },
            { icon: <FaLinkedin />, href: "https://linkedin.com/simugomwa-obald-4a4402216/", label: "LinkedIn" }
          ].map((social) => (  
            <Tooltip key={social.label} title={social.label}>
              <MuiLink 
                href={social.href} 
                target="_blank" 
                rel="noopener" 
                sx={{ 
                  color: '#6366f1', 
                  fontSize: { xs: 20, sm: 18 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#4f46e5',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {social.icon}
              </MuiLink>
            </Tooltip>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
