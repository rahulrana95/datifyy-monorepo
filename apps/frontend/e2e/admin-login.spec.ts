// apps/frontend/e2e/admin-login.spec.ts

import { test, expect } from '@playwright/test';
import { ROUTES, ADMIN_LOGIN, FORM_LABELS, PLACEHOLDERS } from '../src/constants';

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login page
    await page.goto(ROUTES.ADMIN_LOGIN);
  });

  test('should display login page with all elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Datifyy/);
    
    // Check header elements
    await expect(page.getByText(ADMIN_LOGIN.TITLE)).toBeVisible();
    await expect(page.getByText(ADMIN_LOGIN.SUBTITLE)).toBeVisible();
    await expect(page.getByText(ADMIN_LOGIN.SECURITY_BADGE)).toBeVisible();
    
    // Check form elements
    await expect(page.getByLabel(FORM_LABELS.EMAIL)).toBeVisible();
    await expect(page.getByLabel(FORM_LABELS.PASSWORD)).toBeVisible();
    await expect(page.getByPlaceholder(PLACEHOLDERS.ADMIN_EMAIL)).toBeVisible();
    await expect(page.getByPlaceholder(PLACEHOLDERS.PASSWORD)).toBeVisible();
    
    // Check other elements
    await expect(page.getByText(ADMIN_LOGIN.REMEMBER_ME_TEXT)).toBeVisible();
    await expect(page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE)).toBeVisible();
    await expect(page.getByText(ADMIN_LOGIN.FORGOT_PASSWORD_TEXT)).toBeVisible();
    await expect(page.getByText(ADMIN_LOGIN.SECURITY_NOTE)).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Click submit without filling form
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel(FORM_LABELS.EMAIL).fill('invalid-email');
    await page.getByLabel(FORM_LABELS.PASSWORD).fill('password123');
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check validation error
    await expect(page.getByText('Please provide a valid email address')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    // Enter short password
    await page.getByLabel(FORM_LABELS.EMAIL).fill('admin@datifyy.com');
    await page.getByLabel(FORM_LABELS.PASSWORD).fill('short');
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check validation error
    await expect(page.getByText('Password must be at least 8 characters long')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(FORM_LABELS.PASSWORD);
    const toggleButton = page.getByLabel('Show password');
    
    // Check initial state
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(page.getByLabel('Hide password')).toBeVisible();
    
    // Toggle back to hide password
    await page.getByLabel('Hide password').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle successful login', async ({ page, context }) => {
    // Mock the API response
    await context.route('**/api/v1/admin/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            accessToken: 'mock-token-123',
            expiresIn: 3600,
            admin: {
              id: 1,
              email: 'admin@datifyy.com',
              permissionLevel: 'ADMIN',
              accountStatus: 'active',
              isActive: true,
              lastLoginAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
              loginCount: 1,
              twoFactorMethods: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            sessionId: 'session-123',
            requires2FA: false,
          }
        })
      });
    });

    // Fill and submit form
    await page.getByLabel(FORM_LABELS.EMAIL).fill('admin@datifyy.com');
    await page.getByLabel(FORM_LABELS.PASSWORD).fill('admin123');
    await page.getByRole('checkbox').check(); // Remember me
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check for success toast
    await expect(page.getByText('Login Successful')).toBeVisible();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(ROUTES.ADMIN_DASHBOARD);
    
    // Check cookie is set
    const cookies = await context.cookies();
    const tokenCookie = cookies.find(c => c.name === 'token');
    expect(tokenCookie).toBeTruthy();
    expect(tokenCookie?.value).toBe('mock-token-123');
  });

  test('should handle login failure', async ({ page, context }) => {
    // Mock the API response for failure
    await context.route('**/api/v1/admin/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials',
          error: { code: 401, message: 'Invalid email or password' }
        })
      });
    });

    // Fill and submit form
    await page.getByLabel(FORM_LABELS.EMAIL).fill('admin@datifyy.com');
    await page.getByLabel(FORM_LABELS.PASSWORD).fill('wrongpassword');
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check for error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    
    // Check for error toast
    await expect(page.getByText('Login Failed')).toBeVisible();
    
    // Should not redirect
    await expect(page).toHaveURL(ROUTES.ADMIN_LOGIN);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByText(ADMIN_LOGIN.FORGOT_PASSWORD_TEXT).click();
    await expect(page).toHaveURL(ROUTES.ADMIN_FORGOT_PASSWORD);
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Mock network failure
    await context.route('**/api/v1/admin/auth/login', async route => {
      await route.abort('failed');
    });

    // Fill and submit form
    await page.getByLabel(FORM_LABELS.EMAIL).fill('admin@datifyy.com');
    await page.getByLabel(FORM_LABELS.PASSWORD).fill('admin123');
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check for error message
    await expect(page.getByText('An unexpected error occurred. Please try again.')).toBeVisible();
  });

  test('should persist form data on validation error', async ({ page }) => {
    const email = 'admin@datifyy.com';
    
    // Fill email but not password
    await page.getByLabel(FORM_LABELS.EMAIL).fill(email);
    await page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE).click();
    
    // Check email is still there after validation error
    await expect(page.getByLabel(FORM_LABELS.EMAIL)).toHaveValue(email);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Focus email
    await expect(page.getByLabel(FORM_LABELS.EMAIL)).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus password
    await expect(page.getByLabel(FORM_LABELS.PASSWORD)).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus toggle password
    await expect(page.getByLabel('Show password')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus remember me
    await expect(page.getByRole('checkbox')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Focus submit button
    await expect(page.getByText(ADMIN_LOGIN.SIGN_IN_TITLE)).toBeFocused();
  });

  test('should handle already authenticated users', async ({ page, context }) => {
    // Set authentication cookie
    await context.addCookies([{
      name: 'token',
      value: 'existing-token',
      domain: 'localhost',
      path: '/',
    }]);

    // Mock token verification
    await context.route('**/api/v1/auth/verify-token', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          valid: true
        })
      });
    });

    // Mock current user
    await context.route('**/api/v1/auth/current-user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          officialEmail: 'admin@datifyy.com',
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true,
        })
      });
    });

    // Navigate to login page
    await page.goto(ROUTES.ADMIN_LOGIN);
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(ROUTES.ADMIN_DASHBOARD);
  });
});