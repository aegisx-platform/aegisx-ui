import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { DrugsService } from './drugs.service';
import { CreateDrugs, UpdateDrugs } from './drugs.types';
import {
  CreateDrugsSchema,
  UpdateDrugsSchema,
  DrugsIdParamSchema,
  GetDrugsQuerySchema,
  ListDrugsQuerySchema,
} from './drugs.schemas';
import { ExportQuerySchema } from '../../../../schemas/export.schemas';
import {
  ExportService,
  ExportField,
} from '../../../../services/export.service';
import {
  DropdownQuerySchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  StatusToggleSchema,
  UniquenessCheckSchema,
} from '../../../../schemas/base.schemas';

/**
 * Drugs Controller
 * Package: full
 * Has Status Field: true
 *
 * Following Fastify controller patterns:
 * - Proper request/reply typing with Static<typeof Schema>
 * - Schema-based validation integration
 * - Structured error handling
 * - Logging integration with Fastify's logger
 */
export class DrugsController {
  constructor(
    private drugsService: DrugsService,
    private exportService: ExportService,
  ) {}

  /**
   * Create new drugs
   * POST /drugs
   */
  async create(
    request: FastifyRequest<{ Body: Static<typeof CreateDrugsSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info({ body: request.body }, 'Creating drugs');

    // Transform API schema to domain model
    const createData = this.transformCreateSchema(request.body, request);

    const drugs = await this.drugsService.create(createData);

    request.log.info({ drugsId: drugs.id }, 'Drugs created successfully');

    return reply.code(201).success(drugs, 'Drugs created successfully');
  }

  /**
   * Get drugs by ID
   * GET /drugs/:id
   */
  async findOne(
    request: FastifyRequest<{
      Params: Static<typeof DrugsIdParamSchema>;
      Querystring: Static<typeof GetDrugsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id }, 'Fetching drugs');

    const drugs = await this.drugsService.findById(id, request.query);

    return reply.success(drugs);
  }

  /**
   * Get paginated list of drugss
   * GET /drugs
   * Supports: ?fields=id,name&limit=100 (Security hardened)
   */
  async findMany(
    request: FastifyRequest<{
      Querystring: Static<typeof ListDrugsQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info({ query: request.query }, 'Fetching drugs list');

    // 🛡️ Security: Extract and validate parameters
    const { fields, ...queryParams } = request.query;

    // 🛡️ Security: Define allowed fields by role
    const SAFE_FIELDS = {
      public: ['id', 'drug_code', 'created_at'],
      user: [
        'id',
        'drug_code',
        'id',
        'drug_code',
        'trade_name',
        'generic_id',
        'manufacturer_id',
        'tmt_tpu_id',
        'nlem_status',
        'drug_status',
        'product_category',
        'status_changed_date',
        'unit_price',
        'package_size',
        'package_unit',
        'is_active',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'drug_code',
        'trade_name',
        'generic_id',
        'manufacturer_id',
        'tmt_tpu_id',
        'nlem_status',
        'drug_status',
        'product_category',
        'status_changed_date',
        'unit_price',
        'package_size',
        'package_unit',
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

    // Get drugs list with field filtering
    const result = await this.drugsService.findMany({
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
      'Drugs list fetched',
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
   * Update drugs
   * PUT /drugs/:id
   */
  async update(
    request: FastifyRequest<{
      Params: Static<typeof DrugsIdParamSchema>;
      Body: Static<typeof UpdateDrugsSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id, body: request.body }, 'Updating drugs');

    // Transform API schema to domain model
    const updateData = this.transformUpdateSchema(request.body, request);

    const drugs = await this.drugsService.update(id, updateData);

    request.log.info({ drugsId: id }, 'Drugs updated successfully');

    return reply.success(drugs, 'Drugs updated successfully');
  }

  /**
   * Delete drugs
   * DELETE /drugs/:id
   */
  async delete(
    request: FastifyRequest<{ Params: Static<typeof DrugsIdParamSchema> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id }, 'Deleting drugs');

    const deleted = await this.drugsService.delete(id);

    if (!deleted) {
      return reply.code(404).error('NOT_FOUND', 'Drugs not found');
    }

    request.log.info({ drugsId: id }, 'Drugs deleted successfully');

    // Return operation result using standard success response
    return reply.success(
      {
        id,
        deleted: true,
      },
      'Drugs deleted successfully',
    );
  }

  // ===== ENHANCED CRUD METHODS =====

  /**
   * Get dropdown options
   * GET /drugs/dropdown
   */
  async getDropdownOptions(
    request: FastifyRequest<{
      Querystring: Static<typeof DropdownQuerySchema>;
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { query: request.query },
      'Fetching drugs dropdown options',
    );

    const result = await this.drugsService.getDropdownOptions(request.query);

    return reply.success({
      options: result.options,
      total: result.total,
    });
  }

  /**
   * Bulk create drugss
   * POST /drugs/bulk
   */
  async bulkCreate(
    request: FastifyRequest<{
      Body: {
        items: CreateDrugs[];
        options?: { skipDuplicates?: boolean; continueOnError?: boolean };
      };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk creating drugss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) =>
        this.transformCreateSchema(item, request),
      ),
    };

    const result = await this.drugsService.bulkCreate(transformedData);

    return reply
      .code(201)
      .success(
        result,
        `Bulk create completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
      );
  }

  /**
   * Bulk update drugss
   * PUT /drugs/bulk
   */
  async bulkUpdate(
    request: FastifyRequest<{
      Body: { items: Array<{ id: string | number; data: UpdateDrugs }> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.items.length },
      'Bulk updating drugss',
    );

    // Transform API schema to domain model for each item
    const transformedData = {
      items: request.body.items.map((item) => ({
        id: item.id,
        data: this.transformUpdateSchema(item.data, request),
      })),
    };

    const result = await this.drugsService.bulkUpdate(transformedData);

    return reply.success(
      result,
      `Bulk update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk delete drugss
   * DELETE /drugs/bulk
   */
  async bulkDelete(
    request: FastifyRequest<{ Body: Static<typeof BulkDeleteSchema> }>,
    reply: FastifyReply,
  ) {
    request.log.info(
      { count: request.body.ids.length },
      'Bulk deleting drugss',
    );

    const result = await this.drugsService.bulkDelete(request.body);

    return reply.success(
      result,
      `Bulk delete completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Bulk status update
   * PATCH /drugs/bulk/status
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
      'Bulk updating drugs status',
    );

    // Convert status to boolean if it's a string
    const statusData = {
      ...request.body,
      status:
        typeof request.body.status === 'string'
          ? request.body.status === 'true' || request.body.status === '1'
          : Boolean(request.body.status),
    };

    const result = await this.drugsService.bulkUpdateStatus(statusData);

    return reply.success(
      result,
      `Bulk status update completed: ${result.summary.successful} successful, ${result.summary.failed} failed`,
    );
  }

  /**
   * Activate drugs
   * PATCH /drugs/:id/activate
   */
  async activate(
    request: FastifyRequest<{
      Params: Static<typeof DrugsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id }, 'Activating drugs');

    const result = await this.drugsService.activate(id, request.body);

    return reply.success(result, 'Drugs activated successfully');
  }

  /**
   * Deactivate drugs
   * PATCH /drugs/:id/deactivate
   */
  async deactivate(
    request: FastifyRequest<{
      Params: Static<typeof DrugsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id }, 'Deactivating drugs');

    const result = await this.drugsService.deactivate(id, request.body);

    return reply.success(result, 'Drugs deactivated successfully');
  }

  /**
   * Toggle drugs status
   * PATCH /drugs/:id/toggle
   */
  async toggle(
    request: FastifyRequest<{
      Params: Static<typeof DrugsIdParamSchema>;
      Body: Static<typeof StatusToggleSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    request.log.info({ drugsId: id }, 'Toggling drugs status');

    const result = await this.drugsService.toggle(id, request.body);

    return reply.success(result, 'Drugs status toggled successfully');
  }

  /**
   * Get statistics
   * GET /drugs/stats
   */
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    request.log.info('Fetching drugs statistics');

    const stats = await this.drugsService.getStats();

    return reply.success(stats);
  }

  /**
   * Export drugs data
   * GET /drugs/export
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
      'Exporting drugs data',
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
      const exportData = await this.drugsService.getExportData(
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
            title: 'Drugs Export',
            metadata,
          });
          break;
        case 'pdf':
          buffer = await this.exportService.exportToPdf({
            data: exportData,
            fields: exportFields,
            filename: exportFilename,
            title: 'Drugs Export - รายงาน',
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
        'Drugs export completed successfully',
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
   * POST /drugs/validate
   */
  async validate(
    request: FastifyRequest<{
      Body: { data: Static<typeof CreateDrugsSchema> };
    }>,
    reply: FastifyReply,
  ) {
    request.log.info('Validating drugs data');

    const result = await this.drugsService.validate(request.body);

    return reply.success(result);
  }

  /**
   * Check field uniqueness
   * GET /drugs/check/:field
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
      'Checking drugs field uniqueness',
    );

    const result = await this.drugsService.checkUniqueness(field, {
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
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'drug_code',
        label: 'Drug code',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'trade_name',
        label: 'Trade name',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'generic_id',
        label: 'Generic id',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'manufacturer_id',
        label: 'Manufacturer id',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'tmt_tpu_id',
        label: 'Tmt tpu id',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'nlem_status',
        label: 'Nlem status',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'drug_status',
        label: 'Drug status',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'product_category',
        label: 'Product category',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'status_changed_date',
        label: 'Status changed date',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'unit_price',
        label: 'Unit price',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'package_size',
        label: 'Package size',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'package_unit',
        label: 'Package unit',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'is_active',
        label: 'Is active',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
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
    const module = 'drugs';

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
    schema: Static<typeof CreateDrugsSchema>,
    request: FastifyRequest,
  ) {
    const result: any = {
      // Transform snake_case API fields to camelCase domain fields
      drug_code: schema.drug_code,
      trade_name: schema.trade_name,
      generic_id: schema.generic_id,
      manufacturer_id: schema.manufacturer_id,
      tmt_tpu_id: schema.tmt_tpu_id,
      nlem_status: schema.nlem_status,
      drug_status: schema.drug_status,
      product_category: schema.product_category,
      status_changed_date: schema.status_changed_date,
      unit_price: schema.unit_price,
      package_size: schema.package_size,
      package_unit: schema.package_unit,
      is_active: schema.is_active,
    };

    // Auto-fill created_by from JWT if table has this field

    return result;
  }

  /**
   * Transform API update schema to domain model
   */
  private transformUpdateSchema(
    schema: Static<typeof UpdateDrugsSchema>,
    request: FastifyRequest,
  ) {
    const updateData: any = {};

    if (schema.drug_code !== undefined) {
      updateData.drug_code = schema.drug_code;
    }
    if (schema.trade_name !== undefined) {
      updateData.trade_name = schema.trade_name;
    }
    if (schema.generic_id !== undefined) {
      updateData.generic_id = schema.generic_id;
    }
    if (schema.manufacturer_id !== undefined) {
      updateData.manufacturer_id = schema.manufacturer_id;
    }
    if (schema.tmt_tpu_id !== undefined) {
      updateData.tmt_tpu_id = schema.tmt_tpu_id;
    }
    if (schema.nlem_status !== undefined) {
      updateData.nlem_status = schema.nlem_status;
    }
    if (schema.drug_status !== undefined) {
      updateData.drug_status = schema.drug_status;
    }
    if (schema.product_category !== undefined) {
      updateData.product_category = schema.product_category;
    }
    if (schema.status_changed_date !== undefined) {
      updateData.status_changed_date = schema.status_changed_date;
    }
    if (schema.unit_price !== undefined) {
      updateData.unit_price = schema.unit_price;
    }
    if (schema.package_size !== undefined) {
      updateData.package_size = schema.package_size;
    }
    if (schema.package_unit !== undefined) {
      updateData.package_unit = schema.package_unit;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }

    // Auto-fill updated_by from JWT if table has this field

    return updateData;
  }
}
