'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNotification } from '../../context/NotificationContext';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
  Link as MuiLink,
} from '@mui/material';
import { FaLock, FaUniversity } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from '../../components/Logo';
import api from '../../lib/api';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { notify } = useNotification();
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  
  if (!token) {
    router.push('/login');
    return null;
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await api.post(`/reset-password/${token}`, {
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      notify('Password has been reset successfully', 'success');
      router.push('/login');
    } catch (error: any) {
      let errorMsg = 'Failed to reset password. Please try again.';
      if (error?.response?.data) {
        errorMsg = error.response.data.message || error.response.data.error;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      notify(errorMsg, 'error');
    }
  };

  // Function to handle password validation errors
  const getPasswordErrorMessage = (field: 'password' | 'confirmPassword') => {
    if (!errors[field]) return ' ';
    
    const password = watch(field);
    if (!password) return `${field === 'password' ? 'Password' : 'Confirm password'} is required`;

    if (field === 'password') {
      const messages = [];
      if (password.length < 6) messages.push('Password must be at least 6 characters');
      if (!/[A-Z]/.test(password)) messages.push('Password must contain at least one uppercase letter');
      if (!/[0-9]/.test(password)) messages.push('Password must contain at least one number');
      if (!/[^a-zA-Z0-9]/.test(password)) messages.push('Password must contain at least one special character');
      return messages.join('\n') || ' ';
    }

    return errors[field]?.message || ' ';
  };

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
            Reset Password
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#fff', 
            maxWidth: 400, 
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}>
            Enter your new password below
          </Typography>
        </Box>
      </Box>

      {/* Right side: Reset password form */}
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
                Choose a new password
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                {...register('password')}
                error={!!errors.password}
                helperText={getPasswordErrorMessage('password')}
                onFocus={() => setShowPasswordReqs(true)}
                onBlur={() => setShowPasswordReqs(false)}
                sx={{ mb: 3 }}
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

              {showPasswordReqs && (
                <Box sx={{ 
                  mt: 1, 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(66,153,225,0.1)',
                  border: '1px solid rgba(66,153,225,0.2)'
                }}>
                  <Typography variant="caption" component="div" color="text.secondary">
                    Password must contain:
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    • At least 6 characters
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    • One uppercase letter
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    • One number
                  </Typography>
                  <Typography variant="caption" component="div" color="text.secondary">
                    • One special character
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Confirm New Password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={getPasswordErrorMessage('confirmPassword')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#4299e1' }} />
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
                    <span>Resetting password...</span>
                  </Box>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <Box sx={{ mt: 3 }}>
                <MuiLink
                  component={Link}
                  href="/login"
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
                  Back to login
                </MuiLink>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}