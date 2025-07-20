/**
 * Admin Authentication DTOs - Request/Response Objects
 * 
 * Data Transfer Objects for admin authentication endpoints.
 * Includes validation decorators and type-safe transformations.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  IsNumber,
  IsObject,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested
} from 'class-validator';
import { Transform, Type, Expose, Exclude } from 'class-transformer';
import {
  AdminPermissionLevel,
  AdminPermission,
  AdminAccountStatus,
  AdminTwoFactorMethod,
  AdminSessionStatus
} from '../../../proto-types/admin/enums';

/**
 * Geographic Location DTO
 * Location information for security monitoring
 */
export class GeoLocationDto {
  @IsString({ message: 'Country is required' })
  @MaxLength(100)
  country: string;

  @IsString({ message: 'Region is required' })
  @MaxLength(100)
  region: string;

  @IsString({ message: 'City is required' })
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @IsString({ message: 'Timezone is required' })
  @MaxLength(50)
  timezone: string;
}


/**
 * Device Information DTO
 * Captures client device details for security tracking
 */
export class DeviceInfoDto {
  @IsString({ message: 'User agent is required' })
  @MaxLength(1000, { message: 'User agent must not exceed 1000 characters' })
  userAgent: string;

  @IsString({ message: 'IP address is required' })
  @Matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/, {
    message: 'Invalid IP address format'
  })
  ipAddress: string;

  @IsEnum(['desktop', 'mobile', 'tablet'], { message: 'Invalid device type' })
  deviceType: 'desktop' | 'mobile' | 'tablet';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  browser?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  os?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoLocationDto)
  location?: GeoLocationDto;
}

/**
 * Admin Login Request DTO
 * Validates admin login credentials with security constraints
 */
export class AdminLoginRequestDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'Remember me must be a boolean value' })
  rememberMe?: boolean = false;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}

/**
 * Two-Factor Authentication Request DTO
 * Validates 2FA verification during admin login
 */
export class AdminTwoFactorRequestDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: '2FA code is required' })
  @Matches(/^\d{6}$/, { message: '2FA code must be exactly 6 digits' })
  code: string;

  @IsEnum(AdminTwoFactorMethod, { message: 'Invalid 2FA method' })
  method: AdminTwoFactorMethod;

  @IsString({ message: 'Login session ID is required' })
  @MinLength(1, { message: 'Login session ID cannot be empty' })
  loginSessionId: string;
}

/**
 * Admin Token Refresh Request DTO
 * Validates refresh token for new access token generation
 */
export class AdminRefreshTokenRequestDto {
  @IsString({ message: 'Refresh token is required' })
  @MinLength(1, { message: 'Refresh token cannot be empty' })
  refreshToken: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}

/**
 * Admin Logout Request DTO
 * Validates logout request with optional session management
 */
export class AdminLogoutRequestDto {
  @IsOptional()
  @IsString({ message: 'Session ID must be a string' })
  sessionId?: string;

  @IsOptional()
  @IsBoolean({ message: 'Logout all sessions must be a boolean' })
  logoutAllSessions?: boolean = false;
}

/**
 * Admin Profile Response DTO
 * Sanitized admin profile data for API responses
 */
export class AdminProfileResponseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly fullName: string;

  @Expose()
  readonly permissionLevel: AdminPermissionLevel;

  @Expose()
  readonly permissions: AdminPermission[];

  @Expose()
  readonly accountStatus: AdminAccountStatus;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  @IsOptional()
  readonly profileImageUrl?: string;

  @Expose()
  @IsOptional()
  readonly phoneNumber?: string;

  @Expose()
  @IsOptional()
  readonly department?: string;

  @Expose()
  @IsOptional()
  readonly position?: string;

  @Expose()
  readonly timezone: string;

  @Expose()
  readonly preferredLanguage: string;

  @Expose()
  readonly twoFactorEnabled: boolean;

  @Expose()
  readonly twoFactorMethods: AdminTwoFactorMethod[];

  @Expose()
  @IsOptional()
  readonly lastLoginAt?: string;

  @Expose()
  @IsOptional()
  readonly lastActiveAt?: string;

  @Expose()
  readonly loginCount: number;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly updatedAt: string;

  // Security-sensitive fields excluded from responses
  @Exclude()
  passwordHash: string;

  @Exclude()
  totpSecretKey: string;

  @Exclude()
  backupCodes: string[];

  @Exclude()
  failedLoginAttempts: number;

  @Exclude()
  passwordHistory: string[];
}

/**
 * Admin Login Response DTO
 * Successful authentication response with tokens and profile
 */
export class AdminLoginResponseDto {
  @Expose()
  readonly success: boolean = true;

  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly refreshToken: string;

  @Expose()
  readonly expiresIn: number;

  @Expose()
  @ValidateNested()
  @Type(() => AdminProfileResponseDto)
  readonly admin: AdminProfileResponseDto;

  @Expose()
  readonly sessionId: string;

  @Expose()
  readonly requires2FA: boolean;

  @Expose()
  @IsOptional()
  readonly loginSessionId?: string;

  @Expose()
  readonly message: string;
}

/**
 * Admin Token Refresh Response DTO
 * New tokens and session information
 */
export class AdminRefreshTokenResponseDto {
  @Expose()
  readonly success: boolean = true;

  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly refreshToken: string;

  @Expose()
  readonly expiresIn: number;

  @Expose()
  readonly sessionId: string;

  @Expose()
  readonly message: string;
}

/**
 * Admin Logout Response DTO
 * Logout confirmation and session termination details
 */
export class AdminLogoutResponseDto {
  @Expose()
  readonly success: boolean = true;

  @Expose()
  readonly message: string;

  @Expose()
  readonly sessionsTerminated: number;
}

/**
 * Admin Session Response DTO
 * Current session information for authenticated admin
 */
export class AdminSessionResponseDto {
  @Expose()
  readonly sessionId: string;

  @Expose()
  readonly status: AdminSessionStatus;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly lastActivityAt: string;

  @Expose()
  readonly expiresAt: string;

  @Expose()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  readonly deviceInfo: DeviceInfoDto;

  @Expose()
  readonly isCurrentSession: boolean;
}

/**
 * Admin Activity Summary DTO
 * Dashboard activity metrics for admin users
 */
export class AdminActivitySummaryDto {
  @Expose()
  readonly totalLogins: number;

  @Expose()
  @IsOptional()
  readonly lastLoginAt?: string;

  @Expose()
  readonly activeSessionCount: number;

  @Expose()
  readonly actionsToday: number;

  @Expose()
  readonly actionsThisWeek: number;

  @Expose()
  readonly riskScore: number;

  @Expose()
  readonly securityAlerts: number;

  @Expose()
  @IsArray()
  readonly topActions: Array<{
    actionType: string;
    count: number;
  }>;
}

/**
 * Admin Password Change Request DTO
 * Validates password change with current password verification
 */
export class AdminPasswordChangeRequestDto {
  @IsString({ message: 'Current password is required' })
  @MinLength(1, { message: 'Current password cannot be empty' })
  currentPassword: string;

  @IsString({ message: 'New password is required' })
  @MinLength(12, { message: 'New password must be at least 12 characters long' })
  @MaxLength(128, { message: 'New password must not exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'New password must contain uppercase, lowercase, number, and special character'
  })
  newPassword: string;

  @IsString({ message: 'Password confirmation is required' })
  confirmPassword: string;

  /**
   * Custom validation to ensure passwords match
   */
  validatePasswordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }
}

/**
 * Admin Error Response DTO
 * Standardized error response for admin endpoints
 */
export class AdminErrorResponseDto {
  @Expose()
  readonly success: boolean = false;

  @Expose()
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: any;
  };

  @Expose()
  @IsOptional()
  readonly timestamp?: string;

  @Expose()
  @IsOptional()
  readonly requestId?: string;

  @Expose()
  @IsOptional()
  readonly retryAfter?: number;
}

/**
 * Admin List Query DTO
 * Query parameters for admin list endpoints with filtering and pagination
 */
export class AdminListQueryDto {
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @IsOptional()
  @IsEnum(AdminPermissionLevel, { message: 'Invalid permission level' })
  permissionLevel?: AdminPermissionLevel;

  @IsOptional()
  @IsEnum(AdminAccountStatus, { message: 'Invalid account status' })
  accountStatus?: AdminAccountStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid created after date format' })
  createdAfter?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid created before date format' })
  createdBefore?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid last login after date format' })
  lastLoginAfter?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid last login before date format' })
  lastLoginBefore?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Admin List Response DTO
 * Paginated list of admin users with metadata
 */
export class AdminListResponseDto {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminProfileResponseDto)
  readonly admins: AdminProfileResponseDto[];

  @Expose()
  readonly total: number;

  @Expose()
  readonly page: number;

  @Expose()
  readonly limit: number;

  @Expose()
  readonly totalPages: number;

  @Expose()
  readonly hasNext: boolean;

  @Expose()
  readonly hasPrevious: boolean;
}

/**
 * Admin Permission Check Response DTO
 * Result of permission validation request
 */
export class AdminPermissionCheckResponseDto {
  @Expose()
  readonly hasPermission: boolean;

  @Expose()
  @IsOptional()
  readonly reason?: string;

  @Expose()
  @IsOptional()
  readonly expiresAt?: string;

  @Expose()
  readonly checkedAt: string;
}