// src/infrastructure/middleware/globalErrorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../infrastructure/logging/Logger';
import { BaseError, isOperationalError } from '../domain/errors/AuthErrors';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    requestId?: string;
    timestamp: string;
    path: string;
    method: string;
    details?: any;
  };
}

export function createGlobalErrorHandler(logger: Logger) {
  return (error: Error, req: Request, res: Response, next: NextFunction): void => {
    // Generate request ID for tracing
    const requestId = (req as any).id || generateRequestId();
    
    // Log the error with context
    logError(error, req, requestId, logger);

    // Handle different types of errors
    if (isOperationalError(error)) {
      handleOperationalError(error, req, res, requestId);
    } else if (isDatabaseError(error)) {
      handleDatabaseError(error, req, res, requestId);
    } else {
      handleUnknownError(error, req, res, requestId);
    }
  };
}

function handleOperationalError(
  error: BaseError, 
  req: Request, 
  res: Response, 
  requestId: string
): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      requestId,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      // Only include details in development
      ...(process.env.NODE_ENV === 'development' && error.context && { 
        details: error.context 
      }),
    },
  };

  res.status(error.statusCode).json(errorResponse);
}

function handleDatabaseError(
  error: Error, 
  req: Request, 
  res: Response, 
  requestId: string
): void {
  // Don't expose database errors to client in production
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' 
        ? `Database Error: ${error.message}` 
        : 'Database operation failed',
      code: 'DATABASE_ERROR',
      statusCode: 500,
      requestId,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  };

  res.status(500).json(errorResponse);
}

function handleUnknownError(
  error: Error, 
  req: Request, 
  res: Response, 
  requestId: string
): void {
  // Don't expose internal errors in production
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      requestId,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      // Include stack trace only in development
      ...(process.env.NODE_ENV === 'development' && { 
        details: { stack: error.stack } 
      }),
    },
  };

  res.status(500).json(errorResponse);
}

function logError(error: Error, req: Request, requestId: string, logger: Logger): void {
  const logContext = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  };

  if (isOperationalError(error)) {
    // Log operational errors as warnings (these are expected user errors)
    logger.warn('Operational error occurred', logContext);
  } else {
    // Log system errors as errors (these are unexpected)
    logger.error('System error occurred', logContext);
  }
}

function isDatabaseError(error: Error): boolean {
  // Check for common database error patterns
  const dbErrorPatterns = [
    'connection',
    'timeout',
    'constraint',
    'duplicate',
    'foreign key',
    'syntax error',
    'permission denied',
  ];

  const errorMessage = error.message.toLowerCase();
  return dbErrorPatterns.some(pattern => errorMessage.includes(pattern)) ||
         error.name.includes('QueryFailed') ||
         error.name.includes('Connection') ||
         error.name.includes('Database');
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Async error wrapper for route handlers
export function asyncErrorHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) {
  return (req: T, res: U, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler for unmatched routes
export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  };

  res.status(404).json(errorResponse);
}