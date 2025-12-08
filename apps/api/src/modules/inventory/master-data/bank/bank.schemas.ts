import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
} from '../../../../schemas/base.schemas';

// Base Bank Schema
export const BankSchema = Type.Object({
  id: Type.Integer(),
  bank_code: Type.String(),
  bank_name: Type.String(),
  swift_code: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
  created_at: Type.Optional(Type.String({ format: 'date-time' })),
  updated_at: Type.Optional(Type.String({ format: 'date-time' })),
});

// Create Schema (without auto-generated fields)
export const CreateBankSchema = Type.Object({
  bank_code: Type.String(),
  bank_name: Type.String(),
  swift_code: Type.Optional(Type.String()),
  is_active: Type.Optional(Type.Boolean()),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateBankSchema = Type.Partial(
  Type.Object({
    bank_code: Type.String(),
    bank_name: Type.String(),
    swift_code: Type.Optional(Type.String()),
    is_active: Type.Optional(Type.Boolean()),
  }),
);

// ID Parameter Schema
export const BankIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetBankQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListBankQuerySchema = Type.Object({
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
      examples: ['id:asc', 'created_at:desc', 'bank_code:asc,created_at:desc'],
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
          'Specific fields to return. Example: ["id", "bank_code", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)

  // Smart field-based filters
  bank_code: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  bank_name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  swift_code: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  is_active: Type.Optional(Type.Boolean()),
});

// Response Schemas using base wrappers
export const BankResponseSchema = ApiSuccessResponseSchema(BankSchema);
export const BankListResponseSchema = PaginatedResponseSchema(BankSchema);

// Partial Schemas for field selection support
export const PartialBankSchema = Type.Partial(BankSchema);
export const FlexibleBankListResponseSchema =
  PartialPaginatedResponseSchema(BankSchema);

// Export types
export type Bank = Static<typeof BankSchema>;
export type CreateBank = Static<typeof CreateBankSchema>;
export type UpdateBank = Static<typeof UpdateBankSchema>;
export type BankIdParam = Static<typeof BankIdParamSchema>;
export type GetBankQuery = Static<typeof GetBankQuerySchema>;
export type ListBankQuery = Static<typeof ListBankQuerySchema>;

// Partial types for field selection
export type PartialBank = Static<typeof PartialBankSchema>;
export type FlexibleBankList = Static<typeof FlexibleBankListResponseSchema>;
