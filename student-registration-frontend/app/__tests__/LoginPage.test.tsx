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

  

  it('renders login form with keep me signed in checkbox', () => {
    renderLoginPage();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/keep me signed in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('includes forgot password link', () => {
    renderLoginPage();
    
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  it('handles keep me signed in toggle', async () => {
    renderLoginPage();
    
    const checkbox = screen.getByLabelText(/keep me signed in/i);
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('passes keepSignedIn value to login function', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const keepSignedInCheckbox = screen.getByLabelText(/keep me signed in/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(keepSignedInCheckbox);
    await userEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      true
    );
  });

  it('shows success notification on successful login', async () => {
    mockLogin.mockResolvedValueOnce({});
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Login successful', 'success');
    });
  });

  it('shows error notification on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Invalid credentials', 'error');
    });
  });

  it('redirects to home page after successful login', async () => {
    mockLogin.mockResolvedValueOnce({});
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to home if already authenticated', () => {
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
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('validates email format', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });



  it('disables submit button while logging in', async () => {
    // Mock login to delay resolution
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/signing in/i);
    }, { timeout: 5000 });
  }, 10000);
});
