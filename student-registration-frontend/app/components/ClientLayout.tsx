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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHideNavAndFooter(['/login', '/register'].includes(pathname || ''));
  }, [pathname]);

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <NotificationProvider>
          <NotificationDisplay />
          <Box
            sx={{
              minHeight: '100vh',
              width: '100%',
              display: 'flex',
              bgcolor: '#f8fafc'
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
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
                ml: isAdminRoute && !hideNavAndFooter ? 
                  { 
                    xs: 0, 
                    md: isSidebarCollapsed ? '80px' : '260px' 
                  } : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              {!hideNavAndFooter && (
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
                  px: hideNavAndFooter ? 0 : { 
                    xs: 2, 
                    sm: 3, 
                    md: isAdminRoute ? (isSidebarCollapsed ? 4 : 3) : 4,
                    lg: 6 
                  },
                  pt: !hideNavAndFooter ? { 
                    xs: '64px', 
                    sm: '72px', 
                    md: '80px' 
                  } : 0,
                  pb: !hideNavAndFooter ? { xs: 2, sm: 3 } : 0,
                  maxWidth: hideNavAndFooter ? '100%' : {
                    xs: '100%',
                    sm: isAdminRoute ? 
                      (isSidebarCollapsed ? '900px' : '800px') : 
                      '600px',
                    md: isAdminRoute ? 
                      (isSidebarCollapsed ? '1200px' : '1100px') : 
                      '900px',
                    lg: isAdminRoute ? 
                      (isSidebarCollapsed ? '1400px' : '1300px') : 
                      '1200px'
                  },
                  mx: 'auto',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {children}
              </Box>
              {!hideNavAndFooter && (
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
