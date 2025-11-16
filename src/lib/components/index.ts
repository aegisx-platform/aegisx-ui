// =============================================================================
// NEW COMPONENT MODULES (v1.0.0 Redesign)
// =============================================================================

// Forms Module
export * from './forms';

// Data Display Module
export * from './data-display';

// Feedback Module
export * from './feedback';

// Navigation Module
export * from './navigation';

// =============================================================================
// EXISTING COMPONENTS (Legacy - kept for backward compatibility)
// =============================================================================

// Individual Components (standardized names with actual component classes)
export { AegisxCardComponent as AxCardComponent } from './card/card.component';

// Legacy exports for backward compatibility (all standalone components)
// Note: Removed exports that conflict with new module components:
// - alert (now in feedback module)
// - drawer (now in navigation module)
// - breadcrumb (now in navigation module)

// Additional Components
export * from './ax-loading-bar.component';
export * from './ax-navigation.component';

// Dialog Components
export * from './dialogs';

// Theme & Layout Switchers
export * from './ax-theme-switcher.component';
export * from './ax-layout-switcher.component';
