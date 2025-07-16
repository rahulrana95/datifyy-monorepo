/**
 * Notification Analytics Controller
 * Handles notification analytics and reporting
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AuthenticatedRequest } from '../../../../infrastructure/middleware/authentication';
import { AdminNotificationsService } from '../services/AdminNotificationsService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { 
} from '../../../../proto-types/admin/notifications';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    processingTime?: number;
  };
}

export class NotificationAnalyticsController {
  private readonly logger: Logger;
  private readonly notificationService: AdminNotificationsService;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
    const notificationRepository = new NotificationRepository(this.dataSource);
    this.notificationService = new AdminNotificationsService(
      notificationRepository,
      this.logger
    );
  }

  /**
   * GET /admin/notifications/analytics
   * Get comprehensive notification analytics
   */
  async getNotificationAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get notification analytics request received', {
        requestId,
        adminId: req.user?.id
      });

      const analytics = await this.notificationService.getNotificationAnalytics(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<any> = {
        success: true,
        message: 'Notification analytics retrieved successfully',
        data: analytics,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get notification analytics error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/performance
   * Get notification performance metrics
   */
  async getPerformanceMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get performance metrics request received', {
        requestId,
        adminId: req.user?.id
      });

      const metrics = await this.notificationService.getPerformanceMetrics(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Performance metrics retrieved successfully',
        data: metrics,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get performance metrics error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/engagement
   * Get notification engagement metrics
   */
  async getEngagementMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get engagement metrics request received', {
        requestId,
        adminId: req.user?.id
      });

      const metrics = await this.notificationService.getEngagementMetrics(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Engagement metrics retrieved successfully',
        data: metrics,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get engagement metrics error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/cost
   * Get notification cost analysis
   */
  async getCostAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get cost analysis request received', {
        requestId,
        adminId: req.user?.id
      });

      const analysis = await this.notificationService.getCostAnalysis(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Cost analysis retrieved successfully',
        data: analysis,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get cost analysis error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/failure-analysis
   * Get notification failure analysis
   */
  async getFailureAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get failure analysis request received', {
        requestId,
        adminId: req.user?.id
      });

      const analysis = await this.notificationService.getFailureAnalysis(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Failure analysis retrieved successfully',
        data: analysis,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get failure analysis error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/channel-performance
   * Get channel-specific performance metrics
   */
  async getChannelPerformance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get channel performance request received', {
        requestId,
        adminId: req.user?.id
      });

      const performance = await this.notificationService.getChannelPerformance(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Channel performance retrieved successfully',
        data: performance,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get channel performance error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/delivery-trends
   * Get notification delivery trends
   */
  async getDeliveryTrends(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get delivery trends request received', {
        requestId,
        adminId: req.user?.id
      });

      const trends = await this.notificationService.getDeliveryTrends(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Delivery trends retrieved successfully',
        data: trends,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get delivery trends error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/analytics/summary
   * Get notification summary statistics
   */
  async getNotificationSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get notification summary request received', {
        requestId,
        adminId: req.user?.id
      });

      const summary = await this.notificationService.getNotificationSummary(req.query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Notification summary retrieved successfully',
        data: summary,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get notification summary error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}