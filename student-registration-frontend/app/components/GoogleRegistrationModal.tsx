import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormHelperText,
} from '@mui/material';

interface GoogleRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dateOfBirth: string) => Promise<void>;  userData: {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
    dateOfBirth?: string;
  } | null;
}

interface ValidationErrors {
  dateOfBirth?: string;
}

const GoogleRegistrationModal: React.FC<GoogleRegistrationModalProps> = ({
  open,
  onClose,
  onSubmit,
  userData
}) => {  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateDateOfBirth = (date: string): string | undefined => {
    if (!date) {
      return 'Date of birth is required';
    }

    const selectedDate = new Date(date);
    const today = new Date();
    
    if (selectedDate > today) {
      return 'Date of birth cannot be in the future';
    }

    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate());
    const adjustedAge = isBeforeBirthday ? age - 1 : age;

    if (adjustedAge < 15) {
      return 'You must be at least 15 years old to register';
    }

    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateError = validateDateOfBirth(dateOfBirth);
    if (dateError) {
      setErrors({ dateOfBirth: dateError });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(dateOfBirth);
      onClose();
    } catch (error) {
      setErrors({ dateOfBirth: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is opened
  React.useEffect(() => {
    if (open) {
      setDateOfBirth('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Your Registration</DialogTitle>      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Email"
              value={userData?.email || ''}
              fullWidth
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="First Name"
              value={userData?.firstName || ''}
              fullWidth
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Last Name"
              value={userData?.lastName || ''}
              fullWidth
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                setErrors({});
              }}
              fullWidth
              required
              error={!!errors.dateOfBirth}
              disabled={isSubmitting}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {errors.dateOfBirth && (
              <FormHelperText error>{errors.dateOfBirth}</FormHelperText>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose} 
            color="primary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Registering...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GoogleRegistrationModal;
