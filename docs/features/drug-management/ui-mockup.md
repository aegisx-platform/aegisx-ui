# Drug Management - UI/UX Mockup

**Version:** 1.0.0
**Last Updated:** 2025-12-12
**Design System:** Angular Material + TailwindCSS

---

## 📋 Table of Contents

- [Page Overview](#page-overview)
- [Tab 1: All Drugs](#tab-1-all-drugs)
- [Tab 2: Generics](#tab-2-generics)
- [Tab 3: Focus Lists](#tab-3-focus-lists)
- [Tab 4: Pack Ratios](#tab-4-pack-ratios)
- [Dialogs & Modals](#dialogs--modals)
- [Components Reference](#components-reference)

---

## 🎨 Page Overview

### URL Structure

```
/inventory/drug-management
/inventory/drug-management?tab=drugs         (default)
/inventory/drug-management?tab=generics
/inventory/drug-management?tab=focus-lists
/inventory/drug-management?tab=pack-ratios
```

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Inventory › Drug Management                    [Import] [Export]│
├─────────────────────────────────────────────────────────────────┤
│  🏠  All Drugs  │  💊  Generics  │  ⭐  Focus Lists  │  📦  Pack Ratios  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      [TAB CONTENT]                              │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏠 Tab 1: All Drugs

### Layout: Master-Detail

```
┌────────────────────────────────────────────────────────────────────────┐
│  Drug Management › All Drugs                    [+ Create Drug]        │
├────────────────────────────────────────────────────────────────────────┤
│  🔍 [Search drugs...]                                                  │
│                                                                        │
│  Generic: [Autocomplete v]  Manufacturer: [Autocomplete v]            │
│  NLEM: [All v]  Status: [All v]  TMT: [All v]  Category: [All v]      │
│                                                                        │
│  ☑ Bulk Actions [v]                          Showing 1-20 of 1,169    │
├──────────────────────────────┬─────────────────────────────────────────┤
│ Master (40%)                 │ Detail (60%)                            │
├──────────────────────────────┤                                         │
│ ☐ Code        │ Trade Name   │ Drug Information                        │
│ ☐ PARA500T... │ Tylenol 500  │                                         │
│ ☑ AMX1000C... │ Amoxil 1000  │ Drug Code: AMX1000CAP001                │
│ ☐ METRO400... │ Flagyl 400   │ Trade Name: Amoxil 1000mg               │
│ ☐ DICLO50T... │ Voltaren 50  │                                         │
│                              │ Status: 🟢 ACTIVE  |  NLEM  |  Medicine │
│ [1] [2] ... [59]             │                                         │
│                              │ ─────────────────────────────────────   │
│                              │ Generic Information                     │
│                              │                                         │
│                              │ Working Code: 0000456                   │
│                              │ Generic Name: Amoxicillin 1000mg CAP    │
│                              │ Dosage Form: Capsule                    │
│                              │ Strength: 1000 mg                       │
│                              │ ED Category: E  |  VEN: V               │
│                              │                                         │
│                              │ ─────────────────────────────────────   │
│                              │ Manufacturer                            │
│                              │                                         │
│                              │ GPO Thailand                            │
│                              │                                         │
│                              │ ─────────────────────────────────────   │
│                              │ TMT Mapping                             │
│                              │                                         │
│                              │ ✅ Mapped to TMT                        │
│                              │ [GPU] Amoxicillin 1000mg CAP            │
│                              │                                         │
│                              │   VTM  Amoxicillin                      │
│                              │   └─ GP  Amoxicillin Capsule            │
│                              │      └─ GPU  Amoxicillin 1000mg CAP     │
│                              │                                         │
│                              │ [Change TMT Mapping]                    │
│                              │                                         │
│                              │ ─────────────────────────────────────   │
│                              │ Pack Ratios                             │
│                              │                                         │
│                              │ • 1 Box = 100 capsules (default) 1,500฿│
│                              │ • 1 Carton = 1000 capsules      14,200฿│
│                              │                                         │
│                              │ [Manage Pack Ratios]                    │
│                              │                                         │
│                              │ ─────────────────────────────────────   │
│                              │                                         │
│                              │ [Edit Drug] [Delete] [Quick Edit]       │
└──────────────────────────────┴─────────────────────────────────────────┘
```

### Features

1. **Search & Filters**
   - Global search (trade name, drug code)
   - Generic autocomplete (type to search)
   - Manufacturer autocomplete
   - Multi-select filters: NLEM, Status, TMT Status, Category
   - Clear all filters button

2. **Master Table (Left Panel)**
   - Checkbox selection for bulk operations
   - Sortable columns: Code, Trade Name
   - Click row to show detail (right panel)
   - Pagination (20/50/100 per page)
   - Row actions menu (•••): Quick Edit, Delete

3. **Detail Panel (Right Panel)**
   - Read-only view by default
   - Sections: Drug Info, Generic Info, Manufacturer, TMT Mapping, Pack Ratios
   - TMT hierarchy tree (using `ax-tmt-hierarchy`)
   - Action buttons: Edit, Delete, Quick Edit mode

4. **Bulk Actions**
   - Select multiple drugs with checkboxes
   - Dropdown: Update Status, Map TMT, Export Selected, Delete Selected

### Color Coding

```scss
// Status Badges
.active {
  @apply bg-green-100 text-green-800;
}
.discontinued {
  @apply bg-red-100 text-red-800;
}
.restricted {
  @apply bg-yellow-100 text-yellow-800;
}
.pending {
  @apply bg-gray-100 text-gray-800;
}

// NLEM Badge
.nlem {
  @apply bg-blue-100 text-blue-800;
}
.non-nlem {
  @apply bg-gray-100 text-gray-600;
}

// TMT Mapping Status
.tmt-mapped {
  @apply text-green-600;
}
.tmt-unmapped {
  @apply text-orange-600;
}
```

---

## 💊 Tab 2: Generics

### Layout: Expandable Table

```
┌────────────────────────────────────────────────────────────────────────┐
│  Drug Management › Generics                      [+ Create Generic]    │
├────────────────────────────────────────────────────────────────────────┤
│  🔍 [Search generics...]                                               │
│                                                                        │
│  Dosage Form: [All v]  ED Category: [All v]  VEN: [All v]             │
│  TMT Mapped: [All v]                              Showing 1-20 of 856  │
├────────────────────────────────────────────────────────────────────────┤
│ ▼  Code     │ Generic Name           │ Form   │ ED │ VEN │ Drugs │ TMT│
├────┬───────────────────────────────────────────────────────────────────┤
│ ▶  │0000123 │ Paracetamol 500mg TAB  │ Tablet │ E  │ V   │ 15    │ ✅ │
│────┴───────────────────────────────────────────────────────────────────│
│ ▼  │0000456 │ Amoxicillin 1000mg CAP │ Cap    │ E  │ V   │ 8     │ ✅ │
│────┬───────────────────────────────────────────────────────────────────│
│    │ Components:                                                       │
│    │  • Amoxicillin 1000 mg                                            │
│    │                                                                   │
│    │ TMT Hierarchy:                                                    │
│    │  VTM → Amoxicillin                                                │
│    │  GP  → Amoxicillin Capsule                                        │
│    │  GPU → Amoxicillin 1000mg CAP (796278)                            │
│    │                                                                   │
│    │ Used by 8 Drugs:                                                  │
│    │  • AMX1000CAP001 - Amoxil 1000mg                                  │
│    │  • AMX1000CAP002 - Zimox 1000mg                                   │
│    │  ... [See All]                                                    │
│    │                                                                   │
│    │ [Edit Generic] [Map TMT] [View Drugs]                             │
│────┴───────────────────────────────────────────────────────────────────│
│ ▶  │0000789 │ Metformin 500mg TAB    │ Tablet │ N  │ E   │ 12    │ ❌ │
│────┴───────────────────────────────────────────────────────────────────│
│                                                                        │
│ [1] [2] ... [43]                                                       │
└────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Expandable Rows**
   - Click ▶ to expand, ▼ to collapse
   - Expanded view shows:
     - Components list
     - TMT hierarchy (using `ax-tmt-hierarchy`)
     - Drugs using this generic (max 5, link to see all)
     - Action buttons

2. **Filters**
   - Search by generic name, working code
   - Dosage Form dropdown
   - ED Category, VEN Category
   - TMT Mapping Status (Mapped / Unmapped / All)

3. **Table Columns**
   - Working Code (7 chars)
   - Generic Name
   - Dosage Form (abbreviated)
   - ED Category badge
   - VEN Category badge
   - Drug Count (clickable to filter drugs using this generic)
   - TMT Status icon (✅/❌)

---

## ⭐ Tab 3: Focus Lists

### Layout: Three Columns

```
┌────────────────────────────────────────────────────────────────────────┐
│  Drug Management › Focus Lists                                         │
├────────────────────────────────────────────────────────────────────────┤
│  🔍 [Search to add...]                                    [Import List]│
├────────────────────────┬────────────────────────┬───────────────────────┤
│ ED List (Emergency)    │ NLEM (Essential)       │ Hospital Formulary    │
│ 125 drugs              │ 450 drugs              │ 780 drugs             │
├────────────────────────┼────────────────────────┼───────────────────────┤
│ 1. Adrenaline Inj      │ 1. Paracetamol 500mg   │ 1. Paracetamol 500mg  │
│    [↑] [↓] [×]         │    [↑] [↓] [×]         │    [↑] [↓] [×]        │
│                        │                        │                       │
│ 2. Atropine Inj        │ 2. Amoxicillin 500mg   │ 2. Amoxicillin 500mg  │
│    [↑] [↓] [×]         │    [↑] [↓] [×]         │    [↑] [↓] [×]        │
│                        │                        │                       │
│ 3. Diazepam 10mg       │ 3. Metformin 500mg     │ 3. Atenolol 50mg      │
│    [↑] [↓] [×]         │    [↑] [↓] [×]         │    [↑] [↓] [×]        │
│                        │                        │                       │
│ ...                    │ ...                    │ ...                   │
│                        │                        │                       │
│ [+ Add Drug]           │ [+ Add Drug]           │ [+ Add Drug]          │
└────────────────────────┴────────────────────────┴───────────────────────┘
```

### Features

1. **Three Lists Side-by-Side**
   - ED List (Emergency Drugs)
   - NLEM (National List of Essential Medicines)
   - Hospital Formulary

2. **List Management**
   - Drag-and-drop to reorder (priority)
   - [↑] [↓] buttons to move up/down
   - [×] button to remove from list
   - [+ Add Drug] opens autocomplete dialog

3. **Search to Add**
   - Global search bar at top
   - Type drug name/code
   - Click drug → Choose which list(s) to add to

4. **Import/Export**
   - Import list from Excel
   - Export list to Excel/PDF

---

## 📦 Tab 4: Pack Ratios

### Layout: Master-Detail (Different from Tab 1)

```
┌────────────────────────────────────────────────────────────────────────┐
│  Drug Management › Pack Ratios                                         │
├────────────────────────────────────────────────────────────────────────┤
│  Drug: [Autocomplete search...]                       [Add Pack Ratio] │
├────────────────────────────────────────────────────────────────────────┤
│  Selected Drug: Tylenol 500mg (PARA500TAB001)                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Pack Size  │ Unit      │ Qty/Pack │ Price    │ Default │ Actions     │
├─────────────┼───────────┼──────────┼──────────┼─────────┼─────────────┤
│  1 Box      │ tablets   │ 100      │ 550.00฿  │ ✓       │ [Edit] [×]  │
│  1 Carton   │ tablets   │ 1,000    │ 5,200฿   │         │ [Edit] [×]  │
│  1 Pallet   │ tablets   │ 10,000   │ 49,500฿  │         │ [Edit] [×]  │
│                                                                        │
│  [+ Add Pack Configuration]                                            │
│                                                                        │
│ ─────────────────────────────────────────────────────────────────────  │
│                                                                        │
│  Unit Price Calculation:                                               │
│                                                                        │
│  Base Unit: 1 tablet = 5.50฿                                           │
│                                                                        │
│  Pack Breakdown:                                                       │
│   • 1 Box (100 tablets) = 550฿ (100 × 5.50)                            │
│   • 1 Carton (1,000 tablets) = 5,200฿ (bulk discount 5%)               │
│   • 1 Pallet (10,000 tablets) = 49,500฿ (bulk discount 10%)            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Drug Selector**
   - Autocomplete search
   - Shows currently selected drug

2. **Pack Configurations Table**
   - Pack size (number + unit)
   - Quantity per pack
   - Price
   - Default indicator (only one can be default)
   - Edit/Delete actions

3. **Auto-calculation**
   - Calculate unit price from pack price
   - Show bulk discount percentages
   - Validate prices

---

## 🎨 Dialogs & Modals

### 1. Create/Edit Drug Dialog

```
┌─────────────────────────────────────────────────────────┐
│  Create Drug                                        [×] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Drug Information                                       │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Drug Code *                                            │
│  [________________________]  (exactly 24 characters)    │
│                                                         │
│  Trade Name *                                           │
│  [_________________________________________________]    │
│                                                         │
│  Generic *                                              │
│  [Search generics...                               v]  │
│  └─ 0000456 - Amoxicillin 1000mg CAP                    │
│                                                         │
│  Manufacturer *                                         │
│  [Search manufacturers...                          v]  │
│  └─ GPO Thailand                                        │
│                                                         │
│  Classification                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  NLEM Status *        Drug Status *                     │
│  [NLEM          v]    [ACTIVE      v]                   │
│                                                         │
│  Product Category *                                     │
│  [MEDICINE      v]                                      │
│                                                         │
│  Pricing & Packaging                                    │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Unit Price           Package Size    Package Unit      │
│  [__________] ฿       [_____]          [tablets    v]   │
│                                                         │
│  TMT Mapping (Optional)                                 │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  TMT Concept                                            │
│  [Search TMT...                                    v]  │
│  [TPU] Amoxicillin 1000mg CAP                           │
│                                                         │
│  └─ VTM  Amoxicillin                                    │
│     └─ GP   Amoxicillin Capsule                         │
│        └─ GPU  Amoxicillin 1000mg CAP                   │
│                                                         │
│                                     [Cancel] [Create]   │
└─────────────────────────────────────────────────────────┘
```

**Component Used:** `ax-tmt-lookup` for TMT field

### 2. TMT Mapping Dialog

```
┌─────────────────────────────────────────────────────────┐
│  Map Drug to TMT                                    [×] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Drug: Amoxil 1000mg (AMX1000CAP001)                    │
│  Generic: Amoxicillin 1000mg CAP                        │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Search TMT Concept *                                   │
│  [Search by name or code...                        v]  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Search Results (3)                              │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ○ [GPU] Amoxicillin 1000mg CAP                  │   │
│  │   TMT ID: 796278                                │   │
│  │                                                 │   │
│  │ ○ [TPU] Amoxicillin 1000mg CAP (Box/100)        │   │
│  │   TMT ID: 796279                                │   │
│  │                                                 │   │
│  │ ○ [GPU] Amoxicillin 500mg CAP                   │   │
│  │   TMT ID: 796280                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Selected TMT Hierarchy:                                │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  VTM  → Amoxicillin                                     │
│  GP   → Amoxicillin Capsule                             │
│  GPU  → Amoxicillin 1000mg CAP (796278) ✓               │
│                                                         │
│  Mapping Confidence:                                    │
│  ◉ High    ○ Medium    ○ Low                            │
│                                                         │
│  Notes (optional):                                      │
│  [_________________________________________________]    │
│  [_________________________________________________]    │
│                                                         │
│                                     [Cancel] [Map]      │
└─────────────────────────────────────────────────────────┘
```

### 3. Bulk Operations Dialog

```
┌─────────────────────────────────────────────────────────┐
│  Bulk Update Drugs                                  [×] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Selected Drugs: 15 items                               │
│                                                         │
│  Update Fields:                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ☑ Drug Status                                          │
│     [DISCONTINUED   v]                                  │
│                                                         │
│  ☑ Is Active                                            │
│     ◉ Active    ○ Inactive                              │
│                                                         │
│  ☐ NLEM Status                                          │
│     [NOT_SELECTED   v]                                  │
│                                                         │
│  Preview Changes:                                       │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  15 drugs will be updated:                              │
│   • Drug Status → DISCONTINUED                          │
│   • Is Active → false                                   │
│                                                         │
│  ⚠ Warning: This action cannot be undone               │
│                                                         │
│                           [Cancel] [Update 15 Drugs]    │
└─────────────────────────────────────────────────────────┘
```

---

## 🧩 Components Reference

### Shared TMT Components (Existing)

#### 1. `<ax-tmt-lookup>`

```html
<ax-tmt-lookup formControlName="tmt_tpu_id" label="TMT Concept" placeholder="Search TMT..." [level]="'TPU'" [required]="false" appearance="outline" />
```

**Features:**

- ControlValueAccessor (works with reactive forms)
- Autocomplete with search
- Level filtering
- Loading state
- Clear button

#### 2. `<ax-tmt-hierarchy>`

```html
<ax-tmt-hierarchy [conceptId]="drug().tmt_tpu_id" [showLevels]="true" [expandable]="true" />
```

**Output:**

```
VTM  → Paracetamol
GP   → Paracetamol Tablet
GPU  → Paracetamol 500mg Tablet (796277) ✓
```

#### 3. `<ax-tmt-badge>`

```html
<ax-tmt-badge [level]="'GPU'" />
```

**Output:** `[GPU]` with green background

### Material Components Used

- `MatTabGroup` - Tab navigation
- `MatSidenav` - Master-detail layout
- `MatTable` - Data tables
- `MatPaginator` - Pagination
- `MatSort` - Sortable columns
- `MatCheckbox` - Row selection
- `MatAutocomplete` - Generic/Manufacturer selectors
- `MatDialog` - Modals
- `MatFormField` - Form inputs
- `MatSelect` - Dropdowns
- `MatChip` - Status badges
- `MatExpansionPanel` - Expandable rows (alternative)

---

## 📱 Responsive Design

### Breakpoints

```scss
// Mobile (<768px)
- Stack filters vertically
- Hide detail panel (full-screen on selection)
- Reduce table columns
- Bottom sheet for dialogs

// Tablet (768px - 1024px)
- Master 50% / Detail 50%
- 2-column layout for filters
- Collapsible detail panel

// Desktop (>1024px)
- Master 40% / Detail 60% (default)
- Resizable panels
- 3-column filters
```

---

## 🎯 User Flows

### Flow 1: Create New Drug

```
1. Click [+ Create Drug]
2. Dialog opens
3. Enter drug code (validated: 24 chars)
4. Enter trade name
5. Type in Generic field → autocomplete dropdown appears
6. Select generic from dropdown
7. Type in Manufacturer → autocomplete dropdown
8. Select manufacturer
9. Select NLEM status, Drug status, Category
10. (Optional) Enter pricing info
11. (Optional) Click TMT field → ax-tmt-lookup opens
12. Search TMT concept → select from results
13. TMT hierarchy displays below field
14. Click [Create]
15. Success toast: "Drug created successfully"
16. Dialog closes, table refreshes
```

### Flow 2: Map Drug to TMT

```
1. Select drug in table (detail panel opens)
2. Scroll to TMT Mapping section
3. Click [Change TMT Mapping] or [Map to TMT]
4. TMT Mapping dialog opens
5. Type in search field
6. Select from results
7. Hierarchy displays
8. Select confidence level
9. (Optional) Add notes
10. Click [Map]
11. Success toast
12. Detail panel updates with new TMT info
```

### Flow 3: Bulk Update Status

```
1. Select multiple drugs via checkboxes
2. Click [☑ Bulk Actions v]
3. Select "Update Status"
4. Bulk Operations dialog opens
5. Check [Drug Status]
6. Select new status
7. Preview shows changes
8. Click [Update X Drugs]
9. Progress indicator shows
10. Success toast: "15 drugs updated"
11. Selection clears, table refreshes
```

---

## 🎨 Design Tokens

### Colors

```scss
// Primary Actions
$primary: #1976d2;
$accent: #ff4081;

// Status Colors
$success: #4caf50;
$warning: #ff9800;
$error: #f44336;
$info: #2196f3;

// TMT Levels (from existing components)
$tmt-vtm: #9c27b0; // Purple
$tmt-gp: #2196f3; // Blue
$tmt-gpu: #4caf50; // Green
$tmt-tp: #ff9800; // Orange
$tmt-tpu: #ff5722; // Deep Orange

// Backgrounds
$bg-panel: #fafafa;
$bg-card: #ffffff;
$bg-hover: #f5f5f5;
```

### Typography

```scss
// Headers
h1: 32px / 500 weight (Page title)
h2: 24px / 500 weight (Section title)
h3: 18px / 500 weight (Subsection)

// Body
body: 14px / 400 weight
label: 12px / 500 weight (uppercase)
```

### Spacing

```scss
// 8px grid system
$space-xs: 4px;
$space-sm: 8px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;
```

---

**Last Updated:** 2025-12-12
**Design Owner:** UX Team
