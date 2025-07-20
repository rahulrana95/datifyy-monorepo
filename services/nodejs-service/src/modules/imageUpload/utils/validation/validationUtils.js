"use strict";
// libs/shared-utils/src/validation/validationUtils.ts
/**
 * Shared Validation Utilities
 * Used by both frontend and backend for consistent validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIncomeRange = exports.validateAgeRange = exports.validateInterests = exports.combineValidationResults = exports.validateVerificationCode = exports.validateUrl = exports.validatePhoneNumber = exports.validateBio = exports.validateHeight = exports.validateAge = exports.validateName = exports.validatePassword = exports.validateEmail = void 0;
/**
 * Email validation
 */
const validateEmail = (email) => {
    const errors = [];
    if (!email.trim()) {
        errors.push('Email is required');
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('Please enter a valid email address');
    }
    else if (email.length > 254) {
        errors.push('Email address is too long');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateEmail = validateEmail;
/**
 * Password validation
 */
const validatePassword = (password) => {
    const errors = [];
    if (!password) {
        errors.push('Password is required');
    }
    else {
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (password.length > 128) {
            errors.push('Password must be less than 128 characters');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validatePassword = validatePassword;
/**
 * Name validation
 */
const validateName = (name, fieldName = 'Name') => {
    const errors = [];
    if (!name.trim()) {
        errors.push(`${fieldName} is required`);
    }
    else if (name.trim().length < 2) {
        errors.push(`${fieldName} must be at least 2 characters long`);
    }
    else if (name.trim().length > 50) {
        errors.push(`${fieldName} must be less than 50 characters`);
    }
    else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
        errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateName = validateName;
/**
 * Age validation for dating app
 */
const validateAge = (age) => {
    const errors = [];
    if (!age) {
        errors.push('Age is required');
    }
    else if (age < 18) {
        errors.push('You must be at least 18 years old');
    }
    else if (age > 100) {
        errors.push('Please enter a valid age');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateAge = validateAge;
/**
 * Height validation (in cm)
 */
const validateHeight = (height) => {
    const errors = [];
    if (height && (height < 100 || height > 250)) {
        errors.push('Height must be between 100-250 cm');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateHeight = validateHeight;
/**
 * Bio validation
 */
const validateBio = (bio) => {
    const errors = [];
    if (bio && bio.length > 500) {
        errors.push('Bio cannot exceed 500 characters');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateBio = validateBio;
/**
 * Phone number validation
 */
const validatePhoneNumber = (phone) => {
    const errors = [];
    if (phone) {
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            errors.push('Phone number must be at least 10 digits');
        }
        else if (digitsOnly.length > 15) {
            errors.push('Phone number cannot exceed 15 digits');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validatePhoneNumber = validatePhoneNumber;
/**
 * URL validation
 */
const validateUrl = (url) => {
    const errors = [];
    if (url) {
        try {
            // @ts-ignore
            new URL(url);
        }
        catch (_a) {
            errors.push('Please enter a valid URL');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateUrl = validateUrl;
/**
 * Verify code validation (for email/SMS verification)
 */
const validateVerificationCode = (code) => {
    const errors = [];
    if (!code.trim()) {
        errors.push('Verification code is required');
    }
    else if (!/^\d{4,8}$/.test(code.trim())) {
        errors.push('Verification code must be 4-8 digits');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateVerificationCode = validateVerificationCode;
/**
 * Combine multiple validation results
 */
const combineValidationResults = (...results) => {
    const allErrors = results.flatMap(result => result.errors);
    return {
        isValid: allErrors.length === 0,
        errors: allErrors
    };
};
exports.combineValidationResults = combineValidationResults;
/**
 * Dating app specific validations
 */
/**
 * Validate interests array
 */
const validateInterests = (interests) => {
    const errors = [];
    if (interests && interests.length > 10) {
        errors.push('You can select up to 10 interests');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateInterests = validateInterests;
/**
 * Validate age range for partner preferences
 */
const validateAgeRange = (minAge, maxAge) => {
    const errors = [];
    if (minAge && maxAge) {
        if (minAge > maxAge) {
            errors.push('Minimum age cannot be greater than maximum age');
        }
        if (minAge < 18) {
            errors.push('Minimum age must be at least 18');
        }
        if (maxAge > 100) {
            errors.push('Maximum age cannot exceed 100');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateAgeRange = validateAgeRange;
/**
 * Validate income range
 */
const validateIncomeRange = (minIncome, maxIncome) => {
    const errors = [];
    if (minIncome && maxIncome) {
        if (minIncome > maxIncome) {
            errors.push('Minimum income cannot be greater than maximum income');
        }
        if (minIncome < 0 || maxIncome < 0) {
            errors.push('Income values cannot be negative');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateIncomeRange = validateIncomeRange;
