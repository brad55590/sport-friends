import { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordStrengthIndicator } from '../common/PasswordStrengthIndicator';

interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'error'> {
  errors?: string[];
  showStrengthIndicator?: boolean;
}

/**
 * Reusable password field component with visibility toggle and strength indicator
 */
export function PasswordField({
  errors = [],
  showStrengthIndicator = true,
  value = '',
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = errors.length > 0;
  const passwordValue = typeof value === 'string' ? value : '';

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Stack spacing={1}>
      <TextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        value={passwordValue}
        error={hasError}
        helperText={hasError ? errors.join('; ') : props.helperText}
        fullWidth
        size="medium"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleToggleVisibility}
                edge="end"
                sx={{
                  color: 'inherit',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
      {showStrengthIndicator && (
        <PasswordStrengthIndicator password={passwordValue} />
      )}
    </Stack>
  );
}
