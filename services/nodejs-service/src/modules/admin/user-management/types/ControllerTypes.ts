import { Request } from 'express';

export interface AuthenticatedAdminRequest extends Request {
  admin: {
    id: number;
    email: string;
    permissionLevel: string;
    sessionId: string;
  };
}

export interface AdminControllerResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    adminId?: number;
    action?: string;
    requestId?: string;
  };
}

export interface PaginatedControllerResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    metadata?: any;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    adminId?: number;
    action?: string;
    requestId?: string;
  };
}

export interface BulkOperationResponse {
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    successfulOperations: number;
    failedOperations: number;
    errors: Array<{
      itemId: string | number;
      error: string;
    }>;
    warnings?: string[];
  };
  metadata: {
    timestamp: string;
    adminId: number;
    action: string;
    requestId?: string;
  };
}

export interface ValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}