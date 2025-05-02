import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import * as AuthContext from '../context/AuthContext';
import * as NotificationContext from '../context/NotificationContext';
import LoginPage from '../login/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the entire AuthContext module
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn()
  }))
}));

// Mock the entire NotificationContext module
jest.mock('../context/NotificationContext', () => ({
  useNotification: jest.fn()
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockNotify = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }));

    // Update the useAuth mock implementation
    (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      user: null
    }));

    // Update the useNotification mock implementation
    (NotificationContext.useNotification as jest.Mock).mockImplementation(() => ({
      notify: mockNotify,
      notifications: [],
      remove: jest.fn()
    }));
  });

  const renderLoginPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );
  };

  it('renders login form', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('password input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderLoginPage();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText('password input'), 'Password123!');

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles successful login for student', async () => {
    mockLogin.mockResolvedValueOnce({
      user: { role: 'student' }
    });

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'student@example.com');
    await userEvent.type(screen.getByLabelText('password input'), 'Password123!');

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('student@example.com', 'Password123!');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('handles successful login for admin', async () => {
    mockLogin.mockResolvedValueOnce({
      user: { role: 'admin' }
    });

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('password input'), 'Password123!');

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'Password123!');
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password input'), 'Password123!');

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(errorMessage, 'error');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('redirects authenticated users to home', async () => {
    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => ({
      login: mockLogin,
      isAuthenticated: true,
      loading: false,
      user: null,
      isAdmin: false,
      register: jest.fn(),
      logout: jest.fn()
    }));

    renderLoginPage();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows registration link', () => {
    renderLoginPage();
    
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('shows forgot password link', () => {
    renderLoginPage();
    
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  it('disables submit button during form submission', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('password input'), 'Password123!');

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    expect(signInButton).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText('password input');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles "keep signed in" checkbox', async () => {
    renderLoginPage();
    
    const checkbox = screen.getByRole('checkbox', { name: 'keep me signed in' });
    expect(checkbox).not.toBeChecked();
    
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('resets form after successful login', async () => {
    mockLogin.mockResolvedValueOnce({
      user: { role: 'student' }
    });

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('password input');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  it('maintains form state during failed login attempt', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('password input');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('Password123!');
    });
  });
});
