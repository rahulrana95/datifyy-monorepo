// apps/frontend/src/mvp/admin-v2/components/__tests__/AdminSidebar.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils/test-utils';
import AdminSidebar from '../AdminSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, NAV_ITEMS } from '../../../../constants';

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('AdminSidebar', () => {
  const mockNavigate = jest.fn();
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: ROUTES.ADMIN_DASHBOARD });
  });

  describe('Rendering', () => {
    it('should render all navigation items', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      // Check logo
      expect(screen.getByText('Datifyy Admin')).toBeInTheDocument();

      // Check all navigation items
      expect(screen.getByText(NAV_ITEMS.DASHBOARD)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.USERS)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.CURATE_DATES)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.GENIE)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.VERIFICATION)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.REVENUE)).toBeInTheDocument();
      expect(screen.getByText(NAV_ITEMS.SETTINGS)).toBeInTheDocument();
    });

    it('should show correct icons for each nav item', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      // Check for icon test ids
      expect(screen.getByTestId('icon-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('icon-users')).toBeInTheDocument();
      expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();
      expect(screen.getByTestId('icon-magic')).toBeInTheDocument();
      expect(screen.getByTestId('icon-shield')).toBeInTheDocument();
      expect(screen.getByTestId('icon-trending-up')).toBeInTheDocument();
      expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    });

    it('should render in collapsed state when isOpen is false', () => {
      render(<AdminSidebar isOpen={false} onToggle={mockOnToggle} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveStyle({ width: '80px' });
      
      // Labels should be hidden
      expect(screen.queryByText(NAV_ITEMS.DASHBOARD)).not.toBeVisible();
    });

    it('should render in expanded state when isOpen is true', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      const sidebar = screen.getByRole('navigation');
      expect(sidebar).toHaveStyle({ width: '280px' });
      
      // Labels should be visible
      expect(screen.getByText(NAV_ITEMS.DASHBOARD)).toBeVisible();
    });
  });

  describe('Navigation', () => {
    it('should navigate to correct route when nav item is clicked', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      // Test each navigation item
      const navItems = [
        { label: NAV_ITEMS.DASHBOARD, route: ROUTES.ADMIN_DASHBOARD },
        { label: NAV_ITEMS.USERS, route: ROUTES.ADMIN_USERS },
        { label: NAV_ITEMS.CURATE_DATES, route: ROUTES.ADMIN_CURATE_DATES },
        { label: NAV_ITEMS.GENIE, route: ROUTES.ADMIN_GENIE },
        { label: NAV_ITEMS.VERIFICATION, route: ROUTES.ADMIN_VERIFICATION },
        { label: NAV_ITEMS.REVENUE, route: ROUTES.ADMIN_REVENUE },
        { label: NAV_ITEMS.SETTINGS, route: ROUTES.ADMIN_SETTINGS },
      ];

      navItems.forEach(({ label, route }) => {
        fireEvent.click(screen.getByText(label));
        expect(mockNavigate).toHaveBeenCalledWith(route);
      });
    });

    it('should highlight active route', () => {
      (useLocation as jest.Mock).mockReturnValue({ pathname: ROUTES.ADMIN_USERS });
      
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      const usersNavItem = screen.getByText(NAV_ITEMS.USERS).closest('div');
      expect(usersNavItem).toHaveStyle({
        backgroundColor: expect.stringContaining('rgba'),
        borderLeftWidth: '4px',
      });
    });
  });

  describe('Toggle functionality', () => {
    it('should call onToggle when toggle button is clicked', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      const toggleButton = screen.getByLabelText('Toggle sidebar');
      fireEvent.click(toggleButton);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should show menu icon when expanded', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should show close icon when collapsed', () => {
      render(<AdminSidebar isOpen={false} onToggle={mockOnToggle} />);

      expect(screen.getByTestId('menu-open-icon')).toBeInTheDocument();
    });
  });

  describe('User section', () => {
    it('should display user information when expanded', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('admin@datifyy.com')).toBeInTheDocument();
    });

    it('should only show avatar when collapsed', () => {
      render(<AdminSidebar isOpen={false} onToggle={mockOnToggle} />);

      expect(screen.getByText('AU')).toBeInTheDocument(); // Avatar initials
      expect(screen.queryByText('Admin User')).not.toBeVisible();
      expect(screen.queryByText('admin@datifyy.com')).not.toBeVisible();
    });
  });

  describe('Responsive behavior', () => {
    it('should apply hover effects on nav items', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      const dashboardItem = screen.getByText(NAV_ITEMS.DASHBOARD).closest('div');
      
      fireEvent.mouseEnter(dashboardItem!);
      expect(dashboardItem).toHaveStyle({
        backgroundColor: expect.stringContaining('rgba'),
      });
    });

    it('should show tooltips when collapsed', () => {
      render(<AdminSidebar isOpen={false} onToggle={mockOnToggle} />);

      const dashboardIcon = screen.getByTestId('icon-dashboard');
      
      fireEvent.mouseEnter(dashboardIcon);
      
      // Tooltip should appear
      expect(screen.getByRole('tooltip')).toHaveTextContent(NAV_ITEMS.DASHBOARD);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Admin navigation');
      expect(screen.getByLabelText('Toggle sidebar')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      const firstNavItem = screen.getByText(NAV_ITEMS.DASHBOARD).closest('div');
      
      firstNavItem?.focus();
      expect(firstNavItem).toHaveFocus();

      // Simulate keyboard navigation
      fireEvent.keyDown(firstNavItem!, { key: 'Enter' });
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD);
    });

    it('should announce state changes to screen readers', () => {
      const { rerender } = render(<AdminSidebar isOpen={true} onToggle={mockOnToggle} />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-expanded', 'true');

      rerender(<AdminSidebar isOpen={false} onToggle={mockOnToggle} />);
      
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-expanded', 'false');
    });
  });
});