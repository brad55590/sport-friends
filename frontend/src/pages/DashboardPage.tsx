import { Box, Container, Typography, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography component="h1" variant="h4">
            Dashboard
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome, {user?.firstName} {user?.lastName}!
        </Typography>

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body2">
            <strong>Username:</strong> {user?.username}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Coming Soon Features
          </Typography>
          <Typography variant="body2" component="ul">
            <li>Discover sports friends</li>
            <li>Browse events</li>
            <li>Manage friendships</li>
            <li>Post updates</li>
            <li>Browse marketplace</li>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
