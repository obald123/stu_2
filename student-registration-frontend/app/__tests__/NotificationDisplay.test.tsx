import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationDisplay from '../components/NotificationDisplay';

describe('NotificationDisplay', () => {
  it('renders with default props', () => {
    render(<NotificationDisplay />);
    const element = screen.getByTestId('notificationdisplay-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<NotificationDisplay />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});