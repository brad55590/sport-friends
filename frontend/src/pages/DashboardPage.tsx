import { Box, Container, Typography, Paper, Grid, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { gradients } from '../theme';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradients.primary,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 1,
            }}
          >
            Welcome, {user?.firstName}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Here's your SportFriends overview
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* User Profile Card */}
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderRadius: 3,
              background: '#ffffff',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1.1rem',
              }}
            >
              Your Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  EMAIL
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  USERNAME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.username || 'Not set'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  BIO
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.bio || 'No bio yet'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Sports Interests Card */}
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderRadius: 3,
              background: '#ffffff',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '1.1rem',
              }}
            >
              Your Sports Interests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {user?.sports && user.sports.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {user.sports.map((sport) => (
                  <Box
                    key={sport.id}
                    sx={{
                      px: 2,
                      py: 1,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      color: 'primary.main',
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: '1px solid rgba(102, 126, 234, 0.2)',
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
          </Paper>
        </Grid>

        {/* Coming Soon Section */}
        <Paper
          elevation={8}
          sx={{
            p: 3,
            borderRadius: 3,
            background: '#ffffff',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: 'primary.main',
              fontSize: '1.1rem',
            }}
          >
            🚀 Coming Soon Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            component="ul"
            sx={{
              pl: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography component="li" variant="body2" sx={{ fontWeight: 500 }}>
              Discover sports friends near you
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 500 }}>
              Create and browse events
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 500 }}>
              Manage your friendships
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 500 }}>
              Share updates and posts
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontWeight: 500 }}>
              Browse sports marketplace
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
