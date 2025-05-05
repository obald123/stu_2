import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ForgotPasswordPage from '../forgot-password/page';
import { useNotification } from '../context/NotificationContext';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

// Mock the modules
jest.mock('../context/NotificationContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));
jest.mock('../lib/api');

describe('ForgotPasswordPage', () => {
  const mockNotify = jest.fn();
  const mockPush = jest.fn();

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

    // Mock api.post
    (api.post as jest.Mock) = jest.fn();
  });

  it('renders forgot password form', () => {
    render(<ForgotPasswordPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('handles successful password reset request', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Reset instructions sent' } });
    
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Password reset instructions sent to your email', 'success');
      expect(mockPush).toHaveBeenCalledWith('/login');
    }, { timeout: 5000 });
  }, 10000);

  it('handles password reset request error', async () => {
    const errorMessage = 'Error sending reset instructions';
    (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(errorMessage, 'error');
      expect(mockPush).not.toHaveBeenCalled();
    }, { timeout: 5000 });
  }, 10000);

  it('disables submit button while processing', async () => {
    (api.post as jest.Mock).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/sending/i);
  });

  it('provides back to login link', () => {
    render(<ForgotPasswordPage />);
    
    const loginLink = screen.getByText(/back to login/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('requires email field', async () => {
    render(<ForgotPasswordPage />);
    
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('makes correct API call', async () => {
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset instructions/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    expect(api.post).toHaveBeenCalledWith('/forgot-password', {
      email: 'test@example.com'
    });
  });
});