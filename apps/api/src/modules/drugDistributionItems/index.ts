import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DrugDistributionItemsController } from './controllers/drug-distribution-items.controller';
import { DrugDistributionItemsService } from './services/drug-distribution-items.service';
import { DrugDistributionItemsRepository } from './repositories/drug-distribution-items.repository';
import { drugDistributionItemsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * DrugDistributionItems Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function drugDistributionItemsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'drugDistributionItems',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const drugDistributionItemsRepository = new DrugDistributionItemsRepository(
      (fastify as any).knex,
    );
    const drugDistributionItemsService = new DrugDistributionItemsService(
      drugDistributionItemsRepository,
    );

    // Controller instantiation with proper dependencies
    const drugDistributionItemsController = new DrugDistributionItemsController(
      drugDistributionItemsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('drugDistributionItemsService', drugDistributionItemsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(drugDistributionItemsRoutes, {
      controller: drugDistributionItemsController,
      prefix: options.prefix || '/drug-distribution-items',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `DrugDistributionItems domain module registered successfully`,
      );
    });
  },
  {
    name: 'drugDistributionItems-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/drug-distribution-items.schemas';
export * from './types/drug-distribution-items.types';
export { DrugDistributionItemsRepository } from './repositories/drug-distribution-items.repository';
export { DrugDistributionItemsService } from './services/drug-distribution-items.service';
export { DrugDistributionItemsController } from './controllers/drug-distribution-items.controller';

// Re-export commonly used types for external use
export type {
  DrugDistributionItems,
  CreateDrugDistributionItems,
  UpdateDrugDistributionItems,
  DrugDistributionItemsIdParam,
  GetDrugDistributionItemsQuery,
  ListDrugDistributionItemsQuery,
} from './schemas/drug-distribution-items.schemas';

// Module name constant
export const MODULE_NAME = 'drugDistributionItems' as const;
