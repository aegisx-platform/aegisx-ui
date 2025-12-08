// ===== CORE ENTITY TYPES =====

export interface BudgetReservation {
  id: number;
  allocation_id: number;
  pr_id: number;
  reserved_amount: number;
  quarter: number;
  reservation_date?: string | null;
  expires_date: string;
  is_released?: boolean | null;
  released_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateBudgetReservationRequest {
  allocation_id: number;
  pr_id: number;
  reserved_amount: number;
  quarter: number;
  reservation_date?: string | null;
  expires_date: string;
  is_released?: boolean | null;
  released_at?: string | null;
}

export interface UpdateBudgetReservationRequest {
  allocation_id?: number;
  pr_id?: number;
  reserved_amount?: number;
  quarter?: number;
  reservation_date?: string | null;
  expires_date?: string;
  is_released?: boolean | null;
  released_at?: string | null;
}

// ===== QUERY TYPES =====

export interface ListBudgetReservationQuery {
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
  // Numeric filtering for allocation_id
  allocation_id?: number; // Exact match
  allocation_id_min?: number; // Range start
  allocation_id_max?: number; // Range end
  // Numeric filtering for pr_id
  pr_id?: number; // Exact match
  pr_id_min?: number; // Range start
  pr_id_max?: number; // Range end
  // Numeric filtering for reserved_amount
  reserved_amount?: number; // Exact match
  reserved_amount_min?: number; // Range start
  reserved_amount_max?: number; // Range end
  // Numeric filtering for quarter
  quarter?: number; // Exact match
  quarter_min?: number; // Range start
  quarter_max?: number; // Range end
  // Date/DateTime filtering for reservation_date
  reservation_date?: string; // ISO date string for exact match
  reservation_date_min?: string; // ISO date string for range start
  reservation_date_max?: string; // ISO date string for range end
  // Date/DateTime filtering for expires_date
  expires_date?: string; // ISO date string for exact match
  expires_date_min?: string; // ISO date string for range start
  expires_date_max?: string; // ISO date string for range end
  // Boolean filtering for is_released
  is_released?: boolean;
  // Date/DateTime filtering for released_at
  released_at?: string; // ISO date string for exact match
  released_at_min?: string; // ISO date string for range start
  released_at_max?: string; // ISO date string for range end
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
  data: BudgetReservation[];
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

export interface ImportRowPreview extends Partial<BudgetReservation> {
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

export type BudgetReservationField = keyof BudgetReservation;
export type BudgetReservationSortField = BudgetReservationField;

export interface BudgetReservationListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: BudgetReservationField[];
  search?: string;
}
