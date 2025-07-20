import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserStatsRepository } from '../repositories';
import { UserStatsResponseDto, UserStatsData } from '../dtos/response/UserStatsResponseDto';
import { UserStatsFilters } from '../types/RepositoryTypes';

export interface StatsFilters {
  startDate?: Date;
  endDate?: Date;
  city?: string;
  country?: string;
  gender?: string;
  accountStatus?: string;
}

export interface StatsExportOptions {
  format: 'json' | 'csv' | 'excel';
  includePersonalData: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: StatsFilters;
}

export interface UserSegment {
  name: string;
  description: string;
  userCount: number;
  percentage: number;
  characteristics: string[];
  recommendations: string[];
}

export interface UserCohortAnalysis {
  cohortMonth: string;
  initialUsers: number;
  retentionRates: {
    week1: number;
    month1: number;
    month3: number;
    month6: number;
  };
  engagementMetrics: {
    averageDatesPerUser: number;
    averageSessionsPerUser: number;
    conversionToFirstDate: number;
  };
}

export class AdminUserStatsService {
  private statsRepository: AdminUserStatsRepository;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.statsRepository = new AdminUserStatsRepository(dataSource, logger);
  }

  async getUserStats(
    filters?: StatsFilters,
    adminId?: number
  ): Promise<UserStatsResponseDto> {
    try {
      this.logger.info('Getting user statistics', { filters, adminId });

      // Convert filters to repository format
      const repoFilters = this.convertToRepositoryFilters(filters);

      // Get all stats components
      const [
        overview,
        byStatus,
        byGender,
        byVerification,
        byLocation,
        engagement,
        trustScoreDistribution,
        growthTrends
      ] = await Promise.all([
        this.statsRepository.getUserStatsOverview(repoFilters),
        this.statsRepository.getUsersByStatus(repoFilters),
        this.statsRepository.getUsersByGender(repoFilters),
        this.statsRepository.getUsersByVerification(repoFilters),
        this.statsRepository.getUsersByLocation(repoFilters),
        this.statsRepository.getUserEngagementStats(repoFilters),
        this.statsRepository.getTrustScoreDistribution(repoFilters),
        this.statsRepository.getUserGrowthTrends(30, repoFilters)
      ]);

      const statsData: UserStatsData = {
        overview,
        byStatus,
        byGender,
        byVerification,
        byLocation,
        engagement,
        trustScoreDistribution,
        growthTrends,
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        message: 'User statistics retrieved successfully',
        data: statsData,
        metadata: {
          requestId: this.generateRequestId(),
          timestamp: new Date().toISOString(),
          processingTime: 0 // Would be calculated in middleware
        }
      };
    } catch (error) {
      this.logger.error('Error getting user statistics', { error, filters, adminId });
      throw error;
    }
  }

  async getDashboardStats(adminId: number): Promise<{
    quickStats: {
      totalUsers: number;
      activeToday: number;
      newThisWeek: number;
      onProbation: number;
    };
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      count?: number;
      action?: string;
    }>;
    trends: {
      userGrowthRate: number;
      engagementRate: number;
      averageTrustScore: number;
    };
  }> {
    try {
      this.logger.info('Getting dashboard statistics', { adminId });

      const overview = await this.statsRepository.getUserStatsOverview();
      const engagement = await this.statsRepository.getUserEngagementStats();
      const trustDistribution = await this.statsRepository.getTrustScoreDistribution();

      // Calculate growth rate (simplified)
      const growthRate = overview.newUsersThisWeek > 0 && overview.newUsersThisMonth > 0 
        ? ((overview.newUsersThisWeek / (overview.newUsersThisMonth / 4)) - 1) * 100
        : 0;

      // Calculate engagement rate
      const engagementRate = overview.totalUsers > 0 
        ? (engagement.weeklyActiveUsers / overview.totalUsers) * 100 
        : 0;

      // Generate alerts
      const alerts = [];
      
      if (overview.suspendedUsers > overview.totalUsers * 0.05) { // More than 5% suspended
        alerts.push({
          type: 'warning' as const,
          message: 'High number of suspended users',
          count: overview.suspendedUsers,
          action: 'Review suspension reasons'
        });
      }

      if (overview.usersOnProbation > overview.totalUsers * 0.1) { // More than 10% on probation
        alerts.push({
          type: 'error' as const,
          message: 'High number of users on probation',
          count: overview.usersOnProbation,
          action: 'Review probation cases'
        });
      }

      if (overview.unverifiedUsers > overview.totalUsers * 0.3) { // More than 30% unverified
        alerts.push({
          type: 'info' as const,
          message: 'Many users pending verification',
          count: overview.unverifiedUsers,
          action: 'Process verification queue'
        });
      }

      if (trustDistribution.critical > 0) {
        alerts.push({
          type: 'error' as const,
          message: 'Users with critical trust scores',
          count: trustDistribution.critical,
          action: 'Review critical users immediately'
        });
      }

      return {
        quickStats: {
          totalUsers: overview.totalUsers,
          activeToday: overview.activeUsers,
          newThisWeek: overview.newUsersThisWeek,
          onProbation: overview.usersOnProbation
        },
        alerts,
        trends: {
          userGrowthRate: Math.round(growthRate * 100) / 100,
          engagementRate: Math.round(engagementRate * 100) / 100,
          averageTrustScore: Math.round(trustDistribution.averageScore * 100) / 100
        }
      };
    } catch (error) {
      this.logger.error('Error getting dashboard statistics', { error, adminId });
      throw error;
    }
  }

  async getUserSegments(adminId: number): Promise<UserSegment[]> {
    try {
      this.logger.info('Getting user segments', { adminId });

      const [overview, trustDistribution, engagement] = await Promise.all([
        this.statsRepository.getUserStatsOverview(),
        this.statsRepository.getTrustScoreDistribution(),
        this.statsRepository.getUserEngagementStats()
      ]);

      const segments: UserSegment[] = [];

      // High-value users segment
      segments.push({
        name: 'High-Value Users',
        description: 'Users with excellent trust scores and high engagement',
        userCount: trustDistribution.excellent,
        percentage: Math.round((trustDistribution.excellent / overview.totalUsers) * 100),
        characteristics: [
          'Trust score 90+',
          'Regular platform usage',
          'Positive feedback from dates',
          'Complete profiles'
        ],
        recommendations: [
          'Offer premium features',
          'Use as platform ambassadors',
          'Gather product feedback'
        ]
      });

      // At-risk users segment
      const atRiskCount = trustDistribution.poor + trustDistribution.critical;
      segments.push({
        name: 'At-Risk Users',
        description: 'Users with low trust scores requiring intervention',
        userCount: atRiskCount,
        percentage: Math.round((atRiskCount / overview.totalUsers) * 100),
        characteristics: [
          'Trust score below 50',
          'High cancellation rates',
          'Poor feedback scores',
          'May be on probation'
        ],
        recommendations: [
          'Provide coaching and education',
          'Monitor closely',
          'Consider intervention programs',
          'Review for potential suspension'
        ]
      });

      // New users segment
      segments.push({
        name: 'New Users',
        description: 'Recently joined users in onboarding phase',
        userCount: overview.newUsersThisMonth,
        percentage: Math.round((overview.newUsersThisMonth / overview.totalUsers) * 100),
        characteristics: [
          'Registered within last 30 days',
          'May have incomplete profiles',
          'Limited platform experience'
        ],
        recommendations: [
          'Focus on onboarding experience',
          'Provide guidance and tutorials',
          'Monitor early engagement patterns'
        ]
      });

      // Inactive users segment
      const inactiveCount = overview.totalUsers - engagement.monthlyActiveUsers;
      segments.push({
        name: 'Inactive Users',
        description: 'Users who haven\'t been active recently',
        userCount: inactiveCount,
        percentage: Math.round((inactiveCount / overview.totalUsers) * 100),
        characteristics: [
          'No activity in 30+ days',
          'May have had bad experiences',
          'Potential churn risk'
        ],
        recommendations: [
          'Run re-engagement campaigns',
          'Analyze churn reasons',
          'Offer incentives to return',
          'Survey for feedback'
        ]
      });

      return segments;
    } catch (error) {
      this.logger.error('Error getting user segments', { error, adminId });
      throw error;
    }
  }

  async getCohortAnalysis(
    monthsBack = 6,
    adminId?: number
  ): Promise<UserCohortAnalysis[]> {
    try {
      this.logger.info('Getting cohort analysis', { monthsBack, adminId });

      // This would require more complex queries to track user cohorts over time
      // For now, returning placeholder data structure
      
      const cohorts: UserCohortAnalysis[] = [];
      const now = new Date();

      for (let i = 0; i < monthsBack; i++) {
        const cohortDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const cohortMonth = cohortDate.toISOString().substring(0, 7); // YYYY-MM format

        // This would be calculated from actual data
        cohorts.push({
          cohortMonth,
          initialUsers: 0, // Would calculate actual numbers
          retentionRates: {
            week1: 0,
            month1: 0,
            month3: 0,
            month6: 0
          },
          engagementMetrics: {
            averageDatesPerUser: 0,
            averageSessionsPerUser: 0,
            conversionToFirstDate: 0
          }
        });
      }

      return cohorts;
    } catch (error) {
      this.logger.error('Error getting cohort analysis', { error, monthsBack, adminId });
      throw error;
    }
  }

  async exportUserStats(
    options: StatsExportOptions,
    adminId: number
  ): Promise<{
    success: boolean;
    downloadUrl?: string;
    fileName?: string;
    message: string;
  }> {
    try {
      this.logger.info('Exporting user statistics', { options, adminId });

      // Validate export options
      if (!options.format || !['json', 'csv', 'excel'].includes(options.format)) {
        throw new Error('Invalid export format');
      }

      // Get stats data with filters
      const repoFilters = this.convertToRepositoryFilters(options.filters);
      const statsData = await this.getAllStatsForExport(repoFilters, options.includePersonalData);

      // Generate export file
      const fileName = this.generateExportFileName(options.format, options.dateRange);
      const exportResult = await this.generateExportFile(statsData, options);

      // In a real implementation, this would:
      // 1. Generate the file in the specified format
      // 2. Store it in cloud storage (S3, etc.)
      // 3. Return a signed URL for download
      // 4. Schedule cleanup of the file after some time

      return {
        success: true,
        downloadUrl: `/api/v1/admin/exports/${exportResult.fileId}`, // Placeholder
        fileName,
        message: 'Export generated successfully'
      };
    } catch (error) {
      this.logger.error('Error exporting user statistics', { error, options, adminId });
      throw error;
    }
  }

  async getCustomStatsQuery(
    query: {
      metrics: string[];
      filters: Record<string, any>;
      groupBy: string[];
      timeRange: { start: Date; end: Date };
    },
    adminId: number
  ): Promise<any[]> {
    try {
      this.logger.info('Executing custom stats query', { query, adminId });

      // This would allow admins to create custom queries for specific insights
      // For security, this would need careful validation and sanitization
      // For now, return placeholder

      return [];
    } catch (error) {
      this.logger.error('Error executing custom stats query', { error, query, adminId });
      throw error;
    }
  }

  private convertToRepositoryFilters(filters?: StatsFilters): UserStatsFilters | undefined {
    if (!filters) return undefined;

    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      city: filters.city,
      country: filters.country,
      gender: filters.gender
    };
  }

  private async getAllStatsForExport(
    filters?: UserStatsFilters,
    includePersonalData = false
  ): Promise<any> {
    // This would gather all necessary data for export
    const statsData = await this.statsRepository.getUserStatsOverview(filters);
    
    // Would include additional detailed data based on includePersonalData flag
    return statsData;
  }

  private generateExportFileName(format: string, dateRange: { start: Date; end: Date }): string {
    const startDate = dateRange.start.toISOString().split('T')[0];
    const endDate = dateRange.end.toISOString().split('T')[0];
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `user_stats_${startDate}_to_${endDate}_exported_${timestamp}.${format}`;
  }

  private async generateExportFile(data: any, options: StatsExportOptions): Promise<{ fileId: string }> {
    // This would generate the actual export file
    // For now, return a placeholder file ID
    return {
      fileId: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  private generateRequestId(): string {
    return `admin-stats-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}