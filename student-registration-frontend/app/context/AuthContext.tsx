'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'student';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  role: UserRole;
  dateOfBirth?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, keepSignedIn?: boolean) => Promise<void>;
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
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Verify token and get current user data
        const response = await api.get('/verify');
        if (response.data.valid && response.data.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        // Handle token verification errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string, keepSignedIn?: boolean) => {
    try {
      const response = await api.post('/login', { email, password, keepSignedIn });
      localStorage.setItem('token', response.data.token);
      if (keepSignedIn) {
        localStorage.setItem('keepSignedIn', 'true');
      }
      setUser(response.data.user);
      return response.data;
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
    localStorage.removeItem('keepSignedIn');
    localStorage.removeItem('user');
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