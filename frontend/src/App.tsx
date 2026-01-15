import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Button } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import { MockProvider, useMockContext } from './context/MockContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicRoute } from './components/common/PublicRoute';
import { ErrorDisplay } from './components/common/ErrorDisplay';
import { theme } from './theme';

// Mock Toggle Component
function MockToggle() {
  const { useMocks, setUseMocks } = useMockContext();
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <span style={{ fontSize: '12px', color: '#666' }}>
        {useMocks ? '🟢 MSW' : '🔵 Real API'}
      </span>
      <Button
        size="small"
        variant={useMocks ? 'contained' : 'outlined'}
        onClick={() => setUseMocks(!useMocks)}
        sx={{ fontSize: '11px', padding: '4px 8px' }}
      >
        {useMocks ? 'Use Real API' : 'Use Mocks'}
      </Button>
    </Box>
  );
}

// Inner App component that uses MockContext
function AppContent() {
  return (
    <>
      <Router>
        <ErrorProvider>
          <AuthProvider>
            <ErrorDisplay />
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Protected Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </AuthProvider>
        </ErrorProvider>
      </Router>
      <MockToggle />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MockProvider>
        <AppContent />
      </MockProvider>
    </ThemeProvider>
  );
}

export default App;
