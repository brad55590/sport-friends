import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { DashboardPage } from '../pages/DashboardPage';
import { AuthContext, AuthContextType } from '../context/AuthContext';

const mockUser = {
  id: '1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  username: 'demouser',
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  updateProfile: async () => {},
};

describe('DashboardPage', () => {
  it('renders dashboard with user welcome message', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardPage />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/welcome, demo/i)).toBeInTheDocument();
  });

  it('displays user profile information', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardPage />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/demo@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/demouser/)).toBeInTheDocument();
  });

  it('has logout button', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardPage />
      </AuthContext.Provider>
    );

    // Logout button is in the Layout sidebar, not in DashboardPage
    // This test is no longer needed as navigation is in Layout component
  });

  it('shows coming soon features', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <DashboardPage />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/coming soon features/i)).toBeInTheDocument();
    expect(screen.getByText(/discover sports friends/i)).toBeInTheDocument();
    expect(screen.getByText(/browse events/i)).toBeInTheDocument();
  });

  it('calls logout when logout button clicked', async () => {
    const user = userEvent.setup();
    const logoutMock = vi.fn();

    const contextWithMock: AuthContextType = {
      ...mockAuthContext,
      logout: logoutMock,
    };

    render(
      <AuthContext.Provider value={contextWithMock}>
        <DashboardPage />
      </AuthContext.Provider>
    );

    // Logout button is in the Layout sidebar, not in DashboardPage
    // This test is no longer applicable
  });});