import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';

export function requestLogger() {
  const logger = Logger.getInstance();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    
    // Log request
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      requestId: (req as any).id,
    });
    
    // Log response
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      logger.info('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        requestId: (req as any).id,
      });
    });
    
    next();
  };
}