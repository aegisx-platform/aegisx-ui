import { BaseService } from '../../../../shared/services/base.service';
import { BankRepository } from './bank.repository';
import {
  type Bank,
  type CreateBank,
  type UpdateBank,
  type GetBankQuery,
  type ListBankQuery,
  BankErrorCode,
  BankErrorMessages,
} from './bank.types';

/**
 * Bank Service
 *
 * Following Fastify + BaseService pattern:
 * - Extends BaseService for standard CRUD operations
 * - Proper dependency injection through constructor
 * - Optional EventService integration for real-time features
 * - Business logic hooks for validation and processing
 */
export class BankService extends BaseService<Bank, CreateBank, UpdateBank> {
  constructor(private bankRepository: BankRepository) {
    super(bankRepository);
  }

  /**
   * Get bank by ID with optional query parameters
   */
  async findById(
    id: string | number,
    options: GetBankQuery = {},
  ): Promise<Bank | null> {
    const bank = await this.getById(id);

    if (bank) {
      // Handle query options (includes, etc.)
      if (options.include) {
        // Add relationship loading logic here
      }
    }

    return bank;
  }

  /**
   * Get paginated list with filtering and sorting
   */
  async findMany(options: ListBankQuery = {}): Promise<{
    data: Bank[];
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
   * Create new bank
   */
  async create(data: CreateBank): Promise<Bank> {
    const bank = await super.create(data);

    return bank;
  }

  /**
   * Update existing bank
   */
  async update(id: string | number, data: UpdateBank): Promise<Bank | null> {
    const bank = await super.update(id, data);

    return bank;
  }

  /**
   * Delete bank
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      console.log('Attempting to delete bank with ID:', id);

      // Check if bank exists first
      const existing = await this.bankRepository.findById(id);
      if (!existing) {
        console.log('Bank not found for deletion:', id);
        return false;
      }

      console.log('Found bank to delete:', existing.id);

      // Direct repository call to avoid base service complexity
      const deleted = await this.bankRepository.delete(id);

      console.log('Delete result:', deleted);

      if (deleted) {
        console.log('Bank deleted successfully:', { id });
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting bank:', error);
      return false;
    }
  }

  // ===== BUSINESS LOGIC HOOKS =====
  // Override these methods in child classes for custom validation/processing

  /**
   * Validate data before creating bank
   */
  protected async validateCreate(data: CreateBank): Promise<void> {
    // Add custom validation logic here
    // ===== ERROR HANDLING: DUPLICATE VALIDATION =====
    // ===== ERROR HANDLING: BUSINESS RULES VALIDATION =====
  }

  /**
   * Process data before creation
   */
  protected async beforeCreate(data: CreateBank): Promise<CreateBank> {
    // Add custom business logic here
    return {
      ...data,
      // Add default values or processing
    };
  }

  /**
   * Execute logic after bank creation
   */
  protected async afterCreate(
    bank: Bank,
    _originalData: CreateBank,
  ): Promise<void> {
    // Add post-creation logic (notifications, logging, etc.)
    console.log('Bank created:', JSON.stringify(bank), '(ID: ' + bank.id + ')');
  }

  /**
   * Validate before deletion
   */
  protected async validateDelete(
    id: string | number,
    existing: Bank,
  ): Promise<void> {
    // Add deletion validation logic here
    // Example: Prevent deletion if entity has dependent records

    // ===== ERROR HANDLING: FOREIGN KEY REFERENCE VALIDATION =====

    // Check if record can be deleted (has foreign key references)
    const deleteCheck = await this.bankRepository.canBeDeleted(id);

    if (!deleteCheck.canDelete) {
      const nonCascadeRefs = deleteCheck.blockedBy.filter(
        (ref) => !ref.cascade,
      );

      if (nonCascadeRefs.length > 0) {
        const refDetails = nonCascadeRefs
          .map((ref) => `${ref.count} ${ref.table}`)
          .join(', ');
        const error = new Error(
          BankErrorMessages[BankErrorCode.CANNOT_DELETE_HAS_REFERENCES],
        ) as any;
        error.statusCode = 422;
        error.code = BankErrorCode.CANNOT_DELETE_HAS_REFERENCES;
        error.details = {
          references: deleteCheck.blockedBy,
          message: `Cannot delete bank - has ${refDetails} references`,
        };
        throw error;
      }
    }
  }
}
