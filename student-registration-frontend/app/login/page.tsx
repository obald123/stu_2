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
import { FaUser, FaLock } from 'react-icons/fa';
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
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h3" textAlign="center" fontWeight={900} fontFamily="'Segoe Script', cursive" color="primary.main" mb={1}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" textAlign="center" mb={4}>
          Sign in into your account and get started
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser style={{ color: '#bbb' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 4, background: '#f7f8fa' },
            }}
            sx={{ borderRadius: 4, background: '#f7f8fa', mb: 2 }}
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
              sx: { borderRadius: 4, background: '#f7f8fa' },
            }}
            sx={{ borderRadius: 4, background: '#f7f8fa', mb: 2 }}
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
            sx={{ mt: 2, mb: 1, fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          Don’t have an account?{' '}
          <MuiLink component={Link} href="/register" sx={{ color: '#111', fontWeight: 600 }} underline="hover">
            Signup
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}