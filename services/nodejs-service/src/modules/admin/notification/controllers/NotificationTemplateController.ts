/**
 * Notification Template Controller
 * Handles notification template operations
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
  CreateNotificationTemplateRequest,
  UpdateNotificationTemplateRequest,
  NotificationTemplateResponse,
  TestNotificationRequest
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

export class NotificationTemplateController {
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
   * GET /admin/notifications/templates
   * Get all notification templates
   */
  async getAllTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Get all templates request received', {
        requestId,
        adminId: req.user?.id
      });

      const templates = await this.notificationService.getAllTemplates();

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationTemplateResponse[]> = {
        success: true,
        message: 'Templates retrieved successfully',
        data: templates,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get all templates error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * POST /admin/notifications/templates
   * Create a new notification template
   */
  async createTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info('Create template request received', {
        requestId,
        adminId: req.user?.id,
        templateName: req.body.name
      });

      const createRequest: CreateNotificationTemplateRequest = req.body;
      const template = await this.notificationService.createTemplate(
        createRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationTemplateResponse> = {
        success: true,
        message: 'Template created successfully',
        data: template,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(201).json(response);

    } catch (error: any) {
      this.logger.error('Create template error', {
        requestId,
        adminId: req.user?.id,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * GET /admin/notifications/templates/:templateId
   * Get specific template details
   */
  async getTemplateById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { templateId } = req.params;
      
      this.logger.info('Get template by ID request received', {
        requestId,
        adminId: req.user?.id,
        templateId
      });

      const template = await this.notificationService.getTemplateById(templateId);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationTemplateResponse> = {
        success: true,
        message: 'Template retrieved successfully',
        data: template,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Get template by ID error', {
        requestId,
        adminId: req.user?.id,
        templateId: req.params.templateId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * PUT /admin/notifications/templates/:templateId
   * Update notification template
   */
  async updateTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { templateId } = req.params;
      
      this.logger.info('Update template request received', {
        requestId,
        adminId: req.user?.id,
        templateId
      });

      const updateRequest: UpdateNotificationTemplateRequest = req.body;
      const template = await this.notificationService.updateTemplate(
        templateId,
        updateRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationTemplateResponse> = {
        success: true,
        message: 'Template updated successfully',
        data: template,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Update template error', {
        requestId,
        adminId: req.user?.id,
        templateId: req.params.templateId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * DELETE /admin/notifications/templates/:templateId
   * Delete notification template
   */
  async deleteTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { templateId } = req.params;
      
      this.logger.info('Delete template request received', {
        requestId,
        adminId: req.user?.id,
        templateId
      });

      await this.notificationService.deleteTemplate(templateId, req.user!.id);

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Template deleted successfully',
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Delete template error', {
        requestId,
        adminId: req.user?.id,
        templateId: req.params.templateId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * POST /admin/notifications/templates/:templateId/duplicate
   * Duplicate an existing template
   */
  async duplicateTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { templateId } = req.params;
      
      this.logger.info('Duplicate template request received', {
        requestId,
        adminId: req.user?.id,
        templateId
      });

      const template = await this.notificationService.duplicateTemplate(
        templateId,
        req.body.name,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse<NotificationTemplateResponse> = {
        success: true,
        message: 'Template duplicated successfully',
        data: template,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(201).json(response);

    } catch (error: any) {
      this.logger.error('Duplicate template error', {
        requestId,
        adminId: req.user?.id,
        templateId: req.params.templateId,
        error: error.message
      });
      next(error);
    }
  }

  /**
   * POST /admin/notifications/templates/:templateId/test
   * Test a notification template
   */
  async testTemplate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const { templateId } = req.params;
      
      this.logger.info('Test template request received', {
        requestId,
        adminId: req.user?.id,
        templateId
      });

      const testRequest: TestNotificationRequest = req.body;
      const result = await this.notificationService.testTemplate(
        templateId,
        testRequest,
        req.user!.id
      );

      const processingTime = Date.now() - startTime;

      const response: ApiResponse = {
        success: true,
        message: 'Template test sent successfully',
        data: result,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      this.logger.error('Test template error', {
        requestId,
        adminId: req.user?.id,
        templateId: req.params.templateId,
        error: error.message
      });
      next(error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}