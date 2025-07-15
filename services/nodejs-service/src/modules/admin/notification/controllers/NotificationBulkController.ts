/**
 * Notification Bulk Operations Controller
 * Handles bulk notification operations
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
  BulkNotificationRequest,
  BulkNotificationResponse
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

export class NotificationBulkController {
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
   * POST /admin/notifications/bulk-send
   * Send notifications to multiple recipients
   */
  async sendBulkNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Bulk send notifications request received', {
        requestId,
        adminId: req.user?.id,
        recipientCount: req.body.recipients?.length || 0
      });

      const bulkRequest: BulkNotificationRequest = req.body;
      const result = await this.notificationService.sendBulkNotifications(
        bulkRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<BulkNotificationResponse> = {
        success: true,
        message: 'Bulk notifications sent successfully',
        data: result,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Bulk send notifications error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * POST /admin/notifications/bulk-retry
   * Retry multiple failed notifications
   */
  async retryBulkNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Bulk retry notifications request received', {
        requestId,
        adminId: req.user?.id,
        notificationIds: req.body.notificationIds
      });

      const result = await this.notificationService.retryBulkNotifications(
        req.body.notificationIds,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Bulk notification retry initiated successfully',
        data: result,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Bulk retry notifications error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * PUT /admin/notifications/bulk-update
   * Update multiple notifications at once
   */
  async bulkUpdateNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Bulk update notifications request received', {
        requestId,
        adminId: req.user?.id,
        updateCount: req.body.updates?.length || 0
      });

      const result = await this.notificationService.bulkUpdateNotifications(
        req.body,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Bulk notifications updated successfully',
        data: result,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Bulk update notifications error', {
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