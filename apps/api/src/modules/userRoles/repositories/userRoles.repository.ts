import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import { Knex } from 'knex';
import {
  type CreateUserRoles,
  type UpdateUserRoles,
  type UserRoles,
  type GetUserRolesQuery,
  type ListUserRolesQuery,
  type UserRolesEntity,
} from '../types/userRoles.types';

export interface UserRolesListQuery extends BaseListQuery {
  // Smart field-based filters for UserRoles
  role_id?: string;
  updated_at_min?: Date;
  updated_at_max?: Date;
  is_active?: boolean;
  assigned_at_min?: Date;
  assigned_at_max?: Date;
  expires_at_min?: Date;
  expires_at_max?: Date;
}

export class UserRolesRepository extends BaseRepository<
  UserRoles,
  CreateUserRoles,
  UpdateUserRoles
> {
  constructor(knex: Knex) {
    super(knex, 'user_roles', [
      // Define searchable fields based on intelligent detection
    ]);
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): UserRoles {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      user_id: dbRow.user_id,
      role_id: dbRow.role_id,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
      id: dbRow.id,
      is_active: dbRow.is_active,
      assigned_at: dbRow.assigned_at,
      assigned_by: dbRow.assigned_by,
      expires_at: dbRow.expires_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateUserRoles | UpdateUserRoles,
  ): Partial<UserRolesEntity> {
    const transformed: Partial<UserRolesEntity> = {};

    if ('user_id' in dto && dto.user_id !== undefined) {
      transformed.user_id = dto.user_id;
    }
    if ('role_id' in dto && dto.role_id !== undefined) {
      transformed.role_id = dto.role_id;
    }
    if ('is_active' in dto && dto.is_active !== undefined) {
      transformed.is_active = dto.is_active;
    }
    if ('assigned_at' in dto && dto.assigned_at !== undefined) {
      transformed.assigned_at =
        typeof dto.assigned_at === 'string'
          ? new Date(dto.assigned_at)
          : dto.assigned_at;
    }
    if ('assigned_by' in dto && dto.assigned_by !== undefined) {
      transformed.assigned_by = dto.assigned_by;
    }
    if ('expires_at' in dto && dto.expires_at !== undefined) {
      transformed.expires_at =
        typeof dto.expires_at === 'string'
          ? new Date(dto.expires_at)
          : dto.expires_at;
    }
    // updated_at is handled automatically by database

    return transformed;
  }

  // Custom query with joins if needed
  getJoinQuery() {
    return this.knex('user_roles').select('user_roles.*');
    // Add joins here if needed
    // .leftJoin('other_table', 'user_roles.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(query: any, filters: UserRolesListQuery): void {
    // Apply base filters first
    super.applyCustomFilters(query, filters);

    // Apply specific UserRoles filters based on intelligent field categorization
    if (filters.role_id !== undefined) {
      query.where('user_roles.role_id', filters.role_id);
    }
    if (filters.updated_at_min !== undefined) {
      query.where('user_roles.updated_at', '>=', filters.updated_at_min);
    }
    if (filters.updated_at_max !== undefined) {
      query.where('user_roles.updated_at', '<=', filters.updated_at_max);
    }
    if (filters.is_active !== undefined) {
      query.where('user_roles.is_active', filters.is_active);
    }
    if (filters.assigned_at_min !== undefined) {
      query.where('user_roles.assigned_at', '>=', filters.assigned_at_min);
    }
    if (filters.assigned_at_max !== undefined) {
      query.where('user_roles.assigned_at', '<=', filters.assigned_at_max);
    }
    if (filters.expires_at_min !== undefined) {
      query.where('user_roles.expires_at', '>=', filters.expires_at_min);
    }
    if (filters.expires_at_max !== undefined) {
      query.where('user_roles.expires_at', '<=', filters.expires_at_max);
    }
  }

  // Custom sort fields mapping
  protected getSortField(sortBy: string): string {
    const sortFields: Record<string, string> = {
      userId: 'user_roles.user_id',
      roleId: 'user_roles.role_id',
      createdAt: 'user_roles.created_at',
      updatedAt: 'user_roles.updated_at',
      id: 'user_roles.id',
      isActive: 'user_roles.is_active',
      assignedAt: 'user_roles.assigned_at',
      assignedBy: 'user_roles.assigned_by',
      expiresAt: 'user_roles.expires_at',
    };

    return sortFields[sortBy] || 'user_roles.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetUserRolesQuery = {},
  ): Promise<UserRoles | null> {
    let query = this.getJoinQuery();
    query = query.where('user_roles.id', id);

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
    query: UserRolesListQuery = {},
  ): Promise<PaginatedListResult<UserRoles>> {
    return super.list(query);
  }

  // Business-specific methods for unique/important fields

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('user_roles')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateUserRoles[]): Promise<UserRoles[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('user_roles')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(data: CreateUserRoles): Promise<UserRoles> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('user_roles')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
