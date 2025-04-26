'use client';
import { createContext, useContext, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: NotificationType) => void;
  remove: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: NotificationType = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4000);
  };

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
