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

const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

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
        const res = await api.get(`/admin/users?page=1&limit=100`); // get all users (or use a dedicated endpoint)
        const user = res.data.users.find((u: any) => u.id === userId);
        if (!user) {
          setError('User not found');
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: 4, borderRadius: 4 }}>
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
            <TextField
              label="First Name"
              type="text"
              fullWidth
              margin="normal"
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
              margin="normal"
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
              sx={{ mt: 2, mb: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
