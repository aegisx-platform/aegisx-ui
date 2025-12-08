import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../../schemas/base.schemas';

// Base BudgetRequests Schema
export const BudgetRequestsSchema = Type.Object({
  id: Type.Number(),
  request_number: Type.String(),
  fiscal_year: Type.Integer(),
  department_id: Type.Integer(),
  status: Type.Any(),
  total_requested_amount: Type.Number(),
  justification: Type.Optional(Type.String()),
  submitted_by: Type.Optional(Type.String({ format: 'uuid' })),
  submitted_at: Type.Optional(Type.String({ format: 'date-time' })),
  dept_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
  dept_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
  dept_comments: Type.Optional(Type.String()),
  finance_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
  finance_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
  finance_comments: Type.Optional(Type.String()),
  rejection_reason: Type.Optional(Type.String()),
  reopened_by: Type.Optional(Type.String({ format: 'uuid' })),
  reopened_at: Type.Optional(Type.String({ format: 'date-time' })),
  created_by: Type.String({ format: 'uuid' }),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
  deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
  is_active: Type.Optional(Type.Boolean()),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetRequestsSchema = Type.Object({
  request_number: Type.String(),
  fiscal_year: Type.Integer(),
  department_id: Type.Integer(),
  status: Type.Any(),
  total_requested_amount: Type.Number(),
  justification: Type.Optional(Type.String()),
  submitted_by: Type.Optional(Type.String({ format: 'uuid' })),
  submitted_at: Type.Optional(Type.String({ format: 'date-time' })),
  dept_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
  dept_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
  dept_comments: Type.Optional(Type.String()),
  finance_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
  finance_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
  finance_comments: Type.Optional(Type.String()),
  rejection_reason: Type.Optional(Type.String()),
  deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
  is_active: Type.Optional(Type.Boolean()),
  // created_by is auto-filled from JWT token
  created_by: Type.Optional(
    Type.String({
      format: 'uuid',
      description: 'User who created this record (auto-filled from JWT)',
    }),
  ),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetRequestsSchema = Type.Partial(
  Type.Object({
    request_number: Type.String(),
    fiscal_year: Type.Integer(),
    department_id: Type.Integer(),
    status: Type.Any(),
    total_requested_amount: Type.Number(),
    justification: Type.Optional(Type.String()),
    submitted_by: Type.Optional(Type.String({ format: 'uuid' })),
    submitted_at: Type.Optional(Type.String({ format: 'date-time' })),
    dept_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
    dept_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
    dept_comments: Type.Optional(Type.String()),
    finance_reviewed_by: Type.Optional(Type.String({ format: 'uuid' })),
    finance_reviewed_at: Type.Optional(Type.String({ format: 'date-time' })),
    finance_comments: Type.Optional(Type.String()),
    rejection_reason: Type.Optional(Type.String()),
    reopened_by: Type.Optional(Type.String({ format: 'uuid' })),
    reopened_at: Type.Optional(Type.String({ format: 'date-time' })),
    deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BudgetRequestsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetRequestsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetRequestsQuerySchema = Type.Object({
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
      examples: [
        'id:asc',
        'created_at:desc',
        'request_number:asc,created_at:desc',
      ],
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
          'Specific fields to return. Example: ["id", "request_number", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  request_number: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  fiscal_year: Type.Optional(Type.Number({ minimum: 0 })),
  fiscal_year_min: Type.Optional(Type.Number({ minimum: 0 })),
  fiscal_year_max: Type.Optional(Type.Number({ minimum: 0 })),
  department_id: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  total_requested_amount: Type.Optional(Type.Number({})),
  total_requested_amount_min: Type.Optional(Type.Number({})),
  total_requested_amount_max: Type.Optional(Type.Number({})),
  justification: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  submitted_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  dept_reviewed_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  dept_comments: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  finance_reviewed_by: Type.Optional(
    Type.String({ minLength: 1, maxLength: 50 }),
  ),
  finance_comments: Type.Optional(
    Type.String({ minLength: 1, maxLength: 100 }),
  ),
  rejection_reason: Type.Optional(
    Type.String({ minLength: 1, maxLength: 255 }),
  ),
  created_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetRequestsResponseSchema =
  ApiSuccessResponseSchema(BudgetRequestsSchema);
export const BudgetRequestsListResponseSchema =
  PaginatedResponseSchema(BudgetRequestsSchema);

// Partial Schemas for field selection support
export const PartialBudgetRequestsSchema = Type.Partial(BudgetRequestsSchema);
export const FlexibleBudgetRequestsListResponseSchema =
  PartialPaginatedResponseSchema(BudgetRequestsSchema);

// Export types
export type BudgetRequests = Static<typeof BudgetRequestsSchema>;
export type CreateBudgetRequests = Static<typeof CreateBudgetRequestsSchema>;
export type UpdateBudgetRequests = Static<typeof UpdateBudgetRequestsSchema>;
export type BudgetRequestsIdParam = Static<typeof BudgetRequestsIdParamSchema>;
export type GetBudgetRequestsQuery = Static<
  typeof GetBudgetRequestsQuerySchema
>;
export type ListBudgetRequestsQuery = Static<
  typeof ListBudgetRequestsQuerySchema
>;

// Partial types for field selection
export type PartialBudgetRequests = Static<typeof PartialBudgetRequestsSchema>;
export type FlexibleBudgetRequestsList = Static<
  typeof FlexibleBudgetRequestsListResponseSchema
>;
