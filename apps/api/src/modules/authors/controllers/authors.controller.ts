import { FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { AuthorsService } from '../services/authors.service';
import { AuthorsImportService } from '../services/authors-import.service';
import { CreateAuthors, UpdateAuthors } from '../types/authors.types';
import {
  CreateAuthorsSchema,
  UpdateAuthorsSchema,
  AuthorsIdParamSchema,
  GetAuthorsQuerySchema,
  ListAuthorsQuerySchema,
  ExecuteImportRequestSchema,
  ImportOptions,
} from '../schemas/authors.schemas';
import { ExportQuerySchema } from '../../../schemas/export.schemas';
import { ExportService, ExportField } from '../../../services/export.service';
import {
  DropdownQuerySchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  ValidationRequestSchema,
  UniquenessCheckSchema,
} from '../../../schemas/base.schemas';

// Extend FastifyRequest for @aegisx/fastify-multipart
declare module 'fastify' {
  interface FastifyRequest {
    parseMultipart(): Promise<{
      files: Array<{
        filename: string;
        mimetype: string;
        encoding: string;
        size: number;
        toBuffer(): Promise<Buffer>;
        createReadStream(): NodeJS.ReadableStream;
      }>;
      fields: Record<string, string>;
    }>;
  }
}

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
  private importService: AuthorsImportService;

  constructor(
    private authorsService: AuthorsService,
    private exportService: ExportService,
  ) {
    // Initialize import service with knex and repository
    const knex = (authorsService as any).authorsRepository.knex;
    const repository = (authorsService as any).authorsRepository;
    this.importService = new AuthorsImportService(knex, repository);
  }

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

  /**
   * Export authors data
   * GET /authors/export
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
      'Exporting authors data',
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
      const exportData = await this.authorsService.getExportData(
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
            title: 'Authors Export',
            metadata,
          });
          break;
        case 'pdf':
          buffer = await this.exportService.exportToPdf({
            data: exportData,
            fields: exportFields,
            filename: exportFilename,
            title: 'Authors Export - รายงาน',
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
        'Authors export completed successfully',
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
        key: 'name',
        label: 'Name',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'bio',
        label: 'Bio',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'birth_date',
        label: 'Birth date',
        type: 'date' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'country',
        label: 'Country',
        type: 'string' as 'string' | 'number' | 'date' | 'boolean' | 'json',
      },
      {
        key: 'active',
        label: 'Active',
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
    const module = 'authors';

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

  // ===== BULK IMPORT METHODS =====

  /**
   * Download import template
   * GET /authors/import/template
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

      const filename = `authors-import-template.${fileExtensions[format]}`;

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
      return reply
        .code(500)
        .error(
          'TEMPLATE_GENERATION_FAILED',
          error.message || 'Failed to generate import template',
        );
    }
  }

  /**
   * Validate import file
   * POST /authors/import/validate
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
      let options: ImportOptions = {};
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

      // Map new response format to expected format
      const mappedResult = {
        sessionId: result.sessionId,
        filename: result.fileName,
        totalRows: result.summary.totalRows,
        validRows: result.summary.validRows,
        invalidRows: result.summary.invalidRows,
        summary: {
          toCreate: result.summary.validRows,
          toUpdate: 0,
          toSkip: result.summary.invalidRows,
          errors: result.summary.totalErrors,
          warnings: result.summary.totalWarnings,
        },
        preview: result.errors.map((error) => ({
          rowNumber: error.row,
          status: 'error' as const,
          action: 'skip' as const,
          data: error.data,
          errors: error.errors,
          warnings: error.warnings,
        })),
        expiresAt: result.expiresAt.toISOString(),
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

      return reply
        .code(500)
        .error(
          'VALIDATION_FAILED',
          error.message || 'Failed to validate import file',
        );
    }
  }

  /**
   * Execute import
   * POST /authors/import/execute
   */
  async executeImport(
    request: FastifyRequest<{
      Body: Static<typeof ExecuteImportRequestSchema>;
    }>,
    reply: FastifyReply,
  ) {
    const { sessionId, options } = request.body;
    const userId = (request.user as any)?.id;

    request.log.info({ sessionId, options, userId }, 'Executing import');

    try {
      const result = await this.importService.executeImport({
        sessionId,
        skipWarnings: options?.continueOnError || false,
      });

      // Map new response format to expected format
      const mappedJob = {
        jobId: result.jobId,
        status: result.status,
        progress: {
          current: 0,
          total: 0,
          percentage: 0,
        },
        summary: {
          processed: 0,
          successful: 0,
          failed: 0,
          skipped: 0,
          created: 0,
          updated: 0,
        },
        startedAt: new Date().toISOString(),
      };

      request.log.info(
        { jobId: result.jobId, status: result.status },
        'Import job started successfully',
      );

      return reply.code(202).success(mappedJob, 'Import job started successfully');
    } catch (error: any) {
      request.log.error(error, 'Failed to execute import');
      return reply
        .code(500)
        .error(
          'IMPORT_EXECUTION_FAILED',
          error.message || 'Failed to execute import',
        );
    }
  }

  /**
   * Get import job status
   * GET /authors/import/status/:jobId
   */
  async getImportStatus(
    request: FastifyRequest<{
      Params: { jobId: string };
    }>,
    reply: FastifyReply,
  ) {
    const { jobId } = request.params;

    request.log.info({ jobId }, 'Fetching import job status');

    try {
      const status = await this.importService.getJobStatus(jobId);

      // Map new response format to expected format
      const mappedStatus = {
        jobId: status.jobId,
        status: status.status,
        progress: {
          current: status.processedRecords,
          total: status.totalRecords,
          percentage: status.progress,
        },
        summary: {
          processed: status.processedRecords,
          successful: status.successCount,
          failed: status.failedCount,
          skipped: 0,
          created: status.successCount,
          updated: 0,
        },
        startedAt: status.startedAt?.toISOString(),
        completedAt: status.completedAt?.toISOString(),
        errors: [],
      };

      request.log.info(
        {
          jobId,
          status: status.status,
          progress: status.progress,
        },
        'Import job status retrieved',
      );

      return reply.success(mappedStatus);
    } catch (error: any) {
      request.log.error(error, 'Failed to get import status');

      if (error.message.includes('not found')) {
        return reply.code(404).error('JOB_NOT_FOUND', 'Import job not found');
      }

      return reply
        .code(500)
        .error(
          'STATUS_FETCH_FAILED',
          error.message || 'Failed to get import status',
        );
    }
  }
}
