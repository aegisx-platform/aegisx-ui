/**
 * Error Logs Module
 *
 * Complete error logs management module for the Core audit layer.
 * Provides REST API endpoints, statistics, and export capabilities.
 *
 * @module error-logs
 */

// Export plugin (main export)
export { errorLogsModulePlugin } from './error-logs.plugin';

// Export schemas and types
export * from './error-logs.schemas';

// Export service, repository, controller (for testing/advanced usage)
export { ErrorLogsRepository } from './error-logs.repository';
export { ErrorLogsService } from './error-logs.service';
export { ErrorLogsController } from './error-logs.controller';
