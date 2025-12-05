import { BaseService } from '../../../shared/services/base.service';
import { BudgetReservationsRepository } from '../repositories/budget-reservations.repository';
import {
  type BudgetReservations,
  type CreateBudgetReservations,
  type UpdateBudgetReservations,
  type GetBudgetReservationsQuery,
  type ListBudgetReservationsQuery,
  BudgetReservationsErrorCode,
  BudgetReservationsErrorMessages,
} from '../types/budget-reservations.types';

/**
 * BudgetReservations Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetReservationsService extends BaseService<
  BudgetReservations,
  CreateBudgetReservations,
  UpdateBudgetReservations
> {
  constructor(
    private budgetReservationsRepository: BudgetReservationsRepository,
  ) {
    super(budgetReservationsRepository);
  }

  /**
   * Get budgetReservations by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetReservationsQuery = {},
  ): Promise<BudgetReservations | null> {
    const budgetReservations = await this.getById(id);

    if (budgetReservations) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetReservations;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetReservationsQuery = {}): Promise<{
    data: BudgetReservations[];
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
   * Create new budgetReservations
   */
  async create(data: CreateBudgetReservations): Promise<BudgetReservations> {
    const budgetReservations = await super.create(data);

    return budgetReservations;
  }

  /**
   * Update existing budgetReservations
   */
  async update(
    id: string | number,
    data: UpdateBudgetReservations,
  ): Promise<BudgetReservations | null> {
    const budgetReservations = await super.update(id, data);

    return budgetReservations;
  }

  /**
   * Delete budgetReservations
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetReservations with ID:', id);

      // Check if budgetReservations exists first
      const existing = await this.budgetReservationsRepository.findById(id);
      if (!existing) {
        console.log('BudgetReservations not found for deletion:', id);
        return false;
      }

      console.log('Found budgetReservations to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetReservationsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetReservations deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetReservations:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetReservations
   */
  protected async validateCreate(
    data: CreateBudgetReservations,
  ): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: reserved_amount must be positive
    if (data.reserved_amount !== undefined && data.reserved_amount !== null) {
      if (Number(data.reserved_amount) < 0) {
        const error = new Error(
          BudgetReservationsErrorMessages[
            BudgetReservationsErrorCode.INVALID_VALUE_RESERVED_AMOUNT
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetReservationsErrorCode.INVALID_VALUE_RESERVED_AMOUNT;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetReservations,
  ): Promise<CreateBudgetReservations> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetReservations creation
   */
  protected async afterCreate(
    budgetReservations: BudgetReservations,
    _originalData: CreateBudgetReservations,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetReservations created:',
      JSON.stringify(budgetReservations),
      '(ID: ' + budgetReservations.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetReservations,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====
  }
}
