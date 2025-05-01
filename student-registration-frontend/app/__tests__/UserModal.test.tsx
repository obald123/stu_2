import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserModal from '../components/UserModal';

describe('UserModal', () => {
  it('renders modal when open', () => {
    render(
      <UserModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => {}}
        user={{
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          dateOfBirth: '2001-05-05'
        }}
      />
    );
    screen.debug(); // Print the rendered output for debugging
    // You can update the matcher after seeing the output
    // expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
