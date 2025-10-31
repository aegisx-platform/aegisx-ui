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
}
