import { LauncherApp } from '@aegisx/ui';

/**
 * Budget Section Configuration
 *
 * This file contains the configuration for Budget modules
 * displayed in the ax-launcher component.
 *
 * NOTE: CRUD generator will auto-register new modules here when using --section budget
 */

/**
 * Section Items
 *
 * Each item represents a CRUD module accessible from the launcher.
 * Generator will auto-add entries when using: --shell inventory --section budget
 *
 * Available colors: 'pink', 'peach', 'mint', 'blue', 'yellow', 'lavender', 'cyan', 'rose', 'neutral', 'white'
 */
export const SECTION_ITEMS: LauncherApp[] = [
  // === AUTO-GENERATED ENTRIES START ===
  {
    id: 'budget-reservations',
    name: 'Budget Reservations',
    description: 'Manage budget reservations data',
    icon: 'description',
    route: '/inventory/budget/budget-reservations',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-plan-items',
    name: 'Budget Plan Items',
    description: 'Manage budget plan items data',
    icon: 'category',
    route: '/inventory/budget/budget-plan-items',
    color: 'cyan',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-plans',
    name: 'Budget Plans',
    description: 'Manage budget plans data',
    icon: 'description',
    route: '/inventory/budget/budget-plans',
    color: 'blue',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-allocations',
    name: 'Budget Allocations',
    description: 'Manage budget allocations data',
    icon: 'location_on',
    route: '/inventory/budget/budget-allocations',
    color: 'pink',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budgets',
    name: 'Budgets',
    description: 'Manage budgets data',
    icon: 'description',
    route: '/inventory/budget/budgets',
    color: 'cyan',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-categories',
    name: 'Budget Categories',
    description: 'Manage budget categories data',
    icon: 'description',
    route: '/inventory/budget/budget-categories',
    color: 'blue',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-types',
    name: 'Budget Types',
    description: 'Manage budget types data',
    icon: 'description',
    route: '/inventory/budget/budget-types',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  // CRUD modules will be auto-registered here by the generator
  // === AUTO-GENERATED ENTRIES END ===
];
