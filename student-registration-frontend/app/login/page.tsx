'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaUser, FaLock } from 'react-icons/fa';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    reset({ email: '', password: '' });
  }, [reset]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className=" bg-opacity-10 py-8 px-6 shadow-lg sm:rounded-lg sm:px-20 border border-indigo-100">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-800 flex items-center justify-center gap-2">
      <FaUser className="inline text-indigo-500" /> Sign in
      </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div className="bg-white bg-opacity-80 py-8 px-6 shadow-lg sm:rounded-lg sm:px-20 border border-indigo-100">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-200"
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
        autoComplete="current-password"
        {...register('password')}
        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
        {errors.password && (
        <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
        </div>
      </div>
      <div>
        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      </form>
      <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
        href="/register"
        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
        >
        Register here
        </Link>
        </p>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}