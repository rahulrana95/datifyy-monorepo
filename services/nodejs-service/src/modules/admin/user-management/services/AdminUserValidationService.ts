import { Logger } from '../../../../infrastructure/logging/Logger';
import { AdminUserRepository, AdminUserTrustScoreRepository } from '../repositories';
import { 
  AccountStatusFilter, 
  VerificationType,
  TrustScoreAdjustmentReason 
} from '../dtos';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UserStatusChangeValidation extends ValidationResult {
  canProceed: boolean;
  requiresConfirmation: boolean;
  impactedDates?: number;
  relatedUsers?: number[];
}

export class AdminUserValidationService {
  constructor(
    private userRepository: AdminUserRepository,
    private trustScoreRepository: AdminUserTrustScoreRepository,
    private logger: Logger
  ) {}

  async validateUserStatusChange(
    userId: number,
    newStatus: AccountStatusFilter,
    adminId: number
  ): Promise<UserStatusChangeValidation> {
    try {
      this.logger.info('Validating user status change', { userId, newStatus, adminId });

      const errors: string[] = [];
      const warnings: string[] = [];
      let requiresConfirmation = false;
      let impactedDates = 0;

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        return {
          isValid: false,
          canProceed: false,
          errors: ['User not found'],
          warnings: [],
          requiresConfirmation: false
        };
      }

      // Validate status transition
      const statusTransitionResult = this.validateStatusTransition(user.accountStatus, newStatus);
      errors.push(...statusTransitionResult.errors);
      warnings.push(...statusTransitionResult.warnings);

      // Check for upcoming dates if suspending/deactivating
      if (newStatus === AccountStatusFilter.SUSPENDED || newStatus === AccountStatusFilter.DEACTIVATED) {
        // This would query for upcoming dates
        impactedDates = 0; // Placeholder
        if (impactedDates > 0) {
          warnings.push(`User has ${impactedDates} upcoming dates that will be affected`);
          requiresConfirmation = true;
        }
      }

      // Check if user is a high-value user (many completed dates, good feedback)
      if (newStatus === AccountStatusFilter.SUSPENDED) {
        const dateHistory = await this.userRepository.getUserDateHistory(userId);
        if (dateHistory.completedDates > 10 && dateHistory.averageDateRating > 4) {
          warnings.push('User has high engagement and good ratings. Consider alternative actions.');
          requiresConfirmation = true;
        }
      }

      // Validate admin permissions (would check against admin's permission level)
      if (newStatus === AccountStatusFilter.SUSPENDED && !this.canAdminSuspendUsers(adminId)) {
        errors.push('Insufficient permissions to suspend users');
      }

      return {
        isValid: errors.length === 0,
        canProceed: errors.length === 0,
        errors,
        warnings,
        requiresConfirmation,
        impactedDates
      };
    } catch (error) {
      this.logger.error('Error validating user status change', { error, userId, newStatus });
      throw error;
    }
  }

  async validateUserVerification(
    userId: number,
    verificationType: VerificationType,
    isVerified: boolean
  ): Promise<ValidationResult> {
    try {
      this.logger.info('Validating user verification', { userId, verificationType, isVerified });

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        return {
          isValid: false,
          errors: ['User not found'],
          warnings: []
        };
      }

      // Check current verification status
      const currentStatus = this.getCurrentVerificationStatus(user, verificationType);
      if (currentStatus === isVerified) {
        warnings.push(`User is already ${isVerified ? 'verified' : 'unverified'} for ${verificationType}`);
      }

      // Validate business rules
      if (verificationType === VerificationType.GOVERNMENT_ID && isVerified) {
        if (!user.firstName || !user.lastName || !user.dateOfBirth) {
          errors.push('User must have complete name and date of birth for ID verification');
        }
      }

      if (verificationType === VerificationType.EMAIL && !isVerified) {
        // Check if removing email verification would affect other systems
        if (user.accountStatus === AccountStatusFilter.ACTIVE) {
          warnings.push('Removing email verification for active user may affect their ability to receive important notifications');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      this.logger.error('Error validating user verification', { error, userId, verificationType });
      throw error;
    }
  }

  async validateTrustScoreUpdate(
    userId: number,
    newScores: Partial<{
      overallScore: number;
      attendanceScore: number;
      punctualityScore: number;
      feedbackScore: number;
      warningLevel: number;
    }>,
    reason: TrustScoreAdjustmentReason,
    adminId: number
  ): Promise<ValidationResult> {
    try {
      this.logger.info('Validating trust score update', { userId, newScores, reason, adminId });

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        return {
          isValid: false,
          errors: ['User not found'],
          warnings: []
        };
      }

      // Get current trust score
      const currentTrustScore = await this.trustScoreRepository.findTrustScoreByUserId(userId);
      if (!currentTrustScore) {
        warnings.push('User does not have existing trust score. A new one will be created.');
      }

      // Validate score ranges
      Object.entries(newScores).forEach(([key, value]) => {
        if (key.includes('Score') && (value < 0 || value > 100)) {
          errors.push(`${key} must be between 0 and 100`);
        }
        if (key === 'warningLevel' && (value < 0 || value > 5)) {
          errors.push('Warning level must be between 0 and 5');
        }
      });

      // Validate significant changes
      if (currentTrustScore && newScores.overallScore !== undefined) {
        const scoreDifference = Math.abs(currentTrustScore.overallScore - newScores.overallScore);
        if (scoreDifference > 30) {
          warnings.push(`Large score change detected (${scoreDifference} points). Please ensure this is intentional.`);
        }
      }

      // Validate reason appropriateness
      if (reason === TrustScoreAdjustmentReason.POSITIVE_FEEDBACK && newScores.overallScore && newScores.overallScore < 50) {
        warnings.push('Setting low score with positive feedback reason may be inconsistent');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      this.logger.error('Error validating trust score update', { error, userId, newScores });
      throw error;
    }
  }

  validateBulkOperation(
    userIds: number[],
    operation: string,
    batchSize = 100
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (userIds.length === 0) {
      errors.push('No users provided for bulk operation');
    }

    if (userIds.length > batchSize) {
      errors.push(`Bulk operation exceeds maximum batch size of ${batchSize}`);
    }

    // Check for duplicates
    const uniqueIds = new Set(userIds);
    if (uniqueIds.size !== userIds.length) {
      warnings.push('Duplicate user IDs detected in bulk operation');
    }

    // Validate operation type
    const allowedOperations = ['status_change', 'verification', 'trust_score_adjustment'];
    if (!allowedOperations.includes(operation)) {
      errors.push(`Invalid bulk operation: ${operation}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: AccountStatusFilter
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Define allowed transitions
    const allowedTransitions: Record<string, AccountStatusFilter[]> = {
      [AccountStatusFilter.PENDING]: [AccountStatusFilter.ACTIVE, AccountStatusFilter.SUSPENDED],
      [AccountStatusFilter.ACTIVE]: [AccountStatusFilter.DEACTIVATED, AccountStatusFilter.SUSPENDED, AccountStatusFilter.LOCKED],
      [AccountStatusFilter.DEACTIVATED]: [AccountStatusFilter.ACTIVE],
      [AccountStatusFilter.SUSPENDED]: [AccountStatusFilter.ACTIVE, AccountStatusFilter.DEACTIVATED],
      [AccountStatusFilter.LOCKED]: [AccountStatusFilter.ACTIVE, AccountStatusFilter.SUSPENDED]
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    // Add specific warnings for certain transitions
    if (currentStatus === AccountStatusFilter.ACTIVE && newStatus === AccountStatusFilter.SUSPENDED) {
      warnings.push('Suspending an active user will immediately restrict their access');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private getCurrentVerificationStatus(user: any, verificationType: VerificationType): boolean {
    switch (verificationType) {
      case VerificationType.EMAIL:
        return user.isOfficialEmailVerified;
      case VerificationType.PHONE:
        return user.isPhoneVerified;
      case VerificationType.GOVERNMENT_ID:
        return user.isAadharVerified;
      default:
        return false;
    }
  }

  private canAdminSuspendUsers(adminId: number): boolean {
    // This would check admin permissions from database or cache
    // For now, return true (placeholder)
    return true;
  }
}