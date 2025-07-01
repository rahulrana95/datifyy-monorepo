export interface TableInfo {
  tableName: string;
}

export interface EnumInfo {
  enumName: string;
  enumValues: string[];
}

export interface EnumUpdateRequest {
  name: string;
  values: string[];
}

export interface EnumUpdateResult {
  name: string;
  message?: string;
  updatedValues?: string[];
}

export interface EmailStatus {
  email: string;
  logs: EmailLog[];
}

export interface EmailLog {
  id: number;
  email: string;
  status: string;
  sentAt: Date;
  // Add other fields as needed
}