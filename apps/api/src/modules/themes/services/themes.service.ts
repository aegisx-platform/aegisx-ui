import { BaseService } from '../../../shared/services/base.service';
import { ThemesRepository } from '../repositories/themes.repository';
import {
  type Themes,
  type CreateThemes,
  type UpdateThemes,
  type GetThemesQuery,
  type ListThemesQuery,
} from '../types/themes.types';

/**
 * Themes Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class ThemesService extends BaseService<
  Themes,
  CreateThemes,
  UpdateThemes
> {
  constructor(private themesRepository: ThemesRepository) {
    super(themesRepository);
  }

  /**
   * Get themes by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetThemesQuery = {},
  ): Promise<Themes | null> {
    const themes = await this.getById(id);

    if (themes) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return themes;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListThemesQuery = {}): Promise<{
    data: Themes[];
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
   * Create new themes
   */
  async create(data: CreateThemes): Promise<Themes> {
    const themes = await super.create(data);

    return themes;
  }

  /**
   * Update existing themes
   */
  async update(
    id: string | number,
    data: UpdateThemes,
  ): Promise<Themes | null> {
    const themes = await super.update(id, data);

    return themes;
  }

  /**
   * Delete themes
   */
  async delete(id: string | number): Promise<boolean> {
    // Get entity before deletion for event emission
    const themes = await this.getById(id);

    const deleted = await super.delete(id);

    return deleted;
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating themes
   */
  protected async validateCreate(data: CreateThemes): Promise<void> {
    // Add custom validation logic here
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(data: CreateThemes): Promise<CreateThemes> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after themes creation
   */
  protected async afterCreate(
    themes: Themes,
    _originalData: CreateThemes,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'Themes created:',
      JSON.stringify(themes),
      '(ID: ' + themes.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    _id: string | number,
    existing: Themes,
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

    const result = await this.themesRepository.list({
      limit,
      search,
      sortBy: labelField,
      sortOrder: 'asc',
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
   * Bulk create multiple themess
   */
  async bulkCreate(data: { items: CreateThemes[] }): Promise<{
    created: Themes[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Themes[] = [];
    const errors: any[] = [];

    for (const item of data.items) {
      try {
        await this.validateCreate(item);
        const processed = await this.beforeCreate(item);
        const created = await this.themesRepository.create(processed);
        await this.afterCreate(created, item);
        results.push(created);
      } catch (error) {
        errors.push({
          item,
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
   * Bulk update multiple themess
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateThemes }>;
  }): Promise<{
    updated: Themes[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Themes[] = [];
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
   * Bulk delete multiple themess
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
   * Bulk update status for multiple themess
   */
  async bulkUpdateStatus(data: {
    ids: Array<string | number>;
    status: boolean;
  }): Promise<{
    updated: Themes[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Themes[] = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const updated = await this.update(id, {
          is_active: data.status,
        } as UpdateThemes);
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
   * Activate themes
   */
  async activate(
    id: string | number,
    options: any = {},
  ): Promise<Themes | null> {
    return this.update(id, { is_active: true } as UpdateThemes);
  }

  /**
   * Deactivate themes
   */
  async deactivate(
    id: string | number,
    options: any = {},
  ): Promise<Themes | null> {
    return this.update(id, { is_active: false } as UpdateThemes);
  }

  /**
   * Toggle themes status
   */
  async toggle(id: string | number, options: any = {}): Promise<Themes | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = !current.is_active;
    return this.update(id, { is_active: newStatus } as UpdateThemes);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<any> {
    return this.themesRepository.getStats();
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   */
  async validate(data: { data: CreateThemes }): Promise<{
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
    options: { value: string | number; excludeId?: string | number },
  ): Promise<{
    unique: boolean;
    exists?: any;
  }> {
    // Convert value to string for string fields, keep number for numeric fields
    const searchValue =
      typeof options.value === 'number' ? options.value : String(options.value);

    // Build query for field lookup
    let query = this.themesRepository
      .getJoinQuery()
      .where(`themes.${field}`, searchValue);

    // Add exclusion for updates
    if (options.excludeId) {
      query = query.whereNot('themes.id', options.excludeId);
    }

    const existing = await query.first();

    return {
      unique: !existing,
      exists: existing
        ? this.themesRepository.transformToEntity(existing)
        : undefined,
    };
  }
}
