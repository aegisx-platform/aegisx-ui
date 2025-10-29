import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { attachmentRoutes } from './attachment.routes';

/**
 * Attachment Plugin
 *
 * Generic file attachment system that works with ANY entity type.
 * Just add entity configuration to attachment-config.ts - no code changes needed!
 *
 * Features:
 * - Polymorphic file attachments (one table for all entities)
 * - Config-driven (add new entity types via config)
 * - RESTful API
 * - TypeBox validation
 * - OpenAPI documentation
 * - Works with any client (Angular, React, mobile, external systems)
 */
export const attachmentPlugin: FastifyPluginAsync = fp(
  async (fastify) => {
    // Register routes under /api/attachments
    await fastify.register(attachmentRoutes, { prefix: '/attachments' });

    fastify.log.info('✅ Attachment plugin registered');
  },
  {
    name: 'attachment-plugin',
    dependencies: ['knex-plugin', 'auth-plugin'],
  },
);
