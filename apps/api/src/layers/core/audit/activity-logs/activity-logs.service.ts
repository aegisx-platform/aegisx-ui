import { Knex } from 'knex';
import { Redis } from 'ioredis';
import { BaseAuditService } from '../base/base.service';
import { ActivityLogsRepository } from './activity-logs.repository';
import {
  ActivityLog,
  ActivityQuery,
  ActivityStats,
} from './activity-logs.schemas';

/**
 * ActivityLogsService
 *
 * Service layer for activity logs with Redis caching for statistics.
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
 * const service = new ActivityLogsService(knex, redis);
 * const logs = await service.findAll({ action: 'create', limit: 10 });
 * const stats = await service.getStats(7); // Cached for 5 min
 * const csv = await service.exportToCSV({ action: 'create' });
 * ```
 */
export class ActivityLogsService extends BaseAuditService<
  ActivityLog,
  ActivityQuery,
  ActivityStats,
  ActivityLogsRepository
> {
  private readonly CACHE_KEY_PREFIX = 'activity-logs:stats';
  private readonly CACHE_TTL = 300; // 5 minutes in seconds

  constructor(
    knex: Knex,
    private readonly redis?: Redis | null,
  ) {
    super(knex, 'Activity log');
  }

  // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

  /**
   * Create repository instance
   */
  protected createRepository(knex: Knex): ActivityLogsRepository {
    return new ActivityLogsRepository(knex);
  }

  /**
   * Get CSV export headers
   */
  protected getExportHeaders(): string[] {
    return [
      'ID',
      'Timestamp',
      'Action',
      'Description',
      'Resource Type',
      'Resource ID',
      'Severity',
      'User ID',
      'Session ID',
      'IP Address',
      'User Agent',
      'Server Timestamp',
      'Created At',
    ];
  }

  /**
   * Get CSV export row
   */
  protected getExportRow(log: ActivityLog): any[] {
    return [
      log.id,
      this.formatTimestamp(log.timestamp),
      log.action,
      this.truncate(log.description, 200),
      log.resourceType || '',
      log.resourceId || '',
      log.severity,
      log.userId,
      log.sessionId || '',
      log.ipAddress || '',
      this.truncate(log.userAgent || '', 100),
      this.formatTimestamp(log.serverTimestamp),
      this.formatTimestamp(log.createdAt),
    ];
  }

  // ==================== STATS CACHING ====================

  /**
   * Get statistics with Redis caching
   *
   * Caches stats for 5 minutes to reduce database load.
   * Cache key: activity-logs:stats:{days}
   *
   * @param days - Number of days for statistics (default: 7)
   * @returns Activity logs statistics
   */
  async getStats(days: number = 7): Promise<ActivityStats> {
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
   * Call this when new activity logs are created to ensure fresh stats.
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
   * Create activity log and invalidate stats cache
   */
  async create(data: Partial<ActivityLog>): Promise<string> {
    const id = await super.create(data);

    // Invalidate cache after creating new record
    await this.invalidateStatsCache();

    return id;
  }

  /**
   * Delete activity log and invalidate stats cache
   */
  async delete(id: string): Promise<void> {
    await super.delete(id);

    // Invalidate cache after deleting record
    await this.invalidateStatsCache();
  }

  /**
   * Cleanup old activity logs and invalidate stats cache
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
   * Get statistics grouped by activity action
   *
   * Provides breakdown of activity counts by action type.
   */
  async getStatsByAction() {
    return this.repository.getStatsByAction();
  }

  /**
   * Get statistics grouped by severity level
   *
   * Provides breakdown of activity counts by severity.
   */
  async getStatsBySeverity() {
    return this.repository.getStatsBySeverity();
  }

  /**
   * Find activity logs by action type
   *
   * Useful for analyzing specific types of activities.
   */
  async findByAction(action: string): Promise<ActivityLog[]> {
    return this.repository.findByAction(action);
  }

  /**
   * Find activity logs by resource ID
   *
   * Useful for tracking all activities related to a specific resource.
   */
  async findByResourceId(resourceId: string): Promise<ActivityLog[]> {
    return this.repository.findByResourceId(resourceId);
  }

  // ==================== VALIDATION ====================

  /**
   * Validate activity log data before creation
   */
  protected async validateCreate(data: Partial<ActivityLog>): Promise<void> {
    // Validate required fields
    if (!data.action) {
      throw new Error('ACTIVITY_ACTION_REQUIRED');
    }

    if (!data.description) {
      throw new Error('ACTIVITY_DESCRIPTION_REQUIRED');
    }

    if (!data.userId) {
      throw new Error('ACTIVITY_USER_ID_REQUIRED');
    }

    if (!data.severity) {
      throw new Error('ACTIVITY_SEVERITY_REQUIRED');
    }

    // Validate enum values (cast to string since we checked above)
    const validActions = [
      'create',
      'read',
      'update',
      'delete',
      'login',
      'logout',
      'export',
      'import',
    ];
    if (!validActions.includes(data.action as string)) {
      throw new Error('ACTIVITY_INVALID_ACTION');
    }

    const validSeverities = ['info', 'warning', 'error', 'critical'];
    if (!validSeverities.includes(data.severity as string)) {
      throw new Error('ACTIVITY_INVALID_SEVERITY');
    }

    // Validate description length (cast to string since we checked above)
    if ((data.description as string).length > 5000) {
      throw new Error('ACTIVITY_DESCRIPTION_TOO_LONG');
    }
  }
}
