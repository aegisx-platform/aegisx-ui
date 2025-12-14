// Import and re-export types from schemas for convenience
import {
  type Bank,
  type CreateBank,
  type UpdateBank,
  type BankIdParam,
  type GetBankQuery,
  type ListBankQuery,
} from './bank.schemas';

export {
  type Bank,
  type CreateBank,
  type UpdateBank,
  type BankIdParam,
  type GetBankQuery,
  type ListBankQuery,
};

// Additional type definitions
export interface BankRepository {
  create(data: CreateBank): Promise<Bank>;
  findById(id: number | string): Promise<Bank | null>;
  findMany(query: ListBankQuery): Promise<{
    data: Bank[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  update(id: number | string, data: UpdateBank): Promise<Bank | null>;
  delete(id: number | string): Promise<boolean>;
}

// Database entity type (matches database table structure exactly)
export interface BankEntity {
  id: number;
  bank_code: string;
  bank_name: string;
  swift_code: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

// ===== ERROR HANDLING: ERROR CODES =====
/**
 * Error codes for Bank module
 * Auto-generated based on database constraints and business rules
 */
export enum BankErrorCode {
  // Standard errors
  NOT_FOUND = 'BANK_NOT_FOUND',
  VALIDATION_ERROR = 'BANK_VALIDATION_ERROR',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'BANK_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_COMPANIES = 'BANK_CANNOT_DELETE_HAS_COMPANIES',
}

/**
 * Error messages mapped to error codes
 */
export const BankErrorMessages: Record<BankErrorCode, string> = {
  [BankErrorCode.NOT_FOUND]: 'Bank not found',
  [BankErrorCode.VALIDATION_ERROR]: 'Bank validation failed',

  // Delete validation messages
  [BankErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete bank - has related records',
  [BankErrorCode.CANNOT_DELETE_HAS_COMPANIES]:
    'Cannot delete bank - has companies references',
};
