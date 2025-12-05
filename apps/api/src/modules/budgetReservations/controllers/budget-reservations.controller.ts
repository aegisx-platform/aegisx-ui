import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BudgetReservationsService } from '../services/budget-reservations.service';
import {
  CreateBudgetReservations,
  UpdateBudgetReservations,
} from '../types/budget-reservations.types';
import {
  CreateBudgetReservationsSchema,
  UpdateBudgetReservationsSchema,
  BudgetReservationsIdParamSchema,
  GetBudgetReservationsQuerySchema,
  ListBudgetReservationsQuerySchema,
} from '../schemas/budget-reservations.schemas';

/**
 * BudgetReservations Controller
 * Package: standard
 * Has Status Field: false
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BudgetReservationsController {
  constructor(private budgetReservationsService: BudgetReservationsService) {}

  /**
   * Create new budgetReservations
   * POST /budgetReservations
   */
  async create(
    request: FastifyRequest<{
      Body: Static<typeof CreateBudgetReservationsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating budgetReservations');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const budgetReservations =
      await this.budgetReservationsService.create(createData);

    request.log.info(
      { budgetReservationsId: budgetReservations.id },
      'BudgetReservations created successfully',
    );

    return reply
      .code(201)
      .success(budgetReservations, 'BudgetReservations created successfully');
  }

  /**
   * Get budgetReservations by ID
   * GET /budgetReservations/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BudgetReservationsIdParamSchema>;
      Querystring: Static<typeof GetBudgetReservationsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetReservationsId: id },
      'Fetching budgetReservations',
    );

    const budgetReservations = await this.budgetReservationsService.findById(
      id,
      request.query,
    );

    return reply.success(budgetReservations);
  }

  /**
   * Get paginated list of budgetReservationss
   * GET /budgetReservations
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBudgetReservationsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching budgetReservations list',
    );

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'allocation_id', 'created_at'],
      user: [
        'id',
        'allocation_id',
        'id',
        'allocation_id',
        'pr_id',
        'reserved_amount',
        'quarter',
        'reservation_date',
        'expires_date',
        'is_released',
        'released_at',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'allocation_id',
        'pr_id',
        'reserved_amount',
        'quarter',
        'reservation_date',
        'expires_date',
        'is_released',
        'released_at',
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

    // Get budgetReservations list with field filtering
    const result = await this.budgetReservationsService.findMany({
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
      'BudgetReservations list fetched',
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
   * Update budgetReservations
   * PUT /budgetReservations/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BudgetReservationsIdParamSchema>;
      Body: Static<typeof UpdateBudgetReservationsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetReservationsId: id, body: request.body },
      'Updating budgetReservations',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const budgetReservations = await this.budgetReservationsService.update(
      id,
      updateData,
    );

    request.log.info(
      { budgetReservationsId: id },
      'BudgetReservations updated successfully',
    );

    return reply.success(
      budgetReservations,
      'BudgetReservations updated successfully',
    );
  }

  /**
   * Delete budgetReservations
   * DELETE /budgetReservations/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof BudgetReservationsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { budgetReservationsId: id },
      'Deleting budgetReservations',
    );

    const deleted = await this.budgetReservationsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'BudgetReservations not found');
    }

    request.log.info(
      { budgetReservationsId: id },
      'BudgetReservations deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'BudgetReservations deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBudgetReservationsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      allocation_id: schema.allocation_id,
      pr_id: schema.pr_id,
      reserved_amount: schema.reserved_amount,
      quarter: schema.quarter,
      reservation_date: schema.reservation_date,
      expires_date: schema.expires_date,
      is_released: schema.is_released,
      released_at: schema.released_at,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBudgetReservationsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.allocation_id !== undefined) {
      updateData.allocation_id = schema.allocation_id;
    }
    if (schema.pr_id !== undefined) {
      updateData.pr_id = schema.pr_id;
    }
    if (schema.reserved_amount !== undefined) {
      updateData.reserved_amount = schema.reserved_amount;
    }
    if (schema.quarter !== undefined) {
      updateData.quarter = schema.quarter;
    }
    if (schema.reservation_date !== undefined) {
      updateData.reservation_date = schema.reservation_date;
    }
    if (schema.expires_date !== undefined) {
      updateData.expires_date = schema.expires_date;
    }
    if (schema.is_released !== undefined) {
      updateData.is_released = schema.is_released;
    }
    if (schema.released_at !== undefined) {
      updateData.released_at = schema.released_at;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
