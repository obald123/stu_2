'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FaUserEdit, FaUser, FaEnvelope, FaBirthdayCake, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';

const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params?.userId) ? params.userId[0] : params?.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<EditUserFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await api.get(`/admin/users?page=1&limit=100`); // get all users (or use a dedicated endpoint)
        const user = res.data.users.find((u: any) => u.id === userId);
        if (!user) {
          setError('User not found');
        } else {
          setInitialData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth.split('T')[0],
          });
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth.split('T')[0],
          });
        }
      } catch (e) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, [userId, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    setSubmitError(null);
    try {
      await api.put(`/admin/users/${userId}`, data);
      router.push('/admin/dashboard');
    } catch (e: any) {
      setSubmitError('Failed to update user');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size={56} /></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-semibold"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2 mb-6"><FaUserEdit /> Edit User</h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-400"><FaUser /></span>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
                />
                {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-400"><FaUser /></span>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
                />
                {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-400"><FaEnvelope /></span>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-400"><FaBirthdayCake /></span>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
                />
                {errors.dateOfBirth && <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>}
              </div>
            </div>
            {submitError && <div className="text-red-600 text-center">{submitError}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
