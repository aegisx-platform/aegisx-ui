import {
  BaseRepository,
  BaseListQuery,
  PaginatedListResult,
} from '../../../shared/repositories/base.repository';
import type { Knex } from 'knex';
import {
  type CreateNotifications,
  type UpdateNotifications,
  type Notifications,
  type GetNotificationsQuery,
  type ListNotificationsQuery,
  type NotificationsEntity,
} from '../types/notifications.types';

export interface NotificationsListQuery extends BaseListQuery {
  // Smart field-based filters for Notifications
  type?: string;
  read?: boolean;
  read_at_min?: Date;
  read_at_max?: Date;
  archived?: boolean;
  archived_at_min?: Date;
  archived_at_max?: Date;
  expires_at_min?: Date;
  expires_at_max?: Date;
  updated_at_min?: Date;
  updated_at_max?: Date;
}

export class NotificationsRepository extends BaseRepository<
  Notifications,
  CreateNotifications,
  UpdateNotifications
> {
  constructor(knex: Knex) {
    super(knex, 'notifications', [
      // Define searchable fields based on intelligent detection
      'notifications.title',
    ]);
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): Notifications {
    if (!dbRow) throw new Error('Cannot transform null database row');

    return {
      id: dbRow.id,
      user_id: dbRow.user_id,
      type: dbRow.type,
      title: dbRow.title,
      message: dbRow.message,
      data: dbRow.data,
      action_url: dbRow.action_url,
      read: dbRow.read,
      read_at: dbRow.read_at,
      archived: dbRow.archived,
      archived_at: dbRow.archived_at,
      priority: dbRow.priority,
      expires_at: dbRow.expires_at,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(
    dto: CreateNotifications | UpdateNotifications,
  ): Partial<NotificationsEntity> {
    const transformed: Partial<NotificationsEntity> = {};

    if ('user_id' in dto && dto.user_id !== undefined) {
      transformed.user_id = dto.user_id;
    }
    if ('type' in dto && dto.type !== undefined) {
      transformed.type = dto.type;
    }
    if ('title' in dto && dto.title !== undefined) {
      transformed.title = dto.title;
    }
    if ('message' in dto && dto.message !== undefined) {
      transformed.message = dto.message;
    }
    if ('data' in dto && dto.data !== undefined) {
      transformed.data = dto.data;
    }
    if ('action_url' in dto && dto.action_url !== undefined) {
      transformed.action_url = dto.action_url;
    }
    if ('read' in dto && dto.read !== undefined) {
      transformed.read = dto.read;
    }
    if ('read_at' in dto && dto.read_at !== undefined) {
      transformed.read_at =
        typeof dto.read_at === 'string' ? new Date(dto.read_at) : dto.read_at;
    }
    if ('archived' in dto && dto.archived !== undefined) {
      transformed.archived = dto.archived;
    }
    if ('archived_at' in dto && dto.archived_at !== undefined) {
      transformed.archived_at =
        typeof dto.archived_at === 'string'
          ? new Date(dto.archived_at)
          : dto.archived_at;
    }
    if ('priority' in dto && dto.priority !== undefined) {
      transformed.priority = dto.priority;
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
    return this.knex('notifications').select('notifications.*');
    // Add joins here if needed
    // .leftJoin('other_table', 'notifications.foreign_key', 'other_table.id')
  }

  // Apply custom filters
  protected applyCustomFilters(
    query: any,
    filters: NotificationsListQuery,
  ): void {
    // List of reserved parameters that should not be treated as filters
    const reservedParams = ['fields', 'format', 'include'];

    // List of UUID fields that need special handling
    const uuidFields = ['id', 'user_id'];

    // Apply general filters with UUID field validation
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        !reservedParams.includes(key)
      ) {
        const value = filters[key];

        // Skip empty strings for UUID fields
        if (
          uuidFields.includes(key) &&
          (value === '' || value === null || value === undefined)
        ) {
          return;
        }

        // Skip empty strings for regular string fields too
        if (typeof value === 'string' && value.trim() === '') {
          return;
        }

        // Apply the filter
        query.where(`notifications.${key}`, value);
      }
    });

    // Apply specific Notifications filters based on intelligent field categorization
    if (filters.type !== undefined && filters.type !== '') {
      query.where('notifications.type', filters.type);
    }
    if (filters.read !== undefined) {
      query.where('notifications.read', filters.read);
    }
    if (filters.read_at_min !== undefined) {
      query.where('notifications.read_at', '>=', filters.read_at_min);
    }
    if (filters.read_at_max !== undefined) {
      query.where('notifications.read_at', '<=', filters.read_at_max);
    }
    if (filters.archived !== undefined) {
      query.where('notifications.archived', filters.archived);
    }
    if (filters.archived_at_min !== undefined) {
      query.where('notifications.archived_at', '>=', filters.archived_at_min);
    }
    if (filters.archived_at_max !== undefined) {
      query.where('notifications.archived_at', '<=', filters.archived_at_max);
    }
    if (filters.expires_at_min !== undefined) {
      query.where('notifications.expires_at', '>=', filters.expires_at_min);
    }
    if (filters.expires_at_max !== undefined) {
      query.where('notifications.expires_at', '<=', filters.expires_at_max);
    }
    if (filters.updated_at_min !== undefined) {
      query.where('notifications.updated_at', '>=', filters.updated_at_min);
    }
    if (filters.updated_at_max !== undefined) {
      query.where('notifications.updated_at', '<=', filters.updated_at_max);
    }
  }

  // Custom sort fields mapping
  protected getSortField(sortBy: string): string {
    const sortFields: Record<string, string> = {
      id: 'notifications.id',
      userId: 'notifications.user_id',
      type: 'notifications.type',
      title: 'notifications.title',
      message: 'notifications.message',
      data: 'notifications.data',
      actionUrl: 'notifications.action_url',
      read: 'notifications.read',
      readAt: 'notifications.read_at',
      archived: 'notifications.archived',
      archivedAt: 'notifications.archived_at',
      priority: 'notifications.priority',
      expiresAt: 'notifications.expires_at',
      createdAt: 'notifications.created_at',
      updatedAt: 'notifications.updated_at',
    };

    return sortFields[sortBy] || 'notifications.id';
  }

  // Extended find method with options
  async findById(
    id: number | string,
    options: GetNotificationsQuery = {},
  ): Promise<Notifications | null> {
    let query = this.getJoinQuery();
    query = query.where('notifications.id', id);

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
    query: NotificationsListQuery = {},
  ): Promise<PaginatedListResult<Notifications>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      fields, // Extract fields parameter
      ...filters
    } = query;

    // Base query
    const baseQuery = this.getJoinQuery();

    // Handle field selection if specified
    if (fields && Array.isArray(fields) && fields.length > 0) {
      // Map field names to table columns with proper prefixing
      const validFields = fields
        .filter(
          (field) =>
            typeof field === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field),
        )
        .map((field) => `notifications.${field}`);

      if (validFields.length > 0) {
        baseQuery.clearSelect().select(validFields);
      }
    }

    // Apply search functionality
    if (search && this.searchFields.length > 0) {
      baseQuery.where((builder) => {
        this.searchFields.forEach((field, index) => {
          if (index === 0) {
            builder.whereILike(field, `%${search}%`);
          } else {
            builder.orWhereILike(field, `%${search}%`);
          }
        });
      });
    }

    // Apply custom filters (without fields parameter)
    this.applyCustomFilters(baseQuery, filters);

    // Get total count (use separate query without field selection)
    const countQuery = this.getJoinQuery();
    if (search && this.searchFields.length > 0) {
      countQuery.where((builder) => {
        this.searchFields.forEach((field, index) => {
          if (index === 0) {
            builder.whereILike(field, `%${search}%`);
          } else {
            builder.orWhereILike(field, `%${search}%`);
          }
        });
      });
    }
    this.applyCustomFilters(countQuery, filters);
    countQuery.clearSelect().count('* as total');
    const [{ total }] = await countQuery;

    // Apply sorting and pagination
    const data = await baseQuery
      .orderBy(this.getSortField(sortBy), sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    // Transform data if transformer is available
    const transformedData = data.map((row) => this.transformToEntity(row));

    const totalCount = parseInt(total as string);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Business-specific methods for unique/important fields

  async findByTitle(title: string): Promise<Notifications | null> {
    const query = this.getJoinQuery();
    const row = await query.where('notifications.title', title).first();
    return row ? this.transformToEntity(row) : null;
  }

  // Basic Statistics - count only
  async getStats(): Promise<{
    total: number;
  }> {
    const stats: any = await this.knex('notifications')
      .select([this.knex.raw('COUNT(*) as total')])
      .first();

    return {
      total: parseInt(stats?.total || '0'),
    };
  }

  // Bulk operations with better type safety
  async createMany(data: CreateNotifications[]): Promise<Notifications[]> {
    const transformedData = data.map((item) => this.transformToDb(item));
    const rows = await this.knex('notifications')
      .insert(transformedData)
      .returning('*');
    return rows.map((row) => this.transformToEntity(row));
  }

  // Transaction support for complex operations
  async createWithTransaction(
    data: CreateNotifications,
  ): Promise<Notifications> {
    return this.withTransaction(async (trx) => {
      const transformedData = this.transformToDb(data);
      const [row] = await trx('notifications')
        .insert(transformedData)
        .returning('*');
      return this.transformToEntity(row);
    });
  }
}
