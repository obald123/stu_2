'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers, FaTachometerAlt, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on the body
  const handleDarkMode = () => {
    setDarkMode((d) => {
      if (!d) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return !d;
    });
  };

  if (!isAdmin) return null;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
        <FaTachometerAlt className="text-indigo-500 text-2xl" />
        <span className="font-bold text-xl">Admin Panel</span>
      </div>
      <nav className="flex-1 px-6 py-4 flex flex-col gap-2">
        <Link href="/admin/dashboard" className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-50 transition ${pathname === '/admin/dashboard' ? 'bg-indigo-100 font-bold' : ''}`}> <FaUsers /> Dashboard </Link>
        <Link href="/admin/audit-log" className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-indigo-50 transition ${pathname === '/admin/audit-log' ? 'bg-indigo-100 font-bold' : ''}`}> <FaClipboardList /> Audit Log </Link>
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col gap-2">
        <button onClick={logout} className="flex items-center gap-2 py-2 px-3 rounded hover:bg-red-50 text-red-600 transition w-full">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
