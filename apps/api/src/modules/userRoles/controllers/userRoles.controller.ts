import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { UserRolesService } from '../services/userRoles.service';
import { CreateUserRoles, UpdateUserRoles } from '../types/userRoles.types';
import {
  CreateUserRolesSchema,
  UpdateUserRolesSchema,
  UserRolesIdParamSchema,
  GetUserRolesQuerySchema,
  ListUserRolesQuerySchema,
} from '../schemas/userRoles.schemas';
import {
  DropdownQuerySchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  StatusToggleSchema,
  ValidationRequestSchema,
  UniquenessCheckSchema,
} from '../../../schemas/base.schemas';

/**
 * UserRoles Controller
 * Package: full
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class UserRolesController {
  constructor(private userRolesService: UserRolesService) {}

  /**
   * Create new userRoles
   * POST /userRoles
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateUserRolesSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating userRoles');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body);

    const userRoles = await this.userRolesService.create(createData);

    request.log.info(
      { userRolesId: userRoles.id },
      'UserRoles created successfully',
    );

    return reply.code(201).success(userRoles, 'UserRoles created successfully');
  }

  /**
   * Get userRoles by ID
   * GET /userRoles/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof UserRolesIdParamSchema>;
      Querystring: Static<typeof GetUserRolesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ userRolesId: id }, 'Fetching userRoles');

    const userRoles = await this.userRolesService.findById(id, request.query);

    return reply.success(userRoles);
  }

  /**
   * Get paginated list of userRoless
   * GET /userRoles
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListUserRolesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching userRoles list');

    const result = await this.userRolesService.findMany(request.query);

    request.log.info(
      { count: result.data.length, total: result.pagination.total },
      'UserRoles list fetched',
    );

    return reply.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }

  /**
   * Update userRoles
   * PUT /userRoles/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof UserRolesIdParamSchema>;
      Body: Static<typeof UpdateUserRolesSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { userRolesId: id, body: request.body },
      'Updating userRoles',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body);

    const userRoles = await this.userRolesService.update(id, updateData);

    request.log.info({ userRolesId: id }, 'UserRoles updated successfully');

    return reply.success(userRoles, 'UserRoles updated successfully');
  }

  /**
   * Delete userRoles
   * DELETE /userRoles/:id
   */
  async delete(
    request: FastifyRequest<{ Params: Static<typeof UserRolesIdParamSchema> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ userRolesId: id }, 'Deleting userRoles');

    const deleted = await this.userRolesService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'UserRoles not found');
    }

    request.log.info({ userRolesId: id }, 'UserRoles deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'UserRoles deleted successfully',
    );
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options
   * GET /userRoles/dropdown
   */
  async getDropdownOptions(
    request: FastifyRequest<{
      Querystring: Static<typeof DropdownQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching userRoles dropdown options',
    );

    const result = await this.userRolesService.getDropdownOptions(
      request.query,
    );

    return reply.success({
      options: result.options,
      total: result.total,
    });
  }

  /**
   * Bulk create userRoless
   * POST /userRoles/bulk
   */
  async bulkCreate(
    request: FastifyRequest<{
      Body: {
        items: CreateUserRoles[];
        options?: { skipDuplicates?: boolean; continueOnError?: boolean };
      };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk creating userRoless',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => this.transformCreateSchema(item)),
    };

    const result = await this.userRolesService.bulkCreate(transformedData);

    return reply
      .code(201)
      .success(
        result,
        `Bulk create completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
      );
  }

  /**
   * Bulk update userRoless
   * PUT /userRoles/bulk
   */
  async bulkUpdate(
    request: FastifyRequest<{
      Body: { items: Array<{ id: string | number; data: UpdateUserRoles }> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk updating userRoless',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => ({
        id: item.id,
        data: this.transformUpdateSchema(item.data),
      })),
    };

    const result = await this.userRolesService.bulkUpdate(transformedData);

    return reply.success(
      result,
      `Bulk update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk delete userRoless
   * DELETE /userRoles/bulk
   */
  async bulkDelete(
    request: FastifyRequest<{ Body: Static<typeof BulkDeleteSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.ids.length },
      'Bulk deleting userRoless',
    );

    const result = await this.userRolesService.bulkDelete(request.body);

    return reply.success(
      result,
      `Bulk delete completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk status update
   * PATCH /userRoles/bulk/status
   */
  async bulkUpdateStatus(
    request: FastifyRequest<{ Body: Static<typeof BulkStatusSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      {
        count: request.body.ids.length,
        status: request.body.status,
      },
      'Bulk updating userRoles status',
    );

    // Convert status to boolean if it's a string
    const statusData = {
      ...request.body,
      status:
        typeof request.body.status === 'string'
          ? request.body.status === 'true' || request.body.status === '1'
          : Boolean(request.body.status),
    };

    const result = await this.userRolesService.bulkUpdateStatus(statusData);

    return reply.success(
      result,
      `Bulk status update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Activate userRoles
   * PATCH /userRoles/:id/activate
   */
  async activate(
    request: FastifyRequest<{
      Params: Static<typeof UserRolesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ userRolesId: id }, 'Activating userRoles');

    const result = await this.userRolesService.activate(id, request.body);

    return reply.success(result, 'UserRoles activated successfully');
  }

  /**
   * Deactivate userRoles
   * PATCH /userRoles/:id/deactivate
   */
  async deactivate(
    request: FastifyRequest<{
      Params: Static<typeof UserRolesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ userRolesId: id }, 'Deactivating userRoles');

    const result = await this.userRolesService.deactivate(id, request.body);

    return reply.success(result, 'UserRoles deactivated successfully');
  }

  /**
   * Toggle userRoles status
   * PATCH /userRoles/:id/toggle
   */
  async toggle(
    request: FastifyRequest<{
      Params: Static<typeof UserRolesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ userRolesId: id }, 'Toggling userRoles status');

    const result = await this.userRolesService.toggle(id, request.body);

    return reply.success(result, 'UserRoles status toggled successfully');
  }

  /**
   * Get statistics
   * GET /userRoles/stats
   */
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Fetching userRoles statistics');

    const stats = await this.userRolesService.getStats();

    return reply.success(stats);
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   * POST /userRoles/validate
   */
  async validate(
    request: FastifyRequest<{
      Body: { data: Static<typeof CreateUserRolesSchema> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info('Validating userRoles data');

    const result = await this.userRolesService.validate(request.body);

    return reply.success(result);
  }

  /**
   * Check field uniqueness
   * GET /userRoles/check/:field
   */
  async checkUniqueness(
    request: FastifyRequest<{
      Params: { field: string };
      Querystring: Static<typeof UniquenessCheckSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { field } = request.params;
    request.log.info(
      { field, value: request.query.value },
      'Checking userRoles field uniqueness',
    );

    const result = await this.userRolesService.checkUniqueness(field, {
      value: String(request.query.value),
      excludeId: request.query.excludeId,
    });

    return reply.success(result);
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(schema: Static<typeof CreateUserRolesSchema>) {
    return {
      // Transform snake_case API fields to camelCase domain fields
      user_id: schema.user_id,
      role_id: schema.role_id,
      is_active: schema.is_active,
      assigned_at: schema.assigned_at,
      assigned_by: schema.assigned_by,
      expires_at: schema.expires_at,
    };
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(schema: Static<typeof UpdateUserRolesSchema>) {
    const updateData: any = {};

    if (schema.user_id !== undefined) {
      updateData.user_id = schema.user_id;
    }
    if (schema.role_id !== undefined) {
      updateData.role_id = schema.role_id;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }
    if (schema.assigned_at !== undefined) {
      updateData.assigned_at = schema.assigned_at;
    }
    if (schema.assigned_by !== undefined) {
      updateData.assigned_by = schema.assigned_by;
    }
    if (schema.expires_at !== undefined) {
      updateData.expires_at = schema.expires_at;
    }

    return updateData;
  }
}
