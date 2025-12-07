// Import and re-export types from schemas for convenience
import {
  type BudgetCategories,
  type CreateBudgetCategories,
  type UpdateBudgetCategories,
  type BudgetCategoriesIdParam,
  type GetBudgetCategoriesQuery,
  type ListBudgetCategoriesQuery,
} from './budget-categories.schemas';

export {
  type BudgetCategories,
  type CreateBudgetCategories,
  type UpdateBudgetCategories,
  type BudgetCategoriesIdParam,
  type GetBudgetCategoriesQuery,
  type ListBudgetCategoriesQuery,
};

// Additional type definitions
export interface BudgetCategoriesRepository {
  create(data: CreateBudgetCategories): Promise<BudgetCategories>;
  findById(id: number | string): Promise<BudgetCategories | null>;
  findMany(query: ListBudgetCategoriesQuery): Promise<{
    data: BudgetCategories[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetCategories,
  ): Promise<BudgetCategories | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetCategoriesEntity {
  id: number;
  category_code: string;
  category_name: string;
  accounting_code: string | null;
  description: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetCategories module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetCategoriesErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_CATEGORIES_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_CATEGORIES_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BUDGET_CATEGORIES_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BUDGETS = 'BUDGET_CATEGORIES_CANNOT_DELETE_HAS_BUDGETS',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetCategoriesErrorMessages: Record<
  BudgetCategoriesErrorCode,
  string
> = {
  [BudgetCategoriesErrorCode.NOT_FOUND]: 'BudgetCategories not found',
  [BudgetCategoriesErrorCode.VALIDATION_ERROR]:
    'BudgetCategories validation failed',

  // Delete validation messages
  [BudgetCategoriesErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete budgetCategories - has related records',
  [BudgetCategoriesErrorCode.CANNOT_DELETE_HAS_BUDGETS]:
    'Cannot delete budgetCategories - has budgets references',
};
