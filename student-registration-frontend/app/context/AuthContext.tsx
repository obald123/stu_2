'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  role: 'admin' | 'student';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        let userId = null;
        if (storedUser) {
          try {
            userId = JSON.parse(storedUser)?.id;
          } catch {}
        }
        if (!userId && token) {
          // Optionally decode JWT to get userId if needed
        }
        if (token && userId) {
          const response = await api.get(`/users/${userId}`);
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => {
    try {
      const response = await api.post('/register', {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}