# Requirements Document - Inventory UI Components (Priority 2)

## Introduction

This specification defines the second priority UI components for the Inventory Management System in AegisX UI library. These six enhanced components build upon Priority 1 foundations to provide advanced inventory operations: **Stock Movement Timeline**, **Expiry Date Badge**, **Product Variant Selector**, **Stock Alert Panel**, **Inventory Transfer Wizard**, and **Location/Warehouse Picker**.

These components address advanced inventory management needs:

- **Historical tracking** - Complete movement audit trail with visual timeline
- **Proactive alerts** - Early warnings for expiring items and stock issues
- **Variant management** - Multi-dimensional product selection (size, color, package)
- **Location hierarchy** - Multi-level warehouse organization
- **Transfer workflows** - Guided inter-location stock transfers
- **Dashboard visibility** - Centralized alert monitoring

**Value Proposition:** Improve inventory accuracy by 90%, enable real-time stock visibility across locations, reduce expired product waste by 95%, and streamline transfer operations.

## Alignment with Product Vision

These components align with AegisX Platform's goals:

**From product.md:**

- **Efficiency First**: Timeline reduces investigation time, wizard streamlines transfers
- **Error Prevention**: Variant selector prevents picking errors, alerts prevent stockouts
- **Enterprise Ready**: Multi-location support, audit trails, compliance features
- **User-Centric Design**: Visual timelines, guided workflows, intuitive dashboards

**Technical Alignment:**

- Built as standalone Angular components in `libs/aegisx-ui`
- Follow existing AegisX UI patterns (Material Design, signals, TypeScript strict mode)
- Integrate with Priority 1 components (batch selector, quantity input)
- Support both web and mobile (responsive, touch-friendly)

---

## Requirements

### Requirement 1: Stock Movement Timeline (Enhanced)

**User Story:** As an inventory manager, I want to see a visual timeline of all stock movements for a product with running balance calculations, so that I can quickly audit inventory changes and identify discrepancies.

#### Acceptance Criteria

1. **WHEN** component loads **THEN** system SHALL fetch movement history from API for selected product
2. **WHEN** movements display **THEN** system SHALL show timeline with chronological ordering (newest first by default)
3. **WHEN** each movement renders **THEN** system SHALL display: timestamp, type (in/out/adjust), quantity, balance after, user, reference document
4. **WHEN** user selects grouping **THEN** system SHALL group movements by day/week/month with subtotals
5. **WHEN** user applies filters **THEN** system SHALL filter by movement type (receive/issue/transfer/adjust)
6. **WHEN** balance line renders **THEN** system SHALL show running balance as line chart overlaid on timeline
7. **WHEN** user clicks movement **THEN** system SHALL expand to show full details (notes, location, batch number)
8. **WHEN** user hovers over chart point **THEN** system SHALL show tooltip with exact balance at that time
9. **WHEN** export button clicked **THEN** system SHALL export timeline to PDF or Excel with formatting
10. **IF** real-time updates enabled **THEN** system SHALL subscribe to WebSocket and prepend new movements
11. **WHEN** large dataset loads **THEN** system SHALL implement virtual scrolling for >100 movements
12. **WHEN** date range picker used **THEN** system SHALL filter movements within selected range

#### Component Specifications

**Component Name:** `ax-stock-movement-timeline`

**Inputs:**

- `productId: string` - Product to show movements for (required)
- `movements: MovementRecord[]` - Pre-loaded movements (optional, otherwise fetch from API)
- `groupBy: 'none' | 'day' | 'week' | 'month'` - Grouping strategy (default: 'none')
- `showBalance: boolean` - Show running balance line chart (default: true)
- `showFilters: boolean` - Show filter controls (default: true)
- `enableExport: boolean` - Enable PDF/Excel export (default: true)
- `enableRealtime: boolean` - Enable WebSocket updates (default: false)
- `dateRange: { start: Date, end: Date }` - Date range filter (optional)
- `pageSize: number` - Items per page (default: 50)

**Outputs:**

- `onMovementClick: EventEmitter<MovementRecord>` - Emitted when movement clicked
- `onExport: EventEmitter<{ format: 'pdf' | 'excel', data: MovementRecord[] }>` - Emitted on export
- `onFilterChange: EventEmitter<MovementFilter>` - Emitted when filters change
- `onMovementsLoad: EventEmitter<MovementRecord[]>` - Emitted after API load

**Types:**

```typescript
interface MovementRecord {
  id: string;
  timestamp: Date;
  type: 'receive' | 'issue' | 'transfer-in' | 'transfer-out' | 'adjust-in' | 'adjust-out';
  quantity: number;
  balanceAfter: number;
  unit: string;
  user: {
    id: string;
    name: string;
  };
  referenceDocument?: {
    type: 'PO' | 'SO' | 'TO' | 'ADJ';
    number: string;
  };
  location?: string;
  batchNumber?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

interface MovementFilter {
  types: MovementType[];
  dateRange?: { start: Date; end: Date };
  users?: string[];
  locations?: string[];
}

type MovementType = 'receive' | 'issue' | 'transfer-in' | 'transfer-out' | 'adjust-in' | 'adjust-out';
```

**API Requirements:**

- GET `/api/inventory/products/:productId/movements` - Fetch movement history
  - Query params: `?startDate=&endDate=&types[]=&limit=&offset=`
  - Response: `{ movements: MovementRecord[], total: number, currentBalance: number }`
- WebSocket: `/ws/inventory/movements` - Real-time movement updates
  - Subscribe: `{ type: 'subscribe', productId: 'xxx' }`
  - Event: `{ type: 'movement', data: MovementRecord }`

**Visual Requirements:**

- Vertical timeline with alternating left/right cards
- Color-coded movement types (green: in, red: out, blue: transfer, yellow: adjust)
- Line chart showing balance trend
- Expandable details panel
- Skeleton loader during fetch
- Empty state message

---

### Requirement 2: Expiry Date Badge/Alert

**User Story:** As a warehouse operator, I want to see color-coded expiry badges on products, so that I can immediately identify items approaching expiration without reading dates.

#### Acceptance Criteria

1. **WHEN** badge renders with expiry date **THEN** system SHALL calculate days until expiry
2. **WHEN** days until expiry > warningDays **THEN** system SHALL display green badge "Safe"
3. **WHEN** days until expiry between criticalDays and warningDays **THEN** system SHALL display yellow badge "Warning"
4. **WHEN** days until expiry ≤ criticalDays **THEN** system SHALL display red badge "Critical"
5. **WHEN** expiry date is past **THEN** system SHALL display gray badge "EXPIRED"
6. **WHEN** showCountdown is true **THEN** system SHALL display "X days left" or "Expired X days ago"
7. **WHEN** user hovers over badge **THEN** system SHALL show tooltip with exact expiry date and time
8. **IF** showIcon is true **THEN** system SHALL display warning icon alongside text
9. **WHEN** badge size set **THEN** system SHALL render in sm/md/lg size
10. **WHEN** onClick handler provided **THEN** system SHALL emit event with expiry info on click
11. **WHEN** batch mode enabled **THEN** system SHALL display "X batches expiring soon" summary
12. **WHEN** used in table **THEN** system SHALL support compact inline mode

#### Component Specifications

**Component Name:** `ax-expiry-badge`

**Inputs:**

- `expiryDate: Date` - Expiry date (required)
- `warningDays: number` - Days threshold for warning (default: 30)
- `criticalDays: number` - Days threshold for critical (default: 7)
- `showCountdown: boolean` - Show countdown text (default: true)
- `showIcon: boolean` - Show warning icon (default: true)
- `size: 'sm' | 'md' | 'lg'` - Badge size (default: 'md')
- `variant: 'outlined' | 'soft' | 'solid'` - Badge style (default: 'soft')
- `compact: boolean` - Compact mode for tables (default: false)

**Outputs:**

- `onClick: EventEmitter<ExpiryInfo>` - Emitted when badge clicked

**Types:**

```typescript
interface ExpiryInfo {
  expiryDate: Date;
  daysUntilExpiry: number;
  status: 'safe' | 'warning' | 'critical' | 'expired';
  message: string;
}
```

**Visual Requirements:**

- Color scheme:
  - Safe: `bg-success-100 text-success-800`
  - Warning: `bg-warning-100 text-warning-800`
  - Critical: `bg-error-100 text-error-800`
  - Expired: `bg-neutral-100 text-neutral-600`
- Icon: Material Design warning/check icons
- Sizes: sm (20px height), md (24px height), lg (32px height)
- Compact mode: Icon only with tooltip

---

### Requirement 3: Product Variant Selector

**User Story:** As a sales clerk, I want to select product variants (size, color, package) visually with stock availability shown, so that I can quickly find the right variant without searching through lists.

#### Acceptance Criteria

1. **WHEN** component loads **THEN** system SHALL display all available variants for product
2. **WHEN** variants render **THEN** system SHALL group by attributes (size, color, package) if configured
3. **WHEN** user selects attribute value **THEN** system SHALL filter variants matching that attribute
4. **WHEN** variant has image **THEN** system SHALL display thumbnail in grid layout
5. **WHEN** variant out of stock **THEN** system SHALL disable selection and show "Out of Stock" badge
6. **WHEN** variant low stock **THEN** system SHALL show "Low Stock" badge with quantity
7. **WHEN** variant selected **THEN** system SHALL emit variant details including SKU and stock
8. **WHEN** layout is 'grid' **THEN** system SHALL show cards with image, attributes, price, stock
9. **WHEN** layout is 'list' **THEN** system SHALL show table rows with columns
10. **WHEN** layout is 'dropdown' **THEN** system SHALL show searchable select dropdown
11. **IF** allowMultiple is true **THEN** system SHALL allow selecting multiple variants with quantities
12. **WHEN** price differences exist **THEN** system SHALL display price per variant
13. **WHEN** user searches **THEN** system SHALL filter variants by attribute values or SKU

#### Component Specifications

**Component Name:** `ax-variant-selector`

**Inputs:**

- `productId: string` - Base product ID (required)
- `variants: ProductVariant[]` - Available variants (required)
- `attributes: string[]` - Attribute dimensions to show (e.g., ['size', 'color'])
- `layout: 'grid' | 'list' | 'dropdown'` - Display layout (default: 'grid')
- `showImages: boolean` - Show variant images (default: true)
- `showStock: boolean` - Show stock levels (default: true)
- `showPrice: boolean` - Show price differences (default: true)
- `allowMultiple: boolean` - Allow multiple variant selection (default: false)
- `lowStockThreshold: number` - Threshold for low stock badge (default: 10)

**Outputs:**

- `onVariantSelect: EventEmitter<VariantSelection>` - Emitted when variant selected
- `onAttributeFilter: EventEmitter<{ attribute: string, value: string }>` - Emitted on filter change

**Types:**

```typescript
interface ProductVariant {
  sku: string;
  name: string;
  attributes: Record<string, string>; // { size: 'M', color: 'Blue' }
  imageUrl?: string;
  price: number;
  stockLevel: number;
  available: boolean;
}

interface VariantSelection {
  variants: Array<{
    variant: ProductVariant;
    quantity: number;
  }>;
}
```

**Visual Requirements:**

- Grid layout: 3-4 columns, card-based
- List layout: Sortable table
- Dropdown: Searchable with custom option template
- Disabled variants: Opacity 0.5, strikethrough
- Selected state: Blue border, checkmark icon

---

### Requirement 4: Stock Alert Panel

**User Story:** As an inventory supervisor, I want to see all stock alerts (low stock, expiring items, overstock) in one dashboard widget, so that I can take immediate action on critical issues.

#### Acceptance Criteria

1. **WHEN** panel loads **THEN** system SHALL fetch all active alerts from API
2. **WHEN** alerts display **THEN** system SHALL group by type (low-stock/expiring/overstock/out-of-stock)
3. **WHEN** groupBy is 'priority' **THEN** system SHALL sort by priority (critical > warning > info)
4. **WHEN** groupBy is 'type' **THEN** system SHALL show sections for each alert type
5. **WHEN** alert renders **THEN** system SHALL show: product name, alert type, severity, action button
6. **WHEN** user clicks alert **THEN** system SHALL navigate to product detail or emit event
7. **WHEN** action button clicked **THEN** system SHALL trigger predefined action (create PO, adjust stock)
8. **WHEN** maxDisplay set **THEN** system SHALL limit visible alerts and show "View All" link
9. **WHEN** user dismisses alert **THEN** system SHALL mark as acknowledged in backend
10. **IF** real-time enabled **THEN** system SHALL subscribe to WebSocket for new alerts
11. **WHEN** filter applied **THEN** system SHALL show only alerts matching filter criteria
12. **WHEN** no alerts exist **THEN** system SHALL show "All clear" success message

#### Component Specifications

**Component Name:** `ax-stock-alert-panel`

**Inputs:**

- `alerts: StockAlert[]` - Pre-loaded alerts (optional)
- `groupBy: 'type' | 'priority' | 'none'` - Grouping strategy (default: 'priority')
- `showActions: boolean` - Show action buttons (default: true)
- `maxDisplay: number` - Maximum alerts to display (default: 10)
- `enableRealtime: boolean` - Enable WebSocket updates (default: false)
- `filters: AlertFilter` - Filter criteria (optional)

**Outputs:**

- `onAlertClick: EventEmitter<StockAlert>` - Emitted when alert clicked
- `onAlertAction: EventEmitter<{ alert: StockAlert, action: string }>` - Emitted on action
- `onAlertDismiss: EventEmitter<string>` - Emitted when alert dismissed (alert ID)
- `onAlertsLoad: EventEmitter<StockAlert[]>` - Emitted after load

**Types:**

```typescript
interface StockAlert {
  id: string;
  type: 'low-stock' | 'out-of-stock' | 'expiring' | 'expired' | 'overstock' | 'reorder';
  severity: 'critical' | 'warning' | 'info';
  product: {
    id: string;
    name: string;
    sku: string;
    imageUrl?: string;
  };
  message: string;
  createdAt: Date;
  metadata?: {
    currentStock?: number;
    minimumStock?: number;
    expiryDate?: Date;
    batchNumber?: string;
  };
  suggestedActions?: string[];
}

interface AlertFilter {
  types?: StockAlert['type'][];
  severity?: StockAlert['severity'][];
  productIds?: string[];
}
```

**API Requirements:**

- GET `/api/inventory/alerts` - Fetch active alerts
  - Query params: `?types[]=&severity[]=&limit=`
  - Response: `{ alerts: StockAlert[], total: number }`
- POST `/api/inventory/alerts/:id/dismiss` - Dismiss alert
- WebSocket: `/ws/inventory/alerts` - Real-time alert updates

**Visual Requirements:**

- Card-based layout with severity color coding
- Critical: Red accent border
- Warning: Yellow accent border
- Info: Blue accent border
- Action buttons: Primary color
- Empty state: Success icon with message

---

### Requirement 5: Inventory Transfer Wizard

**User Story:** As a warehouse manager, I want a guided multi-step wizard for transferring stock between locations, so that I can ensure all required information is captured and transfers are executed correctly.

#### Acceptance Criteria

1. **WHEN** wizard starts **THEN** system SHALL display Step 1: Select Products
2. **WHEN** Step 1: user searches products **THEN** system SHALL show autocomplete results
3. **WHEN** Step 1: products selected **THEN** system SHALL proceed to Step 2: Confirm Quantities
4. **WHEN** Step 2 renders **THEN** system SHALL show quantity input for each product with max = available stock
5. **WHEN** Step 2: quantities entered **THEN** system SHALL proceed to Step 3: Select Destination
6. **WHEN** Step 3 renders **THEN** system SHALL show location picker (source pre-selected)
7. **WHEN** Step 3: destination selected **THEN** system SHALL proceed to Step 4: Review & Submit
8. **WHEN** Step 4 renders **THEN** system SHALL display transfer summary: products, quantities, source, destination
9. **WHEN** user clicks Back **THEN** system SHALL return to previous step without losing data
10. **WHEN** user clicks Submit **THEN** system SHALL validate all inputs and create transfer request
11. **IF** validation fails **THEN** system SHALL show error messages and prevent submission
12. **WHEN** transfer created **THEN** system SHALL emit success event with transfer ID
13. **WHEN** allowPartialTransfer is false **THEN** system SHALL require full quantity transfer
14. **WHEN** requireApproval is true **THEN** system SHALL create pending transfer requiring approval

#### Component Specifications

**Component Name:** `ax-transfer-wizard`

**Inputs:**

- `sourceLocation: string` - Source location ID (required)
- `steps: WizardStep[]` - Custom step configuration (optional)
- `allowPartialTransfer: boolean` - Allow partial quantities (default: true)
- `requireApproval: boolean` - Require manager approval (default: false)
- `allowMultipleProducts: boolean` - Allow selecting multiple products (default: true)

**Outputs:**

- `onComplete: EventEmitter<TransferRequest>` - Emitted when transfer submitted
- `onCancel: EventEmitter<void>` - Emitted when wizard cancelled
- `onStepChange: EventEmitter<{ step: number, data: any }>` - Emitted on step navigation

**Types:**

```typescript
interface TransferRequest {
  sourceLocationId: string;
  destinationLocationId: string;
  items: Array<{
    productId: string;
    quantity: number;
    batchNumber?: string;
  }>;
  notes?: string;
  requiresApproval: boolean;
}

interface WizardStep {
  id: string;
  title: string;
  component?: any; // Custom step component
}
```

**Visual Requirements:**

- Stepper progress indicator at top
- Step 1: Product search with autocomplete
- Step 2: Quantity input table with max validation
- Step 3: Location picker (tree or dropdown)
- Step 4: Summary table with totals
- Navigation buttons: Back, Next, Submit, Cancel

---

### Requirement 6: Location/Warehouse Picker

**User Story:** As a warehouse operator, I want to select storage locations using a hierarchical tree (Warehouse > Zone > Aisle > Shelf > Bin), so that I can quickly navigate to the exact storage location.

#### Acceptance Criteria

1. **WHEN** component loads **THEN** system SHALL display location hierarchy as tree structure
2. **WHEN** user expands node **THEN** system SHALL load child locations (lazy load if large dataset)
3. **WHEN** location selected **THEN** system SHALL emit full location path (Warehouse-01 > Zone-A > Shelf-12)
4. **WHEN** search used **THEN** system SHALL filter locations by code or name and expand tree to matches
5. **WHEN** showAvailability is true **THEN** system SHALL display stock count per location
6. **WHEN** allowedTypes set **THEN** system SHALL only allow selecting locations of specified types
7. **WHEN** user clicks "Recent Locations" **THEN** system SHALL show last 5 used locations
8. **WHEN** user clicks "Favorites" **THEN** system SHALL show saved favorite locations
9. **WHEN** location has no children **THEN** system SHALL not show expand icon
10. **WHEN** location disabled **THEN** system SHALL gray out and prevent selection
11. **IF** showMap is true **THEN** system SHALL display warehouse layout map with clickable zones
12. **WHEN** breadcrumb mode **THEN** system SHALL show location path as breadcrumbs

#### Component Specifications

**Component Name:** `ax-location-picker`

**Inputs:**

- `locations: LocationNode[]` - Location hierarchy (required)
- `currentLocation: string` - Pre-selected location ID (optional)
- `showAvailability: boolean` - Show stock availability (default: false)
- `allowedTypes: LocationType[]` - Allowed location types (default: all)
- `showRecent: boolean` - Show recent locations (default: true)
- `showFavorites: boolean` - Show favorite locations (default: true)
- `showMap: boolean` - Show warehouse map (default: false)
- `searchable: boolean` - Enable search (default: true)
- `mode: 'tree' | 'dropdown' | 'breadcrumb'` - Display mode (default: 'tree')

**Outputs:**

- `onLocationSelect: EventEmitter<LocationSelection>` - Emitted when location selected
- `onFavoriteToggle: EventEmitter<{ locationId: string, isFavorite: boolean }>` - Favorite toggled

**Types:**

```typescript
interface LocationNode {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  parentId?: string;
  children?: LocationNode[];
  stockCount?: number;
  capacity?: number;
  disabled?: boolean;
}

type LocationType = 'warehouse' | 'zone' | 'aisle' | 'shelf' | 'bin';

interface LocationSelection {
  location: LocationNode;
  path: LocationNode[]; // Full path from warehouse to selected
  pathString: string; // "WH-01 > Zone-A > Shelf-12"
}
```

**API Requirements:**

- GET `/api/inventory/locations` - Fetch location hierarchy
  - Query params: `?parentId=&type=`
  - Response: `{ locations: LocationNode[] }`
- GET `/api/inventory/locations/:id/stock` - Get stock at location

**Visual Requirements:**

- Tree view: Material Design tree with expand/collapse
- Icons per type: warehouse (warehouse), zone (layers), shelf (storage)
- Search: Highlighted matches, auto-expand to result
- Recent/Favorites: Quick access tabs
- Map view: SVG warehouse layout (optional)

---

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility**: Each component has one clear purpose
- **Standalone Components**: Angular standalone architecture
- **Type Safety**: TypeScript strict mode, explicit types
- **Reusability**: Components work independently and together
- **Integration**: Compatible with Priority 1 components

### Performance

- **Initial Load**: Components render within 150ms
- **Timeline**: Display 100 movements within 200ms, virtual scrolling for >100
- **Variant Selector**: Support 100+ variants without lag
- **Alert Panel**: Update <100ms on new alert
- **Wizard**: Step transitions <50ms
- **Location Tree**: Lazy load children, support 1000+ locations

### Security

- **Input Validation**: Sanitize all user inputs
- **API Security**: Authentication headers required
- **RBAC**: Respect user permissions (hide transfer wizard if no permission)
- **Audit Trail**: Log all transfers and alert dismissals

### Reliability

- **Error Handling**: All API errors caught and displayed
- **Retry Logic**: Auto-retry failed API calls (3 attempts)
- **Offline Support**: Cache location hierarchy
- **Data Validation**: Prevent invalid transfers (negative quantities, same source/destination)

### Usability

- **Accessibility**: WCAG 2.1 AA compliance
- **Keyboard Navigation**: All interactions keyboard-accessible
- **Screen Readers**: ARIA labels and live regions
- **Mobile Responsive**: Touch-friendly, responsive layouts
- **Multi-language**: Support i18n (Thai, English)
- **Dark Mode**: Support both themes

### Browser Support

- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

---

## Success Metrics

**Adoption:**

- 70% of inventory staff use alert panel daily within 2 weeks
- 90% of transfers use wizard instead of manual entry

**Efficiency:**

- 80% reduction in transfer errors (wizard validation)
- 50% faster product variant selection vs dropdown lists
- 100% alert visibility (no missed expiring items)

**Technical:**

- <150ms component render time
- <200ms timeline with 100 movements
- 100% TypeScript type coverage
- 0 critical accessibility violations

---

## Out of Scope

**Not included in Priority 2:**

- Multi-location stock view (Priority 3)
- Stock valuation calculations (Priority 3)
- Reorder suggestion card (Priority 3)
- Stock adjustment pad (Priority 3)
- Integration with weighing scales
- Bluetooth scanner support
- Voice input

**Future Enhancements:**

- AI-powered reorder recommendations
- Predictive analytics for stock levels
- Mobile app integration
- Augmented reality warehouse navigation
- Advanced reporting dashboards

---

## Dependencies

**External Libraries:**

- Angular Material components (already in project)
- RxJS for reactive patterns (already in project)
- Chart.js or D3.js for timeline chart (to be installed)
- jsPDF for PDF export (to be installed)

**Internal Dependencies:**

- Priority 1 components (ax-quantity-input, ax-batch-selector)
- AegisX UI theme system
- Shared utility functions (date formatting, number formatting)
- Backend API endpoints (movements, alerts, locations, transfers)

**Browser APIs:**

- WebSocket API (real-time updates)
- localStorage (recent locations, favorites)

---

## Glossary

- **Movement**: Any stock transaction (receive, issue, transfer, adjustment)
- **Running Balance**: Cumulative stock quantity after each movement
- **Variant**: Product variation by attributes (size, color, package)
- **Alert**: System notification about stock conditions requiring action
- **Transfer**: Inter-location stock movement
- **Location Hierarchy**: Warehouse > Zone > Aisle > Shelf > Bin structure

---

_Requirements Version: 1.0_
_Last Updated: 2025-12-18_
_Status: Awaiting Approval_
