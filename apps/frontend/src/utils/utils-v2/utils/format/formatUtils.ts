// libs/shared-utils/src/format/formatUtils.ts
/**
 * Shared Format Utilities
 * Consistent formatting across frontend and backend
 */

/**
 * Format currency values
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format numbers with commas
 */
export const formatNumber = (
  number: number,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format height from cm to feet and inches
 */
export const formatHeight = (heightCm: number): string => {
  const feet = Math.floor(heightCm / 30.48);
  const inches = Math.round((heightCm / 30.48 - feet) * 12);
  return `${heightCm}cm (${feet}'${inches}")`;
};

/**
 * Format height to just feet and inches
 */
export const formatHeightImperial = (heightCm: number): string => {
  const feet = Math.floor(heightCm / 30.48);
  const inches = Math.round((heightCm / 30.48 - feet) * 12);
  return `${feet}'${inches}"`;
};

/**
 * Format height to just cm
 */
export const formatHeightMetric = (heightCm: number): string => {
  return `${heightCm}cm`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    // US format: (555) 123-4567
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // US format with country code: +1 (555) 123-4567
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Default: just return the cleaned number
  return cleaned;
};

/**
 * Format name for display (capitalize first letter of each word)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format bio with line breaks preserved
 */
export const formatBio = (bio: string): string => {
  return bio
    .trim()
    .replace(/\n\s*\n/g, '\n\n') // Remove extra line breaks
    .replace(/\n/g, '<br>'); // Convert to HTML line breaks if needed
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};

/**
 * Format interests for display
 */
export const formatInterests = (interests: string[]): string => {
  if (interests.length === 0) return '';
  if (interests.length === 1) return interests[0];
  if (interests.length === 2) return interests.join(' and ');
  
  const lastInterest = interests[interests.length - 1];
  const otherInterests = interests.slice(0, -1);
  
  return `${otherInterests.join(', ')}, and ${lastInterest}`;
};

/**
 * Format education level for display
 */
export const formatEducation = (education: string): string => {
  const educationMap: Record<string, string> = {
    'high_school': 'High School',
    'some_college': 'Some College',
    'bachelors': "Bachelor's Degree",
    'masters': "Master's Degree",
    'phd': 'PhD',
    'trade_school': 'Trade School',
    'professional': 'Professional Degree'
  };
  
  return educationMap[education.toLowerCase()] || education;
};

/**
 * Format occupation for display
 */
export const formatOccupation = (occupation: string): string => {
  return occupation
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format list with proper grammar
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

/**
 * Format verification status
 */
export const formatVerificationStatus = (
  isEmailVerified: boolean,
  isPhoneVerified: boolean,
  isIdVerified: boolean
): string => {
  const verified: string[] = [];
  if (isEmailVerified) verified.push('Email');
  if (isPhoneVerified) verified.push('Phone');
  if (isIdVerified) verified.push('ID');
  
  if (verified.length === 0) return 'Unverified';
  return `Verified: ${formatList(verified)}`;
};

/**
 * Format price range
 */
export const formatPriceRange = (min: number, max: number, currency: string = 'USD'): string => {
  const minFormatted = formatCurrency(min, currency);
  const maxFormatted = formatCurrency(max, currency);
  
  if (min === max) return minFormatted;
  return `${minFormatted} - ${maxFormatted}`;
};

/**
 * Format social media handle
 */
export const formatSocialHandle = (handle: string, platform: string): string => {
  const cleanHandle = handle.replace(/^@/, '');
  return `@${cleanHandle}`;
};