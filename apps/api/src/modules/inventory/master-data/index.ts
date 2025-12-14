import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import drugsPlugin from './drugs';
import locationsPlugin from './locations';
import companiesPlugin from './companies';
import drugGenericsPlugin from './drugGenerics';
import dosageFormsPlugin from './dosageForms';
import drugUnitsPlugin from './drugUnits';
import budgetTypesPlugin from './budgetTypes';
import budgetCategoriesPlugin from './budgetCategories';
import contractsPlugin from './contracts';
import contractItemsPlugin from './contractItems';
import bankPlugin from './bank';
import hospitalsPlugin from './hospitals';
import returnActionsPlugin from './returnActions';
import budgetsPlugin from './budgets';
import drugComponentsPlugin from './drugComponents';
import drugFocusListsPlugin from './drugFocusLists';
import drugPackRatiosPlugin from './drugPackRatios';
import adjustmentReasonsPlugin from './adjustmentReasons';

/**
 * Master-data Domain Plugin
 *
 * Aggregates all modules within the Master-data domain.
 * Route prefix: /inventory/master-data
 */
export default fp(
  async function masterDataDomainPlugin(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
  ) {
    const prefix = options.prefix || '/inventory/master-data';

    // Register all domain modules
    await fastify.register(drugsPlugin, {
      ...options,
      prefix: `${prefix}/drugs`,
    });
    await fastify.register(locationsPlugin, {
      ...options,
      prefix: `${prefix}/locations`,
    });
    await fastify.register(companiesPlugin, {
      ...options,
      prefix: `${prefix}/companies`,
    });
    await fastify.register(drugGenericsPlugin, {
      ...options,
      prefix: `${prefix}/drug-generics`,
    });
    await fastify.register(dosageFormsPlugin, {
      ...options,
      prefix: `${prefix}/dosage-forms`,
    });
    await fastify.register(drugUnitsPlugin, {
      ...options,
      prefix: `${prefix}/drug-units`,
    });
    await fastify.register(budgetTypesPlugin, {
      ...options,
      prefix: `${prefix}/budget-types`,
    });
    await fastify.register(budgetCategoriesPlugin, {
      ...options,
      prefix: `${prefix}/budget-categories`,
    });
    await fastify.register(contractsPlugin, {
      ...options,
      prefix: `${prefix}/contracts`,
    });
    await fastify.register(contractItemsPlugin, {
      ...options,
      prefix: `${prefix}/contract-items`,
    });
    await fastify.register(bankPlugin, {
      ...options,
      prefix: `${prefix}/bank`,
    });
    await fastify.register(hospitalsPlugin, {
      ...options,
      prefix: `${prefix}/hospitals`,
    });
    await fastify.register(returnActionsPlugin, {
      ...options,
      prefix: `${prefix}/return-actions`,
    });
    await fastify.register(budgetsPlugin, {
      ...options,
      prefix: `${prefix}/budgets`,
    });
    await fastify.register(drugComponentsPlugin, {
      ...options,
      prefix: `${prefix}/drug-components`,
    });
    await fastify.register(drugFocusListsPlugin, {
      ...options,
      prefix: `${prefix}/drug-focus-lists`,
    });
    await fastify.register(drugPackRatiosPlugin, {
      ...options,
      prefix: `${prefix}/drug-pack-ratios`,
    });
    await fastify.register(adjustmentReasonsPlugin, {
      ...options,
      prefix: `${prefix}/adjustment-reasons`,
    });

    fastify.addHook('onReady', async () => {
      fastify.log.info(
        `Master-data domain loaded with 18 modules at ${prefix}`,
      );
    });
  },
  {
    name: 'masterData-domain-plugin',
    dependencies: ['knex-plugin'],
  },
);

// Note: Individual module exports are accessed through their respective index.ts files
// Example: import { DrugsService } from './drugs';
//          import { DrugGenericsService } from './drugGenerics';
