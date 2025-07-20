// apps/frontend/src/utils/__tests__/validation.utils.test.ts

import {
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validatePhone,
  validateName,
  validateAge,
  validateOTP,
  validateURL,
  validateFileSize,
  validateFileType,
  validateForm,
  hasFormErrors,
} from '../validation.utils';
import { CHAR_LIMITS, FILE_LIMITS } from '../../constants';

describe('validation.utils', () => {
  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('  ')).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('invalid')).toBe('Please provide a valid email address');
      expect(validateEmail('invalid@')).toBe('Please provide a valid email address');
      expect(validateEmail('@invalid.com')).toBe('Please provide a valid email address');
      expect(validateEmail('invalid@.com')).toBe('Please provide a valid email address');
    });

    it('should return error for email exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      expect(validateEmail(longEmail)).toBe(`Email must not exceed ${CHAR_LIMITS.EMAIL_MAX} characters`);
    });

    it('should return undefined for valid email', () => {
      expect(validateEmail('test@example.com')).toBeUndefined();
      expect(validateEmail('user.name@domain.co.uk')).toBeUndefined();
      expect(validateEmail('123@456.com')).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('should return error for password too short', () => {
      expect(validatePassword('1234567')).toBe(`Password must be at least ${CHAR_LIMITS.PASSWORD_MIN} characters long`);
    });

    it('should return error for password too long', () => {
      const longPassword = 'a'.repeat(CHAR_LIMITS.PASSWORD_MAX + 1);
      expect(validatePassword(longPassword)).toBe(`Password must not exceed ${CHAR_LIMITS.PASSWORD_MAX} characters`);
    });

    it('should return undefined for valid password', () => {
      expect(validatePassword('validPass123')).toBeUndefined();
      expect(validatePassword('a'.repeat(CHAR_LIMITS.PASSWORD_MIN))).toBeUndefined();
    });
  });

  describe('validateStrongPassword', () => {
    it('should return basic validation errors first', () => {
      expect(validateStrongPassword('')).toBe('Password is required');
      expect(validateStrongPassword('short')).toContain('at least');
    });

    it('should return error for weak passwords', () => {
      const expectedError = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      
      expect(validateStrongPassword('password123')).toBe(expectedError); // No uppercase or special
      expect(validateStrongPassword('PASSWORD123')).toBe(expectedError); // No lowercase or special
      expect(validateStrongPassword('Password')).toBe(expectedError); // No number or special
      expect(validateStrongPassword('Password123')).toBe(expectedError); // No special character
    });

    it('should return undefined for strong passwords', () => {
      expect(validateStrongPassword('Password123!')).toBeUndefined();
      expect(validateStrongPassword('Str0ng@Pass')).toBeUndefined();
      expect(validateStrongPassword('MyP@ssw0rd')).toBeUndefined();
    });
  });

  describe('validatePhone', () => {
    it('should return error for empty phone', () => {
      expect(validatePhone('')).toBe('Phone number is required');
      expect(validatePhone('  ')).toBe('Phone number is required');
    });

    it('should return error for invalid phone format', () => {
      expect(validatePhone('123')).toBe('Please provide a valid 10-digit phone number');
      expect(validatePhone('abcdefghij')).toBe('Please provide a valid 10-digit phone number');
      expect(validatePhone('12345678901')).toBe('Please provide a valid 10-digit phone number'); // 11 digits
      expect(validatePhone('5123456789')).toBe('Please provide a valid 10-digit phone number'); // Starts with 5
    });

    it('should return undefined for valid phone numbers', () => {
      expect(validatePhone('9876543210')).toBeUndefined();
      expect(validatePhone('7123456789')).toBeUndefined();
      expect(validatePhone('8999999999')).toBeUndefined();
    });
  });

  describe('validateName', () => {
    it('should return error for empty name', () => {
      expect(validateName('', 'First name')).toBe('First name is required');
      expect(validateName('  ', 'Last name')).toBe('Last name is required');
    });

    it('should return error for name too short', () => {
      expect(validateName('J', 'Name')).toBe(`Name must be at least ${CHAR_LIMITS.NAME_MIN} characters`);
    });

    it('should return error for name too long', () => {
      const longName = 'a'.repeat(CHAR_LIMITS.NAME_MAX + 1);
      expect(validateName(longName, 'Name')).toBe(`Name must not exceed ${CHAR_LIMITS.NAME_MAX} characters`);
    });

    it('should return error for invalid characters', () => {
      expect(validateName('John123', 'Name')).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
      expect(validateName('John@Doe', 'Name')).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
    });

    it('should return undefined for valid names', () => {
      expect(validateName('John', 'First name')).toBeUndefined();
      expect(validateName('Mary-Jane', 'First name')).toBeUndefined();
      expect(validateName("O'Connor", 'Last name')).toBeUndefined();
      expect(validateName('Jean-Paul', 'First name')).toBeUndefined();
    });
  });

  describe('validateAge', () => {
    it('should return error for age below minimum', () => {
      expect(validateAge(17)).toBe('You must be at least 18 years old');
      expect(validateAge(0)).toBe('You must be at least 18 years old');
    });

    it('should return error for age above maximum', () => {
      expect(validateAge(51)).toBe('Age must not exceed 50 years');
      expect(validateAge(100)).toBe('Age must not exceed 50 years');
    });

    it('should return undefined for valid age', () => {
      expect(validateAge(18)).toBeUndefined();
      expect(validateAge(25)).toBeUndefined();
      expect(validateAge(50)).toBeUndefined();
    });
  });

  describe('validateOTP', () => {
    it('should return error for empty OTP', () => {
      expect(validateOTP('')).toBe('OTP is required');
      expect(validateOTP('  ')).toBe('OTP is required');
    });

    it('should return error for invalid OTP format', () => {
      expect(validateOTP('12345')).toBe('OTP must be a 6-digit number'); // Too short
      expect(validateOTP('1234567')).toBe('OTP must be a 6-digit number'); // Too long
      expect(validateOTP('abcdef')).toBe('OTP must be a 6-digit number'); // Letters
      expect(validateOTP('12345a')).toBe('OTP must be a 6-digit number'); // Mixed
    });

    it('should return undefined for valid OTP', () => {
      expect(validateOTP('123456')).toBeUndefined();
      expect(validateOTP('000000')).toBeUndefined();
      expect(validateOTP('999999')).toBeUndefined();
    });
  });

  describe('validateURL', () => {
    it('should return error for empty URL', () => {
      expect(validateURL('')).toBe('URL is required');
      expect(validateURL('  ')).toBe('URL is required');
    });

    it('should return error for invalid URL format', () => {
      expect(validateURL('not-a-url')).toBe('Please provide a valid URL');
      expect(validateURL('www.example.com')).toBe('Please provide a valid URL'); // Missing protocol
      expect(validateURL('ftp://example.com')).toBe('Please provide a valid URL'); // Wrong protocol
      expect(validateURL('http://')).toBe('Please provide a valid URL'); // Missing domain
    });

    it('should return undefined for valid URLs', () => {
      expect(validateURL('https://example.com')).toBeUndefined();
      expect(validateURL('http://www.example.com')).toBeUndefined();
      expect(validateURL('https://subdomain.example.co.uk')).toBeUndefined();
      expect(validateURL('https://example.com/path?query=value')).toBeUndefined();
    });
  });

  describe('validateFileSize', () => {
    it('should return error for file too large', () => {
      const largeFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: FILE_LIMITS.IMAGE_MAX_SIZE + 1 });
      
      expect(validateFileSize(largeFile, FILE_LIMITS.IMAGE_MAX_SIZE))
        .toBe('File size must not exceed 5.0MB');
    });

    it('should return undefined for valid file size', () => {
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: FILE_LIMITS.IMAGE_MAX_SIZE - 1 });
      
      expect(validateFileSize(validFile, FILE_LIMITS.IMAGE_MAX_SIZE)).toBeUndefined();
    });
  });

  describe('validateFileType', () => {
    it('should return error for invalid file type', () => {
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
      
      expect(validateFileType(invalidFile, FILE_LIMITS.ALLOWED_IMAGE_TYPES))
        .toBe(`File type not allowed. Allowed types: ${FILE_LIMITS.ALLOWED_IMAGE_TYPES.join(', ')}`);
    });

    it('should return undefined for valid file type', () => {
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      
      expect(validateFileType(validFile, FILE_LIMITS.ALLOWED_IMAGE_TYPES)).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    interface TestForm {
      email: string;
      password: string;
      name: string;
    }

    const testData: TestForm = {
      email: 'invalid-email',
      password: 'short',
      name: 'J',
    };

    const rules = [
      { field: 'email' as keyof TestForm, validate: validateEmail },
      { field: 'password' as keyof TestForm, validate: validatePassword },
      { field: 'name' as keyof TestForm, validate: (value: string) => validateName(value, 'Name') },
    ];

    it('should return all validation errors', () => {
      const errors = validateForm(testData, rules);
      
      expect(errors.email).toBe('Please provide a valid email address');
      expect(errors.password).toContain('at least');
      expect(errors.name).toContain('at least');
    });

    it('should return empty object for valid data', () => {
      const validData: TestForm = {
        email: 'test@example.com',
        password: 'validPassword123',
        name: 'John Doe',
      };
      
      const errors = validateForm(validData, rules);
      expect(errors).toEqual({});
    });
  });

  describe('hasFormErrors', () => {
    it('should return true if errors exist', () => {
      expect(hasFormErrors({ email: 'Email is required' })).toBe(true);
      expect(hasFormErrors({ email: 'Error', password: 'Error' })).toBe(true);
    });

    it('should return false if no errors', () => {
      expect(hasFormErrors({})).toBe(false);
      expect(hasFormErrors({ email: undefined, password: '' })).toBe(false);
    });
  });
});