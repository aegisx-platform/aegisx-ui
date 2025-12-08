import { BaseService } from '../../../../shared/services/base.service';
import { BudgetPlansRepository } from './budget-plans.repository';
import {
  type BudgetPlans,
  type CreateBudgetPlans,
  type UpdateBudgetPlans,
  type GetBudgetPlansQuery,
  type ListBudgetPlansQuery,
  BudgetPlansErrorCode,
  BudgetPlansErrorMessages,
} from './budget-plans.types';

/**
 * BudgetPlans Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetPlansService extends BaseService<
  BudgetPlans,
  CreateBudgetPlans,
  UpdateBudgetPlans
> {
  constructor(private budgetPlansRepository: BudgetPlansRepository) {
    super(budgetPlansRepository);
  }

  /**
   * Get budgetPlans by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetPlansQuery = {},
  ): Promise<BudgetPlans | null> {
    const budgetPlans = await this.getById(id);

    if (budgetPlans) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetPlans;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetPlansQuery = {}): Promise<{
    data: BudgetPlans[];
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
   * Create new budgetPlans
   */
  async create(data: CreateBudgetPlans): Promise<BudgetPlans> {
    const budgetPlans = await super.create(data);

    return budgetPlans;
  }

  /**
   * Update existing budgetPlans
   */
  async update(
    id: string | number,
    data: UpdateBudgetPlans,
  ): Promise<BudgetPlans | null> {
    const budgetPlans = await super.update(id, data);

    return budgetPlans;
  }

  /**
   * Delete budgetPlans
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetPlans with ID:', id);

      // Check if budgetPlans exists first
      const existing = await this.budgetPlansRepository.findById(id);
      if (!existing) {
        console.log('BudgetPlans not found for deletion:', id);
        return false;
      }

      console.log('Found budgetPlans to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetPlansRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetPlans deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetPlans:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetPlans
   */
  protected async validateCreate(data: CreateBudgetPlans): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: total_planned_amount must be positive
    if (
      data.total_planned_amount !== undefined &&
      data.total_planned_amount !== null
    ) {
      if (Number(data.total_planned_amount) < 0) {
        const error = new Error(
          BudgetPlansErrorMessages[
            BudgetPlansErrorCode.INVALID_VALUE_TOTAL_PLANNED_AMOUNT
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetPlansErrorCode.INVALID_VALUE_TOTAL_PLANNED_AMOUNT;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetPlans,
  ): Promise<CreateBudgetPlans> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetPlans creation
   */
  protected async afterCreate(
    budgetPlans: BudgetPlans,
    _originalData: CreateBudgetPlans,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetPlans created:',
      JSON.stringify(budgetPlans),
      '(ID: ' + budgetPlans.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetPlans,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    if (existing.status === 'D') {
      throw new Error('Cannot delete D ');
    }

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.budgetPlansRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BudgetPlansErrorMessages[
            BudgetPlansErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetPlansErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete budgetPlans - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
