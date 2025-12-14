import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetRequestItemsController } from './budget-request-items.controller';
import { BudgetRequestItemsService } from './budget-request-items.service';
import { BudgetRequestItemsRepository } from './budget-request-items.repository';
import { budgetRequestItemsRoutes } from './budget-request-items.route';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetRequestItems Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetRequestItemsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetRequestItems',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetRequestItemsRepository = new BudgetRequestItemsRepository(
      (fastify as any).knex,
    );
    const budgetRequestItemsService = new BudgetRequestItemsService(
      budgetRequestItemsRepository,
    );

    // Controller instantiation with proper dependencies
    const budgetRequestItemsController = new BudgetRequestItemsController(
      budgetRequestItemsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetRequestItemsService', budgetRequestItemsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetRequestItemsRoutes, {
      controller: budgetRequestItemsController,
      prefix: options.prefix || '/inventory/budget/budget-request-items',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `BudgetRequestItems domain module registered successfully`,
      );
    });
  },
  {
    name: 'budgetRequestItems-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './budget-request-items.schemas';
export * from './budget-request-items.types';
export { BudgetRequestItemsRepository } from './budget-request-items.repository';
export { BudgetRequestItemsService } from './budget-request-items.service';
export { BudgetRequestItemsController } from './budget-request-items.controller';

// Re-export commonly used types for external use
export type {
  BudgetRequestItems,
  CreateBudgetRequestItems,
  UpdateBudgetRequestItems,
  BudgetRequestItemsIdParam,
  GetBudgetRequestItemsQuery,
  ListBudgetRequestItemsQuery,
} from './budget-request-items.schemas';

// Module name constant
export const MODULE_NAME = 'budgetRequestItems' as const;
