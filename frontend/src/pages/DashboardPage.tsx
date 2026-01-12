import { Box, Container, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Welcome, {user?.firstName}! 👋
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* User Profile Card */}
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Your Profile
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Username:</strong> {user?.username}
            </Typography>
            <Typography variant="body2">
              <strong>Bio:</strong> {user?.bio || 'No bio yet'}
            </Typography>
          </Box>

          {/* Sports Interests Card */}
          <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Your Sports Interests
            </Typography>
            {user?.sports && user.sports.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {user.sports.map(sport => (
                  <Box
                    key={sport.id}
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'primary.light',
                      color: 'primary.dark',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    {sport.name}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No sports interests yet. Visit your profile to add some!
              </Typography>
            )}
          </Box>
        </Box>

        {/* Coming Soon Section */}
        <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🚀 Coming Soon Features
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Discover sports friends near you
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Create and browse events
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Manage your friendships
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Share updates and posts
            </Typography>
            <Typography component="li" variant="body2">
              Browse sports marketplace
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
