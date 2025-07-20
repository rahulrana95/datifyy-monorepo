// apps/frontend/src/mvp/admin-v2/admin-home/components/__tests__/MetricCard.test.tsx

import React from 'react';
import { render, screen } from '../../../../../test-utils/test-utils';
import MetricCard from '../MetricCard';
import { MetricData } from '../../types';
import { FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

describe('MetricCard', () => {
  const mockMetric: MetricData = {
    value: 1234,
    changePercent: 12.5,
    label: 'Total Users',
    icon: 'FiUsers',
    trend: 'up' as const,
  };

  describe('Rendering', () => {
    it('should render metric data correctly', () => {
      render(<MetricCard metric={mockMetric} />);

      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
      render(<MetricCard metric={null} isLoading={true} />);

      // Check for skeleton loaders
      const skeletons = screen.getAllByTestId(/skeleton/i);
      expect(skeletons).toHaveLength(3);
    });

    it('should render null metric with loading appearance', () => {
      render(<MetricCard metric={null} />);

      // Should show skeleton loaders when metric is null
      const skeletons = screen.getAllByTestId(/skeleton/i);
      expect(skeletons).toHaveLength(3);
    });

    it('should handle zero values correctly', () => {
      const zeroMetric: MetricData = {
        value: 0,
        changePercent: 0,
        label: 'New Signups',
        icon: 'FiUsers',
        trend: 'neutral' as const,
      };

      render(<MetricCard metric={zeroMetric} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('New Signups')).toBeInTheDocument();
    });
  });

  describe('Change Indicators', () => {
    it('should show positive change with up arrow and green color', () => {
      render(<MetricCard metric={mockMetric} />);

      const changeText = screen.getByText('+12.5%');
      expect(changeText).toHaveStyle({ color: 'green.500' });
      
      // Check for trending up icon
      const trendIcon = screen.getByTestId('trend-icon');
      expect(trendIcon).toHaveClass('trending-up');
    });

    it('should show negative change with down arrow and red color', () => {
      const negativeMetric: MetricData = {
        ...mockMetric,
        changePercent: -8.3,
        trend: 'down' as const,
      };

      render(<MetricCard metric={negativeMetric} />);

      const changeText = screen.getByText('-8.3%');
      expect(changeText).toHaveStyle({ color: 'red.500' });
      
      // Check for trending down icon
      const trendIcon = screen.getByTestId('trend-icon');
      expect(trendIcon).toHaveClass('trending-down');
    });

    it('should show zero change with neutral color', () => {
      const zeroChangeMetric: MetricData = {
        ...mockMetric,
        changePercent: 0,
        trend: 'neutral' as const,
      };

      render(<MetricCard metric={zeroChangeMetric} />);

      const changeText = screen.getByText('0%');
      expect(changeText).toHaveStyle({ color: 'gray.500' });
    });
  });

  describe('Number Formatting', () => {
    it('should format large numbers with commas', () => {
      const largeNumberMetric: MetricData = {
        ...mockMetric,
        value: 1234567,
      };

      render(<MetricCard metric={largeNumberMetric} />);

      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const decimalMetric: MetricData = {
        ...mockMetric,
        value: 1234.56,
        changePercent: 12.567,
      };

      render(<MetricCard metric={decimalMetric} />);

      expect(screen.getByText('1,234.56')).toBeInTheDocument();
      expect(screen.getByText('+12.6%')).toBeInTheDocument(); // Should round to 1 decimal
    });
  });

  describe('Icons', () => {
    it('should render correct icon based on icon property', () => {
      const iconTestCases = [
        { icon: 'users', expectedIcon: 'users-icon' },
        { icon: 'check', expectedIcon: 'check-icon' },
        { icon: 'activity', expectedIcon: 'activity-icon' },
        { icon: 'calendar', expectedIcon: 'calendar-icon' },
      ];

      iconTestCases.forEach(({ icon, expectedIcon }) => {
        const { rerender } = render(
          <MetricCard metric={{ ...mockMetric, icon }} />
        );

        expect(screen.getByTestId(expectedIcon)).toBeInTheDocument();
        rerender(<></>);
      });
    });

    it('should render default icon for unknown icon type', () => {
      const unknownIconMetric: MetricData = {
        ...mockMetric,
        icon: 'unknown' as any,
      };

      render(<MetricCard metric={unknownIconMetric} />);

      expect(screen.getByTestId('default-icon')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply hover effects', () => {
      render(<MetricCard metric={mockMetric} />);

      const card = screen.getByTestId('metric-card');
      expect(card).toHaveStyle({
        transition: 'all 0.2s',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined change value', () => {
      const noChangeMetric: MetricData = {
        ...mockMetric,
        changePercent: undefined,
      };

      render(<MetricCard metric={noChangeMetric} />);

      // Should not show change indicator if change is undefined
      expect(screen.queryByTestId('trend-icon')).not.toBeInTheDocument();
    });

    it('should handle very large percentage changes', () => {
      const largeChangeMetric: MetricData = {
        ...mockMetric,
        changePercent: 999.99,
      };

      render(<MetricCard metric={largeChangeMetric} />);

      expect(screen.getByText('+1000.0%')).toBeInTheDocument();
    });

    it('should handle NaN values gracefully', () => {
      const nanMetric: MetricData = {
        ...mockMetric,
        value: NaN,
        changePercent: NaN,
      };

      render(<MetricCard metric={nanMetric} />);

      expect(screen.getByText('--')).toBeInTheDocument();
      expect(screen.queryByTestId('trend-icon')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<MetricCard metric={mockMetric} />);

      const card = screen.getByTestId('metric-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-label', `${mockMetric.label} metric`);
    });

    it('should have descriptive text for screen readers', () => {
      render(<MetricCard metric={mockMetric} />);

      // Check for screen reader text
      expect(screen.getByText(`${mockMetric.label}: ${mockMetric.value}, change: +${mockMetric.changePercent}%`))
        .toHaveClass('sr-only');
    });
  });
});