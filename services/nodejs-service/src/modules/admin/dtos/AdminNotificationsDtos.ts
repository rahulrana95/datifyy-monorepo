/**
 * Admin Notifications DTOs and Validation
 * Request/Response validation for admin notification endpoints
 *
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { Request, Response, NextFunction } from "express";
import {
  CreateNotificationRequest,
  GetNotificationsRequest,
  UpdateNotificationRequest,
  TestNotificationRequest,
  BulkNotificationRequest,
  NotificationChannel,
  NotificationTriggerEvent,
  NotificationPriority,
  NotificationStatus,
  NotificationFrequency,
} from "../../../proto-types/admin/notifications";

// Constants for validation
const NOTIFICATION_CONSTANTS = {
  MAX_TEMPLATE_VARIABLES: 50,
  DEFAULT_RETRY_ATTEMPTS: 3,
  BATCH_SIZE: 100,
  MAX_SMS_LENGTH: 160,
};

// Define missing interface
interface UpdateNotificationPreferencesRequest {
  channels?: any;
  eventPreferences?: any;
  quietHours?: any;
  timezone?: string;
  language?: string;
}

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
    public code: string = "VALIDATION_ERROR"
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Helper to validate required fields
 */
function validateRequired<T>(value: T, fieldName: string): T {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(
      `${fieldName} is required`,
      fieldName,
      "REQUIRED_FIELD"
    );
  }
  return value;
}

/**
 * Helper to validate enum values
 */
function validateEnum<T>(
  value: T,
  validValues: readonly T[],
  fieldName: string
): T {
  if (!validValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${validValues.join(", ")}`,
      fieldName,
      "INVALID_ENUM"
    );
  }
  return value;
}

/**
 * Helper to validate array
 */
function validateArray(
  value: any,
  fieldName: string,
  maxLength?: number
): any[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(
      `${fieldName} must be an array`,
      fieldName,
      "INVALID_ARRAY"
    );
  }

  if (maxLength && value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} cannot exceed ${maxLength} items`,
      fieldName,
      "ARRAY_TOO_LONG"
    );
  }

  return value;
}

/**
 * Helper to validate string length
 */
function validateStringLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): string {
  if (minLength && value.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters`,
      fieldName,
      "STRING_TOO_SHORT"
    );
  }

  if (maxLength && value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} cannot exceed ${maxLength} characters`,
      fieldName,
      "STRING_TOO_LONG"
    );
  }

  return value;
}

/**
 * Helper to validate email format
 */
function validateEmailFormat(email: string, fieldName: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError(
      `${fieldName} must be a valid email address`,
      fieldName,
      "INVALID_EMAIL"
    );
  }
  return email;
}

/**
 * Helper to validate positive integer
 */
function validatePositiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new ValidationError(
      `${fieldName} must be a positive integer`,
      fieldName,
      "INVALID_POSITIVE_INTEGER"
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
        return res.status(400).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            field: error.field,
          },
        });
      }
      next(error);
    }
  };
}

// =============================================================================
// CREATE NOTIFICATION VALIDATION
// =============================================================================

/**
 * Validate create notification request
 */
function validateCreateNotificationRequest(req: Request): void {
  const body = { ...req.body } as any;

  // Validate required fields
  validateRequired(body.triggerEvent, "triggerEvent");
  validateRequired(body.channels, "channels");
  validateRequired(body.priority, "priority");
  validateRequired(body.title, "title");
  validateRequired(body.message, "message");

  // Validate triggerEvent enum
  const triggerEventValues = Object.values(
    NotificationTriggerEvent
  ) as string[];
  validateEnum(body.triggerEvent, triggerEventValues, "triggerEvent");

  // Validate channels array
  const channelsArray = validateArray(body.channels, "channels", 5);
  const channelValues = Object.values(NotificationChannel) as string[];
  channelsArray.forEach((channel: string, index: number) => {
    validateEnum(channel, channelValues, `channels[${index}]`);
  });

  // Validate priority enum
  const priorityValues = Object.values(NotificationPriority);
  validateEnum(body.priority, priorityValues, "priority");

  // Validate title and message length
  validateStringLength(body.title, "title", 5, 200);
  validateStringLength(body.message, "message", 10, 2000);

  // Validate metadata if provided
  if (body.metadata) {
    if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
      throw new ValidationError(
        "metadata must be an object",
        "metadata",
        "INVALID_OBJECT"
      );
    }

    // Check metadata size (rough estimate)
    if (JSON.stringify(body.metadata).length > 5000) {
      throw new ValidationError(
        "metadata size cannot exceed 5000 bytes",
        "metadata",
        "METADATA_TOO_LARGE"
      );
    }
  }

  // Validate recipientAdminIds if provided
  if (body.recipientAdminIds) {
    const adminIds = validateArray(
      body.recipientAdminIds,
      "recipientAdminIds",
      100
    );
    adminIds.forEach((id: any, index: number) => {
      if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError(
          `recipientAdminIds[${index}] must be a positive integer`,
          `recipientAdminIds[${index}]`,
          "INVALID_ADMIN_ID"
        );
      }
    });
  }

  // Validate recipientChannels if provided
  if (body.recipientChannels) {
    const channels = validateArray(
      body.recipientChannels,
      "recipientChannels",
      50
    );
    channels.forEach((channel: any, index: number) => {
      if (typeof channel !== "string" || channel.trim().length === 0) {
        throw new ValidationError(
          `recipientChannels[${index}] must be a non-empty string`,
          `recipientChannels[${index}]`,
          "INVALID_CHANNEL"
        );
      }
    });
  }

  // Validate scheduledAt if provided
  if (body.scheduledAt) {
    const scheduledDate = new Date(body.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new ValidationError(
        "scheduledAt must be a valid ISO date string",
        "scheduledAt",
        "INVALID_DATE"
      );
    }

    // Must be in the future
    if (scheduledDate <= new Date()) {
      throw new ValidationError(
        "scheduledAt must be in the future",
        "scheduledAt",
        "INVALID_SCHEDULE_DATE"
      );
    }
  }

  // Validate templateVariables if provided
  if (body.templateVariables) {
    if (
      typeof body.templateVariables !== "object" ||
      Array.isArray(body.templateVariables)
    ) {
      throw new ValidationError(
        "templateVariables must be an object",
        "templateVariables",
        "INVALID_OBJECT"
      );
    }

    const variableCount = Object.keys(body.templateVariables).length;
    if (variableCount > NOTIFICATION_CONSTANTS.MAX_TEMPLATE_VARIABLES) {
      throw new ValidationError(
        `templateVariables cannot exceed ${NOTIFICATION_CONSTANTS.MAX_TEMPLATE_VARIABLES} variables`,
        "templateVariables",
        "TOO_MANY_VARIABLES"
      );
    }
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating create notification request
 */
export const validateCreateNotification = createValidationMiddleware(
  validateCreateNotificationRequest
);

// =============================================================================
// GET NOTIFICATIONS VALIDATION
// =============================================================================

/**
 * Validate get notifications request
 */
function validateGetNotificationsRequest(req: Request): void {
  const query = { ...req.query } as any;

  // Validate channels if provided
  if (query.channels) {
    let channelsArray: string[];
    if (typeof query.channels === "string") {
      channelsArray = query.channels.split(",");
    } else if (Array.isArray(query.channels)) {
      channelsArray = query.channels;
    } else {
      throw new ValidationError(
        "channels must be a string or array",
        "channels",
        "INVALID_CHANNELS"
      );
    }

    const channelValues = Object.values(NotificationChannel) as string[];
    channelsArray.forEach((channel: string, index: number) => {
      validateEnum(channel.trim(), channelValues, `channels[${index}]`);
    });
    query.channels = channelsArray;
  }

  // Validate triggerEvents if provided
  if (query.triggerEvents) {
    let eventsArray: string[];
    if (typeof query.triggerEvents === "string") {
      eventsArray = query.triggerEvents.split(",");
    } else if (Array.isArray(query.triggerEvents)) {
      eventsArray = query.triggerEvents;
    } else {
      throw new ValidationError(
        "triggerEvents must be a string or array",
        "triggerEvents",
        "INVALID_TRIGGER_EVENTS"
      );
    }

    const eventValues = Object.values(NotificationTriggerEvent) as string[];
    eventsArray.forEach((event: string, index: number) => {
      validateEnum(event.trim(), eventValues, `triggerEvents[${index}]`);
    });
    query.triggerEvents = eventsArray;
  }

  // Validate statuses if provided
  if (query.statuses) {
    let statusesArray: string[];
    if (typeof query.statuses === "string") {
      statusesArray = query.statuses.split(",");
    } else if (Array.isArray(query.statuses)) {
      statusesArray = query.statuses;
    } else {
      throw new ValidationError(
        "statuses must be a string or array",
        "statuses",
        "INVALID_STATUSES"
      );
    }

    const statusValues = Object.values(NotificationStatus) as string[];
    statusesArray.forEach((status: string, index: number) => {
      validateEnum(status.trim(), statusValues, `statuses[${index}]`);
    });
    query.statuses = statusesArray;
  }

  // Validate priorities if provided
  if (query.priorities) {
    let prioritiesArray: number[];
    if (typeof query.priorities === "string") {
      prioritiesArray = query.priorities
        .split(",")
        .map((p: string) => parseInt(p.trim(), 10));
    } else if (Array.isArray(query.priorities)) {
      prioritiesArray = query.priorities.map((p: string) => parseInt(p, 10));
    } else {
      throw new ValidationError(
        "priorities must be a string or array",
        "priorities",
        "INVALID_PRIORITIES"
      );
    }

    const priorityValues = [
      NotificationPriority.CRITICAL,
      NotificationPriority.HIGH,
      NotificationPriority.LOW,
      NotificationPriority.NORMAL,
      NotificationPriority.URGENT,
    ];

    prioritiesArray.forEach((priority: number, index: number) => {
      if (isNaN(priority)) {
        throw new ValidationError(
          `priorities[${index}] must be a number`,
          `priorities[${index}]`,
          "INVALID_PRIORITY_NUMBER"
        );
      }
      validateEnum(priority, priorityValues, `priorities[${index}]`);
    });
    query.priorities = prioritiesArray;
  }

  // Validate date range
  if (query.startDate) {
    const startDate = new Date(query.startDate);
    if (isNaN(startDate.getTime())) {
      throw new ValidationError(
        "startDate must be a valid ISO date string",
        "startDate",
        "INVALID_START_DATE"
      );
    }
  }

  if (query.endDate) {
    const endDate = new Date(query.endDate);
    if (isNaN(endDate.getTime())) {
      throw new ValidationError(
        "endDate must be a valid ISO date string",
        "endDate",
        "INVALID_END_DATE"
      );
    }
  }

  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (startDate >= endDate) {
      throw new ValidationError(
        "startDate must be before endDate",
        "dateRange",
        "INVALID_DATE_RANGE"
      );
    }
  }

  // Validate pagination
  if (query.page !== undefined) {
    const page = parseInt(query.page as string, 10);
    if (isNaN(page)) {
      throw new ValidationError(
        "page must be a number",
        "page",
        "INVALID_PAGE"
      );
    }
    validatePositiveInteger(page, "page");
    query.page = page;
  }

  if (query.limit !== undefined) {
    const limit = parseInt(query.limit as string, 10);
    if (isNaN(limit)) {
      throw new ValidationError(
        "limit must be a number",
        "limit",
        "INVALID_LIMIT"
      );
    }
    validatePositiveInteger(limit, "limit");

    if (limit > 100) {
      throw new ValidationError(
        "limit cannot exceed 100",
        "limit",
        "LIMIT_TOO_LARGE"
      );
    }
    query.limit = limit;
  }

  // Validate sortBy if provided
  if (query.sortBy) {
    const validSortFields = ["createdAt", "sentAt", "priority"];
    validateEnum(query.sortBy, validSortFields, "sortBy");
  }

  // Validate sortOrder if provided
  if (query.sortOrder) {
    const validSortOrders = ["asc", "desc"];
    validateEnum(query.sortOrder, validSortOrders, "sortOrder");
  }

  // Validate recipientAdminId if provided
  if (query.recipientAdminId !== undefined) {
    const adminId = parseInt(query.recipientAdminId as string, 10);
    if (isNaN(adminId)) {
      throw new ValidationError(
        "recipientAdminId must be a number",
        "recipientAdminId",
        "INVALID_ADMIN_ID"
      );
    }
    validatePositiveInteger(adminId, "recipientAdminId");
    query.recipientAdminId = adminId;
  }

  // Validate isRead if provided
  if (query.isRead !== undefined) {
    if (typeof query.isRead === "string") {
      query.isRead = query.isRead === "true";
    }
    if (typeof query.isRead !== "boolean") {
      throw new ValidationError(
        "isRead must be a boolean",
        "isRead",
        "INVALID_BOOLEAN"
      );
    }
  }

  // Store validated query in request
  (req as any).validatedQuery = query;
}

/**
 * Middleware for validating get notifications request
 */
export const validateGetNotifications = createValidationMiddleware(
  validateGetNotificationsRequest
);

// =============================================================================
// UPDATE NOTIFICATION VALIDATION
// =============================================================================

/**
 * Validate update notification request
 */
function validateUpdateNotificationRequest(req: Request): void {
  const { notificationId } = req.params;
  const body = { ...req.body } as any;

  // Validate notificationId parameter
  if (!notificationId) {
    throw new ValidationError(
      "notificationId is required",
      "notificationId",
      "REQUIRED_PARAM"
    );
  }

  // Validate notificationId format (UUID or numeric)
  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      notificationId
    ) || /^\d+$/.test(notificationId);

  if (!isValidId) {
    throw new ValidationError(
      "notificationId must be a valid UUID or numeric ID",
      "notificationId",
      "INVALID_ID_FORMAT"
    );
  }

  // Validate status if provided
  if (body.status) {
    const statusValues = Object.values(NotificationStatus) as string[];
    validateEnum(body.status, statusValues, "status");
  }

  // Validate retryCount if provided
  if (body.retryCount !== undefined) {
    validatePositiveInteger(body.retryCount, "retryCount");

    if (body.retryCount > NOTIFICATION_CONSTANTS.DEFAULT_RETRY_ATTEMPTS) {
      throw new ValidationError(
        `retryCount cannot exceed ${NOTIFICATION_CONSTANTS.DEFAULT_RETRY_ATTEMPTS}`,
        "retryCount",
        "RETRY_COUNT_TOO_HIGH"
      );
    }
  }

  // Validate failureReason if provided
  if (body.failureReason) {
    validateStringLength(body.failureReason, "failureReason", 1, 500);
  }

  // Validate deliveredAt if provided
  if (body.deliveredAt) {
    const deliveredDate = new Date(body.deliveredAt);
    if (isNaN(deliveredDate.getTime())) {
      throw new ValidationError(
        "deliveredAt must be a valid ISO date string",
        "deliveredAt",
        "INVALID_DATE"
      );
    }
  }

  // Validate metadata if provided
  if (body.metadata) {
    if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
      throw new ValidationError(
        "metadata must be an object",
        "metadata",
        "INVALID_OBJECT"
      );
    }
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating update notification request
 */
export const validateUpdateNotification = createValidationMiddleware(
  validateUpdateNotificationRequest
);

// =============================================================================
// TEST NOTIFICATION VALIDATION
// =============================================================================

/**
 * Validate test notification request
 */
function validateTestNotificationRequest(req: Request): void {
  const body = { ...req.body } as any;

  // Validate required fields
  validateRequired(body.channel, "channel");
  validateRequired(body.recipient, "recipient");

  // Validate channel enum
  const channelValues = Object.values(NotificationChannel) as string[];
  validateEnum(body.channel, channelValues, "channel");

  // Validate recipient format based on channel
  if (body.channel === NotificationChannel.EMAIL) {
    validateEmailFormat(body.recipient, "recipient");
  } else if (body.channel === NotificationChannel.SLACK) {
    // Validate Slack channel format (#channel or @username)
    if (!body.recipient.startsWith("#") && !body.recipient.startsWith("@")) {
      throw new ValidationError(
        "Slack recipient must start with # (channel) or @ (username)",
        "recipient",
        "INVALID_SLACK_RECIPIENT"
      );
    }
  } else if (body.channel === NotificationChannel.SMS) {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(body.recipient)) {
      throw new ValidationError(
        "SMS recipient must be a valid phone number",
        "recipient",
        "INVALID_PHONE_NUMBER"
      );
    }
  }

  // Validate templateId if provided
  if (body.templateId) {
    if (
      typeof body.templateId !== "string" ||
      body.templateId.trim().length === 0
    ) {
      throw new ValidationError(
        "templateId must be a non-empty string",
        "templateId",
        "INVALID_TEMPLATE_ID"
      );
    }
  }

  // Validate templateVariables if provided
  if (body.templateVariables) {
    if (
      typeof body.templateVariables !== "object" ||
      Array.isArray(body.templateVariables)
    ) {
      throw new ValidationError(
        "templateVariables must be an object",
        "templateVariables",
        "INVALID_OBJECT"
      );
    }
  }

  // Validate customMessage if provided
  if (body.customMessage) {
    validateStringLength(body.customMessage, "customMessage", 1, 1000);
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating test notification request
 */
export const validateTestNotification = createValidationMiddleware(
  validateTestNotificationRequest
);

// =============================================================================
// BULK NOTIFICATION VALIDATION
// =============================================================================

/**
 * Validate bulk notification request
 */
function validateBulkNotificationRequest(req: Request): void {
  const body = { ...req.body } as any;

  // Validate required fields
  validateRequired(body.templateId, "templateId");
  validateRequired(body.recipients, "recipients");
  validateRequired(body.priority, "priority");
  validateRequired(body.metadata, "metadata");

  // Validate templateId
  if (
    typeof body.templateId !== "string" ||
    body.templateId.trim().length === 0
  ) {
    throw new ValidationError(
      "templateId must be a non-empty string",
      "templateId",
      "INVALID_TEMPLATE_ID"
    );
  }

  // Validate recipients array
  const recipients = validateArray(
    body.recipients,
    "recipients",
    NOTIFICATION_CONSTANTS.BATCH_SIZE
  );
  recipients.forEach((recipient: any, index: number) => {
    if (!recipient || typeof recipient !== "object") {
      throw new ValidationError(
        `recipients[${index}] must be an object`,
        `recipients[${index}]`,
        "INVALID_RECIPIENT_OBJECT"
      );
    }

    if (!recipient.channel) {
      throw new ValidationError(
        `recipients[${index}].channel is required`,
        `recipients[${index}].channel`,
        "REQUIRED_FIELD"
      );
    }

    // Validate channel
    const channelValues = Object.values(NotificationChannel) as string[];
    validateEnum(
      recipient.channel,
      channelValues,
      `recipients[${index}].channel`
    );

    // Validate adminId if provided
    if (recipient.adminId !== undefined) {
      validatePositiveInteger(
        recipient.adminId,
        `recipients[${index}].adminId`
      );
    }

    // Validate templateVariables if provided
    if (recipient.templateVariables) {
      if (
        typeof recipient.templateVariables !== "object" ||
        Array.isArray(recipient.templateVariables)
      ) {
        throw new ValidationError(
          `recipients[${index}].templateVariables must be an object`,
          `recipients[${index}].templateVariables`,
          "INVALID_OBJECT"
        );
      }
    }
  });

  // Validate priority
  const priorityValues = Object.values(NotificationPriority);
  validateEnum(body.priority, priorityValues, "priority");

  // Validate scheduledAt if provided
  if (body.scheduledAt) {
    const scheduledDate = new Date(body.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new ValidationError(
        "scheduledAt must be a valid ISO date string",
        "scheduledAt",
        "INVALID_DATE"
      );
    }

    if (scheduledDate <= new Date()) {
      throw new ValidationError(
        "scheduledAt must be in the future",
        "scheduledAt",
        "INVALID_SCHEDULE_DATE"
      );
    }
  }

  // Validate metadata
  if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
    throw new ValidationError(
      "metadata must be an object",
      "metadata",
      "INVALID_OBJECT"
    );
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating bulk notification request
 */
export const validateBulkNotification = createValidationMiddleware(
  validateBulkNotificationRequest
);

// =============================================================================
// NOTIFICATION TEMPLATE VALIDATION
// =============================================================================

/**
 * Validate create notification template request
 */
function validateCreateNotificationTemplateRequest(req: Request): void {
  const body = { ...req.body } as any;

  // Validate required fields
  validateRequired(body.name, "name");
  validateRequired(body.triggerEvent, "triggerEvent");
  validateRequired(body.channels, "channels");

  // Validate name
  validateStringLength(body.name, "name", 3, 100);

  // Validate triggerEvent
  const triggerEventValues = Object.values(
    NotificationTriggerEvent
  ) as string[];
  validateEnum(body.triggerEvent, triggerEventValues, "triggerEvent");

  // Validate channels
  const channelsArray = validateArray(body.channels, "channels", 5);
  const channelValues = Object.values(NotificationChannel) as string[];
  channelsArray.forEach((channel: string, index: number) => {
    validateEnum(channel, channelValues, `channels[${index}]`);
  });

  // Validate priority if provided
  if (body.priority) {
    const priorityValues = Object.values(NotificationPriority);
    validateEnum(body.priority, priorityValues, "priority");
  }

  // Validate frequency if provided
  if (body.frequency) {
    const frequencyValues = Object.values(NotificationFrequency) as string[];
    validateEnum(body.frequency, frequencyValues, "frequency");
  }

  // Validate isActive if provided
  if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
    throw new ValidationError(
      "isActive must be a boolean",
      "isActive",
      "INVALID_BOOLEAN"
    );
  }

  // Validate templates object if provided
  if (body.templates) {
    if (typeof body.templates !== "object" || Array.isArray(body.templates)) {
      throw new ValidationError(
        "templates must be an object",
        "templates",
        "INVALID_OBJECT"
      );
    }

    // Validate email template if provided
    if (body.templates.email) {
      const emailTemplate = body.templates.email;
      if (emailTemplate.subject) {
        validateStringLength(
          emailTemplate.subject,
          "templates.email.subject",
          1,
          200
        );
      }
      if (emailTemplate.htmlContent) {
        validateStringLength(
          emailTemplate.htmlContent,
          "templates.email.htmlContent",
          1,
          10000
        );
      }
      if (emailTemplate.textContent) {
        validateStringLength(
          emailTemplate.textContent,
          "templates.email.textContent",
          1,
          5000
        );
      }
    }

    // Validate slack template if provided
    if (body.templates.slack) {
      const slackTemplate = body.templates.slack;
      if (slackTemplate.message) {
        validateStringLength(
          slackTemplate.message,
          "templates.slack.message",
          1,
          3000
        );
      }
      if (slackTemplate.channel) {
        if (
          !slackTemplate.channel.startsWith("#") &&
          !slackTemplate.channel.startsWith("@")
        ) {
          throw new ValidationError(
            "templates.slack.channel must start with # or @",
            "templates.slack.channel",
            "INVALID_SLACK_CHANNEL"
          );
        }
      }
    }

    // Validate SMS template if provided
    if (body.templates.sms) {
      const smsTemplate = body.templates.sms;
      if (smsTemplate.message) {
        validateStringLength(
          smsTemplate.message,
          "templates.sms.message",
          1,
          NOTIFICATION_CONSTANTS.MAX_SMS_LENGTH
        );
      }
    }
  }

  // Validate conditions if provided
  if (body.conditions) {
    const conditions = validateArray(body.conditions, "conditions", 10);
    conditions.forEach((condition: any, index: number) => {
      if (!condition.field) {
        throw new ValidationError(
          `conditions[${index}].field is required`,
          `conditions[${index}].field`,
          "REQUIRED_FIELD"
        );
      }
      if (!condition.operator) {
        throw new ValidationError(
          `conditions[${index}].operator is required`,
          `conditions[${index}].operator`,
          "REQUIRED_FIELD"
        );
      }

      const validOperators = [
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "contains",
        "in",
        "not_in",
      ];
      validateEnum(
        condition.operator,
        validOperators,
        `conditions[${index}].operator`
      );
    });
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating create notification template request
 */
export const validateCreateNotificationTemplate = createValidationMiddleware(
  validateCreateNotificationTemplateRequest
);

/**
 * Middleware for validating update notification template request
 */
export const validateUpdateNotificationTemplate = createValidationMiddleware(
  validateCreateNotificationTemplateRequest // Same validation rules
);

// =============================================================================
// NOTIFICATION PREFERENCES VALIDATION
// =============================================================================

/**
 * Validate update notification preferences request
 */
function validateUpdateNotificationPreferencesRequest(req: Request): void {
  const body = { ...req.body } as any;

  // Validate channels object if provided
  if (body.channels) {
    if (typeof body.channels !== "object" || Array.isArray(body.channels)) {
      throw new ValidationError(
        "channels must be an object",
        "channels",
        "INVALID_OBJECT"
      );
    }

    // Validate individual channel preferences
    const channelValues = Object.values(NotificationChannel) as string[];
    Object.keys(body.channels).forEach((channelKey) => {
      validateEnum(channelKey, channelValues, `channels.${channelKey}`);

      const channelPref = body.channels[channelKey];
      if (typeof channelPref !== "object" || Array.isArray(channelPref)) {
        throw new ValidationError(
          `channels.${channelKey} must be an object`,
          `channels.${channelKey}`,
          "INVALID_OBJECT"
        );
      }

      // Validate enabled flag
      if (
        channelPref.enabled !== undefined &&
        typeof channelPref.enabled !== "boolean"
      ) {
        throw new ValidationError(
          `channels.${channelKey}.enabled must be a boolean`,
          `channels.${channelKey}.enabled`,
          "INVALID_BOOLEAN"
        );
      }

      // Validate frequency
      if (channelPref.frequency) {
        const frequencyValues = Object.values(
          NotificationFrequency
        ) as string[];
        validateEnum(
          channelPref.frequency,
          frequencyValues,
          `channels.${channelKey}.frequency`
        );
      }

      // Validate minimumPriority
      if (channelPref.minimumPriority) {
        const priorityValues = Object.values(NotificationPriority);
        validateEnum(
          channelPref.minimumPriority,
          priorityValues,
          `channels.${channelKey}.minimumPriority`
        );
      }

      // Validate recipientAddress if provided
      if (channelPref.recipientAddress) {
        if (channelKey === NotificationChannel.EMAIL) {
          validateEmailFormat(
            channelPref.recipientAddress,
            `channels.${channelKey}.recipientAddress`
          );
        }
      }
    });
  }

  // Validate eventPreferences if provided
  if (body.eventPreferences) {
    if (
      typeof body.eventPreferences !== "object" ||
      Array.isArray(body.eventPreferences)
    ) {
      throw new ValidationError(
        "eventPreferences must be an object",
        "eventPreferences",
        "INVALID_OBJECT"
      );
    }

    const eventValues = Object.values(NotificationTriggerEvent) as string[];
    Object.keys(body.eventPreferences).forEach((eventKey) => {
      validateEnum(eventKey, eventValues, `eventPreferences.${eventKey}`);

      const eventPref = body.eventPreferences[eventKey];
      if (typeof eventPref !== "object" || Array.isArray(eventPref)) {
        throw new ValidationError(
          `eventPreferences.${eventKey} must be an object`,
          `eventPreferences.${eventKey}`,
          "INVALID_OBJECT"
        );
      }

      // Validate enabled
      if (
        eventPref.enabled !== undefined &&
        typeof eventPref.enabled !== "boolean"
      ) {
        throw new ValidationError(
          `eventPreferences.${eventKey}.enabled must be a boolean`,
          `eventPreferences.${eventKey}.enabled`,
          "INVALID_BOOLEAN"
        );
      }

      // Validate channels
      if (eventPref.channels) {
        const channelsArray = validateArray(
          eventPref.channels,
          `eventPreferences.${eventKey}.channels`,
          5
        );
        const channelValues = Object.values(NotificationChannel) as string[];
        channelsArray.forEach((channel: string, index: number) => {
          validateEnum(
            channel,
            channelValues,
            `eventPreferences.${eventKey}.channels[${index}]`
          );
        });
      }

      // Validate frequency
      if (eventPref.frequency) {
        const frequencyValues = Object.values(
          NotificationFrequency
        ) as string[];
        validateEnum(
          eventPref.frequency,
          frequencyValues,
          `eventPreferences.${eventKey}.frequency`
        );
      }
    });
  }

  // Validate quietHours if provided
  if (body.quietHours) {
    const quietHours = body.quietHours;

    if (
      quietHours.enabled !== undefined &&
      typeof quietHours.enabled !== "boolean"
    ) {
      throw new ValidationError(
        "quietHours.enabled must be a boolean",
        "quietHours.enabled",
        "INVALID_BOOLEAN"
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (quietHours.startTime && !timeRegex.test(quietHours.startTime)) {
      throw new ValidationError(
        "quietHours.startTime must be in HH:MM format",
        "quietHours.startTime",
        "INVALID_TIME_FORMAT"
      );
    }

    if (quietHours.endTime && !timeRegex.test(quietHours.endTime)) {
      throw new ValidationError(
        "quietHours.endTime must be in HH:MM format",
        "quietHours.endTime",
        "INVALID_TIME_FORMAT"
      );
    }

    // Validate timezone
    if (quietHours.timezone && typeof quietHours.timezone !== "string") {
      throw new ValidationError(
        "quietHours.timezone must be a string",
        "quietHours.timezone",
        "INVALID_TIMEZONE"
      );
    }

    // Validate daysOfWeek
    if (quietHours.daysOfWeek) {
      const daysArray = validateArray(
        quietHours.daysOfWeek,
        "quietHours.daysOfWeek",
        7
      );
      daysArray.forEach((day: any, index: number) => {
        if (!Number.isInteger(day) || day < 0 || day > 6) {
          throw new ValidationError(
            `quietHours.daysOfWeek[${index}] must be an integer between 0 and 6`,
            `quietHours.daysOfWeek[${index}]`,
            "INVALID_DAY_OF_WEEK"
          );
        }
      });
    }

    // Validate emergencyOverride
    if (
      quietHours.emergencyOverride !== undefined &&
      typeof quietHours.emergencyOverride !== "boolean"
    ) {
      throw new ValidationError(
        "quietHours.emergencyOverride must be a boolean",
        "quietHours.emergencyOverride",
        "INVALID_BOOLEAN"
      );
    }
  }

  // Validate timezone if provided
  if (body.timezone && typeof body.timezone !== "string") {
    throw new ValidationError(
      "timezone must be a string",
      "timezone",
      "INVALID_TIMEZONE"
    );
  }

  // Validate language if provided
  if (body.language && typeof body.language !== "string") {
    throw new ValidationError(
      "language must be a string",
      "language",
      "INVALID_LANGUAGE"
    );
  }

  // Store validated body in request
  (req as any).validatedBody = body;
}

/**
 * Middleware for validating update notification preferences request
 */
export const validateUpdateNotificationPreferences = createValidationMiddleware(
  validateUpdateNotificationPreferencesRequest
);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Utility function to get validated query from request
 */
export function getValidatedQuery<T = any>(req: Request): T {
  return (req as any).validatedQuery || req.query;
}

/**
 * Utility function to get validated body from request
 */
export function getValidatedBody<T = any>(req: Request): T {
  return (req as any).validatedBody || req.body;
}

/**
 * Notification validation constants
 */
export const NOTIFICATION_VALIDATION_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_METADATA_SIZE: 5000,
  MAX_TEMPLATE_VARIABLES: 50,
  MAX_RECIPIENTS_PER_BATCH: 100,
  MAX_CONDITIONS_PER_TEMPLATE: 10,
  MAX_SMS_LENGTH: 160,
  MAX_SLACK_BLOCKS: 50,
  MAX_EMAIL_RECIPIENTS: 100,
} as const;
