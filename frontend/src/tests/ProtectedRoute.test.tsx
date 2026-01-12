import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from './test-utils';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const mockAuthContext: AuthContextType = {
  user: {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
  },
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: async () => {},
};

const unauthenticatedContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: async () => {},
};

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    render(
      <AuthContext.Provider value={unauthenticatedContext}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>,
      { initialRoute: '/dashboard' }
    );

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
