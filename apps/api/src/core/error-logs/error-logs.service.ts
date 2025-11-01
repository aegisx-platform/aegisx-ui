import { Knex } from 'knex';
import { ErrorLogsRepository } from './error-logs.repository';
import {
  ErrorLog,
  ErrorLogsQuery,
  ErrorStats,
  CleanupQuery,
} from './error-logs.schemas';

export class ErrorLogsService {
  private repository: ErrorLogsRepository;

  constructor(private readonly knex: Knex) {
    this.repository = new ErrorLogsRepository(knex);
  }

  async findAll(
    query: ErrorLogsQuery,
  ): Promise<{ data: ErrorLog[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.repository.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<ErrorLog> {
    const errorLog = await this.repository.findById(id);

    if (!errorLog) {
      throw new Error('ERROR_NOT_FOUND');
    }

    return errorLog;
  }

  async getStats(days: number = 7): Promise<ErrorStats> {
    return this.repository.getStats(days);
  }

  async cleanup(query: CleanupQuery): Promise<{ deletedCount: number }> {
    const deletedCount = await this.repository.deleteOlderThan(query.olderThan);

    return { deletedCount };
  }

  async create(errorLog: Partial<ErrorLog>): Promise<string> {
    return this.repository.create(errorLog);
  }

  async exportToCSV(query?: ErrorLogsQuery): Promise<string> {
    // Get all logs without pagination
    const exportQuery = { ...query, limit: 10000, page: 1 }; // Limit to 10k records
    const { data: logs } = await this.repository.findAll(exportQuery);

    // CSV headers
    const headers = [
      'ID',
      'Timestamp',
      'Level',
      'Type',
      'Message',
      'URL',
      'User ID',
      'Session ID',
      'IP Address',
      'Server Timestamp',
    ];

    // Helper function to escape CSV values
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (
        stringValue.includes(',') ||
        stringValue.includes('\n') ||
        stringValue.includes('"')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Build CSV rows
    const rows = logs.map((log) => [
      escapeCSV(log.id),
      escapeCSV(log.timestamp),
      escapeCSV(log.level),
      escapeCSV(log.type),
      escapeCSV(log.message),
      escapeCSV(log.url),
      escapeCSV(log.userId),
      escapeCSV(log.sessionId),
      escapeCSV(log.ipAddress),
      escapeCSV(log.serverTimestamp),
    ]);

    // Combine headers and rows
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join(
      '\n',
    );

    return csv;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new Error('ERROR_NOT_FOUND');
    }
  }
}
