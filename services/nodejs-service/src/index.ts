import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from './infrastructure/config/Config';
import { Container } from './infrastructure/di/Container';
import { Logger } from './infrastructure/logging/Logger';
import { ApplicationServer } from './infrastructure/server/ApplicationServer';
import { gracefulShutdown } from './infrastructure/utils/gracefulShutdown';

// Global database connection for dependency injection
export let AppDataSource: DataSource;

const logger = Logger.getInstance();

async function bootstrap(): Promise<void> {
  try {
    logger.info('Starting application bootstrap');
    
    // Load configuration
    const config = Config.getInstance();
    
    // Initialize database connection
    const dbConfig = config.get('database');
    AppDataSource = new DataSource({
      ...dbConfig,
      entities: [__dirname + '/models/entities/*.{ts,js}'],
      migrations: [__dirname + '/migrations/*.{ts,js}'],
    });

    await AppDataSource.initialize();
    logger.info('Database connection established');
    
    // Initialize dependency injection container
    const container = Container.getInstance(AppDataSource);
    await container.initialize();
    
    // Create and start application server
    const server = await container.resolve<ApplicationServer>('ApplicationServer');
    await server.start();
    
    // Setup graceful shutdown
    gracefulShutdown(server);
    
    logger.info('Application started successfully');
    
  } catch (error) {
    logger.error('Failed to bootstrap application', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
