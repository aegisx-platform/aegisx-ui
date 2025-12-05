import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetTypesController } from './controllers/budget-types.controller';
import { BudgetTypesService } from './services/budget-types.service';
import { BudgetTypesRepository } from './repositories/budget-types.repository';
import { budgetTypesRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetTypes Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetTypesDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetTypes',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetTypesRepository = new BudgetTypesRepository(
      (fastify as any).knex,
    );
    const budgetTypesService = new BudgetTypesService(budgetTypesRepository);

    // Controller instantiation with proper dependencies
    const budgetTypesController = new BudgetTypesController(budgetTypesService);

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetTypesService', budgetTypesService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetTypesRoutes, {
      controller: budgetTypesController,
      prefix: options.prefix || '/budget-types',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`BudgetTypes domain module registered successfully`);
    });
  },
  {
    name: 'budgetTypes-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/budget-types.schemas';
export * from './types/budget-types.types';
export { BudgetTypesRepository } from './repositories/budget-types.repository';
export { BudgetTypesService } from './services/budget-types.service';
export { BudgetTypesController } from './controllers/budget-types.controller';

// Re-export commonly used types for external use
export type {
  BudgetTypes,
  CreateBudgetTypes,
  UpdateBudgetTypes,
  BudgetTypesIdParam,
  GetBudgetTypesQuery,
  ListBudgetTypesQuery,
} from './schemas/budget-types.schemas';

// Module name constant
export const MODULE_NAME = 'budgetTypes' as const;
