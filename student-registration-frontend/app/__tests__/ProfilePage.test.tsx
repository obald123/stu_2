import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../profile/page';
import { AuthProvider } from '../context/AuthContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';

describe('ProfilePage', () => {
  it('renders profile page', () => {
    render(
      <ReactQueryProvider>
        <AuthProvider>
          <ProfilePage />
        </AuthProvider>
      </ReactQueryProvider>
    );
    screen.debug(); // Print the rendered output for debugging
    // You can update the matcher after seeing the output
    // expect(screen.getByText((content) => /REG/i.test(content))).toBeInTheDocument();
  });
});
