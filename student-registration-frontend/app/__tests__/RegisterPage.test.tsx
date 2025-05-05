/** @jest-environment jsdom */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import RegisterPage from '../register/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the entire modules
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../context/NotificationContext', () => ({
  useNotification: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

describe('RegisterPage', () => {
  const mockNotify = jest.fn();
  const mockRegister = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }));

    // Setup auth context mock
    const { useAuth } = jest.requireMock('../context/AuthContext');
    useAuth.mockImplementation(() => ({
      register: mockRegister,
      isAuthenticated: false,
      loading: false
    }));

    // Setup notification context mock
    const { useNotification } = jest.requireMock('../context/NotificationContext');
    useNotification.mockImplementation(() => ({
      notify: mockNotify,
      notifications: [],
      remove: jest.fn()
    }));
  });

  const renderRegisterPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    );
  };

  const findFormError = async (fieldName: string) => {
    return screen.findByTestId(`${fieldName}-error`);
  };

  const fillFormAndSubmit = async () => {
    // Fill in form fields
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);

    // Submit form
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);
  };

  const validateFieldAndGetError = async (fieldName: string) => {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
    await userEvent.click(field);
    await userEvent.tab();
    // Convert to camelCase for test ID
    const testId = fieldName
      .toLowerCase()
      .split(' ')
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + '-error';
    return screen.findByTestId(testId);
  };

  it('renders registration form', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderRegisterPage();
    
    // Accept terms and submit empty form
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);
    
    // Wait for all validation errors together with a single timeout
    await waitFor(() => {
      expect(screen.getByTestId('firstName-error')).toHaveTextContent(/first name is required/i);
      expect(screen.getByTestId('lastName-error')).toHaveTextContent(/last name is required/i);
      expect(screen.getByTestId('email-error')).toHaveTextContent(/email is required/i);
      expect(screen.getByTestId('password-error')).toHaveTextContent(/password is required/i);
      expect(screen.getByTestId('dateOfBirth-error')).toHaveTextContent(/date of birth is required/i);
    }, { timeout: 5000 });
  }, 10000);

  it('validates email format', async () => {
    renderRegisterPage();

    // Fill form with invalid email
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await userEvent.tab(); // Trigger blur validation

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);

    // Submit form
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);

    await waitFor(async () => {
      const emailError = await screen.findByTestId('email-error', {}, { timeout: 10000 });
      expect(emailError).toHaveTextContent('Invalid email format');
    }, { timeout: 15000 });
  }, 20000); // Set test timeout to 20 seconds

  it('validates password requirements', async () => {
    renderRegisterPage();
    
    // Fill form with weak password
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'weak');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'weak');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);

    // Submit form
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);

    await waitFor(async () => {
      const passwordError = await findFormError('password');
      const errorText = passwordError.textContent || '';
      
      expect(errorText).toMatch(/password must be at least 8 characters/i);
      expect(errorText).toMatch(/password must contain at least one uppercase letter/i);
      expect(errorText).toMatch(/password must contain at least one number/i);
      expect(errorText).toMatch(/password must contain at least one special character/i);
    });
  });

  it('validates password confirmation match', async () => {
    renderRegisterPage();
    
    // Fill form with mismatched passwords
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123@');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);

    // Submit form
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);

    await waitFor(async () => {
      const confirmPasswordError = await screen.findByTestId('confirmPassword-error', {}, { timeout: 10000 });
      expect(confirmPasswordError).toHaveTextContent(/passwords do not match/i);
    }, { timeout: 15000 });
  }, 20000);

  it('validates date of birth (must be in the past)', async () => {
    renderRegisterPage();
    
    // Fill form with future date
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    
    const dateInput = screen.getByLabelText(/date of birth/i);
    await userEvent.type(dateInput, '2026-01-01');
    await userEvent.tab(); // Trigger blur validation

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await userEvent.click(termsCheckbox);

    // Submit form and trigger validation
    const registerButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(registerButton);

    await waitFor(async () => {
      const dateOfBirthError = await screen.findByTestId('dateOfBirth-error', {}, { timeout: 10000 });
      expect(dateOfBirthError).toHaveTextContent('Date of birth must be in the past');
    }, { timeout: 15000 });
  }, 20000);

  it('handles successful registration', async () => {
    mockRegister.mockResolvedValueOnce({ success: true });
    renderRegisterPage();

    await fillFormAndSubmit();

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john@example.com',
        'Password123!',
        '1990-01-01'
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    mockRegister.mockRejectedValueOnce(new Error(errorMessage));
    renderRegisterPage();

    await fillFormAndSubmit();

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(errorMessage, 'error');
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects authenticated users to home', async () => {
    const { useAuth } = jest.requireMock('../context/AuthContext');
    useAuth.mockImplementation(() => ({
      register: mockRegister,
      isAuthenticated: true,
      loading: false
    }));

    renderRegisterPage();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('shows password requirements when password field is focused', async () => {
    renderRegisterPage();
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.click(passwordInput);

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();
  });
});
