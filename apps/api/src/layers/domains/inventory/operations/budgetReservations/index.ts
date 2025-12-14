import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BudgetReservationsController } from './budget-reservations.controller';
import { BudgetReservationsService } from './budget-reservations.service';
import { BudgetReservationsRepository } from './budget-reservations.repository';
import { budgetReservationsRoutes } from './budget-reservations.route';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * BudgetReservations Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function budgetReservationsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'budgetReservations',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const budgetReservationsRepository = new BudgetReservationsRepository(
      (fastify as any).knex,
    );
    const budgetReservationsService = new BudgetReservationsService(
      budgetReservationsRepository,
    );

    // Controller instantiation with proper dependencies
    const budgetReservationsController = new BudgetReservationsController(
      budgetReservationsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('budgetReservationsService', budgetReservationsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(budgetReservationsRoutes, {
      controller: budgetReservationsController,
      prefix: options.prefix || '/inventory/operations/budget-reservations',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `BudgetReservations domain module registered successfully`,
      );
    });
  },
  {
    name: 'budgetReservations-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './budget-reservations.schemas';
export * from './budget-reservations.types';
export { BudgetReservationsRepository } from './budget-reservations.repository';
export { BudgetReservationsService } from './budget-reservations.service';
export { BudgetReservationsController } from './budget-reservations.controller';

// Re-export commonly used types for external use
export type {
  BudgetReservations,
  CreateBudgetReservations,
  UpdateBudgetReservations,
  BudgetReservationsIdParam,
  GetBudgetReservationsQuery,
  ListBudgetReservationsQuery,
} from './budget-reservations.schemas';

// Module name constant
export const MODULE_NAME = 'budgetReservations' as const;
