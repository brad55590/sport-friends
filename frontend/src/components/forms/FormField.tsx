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
      />
    </Stack>
  );
}
