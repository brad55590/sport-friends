import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from './validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid.email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    it('should accept valid email', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validatePassword', () => {
    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must contain at least one lowercase letter');
    });

    it('should reject password without digit', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must contain at least one digit');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Must contain at least one special character');
    });

    it('should accept valid password', () => {
      const result = validatePassword('ValidPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validatePasswordMatch', () => {
    it('should reject when confirm password is empty', () => {
      const result = validatePasswordMatch('Password123!', '');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please confirm your password');
    });

    it('should reject when passwords do not match', () => {
      const result = validatePasswordMatch('Password123!', 'Different123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Passwords do not match');
    });

    it('should accept when passwords match', () => {
      const result = validatePasswordMatch('Password123!', 'Password123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateName', () => {
    it('should reject empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should reject name shorter than 2 characters', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters');
    });

    it('should reject name longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be less than 50 characters');
    });

    it('should accept valid name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should use custom field name in error messages', () => {
      const result = validateName('', 'First name');
      expect(result.errors).toContain('First name is required');
    });
  });

  describe('calculatePasswordStrength', () => {
    it('should return 0 for empty password', () => {
      expect(calculatePasswordStrength('')).toBe(0);
    });

    it('should return 1 for password with only length requirement', () => {
      expect(calculatePasswordStrength('password')).toBe(1);
    });

    it('should return 2 for password with length and case', () => {
      expect(calculatePasswordStrength('Password')).toBe(2);
    });

    it('should return 3 for password with length, case, digit and special char', () => {
      expect(calculatePasswordStrength('Password1!')).toBe(3);
    });

    it('should return 4 for strong password', () => {
      expect(calculatePasswordStrength('Password123!')).toBe(4);
    });

    it('should cap strength at 4', () => {
      expect(calculatePasswordStrength('ValidPassword123!@#$')).toBe(4);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return correct labels for each strength level', () => {
      expect(getPasswordStrengthLabel(0)).toBe('No password');
      expect(getPasswordStrengthLabel(1)).toBe('Weak');
      expect(getPasswordStrengthLabel(2)).toBe('Fair');
      expect(getPasswordStrengthLabel(3)).toBe('Good');
      expect(getPasswordStrengthLabel(4)).toBe('Strong');
    });

    it('should handle unknown strength values', () => {
      expect(getPasswordStrengthLabel(999)).toBe('Unknown');
    });
  });
});
