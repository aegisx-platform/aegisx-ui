import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../../schemas/base.schemas';

// Base BudgetCategories Schema
export const BudgetCategoriesSchema = Type.Object({
  id: Type.Integer(),
  category_code: Type.String(),
  category_name: Type.String(),
  accounting_code: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetCategoriesSchema = Type.Object({
  category_code: Type.String(),
  category_name: Type.String(),
  accounting_code: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetCategoriesSchema = Type.Partial(
  Type.Object({
    category_code: Type.String(),
    category_name: Type.String(),
    accounting_code: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BudgetCategoriesIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetCategoriesQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetCategoriesQuerySchema = Type.Object({
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
        'category_code:asc,created_at:desc',
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
          'Specific fields to return. Example: ["id", "category_code", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)

  // Smart field-based filters
  category_code: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  category_name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  accounting_code: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetCategoriesResponseSchema = ApiSuccessResponseSchema(
  BudgetCategoriesSchema,
);
export const BudgetCategoriesListResponseSchema = PaginatedResponseSchema(
  BudgetCategoriesSchema,
);

// Partial Schemas for field selection support
export const PartialBudgetCategoriesSchema = Type.Partial(
  BudgetCategoriesSchema,
);
export const FlexibleBudgetCategoriesListResponseSchema =
  PartialPaginatedResponseSchema(BudgetCategoriesSchema);

// Export types
export type BudgetCategories = Static<typeof BudgetCategoriesSchema>;
export type CreateBudgetCategories = Static<
  typeof CreateBudgetCategoriesSchema
>;
export type UpdateBudgetCategories = Static<
  typeof UpdateBudgetCategoriesSchema
>;
export type BudgetCategoriesIdParam = Static<
  typeof BudgetCategoriesIdParamSchema
>;
export type GetBudgetCategoriesQuery = Static<
  typeof GetBudgetCategoriesQuerySchema
>;
export type ListBudgetCategoriesQuery = Static<
  typeof ListBudgetCategoriesQuerySchema
>;

// Partial types for field selection
export type PartialBudgetCategories = Static<
  typeof PartialBudgetCategoriesSchema
>;
export type FlexibleBudgetCategoriesList = Static<
  typeof FlexibleBudgetCategoriesListResponseSchema
>;
