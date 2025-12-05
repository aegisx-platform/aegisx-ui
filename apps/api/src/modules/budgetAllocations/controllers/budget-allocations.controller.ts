import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetAllocationsService } from '../services/budget-allocations.service';
import {
  CreateBudgetAllocations,
  UpdateBudgetAllocations,
} from '../types/budget-allocations.types';
import {
  CreateBudgetAllocationsSchema,
  UpdateBudgetAllocationsSchema,
  BudgetAllocationsIdParamSchema,
  GetBudgetAllocationsQuerySchema,
  ListBudgetAllocationsQuerySchema,
} from '../schemas/budget-allocations.schemas';

/**
 * BudgetAllocations Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetAllocationsController {
  constructor(private budgetAllocationsService: BudgetAllocationsService) {}

  /**
   * Create new budgetAllocations
   * POST /budgetAllocations
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateBudgetAllocationsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetAllocations');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetAllocations =
      await this.budgetAllocationsService.create(createData);

    request.log.info(
      { budgetAllocationsId: budgetAllocations.id },
      'BudgetAllocations created successfully',
    );

    return reply
      .code(201)
      .success(budgetAllocations, 'BudgetAllocations created successfully');
  }

  /**
   * Get budgetAllocations by ID
   * GET /budgetAllocations/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetAllocationsIdParamSchema>;
      Querystring: Static<typeof GetBudgetAllocationsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetAllocationsId: id }, 'Fetching budgetAllocations');

    const budgetAllocations = await this.budgetAllocationsService.findById(
      id,
      request.query,
    );

    return reply.success(budgetAllocations);
  }

  /**
   * Get paginated list of budgetAllocationss
   * GET /budgetAllocations
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetAllocationsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching budgetAllocations list',
    );

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
        'budget_id',
        'department_id',
        'total_budget',
        'q1_budget',
        'q2_budget',
        'q3_budget',
        'q4_budget',
        'q1_spent',
        'q2_spent',
        'q3_spent',
        'q4_spent',
        'total_spent',
        'remaining_budget',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'fiscal_year',
        'budget_id',
        'department_id',
        'total_budget',
        'q1_budget',
        'q2_budget',
        'q3_budget',
        'q4_budget',
        'q1_spent',
        'q2_spent',
        'q3_spent',
        'q4_spent',
        'total_spent',
        'remaining_budget',
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

    // Get budgetAllocations list with field filtering
    const result = await this.budgetAllocationsService.findMany({
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
      'BudgetAllocations list fetched',
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
   * Update budgetAllocations
   * PUT /budgetAllocations/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetAllocationsIdParamSchema>;
      Body: Static<typeof UpdateBudgetAllocationsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetAllocationsId: id, body: request.body },
      'Updating budgetAllocations',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetAllocations = await this.budgetAllocationsService.update(
      id,
      updateData,
    );

    request.log.info(
      { budgetAllocationsId: id },
      'BudgetAllocations updated successfully',
    );

    return reply.success(
      budgetAllocations,
      'BudgetAllocations updated successfully',
    );
  }

  /**
   * Delete budgetAllocations
   * DELETE /budgetAllocations/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetAllocationsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetAllocationsId: id }, 'Deleting budgetAllocations');

    const deleted = await this.budgetAllocationsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetAllocations not found');
    }

    request.log.info(
      { budgetAllocationsId: id },
      'BudgetAllocations deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetAllocations deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetAllocationsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      fiscal_year: schema.fiscal_year,
      budget_id: schema.budget_id,
      department_id: schema.department_id,
      total_budget: schema.total_budget,
      q1_budget: schema.q1_budget,
      q2_budget: schema.q2_budget,
      q3_budget: schema.q3_budget,
      q4_budget: schema.q4_budget,
      q1_spent: schema.q1_spent,
      q2_spent: schema.q2_spent,
      q3_spent: schema.q3_spent,
      q4_spent: schema.q4_spent,
      total_spent: schema.total_spent,
      remaining_budget: schema.remaining_budget,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBudgetAllocationsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.fiscal_year !== undefined) {
      updateData.fiscal_year = schema.fiscal_year;
    }
    if (schema.budget_id !== undefined) {
      updateData.budget_id = schema.budget_id;
    }
    if (schema.department_id !== undefined) {
      updateData.department_id = schema.department_id;
    }
    if (schema.total_budget !== undefined) {
      updateData.total_budget = schema.total_budget;
    }
    if (schema.q1_budget !== undefined) {
      updateData.q1_budget = schema.q1_budget;
    }
    if (schema.q2_budget !== undefined) {
      updateData.q2_budget = schema.q2_budget;
    }
    if (schema.q3_budget !== undefined) {
      updateData.q3_budget = schema.q3_budget;
    }
    if (schema.q4_budget !== undefined) {
      updateData.q4_budget = schema.q4_budget;
    }
    if (schema.q1_spent !== undefined) {
      updateData.q1_spent = schema.q1_spent;
    }
    if (schema.q2_spent !== undefined) {
      updateData.q2_spent = schema.q2_spent;
    }
    if (schema.q3_spent !== undefined) {
      updateData.q3_spent = schema.q3_spent;
    }
    if (schema.q4_spent !== undefined) {
      updateData.q4_spent = schema.q4_spent;
    }
    if (schema.total_spent !== undefined) {
      updateData.total_spent = schema.total_spent;
    }
    if (schema.remaining_budget !== undefined) {
      updateData.remaining_budget = schema.remaining_budget;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
