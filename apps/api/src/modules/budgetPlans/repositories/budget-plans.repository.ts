import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateBudgetPlans,
  type UpdateBudgetPlans,
  type BudgetPlans,
  type GetBudgetPlansQuery,
  type ListBudgetPlansQuery,
  type BudgetPlansEntity,
} from '../types/budget-plans.types';

export interface BudgetPlansListQuery extends BaseListQuery {
  // Smart field-based filters for BudgetPlans
  fiscal_year?: number;
  fiscal_year_min?: number;
  fiscal_year_max?: number;
  department_id?: number;
  department_id_min?: number;
  department_id_max?: number;
  plan_name?: string;
  total_planned_amount?: number;
  total_planned_amount_min?: number;
  total_planned_amount_max?: number;
  approved_by?: string;
  is_active?: boolean;
}

export class BudgetPlansRepository extends BaseRepository<
  BudgetPlans,
  CreateBudgetPlans,
  UpdateBudgetPlans
> {
  constructor(knex: Knex) {
    super(
      knex,
      'budget_plans',
      [
        // Define searchable fields based on intelligent detection
        'budget_plans.plan_name',
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
  transformToEntity(dbRow: any): BudgetPlans {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      fiscal_year: dbRow.fiscal_year,
      department_id: dbRow.department_id,
      plan_name: dbRow.plan_name,
      total_planned_amount: dbRow.total_planned_amount,
      status: dbRow.status,
      approved_at: dbRow.approved_at,
      approved_by: dbRow.approved_by,
      is_active: dbRow.is_active,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateBudgetPlans | UpdateBudgetPlans,
  ): Partial<BudgetPlansEntity> {
    const transformed: Partial<BudgetPlansEntity> = {};

    if ('fiscal_year' in dto && dto.fiscal_year !== undefined) {
      transformed.fiscal_year = dto.fiscal_year;
    }
    if ('department_id' in dto && dto.department_id !== undefined) {
      transformed.department_id = dto.department_id;
    }
    if ('plan_name' in dto && dto.plan_name !== undefined) {
      transformed.plan_name = dto.plan_name;
    }
    if (
      'total_planned_amount' in dto &&
      dto.total_planned_amount !== undefined
    ) {
      transformed.total_planned_amount = dto.total_planned_amount;
    }
    if ('status' in dto && dto.status !== undefined) {
      transformed.status = dto.status;
    }
    if ('approved_at' in dto && dto.approved_at !== undefined) {
      transformed.approved_at =
        typeof dto.approved_at === 'string'
          ? new Date(dto.approved_at)
          : dto.approved_at;
    }
    if ('approved_by' in dto && dto.approved_by !== undefined) {
      transformed.approved_by = dto.approved_by;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('budget_plans').select('budget_plans.*');
    // Add joins here if needed
    // .leftJoin('other_table', 'budget_plans.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: BudgetPlansListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific BudgetPlans filters based on intelligent field categorization
    if (filters.fiscal_year !== undefined) {
      query.where('budget_plans.fiscal_year', filters.fiscal_year);
    }
    if (filters.fiscal_year_min !== undefined) {
      query.where('budget_plans.fiscal_year', '>=', filters.fiscal_year_min);
    }
    if (filters.fiscal_year_max !== undefined) {
      query.where('budget_plans.fiscal_year', '<=', filters.fiscal_year_max);
    }
    if (filters.department_id !== undefined) {
      query.where('budget_plans.department_id', filters.department_id);
    }
    if (filters.department_id_min !== undefined) {
      query.where(
        'budget_plans.department_id',
        '>=',
        filters.department_id_min,
      );
    }
    if (filters.department_id_max !== undefined) {
      query.where(
        'budget_plans.department_id',
        '<=',
        filters.department_id_max,
      );
    }
    if (filters.plan_name !== undefined) {
      query.where('budget_plans.plan_name', filters.plan_name);
    }
    if (filters.total_planned_amount !== undefined) {
      query.where(
        'budget_plans.total_planned_amount',
        filters.total_planned_amount,
      );
    }
    if (filters.total_planned_amount_min !== undefined) {
      query.where(
        'budget_plans.total_planned_amount',
        '>=',
        filters.total_planned_amount_min,
      );
    }
    if (filters.total_planned_amount_max !== undefined) {
      query.where(
        'budget_plans.total_planned_amount',
        '<=',
        filters.total_planned_amount_max,
      );
    }
    if (filters.approved_by !== undefined) {
      query.where('budget_plans.approved_by', filters.approved_by);
    }
    if (filters.is_active !== undefined) {
      query.where('budget_plans.is_active', filters.is_active);
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
      id: 'budget_plans.id',
      fiscalYear: 'budget_plans.fiscal_year',
      departmentId: 'budget_plans.department_id',
      planName: 'budget_plans.plan_name',
      totalPlannedAmount: 'budget_plans.total_planned_amount',
      status: 'budget_plans.status',
      approvedAt: 'budget_plans.approved_at',
      approvedBy: 'budget_plans.approved_by',
      isActive: 'budget_plans.is_active',
      createdAt: 'budget_plans.created_at',
      updatedAt: 'budget_plans.updated_at',
    };

    return sortFields[sortBy] || 'budget_plans.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetBudgetPlansQuery = {},
  ): Promise<BudgetPlans | null> {
    let query = this.getJoinQuery();
    query = query.where('budget_plans.id', id);

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
    query: BudgetPlansListQuery = {},
  ): Promise<PaginatedListResult<BudgetPlans>> {
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

    // Check budget_plan_items references
    const budgetPlanItemsCount = await this.knex('budget_plan_items')
      .where('budget_plan_id', id)
      .count('* as count')
      .first();

    if (parseInt((budgetPlanItemsCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'budget_plan_items',
        field: 'budget_plan_id',
        count: parseInt((budgetPlanItemsCount?.count as string) || '0'),
        cascade: true,
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
    const stats: any = await this.knex('budget_plans')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateBudgetPlans[]): Promise<BudgetPlans[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('budget_plans')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(data: CreateBudgetPlans): Promise<BudgetPlans> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('budget_plans')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
