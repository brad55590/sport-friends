import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  Link,
  useTheme,
  Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../hooks/useAuth';
import { useError } from '../hooks/useError';
import { gradients } from '../theme';

export function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, isLoading, error, clearError, user } = useAuth();
  const { addError } = useError();
  const loginSuccessfulRef = useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Display error from auth context in error component
  useEffect(() => {
    if (error) {
      addError(error, 'error');
    }
  }, [error, addError]);

  // Navigate to dashboard only after successful login
  useEffect(() => {
    if (loginSuccessfulRef.current && user && !isLoading && !error) {
      console.log('[LoginPage] Navigating to dashboard: user authenticated, not loading, no errors');
      navigate('/dashboard');
    } else if (loginSuccessfulRef.current) {
      console.log('[LoginPage] Not navigating - user:', !!user, 'isLoading:', isLoading, 'error:', error);
    }
  }, [user, isLoading, error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    loginSuccessfulRef.current = false; // Reset flag
    
    try {
      console.log('[LoginPage] Starting login...');
      await login(email, password);
      console.log('[LoginPage] Login promise resolved successfully');
      // Mark login as successful - useEffect will handle navigation
      loginSuccessfulRef.current = true;
    } catch (err) {
      // Error is already handled by context and displayed in the error alert
      // Do not navigate on error
      console.log('[LoginPage] Login error caught:', err);
      loginSuccessfulRef.current = false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradients.primary,
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 3,
              background: '#ffffff',
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 800,
                  background: gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SportFriends
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontWeight: 500 }}
              >
                Sign in to your account
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
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
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'primary.main', mr: 1 }} />
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
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: gradients.primary,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 1,
                    '&:hover': {
                      background: gradients.primaryHover,
                    },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} color="inherit" />
                      Signing in...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Create Account Link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?{' '}
                    <Button
                      color="primary"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        p: 0,
                        ml: 0.5,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => navigate('/register')}
                    >
                      Create one
                    </Button>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
