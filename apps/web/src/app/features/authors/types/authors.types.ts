// ===== CORE ENTITY TYPES =====

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  birth_date?: string | null;
  country?: string | null;
  active?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAuthorRequest {
  name: string;
  email: string;
  bio?: string | null;
  birth_date?: string | null;
  country?: string | null;
  active?: boolean | null;
}

export interface UpdateAuthorRequest {
  name?: string;
  email?: string;
  bio?: string | null;
  birth_date?: string | null;
  country?: string | null;
  active?: boolean | null;
}

// ===== QUERY TYPES =====

export interface ListAuthorQuery {
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
  // String filtering for name
  name?: string; // Exact match
  // String filtering for email
  email?: string; // Exact match
  // String filtering for bio
  bio?: string; // Exact match
  // Date/DateTime filtering for birth_date
  birth_date?: string; // ISO date string for exact match
  birth_date_min?: string; // ISO date string for range start
  birth_date_max?: string; // ISO date string for range end
  // String filtering for country
  country?: string; // Exact match
  // Boolean filtering for active
  active?: boolean;
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
  data: Author[];
  summary: BulkOperationSummary;
  message: string;
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

export interface ImportRowPreview {
  rowNumber: number;
  status: 'valid' | 'warning' | 'error' | 'duplicate';
  action: 'create' | 'update' | 'skip';
  data: Partial<Author>;
  errors: ImportError[];
  warnings: ImportError[];
}

export interface ImportSummary {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
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
  sessionId: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  progress: ImportProgress;
  summary: ImportSummary;
  errors: Array<{
    rowNumber: number;
    field: string;
    message: string;
    data?: any;
  }>;
  startedAt: string;
  completedAt?: string;
  estimatedCompletion?: string;
  duration?: number;
  userId?: string;
}

// ===== UTILITY TYPES =====

export type AuthorField = keyof Author;
export type AuthorSortField = AuthorField;

export interface AuthorListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: AuthorField[];
  search?: string;
}
