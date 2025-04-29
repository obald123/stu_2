'use client';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationDisplay from '../components/NotificationDisplay';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children, isAdminRoute }: { children: React.ReactNode; isAdminRoute: boolean }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <NotificationProvider>
          <NotificationDisplay />
          {isAdminRoute ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 flex flex-col justify-center items-center w-full">
                {children}
              </main>
            </div>
          ) : (
            <>
              {!(isLoginPage || isRegisterPage) && <NavBar />}
              <main className="flex-1 flex flex-col justify-center items-center w-full">
                {children}
              </main>
            </>
          )}
          {!(isLoginPage || isRegisterPage) && <Footer />}
        </NotificationProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
