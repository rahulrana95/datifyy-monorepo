import * as dotenv from 'dotenv';

export class Config {
  private static instance: Config;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.loadEnvironment();
    this.loadConfiguration();
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get<T = any>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let value: any = this.config;
    
    for (const k of keys) {
      if (value instanceof Map) {
        value = value.get(k);
      } else if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue as T;
      }
      
      if (value === undefined) {
        return defaultValue as T;
      }
    }
    
    return value as T;
  }

  private loadEnvironment(): void {
    dotenv.config();
  }

  private loadConfiguration(): void {
    this.config.set('server', {
      port: parseInt(process.env.SERVER_PORT || '4000', 10),
      env: process.env.NODE_ENV || 'development',
      bodyLimit: process.env.BODY_LIMIT || '10mb',
      logFormat: process.env.LOG_FORMAT || 'combined',
    });

    this.config.set('database', {
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(process.env.POSTGRES_DB_PORT || '5432', 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: process.env.NODE_ENV === 'development',
      synchronize: false,
    });

    this.config.set('cors', {
      allowedOrigins: this.parseArrayFromEnv('CORS_ALLOWED_ORIGINS', [
        'https://datifyy.com',
        'http://localhost:3000',
      ]),
      allowedPatterns: [/\.vercel\.app$/],
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });

    this.config.set('rateLimit', {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      message: 'Too many requests from this IP, please try again later.',
    });

    this.config.set('api', {
      prefix: process.env.API_PREFIX || '/api/v1',
    });

    this.config.set('jwt', {
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '48h',
    });

    this.config.set('email', {
      mailerSendKey: process.env.MAILER_SEND_KEY || 'na',
      fromEmail: process.env.FROM_EMAIL || 'noreply@datifyy.com',
      fromName: process.env.FROM_NAME || 'Datifyy',
    });

    this.config.set('redis', {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 0,
      keyPrefix: 'datifyy-backend:'
    })
  }

  private parseArrayFromEnv(key: string, defaultValue: string[] = []): string[] {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.split(',').map(item => item.trim());
  }

  getRedisConfig() {
    return this.config.get('redis');
  }
}
