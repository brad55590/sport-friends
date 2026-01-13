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
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../hooks/useAuth';
import { Sport } from '../context/AuthContext';

export function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
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
      // Ensure selectedSports is updated with current user sports
      const sportIds = (user.sports || []).map(s => s.id);
      setSelectedSports(sportIds);
      console.log('[ProfilePage] Set selectedSports to:', sportIds);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    setSelectedLocation(null);
    setLocationSearch('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');

    try {
      const selectedSportObjects = availableSports.filter(s =>
        selectedSports.includes(s.id)
      );

      console.log('[ProfilePage] Saving profile with sports:', selectedSportObjects.map(s => s.name));

      await updateProfile({
        ...formData,
        sports: selectedSportObjects,
      } as any);

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Error is handled by context
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6">Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Edit Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your profile information and preferences
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                  >
                    <CameraAltIcon />
                  </IconButton>
                </label>
                <Typography variant="caption" color="text.secondary">
                  Change photo
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Personal Information
              </Typography>
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
                  size="small"
                />

                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  size="small"
                  helperText="Your unique SportFriends username"
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
                    size="small"
                  />

                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📍 Location
              </Typography>
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
                      size="small"
                      helperText="Search your city or region for exact coordinates"
                    />
                  )}
                />

                {/* Display Selected Location Coordinates */}
                {(formData.latitude !== 0 || formData.longitude !== 0) && (
                  <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark', mb: 0.5 }}>
                      ✓ Location Confirmed
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      {formData.area}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.75rem' }}>
                      {formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Sports Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ⚽ Sports Interests
              </Typography>
              <Stack spacing={2}>
                {/* Selected Sports Chips */}
                {selectedSports.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Selected ({selectedSports.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {getSelectedSportNames().map(sportName => (
                        <Chip
                          key={sportName}
                          label={sportName}
                          onDelete={() => {
                            const sportId = availableSports.find(s => s.name === sportName)?.id;
                            if (sportId) handleSportChange(sportId);
                          }}
                          color="primary"
                          variant="filled"
                          disabled={isLoading}
                          size="small"
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
                    sportSearch.length < 3
                      ? 'Type at least 3 characters to search'
                      : 'No sports found'
                  }
                  filterOptions={(options) => {
                    if (sportSearch.length < 3) {
                      return [];
                    }
                    return options.filter(option =>
                      option.name.toLowerCase().includes(sportSearch.toLowerCase())
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Sports"
                      placeholder="Search to add more sports..."
                      fullWidth
                      size="small"
                      helperText="Search for sports you enjoy (min 3 characters)"
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                About You
              </Typography>
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
                size="small"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={isLoading}
              sx={{ minWidth: 200 }}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
