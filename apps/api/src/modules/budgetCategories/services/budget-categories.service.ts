import { BaseService } from '../../../shared/services/base.service';
import { BudgetCategoriesRepository } from '../repositories/budget-categories.repository';
import {
  type BudgetCategories,
  type CreateBudgetCategories,
  type UpdateBudgetCategories,
  type GetBudgetCategoriesQuery,
  type ListBudgetCategoriesQuery,
  BudgetCategoriesErrorCode,
  BudgetCategoriesErrorMessages,
} from '../types/budget-categories.types';

/**
 * BudgetCategories Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetCategoriesService extends BaseService<
  BudgetCategories,
  CreateBudgetCategories,
  UpdateBudgetCategories
> {
  constructor(private budgetCategoriesRepository: BudgetCategoriesRepository) {
    super(budgetCategoriesRepository);
  }

  /**
   * Get budgetCategories by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetCategoriesQuery = {},
  ): Promise<BudgetCategories | null> {
    const budgetCategories = await this.getById(id);

    if (budgetCategories) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetCategories;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetCategoriesQuery = {}): Promise<{
    data: BudgetCategories[];
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
   * Create new budgetCategories
   */
  async create(data: CreateBudgetCategories): Promise<BudgetCategories> {
    const budgetCategories = await super.create(data);

    return budgetCategories;
  }

  /**
   * Update existing budgetCategories
   */
  async update(
    id: string | number,
    data: UpdateBudgetCategories,
  ): Promise<BudgetCategories | null> {
    const budgetCategories = await super.update(id, data);

    return budgetCategories;
  }

  /**
   * Delete budgetCategories
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetCategories with ID:', id);

      // Check if budgetCategories exists first
      const existing = await this.budgetCategoriesRepository.findById(id);
      if (!existing) {
        console.log('BudgetCategories not found for deletion:', id);
        return false;
      }

      console.log('Found budgetCategories to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetCategoriesRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetCategories deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetCategories:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetCategories
   */
  protected async validateCreate(data: CreateBudgetCategories): Promise<void> {
    // Add custom validation logic here
    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====
    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetCategories,
  ): Promise<CreateBudgetCategories> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetCategories creation
   */
  protected async afterCreate(
    budgetCategories: BudgetCategories,
    _originalData: CreateBudgetCategories,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetCategories created:',
      JSON.stringify(budgetCategories),
      '(ID: ' + budgetCategories.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetCategories,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.budgetCategoriesRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BudgetCategoriesErrorMessages[
            BudgetCategoriesErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetCategoriesErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete budgetCategories - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
