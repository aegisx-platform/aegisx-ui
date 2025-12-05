import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AdjustmentReasonsController } from './controllers/adjustment-reasons.controller';
import { AdjustmentReasonsService } from './services/adjustment-reasons.service';
import { AdjustmentReasonsRepository } from './repositories/adjustment-reasons.repository';
import { adjustmentReasonsRoutes } from './routes/index';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * AdjustmentReasons Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function adjustmentReasonsDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'adjustmentReasons',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const adjustmentReasonsRepository = new AdjustmentReasonsRepository(
      (fastify as any).knex,
    );
    const adjustmentReasonsService = new AdjustmentReasonsService(
      adjustmentReasonsRepository,
    );

    // Controller instantiation with proper dependencies
    const adjustmentReasonsController = new AdjustmentReasonsController(
      adjustmentReasonsService,
    );

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('adjustmentReasonsService', adjustmentReasonsService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(adjustmentReasonsRoutes, {
      controller: adjustmentReasonsController,
      prefix: options.prefix || '/adjustment-reasons',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `AdjustmentReasons domain module registered successfully`,
      );
    });
  },
  {
    name: 'adjustmentReasons-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './schemas/adjustment-reasons.schemas';
export * from './types/adjustment-reasons.types';
export { AdjustmentReasonsRepository } from './repositories/adjustment-reasons.repository';
export { AdjustmentReasonsService } from './services/adjustment-reasons.service';
export { AdjustmentReasonsController } from './controllers/adjustment-reasons.controller';

// Re-export commonly used types for external use
export type {
  AdjustmentReasons,
  CreateAdjustmentReasons,
  UpdateAdjustmentReasons,
  AdjustmentReasonsIdParam,
  GetAdjustmentReasonsQuery,
  ListAdjustmentReasonsQuery,
} from './schemas/adjustment-reasons.schemas';

// Module name constant
export const MODULE_NAME = 'adjustmentReasons' as const;
