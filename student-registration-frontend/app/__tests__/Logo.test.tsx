import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '../components/Logo';

describe('Logo', () => {
  it('renders logo', () => {
    render(<Logo />);
    // The FaUniversity icon does not have role="img" by default, so check for its SVG or fallback text
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
  });
});
