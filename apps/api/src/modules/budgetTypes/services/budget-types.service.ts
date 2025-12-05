import { BaseService } from '../../../shared/services/base.service';
import { BudgetTypesRepository } from '../repositories/budget-types.repository';
import {
  type BudgetTypes,
  type CreateBudgetTypes,
  type UpdateBudgetTypes,
  type GetBudgetTypesQuery,
  type ListBudgetTypesQuery,
  BudgetTypesErrorCode,
  BudgetTypesErrorMessages,
} from '../types/budget-types.types';

/**
 * BudgetTypes Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetTypesService extends BaseService<
  BudgetTypes,
  CreateBudgetTypes,
  UpdateBudgetTypes
> {
  constructor(private budgetTypesRepository: BudgetTypesRepository) {
    super(budgetTypesRepository);
  }

  /**
   * Get budgetTypes by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetTypesQuery = {},
  ): Promise<BudgetTypes | null> {
    const budgetTypes = await this.getById(id);

    if (budgetTypes) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetTypes;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetTypesQuery = {}): Promise<{
    data: BudgetTypes[];
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
   * Create new budgetTypes
   */
  async create(data: CreateBudgetTypes): Promise<BudgetTypes> {
    const budgetTypes = await super.create(data);

    return budgetTypes;
  }

  /**
   * Update existing budgetTypes
   */
  async update(
    id: string | number,
    data: UpdateBudgetTypes,
  ): Promise<BudgetTypes | null> {
    const budgetTypes = await super.update(id, data);

    return budgetTypes;
  }

  /**
   * Delete budgetTypes
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetTypes with ID:', id);

      // Check if budgetTypes exists first
      const existing = await this.budgetTypesRepository.findById(id);
      if (!existing) {
        console.log('BudgetTypes not found for deletion:', id);
        return false;
      }

      console.log('Found budgetTypes to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetTypesRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetTypes deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetTypes:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetTypes
   */
  protected async validateCreate(data: CreateBudgetTypes): Promise<void> {
    // Add custom validation logic here
    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====
    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetTypes,
  ): Promise<CreateBudgetTypes> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetTypes creation
   */
  protected async afterCreate(
    budgetTypes: BudgetTypes,
    _originalData: CreateBudgetTypes,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetTypes created:',
      JSON.stringify(budgetTypes),
      '(ID: ' + budgetTypes.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetTypes,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.budgetTypesRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BudgetTypesErrorMessages[
            BudgetTypesErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetTypesErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete budgetTypes - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
