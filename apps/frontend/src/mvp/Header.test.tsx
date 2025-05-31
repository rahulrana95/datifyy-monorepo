import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Header from './Header';

// Mock zustand store if Header uses it
jest.mock('../stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isLoggedIn: false,
    user: null,
    logout: jest.fn(),
  })),
}));

jest.mock('../stores/userStore', () => ({
  useUserStore: jest.fn(() => ({
    user: null,
    profilePicture: null,
    hasFetchedUserDetails: false,
    fetchUserDetails: jest.fn(),
    clearUser: jest.fn(),
  })),
}));


describe('Header Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });
});
