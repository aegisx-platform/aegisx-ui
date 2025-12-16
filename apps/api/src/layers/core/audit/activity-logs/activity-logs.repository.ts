import { Knex } from 'knex';
import {
  BaseAuditRepository,
  BaseAuditQuery,
  FieldMapping,
} from '../base/base.repository';
import {
  ActivityLog,
  ActivityQuery,
  ActivityActionStats,
  ActivitySeverityStats,
} from './activity-logs.schemas';

/**
 * ActivityLogsRepository
 *
 * Repository for user_activity_logs table extending BaseAuditRepository.
 * Provides CRUD operations and statistics for activity logs with minimal code.
 *
 * Usage:
 * ```typescript
 * const repository = new ActivityLogsRepository(knex);
 * const logs = await repository.findAll({ action: 'create', limit: 10 });
 * const stats = await repository.getStats(7);
 * const actionStats = await repository.getStatsByAction();
 * ```
 */
export class ActivityLogsRepository extends BaseAuditRepository<
  ActivityLog,
  ActivityQuery
> {
  /**
   * Field Mappings (snake_case ↔ camelCase)
   */
  private static readonly FIELD_MAPPINGS: FieldMapping[] = [
    { database: 'user_id', typescript: 'userId' },
    { database: 'session_id', typescript: 'sessionId' },
    { database: 'user_agent', typescript: 'userAgent' },
    { database: 'ip_address', typescript: 'ipAddress' },
    { database: 'resource_type', typescript: 'resourceType' },
    { database: 'resource_id', typescript: 'resourceId' },
    { database: 'server_timestamp', typescript: 'serverTimestamp' },
    { database: 'created_at', typescript: 'createdAt' },
    { database: 'updated_at', typescript: 'updatedAt' },
  ];

  constructor(knex: Knex) {
    super(knex, 'user_activity_logs', ActivityLogsRepository.FIELD_MAPPINGS);
  }

  // ==================== ABSTRACT METHOD IMPLEMENTATIONS ====================

  /**
   * Get fields to select in queries with proper camelCase mapping
   */
  protected getSelectFields(): any[] {
    return [
      'id',
      'timestamp',
      'action',
      'description',
      this.knex.raw('resource_type as "resourceType"'),
      this.knex.raw('resource_id as "resourceId"'),
      'severity',
      'metadata',
      this.knex.raw('user_id as "userId"'),
      this.knex.raw('session_id as "sessionId"'),
      this.knex.raw('user_agent as "userAgent"'),
      this.knex.raw('ip_address as "ipAddress"'),
      this.knex.raw('server_timestamp as "serverTimestamp"'),
      this.knex.raw('created_at as "createdAt"'),
      this.knex.raw('updated_at as "updatedAt"'),
    ];
  }

  /**
   * Apply activity-specific filters
   */
  protected applyCustomFilters(
    query: Knex.QueryBuilder,
    filters: ActivityQuery,
  ): void {
    // Filter by action
    if (filters.action) {
      query.where('action', filters.action);
    }

    // Filter by severity
    if (filters.severity) {
      query.where('severity', filters.severity);
    }

    // Filter by resource type
    if (filters.resourceType) {
      query.where('resource_type', filters.resourceType);
    }

    // Filter by resource ID
    if (filters.resourceId) {
      query.where('resource_id', filters.resourceId);
    }
  }

  /**
   * Get fields to search in
   */
  protected getSearchFields(): string[] {
    return ['description', 'resource_type', 'resource_id'];
  }

  // ==================== CUSTOM STATISTICS ====================

  /**
   * Get custom statistics for activity logs
   */
  protected async getCustomStats(days: number): Promise<Record<string, any>> {
    // Get statistics by action
    const byAction = await this.getStatsByAction();

    // Get statistics by severity
    const bySeverity = await this.getStatsBySeverity();

    // Get top resources
    const topResources = await this.getTopItems('resource_type', 10);

    // Get top users
    const topUsers = await this.getTopItems('user_id', 10);

    // Get trend data
    const trend = await this.getTrendData(days);

    return {
      byAction,
      bySeverity,
      topResources,
      topUsers,
      trend,
    };
  }

  // ==================== PUBLIC CUSTOM METHODS ====================

  /**
   * Get statistics grouped by activity action
   *
   * @returns Object with counts for each action type
   */
  async getStatsByAction(): Promise<ActivityActionStats> {
    const results = await this.knex(this.tableName)
      .select('action')
      .count('* as count')
      .groupBy('action');

    const stats: ActivityActionStats = {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
      login: 0,
      logout: 0,
      export: 0,
      import: 0,
    };

    results.forEach((row: any) => {
      stats[row.action as keyof ActivityActionStats] = parseInt(row.count);
    });

    return stats;
  }

  /**
   * Get statistics grouped by severity level
   *
   * @returns Object with counts for each severity level
   */
  async getStatsBySeverity(): Promise<ActivitySeverityStats> {
    const results = await this.knex(this.tableName)
      .select('severity')
      .count('* as count')
      .groupBy('severity');

    const stats: ActivitySeverityStats = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0,
    };

    results.forEach((row: any) => {
      stats[row.severity as keyof ActivitySeverityStats] = parseInt(row.count);
    });

    return stats;
  }

  /**
   * Get activity logs by action type
   *
   * Useful for analyzing specific types of activities.
   *
   * @param action - Activity action type
   * @returns Array of activity logs
   */
  async findByAction(action: string): Promise<ActivityLog[]> {
    const selectFields = this.getSelectFields();
    const results = await this.knex(this.tableName)
      .select(selectFields)
      .where('action', action)
      .orderBy('timestamp', 'desc');

    return results as ActivityLog[];
  }

  /**
   * Get activity logs by resource ID
   *
   * Useful for tracking all activities related to a specific resource.
   *
   * @param resourceId - Resource identifier
   * @returns Array of activity logs
   */
  async findByResourceId(resourceId: string): Promise<ActivityLog[]> {
    const selectFields = this.getSelectFields();
    const results = await this.knex(this.tableName)
      .select(selectFields)
      .where('resource_id', resourceId)
      .orderBy('timestamp', 'desc');

    return results as ActivityLog[];
  }
}
