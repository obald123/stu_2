'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Box, Typography, TextField, Button, InputAdornment, Link as MuiLink } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fb', py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: { xs: 340, sm: 420 }, mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: 'grey.900', boxShadow: 2, border: '1px solid #e0e7ef' }}>
        <Typography variant="h4" fontWeight={800} color="primary" align="center" gutterBottom sx={{ letterSpacing: 1, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          <FaUserPlus style={{ verticalAlign: 'middle', color: '#6366f1', marginRight: 8 }} /> Create a new account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="First Name"
              type="text"
              fullWidth
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser style={{ color: '#bbb' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Last Name"
              type="text"
              fullWidth
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser style={{ color: '#bbb' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TextField
            label="Email address"
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
                  <FaBirthdayCake style={{ color: '#bbb' }} />
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
        {popupMsg && (
          <Box sx={{ mt: 2, bgcolor: 'warning.light', color: 'warning.dark', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2">{popupMsg}</Typography>
          </Box>
        )}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} href="/login" sx={{ color: '#111', fontWeight: 600 }} underline="hover">
              Sign in here
            </MuiLink>
          </Typography>
        </Box>
        <Box mt={2} textAlign="center">
          <MuiLink href="#" sx={{ color: '#111', fontWeight: 600, fontSize: 13 }} underline="hover">
            Terms & Privacy
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
}