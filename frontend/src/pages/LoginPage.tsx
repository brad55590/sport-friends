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
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            background: gradients.primary,
            borderRadius: 2,
            mb: 3,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SportsSoccerIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            SportFriends
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Connect with athletes. Find your team.
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.palette.text.primary,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 3,
              textAlign: 'center',
            }}
          >
            Sign in to your account to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: gradients.primary,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 1,
                '&:hover': {
                  background: gradients.primaryHover,
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            mt: 4,
            textAlign: 'center',
          }}
        >
          © 2025 SportFriends. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
