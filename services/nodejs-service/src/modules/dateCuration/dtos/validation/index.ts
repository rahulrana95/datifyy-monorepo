/**
 * Barrel exports for all validation middleware
 */
export { validateCreateCuratedDate } from './createCuratedDateValidation';
export { validateUpdateCuratedDate } from './updateCuratedDateValidation';
export { validateConfirmDate } from './confirmDateValidation';
export { validateCancelDate } from './cancelDateValidation';
export { validateSubmitDateFeedback } from './submitFeedbackValidation';
export { 
  validateGetUserDates, 
  validateAdminGetDates,
  validateSearchPotentialMatches,
  validateDateCurationAnalytics
} from './queryValidations';

// Custom validation utilities
export const customValidators = {
  /**
   * Validate that a date is in the future with minimum advance time
   */
  isFutureDate: (minHoursAdvance: number = 24) => {
    return (value: string) => {
      const dateTime = new Date(value);
      const minAdvance = new Date(Date.now() + minHoursAdvance * 60 * 60 * 1000);
      return dateTime >= minAdvance;
    };
  },

  /**
   * Validate that two users are different
   */
  areUsersDifferent: (user1Field: string, user2Field: string) => {
    return (value: number, { req }: { req: any }) => {
      return value !== req.body[user1Field];
    };
  },

  /**
   * Validate time slot is within business hours
   */
  isWithinBusinessHours: (startTime: string = '09:00', endTime: string = '22:00') => {
    return (value: string) => {
      const dateTime = new Date(value);
      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return timeString >= startTime && timeString <= endTime;
    };
  },

  /**
   * Validate array of strings with trimming
   */
  isStringArray: (maxLength: number = 10, maxItemLength: number = 200) => {
    return (value: any[]) => {
      if (!Array.isArray(value)) return false;
      if (value.length > maxLength) return false;
      return value.every(item => 
        typeof item === 'string' && 
        item.trim().length > 0 && 
        item.trim().length <= maxItemLength
      );
    };
  },

  /**
   * Validate location coordinates
   */
  isValidCoordinates: (lat: number, lng: number) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }
};
