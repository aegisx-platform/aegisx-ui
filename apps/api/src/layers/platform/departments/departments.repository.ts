import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type Departments,
  type CreateDepartments,
  type UpdateDepartments,
  type GetDepartmentsQuery,
  type ListDepartmentsQuery,
} from './departments.schemas';

/**
 * Core Departments Repository
 *
 * Manages department hierarchy in public schema.
 * This is the core department reference used system-wide.
 */

export interface DepartmentsListQuery extends BaseListQuery {
  // Smart field-based filters for Departments
  dept_code?: string;
  dept_name?: string;
  parent_id?: number;
  parent_id_min?: number;
  parent_id_max?: number;
  is_active?: boolean;
  import_batch_id?: string;
}

/**
 * Simplified department structure for dropdowns
 */
export interface DepartmentDropdownItem {
  id: number;
  dept_code: string;
  dept_name: string;
  parent_id: number | null;
  is_active: boolean;
}

/**
 * Department hierarchy node
 */
export interface DepartmentHierarchyNode {
  id: number;
  dept_code: string;
  dept_name: string;
  parent_id: number | null;
  is_active: boolean;
  children?: DepartmentHierarchyNode[];
}

/**
 * Delete validation result
 */
export interface DeleteValidationResult {
  canDelete: boolean;
  blockedBy: Array<{
    table: string;
    field: string;
    count: number;
    reason: string;
  }>;
}

export class DepartmentsRepository extends BaseRepository<
  Departments,
  CreateDepartments,
  UpdateDepartments
> {
  constructor(knex: Knex) {
    super(
      knex,
      'departments', // public schema table
      [
        'departments.dept_name', // searchable field
        'departments.dept_code',
      ],
      [], // no UUID fields
      {
        // Field configuration for automatic timestamp management
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: false,
        hasUpdatedBy: false,
      },
    );
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): Departments {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      dept_code: dbRow.dept_code,
      dept_name: dbRow.dept_name,
      parent_id: dbRow.parent_id,
      is_active: dbRow.is_active ?? true,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateDepartments | UpdateDepartments,
  ): Partial<Departments> {
    const transformed: Partial<Departments> = {};

    if ('dept_code' in dto && dto.dept_code !== undefined) {
      transformed.dept_code = dto.dept_code;
    }
    if ('dept_name' in dto && dto.dept_name !== undefined) {
      transformed.dept_name = dto.dept_name;
    }
    if ('parent_id' in dto) {
      transformed.parent_id = dto.parent_id;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery(): Knex.QueryBuilder {
    return this.knex('departments').select('departments.*');
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: Knex.QueryBuilder,
    filters: DepartmentsListQuery,
  ): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific Departments filters
    if (filters.dept_code !== undefined) {
      query.where('departments.dept_code', filters.dept_code);
    }
    if (filters.dept_name !== undefined) {
      query.where('departments.dept_name', 'ilike', `%${filters.dept_name}%`);
    }
    if (filters.parent_id !== undefined) {
      query.where('departments.parent_id', filters.parent_id);
    }
    if (filters.parent_id_min !== undefined) {
      query.where('departments.parent_id', '>=', filters.parent_id_min);
    }
    if (filters.parent_id_max !== undefined) {
      query.where('departments.parent_id', '<=', filters.parent_id_max);
    }
    if (filters.is_active !== undefined) {
      query.where('departments.is_active', filters.is_active);
    }
    if (filters.import_batch_id !== undefined) {
      query.where('departments.import_batch_id', filters.import_batch_id);
    }
  }

  // Apply multiple sort parsing
  protected applyMultipleSort(query: Knex.QueryBuilder, sort?: string): void {
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
      id: 'departments.id',
      dept_code: 'departments.dept_code',
      deptCode: 'departments.dept_code',
      dept_name: 'departments.dept_name',
      deptName: 'departments.dept_name',
      parent_id: 'departments.parent_id',
      parentId: 'departments.parent_id',
      is_active: 'departments.is_active',
      isActive: 'departments.is_active',
      import_batch_id: 'departments.import_batch_id',
      importBatchId: 'departments.import_batch_id',
      created_at: 'departments.created_at',
      createdAt: 'departments.created_at',
      updated_at: 'departments.updated_at',
      updatedAt: 'departments.updated_at',
    };

    return sortFields[sortBy] || 'departments.id';
  }

  /**
   * Find department by ID with optional includes
   */
  async findById(
    id: number | string,
    options: GetDepartmentsQuery = {},
  ): Promise<Departments | null> {
    let query = this.getJoinQuery();
    query = query.where('departments.id', id);

    // Handle include options if needed
    if (options.include) {
      const includes = Array.isArray(options.include)
        ? options.include
        : [options.include];
      includes.forEach((relation) => {
        // Future: add join logic for relationships if needed
      });
    }

    const row = await query.first();
    return row ? this.transformToEntity(row) : null;
  }

  /**
   * Find department by code
   */
  async findByCode(code: string): Promise<Departments | null> {
    const query = this.getJoinQuery();
    const row = await query.where('departments.dept_code', code).first();
    return row ? this.transformToEntity(row) : null;
  }

  /**
   * Extended list method with specific query type
   */
  async list(
    query: DepartmentsListQuery = {},
  ): Promise<PaginatedListResult<Departments>> {
    return super.list(query);
  }

  /**
   * Get department hierarchy starting from a parent
   * @param parentId - Parent department ID (null for root departments)
   * @returns Array of department hierarchy nodes with nested children
   */
  async getHierarchy(
    parentId?: number | null,
  ): Promise<DepartmentHierarchyNode[]> {
    // Get all departments to build hierarchy efficiently
    const allDepartments = await this.knex('departments')
      .select('id', 'dept_code', 'dept_name', 'parent_id', 'is_active')
      .where('is_active', true)
      .orderBy('dept_name', 'asc');

    // Build hierarchy tree
    const buildTree = (parent: number | null): DepartmentHierarchyNode[] => {
      return allDepartments
        .filter((dept) => {
          // Handle both null and 0 as "no parent" (root level)
          if (parent === null) {
            return dept.parent_id === null || dept.parent_id === 0;
          }
          return dept.parent_id === parent;
        })
        .map((dept) => ({
          id: dept.id,
          dept_code: dept.dept_code,
          dept_name: dept.dept_name,
          parent_id: dept.parent_id,
          is_active: dept.is_active,
          children: buildTree(dept.id),
        }));
    };

    return buildTree(parentId ?? null);
  }

  /**
   * Get simplified department list for dropdowns
   * @returns Array of departments with minimal fields for UI dropdowns
   */
  async getDropdown(): Promise<DepartmentDropdownItem[]> {
    const departments = await this.knex('departments')
      .select('id', 'dept_code', 'dept_name', 'parent_id', 'is_active')
      .where('is_active', true)
      .orderBy('dept_name', 'asc');

    return departments;
  }

  /**
   * Check if department can be deleted
   * Returns validation result with blocking references
   */
  async canBeDeleted(id: string | number): Promise<DeleteValidationResult> {
    const blockedBy: Array<{
      table: string;
      field: string;
      count: number;
      reason: string;
    }> = [];

    // Check for child departments
    const childrenCount = await this.knex('departments')
      .where('parent_id', id)
      .count('* as count')
      .first();

    if (parseInt((childrenCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'departments',
        field: 'parent_id',
        count: parseInt((childrenCount?.count as string) || '0'),
        reason: 'Department has child departments',
      });
    }

    // Check for user assignments
    const userAssignmentsCount = await this.knex('user_departments')
      .where('department_id', id)
      .count('* as count')
      .first();

    if (parseInt((userAssignmentsCount?.count as string) || '0') > 0) {
      blockedBy.push({
        table: 'user_departments',
        field: 'department_id',
        count: parseInt((userAssignmentsCount?.count as string) || '0'),
        reason: 'Department has assigned users',
      });
    }

    return {
      canDelete: blockedBy.length === 0,
      blockedBy,
    };
  }

  /**
   * Basic statistics - count only
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const stats: any = await this.knex('departments')
      .select([
        this.knex.raw('COUNT(*) as total'),
        this.knex.raw(
          'SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active',
        ),
        this.knex.raw(
          'SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive',
        ),
      ])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
      active: parseInt(stats?.active || '0'),
      inactive: parseInt(stats?.inactive || '0'),
    };
  }

  /**
   * Bulk operations - create many departments
   */
  async createMany(data: CreateDepartments[]): Promise<Departments[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('departments')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  /**
   * Transaction support for complex operations
   */
  async createWithTransaction(data: CreateDepartments): Promise<Departments> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('departments')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }

  /**
   * Validate parent department exists and is active
   */
  async validateParent(parentId: number | null): Promise<boolean> {
    if (parentId === null || parentId === undefined) {
      return true; // No parent is valid
    }

    const parent = await this.knex('departments')
      .where('id', parentId)
      .where('is_active', true)
      .first();

    return !!parent;
  }

  /**
   * Check for circular hierarchy
   * Prevents setting a child department as parent
   */
  async hasCircularHierarchy(
    departmentId: number,
    newParentId: number | null,
  ): Promise<boolean> {
    if (!newParentId) return false;

    // Check if newParentId is a descendant of departmentId
    let currentId: number | null = newParentId;
    const visited = new Set<number>();

    while (currentId !== null) {
      if (currentId === departmentId) {
        return true; // Circular reference detected
      }

      if (visited.has(currentId)) {
        // Already visited this node, prevent infinite loop
        break;
      }
      visited.add(currentId);

      const parent = await this.knex('departments')
        .select('parent_id')
        .where('id', currentId)
        .first();

      currentId = parent?.parent_id ?? null;
    }

    return false;
  }
}
