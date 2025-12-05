import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateBudgetReservations,
  type UpdateBudgetReservations,
  type BudgetReservations,
  type GetBudgetReservationsQuery,
  type ListBudgetReservationsQuery,
  type BudgetReservationsEntity,
} from '../types/budget-reservations.types';

export interface BudgetReservationsListQuery extends BaseListQuery {
  // Smart field-based filters for BudgetReservations
  allocation_id?: number;
  allocation_id_min?: number;
  allocation_id_max?: number;
  pr_id?: number;
  pr_id_min?: number;
  pr_id_max?: number;
  reserved_amount?: number;
  reserved_amount_min?: number;
  reserved_amount_max?: number;
  quarter?: number;
  quarter_min?: number;
  quarter_max?: number;
  is_released?: boolean;
}

export class BudgetReservationsRepository extends BaseRepository<
  BudgetReservations,
  CreateBudgetReservations,
  UpdateBudgetReservations
> {
  constructor(knex: Knex) {
    super(
      knex,
      'budget_reservations',
      [
        // Define searchable fields based on intelligent detection
      ],
      [], // explicitUUIDFields
      {
        // Field configuration for automatic timestamp and audit field management
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: false,
        hasUpdatedBy: false,
      },
    );
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): BudgetReservations {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      allocation_id: dbRow.allocation_id,
      pr_id: dbRow.pr_id,
      reserved_amount: dbRow.reserved_amount,
      quarter: dbRow.quarter,
      reservation_date: dbRow.reservation_date,
      expires_date: dbRow.expires_date,
      is_released: dbRow.is_released,
      released_at: dbRow.released_at,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateBudgetReservations | UpdateBudgetReservations,
  ): Partial<BudgetReservationsEntity> {
    const transformed: Partial<BudgetReservationsEntity> = {};

    if ('allocation_id' in dto && dto.allocation_id !== undefined) {
      transformed.allocation_id = dto.allocation_id;
    }
    if ('pr_id' in dto && dto.pr_id !== undefined) {
      transformed.pr_id = dto.pr_id;
    }
    if ('reserved_amount' in dto && dto.reserved_amount !== undefined) {
      transformed.reserved_amount = dto.reserved_amount;
    }
    if ('quarter' in dto && dto.quarter !== undefined) {
      transformed.quarter = dto.quarter;
    }
    if ('reservation_date' in dto && dto.reservation_date !== undefined) {
      transformed.reservation_date =
        typeof dto.reservation_date === 'string'
          ? new Date(dto.reservation_date)
          : dto.reservation_date;
    }
    if ('expires_date' in dto && dto.expires_date !== undefined) {
      transformed.expires_date =
        typeof dto.expires_date === 'string'
          ? new Date(dto.expires_date)
          : dto.expires_date;
    }
    if ('is_released' in dto && dto.is_released !== undefined) {
      transformed.is_released = dto.is_released;
    }
    if ('released_at' in dto && dto.released_at !== undefined) {
      transformed.released_at =
        typeof dto.released_at === 'string'
          ? new Date(dto.released_at)
          : dto.released_at;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('budget_reservations').select('budget_reservations.*');
    // Add joins here if needed
    // .leftJoin('other_table', 'budget_reservations.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: BudgetReservationsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific BudgetReservations filters based on intelligent field categorization
    if (filters.allocation_id !== undefined) {
      query.where('budget_reservations.allocation_id', filters.allocation_id);
    }
    if (filters.allocation_id_min !== undefined) {
      query.where(
        'budget_reservations.allocation_id',
        '>=',
        filters.allocation_id_min,
      );
    }
    if (filters.allocation_id_max !== undefined) {
      query.where(
        'budget_reservations.allocation_id',
        '<=',
        filters.allocation_id_max,
      );
    }
    if (filters.pr_id !== undefined) {
      query.where('budget_reservations.pr_id', filters.pr_id);
    }
    if (filters.pr_id_min !== undefined) {
      query.where('budget_reservations.pr_id', '>=', filters.pr_id_min);
    }
    if (filters.pr_id_max !== undefined) {
      query.where('budget_reservations.pr_id', '<=', filters.pr_id_max);
    }
    if (filters.reserved_amount !== undefined) {
      query.where(
        'budget_reservations.reserved_amount',
        filters.reserved_amount,
      );
    }
    if (filters.reserved_amount_min !== undefined) {
      query.where(
        'budget_reservations.reserved_amount',
        '>=',
        filters.reserved_amount_min,
      );
    }
    if (filters.reserved_amount_max !== undefined) {
      query.where(
        'budget_reservations.reserved_amount',
        '<=',
        filters.reserved_amount_max,
      );
    }
    if (filters.quarter !== undefined) {
      query.where('budget_reservations.quarter', filters.quarter);
    }
    if (filters.quarter_min !== undefined) {
      query.where('budget_reservations.quarter', '>=', filters.quarter_min);
    }
    if (filters.quarter_max !== undefined) {
      query.where('budget_reservations.quarter', '<=', filters.quarter_max);
    }
    if (filters.is_released !== undefined) {
      query.where('budget_reservations.is_released', filters.is_released);
    }
  }

  // Apply multiple sort parsing
  protected applyMultipleSort(query: any, sort?: string): void {
    if (sort) {
      if (sort.includes(',')) {
        // Multiple sort format: field1:desc,field2:asc,field3:desc
        const sortPairs = sort.split(',');
        sortPairs.forEach((pair) => {
          const [field, direction] = pair.split(':');
          const mappedField = this.getSortField(field.trim());
          const sortDirection =
            direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
          query.orderBy(mappedField, sortDirection);
        });
      } else {
        // Single sort field
        const [field, direction] = sort.split(':');
        const mappedField = this.getSortField(field.trim());
        const sortDirection =
          direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
        query.orderBy(mappedField, sortDirection);
      }
    } else {
      // Default sort
      query.orderBy(this.getSortField('created_at'), 'desc');
    }
  }

  // Custom sort fields mapping
  protected getSortField(sortBy: string): string {
    const sortFields: Record<string, string> = {
      id: 'budget_reservations.id',
      allocationId: 'budget_reservations.allocation_id',
      prId: 'budget_reservations.pr_id',
      reservedAmount: 'budget_reservations.reserved_amount',
      quarter: 'budget_reservations.quarter',
      reservationDate: 'budget_reservations.reservation_date',
      expiresDate: 'budget_reservations.expires_date',
      isReleased: 'budget_reservations.is_released',
      releasedAt: 'budget_reservations.released_at',
      createdAt: 'budget_reservations.created_at',
      updatedAt: 'budget_reservations.updated_at',
    };

    return sortFields[sortBy] || 'budget_reservations.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetBudgetReservationsQuery = {},
  ): Promise<BudgetReservations | null> {
    let query = this.getJoinQuery();
    query = query.where('budget_reservations.id', id);

    // Handle include options
    if (options.include) {
      const includes = Array.isArray(options.include)
        ? options.include
        : [options.include];
      includes.forEach((relation) => {
        // TODO: Add join logic for relationships
        // Example: if (relation === 'category') query.leftJoin('categories', 'items.category_id', 'categories.id');
      });
    }

    const row = await query.first();
    return row ? this.transformToEntity(row) : null;
  }

  // Extended list method with specific query type
  async list(
    query: BudgetReservationsListQuery = {},
  ): Promise<PaginatedListResult<BudgetReservations>> {
    return super.list(query);
  }

  // Business-specific methods are merged with unique constraint detection below

  // ===== ERROR HANDLING: DUPLICATE DETECTION METHODS =====

  // ===== ERROR HANDLING: DELETE VALIDATION METHODS =====

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('budget_reservations')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(
    data: CreateBudgetReservations[],
  ): Promise<BudgetReservations[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('budget_reservations')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(
    data: CreateBudgetReservations,
  ): Promise<BudgetReservations> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('budget_reservations')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
