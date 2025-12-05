import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetPlansController } from './controllers/budget-plans.controller';
import { BudgetPlansService } from './services/budget-plans.service';
import { BudgetPlansRepository } from './repositories/budget-plans.repository';
import { budgetPlansRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetPlans Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetPlansDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetPlans',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetPlansRepository = new BudgetPlansRepository(
      (fastify as any).knex,
    );
    const budgetPlansService = new BudgetPlansService(budgetPlansRepository);

    // Controller instantiation with proper dependencies
    const budgetPlansController = new BudgetPlansController(budgetPlansService);

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetPlansService', budgetPlansService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetPlansRoutes, {
      controller: budgetPlansController,
      prefix: options.prefix || '/budget-plans',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`BudgetPlans domain module registered successfully`);
    });
  },
  {
    name: 'budgetPlans-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/budget-plans.schemas';
export * from './types/budget-plans.types';
export { BudgetPlansRepository } from './repositories/budget-plans.repository';
export { BudgetPlansService } from './services/budget-plans.service';
export { BudgetPlansController } from './controllers/budget-plans.controller';

// Re-export commonly used types for external use
export type {
  BudgetPlans,
  CreateBudgetPlans,
  UpdateBudgetPlans,
  BudgetPlansIdParam,
  GetBudgetPlansQuery,
  ListBudgetPlansQuery,
} from './schemas/budget-plans.schemas';

// Module name constant
export const MODULE_NAME = 'budgetPlans' as const;
