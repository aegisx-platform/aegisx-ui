import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DrugReturnsController } from './controllers/drug-returns.controller';
import { DrugReturnsService } from './services/drug-returns.service';
import { DrugReturnsRepository } from './repositories/drug-returns.repository';
import { drugReturnsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * DrugReturns Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function drugReturnsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'drugReturns',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const drugReturnsRepository = new DrugReturnsRepository(
      (fastify as any).knex,
    );
    const drugReturnsService = new DrugReturnsService(drugReturnsRepository);

    // Controller instantiation with proper dependencies
    const drugReturnsController = new DrugReturnsController(drugReturnsService);

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('drugReturnsService', drugReturnsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(drugReturnsRoutes, {
      controller: drugReturnsController,
      prefix: options.prefix || '/drug-returns',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`DrugReturns domain module registered successfully`);
    });
  },
  {
    name: 'drugReturns-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/drug-returns.schemas';
export * from './types/drug-returns.types';
export { DrugReturnsRepository } from './repositories/drug-returns.repository';
export { DrugReturnsService } from './services/drug-returns.service';
export { DrugReturnsController } from './controllers/drug-returns.controller';

// Re-export commonly used types for external use
export type {
  DrugReturns,
  CreateDrugReturns,
  UpdateDrugReturns,
  DrugReturnsIdParam,
  GetDrugReturnsQuery,
  ListDrugReturnsQuery,
} from './schemas/drug-returns.schemas';

// Module name constant
export const MODULE_NAME = 'drugReturns' as const;
