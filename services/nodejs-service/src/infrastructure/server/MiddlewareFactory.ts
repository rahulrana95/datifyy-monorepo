import { Express } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { Config } from '../config/Config';
import { requestId } from '../middleware/requestId';
import { requestLogger } from '../middleware/requestLogger';
import { errorHandler } from '../middleware/errorHandler';

export class MiddlewareFactory {
  constructor(private readonly config: Config) {}

  apply(app: Express): void {
    // Security middleware
    app.use(helmet());
    
    // Request ID for tracing
    app.use(requestId());
    
    // Compression
    app.use(compression());
    
    // CORS configuration
    app.use(this.createCorsMiddleware());
    
    // Body parsing
    app.use(express.json({ limit: this.config.get('server.bodyLimit', '10mb') }));
    app.use(express.urlencoded({ extended: true }));
    
    // Cookie parsing
    app.use(cookieParser());
    
    // Request logging
    app.use(requestLogger());
    app.use(morgan(this.config.get('server.logFormat', 'combined')));
    
    // Rate limiting
    app.use(this.createRateLimiter());
    
    // Error handling (must be last)
    app.use(errorHandler);
  }

  private createCorsMiddleware() {
    const allowedOrigins = this.config.get<string[]>('cors.allowedOrigins', []);
    
    return cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || this.isAllowedPattern(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      allowedHeaders: this.config.get('cors.allowedHeaders', ['Content-Type', 'Authorization']),
      methods: this.config.get('cors.methods', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    });
  }

  private isAllowedPattern(origin: string): boolean {
    const patterns = this.config.get<RegExp[]>('cors.allowedPatterns', []);
    return patterns.some(pattern => pattern.test(origin));
  }

  private createRateLimiter() {
    return rateLimit({
      windowMs: this.config.get('rateLimit.windowMs', 15 * 60 * 1000),
      max: this.config.get('rateLimit.max', 100),
      message: this.config.get('rateLimit.message', 'Too many requests from this IP'),
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: res.getHeader('Retry-After'),
        });
      },
    });
  }
}