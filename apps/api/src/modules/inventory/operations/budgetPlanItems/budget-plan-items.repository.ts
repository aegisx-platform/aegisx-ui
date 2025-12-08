import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateBudgetPlanItems,
  type UpdateBudgetPlanItems,
  type BudgetPlanItems,
  type GetBudgetPlanItemsQuery,
  type ListBudgetPlanItemsQuery,
  type BudgetPlanItemsEntity,
} from './budget-plan-items.types';

export interface BudgetPlanItemsListQuery extends BaseListQuery {
  // Smart field-based filters for BudgetPlanItems
  budget_plan_id?: number;
  budget_plan_id_min?: number;
  budget_plan_id_max?: number;
  generic_id?: number;
  generic_id_min?: number;
  generic_id_max?: number;
  last_year_qty?: number;
  last_year_qty_min?: number;
  last_year_qty_max?: number;
  two_years_ago_qty?: number;
  two_years_ago_qty_min?: number;
  two_years_ago_qty_max?: number;
  three_years_ago_qty?: number;
  three_years_ago_qty_min?: number;
  three_years_ago_qty_max?: number;
  planned_quantity?: number;
  planned_quantity_min?: number;
  planned_quantity_max?: number;
  estimated_unit_price?: number;
  estimated_unit_price_min?: number;
  estimated_unit_price_max?: number;
  total_planned_value?: number;
  total_planned_value_min?: number;
  total_planned_value_max?: number;
  q1_planned_qty?: number;
  q1_planned_qty_min?: number;
  q1_planned_qty_max?: number;
  q2_planned_qty?: number;
  q2_planned_qty_min?: number;
  q2_planned_qty_max?: number;
  q3_planned_qty?: number;
  q3_planned_qty_min?: number;
  q3_planned_qty_max?: number;
  q4_planned_qty?: number;
  q4_planned_qty_min?: number;
  q4_planned_qty_max?: number;
  q1_purchased_qty?: number;
  q1_purchased_qty_min?: number;
  q1_purchased_qty_max?: number;
  q2_purchased_qty?: number;
  q2_purchased_qty_min?: number;
  q2_purchased_qty_max?: number;
  q3_purchased_qty?: number;
  q3_purchased_qty_min?: number;
  q3_purchased_qty_max?: number;
  q4_purchased_qty?: number;
  q4_purchased_qty_min?: number;
  q4_purchased_qty_max?: number;
  total_purchased_qty?: number;
  total_purchased_qty_min?: number;
  total_purchased_qty_max?: number;
  total_purchased_value?: number;
  total_purchased_value_min?: number;
  total_purchased_value_max?: number;
  notes?: string;
}

export class BudgetPlanItemsRepository extends BaseRepository<
  BudgetPlanItems,
  CreateBudgetPlanItems,
  UpdateBudgetPlanItems
> {
  constructor(knex: Knex) {
    super(
      knex,
      'inventory.budget_plan_items',
      [
        // Define searchable fields based on intelligent detection
        'inventory.budget_plan_items.notes',
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
  transformToEntity(dbRow: any): BudgetPlanItems {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      budget_plan_id: dbRow.budget_plan_id,
      generic_id: dbRow.generic_id,
      last_year_qty: dbRow.last_year_qty,
      two_years_ago_qty: dbRow.two_years_ago_qty,
      three_years_ago_qty: dbRow.three_years_ago_qty,
      planned_quantity: dbRow.planned_quantity,
      estimated_unit_price: dbRow.estimated_unit_price,
      total_planned_value: dbRow.total_planned_value,
      q1_planned_qty: dbRow.q1_planned_qty,
      q2_planned_qty: dbRow.q2_planned_qty,
      q3_planned_qty: dbRow.q3_planned_qty,
      q4_planned_qty: dbRow.q4_planned_qty,
      q1_purchased_qty: dbRow.q1_purchased_qty,
      q2_purchased_qty: dbRow.q2_purchased_qty,
      q3_purchased_qty: dbRow.q3_purchased_qty,
      q4_purchased_qty: dbRow.q4_purchased_qty,
      total_purchased_qty: dbRow.total_purchased_qty,
      total_purchased_value: dbRow.total_purchased_value,
      notes: dbRow.notes,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateBudgetPlanItems | UpdateBudgetPlanItems,
  ): Partial<BudgetPlanItemsEntity> {
    const transformed: Partial<BudgetPlanItemsEntity> = {};

    if ('budget_plan_id' in dto && dto.budget_plan_id !== undefined) {
      transformed.budget_plan_id = dto.budget_plan_id;
    }
    if ('generic_id' in dto && dto.generic_id !== undefined) {
      transformed.generic_id = dto.generic_id;
    }
    if ('last_year_qty' in dto && dto.last_year_qty !== undefined) {
      transformed.last_year_qty = dto.last_year_qty;
    }
    if ('two_years_ago_qty' in dto && dto.two_years_ago_qty !== undefined) {
      transformed.two_years_ago_qty = dto.two_years_ago_qty;
    }
    if ('three_years_ago_qty' in dto && dto.three_years_ago_qty !== undefined) {
      transformed.three_years_ago_qty = dto.three_years_ago_qty;
    }
    if ('planned_quantity' in dto && dto.planned_quantity !== undefined) {
      transformed.planned_quantity = dto.planned_quantity;
    }
    if (
      'estimated_unit_price' in dto &&
      dto.estimated_unit_price !== undefined
    ) {
      transformed.estimated_unit_price = dto.estimated_unit_price;
    }
    if ('total_planned_value' in dto && dto.total_planned_value !== undefined) {
      transformed.total_planned_value = dto.total_planned_value;
    }
    if ('q1_planned_qty' in dto && dto.q1_planned_qty !== undefined) {
      transformed.q1_planned_qty = dto.q1_planned_qty;
    }
    if ('q2_planned_qty' in dto && dto.q2_planned_qty !== undefined) {
      transformed.q2_planned_qty = dto.q2_planned_qty;
    }
    if ('q3_planned_qty' in dto && dto.q3_planned_qty !== undefined) {
      transformed.q3_planned_qty = dto.q3_planned_qty;
    }
    if ('q4_planned_qty' in dto && dto.q4_planned_qty !== undefined) {
      transformed.q4_planned_qty = dto.q4_planned_qty;
    }
    if ('q1_purchased_qty' in dto && dto.q1_purchased_qty !== undefined) {
      transformed.q1_purchased_qty = dto.q1_purchased_qty;
    }
    if ('q2_purchased_qty' in dto && dto.q2_purchased_qty !== undefined) {
      transformed.q2_purchased_qty = dto.q2_purchased_qty;
    }
    if ('q3_purchased_qty' in dto && dto.q3_purchased_qty !== undefined) {
      transformed.q3_purchased_qty = dto.q3_purchased_qty;
    }
    if ('q4_purchased_qty' in dto && dto.q4_purchased_qty !== undefined) {
      transformed.q4_purchased_qty = dto.q4_purchased_qty;
    }
    if ('total_purchased_qty' in dto && dto.total_purchased_qty !== undefined) {
      transformed.total_purchased_qty = dto.total_purchased_qty;
    }
    if (
      'total_purchased_value' in dto &&
      dto.total_purchased_value !== undefined
    ) {
      transformed.total_purchased_value = dto.total_purchased_value;
    }
    if ('notes' in dto && dto.notes !== undefined) {
      transformed.notes = dto.notes;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('inventory.budget_plan_items').select(
      'inventory.budget_plan_items.*',
    );
    // Add joins here if needed
    // .leftJoin('other_table', 'inventory.budget_plan_items.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: BudgetPlanItemsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific BudgetPlanItems filters based on intelligent field categorization
    if (filters.budget_plan_id !== undefined) {
      query.where(
        'inventory.budget_plan_items.budget_plan_id',
        filters.budget_plan_id,
      );
    }
    if (filters.budget_plan_id_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.budget_plan_id',
        '>=',
        filters.budget_plan_id_min,
      );
    }
    if (filters.budget_plan_id_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.budget_plan_id',
        '<=',
        filters.budget_plan_id_max,
      );
    }
    if (filters.generic_id !== undefined) {
      query.where('inventory.budget_plan_items.generic_id', filters.generic_id);
    }
    if (filters.generic_id_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.generic_id',
        '>=',
        filters.generic_id_min,
      );
    }
    if (filters.generic_id_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.generic_id',
        '<=',
        filters.generic_id_max,
      );
    }
    if (filters.last_year_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.last_year_qty',
        filters.last_year_qty,
      );
    }
    if (filters.last_year_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.last_year_qty',
        '>=',
        filters.last_year_qty_min,
      );
    }
    if (filters.last_year_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.last_year_qty',
        '<=',
        filters.last_year_qty_max,
      );
    }
    if (filters.two_years_ago_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.two_years_ago_qty',
        filters.two_years_ago_qty,
      );
    }
    if (filters.two_years_ago_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.two_years_ago_qty',
        '>=',
        filters.two_years_ago_qty_min,
      );
    }
    if (filters.two_years_ago_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.two_years_ago_qty',
        '<=',
        filters.two_years_ago_qty_max,
      );
    }
    if (filters.three_years_ago_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.three_years_ago_qty',
        filters.three_years_ago_qty,
      );
    }
    if (filters.three_years_ago_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.three_years_ago_qty',
        '>=',
        filters.three_years_ago_qty_min,
      );
    }
    if (filters.three_years_ago_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.three_years_ago_qty',
        '<=',
        filters.three_years_ago_qty_max,
      );
    }
    if (filters.planned_quantity !== undefined) {
      query.where(
        'inventory.budget_plan_items.planned_quantity',
        filters.planned_quantity,
      );
    }
    if (filters.planned_quantity_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.planned_quantity',
        '>=',
        filters.planned_quantity_min,
      );
    }
    if (filters.planned_quantity_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.planned_quantity',
        '<=',
        filters.planned_quantity_max,
      );
    }
    if (filters.estimated_unit_price !== undefined) {
      query.where(
        'inventory.budget_plan_items.estimated_unit_price',
        filters.estimated_unit_price,
      );
    }
    if (filters.estimated_unit_price_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.estimated_unit_price',
        '>=',
        filters.estimated_unit_price_min,
      );
    }
    if (filters.estimated_unit_price_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.estimated_unit_price',
        '<=',
        filters.estimated_unit_price_max,
      );
    }
    if (filters.total_planned_value !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_planned_value',
        filters.total_planned_value,
      );
    }
    if (filters.total_planned_value_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_planned_value',
        '>=',
        filters.total_planned_value_min,
      );
    }
    if (filters.total_planned_value_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_planned_value',
        '<=',
        filters.total_planned_value_max,
      );
    }
    if (filters.q1_planned_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_planned_qty',
        filters.q1_planned_qty,
      );
    }
    if (filters.q1_planned_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_planned_qty',
        '>=',
        filters.q1_planned_qty_min,
      );
    }
    if (filters.q1_planned_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_planned_qty',
        '<=',
        filters.q1_planned_qty_max,
      );
    }
    if (filters.q2_planned_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_planned_qty',
        filters.q2_planned_qty,
      );
    }
    if (filters.q2_planned_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_planned_qty',
        '>=',
        filters.q2_planned_qty_min,
      );
    }
    if (filters.q2_planned_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_planned_qty',
        '<=',
        filters.q2_planned_qty_max,
      );
    }
    if (filters.q3_planned_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_planned_qty',
        filters.q3_planned_qty,
      );
    }
    if (filters.q3_planned_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_planned_qty',
        '>=',
        filters.q3_planned_qty_min,
      );
    }
    if (filters.q3_planned_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_planned_qty',
        '<=',
        filters.q3_planned_qty_max,
      );
    }
    if (filters.q4_planned_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_planned_qty',
        filters.q4_planned_qty,
      );
    }
    if (filters.q4_planned_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_planned_qty',
        '>=',
        filters.q4_planned_qty_min,
      );
    }
    if (filters.q4_planned_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_planned_qty',
        '<=',
        filters.q4_planned_qty_max,
      );
    }
    if (filters.q1_purchased_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_purchased_qty',
        filters.q1_purchased_qty,
      );
    }
    if (filters.q1_purchased_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_purchased_qty',
        '>=',
        filters.q1_purchased_qty_min,
      );
    }
    if (filters.q1_purchased_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q1_purchased_qty',
        '<=',
        filters.q1_purchased_qty_max,
      );
    }
    if (filters.q2_purchased_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_purchased_qty',
        filters.q2_purchased_qty,
      );
    }
    if (filters.q2_purchased_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_purchased_qty',
        '>=',
        filters.q2_purchased_qty_min,
      );
    }
    if (filters.q2_purchased_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q2_purchased_qty',
        '<=',
        filters.q2_purchased_qty_max,
      );
    }
    if (filters.q3_purchased_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_purchased_qty',
        filters.q3_purchased_qty,
      );
    }
    if (filters.q3_purchased_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_purchased_qty',
        '>=',
        filters.q3_purchased_qty_min,
      );
    }
    if (filters.q3_purchased_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q3_purchased_qty',
        '<=',
        filters.q3_purchased_qty_max,
      );
    }
    if (filters.q4_purchased_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_purchased_qty',
        filters.q4_purchased_qty,
      );
    }
    if (filters.q4_purchased_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_purchased_qty',
        '>=',
        filters.q4_purchased_qty_min,
      );
    }
    if (filters.q4_purchased_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.q4_purchased_qty',
        '<=',
        filters.q4_purchased_qty_max,
      );
    }
    if (filters.total_purchased_qty !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_qty',
        filters.total_purchased_qty,
      );
    }
    if (filters.total_purchased_qty_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_qty',
        '>=',
        filters.total_purchased_qty_min,
      );
    }
    if (filters.total_purchased_qty_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_qty',
        '<=',
        filters.total_purchased_qty_max,
      );
    }
    if (filters.total_purchased_value !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_value',
        filters.total_purchased_value,
      );
    }
    if (filters.total_purchased_value_min !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_value',
        '>=',
        filters.total_purchased_value_min,
      );
    }
    if (filters.total_purchased_value_max !== undefined) {
      query.where(
        'inventory.budget_plan_items.total_purchased_value',
        '<=',
        filters.total_purchased_value_max,
      );
    }
    if (filters.notes !== undefined) {
      query.where('inventory.budget_plan_items.notes', filters.notes);
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
      id: 'inventory.budget_plan_items.id',
      budgetPlanId: 'inventory.budget_plan_items.budget_plan_id',
      genericId: 'inventory.budget_plan_items.generic_id',
      lastYearQty: 'inventory.budget_plan_items.last_year_qty',
      twoYearsAgoQty: 'inventory.budget_plan_items.two_years_ago_qty',
      threeYearsAgoQty: 'inventory.budget_plan_items.three_years_ago_qty',
      plannedQuantity: 'inventory.budget_plan_items.planned_quantity',
      estimatedUnitPrice: 'inventory.budget_plan_items.estimated_unit_price',
      totalPlannedValue: 'inventory.budget_plan_items.total_planned_value',
      q1PlannedQty: 'inventory.budget_plan_items.q1_planned_qty',
      q2PlannedQty: 'inventory.budget_plan_items.q2_planned_qty',
      q3PlannedQty: 'inventory.budget_plan_items.q3_planned_qty',
      q4PlannedQty: 'inventory.budget_plan_items.q4_planned_qty',
      q1PurchasedQty: 'inventory.budget_plan_items.q1_purchased_qty',
      q2PurchasedQty: 'inventory.budget_plan_items.q2_purchased_qty',
      q3PurchasedQty: 'inventory.budget_plan_items.q3_purchased_qty',
      q4PurchasedQty: 'inventory.budget_plan_items.q4_purchased_qty',
      totalPurchasedQty: 'inventory.budget_plan_items.total_purchased_qty',
      totalPurchasedValue: 'inventory.budget_plan_items.total_purchased_value',
      notes: 'inventory.budget_plan_items.notes',
      createdAt: 'inventory.budget_plan_items.created_at',
      updatedAt: 'inventory.budget_plan_items.updated_at',
    };

    return sortFields[sortBy] || 'inventory.budget_plan_items.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetBudgetPlanItemsQuery = {},
  ): Promise<BudgetPlanItems | null> {
    let query = this.getJoinQuery();
    query = query.where('budget_plan_items.id', id);

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
    query: BudgetPlanItemsListQuery = {},
  ): Promise<PaginatedListResult<BudgetPlanItems>> {
    return super.list(query);
  }

  // Business-specific methods are merged with unique constraint detection below

  // ===== ERROR HANDLING: DUPLICATE DETECTION METHODS =====

  // ===== ERROR HANDLING: DELETE VALIDATION METHODS =====

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('inventory.budget_plan_items')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateBudgetPlanItems[]): Promise<BudgetPlanItems[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('inventory.budget_plan_items')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(
    data: CreateBudgetPlanItems,
  ): Promise<BudgetPlanItems> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('inventory.budget_plan_items')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
