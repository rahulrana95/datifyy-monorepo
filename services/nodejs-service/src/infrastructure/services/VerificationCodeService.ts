// src/infrastructure/services/VerificationCodeService.ts

import Redis from 'ioredis';
import { Logger } from '../logging/Logger';
import { 
  VerificationCodeExpiredError,
  InvalidVerificationCodeError,
  InternalServerError
} from '../../domain/errors/AuthErrors';

export interface IVerificationCodeService {
  generateEmailVerificationCode(email: string): Promise<string>;
  verifyEmailCode(email: string, code: string): Promise<boolean>;
  generatePasswordResetCode(email: string): Promise<string>;
  verifyPasswordResetCode(email: string, code: string): Promise<boolean>;
  invalidateEmailVerificationCode(email: string): Promise<void>;
  invalidatePasswordResetCode(email: string): Promise<void>;
}

interface CodeData {
  code: string;
  attempts: number;
  createdAt: number;
}

export class RedisVerificationCodeService implements IVerificationCodeService {
  private readonly EMAIL_VERIFICATION_PREFIX = 'email_verification:';
  private readonly PASSWORD_RESET_PREFIX = 'password_reset:';
  
  // Configuration
  private readonly EMAIL_VERIFICATION_TTL = 15 * 60; // 15 minutes
  private readonly PASSWORD_RESET_TTL = 30 * 60; // 30 minutes
  private readonly MAX_ATTEMPTS = 5;
  
  constructor(
    private readonly redisClient: Redis,
    private readonly logger: Logger
  ) {}

  async generateEmailVerificationCode(email: string): Promise<string> {
    try {
      const code = this.generateSixDigitCode();
      const key = `${this.EMAIL_VERIFICATION_PREFIX}${email.toLowerCase()}`;
      
      const codeData: CodeData = {
        code,
        attempts: 0,
        createdAt: Date.now(),
      };
      
      // Store with TTL (15 minutes)
      await this.redisClient.setex(
        key, 
        this.EMAIL_VERIFICATION_TTL, 
        JSON.stringify(codeData)
      );
      
      this.logger.info('Email verification code generated', { 
        email, 
        expiresIn: this.EMAIL_VERIFICATION_TTL 
      });
      
      return code;
    } catch (error) {
      this.logger.error('Failed to generate email verification code', { email, error });
      throw new InternalServerError('Failed to generate verification code');
    }
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    try {
      const key = `${this.EMAIL_VERIFICATION_PREFIX}${email.toLowerCase()}`;
      const storedData = await this.redisClient.get(key);
      
      if (!storedData) {
        throw new VerificationCodeExpiredError('Verification code has expired or does not exist');
      }
      
      const codeData: CodeData = JSON.parse(storedData);
      
      // Increment verification attempts
      codeData.attempts++;
      
      // Check if max attempts exceeded
      if (codeData.attempts > this.MAX_ATTEMPTS) {
        await this.redisClient.del(key);
        throw new InvalidVerificationCodeError('Too many verification attempts. Please request a new code.');
      }
      
      // Verify code
      if (codeData.code !== code) {
        // Update attempts in Redis
        await this.redisClient.setex(
          key, 
          this.EMAIL_VERIFICATION_TTL, 
          JSON.stringify(codeData)
        );
        
        this.logger.warn('Invalid email verification code attempt', { 
          email, 
          attempts: codeData.attempts 
        });
        
        const remainingAttempts = this.MAX_ATTEMPTS - codeData.attempts;
        throw new InvalidVerificationCodeError(
          `Invalid verification code. ${remainingAttempts} attempts remaining.`
        );
      }
      
      // Code is valid - remove it (single use)
      await this.redisClient.del(key);
      
      this.logger.info('Email verification code verified successfully', { email });
      return true;
    } catch (error) {
      this.logger.error('Failed to verify email code', { email, error });
      
      if (error instanceof VerificationCodeExpiredError || 
          error instanceof InvalidVerificationCodeError) {
        throw error;
      }
      
      throw new InternalServerError('Failed to verify code');
    }
  }

  async generatePasswordResetCode(email: string): Promise<string> {
    try {
      const code = this.generateSixDigitCode();
      const key = `${this.PASSWORD_RESET_PREFIX}${email.toLowerCase()}`;
      
      const codeData: CodeData = {
        code,
        attempts: 0,
        createdAt: Date.now(),
      };
      
      // Store with TTL (30 minutes)
      await this.redisClient.setex(
        key, 
        this.PASSWORD_RESET_TTL, 
        JSON.stringify(codeData)
      );
      
      this.logger.info('Password reset code generated', { 
        email, 
        expiresIn: this.PASSWORD_RESET_TTL 
      });
      
      return code;
    } catch (error) {
      this.logger.error('Failed to generate password reset code', { email, error });
      throw new InternalServerError('Failed to generate reset code');
    }
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
    try {
      const key = `${this.PASSWORD_RESET_PREFIX}${email.toLowerCase()}`;
      const storedData = await this.redisClient.get(key);
      
      if (!storedData) {
        throw new VerificationCodeExpiredError('Password reset code has expired or does not exist');
      }
      
      const codeData: CodeData = JSON.parse(storedData);
      
      // Increment verification attempts
      codeData.attempts++;
      
      // Check if max attempts exceeded
      if (codeData.attempts > this.MAX_ATTEMPTS) {
        await this.redisClient.del(key);
        throw new InvalidVerificationCodeError('Too many verification attempts. Please request a new reset code.');
      }
      
      // Verify code
      if (codeData.code !== code) {
        // Update attempts in Redis
        await this.redisClient.setex(
          key, 
          this.PASSWORD_RESET_TTL, 
          JSON.stringify(codeData)
        );
        
        this.logger.warn('Invalid password reset code attempt', { 
          email, 
          attempts: codeData.attempts 
        });
        
        const remainingAttempts = this.MAX_ATTEMPTS - codeData.attempts;
        throw new InvalidVerificationCodeError(
          `Invalid reset code. ${remainingAttempts} attempts remaining.`
        );
      }
      
      // Code is valid - keep it for password reset (will be removed after successful reset)
      this.logger.info('Password reset code verified successfully', { email });
      return true;
    } catch (error) {
      this.logger.error('Failed to verify password reset code', { email, error });
      
      if (error instanceof VerificationCodeExpiredError || 
          error instanceof InvalidVerificationCodeError) {
        throw error;
      }
      
      throw new InternalServerError('Failed to verify reset code');
    }
  }

  async invalidateEmailVerificationCode(email: string): Promise<void> {
    try {
      const key = `${this.EMAIL_VERIFICATION_PREFIX}${email.toLowerCase()}`;
      await this.redisClient.del(key);
      this.logger.info('Email verification code invalidated', { email });
    } catch (error) {
      this.logger.error('Failed to invalidate email verification code', { email, error });
    }
  }

  async invalidatePasswordResetCode(email: string): Promise<void> {
    try {
      const key = `${this.PASSWORD_RESET_PREFIX}${email.toLowerCase()}`;
      await this.redisClient.del(key);
      this.logger.info('Password reset code invalidated', { email });
    } catch (error) {
      this.logger.error('Failed to invalidate password reset code', { email, error });
    }
  }

  // Private helper methods
  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.redisClient.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed', { error });
      return false;
    }
  }
}

// Factory function to create the service
export function createVerificationCodeService(
  redisClient: Redis, 
  logger: Logger
): IVerificationCodeService {
  return new RedisVerificationCodeService(redisClient, logger);
}

// Redis configuration and client creation
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export function createRedisClient(config: RedisConfig): Redis {
  return new Redis({
   host: config.host,
    port: config.port,
    password: config.password,
    db: config.db || 0,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}