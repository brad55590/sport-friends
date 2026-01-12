import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { RegisterPage } from '../pages/RegisterPage';

describe('RegisterPage', () => {
  it('renders registration form with required fields', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(<RegisterPage />);

    const signInLink = screen.getByRole('button', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
  });

  it('allows user to fill all fields', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    
    const passwordFields = screen.getAllByLabelText(/password/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(<RegisterPage />);

    const signInLink = screen.getByRole('button', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
  });
});
