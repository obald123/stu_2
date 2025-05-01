'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Typography, TextField, Button, InputAdornment, Link as MuiLink, Container, Checkbox, FormControlLabel, Box } from '@mui/material';
import { FaUserPlus, FaUniversity, FaUser, FaLock, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';
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
    reset({ email: '', password: '' });
    // Remove any saved form data on mount (refresh)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('registerEmail');
      localStorage.removeItem('registerPassword');
    }
  }, [reset]);

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
        width: '100vw', 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="particles" />

      {/* Left side: Brand section */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: `url('/register.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff',
        p: 6
      }}>
        <Box className="glow" sx={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          p: 4,
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
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Join Our Community
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#fff', 
            maxWidth: 400, 
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Start your academic journey at INES-Ruhengeri today
          </Typography>
        </Box>
      </Box>

      {/* Right side: Registration form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4, md: 6 },
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        '&::before': {
          content: '"REGISTER"',
          position: 'absolute',
          right: -40,
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: '120px',
          fontWeight: 800,
          opacity: 0.03,
          color: '#000',
          zIndex: 0,
          letterSpacing: '1rem',
          userSelect: 'none'
        }
      }}>
        <Container maxWidth="sm">
          <Box className="glass-card" sx={{ 
            maxWidth: 480, 
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
                <FaUserPlus style={{ fontSize: 24, color: '#4299e1' }} />
                <Typography variant="h5" fontWeight={700} sx={{ 
                  color: '#2d3748',
                  textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  Create your account
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                mb: 2
              }}>
                {/* First Name TextField */}
                <TextField
                  label="First Name"
                  fullWidth
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
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

                {/* Last Name TextField */}
                <TextField
                  label="Last Name"
                  fullWidth
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
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
              </Box>

              {/* Email TextField */}
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
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

              {/* Password TextField */}
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
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

              {/* Date of Birth TextField */}
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                {...register('dateOfBirth')}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                InputLabelProps={{ 
                  shrink: true,
                  sx: { color: '#4a5568' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBirthdayCake style={{ color: '#4299e1' }} />
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
                    '&::-webkit-calendar-picker-indicator': {
                      filter: 'invert(0.4)'
                    },
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(66,153,225,0.1)'
                    }
                  }
                }}
              />

              {/* Terms and Conditions Checkbox */}
              <Box sx={{ mt: 2, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      sx={{ 
                        color: '#4299e1',
                        '&.Mui-checked': { color: '#4299e1' },
                        '&:hover': { background: 'rgba(66,153,225,0.1)' }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      I agree to the{' '}
                      <MuiLink 
                        component={Link} 
                        href="#"
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
                        Terms of Service
                      </MuiLink>
                      {' '}and{' '}
                      <MuiLink 
                        component={Link} 
                        href="#"
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
                        Privacy Policy
                      </MuiLink>
                    </Typography>
                  }
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting || !agree}
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
                    <span className="loading-dots">Creating account</span>
                  </Box>
                ) : (
                  'Create account'
                )}
              </Button>

              {/* Sign in Link */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Already have an account?{' '}
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
                    Sign in
                  </MuiLink>
                </Typography>
              </Box>
            </form>

            {/* Error Message */}
            {popupMsg && (
              <Box sx={{ 
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255,178,78,0.1)',
                border: '1px solid rgba(255,178,78,0.2)',
                color: '#ed8936'
              }}>
                <Typography variant="body2">
                  {popupMsg}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}