import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../context/NotificationContext';

describe('NotificationContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NotificationProvider>{children}</NotificationProvider>
  );

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should provide notification context', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    expect(result.current.notifications).toEqual([]);
    expect(typeof result.current.notify).toBe('function');
    expect(typeof result.current.remove).toBe('function');
  });

  it('should add a notification when notify is called', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message', 'success');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      message: 'Test message',
      type: 'success'
    });
  });

  it('should remove a notification when remove is called', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message', 'success');
    });

    const notificationId = result.current.notifications[0].id;
    
    act(() => {
      result.current.remove(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should auto-remove notification after 4 seconds', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message', 'success');
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should use info type as default when not specified', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message');
    });

    expect(result.current.notifications[0].type).toBe('info');
  });

  it('should handle multiple notifications', () => {
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('First message', 'success');
      result.current.notify('Second message', 'error');
      result.current.notify('Third message', 'warning');
    });

    expect(result.current.notifications).toHaveLength(3);
    expect(result.current.notifications[0].message).toBe('First message');
    expect(result.current.notifications[1].message).toBe('Second message');
    expect(result.current.notifications[2].message).toBe('Third message');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useNotification());
    }).toThrow('useNotification must be used within NotificationProvider');
  });
});