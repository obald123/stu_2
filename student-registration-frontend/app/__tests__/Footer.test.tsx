import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders the copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
  });
});
