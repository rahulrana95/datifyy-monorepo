import { Express } from 'express';
import { DataSource } from 'typeorm';
import { Config } from '../config/Config';
import { Logger } from '../logging/Logger';
import { createAppRoutes } from '../../routes';

export class RouteRegistry {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly dataSource: DataSource
  ) {}

  register(app: Express): void {
    // API version prefix
    const apiPrefix = this.config.get('api.prefix', '/api/v1');
    
    // Register all application routes with dataSource dependency
    app.use(apiPrefix, createAppRoutes(this.dataSource));
    
    this.logger.info(`Routes registered with prefix: ${apiPrefix}`);
    
    // 404 handler for unmatched routes
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          message: `Route ${req.originalUrl} not found`,
          code: 'ROUTE_NOT_FOUND',
          timestamp: new Date().toISOString()
        }
      });
    });
  }
}
