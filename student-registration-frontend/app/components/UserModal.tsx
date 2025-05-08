'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, InputAdornment, Box } from '@mui/material';

const updateUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  } | null;
  onSuccess: () => void;
};

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth.split('T')[0] || '',
    },
  });

  // Reset form values when user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth.split('T')[0] || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await api.put(`/api/admin/users/${user?.id}`, data);
      toast.success('User updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#fff', color: '#111', borderRadius: 4, boxShadow: 2, border: '1px solid #e0e7ef' } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#111', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Edit User</DialogTitle>
      <DialogContent>
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
                    {/* icon if needed */}
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
                    {/* icon if needed */}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* icon if needed */}
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
                  {/* icon if needed */}
                </InputAdornment>
              ),
            }}
          />
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} color="secondary" sx={{ fontWeight: 600 }}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ fontWeight: 600 }}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}