// Import and re-export types from schemas for convenience
import {
  type TestProducts,
  type CreateTestProducts,
  type UpdateTestProducts,
  type TestProductsIdParam,
  type GetTestProductsQuery,
  type ListTestProductsQuery,
} from '../schemas/test-products.schemas';

export {
  type TestProducts,
  type CreateTestProducts,
  type UpdateTestProducts,
  type TestProductsIdParam,
  type GetTestProductsQuery,
  type ListTestProductsQuery,
};

// Additional type definitions
export interface TestProductsRepository {
  create(data: CreateTestProducts): Promise<TestProducts>;
  findById(id: number | string): Promise<TestProducts | null>;
  findMany(query: ListTestProductsQuery): Promise<{
    data: TestProducts[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateTestProducts,
  ): Promise<TestProducts | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface TestProductsEntity {
  id: string;
  sku: string;
  name: string;
  barcode: string | null;
  manufacturer: string | null;
  description: string | null;
  long_description: string | null;
  specifications: string | null;
  quantity: number | null;
  min_quantity: number | null;
  max_quantity: number | null;
  price: number;
  cost: number | null;
  weight: number | null;
  discount_percentage: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  is_taxable: boolean | null;
  is_shippable: boolean | null;
  allow_backorder: boolean | null;
  status: string | null;
  condition: string | null;
  availability: string | null;
  launch_date: Date | null;
  discontinued_date: Date | null;
  last_stock_check: Date | null;
  next_restock_date: Date | null;
  attributes: Record<string, any> | null;
  tags: Record<string, any> | null;
  images: Record<string, any> | null;
  pricing_tiers: Record<string, any> | null;
  dimensions: Record<string, any> | null;
  seo_metadata: Record<string, any> | null;
  category_id: string;
  parent_product_id: string | null;
  supplier_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for TestProducts module
 * Auto-generated based on database constraints and business rules
 */
export enum TestProductsErrorCode {
  // Standard errors
  NOT_FOUND = 'TEST_PRODUCTS_NOT_FOUND',
  VALIDATION_ERROR = 'TEST_PRODUCTS_VALIDATION_ERROR',

  // Duplicate errors (409 Conflict)
  DUPLICATE_SKU = 'TEST_PRODUCTS_DUPLICATE_SKU',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'TEST_PRODUCTS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_TEST_PRODUCTS = 'TEST_PRODUCTS_CANNOT_DELETE_HAS_TEST_PRODUCTS',

  // Business rule validation errors (422)
  INVALID_VALUE_QUANTITY = 'TEST_PRODUCTS_INVALID_VALUE_QUANTITY',
  INVALID_VALUE_MIN_QUANTITY = 'TEST_PRODUCTS_INVALID_VALUE_MIN_QUANTITY',
  INVALID_VALUE_MAX_QUANTITY = 'TEST_PRODUCTS_INVALID_VALUE_MAX_QUANTITY',
  INVALID_VALUE_PRICE = 'TEST_PRODUCTS_INVALID_VALUE_PRICE',
  INVALID_VALUE_COST = 'TEST_PRODUCTS_INVALID_VALUE_COST',
  INVALID_VALUE_DISCOUNT_PERCENTAGE = 'TEST_PRODUCTS_INVALID_VALUE_DISCOUNT_PERCENTAGE',
}

/**
 * Error messages mapped to error codes
 */
export const TestProductsErrorMessages: Record<TestProductsErrorCode, string> =
  {
    [TestProductsErrorCode.NOT_FOUND]: 'TestProducts not found',
    [TestProductsErrorCode.VALIDATION_ERROR]: 'TestProducts validation failed',

    // Duplicate error messages
    [TestProductsErrorCode.DUPLICATE_SKU]: 'Sku already exists',

    // Delete validation messages
    [TestProductsErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
      'Cannot delete testProducts - has related records',
    [TestProductsErrorCode.CANNOT_DELETE_HAS_TEST_PRODUCTS]:
      'Cannot delete testProducts - has test_products references',

    // Business rule messages
    [TestProductsErrorCode.INVALID_VALUE_QUANTITY]:
      'quantity must be a positive number',
    [TestProductsErrorCode.INVALID_VALUE_MIN_QUANTITY]:
      'min_quantity must be a positive number',
    [TestProductsErrorCode.INVALID_VALUE_MAX_QUANTITY]:
      'max_quantity must be a positive number',
    [TestProductsErrorCode.INVALID_VALUE_PRICE]:
      'price must be a positive number',
    [TestProductsErrorCode.INVALID_VALUE_COST]:
      'cost must be a positive number',
    [TestProductsErrorCode.INVALID_VALUE_DISCOUNT_PERCENTAGE]:
      'discount_percentage must be a positive number',
  };
