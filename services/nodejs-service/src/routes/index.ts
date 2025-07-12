// src/routes/index.ts - Updated Main Routes Integration

import { Router } from "express";
import { DataSource } from "typeorm";
import { Logger } from "../infrastructure/logging/Logger";

// Import route modules
import { createAuthRoutes } from "./auth/authRoutes";
import { createUserProfileRoutes } from "./userProfile/userProfileRoutes";
import { createPartnerPreferencesRoutes } from "../modules/partnerPreferences/routes/partnerPreferencesRoutes";
import { createAdminAuthRoutes } from "../modules/admin/routes/AdminAuthRoutes";
import { createUserAvailabilityRoutes } from "../modules/userAvailability/routes/userAvailabilityRoutes";

// Import existing routes (keeping backward compatibility)
import allRoutes from "./allRoutes";
import { createImageUploadRoutes } from "../modules/imageUpload/routes/imageUploadRoutes";

/**
 * Main Application Routes Factory
 * Integrates all route modules following established patterns
 */
export function createAppRoutes(dataSource: DataSource): Router {
  const router = Router();
  const logger = Logger.getInstance();

  logger.info("🚀 Initializing Application Routes", {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });

  // Health check route (no auth required)
  router.get("/health", (req, res) => {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      database: "connected", // Could add actual DB health check here
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
        total:
          Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
      },
    };

    logger.info("Health check requested", {
      requestId: (req as any).id,
      uptime: healthData.uptime,
      memoryUsed: healthData.memory.used,
    });

    res.status(200).json(healthData);
  });

  // Authentication routes (following your existing auth patterns)
  router.use("/auth", createAuthRoutes(dataSource));
  logger.info("✅ Auth routes registered at /auth");

  // Admin Authentication routes (new enterprise admin system)
  router.use("/admin/auth", createAdminAuthRoutes(dataSource));
  logger.info("✅ Admin Auth routes registered at /admin/auth");

  // User Profile routes (new module following established patterns)
  router.use("/user-profile", createUserProfileRoutes(dataSource));
  logger.info("✅ User Profile routes registered at /user-profile");

  // User Availability routes (new module)
  router.use("/availability", createUserAvailabilityRoutes(dataSource));
  logger.info("✅ User Availability routes registered at /availability");

  // Add route registration in createAppRoutes function
  router.use("/images", createImageUploadRoutes(dataSource));

  // Add this in your createAppRoutes function
  // Partner Preferences routes (new advanced module)
  router.use(
    "/user/partner-preferences",
    createPartnerPreferencesRoutes(dataSource)
  );
  logger.info(
    "✅ Partner Preferences routes registered at /user/partner-preferences"
  );

  // Existing legacy routes (maintaining backward compatibility)
  // This includes all your existing functionality from allRoutes.ts
  router.use("/", allRoutes);
  logger.info(
    "✅ Legacy routes registered (backward compatibility maintained)"
  );

  // API documentation endpoint (helpful for development)
  router.get("/routes", (req, res) => {
    const availableRoutes = {
      admin: {
        "POST /admin/auth/login": "Admin login with 2FA support",
        "POST /admin/auth/2fa": "Complete 2FA verification",
        "POST /admin/auth/refresh": "Refresh admin access token",
        "POST /admin/auth/logout": "Admin logout and session termination",
        "GET /admin/auth/profile": "Get admin profile and permissions",
        "POST /admin/auth/change-password": "Change admin password",
        "GET /admin/auth/sessions": "Get active admin sessions",
        "GET /admin/auth/permissions": "Get admin permissions",
        "POST /admin/auth/validate-token": "Validate admin JWT token",
        "GET /admin/auth/health": "Admin auth service health check",
      },
      authentication: {
        "POST /auth/send-verification-code":
          "Send email verification code for signup",
        "POST /auth/signup": "Register new user account",
        "POST /auth/login": "Authenticate user and get token",
        "POST /auth/logout": "Clear authentication session",
        "POST /auth/verify-email": "Verify email with code",
        "POST /auth/forgot-password": "Send password reset code",
        "POST /auth/reset-password": "Reset password with code",
        "POST /auth/validate-token": "Validate JWT token",
      },
      userProfile: {
        "GET /user-profile": "Get authenticated user profile",
        "PUT /user-profile": "Update user profile",
        "DELETE /user-profile": "Soft delete user profile",
        "PATCH /user-profile/avatar": "Update profile image",
        "GET /user-profile/stats": "Get profile completion stats",
      },
      partnerPreferences: {
        "GET /user/partner-preferences": "Get partner preferences",
        "PUT /user/partner-preferences": "Update partner preferences",
        "POST /user/partner-preferences": "Create partner preferences",
        "DELETE /user/partner-preferences": "Delete partner preferences",
      },
      userAvailability: {
        "POST /availability": "Create availability slot",
        "POST /availability/bulk": "Create multiple slots",
        "GET /availability": "Get user availability (paginated)",
        "GET /availability/:id": "Get specific slot",
        "PUT /availability/:id": "Update slot",
        "POST /availability/:id/cancel": "Cancel slot",
        "DELETE /availability/:id": "Delete slot",
        "POST /availability/:id/cancel-recurring": "Cancel recurring slots",
        "GET /availability/search/users": "Search available users",
        "POST /availability/check-conflicts": "Check time conflicts",
        "GET /availability/analytics": "Get detailed analytics",
        "GET /availability/stats": "Get statistics summary",
        "GET /availability/calendar/:month": "Get calendar view",
        "GET /availability/suggestions": "Get AI suggestions",
        "POST /availability/book": "Book availability slot",
        "GET /availability/bookings": "Get user bookings",
        "GET /availability/incoming-bookings": "Get incoming bookings",
        "GET /availability/bookings/:id": "Get specific booking",
        "PUT /availability/bookings/:id": "Update booking",
        "POST /availability/bookings/:id/cancel": "Cancel booking",
        "POST /availability/bookings/:id/confirm": "Confirm booking",
        "POST /availability/bookings/:id/complete": "Complete booking",
        "GET /availability/health": "Availability service health check",
      },
      imageUpload: {
        "POST /images/upload": "Upload profile images",
        "GET /images/:id": "Get uploaded image",
        "DELETE /images/:id": "Delete uploaded image",
      },
      legacy: {
        "GET /enums": "Get database enums",
        "POST /events": "Create new event",
        "GET /events": "List all events",
        "GET /events/:eventId": "Get specific event",
        "POST /waitlist": "Add to waitlist",
        // ... other legacy endpoints
      },
      health: {
        "GET /health": "API health check",
        "GET /routes": "This endpoint - API documentation",
      },
    };

    logger.info("API routes documentation requested", {
      requestId: (req as any).id,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({
      success: true,
      message: "Available API routes",
      data: availableRoutes,
      totalEndpoints: Object.values(availableRoutes).reduce(
        (total, section) => total + Object.keys(section).length,
        0
      ),
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Create placeholder routes for future modules
   *
   * Provides informative responses for routes that are planned but not yet implemented.
   */
  // function createPlaceholderRoutes(moduleName: string): Router {
  //   const router = Router();

  //   router.use('*', (req: Request, res: Response) => {
  //     res.status(501).json({
  //       success: false,
  //       error: {
  //         code: 'NOT_IMPLEMENTED',
  //         message: `${moduleName} module is not yet implemented`,
  //         plannedImplementation: 'Q1 2024'
  //       },
  //       metadata: {
  //         timestamp: new Date().toISOString(),
  //         module: moduleName,
  //         requestedPath: req.path,
  //         method: req.method
  //       }
  //     });
  //   });

  //   return router;
  // }

  /**
   * Health check helper functions
   */
  async function checkDatabaseHealth(dataSource: DataSource): Promise<boolean> {
    try {
      await dataSource.query("SELECT 1");
      return true;
    } catch (error) {
      return false;
    }
  }

  async function checkRedisHealth(): Promise<boolean> {
    try {
      // TODO: Implement Redis health check when RedisService is available
      // const redisService = RedisService.getInstance();
      // await redisService.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  async function checkStorageHealth(): Promise<boolean> {
    try {
      // TODO: Implement storage health check when StorageService is available
      // const storageService = StorageService.getInstance();
      // await storageService.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  return router;
}
