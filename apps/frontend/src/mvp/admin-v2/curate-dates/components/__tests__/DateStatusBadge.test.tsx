// apps/frontend/src/mvp/admin-v2/curate-dates/components/__tests__/DateStatusBadge.test.tsx

import React from 'react';
import { render, screen } from '../../../../../test-utils/test-utils';
import DateStatusBadge from '../DateStatusBadge';
import { DateStatus, STATUS_COLORS } from '../../../../../constants';

describe('DateStatusBadge', () => {
  describe('Rendering', () => {
    it('should render scheduled status correctly', () => {
      render(<DateStatusBadge status={DateStatus.SCHEDULED} />);
      
      const badge = screen.getByText('Scheduled');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining(STATUS_COLORS[DateStatus.SCHEDULED]),
      });
    });

    it('should render ongoing status correctly', () => {
      render(<DateStatusBadge status={DateStatus.ONGOING} />);
      
      const badge = screen.getByText('Ongoing');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining(STATUS_COLORS[DateStatus.ONGOING]),
      });
    });

    it('should render completed status correctly', () => {
      render(<DateStatusBadge status={DateStatus.COMPLETED} />);
      
      const badge = screen.getByText('Completed');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining(STATUS_COLORS[DateStatus.COMPLETED]),
      });
    });

    it('should render cancelled status correctly', () => {
      render(<DateStatusBadge status={DateStatus.CANCELLED} />);
      
      const badge = screen.getByText('Cancelled');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining(STATUS_COLORS[DateStatus.CANCELLED]),
      });
    });

    it('should render no_show status correctly', () => {
      render(<DateStatusBadge status={DateStatus.NO_SHOW} />);
      
      const badge = screen.getByText('No Show');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining(STATUS_COLORS[DateStatus.NO_SHOW]),
      });
    });
  });

  describe('Status text formatting', () => {
    it('should capitalize status text correctly', () => {
      render(<DateStatusBadge status={DateStatus.SCHEDULED} />);
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
    });

    it('should handle underscore in status text', () => {
      render(<DateStatusBadge status={DateStatus.NO_SHOW} />);
      expect(screen.getByText('No Show')).toBeInTheDocument();
    });
  });

  describe('Visual properties', () => {
    it('should have correct badge styling', () => {
      render(<DateStatusBadge status={DateStatus.SCHEDULED} />);
      
      const badge = screen.getByText('Scheduled');
      expect(badge).toHaveClass('chakra-badge');
      expect(badge).toHaveStyle({
        textTransform: 'capitalize',
        fontSize: 'xs',
      });
    });

    it('should render with correct color scheme', () => {
      const testCases = [
        { status: DateStatus.SCHEDULED, colorScheme: 'blue' },
        { status: DateStatus.ONGOING, colorScheme: 'yellow' },
        { status: DateStatus.COMPLETED, colorScheme: 'green' },
        { status: DateStatus.CANCELLED, colorScheme: 'red' },
        { status: DateStatus.NO_SHOW, colorScheme: 'gray' },
      ];

      testCases.forEach(({ status, colorScheme }) => {
        const { container } = render(<DateStatusBadge status={status} />);
        const badge = container.querySelector('.chakra-badge');
        expect(badge).toHaveClass(`chakra-badge--${colorScheme}`);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid status gracefully', () => {
      // @ts-ignore - Testing invalid input
      render(<DateStatusBadge status="invalid_status" />);
      
      const badge = screen.getByText('Invalid Status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundColor: expect.stringContaining('gray'),
      });
    });

    it('should handle undefined status', () => {
      // @ts-ignore - Testing undefined input
      render(<DateStatusBadge status={undefined} />);
      
      const badge = screen.getByText('Unknown');
      expect(badge).toBeInTheDocument();
    });

    it('should handle null status', () => {
      // @ts-ignore - Testing null input
      render(<DateStatusBadge status={null} />);
      
      const badge = screen.getByText('Unknown');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<DateStatusBadge status={DateStatus.SCHEDULED} />);
      
      const badge = screen.getByText('Scheduled');
      expect(badge).toHaveAttribute('role', 'status');
      expect(badge).toHaveAttribute('aria-label', 'Date status: Scheduled');
    });

    it('should be screen reader friendly', () => {
      const { container } = render(<DateStatusBadge status={DateStatus.ONGOING} />);
      
      const srText = container.querySelector('.sr-only');
      expect(srText).toHaveTextContent('Current date status is Ongoing');
    });
  });

  describe('Component props', () => {
    it('should accept additional className', () => {
      render(<DateStatusBadge status={DateStatus.SCHEDULED} className="custom-class" />);
      
      const badge = screen.getByText('Scheduled');
      expect(badge).toHaveClass('custom-class');
    });

    it('should accept additional props', () => {
      render(
        <DateStatusBadge 
          status={DateStatus.SCHEDULED} 
          data-testid="custom-badge"
          onClick={() => {}}
        />
      );
      
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly for all status types', () => {
      const startTime = performance.now();
      
      Object.values(DateStatus).forEach(status => {
        const { unmount } = render(<DateStatusBadge status={status} />);
        unmount();
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should render all badges in less than 100ms
      expect(totalTime).toBeLessThan(100);
    });
  });
});