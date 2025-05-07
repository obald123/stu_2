import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ResetPasswordPage from '../reset-password/[token]/page';
import { useNotification } from '../context/NotificationContext';
import { useParams, useRouter } from 'next/navigation';
import api from '../lib/api';

// Mock the modules
jest.mock('../context/NotificationContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}));
jest.mock('../lib/api');

describe('ResetPasswordPage', () => {
  const mockNotify = jest.fn();
  const mockPush = jest.fn();
  const mockToken = 'test-reset-token';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useNotification
    (useNotification as jest.Mock).mockReturnValue({
      notify: mockNotify
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });

    // Mock useParams
    (useParams as jest.Mock).mockReturnValue({
      token: mockToken
    });

    // Mock api.post
    (api.post as jest.Mock) = jest.fn();
  });


  it('provides back to login link', () => {
    render(<ResetPasswordPage />);
    
    const loginLink = screen.getByText(/back to login/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});