import winston from 'winston';
import { Config } from '../config/Config';

export class Logger {
  private static instance: Logger;
  private winston: winston.Logger;

  private constructor() {
    const config = Config.getInstance();
    
    this.winston = winston.createLogger({
      level: config.get('logging.level', 'info'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { 
        service: 'datifyy-api',
        environment: config.get('server.env')
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, meta?: any): void {
    this.winston.info(message, meta);
  }

  error(message: string, error?: any): void {
    this.winston.error(message, { error: error?.stack || error });
  }

  warn(message: string, meta?: any): void {
    this.winston.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.winston.debug(message, meta);
  }
}