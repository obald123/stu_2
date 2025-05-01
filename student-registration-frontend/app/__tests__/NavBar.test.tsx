import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../components/NavBar';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';

describe('NavBar', () => {
  it('renders navigation bar', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <NavBar />
        </AuthProvider>
      </ReactQueryProvider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
