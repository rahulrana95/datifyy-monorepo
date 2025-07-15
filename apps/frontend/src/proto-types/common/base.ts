// Auto-generated from proto/common/base.proto
// Generated at: 2025-07-15T14:41:46.188Z

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetails;
  metadata?: ResponseMetadata;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: string;
  processingTime?: number;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  coordinates?: Coordinates;
  formatted_address?: string;
  is_approximate?: boolean;
  timezone?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface DistanceInfo {
  distance: number;
  unit: 'km' | 'miles';
}

export interface AgeInfo {
  age: number;
  dateOfBirth: string;
}

export interface LastSeenInfo {
  lastSeen: string;
  isOnline: boolean;
}
