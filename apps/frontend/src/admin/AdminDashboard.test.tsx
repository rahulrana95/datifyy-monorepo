import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

// Mock zustand stores that AdminDashboard might use
jest.mock('../stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isLoggedIn: true, // Assuming admin is logged in
    user: { role: 'admin' }, // Basic admin user
    logout: jest.fn(),
  })),
}));

jest.mock('../stores/userStore', () => ({
  useUserStore: jest.fn(() => ({
    user: { role: 'admin' },
    profilePicture: null,
    hasFetchedUserDetails: true,
    fetchUserDetails: jest.fn(),
    clearUser: jest.fn(),
  })),
}));

// Mock any child components that are complex or have their own dependencies
// For example, if AdminDashboard uses a <Header /> or <Sidebar /> component:
jest.mock('./Header', () => () => <div data-testid="mock-header">Mock Header</div>);
jest.mock('./Sidebar', () => () => <div data-testid="mock-sidebar">Mock Sidebar</div>);
// Add more mocks if other complex child components are identified

describe('AdminDashboard Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  });
});
