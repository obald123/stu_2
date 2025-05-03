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
            We'll help you get back to your account
          </Typography>
        </Box>
      </Box>

      {/* Right side: Forgot Password form */}
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
                Forgot Password
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>

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
                      <FaEnvelope style={{ color: '#4299e1' }} />
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
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
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