/**
 * DatifyyUsersInformation Type
 * Auto-generated from TypeORM entity: DatifyyUsersInformation
 */

import { DatifyyUsersLoginType } from "./DatifyyUsersLogin.types";

export interface DatifyyUsersInformationType {
  id: string;
  firstName: string;
  lastName: string;
  unique: true;
  officialEmail: string;
  userLogin: DatifyyUsersLoginType;
}

// Utility types for DatifyyUsersInformation
export type CreateDatifyyUsersInformationInput = Omit<DatifyyUsersInformationType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyUsersInformationInput = Partial<Omit<DatifyyUsersInformationType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyUsersInformationId = DatifyyUsersInformationType['id'];
