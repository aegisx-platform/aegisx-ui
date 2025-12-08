// ===== CORE ENTITY TYPES =====

export interface Contract {
  id: number;
  contract_number: string;
  contract_type: string;
  vendor_id: number;
  start_date: string;
  end_date: string;
  total_value: number;
  remaining_value: number;
  fiscal_year: string;
  status?: string | null;
  egp_number?: string | null;
  project_number?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateContractRequest {
  contract_number: string;
  contract_type: string;
  vendor_id: number;
  start_date: string;
  end_date: string;
  total_value: number;
  remaining_value: number;
  fiscal_year: string;
  status?: string | null;
  egp_number?: string | null;
  project_number?: string | null;
  is_active?: boolean | null;
}

export interface UpdateContractRequest {
  contract_number?: string;
  contract_type?: string;
  vendor_id?: number;
  start_date?: string;
  end_date?: string;
  total_value?: number;
  remaining_value?: number;
  fiscal_year?: string;
  status?: string | null;
  egp_number?: string | null;
  project_number?: string | null;
  is_active?: boolean | null;
}

// ===== QUERY TYPES =====

export interface ListContractQuery {
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
  // String filtering for contract_number
  contract_number?: string; // Exact match
  // Numeric filtering for vendor_id
  vendor_id?: number; // Exact match
  vendor_id_min?: number; // Range start
  vendor_id_max?: number; // Range end
  // Date/DateTime filtering for start_date
  start_date?: string; // ISO date string for exact match
  start_date_min?: string; // ISO date string for range start
  start_date_max?: string; // ISO date string for range end
  // Date/DateTime filtering for end_date
  end_date?: string; // ISO date string for exact match
  end_date_min?: string; // ISO date string for range start
  end_date_max?: string; // ISO date string for range end
  // Numeric filtering for total_value
  total_value?: number; // Exact match
  total_value_min?: number; // Range start
  total_value_max?: number; // Range end
  // Numeric filtering for remaining_value
  remaining_value?: number; // Exact match
  remaining_value_min?: number; // Range start
  remaining_value_max?: number; // Range end
  // String filtering for fiscal_year
  fiscal_year?: string; // Exact match
  // String filtering for egp_number
  egp_number?: string; // Exact match
  // String filtering for project_number
  project_number?: string; // Exact match
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

export interface ImportRowPreview extends Partial<Contract> {
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

export type ContractField = keyof Contract;
export type ContractSortField = ContractField;

export interface ContractListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: ContractField[];
  search?: string;
}

// ===== BASIC BULK OPERATIONS =====

export interface BulkResponse {
  success: boolean;
  created?: number;
  updated?: number;
  deleted?: number;
  errors?: any[];
  message?: string;
}
