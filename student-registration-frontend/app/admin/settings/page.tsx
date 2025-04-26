'use client';
import { FaCog } from 'react-icons/fa';

export default function AdminSettingsPage() {
 
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <FaCog className="text-indigo-500 text-2xl" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-8 flex flex-col gap-6">
        <div className="text-gray-500 text-center">No settings available at this time.</div>
      </div>
    </div>
  );
}
