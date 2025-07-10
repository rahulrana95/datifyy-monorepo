/**
 * Async Handler Middleware - Error Wrapper
 * 
 * Wraps async route handlers to catch errors and pass them to Express error middleware.
 * Eliminates the need for try-catch blocks in every async route handler.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';

/**
 * Async route handler type definition
 */
type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | any>;

/**
 * Enhanced async route handler with error context
 */
type EnhancedAsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Async Handler Wrapper
 * 
 * Wraps async route handlers to automatically catch and forward errors
 * to Express error handling middleware. Provides enhanced error context
 * and logging for debugging and monitoring.
 * 
 * @param handler Async route handler function
 * @returns Express middleware function
 * 
 * @example
 * ```typescript
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getUsers();
 *   res.json({ success: true, data: users });
 * }));
 * ```
 */
export function asyncHandler(handler: AsyncRouteHandler): EnhancedAsyncRouteHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const logger = Logger.getInstance();
    const startTime = Date.now();
    
    // Generate unique request ID for tracking
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Attach request ID to request object for later use
    (req as any).requestId = requestId;
    
    try {
      // Execute the async handler
      await handler(req, res, next);
      
      // Log successful request completion
      const processingTime = Date.now() - startTime;
      
      logger.debug('Request completed successfully', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        processingTime,
        userAgent: req.headers['user-agent'],
        ip: getClientIpAddress(req)
      });
      
    } catch (error:any) {
      // Enhanced error logging with context
      const processingTime = Date.now() - startTime;
      
      logger.error('Async handler error', {
        requestId,
        method: req.method,
        path: req.path,
        query: req.query,
        body: sanitizeRequestBody(req.body),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        processingTime,
        userAgent: req.headers['user-agent'],
        ip: getClientIpAddress(req),
        adminId: (req as any).admin?.id,
        userId: (req as any).user?.id
      });
      
      // Attach request context to error for middleware
      (error as any).requestContext = {
        requestId,
        method: req.method,
        path: req.path,
        processingTime,
        ip: getClientIpAddress(req)
      };
      
      // Forward error to Express error handling middleware
      next(error);
    }
  };
}

/**
 * Async Handler with Custom Error Handler
 * 
 * Allows custom error handling while still benefiting from async error catching.
 * Useful for endpoints that need specific error response formats.
 * 
 * @param handler Async route handler function
 * @param errorHandler Custom error handler function
 * @returns Express middleware function
 */
export function asyncHandlerWithErrorHandler(
  handler: AsyncRouteHandler,
  errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void
): EnhancedAsyncRouteHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  };
}

/**
 * Async Handler with Timeout
 * 
 * Wraps async handlers with a timeout to prevent hanging requests.
 * Useful for endpoints that make external API calls or complex database queries.
 * 
 * @param handler Async route handler function
 * @param timeoutMs Timeout in milliseconds (default: 30 seconds)
 * @returns Express middleware function
 */
export function asyncHandlerWithTimeout(
  handler: AsyncRouteHandler,
  timeoutMs: number = 30000
): EnhancedAsyncRouteHandler {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });
    
    // Race between handler execution and timeout
    await Promise.race([
      handler(req, res, next),
      timeoutPromise
    ]);
  });
}

/**
 * Async Handler with Rate Limiting Context
 * 
 * Enhances async handler with rate limiting context for better monitoring.
 * Tracks request patterns and provides data for rate limiting decisions.
 * 
 * @param handler Async route handler function
 * @param rateLimitKey Function to generate rate limit key
 * @returns Express middleware function
 */
export function asyncHandlerWithRateLimit(
  handler: AsyncRouteHandler,
  rateLimitKey?: (req: Request) => string
): EnhancedAsyncRouteHandler {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const logger = Logger.getInstance();
    
    // Generate rate limit key
    const key = rateLimitKey ? rateLimitKey(req) : getClientIpAddress(req);
    
    // Attach rate limit context
    (req as any).rateLimitContext = {
      key,
      timestamp: Date.now(),
      endpoint: `${req.method} ${req.path}`
    };
    
    logger.debug('Rate limit context attached', {
      rateLimitKey: key,
      endpoint: `${req.method} ${req.path}`,
      requestId: (req as any).requestId
    });
    
    await handler(req, res, next);
  });
}

/**
 * Bulk Async Handler
 * 
 * Wraps multiple async handlers for endpoints that need to execute
 * multiple async operations in sequence.
 * 
 * @param handlers Array of async route handlers
 * @returns Express middleware function
 */
export function bulkAsyncHandler(handlers: AsyncRouteHandler[]): EnhancedAsyncRouteHandler {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const handler of handlers) {
      // If response has been sent, break the chain
      if (res.headersSent) {
        break;
      }
      
      await handler(req, res, next);
    }
  });
}

/**
 * Helper Functions
 */

/**
 * Extract client IP address from request headers
 */
function getClientIpAddress(req: Request): string {
  return (
    req.headers['cf-connecting-ip'] as string ||
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    '127.0.0.1'
  );
}

/**
 * Sanitize request body for logging (remove sensitive data)
 */
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  const sensitiveFields = [
    'password',
    'confirmPassword',
    'currentPassword',
    'newPassword',
    'token',
    'refreshToken',
    'secret',
    'key',
    'apiKey',
    'accessKey',
    'secretKey'
  ];
  
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: any,
  requestId?: string
): {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
  };
} {
  return {
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { details: error.stack })
    },
    metadata: {
      requestId: requestId || 'unknown',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  requestId?: string
): {
  success: boolean;
  message?: string;
  data: T;
  metadata: {
    requestId: string;
    timestamp: string;
  };
} {
  return {
    success: true,
    message,
    data,
    metadata: {
      requestId: requestId || 'unknown',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Performance monitoring decorator for async handlers
 */
export function withPerformanceMonitoring(handler: AsyncRouteHandler): AsyncRouteHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const logger = Logger.getInstance();
    const startTime = process.hrtime.bigint();
    
    try {
      await handler(req, res, next);
    } finally {
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
      
      logger.info('Handler performance', {
        method: req.method,
        path: req.path,
        executionTime: `${executionTime.toFixed(2)}ms`,
        requestId: (req as any).requestId
      });
      
      // Add performance header for monitoring
      res.setHeader('X-Response-Time', `${executionTime.toFixed(2)}ms`);
    }
  };
}