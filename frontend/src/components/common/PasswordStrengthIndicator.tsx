import { Box, LinearProgress, Typography, Stack } from '@mui/material';
import { 
  calculatePasswordStrength, 
  getPasswordStrengthLabel, 
  getPasswordStrengthColor 
} from '../../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
}

export function PasswordStrengthIndicator({ 
  password, 
  showLabel = true 
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const color = getPasswordStrengthColor(strength);
  const percentage = (strength / 4) * 100;

  return (
    <Stack spacing={1}>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={color}
        sx={{ height: 6, borderRadius: 1 }}
      />
      {showLabel && (
        <Typography
          variant="caption"
          color={
            color === 'error'
              ? 'error'
              : color === 'warning'
              ? 'warning'
              : color === 'success'
              ? 'success'
              : 'info'
          }
        >
          Password strength: <strong>{label}</strong>
        </Typography>
      )}
    </Stack>
  );
}
