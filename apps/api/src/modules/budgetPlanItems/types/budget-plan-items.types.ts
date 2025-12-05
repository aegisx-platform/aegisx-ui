// Import and re-export types from schemas for convenience
import {
  type BudgetPlanItems,
  type CreateBudgetPlanItems,
  type UpdateBudgetPlanItems,
  type BudgetPlanItemsIdParam,
  type GetBudgetPlanItemsQuery,
  type ListBudgetPlanItemsQuery,
} from '../schemas/budget-plan-items.schemas';

export {
  type BudgetPlanItems,
  type CreateBudgetPlanItems,
  type UpdateBudgetPlanItems,
  type BudgetPlanItemsIdParam,
  type GetBudgetPlanItemsQuery,
  type ListBudgetPlanItemsQuery,
};

// Additional type definitions
export interface BudgetPlanItemsRepository {
  create(data: CreateBudgetPlanItems): Promise<BudgetPlanItems>;
  findById(id: number | string): Promise<BudgetPlanItems | null>;
  findMany(query: ListBudgetPlanItemsQuery): Promise<{
    data: BudgetPlanItems[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetPlanItems,
  ): Promise<BudgetPlanItems | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetPlanItemsEntity {
  id: number;
  budget_plan_id: number;
  generic_id: number;
  last_year_qty: number | null;
  two_years_ago_qty: number | null;
  three_years_ago_qty: number | null;
  planned_quantity: number;
  estimated_unit_price: number;
  total_planned_value: number;
  q1_planned_qty: number | null;
  q2_planned_qty: number | null;
  q3_planned_qty: number | null;
  q4_planned_qty: number | null;
  q1_purchased_qty: number | null;
  q2_purchased_qty: number | null;
  q3_purchased_qty: number | null;
  q4_purchased_qty: number | null;
  total_purchased_qty: number | null;
  total_purchased_value: number | null;
  notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetPlanItems module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetPlanItemsErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_PLAN_ITEMS_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_PLAN_ITEMS_VALIDATION_ERROR',

  // Business rule validation errors (422)
  INVALID_VALUE_PLANNED_QUANTITY = 'BUDGET_PLAN_ITEMS_INVALID_VALUE_PLANNED_QUANTITY',
  INVALID_VALUE_ESTIMATED_UNIT_PRICE = 'BUDGET_PLAN_ITEMS_INVALID_VALUE_ESTIMATED_UNIT_PRICE',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetPlanItemsErrorMessages: Record<
  BudgetPlanItemsErrorCode,
  string
> = {
  [BudgetPlanItemsErrorCode.NOT_FOUND]: 'BudgetPlanItems not found',
  [BudgetPlanItemsErrorCode.VALIDATION_ERROR]:
    'BudgetPlanItems validation failed',

  // Business rule messages
  [BudgetPlanItemsErrorCode.INVALID_VALUE_PLANNED_QUANTITY]:
    'planned_quantity must be a positive number',
  [BudgetPlanItemsErrorCode.INVALID_VALUE_ESTIMATED_UNIT_PRICE]:
    'estimated_unit_price must be a positive number',
};
