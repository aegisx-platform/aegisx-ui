import { BaseAuditController } from '../base/base.controller';
import { ErrorLogsService } from './error-logs.service';
import { ErrorLog, ErrorQuery, ErrorStats } from './error-logs.schemas';

/**
 * ErrorLogsController
 *
 * REST API controller for error logs.
 * Extends BaseAuditController to inherit all CRUD endpoints.
 *
 * Inherited Endpoints:
 * - GET    /           - List error logs with pagination and filters
 * - GET    /:id        - Get single error log by ID
 * - DELETE /:id        - Delete single error log
 * - DELETE /cleanup    - Cleanup old error logs
 * - GET    /stats      - Get error log statistics
 * - GET    /export     - Export error logs to CSV/JSON
 *
 * All endpoints require authentication and appropriate permissions.
 *
 * Usage in routes:
 * ```typescript
 * const controller = new ErrorLogsController(service);
 * fastify.get('/', controller.findAll.bind(controller));
 * fastify.get('/stats', controller.getStats.bind(controller));
 * fastify.get('/:id', controller.findById.bind(controller));
 * // ... etc
 * ```
 */
export class ErrorLogsController extends BaseAuditController<
  ErrorLog,
  ErrorQuery,
  ErrorStats,
  ErrorLogsService
> {
  constructor(service: ErrorLogsService) {
    super(service, 'Error log');
  }

  /**
   * Get export filename for CSV/JSON exports
   *
   * @returns Filename prefix for exported files
   */
  protected getExportFilename(): string {
    return 'error-logs';
  }
}
