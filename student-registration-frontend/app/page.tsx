'use client';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';

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
    <div className="container" style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{marginTop: '3rem', marginBottom: '2rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2.5rem', fontWeight: 800, color: '#0070f3', marginBottom: '0.5rem'}}>Welcome to Student Registration System</h2>
        <p style={{fontSize: '1.2rem', color: '#444', marginBottom: '2rem'}}>Easily manage your student profile, registration, and more!</p>
        {isAuthenticated ? (
          <div style={{marginBottom: '2rem'}}>
            <span style={{fontWeight: 600, color: '#222'}}>Hello, {user?.firstName} {user?.lastName}</span>
            {isAdmin && (
              <Link href="/admin/dashboard" className="btn-secondary" style={{marginLeft: '1rem'}}>Admin Dashboard</Link>
            )}
            <Link href="/profile" className="btn-secondary" style={{marginLeft: '1rem'}}>Profile</Link>
            <button onClick={logout} className="btn-secondary" style={{marginLeft: '1rem'}}>Logout</button>
          </div>
        ) : (
          <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem'}}>
            <Link href="/login" className="btn-primary" style={{fontSize: '1.1rem', minWidth: 120}}>Login</Link>
            <Link href="/register" className="btn-secondary" style={{fontSize: '1.1rem', minWidth: 120}}>Register</Link>
          </div>
        )}
      </div>
      <div style={{marginTop: '2rem', textAlign: 'center'}}>
        
        <h3 style={{marginTop: '1rem', fontSize: '1.5rem', fontWeight: 600, color: '#0070f3'}}>INES-Ruhengeri</h3>
        <div style={{marginTop: '1.5rem', color: '#0070f3', fontWeight: 600, fontSize: '1.1rem'}}>
          Empowering students and lectures for a better campus experience in INES-Ruhengeri    </div>
      </div>
    </div>
  );
}