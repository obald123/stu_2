import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '../components/Logo';

describe('Logo', () => {
  it('renders with default props', () => {
    render(<Logo />);
    const element = screen.getByTestId('logo-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<Logo />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});