'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Typography, TextField, Button, InputAdornment, Link as MuiLink, Container, Checkbox, FormControlLabel, Box } from '@mui/material';
import { FaUserPlus, FaUniversity, FaUser, FaLock, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormHelperTextProps } from '@mui/material';
import { HTMLAttributes } from 'react';

// Extend FormHelperTextProps to include data-testid
interface CustomFormHelperTextProps extends FormHelperTextProps, HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      if (!date) return false;
      return new Date(date) < new Date();
    }, 'Date of birth must be in the past')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [popupMsg, setPopupMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  // Function to format error messages
  const getErrorMessage = (field: keyof RegisterFormData) => {
    // Special cases for fields that need custom formatting
    const fieldNames: Record<string, string> = {
      firstName: 'First name',
      lastName: 'Last name',
      dateOfBirth: 'Date of birth',
      confirmPassword: 'Confirm password'
    };

    // If we have a Zod error message, use it
    if (errors[field]?.message) {
      // For required field errors, format them consistently
      if (errors[field]?.type === 'too_small') {
        return `${fieldNames[field] || field} is required`;
      }
      return errors[field]?.message;
    }

    // For manual validation
    const value = watch(field);
    if (!value && touchedFields[field]) {
      return `${fieldNames[field] || field} is required`;
    }

    return ' ';
  };

  // Function to handle password validation errors
  const getPasswordErrorMessage = () => {
    if (!errors.password) return ' ';
    
    const password = watch('password');
    if (!password) return 'Password is required';

    const messages = [];
    if (password.length < 8) messages.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) messages.push('Password must contain at least one uppercase letter');
    if (!/[0-9]/.test(password)) messages.push('Password must contain at least one number');
    if (!/[^a-zA-Z0-9]/.test(password)) messages.push('Password must contain at least one special character');
    
    return messages.join('\n') || ' ';
  };

  // Function to trigger field validation
  const validateField = async (field: keyof RegisterFormData) => {
    const value = watch(field);
    if (!value) {
      setError(field, {
        type: 'required',
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      });
      return;
    }
    await trigger(field);
  };

  // Update form configuration for validation
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
    trigger,
    watch,
    reset,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
    },
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  // Function to handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    // Validate date of birth first
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dob = new Date(data.dateOfBirth);
    dob.setHours(0, 0, 0, 0);

    if (dob >= today) {
      setError('dateOfBirth', {
        type: 'manual',
        message: 'Date of birth must be in the past'
      });
      return;
    }

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.dateOfBirth
      );
      notify('Registration successful!', 'success');
      router.push('/login');
    } catch (error: any) {
      let errorMsg = 'Registration failed. Please try again.';
      if (error?.response?.data) {
        errorMsg = error.response.data.message || error.response.data.error;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      notify(errorMsg, 'error');
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
                  helperText={getErrorMessage('firstName')}
                  onBlur={() => validateField('firstName')}
                  FormHelperTextProps={{
                    'data-testid': 'firstName-error',
                    sx: { 
                      minHeight: '1.5em',
                      visibility: 'visible'
                    }
                  } as CustomFormHelperTextProps}
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
                  helperText={getErrorMessage('lastName')}
                  onBlur={() => validateField('lastName')}
                  FormHelperTextProps={{
                    'data-testid': 'lastName-error',
                    sx: { 
                      minHeight: '1.5em',
                      visibility: 'visible'
                    }
                  } as CustomFormHelperTextProps}
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
                helperText={getErrorMessage('email')}
                onBlur={() => validateField('email')}
                FormHelperTextProps={{
                  'data-testid': 'email-error',
                  sx: { 
                    minHeight: '1.5em',
                    visibility: 'visible'
                  }
                } as CustomFormHelperTextProps}
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
                helperText={getPasswordErrorMessage()}
                onFocus={() => setShowPasswordReqs(true)}
                {...{
                  onBlur: () => {
                    validateField('password');
                    setShowPasswordReqs(false);
                  }
                }}
                FormHelperTextProps={{
                  'data-testid': 'password-error',
                  sx: { 
                    minHeight: '1.5em',
                    whiteSpace: 'pre-line',
                    visibility: 'visible'
                  }
                } as CustomFormHelperTextProps}
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
                    • At least 8 characters
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

              {/* Confirm Password TextField */}
              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={getErrorMessage('confirmPassword')}
                onBlur={() => validateField('confirmPassword')}
                FormHelperTextProps={{
                  'data-testid': 'confirmPassword-error',
                  sx: { 
                    minHeight: '1.5em',
                    visibility: 'visible'
                  }
                } as CustomFormHelperTextProps}
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
                helperText={getErrorMessage('dateOfBirth')}
                onBlur={() => validateField('dateOfBirth')}
                FormHelperTextProps={{
                  'data-testid': 'dateOfBirth-error',
                  sx: { 
                    minHeight: '1.5em',
                    visibility: 'visible'
                  }
                } as CustomFormHelperTextProps}
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
                    color: '#a0aec0',
                    pointerEvents: 'auto', // Allow pointer events even when disabled
                    cursor: 'not-allowed'
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