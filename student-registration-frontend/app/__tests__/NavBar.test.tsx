import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../components/NavBar';

describe('NavBar', () => {
  it('renders with default props', () => {
    render(<NavBar />);
    const element = screen.getByTestId('navbar-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<NavBar />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});