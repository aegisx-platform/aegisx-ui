import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { UserRolesController } from './controllers/userRoles.controller';
import { UserRolesService } from './services/userRoles.service';
import { UserRolesRepository } from './repositories/userRoles.repository';
import { userRolesRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * UserRoles Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function userRolesDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'userRoles',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const userRolesRepository = new UserRolesRepository((fastify as any).knex);
    const userRolesService = new UserRolesService(userRolesRepository);
    const userRolesController = new UserRolesController(userRolesService);

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('userRolesService', userRolesService);

    // Register routes with controller dependency
    await fastify.register(userRolesRoutes, {
      controller: userRolesController,
      prefix: options.prefix || '/userRoles',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`UserRoles domain module registered successfully`);
    });
  },
  {
    name: 'userRoles-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/userRoles.schemas';
export * from './types/userRoles.types';
export { UserRolesRepository } from './repositories/userRoles.repository';
export { UserRolesService } from './services/userRoles.service';
export { UserRolesController } from './controllers/userRoles.controller';

// Re-export commonly used types for external use
export type {
  UserRoles,
  CreateUserRoles,
  UpdateUserRoles,
  UserRolesIdParam,
  GetUserRolesQuery,
  ListUserRolesQuery,
} from './schemas/userRoles.schemas';

// Module name constant
export const MODULE_NAME = 'userRoles' as const;
