import { FastifyInstance, FastifyRequest } from 'fastify';

/**
 * File Operation Type
 */
export enum FileOperation {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
  REVOKE_SHARE = 'revoke_share',
  PROCESS_IMAGE = 'process_image',
  GENERATE_THUMBNAIL = 'generate_thumbnail',
  GENERATE_SIGNED_URL = 'generate_signed_url',
  CLEANUP = 'cleanup',
  RESTORE = 'restore',
}

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id?: string; // Database ID (auto-generated)
  fileId: string;
  userId: string;
  operation: FileOperation;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>; // Additional context
  duration?: number; // Operation duration in ms
  fileSize?: number; // For upload/download operations
  fileName?: string; // Original file name
  category?: string; // File category
}

/**
 * Audit Log Query
 */
export interface AuditLogQuery {
  fileId?: string;
  userId?: string;
  operation?: FileOperation;
  startDate?: Date;
  endDate?: Date;
  success?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Audit Log Statistics
 */
export interface AuditLogStats {
  totalOperations: number;
  operationsByType: Record<FileOperation, number>;
  successRate: number;
  averageDuration: number;
  totalBytesTransferred: number;
  uniqueUsers: number;
  uniqueFiles: number;
}

/**
 * AuditLogService
 *
 * Tracks and logs all file operations for compliance and security monitoring.
 *
 * Features:
 * - Comprehensive operation logging (upload, download, delete, share, etc.)
 * - User action tracking with timestamps
 * - IP address and user agent recording
 * - Operation duration tracking
 * - Success/failure tracking with error messages
 * - Flexible query interface
 * - Statistical analysis
 *
 * Use Cases:
 * - Compliance (HIPAA, GDPR, audit trails)
 * - Security monitoring (detect suspicious activity)
 * - Usage analytics (understand file access patterns)
 * - Troubleshooting (investigate errors)
 * - User activity reports
 *
 * Example Usage:
 * ```typescript
 * const service = new AuditLogService(fastify);
 *
 * // Log file upload
 * await service.logOperation({
 *   fileId: file.id,
 *   userId: user.id,
 *   operation: FileOperation.UPLOAD,
 *   success: true,
 *   metadata: { fileName: 'report.pdf', category: 'document' },
 *   request
 * });
 *
 * // Query audit logs
 * const logs = await service.queryLogs({
 *   userId: user.id,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   limit: 100
 * });
 *
 * // Get statistics
 * const stats = await service.getStats({
 *   startDate: lastMonth,
 *   endDate: now
 * });
 * ```
 */
export class AuditLogService {
  constructor(private fastify?: FastifyInstance) {}

  /**
   * Log a file operation
   *
   * @param entry - Audit log entry (without ID and timestamp)
   * @param request - Optional Fastify request for IP/user agent extraction
   * @returns Created audit log entry with ID
   */
  async logOperation(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp'>,
    request?: FastifyRequest,
  ): Promise<AuditLogEntry> {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
      ipAddress: request ? this.extractIpAddress(request) : undefined,
      userAgent: request ? this.extractUserAgent(request) : undefined,
    };

    // TODO: Save to database (file_audit_logs table)
    // const savedEntry = await this.saveAuditLog(logEntry);

    // Log to Fastify logger for immediate visibility
    if (this.fastify) {
      const logLevel = logEntry.success ? 'info' : 'warn';
      this.fastify.log[logLevel](
        {
          auditLog: logEntry,
        },
        `File operation: ${logEntry.operation} - ${logEntry.success ? 'SUCCESS' : 'FAILED'}`,
      );
    }

    return logEntry;
  }

  /**
   * Log successful operation
   *
   * Convenience method for successful operations.
   */
  async logSuccess(
    fileId: string,
    userId: string,
    operation: FileOperation,
    metadata?: Record<string, any>,
    request?: FastifyRequest,
  ): Promise<AuditLogEntry> {
    return this.logOperation(
      {
        fileId,
        userId,
        operation,
        success: true,
        metadata,
      },
      request,
    );
  }

  /**
   * Log failed operation
   *
   * Convenience method for failed operations.
   */
  async logFailure(
    fileId: string,
    userId: string,
    operation: FileOperation,
    errorMessage: string,
    metadata?: Record<string, any>,
    request?: FastifyRequest,
  ): Promise<AuditLogEntry> {
    return this.logOperation(
      {
        fileId,
        userId,
        operation,
        success: false,
        errorMessage,
        metadata,
      },
      request,
    );
  }

  /**
   * Log operation with duration tracking
   *
   * @param entry - Audit log entry
   * @param startTime - Operation start time
   * @param request - Optional Fastify request
   */
  async logOperationWithDuration(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'duration'>,
    startTime: number,
    request?: FastifyRequest,
  ): Promise<AuditLogEntry> {
    const duration = Date.now() - startTime;

    return this.logOperation(
      {
        ...entry,
        duration,
      },
      request,
    );
  }

  /**
   * Query audit logs
   *
   * @param query - Query parameters
   * @returns Matching audit log entries
   */
  async queryLogs(_query: AuditLogQuery): Promise<AuditLogEntry[]> {
    // TODO: Implement database query
    // const logs = await this.queryAuditLogs(query);
    // return logs;

    // Placeholder: Return empty array
    return [];
  }

  /**
   * Get audit log statistics
   *
   * @param query - Query parameters (date range, etc.)
   * @returns Audit log statistics
   */
  async getStats(_query: Partial<AuditLogQuery>): Promise<AuditLogStats> {
    // TODO: Implement database aggregation
    // const stats = await this.calculateStats(query);
    // return stats;

    // Placeholder: Return empty stats
    return {
      totalOperations: 0,
      operationsByType: {} as Record<FileOperation, number>,
      successRate: 0,
      averageDuration: 0,
      totalBytesTransferred: 0,
      uniqueUsers: 0,
      uniqueFiles: 0,
    };
  }

  /**
   * Get user activity summary
   *
   * @param userId - User ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns User activity summary
   */
  async getUserActivity(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalOperations: number;
    uploads: number;
    downloads: number;
    deletions: number;
    shares: number;
    failedOperations: number;
  }> {
    const logs = await this.queryLogs({
      userId,
      startDate,
      endDate,
    });

    const uploads = logs.filter(
      (l) => l.operation === FileOperation.UPLOAD,
    ).length;
    const downloads = logs.filter(
      (l) => l.operation === FileOperation.DOWNLOAD,
    ).length;
    const deletions = logs.filter(
      (l) => l.operation === FileOperation.DELETE,
    ).length;
    const shares = logs.filter(
      (l) => l.operation === FileOperation.SHARE,
    ).length;
    const failedOperations = logs.filter((l) => !l.success).length;

    return {
      totalOperations: logs.length,
      uploads,
      downloads,
      deletions,
      shares,
      failedOperations,
    };
  }

  /**
   * Get file access history
   *
   * @param fileId - File ID
   * @param limit - Maximum number of entries
   * @returns Recent access history
   */
  async getFileHistory(
    fileId: string,
    limit: number = 50,
  ): Promise<AuditLogEntry[]> {
    return this.queryLogs({
      fileId,
      limit,
    });
  }

  /**
   * Detect suspicious activity
   *
   * Identifies potentially suspicious patterns:
   * - High failure rates
   * - Unusual access patterns
   * - Bulk operations from single user
   *
   * @param userId - User ID to check
   * @param timeWindowMinutes - Time window for analysis
   * @returns Suspicious activity indicators
   */
  async detectSuspiciousActivity(
    userId: string,
    timeWindowMinutes: number = 60,
  ): Promise<{
    isSuspicious: boolean;
    reasons: string[];
    failureRate: number;
    operationCount: number;
  }> {
    const startDate = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const logs = await this.queryLogs({
      userId,
      startDate,
    });

    const reasons: string[] = [];
    const failureCount = logs.filter((l) => !l.success).length;
    const failureRate = logs.length > 0 ? failureCount / logs.length : 0;

    // High failure rate (>30%)
    if (failureRate > 0.3 && logs.length > 5) {
      reasons.push(`High failure rate: ${(failureRate * 100).toFixed(1)}%`);
    }

    // Excessive operations (>100 in time window)
    if (logs.length > 100) {
      reasons.push(
        `Excessive operations: ${logs.length} in ${timeWindowMinutes} minutes`,
      );
    }

    // Multiple failed deletions
    const failedDeletions = logs.filter(
      (l) => l.operation === FileOperation.DELETE && !l.success,
    ).length;
    if (failedDeletions > 5) {
      reasons.push(`Multiple failed deletions: ${failedDeletions}`);
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
      failureRate,
      operationCount: logs.length,
    };
  }

  /**
   * Clean up old audit logs
   *
   * @param retentionDays - Number of days to retain logs
   * @returns Number of deleted logs
   */
  async cleanupOldLogs(_retentionDays: number = 90): Promise<number> {
    // TODO: Implement database deletion
    // const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    // const deletedCount = await this.deleteLogsOlderThan(cutoffDate);
    // return deletedCount;

    return 0;
  }

  /**
   * Extract IP address from request
   */
  private extractIpAddress(request: FastifyRequest): string | undefined {
    // Check X-Forwarded-For header (proxy/load balancer)
    const forwardedFor = request.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(',')[0];
      return ips.trim();
    }

    // Check X-Real-IP header
    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fallback to request IP
    return request.ip;
  }

  /**
   * Extract user agent from request
   */
  private extractUserAgent(request: FastifyRequest): string | undefined {
    const userAgent = request.headers['user-agent'];
    return Array.isArray(userAgent) ? userAgent[0] : userAgent;
  }

  /**
   * Create audit log entry builder
   *
   * Fluent API for building audit log entries.
   */
  createEntryBuilder(fileId: string, userId: string): AuditLogEntryBuilder {
    return new AuditLogEntryBuilder(this, fileId, userId);
  }
}

/**
 * Audit Log Entry Builder
 *
 * Fluent API for building audit log entries.
 */
class AuditLogEntryBuilder {
  private entry: Partial<AuditLogEntry>;
  private startTime?: number;
  private request?: FastifyRequest;

  constructor(
    private service: AuditLogService,
    fileId: string,
    userId: string,
  ) {
    this.entry = {
      fileId,
      userId,
      success: true, // Default to success
    };
  }

  operation(op: FileOperation): this {
    this.entry.operation = op;
    return this;
  }

  success(value: boolean): this {
    this.entry.success = value;
    return this;
  }

  error(message: string): this {
    this.entry.success = false;
    this.entry.errorMessage = message;
    return this;
  }

  metadata(data: Record<string, any>): this {
    this.entry.metadata = { ...this.entry.metadata, ...data };
    return this;
  }

  fileSize(bytes: number): this {
    this.entry.fileSize = bytes;
    return this;
  }

  fileName(name: string): this {
    this.entry.fileName = name;
    return this;
  }

  category(cat: string): this {
    this.entry.category = cat;
    return this;
  }

  withRequest(req: FastifyRequest): this {
    this.request = req;
    return this;
  }

  trackDuration(): this {
    this.startTime = Date.now();
    return this;
  }

  async log(): Promise<AuditLogEntry> {
    if (!this.entry.operation) {
      throw new Error('Operation is required for audit log');
    }

    if (this.startTime !== undefined) {
      return this.service.logOperationWithDuration(
        this.entry as Omit<AuditLogEntry, 'id' | 'timestamp' | 'duration'>,
        this.startTime,
        this.request,
      );
    }

    return this.service.logOperation(
      this.entry as Omit<AuditLogEntry, 'id' | 'timestamp'>,
      this.request,
    );
  }
}
