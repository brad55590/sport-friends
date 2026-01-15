import { Alert, Box, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useError } from '../../hooks/useError';

export function ErrorDisplay() {
  const { errors, removeError } = useError();

  if (errors.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        maxWidth: 400,
      }}
    >
      <Stack spacing={1}>
        {errors.map((error) => (
          <Alert
            key={error.id}
            severity={error.severity}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => removeError(error.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              animation: 'slideIn 0.3s ease-in-out',
              '@keyframes slideIn': {
                from: {
                  transform: 'translateX(400px)',
                  opacity: 0,
                },
                to: {
                  transform: 'translateX(0)',
                  opacity: 1,
                },
              },
            }}
          >
            {error.message}
          </Alert>
        ))}
      </Stack>
    </Box>
  );
}
