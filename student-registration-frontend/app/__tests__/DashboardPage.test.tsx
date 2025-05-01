import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../admin/dashboard/page';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { NotificationProvider } from '../context/NotificationContext';

describe('DashboardPage', () => {
  it('renders dashboard', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <DashboardPage />
          </NotificationProvider>
        </AuthProvider>
      </ReactQueryProvider>
    );
    screen.debug(); // Print the rendered output for debugging
    // You can update the matcher after seeing the output
    // expect(screen.getByText((content) => /user/i.test(content))).toBeInTheDocument();
  });
});
