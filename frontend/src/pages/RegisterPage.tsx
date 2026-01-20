import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useError } from '../hooks/useError';
import { FormField } from '../components/forms/FormField';
import { PasswordField } from '../components/forms/PasswordField';
import { SubmitButton } from '../components/forms/SubmitButton';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
} from '../utils/validation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName: string[];
  lastName: string[];
  email: string[];
  password: string[];
  confirmPassword: string[];
}

const initialFormErrors: FormErrors = {
  firstName: [],
  lastName: [],
  email: [],
  password: [],
  confirmPassword: [],
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, user } = useAuth();
  const { addError } = useError();
  const registrationSuccessfulRef = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>(initialFormErrors);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Navigate to dashboard only after successful registration
  useEffect(() => {
    if (registrationSuccessfulRef.current && user && !isLoading && !error) {
      navigate('/dashboard');
    }
  }, [user, isLoading, error, navigate]);

  // Display error from auth context in error component
  useEffect(() => {
    if (error) {
      addError(error, 'error');
    }
  }, [error, addError]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof FormErrors].length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...initialFormErrors };
    let isValid = true;

    // Validate first name
    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.errors;
      isValid = false;
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.errors;
      isValid = false;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors;
      isValid = false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors;
      isValid = false;
    }

    // Validate password match
    const passwordMatchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (!passwordMatchValidation.isValid) {
      newErrors.confirmPassword = passwordMatchValidation.errors;
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      registrationSuccessfulRef.current = false;
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      registrationSuccessfulRef.current = true;
    } catch (err) {
      registrationSuccessfulRef.current = false;
      // Error is already handled by the error context via useEffect
    }
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    Object.values(formErrors).every((errors) => errors.length === 0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                Create your account
              </Typography>
            </Box>

            {/* API Error Alert */}
            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Personal Information Section */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person
                      sx={{
                        mr: 1,
                        color: 'primary.main',
                        fontSize: '1.5rem',
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Personal Information
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    <FormField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFieldChange}
                      errors={formErrors.firstName}
                      disabled={isLoading}
                      placeholder="John"
                      autoComplete="given-name"
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFieldChange}
                      errors={formErrors.lastName}
                      disabled={isLoading}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                  </Stack>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Email Section */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email
                      sx={{
                        mr: 1,
                        color: 'primary.main',
                        fontSize: '1.5rem',
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Email
                    </Typography>
                  </Box>
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    errors={formErrors.email}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Password Section */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Lock
                      sx={{
                        mr: 1,
                        color: 'primary.main',
                        fontSize: '1.5rem',
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        fontSize: '0.95rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Password
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    <PasswordField
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleFieldChange}
                      errors={formErrors.password}
                      disabled={isLoading}
                      showStrengthIndicator={true}
                    />
                    <PasswordField
                      label="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFieldChange}
                      errors={formErrors.confirmPassword}
                      disabled={isLoading}
                      showStrengthIndicator={false}
                    />
                  </Stack>
                </Box>

                {/* Submit Button */}
                <SubmitButton
                  isLoading={isLoading}
                  disabled={!isFormValid}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #5568d3 0%, #6a3a8a 100%)',
                    },
                  }}
                >
                  Create Account
                </SubmitButton>

                {/* Sign In Link */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Already have an account?{' '}
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
                      onClick={() => navigate('/login')}
                    >
                      Sign In
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
