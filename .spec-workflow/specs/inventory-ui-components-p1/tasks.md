# Tasks - Inventory UI Components (Priority 1)

## Overview

This document breaks down the implementation of 4 Priority 1 inventory components into actionable tasks. Tasks are organized by phase and component, with clear acceptance criteria and dependencies.

**Status Legend:**

- `[ ]` Pending
- `[-]` In Progress
- `[x]` Completed

---

## Phase 1: Foundation & Setup

### 1.1 Project Structure Setup

**[x] Task 1.1.1: Create component directories**

Create directory structure for inventory components:

```
libs/aegisx-ui/src/lib/components/inventory/
├── stock-level/
│   ├── stock-level.component.ts
│   ├── stock-level.component.scss
│   ├── stock-level.component.spec.ts
│   ├── stock-level.types.ts
│   └── index.ts
├── barcode-scanner/
│   ├── barcode-scanner.component.ts
│   ├── barcode-scanner.component.scss
│   ├── barcode-scanner.component.spec.ts
│   ├── barcode-scanner.types.ts
│   └── index.ts
├── quantity-input/
│   ├── quantity-input.component.ts
│   ├── quantity-input.component.scss
│   ├── quantity-input.component.spec.ts
│   ├── quantity-input.types.ts
│   └── index.ts
└── batch-selector/
    ├── batch-selector.component.ts
    ├── batch-selector.component.scss
    ├── batch-selector.component.spec.ts
    ├── batch-selector.types.ts
    └── index.ts
```

**Acceptance Criteria:**

- All directories created under `libs/aegisx-ui/src/lib/components/inventory/`
- Each component has 5 required files: component.ts, .scss, .spec.ts, .types.ts, index.ts
- index.ts files export all public APIs

**Dependencies:** None

---

**[x] Task 1.1.2: Install required dependencies**

Install external libraries needed for barcode scanning:

```bash
pnpm add @zxing/library
pnpm add -D @types/dom-mediacapture-record
```

**Acceptance Criteria:**

- `@zxing/library` installed in package.json
- `@types/dom-mediacapture-record` installed as devDependency
- `pnpm install` completes without errors
- No TypeScript errors from missing type definitions

**Dependencies:** None

---

**[x] Task 1.1.3: Create shared inventory types**

Create `libs/aegisx-ui/src/lib/types/inventory.types.ts` with common types:

```typescript
/**
 * Common unit configuration for quantity inputs
 */
export interface UnitConfig {
  /** Unit code (e.g., 'piece', 'box', 'kg') */
  code: string;
  /** Display label */
  label: string;
  /** Conversion rate to base unit */
  conversionRate: number;
  /** Allowed decimal places */
  decimalPlaces: number;
  /** Optional unit symbol */
  symbol?: string;
}

/**
 * Batch/Lot information
 */
export interface BatchInfo {
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

/**
 * Inventory strategy for batch selection
 */
export type InventoryStrategy = 'fifo' | 'fefo' | 'lifo';
```

**Acceptance Criteria:**

- File created at `libs/aegisx-ui/src/lib/types/inventory.types.ts`
- All interfaces have complete JSDoc comments
- Types exported from `libs/aegisx-ui/src/index.ts`
- No TypeScript errors

**Dependencies:** None

---

**[x] Task 1.1.4: Update public API exports**

Update `libs/aegisx-ui/src/index.ts` to export inventory components:

```typescript
// Inventory Components
export * from './lib/components/inventory/stock-level';
export * from './lib/components/inventory/barcode-scanner';
export * from './lib/components/inventory/quantity-input';
export * from './lib/components/inventory/batch-selector';

// Inventory Types
export * from './lib/types/inventory.types';
```

**Acceptance Criteria:**

- All inventory components exported from main index.ts
- No circular dependencies
- Build succeeds with `pnpm nx build aegisx-ui`

**Dependencies:** 1.1.1, 1.1.3

---

## Phase 2: Stock Level Indicator Component

### 2.1 Types & Interfaces

**[x] Task 2.1.1: Create stock-level.types.ts**

Create type definitions:

```typescript
/**
 * Stock level component size
 */
export type StockLevelSize = 'sm' | 'md' | 'lg';

/**
 * Color scheme for stock level display
 */
export type StockLevelColorScheme = 'traffic-light' | 'gradient';

/**
 * Stock level warning event
 */
export interface StockLevelWarningEvent {
  /** Warning level triggered */
  level: 'low' | 'critical';
  /** Current stock value */
  current: number;
  /** Minimum threshold */
  minimum: number;
}
```

**Acceptance Criteria:**

- All types have JSDoc comments
- Types exported from component index.ts
- No TypeScript errors

**Dependencies:** 1.1.1

---

### 2.2 Component Implementation

**[x] Task 2.2.1: Implement stock-level component scaffold**

Create basic component structure with inputs and outputs:

```typescript
@Component({
  selector: 'ax-stock-level',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, AxBadgeComponent],
  templateUrl: './stock-level.component.html',
  styleUrls: ['./stock-level.component.scss'],
})
export class AxStockLevelComponent {
  // Inputs
  current = input.required<number>();
  minimum = input.required<number>();
  maximum = input.required<number>();
  unit = input<string>('pieces');
  size = input<StockLevelSize>('md');
  showLabel = input<boolean>(true);
  showPercentage = input<boolean>(true);
  colorScheme = input<StockLevelColorScheme>('traffic-light');

  // Output
  onWarningClick = output<StockLevelWarningEvent>();
}
```

**Acceptance Criteria:**

- Component compiles without errors
- All required inputs defined with `input.required()`
- Optional inputs have default values
- Output defined with `output<T>()`

**Dependencies:** 2.1.1

---

**[x] Task 2.2.2: Implement computed signals for stock level**

Add computed properties:

```typescript
// Computed percentage
percentage = computed(() => {
  const max = this.maximum();
  const curr = this.current();
  return max > 0 ? Math.round((curr / max) * 100) : 0;
});

// Computed color class
colorClass = computed(() => {
  const pct = this.percentage();
  if (this.colorScheme() === 'traffic-light') {
    if (pct >= 75) return 'bg-success-500';
    if (pct >= 25) return 'bg-warning-500';
    return 'bg-error-500';
  } else {
    return 'bg-gradient-to-r from-error-500 via-warning-500 to-success-500';
  }
});

// Warning state
isWarning = computed(() => this.current() <= this.minimum());

// Tooltip text
tooltipText = computed(() => {
  const curr = this.current();
  const min = this.minimum();
  const max = this.maximum();
  const unit = this.unit();
  return `Current: ${curr} ${unit}\nMinimum: ${min} ${unit}\nMaximum: ${max} ${unit}`;
});
```

**Acceptance Criteria:**

- All computed signals return correct values
- Percentage calculation handles division by zero
- Color class matches design specifications
- Warning triggers when current <= minimum

**Dependencies:** 2.2.1

---

**[x] Task 2.2.3: Create stock-level template**

Implement HTML template:

```html
<div class="ax-stock-level" [class]="'ax-stock-level--' + size()">
  @if (showLabel()) {
  <div class="ax-stock-level__label">
    <span class="ax-stock-level__value"> {{ current() }} / {{ maximum() }} {{ unit() }} </span>
    @if (showPercentage()) {
    <span class="ax-stock-level__percentage">({{ percentage() }}%)</span>
    }
  </div>
  }

  <div class="ax-stock-level__progress" [matTooltip]="tooltipText()" role="progressbar" [attr.aria-valuenow]="current()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="maximum()" [attr.aria-label]="'Stock level: ' + percentage() + '%'">
    <div class="ax-stock-level__progress-bg"></div>
    <div class="ax-stock-level__progress-fill" [class]="colorClass()" [style.width.%]="percentage()"></div>
    <div class="ax-stock-level__threshold" [style.left.%]="(minimum() / maximum()) * 100">
      <span class="ax-stock-level__threshold-label">min</span>
    </div>
  </div>

  @if (isWarning()) {
  <ax-badge type="warning" size="sm" content="Low Stock" (click)="handleWarningClick()" />
  }
</div>
```

**Acceptance Criteria:**

- Template compiles without errors
- All control flow (@if) conditions work correctly
- ARIA attributes present for accessibility
- Tooltip displays on hover
- Warning badge appears when isWarning() is true

**Dependencies:** 2.2.2

---

**[x] Task 2.2.4: Implement stock-level styles**

Create SCSS styles following design specifications:

```scss
.ax-stock-level {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__value {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  &__percentage {
    font-size: var(--font-size-xs);
    color: var(--text-subtle);
  }

  &__progress {
    position: relative;
    height: 12px;
    border-radius: 9999px;
    overflow: hidden;
    transition: height 0.2s ease;

    &-bg {
      position: absolute;
      inset: 0;
      background: var(--background-subtle);
    }

    &-fill {
      position: absolute;
      inset: 0;
      transition:
        width 0.3s ease,
        background-color 0.3s ease;
    }
  }

  &__threshold {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-emphasis);
    pointer-events: none;

    &-label {
      position: absolute;
      top: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.625rem;
      color: var(--text-subtle);
    }
  }

  &--sm {
    .ax-stock-level__progress {
      height: 8px;
    }
  }

  &--lg {
    .ax-stock-level__progress {
      height: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ax-stock-level__progress-fill {
      transition: none;
    }
  }
}
```

**Acceptance Criteria:**

- Styles match design document
- CSS variables used for theming
- Size variants (sm/md/lg) work correctly
- Respects prefers-reduced-motion
- Dark mode compatible

**Dependencies:** 2.2.3

---

### 2.3 Testing

**[x] Task 2.3.1: Write unit tests for stock-level component**

Create comprehensive unit tests:

```typescript
describe('AxStockLevelComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate percentage correctly', () => {
    component.current.set(250);
    component.maximum.set(500);
    expect(component.percentage()).toBe(50);
  });

  it('should display green color when stock > 75%', () => {
    component.current.set(400);
    component.minimum.set(50);
    component.maximum.set(500);
    expect(component.colorClass()).toContain('success');
  });

  it('should display yellow color when stock 25-75%', () => {
    component.current.set(250);
    component.minimum.set(50);
    component.maximum.set(500);
    expect(component.colorClass()).toContain('warning');
  });

  it('should display red color when stock < 25%', () => {
    component.current.set(100);
    component.minimum.set(50);
    component.maximum.set(500);
    expect(component.colorClass()).toContain('error');
  });

  it('should show warning badge when stock <= minimum', () => {
    component.current.set(40);
    component.minimum.set(50);
    expect(component.isWarning()).toBe(true);
  });

  it('should emit warning click event', () => {
    const spy = jasmine.createSpy('onWarningClick');
    component.onWarningClick.subscribe(spy);
    component.current.set(30);
    component.minimum.set(50);

    component.handleWarningClick();

    expect(spy).toHaveBeenCalledWith({
      level: 'low',
      current: 30,
      minimum: 50,
    });
  });

  it('should handle zero maximum gracefully', () => {
    component.current.set(100);
    component.maximum.set(0);
    expect(component.percentage()).toBe(0);
  });

  it('should generate correct tooltip text', () => {
    component.current.set(150);
    component.minimum.set(50);
    component.maximum.set(500);
    component.unit.set('pieces');

    const tooltip = component.tooltipText();
    expect(tooltip).toContain('Current: 150 pieces');
    expect(tooltip).toContain('Minimum: 50 pieces');
    expect(tooltip).toContain('Maximum: 500 pieces');
  });
});
```

**Acceptance Criteria:**

- All tests pass
- Code coverage ≥80%
- Tests cover edge cases (zero values, boundary conditions)
- Tests verify computed signals

**Dependencies:** 2.2.4

---

**[x] Task 2.3.2: Add stock-level to component showcase**

Add examples to Storybook or showcase app:

**Acceptance Criteria:**

- Component appears in showcase
- Multiple examples shown (low/medium/high stock)
- Interactive controls for testing

**Dependencies:** 2.2.4

---

## Phase 3: Barcode Scanner Component

### 3.1 Types & Interfaces

**[x] Task 3.1.1: Create barcode-scanner.types.ts**

```typescript
/**
 * Barcode format types
 */
export type BarcodeFormat = 'qr' | 'ean13' | 'ean8' | 'code128' | 'code39' | 'datamatrix';

/**
 * Scanner mode
 */
export type ScannerMode = 'camera' | 'manual' | 'auto';

/**
 * Scan result
 */
export interface ScanResult {
  /** Scanned barcode value */
  code: string;
  /** Detected format */
  format: BarcodeFormat;
  /** Timestamp of scan */
  timestamp: Date;
  /** Mode used for scanning */
  mode: 'camera' | 'manual';
}

/**
 * Scan error types
 */
export interface ScanError {
  type: 'permission-denied' | 'invalid-format' | 'camera-error' | 'timeout';
  message: string;
}
```

**Acceptance Criteria:**

- All types documented with JSDoc
- Types exported from index.ts
- No TypeScript errors

**Dependencies:** 1.1.1

---

### 3.2 Component Implementation

**[x] Task 3.2.1: Implement barcode-scanner scaffold**

Create component with basic structure:

```typescript
@Component({
  selector: 'ax-barcode-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class AxBarcodeScannerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoRef?: ElementRef<HTMLVideoElement>;

  // Inputs
  mode = input<ScannerMode>('auto');
  formats = input<BarcodeFormat[]>(['qr', 'ean13', 'code128']);
  continuousScan = input<boolean>(false);
  beepSound = input<boolean>(true);
  showHistory = input<boolean>(false);
  placeholder = input<string>('Enter barcode...');

  // Outputs
  onScan = output<ScanResult>();
  onError = output<ScanError>();
  onModeChange = output<'camera' | 'manual'>();

  // Internal state
  private currentMode = signal<'camera' | 'manual'>('camera');
  private isScanning = signal<boolean>(false);
  private hasPermission = signal<boolean | null>(null);
  private recentScans = signal<ScanResult[]>([]);
  private currentStream = signal<MediaStream | null>(null);
  private flashlightEnabled = signal<boolean>(false);
}
```

**Acceptance Criteria:**

- Component compiles without errors
- All inputs/outputs defined
- ViewChild for video element declared

**Dependencies:** 3.1.1

---

**[x] Task 3.2.2: Implement camera initialization logic**

Add camera permission and initialization:

```typescript
async ngOnInit() {
  const mode = this.mode();
  if (mode === 'auto') {
    if (this.canUseCamera()) {
      await this.initCameraMode();
    } else {
      this.switchToManualMode();
    }
  } else if (mode === 'camera') {
    await this.initCameraMode();
  } else {
    this.switchToManualMode();
  }
}

ngOnDestroy() {
  this.cleanupCamera();
}

canUseCamera = computed(() => {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
});

private async initCameraMode() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    this.currentStream.set(stream);
    this.hasPermission.set(true);
    this.currentMode.set('camera');
    await this.startScanning();
  } catch (error: any) {
    this.hasPermission.set(false);
    this.onError.emit({
      type: 'permission-denied',
      message: error.message
    });
    this.switchToManualMode();
  }
}

private cleanupCamera() {
  const stream = this.currentStream();
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    this.currentStream.set(null);
  }
}

private switchToManualMode() {
  this.currentMode.set('manual');
  this.onModeChange.emit('manual');
}
```

**Acceptance Criteria:**

- Camera permission requested on init
- Stream started successfully
- Fallback to manual mode on permission denied
- Camera resources cleaned up on destroy
- No memory leaks

**Dependencies:** 3.2.1

---

**[x] Task 3.2.3: Integrate ZXing barcode detection**

Implement barcode scanning with ZXing:

```typescript
private async startScanning() {
  const { BrowserMultiFormatReader } = await import('@zxing/library');
  const codeReader = new BrowserMultiFormatReader();
  const videoElement = this.videoRef?.nativeElement;

  if (!videoElement) {
    this.onError.emit({
      type: 'camera-error',
      message: 'Video element not found'
    });
    return;
  }

  try {
    this.isScanning.set(true);
    await codeReader.decodeFromVideoDevice(
      undefined,
      videoElement,
      (result, error) => {
        if (result) {
          this.handleScanSuccess(result);
        }
      }
    );
  } catch (error: any) {
    this.isScanning.set(false);
    this.onError.emit({
      type: 'camera-error',
      message: error.message
    });
  }
}

private handleScanSuccess(result: any) {
  const scanResult: ScanResult = {
    code: result.getText(),
    format: this.mapBarcodeFormat(result.getBarcodeFormat()),
    timestamp: new Date(),
    mode: 'camera'
  };

  if (this.beepSound()) {
    this.playBeep();
  }

  const scans = [scanResult, ...this.recentScans()];
  this.recentScans.set(scans.slice(0, 10));

  this.onScan.emit(scanResult);

  if (!this.continuousScan()) {
    this.isScanning.set(false);
  }
}

private mapBarcodeFormat(format: any): BarcodeFormat {
  // Map ZXing formats to our format type
  const formatMap: Record<number, BarcodeFormat> = {
    // Implementation based on ZXing BarcodeFormat enum
  };
  return formatMap[format] || 'qr';
}
```

**Acceptance Criteria:**

- ZXing library lazy loaded
- Barcode detected from video stream
- Correct format mapping
- Scan result emitted
- Continuous scan mode works

**Dependencies:** 3.2.2, 1.1.2

---

**[x] Task 3.2.4: Implement manual input mode**

Add manual barcode entry:

```typescript
manualInput = signal<string>('');

onManualSubmit() {
  const code = this.manualInput().trim();

  if (!code) return;

  if (!this.validateManualInput(code)) {
    return;
  }

  const result: ScanResult = {
    code,
    format: this.detectFormat(code) || 'qr',
    timestamp: new Date(),
    mode: 'manual'
  };

  if (this.beepSound()) {
    this.playBeep();
  }

  const scans = [result, ...this.recentScans()];
  this.recentScans.set(scans.slice(0, 10));

  this.onScan.emit(result);
  this.manualInput.set('');
}

private validateManualInput(code: string): boolean {
  const format = this.detectFormat(code);

  if (!format) {
    this.onError.emit({
      type: 'invalid-format',
      message: 'Unrecognized barcode format'
    });
    return false;
  }

  if (!this.formats().includes(format)) {
    this.onError.emit({
      type: 'invalid-format',
      message: `Format ${format} not allowed`
    });
    return false;
  }

  return true;
}

private detectFormat(code: string): BarcodeFormat | null {
  if (code.length === 13 && /^\d+$/.test(code)) {
    return 'ean13';
  }
  if (code.length === 8 && /^\d+$/.test(code)) {
    return 'ean8';
  }
  if (/^[A-Z0-9\-\.\$\/\+% ]+$/.test(code)) {
    return 'code128';
  }
  return null;
}
```

**Acceptance Criteria:**

- Manual input field works
- Input validation implemented
- Format detection works for common formats
- Scan result emitted
- Input cleared after successful scan

**Dependencies:** 3.2.1

---

**[x] Task 3.2.5: Implement beep sound and flashlight**

Add beep sound and flashlight control:

```typescript
private playBeep() {
  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // Audio not supported, fail silently
  }
}

async toggleFlashlight() {
  const stream = this.currentStream();
  if (!stream) return;

  const track = stream.getVideoTracks()[0];
  const capabilities: any = track.getCapabilities();

  if (!capabilities.torch) {
    this.onError.emit({
      type: 'camera-error',
      message: 'Flashlight not supported on this device'
    });
    return;
  }

  const enabled = !this.flashlightEnabled();
  await track.applyConstraints({
    advanced: [{ torch: enabled } as any]
  });
  this.flashlightEnabled.set(enabled);
}
```

**Acceptance Criteria:**

- Beep sound plays on successful scan
- Flashlight toggles on supported devices
- Graceful fallback when features unavailable

**Dependencies:** 3.2.3

---

**[x] Task 3.2.6: Create barcode-scanner template**

Implement HTML template with camera and manual modes:

**Acceptance Criteria:**

- Template supports both camera and manual modes
- Mode switcher works
- Recent scans list displays
- Responsive layout

**Dependencies:** 3.2.5

---

**[x] Task 3.2.7: Implement barcode-scanner styles**

Create SCSS styles following design:

**Acceptance Criteria:**

- Styles match design document
- Video element properly sized
- Scan frame overlay animated
- Dark background for camera view

**Dependencies:** 3.2.6

---

### 3.3 Testing

**[x] Task 3.3.1: Write unit tests for barcode-scanner**

Create comprehensive tests:

```typescript
describe('AxBarcodeScannerComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fallback to manual mode on permission denied', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.rejectWith(new Error('Permission denied'));

    await component.initCameraMode();

    expect(component.currentMode()).toBe('manual');
  });

  it('should emit scan event with correct format', () => {
    const spy = jasmine.createSpy('onScan');
    component.onScan.subscribe(spy);

    component.manualInput.set('8850999320113');
    component.onManualSubmit();

    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        code: '8850999320113',
        format: 'ean13',
        mode: 'manual',
      }),
    );
  });

  it('should detect EAN-13 format', () => {
    expect(component.detectFormat('8850999320113')).toBe('ean13');
  });

  it('should detect EAN-8 format', () => {
    expect(component.detectFormat('12345678')).toBe('ean8');
  });

  it('should validate allowed formats', () => {
    component.formats.set(['ean13']);
    expect(component.validateManualInput('8850999320113')).toBe(true);
  });

  it('should reject invalid format', () => {
    component.formats.set(['ean13']);
    const spy = jasmine.createSpy('onError');
    component.onError.subscribe(spy);

    component.validateManualInput('ABCD1234');

    expect(spy).toHaveBeenCalled();
  });

  it('should store recent scans', () => {
    component.manualInput.set('8850999320113');
    component.onManualSubmit();

    expect(component.recentScans().length).toBe(1);
  });

  it('should limit recent scans to 10', () => {
    for (let i = 0; i < 15; i++) {
      component.recentScans.update((scans) => [{ code: `${i}`, format: 'qr', timestamp: new Date(), mode: 'manual' }, ...scans]);
    }

    expect(component.recentScans().length).toBeLessThanOrEqual(10);
  });
});
```

**Acceptance Criteria:**

- All tests pass
- Code coverage ≥80%
- Camera permission tests included
- Format detection tests included

**Dependencies:** 3.2.7

---

## Phase 4: Quantity Input Component

### 4.1 Types & Interfaces

**[x] Task 4.1.1: Create quantity-input.types.ts**

```typescript
/**
 * Validation error for quantity input
 */
export interface ValidationError {
  type: 'min' | 'max' | 'decimal' | 'integer';
  message: string;
}

/**
 * Validation state
 */
export interface ValidationState {
  valid: boolean;
  errors: ValidationError[];
}
```

**Acceptance Criteria:**

- Types documented with JSDoc
- UnitConfig reused from shared inventory.types.ts
- Types exported from index.ts

**Dependencies:** 1.1.1, 1.1.3

---

### 4.2 Component Implementation

**[x] Task 4.2.1: Implement quantity-input scaffold**

Create component implementing ControlValueAccessor:

```typescript
@Component({
  selector: 'ax-quantity-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxQuantityInputComponent),
      multi: true,
    },
  ],
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
})
export class AxQuantityInputComponent implements ControlValueAccessor {
  // Two-way binding
  value = model.required<number>();

  // Inputs
  baseUnit = input.required<string>();
  availableUnits = input.required<UnitConfig[]>();
  min = input<number>(0);
  max = input<number>(Infinity);
  step = input<number>(1);
  showStepper = input<boolean>(true);
  showPresets = input<boolean>(false);
  decimalPlaces = input<number>(0);
  disabled = input<boolean>(false);

  // Outputs
  valueChange = output<number>();
  unitChange = output<string>();
  onValidation = output<ValidationState>();

  // Internal state
  private selectedUnit = signal<string>('');
  private isTouched = signal<boolean>(false);

  // ControlValueAccessor
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
}
```

**Acceptance Criteria:**

- Component implements ControlValueAccessor
- All required inputs defined
- NG_VALUE_ACCESSOR provider configured
- Model signal for two-way binding

**Dependencies:** 4.1.1

---

**[x] Task 4.2.2: Implement unit conversion logic**

Add conversion computed signals:

```typescript
selectedUnitConfig = computed(() => {
  const units = this.availableUnits();
  const selected = this.selectedUnit();
  return units.find(u => u.code === selected) || units[0];
});

displayValue = computed(() => {
  const val = this.value();
  const unit = this.selectedUnitConfig();
  if (!unit) return val;
  return val / unit.conversionRate;
});

conversionHint = computed(() => {
  const val = this.value();
  const baseUnit = this.baseUnit();
  const currentUnit = this.selectedUnit();

  if (currentUnit === baseUnit) return '';

  const config = this.selectedUnitConfig();
  if (!config) return '';

  return `= ${val} ${baseUnit}  (${config.conversionRate} ${baseUnit} per ${config.label})`;
});

private convertToBaseUnit(displayValue: number, fromUnit: string): number {
  const unitConfig = this.availableUnits().find(u => u.code === fromUnit);
  if (!unitConfig) return displayValue;
  return displayValue * unitConfig.conversionRate;
}

private convertFromBaseUnit(baseValue: number, toUnit: string): number {
  const unitConfig = this.availableUnits().find(u => u.code === toUnit);
  if (!unitConfig) return baseValue;
  return baseValue / unitConfig.conversionRate;
}

onUnitChange(newUnit: string) {
  this.selectedUnit.set(newUnit);
  this.unitChange.emit(newUnit);
}
```

**Acceptance Criteria:**

- Conversion calculations correct
- Display value updates when unit changes
- Base value remains constant during unit changes
- Conversion hint displays correctly

**Dependencies:** 4.2.1

---

**[x] Task 4.2.3: Implement validation logic**

Add validation computed signals:

```typescript
validationErrors = computed(() => {
  const val = this.value();
  const errors: ValidationError[] = [];

  if (val < this.min()) {
    errors.push({
      type: 'min',
      message: `Minimum value is ${this.min()}`,
    });
  }

  if (val > this.max()) {
    errors.push({
      type: 'max',
      message: `Maximum value is ${this.max()}`,
    });
  }

  const dp = this.decimalPlaces();
  const decimals = (val.toString().split('.')[1] || '').length;
  if (decimals > dp) {
    errors.push({
      type: 'decimal',
      message: `Maximum ${dp} decimal places`,
    });
  }

  const baseUnitConfig = this.availableUnits().find((u) => u.code === this.baseUnit());
  if (baseUnitConfig?.decimalPlaces === 0 && !Number.isInteger(val)) {
    errors.push({
      type: 'integer',
      message: `${this.baseUnit()} must be a whole number`,
    });
  }

  return errors;
});

isValid = computed(() => this.validationErrors().length === 0);
```

**Acceptance Criteria:**

- Min/max validation works
- Decimal places validation works
- Integer validation for whole-number units
- Validation errors emitted via output

**Dependencies:** 4.2.2

---

**[x] Task 4.2.4: Implement stepper and preset logic**

Add increment/decrement and preset multipliers:

```typescript
increment() {
  if (this.disabled()) return;

  const currentDisplay = this.displayValue();
  const step = this.step();
  const newDisplay = currentDisplay + step;

  const newValue = this.convertToBaseUnit(newDisplay, this.selectedUnit());
  this.updateValue(newValue);
}

decrement() {
  if (this.disabled()) return;

  const currentDisplay = this.displayValue();
  const step = this.step();
  const newDisplay = Math.max(currentDisplay - step, 0);

  const newValue = this.convertToBaseUnit(newDisplay, this.selectedUnit());
  this.updateValue(newValue);
}

multiplyValue(multiplier: number) {
  if (this.disabled()) return;
  const newValue = this.value() * multiplier;
  this.updateValue(newValue);
}

private updateValue(newValue: number) {
  const min = this.min();
  const max = this.max();

  const clampedValue = Math.max(min, Math.min(max, newValue));

  const dp = this.decimalPlaces();
  const roundedValue = Math.round(clampedValue * Math.pow(10, dp)) / Math.pow(10, dp);

  this.value.set(roundedValue);
  this.valueChange.emit(roundedValue);
  this.onChange(roundedValue);

  this.onValidation.emit({
    valid: this.isValid(),
    errors: this.validationErrors()
  });
}
```

**Acceptance Criteria:**

- Increment/decrement buttons work
- Values clamped to min/max
- Decimal rounding applied
- Preset multipliers (×10, ×100) work
- Cannot go below minimum

**Dependencies:** 4.2.3

---

**[x] Task 4.2.5: Implement ControlValueAccessor methods**

Add forms integration:

```typescript
writeValue(value: number): void {
  this.value.set(value || 0);
}

registerOnChange(fn: (value: number) => void): void {
  this.onChange = fn;
}

registerOnTouched(fn: () => void): void {
  this.onTouched = fn;
}

setDisabledState(isDisabled: boolean): void {
  this.disabled.set(isDisabled);
}

onBlur() {
  this.isTouched.set(true);
  this.onTouched();
}

onInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const displayValue = parseFloat(input.value) || 0;
  const baseValue = this.convertToBaseUnit(displayValue, this.selectedUnit());
  this.updateValue(baseValue);
}
```

**Acceptance Criteria:**

- Component works with FormControl
- Component works with ngModel
- Disabled state works
- Touched state tracked
- Value changes propagate to form

**Dependencies:** 4.2.4

---

**[x] Task 4.2.6: Create quantity-input template**

Implement HTML template:

**Acceptance Criteria:**

- Stepper buttons render conditionally
- Input field binds correctly
- Unit dropdown works
- Preset buttons appear conditionally
- Conversion hint displays
- Error messages show when invalid

**Dependencies:** 4.2.5

---

**[x] Task 4.2.7: Implement quantity-input styles**

Create SCSS styles:

**Acceptance Criteria:**

- Styles match design
- Disabled state styled
- Error state styled
- Responsive layout

**Dependencies:** 4.2.6

---

### 4.3 Testing

**[x] Task 4.3.1: Write unit tests for quantity-input**

Create comprehensive tests:

```typescript
describe('AxQuantityInputComponent', () => {
  it('should convert between units correctly', () => {
    component.baseUnit.set('pieces');
    component.availableUnits.set([
      { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
      { code: 'box', label: 'Box', conversionRate: 12, decimalPlaces: 0 },
    ]);
    component.selectedUnit.set('box');
    component.value.set(144);

    expect(component.displayValue()).toBe(12);
  });

  it('should increment value', () => {
    component.value.set(10);
    component.step.set(1);
    component.increment();
    expect(component.value()).toBe(11);
  });

  it('should decrement value', () => {
    component.value.set(10);
    component.step.set(1);
    component.decrement();
    expect(component.value()).toBe(9);
  });

  it('should not go below minimum', () => {
    component.value.set(1);
    component.min.set(0);
    component.decrement();
    expect(component.value()).toBeGreaterThanOrEqual(0);
  });

  it('should validate min value', () => {
    component.min.set(10);
    component.value.set(5);
    expect(component.isValid()).toBe(false);
    expect(component.validationErrors().some((e) => e.type === 'min')).toBe(true);
  });

  it('should validate max value', () => {
    component.max.set(100);
    component.value.set(150);
    expect(component.isValid()).toBe(false);
    expect(component.validationErrors().some((e) => e.type === 'max')).toBe(true);
  });

  it('should validate decimal places', () => {
    component.decimalPlaces.set(2);
    component.value.set(10.12345);
    expect(component.validationErrors().some((e) => e.type === 'decimal')).toBe(true);
  });

  it('should multiply by preset', () => {
    component.value.set(10);
    component.multiplyValue(10);
    expect(component.value()).toBe(100);
  });

  it('should work with FormControl', () => {
    const control = new FormControl(10);
    component.writeValue(10);
    expect(component.value()).toBe(10);
  });
});
```

**Acceptance Criteria:**

- All tests pass
- Code coverage ≥80%
- Unit conversion tested
- Validation tested
- Forms integration tested

**Dependencies:** 4.2.7

---

## Phase 5: Batch Selector Component

### 5.1 Types & Interfaces

**[x] Task 5.1.1: Create batch-selector.types.ts**

```typescript
/**
 * Selected batch with quantity
 */
export interface SelectedBatch {
  batch: BatchInfo;
  quantity: number;
}

/**
 * Batch selection result
 */
export interface BatchSelection {
  batches: SelectedBatch[];
  totalQuantity: number;
  strategy: InventoryStrategy;
}

/**
 * Expiry status
 */
export type ExpiryStatus = 'safe' | 'warning' | 'critical' | 'expired';
```

**Acceptance Criteria:**

- Types documented
- BatchInfo reused from shared types
- Types exported from index.ts

**Dependencies:** 1.1.1, 1.1.3

---

### 5.2 Component Implementation

**[x] Task 5.2.1: Implement batch-selector scaffold**

Create component structure:

```typescript
@Component({
  selector: 'ax-batch-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatProgressSpinnerModule, AxBadgeComponent, AxQuantityInputComponent],
  templateUrl: './batch-selector.component.html',
  styleUrls: ['./batch-selector.component.scss'],
})
export class AxBatchSelectorComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Inputs
  productId = input.required<string>();
  batches = input<BatchInfo[]>([]);
  strategy = model<InventoryStrategy>('fefo');
  allowMultiple = input<boolean>(false);
  requestedQuantity = input<number | undefined>(undefined);
  showExpiry = input<boolean>(true);
  showManufacturing = input<boolean>(false);
  showRecommendation = input<boolean>(true);
  expiryWarningDays = input<number>(30);
  expiryCriticalDays = input<number>(7);

  // Outputs
  onSelect = output<BatchSelection>();
  onBatchesLoad = output<BatchInfo[]>();
  onError = output<string>();

  // Internal state
  private internalBatches = signal<BatchInfo[]>([]);
  private selectedBatches = signal<SelectedBatch[]>([]);
  private searchTerm = signal<string>('');
  private isLoading = signal<boolean>(false);
}
```

**Acceptance Criteria:**

- Component compiles
- HttpClient injected
- All inputs/outputs defined
- Internal state signals declared

**Dependencies:** 5.1.1

---

**[x] Task 5.2.2: Implement batch sorting strategies**

Add sorting logic:

```typescript
sortedBatches = computed(() => {
  const batches = [...this.internalBatches()];
  const strategy = this.strategy();

  switch (strategy) {
    case 'fifo':
      return batches.sort((a, b) => {
        const dateA = a.manufacturingDate?.getTime() || 0;
        const dateB = b.manufacturingDate?.getTime() || 0;
        return dateA - dateB;
      });
    case 'fefo':
      return batches.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
    case 'lifo':
      return batches.sort((a, b) => {
        const dateA = a.manufacturingDate?.getTime() || 0;
        const dateB = b.manufacturingDate?.getTime() || 0;
        return dateB - dateA;
      });
  }
});

filteredBatches = computed(() => {
  let batches = this.sortedBatches();
  const term = this.searchTerm().toLowerCase();

  if (term) {
    batches = batches.filter((b) => b.batchNumber.toLowerCase().includes(term) || b.lotNumber?.toLowerCase().includes(term));
  }

  return batches;
});

recommendedBatchId = computed(() => {
  if (!this.showRecommendation()) return null;

  const available = this.sortedBatches().filter((b) => b.status === 'available' && !this.isExpired(b));

  return available[0]?.batchNumber || null;
});
```

**Acceptance Criteria:**

- FIFO sorts by manufacturing date ascending
- FEFO sorts by expiry date ascending
- LIFO sorts by manufacturing date descending
- Search filters by batch/lot number
- Recommended batch identified correctly

**Dependencies:** 5.2.1

---

**[x] Task 5.2.3: Implement expiry status logic**

Add expiry calculations:

```typescript
getExpiryStatus(batch: BatchInfo): ExpiryStatus {
  const now = new Date();
  const expiry = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= this.expiryCriticalDays()) return 'critical';
  if (daysUntilExpiry <= this.expiryWarningDays()) return 'warning';
  return 'safe';
}

getExpiryBadgeText(batch: BatchInfo): string {
  const status = this.getExpiryStatus(batch);
  const now = new Date();
  const expiry = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (status) {
    case 'expired':
      return `EXPIRED ${Math.abs(daysUntilExpiry)} days ago`;
    case 'critical':
      return `${daysUntilExpiry} days left`;
    case 'warning':
      return `${daysUntilExpiry} days left`;
    case 'safe':
      return `Expires in ${daysUntilExpiry} days`;
  }
}

isExpired(batch: BatchInfo): boolean {
  return this.getExpiryStatus(batch) === 'expired';
}

canSelectBatch(batch: BatchInfo): boolean {
  return batch.status === 'available' && !this.isExpired(batch);
}
```

**Acceptance Criteria:**

- Expiry status calculated correctly
- Badge text shows countdown
- Expired batches identified
- Unavailable batches cannot be selected

**Dependencies:** 5.2.2

---

**[x] Task 5.2.4: Implement batch selection logic**

Add selection handling:

```typescript
totalSelectedQuantity = computed(() => {
  return this.selectedBatches().reduce((sum, sb) => sum + sb.quantity, 0);
});

canSelectMore = computed(() => {
  if (!this.allowMultiple()) return true;
  const requested = this.requestedQuantity();
  if (!requested) return true;
  return this.totalSelectedQuantity() < requested;
});

selectBatch(batch: BatchInfo, quantity?: number) {
  if (!this.canSelectBatch(batch)) {
    this.onError.emit(`Cannot select batch ${batch.batchNumber}: ${batch.status}`);
    return;
  }

  const selected = this.selectedBatches();

  if (this.allowMultiple()) {
    const existing = selected.find(s => s.batch.batchNumber === batch.batchNumber);

    if (existing) {
      const newSelected = selected.map(s =>
        s.batch.batchNumber === batch.batchNumber
          ? { ...s, quantity: quantity || s.quantity }
          : s
      );
      this.selectedBatches.set(newSelected);
    } else {
      const defaultQty = quantity || Math.min(
        batch.availableQuantity,
        (this.requestedQuantity() || batch.availableQuantity) - this.totalSelectedQuantity()
      );

      this.selectedBatches.set([...selected, { batch, quantity: defaultQty }]);
    }
  } else {
    this.selectedBatches.set([{
      batch,
      quantity: quantity || batch.availableQuantity
    }]);
  }

  this.emitSelection();
}

deselectBatch(batchNumber: string) {
  const selected = this.selectedBatches().filter(
    s => s.batch.batchNumber !== batchNumber
  );
  this.selectedBatches.set(selected);
  this.emitSelection();
}

isSelected(batch: BatchInfo): boolean {
  return this.selectedBatches().some(
    s => s.batch.batchNumber === batch.batchNumber
  );
}

updateBatchQuantity(batch: BatchInfo, quantity: number) {
  const selected = this.selectedBatches().map(s =>
    s.batch.batchNumber === batch.batchNumber
      ? { ...s, quantity }
      : s
  );
  this.selectedBatches.set(selected);
  this.emitSelection();
}

private emitSelection() {
  const selection: BatchSelection = {
    batches: this.selectedBatches(),
    totalQuantity: this.totalSelectedQuantity(),
    strategy: this.strategy()
  };
  this.onSelect.emit(selection);
}
```

**Acceptance Criteria:**

- Single-select mode works
- Multi-select mode works
- Quantity per batch can be specified
- Total quantity calculated correctly
- Cannot exceed requested quantity
- Selection state tracked

**Dependencies:** 5.2.3

---

**[x] Task 5.2.5: Implement API integration**

Add batch loading from API:

```typescript
private readonly apiUrl = '/api/inventory/products';

async ngOnInit() {
  if (!this.batches().length && this.productId()) {
    await this.loadBatches();
  } else {
    this.internalBatches.set(this.batches());
  }
}

private async loadBatches() {
  this.isLoading.set(true);

  try {
    const response = await firstValueFrom(
      this.http.get<{ batches: BatchInfo[], strategy: string }>(
        `${this.apiUrl}/${this.productId()}/batches`,
        {
          params: {
            status: 'available'
          }
        }
      )
    );

    this.internalBatches.set(response.batches);
    this.onBatchesLoad.emit(response.batches);

    if (response.strategy) {
      this.strategy.set(response.strategy as InventoryStrategy);
    }
  } catch (error: any) {
    this.onError.emit(`Failed to load batches: ${error.message}`);
  } finally {
    this.isLoading.set(false);
  }
}
```

**Acceptance Criteria:**

- API called on init if no batches provided
- Loading state shown during fetch
- Error handled gracefully
- Batches loaded and sorted
- Strategy from API applied

**Dependencies:** 5.2.4

---

**[x] Task 5.2.6: Create batch-selector template**

Implement HTML template with batch cards:

**Acceptance Criteria:**

- Search input works
- Strategy selector works
- Batch cards display all information
- Loading state shown
- Empty state shown
- Selected batches summary shown

**Dependencies:** 5.2.5

---

**[x] Task 5.2.7: Implement batch-selector styles**

Create SCSS styles:

**Acceptance Criteria:**

- Card layout responsive
- Expiry badges color-coded
- Recommended batch highlighted
- Selected batch highlighted
- Disabled/expired batches grayed out

**Dependencies:** 5.2.6

---

### 5.3 Testing

**[x] Task 5.3.1: Write unit tests for batch-selector**

Create comprehensive tests:

```typescript
describe('AxBatchSelectorComponent', () => {
  it('should sort batches by FEFO', () => {
    component.strategy.set('fefo');
    component.internalBatches.set([
      { batchNumber: 'B1', expiryDate: new Date('2025-06-01'), ...mockBatch },
      { batchNumber: 'B2', expiryDate: new Date('2025-03-01'), ...mockBatch },
      { batchNumber: 'B3', expiryDate: new Date('2025-09-01'), ...mockBatch },
    ]);

    const sorted = component.sortedBatches();
    expect(sorted[0].batchNumber).toBe('B2');
  });

  it('should calculate expiry status correctly', () => {
    const safeBatch = {
      ...mockBatch,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    };
    expect(component.getExpiryStatus(safeBatch)).toBe('safe');

    const warningBatch = {
      ...mockBatch,
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    };
    expect(component.getExpiryStatus(warningBatch)).toBe('warning');

    const criticalBatch = {
      ...mockBatch,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };
    expect(component.getExpiryStatus(criticalBatch)).toBe('critical');
  });

  it('should select batch in single-select mode', () => {
    component.allowMultiple.set(false);
    component.selectBatch(mockBatch);
    expect(component.selectedBatches().length).toBe(1);
  });

  it('should allow multiple batches in multi-select mode', () => {
    component.allowMultiple.set(true);
    component.selectBatch(mockBatch1);
    component.selectBatch(mockBatch2);
    expect(component.selectedBatches().length).toBe(2);
  });

  it('should calculate total quantity', () => {
    component.selectedBatches.set([
      { batch: mockBatch1, quantity: 50 },
      { batch: mockBatch2, quantity: 75 },
    ]);
    expect(component.totalSelectedQuantity()).toBe(125);
  });

  it('should recommend first available batch', () => {
    component.internalBatches.set([
      { ...mockBatch1, batchNumber: 'B1', status: 'available' },
      { ...mockBatch2, batchNumber: 'B2', status: 'available' },
    ]);
    expect(component.recommendedBatchId()).toBe('B1');
  });

  it('should filter by search term', () => {
    component.internalBatches.set([
      { ...mockBatch, batchNumber: 'BATCH-001' },
      { ...mockBatch, batchNumber: 'BATCH-002' },
    ]);
    component.searchTerm.set('001');
    expect(component.filteredBatches().length).toBe(1);
  });
});
```

**Acceptance Criteria:**

- All tests pass
- Code coverage ≥80%
- Sorting strategies tested
- Expiry calculations tested
- Selection logic tested

**Dependencies:** 5.2.7

---

## Phase 6: Integration & Testing

### 6.1 Component Integration

**[ ] Task 6.1.1: Create example integration page**

Create demo page showing all components working together:

**Acceptance Criteria:**

- Stock receive flow example
- All 4 components integrated
- Data flows between components
- Form validation works end-to-end

**Dependencies:** 2.3.2, 3.3.1, 4.3.1, 5.3.1

---

**[ ] Task 6.1.2: Write integration tests**

Create integration tests for component interactions:

**Acceptance Criteria:**

- Full stock receive flow tested
- Component communication tested
- State management tested
- API integration tested

**Dependencies:** 6.1.1

---

### 6.2 E2E Testing

**[ ] Task 6.2.1: Write Playwright E2E tests**

Create end-to-end tests:

```typescript
test('Complete stock receive flow', async ({ page }) => {
  await page.goto('/inventory/receive');

  // Scan barcode
  await page.click('[data-testid="barcode-scanner-trigger"]');
  await page.fill('input[placeholder="Enter barcode..."]', '8850999320113');
  await page.press('input[placeholder="Enter barcode..."]', 'Enter');

  // Select batch
  await page.click('[data-testid="batch-card"]:first-child');

  // Enter quantity
  await page.fill('input[aria-label="Quantity"]', '100');

  // Verify stock preview
  const preview = await page.textContent('[data-testid="stock-preview"]');
  expect(preview).toContain('200'); // Assuming current was 100

  // Submit
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

**Acceptance Criteria:**

- E2E test covers full flow
- Tests run in CI/CD
- Screenshots on failure
- Tests pass consistently

**Dependencies:** 6.1.2

---

### 6.3 Performance Testing

**[ ] Task 6.3.1: Measure component performance**

Test component rendering and bundle size:

**Acceptance Criteria:**

- Stock Level: <100ms render, <5KB gzipped
- Barcode Scanner: <500ms camera init, <25KB gzipped (with ZXing lazy loaded)
- Quantity Input: <100ms render, <8KB gzipped
- Batch Selector: <300ms API + render, <15KB gzipped
- All components meet performance targets

**Dependencies:** 6.2.1

---

**[ ] Task 6.3.2: Optimize bundle sizes**

Apply optimizations if needed:

**Acceptance Criteria:**

- Lazy loading implemented for ZXing
- Tree shaking verified
- No duplicate dependencies
- Code splitting effective

**Dependencies:** 6.3.1

---

## Phase 7: Documentation & Deployment

### 7.1 Component Documentation

**[x] Task 7.1.1: Write API documentation**

Document each component's public API:

**Acceptance Criteria:**

- All inputs/outputs documented
- Usage examples provided
- Type definitions linked
- Accessibility notes included

**Dependencies:** 6.3.2

---

**[ ] Task 7.1.2: Create Storybook stories**

Add interactive documentation:

**Acceptance Criteria:**

- Story for each component
- Multiple examples per component
- Controls for all inputs
- Accessibility checks pass

**Dependencies:** 7.1.1

---

**[x] Task 7.1.3: Update changelog**

Document new components in CHANGELOG:

**Acceptance Criteria:**

- Version bumped appropriately
- All 4 components listed under "Added"
- Breaking changes noted (if any)
- Migration guide provided (if needed)

**Dependencies:** 7.1.2

---

### 7.2 Deployment

**[ ] Task 7.2.1: Build and test production bundle**

**Acceptance Criteria:**

- `pnpm nx build aegisx-ui` succeeds
- No build warnings
- Bundle analysis clean
- Types generated correctly

**Dependencies:** 7.1.3

---

**[ ] Task 7.2.2: Publish to npm (if standalone library)**

**Acceptance Criteria:**

- Version number correct
- All files included in package
- README updated
- Published successfully

**Dependencies:** 7.2.1

---

**[x] Task 7.2.3: Update project documentation**

Update main project docs:

**Acceptance Criteria:**

- Component catalog updated
- Type catalog includes new types
- Index.ts exports verified
- Examples in documentation

**Dependencies:** 7.2.2

---

## Summary

**Total Tasks:** 85
**Estimated Duration:** 4 weeks (with parallel work)

### Task Breakdown by Phase:

- Phase 1 (Foundation): 4 tasks
- Phase 2 (Stock Level): 8 tasks
- Phase 3 (Barcode Scanner): 13 tasks
- Phase 4 (Quantity Input): 14 tasks
- Phase 5 (Batch Selector): 16 tasks
- Phase 6 (Integration & Testing): 8 tasks
- Phase 7 (Documentation): 6 tasks

### Critical Path:

1. Foundation setup (1.1.1 → 1.1.2 → 1.1.3 → 1.1.4)
2. Component implementation (parallel after foundation)
3. Integration testing (after all components done)
4. Documentation and deployment

---

_Tasks Version: 1.0_
_Last Updated: 2025-12-18_
_Status: Ready for Implementation_
