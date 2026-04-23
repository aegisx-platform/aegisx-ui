# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.2] - 2026-04-24

### Added

- **`AxStepProgressComponent`** (`ax-step-progress`) — reusable
  horizontal step-progress timeline for table rows and detail headers.
  Supports 3 sizes (`sm` | `md` | `lg`), 5 per-step states
  (`completed` | `current` | `upcoming` | `cancelled` | `error`),
  3 overflow modes (`none` | `scroll` | `collapse`), icon fallback to
  numeric index, keyboard navigation, and ARIA group semantics.
  Tokens-only styling — works in light + dark themes via `--ax-*`
  variables.
- **`AxDialogFullscreenButtonComponent`** (`ax-dialog-fullscreen-button`)
  — drop-in header button that toggles an open Material dialog between
  its default size and full-viewport via the `.dialog-fullscreen`
  class shipped by `_dialog-shared.scss`. Inputs: `persistKey`
  (localStorage key, toggle survives reloads), `defaultOpen`,
  `expandLabel`/`collapseLabel`. Output: `(fullscreenChange)` for
  richer storage hooks (per-user keys, analytics, etc.).
- **Documentation** —
  `docs/components/feedback/ax-dialog-fullscreen-button.md` with
  installation, persistence patterns, integration notes, and
  troubleshooting. `component-overview.md` updated with the new
  Dialogs entry.

### Fixed

- **`ax-step-progress` collapsed connector** — the line after a
  `…+N` overflow bubble now inherits its style from the step
  **following** the bubble instead of hard-coding `upcoming`.
  Previous behaviour drew an upcoming-style line even when every
  hidden step was already completed — a visual lie about workflow
  state.
- **`.dialog-fullscreen` inner cap override** — when a dialog adopts
  the common `.dialog-content` wrapper (`min-width: 1200px` /
  `max-width: 90vw` / `max-height: 85vh` in normal mode), the 90vw
  cap was still in effect after `.cdk-overlay-pane` was grown to
  100vw by `.dialog-fullscreen`. The right 10vw of the surface stayed
  blank. Fixed by resetting the wrapper's size caps inside
  `.dialog-fullscreen`, reserving 128px vertical for the
  `mat-dialog-title` + `mat-dialog-actions` chrome so the inner form
  scrolls instead of the whole surface.

## [0.5.1] - 2026-04-21

### Added

- **`AxListItemComponent`** (`ax-list-item`) — compact 3-line row with
  `code + title + meta` and optional `[slot=leading]` / `[slot=trailing]`
  content projection. Supports `active` state, `(clicked)` output, and
  `density` input (`comfortable` | `compact`). Extracted from the L6
  split-view archetype in `/layouts-demo`.
- **`AxMetadataGridComponent`** (`ax-metadata-grid`) — semantic `<dl>`
  rendered as an auto-fit grid, driven by
  `[items]="{ label, value }[]"`. Supports `density` and `minColWidth`.
  Used for record headers and detail panes.
- **Documentation** — `docs/components/data-display/list-item.md` and
  `docs/components/data-display/metadata-grid.md`.

## [0.5.0] - 2026-04-21

### Added

- **`AxStatCardComponent` — major expansion to 24 layout variants**
  (up from 4 in 0.4.0). New variants:
  `hero`, `trend`, `trend-corner`, `ring`, `comparison`, `breakdown`,
  `bars`, `status`, `gauge`, `stacked-bar`, `billboard`, `dual-metric`,
  `inline-bars`, `compare-period`, `threshold`, `progress-steps`,
  `heatmap`, `metric-grid`, `ranking`, `journey`, `donut-legend`,
  `gauge-split`, `category-browser` — on top of the existing `compact`
  and `icon-leading`.
- **Stat-card payload inputs** — `trendData`, `target`/`targetLabel`,
  `breakdown`, `barData`/`barLabels`, `status`/`lastUpdated`,
  `progressLabel`, `segments`, `metrics`, `meta`, `deltaDirection`,
  `periods`, `min`/`max`/`thresholds`, `steps`, `heatmapData`/
  `heatmapRowLabels`/`heatmapColLabels`, `cells`, `ranking`,
  `projectedValue`/`projectedLabel`/`projectedSubtitle`,
  `donutSegments`/`centerValue`/`centerLabel`, `categories`.
- **Stat-card progress bar** — `[progress]` (0–100) + optional
  `progressColor` renders a thin bottom bar on any variant.
- **Stat-card color controls** — `valueColor` (`accent` | `neutral`) and
  `iconColor` (`accent` | `neutral`) decouple the value tint from the
  icon badge.
- **`AxStatGroupComponent`** (`ax-stat-group`) — small uppercase labeled
  wrapper for a cluster of stat cards with optional leading icon.
- **`AxPriorityAlertComponent`** — inline priority alert card.
- **Enterprise navigation (`ax-nav-*` system)**:
  - **`AxNavDockPanelComponent`** (`ax-nav-dock-panel`) — flush children
    panel that slides out beside the dock sidebar when a module with
    `children[]` is clicked. Closes on Escape, outside click, selecting
    any non-expanding module, or toggling the parent again.
  - `NavModule.children[]` now drives dock expansion; chevron indicator
    rendered on dock items that have children.
  - New `AxNavService` state: `expandedModuleId`, `expandedModule`,
    plus `toggleModuleExpand(id)`, `collapseModule()`,
    `setActiveChild(child)` — parent stays active while user navigates
    to a sub-route in dock mode.
  - `NavChild.badge` — optional badge on sub-routes.
  - `AxNavTopbarComponent` gains `[theme]="'dark'"` input so it can sit
    on a dark `ax-dashboard-panel` surface.
  - `AxNavDockPanelComponent` exported from the `@aegisx/ui` public API.
- **Dashboard toolkit** — dark-hero dashboard pattern components:
  - `AxDashboardPanelComponent` (`ax-dashboard-panel`) + `[axNav]` slot
    directive — dark-gradient wrapper with nav slot and 2-column body.
  - `AxHeroMetricCardComponent` (`ax-hero-metric-card`) — blue-gradient
    hero card with big value, pill chip, CTA, secondary stats, and
    optional SVG wave chart.
  - `AxBarChartAreaComponent` (`ax-bar-chart-area`) — paired bar chart
    designed for dark surfaces (Chart.js 4 via `ng2-charts`).
  - `AxMiniAreaChartCardComponent` (`ax-mini-area-chart-card`) — white
    card with value + delta badge + inline SVG area chart, composed
    from `ax-card` + `ax-badge`.
  - `AxActivityListCardComponent` (`ax-activity-list-card`) — generic
    dashboard activity list composed from `ax-card` + `ax-avatar` +
    `ax-badge`.
  - Shared tokens `--ax-dashboard-accent` and `--ax-dashboard-accent-soft`.
- **Documentation**:
  - New `docs/components/data-display/stat-card.md` covering all 24
    variants + payload types + examples.
  - New `docs/components/data-display/stat-group.md`.
  - New `docs/components/navigation/nav-shell.md` covering the full
    `ax-nav-*` system, 4 layout modes, accent presets, and the dock
    children panel.
  - New `docs/components/layout/dashboard-panel.md` covering the
    dashboard toolkit.

### Changed

- **Stat-card default `valueColor` flipped `accent` → `neutral`** to
  match the Untitled UI / enterprise-SaaS look — the value reads as
  data while the small icon badge (`iconColor = 'accent'`) carries the
  semantic color cue. Pages that relied on tinted values must opt back
  in with `valueColor="accent"`.
- Stat-card `[value]` widened to accept `null | undefined` so Angular's
  `number` / `currency` / `percent` pipes (which return `string | null`)
  pass through directly.
- Stat-card hover state is now quieter; the active indicator stripe
  rests on a neutral-default surface.
- **80+ components refactored** to add `ChangeDetectionStrategy.OnPush`
  and replace `CommonModule` with standalone imports (prep for Angular's
  no-zone future).
- Dashboard widgets resolve `--ax-dashboard-accent` tokens to hex once at
  construction so Chart.js (which can't parse `var(...)`) renders with
  the themed color while still degrading to sensible defaults in SSR.

### Fixed

- Stat-card template uses strict inequality so values of `0` render
  rather than falling through to the empty branch.
- Stat-card progress bar respects `isNaN`/clamped into [0, 100].
- `ax-dashboard-panel` slot directive renamed to `[axNav]` (from the
  generic `[nav]`) to avoid collisions with framework attributes; chart
  peer dependencies explicitly declared.
- Dock panel close output renamed `close → closed` to comply with the
  `no-output-native` Angular lint rule.
- Dock panel stays active / resets correctly when navigating to a child
  route or switching modules mid-expand.

### Accessibility

- Dock panel exposes `role="navigation"` with a descriptive `aria-label`
  derived from the module label.
- Dock panel close button, items, and outside-click handlers use
  `takeUntilDestroyed(DestroyRef)` for automatic subscription cleanup.
- Stat-card `keyup.space` triggers `clicked`; `keydown.space` suppresses
  default scrolling so the card behaves like a real button.

### Migration Notes

- **Stat-card value color** — if your dashboard previously relied on the
  value inheriting the semantic color, add `valueColor="accent"`
  explicitly. No change needed if you want the new neutral look.
- **Dashboard panel slot** — if you used `<div nav>` inside
  `<ax-dashboard-panel>`, rename to `<div axNav>`.
- **Dock panel close event** — rename handler: `(close)` → `(closed)`.

## [0.4.1] - 2026-04-12

### Fixed

- `tsd` moved to `peerDependencies` to fix consumer install warnings.
- Removed unused peer dependencies left over from inventory component
  cleanup.

## [0.4.0] - 2026-04-11

### Added

- **New Components**:
  - `AxCardHeaderComponent` — Flexible section header matching Untitled UI
    "Card Headers" pattern. Supports title, description, featured icon
    (Light Circle Outline), content slots for `[leading]`, `[title-badge]`,
    `[actions]`, and an extra row for tabs/filters/search. Auto dark-mode
    via `--ax-*` tokens.
  - `AxChipComponent` — Compact inline label (Untitled UI "Tags" style) for
    metadata, categories, filters. Smaller than `ax-badge`, supports dot
    indicator, removable state, 6 semantic colors.
  - `AxProtectedFieldComponent` — Form field with lock/unlock guard for
    sensitive master-data editing. Implements `ControlValueAccessor`.
  - `AxStatusBadgeComponent` — Status indicator badge with semantic colors.
  - `AxImagePreviewComponent` — Lightbox image preview with navigation,
    thumbnails, and keyboard support (Enter/Escape).
  - `AxStatCardComponent` — Dense KPI card for dashboards with clickable
    state, semantic color accents, and active indicator.

- **Badge System** — Complete 12-color semantic badge palette with
  consistent tokens for all status types.

### Changed

- **Design System Audit (v0.3.0 rollup)** — Redesigned all core components
  to match Untitled UI "Clean Clinical SaaS" aesthetic:
  - Softer radius (12px for cards/modals), shadow-sm instead of heavy
    Material elevation, subtle `border-zinc-200` separators.
  - Tables: gray-50 header background, text-sm body, hover states, unified
    `mat-table` global overrides.
  - Drug pages redesigned with Tremor-style aesthetic + IBM Plex typography.
- **Components Updated**: badge, avatar, stat-card, status-badge,
  form-section, card layout, header actions alignment.
- **Sass Modernization**: Replaced deprecated `@import` with `@use` per
  Dart Sass 3.0 migration path.

### Fixed

- **Accessibility (a11y)** — Added `role` / `tabindex` / `(keyup.enter)`
  handlers to satisfy `click-events-have-key-events` and
  `interactive-supports-focus` ESLint rules in `ax-image-preview`,
  `ax-stat-card`, and `ax-form-section` clickable headers.
- **ControlValueAccessor** — Disabled `no-empty-function` for intentional
  CVA default `onChange` / `onTouched` no-op methods in
  `ax-protected-field`.
- Content projection warning in several components.
- `tsd` moved to `peerDependencies` to fix consumer install warnings.
- Removed unused imports across the library.

## [0.2.0] - 2025-12-20

### Added

- **Inventory Management Components** (10 new components):

  **Priority 1 - Core Components:**
  - `AxStockLevelComponent`: Visual stock level indicator with color-coded warnings and progress bars
  - `AxBarcodeScannerComponent`: Camera-based barcode/QR scanner with manual input fallback (powered by @zxing/library)
  - `AxQuantityInputComponent`: Specialized quantity input with unit conversion and validation
  - `AxBatchSelectorComponent`: Batch/lot selection with FIFO/FEFO/LIFO strategies and expiry tracking

  **Priority 2 - Extended Components:**
  - `AxExpiryBadgeComponent`: Compact expiry date badge with countdown and color-coded status
  - `AxVariantSelectorComponent`: Product variant selection with grid/list/compact layouts and attribute filtering
  - `AxStockAlertPanelComponent`: Real-time stock alerts dashboard with WebSocket support
  - `AxStockMovementTimelineComponent`: Movement history visualization with Chart.js and export (PDF/Excel)
  - `AxTransferWizardComponent`: Multi-step wizard for stock transfers between locations
  - `AxLocationPickerComponent`: Hierarchical location tree picker with favorites and recent locations

- **Inventory Type Definitions**:
  - Comprehensive type system in `inventory.types.ts` covering all inventory domain models
  - 15+ interfaces including `UnitConfig`, `BatchInfo`, `ProductVariant`, `StockAlert`, `LocationNode`, `MovementRecord`
  - Type-safe inventory strategies: `'fifo' | 'fefo' | 'lifo'`
  - Complete JSDoc documentation for all types

- **Dependencies**:
  - `@zxing/library`: Barcode/QR code scanning
  - `chart.js`: Timeline chart visualization
  - `jspdf`: PDF export functionality
  - `xlsx`: Excel export functionality

- **Component Documentation**:
  - Complete README.md for each component with examples, API reference, and best practices
  - Type documentation with usage examples
  - Integration guides and accessibility notes

### Features

- **Stock Level Indicator**:
  - Traffic light and gradient color schemes
  - Configurable warning thresholds
  - Size variants (sm, md, lg)
  - Full ARIA accessibility

- **Barcode Scanner**:
  - Multi-format support (QR, EAN-13, EAN-8, Code-128, Code-39, Data Matrix)
  - Camera permission handling with fallback
  - Continuous scan mode
  - Beep sound and flashlight toggle
  - Recent scans history

- **Quantity Input**:
  - Unit conversion (pieces, boxes, kg, etc.)
  - Increment/decrement stepper
  - Preset multipliers (×10, ×100)
  - Min/max validation
  - Decimal places control
  - Angular Forms integration (ControlValueAccessor)

- **Batch Selector**:
  - FIFO/FEFO/LIFO inventory strategies
  - Expiry status tracking (safe, warning, critical, expired)
  - Multi-batch selection with quantity allocation
  - Smart batch recommendations
  - Search and filter capabilities
  - API integration with loading states

- **Expiry Badge**:
  - Color-coded expiry status
  - Countdown display (days/hours)
  - Compact mode for tables
  - Customizable thresholds
  - Multiple sizes and style variants

- **Variant Selector**:
  - Three layout modes (grid cards, table list, compact selection)
  - Attribute-based filtering
  - Stock availability indicators
  - Single/multi-select with quantities
  - Image thumbnails and pricing
  - Quick view modal

- **Stock Alert Panel**:
  - Real-time WebSocket updates
  - Alert types: low-stock, out-of-stock, expiring, expired, overstock, reorder
  - Severity levels: critical, warning, info
  - Grouping by type, priority, or location
  - Action buttons (create PO, adjust stock, reorder, dispose)
  - Sound notifications

- **Stock Movement Timeline**:
  - Chart.js line chart for balance visualization
  - Movement types: inbound, outbound, transfer, adjustment, return, damage, expiry
  - Date range filtering and grouping (day/week/month)
  - WebSocket real-time updates
  - PDF and Excel export
  - Virtual scrolling for performance

- **Transfer Wizard**:
  - 4-step wizard (product selection → quantity → destination → review)
  - Multi-product transfers
  - Quantity validation against available stock
  - Location picker integration
  - Review summary before submission
  - Progress tracking stepper

- **Location Picker**:
  - Hierarchical tree (warehouse → zone → aisle → shelf → bin)
  - Tree search and filtering
  - Recent locations (localStorage)
  - Favorite locations (localStorage)
  - Type filtering
  - Stock count display
  - Full path calculation

### Technical

- **Signal-Based Architecture**: All components use Angular signals for reactive state management
- **Standalone Components**: Tree-shakable, no NgModule dependencies
- **Type Safety**: Complete TypeScript coverage with strict mode compliance
- **Performance**: Virtual scrolling, lazy loading, optimized rendering
- **Accessibility**: WCAG 2.1 AA compliance with full keyboard navigation and ARIA support
- **Responsive Design**: Mobile-first approach with responsive layouts

### Notes

- All inventory components are production-ready with comprehensive testing
- Full API documentation included in component README files
- Zero breaking changes to existing components
- Bundle sizes optimized with lazy loading for heavy dependencies (Chart.js, ZXing)

## [0.2.0] - 2025-12-18

### Added

- **Complete Type System Coverage**: Added comprehensive TypeScript type definitions across the entire library
  - 45+ new dedicated `.types.ts` files for components, services, and widgets
  - All types now properly exported through the public API (`@aegisx/ui`)
  - Type exports organized by category: core, components, widgets, layouts, services
- **Comprehensive JSDoc Documentation**: Added detailed JSDoc comments to all exported types
  - Interface and property descriptions for better IDE IntelliSense
  - Usage examples for complex types
  - Cross-references between related types
  - Default value documentation where applicable
- **Type Testing Infrastructure**: Set up `tsd` for compile-time type validation
  - New `pnpm run test:types` command for type testing
  - Comprehensive type tests covering all major exported types
  - Validates generic constraints and type inference
- **New Type Files**:
  - Component types: drawer, alert, inner-loading, loading-bar, avatar, badge, card, divider, kbd, list, stats-card, timeline, kpi-card, sparkline, and more
  - Form types: date-picker, input-otp, knob, popup-edit, scheduler, time-slots
  - Navigation types: breadcrumb, navbar, command-palette, navigation
  - Service types: theme, toast
  - Widget types: chart, kpi, list, progress, table
  - Core types: config, layout, theme, navigation

### Changed

- **Improved Type Safety**: Eliminated all `any` types (26 instances) and replaced with proper TypeScript types
  - Generic object types now use `Record<string, unknown>` or specific interfaces
  - Timer types now use `ReturnType<typeof setInterval>` for type-safe interval handling
  - HTTP params now use proper Angular `HttpParams` types
  - Theme builder now uses string literal union types instead of `any` assertions
- **Enhanced Component Interfaces**: All `@Input` and `@Output` decorators now have explicit type annotations
  - Better autocomplete in Angular templates
  - Type-safe event emitters with proper generic parameters
  - Improved compile-time checking for component usage
- **Better Type Organization**: Migrated inline types to dedicated `.types.ts` files
  - Colocated types with their implementations
  - Clear separation between public API types and internal types
  - Consistent naming convention: `{feature}.types.ts`
- **Datetime Utility Improvements**: Enhanced type safety in datetime utilities
  - Replaced `Record<string, any>` with proper generic constraints
  - Type-safe date conversion functions
  - Better IntelliSense for utility functions

### Fixed

- **Type Assertions Removed**: Eliminated unsafe type assertions in favor of proper types
  - Theme builder component now uses typed theme keys
  - Data provider uses proper HttpParams types
  - No more `as any` workarounds
- **Type Export Completeness**: All public types are now accessible from main package export
  - Fixed missing type exports in barrel files
  - Ensured all `.types.ts` files are re-exported through module index files
  - Complete type coverage for widget system configurations and data flows

### Documentation

- **Type Documentation Standards**: Created comprehensive JSDoc documentation standards guide
  - Established consistent formatting and terminology
  - Guidelines for `@example`, `@deprecated`, and `@see` tags
  - Real examples from codebase
- **Type Migration Guide**: Added migration guide for type system improvements (see `docs/type-migration-guide.md`)
  - Import path examples
  - Generic type usage patterns
  - Before/after examples showing improved types
  - Benefits and upgrade guidance

### Notes

- **Backward Compatibility**: All improvements are 100% backward compatible
  - No breaking changes to existing APIs
  - All existing import paths continue to work
  - Type improvements enhance IntelliSense without requiring code changes
- **Zero Runtime Impact**: All type improvements are compile-time only
  - No bundle size increase
  - No performance impact
  - Pure TypeScript enhancements
- **Build Quality**: Library builds with zero TypeScript errors under strict mode
  - Enabled: `strict`, `noImplicitAny`, `strictNullChecks`
  - No implicit `any` types
  - Complete type safety validation

## [0.1.0] - 2025-12-02

### Added

- Initial release of @aegisx/ui
- Layout components: Classic, Compact, Enterprise, Empty
- Core services: Config, Navigation, Loading, MediaWatcher
- UI components: Card, Alert, Drawer, Navigation, Breadcrumb, Loading Bar, User Menu
- Provider function `provideAegisxUI()` for Angular 17+ standalone apps
- NgModule support for legacy applications
- Tree-shakable feature modules
- Complete TypeScript types
- TailwindCSS integration
- Angular Material theming support
- Design token system with CSS variables

### Components

- `ax-card` - Enhanced Material Design cards
- `ax-alert` - Notification alerts with variants
- `ax-drawer` - Configurable side panels
- `ax-navigation` - Flexible navigation trees
- `ax-breadcrumb` - Dynamic breadcrumb navigation
- `ax-loading-bar` - Global progress indicators
- `ax-user-menu` - User profile dropdowns
- `ax-knob` - Circular input control
- `ax-popup-edit` - Inline editing
- `ax-splitter` - Resizable panels
- `ax-timeline` - Timeline display
- `ax-stats-card` - Statistics display cards
- `ax-inner-loading` - Component-level loading

### Layouts

- `ax-classic-layout` - Traditional admin layout with sidebar
- `ax-compact-layout` - Collapsible icon-based navigation
- `ax-enterprise-layout` - Horizontal navigation bar
- `ax-empty-layout` - Minimal layout without navigation

### Services

- `AegisxConfigService` - Theme and layout configuration
- `AegisxNavigationService` - Navigation state management
- `AegisxLoadingService` - Loading state management
- `AegisxMediaWatcherService` - Responsive breakpoints
- `AxThemeService` - Theme switching
- `LoadingBarService` - Loading bar control

### Requirements

- Angular 17 - 20
- Angular Material 17 - 20
- TailwindCSS 3.x
