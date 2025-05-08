'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import { GoogleUserData, GoogleAuthResponse } from '../types/google';
import { GoogleRegistrationData } from '../lib/googleAuth';

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
  login: (email: string, password: string, keepSignedIn?: boolean) => Promise<any>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => Promise<any>;
  handleGoogleAuth: (token: string, userData: GoogleUserData) => Promise<GoogleAuthResponse>;
  registerWithGoogle: (registrationData: GoogleRegistrationData) => Promise<{ token: string; user: User; message: string }>;
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
        const response = await api.get('/api/verify');
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
      const response = await api.post('/api/login', { email, password, keepSignedIn });
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
      const response = await api.post('/api/register', {
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
  };  const handleGoogleAuth = async (token: string, userData: GoogleUserData): Promise<GoogleAuthResponse> => {
    try {
      // We don't need to verify the token on the frontend anymore as we're using the OAuth flow
      return {
        exists: false,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name
      };
    } catch (error) {
      throw error;
    }
  };  const registerWithGoogle = async (registrationData: GoogleRegistrationData): Promise<{ token: string; user: User; message: string }> => {
    try {
      const response = await api.post<{ token: string; user: User; message: string }>('/api/auth/google/register', registrationData);
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return {
        token: response.data.token,
        user: response.data.user,
        message: response.data.message || 'Registration successful',
      };
    } catch (error) {
      console.error('Google registration error:', error);
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
    handleGoogleAuth,
    registerWithGoogle,
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