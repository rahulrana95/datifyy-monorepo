/**
 * AdminUser Type
 * Auto-generated from TypeORM entity: AdminUser
 */

export interface AdminUserType {
  id: number;
  unique: true;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  enum: AdminPermissionLevel;
  permissionLevel: AdminPermissionLevel;
  additionalPermissions: AdminPermission[];
  enum: AdminAccountStatus;
  accountStatus: AdminAccountStatus;
  isActive: boolean;
  profileImageUrl: string;
  phoneNumber: string;
  department: string;
  position: string;
  timezone: string;
  preferredLanguage: string;
  twoFactorEnabled: boolean;
  twoFactorMethods: AdminTwoFactorMethod[];
  totpSecretKey: string;
  backupCodes: string[];
  failedLoginAttempts: number;
  lockedAt: Date;
  lockExpiresAt: Date;
  lastLoginAt: Date;
  lastLoginIp: string;
  lastLoginUserAgent: string;
  lastActiveAt: Date;
  loginCount: number;
  lastPasswordChange: Date;
  passwordExpiryDate: Date;
  mustChangePassword: boolean;
  passwordHistory: string[];
  createdBy: number;
  updatedBy: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Utility types for AdminUser
export type CreateAdminUserInput = Omit<AdminUserType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAdminUserInput = Partial<Omit<AdminUserType, 'id' | 'createdAt' | 'updatedAt'>>;
export type AdminUserId = AdminUserType['id'];
