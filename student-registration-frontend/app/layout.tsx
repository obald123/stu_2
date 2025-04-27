import ClientLayout from './components/ClientLayout';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student Registration System',
  description: 'Manage student registrations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-safe admin route check
  const isAdminRoute = typeof window !== 'undefined'
    ? window.location.pathname.startsWith('/admin')
    : false;
  return (
    <html lang="en">
      <body className={inter.className + ' min-h-screen flex flex-col relative bg-gray-50'}>
        {/* Watermark */}
        {/* Removed background image for cleaner look */}
        {/* <div className="fixed inset-0 pointer-events-none select-none z-0 flex justify-center items-center opacity-50">
          <img src="/bgpic.png" alt="Watermark" className="w-8/9 max-w-9xl" />
        </div> */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <ClientLayout isAdminRoute={isAdminRoute}>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}