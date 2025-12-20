# Design Document - Inventory UI Components (Priority 2)

## Introduction

This design document details the UI/UX, component architecture, and technical implementation for the six Priority 2 inventory components: **Stock Movement Timeline**, **Expiry Date Badge**, **Product Variant Selector**, **Stock Alert Panel**, **Inventory Transfer Wizard**, and **Location/Warehouse Picker**.

These components follow AegisX UI design principles:

- Material Design 3 guidelines
- Angular standalone component architecture
- Signal-based reactive patterns
- TypeScript strict mode with comprehensive type safety
- WCAG 2.1 AA accessibility compliance
- Integration with Priority 1 components

---

## 1. Stock Movement Timeline (`ax-stock-movement-timeline`)

### 1.1 Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Stock Movement History - Product: Aspirin 500mg           │
│  [Filter: All Types ▼] [Group: Day ▼] [📅 Date Range]     │
│  [📊 Balance Chart] [📄 Export]                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────── Balance Line Chart ────────┐                    │
│  │   500 ┤                        ╱─  │                    │
│  │       │                    ╱───    │                    │
│  │   250 ┤              ╱─────        │                    │
│  │       │       ╱──────              │                    │
│  │     0 ┤───────                     │                    │
│  └────────────────────────────────────┘                    │
│                                                             │
│  📅 December 18, 2025 (Total: +150)                        │
│  ├─────────────────────────────────────────────────────┐   │
│  │ 14:30  [IN] Receive            +100 → Balance: 450  │   │
│  │        PO-2025-001 | John Doe                       │   │
│  │        📦 Batch: BATCH-2024-001                     │   │
│  │        [Click to expand ▼]                          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 10:15  [OUT] Issue              -50 → Balance: 350  │   │
│  │        SO-2025-042 | Jane Smith                     │   │
│  │        📦 Batch: BATCH-2024-001                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📅 December 17, 2025 (Total: -25)                         │
│  ├─────────────────────────────────────────────────────┐   │
│  │ 16:45  [ADJUST] Stock Count     -25 → Balance: 400  │   │
│  │        ADJ-2025-012 | Admin                         │   │
│  │        📝 Note: Physical count discrepancy          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Load More...]                                            │
└─────────────────────────────────────────────────────────────┘
```

#### Color Scheme

- **Movement types**:
  - IN (Receive): `text-success-700` with `bg-success-50` background
  - OUT (Issue): `text-error-700` with `bg-error-50` background
  - TRANSFER-IN: `text-blue-700` with `bg-blue-50` background
  - TRANSFER-OUT: `text-blue-700` with `bg-blue-50` background
  - ADJUST: `text-warning-700` with `bg-warning-50` background
- **Balance chart**: `stroke-primary-500` line, `fill-primary-100` area
- **Card borders**: `border-default` with hover effect
- **Expanded state**: `bg-muted` background

#### Typography

- **Header**: `text-lg font-semibold text-primary`
- **Date group**: `text-base font-medium text-secondary`
- **Movement time**: `text-sm font-medium text-primary`
- **Movement type**: `text-xs font-bold uppercase`
- **Balance**: `text-base font-semibold text-primary`
- **User/document**: `text-sm text-subtle`
- **Notes**: `text-xs text-secondary italic`

#### Spacing

- Container padding: `p-4`
- Gap between movements: `gap-2`
- Card padding: `p-3`
- Date group margin: `mt-6 mb-2`
- Chart height: 200px

### 1.2 Component Architecture

#### Component Structure

```typescript
AxStockMovementTimelineComponent
├── Template
│   ├── Header section
│   │   ├── Product info display
│   │   ├── Filter controls (type, date range)
│   │   ├── Group by selector
│   │   └── Export button
│   ├── Balance chart section (Chart.js canvas)
│   ├── Movements section
│   │   └── Date groups (repeated)
│   │       └── Movement cards (repeated)
│   │           ├── Time + type badge
│   │           ├── Quantity + balance
│   │           ├── User + document
│   │           └── Expandable details
│   ├── Loading state (skeleton loader)
│   ├── Empty state ("No movements found")
│   └── Load more button
└── State Management
    ├── movements (signal: MovementRecord[])
    ├── filteredMovements (computed)
    ├── groupedMovements (computed)
    ├── balanceData (computed for chart)
    ├── filters (signal: MovementFilter)
    ├── expandedIds (signal: Set<string>)
    └── isLoading (signal: boolean)
```

#### State Management (Signals)

```typescript
// Inputs
productId = input.required<string>();
movements = input<MovementRecord[]>([]);
groupBy = model<'none' | 'day' | 'week' | 'month'>('none');
showBalance = input<boolean>(true);
showFilters = input<boolean>(true);
enableExport = input<boolean>(true);
enableRealtime = input<boolean>(false);
dateRange = input<{ start: Date, end: Date } | undefined>(undefined);
pageSize = input<number>(50);

// Outputs
onMovementClick = output<MovementRecord>();
onExport = output<{ format: 'pdf' | 'excel', data: MovementRecord[] }>();
onFilterChange = output<MovementFilter>();
onMovementsLoad = output<MovementRecord[]>();

// Internal state
private internalMovements = signal<MovementRecord[]>([]);
private filters = signal<MovementFilter>({ types: [] });
private expandedIds = signal<Set<string>>(new Set());
private isLoading = signal<boolean>(false);
private currentPage = signal<number>(0);

// Computed
filteredMovements = computed(() => {
  let movements = this.internalMovements();
  const filter = this.filters();

  if (filter.types && filter.types.length > 0) {
    movements = movements.filter(m => filter.types!.includes(m.type));
  }

  if (filter.dateRange) {
    const { start, end } = filter.dateRange;
    movements = movements.filter(m =>
      m.timestamp >= start && m.timestamp <= end
    );
  }

  return movements;
});

groupedMovements = computed(() => {
  const movements = this.filteredMovements();
  const grouping = this.groupBy();

  if (grouping === 'none') {
    return [{ key: 'all', date: null, movements, total: 0 }];
  }

  const groups = new Map<string, MovementRecord[]>();

  movements.forEach(m => {
    const key = this.getGroupKey(m.timestamp, grouping);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(m);
  });

  return Array.from(groups.entries()).map(([key, movements]) => ({
    key,
    date: movements[0]?.timestamp,
    movements,
    total: this.calculateNetChange(movements)
  }));
});

balanceData = computed(() => {
  const movements = this.filteredMovements();
  let runningBalance = this.getCurrentBalance() - this.getTotalChange(movements);

  return movements.map(m => {
    const change = this.getQuantityChange(m);
    runningBalance += change;
    return {
      timestamp: m.timestamp,
      balance: runningBalance
    };
  });
});

private getGroupKey(date: Date, grouping: 'day' | 'week' | 'month'): string {
  switch (grouping) {
    case 'day':
      return date.toISOString().split('T')[0];
    case 'week':
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().split('T')[0];
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}

private getQuantityChange(movement: MovementRecord): number {
  const inTypes: MovementType[] = ['receive', 'transfer-in', 'adjust-in'];
  return inTypes.includes(movement.type) ? movement.quantity : -movement.quantity;
}

private calculateNetChange(movements: MovementRecord[]): number {
  return movements.reduce((sum, m) => sum + this.getQuantityChange(m), 0);
}
```

#### Chart Integration (Chart.js)

```typescript
private readonly chartService = inject(ChartService);
@ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

private chart?: Chart;

ngAfterViewInit() {
  if (this.showBalance() && this.chartCanvas) {
    this.initializeChart();
  }
}

ngOnDestroy() {
  this.chart?.destroy();
}

private initializeChart() {
  const canvas = this.chartCanvas?.nativeElement;
  if (!canvas) return;

  effect(() => {
    const data = this.balanceData();
    this.updateChart(data);
  });
}

private updateChart(data: { timestamp: Date, balance: number }[]) {
  if (this.chart) {
    this.chart.destroy();
  }

  const ctx = this.chartCanvas!.nativeElement.getContext('2d')!;

  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.timestamp),
      datasets: [{
        label: 'Balance',
        data: data.map(d => d.balance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              return new Date(items[0].parsed.x).toLocaleString();
            },
            label: (item) => {
              return `Balance: ${item.parsed.y} pieces`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day' },
          display: true
        },
        y: {
          beginAtZero: true,
          display: true
        }
      }
    }
  });
}
```

### 1.3 Technical Implementation

#### API Integration

```typescript
private readonly http = inject(HttpClient);
private readonly ws = inject(WebSocketService);

async ngOnInit() {
  if (!this.movements().length && this.productId()) {
    await this.loadMovements();
  } else {
    this.internalMovements.set(this.movements());
  }

  if (this.enableRealtime()) {
    this.subscribeToUpdates();
  }
}

private async loadMovements() {
  this.isLoading.set(true);

  try {
    const params: any = {
      limit: this.pageSize(),
      offset: this.currentPage() * this.pageSize()
    };

    const filter = this.filters();
    if (filter.types?.length) {
      params.types = filter.types;
    }
    if (filter.dateRange) {
      params.startDate = filter.dateRange.start.toISOString();
      params.endDate = filter.dateRange.end.toISOString();
    }

    const response = await firstValueFrom(
      this.http.get<{ movements: MovementRecord[], total: number }>(
        `/api/inventory/products/${this.productId()}/movements`,
        { params }
      )
    );

    this.internalMovements.set(response.movements);
    this.onMovementsLoad.emit(response.movements);
  } catch (error: any) {
    console.error('Failed to load movements:', error);
  } finally {
    this.isLoading.set(false);
  }
}

private subscribeToUpdates() {
  this.ws.connect(`/ws/inventory/movements`);
  this.ws.send({ type: 'subscribe', productId: this.productId() });

  this.ws.messages$.subscribe((message: any) => {
    if (message.type === 'movement' && message.data) {
      const newMovement = message.data as MovementRecord;
      this.internalMovements.update(movements => [newMovement, ...movements]);
    }
  });
}
```

#### Export Functionality

```typescript
async exportData(format: 'pdf' | 'excel') {
  const data = this.filteredMovements();
  this.onExport.emit({ format, data });

  if (format === 'excel') {
    await this.exportToExcel(data);
  } else {
    await this.exportToPdf(data);
  }
}

private async exportToExcel(data: MovementRecord[]) {
  const XLSX = await import('xlsx');
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(m => ({
      'Date/Time': m.timestamp.toLocaleString(),
      'Type': m.type,
      'Quantity': this.getQuantityChange(m),
      'Balance': m.balanceAfter,
      'User': m.user.name,
      'Document': m.referenceDocument?.number || '',
      'Batch': m.batchNumber || '',
      'Notes': m.notes || ''
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Movements');
  XLSX.writeFile(workbook, `movements-${this.productId()}-${Date.now()}.xlsx`);
}

private async exportToPdf(data: MovementRecord[]) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Stock Movement History', 14, 20);
  doc.setFontSize(10);
  doc.text(`Product ID: ${this.productId()}`, 14, 30);

  let y = 40;
  data.forEach((m, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${m.timestamp.toLocaleString()} | ${m.type} | ${this.getQuantityChange(m)} → ${m.balanceAfter}`, 14, y);
    y += 7;
  });

  doc.save(`movements-${this.productId()}-${Date.now()}.pdf`);
}
```

---

## 2. Expiry Date Badge (`ax-expiry-badge`)

### 2.1 Visual Design

#### Layout Variants

```
Small:     [🟢 Safe]
Medium:    [🟡 15 days left]
Large:     [🔴 Critical - 3 days left]
Compact:   🔴 (tooltip on hover)
```

#### Color Scheme

- **Safe**: `bg-success-100 text-success-800 border-success-300`
- **Warning**: `bg-warning-100 text-warning-800 border-warning-300`
- **Critical**: `bg-error-100 text-error-800 border-error-300`
- **Expired**: `bg-neutral-100 text-neutral-600 border-neutral-300`

### 2.2 Component Architecture

```typescript
@Component({
  selector: 'ax-expiry-badge',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule, AxBadgeComponent],
  template: `
    <ax-badge [type]="badgeType()" [size]="size()" [variant]="variant()" [content]="badgeText()" [matTooltip]="tooltipText()" (click)="handleClick()" [class.ax-expiry-badge--compact]="compact()">
      @if (showIcon() && !compact()) {
        <mat-icon [class]="'ax-expiry-badge__icon--' + expiryStatus()">
          {{ statusIcon() }}
        </mat-icon>
      }
    </ax-badge>
  `,
  styles: [
    `
      .ax-expiry-badge--compact {
        min-width: 24px;
        padding: 4px;
      }
    `,
  ],
})
export class AxExpiryBadgeComponent {
  // Inputs
  expiryDate = input.required<Date>();
  warningDays = input<number>(30);
  criticalDays = input<number>(7);
  showCountdown = input<boolean>(true);
  showIcon = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg'>('md');
  variant = input<'outlined' | 'soft' | 'solid'>('soft');
  compact = input<boolean>(false);

  // Output
  onClick = output<ExpiryInfo>();

  // Computed
  expiryStatus = computed((): ExpiryStatus => {
    const days = this.daysUntilExpiry();
    if (days < 0) return 'expired';
    if (days <= this.criticalDays()) return 'critical';
    if (days <= this.warningDays()) return 'warning';
    return 'safe';
  });

  daysUntilExpiry = computed(() => {
    const now = new Date();
    const expiry = new Date(this.expiryDate());
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  });

  badgeType = computed((): BadgeType => {
    const status = this.expiryStatus();
    if (status === 'safe') return 'success';
    if (status === 'warning') return 'warning';
    if (status === 'critical') return 'error';
    return 'neutral';
  });

  badgeText = computed(() => {
    if (this.compact()) return '';

    const status = this.expiryStatus();
    const days = this.daysUntilExpiry();

    if (!this.showCountdown()) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (status === 'expired') {
      return `EXPIRED ${Math.abs(days)} days ago`;
    }
    if (status === 'critical') {
      return `${days} days left`;
    }
    if (status === 'warning') {
      return `${days} days left`;
    }
    return `Expires in ${days} days`;
  });

  statusIcon = computed(() => {
    const status = this.expiryStatus();
    if (status === 'safe') return 'check_circle';
    if (status === 'warning') return 'warning';
    if (status === 'critical') return 'error';
    return 'cancel';
  });

  tooltipText = computed(() => {
    const expiry = new Date(this.expiryDate());
    return `Expiry Date: ${expiry.toLocaleDateString()} ${expiry.toLocaleTimeString()}`;
  });

  handleClick() {
    this.onClick.emit({
      expiryDate: this.expiryDate(),
      daysUntilExpiry: this.daysUntilExpiry(),
      status: this.expiryStatus(),
      message: this.badgeText(),
    });
  }
}
```

---

## 3. Product Variant Selector (`ax-variant-selector`)

### 3.1 Visual Design

#### Grid Layout

```
┌─────────────────────────────────────────────────────────┐
│  Product Variants                        [Layout: Grid▼]│
│  🔍 [Search variants...]                                │
├─────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │  📸   │  │  📸   │  │  📸   │  │  📸   │       │
│  │  Blue  │  │   Red  │  │ Green  │  │ Yellow │       │
│  │ Size M │  │ Size M │  │ Size M │  │ Size M │       │
│  │ $29.99 │  │ $29.99 │  │ $32.99 │  │ $29.99 │       │
│  │ 🟢 45  │  │ 🟡 8   │  │ 🟢 120 │  │ 🔴 Out │       │
│  │ [✓]    │  │ [ ]    │  │ [ ]    │  │ [×]    │       │
│  └────────┘  └────────┘  └────────┘  └────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Component Architecture

```typescript
@Component({
  selector: 'ax-variant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule],
})
export class AxVariantSelectorComponent {
  // Inputs
  productId = input.required<string>();
  variants = input.required<ProductVariant[]>();
  attributes = input<string[]>([]);
  layout = input<'grid' | 'list' | 'dropdown'>('grid');
  showImages = input<boolean>(true);
  showStock = input<boolean>(true);
  showPrice = input<boolean>(true);
  allowMultiple = input<boolean>(false);
  lowStockThreshold = input<number>(10);

  // Outputs
  onVariantSelect = output<VariantSelection>();
  onAttributeFilter = output<{ attribute: string; value: string }>();

  // Internal state
  private selectedVariants = signal<Map<string, number>>(new Map());
  private searchTerm = signal<string>('');
  private attributeFilters = signal<Map<string, string>>(new Map());

  // Computed
  filteredVariants = computed(() => {
    let variants = this.variants();
    const search = this.searchTerm().toLowerCase();
    const filters = this.attributeFilters();

    if (search) {
      variants = variants.filter((v) => v.name.toLowerCase().includes(search) || v.sku.toLowerCase().includes(search) || Object.values(v.attributes).some((val) => String(val).toLowerCase().includes(search)));
    }

    if (filters.size > 0) {
      variants = variants.filter((v) => Array.from(filters.entries()).every(([attr, value]) => v.attributes[attr] === value));
    }

    return variants;
  });

  availableAttributes = computed(() => {
    const attrs = this.attributes();
    if (attrs.length > 0) return attrs;

    const variants = this.variants();
    const allAttrs = new Set<string>();
    variants.forEach((v) => {
      Object.keys(v.attributes).forEach((attr) => allAttrs.add(attr));
    });
    return Array.from(allAttrs);
  });

  getStockBadgeType(variant: ProductVariant): 'success' | 'warning' | 'error' {
    if (!variant.available) return 'error';
    if (variant.stockLevel <= this.lowStockThreshold()) return 'warning';
    return 'success';
  }

  toggleVariant(variant: ProductVariant) {
    if (!variant.available) return;

    const selected = this.selectedVariants();

    if (this.allowMultiple()) {
      if (selected.has(variant.sku)) {
        selected.delete(variant.sku);
      } else {
        selected.set(variant.sku, 1);
      }
    } else {
      selected.clear();
      selected.set(variant.sku, 1);
    }

    this.selectedVariants.set(new Map(selected));
    this.emitSelection();
  }

  updateQuantity(sku: string, quantity: number) {
    this.selectedVariants().set(sku, quantity);
    this.emitSelection();
  }

  private emitSelection() {
    const selection: VariantSelection = {
      variants: Array.from(this.selectedVariants().entries()).map(([sku, quantity]) => ({
        variant: this.variants().find((v) => v.sku === sku)!,
        quantity,
      })),
    };
    this.onVariantSelect.emit(selection);
  }
}
```

---

## 4. Stock Alert Panel (`ax-stock-alert-panel`)

### 4.1 Visual Design

```
┌─────────────────────────────────────────────────────────┐
│  Stock Alerts                         [Group: Priority▼]│
│  [Critical: 3] [Warning: 8] [Info: 2]                   │
├─────────────────────────────────────────────────────────┤
│  🔴 CRITICAL                                            │
│  ├─────────────────────────────────────────────────────┤
│  │ 🔴 Out of Stock                                     │
│  │ Aspirin 500mg (SKU-001)                             │
│  │ Current: 0 | Minimum: 50                            │
│  │ [Create PO] [View Product]                          │
│  ├─────────────────────────────────────────────────────┤
│  │ 🔴 Expired Product                                  │
│  │ Ibuprofen 200mg (SKU-042)                           │
│  │ Batch: BATCH-2023-099 | Expired: 5 days ago        │
│  │ [Dispose] [View Product]                            │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  🟡 WARNING                                             │
│  ├─────────────────────────────────────────────────────┤
│  │ 🟡 Low Stock                                        │
│  │ Paracetamol 650mg (SKU-015)                         │
│  │ Current: 25 | Minimum: 50                           │
│  │ [Reorder] [View Product]                            │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  [View All Alerts (13)]                                 │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Component Architecture

```typescript
@Component({
  selector: 'ax-stock-alert-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatBadgeModule, AxBadgeComponent],
})
export class AxStockAlertPanelComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly ws = inject(WebSocketService);

  // Inputs
  alerts = input<StockAlert[]>([]);
  groupBy = input<'type' | 'priority' | 'none'>('priority');
  showActions = input<boolean>(true);
  maxDisplay = input<number>(10);
  enableRealtime = input<boolean>(false);
  filters = input<AlertFilter | undefined>(undefined);

  // Outputs
  onAlertClick = output<StockAlert>();
  onAlertAction = output<{ alert: StockAlert; action: string }>();
  onAlertDismiss = output<string>();
  onAlertsLoad = output<StockAlert[]>();

  // Internal state
  private internalAlerts = signal<StockAlert[]>([]);
  private isLoading = signal<boolean>(false);

  // Computed
  filteredAlerts = computed(() => {
    let alerts = this.internalAlerts();
    const filter = this.filters();

    if (filter?.types) {
      alerts = alerts.filter((a) => filter.types!.includes(a.type));
    }
    if (filter?.severity) {
      alerts = alerts.filter((a) => filter.severity!.includes(a.severity));
    }
    if (filter?.productIds) {
      alerts = alerts.filter((a) => filter.productIds!.includes(a.product.id));
    }

    return alerts;
  });

  groupedAlerts = computed(() => {
    const alerts = this.filteredAlerts();
    const grouping = this.groupBy();

    if (grouping === 'none') {
      return [{ key: 'all', label: 'All Alerts', alerts }];
    }

    const groups = new Map<string, StockAlert[]>();

    alerts.forEach((alert) => {
      const key = grouping === 'type' ? alert.type : alert.severity;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(alert);
    });

    return Array.from(groups.entries()).map(([key, alerts]) => ({
      key,
      label: this.getGroupLabel(key, grouping),
      alerts: alerts.slice(0, this.maxDisplay()),
    }));
  });

  alertCounts = computed(() => {
    const alerts = this.filteredAlerts();
    return {
      critical: alerts.filter((a) => a.severity === 'critical').length,
      warning: alerts.filter((a) => a.severity === 'warning').length,
      info: alerts.filter((a) => a.severity === 'info').length,
    };
  });

  async ngOnInit() {
    if (!this.alerts().length) {
      await this.loadAlerts();
    } else {
      this.internalAlerts.set(this.alerts());
    }

    if (this.enableRealtime()) {
      this.subscribeToAlerts();
    }
  }

  private async loadAlerts() {
    this.isLoading.set(true);

    try {
      const params: any = {};
      const filter = this.filters();

      if (filter?.types) params.types = filter.types;
      if (filter?.severity) params.severity = filter.severity;

      const response = await firstValueFrom(this.http.get<{ alerts: StockAlert[]; total: number }>('/api/inventory/alerts', { params }));

      this.internalAlerts.set(response.alerts);
      this.onAlertsLoad.emit(response.alerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private subscribeToAlerts() {
    this.ws.connect('/ws/inventory/alerts');

    this.ws.messages$.subscribe((message: any) => {
      if (message.type === 'alert' && message.data) {
        const newAlert = message.data as StockAlert;
        this.internalAlerts.update((alerts) => [newAlert, ...alerts]);
      }
    });
  }

  async dismissAlert(alertId: string) {
    try {
      await firstValueFrom(this.http.post(`/api/inventory/alerts/${alertId}/dismiss`, {}));

      this.internalAlerts.update((alerts) => alerts.filter((a) => a.id !== alertId));

      this.onAlertDismiss.emit(alertId);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  }

  handleAction(alert: StockAlert, action: string) {
    this.onAlertAction.emit({ alert, action });
  }
}
```

---

## 5. Inventory Transfer Wizard (`ax-transfer-wizard`)

### 5.3 Component Architecture

```typescript
@Component({
  selector: 'ax-transfer-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, AxQuantityInputComponent, AxLocationPickerComponent],
})
export class AxTransferWizardComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  sourceLocation = input.required<string>();
  steps = input<WizardStep[]>([]);
  allowPartialTransfer = input<boolean>(true);
  requireApproval = input<boolean>(false);
  allowMultipleProducts = input<boolean>(true);

  // Outputs
  onComplete = output<TransferRequest>();
  onCancel = output<void>();
  onStepChange = output<{ step: number; data: any }>();

  // Form
  transferForm = this.fb.group({
    products: this.fb.array([]),
    destinationLocation: ['', Validators.required],
    notes: [''],
  });

  currentStep = signal<number>(0);
  selectedProducts = signal<Array<{ id: string; name: string; available: number }>>([]);

  get productsArray() {
    return this.transferForm.get('products') as FormArray;
  }

  addProduct(product: { id: string; name: string; available: number }) {
    const productGroup = this.fb.group({
      productId: [product.id],
      productName: [product.name],
      availableQuantity: [product.available],
      quantity: [0, [Validators.required, Validators.min(1), Validators.max(product.available)]],
    });

    this.productsArray.push(productGroup);
    this.selectedProducts.update((products) => [...products, product]);
  }

  removeProduct(index: number) {
    this.productsArray.removeAt(index);
    this.selectedProducts.update((products) => products.filter((_, i) => i !== index));
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep.update((step) => step + 1);
      this.onStepChange.emit({ step: this.currentStep(), data: this.getStepData() });
    }
  }

  previousStep() {
    this.currentStep.update((step) => Math.max(0, step - 1));
  }

  async submit() {
    if (!this.transferForm.valid) return;

    const formValue = this.transferForm.value;
    const request: TransferRequest = {
      sourceLocationId: this.sourceLocation(),
      destinationLocationId: formValue.destinationLocation!,
      items: formValue.products!.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
      notes: formValue.notes || undefined,
      requiresApproval: this.requireApproval(),
    };

    this.onComplete.emit(request);
  }

  cancel() {
    this.onCancel.emit();
  }

  private validateCurrentStep(): boolean {
    const step = this.currentStep();

    switch (step) {
      case 0: // Select Products
        return this.productsArray.length > 0;
      case 1: // Confirm Quantities
        return this.productsArray.controls.every((c) => c.valid);
      case 2: // Select Destination
        return this.transferForm.get('destinationLocation')!.valid;
      default:
        return true;
    }
  }

  private getStepData(): any {
    const step = this.currentStep();

    switch (step) {
      case 0:
        return { products: this.selectedProducts() };
      case 1:
        return { quantities: this.productsArray.value };
      case 2:
        return { destination: this.transferForm.get('destinationLocation')!.value };
      default:
        return null;
    }
  }
}
```

---

## 6. Location/Warehouse Picker (`ax-location-picker`)

### 6.1 Component Architecture

```typescript
@Component({
  selector: 'ax-location-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTreeModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
})
export class AxLocationPickerComponent implements OnInit {
  private readonly http = inject(HttpClient);

  // Inputs
  locations = input.required<LocationNode[]>();
  currentLocation = input<string | undefined>(undefined);
  showAvailability = input<boolean>(false);
  allowedTypes = input<LocationType[]>([]);
  showRecent = input<boolean>(true);
  showFavorites = input<boolean>(true);
  showMap = input<boolean>(false);
  searchable = input<boolean>(true);
  mode = input<'tree' | 'dropdown' | 'breadcrumb'>('tree');

  // Outputs
  onLocationSelect = output<LocationSelection>();
  onFavoriteToggle = output<{ locationId: string; isFavorite: boolean }>();

  // Internal state
  private searchTerm = signal<string>('');
  private expandedNodes = signal<Set<string>>(new Set());
  private recentLocations = signal<LocationNode[]>([]);
  private favoriteLocations = signal<LocationNode[]>([]);

  // Tree data source
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  treeControl = new FlatTreeControl<FlatLocationNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (node: LocationNode, level: number): FlatLocationNode => ({
      ...node,
      level,
      expandable: !!node.children && node.children.length > 0,
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children || [],
  );

  ngOnInit() {
    this.dataSource.data = this.locations();
    this.loadRecentLocations();
    this.loadFavoriteLocations();

    if (this.currentLocation()) {
      this.expandToLocation(this.currentLocation()!);
    }
  }

  // Computed
  filteredLocations = computed(() => {
    const locations = this.locations();
    const search = this.searchTerm().toLowerCase();

    if (!search) return locations;

    return this.filterTree(locations, search);
  });

  private filterTree(nodes: LocationNode[], search: string): LocationNode[] {
    return nodes.reduce<LocationNode[]>((acc, node) => {
      const matches = node.code.toLowerCase().includes(search) || node.name.toLowerCase().includes(search);

      const filteredChildren = node.children ? this.filterTree(node.children, search) : [];

      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }

      return acc;
    }, []);
  }

  selectLocation(location: LocationNode) {
    const allowed = this.allowedTypes();
    if (allowed.length > 0 && !allowed.includes(location.type)) {
      return;
    }

    if (location.disabled) {
      return;
    }

    const path = this.getLocationPath(location);
    const selection: LocationSelection = {
      location,
      path,
      pathString: path.map((l) => l.code).join(' > '),
    };

    this.onLocationSelect.emit(selection);
    this.addToRecent(location);
  }

  toggleFavorite(location: LocationNode) {
    const favorites = this.favoriteLocations();
    const isFavorite = favorites.some((f) => f.id === location.id);

    if (isFavorite) {
      this.favoriteLocations.set(favorites.filter((f) => f.id !== location.id));
    } else {
      this.favoriteLocations.set([...favorites, location]);
    }

    this.saveFavorites();
    this.onFavoriteToggle.emit({ locationId: location.id, isFavorite: !isFavorite });
  }

  private getLocationPath(location: LocationNode): LocationNode[] {
    const path: LocationNode[] = [location];
    let current = location;

    while (current.parentId) {
      const parent = this.findLocationById(current.parentId);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return path;
  }

  private findLocationById(id: string): LocationNode | null {
    const search = (nodes: LocationNode[]): LocationNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return search(this.locations());
  }

  private expandToLocation(locationId: string) {
    const location = this.findLocationById(locationId);
    if (!location) return;

    const path = this.getLocationPath(location);
    path.forEach((node) => {
      this.expandedNodes.update((nodes) => {
        nodes.add(node.id);
        return new Set(nodes);
      });
    });
  }

  private addToRecent(location: LocationNode) {
    const recent = this.recentLocations();
    const filtered = recent.filter((l) => l.id !== location.id);
    this.recentLocations.set([location, ...filtered].slice(0, 5));
    localStorage.setItem('recentLocations', JSON.stringify(this.recentLocations()));
  }

  private loadRecentLocations() {
    const stored = localStorage.getItem('recentLocations');
    if (stored) {
      this.recentLocations.set(JSON.parse(stored));
    }
  }

  private saveFavorites() {
    localStorage.setItem('favoriteLocations', JSON.stringify(this.favoriteLocations()));
  }

  private loadFavoriteLocations() {
    const stored = localStorage.getItem('favoriteLocations');
    if (stored) {
      this.favoriteLocations.set(JSON.parse(stored));
    }
  }
}
```

---

## 7. Testing Strategy

### 7.1 Unit Testing

Each component will have comprehensive unit tests:

```typescript
describe('AxStockMovementTimelineComponent', () => {
  it('should group movements by day', () => {
    component.groupBy.set('day');
    component.internalMovements.set(mockMovements);

    const grouped = component.groupedMovements();
    expect(grouped.length).toBeGreaterThan(0);
    expect(grouped[0].key).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('should calculate net change correctly', () => {
    const movements: MovementRecord[] = [
      { type: 'receive', quantity: 100, ... },
      { type: 'issue', quantity: 50, ... }
    ];

    const net = component.calculateNetChange(movements);
    expect(net).toBe(50);
  });
});
```

### 7.2 Integration Testing

Test cross-component interactions:

```typescript
describe('Transfer Wizard with Location Picker', () => {
  it('should complete transfer flow', async () => {
    // Step 1: Select products
    wizard.addProduct(mockProduct);

    // Step 2: Set quantities
    wizard.productsArray.at(0).patchValue({ quantity: 100 });
    wizard.nextStep();

    // Step 3: Select destination using location picker
    const locationPicker = fixture.debugElement.query(By.directive(AxLocationPickerComponent));
    locationPicker.componentInstance.selectLocation(mockLocation);

    // Step 4: Submit
    wizard.submit();

    expect(wizard.onComplete).toHaveBeenCalled();
  });
});
```

### 7.3 E2E Testing

```typescript
test('Stock alert panel flow', async ({ page }) => {
  await page.goto('/dashboard');

  // Verify alert count
  const criticalCount = await page.textContent('[data-testid="critical-count"]');
  expect(criticalCount).toBe('3');

  // Click alert
  await page.click('[data-testid="alert-0"]');

  // Verify navigation to product
  await expect(page).toHaveURL(/\/products\/*/);
});
```

---

## 8. Performance Optimization

### 8.1 Virtual Scrolling for Timeline

```typescript
<cdk-virtual-scroll-viewport itemSize="80" class="timeline-viewport">
  @for (group of groupedMovements(); track group.key) {
    <div class="date-group">
      <h3>{{ group.date | date }}</h3>
      @for (movement of group.movements; track movement.id) {
        <div class="movement-card">...</div>
      }
    </div>
  }
</cdk-virtual-scroll-viewport>
```

### 8.2 Lazy Loading

```typescript
// Lazy load Chart.js
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

// Lazy load export libraries
const loadExportLib = async (format: 'pdf' | 'excel') => {
  if (format === 'pdf') {
    return await import('jspdf');
  } else {
    return await import('xlsx');
  }
};
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1)

- Set up component directories
- Install dependencies (Chart.js, jsPDF, xlsx)
- Create shared types

### Phase 2: Simple Components (Week 2)

- Expiry Badge (2 days)
- Variant Selector (3 days)

### Phase 3: Complex Components (Week 3-4)

- Stock Movement Timeline (4 days)
- Stock Alert Panel (3 days)

### Phase 4: Wizard & Picker (Week 5)

- Transfer Wizard (3 days)
- Location Picker (4 days)

### Phase 5: Integration & Testing (Week 6)

- Cross-component integration
- E2E tests
- Performance optimization
- Documentation

---

_Design Version: 1.0_
_Last Updated: 2025-12-18_
_Status: Awaiting Approval_
