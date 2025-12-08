import { BaseService } from '../../../../shared/services/base.service';
import { BudgetRequestsRepository } from './budget-requests.repository';
import {
  type BudgetRequests,
  type CreateBudgetRequests,
  type UpdateBudgetRequests,
  type GetBudgetRequestsQuery,
  type ListBudgetRequestsQuery,
  BudgetRequestsErrorCode,
  BudgetRequestsErrorMessages,
} from './budget-requests.types';

/**
 * BudgetRequests Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BudgetRequestsService extends BaseService<
  BudgetRequests,
  CreateBudgetRequests,
  UpdateBudgetRequests
> {
  constructor(private budgetRequestsRepository: BudgetRequestsRepository) {
    super(budgetRequestsRepository);
  }

  /**
   * Get budgetRequests by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBudgetRequestsQuery = {},
  ): Promise<BudgetRequests | null> {
    const budgetRequests = await this.getById(id);

    if (budgetRequests) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return budgetRequests;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBudgetRequestsQuery = {}): Promise<{
    data: BudgetRequests[];
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
   * Create new budgetRequests
   */
  async create(data: CreateBudgetRequests): Promise<BudgetRequests> {
    const budgetRequests = await super.create(data);

    return budgetRequests;
  }

  /**
   * Update existing budgetRequests
   */
  async update(
    id: string | number,
    data: UpdateBudgetRequests,
  ): Promise<BudgetRequests | null> {
    const budgetRequests = await super.update(id, data);

    return budgetRequests;
  }

  /**
   * Delete budgetRequests
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete budgetRequests with ID:', id);

      // Check if budgetRequests exists first
      const existing = await this.budgetRequestsRepository.findById(id);
      if (!existing) {
        console.log('BudgetRequests not found for deletion:', id);
        return false;
      }

      console.log('Found budgetRequests to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.budgetRequestsRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('BudgetRequests deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting budgetRequests:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating budgetRequests
   */
  protected async validateCreate(data: CreateBudgetRequests): Promise<void> {
    // Add custom validation logic here

    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====

    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====

    // Business rule: total_requested_amount must be positive
    if (
      data.total_requested_amount !== undefined &&
      data.total_requested_amount !== null
    ) {
      if (Number(data.total_requested_amount) < 0) {
        const error = new Error(
          BudgetRequestsErrorMessages[
            BudgetRequestsErrorCode.INVALID_VALUE_TOTAL_REQUESTED_AMOUNT
          ],
        ) as any;
        error.statusCode = 422;
        error.code =
          BudgetRequestsErrorCode.INVALID_VALUE_TOTAL_REQUESTED_AMOUNT;
        throw error;
      }
    }
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(
    data: CreateBudgetRequests,
  ): Promise<CreateBudgetRequests> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after budgetRequests creation
   */
  protected async afterCreate(
    budgetRequests: BudgetRequests,
    _originalData: CreateBudgetRequests,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log(
      'BudgetRequests created:',
      JSON.stringify(budgetRequests),
      '(ID: ' + budgetRequests.id + ')',
    );
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: BudgetRequests,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records
    if (existing.status === 'D') {
      throw new Error('Cannot delete D ');
    }

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.budgetRequestsRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BudgetRequestsErrorMessages[
            BudgetRequestsErrorCode.CANNOT_DELETE_HAS_REFERENCES
          ],
        ) as any;
        error.statusCode = 422;
        error.code = BudgetRequestsErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete budgetRequests - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
