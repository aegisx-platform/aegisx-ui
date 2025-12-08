import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { DrugComponentsService } from './drug-components.service';
import {
  CreateDrugComponents,
  UpdateDrugComponents,
} from './drug-components.types';
import {
  CreateDrugComponentsSchema,
  UpdateDrugComponentsSchema,
  DrugComponentsIdParamSchema,
  GetDrugComponentsQuerySchema,
  ListDrugComponentsQuerySchema,
} from './drug-components.schemas';

/**
 * DrugComponents Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class DrugComponentsController {
  constructor(private drugComponentsService: DrugComponentsService) {}

  /**
   * Create new drugComponents
   * POST /drugComponents
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateDrugComponentsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating drugComponents');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const drugComponents = await this.drugComponentsService.create(createData);

    request.log.info(
      { drugComponentsId: drugComponents.id },
      'DrugComponents created successfully',
    );

    return reply
      .code(201)
      .success(drugComponents, 'DrugComponents created successfully');
  }

  /**
   * Get drugComponents by ID
   * GET /drugComponents/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof DrugComponentsIdParamSchema>;
      Querystring: Static<typeof GetDrugComponentsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugComponentsId: id }, 'Fetching drugComponents');

    const drugComponents = await this.drugComponentsService.findById(
      id,
      request.query,
    );

    return reply.success(drugComponents);
  }

  /**
   * Get paginated list of drugComponentss
   * GET /drugComponents
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListDrugComponentsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching drugComponents list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'generic_id', 'created_at'],
      user: [
        'id',
        'generic_id',
        'id',
        'generic_id',
        'component_name',
        'strength',
        'strength_value',
        'strength_unit',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'generic_id',
        'component_name',
        'strength',
        'strength_value',
        'strength_unit',
        'is_active',
        'created_at',
        'updated_at',
      ],
    };

    // 🛡️ Security: Get user role (default to public for safety)
    const userRole = request.user?.role || 'public';
    const allowedFields = SAFE_FIELDS[userRole] || SAFE_FIELDS.public;

    // 🛡️ Security: Filter requested fields against whitelist
    const safeFields = fields
      ? fields.filter((field) => allowedFields.includes(field))
      : undefined;

    // 🛡️ Security: Log suspicious requests
    if (fields && fields.some((field) => !allowedFields.includes(field))) {
      request.log.warn(
        {
          user: request.user?.id,
          requestedFields: fields,
          allowedFields,
          ip: request.ip,
        },
        'Suspicious field access attempt detected',
      );
    }

    // Get drugComponents list with field filtering
    const result = await this.drugComponentsService.findMany({
      ...queryParams,
      fields: safeFields,
    });

    request.log.info(
      {
        count: result.data.length,
        total: result.pagination.total,
        fieldsRequested: fields?.length || 0,
        fieldsAllowed: safeFields?.length || 'all',
      },
      'DrugComponents list fetched',
    );

    // Use raw send to match FlexibleSchema
    return reply.send({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
        requestId: request.id,
        environment: process.env.NODE_ENV || 'development',
      },
    });
  }

  /**
   * Update drugComponents
   * PUT /drugComponents/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof DrugComponentsIdParamSchema>;
      Body: Static<typeof UpdateDrugComponentsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { drugComponentsId: id, body: request.body },
      'Updating drugComponents',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const drugComponents = await this.drugComponentsService.update(
      id,
      updateData,
    );

    request.log.info(
      { drugComponentsId: id },
      'DrugComponents updated successfully',
    );

    return reply.success(drugComponents, 'DrugComponents updated successfully');
  }

  /**
   * Delete drugComponents
   * DELETE /drugComponents/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof DrugComponentsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugComponentsId: id }, 'Deleting drugComponents');

    const deleted = await this.drugComponentsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'DrugComponents not found');
    }

    request.log.info(
      { drugComponentsId: id },
      'DrugComponents deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'DrugComponents deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateDrugComponentsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      generic_id: schema.generic_id,
      component_name: schema.component_name,
      strength: schema.strength,
      strength_value: schema.strength_value,
      strength_unit: schema.strength_unit,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateDrugComponentsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.generic_id !== undefined) {
      updateData.generic_id = schema.generic_id;
    }
    if (schema.component_name !== undefined) {
      updateData.component_name = schema.component_name;
    }
    if (schema.strength !== undefined) {
      updateData.strength = schema.strength;
    }
    if (schema.strength_value !== undefined) {
      updateData.strength_value = schema.strength_value;
    }
    if (schema.strength_unit !== undefined) {
      updateData.strength_unit = schema.strength_unit;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
