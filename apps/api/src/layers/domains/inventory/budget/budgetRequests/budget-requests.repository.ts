import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateBudgetRequests,
  type UpdateBudgetRequests,
  type BudgetRequests,
  type GetBudgetRequestsQuery,
  type ListBudgetRequestsQuery,
  type BudgetRequestsEntity,
} from './budget-requests.types';

export interface BudgetRequestsListQuery extends BaseListQuery {
  // Smart field-based filters for BudgetRequests
  request_number?: string;
  fiscal_year?: number;
  fiscal_year_min?: number;
  fiscal_year_max?: number;
  department_id?: number;
  department_id_min?: number;
  department_id_max?: number;
  total_requested_amount?: number;
  total_requested_amount_min?: number;
  total_requested_amount_max?: number;
  justification?: string;
  submitted_by?: string;
  dept_reviewed_by?: string;
  dept_comments?: string;
  finance_reviewed_by?: string;
  finance_comments?: string;
  rejection_reason?: string;
  created_by?: string;
  is_active?: boolean;
}

export class BudgetRequestsRepository extends BaseRepository<
  BudgetRequests,
  CreateBudgetRequests,
  UpdateBudgetRequests
> {
  constructor(knex: Knex) {
    super(
      knex,
      'inventory.budget_requests',
      [
        // Define searchable fields based on intelligent detection
        'inventory.budget_requests.dept_comments',
        'inventory.budget_requests.finance_comments',
      ],
      [], // explicitUUIDFields
      {
        // Field configuration for automatic timestamp and audit field management
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: true,
        hasUpdatedBy: false,
      },
    );
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): BudgetRequests {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      request_number: dbRow.request_number,
      fiscal_year: dbRow.fiscal_year,
      department_id: dbRow.department_id,
      status: dbRow.status,
      total_requested_amount: dbRow.total_requested_amount,
      justification: dbRow.justification,
      submitted_by: dbRow.submitted_by,
      submitted_at: dbRow.submitted_at,
      dept_reviewed_by: dbRow.dept_reviewed_by,
      dept_reviewed_at: dbRow.dept_reviewed_at,
      dept_comments: dbRow.dept_comments,
      finance_reviewed_by: dbRow.finance_reviewed_by,
      finance_reviewed_at: dbRow.finance_reviewed_at,
      finance_comments: dbRow.finance_comments,
      rejection_reason: dbRow.rejection_reason,
      created_by: dbRow.created_by,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
      deleted_at: dbRow.deleted_at,
      is_active: dbRow.is_active,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateBudgetRequests | UpdateBudgetRequests,
  ): Partial<BudgetRequestsEntity> {
    const transformed: Partial<BudgetRequestsEntity> = {};

    if ('request_number' in dto && dto.request_number !== undefined) {
      transformed.request_number = dto.request_number;
    }
    if ('fiscal_year' in dto && dto.fiscal_year !== undefined) {
      transformed.fiscal_year = dto.fiscal_year;
    }
    if ('department_id' in dto && dto.department_id !== undefined) {
      transformed.department_id = dto.department_id;
    }
    if ('status' in dto && dto.status !== undefined) {
      transformed.status = dto.status;
    }
    if (
      'total_requested_amount' in dto &&
      dto.total_requested_amount !== undefined
    ) {
      transformed.total_requested_amount = dto.total_requested_amount;
    }
    if ('justification' in dto && dto.justification !== undefined) {
      transformed.justification = dto.justification;
    }
    if ('submitted_by' in dto && dto.submitted_by !== undefined) {
      transformed.submitted_by = dto.submitted_by;
    }
    if ('submitted_at' in dto && dto.submitted_at !== undefined) {
      transformed.submitted_at =
        typeof dto.submitted_at === 'string'
          ? new Date(dto.submitted_at)
          : dto.submitted_at;
    }
    if ('dept_reviewed_by' in dto && dto.dept_reviewed_by !== undefined) {
      transformed.dept_reviewed_by = dto.dept_reviewed_by;
    }
    if ('dept_reviewed_at' in dto && dto.dept_reviewed_at !== undefined) {
      transformed.dept_reviewed_at =
        typeof dto.dept_reviewed_at === 'string'
          ? new Date(dto.dept_reviewed_at)
          : dto.dept_reviewed_at;
    }
    if ('dept_comments' in dto && dto.dept_comments !== undefined) {
      transformed.dept_comments = dto.dept_comments;
    }
    if ('finance_reviewed_by' in dto && dto.finance_reviewed_by !== undefined) {
      transformed.finance_reviewed_by = dto.finance_reviewed_by;
    }
    if ('finance_reviewed_at' in dto && dto.finance_reviewed_at !== undefined) {
      transformed.finance_reviewed_at =
        typeof dto.finance_reviewed_at === 'string'
          ? new Date(dto.finance_reviewed_at)
          : dto.finance_reviewed_at;
    }
    if ('finance_comments' in dto && dto.finance_comments !== undefined) {
      transformed.finance_comments = dto.finance_comments;
    }
    if ('rejection_reason' in dto && dto.rejection_reason !== undefined) {
      transformed.rejection_reason = dto.rejection_reason;
    }
    if ('created_by' in dto && dto.created_by !== undefined) {
      transformed.created_by = dto.created_by;
    }
    if ('deleted_at' in dto && dto.deleted_at !== undefined) {
      transformed.deleted_at =
        typeof dto.deleted_at === 'string'
          ? new Date(dto.deleted_at)
          : dto.deleted_at;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('inventory.budget_requests').select(
      'inventory.budget_requests.*',
    );
    // Add joins here if needed
    // .leftJoin('other_table', 'inventory.budget_requests.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: BudgetRequestsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific BudgetRequests filters based on intelligent field categorization
    if (filters.request_number !== undefined) {
      query.where(
        'inventory.budget_requests.request_number',
        filters.request_number,
      );
    }
    if (filters.fiscal_year !== undefined) {
      query.where('inventory.budget_requests.fiscal_year', filters.fiscal_year);
    }
    if (filters.fiscal_year_min !== undefined) {
      query.where(
        'inventory.budget_requests.fiscal_year',
        '>=',
        filters.fiscal_year_min,
      );
    }
    if (filters.fiscal_year_max !== undefined) {
      query.where(
        'inventory.budget_requests.fiscal_year',
        '<=',
        filters.fiscal_year_max,
      );
    }
    if (filters.department_id !== undefined) {
      query.where(
        'inventory.budget_requests.department_id',
        filters.department_id,
      );
    }
    if (filters.department_id_min !== undefined) {
      query.where(
        'inventory.budget_requests.department_id',
        '>=',
        filters.department_id_min,
      );
    }
    if (filters.department_id_max !== undefined) {
      query.where(
        'inventory.budget_requests.department_id',
        '<=',
        filters.department_id_max,
      );
    }
    if (filters.total_requested_amount !== undefined) {
      query.where(
        'inventory.budget_requests.total_requested_amount',
        filters.total_requested_amount,
      );
    }
    if (filters.total_requested_amount_min !== undefined) {
      query.where(
        'inventory.budget_requests.total_requested_amount',
        '>=',
        filters.total_requested_amount_min,
      );
    }
    if (filters.total_requested_amount_max !== undefined) {
      query.where(
        'inventory.budget_requests.total_requested_amount',
        '<=',
        filters.total_requested_amount_max,
      );
    }
    if (filters.justification !== undefined) {
      query.where(
        'inventory.budget_requests.justification',
        filters.justification,
      );
    }
    if (filters.submitted_by !== undefined) {
      query.where(
        'inventory.budget_requests.submitted_by',
        filters.submitted_by,
      );
    }
    if (filters.dept_reviewed_by !== undefined) {
      query.where(
        'inventory.budget_requests.dept_reviewed_by',
        filters.dept_reviewed_by,
      );
    }
    if (filters.dept_comments !== undefined) {
      query.where(
        'inventory.budget_requests.dept_comments',
        filters.dept_comments,
      );
    }
    if (filters.finance_reviewed_by !== undefined) {
      query.where(
        'inventory.budget_requests.finance_reviewed_by',
        filters.finance_reviewed_by,
      );
    }
    if (filters.finance_comments !== undefined) {
      query.where(
        'inventory.budget_requests.finance_comments',
        filters.finance_comments,
      );
    }
    if (filters.rejection_reason !== undefined) {
      query.where(
        'inventory.budget_requests.rejection_reason',
        filters.rejection_reason,
      );
    }
    if (filters.created_by !== undefined) {
      query.where('inventory.budget_requests.created_by', filters.created_by);
    }
    if (filters.is_active !== undefined) {
      query.where('inventory.budget_requests.is_active', filters.is_active);
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
      id: 'inventory.budget_requests.id',
      requestNumber: 'inventory.budget_requests.request_number',
      fiscalYear: 'inventory.budget_requests.fiscal_year',
      departmentId: 'inventory.budget_requests.department_id',
      status: 'inventory.budget_requests.status',
      totalRequestedAmount: 'inventory.budget_requests.total_requested_amount',
      justification: 'inventory.budget_requests.justification',
      submittedBy: 'inventory.budget_requests.submitted_by',
      submittedAt: 'inventory.budget_requests.submitted_at',
      deptReviewedBy: 'inventory.budget_requests.dept_reviewed_by',
      deptReviewedAt: 'inventory.budget_requests.dept_reviewed_at',
      deptComments: 'inventory.budget_requests.dept_comments',
      financeReviewedBy: 'inventory.budget_requests.finance_reviewed_by',
      financeReviewedAt: 'inventory.budget_requests.finance_reviewed_at',
      financeComments: 'inventory.budget_requests.finance_comments',
      rejectionReason: 'inventory.budget_requests.rejection_reason',
      createdBy: 'inventory.budget_requests.created_by',
      createdAt: 'inventory.budget_requests.created_at',
      updatedAt: 'inventory.budget_requests.updated_at',
      deletedAt: 'inventory.budget_requests.deleted_at',
      isActive: 'inventory.budget_requests.is_active',
    };

    return sortFields[sortBy] || 'inventory.budget_requests.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetBudgetRequestsQuery = {},
  ): Promise<BudgetRequests | null> {
    let query = this.getJoinQuery();
    query = query.where('budget_requests.id', id);

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
    query: BudgetRequestsListQuery = {},
  ): Promise<PaginatedListResult<BudgetRequests>> {
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

    // Check budget_request_items references
    const budgetRequestItemsCount = await this.knex('budget_request_items')
      .where('budget_request_id', id)
      .count('* as count')
      .first();

    if (parseInt((budgetRequestItemsCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'budget_request_items',
        field: 'budget_request_id',
        count: parseInt((budgetRequestItemsCount?.count as string) || '0'),
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
    const stats: any = await this.knex('inventory.budget_requests')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateBudgetRequests[]): Promise<BudgetRequests[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('inventory.budget_requests')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(
    data: CreateBudgetRequests,
  ): Promise<BudgetRequests> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('inventory.budget_requests')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
