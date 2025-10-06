import { BaseService } from '../../../shared/services/base.service';
import { AuthorsRepository } from '../repositories/authors.repository';
import {
  type Authors,
  type CreateAuthors,
  type UpdateAuthors,
  type GetAuthorsQuery,
  type ListAuthorsQuery,
} from '../types/authors.types';

/**
 * Authors Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class AuthorsService extends BaseService<
  Authors,
  CreateAuthors,
  UpdateAuthors
> {
  constructor(private authorsRepository: AuthorsRepository) {
    super(authorsRepository);
  }

  /**
   * Get authors by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetAuthorsQuery = {},
  ): Promise<Authors | null> {
    const authors = await this.getById(id);

    if (authors) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return authors;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListAuthorsQuery = {}): Promise<{
    data: Authors[];
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
   * Create new authors
   */
  async create(data: CreateAuthors): Promise<Authors> {
    const authors = await super.create(data);

    return authors;
  }

  /**
   * Update existing authors
   */
  async update(
    id: string | number,
    data: UpdateAuthors,
  ): Promise<Authors | null> {
    const authors = await super.update(id, data);

    return authors;
  }

  /**
   * Delete authors
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete authors with ID:', id);

      // Check if authors exists first
      const existing = await this.authorsRepository.findById(id);
      if (!existing) {
        console.log('Authors not found for deletion:', id);
        return false;
      }

      console.log('Found authors to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.authorsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('Authors deleted successfully:', {
          id,
          name: existing.name,
        });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting authors:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating authors
   */
  protected async validateCreate(data: CreateAuthors): Promise<void> {
    // Add custom validation logic here
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(data: CreateAuthors): Promise<CreateAuthors> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after authors creation
   */
  protected async afterCreate(
    authors: Authors,
    _originalData: CreateAuthors,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'Authors created:',
      JSON.stringify(authors),
      '(ID: ' + authors.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    _id: string | number,
    existing: Authors,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
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
      labelField = 'name',
      valueField = 'id',
    } = options;

    const result = await this.authorsRepository.list({
      limit,
      search,
      sort: `${labelField}:asc`,
    });

    const dropdownOptions = result.data.map((item) => ({
      value: item[valueField],
      label: item[labelField] || `${item.id}`,
      disabled: false,
    }));

    return {
      options: dropdownOptions,
      total: result.pagination.total,
    };
  }

  /**
   * Bulk create multiple authorss
   */
  async bulkCreate(data: { items: CreateAuthors[] }): Promise<{
    created: Authors[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Authors[] = [];
    const errors: any[] = [];

    // Validate and process all items first
    const validItems: CreateAuthors[] = [];
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
          const created = await this.authorsRepository.create(item);
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
   * Bulk update multiple authorss
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateAuthors }>;
  }): Promise<{
    updated: Authors[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Authors[] = [];
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
   * Bulk delete multiple authorss
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
   * Get basic statistics (count only)
   */
  async getStats(): Promise<{
    total: number;
  }> {
    return this.authorsRepository.getStats();
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   */
  async validate(data: { data: CreateAuthors }): Promise<{
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
      existing = await this.authorsRepository.findByName(options.value);
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
