import { BaseService } from '../../../../shared/services/base.service';
import { BudgetRequestItemsRepository } from './budget-request-items.repository';
import {
  type BudgetRequestItems,
  type CreateBudgetRequestItems,
  type UpdateBudgetRequestItems,
  type GetBudgetRequestItemsQuery,
  type ListBudgetRequestItemsQuery,
  BudgetRequestItemsErrorCode,
  BudgetRequestItemsErrorMessages,
} from './budget-request-items.types';

/**
 * BudgetRequestItems Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetRequestItemsService extends BaseService<
  BudgetRequestItems,
  CreateBudgetRequestItems,
  UpdateBudgetRequestItems
> {
  constructor(
    private budgetRequestItemsRepository: BudgetRequestItemsRepository,
  ) {
    super(budgetRequestItemsRepository);
  }

  /**
   * Get budgetRequestItems by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetRequestItemsQuery = {},
  ): Promise<BudgetRequestItems | null> {
    const budgetRequestItems = await this.getById(id);

    if (budgetRequestItems) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetRequestItems;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetRequestItemsQuery = {}): Promise<{
    data: BudgetRequestItems[];
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
   * Create new budgetRequestItems
   */
  async create(data: CreateBudgetRequestItems): Promise<BudgetRequestItems> {
    const budgetRequestItems = await super.create(data);

    return budgetRequestItems;
  }

  /**
   * Update existing budgetRequestItems
   */
  async update(
    id: string | number,
    data: UpdateBudgetRequestItems,
  ): Promise<BudgetRequestItems | null> {
    const budgetRequestItems = await super.update(id, data);

    return budgetRequestItems;
  }

  /**
   * Delete budgetRequestItems
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetRequestItems with ID:', id);

      // Check if budgetRequestItems exists first
      const existing = await this.budgetRequestItemsRepository.findById(id);
      if (!existing) {
        console.log('BudgetRequestItems not found for deletion:', id);
        return false;
      }

      console.log('Found budgetRequestItems to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetRequestItemsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetRequestItems deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetRequestItems:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetRequestItems
   */
  protected async validateCreate(
    data: CreateBudgetRequestItems,
  ): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: requested_amount must be positive
    if (data.requested_amount !== undefined && data.requested_amount !== null) {
      if (Number(data.requested_amount) < 0) {
        const error = new Error(
          BudgetRequestItemsErrorMessages[
            BudgetRequestItemsErrorCode.INVALID_VALUE_REQUESTED_AMOUNT
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetRequestItemsErrorCode.INVALID_VALUE_REQUESTED_AMOUNT;
        throw error;
      }
    }

    // Business rule: unit_price must be positive
    if (data.unit_price !== undefined && data.unit_price !== null) {
      if (Number(data.unit_price) < 0) {
        const error = new Error(
          BudgetRequestItemsErrorMessages[
            BudgetRequestItemsErrorCode.INVALID_VALUE_UNIT_PRICE
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetRequestItemsErrorCode.INVALID_VALUE_UNIT_PRICE;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetRequestItems,
  ): Promise<CreateBudgetRequestItems> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetRequestItems creation
   */
  protected async afterCreate(
    budgetRequestItems: BudgetRequestItems,
    _originalData: CreateBudgetRequestItems,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetRequestItems created:',
      JSON.stringify(budgetRequestItems),
      '(ID: ' + budgetRequestItems.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetRequestItems,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====
  }
}
