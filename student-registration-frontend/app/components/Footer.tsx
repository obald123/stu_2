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
        transition: theme => theme.transitions.create(['width', 'margin-left'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        })
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
          transition: theme => theme.transitions.create(['padding', 'max-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          })
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
          <Tooltip title="Email us">
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
          <Tooltip title="Location">
            <MuiLink 
              href="https://goo.gl/maps/123" 
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
