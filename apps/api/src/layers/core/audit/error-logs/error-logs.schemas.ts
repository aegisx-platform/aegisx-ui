import { Type, Static } from '@sinclair/typebox';
import {
  UuidSchema,
  TimestampSchema,
  IpAddressSchema,
  UserAgentSchema,
  SessionIdSchema,
  MetadataSchema,
  BaseAuditQuerySchema,
  BaseStatsSchema,
  TrendDataSchema,
  TopItemsSchema,
  PaginatedResponseSchema,
  ApiSuccessResponseSchema,
  IdParamSchema,
  DaysParamSchema,
  CleanupQuerySchema,
  CleanupResultSchema,
  ExportQuerySchema,
  nullable,
  optionalNullable,
  createEnumSchema,
  createOptionalEnumSchema,
} from '../base/base.schemas';

/**
 * Error Logs TypeBox Schemas
 *
 * Comprehensive schemas for error logs API validation and type inference.
 * Extends base audit schemas with error-specific fields.
 */

// ==================== ENUM SCHEMAS ====================

/**
 * Error Level Enum
 */
export const ErrorLevelSchema = createEnumSchema(
  ['error', 'warn', 'info'],
  'Error severity level',
);

export type ErrorLevel = 'error' | 'warn' | 'info';

/**
 * Error Type Enum
 */
export const ErrorTypeSchema = createEnumSchema(
  ['javascript', 'http', 'angular', 'custom', 'backend', 'system'],
  'Error type classification',
);

export type ErrorType =
  | 'javascript'
  | 'http'
  | 'angular'
  | 'custom'
  | 'backend'
  | 'system';

/**
 * Optional Error Level Filter
 */
export const ErrorLevelFilterSchema = createOptionalEnumSchema(
  ['error', 'warn', 'info'],
  'Filter by error level',
);

/**
 * Optional Error Type Filter
 */
export const ErrorTypeFilterSchema = createOptionalEnumSchema(
  ['javascript', 'http', 'angular', 'custom', 'backend', 'system'],
  'Filter by error type',
);

// ==================== ERROR LOG SCHEMA ====================

/**
 * Error Log Entity Schema
 *
 * Represents a complete error log record from the database.
 */
export const ErrorLogSchema = Type.Object(
  {
    id: UuidSchema,
    timestamp: TimestampSchema,
    message: Type.String({
      minLength: 1,
      description: 'Error message',
    }),
    url: optionalNullable(
      Type.String({
        description: 'URL where error occurred',
      }),
    ),
    stack: optionalNullable(
      Type.String({
        description: 'Error stack trace',
      }),
    ),
    context: optionalNullable(MetadataSchema),
    level: ErrorLevelSchema,
    type: ErrorTypeSchema,
    userId: nullable(UuidSchema),
    sessionId: optionalNullable(
      Type.String({
        maxLength: 255,
        description: 'Session identifier',
      }),
    ),
    userAgent: optionalNullable(
      Type.String({
        maxLength: 512,
        description: 'Browser user agent',
      }),
    ),
    correlationId: optionalNullable(
      Type.String({
        maxLength: 255,
        description: 'Correlation identifier for tracing',
      }),
    ),
    ipAddress: optionalNullable(IpAddressSchema),
    referer: optionalNullable(
      Type.String({
        description: 'HTTP referer',
      }),
    ),
    serverTimestamp: TimestampSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  },
  {
    $id: 'ErrorLog',
    description: 'Error log record',
  },
);

export type ErrorLog = Static<typeof ErrorLogSchema>;

// ==================== QUERY SCHEMAS ====================

/**
 * Error Query Schema
 *
 * Query parameters for filtering error logs.
 * Extends base audit query with error-specific filters.
 */
export const ErrorQuerySchema = Type.Intersect(
  [
    BaseAuditQuerySchema,
    Type.Object({
      level: ErrorLevelFilterSchema,
      type: ErrorTypeFilterSchema,
      correlationId: Type.Optional(
        Type.String({
          maxLength: 255,
          description: 'Filter by correlation ID',
        }),
      ),
      sessionId: Type.Optional(
        Type.String({
          maxLength: 255,
          description: 'Filter by session ID',
        }),
      ),
    }),
  ],
  {
    $id: 'ErrorQuery',
    description: 'Error logs query parameters',
  },
);

export type ErrorQuery = Static<typeof ErrorQuerySchema>;

// ==================== STATISTICS SCHEMAS ====================

/**
 * Error Statistics by Level
 */
export const ErrorLevelStatsSchema = Type.Object({
  error: Type.Integer({ minimum: 0, description: 'Error count' }),
  warn: Type.Integer({ minimum: 0, description: 'Warning count' }),
  info: Type.Integer({ minimum: 0, description: 'Info count' }),
});

export type ErrorLevelStats = Static<typeof ErrorLevelStatsSchema>;

/**
 * Error Statistics by Type
 */
export const ErrorTypeStatsSchema = Type.Object({
  javascript: Type.Integer({
    minimum: 0,
    description: 'JavaScript error count',
  }),
  http: Type.Integer({ minimum: 0, description: 'HTTP error count' }),
  angular: Type.Integer({ minimum: 0, description: 'Angular error count' }),
  custom: Type.Integer({ minimum: 0, description: 'Custom error count' }),
  backend: Type.Integer({ minimum: 0, description: 'Backend error count' }),
  system: Type.Integer({ minimum: 0, description: 'System error count' }),
});

export type ErrorTypeStats = Static<typeof ErrorTypeStatsSchema>;

/**
 * Error Statistics Schema
 *
 * Comprehensive statistics for error logs.
 * Extends base stats with error-specific breakdowns.
 */
export const ErrorStatsSchema = Type.Intersect(
  [
    BaseStatsSchema,
    Type.Object({
      byLevel: ErrorLevelStatsSchema,
      byType: ErrorTypeStatsSchema,
      topMessages: TopItemsSchema,
      topUrls: TopItemsSchema,
      trend: TrendDataSchema,
    }),
  ],
  {
    $id: 'ErrorStats',
    description: 'Error logs statistics',
  },
);

export type ErrorStats = Static<typeof ErrorStatsSchema>;

// ==================== RESPONSE SCHEMAS ====================

/**
 * Single Error Log Response
 */
export const ErrorLogResponseSchema = ApiSuccessResponseSchema(ErrorLogSchema);

export type ErrorLogResponse = Static<typeof ErrorLogResponseSchema>;

/**
 * Error Logs List Response (Paginated)
 */
export const ErrorLogsListResponseSchema =
  PaginatedResponseSchema(ErrorLogSchema);

export type ErrorLogsListResponse = Static<typeof ErrorLogsListResponseSchema>;

/**
 * Error Stats Response
 */
export const ErrorStatsResponseSchema =
  ApiSuccessResponseSchema(ErrorStatsSchema);

export type ErrorStatsResponse = Static<typeof ErrorStatsResponseSchema>;

/**
 * Cleanup Result Response
 */
export const ErrorCleanupResponseSchema =
  ApiSuccessResponseSchema(CleanupResultSchema);

export type ErrorCleanupResponse = Static<typeof ErrorCleanupResponseSchema>;

/**
 * Delete Success Response
 */
export const ErrorDeleteResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String(),
  }),
);

export type ErrorDeleteResponse = Static<typeof ErrorDeleteResponseSchema>;

// ==================== EXPORT ALL SCHEMAS ====================

/**
 * All Error Logs Schemas
 *
 * Convenient object for importing all schemas at once.
 */
export const ErrorLogsSchemas = {
  // Entity
  ErrorLog: ErrorLogSchema,

  // Enums
  ErrorLevel: ErrorLevelSchema,
  ErrorType: ErrorTypeSchema,
  ErrorLevelFilter: ErrorLevelFilterSchema,
  ErrorTypeFilter: ErrorTypeFilterSchema,

  // Query
  ErrorQuery: ErrorQuerySchema,
  DaysParam: DaysParamSchema,
  CleanupQuery: CleanupQuerySchema,
  ExportQuery: ExportQuerySchema,

  // Stats
  ErrorStats: ErrorStatsSchema,
  ErrorLevelStats: ErrorLevelStatsSchema,
  ErrorTypeStats: ErrorTypeStatsSchema,

  // Responses
  ErrorLogResponse: ErrorLogResponseSchema,
  ErrorLogsListResponse: ErrorLogsListResponseSchema,
  ErrorStatsResponse: ErrorStatsResponseSchema,
  ErrorCleanupResponse: ErrorCleanupResponseSchema,
  ErrorDeleteResponse: ErrorDeleteResponseSchema,

  // Parameters
  IdParam: IdParamSchema,
};
