// apps/frontend/src/mvp/date-curation/utils/dateUtils.ts

import { format, formatDistance, formatRelative, isToday, isTomorrow, isThisWeek, differenceInHours, differenceInMinutes, isPast, isFuture, addHours, startOfDay, endOfDay } from 'date-fns';

/**
 * Date Utilities for Date Curation
 * 
 * Provides consistent date formatting, calculations, and display logic
 * for the dating app context with user-friendly messaging
 */

/**
 * Format date for display in various contexts
 */
export const formatDateForDisplay = (date: Date | string, context: 'card' | 'detail' | 'list' = 'card'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    switch (context) {
      case 'card':
        return `Today at ${format(dateObj, 'h:mm a')}`;
      case 'detail':
        return `Today, ${format(dateObj, 'MMMM do')} at ${format(dateObj, 'h:mm a')}`;
      case 'list':
        return `Today ${format(dateObj, 'h:mm a')}`;
    }
  }
  
  if (isTomorrow(dateObj)) {
    switch (context) {
      case 'card':
        return `Tomorrow at ${format(dateObj, 'h:mm a')}`;
      case 'detail':
        return `Tomorrow, ${format(dateObj, 'MMMM do')} at ${format(dateObj, 'h:mm a')}`;
      case 'list':
        return `Tomorrow ${format(dateObj, 'h:mm a')}`;
    }
  }
  
  if (isThisWeek(dateObj)) {
    switch (context) {
      case 'card':
        return format(dateObj, 'EEEE \'at\' h:mm a');
      case 'detail':
        return format(dateObj, 'EEEE, MMMM do \'at\' h:mm a');
      case 'list':
        return format(dateObj, 'EEE h:mm a');
    }
  }
  
  // Future dates beyond this week
  switch (context) {
    case 'card':
      return format(dateObj, 'MMM do \'at\' h:mm a');
    case 'detail':
      return format(dateObj, 'EEEE, MMMM do, yyyy \'at\' h:mm a');
    case 'list':
      return format(dateObj, 'MMM do, h:mm a');
  }
};

/**
 * Calculate hours until a date
 */
export const calculateHoursUntil = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.max(0, differenceInHours(dateObj, now));
};

/**
 * Calculate minutes until a date
 */
export const calculateMinutesUntil = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.max(0, differenceInMinutes(dateObj, now));
};

/**
 * Get user-friendly time until message
 */
export const getTimeUntilMessage = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  if (isPast(dateObj)) {
    return 'Date has passed';
  }
  
  const hoursUntil = differenceInHours(dateObj, now);
  const minutesUntil = differenceInMinutes(dateObj, now);
  
  if (minutesUntil < 60) {
    if (minutesUntil <= 5) {
      return 'Starting very soon! 🕐';
    } else if (minutesUntil <= 30) {
      return `Starting in ${minutesUntil} minutes`;
    } else {
      return `Starting in less than an hour`;
    }
  }
  
  if (hoursUntil < 24) {
    if (hoursUntil === 1) {
      return 'Starting in 1 hour';
    } else if (hoursUntil <= 2) {
      return 'Starting very soon! ⏰';
    } else {
      return `Starting in ${hoursUntil} hours`;
    }
  }
  
  const daysUntil = Math.ceil(hoursUntil / 24);
  if (daysUntil === 1) {
    return 'Tomorrow';
  } else if (daysUntil <= 7) {
    return `In ${daysUntil} days`;
  } else {
    return formatDistance(dateObj, now, { addSuffix: true });
  }
};

/**
 * Get urgency level for UI styling
 */
export const getDateUrgency = (date: Date | string): 'high' | 'medium' | 'low' | 'past' => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  if (isPast(dateObj)) {
    return 'past';
  }
  
  const hoursUntil = differenceInHours(dateObj, now);
  
  if (hoursUntil <= 2) {
    return 'high'; // Red - very urgent
  } else if (hoursUntil <= 24) {
    return 'medium'; // Orange - upcoming
  } else {
    return 'low'; // Blue - future
  }
};

/**
 * Check if date can be cancelled based on timing
 */
export const canCancelDate = (date: Date | string, cancelWindowHours: number = 24): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const hoursUntil = differenceInHours(dateObj, now);
  
  return hoursUntil >= cancelWindowHours;
};

/**
 * Check if date can be rescheduled
 */
export const canRescheduleDate = (date: Date | string, rescheduleWindowHours: number = 48): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const hoursUntil = differenceInHours(dateObj, now);
  
  return hoursUntil >= rescheduleWindowHours;
};

/**
 * Get cancellation policy message
 */
export const getCancellationPolicyMessage = (date: Date | string): {
  canCancel: boolean;
  message: string;
  refundEligible: boolean;
} => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const hoursUntil = differenceInHours(dateObj, now);
  
  if (hoursUntil >= 24) {
    return {
      canCancel: true,
      message: 'Free cancellation until 24 hours before your date',
      refundEligible: true
    };
  } else if (hoursUntil >= 4) {
    return {
      canCancel: true,
      message: 'Partial refund available until 4 hours before your date',
      refundEligible: true
    };
  } else if (hoursUntil > 0) {
    return {
      canCancel: true,
      message: 'Cancellation within 4 hours - no refund available',
      refundEligible: false
    };
  } else {
    return {
      canCancel: false,
      message: 'Date has started - cancellation no longer available',
      refundEligible: false
    };
  }
};

/**
 * Format date for different time zones (if needed)
 */
export const formatDateWithTimezone = (date: Date | string, timezone?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (timezone) {
    // For now, just show the timezone info
    return `${formatDateForDisplay(dateObj)} (${timezone})`;
  }
  
  return formatDateForDisplay(dateObj);
};

/**
 * Get suggested time slots for rescheduling
 */
export const getSuggestedRescheduleSlots = (originalDate: Date | string): string[] => {
  const dateObj = typeof originalDate === 'string' ? new Date(originalDate) : originalDate;
  const suggestions: string[] = [];
  
  // Same day, different times
  const sameDay2HoursLater = addHours(dateObj, 2);
  const sameDay4HoursLater = addHours(dateObj, 4);
  
  // Next day, same time
  const nextDaySameTime = addHours(dateObj, 24);
  
  // Weekend slot if it's a weekday
  const dayOfWeek = dateObj.getDay();
  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
    const daysUntilSaturday = 6 - dayOfWeek;
    const weekendSlot = addHours(dateObj, daysUntilSaturday * 24);
    suggestions.push(formatDateForDisplay(weekendSlot, 'detail'));
  }
  
  suggestions.push(
    formatDateForDisplay(sameDay2HoursLater, 'detail'),
    formatDateForDisplay(sameDay4HoursLater, 'detail'),
    formatDateForDisplay(nextDaySameTime, 'detail')
  );
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
};

/**
 * Check if it's a good time to remind about upcoming date
 */
export const shouldShowReminder = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const hoursUntil = calculateHoursUntil(dateObj);
  
  // Show reminders at 24h, 4h, and 1h marks
  return hoursUntil === 24 || hoursUntil === 4 || hoursUntil === 1;
};

/**
 * Generate date preparation timeline
 */
export const getDatePreparationTimeline = (date: Date | string): Array<{
  time: string;
  task: string;
  completed: boolean;
}> => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const timeline = [
    {
      time: format(addHours(dateObj, -24), 'MMM do, h:mm a'),
      task: 'Confirm your date and review location details',
      completed: isPast(addHours(dateObj, -24))
    },
    {
      time: format(addHours(dateObj, -4), 'MMM do, h:mm a'),
      task: 'Plan your outfit and travel route',
      completed: isPast(addHours(dateObj, -4))
    },
    {
      time: format(addHours(dateObj, -1), 'MMM do, h:mm a'),
      task: 'Final preparations and head to location',
      completed: isPast(addHours(dateObj, -1))
    }
  ];
  
  return timeline;
};

/**
 * Calculate estimated travel time helper
 */
export const getEstimatedTravelTime = (userLocation?: string, dateLocation?: string): string => {
  // This would integrate with maps API in a real implementation
  // For now, return a default estimate
  if (!userLocation || !dateLocation) {
    return '30 minutes'; // Default estimate
  }
  
  // Simplified logic based on same city vs different areas
  if (userLocation.toLowerCase().includes(dateLocation.toLowerCase().split(',')[0])) {
    return '15-30 minutes';
  } else {
    return '45-60 minutes';
  }
};