// apps/frontend/src/utils/__tests__/format.utils.test.ts

import {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatPhoneNumber,
  formatFileSize,
  formatPercentage,
  formatCompactNumber,
  truncateText,
  formatName,
  formatDuration,
  getInitials,
} from '../format.utils';

// Mock date-fns to have consistent test results
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}));

describe('format.utils', () => {
  describe('formatCurrency', () => {
    it('should format currency in Indian Rupees', () => {
      expect(formatCurrency(1234)).toBe('₹1,234');
      expect(formatCurrency(1234567)).toBe('₹12,34,567');
      expect(formatCurrency(0)).toBe('₹0');
      expect(formatCurrency(99.99)).toBe('₹99.99');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-1234)).toBe('₹-1,234');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000000)).toBe('₹1,00,00,00,000');
    });
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      expect(formatDate(date)).toMatch(/15 Jan 2024/);
    });

    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toMatch(/15 Jan 2024/);
    });

    it('should use custom format string', () => {
      const date = '2024-01-15T10:30:00Z';
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = '2024-01-15T14:30:00Z';
      expect(formatTime(date)).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      expect(formatTime(date)).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const date = '2024-01-15T14:30:00Z';
      expect(formatDateTime(date)).toMatch(/15 Jan 2024, \d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time', () => {
      const date = new Date();
      expect(formatRelativeTime(date)).toBe('2 hours ago');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone numbers', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('1234567890')).toBe('+91 12345 67890');
    });

    it('should handle numbers with non-digit characters', () => {
      expect(formatPhoneNumber('(987) 654-3210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('+91-9876543210')).toBe('+91 98765 43210');
    });

    it('should return original for invalid lengths', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('12345678901')).toBe('12345678901');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle large file sizes', () => {
      expect(formatFileSize(5242880)).toBe('5 MB');
      expect(formatFileSize(10737418240)).toBe('10 GB');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages with default decimal', () => {
      expect(formatPercentage(50)).toBe('50.0%');
      expect(formatPercentage(33.333)).toBe('33.3%');
      expect(formatPercentage(100)).toBe('100.0%');
    });

    it('should format with custom decimals', () => {
      expect(formatPercentage(33.333, 2)).toBe('33.33%');
      expect(formatPercentage(33.333, 0)).toBe('33%');
      expect(formatPercentage(33.333, 3)).toBe('33.333%');
    });

    it('should handle negative percentages', () => {
      expect(formatPercentage(-10.5)).toBe('-10.5%');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format numbers with K suffix', () => {
      expect(formatCompactNumber(1000)).toBe('1.0K');
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(999999)).toBe('1000.0K');
    });

    it('should format numbers with M suffix', () => {
      expect(formatCompactNumber(1000000)).toBe('1.0M');
      expect(formatCompactNumber(2500000)).toBe('2.5M');
      expect(formatCompactNumber(1234567)).toBe('1.2M');
    });

    it('should return string for small numbers', () => {
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(999)).toBe('999');
      expect(formatCompactNumber(123)).toBe('123');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exact length text';
      expect(truncateText(text, text.length)).toBe(text);
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('formatName', () => {
    it('should capitalize first letter of each word', () => {
      expect(formatName('john doe')).toBe('John Doe');
      expect(formatName('JANE SMITH')).toBe('Jane Smith');
      expect(formatName('mary-jane watson')).toBe('Mary-jane Watson');
    });

    it('should handle single names', () => {
      expect(formatName('john')).toBe('John');
      expect(formatName('JOHN')).toBe('John');
    });

    it('should handle empty string', () => {
      expect(formatName('')).toBe('');
    });

    it('should handle names with multiple spaces', () => {
      expect(formatName('john   doe')).toBe('John   Doe');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(45)).toBe('45s');
      expect(formatDuration(0)).toBe('0s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1m 30s');
      expect(formatDuration(125)).toBe('2m 5s');
    });

    it('should format hours, minutes and seconds', () => {
      expect(formatDuration(3665)).toBe('1h 1m 5s');
      expect(formatDuration(7200)).toBe('2h');
      expect(formatDuration(3600)).toBe('1h');
    });

    it('should handle large durations', () => {
      expect(formatDuration(86400)).toBe('24h');
      expect(formatDuration(90061)).toBe('25h 1m 1s');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Mary Smith')).toBe('JM');
      expect(getInitials('A B C D')).toBe('AB');
    });

    it('should handle single names', () => {
      expect(getInitials('John')).toBe('J');
      expect(getInitials('J')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle names with extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('should handle lowercase names', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });
});