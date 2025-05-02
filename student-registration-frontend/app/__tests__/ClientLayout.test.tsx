import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientLayout from '../components/ClientLayout';

describe('ClientLayout', () => {
  it('renders with default props', () => {
    render(<ClientLayout />);
    const element = screen.getByTestId('clientlayout-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<ClientLayout />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});