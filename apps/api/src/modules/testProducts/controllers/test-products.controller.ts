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
      public: ['id', 'sku', 'created_at'],
      user: [
        'id',
        'sku',
        'id',
        'sku',
        'name',
        'barcode',
        'manufacturer',
        'description',
        'long_description',
        'specifications',
        'quantity',
        'min_quantity',
        'max_quantity',
        'price',
        'cost',
        'weight',
        'discount_percentage',
        'is_active',
        'is_featured',
        'is_taxable',
        'is_shippable',
        'allow_backorder',
        'status',
        'condition',
        'availability',
        'launch_date',
        'discontinued_date',
        'last_stock_check',
        'next_restock_date',
        'attributes',
        'tags',
        'images',
        'pricing_tiers',
        'dimensions',
        'seo_metadata',
        'category_id',
        'parent_product_id',
        'supplier_id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'created_at',
      ],
      admin: [
        'id',
        'sku',
        'name',
        'barcode',
        'manufacturer',
        'description',
        'long_description',
        'specifications',
        'quantity',
        'min_quantity',
        'max_quantity',
        'price',
        'cost',
        'weight',
        'discount_percentage',
        'is_active',
        'is_featured',
        'is_taxable',
        'is_shippable',
        'allow_backorder',
        'status',
        'condition',
        'availability',
        'launch_date',
        'discontinued_date',
        'last_stock_check',
        'next_restock_date',
        'attributes',
        'tags',
        'images',
        'pricing_tiers',
        'dimensions',
        'seo_metadata',
        'category_id',
        'parent_product_id',
        'supplier_id',
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
        key: 'sku',
        label: 'Sku',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'name',
        label: 'Name',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'barcode',
        label: 'Barcode',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'manufacturer',
        label: 'Manufacturer',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'long_description',
        label: 'Long description',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'specifications',
        label: 'Specifications',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'quantity',
        label: 'Quantity',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'min_quantity',
        label: 'Min quantity',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'max_quantity',
        label: 'Max quantity',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'price',
        label: 'Price',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'cost',
        label: 'Cost',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'weight',
        label: 'Weight',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'discount_percentage',
        label: 'Discount percentage',
        type: 'number' as 'string' | 'number' | 'date' | 'boolean' | 'json',
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
        key: 'is_taxable',
        label: 'Is taxable',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'is_shippable',
        label: 'Is shippable',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'allow_backorder',
        label: 'Allow backorder',
        type: 'boolean' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'condition',
        label: 'Condition',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'availability',
        label: 'Availability',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'launch_date',
        label: 'Launch date',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'discontinued_date',
        label: 'Discontinued date',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'last_stock_check',
        label: 'Last stock check',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'next_restock_date',
        label: 'Next restock date',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'attributes',
        label: 'Attributes',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'tags',
        label: 'Tags',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'images',
        label: 'Images',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'pricing_tiers',
        label: 'Pricing tiers',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'dimensions',
        label: 'Dimensions',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'seo_metadata',
        label: 'Seo metadata',
        type: 'json' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'category_id',
        label: 'Category id',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'parent_product_id',
        label: 'Parent product id',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'supplier_id',
        label: 'Supplier id',
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
      sku: schema.sku,
      name: schema.name,
      barcode: schema.barcode,
      manufacturer: schema.manufacturer,
      description: schema.description,
      long_description: schema.long_description,
      specifications: schema.specifications,
      quantity: schema.quantity,
      min_quantity: schema.min_quantity,
      max_quantity: schema.max_quantity,
      price: schema.price,
      cost: schema.cost,
      weight: schema.weight,
      discount_percentage: schema.discount_percentage,
      is_active: schema.is_active,
      is_featured: schema.is_featured,
      is_taxable: schema.is_taxable,
      is_shippable: schema.is_shippable,
      allow_backorder: schema.allow_backorder,
      status: schema.status,
      condition: schema.condition,
      availability: schema.availability,
      launch_date: schema.launch_date,
      discontinued_date: schema.discontinued_date,
      last_stock_check: schema.last_stock_check,
      next_restock_date: schema.next_restock_date,
      attributes: schema.attributes,
      tags: schema.tags,
      images: schema.images,
      pricing_tiers: schema.pricing_tiers,
      dimensions: schema.dimensions,
      seo_metadata: schema.seo_metadata,
      category_id: schema.category_id,
      parent_product_id: schema.parent_product_id,
      supplier_id: schema.supplier_id,
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

    if (schema.sku !== undefined) {
      updateData.sku = schema.sku;
    }
    if (schema.name !== undefined) {
      updateData.name = schema.name;
    }
    if (schema.barcode !== undefined) {
      updateData.barcode = schema.barcode;
    }
    if (schema.manufacturer !== undefined) {
      updateData.manufacturer = schema.manufacturer;
    }
    if (schema.description !== undefined) {
      updateData.description = schema.description;
    }
    if (schema.long_description !== undefined) {
      updateData.long_description = schema.long_description;
    }
    if (schema.specifications !== undefined) {
      updateData.specifications = schema.specifications;
    }
    if (schema.quantity !== undefined) {
      updateData.quantity = schema.quantity;
    }
    if (schema.min_quantity !== undefined) {
      updateData.min_quantity = schema.min_quantity;
    }
    if (schema.max_quantity !== undefined) {
      updateData.max_quantity = schema.max_quantity;
    }
    if (schema.price !== undefined) {
      updateData.price = schema.price;
    }
    if (schema.cost !== undefined) {
      updateData.cost = schema.cost;
    }
    if (schema.weight !== undefined) {
      updateData.weight = schema.weight;
    }
    if (schema.discount_percentage !== undefined) {
      updateData.discount_percentage = schema.discount_percentage;
    }
    if (schema.is_active !== undefined) {
      updateData.is_active = schema.is_active;
    }
    if (schema.is_featured !== undefined) {
      updateData.is_featured = schema.is_featured;
    }
    if (schema.is_taxable !== undefined) {
      updateData.is_taxable = schema.is_taxable;
    }
    if (schema.is_shippable !== undefined) {
      updateData.is_shippable = schema.is_shippable;
    }
    if (schema.allow_backorder !== undefined) {
      updateData.allow_backorder = schema.allow_backorder;
    }
    if (schema.status !== undefined) {
      updateData.status = schema.status;
    }
    if (schema.condition !== undefined) {
      updateData.condition = schema.condition;
    }
    if (schema.availability !== undefined) {
      updateData.availability = schema.availability;
    }
    if (schema.launch_date !== undefined) {
      updateData.launch_date = schema.launch_date;
    }
    if (schema.discontinued_date !== undefined) {
      updateData.discontinued_date = schema.discontinued_date;
    }
    if (schema.last_stock_check !== undefined) {
      updateData.last_stock_check = schema.last_stock_check;
    }
    if (schema.next_restock_date !== undefined) {
      updateData.next_restock_date = schema.next_restock_date;
    }
    if (schema.attributes !== undefined) {
      updateData.attributes = schema.attributes;
    }
    if (schema.tags !== undefined) {
      updateData.tags = schema.tags;
    }
    if (schema.images !== undefined) {
      updateData.images = schema.images;
    }
    if (schema.pricing_tiers !== undefined) {
      updateData.pricing_tiers = schema.pricing_tiers;
    }
    if (schema.dimensions !== undefined) {
      updateData.dimensions = schema.dimensions;
    }
    if (schema.seo_metadata !== undefined) {
      updateData.seo_metadata = schema.seo_metadata;
    }
    if (schema.category_id !== undefined) {
      updateData.category_id = schema.category_id;
    }
    if (schema.parent_product_id !== undefined) {
      updateData.parent_product_id = schema.parent_product_id;
    }
    if (schema.supplier_id !== undefined) {
      updateData.supplier_id = schema.supplier_id;
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
}
