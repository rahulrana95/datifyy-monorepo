// services/nodejs-service/src/modules/dateCuration/controllers/DateCurationController.ts
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';
import { AuthenticatedRequest } from '../../../infrastructure/middleware/authentication';
import { IDateCurationService, DateCurationService } from '../services/DateCurationService';
import { DateCurationRepository } from '../repositories/DateCurationRepository';
import { DateCurationMapper } from '../mappers/DateCurationMapper';
import {
  CreateCuratedDateRequest,
  UpdateCuratedDateRequest,
  ConfirmDateRequest,
  CancelDateRequest,
  SubmitDateFeedbackRequest,
  GetUserDatesRequest,
  AdminGetDatesRequest,
  SearchPotentialMatchesRequest,
  DateCurationAnalyticsRequest
} from '@datifyy/shared-types';

export class DateCurationController {
  private dateCurationService: IDateCurationService;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    // Initialize dependencies following your existing DI pattern
    const repository = new DateCurationRepository(dataSource, logger);
    const mapper = new DateCurationMapper(logger);
    this.dateCurationService = new DateCurationService(repository, mapper, logger);
    
    this.logger.info('DateCurationController initialized');
  }

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================

  /**
   * GET /date-curation/my-dates
   * Get current user's curated dates
   */
  async getUserDates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
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
      this.logger.error('Failed to get user dates', { error, userId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/my-dates/:dateId
   * Get specific curated date details
   */
  async getUserDateById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);

      this.logger.info('Getting user date by ID', { userId, dateId });

      const dateResponse = await this.dateCurationService.getUserDateById(userId, dateId);

      res.status(200).json({
        success: true,
        data: dateResponse
      });
    } catch (error) {
      this.logger.error('Failed to get user date', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'DATE_NOT_FOUND',
            message: 'Date not found or not accessible'
          }
        });
        return;
      }
      
      next(error);
    }
  }

  /**
   * POST /date-curation/my-dates/:dateId/confirm
   * User confirms their attendance for a curated date
   */
  async confirmDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      const confirmData: ConfirmDateRequest = req.body;

      this.logger.info('Confirming date', { userId, dateId, confirmed: confirmData.confirmed });

      const result = await this.dateCurationService.confirmDate(userId, dateId, confirmData);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to confirm date', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: {
              code: 'DATE_NOT_FOUND',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('already confirmed') || error.message.includes('already passed')) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_CONFIRMATION',
              message: error.message
            }
          });
          return;
        }
      }
      
      next(error);
    }
  }

  /**
   * POST /date-curation/my-dates/:dateId/cancel
   * User cancels their curated date
   */
  async cancelDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      const cancelData: CancelDateRequest = req.body;

      this.logger.info('Cancelling date', { userId, dateId, category: cancelData.category });

      const result = await this.dateCurationService.cancelDate(userId, dateId, cancelData);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to cancel date', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: {
              code: 'DATE_NOT_FOUND',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('already cancelled') || error.message.includes('completed')) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_CANCELLATION',
              message: error.message
            }
          });
          return;
        }
      }
      
      next(error);
    }
  }

  /**
   * POST /date-curation/my-dates/:dateId/feedback
   * User submits feedback after completing a date
   */
  async submitDateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      const feedback: SubmitDateFeedbackRequest = req.body;

      this.logger.info('Submitting date feedback', { userId, dateId, overallRating: feedback.overallRating });

      const result = await this.dateCurationService.submitDateFeedback(userId, dateId, feedback);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      this.logger.error('Failed to submit feedback', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: {
              code: 'DATE_NOT_FOUND',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('already submitted') || error.message.includes('not completed')) {
          res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_FEEDBACK_SUBMISSION',
              message: error.message
            }
          });
          return;
        }
      }
      
      next(error);
    }
  }

  /**
   * GET /date-curation/my-dates/:dateId/feedback
   * Get user's feedback for a specific date
   */
  async getUserDateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);

      this.logger.info('Getting user date feedback', { userId, dateId });

      const feedback = await this.dateCurationService.getUserDateFeedback(userId, dateId);

      res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      this.logger.error('Failed to get user feedback', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'FEEDBACK_NOT_FOUND',
            message: 'Feedback not found'
          }
        });
        return;
      }
      
      next(error);
    }
  }

  /**
   * PUT /date-curation/my-dates/:dateId/feedback
   * Update user's feedback for a specific date
   */
  async updateDateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      const feedback: SubmitDateFeedbackRequest = req.body;

      this.logger.info('Updating date feedback', { userId, dateId });

      const result = await this.dateCurationService.updateDateFeedback(userId, dateId, feedback);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Feedback updated successfully'
      });
    } catch (error) {
      this.logger.error('Failed to update feedback', { error, userId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: {
              code: 'FEEDBACK_NOT_FOUND',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('no longer be edited')) {
          res.status(400).json({
            success: false,
            error: {
              code: 'FEEDBACK_EDIT_EXPIRED',
              message: error.message
            }
          });
          return;
        }
      }
      
      next(error);
    }
  }

  /**
   * GET /date-curation/my-trust-score
   * Get current user's trust/love score details
   */
  async getUserTrustScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      this.logger.info('Getting user trust score', { userId });

      const trustScore = await this.dateCurationService.getUserTrustScore(userId);

      res.status(200).json({
        success: true,
        data: trustScore
      });
    } catch (error) {
      this.logger.error('Failed to get user trust score', { error, userId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/my-date-series
   * Get all date series for current user
   */
  async getUserDateSeries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      this.logger.info('Getting user date series', { userId });

      const dateSeries = await this.dateCurationService.getUserDateSeries(userId);

      res.status(200).json({
        success: true,
        data: dateSeries
      });
    } catch (error) {
      this.logger.error('Failed to get user date series', { error, userId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/my-date-series/:seriesId
   * Get specific date series details
   */
  async getDateSeriesById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const seriesId = req.params.seriesId;

      this.logger.info('Getting date series by ID', { userId, seriesId });

      const series = await this.dateCurationService.getDateSeriesById(userId, seriesId);

      res.status(200).json({
        success: true,
        data: series
      });
    } catch (error) {
      this.logger.error('Failed to get date series', { error, userId: req.user?.id, seriesId: req.params.seriesId });
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SERIES_NOT_FOUND',
            message: 'Date series not found'
          }
        });
        return;
      }
      
      next(error);
    }
  }

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================

  /**
   * POST /date-curation/admin/curated-dates
   * Admin creates a new curated date between two users
   */
  async createCuratedDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const createData: CreateCuratedDateRequest = req.body;

      this.logger.info('Admin creating curated date', { adminId, user1Id: createData.user1Id, user2Id: createData.user2Id });

      const result = await this.dateCurationService.createCuratedDate(adminId, createData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Curated date created successfully'
      });
    } catch (error) {
      this.logger.error('Failed to create curated date', { error, adminId: req.user?.id });
      
      if (error instanceof Error && error.message.includes('conflicts detected')) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DATE_CONFLICTS',
            message: error.message
          }
        });
        return;
      }
      
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/curated-dates
   * Admin gets all curated dates with filters
   */
  async getAdminCuratedDates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: AdminGetDatesRequest = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status ? (req.query.status as string).split(',') as any : undefined,
        mode: req.query.mode ? (req.query.mode as string).split(',') as any : undefined,
        curatedBy: req.query.curatedBy ? parseInt(req.query.curatedBy as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        user1Id: req.query.user1Id ? parseInt(req.query.user1Id as string) : undefined,
        user2Id: req.query.user2Id ? parseInt(req.query.user2Id as string) : undefined,
        includeWorkflow: req.query.includeWorkflow === 'true',
        includeFeedback: req.query.includeFeedback === 'true'
      };

      this.logger.info('Getting admin curated dates', { adminId: req.user!.id, filters });

      const { dates, total } = await this.dateCurationService.getAdminCuratedDates(filters);

      res.status(200).json({
        success: true,
        data: {
          items: dates,
          total,
          page: filters.page || 1,
          limit: filters.limit || 20,
          totalPages: Math.ceil(total / (filters.limit || 20))
        }
      });
    } catch (error) {
      this.logger.error('Failed to get admin curated dates', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/curated-dates/:dateId
   * Admin gets specific curated date with full details
   */
  async getAdminCuratedDateById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dateId = parseInt(req.params.dateId);

      this.logger.info('Getting admin curated date by ID', { adminId: req.user!.id, dateId });

      const date = await this.dateCurationService.getAdminCuratedDateById(dateId);

      res.status(200).json({
        success: true,
        data: date
      });
    } catch (error) {
      this.logger.error('Failed to get admin curated date', { error, adminId: req.user?.id, dateId: req.params.dateId });
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'DATE_NOT_FOUND',
            message: 'Curated date not found'
          }
        });
        return;
      }
      
      next(error);
    }
  }

  /**
   * PUT /date-curation/admin/curated-dates/:dateId
   * Admin updates curated date details
   */
  async updateCuratedDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const dateId = parseInt(req.params.dateId);
      const updateData: UpdateCuratedDateRequest = req.body;

      this.logger.info('Admin updating curated date', { adminId, dateId });

      const result = await this.dateCurationService.updateCuratedDate(adminId, dateId, updateData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Curated date updated successfully'
      });
    } catch (error) {
      this.logger.error('Failed to update curated date', { error, adminId: req.user?.id, dateId: req.params.dateId });
      next(error);
    }
  }

  /**
   * DELETE /date-curation/admin/curated-dates/:dateId
   * Admin deletes/cancels a curated date
   */
  async deleteCuratedDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const dateId = parseInt(req.params.dateId);

      this.logger.info('Admin deleting curated date', { adminId, dateId });

      await this.dateCurationService.deleteCuratedDate(adminId, dateId);

      res.status(200).json({
        success: true,
        message: 'Curated date deleted successfully'
      });
    } catch (error) {
      this.logger.error('Failed to delete curated date', { error, adminId: req.user?.id, dateId: req.params.dateId });
      next(error);
    }
  }

  /**
   * POST /date-curation/admin/search-potential-matches
   * Admin searches for potential matches for a user
   */
  async searchPotentialMatches(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: SearchPotentialMatchesRequest = req.body;

      this.logger.info('Searching potential matches', { adminId: req.user!.id, userId: filters.userId });

      const result = await this.dateCurationService.searchPotentialMatches(filters);

      res.status(200).json(result);
    } catch (error) {
      this.logger.error('Failed to search potential matches', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * POST /date-curation/admin/curated-dates/bulk-create
   * Admin creates multiple curated dates at once
   */
  async bulkCreateCuratedDates(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const requests: CreateCuratedDateRequest[] = req.body.dates;

      if (!Array.isArray(requests) || requests.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Dates array is required and must not be empty'
          }
        });
        return;
      }

      this.logger.info('Bulk creating curated dates', { adminId, count: requests.length });

      const result = await this.dateCurationService.bulkCreateCuratedDates(adminId, requests);

      res.status(200).json({
        success: true,
        data: result,
        message: `Bulk creation completed. ${result.successful} successful, ${result.failed} failed.`
      });
    } catch (error) {
      this.logger.error('Failed to bulk create curated dates', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/users/:userId/trust-score
   * Admin gets user's trust score details
   */
  async getAdminUserTrustScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      this.logger.info('Admin getting user trust score', { adminId: req.user!.id, userId });

      const trustScore = await this.dateCurationService.getAdminUserTrustScore(userId);

      res.status(200).json({
        success: true,
        data: trustScore
      });
    } catch (error) {
      this.logger.error('Failed to get admin user trust score', { error, adminId: req.user?.id, userId: req.params.userId });
      next(error);
    }
  }

  /**
   * PUT /date-curation/admin/users/:userId/trust-score
   * Admin manually adjusts user's trust score
   */
  async updateUserTrustScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const userId = parseInt(req.params.userId);
      const updateData = req.body;

      this.logger.info('Admin updating user trust score', { adminId, userId });

      const result = await this.dateCurationService.updateUserTrustScore(adminId, userId, updateData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Trust score updated successfully'
      });
    } catch (error) {
      this.logger.error('Failed to update user trust score', { error, adminId: req.user?.id, userId: req.params.userId });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/date-series
   * Admin gets all date series with filters
   */
  async getAdminDateSeries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query;

      this.logger.info('Getting admin date series', { adminId: req.user!.id, filters });

      const result = await this.dateCurationService.getAdminDateSeries(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get admin date series', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * PUT /date-curation/admin/date-series/:seriesId
   * Admin updates date series (stage, notes, etc.)
   */
  async updateDateSeries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const seriesId = req.params.seriesId;
      const updateData = req.body;

      this.logger.info('Admin updating date series', { adminId, seriesId });

      const result = await this.dateCurationService.updateDateSeries(adminId, seriesId, updateData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Date series updated successfully'
      });
    } catch (error) {
      this.logger.error('Failed to update date series', { error, adminId: req.user?.id, seriesId: req.params.seriesId });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/analytics/date-curation
   * Admin gets comprehensive analytics for date curation
   */
  async getDateCurationAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: DateCurationAnalyticsRequest = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        groupBy: req.query.groupBy as 'day' | 'week' | 'month',
        includeUserStats: req.query.includeUserStats === 'true',
        includeFeedbackStats: req.query.includeFeedbackStats === 'true',
        includeSuccessMetrics: req.query.includeSuccessMetrics === 'true'
      };

      this.logger.info('Getting date curation analytics', { adminId: req.user!.id, filters });

      const result = await this.dateCurationService.getDateCurationAnalytics(filters);

      res.status(200).json(result);
    } catch (error) {
      this.logger.error('Failed to get date curation analytics', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/dashboard/date-curation
   * Admin gets dashboard overview for date curation
   */
  async getDateCurationDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.info('Getting date curation dashboard', { adminId: req.user!.id });

      const result = await this.dateCurationService.getDateCurationDashboard();

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get date curation dashboard', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/feedback/all
   * Admin gets all date feedback with filters
   */
  async getAllDateFeedback(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query;

      this.logger.info('Getting all date feedback', { adminId: req.user!.id, filters });

      const result = await this.dateCurationService.getAllDateFeedback(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get all date feedback', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/admin/reports/safety
   * Admin gets safety reports from date feedback
   */
  async getSafetyReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.info('Getting safety reports', { adminId: req.user!.id });

      const result = await this.dateCurationService.getSafetyReports();

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get safety reports', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * POST /date-curation/admin/users/:userId/probation
   * Admin puts user on probation or adjusts probation status
   */
  async updateUserProbationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const userId = parseInt(req.params.userId);
      const updateData = req.body;

      this.logger.info('Admin updating user probation status', { adminId, userId, isOnProbation: updateData.isOnProbation });

      const result = await this.dateCurationService.updateUserProbationStatus(adminId, userId, updateData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Probation status updated successfully'
      });
    } catch (error) {
      this.logger.error('Failed to update user probation status', { error, adminId: req.user?.id, userId: req.params.userId });
      next(error);
    }
  }

  // ============================================================================
  // WORKFLOW ENDPOINTS
  // ============================================================================

  /**
   * GET /date-curation/admin/workflow/pending
   * Get pending curation workflow tasks
   */
  async getPendingWorkflowTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;

      this.logger.info('Getting pending workflow tasks', { adminId });

      const result = await this.dateCurationService.getPendingWorkflowTasks(adminId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.logger.error('Failed to get pending workflow tasks', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * PUT /date-curation/admin/workflow/:workflowId/complete
   * Mark a workflow stage as complete
   */
  async completeWorkflowStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const workflowId = parseInt(req.params.workflowId);
      const updateData = req.body;

      this.logger.info('Completing workflow stage', { adminId, workflowId });

      const result = await this.dateCurationService.completeWorkflowStage(adminId, workflowId, updateData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Workflow stage completed successfully'
      });
    } catch (error) {
      this.logger.error('Failed to complete workflow stage', { error, adminId: req.user?.id, workflowId: req.params.workflowId });
      next(error);
    }
  }

  /**
   * POST /date-curation/admin/workflow/auto-reminders
   * Trigger automated reminders for upcoming dates
   */
  async triggerAutomatedReminders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;

      this.logger.info('Triggering automated reminders', { adminId });

      const result = await this.dateCurationService.triggerAutomatedReminders();

      res.status(200).json({
        success: true,
        data: result,
        message: 'Automated reminders triggered successfully'
      });
    } catch (error) {
      this.logger.error('Failed to trigger automated reminders', { error, adminId: req.user?.id });
      next(error);
    }
  }

  // ============================================================================
  // UTILITY ENDPOINTS
  // ============================================================================

  /**
   * POST /date-curation/check-date-conflicts
   * Check for scheduling conflicts before creating a date
   */
  async checkDateConflicts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dateData: CreateCuratedDateRequest = req.body;

      this.logger.info('Checking date conflicts', { adminId: req.user!.id, user1Id: dateData.user1Id, user2Id: dateData.user2Id });

      const conflicts = await this.dateCurationService.checkDateConflicts(dateData);

      res.status(200).json({
        success: true,
        data: {
          hasConflicts: conflicts.length > 0,
          conflicts: conflicts
        }
      });
    } catch (error) {
      this.logger.error('Failed to check date conflicts', { error, adminId: req.user?.id });
      next(error);
    }
  }

  /**
   * GET /date-curation/compatibility/:user1Id/:user2Id
   * Get compatibility score and details between two users
   */
  async getCompatibilityScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);

      this.logger.info('Getting compatibility score', { adminId: req.user!.id, user1Id, user2Id });

      const compatibility = await this.dateCurationService.getCompatibilityScore(user1Id, user2Id);

      res.status(200).json({
        success: true,
        data: compatibility
      });
    } catch (error) {
      this.logger.error('Failed to get compatibility score', { error, adminId: req.user?.id, user1Id: req.params.user1Id, user2Id: req.params.user2Id });
      next(error);
    }
  }

  /**
   * GET /date-curation/health
   * Date curation service health check
   */
  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      this.logger.info('Date curation health check requested');

      const healthStatus = await this.dateCurationService.healthCheck();

      const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

      res.status(statusCode).json({
        success: healthStatus.status === 'healthy',
        data: healthStatus
      });
    } catch (error) {
      this.logger.error('Failed to perform health check', { error });
      
      res.status(503).json({
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          service: 'DateCurationService',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}