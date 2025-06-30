import { Config } from './infrastructure/config/Config';
import { Container } from './infrastructure/di/Container';
import { Logger } from './infrastructure/logging/Logger';
import { ApplicationServer } from './infrastructure/server/ApplicationServer';
import { gracefulShutdown } from './infrastructure/utils/gracefulShutdown';

const logger = Logger.getInstance();

async function bootstrap(): Promise<void> {
  try {
    // Load configuration
    const config = Config.getInstance();
    
    // Initialize dependency injection container
    const container = Container.getInstance();
    await container.initialize();
    
    // Create and start application server
    const server = await container.resolve<ApplicationServer>('ApplicationServer');
    await server.start();
    
    // Setup graceful shutdown
    gracefulShutdown(server);
    
  } catch (error) {
    logger.error('Failed to bootstrap application', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();