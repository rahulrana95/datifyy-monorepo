// apps/frontend/e2e/admin-dashboard.spec.ts

import { test, expect } from '@playwright/test';
import { ROUTES, NAV_ITEMS } from '../src/constants';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set authentication cookie
    await context.addCookies([{
      name: 'token',
      value: 'test-admin-token',
      domain: 'localhost',
      path: '/',
    }]);

    // Mock API responses
    await context.route('**/api/v1/auth/verify-token', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, valid: true })
      });
    });

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

    await context.route('**/api/v1/admin/dashboard/metrics', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalSignups: { value: 1234, change: 12.5, label: 'Total Signups', icon: 'users' },
            verifiedUsers: { value: 987, change: 8.3, label: 'Verified Users', icon: 'check' },
            activeUsersToday: { value: 456, change: -2.1, label: 'Active Today', icon: 'activity' },
            activeUsersThisWeek: { value: 2345, change: 15.7, label: 'Active This Week', icon: 'calendar' },
            revenueData: {
              totalRevenue: 125000,
              revenueByDateType: { online: 75000, offline: 50000 },
              monthlyData: [
                { month: 'Jan', revenue: 10000 },
                { month: 'Feb', revenue: 15000 },
                { month: 'Mar', revenue: 12000 },
                { month: 'Apr', revenue: 18000 },
                { month: 'May', revenue: 22000 },
                { month: 'Jun', revenue: 25000 },
              ],
            },
            topCities: [
              { city: 'Mumbai', users: 450 },
              { city: 'Delhi', users: 380 },
              { city: 'Bangalore', users: 320 },
              { city: 'Pune', users: 280 },
              { city: 'Chennai', users: 220 },
            ],
          }
        })
      });
    });

    // Navigate to dashboard
    await page.goto(ROUTES.ADMIN_DASHBOARD);
  });

  test('should display dashboard with all metrics', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Check metric cards
    await expect(page.getByText('Total Signups')).toBeVisible();
    await expect(page.getByText('1,234')).toBeVisible();
    await expect(page.getByText('+12.5%')).toBeVisible();

    await expect(page.getByText('Verified Users')).toBeVisible();
    await expect(page.getByText('987')).toBeVisible();
    await expect(page.getByText('+8.3%')).toBeVisible();

    await expect(page.getByText('Active Today')).toBeVisible();
    await expect(page.getByText('456')).toBeVisible();
    await expect(page.getByText('-2.1%')).toBeVisible();

    await expect(page.getByText('Active This Week')).toBeVisible();
    await expect(page.getByText('2,345')).toBeVisible();
    await expect(page.getByText('+15.7%')).toBeVisible();
  });

  test('should display revenue chart', async ({ page }) => {
    // Check revenue section
    await expect(page.getByText('Revenue Overview')).toBeVisible();
    await expect(page.getByText('₹1,25,000')).toBeVisible(); // Total revenue
    
    // Check revenue breakdown
    await expect(page.getByText('Online Dates')).toBeVisible();
    await expect(page.getByText('₹75,000')).toBeVisible();
    
    await expect(page.getByText('Offline Dates')).toBeVisible();
    await expect(page.getByText('₹50,000')).toBeVisible();

    // Check chart is rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should display top cities table', async ({ page }) => {
    // Check top cities section
    await expect(page.getByText('Top Cities by User Count')).toBeVisible();

    // Check table headers
    await expect(page.getByRole('columnheader', { name: 'City' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Users' })).toBeVisible();

    // Check table data
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'];
    for (const city of cities) {
      await expect(page.getByRole('cell', { name: city })).toBeVisible();
    }
  });

  test('should navigate using sidebar', async ({ page }) => {
    // Test navigation to different sections
    await page.getByText(NAV_ITEMS.USERS).click();
    await expect(page).toHaveURL(ROUTES.ADMIN_USERS);

    await page.getByText(NAV_ITEMS.CURATE_DATES).click();
    await expect(page).toHaveURL(ROUTES.ADMIN_CURATE_DATES);

    await page.getByText(NAV_ITEMS.DASHBOARD).click();
    await expect(page).toHaveURL(ROUTES.ADMIN_DASHBOARD);
  });

  test('should toggle sidebar', async ({ page }) => {
    const sidebar = page.getByRole('navigation');
    const toggleButton = page.getByLabel('Toggle sidebar');

    // Check initial expanded state
    await expect(sidebar).toHaveCSS('width', '280px');

    // Collapse sidebar
    await toggleButton.click();
    await expect(sidebar).toHaveCSS('width', '80px');

    // Expand sidebar
    await toggleButton.click();
    await expect(sidebar).toHaveCSS('width', '280px');
  });

  test('should refresh data', async ({ page }) => {
    let apiCallCount = 0;
    
    await page.route('**/api/v1/admin/dashboard/metrics', async route => {
      apiCallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalSignups: { 
              value: apiCallCount === 1 ? 1234 : 1250, 
              change: 12.5, 
              label: 'Total Signups', 
              icon: 'users' 
            },
            // ... other metrics
          }
        })
      });
    });

    // Initial load shows 1234
    await expect(page.getByText('1,234')).toBeVisible();

    // Click refresh button
    await page.getByLabel('Refresh data').click();

    // Updated value should be shown
    await expect(page.getByText('1,250')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page, context }) => {
    // Override the metrics route to return error
    await context.route('**/api/v1/admin/dashboard/metrics', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 500, message: 'Internal server error' }
        })
      });
    });

    // Reload page
    await page.reload();

    // Should show error state
    await expect(page.getByText('Failed to load dashboard metrics')).toBeVisible();
    await expect(page.getByText('Try Again')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Sidebar should be collapsed on mobile
    const sidebar = page.getByRole('navigation');
    await expect(sidebar).toHaveCSS('width', '80px');

    // Metric cards should stack vertically
    const metricCards = page.locator('[data-testid="metric-card"]');
    const firstCard = metricCards.first();
    const secondCard = metricCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    // Second card should be below first card (Y position greater)
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height);

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Metric cards should be in a row
    const firstBoxDesktop = await firstCard.boundingBox();
    const secondBoxDesktop = await secondCard.boundingBox();
    
    // Cards should be on same row (similar Y position)
    expect(Math.abs(secondBoxDesktop!.y - firstBoxDesktop!.y)).toBeLessThan(10);
  });

  test('should show user menu and logout', async ({ page, context }) => {
    // Click user avatar
    await page.getByText('AU').click(); // Admin User initials

    // Check menu items
    await expect(page.getByText('Admin User')).toBeVisible();
    await expect(page.getByText('admin@datifyy.com')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();

    // Mock logout endpoint
    await context.route('**/api/v1/admin/auth/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Click logout
    await page.getByText('Logout').click();

    // Should redirect to login
    await expect(page).toHaveURL(ROUTES.ADMIN_LOGIN);
    
    // Check cookie is cleared
    const cookies = await context.cookies();
    const tokenCookie = cookies.find(c => c.name === 'token');
    expect(tokenCookie).toBeUndefined();
  });

  test('should display real-time notifications', async ({ page }) => {
    // Click notifications icon
    await page.getByLabel('View notifications').click();

    // Check notification dropdown
    await expect(page.getByText('Notifications')).toBeVisible();
    await expect(page.getByText('New user registration spike')).toBeVisible();
    await expect(page.getByText('25 new users registered in the last hour')).toBeVisible();
    await expect(page.getByText('5 minutes ago')).toBeVisible();

    // Mark as read
    await page.getByText('Mark all as read').click();
    
    // Notification badge should disappear
    await expect(page.getByTestId('notification-badge')).not.toBeVisible();
  });
});