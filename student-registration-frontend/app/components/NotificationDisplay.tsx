'use client';

import { useNotification } from '../context/NotificationContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const ICONS = {
  success: <FaCheckCircle className="text-green-500" />,
  error: <FaExclamationCircle className="text-red-500" />,
  info: <FaInfoCircle className="text-blue-500" />,
  warning: <FaExclamationTriangle className="text-yellow-500" />,
};

export default function NotificationDisplay() {
  const { notifications, remove } = useNotification();
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center gap-3 px-4 py-3 rounded shadow-lg bg-white dark:bg-gray-900 border-l-4 transition-all animate-fade-in border-${n.type === 'success' ? 'green' : n.type === 'error' ? 'red' : n.type === 'warning' ? 'yellow' : 'blue'}-500`}
        >
          {ICONS[n.type]}
          <span className="font-medium text-gray-800 dark:text-gray-100">{n.message}</span>
          <button onClick={() => remove(n.id)} className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
      ))}
    </div>
  );
}
