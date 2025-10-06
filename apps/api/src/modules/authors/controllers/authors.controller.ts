import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { AuthorsService } from '../services/authors.service';
import { CreateAuthors, UpdateAuthors } from '../types/authors.types';
import {
  CreateAuthorsSchema,
  UpdateAuthorsSchema,
  AuthorsIdParamSchema,
  GetAuthorsQuerySchema,
  ListAuthorsQuerySchema,
} from '../schemas/authors.schemas';
import {
  DropdownQuerySchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  ValidationRequestSchema,
  UniquenessCheckSchema,
} from '../../../schemas/base.schemas';

/**
 * Authors Controller
 * Package: full
 * Has Status Field: false
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  /**
   * Create new authors
   * POST /authors
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateAuthorsSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating authors');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const authors = await this.authorsService.create(createData);

    request.log.info({ authorsId: authors.id }, 'Authors created successfully');

    return reply.code(201).success(authors, 'Authors created successfully');
  }

  /**
   * Get authors by ID
   * GET /authors/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof AuthorsIdParamSchema>;
      Querystring: Static<typeof GetAuthorsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ authorsId: id }, 'Fetching authors');

    const authors = await this.authorsService.findById(id, request.query);

    return reply.success(authors);
  }

  /**
   * Get paginated list of authorss
   * GET /authors
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListAuthorsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching authors list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'name', 'created_at'],
      user: [
        'id',
        'name',
        'id',
        'name',
        'email',
        'bio',
        'birth_date',
        'country',
        'active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'name',
        'email',
        'bio',
        'birth_date',
        'country',
        'active',
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

    // Get authors list with field filtering
    const result = await this.authorsService.findMany({
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
      'Authors list fetched',
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
   * Update authors
   * PUT /authors/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof AuthorsIdParamSchema>;
      Body: Static<typeof UpdateAuthorsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ authorsId: id, body: request.body }, 'Updating authors');

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const authors = await this.authorsService.update(id, updateData);

    request.log.info({ authorsId: id }, 'Authors updated successfully');

    return reply.success(authors, 'Authors updated successfully');
  }

  /**
   * Delete authors
   * DELETE /authors/:id
   */
  async delete(
    request: FastifyRequest<{ Params: Static<typeof AuthorsIdParamSchema> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ authorsId: id }, 'Deleting authors');

    const deleted = await this.authorsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'Authors not found');
    }

    request.log.info({ authorsId: id }, 'Authors deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'Authors deleted successfully',
    );
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options
   * GET /authors/dropdown
   */
  async getDropdownOptions(
    request: FastifyRequest<{
      Querystring: Static<typeof DropdownQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching authors dropdown options',
    );

    const result = await this.authorsService.getDropdownOptions(request.query);

    return reply.success({
      options: result.options,
      total: result.total,
    });
  }

  /**
   * Bulk create authorss
   * POST /authors/bulk
   */
  async bulkCreate(
    request: FastifyRequest<{
      Body: {
        items: CreateAuthors[];
        options?: { skipDuplicates?: boolean; continueOnError?: boolean };
      };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk creating authorss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) =>
        this.transformCreateSchema(item, request),
      ),
    };

    const result = await this.authorsService.bulkCreate(transformedData);

    return reply
      .code(201)
      .success(
        result,
        `Bulk create completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
      );
  }

  /**
   * Bulk update authorss
   * PUT /authors/bulk
   */
  async bulkUpdate(
    request: FastifyRequest<{
      Body: { items: Array<{ id: string | number; data: UpdateAuthors }> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk updating authorss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => ({
        id: item.id,
        data: this.transformUpdateSchema(item.data, request),
      })),
    };

    const result = await this.authorsService.bulkUpdate(transformedData);

    return reply.success(
      result,
      `Bulk update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk delete authorss
   * DELETE /authors/bulk
   */
  async bulkDelete(
    request: FastifyRequest<{ Body: Static<typeof BulkDeleteSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.ids.length },
      'Bulk deleting authorss',
    );

    const result = await this.authorsService.bulkDelete(request.body);

    return reply.success(
      result,
      `Bulk delete completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Get statistics
   * GET /authors/stats
   */
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Fetching authors statistics');

    const stats = await this.authorsService.getStats();

    return reply.success(stats);
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   * POST /authors/validate
   */
  async validate(
    request: FastifyRequest<{
      Body: { data: Static<typeof CreateAuthorsSchema> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info('Validating authors data');

    const result = await this.authorsService.validate(request.body);

    return reply.success(result);
  }

  /**
   * Check field uniqueness
   * GET /authors/check/:field
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
      'Checking authors field uniqueness',
    );

    const result = await this.authorsService.checkUniqueness(field, {
      value: String(request.query.value),
      excludeId: request.query.excludeId,
    });

    return reply.success(result);
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateAuthorsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      name: schema.name,
      email: schema.email,
      bio: schema.bio,
      birth_date: schema.birth_date,
      country: schema.country,
      active: schema.active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateAuthorsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.name !== undefined) {
      updateData.name = schema.name;
    }
    if (schema.email !== undefined) {
      updateData.email = schema.email;
    }
    if (schema.bio !== undefined) {
      updateData.bio = schema.bio;
    }
    if (schema.birth_date !== undefined) {
      updateData.birth_date = schema.birth_date;
    }
    if (schema.country !== undefined) {
      updateData.country = schema.country;
    }
    if (schema.active !== undefined) {
      updateData.active = schema.active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
