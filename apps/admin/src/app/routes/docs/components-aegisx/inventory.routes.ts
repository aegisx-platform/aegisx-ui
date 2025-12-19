/**
 * Inventory Routes
 *
 * IMPORTANT: Dynamic imports MUST use static string paths.
 * Template literals with variables do NOT work with Webpack/Angular.
 */

import { Route } from '@angular/router';

export const INVENTORY_ROUTES: Route[] = [
  {
    path: 'inventory/stock-level',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/stock-level/stock-level-doc.component'
      ).then((m) => m.StockLevelDocComponent),
    data: {
      title: 'Stock Level Component',
      description:
        'Progress bar indicator for inventory levels with color-coded zones',
    },
  },
  {
    path: 'inventory/stock-alert-panel',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/stock-alert-panel/stock-alert-panel-doc.component'
      ).then((m) => m.StockAlertPanelDocComponent),
    data: {
      title: 'Stock Alert Panel Component',
      description:
        'Alert management panel with filtering, grouping, and real-time updates',
    },
  },
  {
    path: 'inventory/location-picker',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/location-picker/location-picker-doc.component'
      ).then((m) => m.LocationPickerDocComponent),
    data: {
      title: 'Location Picker Component',
      description:
        'Hierarchical location selector with tree view, search, and favorites',
    },
  },
  {
    path: 'inventory/quantity-input',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/quantity-input/quantity-input-doc.component'
      ).then((m) => m.QuantityInputDocComponent),
    data: {
      title: 'Quantity Input Component',
      description:
        'Numeric input with increment/decrement buttons and validation',
    },
  },
  {
    path: 'inventory/barcode-scanner',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/barcode-scanner/barcode-scanner-doc.component'
      ).then((m) => m.BarcodeScannerDocComponent),
    data: {
      title: 'Barcode Scanner Component',
      description: 'Camera-based barcode scanning with manual entry fallback',
    },
  },
  {
    path: 'inventory/batch-selector',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/batch-selector/batch-selector-doc.component'
      ).then((m) => m.BatchSelectorDocComponent),
    data: {
      title: 'Batch Selector Component',
      description:
        'FIFO/FEFO/LIFO batch selection with expiry tracking and auto-allocation',
    },
  },
  {
    path: 'inventory/expiry-badge',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/expiry-badge/expiry-badge-doc.component'
      ).then((m) => m.ExpiryBadgeDocComponent),
    data: {
      title: 'Expiry Badge Component',
      description:
        'Color-coded expiry status indicator with countdown and variants',
    },
  },
  {
    path: 'inventory/stock-movement-timeline',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/stock-movement-timeline/stock-movement-timeline-doc.component'
      ).then((m) => m.StockMovementTimelineDocComponent),
    data: {
      title: 'Stock Movement Timeline Component',
      description:
        'Inventory movement history with Chart.js integration and filtering',
    },
  },
  {
    path: 'inventory/transfer-wizard',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/transfer-wizard/transfer-wizard-doc.component'
      ).then((m) => m.TransferWizardDocComponent),
    data: {
      title: 'Transfer Wizard Component',
      description:
        'Multi-step inventory transfer workflow with validation and draft saving',
    },
  },
  {
    path: 'inventory/variant-selector',
    loadComponent: () =>
      import(
        '../../../pages/docs/components/aegisx/inventory/variant-selector/variant-selector-doc.component'
      ).then((m) => m.VariantSelectorDocComponent),
    data: {
      title: 'Variant Selector Component',
      description:
        'Multi-dimensional product variant selection with grid/list/compact layouts',
    },
  },
];
