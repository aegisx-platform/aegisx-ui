// Import and re-export types from schemas for convenience
import {
  type Authors,
  type CreateAuthors,
  type UpdateAuthors,
  type AuthorsIdParam,
  type GetAuthorsQuery,
  type ListAuthorsQuery,
  type ImportOptions,
  type ImportRowPreview,
  type ImportSummary,
  type ValidateImportResponse,
  type ExecuteImportRequest,
  type ImportProgress,
  type ImportJobSummary,
  type ImportError,
  type ImportJob,
} from '../schemas/authors.schemas';

export {
  type Authors,
  type CreateAuthors,
  type UpdateAuthors,
  type AuthorsIdParam,
  type GetAuthorsQuery,
  type ListAuthorsQuery,
  type ImportOptions,
  type ImportRowPreview,
  type ImportSummary,
  type ValidateImportResponse,
  type ExecuteImportRequest,
  type ImportProgress,
  type ImportJobSummary,
  type ImportError,
  type ImportJob,
};

// Additional type definitions
export interface AuthorsRepository {
  create(data: CreateAuthors): Promise<Authors>;
  findById(id: number | string): Promise<Authors | null>;
  findMany(query: ListAuthorsQuery): Promise<{
    data: Authors[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(id: number | string, data: UpdateAuthors): Promise<Authors | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface AuthorsEntity {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  birth_date: Date | null;
  country: string | null;
  active: boolean | null;
  created_at: Date;
  updated_at: Date;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for Authors module
 * Auto-generated based on database constraints and business rules
 */
export enum AuthorsErrorCode {
  // Standard errors
  NOT_FOUND = 'AUTHORS_NOT_FOUND',
  VALIDATION_ERROR = 'AUTHORS_VALIDATION_ERROR',

  // Duplicate errors (409 Conflict)
  DUPLICATE_EMAIL = 'AUTHORS_DUPLICATE_EMAIL',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'AUTHORS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_BOOKS = 'AUTHORS_CANNOT_DELETE_HAS_BOOKS',

  // Business rule validation errors (422)
  INVALID_EMAIL_EMAIL = 'AUTHORS_INVALID_EMAIL_EMAIL',
  INVALID_DATE_BIRTH_DATE = 'AUTHORS_INVALID_DATE_BIRTH_DATE',
}

/**
 * Error messages mapped to error codes
 */
export const AuthorsErrorMessages: Record<AuthorsErrorCode, string> = {
  [AuthorsErrorCode.NOT_FOUND]: 'Authors not found',
  [AuthorsErrorCode.VALIDATION_ERROR]: 'Authors validation failed',

  // Duplicate error messages
  [AuthorsErrorCode.DUPLICATE_EMAIL]: 'Email already exists',

  // Delete validation messages
  [AuthorsErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete authors - has related records',
  [AuthorsErrorCode.CANNOT_DELETE_HAS_BOOKS]:
    'Cannot delete authors - has books references',

  // Business rule messages
  [AuthorsErrorCode.INVALID_EMAIL_EMAIL]: 'email must be a valid email address',
  [AuthorsErrorCode.INVALID_DATE_BIRTH_DATE]:
    'birth_date cannot be in the future',
};
