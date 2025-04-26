'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaUserPlus, FaUser, FaLock, FaBirthdayCake } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [popupMsg, setPopupMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dateOfBirth: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.dateOfBirth
      );
      toast.success('Registration successful');
      router.push('/');
    } catch (error: any) {
      let errorMsg = 'Registration failed. Please try again.';
      if (error?.response?.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error instanceof Error && error.message) {
        errorMsg = error.message;
      }
      setPopupMsg(errorMsg);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    reset({ firstName: '', lastName: '', email: '', password: '', dateOfBirth: '' });
  }, [reset]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-3xl font-extrabold text-indigo-800 text-center flex items-center justify-center gap-2 mb-8">
          <FaUserPlus className="inline text-indigo-500" /> Create a new account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-2.5 text-gray-400"><FaUser /></span>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-2.5 text-gray-400"><FaUser /></span>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-2.5 text-gray-400"><FaUser /></span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-2.5 text-gray-400"><FaLock /></span>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-2.5 text-gray-400"><FaBirthdayCake /></span>
              <input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-base transition-all duration-200"
              />
              {errors.dateOfBirth && (
                <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        {popupMsg && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-lg max-w-sm w-full relative animate-fade-in">
      <strong className="block text-lg mb-2">Warning</strong>
      <span>{popupMsg}</span>
      <button
        className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900 text-xl font-bold"
        onClick={() => setPopupMsg(null)}
        aria-label="Close warning"
      >
        &times;
      </button>
    </div>
  </div>
)}
        <div className="mt-8 text-center">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}