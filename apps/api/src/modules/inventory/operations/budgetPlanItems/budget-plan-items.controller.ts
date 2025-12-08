import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetPlanItemsService } from './budget-plan-items.service';
import {
  CreateBudgetPlanItems,
  UpdateBudgetPlanItems,
} from './budget-plan-items.types';
import {
  CreateBudgetPlanItemsSchema,
  UpdateBudgetPlanItemsSchema,
  BudgetPlanItemsIdParamSchema,
  GetBudgetPlanItemsQuerySchema,
  ListBudgetPlanItemsQuerySchema,
} from './budget-plan-items.schemas';

/**
 * BudgetPlanItems Controller
 * Package: standard
 * Has Status Field: false
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetPlanItemsController {
  constructor(private budgetPlanItemsService: BudgetPlanItemsService) {}

  /**
   * Create new budgetPlanItems
   * POST /budgetPlanItems
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateBudgetPlanItemsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetPlanItems');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetPlanItems =
      await this.budgetPlanItemsService.create(createData);

    request.log.info(
      { budgetPlanItemsId: budgetPlanItems.id },
      'BudgetPlanItems created successfully',
    );

    return reply
      .code(201)
      .success(budgetPlanItems, 'BudgetPlanItems created successfully');
  }

  /**
   * Get budgetPlanItems by ID
   * GET /budgetPlanItems/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlanItemsIdParamSchema>;
      Querystring: Static<typeof GetBudgetPlanItemsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetPlanItemsId: id }, 'Fetching budgetPlanItems');

    const budgetPlanItems = await this.budgetPlanItemsService.findById(
      id,
      request.query,
    );

    return reply.success(budgetPlanItems);
  }

  /**
   * Get paginated list of budgetPlanItemss
   * GET /budgetPlanItems
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetPlanItemsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching budgetPlanItems list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'budget_plan_id', 'created_at'],
      user: [
        'id',
        'budget_plan_id',
        'id',
        'budget_plan_id',
        'generic_id',
        'last_year_qty',
        'two_years_ago_qty',
        'three_years_ago_qty',
        'planned_quantity',
        'estimated_unit_price',
        'total_planned_value',
        'q1_planned_qty',
        'q2_planned_qty',
        'q3_planned_qty',
        'q4_planned_qty',
        'q1_purchased_qty',
        'q2_purchased_qty',
        'q3_purchased_qty',
        'q4_purchased_qty',
        'total_purchased_qty',
        'total_purchased_value',
        'notes',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'budget_plan_id',
        'generic_id',
        'last_year_qty',
        'two_years_ago_qty',
        'three_years_ago_qty',
        'planned_quantity',
        'estimated_unit_price',
        'total_planned_value',
        'q1_planned_qty',
        'q2_planned_qty',
        'q3_planned_qty',
        'q4_planned_qty',
        'q1_purchased_qty',
        'q2_purchased_qty',
        'q3_purchased_qty',
        'q4_purchased_qty',
        'total_purchased_qty',
        'total_purchased_value',
        'notes',
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

    // Get budgetPlanItems list with field filtering
    const result = await this.budgetPlanItemsService.findMany({
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
      'BudgetPlanItems list fetched',
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
   * Update budgetPlanItems
   * PUT /budgetPlanItems/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlanItemsIdParamSchema>;
      Body: Static<typeof UpdateBudgetPlanItemsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetPlanItemsId: id, body: request.body },
      'Updating budgetPlanItems',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetPlanItems = await this.budgetPlanItemsService.update(
      id,
      updateData,
    );

    request.log.info(
      { budgetPlanItemsId: id },
      'BudgetPlanItems updated successfully',
    );

    return reply.success(
      budgetPlanItems,
      'BudgetPlanItems updated successfully',
    );
  }

  /**
   * Delete budgetPlanItems
   * DELETE /budgetPlanItems/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetPlanItemsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ budgetPlanItemsId: id }, 'Deleting budgetPlanItems');

    const deleted = await this.budgetPlanItemsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetPlanItems not found');
    }

    request.log.info(
      { budgetPlanItemsId: id },
      'BudgetPlanItems deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetPlanItems deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetPlanItemsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      budget_plan_id: schema.budget_plan_id,
      generic_id: schema.generic_id,
      last_year_qty: schema.last_year_qty,
      two_years_ago_qty: schema.two_years_ago_qty,
      three_years_ago_qty: schema.three_years_ago_qty,
      planned_quantity: schema.planned_quantity,
      estimated_unit_price: schema.estimated_unit_price,
      total_planned_value: schema.total_planned_value,
      q1_planned_qty: schema.q1_planned_qty,
      q2_planned_qty: schema.q2_planned_qty,
      q3_planned_qty: schema.q3_planned_qty,
      q4_planned_qty: schema.q4_planned_qty,
      q1_purchased_qty: schema.q1_purchased_qty,
      q2_purchased_qty: schema.q2_purchased_qty,
      q3_purchased_qty: schema.q3_purchased_qty,
      q4_purchased_qty: schema.q4_purchased_qty,
      total_purchased_qty: schema.total_purchased_qty,
      total_purchased_value: schema.total_purchased_value,
      notes: schema.notes,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBudgetPlanItemsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.budget_plan_id !== undefined) {
      updateData.budget_plan_id = schema.budget_plan_id;
    }
    if (schema.generic_id !== undefined) {
      updateData.generic_id = schema.generic_id;
    }
    if (schema.last_year_qty !== undefined) {
      updateData.last_year_qty = schema.last_year_qty;
    }
    if (schema.two_years_ago_qty !== undefined) {
      updateData.two_years_ago_qty = schema.two_years_ago_qty;
    }
    if (schema.three_years_ago_qty !== undefined) {
      updateData.three_years_ago_qty = schema.three_years_ago_qty;
    }
    if (schema.planned_quantity !== undefined) {
      updateData.planned_quantity = schema.planned_quantity;
    }
    if (schema.estimated_unit_price !== undefined) {
      updateData.estimated_unit_price = schema.estimated_unit_price;
    }
    if (schema.total_planned_value !== undefined) {
      updateData.total_planned_value = schema.total_planned_value;
    }
    if (schema.q1_planned_qty !== undefined) {
      updateData.q1_planned_qty = schema.q1_planned_qty;
    }
    if (schema.q2_planned_qty !== undefined) {
      updateData.q2_planned_qty = schema.q2_planned_qty;
    }
    if (schema.q3_planned_qty !== undefined) {
      updateData.q3_planned_qty = schema.q3_planned_qty;
    }
    if (schema.q4_planned_qty !== undefined) {
      updateData.q4_planned_qty = schema.q4_planned_qty;
    }
    if (schema.q1_purchased_qty !== undefined) {
      updateData.q1_purchased_qty = schema.q1_purchased_qty;
    }
    if (schema.q2_purchased_qty !== undefined) {
      updateData.q2_purchased_qty = schema.q2_purchased_qty;
    }
    if (schema.q3_purchased_qty !== undefined) {
      updateData.q3_purchased_qty = schema.q3_purchased_qty;
    }
    if (schema.q4_purchased_qty !== undefined) {
      updateData.q4_purchased_qty = schema.q4_purchased_qty;
    }
    if (schema.total_purchased_qty !== undefined) {
      updateData.total_purchased_qty = schema.total_purchased_qty;
    }
    if (schema.total_purchased_value !== undefined) {
      updateData.total_purchased_value = schema.total_purchased_value;
    }
    if (schema.notes !== undefined) {
      updateData.notes = schema.notes;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
