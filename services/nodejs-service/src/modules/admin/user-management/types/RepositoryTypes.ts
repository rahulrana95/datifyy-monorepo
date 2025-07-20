import { FindManyOptions, FindOneOptions } from 'typeorm';
import { GetUsersRequestDto, AdminUserListItem } from '../dtos';

export interface UserQueryFilters {
  search?: string;
  accountStatus?: string;
  gender?: string;
  verificationStatus?: string;
  city?: string;
  country?: string;
  minTrustScore?: number;
  maxTrustScore?: number;
  isOnProbation?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastActiveAfter?: Date;
  lastActiveBefore?: Date;
  minDatesAttended?: number;
  maxDatesAttended?: number;
  hasProfileIssues?: boolean;
}

export interface UserSortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface UserRepositoryFilters extends UserQueryFilters {
  pagination: PaginationOptions;
  sort: UserSortOptions;
}

export interface UserStatsFilters {
  startDate?: Date;
  endDate?: Date;
  city?: string;
  country?: string;
  gender?: string;
}

export interface UserUpdateResult {
  success: boolean;
  affectedRows: number;
  updatedUser?: any;
}