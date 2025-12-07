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
    id: 'drugs',
    name: 'Drugs',
    description: 'Manage drugs data',
    icon: 'medication',
    route: '/inventory/master-data/drugs',
    color: 'lavender',
    status: 'active',
    enabled: true,
  },

  // CRUD modules will be auto-registered here by the generator
  // === AUTO-GENERATED ENTRIES END ===
];
