/**
 * Core Notification Controller
 * Handles basic CRUD operations for notifications
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
  CreateNotificationRequest,
  GetNotificationsRequest,
  UpdateNotificationRequest,
  NotificationResponse
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

export class NotificationController {
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
   * POST /admin/notifications
   * Create and send a new notification
   */
  async createNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Create notification request received', {
        requestId,
        adminId: req.user?.id,
        triggerEvent: req.body.triggerEvent
      });

      const createRequest: CreateNotificationRequest = req.body;
      const notification = await this.notificationService.createNotification(
        createRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationResponse> = {
        success: true,
        message: 'Notification created and sent successfully',
        data: {
          success: true,
          message: 'Notification created and sent successfully',
          data: notification
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(201).json(response);

    } catch (error: any) {
      this.logger.error('Create notification error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications
   * Get all notifications with filtering and pagination
   */
  async getAllNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get all notifications request received', {
        requestId,
        adminId: req.user?.id
      });

      const query: GetNotificationsRequest = req.query as any;
      const result = await this.notificationService.getAllNotifications(query);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Notifications retrieved successfully',
        data: result,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get all notifications error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/:notificationId
   * Get specific notification details
   */
  async getNotificationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { notificationId } = req.params;
      
      this.logger.info('Get notification by ID request received', {
        requestId,
        adminId: req.user?.id,
        notificationId
      });

      const notification = await this.notificationService.getNotificationById(notificationId);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationResponse> = {
        success: true,
        message: 'Notification retrieved successfully',
        data: {
          success: true,
          message: 'Notification retrieved successfully',
          data: notification
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get notification by ID error', {
        requestId,
        adminId: req.user?.id,
        notificationId: req.params.notificationId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * PUT /admin/notifications/:notificationId
   * Update notification status or details
   */
  async updateNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { notificationId } = req.params;
      
      this.logger.info('Update notification request received', {
        requestId,
        adminId: req.user?.id,
        notificationId
      });

      const updateRequest: UpdateNotificationRequest = req.body;
      const notification = await this.notificationService.updateNotification(
        notificationId,
        updateRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationResponse> = {
        success: true,
        message: 'Notification updated successfully',
        data: {
          success: true,
          message: 'Notification updated successfully',
          data: notification
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Update notification error', {
        requestId,
        adminId: req.user?.id,
        notificationId: req.params.notificationId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * DELETE /admin/notifications/:notificationId
   * Delete a notification
   */
  async deleteNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { notificationId } = req.params;
      
      this.logger.info('Delete notification request received', {
        requestId,
        adminId: req.user?.id,
        notificationId
      });

      await this.notificationService.deleteNotification(notificationId, req.user!.id);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Notification deleted successfully',
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Delete notification error', {
        requestId,
        adminId: req.user?.id,
        notificationId: req.params.notificationId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * POST /admin/notifications/:notificationId/retry
   * Retry sending a failed notification
   */
  async retryNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { notificationId } = req.params;
      
      this.logger.info('Retry notification request received', {
        requestId,
        adminId: req.user?.id,
        notificationId
      });

      const notification = await this.notificationService.retryNotification(
        notificationId,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationResponse> = {
        success: true,
        message: 'Notification retry initiated successfully',
        data: {
          success: true,
          message: 'Notification retry initiated successfully',
          data: notification
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Retry notification error', {
        requestId,
        adminId: req.user?.id,
        notificationId: req.params.notificationId,
        error: error.message
      });
      next(error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}