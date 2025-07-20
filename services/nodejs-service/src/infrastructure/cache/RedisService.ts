/**
 * Redis Service - Cache and Session Management
 * 
 * Comprehensive Redis client wrapper with connection management,
 * error handling, and enterprise-grade caching capabilities.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import Redis, { RedisOptions } from 'ioredis';
import { Logger } from '../logging/Logger';
import { Config } from '../config/Config';

/**
 * Cache operation options
 */
interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Whether to return the previous value */
  returnPrevious?: boolean;
  /** Namespace for the key */
  namespace?: string;
}

/**
 * Batch operation result
 */
interface BatchResult<T> {
  success: boolean;
  results: Array<{
    key: string;
    value?: T;
    error?: string;
  }>;
  errors: string[];
}

/**
 * Redis connection health status
 */
interface RedisHealth {
  isConnected: boolean;
  status: string;
  latency?: number;
  memory?: {
    used: number;
    peak: number;
    fragmentation: number;
  };
  info?: Record<string, string>;
}

/**
 * Redis Service
 * 
 * Singleton service that provides enterprise-grade Redis operations
 * with connection pooling, automatic reconnection, and comprehensive error handling.
 */
export class RedisService {
  private static instance: RedisService;
  private client: Redis;
  private logger: Logger;
  private configService: Config;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 5;

  private constructor() {
    this.logger = Logger.getInstance();
    this.configService = Config.getInstance();
    this.initializeClient();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * Get Redis client instance (for advanced operations)
   */
  public getClient(): Redis {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  /**
   * Initialize Redis client with configuration
   */
    private initializeClient(): void {
    const redisConfig = this.configService.getRedisConfig();
    
    const options: RedisOptions = {
      ...redisConfig,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
      }
    };

    this.client = new Redis(options);
    this.setupEventHandlers();
    this.connect();
  }

  /**
   * Setup Redis event handlers
   */
  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.logger.info('Redis connection established');
      this.isConnected = true;
      this.connectionAttempts = 0;
    });

    this.client.on('ready', () => {
      this.logger.info('Redis client ready for operations');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error', { error: error.message });
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', (delay: number) => {
      this.connectionAttempts++;
      this.logger.info('Redis reconnecting', { 
        attempt: this.connectionAttempts,
        delay,
        maxAttempts: this.maxConnectionAttempts
      });

      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        this.logger.error('Max Redis connection attempts reached');
        this.client.disconnect();
      }
    });

    this.client.on('end', () => {
      this.logger.warn('Redis connection ended');
      this.isConnected = false;
    });
  }

  /**
   * Connect to Redis
   */
  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.info('Redis service initialized successfully');
    } catch (error: any) {
      this.logger.error('Failed to connect to Redis', { error });
      throw error;
    }
  }

  /**
   * Basic Operations
   */

  /**
   * Set a key-value pair with optional TTL
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      const serializedValue = this.serialize(value);
      const namespacedKey = this.namespaceKey(key, options.namespace);
      
      if (options.ttl) {
        const result = await this.client.setex(namespacedKey, options.ttl, serializedValue);
        return result === 'OK';
      } else {
        const result = await this.client.set(namespacedKey, serializedValue);
        return result === 'OK';
      }
    } catch (error: any) {
      this.logger.error('Redis SET operation failed', {
        key,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get a value by key
   */
  async get<T = any>(key: string, namespace?: string): Promise<T | null> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      const value = await this.client.get(namespacedKey);
      
      if (value === null) {
        return null;
      }
      
      return this.deserialize<T>(value);
    } catch (error: any) {
      this.logger.error('Redis GET operation failed', {
        key,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Set with expiration time in seconds
   */
  async setex(key: string, seconds: number, value: any, namespace?: string): Promise<boolean> {
    return this.set(key, value, { ttl: seconds, namespace });
  }

  /**
   * Set if key doesn't exist
   */
  async setnx(key: string, value: any, namespace?: string): Promise<boolean> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      const serializedValue = this.serialize(value);
      const result = await this.client.setnx(namespacedKey, serializedValue);
      return result === 1;
    } catch (error: any) {
      this.logger.error('Redis SETNX operation failed', {
        key,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Delete a key
   */
  async delete(key: string, namespace?: string): Promise<boolean> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      const result = await this.client.del(namespacedKey);
      return result > 0;
    } catch (error: any) {
      this.logger.error('Redis DELETE operation failed', {
        key,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string, namespace?: string): Promise<boolean> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      const result = await this.client.exists(namespacedKey);
      return result === 1;
    } catch (error: any) {
      this.logger.error('Redis EXISTS operation failed', {
        key,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Set TTL for existing key
   */
  async expire(key: string, seconds: number, namespace?: string): Promise<boolean> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      const result = await this.client.expire(namespacedKey, seconds);
      return result === 1;
    } catch (error: any) {
      this.logger.error('Redis EXPIRE operation failed', {
        key,
        seconds,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get TTL of key
   */
  async ttl(key: string, namespace?: string): Promise<number> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      return await this.client.ttl(namespacedKey);
    } catch (error: any) {
      this.logger.error('Redis TTL operation failed', {
        key,
        error: error.message
      });
      return -1;
    }
  }

  /**
   * Advanced Operations
   */

  /**
   * Increment a numeric value
   */
  async increment(key: string, by: number = 1, namespace?: string): Promise<number> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      if (by === 1) {
        return await this.client.incr(namespacedKey);
      } else {
        return await this.client.incrby(namespacedKey, by);
      }
    } catch (error: any) {
      this.logger.error('Redis INCREMENT operation failed', {
        key,
        by,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Decrement a numeric value
   */
  async decrement(key: string, by: number = 1, namespace?: string): Promise<number> {
    try {
      const namespacedKey = this.namespaceKey(key, namespace);
      if (by === 1) {
        return await this.client.decr(namespacedKey);
      } else {
        return await this.client.decrby(namespacedKey, by);
      }
    } catch (error: any) {
      this.logger.error('Redis DECREMENT operation failed', {
        key,
        by,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T = any>(keys: string[], namespace?: string): Promise<BatchResult<T>> {
    try {
      const namespacedKeys = keys.map(key => this.namespaceKey(key, namespace));
      const values = await this.client.mget(...namespacedKeys);
      
      const results = keys.map((key, index) => ({
        key,
        value: values[index] ? this.deserialize<T>(values[index]!) : undefined
      }));

      return {
        success: true,
        results,
        errors: []
      };
    } catch (error: any) {
      this.logger.error('Redis MGET operation failed', {
        keys,
        error: error.message
      });
      
      return {
        success: false,
        results: keys.map(key => ({ key, error: error.message })),
        errors: [error.message]
      };
    }
  }

  /**
   * Set multiple keys at once
   */
  async mset(keyValuePairs: Record<string, any>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const pairs: string[] = [];
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const namespacedKey = this.namespaceKey(key, options.namespace);
        pairs.push(namespacedKey, this.serialize(value));
      }
      
      const result = await this.client.mset(...pairs);
      
      // If TTL is specified, set expiration for all keys
      if (options.ttl) {
        const expirePromises = Object.keys(keyValuePairs).map(key =>
          this.expire(key, options.ttl!, options.namespace)
        );
        await Promise.all(expirePromises);
      }
      
      return result === 'OK';
    } catch (error: any) {
      this.logger.error('Redis MSET operation failed', {
        keys: Object.keys(keyValuePairs),
        error: error.message
      });
      return false;
    }
  }

  /**
   * Pattern-based key deletion
   */
  async deletePattern(pattern: string, namespace?: string): Promise<number> {
    try {
      const namespacedPattern = this.namespaceKey(pattern, namespace);
      const keys = await this.client.keys(namespacedPattern);
      
      if (keys.length === 0) {
        return 0;
      }
      
      const result = await this.client.del(...keys);
      this.logger.info('Pattern-based deletion completed', {
        pattern: namespacedPattern,
        deletedKeys: result
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('Redis pattern deletion failed', {
        pattern,
        error: error.message
      });
      return 0;
    }
  }

  /**
   * Utility Methods
   */

  /**
   * Ping Redis server
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error: any) {
      this.logger.error('Redis PING failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get Redis server info
   */
  async info(section?: string): Promise<Record<string, string>> {
    try {
      const info = await this.client.info(section ?? '');
      const parsed: Record<string, string> = {};
      
      info.split('\r\n').forEach(line => {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            parsed[key] = value;
          }
        }
      });
      
      return parsed;
    } catch (error: any) {
      this.logger.error('Redis INFO failed', { error: error.message });
      return {};
    }
  }

  /**
   * Get Redis health status
   */
  async getHealth(): Promise<RedisHealth> {
    try {
      const start = Date.now();
      const pingResult = await this.ping();
      const latency = Date.now() - start;
      
      if (!pingResult) {
        return {
          isConnected: false,
          status: 'disconnected'
        };
      }

      const info = await this.info('memory');
      
      return {
        isConnected: true,
        status: 'connected',
        latency,
        memory: {
          used: parseInt(info.used_memory || '0'),
          peak: parseInt(info.used_memory_peak || '0'),
          fragmentation: parseFloat(info.mem_fragmentation_ratio || '0')
        },
        info
      };
    } catch (error: any) {
      return {
        isConnected: false,
        status: 'error'
      };
    }
  }

  /**
   * Flush all data (use with caution)
   */
  async flushAll(): Promise<boolean> {
      try {
        // @ts-ignore
      if (this.configService.isProduction()) {
        throw new Error('FLUSHALL is not allowed in production environment');
      }
      
      const result = await this.client.flushall();
      this.logger.warn('Redis FLUSHALL executed - all data cleared');
      return result === 'OK';
    } catch (error: any) {
      this.logger.error('Redis FLUSHALL failed', { error: error.message });
      return false;
    }
  }

  /**
   * Graceful disconnect
   */
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
      this.logger.info('Redis connection closed gracefully');
    } catch (error: any) {
      this.logger.error('Error during Redis disconnect', { error: error.message });
      this.client.disconnect();
    }
  }

  /**
   * Private helper methods
   */

  /**
   * Serialize value for storage
   */
  private serialize(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  }

  /**
   * Deserialize value from storage
   */
  private deserialize<T>(value: string): T {
    try {
      return JSON.parse(value) as T;
    } catch {
      // If JSON parsing fails, return as string
      return value as unknown as T;
    }
  }

  /**
   * Add namespace to key
   */
  private namespaceKey(key: string, namespace?: string): string {
    if (!namespace) {
      return key;
    }
    return `${namespace}:${key}`;
  }

  /**
   * Check if Redis is ready for operations
   */
  public isReady(): boolean {
    return this.isConnected && this.client.status === 'ready';
  }

  /**
   * Get connection status
   */
  public getStatus(): string {
    return this.client.status;
  }
}