// ===== CORE ENTITY TYPES =====

export interface BudgetAllocation {
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
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateBudgetAllocationRequest {
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
  is_active?: boolean | null;
}

export interface UpdateBudgetAllocationRequest {
  fiscal_year?: number;
  budget_id?: number;
  department_id?: number;
  total_budget?: number;
  q1_budget?: number;
  q2_budget?: number;
  q3_budget?: number;
  q4_budget?: number;
  q1_spent?: number;
  q2_spent?: number;
  q3_spent?: number;
  q4_spent?: number;
  total_spent?: number;
  remaining_budget?: number;
  is_active?: boolean | null;
}

// ===== QUERY TYPES =====

export interface ListBudgetAllocationQuery {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  search?: string;

  // Sort
  sort?: string; // Multiple sort support: field1:desc,field2:asc

  // Field selection
  fields?: string[]; // Array of field names to return

  // Include related data
  include?: string | string[];

  // Smart field-based filters
  // Numeric filtering for fiscal_year
  fiscal_year?: number; // Exact match
  fiscal_year_min?: number; // Range start
  fiscal_year_max?: number; // Range end
  // Numeric filtering for budget_id
  budget_id?: number; // Exact match
  budget_id_min?: number; // Range start
  budget_id_max?: number; // Range end
  // Numeric filtering for department_id
  department_id?: number; // Exact match
  department_id_min?: number; // Range start
  department_id_max?: number; // Range end
  // Numeric filtering for total_budget
  total_budget?: number; // Exact match
  total_budget_min?: number; // Range start
  total_budget_max?: number; // Range end
  // Numeric filtering for q1_budget
  q1_budget?: number; // Exact match
  q1_budget_min?: number; // Range start
  q1_budget_max?: number; // Range end
  // Numeric filtering for q2_budget
  q2_budget?: number; // Exact match
  q2_budget_min?: number; // Range start
  q2_budget_max?: number; // Range end
  // Numeric filtering for q3_budget
  q3_budget?: number; // Exact match
  q3_budget_min?: number; // Range start
  q3_budget_max?: number; // Range end
  // Numeric filtering for q4_budget
  q4_budget?: number; // Exact match
  q4_budget_min?: number; // Range start
  q4_budget_max?: number; // Range end
  // Numeric filtering for q1_spent
  q1_spent?: number; // Exact match
  q1_spent_min?: number; // Range start
  q1_spent_max?: number; // Range end
  // Numeric filtering for q2_spent
  q2_spent?: number; // Exact match
  q2_spent_min?: number; // Range start
  q2_spent_max?: number; // Range end
  // Numeric filtering for q3_spent
  q3_spent?: number; // Exact match
  q3_spent_min?: number; // Range start
  q3_spent_max?: number; // Range end
  // Numeric filtering for q4_spent
  q4_spent?: number; // Exact match
  q4_spent_min?: number; // Range start
  q4_spent_max?: number; // Range end
  // Numeric filtering for total_spent
  total_spent?: number; // Exact match
  total_spent_min?: number; // Range start
  total_spent_max?: number; // Range end
  // Numeric filtering for remaining_budget
  remaining_budget?: number; // Exact match
  remaining_budget_min?: number; // Range start
  remaining_budget_max?: number; // Range end
  // Boolean filtering for is_active
  is_active?: boolean;
  // Date/DateTime filtering for created_at
  created_at?: string; // ISO date string for exact match
  created_at_min?: string; // ISO date string for range start
  created_at_max?: string; // ISO date string for range end
  // Date/DateTime filtering for updated_at
  updated_at?: string; // ISO date string for exact match
  updated_at_min?: string; // ISO date string for range start
  updated_at_max?: string; // ISO date string for range end
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
    environment: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
    environment: string;
  };
}

// ===== ENHANCED TYPES =====

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownResponse {
  options: DropdownOption[];
  total: number;
}

export interface BulkOperationSummary {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
    data?: any;
  }>;
}

export interface BulkResponse {
  success: boolean;
  data: BudgetAllocation[];
  summary: BulkOperationSummary;
  message: string;
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
    environment: string;
  };
}

// ===== FULL PACKAGE TYPES =====

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError[];
}

export interface UniquenessResponse {
  unique: boolean;
  message?: string;
}

export interface StatsResponse {
  total: number;
  // Additional stats can be added based on module needs
  [key: string]: number;
}

// ===== IMPORT TYPES =====

export interface ImportOptions {
  skipDuplicates?: boolean;
  continueOnError?: boolean;
  updateExisting?: boolean;
  dryRun?: boolean;
}

export interface ImportError {
  field: string;
  message: string;
  code?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ImportRowPreview extends Partial<BudgetAllocation> {
  rowNumber: number;
  status: 'valid' | 'warning' | 'error' | 'duplicate';
  action: 'create' | 'update' | 'skip';
  errors: ImportError[];
  warnings: ImportError[];
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicates: number;
  warnings?: number;
  willCreate?: number;
  willUpdate?: number;
  willSkip?: number;
  successful?: number;
  failed?: number;
  skipped?: number;
  created?: number;
  updated?: number;
}

export interface ValidateImportResponse {
  sessionId: string;
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  summary: ImportSummary;
  preview: ImportRowPreview[];
  expiresAt: string;
}

export interface ExecuteImportRequest {
  sessionId: string;
  options?: ImportOptions;
}

export interface ImportProgress {
  total: number;
  current: number;
  percentage: number;
}

export interface ImportJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // Progress percentage (0-100)
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  failedCount: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

// ===== UTILITY TYPES =====

export type BudgetAllocationField = keyof BudgetAllocation;
export type BudgetAllocationSortField = BudgetAllocationField;

export interface BudgetAllocationListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: BudgetAllocationField[];
  search?: string;
}
