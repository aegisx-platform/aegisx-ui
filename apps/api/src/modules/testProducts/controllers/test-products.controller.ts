import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { TestProductsService } from '../services/test-products.service';
import {
  CreateTestProducts,
  UpdateTestProducts,
} from '../types/test-products.types';
import {
  CreateTestProductsSchema,
  UpdateTestProductsSchema,
  TestProductsIdParamSchema,
  GetTestProductsQuerySchema,
  ListTestProductsQuerySchema,
} from '../schemas/test-products.schemas';
import { ExportQuerySchema } from '../../../schemas/export.schemas';
import { ExportService, ExportField } from '../../../services/export.service';
import { TestProductsImportService } from '../services/test-products-import.service';
import {
  ValidateImportApiResponseSchema,
  ExecuteImportApiResponseSchema,
  ExecuteImportRequestSchema,
  ImportStatusApiResponseSchema,
} from '../schemas/test-products.schemas';
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
import { EventService } from '../../../shared/websocket/event.service';

/**
 * TestProducts Controller
 * Package: full
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class TestProductsController {
  constructor(
    private testProductsService: TestProductsService,
    private exportService: ExportService,
    private importService: TestProductsImportService,
    private eventService: EventService,
  ) {}

  /**
   * Create new testProducts
   * POST /testProducts
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateTestProductsSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating testProducts');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const testProducts = await this.testProductsService.create(createData);

    // 🔥 Emit created event for event-driven architecture
    // Backend always emits events for audit trail, analytics, and microservices
    // Frontend can optionally subscribe to these events
    this.eventService
      .for('test-products', 'test-products')
      .emitCustom('created', testProducts, 'normal');

    request.log.info(
      { testProductsId: testProducts.id },
      'TestProducts created successfully',
    );

    return reply
      .code(201)
      .success(testProducts, 'TestProducts created successfully');
  }

  /**
   * Get testProducts by ID
   * GET /testProducts/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
      Querystring: Static<typeof GetTestProductsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ testProductsId: id }, 'Fetching testProducts');

    const testProducts = await this.testProductsService.findById(
      id,
      request.query,
    );

    return reply.success(testProducts);
  }

  /**
   * Get paginated list of testProductss
   * GET /testProducts
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListTestProductsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching testProducts list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'code', 'created_at'],
      user: [
        'id',
        'code',
        'id',
        'code',
        'name',
        'slug',
        'description',
        'is_active',
        'is_featured',
        'display_order',
        'item_count',
        'discount_rate',
        'metadata',
        'settings',
        'status',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'code',
        'name',
        'slug',
        'description',
        'is_active',
        'is_featured',
        'display_order',
        'item_count',
        'discount_rate',
        'metadata',
        'settings',
        'status',
        'created_by',
        'updated_by',
        'deleted_at',
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

    // Get testProducts list with field filtering
    const result = await this.testProductsService.findMany({
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
      'TestProducts list fetched',
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
   * Update testProducts
   * PUT /testProducts/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
      Body: Static<typeof UpdateTestProductsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info(
      { testProductsId: id, body: request.body },
      'Updating testProducts',
    );

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const testProducts = await this.testProductsService.update(id, updateData);

    // 🔥 Emit updated event for event-driven architecture
    this.eventService
      .for('test-products', 'test-products')
      .emitCustom('updated', { id, ...testProducts }, 'normal');

    request.log.info(
      { testProductsId: id },
      'TestProducts updated successfully',
    );

    return reply.success(testProducts, 'TestProducts updated successfully');
  }

  /**
   * Delete testProducts
   * DELETE /testProducts/:id
   */
  async delete(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ testProductsId: id }, 'Deleting testProducts');

    const deleted = await this.testProductsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'TestProducts not found');
    }

    // 🔥 Emit deleted event for event-driven architecture
    this.eventService
      .for('test-products', 'test-products')
      .emitCustom('deleted', { id }, 'normal');

    request.log.info(
      { testProductsId: id },
      'TestProducts deleted successfully',
    );

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'TestProducts deleted successfully',
    );
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options
   * GET /testProducts/dropdown
   */
  async getDropdownOptions(
    request: FastifyRequest<{
      Querystring: Static<typeof DropdownQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching testProducts dropdown options',
    );

    const result = await this.testProductsService.getDropdownOptions(
      request.query,
    );

    return reply.success({
      options: result.options,
      total: result.total,
    });
  }

  /**
   * Bulk create testProductss
   * POST /testProducts/bulk
   */
  async bulkCreate(
    request: FastifyRequest<{
      Body: {
        items: CreateTestProducts[];
        options?: { skipDuplicates?: boolean; continueOnError?: boolean };
      };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk creating testProductss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) =>
        this.transformCreateSchema(item, request),
      ),
    };

    const result = await this.testProductsService.bulkCreate(transformedData);

    // Emit bulk created event for real-time updates
    if (result.created && result.created.length > 0) {
      this.eventService.for('testProducts', 'bulk').emitCustom(
        'bulkCreated',
        {
          count: result.summary.successful,
          items: result.created,
        },
        'normal',
      );
    }

    return reply
      .code(201)
      .success(
        result,
        `Bulk create completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
      );
  }

  /**
   * Bulk update testProductss
   * PUT /testProducts/bulk
   */
  async bulkUpdate(
    request: FastifyRequest<{
      Body: { items: Array<{ id: string | number; data: UpdateTestProducts }> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk updating testProductss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => ({
        id: item.id,
        data: this.transformUpdateSchema(item.data, request),
      })),
    };

    const result = await this.testProductsService.bulkUpdate(transformedData);

    // Emit bulk updated event for real-time updates
    if (result.updated && result.updated.length > 0) {
      this.eventService.for('testProducts', 'bulk').emitCustom(
        'bulkUpdated',
        {
          count: result.summary.successful,
          items: result.updated,
        },
        'normal',
      );
    }

    return reply.success(
      result,
      `Bulk update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk delete testProductss
   * DELETE /testProducts/bulk
   */
  async bulkDelete(
    request: FastifyRequest<{ Body: Static<typeof BulkDeleteSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.ids.length },
      'Bulk deleting testProductss',
    );

    const result = await this.testProductsService.bulkDelete(request.body);

    // Emit bulk deleted event for real-time updates
    if (result.deleted && result.deleted.length > 0) {
      this.eventService.for('testProducts', 'bulk').emitCustom(
        'bulkDeleted',
        {
          count: result.summary.successful,
          ids: result.deleted,
        },
        'normal',
      );
    }

    return reply.success(
      result,
      `Bulk delete completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk status update
   * PATCH /testProducts/bulk/status
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
      'Bulk updating testProducts status',
    );

    // Convert status to boolean if it's a string
    const statusData = {
      ...request.body,
      status:
        typeof request.body.status === 'string'
          ? request.body.status === 'true' || request.body.status === '1'
          : Boolean(request.body.status),
    };

    const result = await this.testProductsService.bulkUpdateStatus(statusData);

    // Emit bulk status updated event for real-time updates
    if (result.updated && result.updated.length > 0) {
      this.eventService.for('testProducts', 'bulk').emitCustom(
        'bulkStatusUpdated',
        {
          count: result.summary.successful,
          status: statusData.status,
          items: result.updated,
        },
        'normal',
      );
    }

    return reply.success(
      result,
      `Bulk status update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Activate testProducts
   * PATCH /testProducts/:id/activate
   */
  async activate(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ testProductsId: id }, 'Activating testProducts');

    const result = await this.testProductsService.activate(id, request.body);

    // Emit activated event for real-time updates
    this.eventService
      .for('testProducts', String(id))
      .emitCustom('activated', result, 'normal');

    return reply.success(result, 'TestProducts activated successfully');
  }

  /**
   * Deactivate testProducts
   * PATCH /testProducts/:id/deactivate
   */
  async deactivate(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ testProductsId: id }, 'Deactivating testProducts');

    const result = await this.testProductsService.deactivate(id, request.body);

    // Emit deactivated event for real-time updates
    this.eventService
      .for('testProducts', String(id))
      .emitCustom('deactivated', result, 'normal');

    return reply.success(result, 'TestProducts deactivated successfully');
  }

  /**
   * Toggle testProducts status
   * PATCH /testProducts/:id/toggle
   */
  async toggle(
    request: FastifyRequest<{
      Params: Static<typeof TestProductsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ testProductsId: id }, 'Toggling testProducts status');

    const result = await this.testProductsService.toggle(id, request.body);

    // Emit status toggled event for real-time updates
    this.eventService
      .for('testProducts', String(id))
      .emitCustom('statusToggled', result, 'normal');

    return reply.success(result, 'TestProducts status toggled successfully');
  }

  /**
   * Get statistics
   * GET /testProducts/stats
   */
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Fetching testProducts statistics');

    const stats = await this.testProductsService.getStats();

    return reply.success(stats);
  }

  /**
   * Export testProducts data
   * GET /testProducts/export
   */
  async export(
    request: FastifyRequest<{ Querystring: Static<typeof ExportQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const {
      format,
      ids,
      filters,
      fields,
      filename,
      includeMetadata = true,
      applyFilters = false,
    } = request.query;

    request.log.info(
      {
        format,
        idsCount: ids?.length || 0,
        hasFilters: !!filters,
        fieldsCount: fields?.length || 0,
      },
      'Exporting testProducts data',
    );

    try {
      // Prepare query parameters based on export options
      let queryParams: any = {};

      // Apply specific IDs if provided
      if (ids && ids.length > 0) {
        queryParams.ids = ids;
      }

      // Apply filters if requested
      if (applyFilters && filters) {
        queryParams = { ...queryParams, ...filters };
      }

      // Get data from service
      const exportData = await this.testProductsService.getExportData(
        queryParams,
        fields,
      );

      // Prepare export fields configuration
      const exportFields = this.getExportFields(fields);

      // Generate export filename and clean any existing extensions
      let exportFilename =
        filename || this.generateExportFilename(format, ids?.length);

      // Remove any existing file extensions to prevent double extensions
      if (exportFilename.includes('.')) {
        exportFilename = exportFilename.substring(
          0,
          exportFilename.lastIndexOf('.'),
        );
      }

      // Prepare metadata
      const metadata = includeMetadata
        ? {
            exportedBy:
              (request.user as any)?.username ||
              (request.user as any)?.email ||
              'System',
            exportedAt: new Date(),
            filtersApplied: applyFilters ? filters : undefined,
            totalRecords: exportData.length,
            selectedRecords: ids?.length,
          }
        : undefined;

      // Generate export file
      let buffer: Buffer;
      switch (format) {
        case 'csv':
          buffer = await this.exportService.exportToCsv({
            data: exportData,
            fields: exportFields,
            filename: exportFilename,
            metadata,
          });
          break;
        case 'excel':
          buffer = await this.exportService.exportToExcel({
            data: exportData,
            fields: exportFields,
            filename: exportFilename,
            title: 'TestProducts Export',
            metadata,
          });
          break;
        case 'pdf':
          buffer = await this.exportService.exportToPdf({
            data: exportData,
            fields: exportFields,
            filename: exportFilename,
            title: 'TestProducts Export - รายงาน',
            metadata,
            pdfOptions: {
              template: 'professional',
              pageSize: 'A4',
              orientation: 'landscape',
              subtitle: 'Generated with Thai Font Support',
              logo: process.env.PDF_LOGO_URL,
            },
          });
          break;
        default:
          return reply
            .code(400)
            .error('INVALID_FORMAT', 'Unsupported export format');
      }

      // Set response headers for file download
      const mimeTypes = {
        csv: 'text/csv',
        excel:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pdf: 'application/pdf',
      };

      const fileExtensions = {
        csv: 'csv',
        excel: 'xlsx',
        pdf: 'pdf',
      };

      reply
        .header('Content-Type', mimeTypes[format])
        .header(
          'Content-Disposition',
          `attachment; filename="${exportFilename}.${fileExtensions[format]}"`,
        )
        .header('Content-Length', buffer.length);

      request.log.info(
        {
          format,
          filename: `${exportFilename}.${fileExtensions[format]}`,
          fileSize: buffer.length,
          recordCount: exportData.length,
        },
        'TestProducts export completed successfully',
      );

      return reply.send(buffer);
    } catch (error) {
      request.log.error({ error, format }, 'Export failed');
      return reply.code(500).send({
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          statusCode: 500,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: 'v1',
          requestId: request.id,
          environment: process.env.NODE_ENV || 'development',
        },
      });
    }
  }

  // ===== FULL PACKAGE METHODS =====

  /**
   * Validate data before save
   * POST /testProducts/validate
   */
  async validate(
    request: FastifyRequest<{
      Body: { data: Static<typeof CreateTestProductsSchema> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info('Validating testProducts data');

    const result = await this.testProductsService.validate(request.body);

    return reply.success(result);
  }

  /**
   * Check field uniqueness
   * GET /testProducts/check/:field
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
      'Checking testProducts field uniqueness',
    );

    const result = await this.testProductsService.checkUniqueness(field, {
      value: String(request.query.value),
      excludeId: request.query.excludeId,
    });

    return reply.success(result);
  }

  // ===== PRIVATE EXPORT HELPER METHODS =====

  /**
   * Get export fields configuration
   */
  private getExportFields(requestedFields?: string[]): ExportField[] {
    // Define all available fields for export
    const allFields: ExportField[] = [
      {
        key: 'id',
        label: 'Id',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'code',
        label: 'Code',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'slug',
        label: 'Slug',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'is_active',
        label: 'Is active',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'is_featured',
        label: 'Is featured',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'display_order',
        label: 'Display order',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'item_count',
        label: 'Item count',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'discount_rate',
        label: 'Discount rate',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'metadata',
        label: 'Metadata',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'settings',
        label: 'Settings',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'created_by',
        label: 'Created by',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'updated_by',
        label: 'Updated by',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'deleted_at',
        label: 'Deleted at',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'created_at',
        label: 'Created at',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'updated_at',
        label: 'Updated at',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
    ];

    // Return requested fields or all fields
    if (requestedFields && requestedFields.length > 0) {
      return allFields.filter((field) => requestedFields.includes(field.key));
    }

    return allFields;
  }

  /**
   * Generate export filename
   */
  private generateExportFilename(
    format: string,
    selectedCount?: number,
  ): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const module = 'test-products';

    let suffix = '';
    if (selectedCount && selectedCount > 0) {
      suffix = `-selected-${selectedCount}`;
    }

    return `${module}-export${suffix}-${timestamp}`;
  }

  // ===== PRIVATE TRANSFORMATION METHODS =====

  /**
   * Transform API create schema to domain model
   */
  private transformCreateSchema(
    schema: Static<typeof CreateTestProductsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      code: schema.code,
      name: schema.name,
      slug: schema.slug,
      description: schema.description,
      is_active: schema.is_active,
      is_featured: schema.is_featured,
      display_order: schema.display_order,
      item_count: schema.item_count,
      discount_rate: schema.discount_rate,
      metadata: schema.metadata,
      settings: schema.settings,
      status: schema.status,
      deleted_at: schema.deleted_at,
    };

    // Auto-fill created_by from JWT if table has this field
    if (request.user?.id) {
      result.created_by = request.user.id;
    }

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateTestProductsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.code !== undefined) {
      updateData.code = schema.code;
    }
    if (schema.name !== undefined) {
      updateData.name = schema.name;
    }
    if (schema.slug !== undefined) {
      updateData.slug = schema.slug;
    }
    if (schema.description !== undefined) {
      updateData.description = schema.description;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }
    if (schema.is_featured !== undefined) {
      updateData.is_featured = schema.is_featured;
    }
    if (schema.display_order !== undefined) {
      updateData.display_order = schema.display_order;
    }
    if (schema.item_count !== undefined) {
      updateData.item_count = schema.item_count;
    }
    if (schema.discount_rate !== undefined) {
      updateData.discount_rate = schema.discount_rate;
    }
    if (schema.metadata !== undefined) {
      updateData.metadata = schema.metadata;
    }
    if (schema.settings !== undefined) {
      updateData.settings = schema.settings;
    }
    if (schema.status !== undefined) {
      updateData.status = schema.status;
    }
    if (schema.deleted_at !== undefined) {
      updateData.deleted_at = schema.deleted_at;
    }

    // Auto-fill updated_by from JWT if table has this field
    if (request.user?.id) {
      updateData.updated_by = request.user.id;
    }

    return updateData;
  }

  // ===== IMPORT METHODS =====

  /**
   * Download import template
   * GET /testProducts/import/template
   */
  async downloadImportTemplate(
    request: FastifyRequest<{
      Querystring: {
        format?: 'csv' | 'excel';
        includeExample?: boolean;
      };
    }>,
    reply: FastifyReply,
  ) {
    const { format = 'excel', includeExample = true } = request.query;
    request.log.info({ format, includeExample }, 'Generating import template');

    try {
      const buffer = await this.importService.generateTemplate({
        format,
        includeExamples: includeExample,
        exampleRowCount: 3,
      });

      const mimeTypes = {
        csv: 'text/csv',
        excel:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      const fileExtensions = {
        csv: 'csv',
        excel: 'xlsx',
      };

      const filename = `-import-template.${fileExtensions[format]}`;

      reply
        .header('Content-Type', mimeTypes[format])
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .header('Content-Length', buffer.length);

      request.log.info(
        { format, filename, fileSize: buffer.length },
        'Import template generated successfully',
      );

      return reply.send(buffer);
    } catch (error: any) {
      request.log.error(error, 'Failed to generate import template');
      return reply.error(
        'TEMPLATE_GENERATION_FAILED',
        error.message || 'Failed to generate import template',
        500,
      );
    }
  }

  /**
   * Validate import file
   * POST /testProducts/import/validate
   */
  async validateImport(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Use @aegisx/fastify-multipart clean API
      const { files, fields } = await request.parseMultipart();

      if (!files || files.length === 0) {
        return reply
          .code(400)
          .error('NO_FILE_PROVIDED', 'No file provided in request');
      }

      const file = files[0]; // Get first file

      // Parse options from string field
      let options: any = {};
      if (fields.options) {
        try {
          options = JSON.parse(fields.options);
        } catch (error) {
          return reply
            .code(400)
            .error('INVALID_OPTIONS', 'Invalid options JSON format');
        }
      }

      request.log.info(
        {
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          options,
        },
        'Validating import file',
      );

      // Convert file to buffer
      const fileBuffer = await file.toBuffer();

      // Determine file type from extension
      const fileExt = file.filename.toLowerCase().split('.').pop();
      const fileType =
        fileExt === 'csv' ? ('csv' as const) : ('excel' as const);

      // Validate file using new interface
      const result = await this.importService.validateFile({
        file: fileBuffer,
        fileName: file.filename,
        fileType,
      });

      request.log.info(
        {
          sessionId: result.sessionId,
          totalRows: result.summary.totalRows,
          validRows: result.summary.validRows,
          invalidRows: result.summary.invalidRows,
        },
        'Import file validated successfully',
      );

      // Get session and config to access ALL validated rows and transformer
      const session = (this.importService as any).sessions.get(
        result.sessionId,
      );
      const validatedRows = session?.validatedRows || [];
      const config = (this.importService as any).config;

      // Map to ValidateImportApiResponseSchema format
      const mappedResult = {
        sessionId: result.sessionId,
        // Root-level summary fields for frontend compatibility
        totalRows: result.summary.totalRows,
        validRows: result.summary.validRows,
        invalidRows: result.summary.invalidRows,
        // Detailed summary object
        summary: {
          totalRows: result.summary.totalRows,
          validRows: result.summary.validRows,
          invalidRows: result.summary.invalidRows,
          warnings: result.summary.totalWarnings,
          duplicates: 0, // TODO: Implement duplicate detection
          willCreate: result.summary.validRows,
          willSkip: 0,
        },
        errors: result.errors.flatMap((error) =>
          error.errors.map((err) => ({
            row: error.row,
            field: err.field,
            message: err.message,
            value: err.value,
          })),
        ),
        warnings: result.errors.flatMap((error) =>
          error.warnings.map((warn) => ({
            row: error.row,
            field: warn.field,
            message: warn.message,
            value: warn.value,
          })),
        ),
        // Preview: Transform raw data to match frontend expectations
        preview: validatedRows.slice(0, 10).map((rowValidation, index) => {
          const transformedData =
            config.rowTransformer && rowValidation.data
              ? config.rowTransformer(rowValidation.data)
              : rowValidation.data;

          return {
            rowNumber: rowValidation.row,
            status: rowValidation.isValid ? 'valid' : 'error',
            action: 'create', // Default action (can be enhanced with duplicate detection)
            ...transformedData, // Spread entity fields directly
            errors: rowValidation.errors,
            warnings: rowValidation.warnings,
          };
        }),
      };

      return reply.success(mappedResult, 'Import file validated successfully');
    } catch (error: any) {
      request.log.error(error, 'Failed to validate import file');

      // Handle specific multipart errors
      if (error.code === 'FST_FILE_TOO_LARGE') {
        return reply
          .code(413)
          .error('FILE_TOO_LARGE', 'File size exceeds 10MB limit');
      }

      return reply.error(
        'VALIDATION_FAILED',
        error.message || 'Failed to validate import file',
        500,
      );
    }
  }

  /**
   * Execute import
   * POST /testProducts/import/execute
   */
  async executeImport(
    request: FastifyRequest<{
      Body: Static<typeof ExecuteImportRequestSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { sessionId, options } = request.body;
    const userId = (request.user as any)?.id;

    try {
      request.log.info({ sessionId, options, userId }, 'Executing import job');

      // Execute import and get job result
      const result = await this.importService.executeImport({
        sessionId,
        skipWarnings: true, // Always skip warnings/errors - will import only valid rows
      });

      // Return job information (client can poll /import/status/:jobId for progress)
      return reply.code(202).success(result, 'Import job started successfully');
    } catch (error: any) {
      request.log.error(error, 'Failed to execute import');
      return reply.error(
        'IMPORT_EXECUTION_FAILED',
        error.message || 'Failed to execute import',
        500,
      );
    }
  }

  /**
   * Get import job status
   * GET /testProducts/import/status/:jobId
   */
  async getImportStatus(
    request: FastifyRequest<{ Params: { jobId: string } }>,
    reply: FastifyReply,
  ) {
    const { jobId } = request.params;

    try {
      request.log.info({ jobId }, 'Getting import job status');

      const status = await this.importService.getJobStatus(jobId);

      if (!status) {
        return reply
          .code(404)
          .error('JOB_NOT_FOUND', `Import job ${jobId} not found`);
      }

      // Return status directly - ImportJobStatusResponse has all necessary fields
      return reply.success(status, 'Import job status retrieved successfully');
    } catch (error: any) {
      request.log.error(error, 'Failed to get import job status');
      return reply.error(
        'STATUS_RETRIEVAL_FAILED',
        error.message || 'Failed to get import job status',
        500,
      );
    }
  }
}
