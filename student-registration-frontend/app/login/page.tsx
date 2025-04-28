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
import { Box, Typography, TextField, Button, InputAdornment, Link as MuiLink } from '@mui/material';

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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fb', py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: { xs: 340, sm: 400 }, mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: 'grey.900', boxShadow: 2, border: '1px solid #e0e7ef' }}>
        <Typography variant="h4" fontWeight={800} color="primary" align="center" gutterBottom sx={{ letterSpacing: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          <FaUser style={{ verticalAlign: 'middle', color: '#6366f1', marginRight: 8 }} /> Sign in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser style={{ color: '#bbb' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock style={{ color: '#bbb' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 1, fontWeight: 700, borderRadius: 2, boxShadow: 2, py: 1.5, fontSize: '1.1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink component={Link} href="/register" sx={{ color: '#111', fontWeight: 600 }} underline="hover">
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}