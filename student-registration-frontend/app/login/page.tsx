"use client";
import React, { useEffect, useState } from 'react';
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
import { FaUser, FaLock, FaUniversity, FaSignInAlt } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { notify } = useNotification();
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
      const response = await login(data.email, data.password);
      notify('Login successful', 'success');
      interface LoginResponse {
        user: {
          role: string;
        };
      }
      reset();
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

  useEffect(() => {
    const createParticle = () => {
      const particles = document.querySelector('.particles');
      if (!particles) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = Math.random() * 15 + 10 + 's';
      particles.appendChild(particle);

      setTimeout(() => particle.remove(), 25000);
    };

    const interval = setInterval(createParticle, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Box 
      className="moisture-bg"
      sx={{ 
        minHeight: '100vh', 
        width: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="particles" />

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
        <Box className="glow" sx={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          transition: 'transform 0.3s ease',
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
            Welcome Back
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#fff', 
            maxWidth: 400, 
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}>
            Access your student portal and manage your academic journey with ease
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
        minHeight: { xs: '70vh', md: '100vh' }
      }}>
        <Container maxWidth="sm">
          <Box className="glass-card" sx={{ 
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
              <Box className="glow" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2
              }}>
                <FaSignInAlt style={{ fontSize: 24, color: '#4299e1' }} />
                <Typography variant="h5" fontWeight={700} sx={{ 
                  color: '#2d3748',
                  textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  Sign in to your account
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                      },
                      color: '#2d3748',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(66,153,225,0.1)'
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#4a5568' }
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  inputProps={{
                    'aria-label': 'password input'
                  }}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
                          aria-label="toggle password visibility"
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
                      },
                      color: '#2d3748',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(66,153,225,0.1)'
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#4a5568' }
                  }}
                />
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mt: 2, 
                mb: 3
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      inputProps={{
                        'aria-label': 'keep me signed in'
                      }}
                      sx={{ 
                        color: '#4299e1',
                        '&.Mui-checked': { color: '#4299e1' },
                        '&:hover': { background: 'rgba(66,153,225,0.1)' }
                      }}
                    />
                  }
                  label={<Typography sx={{ color: '#4a5568' }}>Keep me signed in</Typography>}
                />
                <MuiLink 
                  component={Link} 
                  href="/forgot-password"
                  sx={{ 
                    color: '#4299e1',
                    textDecoration: 'none',
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
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                className="glow"
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  bgcolor: '#4299e1',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: '#3182ce',
                    transform: 'translateY(-2px) scale(1.01)',
                    boxShadow: '0 8px 20px rgba(66,153,225,0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 4px 12px rgba(66,153,225,0.2)'
                  },
                  '&.Mui-disabled': { 
                    bgcolor: '#e2e8f0', 
                    color: '#a0aec0' 
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(66,153,225,0.1)',
                  overflow: 'hidden'
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span className="loading-dots" data-testid="loading-spinner">Signing in</span>
                  </Box>
                ) : (
                  'Sign in'
                )}
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Don't have an account?{' '}
                  <MuiLink 
                    aria-label="register new account"
                    role="link"
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
                    Create account
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