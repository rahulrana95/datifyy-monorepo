// apps/frontend/src/mvp/admin-v2/index.ts
/**
 * Admin V2 Module Barrel Export
 * Centralized exports for admin functionality
 */

// Components
export { default as AdminLoginPage } from './login/AdminLoginPage';
export { default as AdminPrivateRoute } from './components/AdminPrivateRoute';

// Store
export { 
  useAdminAuthStore, 
  useAdminAuthActions, 
  useAdminAuthState,
  adminAuthSelectors 
} from './login/store/adminAuthStore';

// Types
export type { AdminLoginFormData, AdminLoginFormErrors } from './types/admin.types';
