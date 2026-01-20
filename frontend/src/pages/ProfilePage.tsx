import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
  Avatar,
  IconButton,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../hooks/useAuth';
import { gradients } from '../theme';
import { Sport } from '../context/AuthContext';

export function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    area: '',
    latitude: 0,
    longitude: 0,
    avatar: '',
  });
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [sportSearch, setSportSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [locationOptions, setLocationOptions] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const locationSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      console.log('[ProfilePage] User loaded:', {
        email: user.email,
        sportsCount: user.sports?.length || 0,
        sportsArray: user.sports,
      });
      setFormData({
        email: user.email || '',
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        area: user.area || '',
        latitude: user.latitude || 0,
        longitude: user.longitude || 0,
        avatar: user.avatar || '',
      });

      // Ensure selectedSports is updated with current user sports (supports id strings or Sport objects)
      const sportIds = (user.sports || [])
        .map((s: any) => (typeof s === 'string' ? s : s?.id))
        .filter(Boolean) as string[];
      setSelectedSports(sportIds);
      console.log('[ProfilePage] Set selectedSports to:', sportIds);

      // Prefill location search/value when profile already has a location
      if (user.area) {
        setSelectedLocation({
          name: user.area,
          lat: user.latitude || 0,
          lng: user.longitude || 0,
        });
        setLocationSearch(user.area);
      } else {
        setSelectedLocation(null);
        setLocationSearch('');
      }
    } else {
      // Reset form when user is not loaded
      console.log('[ProfilePage] User not loaded, resetting form');
      setFormData({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        bio: '',
        area: '',
        latitude: 0,
        longitude: 0,
        avatar: '',
      });
      setSelectedSports([]);
      setSelectedLocation(null);
      setLocationSearch('');
    }
  }, [user]);

  // Load available sports
  useEffect(() => {
    const loadSports = async () => {
      try {
        console.log('[ProfilePage] Fetching sports from /api/v1/sports...');
        const response = await fetch('/api/v1/sports');
        const contentType = response.headers.get('content-type') || '';
        
        console.log('[ProfilePage] Sports fetch response status:', response.status, 'content-type:', contentType);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        // Check if response is actually JSON
        if (!contentType.includes('application/json')) {
          console.error('[ProfilePage] Response is not JSON, content-type:', contentType);
          const text = await response.text();
          console.error('[ProfilePage] Response starts with:', text.substring(0, 100));
          throw new Error(`Invalid response content-type: ${contentType}`);
        }
        
        const sports: Sport[] = await response.json();
        console.log('[ProfilePage] Successfully loaded sports:', sports.length, 'sports');
        setAvailableSports(sports);
      } catch (err) {
        console.error('[ProfilePage] Failed to load sports:', err);
        // Fallback: use a default set of sports if fetch fails
        console.log('[ProfilePage] Using fallback sports');
        const fallbackSports: Sport[] = [
          { id: '1', name: 'Basketball' },
          { id: '2', name: 'Soccer' },
          { id: '3', name: 'Tennis' },
          { id: '4', name: 'Volleyball' },
          { id: '5', name: 'Swimming' },
          { id: '6', name: 'Golf' },
          { id: '7', name: 'Baseball' },
          { id: '8', name: 'Hockey' },
          { id: '9', name: 'Running' },
          { id: '10', name: 'Cycling' },
          { id: '11', name: 'Yoga' },
          { id: '12', name: 'Pilates' },
          { id: '13', name: 'Boxing' },
          { id: '14', name: 'Martial Arts' },
          { id: '15', name: 'Surfing' },
          { id: '16', name: 'Skiing' },
          { id: '17', name: 'Snowboarding' },
          { id: '18', name: 'Climbing' },
          { id: '19', name: 'Hiking' },
          { id: '20', name: 'Fishing' },
        ];
        setAvailableSports(fallbackSports);
      }
    };

    loadSports();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({
          ...formData,
          avatar: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude,
            longitude,
          });
          console.log('[ProfilePage] Location obtained:', { latitude, longitude });
        },
        (error) => {
          console.error('[ProfilePage] Geolocation error:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    
    // Clear any pending search timeout
    if (locationSearchTimeoutRef.current) {
      clearTimeout(locationSearchTimeoutRef.current);
    }
    
    if (query.length < 3) {
      setLocationOptions([]);
      return;
    }

    // Set a debounce delay before searching (500ms)
    locationSearchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const results = await response.json();
        
        const options = results.map((result: any) => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        }));
        
        setLocationOptions(options);
        console.log('[ProfilePage] Location search results:', options);
      } catch (error) {
        console.error('[ProfilePage] Location search error:', error);
        setLocationOptions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500); // 500ms debounce delay
  };

  const handleLocationSelect = (location: { name: string; lat: number; lng: number } | null) => {
    if (!location) return;
    
    setFormData({
      ...formData,
      area: location.name,
      latitude: location.lat,
      longitude: location.lng,
    });
    setSelectedLocation(location);
    setLocationSearch(location.name);
    setLocationOptions([]);
    console.log('[ProfilePage] Location selected:', location);
  };

  const handleSportChange = (sportId: string) => {
    setSelectedSports(prev =>
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };

  const filteredSports = useMemo(() => {
    // Show all sports if search is empty, filter if search has 3+ characters
    if (sportSearch.length === 0) {
      return availableSports;
    }
    if (sportSearch.length < 3) {
      return [];
    }
    return availableSports.filter(sport =>
      sport.name.toLowerCase().includes(sportSearch.toLowerCase())
    );
  }, [availableSports, sportSearch]);

  const getSelectedSportNames = () => {
    return availableSports
      .filter(s => selectedSports.includes(s.id))
      .map(s => s.name);
  };

  // Check if form is valid for submission
  const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.email.trim() && formData.username.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');
    setValidationErrors({});

    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.username.trim()) errors.username = 'Username is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      console.error('[ProfilePage] Form validation failed:', errors);
      return;
    }

    try {
      console.log('[ProfilePage] Saving profile with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        bio: formData.bio,
        area: formData.area,
        latitude: formData.latitude,
        longitude: formData.longitude,
        avatar: formData.avatar ? `[${formData.avatar.length} bytes]` : 'none',
        sports: selectedSports, // Array of sport IDs
      });

      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        bio: formData.bio || '',
        area: formData.area || '',
        latitude: formData.latitude || 0,
        longitude: formData.longitude || 0,
        avatar: formData.avatar || '',
        sports: selectedSports, // Send array of sport IDs, not objects
      };

      await updateProfile(profileData);

      setSuccessMessage('Profile updated successfully!');
      console.log('[ProfilePage] Profile saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('[ProfilePage] Error saving profile:', err);
      // Error is handled by context
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6">Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradients.primary,
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: 'white',
              }}
            >
              Edit Profile
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Update your profile information and preferences
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <Paper
              elevation={8}
              sx={{
                mb: 4,
                borderRadius: 3,
                background: '#ffffff',
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    background: gradients.primary,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                  src={formData.avatar}
                >
                  {!formData.avatar && (
                    <>
                      {user?.firstName?.charAt(0).toUpperCase()}
                      {user?.lastName?.charAt(0).toUpperCase()}
                    </>
                  )}
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-input"
                    type="file"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="avatar-input">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      disabled={isLoading}
                      size="small"
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      <CameraAltIcon />
                    </IconButton>
                  </label>
                  <Typography variant="caption" color="text.secondary">
                    Change photo
                  </Typography>
                </Box>
              </CardContent>
            </Paper>

            {/* Personal Information Section */}
            <Paper
              elevation={8}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: '#ffffff',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1.1rem',
                  }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    size="medium"
                    variant="outlined"
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
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
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    size="medium"
                    variant="outlined"
                    error={!!validationErrors.username}
                    helperText={validationErrors.username}
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

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isLoading}
                      size="medium"
                      variant="outlined"
                      error={!!validationErrors.firstName}
                      helperText={validationErrors.firstName}
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
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isLoading}
                      size="medium"
                      variant="outlined"
                      error={!!validationErrors.lastName}
                      helperText={validationErrors.lastName}
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
                  </Box>
                </Stack>
              </CardContent>
            </Paper>

            {/* Location Section */}
            <Paper
              elevation={8}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: '#ffffff',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1.1rem',
                  }}
                >
                  📍 Location
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Autocomplete
                    options={locationOptions}
                    getOptionLabel={(option) => option.name}
                    loading={isSearchingLocation}
                    value={selectedLocation}
                    inputValue={locationSearch}
                    onInputChange={(_, value, reason) => {
                      if (reason === 'input') {
                        handleLocationSearch(value);
                      }
                    }}
                    onChange={(_, value) => handleLocationSelect(value)}
                    noOptionsText={
                      locationSearch.length < 3
                        ? 'Type at least 3 characters to search'
                        : 'No locations found'
                    }
                    filterOptions={(options) => options}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Location"
                        placeholder="e.g., San Francisco, CA"
                        fullWidth
                        size="medium"
                        variant="outlined"
                        helperText="Search your city or region for exact coordinates"
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
                    )}
                  />

                  {/* Display Selected Location Coordinates */}
                  {(formData.area || formData.latitude !== 0 || formData.longitude !== 0) && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main', mb: 0.5 }}>
                        ✓ Location Confirmed
                      </Typography>
                      {formData.area && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {formData.area}
                        </Typography>
                      )}
                      {(formData.latitude !== 0 || formData.longitude !== 0) && (
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.75rem' }}>
                          {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Paper>

            {/* Sports Section */}
            <Paper
              elevation={8}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: '#ffffff',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1.1rem',
                  }}
                >
                  ⚽ Sports Interests
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {/* Selected Sports Chips */}
                  {selectedSports.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                        Selected ({selectedSports.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {getSelectedSportNames().map((sportName) => (
                          <Chip
                            key={sportName}
                            label={sportName}
                            onDelete={() => {
                              const sportId = availableSports.find((s) => s.name === sportName)?.id;
                              if (sportId) handleSportChange(sportId);
                            }}
                            sx={{
                              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                              color: 'primary.main',
                              fontWeight: 600,
                              '& .MuiChip-deleteIcon': {
                                color: 'primary.main',
                                '&:hover': {
                                  color: 'primary.dark',
                                },
                              },
                            }}
                            disabled={isLoading}
                            size="medium"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Sports Autocomplete Dropdown */}
                  <Autocomplete
                    disabled={isLoading}
                    options={filteredSports}
                    getOptionLabel={(option) => option.name}
                    value={selectedSport}
                    inputValue={sportSearch}
                    onInputChange={(_, value) => setSportSearch(value)}
                    onChange={(_, value) => {
                      if (value) {
                        handleSportChange(value.id);
                        setSportSearch('');
                        setSelectedSport(null);
                      }
                    }}
                    noOptionsText={
                      sportSearch.length < 3 ? 'Type at least 3 characters to search' : 'No sports found'
                    }
                    filterOptions={(options) => {
                      if (sportSearch.length < 3) {
                        return [];
                      }
                      return options.filter((option) =>
                        option.name.toLowerCase().includes(sportSearch.toLowerCase())
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add Sports"
                        placeholder="Search to add more sports..."
                        fullWidth
                        size="medium"
                        variant="outlined"
                        helperText="Search for sports you enjoy (min 3 characters)"
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
                    )}
                  />
                </Stack>
              </CardContent>
            </Paper>

            {/* Bio Section */}
            <Paper
              elevation={8}
              sx={{
                mb: 4,
                borderRadius: 3,
                background: '#ffffff',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1.1rem',
                  }}
                >
                  About You
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  name="bio"
                  placeholder="Tell other sports enthusiasts about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText="Write a short bio to help others get to know you (max 500 characters)"
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
                  }}
                />
              </CardContent>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isLoading || !isFormValid}
                sx={{
                  minWidth: 200,
                  background: gradients.primary,
                  '&:hover': {
                    background: gradients.primaryHover,
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
