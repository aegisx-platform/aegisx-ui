import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetTypesService } from '../services/budget-types.service';
import {
  CreateBudgetTypes,
  UpdateBudgetTypes,
} from '../types/budget-types.types';
import {
  CreateBudgetTypesSchema,
  UpdateBudgetTypesSchema,
  BudgetTypesIdParamSchema,
  GetBudgetTypesQuerySchema,
  ListBudgetTypesQuerySchema,
} from '../schemas/budget-types.schemas';

/**
 * BudgetTypes Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetTypesController {
  constructor(private budgetTypesService: BudgetTypesService) {}

  /**
   * Create new budgetTypes
   * POST /budgetTypes
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateBudgetTypesSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetTypes');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetTypes = await this.budgetTypesService.create(createData);

    request.log.info(
      { budgetTypesId: budgetTypes.id },
      'BudgetTypes created successfully',
    );

    return reply
      .code(201)
      .success(budgetTypes, 'BudgetTypes created successfully');
  }

  /**
   * Get budgetTypes by ID
   * GET /budgetTypes/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetTypesIdParamSchema>;
      Querystring: Static<typeof GetBudgetTypesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetTypesId: id }, 'Fetching budgetTypes');

    const budgetTypes = await this.budgetTypesService.findById(
      id,
      request.query,
    );

    return reply.success(budgetTypes);
  }

  /**
   * Get paginated list of budgetTypess
   * GET /budgetTypes
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetTypesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching budgetTypes list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'type_code', 'created_at'],
      user: [
        'id',
        'type_code',
        'id',
        'type_code',
        'type_name',
        'budget_class',
        'description',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'type_code',
        'type_name',
        'budget_class',
        'description',
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

    // Get budgetTypes list with field filtering
    const result = await this.budgetTypesService.findMany({
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
      'BudgetTypes list fetched',
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
   * Update budgetTypes
   * PUT /budgetTypes/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetTypesIdParamSchema>;
      Body: Static<typeof UpdateBudgetTypesSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetTypesId: id, body: request.body },
      'Updating budgetTypes',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetTypes = await this.budgetTypesService.update(id, updateData);

    request.log.info({ budgetTypesId: id }, 'BudgetTypes updated successfully');

    return reply.success(budgetTypes, 'BudgetTypes updated successfully');
  }

  /**
   * Delete budgetTypes
   * DELETE /budgetTypes/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetTypesIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetTypesId: id }, 'Deleting budgetTypes');

    const deleted = await this.budgetTypesService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetTypes not found');
    }

    request.log.info({ budgetTypesId: id }, 'BudgetTypes deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetTypes deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetTypesSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      type_code: schema.type_code,
      type_name: schema.type_name,
      budget_class: schema.budget_class,
      description: schema.description,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBudgetTypesSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.type_code !== undefined) {
      updateData.type_code = schema.type_code;
    }
    if (schema.type_name !== undefined) {
      updateData.type_name = schema.type_name;
    }
    if (schema.budget_class !== undefined) {
      updateData.budget_class = schema.budget_class;
    }
    if (schema.description !== undefined) {
      updateData.description = schema.description;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
