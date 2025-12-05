import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetCategoriesService } from '../services/budget-categories.service';
import {
  CreateBudgetCategories,
  UpdateBudgetCategories,
} from '../types/budget-categories.types';
import {
  CreateBudgetCategoriesSchema,
  UpdateBudgetCategoriesSchema,
  BudgetCategoriesIdParamSchema,
  GetBudgetCategoriesQuerySchema,
  ListBudgetCategoriesQuerySchema,
} from '../schemas/budget-categories.schemas';

/**
 * BudgetCategories Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetCategoriesController {
  constructor(private budgetCategoriesService: BudgetCategoriesService) {}

  /**
   * Create new budgetCategories
   * POST /budgetCategories
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateBudgetCategoriesSchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetCategories');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetCategories =
      await this.budgetCategoriesService.create(createData);

    request.log.info(
      { budgetCategoriesId: budgetCategories.id },
      'BudgetCategories created successfully',
    );

    return reply
      .code(201)
      .success(budgetCategories, 'BudgetCategories created successfully');
  }

  /**
   * Get budgetCategories by ID
   * GET /budgetCategories/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetCategoriesIdParamSchema>;
      Querystring: Static<typeof GetBudgetCategoriesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetCategoriesId: id }, 'Fetching budgetCategories');

    const budgetCategories = await this.budgetCategoriesService.findById(
      id,
      request.query,
    );

    return reply.success(budgetCategories);
  }

  /**
   * Get paginated list of budgetCategoriess
   * GET /budgetCategories
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetCategoriesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching budgetCategories list',
    );

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'category_code', 'created_at'],
      user: [
        'id',
        'category_code',
        'id',
        'category_code',
        'category_name',
        'accounting_code',
        'description',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'category_code',
        'category_name',
        'accounting_code',
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

    // Get budgetCategories list with field filtering
    const result = await this.budgetCategoriesService.findMany({
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
      'BudgetCategories list fetched',
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
   * Update budgetCategories
   * PUT /budgetCategories/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetCategoriesIdParamSchema>;
      Body: Static<typeof UpdateBudgetCategoriesSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetCategoriesId: id, body: request.body },
      'Updating budgetCategories',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetCategories = await this.budgetCategoriesService.update(
      id,
      updateData,
    );

    request.log.info(
      { budgetCategoriesId: id },
      'BudgetCategories updated successfully',
    );

    return reply.success(
      budgetCategories,
      'BudgetCategories updated successfully',
    );
  }

  /**
   * Delete budgetCategories
   * DELETE /budgetCategories/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetCategoriesIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetCategoriesId: id }, 'Deleting budgetCategories');

    const deleted = await this.budgetCategoriesService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetCategories not found');
    }

    request.log.info(
      { budgetCategoriesId: id },
      'BudgetCategories deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetCategories deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetCategoriesSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      category_code: schema.category_code,
      category_name: schema.category_name,
      accounting_code: schema.accounting_code,
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
    schema: Static<typeof UpdateBudgetCategoriesSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.category_code !== undefined) {
      updateData.category_code = schema.category_code;
    }
    if (schema.category_name !== undefined) {
      updateData.category_name = schema.category_name;
    }
    if (schema.accounting_code !== undefined) {
      updateData.accounting_code = schema.accounting_code;
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
