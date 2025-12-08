import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../../schemas/base.schemas';

// Base BudgetAllocations Schema
export const BudgetAllocationsSchema = Type.Object({
  id: Type.Number(),
  fiscal_year: Type.Integer(),
  budget_id: Type.Integer(),
  department_id: Type.Integer(),
  total_budget: Type.Number(),
  q1_budget: Type.Number(),
  q2_budget: Type.Number(),
  q3_budget: Type.Number(),
  q4_budget: Type.Number(),
  q1_spent: Type.Number(),
  q2_spent: Type.Number(),
  q3_spent: Type.Number(),
  q4_spent: Type.Number(),
  total_spent: Type.Number(),
  remaining_budget: Type.Number(),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetAllocationsSchema = Type.Object({
  fiscal_year: Type.Integer(),
  budget_id: Type.Integer(),
  department_id: Type.Integer(),
  total_budget: Type.Number(),
  q1_budget: Type.Number(),
  q2_budget: Type.Number(),
  q3_budget: Type.Number(),
  q4_budget: Type.Number(),
  q1_spent: Type.Number(),
  q2_spent: Type.Number(),
  q3_spent: Type.Number(),
  q4_spent: Type.Number(),
  total_spent: Type.Number(),
  remaining_budget: Type.Number(),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetAllocationsSchema = Type.Partial(
  Type.Object({
    fiscal_year: Type.Integer(),
    budget_id: Type.Integer(),
    department_id: Type.Integer(),
    total_budget: Type.Number(),
    q1_budget: Type.Number(),
    q2_budget: Type.Number(),
    q3_budget: Type.Number(),
    q4_budget: Type.Number(),
    q1_spent: Type.Number(),
    q2_spent: Type.Number(),
    q3_spent: Type.Number(),
    q4_spent: Type.Number(),
    total_spent: Type.Number(),
    remaining_budget: Type.Number(),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BudgetAllocationsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetAllocationsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetAllocationsQuerySchema = Type.Object({
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
  budget_id: Type.Optional(Type.Number({ minimum: 0 })),
  budget_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  budget_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  department_id: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  department_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  total_budget: Type.Optional(Type.Number({ minimum: 0 })),
  total_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  total_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  q1_budget: Type.Optional(Type.Number({ minimum: 0 })),
  q1_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  q1_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  q2_budget: Type.Optional(Type.Number({ minimum: 0 })),
  q2_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  q2_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  q3_budget: Type.Optional(Type.Number({ minimum: 0 })),
  q3_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  q3_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  q4_budget: Type.Optional(Type.Number({ minimum: 0 })),
  q4_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  q4_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  q1_spent: Type.Optional(Type.Number({ minimum: 0 })),
  q1_spent_min: Type.Optional(Type.Number({ minimum: 0 })),
  q1_spent_max: Type.Optional(Type.Number({ minimum: 0 })),
  q2_spent: Type.Optional(Type.Number({ minimum: 0 })),
  q2_spent_min: Type.Optional(Type.Number({ minimum: 0 })),
  q2_spent_max: Type.Optional(Type.Number({ minimum: 0 })),
  q3_spent: Type.Optional(Type.Number({ minimum: 0 })),
  q3_spent_min: Type.Optional(Type.Number({ minimum: 0 })),
  q3_spent_max: Type.Optional(Type.Number({ minimum: 0 })),
  q4_spent: Type.Optional(Type.Number({ minimum: 0 })),
  q4_spent_min: Type.Optional(Type.Number({ minimum: 0 })),
  q4_spent_max: Type.Optional(Type.Number({ minimum: 0 })),
  total_spent: Type.Optional(Type.Number({ minimum: 0 })),
  total_spent_min: Type.Optional(Type.Number({ minimum: 0 })),
  total_spent_max: Type.Optional(Type.Number({ minimum: 0 })),
  remaining_budget: Type.Optional(Type.Number({ minimum: 0 })),
  remaining_budget_min: Type.Optional(Type.Number({ minimum: 0 })),
  remaining_budget_max: Type.Optional(Type.Number({ minimum: 0 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetAllocationsResponseSchema = ApiSuccessResponseSchema(
  BudgetAllocationsSchema,
);
export const BudgetAllocationsListResponseSchema = PaginatedResponseSchema(
  BudgetAllocationsSchema,
);

// Partial Schemas for field selection support
export const PartialBudgetAllocationsSchema = Type.Partial(
  BudgetAllocationsSchema,
);
export const FlexibleBudgetAllocationsListResponseSchema =
  PartialPaginatedResponseSchema(BudgetAllocationsSchema);

// Export types
export type BudgetAllocations = Static<typeof BudgetAllocationsSchema>;
export type CreateBudgetAllocations = Static<
  typeof CreateBudgetAllocationsSchema
>;
export type UpdateBudgetAllocations = Static<
  typeof UpdateBudgetAllocationsSchema
>;
export type BudgetAllocationsIdParam = Static<
  typeof BudgetAllocationsIdParamSchema
>;
export type GetBudgetAllocationsQuery = Static<
  typeof GetBudgetAllocationsQuerySchema
>;
export type ListBudgetAllocationsQuery = Static<
  typeof ListBudgetAllocationsQuerySchema
>;

// Partial types for field selection
export type PartialBudgetAllocations = Static<
  typeof PartialBudgetAllocationsSchema
>;
export type FlexibleBudgetAllocationsList = Static<
  typeof FlexibleBudgetAllocationsListResponseSchema
>;
