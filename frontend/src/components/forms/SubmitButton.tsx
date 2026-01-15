import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Reusable submit button with loading state
 */
export function SubmitButton({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type="submit"
      fullWidth
      variant="contained"
      disabled={isLoading || disabled}
      sx={{
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 600,
        textTransform: 'none',
        ...props.sx,
      }}
    >
      {isLoading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} color="inherit" />
          {loadingText}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}
