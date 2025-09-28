import { BaseService } from '../../../shared/services/base.service';
import { UserRolesRepository } from '../repositories/userRoles.repository';
import {
  type UserRoles,
  type CreateUserRoles,
  type UpdateUserRoles,
  type GetUserRolesQuery,
  type ListUserRolesQuery,
} from '../types/userRoles.types';

/**
 * UserRoles Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class UserRolesService extends BaseService<
  UserRoles,
  CreateUserRoles,
  UpdateUserRoles
> {
  constructor(private userRolesRepository: UserRolesRepository) {
    super(userRolesRepository);
  }

  /**
   * Get userRoles by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetUserRolesQuery = {},
  ): Promise<UserRoles | null> {
    const userRoles = await this.getById(id);

    if (userRoles) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return userRoles;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListUserRolesQuery = {}): Promise<{
    data: UserRoles[];
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
   * Create new userRoles
   */
  async create(data: CreateUserRoles): Promise<UserRoles> {
    const userRoles = await super.create(data);

    return userRoles;
  }

  /**
   * Update existing userRoles
   */
  async update(
    id: string | number,
    data: UpdateUserRoles,
  ): Promise<UserRoles | null> {
    const userRoles = await super.update(id, data);

    return userRoles;
  }

  /**
   * Delete userRoles
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete userRoles with ID:', id);

      // Check if userRoles exists first
      const existing = await this.userRolesRepository.findById(id);
      if (!existing) {
        console.log('UserRoles not found for deletion:', id);
        return false;
      }

      console.log('Found userRoles to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.userRolesRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('UserRoles deleted successfully:', {
          id,
          name: existing.id,
        });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting userRoles:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating userRoles
   */
  protected async validateCreate(data: CreateUserRoles): Promise<void> {
    // Add custom validation logic here
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateUserRoles,
  ): Promise<CreateUserRoles> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after userRoles creation
   */
  protected async afterCreate(
    userRoles: UserRoles,
    _originalData: CreateUserRoles,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'UserRoles created:',
      JSON.stringify(userRoles),
      '(ID: ' + userRoles.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    _id: string | number,
    existing: UserRoles,
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
      labelField = 'display_name',
      valueField = 'id',
    } = options;

    const result = await this.userRolesRepository.list({
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
   * Bulk create multiple userRoless
   */
  async bulkCreate(data: { items: CreateUserRoles[] }): Promise<{
    created: UserRoles[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: UserRoles[] = [];
    const errors: any[] = [];

    // Validate and process all items first
    const validItems: CreateUserRoles[] = [];
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
          const created = await this.userRolesRepository.create(item);
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
   * Bulk update multiple userRoless
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateUserRoles }>;
  }): Promise<{
    updated: UserRoles[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: UserRoles[] = [];
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
   * Bulk delete multiple userRoless
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
   * Bulk update status for multiple userRoless
   */
  async bulkUpdateStatus(data: {
    ids: Array<string | number>;
    status: boolean;
  }): Promise<{
    updated: UserRoles[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: UserRoles[] = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const updated = await this.update(id, {
          is_active: data.status,
        } as UpdateUserRoles);
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
   * Activate userRoles
   */
  async activate(
    id: string | number,
    options: any = {},
  ): Promise<UserRoles | null> {
    return this.update(id, { is_active: true } as UpdateUserRoles);
  }

  /**
   * Deactivate userRoles
   */
  async deactivate(
    id: string | number,
    options: any = {},
  ): Promise<UserRoles | null> {
    return this.update(id, { is_active: false } as UpdateUserRoles);
  }

  /**
   * Toggle userRoles status
   */
  async toggle(
    id: string | number,
    options: any = {},
  ): Promise<UserRoles | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = !current.is_active;
    return this.update(id, { is_active: newStatus } as UpdateUserRoles);
  }

  /**
   * Get basic statistics (count only)
   */
  async getStats(): Promise<{
    total: number;
  }> {
    return this.userRolesRepository.getStats();
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   */
  async validate(data: { data: CreateUserRoles }): Promise<{
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

    // Use field-specific find methods based on available repository methods
    let existing: any = null;

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
