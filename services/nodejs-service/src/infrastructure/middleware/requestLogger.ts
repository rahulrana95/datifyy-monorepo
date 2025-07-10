/**
 * Request Logger Middleware - Enhanced Request Logging
 * 
 * Provides comprehensive request logging with security context,
 * performance metrics, and configurable log levels.
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';

/**
 * Request logging configuration options
 */
interface RequestLoggerOptions {
  /** Log level for requests */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Include request body in logs */
  includeBody?: boolean;
  /** Include response body in logs */
  includeResponseBody?: boolean;
  /** Include request headers in logs */
  includeHeaders?: boolean;
  /** Include query parameters in logs */
  includeQuery?: boolean;
  /** Include response headers in logs */
  includeResponseHeaders?: boolean;
  /** Skip logging for specific paths */
  skipPaths?: string[];
  /** Skip logging for specific methods */
  skipMethods?: string[];
  /** Maximum body size to log (in bytes) */
  maxBodySize?: number;
  /** Skip logging for health check endpoints */
  skipHealthChecks?: boolean;
  /** Include performance metrics */
  includePerformanceMetrics?: boolean;
  /** Include security context */
  includeSecurityContext?: boolean;
  /** Custom request ID generator */
  requestIdGenerator?: (req: Request) => string;
  /** Filter sensitive data */
  sanitizeSensitiveData?: boolean;
  /** Custom fields to include */
  customFields?: (req: Request, res: Response) => Record<string, any>;
}

/**
 * Request context interface
 */
interface RequestContext {
  requestId: string;
  method: string;
  url: string;
  path: string;
  query: Record<string, any>;
  headers: Record<string, any>;
  body: any;
  ip: string;
  userAgent: string;
  timestamp: string;
  adminContext?: {
    adminId: number;
    email: string;
    sessionId: string;
    permissionLevel: string;
  };
  userContext?: {
    userId: number;
    email: string;
    sessionId: string;
  };
  performance?: {
    startTime: number;
    processingTime?: number;
    memoryUsage?: NodeJS.MemoryUsage;
  };
  response?: {
    statusCode: number;
    headers: Record<string, any>;
    body?: any;
    size?: number;
  };
}

/**
 * Request Logger Middleware Factory
 * 
 * Creates comprehensive request logging middleware with configurable options
 * for different environments and security requirements.
 * 
 * @param options Logging configuration options
 * @returns Express middleware function
 */
export function requestLogger(options: RequestLoggerOptions = {}) {
  const logger = Logger.getInstance();
  
  const defaultOptions: Required<RequestLoggerOptions> = {
    logLevel: 'info',
    includeBody: true,
    includeResponseBody: false,
    includeHeaders: false,
    includeQuery: true,
    includeResponseHeaders: false,
    skipPaths: ['/health', '/favicon.ico'],
    skipMethods: [],
    maxBodySize: 10240, // 10KB
    skipHealthChecks: true,
    includePerformanceMetrics: true,
    includeSecurityContext: true,
    requestIdGenerator: generateDefaultRequestId,
    sanitizeSensitiveData: true,
    customFields: () => ({})
  };

  const finalOptions = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const startHrTime = process.hrtime.bigint();

    // Skip logging for specified paths
    if (shouldSkipLogging(req, finalOptions)) {
      return next();
    }

    // Generate request ID
    const requestId = finalOptions.requestIdGenerator(req);
    (req as any).requestId = requestId;
    (req as any).requestStartTime = startTime;

    // Create initial request context
    const requestContext = createRequestContext(req, requestId, startTime, finalOptions);

    // Log incoming request
    logIncomingRequest(requestContext, finalOptions, logger);

    // Capture original end function
    const originalEnd = res.end;
    const originalWrite = res.write;
    let responseBody = '';

    // Override response methods to capture data
    if (finalOptions.includeResponseBody) {
      res.write = function(chunk: any, ...args: any[]) {
        if (chunk) {
          responseBody += chunk.toString();
        }
        // @ts-ignore
        return originalWrite.apply(this, [chunk, ...args]);
      };
    }

    res.end = function(chunk: any, ...args: any[]) {
      // Calculate processing time
      const endTime = Date.now();
      const endHrTime = process.hrtime.bigint();
      const processingTime = endTime - startTime;
      const preciseProcessingTime = Number(endHrTime - startHrTime) / 1_000_000; // Convert to ms

      // Capture final response body
      if (chunk && finalOptions.includeResponseBody) {
        responseBody += chunk.toString();
      }

      // Update request context with response data
      requestContext.performance!.processingTime = processingTime;
      requestContext.response = {
        statusCode: res.statusCode,
        headers: finalOptions.includeResponseHeaders ? res.getHeaders() : {},
        body: finalOptions.includeResponseBody ? 
          sanitizeResponseBody(responseBody, finalOptions.maxBodySize) : undefined,
        size: res.get('Content-Length') ? parseInt(res.get('Content-Length')!) : undefined
      };

      // Add performance metrics
      if (finalOptions.includePerformanceMetrics) {
        requestContext.performance = {
          ...requestContext.performance!,
          processingTime,
          memoryUsage: process.memoryUsage()
        };
      }

      // Add custom fields
      const customFields = finalOptions.customFields(req, res);
      Object.assign(requestContext, customFields);

      // Log completed request
      logCompletedRequest(requestContext, finalOptions, logger, preciseProcessingTime);

      // Add response headers for debugging
      res.setHeader('X-Request-ID', requestId);
      res.setHeader('X-Response-Time', `${processingTime}ms`);

      // Call original end function
      // @ts-ignore
      return originalEnd.apply(this, [chunk, ...args]);
    };

    next();
  };
}

/**
 * Security-focused request logger
 * 
 * Pre-configured for security monitoring with admin context.
 */
export function securityRequestLogger(additionalOptions: Partial<RequestLoggerOptions> = {}) {
  return requestLogger({
    logLevel: 'info',
    includeBody: true,
    includeHeaders: true,
    includeQuery: true,
    includeSecurityContext: true,
    includePerformanceMetrics: true,
    sanitizeSensitiveData: true,
    skipHealthChecks: true,
    customFields: (req, res) => ({
      riskLevel: determineRiskLevel(req, res),
      securityFlags: getSecurityFlags(req),
      geoLocation: extractGeoLocation(req)
    }),
    ...additionalOptions
  });
}

/**
 * Performance-focused request logger
 * 
 * Pre-configured for performance monitoring and optimization.
 */
export function performanceRequestLogger(additionalOptions: Partial<RequestLoggerOptions> = {}) {
  return requestLogger({
    logLevel: 'debug',
    includeBody: false,
    includeResponseBody: false,
    includeHeaders: false,
    includePerformanceMetrics: true,
    skipHealthChecks: false,
    customFields: (req, res) => ({
      performanceMetrics: {
        requestSize: getRequestSize(req),
        responseSize: res.get('Content-Length'),
        cacheStatus: res.get('X-Cache-Status'),
        dbQueryCount: (req as any).dbQueryCount || 0,
        externalApiCalls: (req as any).externalApiCalls || 0
      }
    }),
    ...additionalOptions
  });
}

/**
 * Debug request logger
 * 
 * Pre-configured for development debugging with full details.
 */
export function debugRequestLogger(additionalOptions: Partial<RequestLoggerOptions> = {}) {
  return requestLogger({
    logLevel: 'debug',
    includeBody: true,
    includeResponseBody: true,
    includeHeaders: true,
    includeQuery: true,
    includeResponseHeaders: true,
    includePerformanceMetrics: true,
    includeSecurityContext: true,
    skipHealthChecks: false,
    maxBodySize: 50240, // 50KB for debug
    sanitizeSensitiveData: false, // Show all data in debug
    ...additionalOptions
  });
}

/**
 * Helper Functions
 */

/**
 * Generate default request ID
 */
function generateDefaultRequestId(req: Request): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if logging should be skipped for this request
 */
function shouldSkipLogging(req: Request, options: Required<RequestLoggerOptions>): boolean {
  // Skip specified paths
  if (options.skipPaths.some(path => req.path.includes(path))) {
    return true;
  }

  // Skip specified methods
  if (options.skipMethods.includes(req.method)) {
    return true;
  }

  // Skip health checks
  if (options.skipHealthChecks && isHealthCheckRequest(req)) {
    return true;
  }

  return false;
}

/**
 * Check if request is a health check
 */
function isHealthCheckRequest(req: Request): boolean {
  const healthPaths = ['/health', '/healthz', '/ping', '/status', '/ready', '/live'];
  return healthPaths.some(path => req.path.endsWith(path));
}

/**
 * Create initial request context
 */
function createRequestContext(
  req: Request,
  requestId: string,
  startTime: number,
  options: Required<RequestLoggerOptions>
): RequestContext {
  const context: RequestContext = {
    requestId,
    method: req.method,
    url: req.url,
    path: req.path,
    query: options.includeQuery ? req.query : {},
    headers: options.includeHeaders ? sanitizeHeaders(req.headers, options.sanitizeSensitiveData) : {},
    body: options.includeBody ? sanitizeBody(req.body, options.maxBodySize, options.sanitizeSensitiveData) : undefined,
    ip: getClientIpAddress(req),
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString(),
    performance: {
      startTime
    }
  };

  // Add admin context if available
  if (options.includeSecurityContext && (req as any).admin) {
    const admin = (req as any).admin;
    context.adminContext = {
      adminId: admin.id,
      email: admin.email,
      sessionId: admin.sessionId,
      permissionLevel: admin.permissionLevel
    };
  }

  // Add user context if available
  if (options.includeSecurityContext && (req as any).user) {
    const user = (req as any).user;
    context.userContext = {
      userId: user.id,
      email: user.email,
      sessionId: user.sessionId
    };
  }

  return context;
}

/**
 * Log incoming request
 */
function logIncomingRequest(
  context: RequestContext,
  options: Required<RequestLoggerOptions>,
  logger: Logger
): void {
  const logData = {
    phase: 'request_start',
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    ip: context.ip,
    userAgent: context.userAgent,
    timestamp: context.timestamp,
    ...(context.adminContext && { admin: context.adminContext }),
    ...(context.userContext && { user: context.userContext }),
    ...(options.includeQuery && Object.keys(context.query).length > 0 && { query: context.query }),
    ...(options.includeHeaders && Object.keys(context.headers).length > 0 && { headers: context.headers }),
    ...(options.includeBody && context.body && { body: context.body })
  };

  logger[options.logLevel]('Incoming request', logData);
}

/**
 * Log completed request
 */
function logCompletedRequest(
  context: RequestContext,
  options: Required<RequestLoggerOptions>,
  logger: Logger,
  preciseProcessingTime: number
): void {
  const isError = context.response!.statusCode >= 400;
  const logLevel = isError ? 'warn' : options.logLevel;

  const logData = {
    phase: 'request_complete',
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    statusCode: context.response!.statusCode,
    processingTime: context.performance!.processingTime,
    preciseProcessingTime: `${preciseProcessingTime.toFixed(2)}ms`,
    ip: context.ip,
    ...(context.adminContext && { admin: context.adminContext }),
    ...(context.userContext && { user: context.userContext }),
    ...(options.includePerformanceMetrics && context.performance && { performance: context.performance }),
    ...(options.includeResponseHeaders && context.response!.headers && { responseHeaders: context.response!.headers }),
    ...(options.includeResponseBody && context.response!.body && { responseBody: context.response!.body }),
    ...(context.response!.size && { responseSize: context.response!.size })
  };

  // Add error context for failed requests
  if (isError) {
    logData.errorContext = {
      statusCode: context.response!.statusCode,
      isClientError: context.response!.statusCode >= 400 && context.response!.statusCode < 500,
      isServerError: context.response!.statusCode >= 500
    };
  }

  logger[logLevel]('Request completed', logData);
}

/**
 * Sanitize request headers
 */
function sanitizeHeaders(headers: Record<string, any>, sanitize: boolean): Record<string, any> {
  if (!sanitize) return headers;

  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'x-auth-token',
    'x-access-token'
  ];

  const sanitized = { ...headers };
  
  for (const header of sensitiveHeaders) {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Sanitize request body
 */
function sanitizeBody(body: any, maxSize: number, sanitize: boolean): any {
  if (!body) return body;

  let sanitized = body;

  // Sanitize sensitive fields
  if (sanitize && typeof body === 'object') {
    const sensitiveFields = [
      'password',
      'confirmPassword',
      'currentPassword',
      'newPassword',
      'token',
      'refreshToken',
      'secret',
      'key',
      'apiKey'
    ];

    sanitized = { ...body };
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
  }

  // Truncate large bodies
  const bodyString = JSON.stringify(sanitized);
  if (bodyString.length > maxSize) {
    return `${bodyString.substring(0, maxSize)}... [TRUNCATED - ${bodyString.length} total chars]`;
  }

  return sanitized;
}

/**
 * Sanitize response body
 */
function sanitizeResponseBody(body: string, maxSize: number): string {
  if (!body) return body;

  if (body.length > maxSize) {
    return `${body.substring(0, maxSize)}... [TRUNCATED - ${body.length} total chars]`;
  }

  return body;
}

/**
 * Get client IP address
 */
function getClientIpAddress(req: Request): string {
  return (
    req.headers['cf-connecting-ip'] as string ||
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    '127.0.0.1'
  );
}

/**
 * Determine risk level for security monitoring
 */
function determineRiskLevel(req: Request, res: Response): 'low' | 'medium' | 'high' | 'critical' {
  // High risk: Authentication failures, admin operations, multiple failed attempts
  if (res.statusCode === 401 || res.statusCode === 403) return 'high';
  if (req.path.includes('/admin/')) return 'medium';
  if (req.method === 'DELETE') return 'medium';
  if (res.statusCode >= 500) return 'high';
  
  return 'low';
}

/**
 * Get security flags from request
 */
function getSecurityFlags(req: Request): string[] {
  const flags: string[] = [];
  
  if (!req.headers['user-agent']) flags.push('missing_user_agent');
  if (req.headers['x-forwarded-for']) flags.push('proxied_request');
  if (req.query.token) flags.push('token_in_query');
  if (req.path.includes('admin')) flags.push('admin_endpoint');
  
  return flags;
}

/**
 * Extract geo location from headers
 */
function extractGeoLocation(req: Request): Record<string, string> | undefined {
  const country = req.headers['cf-ipcountry'] as string;
  const region = req.headers['cf-region'] as string;
  const city = req.headers['cf-ipcity'] as string;

  if (country || region || city) {
    return { country, region, city };
  }

  return undefined;
}

/**
 * Get request size in bytes
 */
function getRequestSize(req: Request): number {
  const contentLength = req.headers['content-length'];
  return contentLength ? parseInt(contentLength) : 0;
}