import { Express, Router, Request, Response, NextFunction } from 'express';
import { Config } from '../config/Config';
import { Logger } from '../logging/Logger';
import { HealthCheckService } from '../../services/health/HealthCheckService';

export class RouteRegistry {
  private routes: Map<string, Router> = new Map();
  
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly healthCheckService?: HealthCheckService
  ) {}

  register(app: Express): void {
    // Health check routes
    app.get('/health', async (req: Request, res: Response): Promise<void> => {
      try {
        if (this.healthCheckService) {
          const health = await this.healthCheckService.getHealth();
          res.json(health);
        } else {
          res.json({ status: 'ok', timestamp: new Date() });
        }
      } catch (error) {
        res.status(503).json({ status: 'unhealthy', error: 'Service unavailable' });
      }
    });

    app.get('/ready', (req: Request, res: Response): void => {
      res.json({ 
        ready: true, 
        timestamp: new Date(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });
    
    // API routes
    const apiPrefix = this.config.get('api.prefix', '/api/v1');
    
    // Register all route modules
    this.routes.forEach((router, path) => {
      app.use(`${apiPrefix}${path}`, router);
      this.logger.info(`Registered routes: ${apiPrefix}${path}`);
    });
    
    // 404 handler
    app.use('*', (req: Request, res: Response): void => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date()
      });
    });
  }

  addRouter(path: string, router: Router): void {
    this.routes.set(path, router);
  }

  // Helper method to create async route handlers with error handling
  static asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
