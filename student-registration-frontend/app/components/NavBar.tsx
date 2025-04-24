"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-dark-blue shadow-sm">
      <Logo size={36} />
      <span className="font-extrabold text-2xl text-light-yellow tracking-wide">Student Registration System</span>
      <div className="flex gap-4">
        {/* Home Page */}
        {pathname === '/' && (
          <>
            {!isAuthenticated && (
              <>
                <Link href="/login" className="flex items-center gap-1 text-light-yellow hover:text-indigo-800">
                  <FaSignInAlt /> Login
                </Link>
                <Link href="/register" className="flex items-center gap-1 text-light-yellow hover:text-indigo-800">
                  <FaUserPlus /> Register
                </Link>
              </>
            )}
          </>
        )}

        {/* Admin Dashboard */}
        {pathname === '/admin/dashboard' && isAdmin && (
          <>
            <Link href="/profile" className="flex items-center gap-1 text-light-yellow hover:text-indigo-800">
              <FaUserCircle /> Profile
            </Link>
            <button onClick={logout} className="flex items-center gap-1 text-light-yellow hover:text-red-800">
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}

        {/* Admin Profile */}
        {pathname === '/profile' && isAdmin && (
          <>
            <Link href="/admin/dashboard" className="flex items-center gap-1 text-light-yellow hover:text-indigo-800">
              <FaTachometerAlt /> Admin Dashboard
            </Link>
            <button onClick={logout} className="flex items-center gap-1 text-light-yellow hover:text-red-800">
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}

        {/* Student Profile */}
        {pathname === '/profile' && !isAdmin && isAuthenticated && (
          <button onClick={logout} className="flex items-center gap-1 text-light-yellow hover:text-red-800">
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
    </nav>
  );
}
