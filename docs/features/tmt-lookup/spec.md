# TMT Lookup Components - Technical Specification

## 1. Overview

### 1.1 Purpose

สร้าง Reusable Components สำหรับค้นหาและแสดงรายละเอียด TMT (Thai Medicines Terminology) ที่สามารถนำไปใช้ได้ทั่วทั้ง Application

### 1.2 Goals

- ค้นหา TMT concepts ด้วย code หรือ ชื่อยา (Thai/English)
- แสดง hierarchy ครบทุก level (VTM → GP → GPU → TP → TPU)
- คลิกดูรายละเอียดได้ทุกจุดที่แสดง TMT code
- Reusable และ consistent UI ทั้ง app

### 1.3 Scope

- 4 Angular components
- 1 Angular service (with caching)
- Backend API endpoints

---

## 2. Architecture

### 2.1 File Structure

```
apps/web/src/app/shared/ui/components/tmt/
├── index.ts                           # Public exports
├── tmt.types.ts                       # Shared types/interfaces
├── tmt.service.ts                     # API service with caching
├── ax-tmt-badge.component.ts          # Badge component
├── ax-tmt-lookup.component.ts         # Lookup/search component
├── ax-tmt-hierarchy.component.ts      # Hierarchy tree component
└── ax-tmt-detail-dialog.component.ts  # Detail dialog
```

### 2.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ax-tmt-badge  │  │ax-tmt-lookup │  │ax-tmt-hierarchy      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         └─────────────────┼──────────────────────┘              │
│                           ▼                                     │
│                  ┌─────────────────┐                            │
│                  │  TmtService     │  (with Map cache)          │
│                  └────────┬────────┘                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP
┌───────────────────────────┼─────────────────────────────────────┐
│                           ▼                                     │
│                  ┌─────────────────┐                            │
│                  │ /api/tmt/*      │  Backend                   │
│                  └────────┬────────┘                            │
│                           ▼                                     │
│                  ┌─────────────────┐                            │
│                  │ PostgreSQL      │                            │
│                  │ tmt_concepts    │                            │
│                  │ tmt_relationships│                           │
│                  └─────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Components Specification

### 3.1 AxTmtBadgeComponent

**Selector:** `ax-tmt-badge`

**Purpose:** แสดง TMT code แบบ badge เล็กๆ คลิกแล้วเปิด dialog ดูรายละเอียด

#### Inputs

| Name        | Type           | Default  | Description                       |
| ----------- | -------------- | -------- | --------------------------------- |
| `code`      | `string`       | required | TMT concept code (e.g., "767348") |
| `level`     | `TmtLevel`     | `'GPU'`  | TMT level                         |
| `showLevel` | `boolean`      | `true`   | แสดง level chip หรือไม่           |
| `showIcon`  | `boolean`      | `true`   | แสดง icon หรือไม่                 |
| `clickable` | `boolean`      | `true`   | คลิกเปิด dialog ได้หรือไม่        |
| `size`      | `'sm' \| 'md'` | `'sm'`   | ขนาด badge                        |

#### Outputs

| Name      | Type                       | Description          |
| --------- | -------------------------- | -------------------- |
| `clicked` | `EventEmitter<TmtConcept>` | Emit เมื่อคลิก badge |

#### Visual Design

```
Small (sm):
┌─────────────────────────┐
│ 💊 767348 [GPU] ↗      │
└─────────────────────────┘

Medium (md):
┌──────────────────────────────────────┐
│ 💊 767348                            │
│ Paracetamol 500 mg tablet  [GPU] ↗  │
└──────────────────────────────────────┘
```

#### Level Colors

| Level | Color  | Tailwind Class                  |
| ----- | ------ | ------------------------------- |
| VTM   | Purple | `bg-purple-100 text-purple-700` |
| GP    | Blue   | `bg-blue-100 text-blue-700`     |
| GPU   | Green  | `bg-green-100 text-green-700`   |
| TP    | Amber  | `bg-amber-100 text-amber-700`   |
| TPU   | Red    | `bg-red-100 text-red-700`       |

#### Usage Examples

```html
<!-- Basic usage -->
<ax-tmt-badge code="767348" level="GPU"></ax-tmt-badge>

<!-- Without level chip -->
<ax-tmt-badge code="767348" [showLevel]="false"></ax-tmt-badge>

<!-- Non-clickable (display only) -->
<ax-tmt-badge code="767348" [clickable]="false"></ax-tmt-badge>

<!-- In table cell -->
<td>
  <div class="flex items-center gap-2">
    <span>{{ item.generic_name }}</span>
    @if (item.tmt_gpu_code) {
    <ax-tmt-badge [code]="item.tmt_gpu_code" level="GPU"></ax-tmt-badge>
    }
  </div>
</td>
```

---

### 3.2 AxTmtLookupComponent

**Selector:** `ax-tmt-lookup`

**Purpose:** Input field สำหรับค้นหาและเลือก TMT code พร้อม autocomplete

#### Inputs

| Name          | Type                     | Default              | Description             |
| ------------- | ------------------------ | -------------------- | ----------------------- |
| `value`       | `string \| number`       | `null`               | Selected TMT ID or code |
| `level`       | `TmtLevel \| TmtLevel[]` | `null`               | Filter by level(s)      |
| `label`       | `string`                 | `'TMT Code'`         | Label text              |
| `placeholder` | `string`                 | `'ค้นหารหัส TMT...'` | Placeholder text        |
| `required`    | `boolean`                | `false`              | Required field          |
| `disabled`    | `boolean`                | `false`              | Disabled state          |
| `hint`        | `string`                 | `null`               | Hint text below input   |

#### Outputs

| Name          | Type                       | Description                       |
| ------------- | -------------------------- | --------------------------------- |
| `valueChange` | `EventEmitter<number>`     | Two-way binding for TMT ID        |
| `selected`    | `EventEmitter<TmtConcept>` | Full concept object when selected |
| `cleared`     | `EventEmitter<void>`       | When selection is cleared         |

#### Features

- Debounced search (300ms)
- Search by code OR name (Thai/English)
- Show matching results with level badge
- Clear button
- Keyboard navigation (arrow keys + enter)
- Recent searches (localStorage, max 5)

#### Visual Design

```
┌─────────────────────────────────────────────────────────────┐
│ TMT GPU Code                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 paracetamol                                    [X]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ค้นหาด้วยรหัสหรือชื่อยา                                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Search Results                                       │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 767348 [GPU]                                        │ │ │
│ │ │ Paracetamol 500 mg oral tablet                      │ │ │
│ │ │ พาราเซตามอล 500 มก. เม็ด                             │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 767349 [GPU]                                        │ │ │
│ │ │ Paracetamol 650 mg oral tablet                      │ │ │
│ │ │ พาราเซตามอล 650 มก. เม็ด                             │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Usage Examples

```html
<!-- Basic lookup -->
<ax-tmt-lookup label="TMT GPU Code" [(value)]="drug.tmt_gpu_id" level="GPU" (selected)="onTmtSelected($event)"> </ax-tmt-lookup>

<!-- Multiple levels -->
<ax-tmt-lookup label="TMT Code" [(value)]="selectedTmtId" [level]="['GPU', 'TPU']"> </ax-tmt-lookup>

<!-- In reactive form -->
<ax-tmt-lookup formControlName="tmtGpuId" label="TMT GPU" level="GPU" required> </ax-tmt-lookup>
```

---

### 3.3 AxTmtHierarchyComponent

**Selector:** `ax-tmt-hierarchy`

**Purpose:** แสดง hierarchy tree ของ TMT concept ครบทุก level

#### Inputs

| Name                | Type       | Default | Description                     |
| ------------------- | ---------- | ------- | ------------------------------- |
| `tmtId`             | `number`   | `null`  | TMT concept ID                  |
| `tmtCode`           | `string`   | `null`  | TMT concept code (alternative)  |
| `highlightLevel`    | `TmtLevel` | `null`  | Level ที่ต้องการ highlight      |
| `showAllLevels`     | `boolean`  | `true`  | แสดงทุก level หรือเฉพาะ related |
| `expandedByDefault` | `boolean`  | `true`  | ขยายทั้งหมดตั้งแต่แรก           |
| `maxDepth`          | `number`   | `5`     | ความลึกสูงสุดที่แสดง            |
| `showCounts`        | `boolean`  | `false` | แสดงจำนวน children              |

#### Outputs

| Name          | Type                         | Description               |
| ------------- | ---------------------------- | ------------------------- |
| `nodeClicked` | `EventEmitter<TmtConcept>`   | เมื่อคลิก node ใน tree    |
| `loaded`      | `EventEmitter<TmtHierarchy>` | เมื่อโหลด hierarchy เสร็จ |

#### Visual Design

```
┌─────────────────────────────────────────────────────────────┐
│ 🌳 TMT Hierarchy                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔬 VTM: Paracetamol (767001)                              │
│   │                                                         │
│   └─ 💊 GP: Paracetamol 500 mg tablet (767123)             │
│       │                                                     │
│       └─ ✅ GPU: Paracetamol 500 mg 1 tablet (767348) ◀──  │
│           │                                                 │
│           ├─ 🏭 TP: Tylenol 500 mg tablet (890001)         │
│           │   └─ 📦 TPU: Tylenol 500 mg 1 tab (890123)     │
│           │                                                 │
│           ├─ 🏭 TP: Sara 500 mg tablet (890002)            │
│           │   └─ 📦 TPU: Sara 500 mg 1 tab (890124)        │
│           │                                                 │
│           └─ 🏭 TP: Calpol 500 mg tablet (890003)          │
│               └─ 📦 TPU: Calpol 500 mg 1 tab (890125)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Usage Examples

```html
<!-- Basic hierarchy -->
<ax-tmt-hierarchy [tmtId]="drug.tmt_gpu_id"></ax-tmt-hierarchy>

<!-- With highlight -->
<ax-tmt-hierarchy [tmtCode]="'767348'" highlightLevel="GPU" [showAllLevels]="true"> </ax-tmt-hierarchy>

<!-- Compact mode -->
<ax-tmt-hierarchy [tmtId]="tmtId" [maxDepth]="3" [expandedByDefault]="false"> </ax-tmt-hierarchy>
```

---

### 3.4 AxTmtDetailDialogComponent

**Selector:** `ax-tmt-detail-dialog`

**Purpose:** Dialog แสดงรายละเอียด TMT concept ครบถ้วน

#### Dialog Data

```typescript
interface TmtDetailDialogData {
  tmtId?: number;
  tmtCode?: string;
  level?: TmtLevel;
}
```

#### Features

- แสดงข้อมูลพื้นฐาน (ID, code, level, names)
- แสดง properties (strength, dosage form, unit)
- แสดง hierarchy tree
- แสดงยาในระบบที่ map กับ TMT นี้
- Copy button สำหรับ code
- Link ไปยัง parent/child concepts

#### Visual Design

```
┌─────────────────────────────────────────────────────────────┐
│  📋 TMT Concept Detail                              [X]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  TMT ID         767348                      [📋 Copy] │ │
│  │  Level          GPU (Generic Product Unit)            │ │
│  │  Status         ✅ Active                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  📝 Names                                              │ │
│  │  FSN (EN):   Paracetamol 500 mg oral tablet           │ │
│  │  Thai:       พาราเซตามอล 500 มก. เม็ด                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  💊 Properties                                         │ │
│  │  Strength:      500 mg                                │ │
│  │  Dosage Form:   oral tablet                           │ │
│  │  Unit:          1 tablet                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  🌳 Hierarchy                                          │ │
│  │  [AxTmtHierarchyComponent embedded]                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  🔗 Related Drugs in System (3)                       │ │
│  │  • Paracetamol 500 mg (1010030) - drug_generics       │ │
│  │  • Tylenol 500 mg (D001) - drugs                      │ │
│  │  • Sara 500 mg (D002) - drugs                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│                                           [Close]           │
└─────────────────────────────────────────────────────────────┘
```

#### Usage

```typescript
// Open dialog programmatically
import { AxTmtDetailDialogComponent } from '@app/shared';

constructor(private dialog: MatDialog) {}

openTmtDetail(code: string) {
  this.dialog.open(AxTmtDetailDialogComponent, {
    data: { tmtCode: code, level: 'GPU' },
    width: '600px',
    maxHeight: '90vh'
  });
}
```

---

## 4. Service Specification

### 4.1 TmtService

```typescript
@Injectable({ providedIn: 'root' })
export class TmtService {
  private cache = new Map<string, TmtConcept>();
  private hierarchyCache = new Map<number, TmtHierarchy>();

  // Search concepts
  search(query: string, options?: TmtSearchOptions): Observable<TmtConcept[]>;

  // Get single concept by ID
  getById(id: number): Observable<TmtConcept>;

  // Get single concept by code
  getByCode(code: string): Observable<TmtConcept>;

  // Get hierarchy (ancestors + descendants)
  getHierarchy(id: number): Observable<TmtHierarchy>;

  // Get related drugs in system
  getRelatedDrugs(tmtId: number): Observable<RelatedDrug[]>;

  // Clear cache
  clearCache(): void;
}
```

### 4.2 Caching Strategy

- **Concept cache**: Map<code, TmtConcept> - 5 minutes TTL
- **Hierarchy cache**: Map<id, TmtHierarchy> - 10 minutes TTL
- **Search results**: ไม่ cache (real-time)

---

## 5. Types Definition

```typescript
// TMT Levels
export type TmtLevel = 'VTM' | 'GP' | 'GPU' | 'TP' | 'TPU' | 'GPP' | 'TPP';

// TMT Concept
export interface TmtConcept {
  id: number;
  tmt_id: number;
  concept_code: string;
  level: TmtLevel;
  fsn: string; // Fully Specified Name (English)
  preferred_term: string; // Thai name
  strength?: string;
  dosage_form?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// TMT Hierarchy Response
export interface TmtHierarchy {
  concept: TmtConcept;
  ancestors: TmtConcept[]; // บรรพบุรุษ (VTM → GP → ...)
  descendants: TmtConcept[]; // ลูกหลาน (TP → TPU → ...)
}

// Search Options
export interface TmtSearchOptions {
  level?: TmtLevel | TmtLevel[];
  limit?: number;
  includeInactive?: boolean;
}

// Related Drug
export interface RelatedDrug {
  id: number;
  code: string;
  name: string;
  source: 'drug_generics' | 'drugs';
  mapping_level: TmtLevel;
}

// Level Config (for styling)
export interface TmtLevelConfig {
  level: TmtLevel;
  label: string;
  labelTh: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

export const TMT_LEVEL_CONFIG: Record<TmtLevel, TmtLevelConfig> = {
  VTM: {
    level: 'VTM',
    label: 'Virtual Therapeutic Moiety',
    labelTh: 'สารออกฤทธิ์',
    icon: 'science',
    colorClass: 'text-purple-700',
    bgClass: 'bg-purple-100',
  },
  GP: {
    level: 'GP',
    label: 'Generic Product',
    labelTh: 'ยาสามัญ',
    icon: 'medication',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-100',
  },
  GPU: {
    level: 'GPU',
    label: 'Generic Product Unit',
    labelTh: 'ยาสามัญ+หน่วย',
    icon: 'inventory_2',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100',
  },
  TP: {
    level: 'TP',
    label: 'Trade Product',
    labelTh: 'ยาการค้า',
    icon: 'local_pharmacy',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-100',
  },
  TPU: {
    level: 'TPU',
    label: 'Trade Product Unit',
    labelTh: 'ยาการค้า+หน่วย',
    icon: 'package_2',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-100',
  },
  GPP: {
    level: 'GPP',
    label: 'Generic Product Pack',
    labelTh: 'ยาสามัญ+แพ็ค',
    icon: 'inventory',
    colorClass: 'text-teal-700',
    bgClass: 'bg-teal-100',
  },
  TPP: {
    level: 'TPP',
    label: 'Trade Product Pack',
    labelTh: 'ยาการค้า+แพ็ค',
    icon: 'package',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-100',
  },
};
```

---

## 6. Usage Scenarios

### 6.1 Budget Request Detail - Drug Name Column

```html
<td mat-cell *matCellDef="let item">
  <div class="flex items-center gap-2">
    <span>{{ item.generic_name }}</span>
    @if (item.tmt_gpu_code) {
    <ax-tmt-badge [code]="item.tmt_gpu_code" level="GPU" size="sm"> </ax-tmt-badge>
    }
  </div>
</td>
```

### 6.2 Drug Master Form - TMT Mapping

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>TMT Mapping</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <ax-tmt-lookup label="TMT GPU Code" [(value)]="drug.tmt_gpu_id" level="GPU" hint="เลือก TMT GPU ที่ตรงกับยานี้" (selected)="onTmtSelected($event)"> </ax-tmt-lookup>

    @if (drug.tmt_gpu_id) {
    <ax-tmt-hierarchy [tmtId]="drug.tmt_gpu_id" highlightLevel="GPU" class="mt-4"> </ax-tmt-hierarchy>
    }
  </mat-card-content>
</mat-card>
```

### 6.3 Drug Detail View - Full TMT Info

```html
<mat-tab label="TMT Information">
  @if (drug.tmt_gpu_id) {
  <div class="p-4">
    <ax-tmt-hierarchy [tmtId]="drug.tmt_gpu_id" [showAllLevels]="true" highlightLevel="GPU"> </ax-tmt-hierarchy>
  </div>
  } @else {
  <div class="p-4 text-center text-gray-500">
    <mat-icon>link_off</mat-icon>
    <p>ยังไม่ได้ map กับ TMT</p>
    <button mat-stroked-button (click)="openTmtMapping()">Map TMT</button>
  </div>
  }
</mat-tab>
```

---

## 7. Implementation Priority

| Phase | Task                  | Priority | Effort  |
| ----- | --------------------- | -------- | ------- |
| 1     | Backend API endpoints | High     | 1 day   |
| 2     | TmtService + Types    | High     | 0.5 day |
| 3     | ax-tmt-badge          | High     | 0.5 day |
| 4     | ax-tmt-detail-dialog  | High     | 1 day   |
| 5     | ax-tmt-hierarchy      | Medium   | 1 day   |
| 6     | ax-tmt-lookup         | Medium   | 1 day   |
| 7     | Integration & Testing | Medium   | 1 day   |

**Total estimated effort: 6 days**

---

## 8. Dependencies

### Frontend

- Angular 18+
- Angular Material
- TailwindCSS
- RxJS

### Backend

- Fastify
- Knex.js
- PostgreSQL
- TypeBox schemas

---

## 9. Testing Strategy

### Unit Tests

- TmtService: search, caching, error handling
- Components: input/output bindings, events

### Integration Tests

- API endpoints with real database
- Component interactions

### E2E Tests

- Search and select TMT flow
- View hierarchy flow
- Badge click to dialog flow
