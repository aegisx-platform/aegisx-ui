// ===== CORE ENTITY TYPES =====

export interface DrugPackRatio {
  id: number;
  drug_id: number;
  company_id?: number | null;
  pack_size: number;
  pack_unit: string;
  unit_per_pack: number;
  pack_price?: number | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateDrugPackRatioRequest {
  drug_id: number;
  company_id?: number | null;
  pack_size: number;
  pack_unit: string;
  unit_per_pack: number;
  pack_price?: number | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
}

export interface UpdateDrugPackRatioRequest {
  drug_id?: number;
  company_id?: number | null;
  pack_size?: number;
  pack_unit?: string;
  unit_per_pack?: number;
  pack_price?: number | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
}

// ===== QUERY TYPES =====

export interface ListDrugPackRatioQuery {
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
  // Numeric filtering for drug_id
  drug_id?: number; // Exact match
  drug_id_min?: number; // Range start
  drug_id_max?: number; // Range end
  // Numeric filtering for company_id
  company_id?: number; // Exact match
  company_id_min?: number; // Range start
  company_id_max?: number; // Range end
  // Numeric filtering for pack_size
  pack_size?: number; // Exact match
  pack_size_min?: number; // Range start
  pack_size_max?: number; // Range end
  // String filtering for pack_unit
  pack_unit?: string; // Exact match
  // Numeric filtering for unit_per_pack
  unit_per_pack?: number; // Exact match
  unit_per_pack_min?: number; // Range start
  unit_per_pack_max?: number; // Range end
  // Numeric filtering for pack_price
  pack_price?: number; // Exact match
  pack_price_min?: number; // Range start
  pack_price_max?: number; // Range end
  // Boolean filtering for is_default
  is_default?: boolean;
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
  data: DrugPackRatio[];
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

export interface ImportRowPreview extends Partial<DrugPackRatio> {
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

export type DrugPackRatioField = keyof DrugPackRatio;
export type DrugPackRatioSortField = DrugPackRatioField;

export interface DrugPackRatioListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: DrugPackRatioField[];
  search?: string;
}
