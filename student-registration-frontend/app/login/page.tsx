"use client";
import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Link as MuiLink
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaUser, FaLock, FaUniversity } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: '' }}>
      {/* Left side: Decorative illustration (hidden on mobile) */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'indigo.50',
        position: 'relative',
      }}>
        <Box sx={{ textAlign: 'center', px: 6 }}>
          <FaUniversity style={{ fontSize: 120, color: '#6366f1', marginBottom: 24 }} />
          <Typography variant="h4" fontWeight={800} color="primary" mb={2}>
            Welcome Back to Campus
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Sign in to access your student dashboard and manage your academic journey.
          </Typography>
        </Box>
      </Box>
      {/* Right side: Login form */}
      <Box sx={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        bgcolor: { xs: 'rgba(255,255,255,0.98)', md: 'rgba(255,255,255,0.95)' },
      }}>
        <Container maxWidth="sm" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 6, boxShadow: 6, border: '1px solid #e0e7ef', bgcolor: 'transparent' }}>
          <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', textAlign: 'center' }}>
            <FaUniversity style={{ fontSize: 48, color: '#6366f1', marginBottom: 8 }} />
            <Typography variant="h5" textAlign="center" fontWeight={700} mb={2}>
              Sign in
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ borderRadius: 8, background: '#f7f8fa' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#bbb' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 8, background: '#f7f8fa' },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ borderRadius: 8, background: '#f7f8fa' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#bbb' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={() => setShowPassword((show) => !show)} tabIndex={-1} sx={{ minWidth: 0, p: 0 }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 8, background: '#f7f8fa' },
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={keepSignedIn} onChange={e => setKeepSignedIn(e.target.checked)} />}
                label="Keep me signed in"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2, mb: 1, fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem' }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <Typography variant="body2" textAlign="center" mt={2}>
              Don’t have an account?{' '}
              <MuiLink component={Link} href="/register" sx={{ color: '#0056B3', fontWeight: 600 }} underline="hover">
                Signup
              </MuiLink>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}