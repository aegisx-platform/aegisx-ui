import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../schemas/base.schemas';

// Base BudgetReservations Schema
export const BudgetReservationsSchema = Type.Object({
  id: Type.Number(),
  allocation_id: Type.Number(),
  pr_id: Type.Number(),
  reserved_amount: Type.Number(),
  quarter: Type.Integer(),
  reservation_date: Type.Optional(Type.String({ format: 'date-time' })),
  expires_date: Type.String({ format: 'date-time' }),
  is_released: Type.Optional(Type.Boolean()),
  released_at: Type.Optional(Type.String({ format: 'date-time' })),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBudgetReservationsSchema = Type.Object({
  allocation_id: Type.Number(),
  pr_id: Type.Number(),
  reserved_amount: Type.Number(),
  quarter: Type.Integer(),
  reservation_date: Type.Optional(Type.String({ format: 'date-time' })),
  expires_date: Type.String({ format: 'date-time' }),
  is_released: Type.Optional(Type.Boolean()),
  released_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBudgetReservationsSchema = Type.Partial(
  Type.Object({
    allocation_id: Type.Number(),
    pr_id: Type.Number(),
    reserved_amount: Type.Number(),
    quarter: Type.Integer(),
    reservation_date: Type.Optional(Type.String({ format: 'date-time' })),
    expires_date: Type.String({ format: 'date-time' }),
    is_released: Type.Optional(Type.Boolean()),
    released_at: Type.Optional(Type.String({ format: 'date-time' })),
  }),
);

// ID Parameter Schema
export const BudgetReservationsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBudgetReservationsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBudgetReservationsQuerySchema = Type.Object({
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
        'allocation_id:asc,created_at:desc',
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
          'Specific fields to return. Example: ["id", "allocation_id", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  allocation_id: Type.Optional(Type.Number({ minimum: 0 })),
  allocation_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  allocation_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  pr_id: Type.Optional(Type.Number({ minimum: 0 })),
  pr_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  pr_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  reserved_amount: Type.Optional(Type.Number({})),
  reserved_amount_min: Type.Optional(Type.Number({})),
  reserved_amount_max: Type.Optional(Type.Number({})),
  quarter: Type.Optional(Type.Number({ minimum: 0 })),
  quarter_min: Type.Optional(Type.Number({ minimum: 0 })),
  quarter_max: Type.Optional(Type.Number({ minimum: 0 })),
  is_released: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BudgetReservationsResponseSchema = ApiSuccessResponseSchema(
  BudgetReservationsSchema,
);
export const BudgetReservationsListResponseSchema = PaginatedResponseSchema(
  BudgetReservationsSchema,
);

// Partial Schemas for field selection support
export const PartialBudgetReservationsSchema = Type.Partial(
  BudgetReservationsSchema,
);
export const FlexibleBudgetReservationsListResponseSchema =
  PartialPaginatedResponseSchema(BudgetReservationsSchema);

// Export types
export type BudgetReservations = Static<typeof BudgetReservationsSchema>;
export type CreateBudgetReservations = Static<
  typeof CreateBudgetReservationsSchema
>;
export type UpdateBudgetReservations = Static<
  typeof UpdateBudgetReservationsSchema
>;
export type BudgetReservationsIdParam = Static<
  typeof BudgetReservationsIdParamSchema
>;
export type GetBudgetReservationsQuery = Static<
  typeof GetBudgetReservationsQuerySchema
>;
export type ListBudgetReservationsQuery = Static<
  typeof ListBudgetReservationsQuerySchema
>;

// Partial types for field selection
export type PartialBudgetReservations = Static<
  typeof PartialBudgetReservationsSchema
>;
export type FlexibleBudgetReservationsList = Static<
  typeof FlexibleBudgetReservationsListResponseSchema
>;
