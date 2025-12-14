/**
 * Core Departments Types and Error Codes
 * Base types for department management across the system
 */

// ===== ENTITY TYPES =====

/**
 * Department full entity type
 * Represents a complete department record with all fields
 */
export interface Department {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Department input type
 * Used for creating new departments (excludes id and timestamps)
 */
export interface CreateDepartment {
  code: string;
  name: string;
  parentId?: string | null;
  isActive?: boolean;
}

/**
 * Update Department input type
 * Used for updating departments (all fields optional)
 */
export interface UpdateDepartment {
  code?: string;
  name?: string;
  parentId?: string | null;
  isActive?: boolean;
}

// ===== ERROR HANDLING: ERROR CODES =====

/**
 * Error codes for Departments module
 * Standardized error identifiers for department operations
 */
export enum DepartmentsErrorCode {
  // Standard errors
  NOT_FOUND = 'DEPARTMENTS_NOT_FOUND',
  VALIDATION_ERROR = 'DEPARTMENTS_VALIDATION_ERROR',
  CODE_EXISTS = 'DEPARTMENTS_CODE_EXISTS',

  // Hierarchy validation errors
  INVALID_PARENT = 'DEPARTMENTS_INVALID_PARENT',
  CIRCULAR_HIERARCHY = 'DEPARTMENTS_CIRCULAR_HIERARCHY',

  // Delete validation errors (422 Unprocessable Entity)
  CANNOT_DELETE_HAS_REFERENCES = 'DEPARTMENTS_CANNOT_DELETE_HAS_REFERENCES',
  CANNOT_DELETE_HAS_CHILDREN = 'DEPARTMENTS_CANNOT_DELETE_HAS_CHILDREN',
  CANNOT_DELETE_HAS_USERS = 'DEPARTMENTS_CANNOT_DELETE_HAS_USERS',
}

/**
 * Error messages mapped to error codes
 * User-friendly descriptions for each error condition
 */
export const DepartmentsErrorMessages: Record<DepartmentsErrorCode, string> = {
  [DepartmentsErrorCode.NOT_FOUND]: 'Department not found',
  [DepartmentsErrorCode.VALIDATION_ERROR]: 'Department validation failed',
  [DepartmentsErrorCode.CODE_EXISTS]: 'Department code already exists',

  [DepartmentsErrorCode.INVALID_PARENT]: 'Invalid parent department',
  [DepartmentsErrorCode.CIRCULAR_HIERARCHY]:
    'Cannot create circular hierarchy in departments',

  [DepartmentsErrorCode.CANNOT_DELETE_HAS_REFERENCES]:
    'Cannot delete department - has related records',
  [DepartmentsErrorCode.CANNOT_DELETE_HAS_CHILDREN]:
    'Cannot delete department - has child departments',
  [DepartmentsErrorCode.CANNOT_DELETE_HAS_USERS]:
    'Cannot delete department - has assigned users',
};
