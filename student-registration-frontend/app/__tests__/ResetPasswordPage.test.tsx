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

  it('renders reset password form', () => {
    render(<ResetPasswordPage />);
    
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await userEvent.type(newPasswordInput, 'weak');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/must be at least 6 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/must contain at least one uppercase letter/i)).toBeInTheDocument();
    expect(await screen.findByText(/must contain at least one number/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await userEvent.type(newPasswordInput, 'StrongPass123');
    await userEvent.type(confirmPasswordInput, 'DifferentPass123');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
  });

  it('handles successful password reset', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Password reset successful' } });
    
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await userEvent.type(newPasswordInput, 'NewPass123');
    await userEvent.type(confirmPasswordInput, 'NewPass123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/reset-password/${mockToken}`, {
        password: 'NewPass123',
        confirmPassword: 'NewPass123'
      });
      expect(mockNotify).toHaveBeenCalledWith('Password has been reset successfully', 'success');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles password reset error', async () => {
    const errorMessage = 'Invalid or expired token';
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });
    
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await userEvent.type(newPasswordInput, 'NewPass123');
    await userEvent.type(confirmPasswordInput, 'NewPass123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(errorMessage, 'error');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('disables submit button while processing', async () => {
    (api.post as jest.Mock).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    await userEvent.type(newPasswordInput, 'NewPass123');
    await userEvent.type(confirmPasswordInput, 'NewPass123');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/resetting/i);
  });

  it('toggles password visibility', async () => {
    render(<ResetPasswordPage />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const toggleButtons = screen.getAllByRole('button', { name: /toggle password/i });

    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButtons[0]); // Toggle new password
    expect(newPasswordInput).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButtons[1]); // Toggle confirm password
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('provides back to login link', () => {
    render(<ResetPasswordPage />);
    
    const loginLink = screen.getByText(/back to login/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});