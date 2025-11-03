import { Type, Static } from '@sinclair/typebox';
import {
  UuidParamSchema,
  PaginationQuerySchema,
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
  PartialPaginatedResponseSchema,
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

// Base TestProducts Schema
export const TestProductsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  sku: Type.String(),
  name: Type.String(),
  barcode: Type.Optional(Type.String()),
  manufacturer: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  long_description: Type.Optional(Type.String()),
  specifications: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Integer()),
  min_quantity: Type.Optional(Type.Integer()),
  max_quantity: Type.Optional(Type.Integer()),
  price: Type.Number(),
  cost: Type.Optional(Type.Number()),
  weight: Type.Optional(Type.Number()),
  discount_percentage: Type.Optional(Type.Number()),
  is_active: Type.Optional(Type.Boolean()),
  is_featured: Type.Optional(Type.Boolean()),
  is_taxable: Type.Optional(Type.Boolean()),
  is_shippable: Type.Optional(Type.Boolean()),
  allow_backorder: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.String()),
  condition: Type.Optional(Type.String()),
  availability: Type.Optional(Type.String()),
  launch_date: Type.Optional(Type.String({ format: 'date' })),
  discontinued_date: Type.Optional(Type.String({ format: 'date' })),
  last_stock_check: Type.Optional(Type.String({ format: 'date-time' })),
  next_restock_date: Type.Optional(Type.String({ format: 'date-time' })),
  attributes: Type.Optional(Type.Record(Type.String(), Type.Any())),
  tags: Type.Optional(Type.Record(Type.String(), Type.Any())),
  images: Type.Optional(Type.Record(Type.String(), Type.Any())),
  pricing_tiers: Type.Optional(Type.Record(Type.String(), Type.Any())),
  dimensions: Type.Optional(Type.Record(Type.String(), Type.Any())),
  seo_metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
  category_id: Type.String({ format: 'uuid' }),
  parent_product_id: Type.Optional(Type.String({ format: 'uuid' })),
  supplier_id: Type.Optional(Type.String({ format: 'uuid' })),
  created_by: Type.Optional(Type.String({ format: 'uuid' })),
  updated_by: Type.Optional(Type.String({ format: 'uuid' })),
  deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' }),
});

// Create Schema (without auto-generated fields)
export const CreateTestProductsSchema = Type.Object({
  sku: Type.String(),
  name: Type.String(),
  barcode: Type.Optional(Type.String()),
  manufacturer: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  long_description: Type.Optional(Type.String()),
  specifications: Type.Optional(Type.String()),
  quantity: Type.Optional(Type.Integer()),
  min_quantity: Type.Optional(Type.Integer()),
  max_quantity: Type.Optional(Type.Integer()),
  price: Type.Number(),
  cost: Type.Optional(Type.Number()),
  weight: Type.Optional(Type.Number()),
  discount_percentage: Type.Optional(Type.Number()),
  is_active: Type.Optional(Type.Boolean()),
  is_featured: Type.Optional(Type.Boolean()),
  is_taxable: Type.Optional(Type.Boolean()),
  is_shippable: Type.Optional(Type.Boolean()),
  allow_backorder: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.String()),
  condition: Type.Optional(Type.String()),
  availability: Type.Optional(Type.String()),
  launch_date: Type.Optional(Type.String({ format: 'date' })),
  discontinued_date: Type.Optional(Type.String({ format: 'date' })),
  last_stock_check: Type.Optional(Type.String({ format: 'date-time' })),
  next_restock_date: Type.Optional(Type.String({ format: 'date-time' })),
  attributes: Type.Optional(Type.Record(Type.String(), Type.Any())),
  tags: Type.Optional(Type.Record(Type.String(), Type.Any())),
  images: Type.Optional(Type.Record(Type.String(), Type.Any())),
  pricing_tiers: Type.Optional(Type.Record(Type.String(), Type.Any())),
  dimensions: Type.Optional(Type.Record(Type.String(), Type.Any())),
  seo_metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
  category_id: Type.String({ format: 'uuid' }),
  parent_product_id: Type.Optional(Type.String({ format: 'uuid' })),
  supplier_id: Type.Optional(Type.String({ format: 'uuid' })),
  deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
  // created_by is auto-filled from JWT token
  created_by: Type.Optional(
    Type.String({
      format: 'uuid',
      description: 'User who created this record (auto-filled from JWT)',
    }),
  ),
});

// Update Schema (partial, without auto-generated fields)
export const UpdateTestProductsSchema = Type.Partial(
  Type.Object({
    sku: Type.String(),
    name: Type.String(),
    barcode: Type.Optional(Type.String()),
    manufacturer: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    long_description: Type.Optional(Type.String()),
    specifications: Type.Optional(Type.String()),
    quantity: Type.Optional(Type.Integer()),
    min_quantity: Type.Optional(Type.Integer()),
    max_quantity: Type.Optional(Type.Integer()),
    price: Type.Number(),
    cost: Type.Optional(Type.Number()),
    weight: Type.Optional(Type.Number()),
    discount_percentage: Type.Optional(Type.Number()),
    is_active: Type.Optional(Type.Boolean()),
    is_featured: Type.Optional(Type.Boolean()),
    is_taxable: Type.Optional(Type.Boolean()),
    is_shippable: Type.Optional(Type.Boolean()),
    allow_backorder: Type.Optional(Type.Boolean()),
    status: Type.Optional(Type.String()),
    condition: Type.Optional(Type.String()),
    availability: Type.Optional(Type.String()),
    launch_date: Type.Optional(Type.String({ format: 'date' })),
    discontinued_date: Type.Optional(Type.String({ format: 'date' })),
    last_stock_check: Type.Optional(Type.String({ format: 'date-time' })),
    next_restock_date: Type.Optional(Type.String({ format: 'date-time' })),
    attributes: Type.Optional(Type.Record(Type.String(), Type.Any())),
    tags: Type.Optional(Type.Record(Type.String(), Type.Any())),
    images: Type.Optional(Type.Record(Type.String(), Type.Any())),
    pricing_tiers: Type.Optional(Type.Record(Type.String(), Type.Any())),
    dimensions: Type.Optional(Type.Record(Type.String(), Type.Any())),
    seo_metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
    category_id: Type.String({ format: 'uuid' }),
    parent_product_id: Type.Optional(Type.String({ format: 'uuid' })),
    supplier_id: Type.Optional(Type.String({ format: 'uuid' })),
    deleted_at: Type.Optional(Type.String({ format: 'date-time' })),
    // updated_by is auto-filled from JWT token
    updated_by: Type.String({
      format: 'uuid',
      description: 'User who updated this record (auto-filled from JWT)',
    }),
  }),
);

// ID Parameter Schema
export const TestProductsIdParamSchema = Type.Object({
  id: Type.Union([Type.String(), Type.Number()]),
});

// Query Schemas
export const GetTestProductsQuerySchema = Type.Object({
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),
});

export const ListTestProductsQuerySchema = Type.Object({
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
      examples: ['id:asc', 'created_at:desc', 'sku:asc,created_at:desc'],
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
          'Specific fields to return. Example: ["id", "sku", "created_at"]. Field access is role-based for security.',
      },
    ),
  ),

  // Include related data (only if table has foreign keys)
  include: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())]),
  ),

  // Smart field-based filters
  sku: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  barcode: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  manufacturer: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  long_description: Type.Optional(
    Type.String({ minLength: 1, maxLength: 100 }),
  ),
  specifications: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  quantity: Type.Optional(Type.Number({})),
  quantity_min: Type.Optional(Type.Number({})),
  quantity_max: Type.Optional(Type.Number({})),
  min_quantity: Type.Optional(Type.Number({})),
  min_quantity_min: Type.Optional(Type.Number({})),
  min_quantity_max: Type.Optional(Type.Number({})),
  max_quantity: Type.Optional(Type.Number({})),
  max_quantity_min: Type.Optional(Type.Number({})),
  max_quantity_max: Type.Optional(Type.Number({})),
  price: Type.Optional(Type.Number({})),
  price_min: Type.Optional(Type.Number({})),
  price_max: Type.Optional(Type.Number({})),
  cost: Type.Optional(Type.Number({})),
  cost_min: Type.Optional(Type.Number({})),
  cost_max: Type.Optional(Type.Number({})),
  weight: Type.Optional(Type.Number({})),
  weight_min: Type.Optional(Type.Number({})),
  weight_max: Type.Optional(Type.Number({})),
  discount_percentage: Type.Optional(Type.Number({})),
  discount_percentage_min: Type.Optional(Type.Number({})),
  discount_percentage_max: Type.Optional(Type.Number({})),
  is_active: Type.Optional(Type.Boolean()),
  is_featured: Type.Optional(Type.Boolean()),
  is_taxable: Type.Optional(Type.Boolean()),
  is_shippable: Type.Optional(Type.Boolean()),
  allow_backorder: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  condition: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  availability: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  category_id: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  parent_product_id: Type.Optional(
    Type.String({ minLength: 1, maxLength: 50 }),
  ),
  supplier_id: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  created_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
  updated_by: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
});

// Response Schemas using base wrappers
export const TestProductsResponseSchema =
  ApiSuccessResponseSchema(TestProductsSchema);
export const TestProductsListResponseSchema =
  PaginatedResponseSchema(TestProductsSchema);

// Partial Schemas for field selection support
export const PartialTestProductsSchema = Type.Partial(TestProductsSchema);
export const FlexibleTestProductsListResponseSchema =
  PartialPaginatedResponseSchema(TestProductsSchema);

// Export types
export type TestProducts = Static<typeof TestProductsSchema>;
export type CreateTestProducts = Static<typeof CreateTestProductsSchema>;
export type UpdateTestProducts = Static<typeof UpdateTestProductsSchema>;
export type TestProductsIdParam = Static<typeof TestProductsIdParamSchema>;
export type GetTestProductsQuery = Static<typeof GetTestProductsQuerySchema>;
export type ListTestProductsQuery = Static<typeof ListTestProductsQuerySchema>;

// Partial types for field selection
export type PartialTestProducts = Static<typeof PartialTestProductsSchema>;
export type FlexibleTestProductsList = Static<
  typeof FlexibleTestProductsListResponseSchema
>;
