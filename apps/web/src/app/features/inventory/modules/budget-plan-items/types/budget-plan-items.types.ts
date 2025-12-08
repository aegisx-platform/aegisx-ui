// ===== CORE ENTITY TYPES =====

export interface BudgetPlanItem {
  id: number;
  budget_plan_id: number;
  generic_id: number;
  last_year_qty?: number | null;
  two_years_ago_qty?: number | null;
  three_years_ago_qty?: number | null;
  planned_quantity: number;
  estimated_unit_price: number;
  total_planned_value: number;
  q1_planned_qty?: number | null;
  q2_planned_qty?: number | null;
  q3_planned_qty?: number | null;
  q4_planned_qty?: number | null;
  q1_purchased_qty?: number | null;
  q2_purchased_qty?: number | null;
  q3_purchased_qty?: number | null;
  q4_purchased_qty?: number | null;
  total_purchased_qty?: number | null;
  total_purchased_value?: number | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateBudgetPlanItemRequest {
  budget_plan_id: number;
  generic_id: number;
  last_year_qty?: number | null;
  two_years_ago_qty?: number | null;
  three_years_ago_qty?: number | null;
  planned_quantity: number;
  estimated_unit_price: number;
  total_planned_value: number;
  q1_planned_qty?: number | null;
  q2_planned_qty?: number | null;
  q3_planned_qty?: number | null;
  q4_planned_qty?: number | null;
  q1_purchased_qty?: number | null;
  q2_purchased_qty?: number | null;
  q3_purchased_qty?: number | null;
  q4_purchased_qty?: number | null;
  total_purchased_qty?: number | null;
  total_purchased_value?: number | null;
  notes?: string | null;
}

export interface UpdateBudgetPlanItemRequest {
  budget_plan_id?: number;
  generic_id?: number;
  last_year_qty?: number | null;
  two_years_ago_qty?: number | null;
  three_years_ago_qty?: number | null;
  planned_quantity?: number;
  estimated_unit_price?: number;
  total_planned_value?: number;
  q1_planned_qty?: number | null;
  q2_planned_qty?: number | null;
  q3_planned_qty?: number | null;
  q4_planned_qty?: number | null;
  q1_purchased_qty?: number | null;
  q2_purchased_qty?: number | null;
  q3_purchased_qty?: number | null;
  q4_purchased_qty?: number | null;
  total_purchased_qty?: number | null;
  total_purchased_value?: number | null;
  notes?: string | null;
}

// ===== QUERY TYPES =====

export interface ListBudgetPlanItemQuery {
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
  // Numeric filtering for budget_plan_id
  budget_plan_id?: number; // Exact match
  budget_plan_id_min?: number; // Range start
  budget_plan_id_max?: number; // Range end
  // Numeric filtering for generic_id
  generic_id?: number; // Exact match
  generic_id_min?: number; // Range start
  generic_id_max?: number; // Range end
  // Numeric filtering for last_year_qty
  last_year_qty?: number; // Exact match
  last_year_qty_min?: number; // Range start
  last_year_qty_max?: number; // Range end
  // Numeric filtering for two_years_ago_qty
  two_years_ago_qty?: number; // Exact match
  two_years_ago_qty_min?: number; // Range start
  two_years_ago_qty_max?: number; // Range end
  // Numeric filtering for three_years_ago_qty
  three_years_ago_qty?: number; // Exact match
  three_years_ago_qty_min?: number; // Range start
  three_years_ago_qty_max?: number; // Range end
  // Numeric filtering for planned_quantity
  planned_quantity?: number; // Exact match
  planned_quantity_min?: number; // Range start
  planned_quantity_max?: number; // Range end
  // Numeric filtering for estimated_unit_price
  estimated_unit_price?: number; // Exact match
  estimated_unit_price_min?: number; // Range start
  estimated_unit_price_max?: number; // Range end
  // Numeric filtering for total_planned_value
  total_planned_value?: number; // Exact match
  total_planned_value_min?: number; // Range start
  total_planned_value_max?: number; // Range end
  // Numeric filtering for q1_planned_qty
  q1_planned_qty?: number; // Exact match
  q1_planned_qty_min?: number; // Range start
  q1_planned_qty_max?: number; // Range end
  // Numeric filtering for q2_planned_qty
  q2_planned_qty?: number; // Exact match
  q2_planned_qty_min?: number; // Range start
  q2_planned_qty_max?: number; // Range end
  // Numeric filtering for q3_planned_qty
  q3_planned_qty?: number; // Exact match
  q3_planned_qty_min?: number; // Range start
  q3_planned_qty_max?: number; // Range end
  // Numeric filtering for q4_planned_qty
  q4_planned_qty?: number; // Exact match
  q4_planned_qty_min?: number; // Range start
  q4_planned_qty_max?: number; // Range end
  // Numeric filtering for q1_purchased_qty
  q1_purchased_qty?: number; // Exact match
  q1_purchased_qty_min?: number; // Range start
  q1_purchased_qty_max?: number; // Range end
  // Numeric filtering for q2_purchased_qty
  q2_purchased_qty?: number; // Exact match
  q2_purchased_qty_min?: number; // Range start
  q2_purchased_qty_max?: number; // Range end
  // Numeric filtering for q3_purchased_qty
  q3_purchased_qty?: number; // Exact match
  q3_purchased_qty_min?: number; // Range start
  q3_purchased_qty_max?: number; // Range end
  // Numeric filtering for q4_purchased_qty
  q4_purchased_qty?: number; // Exact match
  q4_purchased_qty_min?: number; // Range start
  q4_purchased_qty_max?: number; // Range end
  // Numeric filtering for total_purchased_qty
  total_purchased_qty?: number; // Exact match
  total_purchased_qty_min?: number; // Range start
  total_purchased_qty_max?: number; // Range end
  // Numeric filtering for total_purchased_value
  total_purchased_value?: number; // Exact match
  total_purchased_value_min?: number; // Range start
  total_purchased_value_max?: number; // Range end
  // String filtering for notes
  notes?: string; // Exact match
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
  data: BudgetPlanItem[];
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

export interface ImportRowPreview extends Partial<BudgetPlanItem> {
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

export type BudgetPlanItemField = keyof BudgetPlanItem;
export type BudgetPlanItemSortField = BudgetPlanItemField;

export interface BudgetPlanItemListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: BudgetPlanItemField[];
  search?: string;
}
