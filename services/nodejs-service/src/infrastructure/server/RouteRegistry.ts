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
    // Root-level health check for Render and monitoring services
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: this.dataSource.isInitialized ? 'connected' : 'disconnected',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        }
      });
    });

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
