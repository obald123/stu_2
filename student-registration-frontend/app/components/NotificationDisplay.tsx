import { useNotification } from '../context/NotificationContext';
import { Snackbar, Alert } from '@mui/material';

export default function NotificationDisplay() {
  const { notifications, remove } = useNotification();
  return (
    <>
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={true}
          autoHideDuration={4000}
          onClose={() => remove(n.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => remove(n.id)}
            severity={n.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
