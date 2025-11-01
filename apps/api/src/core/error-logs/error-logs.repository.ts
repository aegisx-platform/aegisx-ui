import { Knex } from 'knex';
import { ErrorLog, ErrorLogsQuery, ErrorStats } from './error-logs.schemas';

export class ErrorLogsRepository {
  constructor(private readonly knex: Knex) {}

  async findAll(query: ErrorLogsQuery): Promise<{
    data: ErrorLog[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      level,
      type,
      userId,
      startDate,
      endDate,
      search,
    } = query;

    const offset = (page - 1) * limit;

    // Build base query
    let baseQuery = this.knex('error_logs');

    // Apply filters
    if (level) {
      baseQuery = baseQuery.where('level', level);
    }
    if (type) {
      baseQuery = baseQuery.where('type', type);
    }
    if (userId) {
      baseQuery = baseQuery.where('user_id', userId);
    }
    if (startDate) {
      baseQuery = baseQuery.where('timestamp', '>=', startDate);
    }
    if (endDate) {
      baseQuery = baseQuery.where('timestamp', '<=', endDate);
    }
    if (search) {
      baseQuery = baseQuery.where((builder) => {
        builder
          .where('message', 'ilike', `%${search}%`)
          .orWhere('stack', 'ilike', `%${search}%`)
          .orWhere('url', 'ilike', `%${search}%`);
      });
    }

    // Get total count
    const countResult = await baseQuery.clone().count('* as count').first();
    const total = parseInt(countResult?.count as string) || 0;

    // Get paginated data
    const data = await baseQuery
      .select(
        'id',
        'timestamp',
        'level',
        'message',
        'url',
        'stack',
        'context',
        'type',
        this.knex.raw('user_id as "userId"'),
        this.knex.raw('session_id as "sessionId"'),
        this.knex.raw('user_agent as "userAgent"'),
        this.knex.raw('correlation_id as "correlationId"'),
        this.knex.raw('ip_address as "ipAddress"'),
        'referer',
        this.knex.raw('server_timestamp as "serverTimestamp"'),
        this.knex.raw('created_at as "createdAt"'),
      )
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset);

    return { data, total };
  }

  async findById(id: string): Promise<ErrorLog | null> {
    const result = await this.knex('error_logs')
      .select(
        'id',
        'timestamp',
        'level',
        'message',
        'url',
        'stack',
        'context',
        'type',
        this.knex.raw('user_id as "userId"'),
        this.knex.raw('session_id as "sessionId"'),
        this.knex.raw('user_agent as "userAgent"'),
        this.knex.raw('correlation_id as "correlationId"'),
        this.knex.raw('ip_address as "ipAddress"'),
        'referer',
        this.knex.raw('server_timestamp as "serverTimestamp"'),
        this.knex.raw('created_at as "createdAt"'),
      )
      .where('id', id)
      .first();

    return result || null;
  }

  async getStats(days: number = 7): Promise<ErrorStats> {
    const startDate = this.knex.raw(`NOW() - INTERVAL '${days} days'`);

    // Total errors
    const totalResult = await this.knex('error_logs')
      .count('* as count')
      .first();
    const totalErrors = parseInt(totalResult?.count as string) || 0;

    // Recent errors (last 24 hours)
    const recentResult = await this.knex('error_logs')
      .count('* as count')
      .where('timestamp', '>=', this.knex.raw(`NOW() - INTERVAL '24 hours'`))
      .first();
    const recentErrors = parseInt(recentResult?.count as string) || 0;

    // By level
    const byLevelResults = await this.knex('error_logs')
      .select('level')
      .count('* as count')
      .groupBy('level');

    const byLevel = {
      error: 0,
      warn: 0,
      info: 0,
    };
    byLevelResults.forEach((row: any) => {
      byLevel[row.level as keyof typeof byLevel] = parseInt(row.count);
    });

    // By type
    const byTypeResults = await this.knex('error_logs')
      .select('type')
      .count('* as count')
      .groupBy('type');

    const byType = {
      javascript: 0,
      http: 0,
      angular: 0,
      custom: 0,
      backend: 0,
      system: 0,
    };
    byTypeResults.forEach((row: any) => {
      byType[row.type as keyof typeof byType] = parseInt(row.count);
    });

    // Trend (last N days)
    const trendResults = await this.knex('error_logs')
      .select(this.knex.raw(`DATE(timestamp) as date`))
      .count('* as count')
      .where('timestamp', '>=', startDate)
      .groupBy(this.knex.raw('DATE(timestamp)'))
      .orderBy('date', 'asc');

    const trend = trendResults.map((row: any) => ({
      date: row.date,
      count: parseInt(row.count),
    }));

    // Top errors
    const topErrorsResults = await this.knex('error_logs')
      .select('message')
      .count('* as count')
      .groupBy('message')
      .orderBy('count', 'desc')
      .limit(10);

    const topErrors = topErrorsResults.map((row: any) => ({
      message: row.message,
      count: parseInt(row.count),
    }));

    return {
      totalErrors,
      recentErrors,
      byLevel,
      byType,
      trend,
      topErrors,
    };
  }

  async deleteOlderThan(days: number): Promise<number> {
    const result = await this.knex('error_logs')
      .where(
        'created_at',
        '<',
        this.knex.raw(`NOW() - INTERVAL '${days} days'`),
      )
      .delete();

    return result;
  }

  async create(errorLog: Partial<ErrorLog>): Promise<string> {
    const [result] = await this.knex('error_logs')
      .insert({
        timestamp: errorLog.timestamp,
        level: errorLog.level,
        message: errorLog.message,
        url: errorLog.url,
        stack: errorLog.stack,
        context: errorLog.context ? JSON.stringify(errorLog.context) : null,
        type: errorLog.type,
        user_id: errorLog.userId,
        session_id: errorLog.sessionId,
        user_agent: errorLog.userAgent,
        correlation_id: errorLog.correlationId,
        ip_address: errorLog.ipAddress,
        referer: errorLog.referer,
      })
      .returning('id');

    return result.id;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.knex('error_logs').where('id', id).delete();

    return result > 0;
  }
}
