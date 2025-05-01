import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';

describe('Sidebar', () => {
  it('renders nothing for non-admin', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </ReactQueryProvider>
    );
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });
});
