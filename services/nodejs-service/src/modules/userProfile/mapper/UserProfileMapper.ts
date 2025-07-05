// src/modules/userProfile/mappers/UserProfileMapper.ts

import { Logger } from '../../../infrastructure/logging/Logger';
import { DatifyyUsersInformation } from '../../../models/entities/DatifyyUsersInformation';
import { 
  UserProfileResponseDto,
  UserProfileSummaryDto,
  UserProfileStatsDto 
} from '../dtos/UserProfileResponseDtos';
import { UpdateUserProfileRequestDto } from '../dtos/UserProfileDtos';

/**
 * User Profile Mapper
 * 
 * Responsibilities:
 * - Transform database entities to response DTOs
 * - Transform request DTOs to entity updates
 * - Calculate derived fields (age, completion percentage)
 * - Handle data sanitization and formatting
 * - Provide mapping utilities for different contexts
 */
export class UserProfileMapper {
  private readonly logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance();
  }

  /**
   * Transform entity to full response DTO
   */
  async toResponseDto(entity: DatifyyUsersInformation): Promise<UserProfileResponseDto> {
    try {
      this.logger.debug('UserProfileMapper.toResponseDto', {
        profileId: entity.id,
        email: entity.officialEmail
      });

      // Calculate derived fields
      const age = this.calculateAge(entity.dob);
      const completionPercentage = this.calculateCompletionPercentage(entity);
      const lastUpdated = entity.updatedAt?.toISOString() || new Date().toISOString();
      const createdAt = entity.userLogin?.lastlogin?.toISOString() || new Date().toISOString();

      const responseDto: UserProfileResponseDto = {
        id: entity.id,
        firstName: entity.firstName || '',
        lastName: entity.lastName || '',
        email: entity.officialEmail,
        gender: entity.gender,
        bio: entity.bio,
        images: this.sanitizeImages(entity.images),
        dob: entity.dob,
        age: age ?? undefined,
        isOfficialEmailVerified: entity.isOfficialEmailVerified,
        isAadharVerified: entity.isAadharVerified,
        isPhoneVerified: entity.isPhoneVerified,
        height: entity.height,
        currentCity: entity.currentCity,
        hometown: entity.hometown,
        exercise: entity.exercise,
        educationLevel: entity.educationLevel,
        drinking: entity.drinking,
        smoking: entity.smoking,
        lookingFor: entity.lookingFor,
        settleDownInMonths: entity.settleDownInMonths,
        haveKids: entity.haveKids,
        wantsKids: entity.wantsKids,
        starSign: entity.starSign,
        religion: entity.religion,
        pronoun: entity.pronoun,
        favInterest: entity.favInterest,
        causesYouSupport: entity.causesYouSupport,
        qualityYouValue: entity.qualityYouValue,
        prompts: this.sanitizePrompts(entity.prompts),
        education: this.sanitizeEducation(entity.education),
        profileCompletionPercentage: completionPercentage,
        lastUpdated,
        createdAt
      };

      this.logger.debug('Profile transformation completed', {
        profileId: entity.id,
        completionPercentage,
        age
      });

      return responseDto;

    } catch (error) {
      this.logger.error('Failed to transform entity to response DTO', {
        profileId: entity.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Return a safe fallback response
      return this.createFallbackResponse(entity);
    }
  }

  /**
   * Transform entity to summary DTO (for listings/cards)
   */
  toSummaryDto(entity: DatifyyUsersInformation): UserProfileSummaryDto {
    try {
      const age = this.calculateAge(entity.dob);
      const completionPercentage = this.calculateCompletionPercentage(entity);
      const isVerified = this.isProfileVerified(entity);

      return {
        id: entity.id,
        firstName: entity.firstName || '',
        lastName: entity.lastName || '',
        age,
        currentCity: entity.currentCity,
        images: this.sanitizeImages(entity.images),
        bio: this.truncateBio(entity.bio),
        lookingFor: entity.lookingFor,
        isVerified,
        profileCompletionPercentage: completionPercentage
      };

    } catch (error) {
      this.logger.error('Failed to transform entity to summary DTO', {
        profileId: entity.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        id: entity.id,
        firstName: entity.firstName || 'Unknown',
        lastName: entity.lastName || 'User',
        age: null,
        currentCity: null,
        images: null,
        bio: null,
        lookingFor: null,
        isVerified: false,
        profileCompletionPercentage: 0
      };
    }
  }

  /**
   * Transform multiple entities to summary DTOs
   */
  toSummaryDtos(entities: DatifyyUsersInformation[]): UserProfileSummaryDto[] {
    return entities.map(entity => this.toSummaryDto(entity));
  }

  /**
   * Transform entity to profile stats DTO
   */
  toProfileStatsDto(entity: DatifyyUsersInformation): UserProfileStatsDto {
    try {
      const completionAnalysis = this.analyzeProfileCompleteness(entity);
      const verificationStatus = {
        email: entity.isOfficialEmailVerified || false,
        phone: entity.isPhoneVerified || false,
        aadhar: entity.isAadharVerified || false
      };

      const profileStrength = this.determineProfileStrength(
        completionAnalysis.completionPercentage
      );

      const recommendations = this.generateRecommendations(
        entity, 
        completionAnalysis.missingFields
      );

      return {
        completionPercentage: completionAnalysis.completionPercentage,
        missingFields: completionAnalysis.missingFields,
        requiredFields: completionAnalysis.requiredFields,
        optionalFields: completionAnalysis.optionalFields,
        verificationStatus,
        profileStrength,
        recommendations,
        lastUpdated: entity.updatedAt?.toISOString() || new Date().toISOString()
      };

    } catch (error) {
      this.logger.error('Failed to transform entity to stats DTO', {
        profileId: entity.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return this.createFallbackStatsDto();
    }
  }

  /**
   * Transform request DTO to entity update data
   */
  fromUpdateRequestDto(
    dto: UpdateUserProfileRequestDto
  ): Partial<DatifyyUsersInformation> {
    try {
      this.logger.debug('UserProfileMapper.fromUpdateRequestDto', {
        updateFields: Object.keys(dto)
      });

      const updateData: Partial<DatifyyUsersInformation> = {};

      // Map simple fields
      if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
      if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
      if (dto.gender !== undefined) updateData.gender = dto.gender;
      if (dto.bio !== undefined) updateData.bio = dto.bio;
      if (dto.dob !== undefined) updateData.dob = dto.dob;
      if (dto.height !== undefined) updateData.height = dto.height;
      if (dto.currentCity !== undefined) updateData.currentCity = dto.currentCity;
      if (dto.hometown !== undefined) updateData.hometown = dto.hometown;
      if (dto.exercise !== undefined) updateData.exercise = dto.exercise;
      if (dto.educationLevel !== undefined) updateData.educationLevel = dto.educationLevel;
      if (dto.drinking !== undefined) updateData.drinking = dto.drinking;
      if (dto.smoking !== undefined) updateData.smoking = dto.smoking;
      if (dto.lookingFor !== undefined) updateData.lookingFor = dto.lookingFor;
      if (dto.settleDownInMonths !== undefined) updateData.settleDownInMonths = dto.settleDownInMonths;
      if (dto.haveKids !== undefined) updateData.haveKids = dto.haveKids;
      if (dto.wantsKids !== undefined) updateData.wantsKids = dto.wantsKids;
      if (dto.starSign !== undefined) updateData.starSign = dto.starSign;
      if (dto.religion !== undefined) updateData.religion = dto.religion;
      if (dto.pronoun !== undefined) updateData.pronoun = dto.pronoun;

      // Map array fields
      if (dto.images !== undefined) updateData.images = dto.images;
      if (dto.favInterest !== undefined) updateData.favInterest = dto.favInterest;
      if (dto.causesYouSupport !== undefined) updateData.causesYouSupport = dto.causesYouSupport;
      if (dto.qualityYouValue !== undefined) updateData.qualityYouValue = dto.qualityYouValue;
      if (dto.prompts !== undefined) updateData.prompts = dto.prompts;
      if (dto.education !== undefined) updateData.education = dto.education;

      this.logger.debug('Update data mapping completed', {
        mappedFields: Object.keys(updateData)
      });

      return updateData;

    } catch (error) {
      this.logger.error('Failed to map update request DTO', {
        dto,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to process profile update data');
    }
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: string | null): number | null {
    if (!dob) return null;

    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 0 && age <= 150 ? age : null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateCompletionPercentage(entity: DatifyyUsersInformation): number {
    const requiredFields = this.getRequiredFields();
    const optionalFields = this.getOptionalFields();
    const allFields = [...requiredFields, ...optionalFields];

    let filledFields = 0;

    for (const field of allFields) {
      const value = (entity as any)[field];
      if (this.isFieldFilled(value)) {
        filledFields++;
      }
    }

    return Math.round((filledFields / allFields.length) * 100);
  }

  /**
   * Analyze profile completeness in detail
   */
  private analyzeProfileCompleteness(entity: DatifyyUsersInformation): {
    completionPercentage: number;
    missingFields: string[];
    requiredFields: string[];
    optionalFields: string[];
  } {
    const requiredFields = this.getRequiredFields();
    const optionalFields = this.getOptionalFields();
    const allFields = [...requiredFields, ...optionalFields];

    const missingFields: string[] = [];
    let filledFields = 0;

    for (const field of allFields) {
      const value = (entity as any)[field];
      if (this.isFieldFilled(value)) {
        filledFields++;
      } else {
        missingFields.push(field);
      }
    }

    const completionPercentage = Math.round((filledFields / allFields.length) * 100);

    return {
      completionPercentage,
      missingFields,
      requiredFields,
      optionalFields
    };
  }

  /**
   * Check if a field is properly filled
   */
  private isFieldFilled(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }

  /**
   * Determine profile strength based on completion
   */
  private determineProfileStrength(
    completionPercentage: number
  ): 'weak' | 'moderate' | 'strong' | 'complete' {
    if (completionPercentage >= 95) return 'complete';
    if (completionPercentage >= 80) return 'strong';
    if (completionPercentage >= 60) return 'moderate';
    return 'weak';
  }

  /**
   * Check if profile is verified
   */
  private isProfileVerified(entity: DatifyyUsersInformation): boolean {
    return !!(entity.isOfficialEmailVerified && 
             (entity.isPhoneVerified || entity.isAadharVerified));
  }

  /**
   * Sanitize and validate image URLs
   */
  private sanitizeImages(images: string[] | null): string[] | null {
    if (!images || !Array.isArray(images)) return null;

    const validImages = images.filter(image => {
      if (typeof image !== 'string') return false;
      try {
        new URL(image);
        return true;
      } catch {
        return false;
      }
    });

    return validImages.length > 0 ? validImages.slice(0, 6) : null; // Max 6 images
  }

  /**
   * Sanitize prompts data
   */
  private sanitizePrompts(prompts: object[] | null): object[] | null {
    if (!prompts || !Array.isArray(prompts)) return null;
    
    const validPrompts = prompts.filter(prompt => 
      prompt && typeof prompt === 'object' && Object.keys(prompt).length > 0
    );

    return validPrompts.length > 0 ? validPrompts.slice(0, 5) : null; // Max 5 prompts
  }

  /**
   * Sanitize education data
   */
  private sanitizeEducation(education: object[] | null): object[] | null {
    if (!education || !Array.isArray(education)) return null;
    
    const validEducation = education.filter(edu => 
      edu && typeof edu === 'object' && Object.keys(edu).length > 0
    );

    return validEducation.length > 0 ? validEducation.slice(0, 5) : null; // Max 5 education entries
  }

  /**
   * Truncate bio for summary views
   */
  private truncateBio(bio: string | null, maxLength: number = 150): string | null {
    if (!bio) return null;
    
    if (bio.length <= maxLength) return bio;
    
    return bio.substring(0, maxLength).trim() + '...';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    entity: DatifyyUsersInformation, 
    missingFields: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (missingFields.includes('images')) {
      recommendations.push('Add profile photos to increase your visibility by 300%');
    }

    if (missingFields.includes('bio')) {
      recommendations.push('Write a compelling bio to attract compatible matches');
    }

    if (missingFields.includes('favInterest')) {
      recommendations.push('Add your interests to find people with similar hobbies');
    }

    if (missingFields.includes('height')) {
      recommendations.push('Adding your height helps with better matching');
    }

    if (missingFields.includes('education')) {
      recommendations.push('Share your educational background to connect with like-minded people');
    }

    if (!entity.isOfficialEmailVerified) {
      recommendations.push('Verify your email address for enhanced security and trust');
    }

    if (!entity.isPhoneVerified) {
      recommendations.push('Verify your phone number to unlock premium features');
    }

    // Limit to top 3 recommendations
    return recommendations.slice(0, 3);
  }

  /**
   * Get required fields for profile completion
   */
  private getRequiredFields(): string[] {
    return [
      'firstName',
      'lastName',
      'gender',
      'dob',
      'currentCity',
      'lookingFor'
    ];
  }

  /**
   * Get optional fields that enhance profile quality
   */
  private getOptionalFields(): string[] {
    return [
      'bio',
      'images',
      'height',
      'hometown',
      'exercise',
      'educationLevel',
      'drinking',
      'smoking',
      'settleDownInMonths',
      'haveKids',
      'wantsKids',
      'starSign',
      'religion',
      'pronoun',
      'favInterest',
      'causesYouSupport',
      'qualityYouValue',
      'prompts',
      'education'
    ];
  }

  /**
   * Create fallback response for error scenarios
   */
  private createFallbackResponse(entity: DatifyyUsersInformation): UserProfileResponseDto {
    return {
      id: entity.id,
      firstName: entity.firstName || 'Unknown',
      lastName: entity.lastName || 'User',
      email: entity.officialEmail,
      gender: entity.gender,
      bio: null,
      images: null,
      dob: null,
      age: undefined,
      isOfficialEmailVerified: false,
      isAadharVerified: false,
      isPhoneVerified: false,
      height: null,
      currentCity: null,
      hometown: null,
      exercise: null,
      educationLevel: null,
      drinking: null,
      smoking: null,
      lookingFor: null,
      settleDownInMonths: null,
      haveKids: null,
      wantsKids: null,
      starSign: null,
      religion: null,
      pronoun: null,
      favInterest: null,
      causesYouSupport: null,
      qualityYouValue: null,
      prompts: null,
      education: null,
      profileCompletionPercentage: 0,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Create fallback stats DTO for error scenarios
   */
  private createFallbackStatsDto(): UserProfileStatsDto {
    return {
      completionPercentage: 0,
      missingFields: [],
      requiredFields: this.getRequiredFields(),
      optionalFields: this.getOptionalFields(),
      verificationStatus: {
        email: false,
        phone: false,
        aadhar: false
      },
      profileStrength: 'weak',
      recommendations: ['Complete your profile to get started'],
      lastUpdated: new Date().toISOString()
    };
  }
}