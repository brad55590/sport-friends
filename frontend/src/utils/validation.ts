/**
 * Centralized validation utilities for forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Must contain at least one digit');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Must contain at least one special character');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that passwords match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a name field
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push(`${fieldName} is required`);
  } else if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters`);
  } else if (name.trim().length > 50) {
    errors.push(`${fieldName} must be less than 50 characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates password strength on a scale of 0-4
 * Used for visual indicators
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;
  
  if (!password) return 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 4);
}

/**
 * Gets strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  switch (strength) {
    case 0:
      return 'No password';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Unknown';
  }
}

/**
 * Gets strength color for visual indication
 */
export function getPasswordStrengthColor(strength: number): 'error' | 'warning' | 'info' | 'success' {
  switch (strength) {
    case 0:
    case 1:
      return 'error';
    case 2:
      return 'warning';
    case 3:
      return 'info';
    case 4:
      return 'success';
    default:
      return 'info';
  }
}
