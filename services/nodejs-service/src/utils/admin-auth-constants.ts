import { AdminSecurityConstants } from "../proto-types";

export const ADMIN_SECURITY_CONSTANTS: AdminSecurityConstants = {
 maxLoginAttempts: 5,
 sessionTimeoutHours: 8,
 twoFactorValidityMinutes: 10,
 passwordResetValidityHours: 24,
 accountLockDurationMinutes: 30,
 refreshTokenValidityDays: 30,
 maxConcurrentSessions: 3,
 passwordHistoryCount: 12,
 passwordMinLength: 12,
 rateLimitWindowMinutes: 15,
 rateLimitMaxRequests: 100,
};