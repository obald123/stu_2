import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProfilePage from '../profile/page';
import { AuthProvider } from '../context/AuthContext';
import * as AuthHook from '../context/AuthContext';
import * as NotificationContext from '../context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn()
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ProfilePage', () => {
  let originalUseAuth: any;
  let originalUseNotification: any;
  const mockNotify = jest.fn();

  const mockStudent = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    registrationNumber: 'REG001',
    role: 'student' as 'student',
    dateOfBirth: '1990-01-01',
    createdAt: '2025-01-01',
  };

  const mockAdmin = {
    id: '2',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    registrationNumber: 'ADM001',
    role: 'admin' as 'admin',
    dateOfBirth: '1985-01-01',
    createdAt: '2025-01-01',
  };

  const mockUsers = [mockStudent, mockAdmin];

  beforeAll(() => {
    originalUseAuth = AuthHook.useAuth;
    originalUseNotification = NotificationContext.useNotification;
  });

  afterAll(() => {
    Object.defineProperty(AuthHook, 'useAuth', {
      value: originalUseAuth,
      configurable: true
    });
    Object.defineProperty(NotificationContext, 'useNotification', {
      value: originalUseNotification,
      configurable: true
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();

    // Mock useAuth hook
    Object.defineProperty(AuthHook, 'useAuth', {
      value: () => ({
        isAdmin: false,
        isAuthenticated: true,
        user: mockStudent,
        loading: false
      }),
      configurable: true
    });

    // Mock useNotification hook
    Object.defineProperty(NotificationContext, 'useNotification', {
      value: () => ({
        notify: mockNotify,
        notifications: [],
        remove: jest.fn()
      }),
      configurable: true
    });

    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  const renderProfilePage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('shows loading spinner initially', async () => {
    renderProfilePage();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays student profile with QR code', async () => {
    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/REG001/)).toBeInTheDocument();
      expect(screen.getByText(/john@example\.com/)).toBeInTheDocument();
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  it('displays admin view with all users', async () => {
    // Mock admin user
    Object.defineProperty(AuthHook, 'useAuth', {
      value: () => ({
        isAdmin: true,
        isAuthenticated: true,
        user: mockAdmin,
        loading: false
      }),
      configurable: true
    });

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText(/user management/i)).toBeInTheDocument();
    });
  });

  it('handles profile fetch error for student', async () => {
    // Mock API error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch'));

    renderProfilePage();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Error loading profile', 'error');
    });
  });

  it('handles users fetch error for admin', async () => {
    // Mock admin user
    Object.defineProperty(AuthHook, 'useAuth', {
      value: () => ({
        isAdmin: true,
        isAuthenticated: true,
        user: mockAdmin,
        loading: false
      }),
      configurable: true
    });

    // Mock API error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch'));

    renderProfilePage();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Error loading users', 'error');
    });
  });

  it('handles QR code download for admin view', async () => {
    // Mock admin user
    Object.defineProperty(AuthHook, 'useAuth', {
      value: () => ({
        isAdmin: true,
        isAuthenticated: true,
        user: mockAdmin,
        loading: false
      }),
      configurable: true
    });

    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test-qr-code']))
    });

    renderProfilePage();

    const downloadButton = await screen.findByText(/download qr code/i);
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('QR Code downloaded successfully', 'success');
    });
  });

  it('adapts sidebar visibility based on screen size', async () => {
    // Mock admin user
    Object.defineProperty(AuthHook, 'useAuth', {
      value: () => ({
        isAdmin: true,
        isAuthenticated: true,
        user: mockAdmin,
        loading: false
      }),
      configurable: true
    });

    // Test desktop view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    window.dispatchEvent(new Event('resize'));

    const { rerender } = renderProfilePage();

    await waitFor(() => {
      expect(screen.getByRole('complementary')).toBeVisible();
    });

    // Test mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });
    window.dispatchEvent(new Event('resize'));

    rerender(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('complementary')).not.toBeVisible();
    });
  });
});
