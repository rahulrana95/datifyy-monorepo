/**
 * UserAccess Type
 * Auto-generated from TypeORM entity: UserAccess
 */

export interface UserAccessType {
  userId: number;
  isactive: boolean;
}

// Utility types for UserAccess
export type CreateUserAccessInput = Omit<UserAccessType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserAccessInput = Partial<Omit<UserAccessType, 'id' | 'createdAt' | 'updatedAt'>>;
export type UserAccessId = UserAccessType['id'];
