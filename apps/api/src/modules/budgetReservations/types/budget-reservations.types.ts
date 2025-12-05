// Import and re-export types from schemas for convenience
import {
  type BudgetReservations,
  type CreateBudgetReservations,
  type UpdateBudgetReservations,
  type BudgetReservationsIdParam,
  type GetBudgetReservationsQuery,
  type ListBudgetReservationsQuery,
} from '../schemas/budget-reservations.schemas';

export {
  type BudgetReservations,
  type CreateBudgetReservations,
  type UpdateBudgetReservations,
  type BudgetReservationsIdParam,
  type GetBudgetReservationsQuery,
  type ListBudgetReservationsQuery,
};

// Additional type definitions
export interface BudgetReservationsRepository {
  create(data: CreateBudgetReservations): Promise<BudgetReservations>;
  findById(id: number | string): Promise<BudgetReservations | null>;
  findMany(query: ListBudgetReservationsQuery): Promise<{
    data: BudgetReservations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetReservations,
  ): Promise<BudgetReservations | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetReservationsEntity {
  id: number;
  allocation_id: number;
  pr_id: number;
  reserved_amount: number;
  quarter: number;
  reservation_date: Date | null;
  expires_date: Date;
  is_released: boolean | null;
  released_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetReservations module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetReservationsErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_RESERVATIONS_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_RESERVATIONS_VALIDATION_ERROR',

  // Business rule validation errors (422)
  INVALID_VALUE_RESERVED_AMOUNT = 'BUDGET_RESERVATIONS_INVALID_VALUE_RESERVED_AMOUNT',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetReservationsErrorMessages: Record<
  BudgetReservationsErrorCode,
  string
> = {
  [BudgetReservationsErrorCode.NOT_FOUND]: 'BudgetReservations not found',
  [BudgetReservationsErrorCode.VALIDATION_ERROR]:
    'BudgetReservations validation failed',

  // Business rule messages
  [BudgetReservationsErrorCode.INVALID_VALUE_RESERVED_AMOUNT]:
    'reserved_amount must be a positive number',
};
