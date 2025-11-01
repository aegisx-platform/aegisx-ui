/**
 * Audit System Types
 *
 * Type definitions for audit system (login attempts and file audit)
 */

// ============================================================================
// Login Attempts Types
// ============================================================================

export type LoginFailureReason =
  | 'invalid_credentials'
  | 'account_locked'
  | 'invalid_email'
  | 'account_disabled'
  | 'email_not_verified'
  | 'rate_limit_exceeded'
  | 'invalid_password'
  | 'expired_session'
  | 'mfa_required'
  | 'unknown';

export interface LoginAttempt {
  id: string;
  userId?: string | null;
  email?: string;
  username?: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  failureReason?: LoginFailureReason;
  createdAt: string;
}

export interface LoginAttemptsQuery {
  userId?: string;
  email?: string;
  username?: string;
  success?: boolean;
  failureReason?: LoginFailureReason;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'email' | 'success';
  sortOrder?: 'asc' | 'desc';
}

export interface LoginAttemptsStats {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  uniqueUsers: number;
  uniqueIPs: number;
  byFailureReason: Record<LoginFailureReason, number>;
  recentAttempts: LoginAttempt[];
}

// ============================================================================
// File Audit Types
// ============================================================================

export type FileOperation =
  | 'upload'
  | 'download'
  | 'delete'
  | 'view'
  | 'update'
  | 'move'
  | 'copy'
  | 'share'
  | 'unshare'
  | 'export';

export interface FileAuditLog {
  id: string;
  fileId: string;
  userId?: string | null;
  operation: FileOperation;
  success: boolean;
  fileName: string;
  fileSize?: number;
  filePath?: string;
  mimeType?: string;
  ipAddress: string;
  userAgent?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface FileAuditQuery {
  fileId?: string;
  userId?: string;
  operation?: FileOperation;
  success?: boolean;
  fileName?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'fileName' | 'operation';
  sortOrder?: 'asc' | 'desc';
}

export interface FileAuditStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  byOperation: Record<FileOperation, number>;
  totalFilesAccessed: number;
  uniqueUsers: number;
  recentActivity: FileAuditLog[];
}

// ============================================================================
// Common Response Types
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LoginAttemptsResponse {
  success: true;
  data: LoginAttempt[];
  pagination: PaginationMeta;
}

export interface LoginAttemptResponse {
  success: true;
  data: LoginAttempt;
  message: string;
}

export interface LoginAttemptsStatsResponse {
  success: true;
  data: LoginAttemptsStats;
}

export interface FileAuditResponse {
  success: true;
  data: FileAuditLog[];
  pagination: PaginationMeta;
}

export interface FileAuditLogResponse {
  success: true;
  data: FileAuditLog;
  message: string;
}

export interface FileAuditStatsResponse {
  success: true;
  data: FileAuditStats;
}

export interface CleanupQuery {
  days?: number;
  date?: string;
}

export interface CleanupResponse {
  success: true;
  data: {
    deletedCount: number;
  };
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: any;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

export interface LoginAttemptsState {
  loginAttempts: LoginAttempt[];
  stats: LoginAttemptsStats | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

export interface FileAuditState {
  fileAuditLogs: FileAuditLog[];
  stats: FileAuditStats | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}
