import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { AuthorsService } from './authors.service';
import {
  type CreateAuthors,
  type ImportOptions,
  type ImportRowPreview,
  type ImportSummary,
  type ValidateImportResponse,
  type ImportJob,
  type ImportError,
  AuthorsErrorCode,
  AuthorsErrorMessages,
} from '../types/authors.types';

/**
 * Session storage for import validation results
 * In production, use Redis for distributed session management
 */
interface ImportSession {
  sessionId: string;
  filename: string;
  rows: any[];
  preview: ImportRowPreview[];
  summary: ImportSummary;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Job storage for import execution tracking
 * In production, use Redis or database for persistent job tracking
 */
interface ImportJobData extends ImportJob {
  userId?: string;
  rows: any[];
}

/**
 * Authors Import Service
 *
 * Handles bulk import operations for Authors module:
 * - Template generation (Excel/CSV)
 * - File validation with row-by-row error reporting
 * - Session-based import workflow
 * - Background job execution with progress tracking
 */
export class AuthorsImportService {
  // In-memory storage (replace with Redis in production)
  private sessions: Map<string, ImportSession> = new Map();
  private jobs: Map<string, ImportJobData> = new Map();

  // Session expiry time (30 minutes)
  private readonly SESSION_EXPIRY_MS = 30 * 60 * 1000;

  constructor(private authorsService: AuthorsService) {
    // Clean up expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
  }

  /**
   * Generate import template (Excel or CSV)
   */
  async generateTemplate(options: {
    format: 'csv' | 'excel';
    includeExample: boolean;
  }): Promise<Buffer> {
    const { format, includeExample } = options;

    // Define template columns with instructions
    const headers = ['name', 'email', 'bio', 'birth_date', 'country', 'active'];

    const instructions = [
      'Full name (required)',
      'Email address (required, must be unique)',
      'Biography (optional)',
      'Birth date (optional, format: YYYY-MM-DD)',
      'Country (optional)',
      'Active status (optional, true/false)',
    ];

    // Create worksheet data
    const worksheetData: any[][] = [headers, instructions];

    // Add example rows if requested
    if (includeExample) {
      worksheetData.push(
        [
          'John Doe',
          'john.doe@example.com',
          'Award-winning author of fiction novels',
          '1980-05-15',
          'USA',
          'true',
        ],
        [
          'Jane Smith',
          'jane.smith@example.com',
          'Science fiction writer',
          '1975-08-22',
          'UK',
          'true',
        ],
      );
    }

    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Authors Import');

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 20 }, // name
      { wch: 30 }, // email
      { wch: 40 }, // bio
      { wch: 15 }, // birth_date
      { wch: 15 }, // country
      { wch: 10 }, // active
    ];

    // Generate buffer based on format
    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return Buffer.from(csv, 'utf-8');
    } else {
      // Excel format
      return XLSX.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });
    }
  }

  /**
   * Validate import file and create session
   */
  async validateImportFile(
    fileBuffer: Buffer,
    filename: string,
    options: ImportOptions = {},
  ): Promise<ValidateImportResponse> {
    // Parse file based on extension
    const fileExt = filename.toLowerCase().split('.').pop();
    let rows: any[];

    try {
      if (fileExt === 'csv') {
        rows = await this.parseCSV(fileBuffer);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        rows = this.parseExcel(fileBuffer);
      } else {
        throw new Error(
          'Unsupported file format. Please upload CSV or Excel file.',
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    // Validate rows and generate preview
    const { preview, summary } = await this.validateRows(rows, options);

    // Create session
    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_EXPIRY_MS);

    const session: ImportSession = {
      sessionId,
      filename,
      rows,
      preview,
      summary,
      createdAt: now,
      expiresAt,
    };

    this.sessions.set(sessionId, session);

    return {
      sessionId,
      filename,
      totalRows: rows.length,
      validRows: summary.toCreate + summary.toUpdate,
      invalidRows: summary.toSkip + summary.errors,
      summary,
      preview: preview.slice(0, 20), // Return first 20 rows for preview
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Execute import from validated session
   */
  async executeImport(
    sessionId: string,
    options: ImportOptions = {},
    userId?: string,
  ): Promise<ImportJob> {
    // Retrieve session
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Import session not found or expired');
    }

    // Check expiry
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      throw new Error('Import session expired');
    }

    // Create job
    const jobId = randomUUID();
    const now = new Date();

    const job: ImportJobData = {
      jobId,
      status: 'pending',
      progress: {
        current: 0,
        total: session.rows.length,
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
      errors: [],
      startedAt: now.toISOString(),
      userId,
      rows: session.rows,
    };

    this.jobs.set(jobId, job);

    // Execute import in background (don't await)
    this.processImportJob(jobId, options).catch((error) => {
      console.error('Import job failed:', error);
    });

    return {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      summary: job.summary,
      startedAt: job.startedAt,
    };
  }

  /**
   * Get import job status
   */
  async getJobStatus(jobId: string): Promise<ImportJob> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error('Import job not found');
    }

    return {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      summary: job.summary,
      errors: job.errors,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      estimatedCompletion: job.estimatedCompletion,
      duration: job.duration,
      errorReportUrl: job.errorReportUrl,
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Parse CSV file to rows
   */
  private async parseCSV(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const stream = Readable.from(buffer);
      const csvParser = require('csv-parser');

      stream
        .pipe(csvParser())
        .on('data', (row: any) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', (error: Error) => reject(error));
    });
  }

  /**
   * Parse Excel file to rows
   */
  private parseExcel(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON using headers from row 1
    // Row 1 = Headers (name, email, bio, ...)
    // Row 2 = Instructions (Full name (required), ...)
    // Row 3+ = Data (John Doe, ...)
    const allRows = XLSX.utils.sheet_to_json(worksheet, {
      range: 0, // Read all rows
      defval: null,
    });

    // Filter out the instruction row (first row after header)
    // The instruction row has values like "Full name (required)"
    return allRows.filter((row: any, index: number) => {
      // Skip first row (index 0) which is the instruction row
      return index > 0;
    });
  }

  /**
   * Validate rows and generate preview with error reporting
   */
  private async validateRows(
    rows: any[],
    options: ImportOptions,
  ): Promise<{
    preview: ImportRowPreview[];
    summary: ImportSummary;
  }> {
    const preview: ImportRowPreview[] = [];
    const summary: ImportSummary = {
      toCreate: 0,
      toUpdate: 0,
      toSkip: 0,
      errors: 0,
      warnings: 0,
    };

    for (let i = 0; i < rows.length; i++) {
      const rowNumber = i + 3; // Row 1 = header, Row 2 = instructions, Row 3+ = data
      const row = rows[i];

      const rowPreview = await this.validateSingleRow(row, rowNumber, options);
      preview.push(rowPreview);

      // Update summary
      if (rowPreview.status === 'error') {
        summary.errors++;
        summary.toSkip++;
      } else if (rowPreview.status === 'duplicate') {
        if (options.skipDuplicates) {
          summary.toSkip++;
        } else if (options.updateExisting) {
          summary.toUpdate++;
        } else {
          summary.toSkip++;
        }
      } else {
        summary.toCreate++;
      }

      if (rowPreview.warnings.length > 0) {
        summary.warnings++;
      }
    }

    return { preview, summary };
  }

  /**
   * Validate single row and return preview with errors
   */
  private async validateSingleRow(
    row: any,
    rowNumber: number,
    options: ImportOptions,
  ): Promise<ImportRowPreview> {
    const errors: Array<{
      field: string;
      message: string;
      code: string;
      severity: 'error' | 'warning' | 'info';
    }> = [];
    const warnings: Array<{
      field: string;
      message: string;
      code?: string;
    }> = [];

    // Validate required fields
    if (!row.name || String(row.name).trim() === '') {
      errors.push({
        field: 'name',
        message: 'Name is required',
        code: 'REQUIRED_FIELD',
        severity: 'error',
      });
    }

    if (!row.email || String(row.email).trim() === '') {
      errors.push({
        field: 'email',
        message: 'Email is required',
        code: 'REQUIRED_FIELD',
        severity: 'error',
      });
    }

    // Validate email format
    if (row.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        errors.push({
          field: 'email',
          message: AuthorsErrorMessages[AuthorsErrorCode.INVALID_EMAIL_EMAIL],
          code: AuthorsErrorCode.INVALID_EMAIL_EMAIL,
          severity: 'error',
        });
      }
    }

    // Validate birth_date format and business rule
    if (row.birth_date) {
      const dateStr = String(row.birth_date).trim();
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        errors.push({
          field: 'birth_date',
          message: 'Invalid date format. Use YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT',
          severity: 'error',
        });
      } else if (date > new Date()) {
        errors.push({
          field: 'birth_date',
          message:
            AuthorsErrorMessages[AuthorsErrorCode.INVALID_DATE_BIRTH_DATE],
          code: AuthorsErrorCode.INVALID_DATE_BIRTH_DATE,
          severity: 'error',
        });
      }
    }

    // Validate active field (boolean)
    if (row.active !== null && row.active !== undefined) {
      const activeStr = String(row.active).toLowerCase();
      if (!['true', 'false', '1', '0', 'yes', 'no'].includes(activeStr)) {
        warnings.push({
          field: 'active',
          message: 'Active field should be true/false. Defaulting to true.',
          code: 'INVALID_BOOLEAN',
        });
      }
    }

    // Check for duplicate email (if no validation errors so far)
    let isDuplicate = false;
    if (errors.length === 0 && row.email) {
      try {
        const existing = await this.authorsService[
          'authorsRepository'
        ].findByEmail(row.email);
        if (existing) {
          isDuplicate = true;
          if (!options.updateExisting && !options.skipDuplicates) {
            errors.push({
              field: 'email',
              message: AuthorsErrorMessages[AuthorsErrorCode.DUPLICATE_EMAIL],
              code: AuthorsErrorCode.DUPLICATE_EMAIL,
              severity: 'error',
            });
          }
        }
      } catch (error) {
        // Continue validation even if duplicate check fails
        console.error('Duplicate check failed:', error);
      }
    }

    // Determine row status and action
    let status: 'valid' | 'warning' | 'error' | 'duplicate';
    let action: 'create' | 'update' | 'skip';

    if (errors.length > 0) {
      status = 'error';
      action = 'skip';
    } else if (isDuplicate) {
      status = 'duplicate';
      if (options.updateExisting) {
        action = 'update';
      } else {
        action = 'skip';
      }
    } else if (warnings.length > 0) {
      status = 'warning';
      action = 'create';
    } else {
      status = 'valid';
      action = 'create';
    }

    // Prepare cleaned data
    const data: Partial<CreateAuthors> = {
      name: row.name ? String(row.name).trim() : undefined,
      email: row.email ? String(row.email).trim() : undefined,
      bio: row.bio ? String(row.bio).trim() : undefined,
      birth_date: row.birth_date ? String(row.birth_date).trim() : undefined,
      country: row.country ? String(row.country).trim() : undefined,
      active: this.parseBoolean(row.active),
    };

    return {
      rowNumber,
      status,
      action,
      data,
      errors,
      warnings,
    };
  }

  /**
   * Process import job in background
   */
  private async processImportJob(
    jobId: string,
    options: ImportOptions,
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const startTime = Date.now();
    job.status = 'processing';

    try {
      for (let i = 0; i < job.rows.length; i++) {
        const row = job.rows[i];
        const rowNumber = i + 3;

        try {
          // Validate row
          const rowPreview = await this.validateSingleRow(
            row,
            rowNumber,
            options,
          );

          // Process based on action
          if (rowPreview.action === 'create' && rowPreview.status !== 'error') {
            await this.authorsService.create(rowPreview.data as CreateAuthors);
            job.summary.successful++;
            job.summary.created!++;
          } else if (rowPreview.action === 'update') {
            // TODO: Implement update logic
            job.summary.skipped++;
          } else {
            job.summary.skipped++;
          }

          job.summary.processed++;
        } catch (error) {
          job.summary.failed++;
          job.errors?.push({
            rowNumber,
            data: row,
            error: error instanceof Error ? error.message : String(error),
            code: (error as any)?.code,
          });

          if (!options.continueOnError) {
            throw error; // Stop processing
          }
        }

        // Update progress
        job.progress.current = i + 1;
        job.progress.percentage = Math.round(((i + 1) / job.rows.length) * 100);

        // Estimate completion
        const elapsed = Date.now() - startTime;
        const avgTimePerRow = elapsed / (i + 1);
        const remainingRows = job.rows.length - (i + 1);
        const estimatedMs = remainingRows * avgTimePerRow;
        job.estimatedCompletion = new Date(
          Date.now() + estimatedMs,
        ).toISOString();
      }

      // Mark as completed
      job.status = job.summary.failed > 0 ? 'partial' : 'completed';
      job.completedAt = new Date().toISOString();
      job.duration = Date.now() - startTime;
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.duration = Date.now() - startTime;
      console.error('Import job processing failed:', error);
    }
  }

  /**
   * Parse boolean from string value
   */
  private parseBoolean(value: any): boolean | undefined {
    if (value === null || value === undefined || value === '') return undefined;

    const str = String(value).toLowerCase().trim();
    if (['true', '1', 'yes', 'y'].includes(str)) return true;
    if (['false', '0', 'no', 'n'].includes(str)) return false;

    return true; // Default to true for invalid values
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    this.sessions.forEach((session, sessionId) => {
      if (now > session.expiresAt) {
        expiredSessions.push(sessionId);
      }
    });

    expiredSessions.forEach((sessionId) => {
      this.sessions.delete(sessionId);
    });

    if (expiredSessions.length > 0) {
      console.log(
        `Cleaned up ${expiredSessions.length} expired import sessions`,
      );
    }
  }
}
