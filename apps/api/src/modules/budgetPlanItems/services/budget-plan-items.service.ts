import { BaseService } from '../../../shared/services/base.service';
import { BudgetPlanItemsRepository } from '../repositories/budget-plan-items.repository';
import {
  type BudgetPlanItems,
  type CreateBudgetPlanItems,
  type UpdateBudgetPlanItems,
  type GetBudgetPlanItemsQuery,
  type ListBudgetPlanItemsQuery,
  BudgetPlanItemsErrorCode,
  BudgetPlanItemsErrorMessages,
} from '../types/budget-plan-items.types';

/**
 * BudgetPlanItems Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetPlanItemsService extends BaseService<
  BudgetPlanItems,
  CreateBudgetPlanItems,
  UpdateBudgetPlanItems
> {
  constructor(private budgetPlanItemsRepository: BudgetPlanItemsRepository) {
    super(budgetPlanItemsRepository);
  }

  /**
   * Get budgetPlanItems by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetPlanItemsQuery = {},
  ): Promise<BudgetPlanItems | null> {
    const budgetPlanItems = await this.getById(id);

    if (budgetPlanItems) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetPlanItems;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetPlanItemsQuery = {}): Promise<{
    data: BudgetPlanItems[];
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
   * Create new budgetPlanItems
   */
  async create(data: CreateBudgetPlanItems): Promise<BudgetPlanItems> {
    const budgetPlanItems = await super.create(data);

    return budgetPlanItems;
  }

  /**
   * Update existing budgetPlanItems
   */
  async update(
    id: string | number,
    data: UpdateBudgetPlanItems,
  ): Promise<BudgetPlanItems | null> {
    const budgetPlanItems = await super.update(id, data);

    return budgetPlanItems;
  }

  /**
   * Delete budgetPlanItems
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetPlanItems with ID:', id);

      // Check if budgetPlanItems exists first
      const existing = await this.budgetPlanItemsRepository.findById(id);
      if (!existing) {
        console.log('BudgetPlanItems not found for deletion:', id);
        return false;
      }

      console.log('Found budgetPlanItems to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetPlanItemsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetPlanItems deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetPlanItems:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetPlanItems
   */
  protected async validateCreate(data: CreateBudgetPlanItems): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: planned_quantity must be positive
    if (data.planned_quantity !== undefined && data.planned_quantity !== null) {
      if (Number(data.planned_quantity) < 0) {
        const error = new Error(
          BudgetPlanItemsErrorMessages[
            BudgetPlanItemsErrorCode.INVALID_VALUE_PLANNED_QUANTITY
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetPlanItemsErrorCode.INVALID_VALUE_PLANNED_QUANTITY;
        throw error;
      }
    }

    // Business rule: estimated_unit_price must be positive
    if (
      data.estimated_unit_price !== undefined &&
      data.estimated_unit_price !== null
    ) {
      if (Number(data.estimated_unit_price) < 0) {
        const error = new Error(
          BudgetPlanItemsErrorMessages[
            BudgetPlanItemsErrorCode.INVALID_VALUE_ESTIMATED_UNIT_PRICE
          ],
        ) as any;
        error.statusCode = 422;
        error.code =
          BudgetPlanItemsErrorCode.INVALID_VALUE_ESTIMATED_UNIT_PRICE;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetPlanItems,
  ): Promise<CreateBudgetPlanItems> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetPlanItems creation
   */
  protected async afterCreate(
    budgetPlanItems: BudgetPlanItems,
    _originalData: CreateBudgetPlanItems,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetPlanItems created:',
      JSON.stringify(budgetPlanItems),
      '(ID: ' + budgetPlanItems.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetPlanItems,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====
  }
}
