import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateBudgetAllocations,
  type UpdateBudgetAllocations,
  type BudgetAllocations,
  type GetBudgetAllocationsQuery,
  type ListBudgetAllocationsQuery,
  type BudgetAllocationsEntity,
} from './budget-allocations.types';

export interface BudgetAllocationsListQuery extends BaseListQuery {
  // Smart field-based filters for BudgetAllocations
  fiscal_year?: number;
  fiscal_year_min?: number;
  fiscal_year_max?: number;
  budget_id?: number;
  budget_id_min?: number;
  budget_id_max?: number;
  department_id?: number;
  department_id_min?: number;
  department_id_max?: number;
  total_budget?: number;
  total_budget_min?: number;
  total_budget_max?: number;
  q1_budget?: number;
  q1_budget_min?: number;
  q1_budget_max?: number;
  q2_budget?: number;
  q2_budget_min?: number;
  q2_budget_max?: number;
  q3_budget?: number;
  q3_budget_min?: number;
  q3_budget_max?: number;
  q4_budget?: number;
  q4_budget_min?: number;
  q4_budget_max?: number;
  q1_spent?: number;
  q1_spent_min?: number;
  q1_spent_max?: number;
  q2_spent?: number;
  q2_spent_min?: number;
  q2_spent_max?: number;
  q3_spent?: number;
  q3_spent_min?: number;
  q3_spent_max?: number;
  q4_spent?: number;
  q4_spent_min?: number;
  q4_spent_max?: number;
  total_spent?: number;
  total_spent_min?: number;
  total_spent_max?: number;
  remaining_budget?: number;
  remaining_budget_min?: number;
  remaining_budget_max?: number;
  is_active?: boolean;
}

export class BudgetAllocationsRepository extends BaseRepository<
  BudgetAllocations,
  CreateBudgetAllocations,
  UpdateBudgetAllocations
> {
  constructor(knex: Knex) {
    super(
      knex,
      'inventory.budget_allocations',
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
  transformToEntity(dbRow: any): BudgetAllocations {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      fiscal_year: dbRow.fiscal_year,
      budget_id: dbRow.budget_id,
      department_id: dbRow.department_id,
      total_budget: dbRow.total_budget,
      q1_budget: dbRow.q1_budget,
      q2_budget: dbRow.q2_budget,
      q3_budget: dbRow.q3_budget,
      q4_budget: dbRow.q4_budget,
      q1_spent: dbRow.q1_spent,
      q2_spent: dbRow.q2_spent,
      q3_spent: dbRow.q3_spent,
      q4_spent: dbRow.q4_spent,
      total_spent: dbRow.total_spent,
      remaining_budget: dbRow.remaining_budget,
      is_active: dbRow.is_active,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateBudgetAllocations | UpdateBudgetAllocations,
  ): Partial<BudgetAllocationsEntity> {
    const transformed: Partial<BudgetAllocationsEntity> = {};

    if ('fiscal_year' in dto && dto.fiscal_year !== undefined) {
      transformed.fiscal_year = dto.fiscal_year;
    }
    if ('budget_id' in dto && dto.budget_id !== undefined) {
      transformed.budget_id = dto.budget_id;
    }
    if ('department_id' in dto && dto.department_id !== undefined) {
      transformed.department_id = dto.department_id;
    }
    if ('total_budget' in dto && dto.total_budget !== undefined) {
      transformed.total_budget = dto.total_budget;
    }
    if ('q1_budget' in dto && dto.q1_budget !== undefined) {
      transformed.q1_budget = dto.q1_budget;
    }
    if ('q2_budget' in dto && dto.q2_budget !== undefined) {
      transformed.q2_budget = dto.q2_budget;
    }
    if ('q3_budget' in dto && dto.q3_budget !== undefined) {
      transformed.q3_budget = dto.q3_budget;
    }
    if ('q4_budget' in dto && dto.q4_budget !== undefined) {
      transformed.q4_budget = dto.q4_budget;
    }
    if ('q1_spent' in dto && dto.q1_spent !== undefined) {
      transformed.q1_spent = dto.q1_spent;
    }
    if ('q2_spent' in dto && dto.q2_spent !== undefined) {
      transformed.q2_spent = dto.q2_spent;
    }
    if ('q3_spent' in dto && dto.q3_spent !== undefined) {
      transformed.q3_spent = dto.q3_spent;
    }
    if ('q4_spent' in dto && dto.q4_spent !== undefined) {
      transformed.q4_spent = dto.q4_spent;
    }
    if ('total_spent' in dto && dto.total_spent !== undefined) {
      transformed.total_spent = dto.total_spent;
    }
    if ('remaining_budget' in dto && dto.remaining_budget !== undefined) {
      transformed.remaining_budget = dto.remaining_budget;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('inventory.budget_allocations').select(
      'inventory.budget_allocations.*',
    );
    // Add joins here if needed
    // .leftJoin('other_table', 'inventory.budget_allocations.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: BudgetAllocationsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific BudgetAllocations filters based on intelligent field categorization
    if (filters.fiscal_year !== undefined) {
      query.where(
        'inventory.budget_allocations.fiscal_year',
        filters.fiscal_year,
      );
    }
    if (filters.fiscal_year_min !== undefined) {
      query.where(
        'inventory.budget_allocations.fiscal_year',
        '>=',
        filters.fiscal_year_min,
      );
    }
    if (filters.fiscal_year_max !== undefined) {
      query.where(
        'inventory.budget_allocations.fiscal_year',
        '<=',
        filters.fiscal_year_max,
      );
    }
    if (filters.budget_id !== undefined) {
      query.where('inventory.budget_allocations.budget_id', filters.budget_id);
    }
    if (filters.budget_id_min !== undefined) {
      query.where(
        'inventory.budget_allocations.budget_id',
        '>=',
        filters.budget_id_min,
      );
    }
    if (filters.budget_id_max !== undefined) {
      query.where(
        'inventory.budget_allocations.budget_id',
        '<=',
        filters.budget_id_max,
      );
    }
    if (filters.department_id !== undefined) {
      query.where(
        'inventory.budget_allocations.department_id',
        filters.department_id,
      );
    }
    if (filters.department_id_min !== undefined) {
      query.where(
        'inventory.budget_allocations.department_id',
        '>=',
        filters.department_id_min,
      );
    }
    if (filters.department_id_max !== undefined) {
      query.where(
        'inventory.budget_allocations.department_id',
        '<=',
        filters.department_id_max,
      );
    }
    if (filters.total_budget !== undefined) {
      query.where(
        'inventory.budget_allocations.total_budget',
        filters.total_budget,
      );
    }
    if (filters.total_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.total_budget',
        '>=',
        filters.total_budget_min,
      );
    }
    if (filters.total_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.total_budget',
        '<=',
        filters.total_budget_max,
      );
    }
    if (filters.q1_budget !== undefined) {
      query.where('inventory.budget_allocations.q1_budget', filters.q1_budget);
    }
    if (filters.q1_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q1_budget',
        '>=',
        filters.q1_budget_min,
      );
    }
    if (filters.q1_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q1_budget',
        '<=',
        filters.q1_budget_max,
      );
    }
    if (filters.q2_budget !== undefined) {
      query.where('inventory.budget_allocations.q2_budget', filters.q2_budget);
    }
    if (filters.q2_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q2_budget',
        '>=',
        filters.q2_budget_min,
      );
    }
    if (filters.q2_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q2_budget',
        '<=',
        filters.q2_budget_max,
      );
    }
    if (filters.q3_budget !== undefined) {
      query.where('inventory.budget_allocations.q3_budget', filters.q3_budget);
    }
    if (filters.q3_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q3_budget',
        '>=',
        filters.q3_budget_min,
      );
    }
    if (filters.q3_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q3_budget',
        '<=',
        filters.q3_budget_max,
      );
    }
    if (filters.q4_budget !== undefined) {
      query.where('inventory.budget_allocations.q4_budget', filters.q4_budget);
    }
    if (filters.q4_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q4_budget',
        '>=',
        filters.q4_budget_min,
      );
    }
    if (filters.q4_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q4_budget',
        '<=',
        filters.q4_budget_max,
      );
    }
    if (filters.q1_spent !== undefined) {
      query.where('inventory.budget_allocations.q1_spent', filters.q1_spent);
    }
    if (filters.q1_spent_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q1_spent',
        '>=',
        filters.q1_spent_min,
      );
    }
    if (filters.q1_spent_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q1_spent',
        '<=',
        filters.q1_spent_max,
      );
    }
    if (filters.q2_spent !== undefined) {
      query.where('inventory.budget_allocations.q2_spent', filters.q2_spent);
    }
    if (filters.q2_spent_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q2_spent',
        '>=',
        filters.q2_spent_min,
      );
    }
    if (filters.q2_spent_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q2_spent',
        '<=',
        filters.q2_spent_max,
      );
    }
    if (filters.q3_spent !== undefined) {
      query.where('inventory.budget_allocations.q3_spent', filters.q3_spent);
    }
    if (filters.q3_spent_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q3_spent',
        '>=',
        filters.q3_spent_min,
      );
    }
    if (filters.q3_spent_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q3_spent',
        '<=',
        filters.q3_spent_max,
      );
    }
    if (filters.q4_spent !== undefined) {
      query.where('inventory.budget_allocations.q4_spent', filters.q4_spent);
    }
    if (filters.q4_spent_min !== undefined) {
      query.where(
        'inventory.budget_allocations.q4_spent',
        '>=',
        filters.q4_spent_min,
      );
    }
    if (filters.q4_spent_max !== undefined) {
      query.where(
        'inventory.budget_allocations.q4_spent',
        '<=',
        filters.q4_spent_max,
      );
    }
    if (filters.total_spent !== undefined) {
      query.where(
        'inventory.budget_allocations.total_spent',
        filters.total_spent,
      );
    }
    if (filters.total_spent_min !== undefined) {
      query.where(
        'inventory.budget_allocations.total_spent',
        '>=',
        filters.total_spent_min,
      );
    }
    if (filters.total_spent_max !== undefined) {
      query.where(
        'inventory.budget_allocations.total_spent',
        '<=',
        filters.total_spent_max,
      );
    }
    if (filters.remaining_budget !== undefined) {
      query.where(
        'inventory.budget_allocations.remaining_budget',
        filters.remaining_budget,
      );
    }
    if (filters.remaining_budget_min !== undefined) {
      query.where(
        'inventory.budget_allocations.remaining_budget',
        '>=',
        filters.remaining_budget_min,
      );
    }
    if (filters.remaining_budget_max !== undefined) {
      query.where(
        'inventory.budget_allocations.remaining_budget',
        '<=',
        filters.remaining_budget_max,
      );
    }
    if (filters.is_active !== undefined) {
      query.where('inventory.budget_allocations.is_active', filters.is_active);
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
      id: 'inventory.budget_allocations.id',
      fiscalYear: 'inventory.budget_allocations.fiscal_year',
      budgetId: 'inventory.budget_allocations.budget_id',
      departmentId: 'inventory.budget_allocations.department_id',
      totalBudget: 'inventory.budget_allocations.total_budget',
      q1Budget: 'inventory.budget_allocations.q1_budget',
      q2Budget: 'inventory.budget_allocations.q2_budget',
      q3Budget: 'inventory.budget_allocations.q3_budget',
      q4Budget: 'inventory.budget_allocations.q4_budget',
      q1Spent: 'inventory.budget_allocations.q1_spent',
      q2Spent: 'inventory.budget_allocations.q2_spent',
      q3Spent: 'inventory.budget_allocations.q3_spent',
      q4Spent: 'inventory.budget_allocations.q4_spent',
      totalSpent: 'inventory.budget_allocations.total_spent',
      remainingBudget: 'inventory.budget_allocations.remaining_budget',
      isActive: 'inventory.budget_allocations.is_active',
      createdAt: 'inventory.budget_allocations.created_at',
      updatedAt: 'inventory.budget_allocations.updated_at',
    };

    return sortFields[sortBy] || 'inventory.budget_allocations.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetBudgetAllocationsQuery = {},
  ): Promise<BudgetAllocations | null> {
    let query = this.getJoinQuery();
    query = query.where('budget_allocations.id', id);

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
    query: BudgetAllocationsListQuery = {},
  ): Promise<PaginatedListResult<BudgetAllocations>> {
    return super.list(query);
  }

  // Business-specific methods are merged with unique constraint detection below

  // ===== ERROR HANDLING: DUPLICATE DETECTION METHODS =====

  // ===== ERROR HANDLING: DELETE VALIDATION METHODS =====

  /**
   * Check if record can be deleted
   * Returns foreign key references that would prevent deletion
   */
  async canBeDeleted(id: string | number): Promise<{
    canDelete: boolean;
    blockedBy: Array<{
      table: string;
      field: string;
      count: number;
      cascade: boolean;
    }>;
  }> {
    const blockedBy: Array<{
      table: string;
      field: string;
      count: number;
      cascade: boolean;
    }> = [];

    // Check budget_reservations references
    const budgetReservationsCount = await this.knex('budget_reservations')
      .where('allocation_id', id)
      .count('* as count')
      .first();

    if (parseInt((budgetReservationsCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'budget_reservations',
        field: 'allocation_id',
        count: parseInt((budgetReservationsCount?.count as string) || '0'),
        cascade: false,
      });
    }

    return {
      canDelete:
        blockedBy.length === 0 || blockedBy.every((ref) => ref.cascade),
      blockedBy,
    };
  }

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('inventory.budget_allocations')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(
    data: CreateBudgetAllocations[],
  ): Promise<BudgetAllocations[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('inventory.budget_allocations')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(
    data: CreateBudgetAllocations,
  ): Promise<BudgetAllocations> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('inventory.budget_allocations')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
