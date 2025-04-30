'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Typography, TextField, Button, InputAdornment, Link as MuiLink, Container, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { FaUserPlus, FaUniversity, FaUser, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box } from '@mui/material';

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
    reset({ email: '', password: '' });
    // Remove any saved form data on mount (refresh)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('registerEmail');
      localStorage.removeItem('registerPassword');
    }
  }, [reset]);

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
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url(/bgpic.png) center center no-repeat',
          backgroundSize: '60vw auto',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        },
        zIndex: 1,
      }}>
        <Box sx={{ textAlign: 'center', px: 6, position: 'relative', zIndex: 2 }}>
          <FaUniversity style={{ fontSize: 120, color: '#6366f1', marginBottom: 24 }} />
          <Typography variant="h4" fontWeight={800} color="primary" mb={2}>
            Welcome to Campus Registration
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Join our vibrant academic community and manage your student journey with ease.
          </Typography>
        </Box>
      </Box>
      {/* Right side: Registration form */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <FaUserPlus style={{ fontSize: 28, color: '#6366f1', marginRight: 8 }} />
              <Typography variant="h5" textAlign="center" fontWeight={700}>
              Create Your Account
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
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
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 1, mb: 1 }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="I agree to the terms and conditions"
                  sx={{ m: 0 }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2, mb: 1, fontWeight: 700, borderRadius: 4, py: 1.5, fontSize: '1.1rem', bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: 'blue' } }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              Already have an account?{' '}
              <MuiLink component={Link} href="/login" sx={{ color: '#0056B3', fontWeight: 600 }} underline="hover">
                Sign in
              </MuiLink>
            </Typography>
            {popupMsg && (
              <Box sx={{ mt: 2, bgcolor: 'warning.light', color: 'warning.dark', p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2">{popupMsg}</Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}