'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Box, Paper, Typography, TextField, Button, InputAdornment, Link as MuiLink } from '@mui/material';
import { FaUserPlus, FaUser, FaLock, FaBirthdayCake } from 'react-icons/fa';
import Link from 'next/link';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', py: 6 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary" align="center" gutterBottom>
          <FaUserPlus style={{ verticalAlign: 'middle', color: '#6366f1', marginRight: 8 }} /> Create a new account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="First Name"
            type="text"
            fullWidth
            margin="normal"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser style={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Last Name"
            type="text"
            fullWidth
            margin="normal"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUser style={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
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
                  <FaUser style={{ color: '#888' }} />
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
                  <FaLock style={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            {...register('dateOfBirth')}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaBirthdayCake style={{ color: '#888' }} />
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
            sx={{ mt: 2, mb: 1 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
        {popupMsg && (
          <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}>
            <Paper sx={{ bgcolor: 'warning.light', borderLeft: 4, borderColor: 'warning.main', color: 'warning.dark', p: 3, borderRadius: 2, maxWidth: 360, width: '100%', position: 'relative' }}>
              <Typography variant="h6" fontWeight={700} mb={1}>Warning</Typography>
              <Typography variant="body2">{popupMsg}</Typography>
              <Button
                onClick={() => setPopupMsg(null)}
                sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, p: 0, color: 'warning.dark' }}
                aria-label="Close warning"
              >
                &times;
              </Button>
            </Paper>
          </Box>
        )}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} href="/login" color="primary" underline="hover">
              Sign in here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}