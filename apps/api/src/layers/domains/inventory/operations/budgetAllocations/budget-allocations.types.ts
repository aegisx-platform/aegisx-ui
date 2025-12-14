// Import and re-export types from schemas for convenience
import {
  type BudgetAllocations,
  type CreateBudgetAllocations,
  type UpdateBudgetAllocations,
  type BudgetAllocationsIdParam,
  type GetBudgetAllocationsQuery,
  type ListBudgetAllocationsQuery,
} from './budget-allocations.schemas';

export {
  type BudgetAllocations,
  type CreateBudgetAllocations,
  type UpdateBudgetAllocations,
  type BudgetAllocationsIdParam,
  type GetBudgetAllocationsQuery,
  type ListBudgetAllocationsQuery,
};

// Additional type definitions
export interface BudgetAllocationsRepository {
  create(data: CreateBudgetAllocations): Promise<BudgetAllocations>;
  findById(id: number | string): Promise<BudgetAllocations | null>;
  findMany(query: ListBudgetAllocationsQuery): Promise<{
    data: BudgetAllocations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetAllocations,
  ): Promise<BudgetAllocations | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetAllocationsEntity {
  id: number;
  fiscal_year: number;
  budget_id: number;
  department_id: number;
  total_budget: number;
  q1_budget: number;
  q2_budget: number;
  q3_budget: number;
  q4_budget: number;
  q1_spent: number;
  q2_spent: number;
  q3_spent: number;
  q4_spent: number;
  total_spent: number;
  remaining_budget: number;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetAllocations module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetAllocationsErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_ALLOCATIONS_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_ALLOCATIONS_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BUDGET_ALLOCATIONS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BUDGET_RESERVATIONS = 'BUDGET_ALLOCATIONS_CANNOT_DELETE_HAS_BUDGET_RESERVATIONS',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetAllocationsErrorMessages: Record<
  BudgetAllocationsErrorCode,
  string
> = {
  [BudgetAllocationsErrorCode.NOT_FOUND]: 'BudgetAllocations not found',
  [BudgetAllocationsErrorCode.VALIDATION_ERROR]:
    'BudgetAllocations validation failed',

  // Delete validation messages
  [BudgetAllocationsErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete budgetAllocations - has related records',
  [BudgetAllocationsErrorCode.CANNOT_DELETE_HAS_BUDGET_RESERVATIONS]:
    'Cannot delete budgetAllocations - has budget_reservations references',
};
