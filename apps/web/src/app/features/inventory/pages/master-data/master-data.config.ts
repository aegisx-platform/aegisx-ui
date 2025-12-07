import { LauncherApp } from '@aegisx/ui';

/**
 * Master Data Section Configuration
 *
 * This file contains the configuration for Master Data modules
 * displayed in the ax-launcher component.
 *
 * NOTE: CRUD generator will auto-register new modules here when using --section master-data
 */

/**
 * Section Items
 *
 * Each item represents a CRUD module accessible from the launcher.
 * Generator will auto-add entries when using: --shell inventory --section master-data
 *
 * Available colors: 'pink', 'peach', 'mint', 'blue', 'yellow', 'lavender', 'cyan', 'rose', 'neutral', 'white'
 */
export const SECTION_ITEMS: LauncherApp[] = [
  // === AUTO-GENERATED ENTRIES START ===
  {
    id: 'return-actions',
    name: 'Return Actions',
    description: 'Manage return actions data',
    icon: 'description',
    route: '/inventory/master-data/return-actions',
    color: 'blue',
    status: 'active',
    enabled: true,
  },

  {
    id: 'adjustment-reasons',
    name: 'Adjustment Reasons',
    description: 'Manage adjustment reasons data',
    icon: 'description',
    route: '/inventory/master-data/adjustment-reasons',
    color: 'mint',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drug-units',
    name: 'Drug Units',
    description: 'Manage drug units data',
    icon: 'medication',
    route: '/inventory/master-data/drug-units',
    color: 'yellow',
    status: 'active',
    enabled: true,
  },

  {
    id: 'dosage-forms',
    name: 'Dosage Forms',
    description: 'Manage dosage forms data',
    icon: 'description',
    route: '/inventory/master-data/dosage-forms',
    color: 'mint',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drug-pack-ratios',
    name: 'Drug Pack Ratios',
    description: 'Manage drug pack ratios data',
    icon: 'medication',
    route: '/inventory/master-data/drug-pack-ratios',
    color: 'mint',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drug-focus-lists',
    name: 'Drug Focus Lists',
    description: 'Manage drug focus lists data',
    icon: 'medication',
    route: '/inventory/master-data/drug-focus-lists',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drug-components',
    name: 'Drug Components',
    description: 'Manage drug components data',
    icon: 'medication',
    route: '/inventory/master-data/drug-components',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-categories',
    name: 'Budget Categories',
    description: 'Manage budget categories data',
    icon: 'description',
    route: '/inventory/master-data/budget-categories',
    color: 'blue',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budget-types',
    name: 'Budget Types',
    description: 'Manage budget types data',
    icon: 'description',
    route: '/inventory/master-data/budget-types',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drug-generics',
    name: 'Drug Generics',
    description: 'Manage drug generics data',
    icon: 'medication',
    route: '/inventory/master-data/drug-generics',
    color: 'mint',
    status: 'active',
    enabled: true,
  },

  {
    id: 'budgets',
    name: 'Budgets',
    description: 'Manage budgets data',
    icon: 'description',
    route: '/inventory/master-data/budgets',
    color: 'cyan',
    status: 'active',
    enabled: true,
  },

  {
    id: 'bank',
    name: 'Bank',
    description: 'Manage bank data',
    icon: 'description',
    route: '/inventory/master-data/bank',
    color: 'yellow',
    status: 'active',
    enabled: true,
  },

  {
    id: 'hospitals',
    name: 'Hospitals',
    description: 'Manage hospitals data',
    icon: 'description',
    route: '/inventory/master-data/hospitals',
    color: 'peach',
    status: 'active',
    enabled: true,
  },

  {
    id: 'departments',
    name: 'Departments',
    description: 'Manage departments data',
    icon: 'corporate_fare',
    route: '/inventory/master-data/departments',
    color: 'blue',
    status: 'active',
    enabled: true,
  },

  {
    id: 'companies',
    name: 'Companies',
    description: 'Manage companies data',
    icon: 'description',
    route: '/inventory/master-data/companies',
    color: 'cyan',
    status: 'active',
    enabled: true,
  },

  {
    id: 'locations',
    name: 'Locations',
    description: 'Manage locations data',
    icon: 'location_on',
    route: '/inventory/master-data/locations',
    color: 'rose',
    status: 'active',
    enabled: true,
  },

  {
    id: 'drugs',
    name: 'Drugs',
    description: 'Manage drugs data',
    icon: 'medication',
    route: '/inventory/master-data/drugs',
    color: 'yellow',
    status: 'active',
    enabled: true,
  },

  // CRUD modules will be auto-registered here by the generator
  // === AUTO-GENERATED ENTRIES END ===
];
