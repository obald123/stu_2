import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationDisplay from '../components/NotificationDisplay';
import { NotificationProvider } from '../context/NotificationContext';

describe('NotificationDisplay', () => {
  it('renders without crashing', () => {
    render(
      <NotificationProvider>
        <NotificationDisplay />
      </NotificationProvider>
    );
  });
});
