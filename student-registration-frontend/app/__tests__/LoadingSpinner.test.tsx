import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toBeInTheDocument();
  });

  
  

  it('handles color prop correctly', () => {
    const testValue = "test-value";
    render(<LoadingSpinner color={testValue} />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toHaveAttribute('data-color', "test-value");
  });

});