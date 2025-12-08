import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import budgetRequestsPlugin from './budgetRequests';

/**
 * Budget Domain Plugin
 *
 * Aggregates all modules within the Budget domain.
 * Route prefix: /inventory/budget
 */
export default fp(
  async function budgetDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    const prefix = options.prefix || '/inventory/budget';

    // Register all domain modules
    await fastify.register(budgetRequestsPlugin, {
      ...options,
      prefix: `${prefix}/budget-requests`,
    });

    fastify.addHook('onReady', async () => {
      fastify.log.info(`Budget domain loaded with 1 modules at ${prefix}`);
    });
  },
  {
    name: 'budget-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Note: Individual module exports are accessed through their respective index.ts files
// Example: import { DrugsService } from './drugs';
//          import { DrugGenericsService } from './drugGenerics';
