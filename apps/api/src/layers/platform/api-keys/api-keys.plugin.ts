import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { ApiKeysService } from './services/api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { registerApiKeysRoutes } from './api-keys.routes';
import { ActivityLogsService } from '../../core/audit/activity-logs/activity-logs.service';

/**
 * API Keys Plugin
 *
 * Fastify plugin that registers the complete API keys module.
 * Initializes services, controllers, and routes.
 *
 * Dependencies:
 * - knex-plugin: Database connection
 * - redis-plugin: Caching (optional)
 * - schemas-plugin: TypeBox schemas validation
 *
 * Provides:
 * - REST API endpoints for API key management
 * - Secure key generation and storage
 * - Key authentication and verification
 * - Usage tracking and statistics
 * - Audit logging for compliance
 *
 * Endpoints registered under /v1/platform/api-keys prefix:
 * - GET    /                - List user's API keys
 * - POST   /                - Create new API key
 * - GET    /:id             - Get single API key
 * - PUT    /:id             - Update API key
 * - DELETE /:id             - Revoke API key
 * - GET    /:id/usage       - Get usage statistics
 */
async function apiKeysPlugin(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // Verify required plugins are loaded
  if (!fastify.knex) {
    throw new Error('API keys plugin requires knex plugin');
  }

  // Initialize activity logs service (for audit logging)
  const activityLogsService = new ActivityLogsService(
    fastify.knex,
    fastify.redis || null,
  );

  // Initialize API keys service with dependencies
  // Service internally creates repository and crypto service
  const apiKeysService = new ApiKeysService(fastify.knex, activityLogsService);

  // Initialize controller
  const apiKeysController = new ApiKeysController(apiKeysService);

  // Register routes with prefix
  await fastify.register(
    async (instance) => {
      await registerApiKeysRoutes(instance, apiKeysController);
    },
    { prefix: '/v1/platform/api-keys' },
  );

  fastify.log.info('API keys module loaded successfully');
}

/**
 * Export plugin with fastify-plugin wrapper
 *
 * This ensures the plugin can access decorators from parent scope
 * and properly declares its dependencies.
 */
export const apiKeysModulePlugin = fp(apiKeysPlugin, {
  name: 'api-keys-module',
  dependencies: ['knex-plugin', 'redis-plugin', 'schemas-plugin'],
});
