'use client';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationDisplay from '../components/NotificationDisplay';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children, isAdminRoute }: { children: React.ReactNode; isAdminRoute: boolean }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hideNavAndFooter, setHideNavAndFooter] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHideNavAndFooter(['/login', '/register', '/forgot-password'].includes(pathname || ''));
  }, [pathname]);

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <NotificationProvider>
          <NotificationDisplay />
          <Box
            sx={{
              display: 'flex',
              minHeight: '100vh',
              background: '#f8fafc'
            }}
          >
            {isAdminRoute && !hideNavAndFooter && (
              <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              />
            )}
            <Box
              component="main"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                position: 'relative',
                ml: isAdminRoute && !hideNavAndFooter ? 
                  { 
                    xs: 0, 
                    md: isSidebarCollapsed ? '80px' : '260px' 
                  } : 0,
                transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {!hideNavAndFooter && !isLandingPage && (
                <NavBar 
                  isCollapsed={isSidebarCollapsed} 
                  showSidebar={isAdminRoute}
                  isMobile={isMobile}
                />
              )}
              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                  px: isLandingPage ? 0 : (hideNavAndFooter ? 0 : { 
                    xs: 2, 
                    sm: 3, 
                    md: 4,
                    lg: 6 
                  }),
                  pt: !hideNavAndFooter && !isLandingPage ? { 
                    xs: '64px', 
                    sm: '72px', 
                    md: '80px' 
                  } : 0,
                  pb: !hideNavAndFooter ? { xs: 2, sm: 3 } : 0,
                }}
              >
                <Box
                  sx={{
                    maxWidth: isLandingPage ? 'none' : (hideNavAndFooter ? '100%' : {
                      xs: '100%',
                      sm: '900px',
                      md: '1200px',
                      lg: '1400px'
                    }),
                    mx: isLandingPage ? 0 : 'auto',
                    width: '100%'
                  }}
                >
                  {children}
                </Box>
              </Box>
              {!hideNavAndFooter && !isLandingPage && (
                <Footer 
                  isCollapsed={isSidebarCollapsed}
                  showSidebar={isAdminRoute}
                />
              )}
            </Box>
          </Box>
        </NotificationProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
