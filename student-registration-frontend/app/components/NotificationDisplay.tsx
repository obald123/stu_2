import { useNotification } from '../context/NotificationContext';
import { Snackbar, Alert, Box } from '@mui/material';

export default function NotificationDisplay() {
  const { notifications, remove } = useNotification();
  return (
    <Box 
      data-testid="notification-display"
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => remove(n.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            position: 'relative',
            pointerEvents: 'auto',
            mt: 0
          }}
        >
          <Alert
            onClose={() => remove(n.id)}
            severity={n.type}
            variant="filled"
            sx={{ 
              width: '100%',
              minWidth: 288,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
