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

// Define a type for the user fetched from the API
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
        const user: UserApiResponse = res.data;
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
    // eslint-disable-next-line
  }, [userId, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    setSubmitError(null);
    try {
      await api.put(`/admin/users/${userId}`, data);
      router.push('/admin/dashboard');
    } catch (e: any) {
      setSubmitError('Failed to update user');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><LoadingSpinner size={56} /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'error.main' }}>{error}</Box>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fb' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', color: '#111', boxShadow: 2, border: '1px solid #e0e7ef' }}>
          <Button
            type="button"
            onClick={() => router.back()}
            startIcon={<FaArrowLeft />}
            sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight={700} color="primary" align="left" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FaUserEdit style={{ color: '#6366f1', marginRight: 8 }} /> Edit User
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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
                      <FaUser style={{ color: '#888' }} />
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
                      <FaUser style={{ color: '#888' }} />
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
                    <FaEnvelope style={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
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
                    <FaBirthdayCake style={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            />
            {submitError && <Typography color="error" align="center" sx={{ mt: 1 }}>{submitError}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, mb: 1, fontWeight: 700, borderRadius: 2, boxShadow: 2, py: 1.5, fontSize: '1.1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
