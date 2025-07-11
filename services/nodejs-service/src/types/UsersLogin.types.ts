/**
 * UsersLogin Type
 * Auto-generated from TypeORM entity: UsersLogin
 */

export interface UsersLoginType {
  primary: true;
  uuid: string;
  email: string;
  password: string;
}

// Utility types for UsersLogin
export type CreateUsersLoginInput = Omit<UsersLoginType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUsersLoginInput = Partial<Omit<UsersLoginType, 'id' | 'createdAt' | 'updatedAt'>>;
export type UsersLoginId = UsersLoginType['id'];
