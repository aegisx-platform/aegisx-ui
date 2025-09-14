/**
 * Activity Logging Plugin
 * 
 * Comprehensive activity logging middleware for Fastify that automatically tracks
 * user actions across the entire application.
 * 
 * Features:
 * - Automatic activity logging for authenticated requests
 * - Configurable per route (enable/disable, custom actions)
 * - Multiple severity levels (info, warning, error, critical)
 * - Request/response context capture
 * - Batch logging for performance
 * - Error resilience - never breaks main request flow
 * - GDPR/audit compliance helpers
 * - Extensive utility functions for common scenarios
 * 
 * Usage:
 * ```typescript
 * // Register plugin
 * await fastify.register(activityLoggingPlugin, {
 *   config: {
 *     enabled: true,
 *     autoLogErrors: true,
 *     enableBatching: false
 *   }
 * });
 * 
 * // Use in routes
 * fastify.post('/api/auth/login', {
 *   schema: { ... },
 *   activityLog: fastify.activityUtils.loginAttempt()
 * }, loginHandler);
 * 
 * // Or with utility
 * fastify.post('/api/profile', 
 *   fastify.withActivityLogging(
 *     fastify.activityUtils.profileUpdate(),
 *     { schema: { ... }, handler: updateProfileHandler }
 *   )
 * );
 * 
 * // Manual logging
 * await fastify.logActivity(
 *   userId,
 *   'custom_action',
 *   'Custom activity occurred',
 *   request,
 *   { severity: 'info', metadata: { customData: true } }
 * );
 * ```
 */

// Main plugin export
export { default as activityLoggingPlugin } from './activity-logging.plugin';

// Configuration types and defaults
export {
  ActivityLogConfig,
  ActivityLogPluginConfig,
  defaultPluginConfig,
  defaultRouteConfig,
  presetConfigs,
  actionMappings,
  getActionForRequest,
  getSeverityFromStatus,
  generateDescription,
} from './activity-config';

// Utility functions
export {
  ActivityUtils,
  mergeActivityConfigs,
  timeBasedConfig,
} from './activity-utils';

// Middleware class (for advanced usage)
export { ActivityMiddleware } from './activity-middleware';

// Import for use in ActivityLogging object
import { ActivityUtils, mergeActivityConfigs, timeBasedConfig } from './activity-utils';

// Quick access to common configurations
export const ActivityLogging = {
  // Quick config creators
  auth: ActivityUtils.auth,
  profile: ActivityUtils.profile,
  security: ActivityUtils.security,
  admin: ActivityUtils.admin,
  api: ActivityUtils.api,
  errorOnly: ActivityUtils.errorOnly,
  custom: ActivityUtils.custom,
  
  // Specific activity types
  loginAttempt: ActivityUtils.loginAttempt,
  loginSuccess: ActivityUtils.loginSuccess,
  loginFailure: ActivityUtils.loginFailure,
  logout: ActivityUtils.logout,
  profileUpdate: ActivityUtils.profileUpdate,
  passwordChange: ActivityUtils.passwordChange,
  avatarUpload: ActivityUtils.avatarUpload,
  preferencesUpdate: ActivityUtils.preferencesUpdate,
  themeChange: ActivityUtils.themeChange,
  suspiciousActivity: ActivityUtils.suspiciousActivity,
  apiError: ActivityUtils.apiError,
  dataAccess: ActivityUtils.dataAccess,
  dataExport: ActivityUtils.dataExport,
  accountDeletion: ActivityUtils.accountDeletion,
  conditional: ActivityUtils.conditional,
  rateLimitHit: ActivityUtils.rateLimitHit,
  bulkOperation: ActivityUtils.bulkOperation,
  
  // Utilities
  merge: mergeActivityConfigs,
  timeBased: timeBasedConfig,
} as const;