// ===== CORE ENTITY TYPES =====

export interface ContractItem {
  id: number;
  contract_id: number;
  generic_id: number;
  agreed_unit_price: number;
  quantity_limit?: number | null;
  quantity_used?: number | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateContractItemRequest {
  contract_id: number;
  generic_id: number;
  agreed_unit_price: number;
  quantity_limit?: number | null;
  quantity_used?: number | null;
  notes?: string | null;
}

export interface UpdateContractItemRequest {
  contract_id?: number;
  generic_id?: number;
  agreed_unit_price?: number;
  quantity_limit?: number | null;
  quantity_used?: number | null;
  notes?: string | null;
}

// ===== QUERY TYPES =====

export interface ListContractItemQuery {
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
  // Numeric filtering for contract_id
  contract_id?: number; // Exact match
  contract_id_min?: number; // Range start
  contract_id_max?: number; // Range end
  // Numeric filtering for generic_id
  generic_id?: number; // Exact match
  generic_id_min?: number; // Range start
  generic_id_max?: number; // Range end
  // Numeric filtering for agreed_unit_price
  agreed_unit_price?: number; // Exact match
  agreed_unit_price_min?: number; // Range start
  agreed_unit_price_max?: number; // Range end
  // Numeric filtering for quantity_limit
  quantity_limit?: number; // Exact match
  quantity_limit_min?: number; // Range start
  quantity_limit_max?: number; // Range end
  // Numeric filtering for quantity_used
  quantity_used?: number; // Exact match
  quantity_used_min?: number; // Range start
  quantity_used_max?: number; // Range end
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
  data: ContractItem[];
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

export interface ImportRowPreview extends Partial<ContractItem> {
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

export type ContractItemField = keyof ContractItem;
export type ContractItemSortField = ContractItemField;

export interface ContractItemListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: ContractItemField[];
  search?: string;
}
