// ===== CORE ENTITY TYPES =====

export interface Companie {
  id: number;
  company_code: string;
  company_name: string;
  tax_id?: string | null;
  bank_id?: number | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  is_vendor?: boolean | null;
  is_manufacturer?: boolean | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateCompanieRequest {
  company_code: string;
  company_name: string;
  tax_id?: string | null;
  bank_id?: number | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  is_vendor?: boolean | null;
  is_manufacturer?: boolean | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active?: boolean | null;
}

export interface UpdateCompanieRequest {
  company_code?: string;
  company_name?: string;
  tax_id?: string | null;
  bank_id?: number | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  is_vendor?: boolean | null;
  is_manufacturer?: boolean | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active?: boolean | null;
}

// ===== QUERY TYPES =====

export interface ListCompanieQuery {
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
  // String filtering for company_code
  company_code?: string; // Exact match
  // String filtering for company_name
  company_name?: string; // Exact match
  // String filtering for tax_id
  tax_id?: string; // Exact match
  // Numeric filtering for bank_id
  bank_id?: number; // Exact match
  bank_id_min?: number; // Range start
  bank_id_max?: number; // Range end
  // String filtering for bank_account_number
  bank_account_number?: string; // Exact match
  // String filtering for bank_account_name
  bank_account_name?: string; // Exact match
  // Boolean filtering for is_vendor
  is_vendor?: boolean;
  // Boolean filtering for is_manufacturer
  is_manufacturer?: boolean;
  // String filtering for contact_person
  contact_person?: string; // Exact match
  // String filtering for phone
  phone?: string; // Exact match
  // String filtering for email
  email?: string; // Exact match
  // String filtering for address
  address?: string; // Exact match
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
  data: Companie[];
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

export interface ImportRowPreview extends Partial<Companie> {
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

export type CompanieField = keyof Companie;
export type CompanieSortField = CompanieField;

export interface CompanieListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: CompanieField[];
  search?: string;
}
