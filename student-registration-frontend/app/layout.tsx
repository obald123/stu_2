import ReactQueryProvider from './providers/ReactQueryProvider';
import { AuthProvider } from './context/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

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
  return (
    <html lang="en">
      <body className={inter.className + ' min-h-screen flex flex-col relative bg-gray-50'}>
        {/* Watermark */}
        <div className="fixed inset-0 pointer-events-none select-none z-0 flex justify-center items-center opacity-10">
          <img src="/bgpic.png" alt="Watermark" className="w-2/3 max-w-2xl" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <ReactQueryProvider>
            <AuthProvider>
              <NavBar />
              <main className="flex-1 flex flex-col justify-center items-center w-full">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}