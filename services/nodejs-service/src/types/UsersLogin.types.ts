/**
 * UsersLogin Type
 * Auto-generated from TypeORM entity: UsersLogin
 */

export interface UsersLoginType {
  uuid: string;
  email: string;
  password: string;
}

// Utility types for UsersLogin
export type CreateUsersLoginInput = UsersLoginType;
export type UpdateUsersLoginInput = Partial<UsersLoginType>;
export type UsersLoginId = UsersLoginType['uuid'];
