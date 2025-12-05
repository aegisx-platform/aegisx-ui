// Import and re-export types from schemas for convenience
import {
  type BudgetTypes,
  type CreateBudgetTypes,
  type UpdateBudgetTypes,
  type BudgetTypesIdParam,
  type GetBudgetTypesQuery,
  type ListBudgetTypesQuery,
} from '../schemas/budget-types.schemas';

export {
  type BudgetTypes,
  type CreateBudgetTypes,
  type UpdateBudgetTypes,
  type BudgetTypesIdParam,
  type GetBudgetTypesQuery,
  type ListBudgetTypesQuery,
};

// Additional type definitions
export interface BudgetTypesRepository {
  create(data: CreateBudgetTypes): Promise<BudgetTypes>;
  findById(id: number | string): Promise<BudgetTypes | null>;
  findMany(query: ListBudgetTypesQuery): Promise<{
    data: BudgetTypes[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetTypes,
  ): Promise<BudgetTypes | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetTypesEntity {
  id: number;
  type_code: string;
  type_name: string;
  budget_class: any;
  description: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetTypes module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetTypesErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_TYPES_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_TYPES_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BUDGET_TYPES_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BUDGETS = 'BUDGET_TYPES_CANNOT_DELETE_HAS_BUDGETS',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetTypesErrorMessages: Record<BudgetTypesErrorCode, string> = {
  [BudgetTypesErrorCode.NOT_FOUND]: 'BudgetTypes not found',
  [BudgetTypesErrorCode.VALIDATION_ERROR]: 'BudgetTypes validation failed',

  // Delete validation messages
  [BudgetTypesErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete budgetTypes - has related records',
  [BudgetTypesErrorCode.CANNOT_DELETE_HAS_BUDGETS]:
    'Cannot delete budgetTypes - has budgets references',
};
