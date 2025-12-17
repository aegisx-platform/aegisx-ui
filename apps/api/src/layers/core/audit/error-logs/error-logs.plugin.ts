import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { ErrorLogsRepository } from './error-logs.repository';
import { ErrorLogsService } from './error-logs.service';
import { ErrorLogsController } from './error-logs.controller';
import { registerErrorLogsRoutes } from './error-logs.routes';

/**
 * Error Logs Plugin
 *
 * Fastify plugin that registers the complete error logs module.
 * Initializes repository, service, controller, and routes.
 *
 * Dependencies:
 * - knex-plugin: Database connection
 * - redis-plugin: Caching (optional)
 * - schemas-plugin: TypeBox schemas validation
 * - auth-plugin: Authentication decorators
 *
 * Provides:
 * - REST API endpoints for error logs management
 * - Error log statistics with caching
 * - Data export capabilities (CSV/JSON)
 * - Cleanup functionality
 *
 * Endpoints registered under /error-logs prefix:
 * - GET    /error-logs          - List logs
 * - GET    /error-logs/stats    - Get statistics
 * - GET    /error-logs/:id      - Get single log
 * - DELETE /error-logs/:id      - Delete log
 * - DELETE /error-logs/cleanup  - Cleanup old logs
 * - GET    /error-logs/export   - Export logs
 */
async function errorLogsPlugin(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // Verify required plugins are loaded
  if (!fastify.knex) {
    throw new Error('Error logs plugin requires knex plugin');
  }

  // Initialize repository
  const repository = new ErrorLogsRepository(fastify.knex);

  // Initialize service (with optional Redis)
  const service = new ErrorLogsService(fastify.knex, fastify.redis || null);

  // Initialize controller
  const controller = new ErrorLogsController(service);

  // Register routes with /error-logs prefix
  await fastify.register(
    async (instance) => {
      await registerErrorLogsRoutes(instance, controller);
    },
    { prefix: '/error-logs' },
  );

  fastify.log.info('Error logs module loaded successfully');
}

/**
 * Export plugin with fastify-plugin wrapper
 *
 * This ensures the plugin can access decorators from parent scope
 * and properly declares its dependencies.
 */
export const errorLogsModulePlugin = fp(errorLogsPlugin, {
  name: 'error-logs-module',
  dependencies: ['knex-plugin', 'schemas-plugin'],
  // redis-plugin is optional, not listed as required dependency
});
