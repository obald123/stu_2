import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../login/page';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';

describe('LoginPage', () => {
  it('renders sign in text', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </ReactQueryProvider>
    );
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });
});
