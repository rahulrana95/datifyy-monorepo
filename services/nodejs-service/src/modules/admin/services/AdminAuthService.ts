/**
 * Admin Auth Service Implementation - Core Business Logic
 * 
 * Implements comprehensive admin authentication business logic.
 * Provides enterprise-grade security with detailed logging and monitoring.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  IAdminAuthService,
  AuthenticationResult,
  TokenValidationResult,
  PermissionCheckContext,
  PermissionCheckResult,
  SessionContext,
  SessionManagementResult,
  TwoFactorSetupResult,
  SecurityEvent
} from './IAdminAuthService';
import { IAdminRepository } from '../repositories/IAdminRepository';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  AdminTwoFactorRequestDto,
  AdminRefreshTokenRequestDto,
  AdminRefreshTokenResponseDto,
  AdminLogoutRequestDto,
  AdminLogoutResponseDto,
  AdminProfileResponseDto,
  AdminPasswordChangeRequestDto,
  AdminSessionResponseDto,
  AdminActivitySummaryDto
} from '../dtos/AdminAuthDtos';
import {
  AdminPermission,
  AdminAccountStatus,
  AdminTwoFactorMethod,
  AdminTokenPayload,
  AdminLoginAttemptResult,
  AdminSecurityConstants,
} from '../../../proto-types/admin/enums';
import { Logger } from '../../../infrastructure/logging/Logger';
import { Config } from '../../../infrastructure/config/Config';
import { RedisService } from '../../../infrastructure/cache/RedisService';
import { DatifyyUsersLogin } from '../../../models/entities/DatifyyUsersLogin';
import {
  adminAccountStatusToDb,
  dbToAdminAccountStatus
} from '../../../utils/enum-converters';
import { ADMIN_SECURITY_CONSTANTS } from '../../../utils/admin-auth-constants';

/**
 * Admin Authentication Service Implementation
 * 
 * Provides comprehensive authentication, authorization, and session management
 * with enterprise security features and detailed audit logging.
 */
export class AdminAuthService implements IAdminAuthService {
  private readonly logger: Logger;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly Config: Config,
    private readonly redisService: RedisService,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
    this.jwtSecret = this.Config.get('jwt').secret;
    this.jwtExpiresIn = this.Config.get('jwt').expiresIn;
    this.refreshTokenExpiresIn = '7d';
  }

  /**
   * Core Authentication Operations
   */

  async login(loginRequest: AdminLoginRequestDto): Promise<AdminLoginResponseDto> {
    const { email, password, rememberMe, deviceInfo } = loginRequest;
    
    this.logger.info('Admin login attempt', { 
      email, 
      rememberMe,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent
    });

    try {
      // Find admin by email
      const admin: DatifyyUsersLogin | null = await this.adminRepository.findByEmail(email);

      
      if (!admin) {
        await this.logSecurityEvent({
          eventType: 'LOGIN_FAILED',
          adminId: 0,
          severity: 'medium',
          description: `Login attempt with non-existent email: ${email}`,
          metadata: { email, reason: 'user_not_found' }
        });

        return {
          success: false,
          message: 'Invalid credentials',
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          admin: {} as AdminProfileResponseDto,
          sessionId: '',
          requires2FA: false
        };
      }

      // Check account status
      if (!admin.isactive || dbToAdminAccountStatus(admin.accountStatus) !== AdminAccountStatus.ADMIN_ACTIVE) {
        await this.logSecurityEvent({
          eventType: 'LOGIN_FAILED',
          adminId: admin.id,
          severity: 'high',
          description: `Login attempt on inactive/locked account`,
          metadata: { 
            email, 
            accountStatus: admin.accountStatus,
            isactive: admin.isactive 
          }
        });

        return {
          success: false,
          message: 'Account is not active',
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          admin: {} as AdminProfileResponseDto,
          sessionId: '',
          requires2FA: false
        };
      }

      // Check if account is locked
      if (admin.lockedAt) {
        this.logger.warn('Login attempt on locked account', {
          adminId: admin.id,
          email,
          lockExpiresAt: admin.lockExpiresAt
        });

        return {
          success: false,
          message: `Account is locked until ${admin.lockExpiresAt?.toISOString()}`,
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          admin: {} as AdminProfileResponseDto,
          sessionId: '',
          requires2FA: false
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, admin.password);
      
      if (!isPasswordValid) {
        // Increment failed login attempts
        const failedAttempts = await this.adminRepository.incrementFailedLoginAttempts(admin.id);
        
        await this.logSecurityEvent({
          eventType: 'LOGIN_FAILED',
          adminId: admin.id,
          severity: 'medium',
          description: 'Invalid password attempt',
          metadata: { 
            email, 
            failedAttempts,
            ipAddress: deviceInfo?.ipAddress 
          }
        });

        const remainingAttempts = ADMIN_SECURITY_CONSTANTS.maxLoginAttempts - failedAttempts;
        
        return {
          success: false,
          message: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
          accessToken: '',
          refreshToken: '',
          expiresIn: 0,
          admin: {} as AdminProfileResponseDto,
          sessionId: '',
          requires2FA: false
        };
      }

      // Check if 2FA is required
      // if (admin.twoFactorEnabled) {
      //   const loginSessionId = await this.createPending2FASession(admin.id, deviceInfo);
        
      //   this.logger.info('2FA required for admin login', {
      //     adminId: admin.id,
      //     email,
      //     loginSessionId
      //   });

      //   return {
      //     success: true,
      //     message: '2FA verification required',
      //     accessToken: '',
      //     refreshToken: '',
      //     expiresIn: 0,
      //     admin: this.mapToProfileResponse(admin),
      //     sessionId: '',
      //     requires2FA: true,
      //     loginSessionId
      //   };
      // }

      // Complete login process
      return await this.completeLogin(admin, deviceInfo, rememberMe);

    } catch (error) {
      this.logger.error('Admin login error', { email, error });
      throw new Error('Login process failed');
    }
  }

  async verifyTwoFactor(twoFactorRequest: AdminTwoFactorRequestDto): Promise<AdminLoginResponseDto> {
    const { email, code, method, loginSessionId } = twoFactorRequest;

    this.logger.info('2FA verification attempt', {
      email,
      method,
      loginSessionId
    });

    try {
      // Validate login session
      const sessionData = await this.redisService.get(`2fa_session:${loginSessionId}`);
      if (!sessionData) {
        this.logger.warn('Invalid or expired 2FA session', { loginSessionId, email });
        throw new Error('2FA session expired. Please login again.');
      }

      const session = JSON.parse(sessionData);
      const admin = await this.adminRepository.findById(session.adminId);
      
      if (!admin || admin.email !== email) {
        throw new Error('Invalid 2FA session');
      }

      // Verify 2FA code
      const isCodeValid = await this.verifyTwoFactorCode(admin.id, code, method);
      
      if (!isCodeValid) {
        await this.logSecurityEvent({
          eventType: 'LOGIN_FAILED',
          adminId: admin.id,
          severity: 'high',
          description: 'Invalid 2FA code attempt',
          metadata: { email, method, loginSessionId }
        });

        throw new Error('Invalid 2FA code');
      }

      // Clear 2FA session
      await this.redisService.delete(`2fa_session:${loginSessionId}`);

      // Complete login
      return await this.completeLogin(admin, session.deviceInfo, session.rememberMe);

    } catch (error) {
      this.logger.error('2FA verification error', { email, error });
      throw error;
    }
  }

  async refreshToken(refreshRequest: AdminRefreshTokenRequestDto): Promise<AdminRefreshTokenResponseDto> {
    const { refreshToken, deviceInfo } = refreshRequest;

    this.logger.debug('Token refresh attempt', {
      ipAddress: deviceInfo?.ipAddress
    });

    try {
      // Validate refresh token
      const tokenData = await this.redisService.get(`refresh_token:${refreshToken}`);
      if (!tokenData) {
        throw new Error('Invalid or expired refresh token');
      }

      const { adminId, sessionId } = JSON.parse(tokenData);
      
      // Get admin and validate status
      const admin = await this.adminRepository.findById(adminId);
      if (!admin || !admin.isactive || dbToAdminAccountStatus(admin.accountStatus) !== AdminAccountStatus.ADMIN_ACTIVE) {
        await this.redisService.delete(`refresh_token:${refreshToken}`);
        throw new Error('Admin account is not active');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(adminId, sessionId);
      
      // Update admin activity
      await this.updateAdminActivity(adminId);

      this.logger.info('Token refreshed successfully', {
        adminId,
        sessionId
      });

      return {
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        sessionId,
        message: 'Token refreshed successfully'
      };

    } catch (error) {
      this.logger.error('Token refresh error', { error });
      throw error;
    }
  }

  async logout(logoutRequest: AdminLogoutRequestDto, adminId: number): Promise<AdminLogoutResponseDto> {
    const { sessionId, logoutAllSessions } = logoutRequest;

    this.logger.info('Admin logout request', {
      adminId,
      sessionId,
      logoutAllSessions
    });

    try {
      let sessionsTerminated = 0;

      if (logoutAllSessions) {
        // Invalidate all admin sessions
        const sessions = await this.getActiveSessions(adminId);
        for (const session of sessions) {
          await this.invalidateSession(session.sessionId, adminId);
          sessionsTerminated++;
        }
      } else if (sessionId) {
        // Invalidate specific session
        const result = await this.invalidateSession(sessionId, adminId);
        sessionsTerminated = result.success ? 1 : 0;
      }

      await this.logSecurityEvent({
        eventType: 'LOGOUT',
        adminId,
        severity: 'low',
        description: `Admin logout - ${sessionsTerminated} sessions terminated`,
        metadata: { sessionId, logoutAllSessions, sessionsTerminated }
      });

      this.logger.info('Admin logout completed', {
        adminId,
        sessionsTerminated
      });

      return {
        success: true,
        message: 'Logout successful',
        sessionsTerminated
      };

    } catch (error) {
      this.logger.error('Admin logout error', { adminId, error });
      throw error;
    }
  }

  /**
   * Token & Session Management
   */

  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      // Verify JWT signature and expiration
      const payload = jwt.verify(token, this.jwtSecret) as AdminTokenPayload;
      
      // Get admin from database
      const admin = await this.adminRepository.findById(payload.adminId);
      
      if (!admin || !admin.isactive || dbToAdminAccountStatus(admin.accountStatus) !== AdminAccountStatus.ADMIN_ACTIVE) {
        return {
          isValid: false,
          invalidReason: 'Admin account is not active'
        };
      }

      // Check session validity
      // const sessionExists = await this.redisService.exists(`session:${payload.sessionId}`);
      // if (!sessionExists) {
      //   return {
      //     isValid: false,
      //     invalidReason: 'Session has expired'
      //   };
      // }

      // Update admin activity
      await this.updateAdminActivity(admin.id);

      return {
        isValid: true,
        payload,
        admin: this.mapToProfileResponse(admin),
        sessionId: payload.sessionId,
        expiresAt: new Date(payload.exp * 1000)
      };

    } catch (error:any) {
      this.logger.debug('Token validation failed', { error: error.message });
      return {
        isValid: false,
        invalidReason: error.message
      };
    }
  }

  async generateTokens(
    adminId: number, 
    sessionId: string, 
    rememberMe?: boolean
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const admin: DatifyyUsersLogin | null = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Create token payload
    // const payload: AdminTokenPayload = {
    //   sub: adminId.toString(),
    //   email: admin.email,
    //   // @ts-ignore
    //   permissionLevel: admin.permissionLevel,
    //   // permissions: admin.allPermissions,
    //   sessionId,
    //   iat: Math.floor(Date.now() / 1000),
    //   exp: Math.floor(Date.now() / 1000) + this.getTokenExpirySeconds(),
    //   iss: 'datifyy-admin',
    //   aud: 'datifyy-admin-dashboard'
    // };

        const payload = {
          id: admin.id,
          email: admin.email,
          isadmin: admin.isadmin || false
        };
    
        const expiresIn = '48h';
       const token = jwt.sign(payload, this.jwtSecret, { expiresIn });
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

    // Generate access token
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    // Generate refresh token
    const refreshToken = uuidv4();
    const refreshTokenExpiry = rememberMe ? '30d' : this.refreshTokenExpiresIn;
    
    // Store refresh token in Redis
    await this.redisService.setex(
      `refresh_token:${refreshToken}`,
      this.getRefreshTokenExpirySeconds(rememberMe),
      JSON.stringify({ adminId, sessionId })
    );


    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirySeconds()
    };
  }

  /**
   * Authorization & Permissions
   */

  async checkPermission(context: PermissionCheckContext): Promise<PermissionCheckResult> {
    const { adminId, permission } = context;

    try {
      const admin = await this.adminRepository.findById(adminId);
      if (!admin || !admin.isactive) {
        return {
          hasPermission: false,
          reason: 'Admin account is not active'
        };
      }

      // const adminPermissions = admin.allPermissions;
      const hasPermission = true//adminPermissions.includes(permission);

      this.logger.debug('Permission check', {
        adminId,
        permission,
        hasPermission,
        adminPermissions: 0
      });

      return {
        hasPermission,
        reason: hasPermission ? undefined : 'Insufficient permissions'
      };

    } catch (error) {
      this.logger.error('Permission check error', { adminId, permission, error });
      return {
        hasPermission: false,
        reason: 'Permission check failed'
      };
    }
  }

  // async getAdminPermissions(adminId: number): Promise<AdminPermission[]> {
  //   const admin = await this.adminRepository.findById(adminId);
  //   if (!admin) {
  //     throw new Error('Admin not found');
  //   }

  //   return admin.allPermissions;
  // }

  /**
   * Profile & Account Management
   */

  async getAdminProfile(adminId: number): Promise<AdminProfileResponseDto> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) {
      throw new Error('Admin not found');
    }

    return this.mapToProfileResponse(admin);
  }

  async updateAdminActivity(adminId: number): Promise<boolean> {
    try {
      return await this.adminRepository.updateLastActivity(adminId);
    } catch (error) {
      this.logger.error('Error updating admin activity', { adminId, error });
      return false;
    }
  }

  /**
   * Security Operations
   */

  async changePassword(
    adminId: number, 
    passwordChangeRequest: AdminPasswordChangeRequestDto
  ): Promise<{ success: boolean; message: string; errors?: string[] }> {
    const { currentPassword, newPassword, confirmPassword } = passwordChangeRequest;

    try {
      const admin = await this.adminRepository.findById(adminId);
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect',
          errors: ['current_password_invalid']
        };
      }

      // Validate password match
      if (newPassword !== confirmPassword) {
        return {
          success: false,
          message: 'New passwords do not match',
          errors: ['passwords_mismatch']
        };
      }

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password in database
      await this.adminRepository.update(adminId, {
        password: newPasswordHash,
      });

      await this.logSecurityEvent({
        eventType: 'PASSWORD_RESET',
        adminId,
        severity: 'medium',
        description: 'Admin password changed successfully',
        metadata: { triggeredBy: 'self' }
      });

      this.logger.info('Admin password changed successfully', { adminId });

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      this.logger.error('Password change error', { adminId, error });
      throw error;
    }
  }

  /**
   * Audit & Security Monitoring
   */

  async logSecurityEvent(event: SecurityEvent): Promise<boolean> {
    try {
      this.logger.info('Security event logged', {
        eventType: event.eventType,
        adminId: event.adminId,
        severity: event.severity,
        description: event.description
      });

      // Store in Redis for quick access and analysis
      const eventKey = `security_event:${Date.now()}:${uuidv4()}`;
      await this.redisService.setex(
        eventKey,
        86400, // 24 hours
        JSON.stringify({
          ...event,
          timestamp: new Date().toISOString()
        })
      );

      return true;
    } catch (error) {
      this.logger.error('Error logging security event', { event, error });
      return false;
    }
  }

  /**
   * Private Helper Methods
   */

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Password verification error', { error });
      return false;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private mapToProfileResponse(admin: any): AdminProfileResponseDto {
    return {
      id: admin.id,
      isActive: admin.isactive,
      passwordHash: admin.password,
      totpSecretKey: '',
      backupCodes: [],
      failedLoginAttempts: 0,
      passwordHistory:[],
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      fullName: admin.fullName,
      permissionLevel: admin.permissionLevel,
      permissions: admin.allPermissions,
      accountStatus: admin.accountStatus,
      isactive: admin.isactive,
      profileImageUrl: admin.profileImageUrl,
      phoneNumber: admin.phoneNumber,
      department: admin.department,
      position: admin.position,
      timezone: admin.timezone,
      preferredLanguage: admin.preferredLanguage,
      twoFactorEnabled: admin.twoFactorEnabled,
      twoFactorMethods: admin.twoFactorMethods || [],
      lastLoginAt: admin.lastLoginAt?.toISOString(),
      lastActiveAt: admin.lastActiveAt?.toISOString(),
      loginCount: admin.loginCount,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString()
    } as AdminProfileResponseDto;
  }

  private async completeLogin(
    admin: any, 
    deviceInfo: any, 
    rememberMe?: boolean
  ): Promise<AdminLoginResponseDto> {
    // Create session
    const sessionId = uuidv4();
    const sessionResult = await this.createSession({
      adminId: admin.id,
      deviceInfo,
      rememberMe,
      sessionDuration: rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60 // 30 days vs 8 hours
    });


    // Generate tokens
    const tokens = await this.generateTokens(admin.id, sessionId, rememberMe);

    // Update login info
    await this.adminRepository.updateLoginInfo(admin.id, {
      lastLoginAt: new Date(),
      lastLoginIp: deviceInfo?.ipAddress || '',
      lastLoginUserAgent: deviceInfo?.userAgent || '',
      loginCount: admin.loginCount + 1
    });


    await this.logSecurityEvent({
      eventType: 'LOGIN',
      adminId: admin.id,
      severity: 'low',
      description: 'Successful admin login',
      metadata: { sessionId, rememberMe },
      deviceInfo
    });

    this.logger.info('Admin login completed successfully', {
      adminId: admin.id,
      email: admin.email,
      sessionId
    });

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      admin: this.mapToProfileResponse(admin),
      sessionId,
      requires2FA: false,
      message: 'Login successful'
    };
  }

  private async createPending2FASession(adminId: number, deviceInfo: any): Promise<string> {
    const loginSessionId = uuidv4();
    
    await this.redisService.setex(
      `2fa_session:${loginSessionId}`,
      ADMIN_SECURITY_CONSTANTS.twoFactorValidityMinutes * 60,
      JSON.stringify({
        adminId,
        deviceInfo,
        createdAt: new Date().toISOString()
      })
    );

    return loginSessionId;
  }

  private getTokenExpirySeconds(): number {
    return ADMIN_SECURITY_CONSTANTS.sessionTimeoutHours * 60 * 60;
  }

  private getRefreshTokenExpirySeconds(rememberMe?: boolean): number {
    return rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days vs 7 days
  }

  // Placeholder implementations for interface compliance
  async hasAnyPermission(adminId: number, permissions: AdminPermission[]): Promise<boolean> {
    // TODO: Implement
    return false;
  }

  async hasAllPermissions(adminId: number, permissions: AdminPermission[]): Promise<boolean> {
    // TODO: Implement  
    return false;
  }

  async getAdminActivitySummary(adminId: number): Promise<AdminActivitySummaryDto> {
    // TODO: Implement
    return {} as AdminActivitySummaryDto;
  }

  async createSession(context: SessionContext): Promise<SessionManagementResult> {
    // TODO: Implement
    return { success: true };
  }

  async invalidateSession(sessionId: string, adminId: number): Promise<SessionManagementResult> {
    // TODO: Implement
    return { success: true };
  }

  async getActiveSessions(adminId: number): Promise<AdminSessionResponseDto[]> {
    // TODO: Implement
    return [];
  }

  async setupTwoFactor(adminId: number, method: AdminTwoFactorMethod): Promise<TwoFactorSetupResult> {
    // TODO: Implement
    return { success: false, method };
  }

  async disableTwoFactor(adminId: number, currentPassword: string): Promise<boolean> {
    // TODO: Implement
    return false;
  }

  async generateBackupCodes(adminId: number): Promise<string[]> {
    // TODO: Implement
    return [];
  }

  async verifyTwoFactorCode(adminId: number, code: string, method: AdminTwoFactorMethod): Promise<boolean> {
    // TODO: Implement basic validation for now
    return code.length === 6 && /^\d+$/.test(code);
  }

  async lockAdminAccount(adminId: number, reason: string, durationMinutes?: number): Promise<boolean> {
    // TODO: Implement
    return false;
  }

  async unlockAdminAccount(adminId: number, unlockedBy: number): Promise<boolean> {
    // TODO: Implement
    return false;
  }

  async resetFailedLoginAttempts(adminId: number): Promise<boolean> {
    // TODO: Implement
    return false;
  }

  async isAdminAccountLocked(adminId: number): Promise<{ isLocked: boolean; lockedUntil?: Date; reason?: string; }> {
    // TODO: Implement
    return { isLocked: false };
  }

  async getLoginHistory(adminId: number, limit?: number): Promise<Array<{ timestamp: Date; ipAddress: string; userAgent: string; success: boolean; failureReason?: string; }>> {
    // TODO: Implement
    return [];
  }

  async detectSuspiciousActivity(adminId: number): Promise<{ riskScore: number; indicators: string[]; recommendations: string[]; }> {
    // TODO: Implement
    return { riskScore: 0, indicators: [], recommendations: [] };
  }

  async cleanupExpiredSessions(): Promise<number> {
    // TODO: Implement
    return 0;
  }

  async healthCheck(): Promise<{ isHealthy: boolean; dependencies: Record<string, boolean>; lastCheck: Date; }> {
    // TODO: Implement
    return { isHealthy: true, dependencies: {}, lastCheck: new Date() };
  }
}