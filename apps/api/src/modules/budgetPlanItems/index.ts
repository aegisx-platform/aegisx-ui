import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetPlanItemsController } from './controllers/budget-plan-items.controller';
import { BudgetPlanItemsService } from './services/budget-plan-items.service';
import { BudgetPlanItemsRepository } from './repositories/budget-plan-items.repository';
import { budgetPlanItemsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetPlanItems Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetPlanItemsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetPlanItems',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetPlanItemsRepository = new BudgetPlanItemsRepository(
      (fastify as any).knex,
    );
    const budgetPlanItemsService = new BudgetPlanItemsService(
      budgetPlanItemsRepository,
    );

    // Controller instantiation with proper dependencies
    const budgetPlanItemsController = new BudgetPlanItemsController(
      budgetPlanItemsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetPlanItemsService', budgetPlanItemsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetPlanItemsRoutes, {
      controller: budgetPlanItemsController,
      prefix: options.prefix || '/budget-plan-items',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`BudgetPlanItems domain module registered successfully`);
    });
  },
  {
    name: 'budgetPlanItems-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/budget-plan-items.schemas';
export * from './types/budget-plan-items.types';
export { BudgetPlanItemsRepository } from './repositories/budget-plan-items.repository';
export { BudgetPlanItemsService } from './services/budget-plan-items.service';
export { BudgetPlanItemsController } from './controllers/budget-plan-items.controller';

// Re-export commonly used types for external use
export type {
  BudgetPlanItems,
  CreateBudgetPlanItems,
  UpdateBudgetPlanItems,
  BudgetPlanItemsIdParam,
  GetBudgetPlanItemsQuery,
  ListBudgetPlanItemsQuery,
} from './schemas/budget-plan-items.schemas';

// Module name constant
export const MODULE_NAME = 'budgetPlanItems' as const;
