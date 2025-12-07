import { BaseService } from '../../../../shared/services/base.service';
import { DrugsRepository } from './drugs.repository';
import {
  type Drugs,
  type CreateDrugs,
  type UpdateDrugs,
  type GetDrugsQuery,
  type ListDrugsQuery,
  DrugsErrorCode,
  DrugsErrorMessages,
} from './drugs.types';

/**
 * Drugs Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class DrugsService extends BaseService<Drugs, CreateDrugs, UpdateDrugs> {
  constructor(private drugsRepository: DrugsRepository) {
    super(drugsRepository);
  }

  /**
   * Get drugs by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetDrugsQuery = {},
  ): Promise<Drugs | null> {
    const drugs = await this.getById(id);

    if (drugs) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return drugs;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListDrugsQuery = {}): Promise<{
    data: Drugs[];
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
   * Create new drugs
   */
  async create(data: CreateDrugs): Promise<Drugs> {
    const drugs = await super.create(data);

    return drugs;
  }

  /**
   * Update existing drugs
   */
  async update(id: string | number, data: UpdateDrugs): Promise<Drugs | null> {
    const drugs = await super.update(id, data);

    return drugs;
  }

  /**
   * Delete drugs
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete drugs with ID:', id);

      // Check if drugs exists first
      const existing = await this.drugsRepository.findById(id);
      if (!existing) {
        console.log('Drugs not found for deletion:', id);
        return false;
      }

      console.log('Found drugs to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.drugsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('Drugs deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting drugs:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating drugs
   */
  protected async validateCreate(data: CreateDrugs): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: unit_price must be positive
    if (data.unit_price !== undefined && data.unit_price !== null) {
      if (Number(data.unit_price) < 0) {
        const error = new Error(
          DrugsErrorMessages[DrugsErrorCode.INVALID_VALUE_UNIT_PRICE],
        ) as any;
        error.statusCode = 422;
        error.code = DrugsErrorCode.INVALID_VALUE_UNIT_PRICE;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(data: CreateDrugs): Promise<CreateDrugs> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after drugs creation
   */
  protected async afterCreate(
    drugs: Drugs,
    _originalData: CreateDrugs,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'Drugs created:',
      JSON.stringify(drugs),
      '(ID: ' + drugs.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: Drugs,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.drugsRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          DrugsErrorMessages[DrugsErrorCode.CANNOT_DELETE_HAS_REFERENCES],
        ) as any;
        error.statusCode = 422;
        error.code = DrugsErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete drugs - has ${refDetails} references`,
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
      labelField = 'drug_code',
      valueField = 'id',
    } = options;

    const result = await this.drugsRepository.list({
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
   * Bulk create multiple drugss
   */
  async bulkCreate(data: { items: CreateDrugs[] }): Promise<{
    created: Drugs[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Drugs[] = [];
    const errors: any[] = [];

    // Validate and process all items first
    const validItems: CreateDrugs[] = [];
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
          const created = await this.drugsRepository.create(item);
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
   * Bulk update multiple drugss
   */
  async bulkUpdate(data: {
    items: Array<{ id: string | number; data: UpdateDrugs }>;
  }): Promise<{
    updated: Drugs[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Drugs[] = [];
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
   * Bulk delete multiple drugss
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
   * Bulk update status for multiple drugss
   */
  async bulkUpdateStatus(data: {
    ids: Array<string | number>;
    status: boolean;
  }): Promise<{
    updated: Drugs[];
    summary: { successful: number; failed: number; errors: any[] };
  }> {
    const results: Drugs[] = [];
    const errors: any[] = [];

    for (const id of data.ids) {
      try {
        const updated = await this.update(id, {
          is_active: data.status,
        } as UpdateDrugs);
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
   * Activate drugs
   */
  async activate(
    id: string | number,
    options: any = {},
  ): Promise<Drugs | null> {
    return this.update(id, { is_active: true } as UpdateDrugs);
  }

  /**
   * Deactivate drugs
   */
  async deactivate(
    id: string | number,
    options: any = {},
  ): Promise<Drugs | null> {
    return this.update(id, { is_active: false } as UpdateDrugs);
  }

  /**
   * Toggle drugs status
   */
  async toggle(id: string | number, options: any = {}): Promise<Drugs | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const newStatus = !current.is_active;
    return this.update(id, { is_active: newStatus } as UpdateDrugs);
  }

  /**
   * Get basic statistics (count only)
   */
  async getStats(): Promise<{
    total: number;
  }> {
    return this.drugsRepository.getStats();
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
    const result = await this.drugsRepository.list(query);

    // Return raw data - ExportService will handle formatting
    return result.data;
  }

  /**
   * Format single record for export
   */
  private formatExportRecord(record: Drugs, fields?: string[]): any {
    const formatted: any = {};

    // Define all exportable fields
    const exportableFields: { [key: string]: string | ((value: any) => any) } =
      {
        id: 'Id',
        drug_code: 'Drug code',
        trade_name: 'Trade name',
        generic_id: 'Generic id',
        manufacturer_id: 'Manufacturer id',
        tmt_tpu_id: 'Tmt tpu id',
        nlem_status: 'Nlem status',
        drug_status: 'Drug status',
        product_category: 'Product category',
        status_changed_date: 'Status changed date',
        unit_price: 'Unit price',
        package_size: 'Package size',
        package_unit: 'Package unit',
        is_active: 'Is active',
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
  async validate(data: { data: CreateDrugs }): Promise<{
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
