// apps/frontend/src/test-utils/test-utils.tsx

import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../theme';

// Create a custom render function that includes all providers
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  isAdmin: false,
  ...overrides,
});

export const createMockAdminUser = (overrides = {}) => ({
  id: '1',
  email: 'admin@datifyy.com',
  permissionLevel: 'ADMIN',
  accountStatus: 'active',
  isActive: true,
  twoFactorMethods: [],
  lastLoginAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
  loginCount: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message: string, code = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject({ code, message }), delay);
  });
};

// Wait utilities
export const waitForLoadingToFinish = () => 
  screen.findByText((content, element) => {
    return element?.tagName.toLowerCase() === 'div' && content.startsWith('Loading');
  }, {}, { timeout: 3000 }).then(() => {
    // Wait for loading to disappear
    return waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  }).catch(() => {
    // Loading might have finished before we could detect it
  });