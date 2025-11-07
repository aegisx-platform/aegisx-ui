import { BaseService } from '../../../shared/services/base.service';
import { TestProductsRepository } from '../repositories/test-products.repository';
import { EventService } from '../../../shared/websocket/event.service';
import { CrudEventHelper } from '../../../shared/websocket/crud-event-helper';
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
  private eventHelper?: CrudEventHelper;

  constructor(
    private testProductsRepository: TestProductsRepository,
    private eventService?: EventService,
  ) {
    super(testProductsRepository);

    // Initialize event helper using Fastify pattern
    if (eventService) {
      this.eventHelper = eventService.for('testProducts', 'testProducts');
    }
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

      // Emit read event for monitoring/analytics
      if (this.eventHelper) {
        await this.eventHelper.emitCustom('read', testProducts);
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

    // Emit bulk read event
    if (this.eventHelper) {
      await this.eventHelper.emitCustom('bulk_read', {
        count: result.data.length,
        filters: options,
      });
    }

    return result;
  }

  /**
   * Create new testProducts
   */
  async create(data: CreateTestProducts): Promise<TestProducts> {
    const testProducts = await super.create(data);

    // Emit created event for real-time updates
    if (this.eventHelper) {
      await this.eventHelper.emitCreated(testProducts);
    }

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

    if (testProducts && this.eventHelper) {
      await this.eventHelper.emitUpdated(testProducts);
    }

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

      // Get entity before deletion for event emission
      const testProducts = await this.getById(id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.testProductsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted && testProducts && this.eventHelper) {
        await this.eventHelper.emitDeleted(testProducts.id);
      }

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

    // Check for duplicate code
    if (data.code) {
      const existing = await this.testProductsRepository.findByCode(data.code);
      if (existing) {
        const error = new Error(
          TestProductsErrorMessages[TestProductsErrorCode.DUPLICATE_CODE],
        ) as any;
        error.statusCode = 409;
        error.code = TestProductsErrorCode.DUPLICATE_CODE;
        throw error;
      }
    }

    // Check for duplicate name
    if (data.name) {
      const existing = await this.testProductsRepository.findByName(data.name);
      if (existing) {
        const error = new Error(
          TestProductsErrorMessages[TestProductsErrorCode.DUPLICATE_NAME],
        ) as any;
        error.statusCode = 409;
        error.code = TestProductsErrorCode.DUPLICATE_NAME;
        throw error;
      }
    }

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: item_count must be positive
    if (data.item_count !== undefined && data.item_count !== null) {
      if (Number(data.item_count) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_ITEM_COUNT
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_ITEM_COUNT;
        throw error;
      }
    }

    // Business rule: discount_rate must be positive
    if (data.discount_rate !== undefined && data.discount_rate !== null) {
      if (Number(data.discount_rate) < 0) {
        const error = new Error(
          TestProductsErrorMessages[
            TestProductsErrorCode.INVALID_VALUE_DISCOUNT_RATE
          ],
        ) as any;
        error.statusCode = 422;
        error.code = TestProductsErrorCode.INVALID_VALUE_DISCOUNT_RATE;
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
    // No status constraints found - manual validation required
    if (existing.status) {
      throw new Error('Cannot delete  - please verify status manually');
    }

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====
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
      labelField = 'code',
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
            if (this.eventHelper) {
              await this.eventHelper.emitCreated(results[i]);
            }
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
        code: 'Code',
        name: 'Name',
        slug: 'Slug',
        description: 'Description',
        is_active: 'Is active',
        is_featured: 'Is featured',
        display_order: 'Display order',
        item_count: 'Item count',
        discount_rate: 'Discount rate',
        metadata: 'Metadata',
        settings: 'Settings',
        status: 'Status',
        created_by: 'Created by',
        updated_by: 'Updated by',
        deleted_at: 'Deleted at',
        created_at: 'Created at',
        updated_at: 'Updated at',
      };

    // If specific fields requested, use only those
    const fieldsToExport =
      fields && fields.length > 0
        ? fields.filter((field) => exportableFields.hasOwnProperty(field))
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

    // Use field-specific find methods based on unique constraints only
    let existing: any = null;

    if (field === 'code' && options.value) {
      existing = await this.testProductsRepository.findByCode(options.value);
    } else if (field === 'name' && options.value) {
      existing = await this.testProductsRepository.findByName(options.value);
    }

    // If updating (excludeId provided), ignore the current record
    if (existing && options.excludeId && existing.id === options.excludeId) {
      existing = null;
    }

    return {
      unique: !existing,
      exists: existing || undefined,
    };
  }
}
