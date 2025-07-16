// =============================================================================
// FILE: dtos/index.ts - Main barrel export
// =============================================================================

/**
 * Date Curation DTOs - Main Export
 * Organized by category for easy imports
 */

// Request DTOs
export { CreateCuratedDateDto, LocationCoordinatesDto } from './requests/CreateCuratedDateDto';
export { UpdateCuratedDateDto } from './requests/UpdateCuratedDateDto';
export { ConfirmDateDto } from './requests/ConfirmDateDto';
export { CancelDateDto } from './requests/CancelDateDto';
export { SubmitFeedbackDto } from './requests/SubmitFeedbackDto';
export { SearchPotentialMatchesDto, AgeRangeDto } from './requests/SearchMatchesDto';

// Query DTOs
export { GetUserDatesQueryDto } from './queries/GetUserDatesQueryDto';
export { AdminGetDatesQueryDto } from './queries/AdminGetDatesQueryDto';
export { DateCurationAnalyticsQueryDto } from './queries/AnalyticsQueryDto';

// Base DTOs
export { BaseQueryDto, BaseDateRangeQueryDto } from './base/BaseQueryDto';
export { VALIDATION_RULES, FIELD_LENGTHS, VALIDATION_MESSAGES } from './base/CommonTypes';

// Validation middleware (all validators)
export * from './validation/index';
