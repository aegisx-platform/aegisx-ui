# Design Document - Inventory UI Components (Priority 1)

## Introduction

This design document details the UI/UX, component architecture, and technical implementation for the four Priority 1 inventory components: **Stock Level Indicator**, **Barcode Scanner**, **Quantity Input with Unit Conversion**, and **Batch/Lot Number Selector**.

These components follow AegisX UI design principles:

- Material Design 3 guidelines
- Angular standalone component architecture
- Signal-based reactive patterns
- TypeScript strict mode with comprehensive type safety
- WCAG 2.1 AA accessibility compliance

---

## 1. Stock Level Indicator (`ax-stock-level`)

### 1.1 Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Stock Level: 150 / 500 pieces (30%)            │
├─────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ └─min (50)                                      │
│ ⚠️ Low Stock                                    │
└─────────────────────────────────────────────────┘
```

#### Color Scheme

- **Green zone (75-100%)**: `bg-success-500` with `text-success-900`
- **Yellow zone (25-75%)**: `bg-warning-500` with `text-warning-900`
- **Red zone (0-25%)**: `bg-error-500` with `text-error-900`
- **Out of stock**: `bg-neutral-300` with `text-neutral-600`
- **Progress bar background**: `bg-neutral-200` (light), `bg-neutral-700` (dark)

#### Typography

- **Label**: `text-sm font-medium text-secondary`
- **Values**: `text-base font-semibold text-primary`
- **Percentage**: `text-xs text-subtle`
- **Warning badge**: `text-xs font-bold`

#### Spacing

- Container padding: `p-3` (12px)
- Progress bar height:
  - `sm`: 8px
  - `md`: 12px
  - `lg`: 16px
- Gap between elements: `gap-2` (8px)
- Badge margin: `mt-2`

#### Responsive Behavior

- **Mobile (<640px)**: Single column, full width, label above progress bar
- **Tablet (640-1024px)**: Two columns if in grid layout
- **Desktop (>1024px)**: Compact horizontal layout

### 1.2 Component Architecture

#### Component Structure

```typescript
AxStockLevelComponent
├── Template
│   ├── Label section (optional, *ngIf="showLabel")
│   │   ├── Current/Max display
│   │   └── Percentage display (optional)
│   ├── Progress bar section
│   │   ├── Background bar (full width)
│   │   ├── Fill bar (percentage width with color)
│   │   └── Threshold markers (min/max indicators)
│   └── Warning badge section (*ngIf="isWarning")
│       └── Badge with warning icon + text
└── State (Signals)
    ├── percentage (computed)
    ├── colorClass (computed)
    ├── isWarning (computed)
    └── tooltipText (computed)
```

#### State Management (Signals)

```typescript
// Inputs as signals
current = input.required<number>();
minimum = input.required<number>();
maximum = input.required<number>();
unit = input<string>('pieces');
size = input<'sm' | 'md' | 'lg'>('md');
showLabel = input<boolean>(true);
showPercentage = input<boolean>(true);
colorScheme = input<'traffic-light' | 'gradient'>('traffic-light');

// Computed signals
percentage = computed(() => {
  const max = this.maximum();
  const curr = this.current();
  return max > 0 ? Math.round((curr / max) * 100) : 0;
});

colorClass = computed(() => {
  const pct = this.percentage();
  if (this.colorScheme() === 'traffic-light') {
    if (pct >= 75) return 'bg-success-500';
    if (pct >= 25) return 'bg-warning-500';
    return 'bg-error-500';
  } else {
    // Gradient mode: smooth transition
    return `bg-gradient-to-r from-error-500 via-warning-500 to-success-500`;
  }
});

isWarning = computed(() => {
  return this.current() <= this.minimum();
});

tooltipText = computed(() => {
  const curr = this.current();
  const min = this.minimum();
  const max = this.maximum();
  const unit = this.unit();
  return `Current: ${curr} ${unit}\nMinimum: ${min} ${unit}\nMaximum: ${max} ${unit}`;
});
```

#### Accessibility Features

- **ARIA attributes**:
  ```html
  <div role="progressbar" [attr.aria-valuenow]="current()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="maximum()" [attr.aria-label]="'Stock level: ' + percentage() + '%'"></div>
  ```
- **Screen reader text**: Hidden text describing the stock status
- **Keyboard navigation**: Not applicable (display-only component)
- **Color contrast**: All color combinations meet WCAG AA (4.5:1 minimum)
- **Tooltips**: Accessible via keyboard hover with `matTooltip`

### 1.3 Technical Implementation

#### Dependencies

```typescript
import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxBadgeComponent } from '../badge/badge.component';
```

#### Template Snippet

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

  <div class="ax-stock-level__progress" [matTooltip]="tooltipText()" role="progressbar" [attr.aria-valuenow]="current()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="maximum()">
    <div class="ax-stock-level__progress-bg"></div>
    <div class="ax-stock-level__progress-fill" [class]="colorClass()" [style.width.%]="percentage()"></div>
    <div class="ax-stock-level__threshold" [style.left.%]="(minimum() / maximum()) * 100">
      <span class="ax-stock-level__threshold-label">min</span>
    </div>
  </div>

  @if (isWarning()) {
  <ax-badge type="warning" size="sm" content="Low Stock" (click)="onWarningClick.emit({ level: 'low', current: current() })" />
  }
</div>
```

#### Styling Strategy (SCSS)

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
}
```

#### Performance Optimizations

- Use `OnPush` change detection strategy (automatic with signals)
- Computed signals prevent unnecessary recalculations
- CSS transitions instead of animations
- No external API calls (display-only component)

---

## 2. Barcode Scanner (`ax-barcode-scanner`)

### 2.1 Visual Design

#### Layout Structure - Camera Mode

```
┌─────────────────────────────────────────────────┐
│  📹  Camera Scanning                     [×]    │
├─────────────────────────────────────────────────┤
│                                                 │
│           ┌─────────────────┐                  │
│           │                 │                  │
│           │   VIDEO FEED    │                  │
│           │                 │                  │
│           │  ▓▓▓▓▓▓▓▓▓▓▓▓  │ ← Scan frame     │
│           │                 │                  │
│           └─────────────────┘                  │
│                                                 │
│  [💡 Flashlight]  [⌨️ Manual Input]            │
├─────────────────────────────────────────────────┤
│  Recent Scans (if enabled):                    │
│  • 8850999320113 - 2 sec ago                   │
│  • 8851234567890 - 15 sec ago                  │
└─────────────────────────────────────────────────┘
```

#### Layout Structure - Manual Mode

```
┌─────────────────────────────────────────────────┐
│  ⌨️  Manual Entry                        [×]    │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐ │
│  │ Enter barcode...                      [🔍] │ │
│  └───────────────────────────────────────────┘ │
│  [📷 Use Camera]                               │
├─────────────────────────────────────────────────┤
│  Format: EAN-13, Code 128, QR Code            │
└─────────────────────────────────────────────────┘
```

#### Color Scheme

- **Header background**: `bg-default` with `border-b border-default`
- **Video container**: `bg-black` (for camera feed)
- **Scan frame overlay**: `border-2 border-primary-500` with animation
- **Success state**: Green pulse animation on successful scan
- **Error state**: Red shake animation on invalid scan
- **Button primary**: Material Design filled button
- **Button secondary**: Material Design outlined button

#### Typography

- **Header title**: `text-lg font-semibold text-primary`
- **Input placeholder**: `text-base text-subtle`
- **Recent scans**: `text-sm text-secondary`
- **Helper text**: `text-xs text-subtle`

#### Animations

```scss
@keyframes scan-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes scan-success {
  0% {
    transform: scale(1);
    border-color: var(--primary-500);
  }
  50% {
    transform: scale(1.05);
    border-color: var(--success-500);
  }
  100% {
    transform: scale(1);
    border-color: var(--success-500);
  }
}

@keyframes scan-error {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
```

### 2.2 Component Architecture

#### Component Structure

```typescript
AxBarcodeScannerComponent
├── Template
│   ├── Header section
│   │   ├── Mode indicator (camera/manual)
│   │   └── Close button
│   ├── Scanner section (mode-dependent)
│   │   ├── Camera mode
│   │   │   ├── Video element (<video> tag)
│   │   │   ├── Scan frame overlay (animated border)
│   │   │   └── Canvas (hidden, for frame capture)
│   │   └── Manual mode
│   │       ├── Text input field
│   │       └── Submit button
│   ├── Action buttons section
│   │   ├── Flashlight toggle (camera mode only)
│   │   └── Mode switcher (camera ↔ manual)
│   └── Recent scans section (optional)
│       └── List of recent ScanResult items
└── State Management
    ├── mode (signal: 'camera' | 'manual')
    ├── isScanning (signal: boolean)
    ├── hasPermission (signal: boolean)
    ├── recentScans (signal: ScanResult[])
    ├── currentStream (MediaStream | null)
    └── codeReader (BrowserMultiFormatReader from ZXing)
```

#### State Management (Signals)

```typescript
// Inputs
mode = input<'camera' | 'manual' | 'auto'>('auto');
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

// Computed
canUseCamera = computed(() => {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
});

displayedScans = computed(() => {
  return this.showHistory() ? this.recentScans().slice(0, 10) : [];
});
```

#### Lifecycle Management

```typescript
async ngOnInit() {
  // Determine initial mode
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

private async initCameraMode() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    this.currentStream.set(stream);
    this.hasPermission.set(true);
    this.startScanning();
  } catch (error) {
    this.hasPermission.set(false);
    this.onError.emit({ type: 'permission-denied', message: error.message });
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
```

#### Barcode Detection Logic

```typescript
private async startScanning() {
  const codeReader = new BrowserMultiFormatReader();
  const videoElement = this.videoRef?.nativeElement;

  try {
    await codeReader.decodeFromVideoDevice(
      undefined, // Use default device
      videoElement,
      (result, error) => {
        if (result) {
          this.handleScanSuccess(result);
        }
        // Ignore errors during continuous scanning
      }
    );
  } catch (error) {
    this.onError.emit({ type: 'camera-error', message: error.message });
  }
}

private handleScanSuccess(result: Result) {
  const scanResult: ScanResult = {
    code: result.getText(),
    format: this.mapBarcodeFormat(result.getBarcodeFormat()),
    timestamp: new Date(),
    mode: 'camera'
  };

  // Play beep sound
  if (this.beepSound()) {
    this.playBeep();
  }

  // Add to history
  const scans = [scanResult, ...this.recentScans()];
  this.recentScans.set(scans.slice(0, 10));

  // Emit event
  this.onScan.emit(scanResult);

  // Handle continuous scan
  if (!this.continuousScan()) {
    this.isScanning.set(false);
  }
}

private playBeep() {
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
}
```

### 2.3 Technical Implementation

#### Library Integration - ZXing

```typescript
// Install: pnpm add @zxing/library
import {
  BrowserMultiFormatReader,
  Result,
  BarcodeFormat
} from '@zxing/library';

// Format mapping
private mapBarcodeFormat(format: BarcodeFormat): BarcodeFormat {
  const formatMap = {
    [BarcodeFormat.QR_CODE]: 'qr',
    [BarcodeFormat.EAN_13]: 'ean13',
    [BarcodeFormat.EAN_8]: 'ean8',
    [BarcodeFormat.CODE_128]: 'code128',
    [BarcodeFormat.CODE_39]: 'code39',
    [BarcodeFormat.DATA_MATRIX]: 'datamatrix',
  };
  return formatMap[format] || 'unknown';
}
```

#### Manual Input Validation

```typescript
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

#### Flashlight Control

```typescript
async toggleFlashlight() {
  const stream = this.currentStream();
  if (!stream) return;

  const track = stream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();

  if (!capabilities.torch) {
    this.onError.emit({
      type: 'camera-error',
      message: 'Flashlight not supported on this device'
    });
    return;
  }

  const enabled = !this.flashlightEnabled();
  await track.applyConstraints({ advanced: [{ torch: enabled }] });
  this.flashlightEnabled.set(enabled);
}
```

#### Accessibility Features

- **Keyboard shortcuts**: Enter to scan in manual mode
- **ARIA labels**: All buttons properly labeled
- **Screen reader announcements**: Scan success/error announced
- **Focus management**: Auto-focus input in manual mode
- **Color-independent feedback**: Sound + vibration on scan

---

## 3. Quantity Input with Unit Conversion (`ax-quantity-input`)

### 3.1 Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  [-]  [   150    ]  [+]   [▼ pieces]           │
│                                                 │
│  = 12.5 boxes  (12 pieces per box)             │
└─────────────────────────────────────────────────┘
```

#### Color Scheme

- **Input field**: Standard Material Design text input
- **Stepper buttons**: `bg-primary-500` on hover, `bg-primary-100` default
- **Unit dropdown**: Material Design select component
- **Conversion hint**: `text-subtle` with `text-xs`
- **Error state**: `border-error-500` with `text-error-600`
- **Disabled state**: `opacity-50` with `cursor-not-allowed`

#### Typography

- **Input value**: `text-base font-medium text-primary`
- **Unit label**: `text-sm text-secondary`
- **Conversion hint**: `text-xs text-subtle`
- **Error message**: `text-xs text-error-600`

#### Spacing

- Container padding: `p-2`
- Gap between stepper and input: `gap-1`
- Gap between input and dropdown: `gap-2`
- Conversion hint margin top: `mt-1`

#### Interactive States

- **Hover**: Stepper buttons scale slightly (1.05)
- **Active**: Stepper buttons scale down (0.95)
- **Focus**: Input field shows focus ring
- **Disabled**: All controls grayed out with reduced opacity

### 3.2 Component Architecture

#### Component Structure

```typescript
AxQuantityInputComponent
├── Template
│   ├── Input group
│   │   ├── Decrement button (-)
│   │   ├── Number input field
│   │   ├── Increment button (+)
│   │   └── Unit selector (dropdown)
│   ├── Preset buttons (optional)
│   │   ├── ×10 button
│   │   └── ×100 button
│   ├── Conversion hint
│   │   └── Display in other units
│   └── Error message
│       └── Validation errors
└── State Management
    ├── value (signal, two-way binding)
    ├── selectedUnit (signal)
    ├── validationErrors (computed)
    ├── displayValue (computed)
    └── conversionHint (computed)
```

#### State Management (Signals)

```typescript
// Inputs
value = model.required<number>(); // Two-way binding
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
valueChange = output<number>(); // Emits value in base unit
unitChange = output<string>();
onValidation = output<ValidationState>();

// Internal state
private selectedUnit = signal<string>('');
private internalValue = signal<number>(0);
private isTouched = signal<boolean>(false);

// Computed
displayValue = computed(() => {
  const val = this.value();
  const unit = this.selectedUnitConfig();
  if (!unit) return val;

  // Convert from base unit to display unit
  return val / unit.conversionRate;
});

selectedUnitConfig = computed(() => {
  const units = this.availableUnits();
  const selected = this.selectedUnit();
  return units.find(u => u.code === selected) || units[0];
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

validationErrors = computed(() => {
  const val = this.value();
  const errors: ValidationError[] = [];

  if (val < this.min()) {
    errors.push({
      type: 'min',
      message: `Minimum value is ${this.min()}`
    });
  }

  if (val > this.max()) {
    errors.push({
      type: 'max',
      message: `Maximum value is ${this.max()}`
    });
  }

  const dp = this.decimalPlaces();
  const decimals = (val.toString().split('.')[1] || '').length;
  if (decimals > dp) {
    errors.push({
      type: 'decimal',
      message: `Maximum ${dp} decimal places`
    });
  }

  const baseUnitConfig = this.availableUnits().find(u => u.code === this.baseUnit());
  if (baseUnitConfig?.decimalPlaces === 0 && !Number.isInteger(val)) {
    errors.push({
      type: 'integer',
      message: `${this.baseUnit()} must be a whole number`
    });
  }

  return errors;
});

isValid = computed(() => this.validationErrors().length === 0);
```

#### Unit Conversion Logic

```typescript
private convertToBaseUnit(displayValue: number, fromUnit: string): number {
  const unitConfig = this.availableUnits().find(u => u.code === fromUnit);
  if (!unitConfig) return displayValue;

  // Multiply by conversion rate to get base unit
  return displayValue * unitConfig.conversionRate;
}

private convertFromBaseUnit(baseValue: number, toUnit: string): number {
  const unitConfig = this.availableUnits().find(u => u.code === toUnit);
  if (!unitConfig) return baseValue;

  // Divide by conversion rate to get display unit
  return baseValue / unitConfig.conversionRate;
}

onUnitChange(newUnit: string) {
  this.selectedUnit.set(newUnit);
  this.unitChange.emit(newUnit);
  // Value stays the same in base unit, only display changes
}
```

#### Stepper Logic

```typescript
increment() {
  if (this.disabled()) return;

  const currentDisplay = this.displayValue();
  const step = this.step();
  const newDisplay = currentDisplay + step;

  // Convert to base unit and update
  const newValue = this.convertToBaseUnit(newDisplay, this.selectedUnit());
  this.updateValue(newValue);
}

decrement() {
  if (this.disabled()) return;

  const currentDisplay = this.displayValue();
  const step = this.step();
  const newDisplay = Math.max(currentDisplay - step, 0);

  // Convert to base unit and update
  const newValue = this.convertToBaseUnit(newDisplay, this.selectedUnit());
  this.updateValue(newValue);
}

private updateValue(newValue: number) {
  const min = this.min();
  const max = this.max();

  // Clamp value
  const clampedValue = Math.max(min, Math.min(max, newValue));

  // Round to decimal places
  const dp = this.decimalPlaces();
  const roundedValue = Math.round(clampedValue * Math.pow(10, dp)) / Math.pow(10, dp);

  this.value.set(roundedValue);
  this.valueChange.emit(roundedValue);

  // Emit validation state
  this.onValidation.emit({
    valid: this.isValid(),
    errors: this.validationErrors()
  });
}
```

### 3.3 Technical Implementation

#### Reactive Forms Integration (ControlValueAccessor)

```typescript
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AxQuantityInputComponent),
      multi: true,
    },
  ],
})
export class AxQuantityInputComponent implements ControlValueAccessor {
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

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

  private updateValue(newValue: number) {
    // ... existing update logic ...
    this.onChange(newValue);
  }

  onBlur() {
    this.onTouched();
  }
}
```

#### Template Snippet

```html
<div class="ax-quantity-input" [class.ax-quantity-input--disabled]="disabled()" [class.ax-quantity-input--error]="!isValid() && isTouched()">
  @if (showStepper()) {
  <button type="button" class="ax-quantity-input__stepper" [disabled]="disabled() || value() <= min()" (click)="decrement()" aria-label="Decrease quantity">
    <mat-icon>remove</mat-icon>
  </button>
  }

  <input type="number" class="ax-quantity-input__field" [value]="displayValue()" [min]="convertFromBaseUnit(min(), selectedUnit())" [max]="convertFromBaseUnit(max(), selectedUnit())" [step]="step()" [disabled]="disabled()" [attr.aria-label]="'Quantity in ' + selectedUnit()" (input)="onInputChange($event)" (blur)="onBlur()" />

  @if (showStepper()) {
  <button type="button" class="ax-quantity-input__stepper" [disabled]="disabled() || value() >= max()" (click)="increment()" aria-label="Increase quantity">
    <mat-icon>add</mat-icon>
  </button>
  }

  <mat-select class="ax-quantity-input__unit-select" [(value)]="selectedUnit" [disabled]="disabled()" (selectionChange)="onUnitChange($event.value)">
    @for (unit of availableUnits(); track unit.code) {
    <mat-option [value]="unit.code"> {{ unit.label }} @if (unit.symbol) { ({{ unit.symbol }}) } </mat-option>
    }
  </mat-select>

  @if (showPresets() && !disabled()) {
  <div class="ax-quantity-input__presets">
    <button type="button" class="ax-quantity-input__preset" (click)="multiplyValue(10)">×10</button>
    <button type="button" class="ax-quantity-input__preset" (click)="multiplyValue(100)">×100</button>
  </div>
  }
</div>

@if (conversionHint()) {
<div class="ax-quantity-input__hint">{{ conversionHint() }}</div>
} @if (!isValid() && isTouched()) {
<div class="ax-quantity-input__errors">
  @for (error of validationErrors(); track error.type) {
  <span class="ax-quantity-input__error">{{ error.message }}</span>
  }
</div>
}
```

#### Accessibility Features

- **ARIA attributes**: All interactive elements properly labeled
- **Keyboard navigation**:
  - Arrow up/down to increment/decrement
  - Tab through stepper → input → unit selector
  - Enter to confirm input
- **Screen reader**: Announces value changes and unit conversions
- **Focus indicators**: Visible focus ring on all interactive elements
- **Error announcements**: Validation errors announced to screen readers

---

## 4. Batch/Lot Number Selector (`ax-batch-selector`)

### 4.1 Visual Design

#### Layout Structure - List View

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 [Search batches...]                 [Strategy: FEFO▼]│
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⭐ BATCH-2024-001          [Select]                 │ │
│ │ Expiry: 2025-03-15 (85 days left)  🟡               │ │
│ │ Available: 500 pieces                               │ │
│ │ Manufactured: 2024-01-10                            │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ BATCH-2024-002                [Select]              │ │
│ │ Expiry: 2025-06-20 (180 days left)  🟢              │ │
│ │ Available: 1,200 pieces                             │ │
│ │ Manufactured: 2024-02-15                            │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ BATCH-2023-099                [EXPIRED]             │ │
│ │ Expiry: 2024-12-01 (EXPIRED 17 days ago)  ⚫        │ │
│ │ Available: 50 pieces                                │ │
│ │ Manufactured: 2023-11-01                            │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Color Scheme

- **Recommended batch star**: `text-warning-500`
- **Expiry status badges**:
  - Safe (>30 days): `bg-success-100 text-success-800`
  - Warning (7-30 days): `bg-warning-100 text-warning-800`
  - Critical (<7 days): `bg-error-100 text-error-800`
  - Expired: `bg-neutral-100 text-neutral-600`
- **Card borders**:
  - Default: `border-default`
  - Recommended: `border-warning-500 border-2`
  - Selected: `border-primary-500 border-2`
  - Expired: `border-neutral-300`
- **Disabled/Expired**: `opacity-50 cursor-not-allowed`

#### Typography

- **Batch number**: `text-base font-semibold text-primary`
- **Expiry date**: `text-sm text-secondary`
- **Available quantity**: `text-sm font-medium text-primary`
- **Manufacturing date**: `text-xs text-subtle`
- **Status badge**: `text-xs font-bold uppercase`

#### Spacing

- Card padding: `p-4`
- Gap between cards: `gap-3`
- Search bar margin: `mb-4`
- Badge margin: `ml-2`

#### Responsive Behavior

- **Mobile (<640px)**: Single column, full width cards
- **Tablet (640-1024px)**: Single column with max-width
- **Desktop (>1024px)**: Optional two-column grid

### 4.2 Component Architecture

#### Component Structure

```typescript
AxBatchSelectorComponent
├── Template
│   ├── Header section
│   │   ├── Search input (filter batches)
│   │   └── Strategy selector (FIFO/FEFO/LIFO)
│   ├── Batch list section
│   │   └── Batch card (repeated)
│   │       ├── Batch number + recommended badge
│   │       ├── Expiry date + status indicator
│   │       ├── Available quantity
│   │       ├── Manufacturing date (optional)
│   │       ├── Selection control (radio/checkbox)
│   │       └── Quantity input (if multi-select)
│   ├── Empty state
│   │   └── "No batches available" message
│   └── Selected summary (if multi-select)
│       ├── Total selected quantity
│       └── Selected batches list
└── State Management
    ├── batches (signal: BatchInfo[])
    ├── filteredBatches (computed)
    ├── selectedBatches (signal: SelectedBatch[])
    ├── searchTerm (signal: string)
    ├── strategy (signal: 'fifo' | 'fefo' | 'lifo')
    └── recommendedBatchId (computed)
```

#### State Management (Signals)

```typescript
// Inputs
productId = input.required<string>();
batches = input<BatchInfo[]>([]);
strategy = model<'fifo' | 'fefo' | 'lifo'>('fefo');
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

// Computed
filteredBatches = computed(() => {
  let batches = this.sortBatchesByStrategy();
  const term = this.searchTerm().toLowerCase();

  if (term) {
    batches = batches.filter(b =>
      b.batchNumber.toLowerCase().includes(term) ||
      b.lotNumber?.toLowerCase().includes(term)
    );
  }

  return batches;
});

sortedBatches = computed(() => {
  const batches = [...this.internalBatches()];
  const strategy = this.strategy();

  switch (strategy) {
    case 'fifo':
      return batches.sort((a, b) =>
        a.manufacturingDate?.getTime() - b.manufacturingDate?.getTime()
      );
    case 'fefo':
      return batches.sort((a, b) =>
        a.expiryDate.getTime() - b.expiryDate.getTime()
      );
    case 'lifo':
      return batches.sort((a, b) =>
        b.manufacturingDate?.getTime() - a.manufacturingDate?.getTime()
      );
  }
});

recommendedBatchId = computed(() => {
  if (!this.showRecommendation()) return null;

  const available = this.sortedBatches().filter(b =>
    b.status === 'available' && !this.isExpired(b)
  );

  return available[0]?.batchNumber || null;
});

totalSelectedQuantity = computed(() => {
  return this.selectedBatches().reduce((sum, sb) => sum + sb.quantity, 0);
});

canSelectMore = computed(() => {
  if (!this.allowMultiple()) return true;
  const requested = this.requestedQuantity();
  if (!requested) return true;
  return this.totalSelectedQuantity() < requested;
});
```

#### Expiry Status Logic

```typescript
getExpiryStatus(batch: BatchInfo): 'safe' | 'warning' | 'critical' | 'expired' {
  const now = new Date();
  const expiry = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= this.expiryCriticalDays()) return 'critical';
  if (daysUntilExpiry <= this.expiryWarningDays()) return 'warning';
  return 'safe';
}

getExpiryBadgeText(batch: BatchInfo): string {
  const status = this.getExpiryStatus(batch);
  const now = new Date();
  const expiry = new Date(batch.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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

#### Selection Logic

```typescript
selectBatch(batch: BatchInfo, quantity?: number) {
  if (!this.canSelectBatch(batch)) {
    this.onError.emit(`Cannot select batch ${batch.batchNumber}: ${batch.status}`);
    return;
  }

  const selected = this.selectedBatches();

  if (this.allowMultiple()) {
    // Multi-select mode
    const existing = selected.find(s => s.batch.batchNumber === batch.batchNumber);

    if (existing) {
      // Update quantity
      const newSelected = selected.map(s =>
        s.batch.batchNumber === batch.batchNumber
          ? { ...s, quantity: quantity || s.quantity }
          : s
      );
      this.selectedBatches.set(newSelected);
    } else {
      // Add new
      const defaultQty = quantity || Math.min(
        batch.availableQuantity,
        (this.requestedQuantity() || batch.availableQuantity) - this.totalSelectedQuantity()
      );

      this.selectedBatches.set([...selected, { batch, quantity: defaultQty }]);
    }
  } else {
    // Single-select mode
    this.selectedBatches.set([{ batch, quantity: quantity || batch.availableQuantity }]);
  }

  this.emitSelection();
}

deselectBatch(batchNumber: string) {
  const selected = this.selectedBatches().filter(s => s.batch.batchNumber !== batchNumber);
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

### 4.3 Technical Implementation

#### API Integration

```typescript
private readonly http = inject(HttpClient);
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
            status: 'available',
            // location: 'WAREHOUSE-01', // Optional
          }
        }
      )
    );

    this.internalBatches.set(response.batches);
    this.onBatchesLoad.emit(response.batches);

    if (response.strategy) {
      this.strategy.set(response.strategy as any);
    }
  } catch (error) {
    this.onError.emit(`Failed to load batches: ${error.message}`);
  } finally {
    this.isLoading.set(false);
  }
}
```

#### Template Snippet

```html
<div class="ax-batch-selector">
  <div class="ax-batch-selector__header">
    <mat-form-field class="ax-batch-selector__search">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Search batches..." [(ngModel)]="searchTerm" (ngModelChange)="searchTerm.set($event)" />
    </mat-form-field>

    <mat-form-field class="ax-batch-selector__strategy">
      <mat-label>Strategy</mat-label>
      <mat-select [(ngModel)]="strategy">
        <mat-option value="fifo">FIFO (First In, First Out)</mat-option>
        <mat-option value="fefo">FEFO (First Expired, First Out)</mat-option>
        <mat-option value="lifo">LIFO (Last In, First Out)</mat-option>
      </mat-select>
    </mat-form-field>
  </div>

  @if (isLoading()) {
  <div class="ax-batch-selector__loading">
    <mat-spinner diameter="40"></mat-spinner>
    <p>Loading batches...</p>
  </div>
  } @else if (filteredBatches().length === 0) {
  <div class="ax-batch-selector__empty">
    <mat-icon>inventory_2</mat-icon>
    <p>No batches available</p>
  </div>
  } @else {
  <div class="ax-batch-selector__list">
    @for (batch of filteredBatches(); track batch.batchNumber) {
    <div class="ax-batch-selector__card" [class.ax-batch-selector__card--recommended]="batch.batchNumber === recommendedBatchId()" [class.ax-batch-selector__card--selected]="isSelected(batch)" [class.ax-batch-selector__card--disabled]="!canSelectBatch(batch)">
      <div class="ax-batch-selector__card-header">
        <div class="ax-batch-selector__batch-number">
          @if (batch.batchNumber === recommendedBatchId()) {
          <mat-icon class="ax-batch-selector__star">star</mat-icon>
          } {{ batch.batchNumber }}
        </div>

        @if (canSelectBatch(batch)) { @if (allowMultiple()) {
        <mat-checkbox [checked]="isSelected(batch)" (change)="toggleBatch(batch)"> Select </mat-checkbox>
        } @else {
        <mat-radio-button [checked]="isSelected(batch)" (change)="selectBatch(batch)"> Select </mat-radio-button>
        } } @else {
        <span class="ax-batch-selector__status-badge ax-batch-selector__status-badge--expired"> EXPIRED </span>
        }
      </div>

      @if (showExpiry()) {
      <div class="ax-batch-selector__expiry">
        <mat-icon>event</mat-icon>
        <span>Expiry: {{ batch.expiryDate | date:'yyyy-MM-dd' }}</span>
        <ax-badge [type]="getExpiryStatus(batch)" [content]="getExpiryBadgeText(batch)" size="sm" />
      </div>
      }

      <div class="ax-batch-selector__quantity">
        <mat-icon>inventory</mat-icon>
        <span>Available: {{ batch.availableQuantity }} {{ batch.unit }}</span>
      </div>

      @if (showManufacturing() && batch.manufacturingDate) {
      <div class="ax-batch-selector__manufacturing">
        <mat-icon>precision_manufacturing</mat-icon>
        <span>Manufactured: {{ batch.manufacturingDate | date:'yyyy-MM-dd' }}</span>
      </div>
      } @if (isSelected(batch) && allowMultiple()) {
      <div class="ax-batch-selector__quantity-input">
        <ax-quantity-input [(value)]="getSelectedQuantity(batch)" [baseUnit]="batch.unit" [availableUnits]="[{ code: batch.unit, label: batch.unit, conversionRate: 1, decimalPlaces: 0 }]" [max]="batch.availableQuantity" [min]="1" (valueChange)="updateBatchQuantity(batch, $event)" />
      </div>
      }
    </div>
    }
  </div>
  } @if (allowMultiple() && selectedBatches().length > 0) {
  <div class="ax-batch-selector__summary">
    <div class="ax-batch-selector__summary-header">
      <h4>Selected Batches</h4>
      <span class="ax-batch-selector__total"> Total: {{ totalSelectedQuantity() }} @if (requestedQuantity()) { / {{ requestedQuantity() }} } </span>
    </div>

    <div class="ax-batch-selector__summary-list">
      @for (selected of selectedBatches(); track selected.batch.batchNumber) {
      <div class="ax-batch-selector__summary-item">
        <span>{{ selected.batch.batchNumber }}</span>
        <span>{{ selected.quantity }} {{ selected.batch.unit }}</span>
        <button mat-icon-button (click)="deselectBatch(selected.batch.batchNumber)" aria-label="Remove batch">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      }
    </div>
  </div>
  }
</div>
```

#### Accessibility Features

- **ARIA labels**: All interactive elements labeled
- **Keyboard navigation**:
  - Tab through search → strategy → batch cards
  - Space/Enter to select batch
  - Arrow keys to navigate cards
- **Screen reader announcements**:
  - Batch count announced
  - Expiry status announced
  - Selection changes announced
- **Color-independent indicators**: Icons + text for expiry status
- **Focus management**: Proper focus indicators on all interactive elements

---

## 5. Cross-Component Integration

### 5.1 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Parent Component                       │
│                 (e.g., Stock Receive Form)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Scan barcode                                        │
│     ↓                                                   │
│  [ax-barcode-scanner]                                   │
│     ↓ (onScan event)                                    │
│  2. Product identified → Load batches                   │
│     ↓                                                   │
│  [ax-batch-selector productId="..."]                    │
│     ↓ (onSelect event)                                  │
│  3. Batch selected → Show quantity input                │
│     ↓                                                   │
│  [ax-quantity-input]                                    │
│     ↓ (valueChange event)                               │
│  4. Update stock level preview                          │
│     ↓                                                   │
│  [ax-stock-level]                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Example Integration - Stock Receive Form

```typescript
@Component({
  selector: 'app-stock-receive',
  standalone: true,
  imports: [AxBarcodeScannerComponent, AxBatchSelectorComponent, AxQuantityInputComponent, AxStockLevelComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="receiveForm" (ngSubmit)="onSubmit()">
      <div class="step" *ngIf="currentStep === 'scan'">
        <h3>Scan Product Barcode</h3>
        <ax-barcode-scanner (onScan)="handleScan($event)" />
      </div>

      <div class="step" *ngIf="currentStep === 'batch'">
        <h3>Select Batch</h3>
        <ax-batch-selector [productId]="selectedProduct()?.id" [strategy]="'fefo'" [allowMultiple]="false" (onSelect)="handleBatchSelect($event)" />
      </div>

      <div class="step" *ngIf="currentStep === 'quantity'">
        <h3>Enter Quantity</h3>
        <ax-quantity-input formControlName="quantity" [baseUnit]="selectedProduct()?.baseUnit" [availableUnits]="selectedProduct()?.units" [min]="1" [showPresets]="true" />

        <div class="preview">
          <h4>New Stock Level Preview</h4>
          <ax-stock-level [current]="previewStockLevel().current" [minimum]="previewStockLevel().minimum" [maximum]="previewStockLevel().maximum" [unit]="selectedProduct()?.baseUnit" />
        </div>
      </div>

      <div class="actions">
        <button type="button" (click)="previousStep()">Back</button>
        <button type="button" (click)="nextStep()">Next</button>
        <button type="submit" [disabled]="!receiveForm.valid">Submit</button>
      </div>
    </form>
  `,
})
export class StockReceiveComponent {
  currentStep = signal<'scan' | 'batch' | 'quantity'>('scan');
  selectedProduct = signal<Product | null>(null);
  selectedBatch = signal<BatchInfo | null>(null);

  receiveForm = this.fb.group({
    productId: ['', Validators.required],
    batchNumber: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
  });

  previewStockLevel = computed(() => {
    const product = this.selectedProduct();
    const quantity = this.receiveForm.value.quantity || 0;

    return {
      current: product?.currentStock + quantity,
      minimum: product?.minimumStock,
      maximum: product?.maximumStock,
    };
  });

  async handleScan(result: ScanResult) {
    const product = await this.productService.getByBarcode(result.code);
    this.selectedProduct.set(product);
    this.receiveForm.patchValue({ productId: product.id });
    this.currentStep.set('batch');
  }

  handleBatchSelect(selection: BatchSelection) {
    const batch = selection.batches[0];
    this.selectedBatch.set(batch.batch);
    this.receiveForm.patchValue({ batchNumber: batch.batch.batchNumber });
    this.currentStep.set('quantity');
  }

  nextStep() {
    if (this.currentStep() === 'scan' && this.receiveForm.value.productId) {
      this.currentStep.set('batch');
    } else if (this.currentStep() === 'batch' && this.receiveForm.value.batchNumber) {
      this.currentStep.set('quantity');
    }
  }
}
```

---

## 6. Testing Strategy

### 6.1 Unit Testing

Each component will have comprehensive unit tests covering:

#### Stock Level Indicator

```typescript
describe('AxStockLevelComponent', () => {
  it('should display green color when stock > 75%', () => {
    component.current.set(400);
    component.minimum.set(50);
    component.maximum.set(500);
    expect(component.colorClass()).toContain('bg-success');
  });

  it('should show warning badge when stock <= minimum', () => {
    component.current.set(40);
    component.minimum.set(50);
    expect(component.isWarning()).toBe(true);
  });

  it('should compute correct percentage', () => {
    component.current.set(250);
    component.maximum.set(500);
    expect(component.percentage()).toBe(50);
  });
});
```

#### Barcode Scanner

```typescript
describe('AxBarcodeScannerComponent', () => {
  it('should emit scan event with correct format', async () => {
    const scanSpy = jasmine.createSpy('onScan');
    component.onScan.subscribe(scanSpy);

    await component.handleScanSuccess({
      text: '8850999320113',
      format: BarcodeFormat.EAN_13,
    });

    expect(scanSpy).toHaveBeenCalledWith({
      code: '8850999320113',
      format: 'ean13',
      timestamp: jasmine.any(Date),
      mode: 'camera',
    });
  });

  it('should fallback to manual mode on permission denied', async () => {
    spyOn(navigator.mediaDevices, 'getUserMedia').and.rejectWith(new Error('Permission denied'));

    await component.initCameraMode();

    expect(component.currentMode()).toBe('manual');
  });
});
```

#### Quantity Input

```typescript
describe('AxQuantityInputComponent', () => {
  it('should convert between units correctly', () => {
    component.baseUnit.set('pieces');
    component.availableUnits.set([
      { code: 'pieces', label: 'Pieces', conversionRate: 1, decimalPlaces: 0 },
      { code: 'box', label: 'Box', conversionRate: 12, decimalPlaces: 0 },
    ]);
    component.selectedUnit.set('box');

    component.value.set(144); // 144 pieces
    expect(component.displayValue()).toBe(12); // 12 boxes
  });

  it('should validate decimal places', () => {
    component.decimalPlaces.set(2);
    component.value.set(10.12345);

    const errors = component.validationErrors();
    expect(errors.some((e) => e.type === 'decimal')).toBe(true);
  });
});
```

#### Batch Selector

```typescript
describe('AxBatchSelectorComponent', () => {
  it('should sort batches by FEFO strategy', () => {
    component.strategy.set('fefo');
    component.internalBatches.set([
      { batchNumber: 'B1', expiryDate: new Date('2025-06-01'), ... },
      { batchNumber: 'B2', expiryDate: new Date('2025-03-01'), ... },
      { batchNumber: 'B3', expiryDate: new Date('2025-09-01'), ... },
    ]);

    const sorted = component.sortedBatches();
    expect(sorted[0].batchNumber).toBe('B2'); // Earliest expiry first
  });

  it('should mark batch as critical when expiry < 7 days', () => {
    const batch = {
      batchNumber: 'B1',
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      ...
    };

    expect(component.getExpiryStatus(batch)).toBe('critical');
  });
});
```

### 6.2 Integration Testing

Test component interactions:

```typescript
describe('Stock Receive Integration', () => {
  it('should complete full receive flow', async () => {
    // 1. Scan barcode
    const scanner = fixture.debugElement.query(By.directive(AxBarcodeScannerComponent));
    scanner.componentInstance.onScan.emit({
      code: '8850999320113',
      format: 'ean13',
      timestamp: new Date(),
      mode: 'camera',
    });
    fixture.detectChanges();

    // 2. Verify batch selector appears
    expect(component.currentStep()).toBe('batch');

    // 3. Select batch
    const batchSelector = fixture.debugElement.query(By.directive(AxBatchSelectorComponent));
    batchSelector.componentInstance.onSelect.emit({
      batches: [{ batch: mockBatch, quantity: 100 }],
      totalQuantity: 100,
      strategy: 'fefo',
    });
    fixture.detectChanges();

    // 4. Verify quantity input appears
    expect(component.currentStep()).toBe('quantity');

    // 5. Enter quantity
    const quantityInput = fixture.debugElement.query(By.directive(AxQuantityInputComponent));
    quantityInput.componentInstance.value.set(100);
    fixture.detectChanges();

    // 6. Verify stock level preview updates
    const stockLevel = fixture.debugElement.query(By.directive(AxStockLevelComponent));
    expect(stockLevel.componentInstance.current()).toBe(mockProduct.currentStock + 100);
  });
});
```

### 6.3 E2E Testing

Playwright tests for critical flows:

```typescript
test('Stock receive with barcode scanning', async ({ page }) => {
  await page.goto('/inventory/receive');

  // Mock camera permission and barcode scan
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = () => Promise.resolve({} as MediaStream);
  });

  // Trigger scan (in real test, use camera simulation)
  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('barcode-scan', {
        detail: { code: '8850999320113', format: 'ean13' },
      }),
    );
  });

  // Select batch
  await page.click('[data-testid="batch-card-1"]');
  await page.click('button:has-text("Select")');

  // Enter quantity
  await page.fill('input[aria-label="Quantity"]', '100');

  // Verify preview
  const stockLevel = await page.textContent('[data-testid="stock-level-preview"]');
  expect(stockLevel).toContain('200 / 500'); // Assuming current was 100

  // Submit
  await page.click('button[type="submit"]');

  // Verify success message
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

---

## 7. Performance Optimization

### 7.1 Bundle Size Optimization

- **Lazy loading**: Scanner library loaded only when needed

  ```typescript
  const loadScanner = async () => {
    const { BrowserMultiFormatReader } = await import('@zxing/library');
    return new BrowserMultiFormatReader();
  };
  ```

- **Tree shaking**: Use ES modules for Material components
- **Code splitting**: Each component in separate lazy-loaded chunk
- **Target bundle size**: <20KB gzipped per component

### 7.2 Rendering Performance

- **OnPush change detection**: Automatic with signals
- **Virtual scrolling**: For batch lists >100 items

  ```typescript
  <cdk-virtual-scroll-viewport itemSize="120" class="batch-list">
    @for (batch of filteredBatches(); track batch.batchNumber) {
      <div class="batch-card">...</div>
    }
  </cdk-virtual-scroll-viewport>
  ```

- **Computed signals**: Prevent unnecessary recalculations
- **CSS containment**: Isolate repaint regions
  ```scss
  .ax-stock-level {
    contain: layout style paint;
  }
  ```

### 7.3 API Optimization

- **Debounced search**: 300ms debounce on batch search

  ```typescript
  private searchDebounced = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
  );
  ```

- **Request caching**: Cache batch data for 5 minutes
- **Pagination**: Load batches in pages of 50
- **Optimistic updates**: Update UI before API response

---

## 8. Accessibility Compliance

All components meet WCAG 2.1 AA standards:

### 8.1 Keyboard Navigation

- All interactive elements focusable with Tab
- Logical tab order
- Arrow keys for stepper controls
- Enter/Space for selection
- Escape to cancel/close

### 8.2 Screen Reader Support

- Proper ARIA roles and labels
- Live regions for dynamic updates
- Status announcements
- Error announcements
- Progress indicators

### 8.3 Visual Accessibility

- Color contrast ratio ≥4.5:1
- Focus indicators visible
- Text resizable to 200%
- No information by color alone
- Support for high contrast mode

### 8.4 Motion & Animation

- Respects `prefers-reduced-motion`
  ```scss
  @media (prefers-reduced-motion: reduce) {
    .ax-stock-level__progress-fill {
      transition: none;
    }
  }
  ```

---

## 9. Browser Compatibility

### 9.1 Target Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Mobile 90+

### 9.2 Polyfills Required

- **MediaDevices API**: Graceful degradation if unavailable
- **Web Audio API**: Optional beep sound
- **CSS Container Queries**: Progressive enhancement

### 9.3 Feature Detection

```typescript
// Camera support
const hasCameraSupport = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

// Flashlight support
const hasFlashlightSupport = () => {
  const track = stream.getVideoTracks()[0];
  return 'torch' in track.getCapabilities();
};

// Web Audio support
const hasAudioSupport = 'AudioContext' in window || 'webkitAudioContext' in window;
```

---

## 10. Security Considerations

### 10.1 Input Validation

- Sanitize barcode strings before API calls
- Validate quantity ranges server-side
- Prevent XSS in batch number display
- CSRF tokens in all API requests

### 10.2 Camera Permissions

- Request permissions only when needed
- Handle permission denial gracefully
- Clear explanation of why camera needed
- No persistent camera access

### 10.3 API Security

- Authentication headers required
- Rate limiting on batch queries
- SQL injection prevention (parameterized queries)
- HTTPS only in production

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Week 1)

- Set up component scaffolding
- Create type definitions
- Implement base styling system
- Set up unit test framework

### Phase 2: Stock Level Indicator (Week 1)

- Implement core logic
- Add visual design
- Write unit tests
- Integration with theme system

### Phase 3: Barcode Scanner (Week 2)

- Camera integration
- Manual input fallback
- Barcode library integration
- Error handling

### Phase 4: Quantity Input (Week 2)

- Basic input component
- Unit conversion logic
- Stepper controls
- Forms integration

### Phase 5: Batch Selector (Week 3)

- API integration
- Sorting strategies
- Expiry calculations
- Multi-select logic

### Phase 6: Integration & Testing (Week 4)

- Cross-component integration
- E2E tests
- Performance optimization
- Documentation

---

_Design Version: 1.0_
_Last Updated: 2025-12-18_
_Status: Awaiting Approval_
