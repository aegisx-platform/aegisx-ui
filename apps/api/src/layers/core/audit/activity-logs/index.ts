/**
 * Activity Logs Module
 *
 * Complete activity logs management module for the Core audit layer.
 * Provides REST API endpoints, statistics, and export capabilities.
 *
 * @module activity-logs
 */

// Export plugin (main export)
export { activityLogsModulePlugin } from './activity-logs.plugin';

// Export schemas and types
export * from './activity-logs.schemas';

// Export service, repository, controller (for testing/advanced usage)
export { ActivityLogsRepository } from './activity-logs.repository';
export { ActivityLogsService } from './activity-logs.service';
export { ActivityLogsController } from './activity-logs.controller';
