import { Knex } from 'knex';
import {
  BaseAuditRepository,
  BaseAuditQuery,
  FieldMapping,
} from '../base/base.repository';
import {
  ErrorLog,
  ErrorQuery,
  ErrorLevelStats,
  ErrorTypeStats,
} from './error-logs.schemas';

/**
 * ErrorLogsRepository
 *
 * Repository for error_logs table extending BaseAuditRepository.
 * Provides CRUD operations and statistics for error logs with minimal code.
 *
 * Usage:
 * ```typescript
 * const repository = new ErrorLogsRepository(knex);
 * const logs = await repository.findAll({ level: 'error', limit: 10 });
 * const stats = await repository.getStats(7);
 * const levelStats = await repository.getStatsByLevel();
 * ```
 */
export class ErrorLogsRepository extends BaseAuditRepository<
  ErrorLog,
  ErrorQuery
> {
  /**
   * Field Mappings (snake_case ↔ camelCase)
   */
  private static readonly FIELD_MAPPINGS: FieldMapping[] = [
    { database: 'user_id', typescript: 'userId' },
    { database: 'session_id', typescript: 'sessionId' },
    { database: 'user_agent', typescript: 'userAgent' },
    { database: 'correlation_id', typescript: 'correlationId' },
    { database: 'ip_address', typescript: 'ipAddress' },
    { database: 'server_timestamp', typescript: 'serverTimestamp' },
    { database: 'created_at', typescript: 'createdAt' },
    { database: 'updated_at', typescript: 'updatedAt' },
  ];

  constructor(knex: Knex) {
    super(knex, 'error_logs', ErrorLogsRepository.FIELD_MAPPINGS);
  }

  // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

  /**
   * Get fields to select in queries with proper camelCase mapping
   */
  protected getSelectFields(): any[] {
    return [
      'id',
      'timestamp',
      'message',
      'url',
      'stack',
      'context',
      'level',
      'type',
      this.knex.raw('user_id as "userId"'),
      this.knex.raw('session_id as "sessionId"'),
      this.knex.raw('user_agent as "userAgent"'),
      this.knex.raw('correlation_id as "correlationId"'),
      this.knex.raw('ip_address as "ipAddress"'),
      'referer',
      this.knex.raw('server_timestamp as "serverTimestamp"'),
      this.knex.raw('created_at as "createdAt"'),
      this.knex.raw('updated_at as "updatedAt"'),
    ];
  }

  /**
   * Apply error-specific filters
   */
  protected applyCustomFilters(
    query: Knex.QueryBuilder,
    filters: ErrorQuery,
  ): void {
    // Filter by error level
    if (filters.level) {
      query.where('level', filters.level);
    }

    // Filter by error type
    if (filters.type) {
      query.where('type', filters.type);
    }

    // Filter by correlation ID
    if (filters.correlationId) {
      query.where('correlation_id', filters.correlationId);
    }

    // Filter by session ID
    if (filters.sessionId) {
      query.where('session_id', filters.sessionId);
    }
  }

  /**
   * Get fields to search in
   */
  protected getSearchFields(): string[] {
    return ['message', 'stack', 'url', 'referer'];
  }

  // ==================== CUSTOM STATISTICS ====================

  /**
   * Get custom statistics for error logs
   */
  protected async getCustomStats(days: number): Promise<Record<string, any>> {
    // Get statistics by level
    const byLevel = await this.getStatsByLevel();

    // Get statistics by type
    const byType = await this.getStatsByType();

    // Get top error messages
    const topMessages = await this.getTopItems('message', 10);

    // Get top URLs with errors
    const topUrls = await this.getTopItems('url', 10);

    // Get trend data
    const trend = await this.getTrendData(days);

    return {
      byLevel,
      byType,
      topMessages,
      topUrls,
      trend,
    };
  }

  // ==================== PUBLIC CUSTOM METHODS ====================

  /**
   * Get statistics grouped by error level
   *
   * @returns Object with counts for each level (error, warn, info)
   */
  async getStatsByLevel(): Promise<ErrorLevelStats> {
    const results = await this.knex(this.tableName)
      .select('level')
      .count('* as count')
      .groupBy('level');

    const stats: ErrorLevelStats = {
      error: 0,
      warn: 0,
      info: 0,
    };

    results.forEach((row: any) => {
      stats[row.level as keyof ErrorLevelStats] = parseInt(row.count);
    });

    return stats;
  }

  /**
   * Get statistics grouped by error type
   *
   * @returns Object with counts for each type
   */
  async getStatsByType(): Promise<ErrorTypeStats> {
    const results = await this.knex(this.tableName)
      .select('type')
      .count('* as count')
      .groupBy('type');

    const stats: ErrorTypeStats = {
      javascript: 0,
      http: 0,
      angular: 0,
      custom: 0,
      backend: 0,
      system: 0,
    };

    results.forEach((row: any) => {
      stats[row.type as keyof ErrorTypeStats] = parseInt(row.count);
    });

    return stats;
  }

  /**
   * Get error logs by correlation ID
   *
   * Useful for tracing related errors across requests.
   *
   * @param correlationId - Correlation identifier
   * @returns Array of error logs
   */
  async findByCorrelationId(correlationId: string): Promise<ErrorLog[]> {
    const selectFields = this.getSelectFields();
    const results = await this.knex(this.tableName)
      .select(selectFields)
      .where('correlation_id', correlationId)
      .orderBy('timestamp', 'desc');

    return results as ErrorLog[];
  }

  /**
   * Get error logs by session ID
   *
   * Useful for debugging user-specific issues.
   *
   * @param sessionId - Session identifier
   * @returns Array of error logs
   */
  async findBySessionId(sessionId: string): Promise<ErrorLog[]> {
    const selectFields = this.getSelectFields();
    const results = await this.knex(this.tableName)
      .select(selectFields)
      .where('session_id', sessionId)
      .orderBy('timestamp', 'desc');

    return results as ErrorLog[];
  }
}
