import { ApiResponse } from '@datifyy/shared-types';

export interface UserStatsOverview {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersOnProbation: number;
  suspendedUsers: number;
  deletedUsers: number;
}

export interface UsersByStatus {
  active: number;
  deactivated: number;
  locked: number;
  pending: number;
  suspended: number;
}

export interface UsersByGender {
  male: number;
  female: number;
  other: number;
  notSpecified: number;
}

export interface UsersByVerification {
  emailVerified: number;
  phoneVerified: number;
  idVerified: number;
  fullyVerified: number;
  unverified: number;
}

export interface UsersByLocation {
  topCities: Array<{
    city: string;
    userCount: number;
    percentage: number;
  }>;
  topCountries: Array<{
    country: string;
    userCount: number;
    percentage: number;
  }>;
}

export interface UserEngagementStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  averageLoginsPerUser: number;
  usersWithDates: number;
  usersWithoutDates: number;
}

export interface TrustScoreDistribution {
  excellent: number; // 90-100
  good: number; // 75-89
  average: number; // 50-74
  poor: number; // 25-49
  critical: number; // 0-24
  averageScore: number;
  medianScore: number;
}

export interface UserGrowthTrends {
  dailySignups: Array<{
    date: string;
    signups: number;
    activations: number;
  }>;
  weeklyGrowth: Array<{
    week: string;
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
  }>;
  monthlyGrowth: Array<{
    month: string;
    newUsers: number;
    activeUsers: number;
    churnRate: number;
  }>;
}

export interface UserStatsData {
  overview: UserStatsOverview;
  byStatus: UsersByStatus;
  byGender: UsersByGender;
  byVerification: UsersByVerification;
  byLocation: UsersByLocation;
  engagement: UserEngagementStats;
  trustScoreDistribution: TrustScoreDistribution;
  growthTrends: UserGrowthTrends;
  lastUpdated: string;
}

export type UserStatsResponseDto = ApiResponse<UserStatsData>;