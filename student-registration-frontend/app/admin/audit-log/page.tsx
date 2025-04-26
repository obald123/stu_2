'use client';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { useQuery } from '@tanstack/react-query';
import { FaClipboardList } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AuditLogPage() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audit-log'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-log');
      return res.data.log;
    },
    staleTime: 10000,
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      window.location.href = '/';
    }
  }, [loading, isAuthenticated, isAdmin]);

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <FaClipboardList className="text-indigo-500 text-2xl" />
          <h2 className="text-2xl font-bold">Audit Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.length > 0 ? data.map((log: any) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{log.userId || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{log.performedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 max-w-xs truncate">{log.details ? JSON.stringify(log.details) : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-400">No audit log entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
