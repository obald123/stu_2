import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserModal from '../components/UserModal';

describe('UserModal', () => {
  it('renders with default props', () => {
    render(<UserModal />);
    const element = screen.getByTestId('usermodal-container');
    expect(element).toBeInTheDocument();
  });

  

  it('has proper accessibility attributes', () => {
    render(<UserModal />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});