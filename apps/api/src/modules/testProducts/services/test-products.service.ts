import { BaseService } from '../../../shared/services/base.service';
import { TestProductsRepository } from '../repositories/test-products.repository';
import {
  type TestProducts,
  type CreateTestProducts,
  type UpdateTestProducts,
  type GetTestProductsQuery,
  type ListTestProductsQuery,
  TestProductsErrorCode,
  TestProductsErrorMessages,
} from '../types/test-products.types';

/**
 * TestProducts Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class TestProductsService extends BaseService<
  TestProducts,
  CreateTestProducts,
  UpdateTestProducts
> {
  constructor(private testProductsRepository: TestProductsRepository) {
    super(testProductsRepository);
  }

  /**
   * Get testProducts by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetTestProductsQuery = {},
  ): Promise<TestProducts | null> {
    const testProducts = await this.getById(id);

    if (testProducts) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return testProducts;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListTestProductsQuery = {}): Promise<{
    data: TestProducts[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const result = await this.getList(options);

    return result;
  }

  /**
   * Create new testProducts
   */
  async create(data: CreateTestProducts): Promise<TestProducts> {
    const testProducts = await super.create(data);

    return testProducts;
  }

  /**
   * Update existing testProducts
   */
  async update(
    id: string | number,
    data: UpdateTestProducts,
  ): Promise<TestProducts | null> {
    const testProducts = await super.update(id, data);

    return testProducts;
  }

  /**
   * Delete testProducts
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete testProducts with ID:', id);

      // Check if testProducts exists first
      const existing = await this.testProductsRepository.findById(id);
      if (!existing) {
        console.log('TestProducts not found for deletion:', id);
        return false;
      }

      console.log('Found testProducts to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.testProductsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('TestProducts deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting testProducts:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating testProducts
   */
  protected async validateCreate(data: CreateTestProducts): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // Check for duplicate sku
    if (data.sku) {
      const existing = await this.testProductsRepository.findBySku(data.sku);
      if (existing) {
        const error = new Error(
          TestProductsErrorMessages[TestProductsErrorCode.DUPLICATE_SKU],
        ) as any;
        error.statusCode = 409;
        error.code = TestProductsErrorCode.DUPLICATE_SKU;
        throw error;
      }
    }

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: quantity must be positive
    if (data.quantity !== undefined && data.quantity !== null) {
      if (Number(data.quantity) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_QUANTITY
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_QUANTITY;
        throw error;
      }
    }

    // Business rule: min_quantity must be positive
    if (data.min_quantity !== undefined && data.min_quantity !== null) {
      if (Number(data.min_quantity) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_MIN_QUANTITY
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_MIN_QUANTITY;
        throw error;
      }
    }

    // Business rule: max_quantity must be positive
    if (data.max_quantity !== undefined && data.max_quantity !== null) {
      if (Number(data.max_quantity) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_MAX_QUANTITY
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_MAX_QUANTITY;
        throw error;
      }
    }

    // Business rule: price must be positive
    if (data.price !== undefined && data.price !== null) {
      if (Number(data.price) < 0) {
        const error = new Error(
          TestProductsErrorMessages[TestProductsErrorCode.INVALID_VALUE_PRICE],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_PRICE;
        throw error;
      }
    }

    // Business rule: cost must be positive
    if (data.cost !== undefined && data.cost !== null) {
      if (Number(data.cost) < 0) {
        const error = new Error(
          TestProductsErrorMessages[TestProductsErrorCode.INVALID_VALUE_COST],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_COST;
        throw error;
      }
    }

    // Business rule: discount_percentage must be positive
    if (
      data.discount_percentage !== undefined &&
      data.discount_percentage !== null
    ) {
      if (Number(data.discount_percentage) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_DISCOUNT_PERCENTAGE
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_DISCOUNT_PERCENTAGE;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateTestProducts,
  ): Promise<CreateTestProducts> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after testProducts creation
   */
  protected async afterCreate(
    testProducts: TestProducts,
    _originalData: CreateTestProducts,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'TestProducts created:',
      JSON.stringify(testProducts),
      '(ID: ' + testProducts.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: TestProducts,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    if (existing.status === 'active&#x27;') {
      throw new Error('Cannot delete active&#x27; ');
    }

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.testProductsRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete testProducts - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options for UI components
   */
  async getDropdownOptions(options: any = {}): Promise<{
    options: Array<{
      value: string | number;
      label: string;
      disabled?: boolean;
    }>;
    total: number;
  }> {
    const {
      limit = 100,
      search,
      labelField = 'sku',
      valueField = 'id',
    } = options;

    const result = await this.testProductsRepository.list({
      limit,
      search,
      sort: `${labelField}:asc`,
    });

    const dropdownOptions = result.data.map((item) => ({
      value: item[valueField],
      label: item[labelField] || `${item.id}`,
      disabled: item.is_active === false,
    }));

    return {
      options: dropdownOptions,
      total: result.pagination.total,
    };
  }

  /**
   * Bulk create multiple testProductss
   */
  async bulkCreate(data: { items: CreateTestProducts[] }): Promise<{
    created: TestProducts[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: TestProducts[] = [];
    const errors: any[] = [];

    // Validate and process all items first
    const validItems: CreateTestProducts[] = [];
    for (const item of data.items) {
      try {
        await this.validateCreate(item);
        const processed = await this.beforeCreate(item);
        validItems.push(processed);
      } catch (error) {
        errors.push({
          item,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Bulk create valid items
    if (validItems.length > 0) {
      try {
        // Use individual creates instead of createMany for debugging
        for (const item of validItems) {
          const created = await this.testProductsRepository.create(item);
          results.push(created);
        }

        // Call afterCreate for each created item
        for (let i = 0; i < results.length; i++) {
          try {
            await this.afterCreate(results[i], validItems[i]);
          } catch (error) {
            console.warn('Error in afterCreate:', error);
          }
        }
      } catch (error) {
        errors.push({
          item: 'bulk_operation',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      created: results,
      summary: {
        successful: results.length,
        failed: errors.length,
        errors,
      },
    };
  }

  /**
   * Bulk update multiple testProductss
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateTestProducts }>;
  }): Promise<{
    updated: TestProducts[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: TestProducts[] = [];
    const errors: any[] = [];

    for (const item of data.items) {
      try {
        const updated = await this.update(item.id, item.data);
        if (updated) {
          results.push(updated);
        }
      } catch (error) {
        errors.push({
          item,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      updated: results,
      summary: {
        successful: results.length,
        failed: errors.length,
        errors,
      },
    };
  }

  /**
   * Bulk delete multiple testProductss
   */
  async bulkDelete(data: { ids: Array<string | number> }): Promise<{
    deleted: Array<string | number>;
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Array<string | number> = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const deleted = await this.delete(id);
        if (deleted) {
          results.push(id);
        }
      } catch (error) {
        errors.push({
          id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      deleted: results,
      summary: {
        successful: results.length,
        failed: errors.length,
        errors,
      },
    };
  }

  /**
   * Bulk update status for multiple testProductss
   */
  async bulkUpdateStatus(data: {
    ids: Array<string | number>;
    status: boolean;
  }): Promise<{
    updated: TestProducts[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: TestProducts[] = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const updated = await this.update(id, {
          is_active: data.status,
        } as UpdateTestProducts);
        if (updated) {
          results.push(updated);
        }
      } catch (error) {
        errors.push({
          id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      updated: results,
      summary: {
        successful: results.length,
        failed: errors.length,
        errors,
      },
    };
  }

  /**
   * Activate testProducts
   */
  async activate(
    id: string | number,
    options: any = {},
  ): Promise<TestProducts | null> {
    return this.update(id, { is_active: true } as UpdateTestProducts);
  }

  /**
   * Deactivate testProducts
   */
  async deactivate(
    id: string | number,
    options: any = {},
  ): Promise<TestProducts | null> {
    return this.update(id, { is_active: false } as UpdateTestProducts);
  }

  /**
   * Toggle testProducts status
   */
  async toggle(
    id: string | number,
    options: any = {},
  ): Promise<TestProducts | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = !current.is_active;
    return this.update(id, { is_active: newStatus } as UpdateTestProducts);
  }

  /**
   * Get basic statistics (count only)
   */
  async getStats(): Promise<{
    total: number;
  }> {
    return this.testProductsRepository.getStats();
  }

  /**
   * Get data for export with formatting
   */
  async getExportData(
    queryParams: any = {},
    fields?: string[],
  ): Promise<any[]> {
    // Get specific IDs if provided
    if (queryParams.ids && queryParams.ids.length > 0) {
      // Get specific records by IDs
      const records = await Promise.all(
        queryParams.ids.map((id: string) => this.getById(id)),
      );

      // Return raw data - ExportService will handle formatting
      return records.filter((record) => record !== null);
    }

    // Separate filters from pagination parameters to avoid SQL errors
    const { limit, offset, page, ...filters } = queryParams;

    // Build query parameters for data retrieval with proper pagination
    const query: any = {
      ...filters, // Only include actual filter parameters
      limit: limit || 50000, // Max export limit for performance
      page: 1, // Always start from first page for exports
    };

    // Get filtered data
    const result = await this.testProductsRepository.list(query);

    // Return raw data - ExportService will handle formatting
    return result.data;
  }

  /**
   * Format single record for export
   */
  private formatExportRecord(record: TestProducts, fields?: string[]): any {
    const formatted: any = {};

    // Define all exportable fields
    const exportableFields: { [key: string]: string | ((value: any) => any) } =
      {
        id: 'Id',
        sku: 'Sku',
        name: 'Name',
        barcode: 'Barcode',
        manufacturer: 'Manufacturer',
        description: 'Description',
        long_description: 'Long description',
        specifications: 'Specifications',
        quantity: 'Quantity',
        min_quantity: 'Min quantity',
        max_quantity: 'Max quantity',
        price: 'Price',
        cost: 'Cost',
        weight: 'Weight',
        discount_percentage: 'Discount percentage',
        is_active: 'Is active',
        is_featured: 'Is featured',
        is_taxable: 'Is taxable',
        is_shippable: 'Is shippable',
        allow_backorder: 'Allow backorder',
        status: 'Status',
        condition: 'Condition',
        availability: 'Availability',
        launch_date: 'Launch date',
        discontinued_date: 'Discontinued date',
        last_stock_check: 'Last stock check',
        next_restock_date: 'Next restock date',
        attributes: 'Attributes',
        tags: 'Tags',
        images: 'Images',
        pricing_tiers: 'Pricing tiers',
        dimensions: 'Dimensions',
        seo_metadata: 'Seo metadata',
        category_id: 'Category id',
        parent_product_id: 'Parent product id',
        supplier_id: 'Supplier id',
        created_by: 'Created by',
        updated_by: 'Updated by',
        deleted_at: 'Deleted at',
        created_at: 'Created at',
        updated_at: 'Updated at',
      };

    // If specific fields requested, use only those
    const fieldsToExport =
      fields && fields.length > 0
        ? fields.filter((field) =>
            Object.prototype.hasOwnProperty.call(exportableFields, field),
          )
        : Object.keys(exportableFields);

    // Format each field
    fieldsToExport.forEach((field) => {
      const fieldConfig = exportableFields[field];
      let value = (record as any)[field];

      // Apply field-specific formatting
      if (typeof fieldConfig === 'function') {
        value = fieldConfig(value);
      } else {
        // Apply default formatting based on field type
      }

      // Use field label as key for export
      const exportKey = typeof fieldConfig === 'string' ? fieldConfig : field;
      formatted[exportKey] = value;
    });

    return formatted;
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   */
  async validate(data: { data: CreateTestProducts }): Promise<{
    valid: boolean;
    errors: Array<{ field: string; message: string }>;
  }> {
    const errors: Array<{ field: string; message: string }> = [];

    try {
      await this.validateCreate(data.data);
    } catch (error) {
      errors.push({
        field: 'general',
        message: error instanceof Error ? error.message : String(error),
      });
    }

    // Add specific field validations

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check field uniqueness
   */
  async checkUniqueness(
    field: string,
    options: { value: string; excludeId?: string | number },
  ): Promise<{
    unique: boolean;
    exists?: any;
  }> {
    const query: any = { [field]: options.value };

    // Add exclusion for updates
    if (options.excludeId) {
      query.excludeId = options.excludeId;
    }

    // Use field-specific find methods based on repository's isDisplayField logic
    let existing: any = null;

    if (field === 'name' && options.value) {
      existing = await this.testProductsRepository.findByName(options.value);
    } else if (
      existing &&
      options.excludeId &&
      existing.id === options.excludeId
    ) {
      // If updating (excludeId provided), ignore the current record
      existing = null;
    }

    return {
      unique: !existing,
      exists: existing || undefined,
    };
  }
}
