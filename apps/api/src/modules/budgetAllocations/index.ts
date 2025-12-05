import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetAllocationsController } from './controllers/budget-allocations.controller';
import { BudgetAllocationsService } from './services/budget-allocations.service';
import { BudgetAllocationsRepository } from './repositories/budget-allocations.repository';
import { budgetAllocationsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetAllocations Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetAllocationsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetAllocations',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetAllocationsRepository = new BudgetAllocationsRepository(
      (fastify as any).knex,
    );
    const budgetAllocationsService = new BudgetAllocationsService(
      budgetAllocationsRepository,
    );

    // Controller instantiation with proper dependencies
    const budgetAllocationsController = new BudgetAllocationsController(
      budgetAllocationsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetAllocationsService', budgetAllocationsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetAllocationsRoutes, {
      controller: budgetAllocationsController,
      prefix: options.prefix || '/budget-allocations',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `BudgetAllocations domain module registered successfully`,
      );
    });
  },
  {
    name: 'budgetAllocations-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/budget-allocations.schemas';
export * from './types/budget-allocations.types';
export { BudgetAllocationsRepository } from './repositories/budget-allocations.repository';
export { BudgetAllocationsService } from './services/budget-allocations.service';
export { BudgetAllocationsController } from './controllers/budget-allocations.controller';

// Re-export commonly used types for external use
export type {
  BudgetAllocations,
  CreateBudgetAllocations,
  UpdateBudgetAllocations,
  BudgetAllocationsIdParam,
  GetBudgetAllocationsQuery,
  ListBudgetAllocationsQuery,
} from './schemas/budget-allocations.schemas';

// Module name constant
export const MODULE_NAME = 'budgetAllocations' as const;
