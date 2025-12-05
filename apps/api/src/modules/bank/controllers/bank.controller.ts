import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { BankService } from '../services/bank.service';
import { CreateBank, UpdateBank } from '../types/bank.types';
import {
  CreateBankSchema,
  UpdateBankSchema,
  BankIdParamSchema,
  GetBankQuerySchema,
  ListBankQuerySchema,
} from '../schemas/bank.schemas';

/**
 * Bank Controller
 * Package: standard
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class BankController {
  constructor(private bankService: BankService) {}

  /**
   * Create new bank
   * POST /bank
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateBankSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating bank');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const bank = await this.bankService.create(createData);

    request.log.info({ bankId: bank.id }, 'Bank created successfully');

    return reply.code(201).success(bank, 'Bank created successfully');
  }

  /**
   * Get bank by ID
   * GET /bank/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof BankIdParamSchema>;
      Querystring: Static<typeof GetBankQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ bankId: id }, 'Fetching bank');

    const bank = await this.bankService.findById(id, request.query);

    return reply.success(bank);
  }

  /**
   * Get paginated list of banks
   * GET /bank
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListBankQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching bank list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'bank_code', 'created_at'],
      user: [
        'id',
        'bank_code',
        'id',
        'bank_code',
        'bank_name',
        'swift_code',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'bank_code',
        'bank_name',
        'swift_code',
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

    // Get bank list with field filtering
    const result = await this.bankService.findMany({
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
      'Bank list fetched',
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
   * Update bank
   * PUT /bank/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof BankIdParamSchema>;
      Body: Static<typeof UpdateBankSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ bankId: id, body: request.body }, 'Updating bank');

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const bank = await this.bankService.update(id, updateData);

    request.log.info({ bankId: id }, 'Bank updated successfully');

    return reply.success(bank, 'Bank updated successfully');
  }

  /**
   * Delete bank
   * DELETE /bank/:id
   */
  async delete(
    request: FastifyRequest<{ Params: Static<typeof BankIdParamSchema> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ bankId: id }, 'Deleting bank');

    const deleted = await this.bankService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'Bank not found');
    }

    request.log.info({ bankId: id }, 'Bank deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'Bank deleted successfully',
    );
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateBankSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      bank_code: schema.bank_code,
      bank_name: schema.bank_name,
      swift_code: schema.swift_code,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateBankSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.bank_code !== undefined) {
      updateData.bank_code = schema.bank_code;
    }
    if (schema.bank_name !== undefined) {
      updateData.bank_name = schema.bank_name;
    }
    if (schema.swift_code !== undefined) {
      updateData.swift_code = schema.swift_code;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
