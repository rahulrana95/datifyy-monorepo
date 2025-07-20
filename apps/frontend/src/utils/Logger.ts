// apps/frontend/src/utils/Logger.ts

/**
 * Enterprise Frontend Logger
 * 
 * Features:
 * - Structured logging with context
 * - Log levels (debug, info, warn, error)
 * - Environment-aware logging
 * - Performance tracking
 * - Error aggregation ready
 * 
 * Patterns:
 * - Singleton pattern for global logger
 * - Factory pattern for component loggers
 * - Observer pattern for log aggregation
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  timestamp?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  timestamp: string;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private context: LogContext = {};
  private logLevel: LogLevel;

  constructor(componentName?: string) {
    this.logLevel = this.getLogLevel();
    if (componentName) {
      this.context.component = componentName;
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  private getLogLevel(): LogLevel {
    const env = process.env.NODE_ENV;
    if (env === 'development') return LogLevel.DEBUG;
    if (env === 'test') return LogLevel.ERROR;
    return LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      context: { ...this.context, ...context },
      timestamp: new Date().toISOString()
    };
  }

  private output(entry: LogEntry): void {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const levelName = levelNames[entry.level];
    
    const logMessage = [
      `[${entry.timestamp}]`,
      `[${levelName}]`,
      entry.context.component ? `[${entry.context.component}]` : '',
      entry.message
    ].filter(Boolean).join(' ');

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.context);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.context);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, entry.context, entry.error);
        break;
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(entry);
    }
  }

  private sendToExternalLogger(entry: LogEntry): void {
    // Integration with LogRocket, Sentry, or other services
    try {
      if (typeof window !== 'undefined' && (window as any).LogRocket) {
        (window as any).LogRocket.log(entry.level, entry.message, entry.context);
      }
    } catch (error) {
      // Silently fail to avoid logging loops
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.formatMessage(LogLevel.DEBUG, message, context);
    this.output(entry);
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.formatMessage(LogLevel.INFO, message, context);
    this.output(entry);
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.formatMessage(LogLevel.WARN, message, context);
    this.output(entry);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.formatMessage(LogLevel.ERROR, message, context);
    entry.error = error;
    this.output(entry);
  }

  // Performance tracking
  time(label: string): void {
    console.time(`[${this.context.component || 'App'}] ${label}`);
  }

  timeEnd(label: string): void {
    console.timeEnd(`[${this.context.component || 'App'}] ${label}`);
  }

  // Group logging
  group(label: string): void {
    console.group(`[${this.context.component || 'App'}] ${label}`);
  }

  groupEnd(): void {
    console.groupEnd();
  }
}

export { Logger };
export type { LogContext, LogEntry };