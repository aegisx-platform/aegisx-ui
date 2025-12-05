import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../schemas/base.schemas';

// Base BudgetTypes Schema
export const BudgetTypesSchema = Type.Object({
  id: Type.Integer(),
  type_code: Type.String(),
  type_name: Type.String(),
  budget_class: Type.Any(),
  description: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetTypesSchema = Type.Object({
  type_code: Type.String(),
  type_name: Type.String(),
  budget_class: Type.Any(),
  description: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetTypesSchema = Type.Partial(
  Type.Object({
    type_code: Type.String(),
    type_name: Type.String(),
    budget_class: Type.Any(),
    description: Type.Optional(Type.String()),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BudgetTypesIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetTypesQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetTypesQuerySchema = Type.Object({
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
      examples: ['id:asc', 'created_at:desc', 'type_code:asc,created_at:desc'],
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
          'Specific fields to return. Example: ["id", "type_code", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)

  // Smart field-based filters
  type_code: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  type_name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetTypesResponseSchema =
  ApiSuccessResponseSchema(BudgetTypesSchema);
export const BudgetTypesListResponseSchema =
  PaginatedResponseSchema(BudgetTypesSchema);

// Partial Schemas for field selection support
export const PartialBudgetTypesSchema = Type.Partial(BudgetTypesSchema);
export const FlexibleBudgetTypesListResponseSchema =
  PartialPaginatedResponseSchema(BudgetTypesSchema);

// Export types
export type BudgetTypes = Static<typeof BudgetTypesSchema>;
export type CreateBudgetTypes = Static<typeof CreateBudgetTypesSchema>;
export type UpdateBudgetTypes = Static<typeof UpdateBudgetTypesSchema>;
export type BudgetTypesIdParam = Static<typeof BudgetTypesIdParamSchema>;
export type GetBudgetTypesQuery = Static<typeof GetBudgetTypesQuerySchema>;
export type ListBudgetTypesQuery = Static<typeof ListBudgetTypesQuerySchema>;

// Partial types for field selection
export type PartialBudgetTypes = Static<typeof PartialBudgetTypesSchema>;
export type FlexibleBudgetTypesList = Static<
  typeof FlexibleBudgetTypesListResponseSchema
>;
