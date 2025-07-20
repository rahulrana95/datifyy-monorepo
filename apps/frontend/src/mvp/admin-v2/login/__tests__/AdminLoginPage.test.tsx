// apps/frontend/src/mvp/admin-v2/login/__tests__/AdminLoginPage.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import AdminLoginPage from '../AdminLoginPage';
import adminAuthService from '../../../../service/adminAuthService';
import authService from '../../../../service/authService';
import cookieService from '../../../../utils/cookieService';
import { useNavigate } from 'react-router-dom';
import { 
  createMockResponse, 
  createMockError,
  createMockAdminUser 
} from '../../../../test-utils/mock-services';
import { ROUTES } from '../../../../constants';

// Mock dependencies
jest.mock('../../../../service/adminAuthService');
jest.mock('../../../../service/authService');
jest.mock('../../../../utils/cookieService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock ChakraUI toast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast,
}));

describe('AdminLoginPage', () => {
  const mockNavigate = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    const mockUseNavigate = useNavigate as jest.Mock;
    mockUseNavigate.mockReturnValue(mockNavigate);
    const mockGetCookie = cookieService.getCookie as jest.Mock;
    mockGetCookie.mockReturnValue(null);
    const mockVerifyToken = authService.verifyToken as jest.Mock;
    mockVerifyToken.mockResolvedValue(createMockResponse(true));
  });

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(<AdminLoginPage />);

      // Check header elements
      expect(screen.getByText('Admin Login')).toBeInTheDocument();
      expect(screen.getByText('Secure access to Datifyy administration panel')).toBeInTheDocument();
      expect(screen.getByText('🔒 Encrypted & Monitored')).toBeInTheDocument();

      // Check form elements
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin@datifyy.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      
      // Check other elements
      expect(screen.getByText('Remember me on this device')).toBeInTheDocument();
      expect(screen.getByText('Sign In to Admin Panel')).toBeInTheDocument();
      expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
      expect(screen.getByText('This is a secure admin area. All activities are logged and monitored.')).toBeInTheDocument();
      expect(screen.getByText('© 2024 Datifyy Admin Panel. All rights reserved.')).toBeInTheDocument();
    });

    it('should show loading state while checking auth', async () => {
      (authService.verifyToken as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(createMockResponse(true)), 100))
      );

      render(<AdminLoginPage />);
      
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication Check', () => {
    it('should redirect to dashboard if already authenticated', async () => {
      (cookieService.getCookie as jest.Mock).mockReturnValue('valid-token');
      (authService.verifyToken as jest.Mock).mockResolvedValue(createMockResponse(true));

      render(<AdminLoginPage />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD, { replace: true });
      });
    });

    it('should check legacy tokens from localStorage', async () => {
      const mockToken = 'legacy-token';
      Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'admin_access_token') return mockToken;
        return null;
      });

      render(<AdminLoginPage />);

      await waitFor(() => {
        expect(authService.verifyToken).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show email validation errors', async () => {
      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      // Test empty email
      await user.click(submitButton);
      expect(screen.getByText('Email is required')).toBeInTheDocument();

      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      expect(screen.getByText('Please provide a valid email address')).toBeInTheDocument();

      // Test email too long
      await user.clear(emailInput);
      await user.type(emailInput, 'a'.repeat(256) + '@example.com');
      await user.click(submitButton);
      expect(screen.getByText('Email must not exceed 255 characters')).toBeInTheDocument();
    });

    it('should show password validation errors', async () => {
      render(<AdminLoginPage />);

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      // Test empty password
      await user.click(submitButton);
      expect(screen.getByText('Password is required')).toBeInTheDocument();

      // Test password too short
      await user.type(passwordInput, '1234567');
      await user.click(submitButton);
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();

      // Test password too long
      await user.clear(passwordInput);
      await user.type(passwordInput, 'a'.repeat(129));
      await user.click(submitButton);
      expect(screen.getByText('Password must not exceed 128 characters')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful login', async () => {
      const mockAdminData = createMockAdminUser();
      (adminAuthService.login as jest.Mock).mockResolvedValue(
        createMockResponse({
          success: true,
          data: {
            accessToken: 'test-token',
            expiresIn: 3600,
            admin: mockAdminData,
            sessionId: 'session-123',
            requires2FA: false,
          },
        })
      );

      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
      const submitButton = screen.getByText('Sign In to Admin Panel');

      await user.type(emailInput, 'admin@datifyy.com');
      await user.type(passwordInput, 'password123');
      await user.click(rememberMeCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(adminAuthService.login).toHaveBeenCalledWith(
          'admin@datifyy.com',
          'password123',
          true
        );
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Login Successful',
            status: 'success',
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD, { replace: true });
      });
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      (adminAuthService.login as jest.Mock).mockResolvedValue(
        createMockError(401, errorMessage)
      );

      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      await user.type(emailInput, 'admin@datifyy.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Login Failed',
            status: 'error',
          })
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('should handle network errors', async () => {
      (adminAuthService.login as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      await user.type(emailInput, 'admin@datifyy.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Login Error',
            status: 'error',
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      (adminAuthService.login as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(createMockResponse({})), 100))
      );

      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      await user.type(emailInput, 'admin@datifyy.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(screen.getByText('Signing In...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText('Signing In...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      render(<AdminLoginPage />);

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByLabelText('Show password');

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to forgot password page', async () => {
      render(<AdminLoginPage />);

      const forgotPasswordLink = screen.getByText('Forgot your password?');
      expect(forgotPasswordLink).toHaveAttribute('href', ROUTES.ADMIN_FORGOT_PASSWORD);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and ARIA attributes', () => {
      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toBeRequired();
    });

    it('should be keyboard navigable', async () => {
      render(<AdminLoginPage />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const rememberMeCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByText('Sign In to Admin Panel');

      // Tab through form elements
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Show password')).toHaveFocus();

      await user.tab();
      expect(rememberMeCheckbox).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});