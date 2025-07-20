import { ApplicationServer } from '../server/ApplicationServer';
import { Logger } from '../logging/Logger';

export function gracefulShutdown(server: ApplicationServer): void {
  const logger = Logger.getInstance();
  
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    try {
      // Set a timeout for graceful shutdown
      const shutdownTimeout = setTimeout(() => {
        logger.error('Graceful shutdown timeout. Forcing exit...');
        process.exit(1);
      }, 30000); // 30 seconds timeout
      
      // Stop accepting new connections and close existing ones
      await server.stop();
      
      clearTimeout(shutdownTimeout);
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown', error);
      process.exit(1);
    }
  };

  // Handle different termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
    shutdown('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason, promise });
    shutdown('unhandledRejection');
  });
}