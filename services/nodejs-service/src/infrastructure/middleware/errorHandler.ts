import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';
import { AppError } from '../../errors/AppError';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const logger = Logger.getInstance();
  
  // Log error
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId: (req as any).id,
  });

  // Handle known errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      requestId: (req as any).id,
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    requestId: (req as any).id,
  });
}

