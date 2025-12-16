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
 * Activity Logs TypeBox Schemas
 *
 * Comprehensive schemas for activity logs API validation and type inference.
 * Extends base audit schemas with activity-specific fields.
 */

// ==================== ENUM SCHEMAS ====================

/**
 * Activity Action Enum
 */
export const ActivityActionSchema = createEnumSchema(
  ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'],
  'Activity action type',
);

export type ActivityAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'import';

/**
 * Activity Severity Enum
 */
export const ActivitySeveritySchema = createEnumSchema(
  ['info', 'warning', 'error', 'critical'],
  'Activity severity level',
);

export type ActivitySeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Optional Activity Action Filter
 */
export const ActivityActionFilterSchema = createOptionalEnumSchema(
  ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'],
  'Filter by activity action',
);

/**
 * Optional Activity Severity Filter
 */
export const ActivitySeverityFilterSchema = createOptionalEnumSchema(
  ['info', 'warning', 'error', 'critical'],
  'Filter by severity level',
);

// ==================== ACTIVITY LOG SCHEMA ====================

/**
 * Activity Log Entity Schema
 *
 * Represents a complete activity log record from the database.
 */
export const ActivityLogSchema = Type.Object(
  {
    id: UuidSchema,
    timestamp: TimestampSchema,
    action: ActivityActionSchema,
    description: Type.String({
      minLength: 1,
      description: 'Activity description',
    }),
    resourceType: optionalNullable(
      Type.String({
        maxLength: 255,
        description: 'Type of resource affected',
      }),
    ),
    resourceId: optionalNullable(
      Type.String({
        maxLength: 255,
        description: 'ID of resource affected',
      }),
    ),
    severity: ActivitySeveritySchema,
    metadata: optionalNullable(MetadataSchema),
    userId: UuidSchema,
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
    ipAddress: optionalNullable(IpAddressSchema),
    serverTimestamp: TimestampSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  },
  {
    $id: 'ActivityLog',
    description: 'Activity log record',
  },
);

export type ActivityLog = Static<typeof ActivityLogSchema>;

// ==================== QUERY SCHEMAS ====================

/**
 * Activity Query Schema
 *
 * Query parameters for filtering activity logs.
 * Extends base audit query with activity-specific filters.
 */
export const ActivityQuerySchema = Type.Intersect(
  [
    BaseAuditQuerySchema,
    Type.Object({
      action: ActivityActionFilterSchema,
      severity: ActivitySeverityFilterSchema,
      resourceType: Type.Optional(
        Type.String({
          maxLength: 255,
          description: 'Filter by resource type',
        }),
      ),
      resourceId: Type.Optional(
        Type.String({
          maxLength: 255,
          description: 'Filter by resource ID',
        }),
      ),
    }),
  ],
  {
    $id: 'ActivityQuery',
    description: 'Activity logs query parameters',
  },
);

export type ActivityQuery = Static<typeof ActivityQuerySchema>;

// ==================== STATISTICS SCHEMAS ====================

/**
 * Activity Statistics by Action
 */
export const ActivityActionStatsSchema = Type.Object({
  create: Type.Integer({ minimum: 0, description: 'Create action count' }),
  read: Type.Integer({ minimum: 0, description: 'Read action count' }),
  update: Type.Integer({ minimum: 0, description: 'Update action count' }),
  delete: Type.Integer({ minimum: 0, description: 'Delete action count' }),
  login: Type.Integer({ minimum: 0, description: 'Login action count' }),
  logout: Type.Integer({ minimum: 0, description: 'Logout action count' }),
  export: Type.Integer({ minimum: 0, description: 'Export action count' }),
  import: Type.Integer({ minimum: 0, description: 'Import action count' }),
});

export type ActivityActionStats = Static<typeof ActivityActionStatsSchema>;

/**
 * Activity Statistics by Severity
 */
export const ActivitySeverityStatsSchema = Type.Object({
  info: Type.Integer({ minimum: 0, description: 'Info count' }),
  warning: Type.Integer({ minimum: 0, description: 'Warning count' }),
  error: Type.Integer({ minimum: 0, description: 'Error count' }),
  critical: Type.Integer({ minimum: 0, description: 'Critical count' }),
});

export type ActivitySeverityStats = Static<typeof ActivitySeverityStatsSchema>;

/**
 * Activity Statistics Schema
 *
 * Comprehensive statistics for activity logs.
 * Extends base stats with activity-specific breakdowns.
 */
export const ActivityStatsSchema = Type.Intersect(
  [
    BaseStatsSchema,
    Type.Object({
      byAction: ActivityActionStatsSchema,
      bySeverity: ActivitySeverityStatsSchema,
      topResources: TopItemsSchema,
      topUsers: TopItemsSchema,
      trend: TrendDataSchema,
    }),
  ],
  {
    $id: 'ActivityStats',
    description: 'Activity logs statistics',
  },
);

export type ActivityStats = Static<typeof ActivityStatsSchema>;

// ==================== RESPONSE SCHEMAS ====================

/**
 * Single Activity Log Response
 */
export const ActivityLogResponseSchema =
  ApiSuccessResponseSchema(ActivityLogSchema);

export type ActivityLogResponse = Static<typeof ActivityLogResponseSchema>;

/**
 * Activity Logs List Response (Paginated)
 */
export const ActivityLogsListResponseSchema =
  PaginatedResponseSchema(ActivityLogSchema);

export type ActivityLogsListResponse = Static<
  typeof ActivityLogsListResponseSchema
>;

/**
 * Activity Stats Response
 */
export const ActivityStatsResponseSchema =
  ApiSuccessResponseSchema(ActivityStatsSchema);

export type ActivityStatsResponse = Static<typeof ActivityStatsResponseSchema>;

/**
 * Cleanup Result Response
 */
export const ActivityCleanupResponseSchema =
  ApiSuccessResponseSchema(CleanupResultSchema);

export type ActivityCleanupResponse = Static<
  typeof ActivityCleanupResponseSchema
>;

/**
 * Delete Success Response
 */
export const ActivityDeleteResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    message: Type.String(),
  }),
);

export type ActivityDeleteResponse = Static<
  typeof ActivityDeleteResponseSchema
>;

// ==================== EXPORT ALL SCHEMAS ====================

/**
 * All Activity Logs Schemas
 *
 * Convenient object for importing all schemas at once.
 */
export const ActivityLogsSchemas = {
  // Entity
  ActivityLog: ActivityLogSchema,

  // Enums
  ActivityAction: ActivityActionSchema,
  ActivitySeverity: ActivitySeveritySchema,
  ActivityActionFilter: ActivityActionFilterSchema,
  ActivitySeverityFilter: ActivitySeverityFilterSchema,

  // Query
  ActivityQuery: ActivityQuerySchema,
  DaysParam: DaysParamSchema,
  CleanupQuery: CleanupQuerySchema,
  ExportQuery: ExportQuerySchema,

  // Stats
  ActivityStats: ActivityStatsSchema,
  ActivityActionStats: ActivityActionStatsSchema,
  ActivitySeverityStats: ActivitySeverityStatsSchema,

  // Responses
  ActivityLogResponse: ActivityLogResponseSchema,
  ActivityLogsListResponse: ActivityLogsListResponseSchema,
  ActivityStatsResponse: ActivityStatsResponseSchema,
  ActivityCleanupResponse: ActivityCleanupResponseSchema,
  ActivityDeleteResponse: ActivityDeleteResponseSchema,

  // Parameters
  IdParam: IdParamSchema,
};
