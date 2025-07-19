"use strict";
// libs/shared-utils/src/validation/fileValidationUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_VALIDATION_CONFIGS = void 0;
exports.validateFile = validateFile;
exports.validateFiles = validateFiles;
exports.validateFileName = validateFileName;
exports.isImageFile = isImageFile;
exports.isVideoFile = isVideoFile;
exports.isDocumentFile = isDocumentFile;
exports.getFileExtension = getFileExtension;
exports.generateSafeFileName = generateSafeFileName;
exports.estimateUploadTime = estimateUploadTime;
exports.createValidationConfig = createValidationConfig;
const formatUtils_1 = require("../format/formatUtils");
/**
 * Default configuration for different file categories
 */
exports.FILE_VALIDATION_CONFIGS = {
    PROFILE_IMAGE: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
        minImageDimensions: { width: 200, height: 200 },
        maxImageDimensions: { width: 4096, height: 4096 },
        requireImageDimensions: true
    },
    GALLERY_IMAGE: {
        maxSize: 15 * 1024 * 1024, // 15MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        minImageDimensions: { width: 300, height: 300 },
        maxImageDimensions: { width: 8192, height: 8192 },
        requireImageDimensions: true
    },
    DOCUMENT: {
        maxSize: 25 * 1024 * 1024, // 25MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
        requireImageDimensions: false
    }
};
/**
 * Validate a single file against configuration
 */
function validateFile(fileInfo, config) {
    const errors = [];
    const warnings = [];
    try {
        // 1. Size validation
        if (config.maxSize && fileInfo.size > config.maxSize) {
            errors.push(`File size ${(0, formatUtils_1.formatFileSize)(fileInfo.size)} exceeds maximum allowed size ${(0, formatUtils_1.formatFileSize)(config.maxSize)}`);
        }
        // 2. MIME type validation
        if (config.allowedMimeTypes && !config.allowedMimeTypes.includes(fileInfo.type)) {
            errors.push(`File type '${fileInfo.type}' is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}`);
        }
        // 3. File extension validation
        if (config.allowedExtensions) {
            const extension = getFileExtension(fileInfo.name);
            if (!config.allowedExtensions.includes(extension.toLowerCase())) {
                errors.push(`File extension '${extension}' is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`);
            }
        }
        // 4. Basic file name validation
        const nameValidation = validateFileName(fileInfo.name);
        if (!nameValidation.isValid) {
            errors.push(...nameValidation.errors);
        }
        // 5. Size warnings for large files
        if (fileInfo.size > 5 * 1024 * 1024) { // 5MB
            warnings.push('Large file size may result in slower upload times');
        }
        // 6. Image-specific validations (if dimensions are available)
        if (isImageFile(fileInfo.type) && config.requireImageDimensions) {
            // Note: Dimension validation would need actual image analysis
            // This is a placeholder for where dimension checking would go
            warnings.push('Image dimensions will be validated after upload');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            fileInfo: {
                size: fileInfo.size,
                type: fileInfo.type
            }
        };
    }
    catch (error) {
        return {
            isValid: false,
            errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
            warnings
        };
    }
}
/**
 * Validate multiple files
 */
function validateFiles(files, config, options) {
    const results = [];
    const globalErrors = [];
    // Global validations
    if ((options === null || options === void 0 ? void 0 : options.maxFiles) && files.length > options.maxFiles) {
        globalErrors.push(`Too many files. Maximum ${options.maxFiles} files allowed, but ${files.length} provided`);
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if ((options === null || options === void 0 ? void 0 : options.totalSizeLimit) && totalSize > options.totalSizeLimit) {
        globalErrors.push(`Total file size ${(0, formatUtils_1.formatFileSize)(totalSize)} exceeds limit ${(0, formatUtils_1.formatFileSize)(options.totalSizeLimit)}`);
    }
    // Individual file validations
    files.forEach(file => {
        const result = validateFile(file, config);
        results.push(Object.assign(Object.assign({}, result), { fileName: file.name }));
    });
    const validFiles = results.filter(r => r.isValid).length;
    const largestFile = files.reduce((largest, file) => file.size > largest.size ? file : largest, files[0] || { name: '', size: 0 });
    return {
        isValid: globalErrors.length === 0 && validFiles === files.length,
        results,
        globalErrors,
        summary: {
            totalFiles: files.length,
            validFiles,
            totalSize,
            largestFile: { name: largestFile.name, size: largestFile.size }
        }
    };
}
/**
 * Validate file name
 */
function validateFileName(fileName) {
    const errors = [];
    if (!fileName || fileName.trim().length === 0) {
        errors.push('File name cannot be empty');
    }
    if (fileName.length > 255) {
        errors.push('File name too long (maximum 255 characters)');
    }
    // Check for dangerous characters
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(fileName)) {
        errors.push('File name contains invalid characters');
    }
    // Check for reserved names (Windows)
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
    const nameWithoutExt = fileName.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExt)) {
        errors.push('File name is reserved and cannot be used');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Check if file is an image based on MIME type
 */
function isImageFile(mimeType) {
    return mimeType.startsWith('image/');
}
/**
 * Check if file is a video based on MIME type
 */
function isVideoFile(mimeType) {
    return mimeType.startsWith('video/');
}
/**
 * Check if file is a document based on MIME type
 */
function isDocumentFile(mimeType) {
    const documentMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    return documentMimes.includes(mimeType);
}
/**
 * Get file extension from filename
 */
function getFileExtension(fileName) {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot === -1 ? '' : fileName.substring(lastDot);
}
/**
 * Generate safe file name for storage
 */
function generateSafeFileName(originalName, prefix) {
    const extension = getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(extension, '');
    // Remove dangerous characters and limit length
    const safeName = nameWithoutExt
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 100)
        .toLowerCase();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const finalName = prefix
        ? `${prefix}_${safeName}_${timestamp}_${randomSuffix}${extension}`
        : `${safeName}_${timestamp}_${randomSuffix}${extension}`;
    return finalName;
}
/**
 * Estimate upload time based on file size and connection speed
 */
function estimateUploadTime(fileSize, connectionSpeedMbps = 10) {
    // Convert Mbps to bytes per second
    const bytesPerSecond = (connectionSpeedMbps * 1024 * 1024) / 8;
    // Add 30% overhead for HTTP and processing
    const estimatedSeconds = Math.ceil((fileSize / bytesPerSecond) * 1.3);
    let estimatedText;
    if (estimatedSeconds < 60) {
        estimatedText = `${estimatedSeconds} seconds`;
    }
    else if (estimatedSeconds < 3600) {
        const minutes = Math.ceil(estimatedSeconds / 60);
        estimatedText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    else {
        const hours = Math.ceil(estimatedSeconds / 3600);
        estimatedText = `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return {
        estimatedSeconds,
        estimatedText
    };
}
/**
 * Create validation config for specific use case
 */
function createValidationConfig(category, overrides) {
    const baseConfig = exports.FILE_VALIDATION_CONFIGS[category];
    // @ts-ignore
    return Object.assign(Object.assign({}, baseConfig), overrides);
}
