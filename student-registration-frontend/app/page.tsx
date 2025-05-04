'use client';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaQuoteLeft, FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import Logo from './components/Logo';
import { Box, Typography, Button, Tooltip } from '@mui/material';

export default function Home() {
  const { isAuthenticated, isAdmin, logout, user, loading } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(120deg, #f8fafc 0%, #e2e8f0 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/register.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.07,
          zIndex: 0,
        }}
      />
      <Box
        className="particles"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
        }}
      />

      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          width: '100vw',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, md: 0 },
          minHeight: { md: '100vh' },
        }}
      >
        {/* Left section */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 0 50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'center',
            pl: { xs: 4, md: 8 },
            pr: { xs: 4, md: 0 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Logo size={96} />
          </Box>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 900,
              color: '#1a365d',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              mb: 3
            }}
          >
            Your Academic Journey Starts Here
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 500,
              color: '#4a5568',
              mb: 6,
              maxWidth: '600px'
            }}
          >
            Join INES-Ruhengeri's modern student management platform for a seamless educational experience
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                href="/register"
                component={Link}
                variant="contained"
                size="large"
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  bgcolor: '#6366f1',
                  '&:hover': {
                    bgcolor: '#4f46e5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(99,102,241,0.2)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Get Started
              </Button>
              <Button
                href="/login"
                component={Link}
                variant="outlined"
                size="large"
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  '&:hover': {
                    borderColor: '#4f46e5',
                    bgcolor: 'rgba(99,102,241,0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.1)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </Button>
            </Box>
          )}

          {/* Social Media Links */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 3, sm: 4 },
            mt: 6,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            {[
              { icon: <FaPhone />, href: "tel:+250789934421", label: "Call us" },
              { icon: <FaEnvelope />, href: "mailto:simugomwaobald250@gmail.com", label: "Contact us" },
              { icon: <FaMapMarkerAlt />, href: "https://www.google.com/maps/place/Institute+of+Applied+Sciences+%2F+Institut+d%E2%80%99Enseignement+Superieur+-+INES+Ruhengeri./@-1.5010983,29.6087225,17z/data=!4m14!1m7!3m6!1s0x19dc5a70e0183efd:0xfdd704e5bf52a900!2sInstitute+of+Applied+Sciences+%2F+Institut+d%E2%80%99Enseignement+Superieur+-+INES+Ruhengeri.!8m2!3d-1.5010983!4d29.6112974!16s%2Fg%2F1yg56hx9d!3m5!1s0x19dc5a70e0183efd:0xfdd704e5bf52a900!8m2!3d-1.5010983!4d29.6112974!16s%2Fg%2F1yg56hx9d?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D", label: "Find us" },
              { icon: <FaGithub />, href: "https://github.com/obald123/stu_2", label: "GitHub" },
              { icon: <FaTwitter />, href: "https://x.com/Simugomwa_obald", label: "X" },
              { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/simugomwa-obald-4a4402216/", label: "LinkedIn" }
            ].map((social) => (
              <Box key={social.label} sx={{ position: 'relative' }}>
                <Tooltip title={social.label}>
                  <Box
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    sx={{ 
                      color: '#6366f1',
                      fontSize: { xs: 24, sm: 28 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#4f46e5',
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                      }
                    }}
                  >
                    {social.icon}
                  </Box>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right section */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '1 0 50%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            pl: { xs: 4, md: 8 },
            pr: 0,
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(4px)',
            marginRight: 0,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <LoadingSpinner size={56} />
            </Box>
          ) : isAuthenticated ? (
            <Box 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: { xs: 3, sm: 6 },
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                transform: 'translateZ(0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateZ(0) translateY(-8px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)'
                }
              }}
            >
              <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.1)' }}>
                {isAdmin ? (
                  <FaTachometerAlt style={{ fontSize: 48, color: '#6366f1' }} />
                ) : (
                  <FaUserCircle style={{ fontSize: 48, color: '#6366f1' }} />
                )}
              </Box>
              <Typography variant="h4" fontWeight={800} color="primary" align="center">
                Welcome back, {user?.firstName}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {isAdmin 
                  ? "Access your admin dashboard to manage users and view analytics."
                  : "Check your profile and manage your student information."}
              </Typography>
              <Button
                href={isAdmin ? "/admin/dashboard" : "/profile"}
                component={Link}
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  bgcolor: '#6366f1',
                  mt: 2,
                  '&:hover': {
                    bgcolor: '#4f46e5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(99,102,241,0.2)',
                  },
                }}
              >
                {isAdmin ? "Go to Dashboard" : "View Profile"}
              </Button>
            </Box>
          ) : (
            <>
              {/* Feature cards */}
              <Box sx={{ display: 'grid', gap: 3 }}>
                {[
                  {
                    icon: <FaUserPlus style={{ fontSize: 32, color: '#6366f1' }} />,
                    title: 'Quick Registration',
                    description: 'Get started in minutes with our streamlined registration process'
                  },
                  {
                    icon: <FaUniversity style={{ fontSize: 32, color: '#6366f1' }} />,
                    title: 'Institution Portal',
                    description: 'Access all your academic information in one secure place'
                  },
                  {
                    icon: <FaUserCircle style={{ fontSize: 32, color: '#6366f1' }} />,
                    title: 'Student Profile',
                    description: 'Manage your academic journey with an intuitive interface'
                  }
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      p: 3,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transform: 'translateZ(0)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateZ(0) translateX(8px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(99,102,241,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: '#2d3748' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

