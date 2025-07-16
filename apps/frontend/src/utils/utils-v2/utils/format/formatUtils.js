"use strict";
// libs/shared-utils/src/format/formatUtils.ts
/**
 * Shared Format Utilities
 * Consistent formatting across frontend and backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSocialHandle = exports.formatPriceRange = exports.formatVerificationStatus = exports.formatList = exports.formatOccupation = exports.formatEducation = exports.formatInterests = exports.formatFileSize = exports.formatPercentage = exports.truncateText = exports.formatBio = exports.formatName = exports.formatPhoneNumber = exports.formatHeightMetric = exports.formatHeightImperial = exports.formatHeight = exports.formatNumber = exports.formatCurrency = void 0;
/**
 * Format currency values
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * Format numbers with commas
 */
const formatNumber = (number, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(number);
};
exports.formatNumber = formatNumber;
/**
 * Format height from cm to feet and inches
 */
const formatHeight = (heightCm) => {
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm / 30.48 - feet) * 12);
    return `${heightCm}cm (${feet}'${inches}")`;
};
exports.formatHeight = formatHeight;
/**
 * Format height to just feet and inches
 */
const formatHeightImperial = (heightCm) => {
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm / 30.48 - feet) * 12);
    return `${feet}'${inches}"`;
};
exports.formatHeightImperial = formatHeightImperial;
/**
 * Format height to just cm
 */
const formatHeightMetric = (heightCm) => {
    return `${heightCm}cm`;
};
exports.formatHeightMetric = formatHeightMetric;
/**
 * Format phone number
 */
const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format based on length
    if (cleaned.length === 10) {
        // US format: (555) 123-4567
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    else if (cleaned.length === 11 && cleaned[0] === '1') {
        // US format with country code: +1 (555) 123-4567
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    // Default: just return the cleaned number
    return cleaned;
};
exports.formatPhoneNumber = formatPhoneNumber;
/**
 * Format name for display (capitalize first letter of each word)
 */
const formatName = (name) => {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
exports.formatName = formatName;
/**
 * Format bio with line breaks preserved
 */
const formatBio = (bio) => {
    return bio
        .trim()
        .replace(/\n\s*\n/g, '\n\n') // Remove extra line breaks
        .replace(/\n/g, '<br>'); // Convert to HTML line breaks if needed
};
exports.formatBio = formatBio;
/**
 * Truncate text with ellipsis
 */
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3).trim() + '...';
};
exports.truncateText = truncateText;
/**
 * Format percentage
 */
const formatPercentage = (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
};
exports.formatPercentage = formatPercentage;
/**
 * Format file size
 */
const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};
exports.formatFileSize = formatFileSize;
/**
 * Format interests for display
 */
const formatInterests = (interests) => {
    if (interests.length === 0)
        return '';
    if (interests.length === 1)
        return interests[0];
    if (interests.length === 2)
        return interests.join(' and ');
    const lastInterest = interests[interests.length - 1];
    const otherInterests = interests.slice(0, -1);
    return `${otherInterests.join(', ')}, and ${lastInterest}`;
};
exports.formatInterests = formatInterests;
/**
 * Format education level for display
 */
const formatEducation = (education) => {
    const educationMap = {
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
exports.formatEducation = formatEducation;
/**
 * Format occupation for display
 */
const formatOccupation = (occupation) => {
    return occupation
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
exports.formatOccupation = formatOccupation;
/**
 * Format list with proper grammar
 */
const formatList = (items, conjunction = 'and') => {
    if (items.length === 0)
        return '';
    if (items.length === 1)
        return items[0];
    if (items.length === 2)
        return items.join(` ${conjunction} `);
    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);
    return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};
exports.formatList = formatList;
/**
 * Format verification status
 */
const formatVerificationStatus = (isEmailVerified, isPhoneVerified, isIdVerified) => {
    const verified = [];
    if (isEmailVerified)
        verified.push('Email');
    if (isPhoneVerified)
        verified.push('Phone');
    if (isIdVerified)
        verified.push('ID');
    if (verified.length === 0)
        return 'Unverified';
    return `Verified: ${(0, exports.formatList)(verified)}`;
};
exports.formatVerificationStatus = formatVerificationStatus;
/**
 * Format price range
 */
const formatPriceRange = (min, max, currency = 'USD') => {
    const minFormatted = (0, exports.formatCurrency)(min, currency);
    const maxFormatted = (0, exports.formatCurrency)(max, currency);
    if (min === max)
        return minFormatted;
    return `${minFormatted} - ${maxFormatted}`;
};
exports.formatPriceRange = formatPriceRange;
/**
 * Format social media handle
 */
const formatSocialHandle = (handle, platform) => {
    const cleanHandle = handle.replace(/^@/, '');
    return `@${cleanHandle}`;
};
exports.formatSocialHandle = formatSocialHandle;
