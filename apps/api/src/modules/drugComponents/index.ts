import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DrugComponentsController } from './controllers/drug-components.controller';
import { DrugComponentsService } from './services/drug-components.service';
import { DrugComponentsRepository } from './repositories/drug-components.repository';
import { drugComponentsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * DrugComponents Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function drugComponentsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'drugComponents',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const drugComponentsRepository = new DrugComponentsRepository(
      (fastify as any).knex,
    );
    const drugComponentsService = new DrugComponentsService(
      drugComponentsRepository,
    );

    // Controller instantiation with proper dependencies
    const drugComponentsController = new DrugComponentsController(
      drugComponentsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('drugComponentsService', drugComponentsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(drugComponentsRoutes, {
      controller: drugComponentsController,
      prefix: options.prefix || '/drug-components',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`DrugComponents domain module registered successfully`);
    });
  },
  {
    name: 'drugComponents-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/drug-components.schemas';
export * from './types/drug-components.types';
export { DrugComponentsRepository } from './repositories/drug-components.repository';
export { DrugComponentsService } from './services/drug-components.service';
export { DrugComponentsController } from './controllers/drug-components.controller';

// Re-export commonly used types for external use
export type {
  DrugComponents,
  CreateDrugComponents,
  UpdateDrugComponents,
  DrugComponentsIdParam,
  GetDrugComponentsQuery,
  ListDrugComponentsQuery,
} from './schemas/drug-components.schemas';

// Module name constant
export const MODULE_NAME = 'drugComponents' as const;
