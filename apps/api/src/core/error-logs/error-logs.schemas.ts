import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginationQuerySchema,
  PaginatedResponseSchema,
} from '../../schemas/base.schemas';

// Error log entry (database record)
export const ErrorLogSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  timestamp: Type.String({ format: 'date-time' }),
  level: Type.Union([
    Type.Literal('error'),
    Type.Literal('warn'),
    Type.Literal('info'),
  ]),
  message: Type.String(),
  url: Type.Optional(Type.String()),
  stack: Type.Optional(Type.String()),
  context: Type.Optional(Type.Record(Type.String(), Type.Any())),
  type: Type.Union([
    Type.Literal('javascript'),
    Type.Literal('http'),
    Type.Literal('angular'),
    Type.Literal('custom'),
    Type.Literal('backend'),
    Type.Literal('system'),
  ]),
  userId: Type.Optional(Type.String({ format: 'uuid' })),
  sessionId: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
  correlationId: Type.Optional(Type.String()),
  ipAddress: Type.Optional(Type.String()),
  referer: Type.Optional(Type.String()),
  serverTimestamp: Type.String({ format: 'date-time' }),
  createdAt: Type.String({ format: 'date-time' }),
});

// Query parameters for listing errors
export const ErrorLogsQuerySchema = Type.Intersect([
  PaginationQuerySchema,
  Type.Object({
    level: Type.Optional(
      Type.Union([
        Type.Literal('error'),
        Type.Literal('warn'),
        Type.Literal('info'),
      ]),
    ),
    type: Type.Optional(
      Type.Union([
        Type.Literal('javascript'),
        Type.Literal('http'),
        Type.Literal('angular'),
        Type.Literal('custom'),
        Type.Literal('backend'),
        Type.Literal('system'),
      ]),
    ),
    userId: Type.Optional(Type.String({ format: 'uuid' })),
    startDate: Type.Optional(Type.String({ format: 'date-time' })),
    endDate: Type.Optional(Type.String({ format: 'date-time' })),
    search: Type.Optional(Type.String({ minLength: 1 })),
  }),
]);

// Error statistics
export const ErrorStatsSchema = Type.Object({
  totalErrors: Type.Number(),
  recentErrors: Type.Number({ description: 'Errors in the last 24 hours' }),
  byLevel: Type.Object({
    error: Type.Number(),
    warn: Type.Number(),
    info: Type.Number(),
  }),
  byType: Type.Object({
    javascript: Type.Number(),
    http: Type.Number(),
    angular: Type.Number(),
    custom: Type.Number(),
    backend: Type.Number(),
    system: Type.Number(),
  }),
  trend: Type.Array(
    Type.Object({
      date: Type.String({ format: 'date' }),
      count: Type.Number(),
    }),
  ),
  topErrors: Type.Array(
    Type.Object({
      message: Type.String(),
      count: Type.Number(),
    }),
    { maxItems: 10 },
  ),
});

// Cleanup parameters
export const CleanupQuerySchema = Type.Object({
  olderThan: Type.Number({ minimum: 1, maximum: 365, description: 'Days' }),
});

// Response schemas
export const ErrorLogResponseSchema = ApiSuccessResponseSchema(ErrorLogSchema);

export const ErrorLogsListResponseSchema =
  PaginatedResponseSchema(ErrorLogSchema);

export const ErrorStatsResponseSchema =
  ApiSuccessResponseSchema(ErrorStatsSchema);

export const CleanupResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    deletedCount: Type.Number({ minimum: 0 }),
  }),
);

export const DeleteErrorLogResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String(),
  }),
);

// Type exports
export type ErrorLog = Static<typeof ErrorLogSchema>;
export type ErrorLogsQuery = Static<typeof ErrorLogsQuerySchema>;
export type ErrorStats = Static<typeof ErrorStatsSchema>;
export type CleanupQuery = Static<typeof CleanupQuerySchema>;
export type ErrorLogResponse = Static<typeof ErrorLogResponseSchema>;
export type ErrorLogsListResponse = Static<typeof ErrorLogsListResponseSchema>;
export type ErrorStatsResponse = Static<typeof ErrorStatsResponseSchema>;
export type CleanupResponse = Static<typeof CleanupResponseSchema>;

// Export schemas for registration
export const errorLogsSchemas = {
  'error-log': ErrorLogSchema,
  'error-logs-query': ErrorLogsQuerySchema,
  'error-log-response': ErrorLogResponseSchema,
  'error-logs-list-response': ErrorLogsListResponseSchema,
  'error-stats': ErrorStatsSchema,
  'error-stats-response': ErrorStatsResponseSchema,
  'cleanup-query': CleanupQuerySchema,
  'cleanup-response': CleanupResponseSchema,
};
