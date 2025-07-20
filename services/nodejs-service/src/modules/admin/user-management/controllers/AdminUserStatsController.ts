import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserStatsService, StatsFilters, StatsExportOptions } from '../services/AdminUserStatsService';

export interface AuthenticatedAdminRequest extends Request {
  admin: {
    id: number;
    email: string;
    permissionLevel: string;
    sessionId: string;
  };
}

export class AdminUserStatsController {
  private statsService: AdminUserStatsService;

  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {
    this.statsService = new AdminUserStatsService(dataSource, logger);
  }

  /**
   * GET /admin/user-management/stats
   * Get comprehensive user statistics
   */
  async getUserStats(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting user statistics', {
        adminId: req.admin.id,
        query: req.query
      });

      // Parse query parameters for filters
      const filters: StatsFilters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        city: req.query.city as string,
        country: req.query.country as string,
        gender: req.query.gender as string,
        accountStatus: req.query.accountStatus as string
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key as keyof StatsFilters] === undefined && delete filters[key as keyof StatsFilters]
      );

      const result = await this.statsService.getUserStats(
        Object.keys(filters).length > 0 ? filters : undefined,
        req.admin.id
      );

      res.status(200).json(result);
    } catch (error) {
      this.logger.error('Error in getUserStats controller', {
        error,
        adminId: req.admin.id,
        query: req.query
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/stats/dashboard
   * Get dashboard-specific statistics for quick overview
   */
  async getDashboardStats(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting dashboard statistics', {
        adminId: req.admin.id
      });

      const result = await this.statsService.getDashboardStats(req.admin.id);

      res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getDashboardStats controller', {
        error,
        adminId: req.admin.id
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/stats/segments
   * Get user segments analysis
   */
  async getUserSegments(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting user segments', {
        adminId: req.admin.id
      });

      const segments = await this.statsService.getUserSegments(req.admin.id);

      res.status(200).json({
        success: true,
        message: 'User segments retrieved successfully',
        data: {
          segments,
          totalSegments: segments.length,
          analysis: {
            largestSegment: segments.reduce((prev, current) => 
              prev.userCount > current.userCount ? prev : current
            ),
            smallestSegment: segments.reduce((prev, current) => 
              prev.userCount < current.userCount ? prev : current
            )
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getUserSegments controller', {
        error,
        adminId: req.admin.id
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/stats/cohorts
   * Get cohort analysis data
   */
  async getCohortAnalysis(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const monthsBack = req.query.months ? parseInt(req.query.months as string) : 6;

      if (monthsBack < 1 || monthsBack > 24) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_MONTHS_PARAMETER',
            message: 'Months parameter must be between 1 and 24'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting cohort analysis', {
        adminId: req.admin.id,
        monthsBack
      });

      const cohorts = await this.statsService.getCohortAnalysis(monthsBack, req.admin.id);

      res.status(200).json({
        success: true,
        message: 'Cohort analysis retrieved successfully',
        data: {
          cohorts,
          monthsAnalyzed: monthsBack,
          totalCohorts: cohorts.length,
          summary: {
            averageRetentionMonth1: cohorts.reduce((sum, c) => sum + c.retentionRates.month1, 0) / cohorts.length || 0,
            averageRetentionMonth3: cohorts.reduce((sum, c) => sum + c.retentionRates.month3, 0) / cohorts.length || 0,
            averageRetentionMonth6: cohorts.reduce((sum, c) => sum + c.retentionRates.month6, 0) / cohorts.length || 0
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getCohortAnalysis controller', {
        error,
        adminId: req.admin.id,
        monthsBack: req.query.months
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/stats/export
   * Export user statistics in various formats
   */
  async exportUserStats(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { format, includePersonalData, startDate, endDate, filters } = req.body;

      // Validate required fields
      if (!format || !['json', 'csv', 'excel'].includes(format)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'Format must be one of: json, csv, excel'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DATE_RANGE_REQUIRED',
            message: 'Start date and end date are required for export'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const exportOptions: StatsExportOptions = {
        format,
        includePersonalData: includePersonalData || false,
        dateRange: {
          start: new Date(startDate),
          end: new Date(endDate)
        },
        filters
      };

      this.logger.info('Admin exporting user statistics', {
        adminId: req.admin.id,
        exportOptions
      });

      const result = await this.statsService.exportUserStats(exportOptions, req.admin.id);

      res.status(200).json({
        success: result.success,
        message: result.message,
        data: {
          downloadUrl: result.downloadUrl,
          fileName: result.fileName,
          format,
          dateRange: exportOptions.dateRange,
          includePersonalData: exportOptions.includePersonalData
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'stats_export'
        }
      });
    } catch (error) {
      this.logger.error('Error in exportUserStats controller', {
        error,
        adminId: req.admin.id,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * POST /admin/user-management/stats/custom-query
   * Execute custom statistics query
   */
  async executeCustomQuery(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { metrics, filters, groupBy, timeRange } = req.body;

      // Validate required fields
      if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'METRICS_REQUIRED',
            message: 'Metrics array is required and must not be empty'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      if (!timeRange || !timeRange.start || !timeRange.end) {
        res.status(400).json({
          success: false,
          error: {
            code: 'TIME_RANGE_REQUIRED',
            message: 'Time range with start and end dates is required'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const query = {
        metrics,
        filters: filters || {},
        groupBy: groupBy || [],
        timeRange: {
          start: new Date(timeRange.start),
          end: new Date(timeRange.end)
        }
      };

      this.logger.info('Admin executing custom stats query', {
        adminId: req.admin.id,
        query
      });

      const results = await this.statsService.getCustomStatsQuery(query, req.admin.id);

      res.status(200).json({
        success: true,
        message: 'Custom query executed successfully',
        data: {
          results,
          query,
          resultCount: results.length
        },
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          action: 'custom_stats_query'
        }
      });
    } catch (error) {
      this.logger.error('Error in executeCustomQuery controller', {
        error,
        adminId: req.admin.id,
        body: req.body
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/stats/real-time
   * Get real-time statistics (cached for performance)
   */
  async getRealTimeStats(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.logger.info('Admin getting real-time statistics', {
        adminId: req.admin.id
      });

      // This would get cached real-time statistics
      // For now, return placeholder data
      const realTimeStats = {
        activeUsers: {
          online: 0,
          activeToday: 0,
          activeThisHour: 0
        },
        newSignups: {
          today: 0,
          thisHour: 0,
          lastHour: 0
        },
        dates: {
          scheduledToday: 0,
          inProgress: 0,
          completedToday: 0
        },
        trust: {
          averageScore: 0,
          criticalUsers: 0,
          probationUsers: 0
        },
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        message: 'Real-time statistics retrieved successfully',
        data: realTimeStats,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id,
          cacheStatus: 'hit' // or 'miss'
        }
      });
    } catch (error) {
      this.logger.error('Error in getRealTimeStats controller', {
        error,
        adminId: req.admin.id
      });
      next(error);
    }
  }

  /**
   * GET /admin/user-management/stats/trends
   * Get trending statistics and patterns
   */
  async getTrendingStats(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const period = req.query.period as string || 'week';
      const validPeriods = ['day', 'week', 'month', 'quarter'];

      if (!validPeriods.includes(period)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PERIOD',
            message: `Period must be one of: ${validPeriods.join(', ')}`
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      this.logger.info('Admin getting trending statistics', {
        adminId: req.admin.id,
        period
      });

      // This would calculate trending statistics based on the period
      // For now, return placeholder data
      const trends = {
        userGrowth: {
          rate: 0,
          direction: 'stable' as 'up' | 'down' | 'stable',
          previousPeriodComparison: 0
        },
        engagement: {
          dailyActiveUsers: 0,
          sessionDuration: 0,
          dateCompletionRate: 0
        },
        trustScores: {
          averageChange: 0,
          improvingUsers: 0,
          decliningUsers: 0
        },
        verification: {
          completionRate: 0,
          pendingVerifications: 0
        },
        period,
        dataPoints: [], // Would contain actual trend data points
        insights: [] // AI-generated insights about the trends
      };

      res.status(200).json({
        success: true,
        message: 'Trending statistics retrieved successfully',
        data: trends,
        metadata: {
          timestamp: new Date().toISOString(),
          adminId: req.admin.id
        }
      });
    } catch (error) {
      this.logger.error('Error in getTrendingStats controller', {
        error,
        adminId: req.admin.id,
        period: req.query.period
      });
      next(error);
    }
  }
}