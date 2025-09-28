import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { ThemesService } from '../services/themes.service';
import { CreateThemes, UpdateThemes } from '../types/themes.types';
import {
  CreateThemesSchema,
  UpdateThemesSchema,
  ThemesIdParamSchema,
  GetThemesQuerySchema,
  ListThemesQuerySchema,
} from '../schemas/themes.schemas';
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
 * Themes Controller
 * Package: full
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class ThemesController {
  constructor(private themesService: ThemesService) {}

  /**
   * Create new themes
   * POST /themes
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateThemesSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating themes');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body);

    const themes = await this.themesService.create(createData);

    request.log.info({ themesId: themes.id }, 'Themes created successfully');

    return reply.code(201).success(themes, 'Themes created successfully');
  }

  /**
   * Get themes by ID
   * GET /themes/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof ThemesIdParamSchema>;
      Querystring: Static<typeof GetThemesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ themesId: id }, 'Fetching themes');

    const themes = await this.themesService.findById(id, request.query);

    return reply.success(themes);
  }

  /**
   * Get paginated list of themess
   * GET /themes
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListThemesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching themes list');

    const result = await this.themesService.findMany(request.query);

    request.log.info(
      { count: result.data.length, total: result.pagination.total },
      'Themes list fetched',
    );

    return reply.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
    );
  }

  /**
   * Update themes
   * PUT /themes/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof ThemesIdParamSchema>;
      Body: Static<typeof UpdateThemesSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ themesId: id, body: request.body }, 'Updating themes');

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body);

    const themes = await this.themesService.update(id, updateData);

    request.log.info({ themesId: id }, 'Themes updated successfully');

    return reply.success(themes, 'Themes updated successfully');
  }

  /**
   * Delete themes
   * DELETE /themes/:id
   */
  async delete(
    request: FastifyRequest<{ Params: Static<typeof ThemesIdParamSchema> }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      request.log.info({ themesId: id }, 'Deleting themes');

      const deleted = await this.themesService.delete(id);

      if (!deleted) {
        return reply.code(404).error('NOT_FOUND', 'Themes not found');
      }

      request.log.info({ themesId: id }, 'Themes deleted successfully');

      // Return operation result using standard success response
      return reply.success(
        {
          id: String(id),
          deleted: true,
        },
        'Themes deleted successfully',
      );
    } catch (error) {
      request.log.error(
        { error, themesId: request.params.id },
        'Error deleting themes',
      );
      return reply
        .code(500)
        .error(
          'INTERNAL_SERVER_ERROR',
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        );
    }
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options
   * GET /themes/dropdown
   */
  async getDropdownOptions(
    request: FastifyRequest<{
      Querystring: Static<typeof DropdownQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching themes dropdown options',
    );

    const result = await this.themesService.getDropdownOptions(request.query);

    return reply.success({
      options: result.options,
      total: result.total,
    });
  }

  /**
   * Bulk create themess
   * POST /themes/bulk
   */
  async bulkCreate(
    request: FastifyRequest<{
      Body: {
        items: CreateThemes[];
        options?: { skipDuplicates?: boolean; continueOnError?: boolean };
      };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk creating themess',
    );

    // Transform API schema to domain model for each item but keep original data
    const transformedData = {
      items: request.body.items.map((item, index) => ({
        original: request.body.items[index], // Keep original data for error reporting
        transformed: this.transformCreateSchema(item),
      })),
    };

    // console.log('CONTROLLER DEBUG - Transformed data:', JSON.stringify(transformedData, null, 2));

    const result = await this.themesService.bulkCreate(transformedData);

    return reply.code(201).success(
      {
        created: result.created,
        summary: result.summary,
      },
      `Bulk create completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk update themess
   * PUT /themes/bulk
   */
  async bulkUpdate(
    request: FastifyRequest<{
      Body: { items: Array<{ id: string | number; data: UpdateThemes }> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk updating themess',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => ({
        id: item.id,
        data: this.transformUpdateSchema(item.data),
      })),
    };

    const result = await this.themesService.bulkUpdate(transformedData);

    return reply.success(
      {
        updated: result.updated,
        summary: result.summary,
      },
      `Bulk update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk delete themess
   * DELETE /themes/bulk
   */
  async bulkDelete(
    request: FastifyRequest<{ Body: Static<typeof BulkDeleteSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.ids.length },
      'Bulk deleting themess',
    );

    const result = await this.themesService.bulkDelete(request.body);

    return reply.success(
      {
        deleted: result.deleted,
        summary: result.summary,
      },
      `Bulk delete completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk status update
   * PATCH /themes/bulk/status
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
      'Bulk updating themes status',
    );

    // Convert status to boolean if it's a string
    const statusData = {
      ...request.body,
      status:
        typeof request.body.status === 'string'
          ? request.body.status === 'true' || request.body.status === '1'
          : Boolean(request.body.status),
    };

    const result = await this.themesService.bulkUpdateStatus(statusData);

    return reply.success(
      {
        updated: result.updated,
        summary: result.summary,
      },
      `Bulk status update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Activate themes
   * PATCH /themes/:id/activate
   */
  async activate(
    request: FastifyRequest<{
      Params: Static<typeof ThemesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ themesId: id }, 'Activating themes');

    const result = await this.themesService.activate(id, request.body);

    return reply.success(result, 'Themes activated successfully');
  }

  /**
   * Deactivate themes
   * PATCH /themes/:id/deactivate
   */
  async deactivate(
    request: FastifyRequest<{
      Params: Static<typeof ThemesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ themesId: id }, 'Deactivating themes');

    const result = await this.themesService.deactivate(id, request.body);

    return reply.success(result, 'Themes deactivated successfully');
  }

  /**
   * Toggle themes status
   * PATCH /themes/:id/toggle
   */
  async toggle(
    request: FastifyRequest<{
      Params: Static<typeof ThemesIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ themesId: id }, 'Toggling themes status');

    const result = await this.themesService.toggle(id, request.body);

    return reply.success(result, 'Themes status toggled successfully');
  }

  /**
   * Get statistics
   * GET /themes/stats
   */
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Fetching themes statistics');

    const stats = await this.themesService.getStats();

    return reply.success(stats);
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   * POST /themes/validate
   */
  async validate(
    request: FastifyRequest<{
      Body: { data: Static<typeof CreateThemesSchema> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info('Validating themes data');

    const result = await this.themesService.validate(request.body);

    return reply.success(result);
  }

  /**
   * Check field uniqueness
   * GET /themes/check/:field
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
      'Checking themes field uniqueness',
    );

    const result = await this.themesService.checkUniqueness(field, {
      value: String(request.query.value),
      excludeId: request.query.excludeId,
    });

    return reply.success(result);
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(schema: Static<typeof CreateThemesSchema>) {
    return {
      // Transform snake_case API fields to camelCase domain fields
      name: schema.name,
      display_name: schema.display_name,
      description: schema.description,
      preview_image_url: schema.preview_image_url,
      color_palette: schema.color_palette,
      css_variables: schema.css_variables,
      is_active: schema.is_active,
      is_default: schema.is_default,
      sort_order: schema.sort_order,
    };
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(schema: Static<typeof UpdateThemesSchema>) {
    const updateData: any = {};

    if (schema.name !== undefined) {
      updateData.name = schema.name;
    }
    if (schema.display_name !== undefined) {
      updateData.display_name = schema.display_name;
    }
    if (schema.description !== undefined) {
      updateData.description = schema.description;
    }
    if (schema.preview_image_url !== undefined) {
      updateData.preview_image_url = schema.preview_image_url;
    }
    if (schema.color_palette !== undefined) {
      updateData.color_palette = schema.color_palette;
    }
    if (schema.css_variables !== undefined) {
      updateData.css_variables = schema.css_variables;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }
    if (schema.is_default !== undefined) {
      updateData.is_default = schema.is_default;
    }
    if (schema.sort_order !== undefined) {
      updateData.sort_order = schema.sort_order;
    }

    return updateData;
  }
}
