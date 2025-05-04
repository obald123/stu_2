'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useNotification } from '../context/NotificationContext';
import api from '../lib/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link as MuiLink,
  Container
} from '@mui/material';
import { FaEnvelope, FaUniversity } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../components/Logo';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { notify } = useNotification();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await api.post('/forgot-password', data);
      notify('Password reset instructions sent to your email', 'success');
      router.push('/login');
    } catch (error: any) {
      notify(error?.response?.data?.message || 'Error sending reset instructions', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Left side: Brand section */}
      <Box sx={{
        flex: { xs: '0 0 35%', md: '0 0 40%' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: { xs: '30vh', md: '100vh' },
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff'
      }}>
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          maxWidth: '90%',
          mx: 'auto'
        }}>
          <FaUniversity style={{ fontSize: 60, marginBottom: 16, color: '#fff' }} />
          <Typography variant="h4" fontWeight={800} mb={2} sx={{ 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
          }}>
            Reset Password
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#fff', 
            maxWidth: 320, 
            mx: 'auto',
            lineHeight: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            We'll help you get back to your account
          </Typography>
        </Box>
      </Box>

      {/* Right side: Forgot Password form */}
      <Box sx={{
        flex: { xs: '1 1 auto', md: '1 1 60%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: { xs: 2, sm: 4, md: 8, lg: 12 },
        height: { xs: '70vh', md: '100vh' },
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'auto'
      }}>
        <Container maxWidth="xs" sx={{ 
          ml: { xs: 'auto', md: 0 }, 
          mr: { xs: 'auto', md: 4 }
        }}>
          <Box sx={{ 
            width: '100%',
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(66,153,225,0.15)'
            }
          }}>
            <Box sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1.5
            }}>
              <Logo size={36} />
              <Typography variant="h6" fontWeight={700} sx={{ 
                color: '#2d3748'
              }}>
                Forgot Password
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope style={{ color: '#4299e1' }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    boxShadow: '0 2px 4px rgba(148, 163, 184, 0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(148, 163, 184, 0.2)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(66, 153, 225, 0.2)'
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
                  py: 1.25,
                  fontSize: '1rem',
                  fontWeight: 600,
                  bgcolor: '#4299e1',
                  color: 'white',
                  borderRadius: 2,
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(66, 153, 225, 0.2)',
                  '&:hover': { 
                    bgcolor: '#3182ce',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(66, 153, 225, 0.2)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 4px 8px rgba(66, 153, 225, 0.2)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </Button>

              <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Remember your password?{' '}
                  <MuiLink 
                    component={Link} 
                    href="/login"
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
                        bottom: -1,
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
                    Back to Login
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