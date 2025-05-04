'use client';
import { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  createdAt: number;
};

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: NotificationType) => void;
  remove: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    // Generate a unique ID using timestamp and random number
    const id = Date.now() + Math.random();
    const createdAt = Date.now();

    setNotifications(prev => {
      // Remove duplicate messages that are still showing
      const filtered = prev.filter(n => n.message !== message);
      
      // Add new notification, keeping only the most recent 3
      const updated = [...filtered, { id, message, type, createdAt }];
      if (updated.length > 3) {
        // Remove the oldest notification(s)
        return updated.slice(-3);
      }
      return updated;
    });

    // Auto-remove after 4 seconds
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  return (
    <NotificationContext.Provider value={{ notifications, notify, remove }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
