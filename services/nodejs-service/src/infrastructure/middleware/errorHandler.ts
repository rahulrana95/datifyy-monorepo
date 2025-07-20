import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';
import { AppError } from '../../errors/AppError';
import { 
  BaseError, 
  InvalidCredentialsError,
  UserAlreadyExistsError,
  WeakPasswordError,
  InvalidEmailError 
} from '../../domain/errors/AuthErrors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const logger = Logger.getInstance();
  const requestId = (req as any).id;
  
  // Log error with context
  logger.error('Request error occurred', {
    requestId,
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Handle authentication errors
  if (error instanceof BaseError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        requestId,
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Handle validation errors from express-validator or class-validator
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: (error as any).details || error.message,
        requestId,
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'TOKEN_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Handle database errors
  if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
    res.status(409).json({
      success: false,
      error: {
        message: 'Resource already exists',
        code: 'DUPLICATE_RESOURCE',
        requestId,
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'INTERNAL_ERROR',
      requestId,
      timestamp: new Date().toISOString()
    }
  });
}
