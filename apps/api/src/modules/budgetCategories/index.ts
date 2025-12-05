import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetCategoriesController } from './controllers/budget-categories.controller';
import { BudgetCategoriesService } from './services/budget-categories.service';
import { BudgetCategoriesRepository } from './repositories/budget-categories.repository';
import { budgetCategoriesRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetCategories Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetCategoriesDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetCategories',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetCategoriesRepository = new BudgetCategoriesRepository(
      (fastify as any).knex,
    );
    const budgetCategoriesService = new BudgetCategoriesService(
      budgetCategoriesRepository,
    );

    // Controller instantiation with proper dependencies
    const budgetCategoriesController = new BudgetCategoriesController(
      budgetCategoriesService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetCategoriesService', budgetCategoriesService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetCategoriesRoutes, {
      controller: budgetCategoriesController,
      prefix: options.prefix || '/budget-categories',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `BudgetCategories domain module registered successfully`,
      );
    });
  },
  {
    name: 'budgetCategories-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/budget-categories.schemas';
export * from './types/budget-categories.types';
export { BudgetCategoriesRepository } from './repositories/budget-categories.repository';
export { BudgetCategoriesService } from './services/budget-categories.service';
export { BudgetCategoriesController } from './controllers/budget-categories.controller';

// Re-export commonly used types for external use
export type {
  BudgetCategories,
  CreateBudgetCategories,
  UpdateBudgetCategories,
  BudgetCategoriesIdParam,
  GetBudgetCategoriesQuery,
  ListBudgetCategoriesQuery,
} from './schemas/budget-categories.schemas';

// Module name constant
export const MODULE_NAME = 'budgetCategories' as const;
