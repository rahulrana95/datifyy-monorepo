/**
 * Admin Dashboard DTOs and Validation
 * Request/Response validation for admin dashboard endpoints
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { 
  GetDashboardOverviewRequest,
  GetMetricTrendsRequest,
  GetAdminActivityRequest,
  DASHBOARD_REFRESH_INTERVALS,
  DASHBOARD_METRIC_TYPES,
} from '@datifyy/shared-types';

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Helper to validate required fields
 */
function validateRequired<T>(value: T, fieldName: string): T {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED_FIELD');
  }
  return value;
}

/**
 * Helper to validate enum values
 */
function validateEnum<T>(value: T, validValues: readonly T[], fieldName: string): T {
  if (!validValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${validValues.join(', ')}`,
      fieldName,
      'INVALID_ENUM'
    );
  }
  return value;
}

/**
 * Helper to validate date format (YYYY-MM-DD)
 */
function validateDateFormat(dateString: string, fieldName: string): string {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new ValidationError(
      `${fieldName} must be in YYYY-MM-DD format`,
      fieldName,
      'INVALID_DATE_FORMAT'
    );
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError(
      `${fieldName} must be a valid date`,
      fieldName,
      'INVALID_DATE'
    );
  }
  
  return dateString;
}

/**
 * Helper to validate positive integer
 */
function validatePositiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new ValidationError(
      `${fieldName} must be a positive integer`,
      fieldName,
      'INVALID_POSITIVE_INTEGER'
    );
  }
  return value;
}

/**
 * Middleware wrapper for validation functions
 */
function createValidationMiddleware(
  validatorFn: (req: Request) => void | Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validatorFn(req);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            field: error.field,
          },
        });
        return;
      }
      next(error);
    }
  };
}

// =============================================================================
// DASHBOARD OVERVIEW VALIDATION
// =============================================================================

/**
 * Validate dashboard overview request
 */
function validateDashboardOverviewRequest(req: Request): void {
  const query = { ...req.query } as any;

  // Validate timeframe if provided
  if (query.timeframe) {
    const validTimeframes = ['today', 'week', 'month', 'quarter', 'year'] as const;
    validateEnum(query.timeframe, validTimeframes, 'timeframe');
  }

  // Validate boolean flags if provided
  if (query.includeAlerts !== undefined) {
    if (typeof query.includeAlerts === 'string') {
      query.includeAlerts = query.includeAlerts === 'true';
    }
    if (typeof query.includeAlerts !== 'boolean') {
      throw new ValidationError(
        'includeAlerts must be a boolean',
        'includeAlerts',
        'INVALID_BOOLEAN'
      );
    }
  }

  if (query.includeTrends !== undefined) {
    if (typeof query.includeTrends === 'string') {
      query.includeTrends = query.includeTrends === 'true';
    }
    if (typeof query.includeTrends !== 'boolean') {
      throw new ValidationError(
        'includeTrends must be a boolean',
        'includeTrends',
        'INVALID_BOOLEAN'
      );
    }
  }

  if (query.refreshCache !== undefined) {
    if (typeof query.refreshCache === 'string') {
      query.refreshCache = query.refreshCache === 'true';
    }
    if (typeof query.refreshCache !== 'boolean') {
      throw new ValidationError(
        'refreshCache must be a boolean',
        'refreshCache',
        'INVALID_BOOLEAN'
      );
    }
  }

  // Store validated query in request
  (req as any).validatedQuery = query;
}

/**
 * Middleware for validating dashboard overview request
 */
export const validateGetDashboardOverview = createValidationMiddleware(
  validateDashboardOverviewRequest
);

// =============================================================================
// METRIC TRENDS VALIDATION
// =============================================================================

/**
 * Validate metric trends request
 */
function validateMetricTrendsRequest(req: Request): void {
  const query = { ...req.query } as any;

  // Validate required metricType
  if (query.metricType) {
    const validMetricTypes = Object.values(DASHBOARD_METRIC_TYPES) as string[];
    validateEnum(query.metricType, validMetricTypes, 'metricType');
  }

  // Validate required startDate
  if (query.startDate) {
    validateDateFormat(query.startDate, 'startDate');
  }

  // Validate required endDate
  if (query.endDate) {
    validateDateFormat(query.endDate, 'endDate');
  }

  // Validate date range if both provided
  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    if (startDate >= endDate) {
      throw new ValidationError(
        'startDate must be before endDate',
        'startDate',
        'INVALID_DATE_RANGE'
      );
    }

    // Validate max date range (1 year)
    const maxDateRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (endDate.getTime() - startDate.getTime() > maxDateRange) {
      throw new ValidationError(
        'Date range cannot exceed 1 year',
        'dateRange',
        'DATE_RANGE_TOO_LARGE'
      );
    }
  }

  // Validate granularity
  if (query.granularity) {
    const validGranularities = ['hourly', 'daily', 'weekly', 'monthly'] as const;
    validateEnum(query.granularity, validGranularities, 'granularity');
  }

  // Validate compareWithPrevious
  if (query.compareWithPrevious !== undefined) {
    if (typeof query.compareWithPrevious === 'string') {
      query.compareWithPrevious = query.compareWithPrevious === 'true';
    }
    if (typeof query.compareWithPrevious !== 'boolean') {
      throw new ValidationError(
        'compareWithPrevious must be a boolean',
        'compareWithPrevious',
        'INVALID_BOOLEAN'
      );
    }
  }

  // Store validated query in request
  (req as any).validatedQuery = query;
}

/**
 * Middleware for validating metric trends request
 */
export const validateGetMetricTrends = createValidationMiddleware(
  validateMetricTrendsRequest
);

// =============================================================================
// ADMIN ACTIVITY VALIDATION
// =============================================================================

/**
 * Validate admin activity request
 */
function validateAdminActivityRequest(req: Request): void {
  const query = { ...req.query } as any;

  // Validate pagination parameters
  if (query.page !== undefined) {
    const page = parseInt(query.page as string, 10);
    if (isNaN(page)) {
      throw new ValidationError('page must be a number', 'page', 'INVALID_NUMBER');
    }
    validatePositiveInteger(page, 'page');
    query.page = page;
  }

  if (query.limit !== undefined) {
    const limit = parseInt(query.limit as string, 10);
    if (isNaN(limit)) {
      throw new ValidationError('limit must be a number', 'limit', 'INVALID_NUMBER');
    }
    validatePositiveInteger(limit, 'limit');
    
    // Validate max limit
    if (limit > 100) {
      throw new ValidationError(
        'limit cannot exceed 100',
        'limit',
        'LIMIT_TOO_LARGE'
      );
    }
    query.limit = limit;
  }

  // Validate adminUserId if provided
  if (query.adminUserId !== undefined) {
    const adminUserId = parseInt(query.adminUserId as string, 10);
    if (isNaN(adminUserId)) {
      throw new ValidationError(
        'adminUserId must be a number',
        'adminUserId',
        'INVALID_NUMBER'
      );
    }
    validatePositiveInteger(adminUserId, 'adminUserId');
    query.adminUserId = adminUserId;
  }

  // Validate actionType if provided
  if (query.actionType && typeof query.actionType !== 'string') {
    throw new ValidationError(
      'actionType must be a string',
      'actionType',
      'INVALID_STRING'
    );
  }

  // Validate date range if provided
  if (query.startDate) {
    validateDateFormat(query.startDate, 'startDate');
  }

  if (query.endDate) {
    validateDateFormat(query.endDate, 'endDate');
  }

  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    
    if (startDate >= endDate) {
      throw new ValidationError(
        'startDate must be before endDate',
        'startDate',
        'INVALID_DATE_RANGE'
      );
    }
  }

  // Validate riskLevel if provided
  if (query.riskLevel !== undefined) {
    const riskLevel = parseInt(query.riskLevel as string, 10);
    if (isNaN(riskLevel)) {
      throw new ValidationError(
        'riskLevel must be a number',
        'riskLevel',
        'INVALID_NUMBER'
      );
    }
    
    if (![1, 2, 3, 4].includes(riskLevel)) {
      throw new ValidationError(
        'riskLevel must be 1, 2, 3, or 4',
        'riskLevel',
        'INVALID_RISK_LEVEL'
      );
    }
    query.riskLevel = riskLevel;
  }

  // Store validated query in request
  (req as any).validatedQuery = query;
}

/**
 * Middleware for validating admin activity request
 */
export const validateGetAdminActivity = createValidationMiddleware(
  validateAdminActivityRequest
);

// =============================================================================
// AVAILABILITY ANALYTICS VALIDATION
// =============================================================================

/**
 * Validate availability analytics request (placeholder for future use)
 */
function validateAvailabilityAnalyticsRequest(req: Request): void {
  const query = req.query;

  // Validate date range if provided
  if (query.startDate) {
    validateDateFormat(query.startDate as string, 'startDate');
  }

  if (query.endDate) {
    validateDateFormat(query.endDate as string, 'endDate');
  }

  // Validate groupBy if provided
  if (query.groupBy) {
    const validGroupBy = ['day', 'week', 'month'] as const;
    validateEnum(query.groupBy as string, validGroupBy, 'groupBy');
  }
}

/**
 * Middleware for validating availability analytics request
 */
export const validateGetAvailabilityAnalytics = createValidationMiddleware(
  validateAvailabilityAnalyticsRequest
);

// =============================================================================
// ALERT ACKNOWLEDGMENT VALIDATION
// =============================================================================

/**
 * Validate alert acknowledgment request
 */
function validateAlertAcknowledgmentRequest(req: Request): void {
  const { alertId } = req.params;

  // Validate alertId parameter
  if (!alertId) {
    throw new ValidationError('alertId is required', 'alertId', 'REQUIRED_PARAM');
  }

  // Validate alertId format (assuming UUID or numeric ID)
  const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(alertId) ||
                   /^\d+$/.test(alertId);
  
  if (!isValidId) {
    throw new ValidationError(
      'alertId must be a valid UUID or numeric ID',
      'alertId',
      'INVALID_ID_FORMAT'
    );
  }

  // Validate request body if present
  const body = req.body;
  if (body && typeof body !== 'object') {
    throw new ValidationError(
      'Request body must be an object',
      'body',
      'INVALID_BODY'
    );
  }

  if (body?.notes && typeof body.notes !== 'string') {
    throw new ValidationError(
      'notes must be a string',
      'notes',
      'INVALID_STRING'
    );
  }
}

/**
 * Middleware for validating alert acknowledgment request
 */
export const validateAlertAcknowledgment = createValidationMiddleware(
  validateAlertAcknowledgmentRequest
);

// =============================================================================
// EXPORT METRICS VALIDATION
// =============================================================================

/**
 * Validate export metrics request
 */
function validateExportMetricsRequest(req: Request): void {
  const body = req.body;

  // Validate export format
  if (body.format) {
    const validFormats = ['csv', 'excel', 'json', 'pdf'] as const;
    validateEnum(body.format, validFormats, 'format');
  }

  // Validate date range if provided
  if (body.startDate) {
    validateDateFormat(body.startDate, 'startDate');
  }

  if (body.endDate) {
    validateDateFormat(body.endDate, 'endDate');
  }

  // Validate metrics list if provided
  if (body.metrics && !Array.isArray(body.metrics)) {
    throw new ValidationError(
      'metrics must be an array',
      'metrics',
      'INVALID_ARRAY'
    );
  }

  // Validate includeCharts flag
  if (body.includeCharts !== undefined && typeof body.includeCharts !== 'boolean') {
    throw new ValidationError(
      'includeCharts must be a boolean',
      'includeCharts',
      'INVALID_BOOLEAN'
    );
  }
}

/**
 * Middleware for validating export metrics request
 */
export const validateExportMetrics = createValidationMiddleware(
  validateExportMetricsRequest
);

// =============================================================================
// CONSTANTS AND UTILITIES
// =============================================================================

/**
 * Dashboard validation constants
 */
export const DASHBOARD_VALIDATION_CONSTANTS = {
  MAX_DATE_RANGE_DAYS: 365,
  MAX_PAGE_LIMIT: 100,
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 1,
  MAX_NOTES_LENGTH: 500,
  VALID_TIMEFRAMES: ['today', 'week', 'month', 'quarter', 'year'],
  VALID_GRANULARITIES: ['hourly', 'daily', 'weekly', 'monthly'],
  VALID_EXPORT_FORMATS: ['csv', 'excel', 'json', 'pdf'],
} as const;

/**
 * Utility function to sanitize query parameters
 */
export function sanitizeQueryParams(query: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      // Convert string 'true'/'false' to boolean
      if (value === 'true') {
        sanitized[key] = true;
      } else if (value === 'false') {
        sanitized[key] = false;
      } else if (typeof value === 'string' && !isNaN(Number(value))) {
        // Convert numeric strings to numbers
        sanitized[key] = Number(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Utility function to validate admin permissions (placeholder)
 */
export function validateAdminPermissions(req: Request, requiredPermissions: string[]): boolean {
  // This would integrate with your admin permission system
  // For now, assuming the middleware has already validated admin access
  const adminUser = (req as any).user;
  
  if (!adminUser || !adminUser.isAdmin) {
    throw new ValidationError(
      'Admin access required',
      'authorization',
      'INSUFFICIENT_PERMISSIONS'
    );
  }
  
  return true;
}