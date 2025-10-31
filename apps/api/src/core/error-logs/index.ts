// Export the plugin as default
export { default as errorLogsPlugin } from './error-logs.plugin';

// Export request/response types from schemas
export type {
  ErrorLog,
  ErrorLogsQuery,
  ErrorStats,
  CleanupQuery,
  ErrorLogResponse,
  ErrorLogsListResponse,
  ErrorStatsResponse,
  CleanupResponse,
} from './error-logs.schemas';

// Export service classes for external use
export { ErrorLogsRepository } from './error-logs.repository';
export { ErrorLogsService } from './error-logs.service';
export { ErrorLogsController } from './error-logs.controller';
