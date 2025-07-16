"use strict";
// libs/shared-types/src/interfaces/storage.interfaces.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageInvalidFileTypeError = exports.StorageFileTooLargeError = exports.StorageQuotaExceededError = exports.StorageError = void 0;
/**
 * Shared Error Types
 */
class StorageError extends Error {
    constructor(message, code, provider, operation) {
        super(message);
        this.code = code;
        this.provider = provider;
        this.operation = operation;
        this.name = 'StorageError';
    }
}
exports.StorageError = StorageError;
class StorageQuotaExceededError extends StorageError {
    constructor(provider) {
        super('Storage quota exceeded', 'QUOTA_EXCEEDED', provider, 'upload');
    }
}
exports.StorageQuotaExceededError = StorageQuotaExceededError;
class StorageFileTooLargeError extends StorageError {
    constructor(maxSize, provider) {
        super(`File too large. Maximum size: ${maxSize} bytes`, 'FILE_TOO_LARGE', provider, 'upload');
    }
}
exports.StorageFileTooLargeError = StorageFileTooLargeError;
class StorageInvalidFileTypeError extends StorageError {
    constructor(allowedTypes, provider) {
        super(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 'INVALID_FILE_TYPE', provider, 'upload');
    }
}
exports.StorageInvalidFileTypeError = StorageInvalidFileTypeError;
