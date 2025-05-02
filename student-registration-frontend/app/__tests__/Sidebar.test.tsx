import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';

describe('Sidebar', () => {
  it('renders with default props', () => {
    render(<Sidebar />);
    const element = screen.getByTestId('sidebar-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<Sidebar />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});