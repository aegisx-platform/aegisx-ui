// Import and re-export types from schemas for convenience
import {
  type BudgetPlans,
  type CreateBudgetPlans,
  type UpdateBudgetPlans,
  type BudgetPlansIdParam,
  type GetBudgetPlansQuery,
  type ListBudgetPlansQuery,
} from './budget-plans.schemas';

export {
  type BudgetPlans,
  type CreateBudgetPlans,
  type UpdateBudgetPlans,
  type BudgetPlansIdParam,
  type GetBudgetPlansQuery,
  type ListBudgetPlansQuery,
};

// Additional type definitions
export interface BudgetPlansRepository {
  create(data: CreateBudgetPlans): Promise<BudgetPlans>;
  findById(id: number | string): Promise<BudgetPlans | null>;
  findMany(query: ListBudgetPlansQuery): Promise<{
    data: BudgetPlans[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetPlans,
  ): Promise<BudgetPlans | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetPlansEntity {
  id: number;
  fiscal_year: number;
  department_id: number;
  plan_name: string | null;
  total_planned_amount: number | null;
  status: any;
  approved_at: Date | null;
  approved_by: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetPlans module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetPlansErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_PLANS_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_PLANS_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BUDGET_PLANS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BUDGET_PLAN_ITEMS = 'BUDGET_PLANS_CANNOT_DELETE_HAS_BUDGET_PLAN_ITEMS',

  // Business rule validation errors (422)
  INVALID_VALUE_TOTAL_PLANNED_AMOUNT = 'BUDGET_PLANS_INVALID_VALUE_TOTAL_PLANNED_AMOUNT',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetPlansErrorMessages: Record<BudgetPlansErrorCode, string> = {
  [BudgetPlansErrorCode.NOT_FOUND]: 'BudgetPlans not found',
  [BudgetPlansErrorCode.VALIDATION_ERROR]: 'BudgetPlans validation failed',

  // Delete validation messages
  [BudgetPlansErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete budgetPlans - has related records',
  [BudgetPlansErrorCode.CANNOT_DELETE_HAS_BUDGET_PLAN_ITEMS]:
    'Cannot delete budgetPlans - has budget_plan_items references',

  // Business rule messages
  [BudgetPlansErrorCode.INVALID_VALUE_TOTAL_PLANNED_AMOUNT]:
    'total_planned_amount must be a positive number',
};
