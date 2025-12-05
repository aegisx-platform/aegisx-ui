import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../schemas/base.schemas';

// Base BudgetPlans Schema
export const BudgetPlansSchema = Type.Object({
  id: Type.Number(),
  fiscal_year: Type.Integer(),
  department_id: Type.Integer(),
  plan_name: Type.Optional(Type.String()),
  total_planned_amount: Type.Optional(Type.Number()),
  status: Type.Any(),
  approved_at: Type.Optional(Type.String({ format: 'date-time' })),
  approved_by: Type.Optional(Type.String({ format: 'uuid' })),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetPlansSchema = Type.Object({
  fiscal_year: Type.Integer(),
  department_id: Type.Integer(),
  plan_name: Type.Optional(Type.String()),
  total_planned_amount: Type.Optional(Type.Number()),
  status: Type.Any(),
  approved_at: Type.Optional(Type.String({ format: 'date-time' })),
  approved_by: Type.Optional(Type.String({ format: 'uuid' })),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetPlansSchema = Type.Partial(
  Type.Object({
    fiscal_year: Type.Integer(),
    department_id: Type.Integer(),
    plan_name: Type.Optional(Type.String()),
    total_planned_amount: Type.Optional(Type.Number()),
    status: Type.Any(),
    approved_at: Type.Optional(Type.String({ format: 'date-time' })),
    approved_by: Type.Optional(Type.String({ format: 'uuid' })),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BudgetPlansIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetPlansQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetPlansQuerySchema = Type.Object({
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
        'fiscal_year:asc,created_at:desc',
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
          'Specific fields to return. Example: ["id", "fiscal_year", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  fiscal_year: Type.Optional(Type.Number({ minimum: 0 })),
  fiscal_year_min: Type.Optional(Type.Number({ minimum: 0 })),
  fiscal_year_max: Type.Optional(Type.Number({ minimum: 0 })),
  department_id: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  plan_name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  total_planned_amount: Type.Optional(Type.Number({})),
  total_planned_amount_min: Type.Optional(Type.Number({})),
  total_planned_amount_max: Type.Optional(Type.Number({})),
  approved_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetPlansResponseSchema =
  ApiSuccessResponseSchema(BudgetPlansSchema);
export const BudgetPlansListResponseSchema =
  PaginatedResponseSchema(BudgetPlansSchema);

// Partial Schemas for field selection support
export const PartialBudgetPlansSchema = Type.Partial(BudgetPlansSchema);
export const FlexibleBudgetPlansListResponseSchema =
  PartialPaginatedResponseSchema(BudgetPlansSchema);

// Export types
export type BudgetPlans = Static<typeof BudgetPlansSchema>;
export type CreateBudgetPlans = Static<typeof CreateBudgetPlansSchema>;
export type UpdateBudgetPlans = Static<typeof UpdateBudgetPlansSchema>;
export type BudgetPlansIdParam = Static<typeof BudgetPlansIdParamSchema>;
export type GetBudgetPlansQuery = Static<typeof GetBudgetPlansQuerySchema>;
export type ListBudgetPlansQuery = Static<typeof ListBudgetPlansQuerySchema>;

// Partial types for field selection
export type PartialBudgetPlans = Static<typeof PartialBudgetPlansSchema>;
export type FlexibleBudgetPlansList = Static<
  typeof FlexibleBudgetPlansListResponseSchema
>;
