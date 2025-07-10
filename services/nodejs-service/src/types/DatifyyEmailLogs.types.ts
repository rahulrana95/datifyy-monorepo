/**
 * DatifyyEmailLogs Type
 * Auto-generated from TypeORM entity: DatifyyEmailLogs
 */

export interface DatifyyEmailLogsType {
  primary: true;
  id: string;
  emailType: string;
  sentAt: Date;
  status: string;
  email: string;
}

// Utility types for DatifyyEmailLogs
export type CreateDatifyyEmailLogsInput = Omit<DatifyyEmailLogsType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDatifyyEmailLogsInput = Partial<Omit<DatifyyEmailLogsType, 'id' | 'createdAt' | 'updatedAt'>>;
export type DatifyyEmailLogsId = DatifyyEmailLogsType['id'];
