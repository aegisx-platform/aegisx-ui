import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../../../schemas/base.schemas';

// Base BudgetPlanItems Schema
export const BudgetPlanItemsSchema = Type.Object({
  id: Type.Number(),
  budget_plan_id: Type.Number(),
  generic_id: Type.Integer(),
  last_year_qty: Type.Optional(Type.Number()),
  two_years_ago_qty: Type.Optional(Type.Number()),
  three_years_ago_qty: Type.Optional(Type.Number()),
  planned_quantity: Type.Number(),
  estimated_unit_price: Type.Number(),
  total_planned_value: Type.Number(),
  q1_planned_qty: Type.Optional(Type.Number()),
  q2_planned_qty: Type.Optional(Type.Number()),
  q3_planned_qty: Type.Optional(Type.Number()),
  q4_planned_qty: Type.Optional(Type.Number()),
  q1_purchased_qty: Type.Optional(Type.Number()),
  q2_purchased_qty: Type.Optional(Type.Number()),
  q3_purchased_qty: Type.Optional(Type.Number()),
  q4_purchased_qty: Type.Optional(Type.Number()),
  total_purchased_qty: Type.Optional(Type.Number()),
  total_purchased_value: Type.Optional(Type.Number()),
  notes: Type.Optional(Type.String()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetPlanItemsSchema = Type.Object({
  budget_plan_id: Type.Number(),
  generic_id: Type.Integer(),
  last_year_qty: Type.Optional(Type.Number()),
  two_years_ago_qty: Type.Optional(Type.Number()),
  three_years_ago_qty: Type.Optional(Type.Number()),
  planned_quantity: Type.Number(),
  estimated_unit_price: Type.Number(),
  total_planned_value: Type.Number(),
  q1_planned_qty: Type.Optional(Type.Number()),
  q2_planned_qty: Type.Optional(Type.Number()),
  q3_planned_qty: Type.Optional(Type.Number()),
  q4_planned_qty: Type.Optional(Type.Number()),
  q1_purchased_qty: Type.Optional(Type.Number()),
  q2_purchased_qty: Type.Optional(Type.Number()),
  q3_purchased_qty: Type.Optional(Type.Number()),
  q4_purchased_qty: Type.Optional(Type.Number()),
  total_purchased_qty: Type.Optional(Type.Number()),
  total_purchased_value: Type.Optional(Type.Number()),
  notes: Type.Optional(Type.String()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetPlanItemsSchema = Type.Partial(
  Type.Object({
    budget_plan_id: Type.Number(),
    generic_id: Type.Integer(),
    last_year_qty: Type.Optional(Type.Number()),
    two_years_ago_qty: Type.Optional(Type.Number()),
    three_years_ago_qty: Type.Optional(Type.Number()),
    planned_quantity: Type.Number(),
    estimated_unit_price: Type.Number(),
    total_planned_value: Type.Number(),
    q1_planned_qty: Type.Optional(Type.Number()),
    q2_planned_qty: Type.Optional(Type.Number()),
    q3_planned_qty: Type.Optional(Type.Number()),
    q4_planned_qty: Type.Optional(Type.Number()),
    q1_purchased_qty: Type.Optional(Type.Number()),
    q2_purchased_qty: Type.Optional(Type.Number()),
    q3_purchased_qty: Type.Optional(Type.Number()),
    q4_purchased_qty: Type.Optional(Type.Number()),
    total_purchased_qty: Type.Optional(Type.Number()),
    total_purchased_value: Type.Optional(Type.Number()),
    notes: Type.Optional(Type.String()),
  }),
);

// ID Parameter Schema
export const BudgetPlanItemsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetPlanItemsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetPlanItemsQuerySchema = Type.Object({
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
        'budget_plan_id:asc,created_at:desc',
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
          'Specific fields to return. Example: ["id", "budget_plan_id", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  budget_plan_id: Type.Optional(Type.Number({ minimum: 0 })),
  budget_plan_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  budget_plan_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  generic_id: Type.Optional(Type.Number({ minimum: 0 })),
  generic_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  generic_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  last_year_qty: Type.Optional(Type.Number({ minimum: 0 })),
  last_year_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  last_year_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  two_years_ago_qty: Type.Optional(Type.Number({ minimum: 0 })),
  two_years_ago_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  two_years_ago_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  three_years_ago_qty: Type.Optional(Type.Number({ minimum: 0 })),
  three_years_ago_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  three_years_ago_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  planned_quantity: Type.Optional(Type.Number({})),
  planned_quantity_min: Type.Optional(Type.Number({})),
  planned_quantity_max: Type.Optional(Type.Number({})),
  estimated_unit_price: Type.Optional(Type.Number({})),
  estimated_unit_price_min: Type.Optional(Type.Number({})),
  estimated_unit_price_max: Type.Optional(Type.Number({})),
  total_planned_value: Type.Optional(Type.Number({ minimum: 0 })),
  total_planned_value_min: Type.Optional(Type.Number({ minimum: 0 })),
  total_planned_value_max: Type.Optional(Type.Number({ minimum: 0 })),
  q1_planned_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q1_planned_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q1_planned_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q2_planned_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q2_planned_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q2_planned_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q3_planned_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q3_planned_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q3_planned_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q4_planned_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q4_planned_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q4_planned_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q1_purchased_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q1_purchased_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q1_purchased_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q2_purchased_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q2_purchased_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q2_purchased_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q3_purchased_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q3_purchased_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q3_purchased_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  q4_purchased_qty: Type.Optional(Type.Number({ minimum: 0 })),
  q4_purchased_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  q4_purchased_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_qty: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_qty_min: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_qty_max: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_value: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_value_min: Type.Optional(Type.Number({ minimum: 0 })),
  total_purchased_value_max: Type.Optional(Type.Number({ minimum: 0 })),
  notes: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
});

// Response Schemas using base wrappers
export const BudgetPlanItemsResponseSchema = ApiSuccessResponseSchema(
  BudgetPlanItemsSchema,
);
export const BudgetPlanItemsListResponseSchema = PaginatedResponseSchema(
  BudgetPlanItemsSchema,
);

// Partial Schemas for field selection support
export const PartialBudgetPlanItemsSchema = Type.Partial(BudgetPlanItemsSchema);
export const FlexibleBudgetPlanItemsListResponseSchema =
  PartialPaginatedResponseSchema(BudgetPlanItemsSchema);

// Export types
export type BudgetPlanItems = Static<typeof BudgetPlanItemsSchema>;
export type CreateBudgetPlanItems = Static<typeof CreateBudgetPlanItemsSchema>;
export type UpdateBudgetPlanItems = Static<typeof UpdateBudgetPlanItemsSchema>;
export type BudgetPlanItemsIdParam = Static<
  typeof BudgetPlanItemsIdParamSchema
>;
export type GetBudgetPlanItemsQuery = Static<
  typeof GetBudgetPlanItemsQuerySchema
>;
export type ListBudgetPlanItemsQuery = Static<
  typeof ListBudgetPlanItemsQuerySchema
>;

// Partial types for field selection
export type PartialBudgetPlanItems = Static<
  typeof PartialBudgetPlanItemsSchema
>;
export type FlexibleBudgetPlanItemsList = Static<
  typeof FlexibleBudgetPlanItemsListResponseSchema
>;
