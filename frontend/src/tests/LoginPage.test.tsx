import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays demo credentials hint', () => {
    render(<LoginPage />);

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/demo@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/password/)).toBeInTheDocument();
  });

  it('has link to register page', () => {
    render(<LoginPage />);

    const signUpLink = screen.getByRole('button', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
  });

  it('pre-fills form with demo credentials', () => {
    render(<LoginPage />);

    const emailField = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;

    expect(emailField.value).toBe('demo@example.com');
    expect(passwordField.value).toBe('password');
  });

  it('allows user to enter credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailField = screen.getByLabelText(/email address/i);
    const passwordField = screen.getByLabelText(/password/i);

    await user.clear(emailField);
    await user.type(emailField, 'test@example.com');
    await user.clear(passwordField);
    await user.type(passwordField, 'newpassword');

    expect(emailField).toHaveValue('test@example.com');
    expect(passwordField).toHaveValue('newpassword');
  });

  it('handles login form submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Verify submit button exists (not testing the full login flow in this test)
    expect(submitButton).toBeInTheDocument();
  });

  it('shows error message on invalid credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailField = screen.getByLabelText(/email address/i);
    const passwordField = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.clear(emailField);
    await user.type(emailField, 'wrong@example.com');
    await user.clear(passwordField);
    await user.type(passwordField, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
