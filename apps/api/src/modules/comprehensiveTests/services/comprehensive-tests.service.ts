import { BaseService } from '../../../shared/services/base.service';
import { ComprehensiveTestsRepository } from '../repositories/comprehensive-tests.repository';
import {
  type ComprehensiveTests,
  type CreateComprehensiveTests,
  type UpdateComprehensiveTests,
  type GetComprehensiveTestsQuery,
  type ListComprehensiveTestsQuery,
} from '../types/comprehensive-tests.types';

/**
 * ComprehensiveTests Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class ComprehensiveTestsService extends BaseService<
  ComprehensiveTests,
  CreateComprehensiveTests,
  UpdateComprehensiveTests
> {
  constructor(
    private comprehensiveTestsRepository: ComprehensiveTestsRepository,
  ) {
    super(comprehensiveTestsRepository);
  }

  /**
   * Get comprehensiveTests by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetComprehensiveTestsQuery = {},
  ): Promise<ComprehensiveTests | null> {
    const comprehensiveTests = await this.getById(id);

    if (comprehensiveTests) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return comprehensiveTests;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListComprehensiveTestsQuery = {}): Promise<{
    data: ComprehensiveTests[];
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
   * Create new comprehensiveTests
   */
  async create(data: CreateComprehensiveTests): Promise<ComprehensiveTests> {
    const comprehensiveTests = await super.create(data);

    return comprehensiveTests;
  }

  /**
   * Update existing comprehensiveTests
   */
  async update(
    id: string | number,
    data: UpdateComprehensiveTests,
  ): Promise<ComprehensiveTests | null> {
    const comprehensiveTests = await super.update(id, data);

    return comprehensiveTests;
  }

  /**
   * Delete comprehensiveTests
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete comprehensiveTests with ID:', id);

      // Check if comprehensiveTests exists first
      const existing = await this.comprehensiveTestsRepository.findById(id);
      if (!existing) {
        console.log('ComprehensiveTests not found for deletion:', id);
        return false;
      }

      console.log('Found comprehensiveTests to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.comprehensiveTestsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('ComprehensiveTests deleted successfully:', {
          id,
          name: existing.title,
        });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting comprehensiveTests:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating comprehensiveTests
   */
  protected async validateCreate(
    data: CreateComprehensiveTests,
  ): Promise<void> {
    // Add custom validation logic here
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateComprehensiveTests,
  ): Promise<CreateComprehensiveTests> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after comprehensiveTests creation
   */
  protected async afterCreate(
    comprehensiveTests: ComprehensiveTests,
    _originalData: CreateComprehensiveTests,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'ComprehensiveTests created:',
      JSON.stringify(comprehensiveTests),
      '(ID: ' + comprehensiveTests.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    _id: string | number,
    existing: ComprehensiveTests,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    if (existing.status === 'published') {
      throw new Error('Cannot delete published ');
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
      labelField = 'title',
      valueField = 'id',
    } = options;

    const result = await this.comprehensiveTestsRepository.list({
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
   * Bulk create multiple comprehensiveTestss
   */
  async bulkCreate(data: { items: CreateComprehensiveTests[] }): Promise<{
    created: ComprehensiveTests[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: ComprehensiveTests[] = [];
    const errors: any[] = [];

    // Validate and process all items first
    const validItems: CreateComprehensiveTests[] = [];
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
          const created = await this.comprehensiveTestsRepository.create(item);
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
   * Bulk update multiple comprehensiveTestss
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateComprehensiveTests }>;
  }): Promise<{
    updated: ComprehensiveTests[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: ComprehensiveTests[] = [];
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
   * Bulk delete multiple comprehensiveTestss
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
   * Bulk update status for multiple comprehensiveTestss
   */
  async bulkUpdateStatus(data: {
    ids: Array<string | number>;
    status: boolean;
  }): Promise<{
    updated: ComprehensiveTests[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: ComprehensiveTests[] = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const updated = await this.update(id, {
          is_active: data.status,
        } as UpdateComprehensiveTests);
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
   * Activate comprehensiveTests
   */
  async activate(
    id: string | number,
    options: any = {},
  ): Promise<ComprehensiveTests | null> {
    return this.update(id, { is_active: true } as UpdateComprehensiveTests);
  }

  /**
   * Deactivate comprehensiveTests
   */
  async deactivate(
    id: string | number,
    options: any = {},
  ): Promise<ComprehensiveTests | null> {
    return this.update(id, { is_active: false } as UpdateComprehensiveTests);
  }

  /**
   * Toggle comprehensiveTests status
   */
  async toggle(
    id: string | number,
    options: any = {},
  ): Promise<ComprehensiveTests | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = !current.is_active;
    return this.update(id, {
      is_active: newStatus,
    } as UpdateComprehensiveTests);
  }

  /**
   * Get basic statistics (count only)
   */
  async getStats(): Promise<{
    total: number;
  }> {
    return this.comprehensiveTestsRepository.getStats();
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   */
  async validate(data: { data: CreateComprehensiveTests }): Promise<{
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

    if (field === 'title' && options.value) {
      existing = await this.comprehensiveTestsRepository.findByTitle(
        options.value,
      );
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
