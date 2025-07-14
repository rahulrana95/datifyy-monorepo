import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserTrustScoreRepository } from '../repositories';
import { AdminUserValidationService } from './AdminUserValidationService';
import {
  UpdateUserTrustScoreRequestDto,
  TrustScoreAdjustmentReason,
  AdminUserTrustScore
} from '../dtos';
import { TrustScoreUpdate } from '../repositories/AdminUserTrustScoreRepository';

export interface TrustScoreRecalculationResult {
  success: boolean;
  usersProcessed: number;
  usersUpdated: number;
  errors: Array<{
    userId: number;
    error: string;
  }>;
  summary: {
    averageScoreChange: number;
    significantChanges: number;
    usersMovedToGoodStanding: number;
    usersMovedToProbation: number;
  };
}

export interface BulkTrustScoreUpdateResult {
  success: boolean;
  totalUsers: number;
  successfulUpdates: number;
  failedUpdates: number;
  errors: Array<{
    userId: number;
    error: string;
  }>;
  warnings: string[];
}

export interface TrustScoreAnalysis {
  userId: number;
  currentScore: AdminUserTrustScore;
  recommendations: {
    suggestedActions: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    priorityLevel: number; // 1-5, where 5 is highest priority
    estimatedImpact: string;
  };
  trends: {
    scoreDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
    recentChanges: Array<{
      date: Date;
      scoreChange: number;
      reason: string;
    }>;
  };
}

export class AdminUserTrustScoreService {
  private trustScoreRepository: AdminUserTrustScoreRepository;
  private validationService: AdminUserValidationService;

  constructor(
    private dataSource: DataSource,
    private logger: Logger,
    validationService: AdminUserValidationService
  ) {
    this.trustScoreRepository = new AdminUserTrustScoreRepository(dataSource, logger);
    this.validationService = validationService;
  }

  async updateUserTrustScore(
    userId: number,
    updates: UpdateUserTrustScoreRequestDto,
    adminId: number
  ): Promise<{
    success: boolean;
    message: string;
    trustScore?: AdminUserTrustScore;
    warnings?: string[];
  }> {
    try {
      this.logger.info('Updating user trust score', { userId, updates, adminId });

      // Validate the trust score update
      const validation = await this.validationService.validateTrustScoreUpdate(
        userId,
        {
          overallScore: updates.overallScore,
          attendanceScore: updates.attendanceScore,
          punctualityScore: updates.punctualityScore,
          feedbackScore: updates.feedbackScore,
          warningLevel: updates.warningLevel
        },
        updates.adjustmentReason,
        adminId
      );

      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`,
          warnings: validation.warnings
        };
      }

      // Prepare trust score update
      const trustScoreUpdate: TrustScoreUpdate = {
        overallScore: updates.overallScore,
        attendanceScore: updates.attendanceScore,
        punctualityScore: updates.punctualityScore,
        feedbackScore: updates.feedbackScore,
        warningLevel: updates.warningLevel,
        maxDatesPerWeek: updates.maxDatesPerWeek,
        adminOverrideReason: updates.adminNotes,
        manualAdjustmentAt: new Date(),
        manualAdjustmentBy: adminId
      };

      // Handle probation settings
      if (updates.probationDuration) {
        trustScoreUpdate.isOnProbation = true;
        trustScoreUpdate.probationUntil = this.calculateProbationEndDate(updates.probationDuration);
      }

      // Update the trust score
      const updatedTrustScore = await this.trustScoreRepository.updateTrustScore(
        userId,
        trustScoreUpdate,
        adminId,
        updates.adjustmentReason
      );

      // Send notifications if needed
      await this.handleTrustScoreUpdateNotifications(userId, updatedTrustScore, updates.adjustmentReason);

      return {
        success: true,
        message: 'Trust score updated successfully',
        trustScore: updatedTrustScore,
        warnings: validation.warnings
      };
    } catch (error) {
      this.logger.error('Error updating user trust score', { error, userId, updates, adminId });
      throw error;
    }
  }

  async recalculateUserTrustScore(
    userId: number,
    adminId: number,
    reason = 'admin_requested_recalculation'
  ): Promise<{
    success: boolean;
    message: string;
    oldScore?: number;
    newScore?: number;
    trustScore?: AdminUserTrustScore;
  }> {
    try {
      this.logger.info('Recalculating user trust score', { userId, adminId, reason });

      // Get current score for comparison
      const currentTrustScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
      const oldScore = currentTrustScore?.overallScore || 0;

      // Recalculate trust score
      const updatedTrustScore = await this.trustScoreRepository.recalculateTrustScore(userId, reason);
      const newScore = updatedTrustScore.overallScore;

      // Log significant changes
      const scoreChange = Math.abs(newScore - oldScore);
      if (scoreChange > 10) {
        this.logger.warn('Significant trust score change during recalculation', {
          userId,
          oldScore,
          newScore,
          scoreChange,
          reason
        });
      }

      return {
        success: true,
        message: 'Trust score recalculated successfully',
        oldScore,
        newScore,
        trustScore: updatedTrustScore
      };
    } catch (error) {
      this.logger.error('Error recalculating user trust score', { error, userId, adminId });
      throw error;
    }
  }

  async bulkRecalculateTrustScores(
    userIds?: number[],
    adminId?: number,
    batchSize = 50
  ): Promise<TrustScoreRecalculationResult> {
    try {
      this.logger.info('Starting bulk trust score recalculation', { 
        userCount: userIds?.length || 'all', 
        adminId, 
        batchSize 
      });

      let targetUserIds = userIds;
      
      // If no specific users provided, get all users (in batches)
      if (!targetUserIds) {
        targetUserIds = await this.getAllUserIds();
      }

      const result: TrustScoreRecalculationResult = {
        success: true,
        usersProcessed: 0,
        usersUpdated: 0,
        errors: [],
        summary: {
          averageScoreChange: 0,
          significantChanges: 0,
          usersMovedToGoodStanding: 0,
          usersMovedToProbation: 0
        }
      };

      const scoreChanges: number[] = [];
      
      // Process users in batches
      for (let i = 0; i < targetUserIds.length; i += batchSize) {
        const batch = targetUserIds.slice(i, i + batchSize);
        
        for (const userId of batch) {
          try {
            const currentScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
            const oldOverallScore = currentScore?.overallScore || 0;
            const wasOnProbation = currentScore?.isOnProbation || false;

            await this.trustScoreRepository.recalculateTrustScore(
              userId, 
              'bulk_system_recalculation'
            );

            const newScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
            const newOverallScore = newScore?.overallScore || 0;
            const isOnProbation = newScore?.isOnProbation || false;

            result.usersProcessed++;
            
            if (oldOverallScore !== newOverallScore) {
              result.usersUpdated++;
              const scoreChange = newOverallScore - oldOverallScore;
              scoreChanges.push(scoreChange);
              
              if (Math.abs(scoreChange) > 15) {
                result.summary.significantChanges++;
              }

              // Track probation status changes
              if (wasOnProbation && !isOnProbation) {
                result.summary.usersMovedToGoodStanding++;
              } else if (!wasOnProbation && isOnProbation) {
                result.summary.usersMovedToProbation++;
              }
            }

          } catch (error) {
            this.logger.error('Error recalculating trust score for user', { error, userId });
            result.errors.push({
              userId,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        // Small delay between batches to avoid overwhelming the database
        if (i + batchSize < targetUserIds.length) {
          await this.delay(100);
        }
      }

      // Calculate summary statistics
      if (scoreChanges.length > 0) {
        result.summary.averageScoreChange = 
          scoreChanges.reduce((sum, change) => sum + change, 0) / scoreChanges.length;
      }

      // Mark as failed if too many errors
      if (result.errors.length > result.usersProcessed * 0.1) { // More than 10% failed
        result.success = false;
      }

      this.logger.info('Bulk trust score recalculation completed', { result });
      return result;

    } catch (error) {
      this.logger.error('Error in bulk trust score recalculation', { error, userIds, adminId });
      throw error;
    }
  }

  async analyzeTrustScore(userId: number): Promise<TrustScoreAnalysis> {
    try {
      this.logger.info('Analyzing trust score', { userId });

      const trustScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
      if (!trustScore) {
        throw new Error('Trust score not found for user');
      }

      // Generate recommendations based on trust score
      const recommendations = this.generateTrustScoreRecommendations(trustScore);
      
      // Analyze trends (would need historical data)
      const trends = await this.analyzeTrustScoreTrends(userId);

      return {
        userId,
        currentScore: trustScore,
        recommendations,
        trends
      };
    } catch (error) {
      this.logger.error('Error analyzing trust score', { error, userId });
      throw error;
    }
  }

  async getUsersRequiringAttention(
    adminId: number,
    limit = 50
  ): Promise<Array<TrustScoreAnalysis>> {
    try {
      this.logger.info('Getting users requiring trust score attention', { adminId, limit });

      // Get users with low trust scores
      const lowTrustUsers = await this.trustScoreRepository.getUsersWithLowTrustScores(60);
      
      // Get users on probation
      const probationUsers = await this.trustScoreRepository.getUsersOnProbation();

      // Combine and deduplicate
      const allUserIds = [...new Set([
        ...lowTrustUsers.map(u => u.userId),
        ...probationUsers.map(u => u.userId)
      ])];

      // Analyze each user (limited to prevent overload)
      const analyses: TrustScoreAnalysis[] = [];
      const limitedUserIds = allUserIds.slice(0, limit);

      for (const userId of limitedUserIds) {
        try {
          const analysis = await this.analyzeTrustScore(userId);
          analyses.push(analysis);
        } catch (error) {
          this.logger.warn('Failed to analyze trust score for user', { userId, error });
        }
      }

      // Sort by priority level (highest first)
      analyses.sort((a, b) => b.recommendations.priorityLevel - a.recommendations.priorityLevel);

      return analyses;
    } catch (error) {
      this.logger.error('Error getting users requiring attention', { error, adminId });
      throw error;
    }
  }

  async bulkUpdateTrustScores(
    updates: Array<{
      userId: number;
      updates: Partial<UpdateUserTrustScoreRequestDto>;
    }>,
    adminId: number,
    reason: TrustScoreAdjustmentReason
  ): Promise<BulkTrustScoreUpdateResult> {
    try {
      this.logger.info('Starting bulk trust score update', { 
        updateCount: updates.length, 
        adminId, 
        reason 
      });

      // Validate bulk operation
      const bulkValidation = this.validationService.validateBulkOperation(
        updates.map(u => u.userId),
        'trust_score_adjustment'
      );

      if (!bulkValidation.isValid) {
        throw new Error(`Bulk validation failed: ${bulkValidation.errors.join(', ')}`);
      }

      const result: BulkTrustScoreUpdateResult = {
        success: true,
        totalUsers: updates.length,
        successfulUpdates: 0,
        failedUpdates: 0,
        errors: [],
        warnings: bulkValidation.warnings
      };

      // Process each update
      for (const update of updates) {
        try {
          await this.updateUserTrustScore(
            update.userId,
            {
              ...update.updates,
              adjustmentReason: reason,
              adminNotes: update.updates.adminNotes || `Bulk update by admin ${adminId}`
            } as UpdateUserTrustScoreRequestDto,
            adminId
          );
          
          result.successfulUpdates++;
        } catch (error) {
          this.logger.error('Failed to update trust score for user in bulk operation', {
            userId: update.userId,
            error
          });
          
          result.failedUpdates++;
          result.errors.push({
            userId: update.userId,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Mark as failed if too many errors
      if (result.failedUpdates > result.totalUsers * 0.2) { // More than 20% failed
        result.success = false;
      }

      this.logger.info('Bulk trust score update completed', { result });
      return result;

    } catch (error) {
      this.logger.error('Error in bulk trust score update', { error, updates, adminId });
      throw error;
    }
  }

  private calculateProbationEndDate(duration: string): Date {
    // Parse ISO duration format (e.g., "P30D" for 30 days)
    const match = duration.match(/P(\d+)D/);
    if (!match) {
      throw new Error('Invalid probation duration format. Use ISO duration format (e.g., P30D)');
    }
    
    const days = parseInt(match[1]);
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private async handleTrustScoreUpdateNotifications(
    userId: number,
    trustScore: AdminUserTrustScore,
    reason: TrustScoreAdjustmentReason
  ): Promise<void> {
    // Handle notifications based on trust score changes
    if (trustScore.isOnProbation) {
      // Send probation notification
      this.logger.info('User placed on probation', { userId, trustScore: trustScore.overallScore });
    }

    if (trustScore.overallScore < 30) {
      // Send low trust score alert
      this.logger.warn('User has critically low trust score', { userId, trustScore: trustScore.overallScore });
    }

    // Additional notification logic would go here
  }

  private generateTrustScoreRecommendations(trustScore: AdminUserTrustScore): TrustScoreAnalysis['recommendations'] {
    const suggestedActions: string[] = [];
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let priorityLevel = 1;
    let estimatedImpact = 'Minimal intervention required';

    // Analyze overall score
    if (trustScore.overallScore < 25) {
      riskLevel = 'CRITICAL';
      priorityLevel = 5;
      estimatedImpact = 'Immediate intervention required to prevent platform harm';
      suggestedActions.push('Consider immediate account suspension');
      suggestedActions.push('Conduct thorough account review');
      suggestedActions.push('Contact user for explanation');
    } else if (trustScore.overallScore < 40) {
      riskLevel = 'HIGH';
      priorityLevel = 4;
      estimatedImpact = 'High risk user requiring close monitoring';
      suggestedActions.push('Place on probation if not already');
      suggestedActions.push('Limit dating privileges');
      suggestedActions.push('Require admin approval for dates');
    } else if (trustScore.overallScore < 60) {
      riskLevel = 'MEDIUM';
      priorityLevel = 3;
      estimatedImpact = 'Moderate risk user needing guidance';
      suggestedActions.push('Send educational content about platform expectations');
      suggestedActions.push('Monitor closely for improvement');
    } else if (trustScore.overallScore < 80) {
      riskLevel = 'LOW';
      priorityLevel = 2;
      estimatedImpact = 'Minor issues that can be addressed through coaching';
      suggestedActions.push('Provide tips for improving dating etiquette');
    }

    // Analyze specific score components
    if (trustScore.attendanceScore < 70) {
      suggestedActions.push('Address attendance issues with user');
    }
    
    if (trustScore.punctualityScore < 70) {
      suggestedActions.push('Provide guidance on punctuality importance');
    }
    
    if (trustScore.feedbackScore < 70) {
      suggestedActions.push('Review recent feedback patterns');
    }

    // Check probation status
    if (trustScore.isOnProbation) {
      priorityLevel = Math.max(priorityLevel, 3);
      suggestedActions.push('Monitor probation progress');
    }

    return {
      suggestedActions,
      riskLevel,
      priorityLevel,
      estimatedImpact
    };
  }

  private async analyzeTrustScoreTrends(userId: number): Promise<TrustScoreAnalysis['trends']> {
    // This would analyze historical trust score data
    // For now, return placeholder data
    return {
      scoreDirection: 'STABLE',
      recentChanges: []
    };
  }

  private async getAllUserIds(): Promise<number[]> {
    // This would get all user IDs from the database
    // For now, return empty array (would be implemented with proper query)
    return [];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}