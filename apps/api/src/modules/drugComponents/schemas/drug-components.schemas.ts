import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../schemas/base.schemas';

// Base DrugComponents Schema
export const DrugComponentsSchema = Type.Object({
  id: Type.Integer(),
  generic_id: Type.Integer(),
  component_name: Type.String(),
  strength: Type.Optional(Type.String()),
  strength_value: Type.Optional(Type.Number()),
  strength_unit: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateDrugComponentsSchema = Type.Object({
  generic_id: Type.Integer(),
  component_name: Type.String(),
  strength: Type.Optional(Type.String()),
  strength_value: Type.Optional(Type.Number()),
  strength_unit: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateDrugComponentsSchema = Type.Partial(
  Type.Object({
    generic_id: Type.Integer(),
    component_name: Type.String(),
    strength: Type.Optional(Type.String()),
    strength_value: Type.Optional(Type.Number()),
    strength_unit: Type.Optional(Type.String()),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const DrugComponentsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetDrugComponentsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListDrugComponentsQuerySchema = Type.Object({
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
      examples: ['id:asc', 'created_at:desc', 'generic_id:asc,created_at:desc'],
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
          'Specific fields to return. Example: ["id", "generic_id", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  generic_id: Type.Optional(Type.Number({ minimum: 0 })),
  generic_id_min: Type.Optional(Type.Number({ minimum: 0 })),
  generic_id_max: Type.Optional(Type.Number({ minimum: 0 })),
  component_name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  strength: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  strength_value: Type.Optional(Type.Number({ minimum: 0 })),
  strength_value_min: Type.Optional(Type.Number({ minimum: 0 })),
  strength_value_max: Type.Optional(Type.Number({ minimum: 0 })),
  strength_unit: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const DrugComponentsResponseSchema =
  ApiSuccessResponseSchema(DrugComponentsSchema);
export const DrugComponentsListResponseSchema =
  PaginatedResponseSchema(DrugComponentsSchema);

// Partial Schemas for field selection support
export const PartialDrugComponentsSchema = Type.Partial(DrugComponentsSchema);
export const FlexibleDrugComponentsListResponseSchema =
  PartialPaginatedResponseSchema(DrugComponentsSchema);

// Export types
export type DrugComponents = Static<typeof DrugComponentsSchema>;
export type CreateDrugComponents = Static<typeof CreateDrugComponentsSchema>;
export type UpdateDrugComponents = Static<typeof UpdateDrugComponentsSchema>;
export type DrugComponentsIdParam = Static<typeof DrugComponentsIdParamSchema>;
export type GetDrugComponentsQuery = Static<
  typeof GetDrugComponentsQuerySchema
>;
export type ListDrugComponentsQuery = Static<
  typeof ListDrugComponentsQuerySchema
>;

// Partial types for field selection
export type PartialDrugComponents = Static<typeof PartialDrugComponentsSchema>;
export type FlexibleDrugComponentsList = Static<
  typeof FlexibleDrugComponentsListResponseSchema
>;
