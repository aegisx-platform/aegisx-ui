# Requirements Document - Inventory UI Components (Priority 1)

## Introduction

This specification defines the first priority UI components for the Inventory Management System in AegisX UI library. These four essential components form the foundation for efficient inventory operations: **Stock Level Indicator**, **Barcode Scanner**, **Quantity Input with Unit Conversion**, and **Batch/Lot Number Selector**.

These components address critical pain points in inventory management:

- **Visual stock monitoring** - Instant recognition of stock levels without reading numbers
- **Fast data entry** - Barcode scanning eliminates manual typing errors
- **Unit flexibility** - Automatic conversion between measurement units
- **Traceability** - Batch/lot tracking for expiry dates and recall management

**Value Proposition:** Reduce inventory transaction time by 60%, eliminate data entry errors, and ensure 100% product traceability compliance.

## Alignment with Product Vision

These components align with AegisX Platform's goals:

**From product.md:**

- **Efficiency First**: Reduce transaction time with barcode scanning and visual indicators
- **Error Prevention**: Unit conversion and batch selection prevent common mistakes
- **Enterprise Ready**: Production-grade components with accessibility and TypeScript safety
- **User-Centric Design**: Intuitive visual feedback and mobile-responsive interfaces

**Technical Alignment:**

- Built as standalone Angular components in `libs/aegisx-ui`
- Follow existing AegisX UI patterns (Material Design, signals, TypeScript strict mode)
- Integrate seamlessly with CRUD-generated inventory forms
- Support both web and mobile (touch-friendly)

---

## Requirements

### Requirement 1: Stock Level Visual Indicator

**User Story:** As an inventory manager, I want to see stock levels visually with color-coded warnings, so that I can quickly identify which products need attention without reading numbers.

#### Acceptance Criteria

1. **WHEN** stock level is above 75% of maximum **THEN** system SHALL display green indicator
2. **WHEN** stock level is between 25-75% of maximum **THEN** system SHALL display yellow indicator
3. **WHEN** stock level is below 25% of maximum **THEN** system SHALL display red indicator
4. **WHEN** stock level reaches minimum threshold **THEN** system SHALL display critical warning badge
5. **WHEN** user hovers over indicator **THEN** system SHALL show tooltip with exact quantities (current/min/max)
6. **IF** stock level is zero **THEN** system SHALL display "Out of Stock" badge with gray color
7. **WHEN** component renders **THEN** system SHALL support multiple units (pieces, boxes, kg, liters)
8. **WHEN** used in mobile view **THEN** system SHALL maintain visibility with responsive sizing
9. **WHEN** stock data updates **THEN** system SHALL animate transition between colors smoothly

#### Component Specifications

**Component Name:** `ax-stock-level`

**Inputs:**

- `current: number` - Current stock quantity (required)
- `minimum: number` - Minimum threshold for warning (required)
- `maximum: number` - Maximum capacity (required)
- `unit: string` - Display unit (default: 'pieces')
- `size: 'sm' | 'md' | 'lg'` - Component size (default: 'md')
- `showLabel: boolean` - Show text label (default: true)
- `showPercentage: boolean` - Show percentage value (default: true)
- `colorScheme: 'traffic-light' | 'gradient'` - Color style (default: 'traffic-light')

**Outputs:**

- `onWarningClick: EventEmitter<{level: string, current: number}>` - Emitted when warning badge clicked

**Visual Requirements:**

- Progress bar with segmented zones (green/yellow/red)
- Badge overlay for critical states
- Smooth animations (300ms transition)
- Accessible with ARIA labels

---

### Requirement 2: Barcode Scanner Component

**User Story:** As a warehouse operator, I want to scan product barcodes using my device camera or manually enter codes, so that I can quickly identify products during receiving and issuing operations.

#### Acceptance Criteria

1. **WHEN** component initializes **THEN** system SHALL request camera permission if mode is 'camera'
2. **WHEN** user grants camera permission **THEN** system SHALL activate camera with auto-focus
3. **WHEN** barcode is detected in camera view **THEN** system SHALL emit scan event within 500ms
4. **WHEN** scan is successful **THEN** system SHALL play beep sound and show visual confirmation
5. **IF** camera permission denied **THEN** system SHALL fallback to manual input mode automatically
6. **WHEN** user switches to manual mode **THEN** system SHALL show input field with validation
7. **WHEN** invalid barcode detected **THEN** system SHALL show error message and allow retry
8. **WHEN** scanning **THEN** system SHALL support multiple formats: QR Code, EAN-13, Code 128, Code 39
9. **WHEN** scan occurs **THEN** system SHALL store last 10 scans in session history
10. **IF** continuous scan mode enabled **THEN** system SHALL automatically scan next barcode after 1s delay
11. **WHEN** used in low light **THEN** system SHALL activate flashlight toggle button
12. **WHEN** component unmounts **THEN** system SHALL release camera resources properly

#### Component Specifications

**Component Name:** `ax-barcode-scanner`

**Inputs:**

- `mode: 'camera' | 'manual' | 'auto'` - Scan mode (default: 'auto' - tries camera, fallback to manual)
- `formats: BarcodeFormat[]` - Supported barcode formats (default: ['qr', 'ean13', 'code128'])
- `continuousScan: boolean` - Enable continuous scanning (default: false)
- `beepSound: boolean` - Play sound on scan (default: true)
- `showHistory: boolean` - Show recent scans (default: false)
- `placeholder: string` - Manual input placeholder (default: 'Enter barcode...')

**Outputs:**

- `onScan: EventEmitter<ScanResult>` - Emitted when barcode scanned successfully
- `onError: EventEmitter<ScanError>` - Emitted when scan fails
- `onModeChange: EventEmitter<'camera' | 'manual'>` - Emitted when mode changes

**Types:**

```typescript
interface ScanResult {
  code: string;
  format: BarcodeFormat;
  timestamp: Date;
  mode: 'camera' | 'manual';
}

interface ScanError {
  type: 'permission-denied' | 'invalid-format' | 'camera-error' | 'timeout';
  message: string;
}

type BarcodeFormat = 'qr' | 'ean13' | 'ean8' | 'code128' | 'code39' | 'datamatrix';
```

**Technical Requirements:**

- Use ZXing or QuaggaJS library for barcode scanning
- Lazy load scanner library (code-splitting)
- Support both front and rear cameras
- Handle browser compatibility gracefully

---

### Requirement 3: Quantity Input with Unit Conversion

**User Story:** As a warehouse staff, I want to enter quantities in different units (boxes, pieces, kg) with automatic conversion, so that I can work with the unit most convenient for the situation without mental math.

#### Acceptance Criteria

1. **WHEN** component renders **THEN** system SHALL display input field with unit selector dropdown
2. **WHEN** user changes unit **THEN** system SHALL automatically convert quantity to selected unit
3. **WHEN** user clicks + button **THEN** system SHALL increment by step size (1 for pieces, 0.1 for kg)
4. **WHEN** user clicks - button **THEN** system SHALL decrement by step size (cannot go below min)
5. **IF** user enters value below minimum **THEN** system SHALL show validation error and prevent submission
6. **IF** user enters value above maximum **THEN** system SHALL show validation error and prevent submission
7. **WHEN** user types decimal number **THEN** system SHALL validate decimal places (2 for currency, 3 for weight)
8. **WHEN** base unit is 'pieces' **THEN** system SHALL only allow integer values
9. **WHEN** user selects 'box' unit and conversion rate is 12 **THEN** system SHALL display "(12 pieces per box)"
10. **WHEN** value changes **THEN** system SHALL emit event with converted value in base unit
11. **WHEN** quick preset button clicked (x10, x100) **THEN** system SHALL multiply current value
12. **WHEN** used in form **THEN** system SHALL integrate with Angular Reactive Forms

#### Component Specifications

**Component Name:** `ax-quantity-input`

**Inputs:**

- `value: number` - Current quantity value (two-way binding with ngModel)
- `baseUnit: string` - Base unit for storage (required)
- `availableUnits: UnitConfig[]` - Available units with conversion rates (required)
- `min: number` - Minimum value (default: 0)
- `max: number` - Maximum value (default: Infinity)
- `step: number` - Increment/decrement step (default: 1)
- `showStepper: boolean` - Show +/- buttons (default: true)
- `showPresets: boolean` - Show x10, x100 buttons (default: false)
- `decimalPlaces: number` - Decimal precision (default: 0)
- `disabled: boolean` - Disable input (default: false)

**Outputs:**

- `valueChange: EventEmitter<number>` - Emitted when value changes (in base unit)
- `unitChange: EventEmitter<string>` - Emitted when unit changes
- `onValidation: EventEmitter<ValidationState>` - Emitted on validation change

**Types:**

```typescript
interface UnitConfig {
  code: string; // 'box', 'piece', 'kg', 'g'
  label: string; // 'Box', 'Piece', 'Kilogram'
  conversionRate: number; // Multiplier to convert to base unit
  decimalPlaces: number; // Allowed decimal places
  symbol?: string; // Unit symbol for display
}

interface ValidationState {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  type: 'min' | 'max' | 'decimal' | 'integer';
  message: string;
}
```

**Visual Requirements:**

- Input field with unit dropdown on right
- Stepper buttons (+ / -) on left
- Conversion hint below input ("= 144 pieces")
- Validation error messages
- Disabled state styling

---

### Requirement 4: Batch/Lot Number Selector

**User Story:** As a quality control officer, I want to select batch/lot numbers with visibility of expiry dates and available quantities, so that I can ensure FIFO/FEFO compliance and prevent use of expired products.

#### Acceptance Criteria

1. **WHEN** component loads **THEN** system SHALL fetch available batches for selected product from API
2. **WHEN** batches load **THEN** system SHALL sort by strategy (FIFO: oldest first, FEFO: earliest expiry first)
3. **WHEN** batch list displays **THEN** system SHALL show: batch number, expiry date, available quantity, manufacturing date
4. **WHEN** batch expiry is within 30 days **THEN** system SHALL show yellow warning badge
5. **WHEN** batch expiry is within 7 days **THEN** system SHALL show red critical badge
6. **WHEN** batch is expired **THEN** system SHALL show gray "EXPIRED" badge and disable selection
7. **WHEN** user selects batch **THEN** system SHALL emit batch details including all metadata
8. **IF** allowMultiple is true **THEN** system SHALL allow selecting multiple batches with quantity per batch
9. **WHEN** multiple batches selected **THEN** system SHALL validate total quantity <= requested quantity
10. **WHEN** user types batch number **THEN** system SHALL filter list with autocomplete
11. **WHEN** no batches available **THEN** system SHALL show "No batches available" message
12. **IF** showRecommendation is true **THEN** system SHALL highlight recommended batch based on strategy
13. **WHEN** batch selected **THEN** system SHALL show confirmation with expiry countdown

#### Component Specifications

**Component Name:** `ax-batch-selector`

**Inputs:**

- `productId: string` - Product to get batches for (required)
- `batches: BatchInfo[]` - Available batches (if not using API)
- `strategy: 'fifo' | 'fefo' | 'lifo'` - Selection strategy (default: 'fefo')
- `allowMultiple: boolean` - Allow multiple batch selection (default: false)
- `requestedQuantity: number` - Quantity needed (for multi-batch split)
- `showExpiry: boolean` - Show expiry date (default: true)
- `showManufacturing: boolean` - Show manufacturing date (default: false)
- `showRecommendation: boolean` - Highlight recommended batch (default: true)
- `expiryWarningDays: number` - Days before expiry to show warning (default: 30)
- `expiryCriticalDays: number` - Days before expiry to show critical (default: 7)

**Outputs:**

- `onSelect: EventEmitter<BatchSelection>` - Emitted when batch(es) selected
- `onBatchesLoad: EventEmitter<BatchInfo[]>` - Emitted when batches loaded
- `onError: EventEmitter<string>` - Emitted on load/validation error

**Types:**

```typescript
interface BatchInfo {
  batchNumber: string;
  lotNumber?: string;
  expiryDate: Date;
  manufacturingDate?: Date;
  availableQuantity: number;
  unit: string;
  location?: string;
  status: 'available' | 'reserved' | 'expired' | 'quarantine';
  metadata?: Record<string, unknown>;
}

interface BatchSelection {
  batches: SelectedBatch[];
  totalQuantity: number;
  strategy: 'fifo' | 'fefo' | 'lifo';
}

interface SelectedBatch {
  batch: BatchInfo;
  quantity: number;
}
```

**API Requirements:**

- GET `/api/inventory/products/:productId/batches` - Fetch available batches
- Query params: `?status=available&location=WAREHOUSE-01`
- Response: `{ batches: BatchInfo[], strategy: string }`

**Visual Requirements:**

- List view with cards for each batch
- Expiry badge with color coding
- Quantity available display
- Checkbox/radio for selection
- Recommended badge (star icon)
- Search/filter input
- Empty state message

---

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each component has one clear purpose
- **Standalone Components**: Use Angular standalone architecture (no NgModule)
- **Type Safety**: TypeScript strict mode, explicit types for all inputs/outputs
- **Component Isolation**: No dependencies between P1 components
- **Shared Utilities**: Extract common logic (date formatting, unit conversion) to separate utilities

### Performance

- **Initial Load**: Components should render within 100ms
- **Barcode Scan**: Detection within 500ms in good lighting
- **Unit Conversion**: Instant calculation (<16ms, one frame)
- **Batch Loading**: Display skeleton loader, render results within 300ms
- **Bundle Size**: Each component <20KB gzipped (lazy-loadable)
- **Memory**: Clean up camera resources, prevent memory leaks

### Security

- **Input Validation**: Sanitize all user inputs (barcode strings, quantities)
- **API Security**: Use authentication headers for batch API calls
- **Camera Permission**: Handle permission denial gracefully
- **XSS Prevention**: Escape all user-entered text in displays
- **CSRF Protection**: Include CSRF tokens in batch fetch requests

### Reliability

- **Error Handling**: All errors caught and displayed with helpful messages
- **Fallback Modes**: Camera → Manual fallback for barcode scanner
- **Offline Support**: Cache last-used unit conversions
- **API Retry**: Retry failed batch fetches with exponential backoff (3 attempts)
- **Data Validation**: Prevent invalid states (negative quantities, expired batch selection)

### Usability

- **Accessibility**: WCAG 2.1 AA compliance
  - Keyboard navigation for all interactions
  - ARIA labels for screen readers
  - Color contrast ratio ≥4.5:1
  - Focus indicators visible
- **Mobile Responsive**: Touch-friendly targets (44px minimum)
- **Visual Feedback**: Loading states, success/error messages, animations
- **Consistent Design**: Follow AegisX UI design tokens and patterns
- **Multi-language**: Support i18n for labels and messages (Thai, English)
- **Dark Mode**: Support both light and dark themes

### Browser Support

- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Camera API**: Fallback to manual input if MediaDevices API unavailable

---

## Success Metrics

**Adoption:**

- 80% of inventory transactions use barcode scanner within 1 month
- Stock level indicators used in all product list views

**Efficiency:**

- 60% reduction in transaction time (5 min → 2 min average)
- 95% reduction in quantity entry errors (unit conversion)
- Zero expired product issues (batch selector compliance)

**Technical:**

- <100ms component render time
- <500ms barcode detection
- 100% TypeScript type coverage
- 0 critical accessibility violations

---

## Out of Scope

**Not included in Priority 1:**

- Stock movement timeline (Priority 2)
- Location/warehouse picker (Priority 2)
- Multi-location stock view (Priority 3)
- Stock valuation calculations (Priority 3)
- Inventory transfer wizard (Priority 2)
- Product variant selector (Priority 2)
- Stock alert panel widget (Priority 2)

**Future Enhancements:**

- Bluetooth barcode scanner support
- Voice input for quantity
- AI-powered batch recommendations
- Integration with weighing scales
- Augmented reality for stock visualization

---

## Dependencies

**External Libraries:**

- ZXing or QuaggaJS for barcode scanning
- Angular Material components (already in project)
- RxJS for reactive patterns (already in project)

**Internal Dependencies:**

- AegisX UI theme system
- Shared utility functions (date formatting, number formatting)
- Backend API endpoints for batch data

**Browser APIs:**

- MediaDevices API (camera access)
- Web Audio API (beep sound)
- localStorage (scan history, unit preferences)

---

## Glossary

- **FIFO** (First-In, First-Out): Inventory strategy using oldest stock first
- **FEFO** (First-Expired, First-Out): Inventory strategy using nearest-expiry stock first
- **LIFO** (Last-In, First-Out): Inventory strategy using newest stock first
- **Batch Number**: Unique identifier for production batch
- **Lot Number**: Alternative term for batch number (often same)
- **Base Unit**: Standard unit for internal storage (e.g., pieces)
- **Conversion Rate**: Multiplier to convert between units (e.g., 1 box = 12 pieces)
- **SKU** (Stock Keeping Unit): Unique product identifier

---

_Requirements Version: 1.0_
_Last Updated: 2025-12-18_
_Status: Awaiting Approval_
