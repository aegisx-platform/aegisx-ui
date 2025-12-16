import { LauncherApp, LauncherCategory } from '@aegisx/ui';

/**
 * Master Data Section Configuration
 *
 * This file contains the configuration for Master Data modules
 * displayed in the ax-launcher component.
 *
 * NOTE: CRUD generator will auto-register new modules here when using --section master-data
 */

/**
 * Master Data Categories
 *
 * Organize modules into logical groups for better UX
 */
export const MASTER_DATA_CATEGORIES: LauncherCategory[] = [
  {
    id: 'organization',
    name: 'Organization',
    icon: 'business',
    description: 'Organizational master data',
    order: 1,
  },
  {
    id: 'drugs',
    name: 'Drugs',
    icon: 'medication',
    description: 'Drug and pharmaceutical data',
    order: 2,
  },
  {
    id: 'contracts',
    name: 'Contracts',
    icon: 'description',
    description: 'Contract and procurement data',
    order: 3,
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: 'settings',
    description: 'Operational reference data',
    order: 4,
  },
];

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

  // Organization
  {
    id: 'hospitals',
    name: 'Hospitals',
    description: 'Hospital master data',
    icon: 'local_hospital',
    route: '/inventory/master-data/hospitals',
    color: 'blue',
    categoryId: 'organization',
    status: 'active',
    enabled: true,
  },
  {
    id: 'companies',
    name: 'Companies',
    description: 'Company master data',
    icon: 'business',
    route: '/inventory/master-data/companies',
    color: 'cyan',
    categoryId: 'organization',
    status: 'active',
    enabled: true,
  },
  {
    id: 'locations',
    name: 'Locations',
    description: 'Storage location master data',
    icon: 'place',
    route: '/inventory/master-data/locations',
    color: 'mint',
    categoryId: 'organization',
    status: 'active',
    enabled: true,
  },
  {
    id: 'bank',
    name: 'Banks',
    description: 'Bank master data',
    icon: 'account_balance',
    route: '/inventory/master-data/bank',
    color: 'peach',
    categoryId: 'organization',
    status: 'active',
    enabled: true,
  },

  // Drugs
  {
    id: 'drugs',
    name: 'Drugs',
    description: 'Drug master data',
    icon: 'medication',
    route: '/inventory/master-data/drugs',
    color: 'rose',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
    featured: true,
  },
  {
    id: 'drug-generics',
    name: 'Drug Generics',
    description: 'Generic drug master data',
    icon: 'science',
    route: '/inventory/master-data/drug-generics',
    color: 'lavender',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },
  {
    id: 'drug-units',
    name: 'Drug Units',
    description: 'Drug unit master data',
    icon: 'straighten',
    route: '/inventory/master-data/drug-units',
    color: 'yellow',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },
  {
    id: 'dosage-forms',
    name: 'Dosage Forms',
    description: 'Dosage form master data',
    icon: 'medical_services',
    route: '/inventory/master-data/dosage-forms',
    color: 'pink',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },
  {
    id: 'drug-pack-ratios',
    name: 'Drug Pack Ratios',
    description: 'Drug packaging ratio data',
    icon: 'inventory_2',
    route: '/inventory/master-data/drug-pack-ratios',
    color: 'cyan',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },
  {
    id: 'drug-focus-lists',
    name: 'Drug Focus Lists',
    description: 'Drug focus list master data',
    icon: 'list_alt',
    route: '/inventory/master-data/drug-focus-lists',
    color: 'blue',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },
  {
    id: 'drug-components',
    name: 'Drug Components',
    description: 'Drug component master data',
    icon: 'category',
    route: '/inventory/master-data/drug-components',
    color: 'mint',
    categoryId: 'drugs',
    status: 'active',
    enabled: true,
  },

  // Contracts
  {
    id: 'contracts',
    name: 'Contracts',
    description: 'Contract master data',
    icon: 'description',
    route: '/inventory/master-data/contracts',
    color: 'peach',
    categoryId: 'contracts',
    status: 'active',
    enabled: true,
  },
  {
    id: 'contract-items',
    name: 'Contract Items',
    description: 'Contract item master data',
    icon: 'receipt_long',
    route: '/inventory/master-data/contract-items',
    color: 'rose',
    categoryId: 'contracts',
    status: 'active',
    enabled: true,
  },

  // Operations
  {
    id: 'adjustment-reasons',
    name: 'Adjustment Reasons',
    description: 'Stock adjustment reason data',
    icon: 'edit_note',
    route: '/inventory/master-data/adjustment-reasons',
    color: 'yellow',
    categoryId: 'operations',
    status: 'active',
    enabled: true,
  },
  {
    id: 'return-actions',
    name: 'Return Actions',
    description: 'Return action master data',
    icon: 'undo',
    route: '/inventory/master-data/return-actions',
    color: 'lavender',
    categoryId: 'operations',
    status: 'active',
    enabled: true,
  },

  // CRUD modules will be auto-registered here by the generator
  // === AUTO-GENERATED ENTRIES END ===
];
