// Import and re-export types from schemas for convenience
import {
  type BudgetRequests,
  type CreateBudgetRequests,
  type UpdateBudgetRequests,
  type BudgetRequestsIdParam,
  type GetBudgetRequestsQuery,
  type ListBudgetRequestsQuery,
} from './budget-requests.schemas';

export {
  type BudgetRequests,
  type CreateBudgetRequests,
  type UpdateBudgetRequests,
  type BudgetRequestsIdParam,
  type GetBudgetRequestsQuery,
  type ListBudgetRequestsQuery,
};

// Additional type definitions
export interface BudgetRequestsRepository {
  create(data: CreateBudgetRequests): Promise<BudgetRequests>;
  findById(id: number | string): Promise<BudgetRequests | null>;
  findMany(query: ListBudgetRequestsQuery): Promise<{
    data: BudgetRequests[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(
    id: number | string,
    data: UpdateBudgetRequests,
  ): Promise<BudgetRequests | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BudgetRequestsEntity {
  id: number;
  request_number: string;
  fiscal_year: number;
  department_id: number;
  status: any;
  total_requested_amount: number;
  justification: string | null;
  submitted_by: string | null;
  submitted_at: Date | null;
  dept_reviewed_by: string | null;
  dept_reviewed_at: Date | null;
  dept_comments: string | null;
  finance_reviewed_by: string | null;
  finance_reviewed_at: Date | null;
  finance_comments: string | null;
  rejection_reason: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_active: boolean | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for BudgetRequests module
 * Auto-generated based on database constraints and business rules
 */
export enum BudgetRequestsErrorCode {
  // Standard errors
  NOT_FOUND = 'BUDGET_REQUESTS_NOT_FOUND',
  VALIDATION_ERROR = 'BUDGET_REQUESTS_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BUDGET_REQUESTS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BUDGET_REQUEST_ITEMS = 'BUDGET_REQUESTS_CANNOT_DELETE_HAS_BUDGET_REQUEST_ITEMS',

  // Business rule validation errors (422)
  INVALID_VALUE_TOTAL_REQUESTED_AMOUNT = 'BUDGET_REQUESTS_INVALID_VALUE_TOTAL_REQUESTED_AMOUNT',
}

/**
 * Error messages mapped to error codes
 */
export const BudgetRequestsErrorMessages: Record<
  BudgetRequestsErrorCode,
  string
> = {
  [BudgetRequestsErrorCode.NOT_FOUND]: 'BudgetRequests not found',
  [BudgetRequestsErrorCode.VALIDATION_ERROR]:
    'BudgetRequests validation failed',

  // Delete validation messages
  [BudgetRequestsErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete budgetRequests - has related records',
  [BudgetRequestsErrorCode.CANNOT_DELETE_HAS_BUDGET_REQUEST_ITEMS]:
    'Cannot delete budgetRequests - has budget_request_items references',

  // Business rule messages
  [BudgetRequestsErrorCode.INVALID_VALUE_TOTAL_REQUESTED_AMOUNT]:
    'total_requested_amount must be a positive number',
};
