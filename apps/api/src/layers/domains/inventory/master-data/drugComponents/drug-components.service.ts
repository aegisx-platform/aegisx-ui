import { BaseService } from '../../../../../shared/services/base.service';
import { DrugComponentsRepository } from './drug-components.repository';
import {
  type DrugComponents,
  type CreateDrugComponents,
  type UpdateDrugComponents,
  type GetDrugComponentsQuery,
  type ListDrugComponentsQuery,
} from './drug-components.types';

/**
 * DrugComponents Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class DrugComponentsService extends BaseService<
  DrugComponents,
  CreateDrugComponents,
  UpdateDrugComponents
> {
  constructor(private drugComponentsRepository: DrugComponentsRepository) {
    super(drugComponentsRepository);
  }

  /**
   * Get drugComponents by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetDrugComponentsQuery = {},
  ): Promise<DrugComponents | null> {
    const drugComponents = await this.getById(id);

    if (drugComponents) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return drugComponents;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListDrugComponentsQuery = {}): Promise<{
    data: DrugComponents[];
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
   * Create new drugComponents
   */
  async create(data: CreateDrugComponents): Promise<DrugComponents> {
    const drugComponents = await super.create(data);

    return drugComponents;
  }

  /**
   * Update existing drugComponents
   */
  async update(
    id: string | number,
    data: UpdateDrugComponents,
  ): Promise<DrugComponents | null> {
    const drugComponents = await super.update(id, data);

    return drugComponents;
  }

  /**
   * Delete drugComponents
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete drugComponents with ID:', id);

      // Check if drugComponents exists first
      const existing = await this.drugComponentsRepository.findById(id);
      if (!existing) {
        console.log('DrugComponents not found for deletion:', id);
        return false;
      }

      console.log('Found drugComponents to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.drugComponentsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('DrugComponents deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting drugComponents:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating drugComponents
   */
  protected async validateCreate(data: CreateDrugComponents): Promise<void> {
    // Add custom validation logic here
    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====
    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateDrugComponents,
  ): Promise<CreateDrugComponents> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after drugComponents creation
   */
  protected async afterCreate(
    drugComponents: DrugComponents,
    _originalData: CreateDrugComponents,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'DrugComponents created:',
      JSON.stringify(drugComponents),
      '(ID: ' + drugComponents.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: DrugComponents,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====
  }
}
