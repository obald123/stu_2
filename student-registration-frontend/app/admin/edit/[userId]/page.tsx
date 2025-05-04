'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Box, Paper, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { FaUserEdit, FaUser, FaEnvelope, FaBirthdayCake, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

type EditUserFormData = z.infer<typeof editUserSchema>;


interface UserApiResponse {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params?.userId) ? params.userId[0] : params?.userId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<EditUserFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fullUser, setFullUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await api.get(`/users/${userId}`);
        const user = res.data;
        setFullUser(user); // Save the full user object
        if (!user || !user.dateOfBirth) {
          setError('User not found or missing date of birth');
        } else {
          setInitialData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth.split('T')[0],
          });
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth.split('T')[0],
          });
        }
      } catch (e) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    
  }, [userId, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    setSubmitError(null);
    try {
      if (!fullUser) throw new Error('User data not loaded');
      
      const allowedFields = [
        'firstName',
        'lastName',
        'email',
        'dateOfBirth',
        'registrationNumber',
        'role',
      ];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (data[field as keyof EditUserFormData] !== undefined) updateData[field] = data[field as keyof EditUserFormData];
        if ((field === 'registrationNumber' || field === 'role') && fullUser[field] !== undefined) {
          updateData[field] = fullUser[field];
        }
      }
      
      if (updateData.dateOfBirth instanceof Date) {
        updateData.dateOfBirth = updateData.dateOfBirth.toISOString().slice(0, 10);
      }
      await api.put(`/admin/users/${userId}`, updateData);
      router.push('/admin/dashboard');
    } catch (e: any) {
      setSubmitError('Failed to update user');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'error.main' }}>{error}</Box>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          pt: { xs: '64px', sm: '72px', md: '80px' },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4
        }}
      >
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1400, 
          mx: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          gap: 4 
        }}>
          <Button
            onClick={() => router.back()}
            startIcon={<FaArrowLeft />}
            sx={{ 
              alignSelf: 'flex-start',
              mb: 2,
              color: '#64748b',
              '&:hover': {
                bgcolor: 'rgba(100, 116, 139, 0.08)'
              }
            }}
          >
            Back
          </Button>
          
          <Box sx={{ 
            bgcolor: '#fff', 
            borderRadius: 3,
            p: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid rgba(231, 235, 240, 0.8)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <FaUserEdit style={{ color: '#6366f1', fontSize: 24 }} />
              <Typography variant="h5" fontWeight={700}>Edit User</Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
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
                        <FaUser style={{ color: '#94a3b8' }} />
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
                        <FaUser style={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <TextField
                label="Email address"
                type="email"
                fullWidth
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
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
                      <FaBirthdayCake style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {submitError && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {submitError}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => router.back()}
                  variant="outlined"
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4,
                    bgcolor: '#6366f1',
                    '&:hover': {
                      bgcolor: '#4f46e5'
                    }
                  }}
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
