// apps/frontend/src/mvp/admin-v2/types/admin.types.ts
/**
 * Admin module TypeScript interfaces
 * Centralized type definitions for admin functionality
 */

/**
 * Admin login form data interface
 */
export interface AdminLoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Admin login form errors interface
 */
export interface AdminLoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

/**
 * Admin user interface for components
 */
export interface AdminUser {
  id: number;
  email: string;
  permissionLevel: 'viewer' | 'moderator' | 'admin' | 'super_admin' | 'owner';
  accountStatus: 'active' | 'suspended' | 'deactivated' | 'pending' | 'locked';
  isActive: boolean;
  lastLoginAt: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin dashboard stats interface
 */
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  recentSignups: number;
  revenueThisMonth: number;
  pendingReports: number;
}

/**
 * Admin permission check interface
 */
export interface AdminPermissionCheck {
  hasPermission: boolean;
  requiredLevel: string;
  currentLevel: string;
  reason?: string;
}

// ========================================
