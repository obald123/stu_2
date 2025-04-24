'use client';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaQuoteLeft } from 'react-icons/fa';
import Logo from './components/Logo';

export default function Home() {
  const { isAuthenticated, isAdmin, logout, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size={56} />
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full flex flex-col items-center mt-8 mb-6">
        <Logo size={64} />
        <FaUniversity className="text-indigo-500 text-4xl mt-2 mb-2" />
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-2">Welcome to Student Registration System</h2>
        <p className="text-lg text-gray-600 mb-4">Easily manage your student profile, registration, and more!</p>
        {isAuthenticated ? (
          <div className="flex flex-col items-center bg-white/80 rounded-lg shadow-lg p-6 mb-4 w-full max-w-xl">
            <span className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-2"><FaUserCircle className="text-indigo-500" />Hello, {user?.firstName} {user?.lastName}</span>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {isAdmin && (
                <Link href="/admin/dashboard" className="btn-secondary flex items-center gap-2"><FaTachometerAlt /> Admin Dashboard</Link>
              )}
              <Link href="/profile" className="btn-secondary flex items-center gap-2"><FaUserCircle /> Profile</Link>
              <button onClick={logout} className="btn-secondary flex items-center gap-2"><FaSignOutAlt /> Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-white/80 rounded-lg shadow-lg p-6 mb-4 w-full max-w-xl">
            <div className="flex gap-4 mb-4">
              <Link href="/login" className="btn-primary flex items-center gap-2 text-lg min-w-[120px]"><FaSignInAlt /> Login</Link>
              <Link href="/register" className="btn-secondary flex items-center gap-2 text-lg min-w-[120px]"><FaUserPlus /> Register</Link>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-center mt-4 text-center">
        <h3 className="mt-2 text-2xl font-semibold text-indigo-600 flex items-center gap-2"><FaUniversity /> INES-Ruhengeri</h3>
        <div className="mt-2 text-indigo-700 font-medium text-lg">
          Empowering students and lecturers for a better campus experience in INES-Ruhengeri
        </div>
        <div className="mt-6 max-w-xl mx-auto bg-indigo-50 rounded-lg p-4 flex items-center gap-3 shadow">
          <FaQuoteLeft className="text-indigo-400 text-2xl" />
          <span className="italic text-gray-700">“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.”</span>
        </div>
      </div>
    </div>
  );
}