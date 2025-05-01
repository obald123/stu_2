import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientLayout from '../components/ClientLayout';

describe('ClientLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ClientLayout isAdminRoute={false}>
        <div>Test Child</div>
      </ClientLayout>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
