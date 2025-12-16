import { BaseAuditController } from '../base/base.controller';
import { ActivityLogsService } from './activity-logs.service';
import {
  ActivityLog,
  ActivityQuery,
  ActivityStats,
} from './activity-logs.schemas';

/**
 * ActivityLogsController
 *
 * REST API controller for activity logs.
 * Extends BaseAuditController to inherit all CRUD endpoints.
 *
 * Inherited Endpoints:
 * - GET    /           - List activity logs with pagination and filters
 * - GET    /:id        - Get single activity log by ID
 * - DELETE /:id        - Delete single activity log
 * - DELETE /cleanup    - Cleanup old activity logs
 * - GET    /stats      - Get activity log statistics
 * - GET    /export     - Export activity logs to CSV/JSON
 *
 * All endpoints require authentication and appropriate permissions.
 *
 * Usage in routes:
 * ```typescript
 * const controller = new ActivityLogsController(service);
 * fastify.get('/', controller.findAll.bind(controller));
 * fastify.get('/stats', controller.getStats.bind(controller));
 * fastify.get('/:id', controller.findById.bind(controller));
 * // ... etc
 * ```
 */
export class ActivityLogsController extends BaseAuditController<
  ActivityLog,
  ActivityQuery,
  ActivityStats,
  ActivityLogsService
> {
  constructor(service: ActivityLogsService) {
    super(service, 'Activity log');
  }

  /**
   * Get export filename for CSV/JSON exports
   *
   * @returns Filename prefix for exported files
   */
  protected getExportFilename(): string {
    return 'activity-logs';
  }
}
