import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { ActivityLogsRepository } from './activity-logs.repository';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { registerActivityLogsRoutes } from './activity-logs.routes';

/**
 * Activity Logs Plugin
 *
 * Fastify plugin that registers the complete activity logs module.
 * Initializes repository, service, controller, and routes.
 *
 * Dependencies:
 * - knex-plugin: Database connection
 * - redis-plugin: Caching (optional)
 * - schemas-plugin: TypeBox schemas validation
 * - auth-plugin: Authentication decorators
 *
 * Provides:
 * - REST API endpoints for activity logs management
 * - Activity log statistics with caching
 * - Data export capabilities (CSV/JSON)
 * - Cleanup functionality
 *
 * Endpoints registered under /activity-logs prefix:
 * - GET    /activity-logs          - List logs
 * - GET    /activity-logs/stats    - Get statistics
 * - GET    /activity-logs/:id      - Get single log
 * - DELETE /activity-logs/:id      - Delete log
 * - DELETE /activity-logs/cleanup  - Cleanup old logs
 * - GET    /activity-logs/export   - Export logs
 */
async function activityLogsPlugin(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // Verify required plugins are loaded
  if (!fastify.knex) {
    throw new Error('Activity logs plugin requires knex plugin');
  }

  // Initialize repository
  const repository = new ActivityLogsRepository(fastify.knex);

  // Initialize service (with optional Redis)
  const service = new ActivityLogsService(fastify.knex, fastify.redis || null);

  // Initialize controller
  const controller = new ActivityLogsController(service);

  // Register routes
  await registerActivityLogsRoutes(fastify, controller);

  fastify.log.info('Activity logs module loaded successfully');
}

/**
 * Export plugin with fastify-plugin wrapper
 *
 * This ensures the plugin can access decorators from parent scope
 * and properly declares its dependencies.
 */
export const activityLogsModulePlugin = fp(activityLogsPlugin, {
  name: 'activity-logs-module',
  dependencies: ['knex-plugin', 'schemas-plugin'],
  // redis-plugin is optional, not listed as required dependency
});
