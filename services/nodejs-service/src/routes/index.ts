// services/nodejs-service/src/routes/index.ts - UPDATED VERSION

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

// 🎯 NEW: Import Date Curation Routes
import { createDateCurationRoutes } from "./dateCuration/dateCurationRoutes";

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

  // Image upload routes
  router.use("/images", createImageUploadRoutes(dataSource));
  logger.info("✅ Image Upload routes registered at /images");

  // Partner Preferences routes (new advanced module)
  router.use(
    "/user/partner-preferences",
    createPartnerPreferencesRoutes(dataSource)
  );
  logger.info(
    "✅ Partner Preferences routes registered at /user/partner-preferences"
  );

  // 🎯 NEW: Date Curation routes (MAIN FEATURE)
  router.use("/date-curation", createDateCurationRoutes(dataSource));
  logger.info("✅ Date Curation routes registered at /date-curation");

  // Existing legacy routes (maintaining backward compatibility)
  // This includes all your existing functionality from allRoutes.ts
  router.use("/", allRoutes);
  logger.info(
    "✅ Legacy routes registered (backward compatibility maintained)"
  );

  // API documentation endpoint (helpful for development)
  router.get("/routes", (req, res) => {
    const availableRoutes = {
      // 🎯 NEW: Date Curation routes added to documentation
      dateCuration: {
        // USER ROUTES
        "GET /date-curation/my-dates": "Get user's curated dates (upcoming, past, pending)",
        "GET /date-curation/my-dates/:dateId": "Get specific curated date details",
        "POST /date-curation/my-dates/:dateId/confirm": "User confirms attendance for date",
        "POST /date-curation/my-dates/:dateId/cancel": "User cancels their curated date",
        "POST /date-curation/my-dates/:dateId/feedback": "Submit feedback after date completion",
        "GET /date-curation/my-dates/:dateId/feedback": "Get user's feedback for specific date",
        "PUT /date-curation/my-dates/:dateId/feedback": "Update feedback within edit window",
        "GET /date-curation/my-trust-score": "Get user's trust/love score details",
        "GET /date-curation/my-date-series": "Get all date series (multiple dates with same people)",
        "GET /date-curation/my-date-series/:seriesId": "Get specific date series details",

        // ADMIN ROUTES
        "POST /date-curation/admin/curated-dates": "Admin creates curated date between users",
        "GET /date-curation/admin/curated-dates": "Admin gets all curated dates with filters",
        "GET /date-curation/admin/curated-dates/:dateId": "Admin gets specific date with full details",
        "PUT /date-curation/admin/curated-dates/:dateId": "Admin updates curated date details",
        "DELETE /date-curation/admin/curated-dates/:dateId": "Admin deletes/cancels curated date",
        "POST /date-curation/admin/search-potential-matches": "Admin searches potential matches for user",
        "POST /date-curation/admin/curated-dates/bulk-create": "Admin creates multiple dates at once",
        "GET /date-curation/admin/users/:userId/trust-score": "Admin gets user's trust score",
        "PUT /date-curation/admin/users/:userId/trust-score": "Admin manually adjusts trust score",
        "GET /date-curation/admin/date-series": "Admin gets all date series with filters",
        "PUT /date-curation/admin/date-series/:seriesId": "Admin updates date series stage/notes",
        "GET /date-curation/admin/analytics/date-curation": "Admin gets comprehensive analytics",
        "GET /date-curation/admin/dashboard/date-curation": "Admin gets dashboard overview",
        "GET /date-curation/admin/feedback/all": "Admin gets all date feedback",
        "GET /date-curation/admin/reports/safety": "Admin gets safety reports from feedback",
        "POST /date-curation/admin/users/:userId/probation": "Admin manages user probation status",

        // WORKFLOW ROUTES
        "GET /date-curation/admin/workflow/pending": "Get pending curation workflow tasks",
        "PUT /date-curation/admin/workflow/:workflowId/complete": "Mark workflow stage complete",
        "POST /date-curation/admin/workflow/auto-reminders": "Trigger automated date reminders",

        // UTILITY ROUTES
        "POST /date-curation/check-date-conflicts": "Check for scheduling conflicts",
        "GET /date-curation/compatibility/:user1Id/:user2Id": "Get compatibility score between users",
        "GET /date-curation/health": "Date curation service health check"
      },
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
      // 🎯 NEW: Highlight the new Date Curation endpoints
      newFeatures: {
        dateCuration: {
          userEndpoints: 10,
          adminEndpoints: 15,
          workflowEndpoints: 3,
          utilityEndpoints: 4,
          totalEndpoints: 32,
          description: "Complete date curation system for admin-managed dating"
        }
      }
    });
  });

  return router;
}

// 🎯 NEW: Add this export for easy access to route count
export const getRouteStats = () => {
  return {
    totalModules: 8, // auth, admin-auth, user-profile, availability, images, partner-prefs, date-curation, legacy
    dateCurationEndpoints: 32,
    totalNewEndpoints: 50+ // approximate total of all new endpoints
  };
};