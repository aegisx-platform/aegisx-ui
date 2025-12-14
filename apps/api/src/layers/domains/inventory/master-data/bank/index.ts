import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { BankRepository } from './bank.repository';
import { bankRoutes } from './bank.route';

// Note: FastifyInstance eventService type is declared in websocket.plugin.ts

/**
 * Bank Domain Plugin
 *
 * Following Fastify best practices:
 * - Service instantiation with proper dependency injection
 * - Encapsulation through plugin scoping
 * - Lifecycle management with hooks
 * - Schema registration through Fastify's schema registry
 */
export default fp(
  async function bankDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    // Register schemas using Fastify's built-in schema registry
    if (fastify.hasDecorator('schemaRegistry')) {
      (fastify as any).schemaRegistry.registerModuleSchemas(
        'bank',
        {}, // schemas will be imported automatically
      );
    }

    // Service instantiation following Fastify DI pattern
    // Dependencies are accessed from Fastify instance decorators
    const bankRepository = new BankRepository((fastify as any).knex);
    const bankService = new BankService(bankRepository);

    // Controller instantiation with proper dependencies
    const bankController = new BankController(bankService);

    // Optional: Decorate Fastify instance with service for cross-plugin access
    // fastify.decorate('bankService', bankService);

    // Register main CRUD routes (includes dynamic /:id route)
    await fastify.register(bankRoutes, {
      controller: bankController,
      prefix: options.prefix || '/inventory/master-data/bank',
    });

    // Lifecycle hooks for monitoring
    fastify.addHook('onReady', async () => {
      fastify.log.info(`Bank domain module registered successfully`);
    });
  },
  {
    name: 'bank-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Re-exports for external consumers
export * from './bank.schemas';
export * from './bank.types';
export { BankRepository } from './bank.repository';
export { BankService } from './bank.service';
export { BankController } from './bank.controller';

// Re-export commonly used types for external use
export type {
  Bank,
  CreateBank,
  UpdateBank,
  BankIdParam,
  GetBankQuery,
  ListBankQuery,
} from './bank.schemas';

// Module name constant
export const MODULE_NAME = 'bank' as const;
