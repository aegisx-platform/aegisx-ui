import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DrugDistributionsController } from './controllers/drug-distributions.controller';
import { DrugDistributionsService } from './services/drug-distributions.service';
import { DrugDistributionsRepository } from './repositories/drug-distributions.repository';
import { drugDistributionsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * DrugDistributions Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function drugDistributionsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'drugDistributions',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const drugDistributionsRepository = new DrugDistributionsRepository(
      (fastify as any).knex,
    );
    const drugDistributionsService = new DrugDistributionsService(
      drugDistributionsRepository,
    );

    // Controller instantiation with proper dependencies
    const drugDistributionsController = new DrugDistributionsController(
      drugDistributionsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('drugDistributionsService', drugDistributionsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(drugDistributionsRoutes, {
      controller: drugDistributionsController,
      prefix: options.prefix || '/drug-distributions',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `DrugDistributions domain module registered successfully`,
      );
    });
  },
  {
    name: 'drugDistributions-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/drug-distributions.schemas';
export * from './types/drug-distributions.types';
export { DrugDistributionsRepository } from './repositories/drug-distributions.repository';
export { DrugDistributionsService } from './services/drug-distributions.service';
export { DrugDistributionsController } from './controllers/drug-distributions.controller';

// Re-export commonly used types for external use
export type {
  DrugDistributions,
  CreateDrugDistributions,
  UpdateDrugDistributions,
  DrugDistributionsIdParam,
  GetDrugDistributionsQuery,
  ListDrugDistributionsQuery,
} from './schemas/drug-distributions.schemas';

// Module name constant
export const MODULE_NAME = 'drugDistributions' as const;
