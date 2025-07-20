// apps/frontend/src/test-utils/mock-services.ts

import { ServiceResponse } from '../service/ErrorTypes';

// Mock admin auth service
export const mockAdminAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
  getCurrentAdmin: jest.fn(),
};

// Mock auth service
export const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  verifyToken: jest.fn(),
  getCurrentUser: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
};

// Mock API service
export const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  clearToken: jest.fn(),
  setTokenFromCookies: jest.fn(),
  getTokenFromCookies: jest.fn(),
};

// Mock cookie service
export const mockCookieService = {
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn(),
  hasCookie: jest.fn(),
  clearAuthCookies: jest.fn(),
};

// Helper to create mock service responses
export const createMockResponse = <T>(data: T): ServiceResponse<T> => ({
  response: data,
  error: undefined,
});

export const createMockError = (code: number, message: string): ServiceResponse<any> => ({
  response: undefined,
  error: { code, message },
});

// Mock data generators
export const generateMockDashboardMetrics = () => ({
  totalSignups: {
    value: 1234,
    change: 12.5,
    label: 'Total Signups',
    icon: 'users',
  },
  verifiedUsers: {
    value: 987,
    change: 8.3,
    label: 'Verified Users',
    icon: 'check',
  },
  activeUsersToday: {
    value: 456,
    change: -2.1,
    label: 'Active Today',
    icon: 'activity',
  },
  activeUsersThisWeek: {
    value: 2345,
    change: 15.7,
    label: 'Active This Week',
    icon: 'calendar',
  },
});

export const generateMockUser = (id: number) => ({
  id,
  firstName: `User${id}`,
  lastName: 'Test',
  email: `user${id}@example.com`,
  phone: '9876543210',
  dateOfBirth: '1995-01-01',
  gender: 'male',
  userType: 'working_professional',
  isVerified: id % 2 === 0,
  loveTokens: 100,
  photos: [],
  preferences: {
    ageRange: { min: 21, max: 30 },
    location: 'Mumbai',
    interests: ['travel', 'music'],
  },
});

export const generateMockDate = (id: number) => ({
  id: `date-${id}`,
  user1: generateMockUser(id * 2),
  user2: generateMockUser(id * 2 + 1),
  scheduledAt: new Date(Date.now() + id * 24 * 60 * 60 * 1000).toISOString(),
  status: ['scheduled', 'ongoing', 'completed', 'cancelled'][id % 4],
  type: id % 2 === 0 ? 'online' : 'offline',
  location: id % 2 === 1 ? 'Starbucks, Bandra' : undefined,
  meetingLink: id % 2 === 0 ? 'https://meet.google.com/abc-defg-hij' : undefined,
});