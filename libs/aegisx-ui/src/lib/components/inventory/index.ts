/**
 * AegisX Inventory Components Module
 * ================================================================
 * Comprehensive inventory management components for stock tracking,
 * movement history, batch management, and location-based operations.
 *
 * NOTE: Component-specific types are exported from individual component
 * index files. Shared types are available from:
 * @aegisx/ui/lib/types/inventory.types
 */

// =============================================================================
// PRIORITY 1: CORE COMPONENTS
// =============================================================================

// Stock Level Component
export { AxStockLevelComponent } from './stock-level';

// Barcode Scanner Component
export { AxBarcodeScannerComponent } from './barcode-scanner';

// Quantity Input Component
export { AxQuantityInputComponent } from './quantity-input';

// Batch Selector Component
export { AxBatchSelectorComponent } from './batch-selector';

// =============================================================================
// PRIORITY 2: EXTENDED COMPONENTS
// =============================================================================

// Stock Movement Timeline Component
export { AxStockMovementTimelineComponent } from './stock-movement-timeline';

// Expiry Badge Component
export { AxExpiryBadgeComponent } from './expiry-badge';

// Variant Selector Component
export { AxVariantSelectorComponent } from './variant-selector';

// Stock Alert Panel Component
export { AxStockAlertPanelComponent } from './stock-alert-panel';
// NOTE: Stock Alert Panel types are NOT re-exported here to avoid conflicts
// with shared inventory.types (StockAlert interface). Import them directly from:
// '@aegisx/ui/lib/components/inventory/stock-alert-panel'

// Transfer Wizard Component
export { AxTransferWizardComponent } from './transfer-wizard';

// Location Picker Component
export { AxLocationPickerComponent } from './location-picker';
// Re-export Location Picker types to resolve naming conflicts with inventory.types
// These override the shared types when imported from this module
export type {
  LocationNode,
  FlatLocationNode,
  LocationSelection,
  LocationFilter,
  LocationSearchMatch,
  LocationSelectionState,
  RecentLocation,
  FavoriteLocation,
  LocationPickerConfig,
  LocationSelectEvent,
  FavoriteToggleEvent,
  NodeExpandEvent,
  LocationTreeStats,
  LocationBreadcrumbItem,
} from './location-picker';
export {
  LocationType,
  LocationStatus,
  SelectionMode,
  DEFAULT_LOCATION_PICKER_CONFIG,
} from './location-picker';
