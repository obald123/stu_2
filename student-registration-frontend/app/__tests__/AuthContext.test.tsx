import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn()
  }))
}));

// Mock the API calls
jest.mock('../lib/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const queryClient = new QueryClient();

// Test component to access auth context
const TestComponent = () => {
  const { user, login, register, logout, isAuthenticated, isAdmin, loading } = useAuth();
  return (
    <div>
      <div data-testid="loading-state">{loading.toString()}</div>
      <div data-testid="auth-state">{isAuthenticated.toString()}</div>
      <div data-testid="admin-state">{isAdmin.toString()}</div>
      <div data-testid="user-info">{user ? JSON.stringify(user) : 'no user'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => register('John', 'Doe', 'test@example.com', 'password', '1990-01-01')}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockPush = jest.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
      replace: jest.fn()
    }));

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    // Mock fetch globally
    global.fetch = jest.fn();
  });

  const renderWithProviders = (children: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };

  it('provides initial authentication state', () => {
    renderWithProviders(<TestComponent />);
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
    expect(screen.getByTestId('auth-state')).toHaveTextContent('false');
    expect(screen.getByTestId('admin-state')).toHaveTextContent('false');
    expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
  });

  it('handles successful login for student', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'student',
      registrationNumber: 'REG001'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token', user: mockUser })
    });

    renderWithProviders(<TestComponent />);

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('true');
      expect(screen.getByTestId('admin-state')).toHaveTextContent('false');
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      expect(screen.getByTestId('user-info')).toContain(mockUser.email);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('handles successful login for admin', async () => {
    const mockUser = {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin',
      registrationNumber: 'ADM001'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token', user: mockUser })
    });

    renderWithProviders(<TestComponent />);

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('true');
      expect(screen.getByTestId('admin-state')).toHaveTextContent('true');
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('handles login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' })
    });

    renderWithProviders(<TestComponent />);

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('false');
      expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('handles network error during login', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<TestComponent />);

    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('false');
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
    });
  });

  it('handles logout', async () => {
    // Setup initial authenticated state
    localStorage.setItem('token', 'test-token');
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'student',
      registrationNumber: 'REG001'
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token', user: mockUser })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Logged out successfully' })
      });

    renderWithProviders(<TestComponent />);

    // Login first
    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    // Then logout
    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('false');
      expect(screen.getByTestId('admin-state')).toHaveTextContent('false');
      expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).toHaveBeenLastCalledWith('/login');
    });
  });

  it('loads user from token on mount', async () => {
    localStorage.setItem('token', 'test-token');
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'student',
      registrationNumber: 'REG001'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser })
    });

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('true');
      expect(screen.getByTestId('user-info')).toContain(mockUser.email);
    });
  });

  it('handles invalid token on mount', async () => {
    localStorage.setItem('token', 'invalid-token');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid token' })
    });

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('false');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});