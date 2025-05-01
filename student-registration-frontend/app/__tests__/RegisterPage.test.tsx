/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../register/page';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';

describe('RegisterPage', () => {
  it('renders create account text', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </ReactQueryProvider>
    );
    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
  });
});
