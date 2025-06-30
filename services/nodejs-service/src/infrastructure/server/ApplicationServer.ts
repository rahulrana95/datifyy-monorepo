import express, { Express } from 'express';
import { Server } from 'http';
import { Config } from '../config/Config';
import { Logger } from '../logging/Logger';
import { MiddlewareFactory } from './MiddlewareFactory';
import { RouteRegistry } from './RouteRegistry';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { HealthCheckService } from '../../services/health/HealthCheckService';

export class ApplicationServer {
  private app: Express;
  private server: Server | null = null;
  private readonly config: Config;
  private readonly logger: Logger;
  private readonly middlewareFactory: MiddlewareFactory;
  private readonly routeRegistry: RouteRegistry;
  private readonly databaseConnection: DatabaseConnection;
  private readonly healthCheckService: HealthCheckService;

  constructor(
    config: Config,
    logger: Logger,
    middlewareFactory: MiddlewareFactory,
    routeRegistry: RouteRegistry,
    databaseConnection: DatabaseConnection,
    healthCheckService: HealthCheckService
  ) {
    this.config = config;
    this.logger = logger;
    this.middlewareFactory = middlewareFactory;
    this.routeRegistry = routeRegistry;
    this.databaseConnection = databaseConnection;
    this.healthCheckService = healthCheckService;
    this.app = express();
  }

  async start(): Promise<void> {
    try {
      // Initialize database connection
      await this.databaseConnection.connect();
      
      // Apply middleware
      this.middlewareFactory.apply(this.app);
      
      // Register routes
      this.routeRegistry.register(this.app);
      
      // Start server
      const port = this.config.get('server.port');
      this.server = this.app.listen(port, () => {
        this.logger.info(`Server started on port ${port}`);
      });
      
    } catch (error) {
      this.logger.error('Failed to start server', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      // Close server connections
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server!.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      
      // Close database connection
      await this.databaseConnection.disconnect();
      
      this.logger.info('Server stopped successfully');
    } catch (error) {
      this.logger.error('Error stopping server', error);
      throw error;
    }
  }

  getApp(): Express {
    return this.app;
  }
}