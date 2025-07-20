/**
 * UserAccess Type
 * Auto-generated from TypeORM entity: UserAccess
 */

export interface UserAccessType {
  userId: number;
  isactive: boolean;
}

// Utility types for UserAccess
export type CreateUserAccessInput = UserAccessType;
export type UpdateUserAccessInput = Partial<UserAccessType>;
export type UserAccessId = UserAccessType['userId'];
