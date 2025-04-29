'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Box, Typography, TextField, Button, InputAdornment, Link as MuiLink, Container, Checkbox, FormControlLabel } from '@mui/material';
import { FaUserPlus, FaUser, FaLock, FaBirthdayCake } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

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
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box mt={{ xs: 4, sm: 8 }} sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: 'grey.900', boxShadow: 2, border: '1px solid #e0e7ef', minWidth: 0 }}>
        <Typography variant="h4" textAlign="center">
          Create an account
        </Typography>
        <Typography variant="body1" textAlign="center" mb={4}>
          Create your account now and get started
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <TextField
              label="Firstname"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={{ borderRadius: 8, background: '#f7f8fa' }}
              InputProps={{ sx: { borderRadius: 8, background: '#f7f8fa' } }}
            />
            <TextField
              label="Lastname"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={{ borderRadius: 8, background: '#f7f8fa' }}
              InputProps={{ sx: { borderRadius: 8, background: '#f7f8fa' } }}
            />
          </Box>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ borderRadius: 8, background: '#f7f8fa' }}
            InputProps={{ sx: { borderRadius: 8, background: '#f7f8fa' } }}
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
          <TextField
            label="Date of Birth"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('dateOfBirth')}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth?.message}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: 8, background: '#f7f8fa' }}
            InputProps={{ sx: { borderRadius: 8, background: '#f7f8fa' } }}
          />
          <FormControlLabel
            control={<Checkbox checked={agree} onChange={e => setAgree(e.target.checked)} />}
            label="I agree to the terms and conditions"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting || !agree}
            sx={{ mt: 2, mb: 1, fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: '1.1rem' }}
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" mt={2}>
          Already have an account?{' '}
          <MuiLink component={Link} href="/login" sx={{ color: '#111', fontWeight: 600 }} underline="hover">
            Login
          </MuiLink>
        </Typography>
        {popupMsg && (
          <Box sx={{ mt: 2, bgcolor: 'warning.light', color: 'warning.dark', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2">{popupMsg}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}