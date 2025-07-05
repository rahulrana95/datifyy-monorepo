// src/domain/errors/AuthErrors.ts

export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

// Authentication specific errors
export class InvalidCredentialsError extends BaseError {
  readonly statusCode = 401;
  readonly code = 'INVALID_CREDENTIALS';
  readonly isOperational = true;

  constructor(message = 'Invalid email or password', context?: Record<string, any>) {
    super(message, context);
  }
}

export class UserAlreadyExistsError extends BaseError {
  readonly statusCode = 409;
  readonly code = 'USER_ALREADY_EXISTS';
  readonly isOperational = true;

  constructor(message = 'User already exists with this email', context?: Record<string, any>) {
    super(message, context);
  }
}

export class UserNotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = 'USER_NOT_FOUND';
  readonly isOperational = true;

  constructor(message = 'User not found', context?: Record<string, any>) {
    super(message, context);
  }
}

export class WeakPasswordError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'WEAK_PASSWORD';
  readonly isOperational = true;

  constructor(message = 'Password does not meet security requirements', context?: Record<string, any>) {
    super(message, context);
  }
}

export class InvalidEmailError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'INVALID_EMAIL';
  readonly isOperational = true;

  constructor(message = 'Invalid email format', context?: Record<string, any>) {
    super(message, context);
  }
}

export class VerificationCodeExpiredError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'VERIFICATION_CODE_EXPIRED';
  readonly isOperational = true;

  constructor(message = 'Verification code has expired', context?: Record<string, any>) {
    super(message, context);
  }
}

export class InvalidVerificationCodeError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'INVALID_VERIFICATION_CODE';
  readonly isOperational = true;

  constructor(message = 'Invalid verification code', context?: Record<string, any>) {
    super(message, context);
  }
}

// System errors
export class DatabaseError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'DATABASE_ERROR';
  readonly isOperational = false;

  constructor(message = 'Database operation failed', context?: Record<string, any>) {
    super(message, context);
  }
}

export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly isOperational = false;

  constructor(message = 'Internal server error', context?: Record<string, any>) {
    super(message, context);
  }
}

// Type guards
export const isOperationalError = (error: Error): error is BaseError => {
  return error instanceof BaseError && error.isOperational;
};

// Error factory for common cases
export class ErrorFactory {
  static createInvalidCredentials(email?: string): InvalidCredentialsError {
    return new InvalidCredentialsError(undefined, { email });
  }

  static createUserAlreadyExists(email: string): UserAlreadyExistsError {
    return new UserAlreadyExistsError(undefined, { email });
  }

  static createUserNotFound(email: string): UserNotFoundError {
    return new UserNotFoundError(undefined, { email });
  }
}