import { Knex } from 'knex';
import { Redis } from 'ioredis';
import { BaseAuditService } from '../base/base.service';
import { ErrorLogsRepository } from './error-logs.repository';
import { ErrorLog, ErrorQuery, ErrorStats } from './error-logs.schemas';

/**
 * ErrorLogsService
 *
 * Service layer for error logs with Redis caching for statistics.
 * Extends BaseAuditService to provide business logic on top of repository.
 *
 * Features:
 * - All CRUD operations inherited from base
 * - Statistics caching with Redis (5 min TTL)
 * - CSV/JSON export
 * - Data validation
 * - Cleanup/retention
 *
 * Usage:
 * ```typescript
 * const service = new ErrorLogsService(knex, redis);
 * const logs = await service.findAll({ level: 'error', limit: 10 });
 * const stats = await service.getStats(7); // Cached for 5 min
 * const csv = await service.exportToCSV({ level: 'error' });
 * ```
 */
export class ErrorLogsService extends BaseAuditService<
  ErrorLog,
  ErrorQuery,
  ErrorStats,
  ErrorLogsRepository
> {
  private readonly CACHE_KEY_PREFIX = 'error-logs:stats';
  private readonly CACHE_TTL = 300; // 5 minutes in seconds

  constructor(
    knex: Knex,
    private readonly redis?: Redis | null,
  ) {
    super(knex, 'Error log');
  }

  // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

  /**
   * Create repository instance
   */
  protected createRepository(knex: Knex): ErrorLogsRepository {
    return new ErrorLogsRepository(knex);
  }

  /**
   * Get CSV export headers
   */
  protected getExportHeaders(): string[] {
    return [
      'ID',
      'Timestamp',
      'Level',
      'Type',
      'Message',
      'URL',
      'Stack',
      'User ID',
      'Session ID',
      'IP Address',
      'User Agent',
      'Correlation ID',
      'Referer',
      'Server Timestamp',
      'Created At',
    ];
  }

  /**
   * Get CSV export row
   */
  protected getExportRow(log: ErrorLog): any[] {
    return [
      log.id,
      this.formatTimestamp(log.timestamp),
      log.level,
      log.type,
      this.truncate(log.message, 200),
      log.url || '',
      this.truncate(log.stack || '', 200),
      log.userId || '',
      log.sessionId || '',
      log.ipAddress || '',
      this.truncate(log.userAgent || '', 100),
      log.correlationId || '',
      log.referer || '',
      this.formatTimestamp(log.serverTimestamp),
      this.formatTimestamp(log.createdAt),
    ];
  }

  // ==================== STATS CACHING ====================

  /**
   * Get statistics with Redis caching
   *
   * Caches stats for 5 minutes to reduce database load.
   * Cache key: error-logs:stats:{days}
   *
   * @param days - Number of days for statistics (default: 7)
   * @returns Error logs statistics
   */
  async getStats(days: number = 7): Promise<ErrorStats> {
    // Try to get from cache first
    if (this.redis) {
      const cacheKey = `${this.CACHE_KEY_PREFIX}:${days}`;
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // Cache miss - get from database
      const stats = await super.getStats(days);

      // Store in cache
      await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(stats));

      return stats;
    }

    // Redis not available - get directly from database
    return super.getStats(days);
  }

  /**
   * Invalidate stats cache
   *
   * Call this when new error logs are created to ensure fresh stats.
   */
  async invalidateStatsCache(): Promise<void> {
    if (!this.redis) return;

    // Invalidate all stats cache keys
    const pattern = `${this.CACHE_KEY_PREFIX}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Create error log and invalidate stats cache
   */
  async create(data: Partial<ErrorLog>): Promise<string> {
    const id = await super.create(data);

    // Invalidate cache after creating new record
    await this.invalidateStatsCache();

    return id;
  }

  /**
   * Delete error log and invalidate stats cache
   */
  async delete(id: string): Promise<void> {
    await super.delete(id);

    // Invalidate cache after deleting record
    await this.invalidateStatsCache();
  }

  /**
   * Cleanup old error logs and invalidate stats cache
   */
  async cleanup(query: {
    olderThan: number;
  }): Promise<{ deletedCount: number }> {
    const result = await super.cleanup(query);

    // Invalidate cache after cleanup
    if (result.deletedCount > 0) {
      await this.invalidateStatsCache();
    }

    return result;
  }

  // ==================== CUSTOM METHODS ====================

  /**
   * Get statistics grouped by error level
   *
   * Provides breakdown of error counts by severity level.
   */
  async getStatsByLevel() {
    return this.repository.getStatsByLevel();
  }

  /**
   * Get statistics grouped by error type
   *
   * Provides breakdown of error counts by type classification.
   */
  async getStatsByType() {
    return this.repository.getStatsByType();
  }

  /**
   * Find error logs by correlation ID
   *
   * Useful for tracing related errors across requests.
   */
  async findByCorrelationId(correlationId: string): Promise<ErrorLog[]> {
    return this.repository.findByCorrelationId(correlationId);
  }

  /**
   * Find error logs by session ID
   *
   * Useful for debugging user-specific issues.
   */
  async findBySessionId(sessionId: string): Promise<ErrorLog[]> {
    return this.repository.findBySessionId(sessionId);
  }

  // ==================== VALIDATION ====================

  /**
   * Validate error log data before creation
   */
  protected async validateCreate(data: Partial<ErrorLog>): Promise<void> {
    // Validate required fields
    if (!data.message) {
      throw new Error('ERROR_MESSAGE_REQUIRED');
    }

    if (!data.level) {
      throw new Error('ERROR_LEVEL_REQUIRED');
    }

    if (!data.type) {
      throw new Error('ERROR_TYPE_REQUIRED');
    }

    // Validate enum values (cast to string since we checked above)
    const validLevels = ['error', 'warn', 'info'];
    if (!validLevels.includes(data.level as string)) {
      throw new Error('ERROR_INVALID_LEVEL');
    }

    const validTypes = [
      'javascript',
      'http',
      'angular',
      'custom',
      'backend',
      'system',
    ];
    if (!validTypes.includes(data.type as string)) {
      throw new Error('ERROR_INVALID_TYPE');
    }

    // Validate message length (cast to string since we checked above)
    if ((data.message as string).length > 5000) {
      throw new Error('ERROR_MESSAGE_TOO_LONG');
    }
  }
}
