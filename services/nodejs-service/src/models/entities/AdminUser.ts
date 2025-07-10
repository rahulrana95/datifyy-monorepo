/**
 * Admin User Entity - Database Model
 * 
 * TypeORM entity for admin user accounts with comprehensive security features.
 * Implements enterprise-grade authentication and authorization patterns.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  OneToMany
} from 'typeorm';
import {
  AdminPermissionLevel,
  AdminPermission,
  AdminAccountStatus,
  AdminTwoFactorMethod,
  ADMIN_SECURITY_CONSTANTS
} from '@datifyy/shared-types';

/**
 * Admin User Entity
 * 
 * Stores admin account information with security features:
 * - Role-based access control
 * - Two-factor authentication support
 * - Account status management
 * - Security tracking fields
 * - Audit trail compatibility
 */
@Entity('datifyy_admin_users')
@Index(['email'], { unique: true })
@Index(['accountStatus', 'isActive'])
@Index(['permissionLevel'])
@Index(['createdAt'])
@Index(['lastLoginAt'])
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Core Identity Fields
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
    comment: 'Admin email address - used for login'
  })
  @Index('idx_admin_email')
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Bcrypt hashed password'
  })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Admin first name'
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Admin last name'
  })
  lastName: string;

  /**
   * Permission & Access Control
   */
  @Column({
    type: 'enum',
    enum: AdminPermissionLevel,
    default: AdminPermissionLevel.VIEWER,
    nullable: false,
    comment: 'Admin permission level for role-based access'
  })
  permissionLevel: AdminPermissionLevel;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional granular permissions beyond role level'
  })
  additionalPermissions: AdminPermission[];

  @Column({
    type: 'enum',
    enum: AdminAccountStatus,
    default: AdminAccountStatus.ACTIVE,
    nullable: false,
    comment: 'Current account status'
  })
  accountStatus: AdminAccountStatus;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Soft delete flag'
  })
  isActive: boolean;

  /**
   * Profile Information
   */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Profile image URL'
  })
  profileImageUrl: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Phone number for 2FA and contact'
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Department or team'
  })
  department: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Job position or title'
  })
  position: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'UTC',
    nullable: false,
    comment: 'Admin timezone preference'
  })
  timezone: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'en',
    nullable: false,
    comment: 'Preferred language code'
  })
  preferredLanguage: string;

  /**
   * Security & Authentication
   */
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Whether 2FA is enabled'
  })
  twoFactorEnabled: boolean;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Enabled 2FA methods'
  })
  twoFactorMethods: AdminTwoFactorMethod[];

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Encrypted TOTP secret key'
  })
  totpSecretKey: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Backup codes for 2FA recovery'
  })
  backupCodes: string[];

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Failed login attempt counter'
  })
  failedLoginAttempts: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'When account was locked due to failed attempts'
  })
  lockedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'When account lock expires'
  })
  lockExpiresAt: Date;

  /**
   * Activity Tracking
   */
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Last successful login timestamp'
  })
  @Index('idx_admin_last_login')
  lastLoginAt: Date;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    comment: 'Last login IP address'
  })
  lastLoginIp: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Last login user agent'
  })
  lastLoginUserAgent: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Last activity timestamp'
  })
  lastActiveAt: Date;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
    comment: 'Total login count'
  })
  loginCount: number;

  /**
   * Password Management
   */
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'When password was last changed'
  })
  lastPasswordChange: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'When password expires and must be changed'
  })
  passwordExpiryDate: Date;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Whether admin must change password on next login'
  })
  mustChangePassword: boolean;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Previous password hashes to prevent reuse'
  })
  passwordHistory: string[];

  /**
   * Audit & Metadata
   */
  @Column({
    type: 'int',
    nullable: true,
    comment: 'Admin who created this account'
  })
  createdBy: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Admin who last updated this account'
  })
  updatedBy: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Notes about this admin account'
  })
  notes: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional metadata for extensibility'
  })
  metadata: Record<string, any>;

  /**
   * Timestamps
   */
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Account creation timestamp'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Last update timestamp'
  })
  updatedAt: Date;

  /**
   * Computed Properties
   */
  
  /**
   * Check if account is currently locked
   */
  get isLocked(): boolean {
    return this.lockedAt !== null && 
           this.lockExpiresAt !== null && 
           new Date() < this.lockExpiresAt;
  }

  /**
   * Check if password has expired
   */
  get isPasswordExpired(): boolean {
    return this.passwordExpiryDate !== null && 
           new Date() > this.passwordExpiryDate;
  }

  /**
   * Check if password is expiring soon
   */
  get isPasswordExpiringSoon(): boolean {
    if (!this.passwordExpiryDate) return false;
    
    const warningDate = new Date(
      this.passwordExpiryDate.getTime() - 
      (ADMIN_SECURITY_CONSTANTS.PASSWORD_EXPIRY_WARNING_DAYS * 24 * 60 * 60 * 1000)
    );
    
    return new Date() >= warningDate;
  }

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Get all permissions (role + additional)
   */
  get allPermissions(): AdminPermission[] {
    const rolePermissions = this.getRolePermissions();
    const additional = this.additionalPermissions || [];
    return [...new Set([...rolePermissions, ...additional])];
  }

  /**
   * Lifecycle Hooks
   */
  
  @BeforeInsert()
  private setDefaultValues(): void {
    if (!this.passwordExpiryDate && this.lastPasswordChange) {
      this.passwordExpiryDate = new Date(
        this.lastPasswordChange.getTime() + 
        (ADMIN_SECURITY_CONSTANTS.PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      );
    }
    
    if (!this.lastPasswordChange) {
      this.lastPasswordChange = new Date();
    }
  }

  @BeforeUpdate()
  private updatePasswordExpiry(): void {
    if (this.lastPasswordChange) {
      this.passwordExpiryDate = new Date(
        this.lastPasswordChange.getTime() + 
        (ADMIN_SECURITY_CONSTANTS.PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      );
    }
  }

  /**
   * Business Logic Methods
   */
  
  /**
   * Get permissions based on role level
   */
  private getRolePermissions(): AdminPermission[] {
    // This would typically come from a service or configuration
    // For now, return empty array - will be implemented in service layer
    return [];
  }

  /**
   * Lock the account for security reasons
   */
  lockAccount(durationMinutes: number = ADMIN_SECURITY_CONSTANTS.ACCOUNT_LOCK_DURATION): void {
    this.lockedAt = new Date();
    this.lockExpiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
    this.accountStatus = AdminAccountStatus.LOCKED;
  }

  /**
   * Unlock the account
   */
  unlockAccount(): void {
    this.lockedAt = new Date();
    this.lockExpiresAt = new Date();
    this.failedLoginAttempts = 0;
    this.accountStatus = AdminAccountStatus.ACTIVE;
  }

  /**
   * Record a failed login attempt
   */
  recordFailedLogin(): boolean {
    this.failedLoginAttempts += 1;
    
    if (this.failedLoginAttempts >= ADMIN_SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      this.lockAccount();
      return true; // Account was locked
    }
    
    return false; // Account not locked yet
  }

  /**
   * Record a successful login
   */
  recordSuccessfulLogin(ipAddress: string, userAgent: string): void {
    this.lastLoginAt = new Date();
    this.lastActiveAt = new Date();
    this.lastLoginIp = ipAddress;
    this.lastLoginUserAgent = userAgent;
    this.loginCount += 1;
    this.failedLoginAttempts = 0;
    
    // Clear lock if account was locked
    if (this.isLocked) {
      this.unlockAccount();
    }
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    this.lastActiveAt = new Date();
  }
}