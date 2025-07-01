import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps async route handlers to properly catch errors
 * and pass them to Express error handling middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Alternative implementation with more type safety
export const asyncWrapper = <T = any>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Convert to void by not returning the promise
    fn(req, res, next).catch(next);
  };
};