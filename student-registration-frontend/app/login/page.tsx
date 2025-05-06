'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  Container
} from '@mui/material';
import { FaUser, FaLock, FaUniversity } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from '../components/Logo';
import GoogleIcon from '@mui/icons-material/Google';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      notify('Authentication failed. Please try again.', 'error');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/'; // Full page refresh to update auth state
      } catch (error) {
        notify('Failed to process authentication. Please try again.', 'error');
      }
    }
  }, [notify]);

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
      await login(data.email, data.password, keepSignedIn);
      notify('Login successful', 'success');
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      notify(errorMessage, 'error');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Left side: Brand section */}
      <Box sx={{
        flex: { xs: '0 0 auto', md: '1 0 50%' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '30vh', md: '100vh' },
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff',
        p: { xs: 3, sm: 4, md: 6 }
      }}>
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'translateY(-5px)'
          }
        }}>
          <FaUniversity style={{ fontSize: 80, marginBottom: 24, color: '#fff' }} />
          <Typography variant="h3" fontWeight={800} mb={3} sx={{ 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#fff', 
            maxWidth: 400, 
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}>
            Sign in to continue your journey with INES-Ruhengeri
          </Typography>
        </Box>
      </Box>

      {/* Right side: Login form */}
      <Box sx={{
        flex: { xs: '1 1 auto', md: '1 0 50%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4, md: 6 },
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        minHeight: { xs: '70vh', md: '100vh' },
        overflowY: 'auto'
      }}>
        <Container maxWidth="sm">
          <Box sx={{ 
            maxWidth: { xs: '100%', sm: 480 }, 
            mx: 'auto',
            textAlign: 'center',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            position: 'relative',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            transform: 'translateZ(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            my: { xs: 4, md: 0 },
            '&:hover': {
              transform: 'translateZ(0) translateY(-8px)',
              boxShadow: '0 20px 40px rgba(66,153,225,0.15)'
            }
          }}>
            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 2,
              position: 'relative'
            }}>
              <Logo size={48} />
              <Typography variant="h5" fontWeight={700} sx={{ 
                color: '#2d3748',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                Sign in to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ color: '#4299e1' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4299e1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3182ce'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#4299e1' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ 
                          minWidth: 'auto',
                          color: '#4299e1',
                          '&:hover': {
                            background: 'rgba(66,153,225,0.1)'
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4299e1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3182ce'
                    }
                  }
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      sx={{ 
                        color: '#4299e1',
                        '&.Mui-checked': {
                          color: '#4299e1'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      Keep me signed in
                    </Typography>
                  }
                />
                <MuiLink
                  component={Link}
                  href="/forgot-password"
                  sx={{
                    color: '#4299e1',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: '#3182ce',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  bgcolor: '#4299e1',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: '#3182ce',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(66,153,225,0.2)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
                sx={{ mb: 2 }}
              >
                Sign in with Google
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Don't have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    href="/register"
                    sx={{ 
                      color: '#4299e1',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      position: 'relative',
                      '&:hover': { 
                        color: '#3182ce'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: '100%',
                        height: 1,
                        background: '#3182ce',
                        transform: 'scaleX(0)',
                        transition: 'transform 0.2s ease',
                        transformOrigin: 'right'
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                        transformOrigin: 'left'
                      }
                    }}
                  >
                    Register here
                  </MuiLink>
                </Typography>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}