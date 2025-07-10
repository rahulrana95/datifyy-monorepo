/**
 * Admin Auth Controller - HTTP Request Handling
 * 
 * Handles HTTP requests for admin authentication endpoints.
 * Provides clean separation between HTTP layer and business logic.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { IAdminAuthService } from '../services/IAdminAuthService';
import {
  AdminLoginRequestDto,
  AdminTwoFactorRequestDto,
  AdminRefreshTokenRequestDto,
  AdminLogoutRequestDto,
  AdminPasswordChangeRequestDto,
  AdminListQueryDto,
  DeviceInfoDto
} from '../dtos/AdminAuthDtos';
import { Logger } from '../../../infrastructure/logging/Logger';
import { AuthenticationError, ValidationError } from '../../../infrastructure/errors/AppErrors';

/**
 * Authenticated request interface with admin context
 */
export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    id: number;
    email: string;
    permissionLevel: string;
    permissions: string[];
    sessionId: string;
  };
}

/**
 * Standard API response format
 */
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    processingTime?: number;
  };
}

/**
 * Admin Authentication Controller
 * 
 * Handles all admin authentication HTTP endpoints with proper validation,
 * error handling, and response formatting.
 */
export class AdminAuthController {
  private readonly logger: Logger;

  constructor(
    private readonly adminAuthService: IAdminAuthService,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * POST /api/v1/admin/auth/login
   * Admin login with email and password
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Admin login request received', { 
        requestId,
        email: req.body.email,
        ipAddress: this.getClientIpAddress(req),
        userAgent: req.headers['user-agent']
      });

      // Transform and validate request
      const loginRequest = plainToClass(AdminLoginRequestDto, {
        ...req.body,
        deviceInfo: this.extractDeviceInfo(req)
      });

      const validationErrors = await validate(loginRequest);
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid login request', validationErrors);
      }

      // Process login
      const loginResponse = await this.adminAuthService.login(loginRequest);

      // Set HTTP-only cookie for refresh token if login successful
      if (loginResponse.success && loginResponse.refreshToken) {
        res.cookie('admin_refresh_token', loginResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/api/v1/admin/auth'
        });
      }

      const processingTime = Date.now() - startTime;

      this.logger.info('Admin login processed', {
        requestId,
        success: loginResponse.success,
        requires2FA: loginResponse.requires2FA,
        processingTime
      });

      const response: ApiResponse = {
        success: loginResponse.success,
        message: loginResponse.message,
        data: {
          accessToken: loginResponse.accessToken,
          expiresIn: loginResponse.expiresIn,
          admin: loginResponse.admin,
          sessionId: loginResponse.sessionId,
          requires2FA: loginResponse.requires2FA,
          loginSessionId: loginResponse.loginSessionId
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(loginResponse.success ? 200 : 401).json(response);

    } catch (error: any) {
      this.logger.error('Admin login error', {
        requestId,
        error: error.message,
        email: req.body.email
      });

      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/2fa
   * Complete two-factor authentication
   */
  async verifyTwoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('2FA verification request received', {
        requestId,
        email: req.body.email,
        method: req.body.method
      });

      // Transform and validate request
      const twoFactorRequest = plainToClass(AdminTwoFactorRequestDto, req.body);
      const validationErrors = await validate(twoFactorRequest);
      
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid 2FA request', validationErrors);
      }

      // Process 2FA verification
      const loginResponse = await this.adminAuthService.verifyTwoFactor(twoFactorRequest);

      // Set refresh token cookie
      if (loginResponse.success && loginResponse.refreshToken) {
        res.cookie('admin_refresh_token', loginResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/api/v1/admin/auth'
        });
      }

      const processingTime = Date.now() - startTime;

      this.logger.info('2FA verification processed', {
        requestId,
        success: loginResponse.success,
        processingTime
      });

      const response: ApiResponse = {
        success: loginResponse.success,
        message: loginResponse.message,
        data: {
          accessToken: loginResponse.accessToken,
          expiresIn: loginResponse.expiresIn,
          admin: loginResponse.admin,
          sessionId: loginResponse.sessionId
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(loginResponse.success ? 200 : 401).json(response);

    } catch (error: any) {
      this.logger.error('2FA verification error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/refresh
   * Refresh access token using refresh token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.debug('Token refresh request received', { requestId });

      // Get refresh token from cookie or body
      const refreshToken = req.cookies.admin_refresh_token || req.body.refreshToken;
      
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token not provided');
      }

      // Transform and validate request
      const refreshRequest = plainToClass(AdminRefreshTokenRequestDto, {
        refreshToken,
        deviceInfo: this.extractDeviceInfo(req)
      });

      const validationErrors = await validate(refreshRequest);
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid refresh request', validationErrors);
      }

      // Process token refresh
      const refreshResponse = await this.adminAuthService.refreshToken(refreshRequest);

      // Update refresh token cookie
      res.cookie('admin_refresh_token', refreshResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/admin/auth'
      });

      const processingTime = Date.now() - startTime;

      this.logger.debug('Token refresh processed', {
        requestId,
        processingTime
      });

      const response: ApiResponse = {
        success: refreshResponse.success,
        message: refreshResponse.message,
        data: {
          accessToken: refreshResponse.accessToken,
          expiresIn: refreshResponse.expiresIn,
          sessionId: refreshResponse.sessionId
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Token refresh error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/logout
   * Logout admin and invalidate session(s)
   */
  async logout(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        throw new AuthenticationError('Admin not authenticated');
      }

      this.logger.info('Admin logout request received', {
        requestId,
        adminId
      });

      // Transform and validate request
      const logoutRequest = plainToClass(AdminLogoutRequestDto, {
        sessionId: req.admin?.sessionId,
        logoutAllSessions: req.body.logoutAllSessions
      });

      const validationErrors = await validate(logoutRequest);
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid logout request', validationErrors);
      }

      // Process logout
      const logoutResponse = await this.adminAuthService.logout(logoutRequest, adminId);

      // Clear refresh token cookie
      res.clearCookie('admin_refresh_token', {
        path: '/api/v1/admin/auth'
      });

      const processingTime = Date.now() - startTime;

      this.logger.info('Admin logout processed', {
        requestId,
        adminId,
        sessionsTerminated: logoutResponse.sessionsTerminated,
        processingTime
      });

      const response: ApiResponse = {
        success: logoutResponse.success,
        message: logoutResponse.message,
        data: {
          sessionsTerminated: logoutResponse.sessionsTerminated
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Admin logout error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * GET /api/v1/admin/auth/profile
   * Get current admin profile and permissions
   */
  async getProfile(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        throw new AuthenticationError('Admin not authenticated');
      }

      this.logger.debug('Admin profile request received', {
        requestId,
        adminId
      });

      // Get admin profile
      const adminProfile = await this.adminAuthService.getAdminProfile(adminId);

      // Get activity summary
      const activitySummary = await this.adminAuthService.getAdminActivitySummary(adminId);

      // Get active sessions
      const activeSessions = await this.adminAuthService.getActiveSessions(adminId);

      const processingTime = Date.now() - startTime;

      this.logger.debug('Admin profile processed', {
        requestId,
        adminId,
        processingTime
      });

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          profile: adminProfile,
          activitySummary,
          activeSessions: activeSessions.length,
          currentSessionId: req.admin?.sessionId
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Admin profile error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * POST /api/v1/admin/auth/change-password
   * Change admin password
   */
  async changePassword(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        throw new AuthenticationError('Admin not authenticated');
      }

      this.logger.info('Password change request received', {
        requestId,
        adminId
      });

      // Transform and validate request
      const passwordChangeRequest = plainToClass(AdminPasswordChangeRequestDto, req.body);
      const validationErrors = await validate(passwordChangeRequest);
      
      if (validationErrors.length > 0) {
        throw new ValidationError('Invalid password change request', validationErrors);
      }

      // Additional validation for password match
      if (!passwordChangeRequest.validatePasswordsMatch()) {
        throw new ValidationError('Passwords do not match');
      }

      // Process password change
      const result = await this.adminAuthService.changePassword(adminId, passwordChangeRequest);

      const processingTime = Date.now() - startTime;

      this.logger.info('Password change processed', {
        requestId,
        adminId,
        success: result.success,
        processingTime
      });

      const response: ApiResponse = {
        success: result.success,
        message: result.message,
        error: result.success ? undefined : {
          code: 'PASSWORD_CHANGE_FAILED',
          message: result.message,
          details: result.errors
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(result.success ? 200 : 400).json(response);

    } catch (error: any) {
      this.logger.error('Password change error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * GET /api/v1/admin/auth/sessions
   * Get active admin sessions
   */
  async getSessions(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        throw new AuthenticationError('Admin not authenticated');
      }

      this.logger.debug('Sessions request received', {
        requestId,
        adminId
      });

      // Get active sessions
      const sessions = await this.adminAuthService.getActiveSessions(adminId);

      const processingTime = Date.now() - startTime;

      this.logger.debug('Sessions retrieved', {
        requestId,
        adminId,
        sessionCount: sessions.length,
        processingTime
      });

      const response: ApiResponse = {
        success: true,
        message: 'Sessions retrieved successfully',
        data: {
          sessions,
          currentSessionId: req.admin?.sessionId,
          totalSessions: sessions.length
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error:any) {
      this.logger.error('Sessions retrieval error', {
        requestId,
        error: error.message
      });

      next(error);
    }
  }

  /**
   * Private Helper Methods
   */

  private extractDeviceInfo(req: Request): DeviceInfoDto {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = this.getClientIpAddress(req);

    // Simple device type detection
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad|Tablet/.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Simple browser detection
    let browser: string | undefined;
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Simple OS detection
    let os: string | undefined;
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return {
      userAgent,
      ipAddress,
      deviceType,
      browser,
      os
    };
  }

  private getClientIpAddress(req: Request): string {
    return (
      req.headers['cf-connecting-ip'] as string ||
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}