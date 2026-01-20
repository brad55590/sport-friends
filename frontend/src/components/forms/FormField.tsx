import { TextField, TextFieldProps, FormHelperText, Stack } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  errors?: string[];
  errorMessage?: string;
}

/**
 * Reusable form field component with error handling
 */
export function FormField({
  errors = [],
  errorMessage,
  helperText,
  ...props
}: FormFieldProps) {
  const hasError = errors.length > 0 || !!errorMessage;
  const displayErrors = errorMessage ? [errorMessage] : errors;

  return (
    <Stack spacing={0.5}>
      <TextField
        {...props}
        error={hasError}
        helperText={hasError ? displayErrors.join('; ') : helperText}
        fullWidth
        size="medium"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s ease',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
            },
          },
          ...props.sx,
        }}
      />
    </Stack>
  );
}
