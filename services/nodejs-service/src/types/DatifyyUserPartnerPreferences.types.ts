/**
 * DatifyyUserPartnerPreferences Type
 * Auto-generated from TypeORM entity: DatifyyUserPartnerPreferences
 */

import { DatifyyUsersLoginType } from "./DatifyyUsersLogin.types";

export interface DatifyyUserPartnerPreferencesType {
  id: number;
  precision: 10;
  scale: 2;
  user: DatifyyUsersLoginType;
}

// Utility types for DatifyyUserPartnerPreferences
export type CreateDatifyyUserPartnerPreferencesInput = Omit<DatifyyUserPartnerPreferencesType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyUserPartnerPreferencesInput = Partial<Omit<DatifyyUserPartnerPreferencesType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyUserPartnerPreferencesId = DatifyyUserPartnerPreferencesType['id'];
