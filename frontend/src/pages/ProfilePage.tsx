import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Autocomplete,
  Avatar,
  IconButton,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAuth } from '../hooks/useAuth';
import { Sport } from '../context/AuthContext';

export function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
  });
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [sportSearch, setSportSearch] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      console.log('[ProfilePage] User loaded:', {
        email: user.email,
        sportsCount: user.sports?.length || 0,
        sportsArray: user.sports,
      });
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
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
        firstName: '',
        lastName: '',
        bio: '',
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            My Profile
          </Typography>

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
            {/* Profile Picture Section */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
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
              <Box sx={{ position: 'relative' }}>
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
                  >
                    <CameraAltIcon />
                  </IconButton>
                </label>
              </Box>
              <Typography variant="caption" color="textSecondary">
                Click the camera icon to upload a profile picture
              </Typography>
            </Box>

            {/* Personal Information */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
              Personal Information
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              label="Bio"
              name="bio"
              placeholder="Tell other sports friends about yourself"
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              helperText="Write a short bio about yourself (max 500 characters)"
            />

            {/* Sports Interests */}
            <Box sx={{ mt: 4, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sports Interests
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Selected Sports */}
              {selectedSports.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getSelectedSportNames().map(sportName => (
                    <Chip
                      key={sportName}
                      label={sportName}
                      onDelete={() => {
                        const sportId = availableSports.find(s => s.name === sportName)?.id;
                        if (sportId) handleSportChange(sportId);
                      }}
                      color="primary"
                      variant="outlined"
                      disabled={isLoading}
                    />
                  ))}
                </Box>
              )}

              {/* Sports Autocomplete Dropdown */}
              <Autocomplete
                disabled={isLoading}
                options={filteredSports}
                getOptionLabel={(option) => option.name}
                inputValue={sportSearch}
                onInputChange={(_, value) => setSportSearch(value)}
                onChange={(_, value) => {
                  if (value) {
                    handleSportChange(value.id);
                    setSportSearch(''); // Clear search after selection
                  }
                }}
                noOptionsText={
                  sportSearch.length < 3
                    ? 'Type at least 3 characters to search'
                    : 'No sports found'
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search sports (min 3 characters)..."
                    fullWidth
                  />
                )}
                filterOptions={(options) => {
                  // Only filter if we have 3+ characters
                  if (sportSearch.length < 3) {
                    return [];
                  }
                  return options.filter(option =>
                    option.name.toLowerCase().includes(sportSearch.toLowerCase())
                  );
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
