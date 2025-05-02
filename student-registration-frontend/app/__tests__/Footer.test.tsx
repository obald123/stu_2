import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders with default props', () => {
    render(<Footer />);
    const element = screen.getByTestId('footer-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<Footer />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});