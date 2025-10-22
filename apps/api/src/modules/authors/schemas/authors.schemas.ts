import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
  DropdownOptionSchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  StatusToggleSchema,
  StatisticsSchema,
  ValidationRequestSchema,
  UniquenessCheckSchema,
} from '../../../schemas/base.schemas';

// Base Authors Schema
export const AuthorsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  email: Type.String(),
  bio: Type.Optional(Type.String()),
  birth_date: Type.Optional(Type.String({ format: 'date' })),
  country: Type.Optional(Type.String()),
  active: Type.Optional(Type.Boolean()),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
});

// Create Schema (without auto-generated fields)
export const CreateAuthorsSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  bio: Type.Optional(Type.String()),
  birth_date: Type.Optional(Type.String({ format: 'date' })),
  country: Type.Optional(Type.String()),
  active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateAuthorsSchema = Type.Partial(
  Type.Object({
    name: Type.String(),
    email: Type.String(),
    bio: Type.Optional(Type.String()),
    birth_date: Type.Optional(Type.String({ format: 'date' })),
    country: Type.Optional(Type.String()),
    active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const AuthorsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetAuthorsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListAuthorsQuerySchema = Type.Object({
  // Pagination parameters
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 1000, default: 20 })),
  // Modern multiple sort support
  sort: Type.Optional(
    Type.String({
      pattern:
        '^[a-zA-Z_][a-zA-Z0-9_]*(:(asc|desc))?(,[a-zA-Z_][a-zA-Z0-9_]*(:(asc|desc))?)*$',
      description:
        'Multiple sort: field1:desc,field2:asc,field3:desc. Example: id:asc,created_at:desc',
      examples: ['id:asc', 'created_at:desc', 'name:asc,created_at:desc'],
    }),
  ),

  // Search and filtering
  search: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),

  // 🛡️ Secure field selection with validation
  fields: Type.Optional(
    Type.Array(
      Type.String({
        pattern: '^[a-zA-Z_][a-zA-Z0-9_]*$', // Only alphanumeric + underscore
        minLength: 1,
        maxLength: 50,
      }),
      {
        minItems: 1,
        maxItems: 20, // Prevent excessive field requests
        description:
          'Specific fields to return. Example: ["id", "name", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)

  // Smart field-based filters
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  email: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  bio: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  country: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const AuthorsResponseSchema = ApiSuccessResponseSchema(AuthorsSchema);
export const AuthorsListResponseSchema = PaginatedResponseSchema(AuthorsSchema);

// Partial Schemas for field selection support
export const PartialAuthorsSchema = Type.Partial(AuthorsSchema);
export const FlexibleAuthorsListResponseSchema =
  PartialPaginatedResponseSchema(AuthorsSchema);

// Export types
export type Authors = Static<typeof AuthorsSchema>;
export type CreateAuthors = Static<typeof CreateAuthorsSchema>;
export type UpdateAuthors = Static<typeof UpdateAuthorsSchema>;
export type AuthorsIdParam = Static<typeof AuthorsIdParamSchema>;
export type GetAuthorsQuery = Static<typeof GetAuthorsQuerySchema>;
export type ListAuthorsQuery = Static<typeof ListAuthorsQuerySchema>;

// Partial types for field selection
export type PartialAuthors = Static<typeof PartialAuthorsSchema>;
export type FlexibleAuthorsList = Static<
  typeof FlexibleAuthorsListResponseSchema
>;

// ===== BULK IMPORT SCHEMAS =====

// Import Options Schema
export const ImportOptionsSchema = Type.Object({
  skipDuplicates: Type.Optional(Type.Boolean({ default: true })),
  continueOnError: Type.Optional(Type.Boolean({ default: true })),
  updateExisting: Type.Optional(Type.Boolean({ default: false })),
  dryRun: Type.Optional(Type.Boolean({ default: true })),
});

// Import Row Preview Schema
export const ImportRowPreviewSchema = Type.Object({
  rowNumber: Type.Number(),
  status: Type.Union([
    Type.Literal('valid'),
    Type.Literal('warning'),
    Type.Literal('error'),
    Type.Literal('duplicate'),
  ]),
  action: Type.Union([
    Type.Literal('create'),
    Type.Literal('update'),
    Type.Literal('skip'),
  ]),
  data: Type.Any(), // Record<string, any>
  errors: Type.Array(
    Type.Object({
      field: Type.String(),
      message: Type.String(),
      code: Type.String(),
      severity: Type.Union([
        Type.Literal('error'),
        Type.Literal('warning'),
        Type.Literal('info'),
      ]),
    }),
  ),
  warnings: Type.Array(
    Type.Object({
      field: Type.String(),
      message: Type.String(),
      code: Type.Optional(Type.String()),
    }),
  ),
});

// Import Summary Schema
export const ImportSummarySchema = Type.Object({
  toCreate: Type.Number(),
  toUpdate: Type.Number(),
  toSkip: Type.Number(),
  errors: Type.Number(),
  warnings: Type.Number(),
});

// Validate Import Response Schema
export const ValidateImportResponseSchema = Type.Object({
  sessionId: Type.String(),
  filename: Type.String(),
  totalRows: Type.Number(),
  validRows: Type.Number(),
  invalidRows: Type.Number(),
  summary: ImportSummarySchema,
  preview: Type.Array(ImportRowPreviewSchema),
  expiresAt: Type.String({ format: 'date-time' }),
});

// Execute Import Request Schema
export const ExecuteImportRequestSchema = Type.Object({
  sessionId: Type.String(),
  options: Type.Optional(
    Type.Object({
      skipDuplicates: Type.Optional(Type.Boolean()),
      continueOnError: Type.Optional(Type.Boolean()),
      updateExisting: Type.Optional(Type.Boolean()),
    }),
  ),
});

// Import Progress Schema
export const ImportProgressSchema = Type.Object({
  current: Type.Number(),
  total: Type.Number(),
  percentage: Type.Number(),
});

// Import Job Summary Schema
export const ImportJobSummarySchema = Type.Object({
  processed: Type.Number(),
  successful: Type.Number(),
  failed: Type.Number(),
  skipped: Type.Number(),
  created: Type.Optional(Type.Number()),
  updated: Type.Optional(Type.Number()),
});

// Import Error Schema
export const ImportErrorSchema = Type.Object({
  rowNumber: Type.Number(),
  data: Type.Any(),
  error: Type.String(),
  code: Type.Optional(Type.String()),
});

// Import Job Schema
export const ImportJobSchema = Type.Object({
  jobId: Type.String(),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('processing'),
    Type.Literal('completed'),
    Type.Literal('failed'),
    Type.Literal('partial'),
    Type.Literal('cancelled'),
  ]),
  progress: ImportProgressSchema,
  summary: ImportJobSummarySchema,
  errors: Type.Optional(Type.Array(ImportErrorSchema)),
  startedAt: Type.String({ format: 'date-time' }),
  completedAt: Type.Optional(Type.String({ format: 'date-time' })),
  estimatedCompletion: Type.Optional(Type.String({ format: 'date-time' })),
  duration: Type.Optional(Type.Number()),
  errorReportUrl: Type.Optional(Type.String()),
});

// Response Schemas
export const ValidateImportApiResponseSchema = ApiSuccessResponseSchema(
  ValidateImportResponseSchema,
);
export const ExecuteImportApiResponseSchema =
  ApiSuccessResponseSchema(ImportJobSchema);
export const ImportStatusApiResponseSchema =
  ApiSuccessResponseSchema(ImportJobSchema);

// Export Import Types
export type ImportOptions = Static<typeof ImportOptionsSchema>;
export type ImportRowPreview = Static<typeof ImportRowPreviewSchema>;
export type ImportSummary = Static<typeof ImportSummarySchema>;
export type ValidateImportResponse = Static<
  typeof ValidateImportResponseSchema
>;
export type ExecuteImportRequest = Static<typeof ExecuteImportRequestSchema>;
export type ImportProgress = Static<typeof ImportProgressSchema>;
export type ImportJobSummary = Static<typeof ImportJobSummarySchema>;
export type ImportError = Static<typeof ImportErrorSchema>;
export type ImportJob = Static<typeof ImportJobSchema>;
