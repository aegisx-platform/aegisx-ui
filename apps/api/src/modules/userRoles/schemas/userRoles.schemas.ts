import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
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

// Base UserRoles Schema
export const UserRolesSchema = Type.Object({
  user_id: Type.String({ format: 'uuid' }),
  role_id: Type.String({ format: 'uuid' }),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
  id: Type.String({ format: 'uuid' }),
  is_active: Type.Optional(Type.Boolean()),
  assigned_at: Type.Optional(Type.String({ format: 'date-time' })),
  assigned_by: Type.Optional(Type.String({ format: 'uuid' })),
  expires_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateUserRolesSchema = Type.Object({
  user_id: Type.String({ format: 'uuid' }),
  role_id: Type.String({ format: 'uuid' }),
  is_active: Type.Optional(Type.Boolean()),
  assigned_at: Type.Optional(Type.String({ format: 'date-time' })),
  assigned_by: Type.Optional(Type.String({ format: 'uuid' })),
  expires_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateUserRolesSchema = Type.Partial(
  Type.Object({
    user_id: Type.String({ format: 'uuid' }),
    role_id: Type.String({ format: 'uuid' }),
    is_active: Type.Optional(Type.Boolean()),
    assigned_at: Type.Optional(Type.String({ format: 'date-time' })),
    assigned_by: Type.Optional(Type.String({ format: 'uuid' })),
    expires_at: Type.Optional(Type.String({ format: 'date-time' })),
  }),
);

// ID Parameter Schema
export const UserRolesIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetUserRolesQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListUserRolesQuerySchema = Type.Object({
  // Pagination parameters
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 1000, default: 20 })),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal('asc'), Type.Literal('desc')], {
      default: 'desc',
    }),
  ),

  // Search and filtering
  search: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  role_id: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  updated_at_min: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at_max: Type.Optional(Type.String({ format: 'date-time' })),
  is_active: Type.Optional(Type.Boolean()),
  assigned_at_min: Type.Optional(Type.String({ format: 'date-time' })),
  assigned_at_max: Type.Optional(Type.String({ format: 'date-time' })),
  expires_at_min: Type.Optional(Type.String({ format: 'date-time' })),
  expires_at_max: Type.Optional(Type.String({ format: 'date-time' })),
});

// Response Schemas using base wrappers
export const UserRolesResponseSchema =
  ApiSuccessResponseSchema(UserRolesSchema);
export const UserRolesListResponseSchema =
  PaginatedResponseSchema(UserRolesSchema);

// Export types
export type UserRoles = Static<typeof UserRolesSchema>;
export type CreateUserRoles = Static<typeof CreateUserRolesSchema>;
export type UpdateUserRoles = Static<typeof UpdateUserRolesSchema>;
export type UserRolesIdParam = Static<typeof UserRolesIdParamSchema>;
export type GetUserRolesQuery = Static<typeof GetUserRolesQuerySchema>;
export type ListUserRolesQuery = Static<typeof ListUserRolesQuerySchema>;
