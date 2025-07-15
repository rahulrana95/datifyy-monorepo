// =============================================================================
// 2. Updated Controller Implementation
// =============================================================================

// FILE: controllers/DateCurationController.ts (UPDATED METHODS)
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { AuthenticatedRequest } from '../../../infrastructure/middleware/authentication';

// ✅ Import specific DTOs (following your DTO pattern)
import {
  CreateCuratedDateDto,
  UpdateCuratedDateDto,
  ConfirmDateDto,
  CancelDateDto,
  SubmitFeedbackDto,
  GetUserDatesQueryDto,
  AdminGetDatesQueryDto,
  SearchPotentialMatchesDto,
  DateCurationAnalyticsQueryDto
} from '../dtos';
import { DateCurationRepository } from '../repositories/DateCurationRepository';
import { DateCurationMapper } from '../mappers/DateCurationMapper';
import { DateCurationService, IDateCurationService } from '../services/DateCurationService';
import { GetUserDatesRequest } from '../repositories/DateCurationRepository';

export class DateCurationController {
  private dateCurationService: IDateCurationService;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    // Initialize service (following your existing DI pattern)
    const repository = new DateCurationRepository(dataSource, logger);
    const mapper = new DateCurationMapper(logger);
    this.dateCurationService = new DateCurationService(repository, mapper, logger);
  }

  /**
   * POST /admin/curated-dates
   * ✅ Using typed DTO with validation
   */
  async createCuratedDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      
      // ✅ Request body is already validated and typed as CreateCuratedDateDto
      const createData = req.body as CreateCuratedDateDto;

      this.logger.info('Admin creating curated date', { 
        adminId, 
        user1Id: createData.user1Id, 
        user2Id: createData.user2Id,
        mode: createData.mode,
        dateTime: createData.dateTime
      });

      const result = await this.dateCurationService.createCuratedDate(adminId, createData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Curated date created successfully',
        timestamp: new Date().toISOString(),
        requestId: (req as any).id
      });

    } catch (error) {
      this.logger.error('Failed to create curated date', { 
        error, 
        adminId: req.user?.id,
        requestBody: req.body
      });
      next(error);
    }
  }

  /**
   * GET /my-dates
   * ✅ Using typed query DTO with validation
   */
  async getUserDates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      
      // ✅ Query params are already validated and typed as GetUserDatesQueryDto
      const filters: GetUserDatesRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status ? (req.query.status as string).split(',') as any : undefined,
        mode: req.query.mode ? (req.query.mode as string).split(',') as any : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        includeHistory: req.query.includeHistory === 'true',
        includeFeedback: req.query.includeFeedback === 'true',
        includePartnerInfo: req.query.includePartnerInfo === 'true'
      };

      this.logger.info('Getting user dates', { userId, filters });

      const response = await this.dateCurationService.getUserDates(userId, filters);

      res.status(200).json(response);

    } catch (error) {
      this.logger.error('Failed to get user dates', { 
        error, 
        userId: req.user?.id,
        query: req.query
      });
      next(error);
    }
  }

  /**
   * POST /my-dates/:dateId/confirm
   * ✅ Using typed confirmation DTO
   */
  async confirmDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      
      // ✅ Request body is already validated and typed as ConfirmDateDto
      const confirmData = req.body as ConfirmDateDto;

      this.logger.info('Confirming date', { 
        userId, 
        dateId, 
        confirmed: confirmData.confirmed,
        hasNotes: !!confirmData.notes
      });

      const result = await this.dateCurationService.confirmDate(userId, dateId, confirmData);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
        requestId: (req as any).id
      });

    } catch (error) {
      this.logger.error('Failed to confirm date', { 
        error, 
        userId: req.user?.id, 
        dateId: req.params.dateId 
      });
      next(error);
    }
  }

  /**
   * POST /my-dates/:dateId/feedback
   * ✅ Using comprehensive feedback DTO
   */
  async submitDateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      
      // ✅ Request body is already validated and typed as SubmitFeedbackDto
      const feedback = req.body as SubmitFeedbackDto;

      this.logger.info('Submitting date feedback', { 
        userId, 
        dateId, 
        overallRating: feedback.overallRating,
        wouldMeetAgain: feedback.wouldMeetAgain,
        safetyConcerns: feedback.safetyConcerns,
        reportUser: feedback.reportUser
      });

      const result = await this.dateCurationService.submitDateFeedback(userId, dateId, feedback);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Feedback submitted successfully',
        timestamp: new Date().toISOString(),
        requestId: (req as any).id
      });

    } catch (error) {
      this.logger.error('Failed to submit feedback', { 
        error, 
        userId: req.user?.id, 
        dateId: req.params.dateId 
      });
      next(error);
    }
  }
}