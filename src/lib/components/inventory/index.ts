/**
 * @module Inventory Components
 * @description Domain-specific components for inventory management.
 *
 * These components contain business logic specific to pharmaceutical
 * inventory management. They are included in @aegisx/ui for convenience
 * but may be extracted to a separate @aegisx/inventory-ui package
 * in a future major version.
 *
 * **Generic components** (reusable across domains):
 * - AxExpiryBadgeComponent - Badge variant for expiry date display
 * - AxBarcodeScannerComponent - Barcode/QR scanning input
 * - AxQuantityInputComponent - Numeric quantity input with validation
 * - AxLocationPickerComponent - Hierarchical location tree picker
 *
 * **Domain-specific components** (inventory business logic):
 * - AxTransferWizardComponent - Multi-step stock transfer workflow
 * - AxStockAlertPanelComponent - Low stock / expiry alert dashboard
 * - AxBatchSelectorComponent - Lot/batch selection with FEFO logic
 * - AxVariantSelectorComponent - Drug variant/pack size selection
 * - AxStockMovementTimelineComponent - Stock transaction history
 * - AxStockLevelComponent - Real-time stock level display
 *
 * NOTE: Component-specific types are exported from individual component
 * index files. Shared types are available from:
 * @aegisx/ui/lib/types/inventory.types
 */

// =============================================================================
// GENERIC COMPONENTS (reusable across any domain)
// =============================================================================

// Barcode Scanner Component
export { AxBarcodeScannerComponent } from './barcode-scanner';

// Quantity Input Component
export { AxQuantityInputComponent } from './quantity-input';

// Expiry Badge Component
export { AxExpiryBadgeComponent } from './expiry-badge';

// Location Picker Component
export { AxLocationPickerComponent } from './location-picker';

// =============================================================================
// DOMAIN-SPECIFIC COMPONENTS (pharmaceutical inventory business logic)
// These contain inventory-specific workflows and may be extracted to
// @aegisx/inventory-ui in a future major version.
// =============================================================================

// Stock Level Component
export { AxStockLevelComponent } from './stock-level';

// Batch Selector Component
export { AxBatchSelectorComponent } from './batch-selector';

// Stock Movement Timeline Component
export { AxStockMovementTimelineComponent } from './stock-movement-timeline';

// Variant Selector Component
export { AxVariantSelectorComponent } from './variant-selector';

// Stock Alert Panel Component
export { AxStockAlertPanelComponent } from './stock-alert-panel';
// NOTE: Stock Alert Panel types are NOT re-exported here to avoid conflicts
// with shared inventory.types (StockAlert interface). Import them directly from:
// '@aegisx/ui/lib/components/inventory/stock-alert-panel'

// Transfer Wizard Component
export { AxTransferWizardComponent } from './transfer-wizard';
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
