"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  // Home page: logo left, title center, no links
  if (pathname === '/' || pathname === '') {
    return (
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
        <Logo size={36} />
        <span className="font-extrabold text-2xl text-indigo-800 tracking-wide">Student Registration System</span>
        <div className="flex gap-4">
          <Link href="/login" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"><FaSignInAlt />Login</Link>
          <Link href="/register" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"><FaUserPlus />Register</Link>
        </div>
      </nav>
    );
  }

  // Other pages: logo left, links right
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      <Logo size={32} />
      <div className="flex gap-4 items-center">
        <Link href="/profile" className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold transition-colors"><FaUserCircle />Profile</Link>
        {isAdmin && <Link href="/admin/dashboard" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-semibold transition-colors"><FaTachometerAlt />Admin</Link>}
        {!isAuthenticated && <Link href="/login" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold transition-colors"><FaSignInAlt />Login</Link>}
        {!isAuthenticated && <Link href="/register" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold transition-colors"><FaUserPlus />Register</Link>}
        {isAuthenticated && <button onClick={logout} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold transition-colors"><FaSignOutAlt />Logout</button>}
      </div>
    </nav>
  );
}
