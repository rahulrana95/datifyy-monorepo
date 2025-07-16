/**
 * Admin Auth Middleware - JWT Validation & Context
 *
 * Validates JWT tokens and injects admin context into requests.
 * Provides role-based access control and session management.
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { IAdminAuthService } from "../../modules/admin/services/IAdminAuthService";
import { Logger } from "../logging/Logger";
import { AuthenticationError, AuthorizationError } from "../errors/AppErrors";
import {
  AdminAccountStatus,
  AdminPermission,
  AdminPermissionLevel,
} from "../../proto-types";

/**
 * Enhanced request interface with admin context
 */
export interface AuthenticatedAdminRequest extends Request {
  admin: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    permissionLevel: AdminPermissionLevel;
    permissions: AdminPermission[];
    accountStatus: AdminAccountStatus;
    sessionId: string;
    isActive: boolean;
    lastActiveAt: Date;
    // Helper methods
    hasPermission: (permission: AdminPermission) => boolean;
    hasAnyPermission: (permissions: AdminPermission[]) => boolean;
    hasAllPermissions: (permissions: AdminPermission[]) => boolean;
    hasRoleLevel: (level: AdminPermissionLevel) => boolean;
  };
  requestId: string;
  requestStartTime: number;
}

/**
 * Admin authentication options
 */
interface AdminAuthOptions {
  /** Whether authentication is optional */
  optional?: boolean;
  /** Required permission level */
  requiredPermissionLevel?: AdminPermissionLevel;
  /** Required specific permissions (AND operation) */
  requiredPermissions?: AdminPermission[];
  /** Required any of these permissions (OR operation) */
  requiredAnyPermissions?: AdminPermission[];
  /** Custom permission check function */
  customPermissionCheck?: (
    admin: AuthenticatedAdminRequest["admin"]
  ) => boolean;
  /** Skip session validation */
  skipSessionValidation?: boolean;
  /** Allow inactive admins (for logout, profile update) */
  allowInactive?: boolean;
}

/**
 * Admin Authentication Middleware Factory
 *
 * Creates authentication middleware with configurable options for different
 * security requirements and permission levels.
 *
 * @param adminAuthService Admin authentication service
 * @param options Authentication configuration options
 * @returns Express middleware function
 */
export function adminAuthMiddleware(
  adminAuthService: IAdminAuthService,
  options: AdminAuthOptions = {}
) {
  const logger = Logger.getInstance();

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const startTime = Date.now();
    const requestId = (req as any).requestId || `auth_${Date.now()}`;

    try {
      logger.debug("Admin authentication middleware started", {
        requestId,
        path: req.path,
        method: req.method,
        options,
      });

      // Extract token from Authorization header or cookie
      const token = extractTokenFromRequest(req);

      // Handle optional authentication
      if (!token && options.optional) {
        logger.debug("No token provided for optional auth endpoint", {
          requestId,
        });
        return next();
      }

      // Require token for protected endpoints
      if (!token) {
        throw new AuthenticationError("Access token is required");
      }

      // Validate token and get admin context
      const validationResult = await adminAuthService.validateToken(token);

      if (!validationResult.isValid) {
        logger.warn("Invalid token provided", {
          requestId,
          reason: validationResult.invalidReason,
          path: req.path,
        });

        throw new AuthenticationError(
          validationResult.invalidReason || "Invalid or expired token"
        );
      }

      const { admin: adminProfile, sessionId } = validationResult;

      if (!adminProfile) {
        throw new AuthenticationError("Admin profile not found");
      }

      // Check admin account status
      if (!options.allowInactive && !adminProfile.isActive) {
        logger.warn("Inactive admin attempted access", {
          requestId,
          adminId: adminProfile.id,
          accountStatus: adminProfile.accountStatus,
        });

        throw new AuthenticationError("Admin account is not active");
      }

      if (
        adminProfile.accountStatus !== AdminAccountStatus.ADMIN_ACTIVE &&
        !options.allowInactive
      ) {
        logger.warn("Non-active admin attempted access", {
          requestId,
          adminId: adminProfile.id,
          accountStatus: adminProfile.accountStatus,
        });

        throw new AuthenticationError(
          `Admin account is ${adminProfile.accountStatus.toLowerCase()}`
        );
      }

      // Create admin context with helper methods
      const adminContext = createAdminContext(adminProfile, sessionId!);

      // Perform permission checks
      await performPermissionChecks(adminContext, options, logger, requestId);

      // Attach admin context to request
      (req as AuthenticatedAdminRequest).admin = adminContext;

      // Update admin activity (async, don't wait)
      adminAuthService.updateAdminActivity(adminProfile.id).catch((error) => {
        logger.error("Failed to update admin activity", {
          requestId,
          adminId: adminProfile.id,
          error,
        });
      });

      // Log successful authentication
      const authTime = Date.now() - startTime;
      logger.info("Admin authenticated successfully", {
        requestId,
        adminId: adminProfile.id,
        email: adminProfile.email,
        permissionLevel: adminProfile.permissionLevel,
        sessionId,
        authTime,
        path: req.path,
        method: req.method,
      });

      next();
    } catch (error: any) {
      const authTime = Date.now() - startTime;

      logger.error("Admin authentication failed", {
        requestId,
        error: error.message,
        authTime,
        path: req.path,
        method: req.method,
        ip: getClientIpAddress(req),
        userAgent: req.headers["user-agent"],
      });

      // Set authentication headers for client
      res.setHeader("WWW-Authenticate", 'Bearer realm="Admin API"');

      next(error);
    }
  };
}

/**
 * Permission-based middleware factory
 *
 * Creates middleware that requires specific permissions.
 * Shorthand for common permission requirements.
 */
export function requireAdminPermission(
  adminAuthService: IAdminAuthService,
  ...permissions: AdminPermission[]
) {
  return adminAuthMiddleware(adminAuthService, {
    requiredPermissions: permissions,
  });
}

/**
 * Role-based middleware factory
 *
 * Creates middleware that requires minimum permission level.
 */
export function requireAdminRole(
  adminAuthService: IAdminAuthService,
  minimumLevel: AdminPermissionLevel
) {
  return adminAuthMiddleware(adminAuthService, {
    requiredPermissionLevel: minimumLevel,
  });
}

/**
 * Super admin middleware factory
 *
 * Creates middleware that requires super admin privileges.
 */
export function requireSuperAdmin(adminAuthService: IAdminAuthService) {
  return adminAuthMiddleware(adminAuthService, {
    requiredPermissionLevel: AdminPermissionLevel.SUPER_ADMIN,
  });
}

/**
 * Owner-only middleware factory
 *
 * Creates middleware that requires owner privileges.
 */
export function requireOwner(adminAuthService: IAdminAuthService) {
  return adminAuthMiddleware(adminAuthService, {
    requiredPermissionLevel: AdminPermissionLevel.OWNER,
  });
}

/**
 * Optional admin authentication middleware
 *
 * Attaches admin context if token is provided, but doesn't require it.
 * Useful for endpoints that enhance functionality with admin context.
 */
export function optionalAdminAuth(adminAuthService: IAdminAuthService) {
  return adminAuthMiddleware(adminAuthService, {
    optional: true,
    allowInactive: true,
  });
}

/**
 * Helper Functions
 */

/**
 * Extract JWT token from request headers or cookies
 */
function extractTokenFromRequest(req: Request): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7); // Remove 'Bearer ' prefix
  }

  // Check custom header
  const customHeader = req.headers["authorization"] as string;
  if (customHeader) {
    return customHeader;
  }

  // Check cookie (fallback)
  const cookieToken = req.cookies?.admin_access_token;
  if (cookieToken) {
    return cookieToken;
  }

  // Check query parameter (for WebSocket or special cases)
  const queryToken = req.query.token as string;
  if (queryToken) {
    return queryToken;
  }

  return null;
}

/**
 * Create admin context with helper methods
 */
function createAdminContext(
  adminProfile: any,
  sessionId: string
): AuthenticatedAdminRequest["admin"] {
  return {
    id: adminProfile.id,
    email: adminProfile.email,
    firstName: adminProfile.firstName,
    lastName: adminProfile.lastName,
    fullName: adminProfile.fullName,
    permissionLevel: adminProfile.permissionLevel,
    permissions: adminProfile.permissions,
    accountStatus: adminProfile.accountStatus,
    sessionId,
    isActive: adminProfile.isActive,
    lastActiveAt: new Date(adminProfile.lastActiveAt),

    // Helper methods for permission checking
    hasPermission: (permission: AdminPermission): boolean => {
      return adminProfile.permissions.includes(permission);
    },

    hasAnyPermission: (permissions: AdminPermission[]): boolean => {
      return permissions.some((permission) =>
        adminProfile.permissions.includes(permission)
      );
    },

    hasAllPermissions: (permissions: AdminPermission[]): boolean => {
      return permissions.every((permission) =>
        adminProfile.permissions.includes(permission)
      );
    },

    hasRoleLevel: (level: AdminPermissionLevel): boolean => {
      const levelHierarchy = [
        AdminPermissionLevel.VIEWER,
        AdminPermissionLevel.MODERATOR,
        AdminPermissionLevel.ADMIN,
        AdminPermissionLevel.SUPER_ADMIN,
        AdminPermissionLevel.OWNER,
      ];

      const currentLevelIndex = levelHierarchy.indexOf(
        adminProfile.permissionLevel
      );
      const requiredLevelIndex = levelHierarchy.indexOf(level);

      return currentLevelIndex >= requiredLevelIndex;
    },
  };
}

/**
 * Perform permission checks based on options
 */
async function performPermissionChecks(
  adminContext: AuthenticatedAdminRequest["admin"],
  options: AdminAuthOptions,
  logger: Logger,
  requestId: string
): Promise<void> {
  // Check required permission level
  if (options.requiredPermissionLevel) {
    if (!adminContext.hasRoleLevel(options.requiredPermissionLevel)) {
      logger.warn("Admin lacks required permission level", {
        requestId,
        adminId: adminContext.id,
        currentLevel: adminContext.permissionLevel,
        requiredLevel: options.requiredPermissionLevel,
      });

      throw new AuthorizationError(
        `Minimum permission level required: ${options.requiredPermissionLevel}`
      );
    }
  }

  // Check required specific permissions (AND operation)
  if (options.requiredPermissions && options.requiredPermissions.length > 0) {
    if (!adminContext.hasAllPermissions(options.requiredPermissions)) {
      const missingPermissions = options.requiredPermissions.filter(
        (permission) => !adminContext.hasPermission(permission)
      );

      logger.warn("Admin lacks required permissions", {
        requestId,
        adminId: adminContext.id,
        requiredPermissions: options.requiredPermissions,
        missingPermissions,
      });

      throw new AuthorizationError(
        `Required permissions: ${missingPermissions.join(", ")}`
      );
    }
  }

  // Check required any permissions (OR operation)
  if (
    options.requiredAnyPermissions &&
    options.requiredAnyPermissions.length > 0
  ) {
    if (!adminContext.hasAnyPermission(options.requiredAnyPermissions)) {
      logger.warn("Admin lacks any required permissions", {
        requestId,
        adminId: adminContext.id,
        requiredAnyPermissions: options.requiredAnyPermissions,
      });

      throw new AuthorizationError(
        `At least one of these permissions required: ${options.requiredAnyPermissions.join(
          ", "
        )}`
      );
    }
  }

  // Custom permission check
  if (options.customPermissionCheck) {
    if (!options.customPermissionCheck(adminContext)) {
      logger.warn("Admin failed custom permission check", {
        requestId,
        adminId: adminContext.id,
      });

      throw new AuthorizationError("Access denied by custom permission check");
    }
  }
}

/**
 * Get client IP address from request
 */
function getClientIpAddress(req: Request): string {
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string) ||
    (req.headers["x-real-ip"] as string) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "127.0.0.1"
  );
}

/**
 * Admin context type guard
 */
export function isAuthenticatedAdminRequest(
  req: Request
): req is AuthenticatedAdminRequest {
  return (req as any).admin !== undefined;
}

/**
 * Extract admin ID from request (helper for controllers)
 */
export function getAdminIdFromRequest(req: Request): number | null {
  if (isAuthenticatedAdminRequest(req)) {
    return req.admin.id;
  }
  return null;
}

/**
 * Check if admin has permission (helper for controllers)
 */
export function checkAdminPermission(
  req: Request,
  permission: AdminPermission
): boolean {
  if (isAuthenticatedAdminRequest(req)) {
    return req.admin.hasPermission(permission);
  }
  return false;
}

/**
 * Middleware to log admin actions for audit trail
 */
export function auditAdminAction(actionType: string, description?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const logger = Logger.getInstance();

    if (isAuthenticatedAdminRequest(req)) {
      logger.info("Admin action audit", {
        actionType,
        description: description || `${req.method} ${req.path}`,
        adminId: req.admin.id,
        adminEmail: req.admin.email,
        sessionId: req.admin.sessionId,
        requestId: (req as any).requestId,
        ipAddress: getClientIpAddress(req),
        userAgent: req.headers["user-agent"],
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}
