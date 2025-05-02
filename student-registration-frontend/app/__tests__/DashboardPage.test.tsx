import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../admin/dashboard/page';
import { AuthProvider } from '../context/AuthContext';
import * as AuthHook from '../context/AuthContext';
import * as NotificationContext from '../context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock API calls
jest.mock('../lib/api', () => ({
  get: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AdminDashboard', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockAnalytics = {
    totalUsers: 100,
    totalAdmins: 10,
    totalStudents: 90,
    recentUsers: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: '2025-01-01T00:00:00Z',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        createdAt: '2025-01-02T00:00:00Z',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('redirects non-admin users', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: false,
      isAuthenticated: true,
      loading: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderDashboard();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('redirects unauthenticated users', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: false,
      isAuthenticated: false,
      loading: false,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderDashboard();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('shows loading spinner while checking auth status', () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: true,
      isAuthenticated: true,
      loading: true,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    renderDashboard();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays dashboard data for admin users', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: true,
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        registrationNumber: 'ADM001',
      },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    (api.get as jest.Mock).mockResolvedValue({
      data: mockAnalytics,
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Admins')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });

    // Chart components should be present
    expect(screen.getByText('User Role Distribution')).toBeInTheDocument();
    expect(screen.getByText('Recent Registrations')).toBeInTheDocument();
  });

  it('shows loading state while fetching analytics', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: true,
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        registrationNumber: 'ADM001',
      },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    let resolveAnalytics: (value: any) => void;
    const analyticsPromise = new Promise((resolve) => {
      resolveAnalytics = resolve;
    });

    (api.get as jest.Mock).mockReturnValue(analyticsPromise);

    renderDashboard();

    expect(screen.getByRole('status')).toBeInTheDocument();

    resolveAnalytics!({ data: mockAnalytics });

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });
  });

  it('handles analytics fetch error', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: true,
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        registrationNumber: 'ADM001',
      },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const mockNotify = jest.fn();
    jest.spyOn(NotificationContext, 'useNotification').mockReturnValue({
      notifications: [],
      notify: mockNotify,
      remove: jest.fn(),
    });

    (api.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch analytics'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      // Should show 0 for all metrics when analytics fetch fails
      expect(screen.getAllByText('0')).toHaveLength(3);
    });
  });

  it('updates analytics data periodically', async () => {
    jest.spyOn(AuthHook, 'useAuth').mockReturnValue({
      isAdmin: true,
      isAuthenticated: true,
      loading: false,
      user: {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'admin',
        registrationNumber: 'ADM001',
      },
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    });

    const initialAnalytics = { ...mockAnalytics };
    const updatedAnalytics = {
      ...mockAnalytics,
      totalUsers: 110,
      totalStudents: 100,
    };

    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: initialAnalytics })
      .mockResolvedValueOnce({ data: updatedAnalytics });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument(); // Initial total users
    });

    // Fast-forward time to trigger refetch
    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByText('110')).toBeInTheDocument(); // Updated total users
    });
  });
});
