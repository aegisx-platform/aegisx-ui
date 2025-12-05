import { BaseService } from '../../../shared/services/base.service';
import { BudgetAllocationsRepository } from '../repositories/budget-allocations.repository';
import {
  type BudgetAllocations,
  type CreateBudgetAllocations,
  type UpdateBudgetAllocations,
  type GetBudgetAllocationsQuery,
  type ListBudgetAllocationsQuery,
  BudgetAllocationsErrorCode,
  BudgetAllocationsErrorMessages,
} from '../types/budget-allocations.types';

/**
 * BudgetAllocations Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetAllocationsService extends BaseService<
  BudgetAllocations,
  CreateBudgetAllocations,
  UpdateBudgetAllocations
> {
  constructor(
    private budgetAllocationsRepository: BudgetAllocationsRepository,
  ) {
    super(budgetAllocationsRepository);
  }

  /**
   * Get budgetAllocations by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetAllocationsQuery = {},
  ): Promise<BudgetAllocations | null> {
    const budgetAllocations = await this.getById(id);

    if (budgetAllocations) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetAllocations;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetAllocationsQuery = {}): Promise<{
    data: BudgetAllocations[];
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
   * Create new budgetAllocations
   */
  async create(data: CreateBudgetAllocations): Promise<BudgetAllocations> {
    const budgetAllocations = await super.create(data);

    return budgetAllocations;
  }

  /**
   * Update existing budgetAllocations
   */
  async update(
    id: string | number,
    data: UpdateBudgetAllocations,
  ): Promise<BudgetAllocations | null> {
    const budgetAllocations = await super.update(id, data);

    return budgetAllocations;
  }

  /**
   * Delete budgetAllocations
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetAllocations with ID:', id);

      // Check if budgetAllocations exists first
      const existing = await this.budgetAllocationsRepository.findById(id);
      if (!existing) {
        console.log('BudgetAllocations not found for deletion:', id);
        return false;
      }

      console.log('Found budgetAllocations to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetAllocationsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetAllocations deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetAllocations:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetAllocations
   */
  protected async validateCreate(data: CreateBudgetAllocations): Promise<void> {
    // Add custom validation logic here
    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====
    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetAllocations,
  ): Promise<CreateBudgetAllocations> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetAllocations creation
   */
  protected async afterCreate(
    budgetAllocations: BudgetAllocations,
    _originalData: CreateBudgetAllocations,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetAllocations created:',
      JSON.stringify(budgetAllocations),
      '(ID: ' + budgetAllocations.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetAllocations,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.budgetAllocationsRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BudgetAllocationsErrorMessages[
            BudgetAllocationsErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetAllocationsErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete budgetAllocations - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
