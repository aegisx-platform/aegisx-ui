import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetPlansService } from './budget-plans.service';
import { CreateBudgetPlans, UpdateBudgetPlans } from './budget-plans.types';
import {
  CreateBudgetPlansSchema,
  UpdateBudgetPlansSchema,
  BudgetPlansIdParamSchema,
  GetBudgetPlansQuerySchema,
  ListBudgetPlansQuerySchema,
} from './budget-plans.schemas';

/**
 * BudgetPlans Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetPlansController {
  constructor(private budgetPlansService: BudgetPlansService) {}

  /**
   * Create new budgetPlans
   * POST /budgetPlans
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateBudgetPlansSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetPlans');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetPlans = await this.budgetPlansService.create(createData);

    request.log.info(
      { budgetPlansId: budgetPlans.id },
      'BudgetPlans created successfully',
    );

    return reply
      .code(201)
      .success(budgetPlans, 'BudgetPlans created successfully');
  }

  /**
   * Get budgetPlans by ID
   * GET /budgetPlans/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlansIdParamSchema>;
      Querystring: Static<typeof GetBudgetPlansQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetPlansId: id }, 'Fetching budgetPlans');

    const budgetPlans = await this.budgetPlansService.findById(
      id,
      request.query,
    );

    return reply.success(budgetPlans);
  }

  /**
   * Get paginated list of budgetPlanss
   * GET /budgetPlans
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetPlansQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching budgetPlans list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'fiscal_year', 'created_at'],
      user: [
        'id',
        'fiscal_year',
        'id',
        'fiscal_year',
        'department_id',
        'plan_name',
        'total_planned_amount',
        'status',
        'approved_at',
        'approved_by',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'fiscal_year',
        'department_id',
        'plan_name',
        'total_planned_amount',
        'status',
        'approved_at',
        'approved_by',
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

    // Get budgetPlans list with field filtering
    const result = await this.budgetPlansService.findMany({
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
      'BudgetPlans list fetched',
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
   * Update budgetPlans
   * PUT /budgetPlans/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlansIdParamSchema>;
      Body: Static<typeof UpdateBudgetPlansSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetPlansId: id, body: request.body },
      'Updating budgetPlans',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetPlans = await this.budgetPlansService.update(id, updateData);

    request.log.info({ budgetPlansId: id }, 'BudgetPlans updated successfully');

    return reply.success(budgetPlans, 'BudgetPlans updated successfully');
  }

  /**
   * Delete budgetPlans
   * DELETE /budgetPlans/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlansIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetPlansId: id }, 'Deleting budgetPlans');

    const deleted = await this.budgetPlansService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetPlans not found');
    }

    request.log.info({ budgetPlansId: id }, 'BudgetPlans deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetPlans deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetPlansSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      fiscal_year: schema.fiscal_year,
      department_id: schema.department_id,
      plan_name: schema.plan_name,
      total_planned_amount: schema.total_planned_amount,
      status: schema.status,
      approved_at: schema.approved_at,
      approved_by: schema.approved_by,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBudgetPlansSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.fiscal_year !== undefined) {
      updateData.fiscal_year = schema.fiscal_year;
    }
    if (schema.department_id !== undefined) {
      updateData.department_id = schema.department_id;
    }
    if (schema.plan_name !== undefined) {
      updateData.plan_name = schema.plan_name;
    }
    if (schema.total_planned_amount !== undefined) {
      updateData.total_planned_amount = schema.total_planned_amount;
    }
    if (schema.status !== undefined) {
      updateData.status = schema.status;
    }
    if (schema.approved_at !== undefined) {
      updateData.approved_at = schema.approved_at;
    }
    if (schema.approved_by !== undefined) {
      updateData.approved_by = schema.approved_by;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
