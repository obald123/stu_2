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

  
  it('handles size prop correctly', () => {
    const testValue = 42;
    render(<LoadingSpinner size={testValue} />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toHaveAttribute('data-size', 42);
  });

  it('handles color prop correctly', () => {
    const testValue = "test-value";
    render(<LoadingSpinner color={testValue} />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toHaveAttribute('data-color', "test-value");
  });

  it('handles center prop correctly', () => {
    const testValue = true;
    render(<LoadingSpinner center={testValue} />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toHaveAttribute('data-center', true);
  });

  it('handles fullHeight prop correctly', () => {
    const testValue = true;
    render(<LoadingSpinner fullHeight={testValue} />);
    const element = screen.getByTestId('loadingspinner-container');
    expect(element).toHaveAttribute('data-fullHeight', true);
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});