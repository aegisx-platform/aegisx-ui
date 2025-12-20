# Inventory System - UI Components Analysis

## วิเคราะห์ความต้องการ Components สำหรับระบบ Inventory

---

## 1. Components ที่มีอยู่แล้วและใช้งานได้ (Ready to Use)

### ✅ Data Display & Tables

- **CRUD Tables** - จาก CRUD generator พร้อม search, filter, pagination
- **Stats Card** - แสดง KPI (total items, value, movement)
- **KPI Card** - แสดงตัวเลขสำคัญพร้อม trend indicators
- **Timeline** - แสดง stock movement history
- **Description List** - แสดงรายละเอียดสินค้า

### ✅ Forms & Input

- **Date Picker** - เลือกวันที่รับ/เบิก/หมดอายุ
- **File Upload** - อัปโหลดรูปภาพสินค้า, เอกสาร
- **Popup Edit** - แก้ไขข้อมูลแบบ inline
- **Time Slots** - กำหนดเวลารับ/จ่ายสินค้า

### ✅ Feedback & Notifications

- **Alert** - แจ้งเตือน low stock, expiring items
- **Badge** - แสดงสถานะ (in stock, low stock, out of stock)
- **Loading States** - แสดงขณะโหลดข้อมูล

### ✅ Integrations

- **QR Code** - สร้าง/สแกน QR code สินค้า
- **Signature Pad** - เซ็นรับ/จ่ายสินค้า

### ✅ Navigation & Layout

- **Drawer** - แสดงรายละเอียดสินค้าแบบ slide-out
- **Breadcrumb** - นำทางระหว่าง categories/locations
- **Command Palette** - ค้นหาสินค้าแบบเร็ว (Cmd+K)

---

## 2. Components ที่ควรเพิ่ม (Recommended New Components)

### 🔴 Priority 1: Essential for Inventory Operations

#### 1. **Stock Level Indicator** 🎯

**Use Case:** แสดงระดับสต็อกแบบ visual พร้อม warning levels

```typescript
<ax-stock-level
  [current]="150"
  [minimum]="50"
  [maximum]="500"
  [unit]="'pieces'"
  [showLabel]="true"
  [colorScheme]="'traffic-light'" />
```

**Features:**

- Visual progress bar with color coding (red/yellow/green)
- Percentage display
- Warning badges for low/critical stock
- Customizable thresholds
- Support multiple units

**Alternative:** ใช้ `segmented-progress` ปรับแต่งได้แต่ไม่เฉพาะเจาะจงเท่า

---

#### 2. **Barcode Scanner Component** 📱

**Use Case:** สแกน barcode/QR code เพื่อค้นหา/เบิกสินค้า

```typescript
<ax-barcode-scanner
  [mode]="'camera' | 'manual'"
  [formats]="['qr', 'ean13', 'code128']"
  (onScan)="handleScan($event)"
  (onError)="handleError($event)" />
```

**Features:**

- Camera scanning with auto-focus
- Manual barcode entry fallback
- Multiple barcode format support
- Beep sound on successful scan
- Scan history
- Integration with product search API

**Status:** มี QR code อยู่แล้ว แต่ควรต่อยอดเป็น scanner component

---

#### 3. **Quantity Input with Unit Conversion** 🔢

**Use Case:** ป้อนจำนวนพร้อมแปลงหน่วย (กล่อง → ชิ้น, kg → g)

```typescript
<ax-quantity-input
  [(ngModel)]="quantity"
  [baseUnit]="'pieces'"
  [availableUnits]="['box', 'pieces', 'dozen']"
  [conversionRates]="{box: 12, dozen: 12}"
  [showStepper]="true"
  [min]="0"
  [max]="1000" />
```

**Features:**

- Stepper buttons (+/-) for quick adjust
- Unit dropdown with auto-conversion
- Display in multiple units simultaneously
- Validation with min/max
- Decimal support for fractional quantities
- Quick preset buttons (x10, x100)

---

#### 4. **Batch/Lot Number Selector** 📦

**Use Case:** เลือก batch/lot พร้อมแสดงข้อมูล expiry date, quantity available

```typescript
<ax-batch-selector
  [productId]="productId"
  [batches]="availableBatches"
  [strategy]="'fifo' | 'fefo' | 'lifo'"
  [showExpiry]="true"
  [allowMultiple]="true"
  (onSelect)="handleBatchSelect($event)" />
```

**Features:**

- List available batches with details
- Show expiry date with color warnings
- Available quantity per batch
- Auto-suggest based on strategy (FIFO/FEFO/LIFO)
- Multi-batch selection for partial picks
- Batch history tracking

---

#### 5. **Location/Warehouse Picker** 📍

**Use Case:** เลือกคลัง/โลเคชั่นแบบ hierarchical

```typescript
<ax-location-picker
  [locations]="locationTree"
  [currentLocation]="currentLocation"
  [showAvailability]="true"
  [allowedTypes]="['warehouse', 'zone', 'shelf', 'bin']"
  (onLocationSelect)="handleLocationChange($event)" />
```

**Features:**

- Hierarchical tree view (Warehouse → Zone → Aisle → Shelf → Bin)
- Search by location code/name
- Show stock availability per location
- Visual map/layout integration
- Recent locations history
- Favorite locations

---

### 🟡 Priority 2: Enhanced User Experience

#### 6. **Stock Movement Timeline (Enhanced)** 📊

**Use Case:** แสดง movement history แบบ visual timeline พร้อม filters

```typescript
<ax-stock-movement-timeline
  [productId]="productId"
  [movements]="movements"
  [groupBy]="'day' | 'week' | 'month'"
  [showBalance]="true"
  [filters]="{type: ['in', 'out', 'adjust']}" />
```

**Features:**

- Visual timeline with balance line graph
- Group by time period
- Filter by movement type
- Running balance display
- Click to see transaction details
- Export to PDF/Excel

**Note:** มี `timeline` component อยู่แล้ว แต่ควรสร้าง specialized version

---

#### 7. **Expiry Date Badge/Alert** ⚠️

**Use Case:** แสดงวันหมดอายุพร้อม color-coded warnings

```typescript
<ax-expiry-badge
  [expiryDate]="expiryDate"
  [warningDays]="30"
  [criticalDays]="7"
  [showCountdown]="true"
  [size]="'sm' | 'md' | 'lg'" />
```

**Features:**

- Color coding (green → yellow → red)
- Countdown display (30 days left)
- Expired badge (expired 5 days ago)
- Warning icons
- Tooltip with exact date/time
- Batch expiry summary

**Alternative:** ใช้ `badge` component ที่มีอยู่แล้วแต่สร้าง directive wrapper

---

#### 8. **Product Variant Selector** 🎨

**Use Case:** เลือก variant (size/color/package) แบบ visual

```typescript
<ax-variant-selector
  [variants]="productVariants"
  [attributes]="['size', 'color', 'package']"
  [showImages]="true"
  [showStock]="true"
  [layout]="'grid' | 'list' | 'dropdown'"
  (onVariantSelect)="handleVariantSelect($event)" />
```

**Features:**

- Visual selection with images
- Show stock per variant
- Price differences
- Disabled out-of-stock variants
- Quick filter by attributes
- Bulk variant selection

---

#### 9. **Stock Alert Panel** 🔔

**Use Case:** Dashboard widget แสดง alerts ต่างๆ

```typescript
<ax-stock-alert-panel
  [alerts]="stockAlerts"
  [groupBy]="'type' | 'priority'"
  [showActions]="true"
  [maxDisplay]="10"
  (onAlertAction)="handleAlertAction($event)" />
```

**Features:**

- Low stock alerts
- Expiring items (within 30 days)
- Expired items
- Overstock warnings
- Reorder suggestions
- Quick action buttons
- Priority sorting

---

#### 10. **Inventory Transfer Wizard** 🔄

**Use Case:** Wizard สำหรับการโอนสินค้าระหว่างคลัง

```typescript
<ax-transfer-wizard
  [sourceLocation]="sourceLocation"
  [steps]="['select-products', 'confirm-quantity', 'destination', 'review']"
  [allowPartialTransfer]="true"
  (onComplete)="handleTransferComplete($event)" />
```

**Features:**

- Multi-step wizard
- Product selection with search
- Quantity validation
- Location picker
- Review summary
- Print transfer document
- Track transfer status

---

### 🟢 Priority 3: Advanced Features

#### 11. **Stock Valuation Widget** 💰

**Use Case:** แสดงมูลค่าสต็อกแบบ real-time

```typescript
<ax-stock-valuation
  [method]="'fifo' | 'lifo' | 'average'"
  [currency]="'THB'"
  [groupBy]="'category' | 'location'"
  [chartType]="'pie' | 'bar' | 'donut'" />
```

**Features:**

- Total stock value
- Value by category/location
- Cost breakdown
- Trend comparison
- Multiple valuation methods
- Export reports

---

#### 12. **Reorder Suggestion Card** 🔄

**Use Case:** แสดงรายการสินค้าที่ควร reorder

```typescript
<ax-reorder-suggestion
  [products]="productsNeedReorder"
  [calculationMethod]="'min-max' | 'lead-time' | 'consumption'"
  [showCostImpact]="true"
  [allowBulkOrder]="true"
  (onCreatePO)="createPurchaseOrder($event)" />
```

**Features:**

- Smart reorder calculation
- Lead time consideration
- Cost impact analysis
- Bulk order creation
- Supplier suggestions
- Forecast-based recommendations

---

#### 13. **Stock Adjustment Pad** ➕➖

**Use Case:** ปรับสต็อกแบบเร็ว (count/damage/found)

```typescript
<ax-stock-adjustment-pad
  [product]="product"
  [currentStock]="currentStock"
  [reasons]="adjustmentReasons"
  [requireApproval]="true"
  (onAdjust)="handleAdjustment($event)" />
```

**Features:**

- Quick +/- buttons
- Adjustment reasons
- Photo upload for evidence
- Approval workflow
- Batch adjustment
- Audit trail

---

#### 14. **Multi-Location Stock View** 🏢

**Use Case:** แสดงสต็อกของสินค้าเดียวกันในหลาย locations

```typescript
<ax-multi-location-stock
  [productId]="productId"
  [locations]="allLocations"
  [showTransferOption]="true"
  [layout]="'table' | 'card' | 'map'"
  (onTransferRequest)="handleTransfer($event)" />
```

**Features:**

- Stock levels per location
- Quick transfer between locations
- Location availability search
- Distance/time to location
- Reserved stock visibility
- Map view integration

---

## 3. Implementation Priority Roadmap

### Phase 1: Core Inventory Operations (4 weeks)

**Focus:** Essential daily operations

1. ✅ Stock Level Indicator (1 week)
2. ✅ Barcode Scanner (1 week)
3. ✅ Quantity Input with Unit Conversion (1 week)
4. ✅ Batch/Lot Selector (1 week)

### Phase 2: Location & Movement (3 weeks)

**Focus:** Warehouse management 5. ✅ Location/Warehouse Picker (1 week) 6. ✅ Stock Movement Timeline (Enhanced) (1 week) 7. ✅ Inventory Transfer Wizard (1 week)

### Phase 3: Alerts & Monitoring (2 weeks)

**Focus:** Proactive management 8. ✅ Expiry Date Badge/Alert (0.5 week) 9. ✅ Stock Alert Panel (1 week) 10. ✅ Reorder Suggestion Card (0.5 week)

### Phase 4: Advanced Features (3 weeks)

**Focus:** Analytics & optimization 11. ✅ Product Variant Selector (1 week) 12. ✅ Stock Valuation Widget (1 week) 13. ✅ Stock Adjustment Pad (0.5 week) 14. ✅ Multi-Location Stock View (0.5 week)

---

## 4. Technical Considerations

### Reusable Base Components

สร้าง base components ที่ใช้ร่วมกัน:

- **Base Selector** - สำหรับ batch, location, variant selectors
- **Base Scanner** - สำหรับ barcode/QR scanning
- **Base Timeline** - สำหรับ movement timelines

### Integration Points

- **Backend APIs:** ต้องมี REST APIs สำหรับ stock queries, movements, locations
- **Real-time Updates:** WebSocket สำหรับ stock level updates
- **Offline Support:** Service Worker สำหรับ offline barcode scanning

### Performance

- **Lazy Loading:** โหลด components เฉพาะที่ใช้งาน
- **Virtual Scrolling:** สำหรับ list ที่มีข้อมูลเยอะ
- **Caching:** Cache product/location data

### Accessibility

- **Keyboard Navigation:** ทุก component ต้องใช้ keyboard ได้
- **Screen Reader:** ARIA labels ครบถ้วน
- **Mobile Responsive:** ใช้งานบน mobile/tablet ได้

---

## 5. Alternative Solutions (ใช้ Components ที่มีอยู่)

หากไม่ต้องการสร้าง components ใหม่ สามารถใช้ components ที่มีอยู่ปรับแต่ง:

### Stock Level → Segmented Progress + Badge

```html
<ax-segmented-progress [segments]="stockLevels" /> <ax-badge [type]="stockStatus" [content]="'Low Stock'" />
```

### Batch Selector → Dropdown + Description List

```html
<mat-select [(ngModel)]="selectedBatch">
  <mat-option *ngFor="let batch of batches" [value]="batch">
    <ax-description-list [items]="batchDetails" />
  </mat-option>
</mat-select>
```

### Location Picker → Nested Dropdown

```html
<mat-select [multiple]="false">
  <mat-optgroup *ngFor="let warehouse of warehouses" [label]="warehouse.name">
    <mat-option *ngFor="let location of warehouse.locations" [value]="location"> {{ location.code }} </mat-option>
  </mat-optgroup>
</mat-select>
```

---

## 6. Recommendation Summary

### ✅ ควรสร้างใหม่ (High ROI)

1. **Stock Level Indicator** - ใช้บ่อย, ยากปรับแต่งจาก components เดิม
2. **Barcode Scanner** - Core feature, ต่อยอดจาก QR code
3. **Quantity Input with Unit** - UX ดีกว่า input ธรรมดามาก
4. **Batch Selector** - Complex logic, ควรเป็น component

### ⚠️ ประเมินก่อนสร้าง (Medium ROI)

5. **Location Picker** - ลอง Material Tree ก่อน
6. **Stock Movement Timeline** - ลองปรับ Timeline component ก่อน
7. **Transfer Wizard** - ใช้ Stepper + Forms ก่อน

### 🔄 ใช้ Components เดิมได้ (Low Priority)

8. **Expiry Badge** - ใช้ Badge + Directive
9. **Alert Panel** - ใช้ Card + List
10. **Variant Selector** - ใช้ Radio Group/Checkbox

---

## Next Steps

1. **Review with Team** - ทีมเห็นด้วยกับ priorities หรือไม่
2. **Create Prototypes** - Figma mockups สำหรับ top 4 components
3. **API Design** - กำหนด API contracts สำหรับ components
4. **Start Phase 1** - เริ่มพัฒนา 4 components แรก

---

_Document Version: 1.0_
_Last Updated: 2025-12-18_
_Author: AegisX Development Team_
