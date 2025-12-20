# PDF Templates UI Improvement - Design Document

## Architecture Overview

### Component Structure (After Refactoring)

```
pdf-templates-list/
├── pdf-templates-list.component.ts      (~400 lines - logic only)
├── pdf-templates-list.component.html    (~500 lines - template)
├── pdf-templates-list.component.scss    (~200 lines - styles)
├── pdf-templates-list.component.spec.ts
└── components/
    ├── template-card/
    │   ├── template-card.component.ts
    │   ├── template-card.component.html
    │   └── template-card.component.scss
    └── template-filters/
        ├── template-filters.component.ts
        ├── template-filters.component.html
        └── template-filters.component.scss
```

---

## UI Components Mapping

### Dashboard Section

**Before**:

```html
<div class="summary-item">
  <div class="summary-icon">
    <mat-icon color="primary">view_list</mat-icon>
  </div>
  <div class="summary-content">
    <div class="summary-value">{{ total }}</div>
    <div class="summary-label">Total Templates</div>
  </div>
</div>
```

**After** (using ax-kpi-card):

```html
<ax-kpi-card variant="compact" size="md" title="Total Templates" [value]="pdfTemplatesService.totalPdfTemplate()" icon="view_list" accentColor="primary" accentPosition="left"></ax-kpi-card>
```

### List View Section

**Before**: Mat-table with 20+ columns

**After**: Card grid view

```html
<ax-card variant="elevated" size="md" [hoverable]="true">
  <!-- Card Header -->
  <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-lg font-semibold">{{ template.display_name }}</h3>
        @if (template.is_template_starter) {
        <ax-badge variant="solid" color="warning" size="sm" icon="stars"> Starter </ax-badge>
        }
      </div>
      <p class="text-sm text-gray-600 font-mono">{{ template.name }}</p>
    </div>
    <ax-badge [variant]="template.is_active ? 'solid' : 'outlined'" [color]="template.is_active ? 'success' : 'error'" size="sm"> {{ template.is_active ? 'Active' : 'Inactive' }} </ax-badge>
  </div>

  <!-- Card Content -->
  <div class="space-y-3 mb-4">
    <ax-field-display label="Category" [value]="template.category" size="sm"></ax-field-display>
    <ax-field-display label="Type" [value]="template.type" size="sm"></ax-field-display>
  </div>

  <!-- Card Actions -->
  <div class="flex items-center justify-between pt-4 border-t">
    <span class="text-xs text-gray-500"> {{ template.created_at | date: 'short' }} </span>
    <div class="flex gap-2">
      <button mat-icon-button (click)="openPreviewDialog(template)">
        <mat-icon>visibility</mat-icon>
      </button>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
    </div>
  </div>
</ax-card>
```

---

## Layout Design

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Header (mat-toolbar)                                  [+ Create] │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ Permission Error Banner (if applicable)                      │
├─────────────────────────────────────────────────────────────────┤
│ Search & Filters Section                                        │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [Search.....................] [All][Active][Starters] [+]│   │
│ │ ▼ Advanced Filters (collapsible)                         │   │
│ │   Category | Type | Status                               │   │
│ │ Active Filters: [Category: Inventory ×] [Status: Active ×]│   │
│ └───────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ KPI Dashboard (4 cards)                                         │
│ ┌──────────┬──────────┬──────────┬──────────┐                  │
│ │ Total    │ Active   │ Starters │ Usage    │                  │
│ │ 156      │ 142      │ 12       │ 1,024    │                  │
│ └──────────┴──────────┴──────────┴──────────┘                  │
├─────────────────────────────────────────────────────────────────┤
│ Templates Grid (Card View)                    [Grid][List]      │
│ ┌─────────────┬─────────────┬─────────────┐                    │
│ │ Card 1      │ Card 2      │ Card 3      │                    │
│ │ Template A  │ Template B  │ Template C  │                    │
│ │ [Preview]   │ [Preview]   │ [Preview]   │                    │
│ └─────────────┴─────────────┴─────────────┘                    │
│ ┌─────────────┬─────────────┬─────────────┐                    │
│ │ Card 4      │ Card 5      │ Card 6      │                    │
│ └─────────────┴─────────────┴─────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ Pagination                               [< 1 2 3 4 5 >]        │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 640px)

```
┌─────────────────────┐
│ Header        [☰]   │
├─────────────────────┤
│ Search...           │
│ [All][Active][...]  │
│ ▼ Filters           │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Total: 156      │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Active: 142     │ │
│ └─────────────────┘ │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ Template Card 1 │ │
│ │ [Preview] [...]  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Template Card 2 │ │
│ └─────────────────┘ │
├─────────────────────┤
│ [< 1 2 3 >]         │
└─────────────────────┘
```

---

## Component Specifications

### 1. KPI Card Component (ax-kpi-card)

**Props**:

```typescript
{
  variant: 'compact',
  size: 'md',
  title: string,
  value: number | string,
  icon: string,
  accentColor: 'primary' | 'success' | 'warning' | 'info' | 'error',
  accentPosition: 'left' | 'top',
  trend?: 'up' | 'down' | 'stable',
  clickable?: boolean
}
```

**Usage**:

- Total Templates: primary accent
- Active Templates: success accent, clickable
- Starter Templates: warning accent, clickable
- Total Usage: info accent

### 2. Template Card Component (ax-card)

**Structure**:

```typescript
interface TemplateCardData {
  template: PdfTemplate;
  onPreview: (template: PdfTemplate) => void;
  onEdit: (template: PdfTemplate) => void;
  onDuplicate: (template: PdfTemplate) => void;
  onDelete: (template: PdfTemplate) => void;
}
```

**Layout**:

- Header: Display name + badges (Starter, Default)
- Subheader: Name (font-mono) + Status badge
- Body: Field displays (Category, Type, Usage)
- Footer: Created date + action buttons

### 3. Status Badge (ax-badge)

**Variants**:

- **Active**: `variant="solid" color="success"`
- **Inactive**: `variant="outlined" color="error"`
- **Starter**: `variant="solid" color="warning" icon="stars"`
- **Default**: `variant="solid" color="primary"`

### 4. Field Display (ax-field-display)

**Props**:

```typescript
{
  label: string,
  value: string | number,
  size: 'sm' | 'md' | 'lg',
  icon?: string
}
```

### 5. Empty State (ax-empty-state)

**Props**:

```typescript
{
  icon: 'description',
  title: 'No Templates Found',
  message: 'Get started by creating your first PDF template or choose from our starter templates.',
  compact: false,
  actions: [
    { label: 'Create New Template', primary: true, onClick: openCreateDialog },
    { label: 'Browse Starter Templates', primary: false, onClick: browseStarters }
  ]
}
```

---

## Styling Guidelines

### TailwindCSS Utilities

**Spacing**:

```css
/* Padding */
p-4  /* 16px */
p-6  /* 24px */

/* Margin */
mb-4 /* margin-bottom: 16px */
mt-6 /* margin-top: 24px */

/* Gap */
gap-4  /* 16px gap in flex/grid */
space-y-3 /* vertical spacing */
```

**Layout**:

```css
/* Flexbox */
flex items-center justify-between

/* Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

**Colors**:

```css
/* Text */
text-gray-900 dark:text-gray-100
text-gray-600 dark:text-gray-400

/* Background */
bg-white dark:bg-gray-800
bg-gray-50 dark:bg-gray-900

/* Border */
border-gray-200 dark:border-gray-700
```

**Effects**:

```css
/* Shadow */
shadow-sm hover:shadow-md

/* Transitions */
transition-all duration-200

/* Rounded */
rounded-lg
```

### Custom SCSS (Minimal)

```scss
// Only for complex animations or Material overrides
.template-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.filter-chip {
  &.mat-mdc-chip {
    // Material chip overrides if needed
  }
}
```

---

## State Management

### Component State

```typescript
// View mode
viewMode = signal<'grid' | 'table'>('grid');

// Selection
selectedIds = signal<Set<string>>(new Set());

// Filters
filters = signal<Partial<ListPdfTemplateQuery>>({});
quickFilter = signal<'all' | 'active' | 'inactive' | 'starters'>('all');
searchTerm = signal<string>('');
selectedCategory = signal<string>('');
selectedType = signal<string>('');
selectedStatus = signal<boolean | ''>('');

// Pagination
currentPage = computed(() => this.pdfTemplatesService.currentPage());
pageSize = computed(() => this.pdfTemplatesService.pageSize());
totalItems = computed(() => this.pdfTemplatesService.totalPdfTemplate());

// Computed
isLoading = computed(() => this.pdfTemplatesService.loading());
hasError = computed(() => this.pdfTemplatesService.error());
hasPermissionError = computed(() => this.pdfTemplatesService.permissionError());
templates = computed(() => this.pdfTemplatesService.pdfTemplatesList());

// Statistics
activeCount = computed(() => this.getActiveCount());
starterCount = computed(() => this.getTemplateStartersCount());
totalUsage = computed(() => this.getTotalUsageCount());
```

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};

// Grid columns
- Mobile (< 640px): 1 column
- Tablet (640px - 1024px): 2 columns
- Desktop (> 1024px): 3 columns
- Large (> 1280px): 4 columns (optional)
```

---

## Interaction Design

### Hover States

**KPI Cards**:

- Transform: `translateY(-2px)`
- Shadow: `shadow-sm` → `shadow-lg`
- Cursor: `pointer` (if clickable)

**Template Cards**:

- Transform: `translateY(-2px)`
- Shadow: `shadow-sm` → `shadow-md`
- Border: subtle color change

**Buttons**:

- Material Design ripple effect
- Opacity change on hover

### Click Interactions

**KPI Cards (Clickable)**:

- Active card → Apply "active" filter
- Starters card → Apply "starters" filter
- Visual feedback (ripple)

**Template Cards**:

- Preview button → Open preview dialog
- More menu → Show actions menu
- Card body → No action (prevent accidental clicks)

### Loading States

**Initial Load**:

```html
<div class="flex flex-col items-center justify-center py-20">
  <mat-progress-spinner mode="indeterminate" diameter="60" color="primary"></mat-progress-spinner>
  <p class="mt-4 text-gray-600">Loading templates...</p>
</div>
```

**Pagination Load**:

- Spinner in pagination area
- Cards fade out/in

---

## Accessibility

### Keyboard Navigation

- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons
- Escape: Close dialogs/menus
- Arrow keys: Navigate in menus

### ARIA Labels

```html
<ax-kpi-card [attr.aria-label]="'Total templates count: ' + totalCount" [attr.role]="clickable ? 'button' : 'presentation'" [attr.tabindex]="clickable ? 0 : -1"></ax-kpi-card>

<button mat-icon-button aria-label="Preview template" (click)="onPreview()">
  <mat-icon>visibility</mat-icon>
</button>
```

### Focus Indicators

```css
/* Visible focus ring */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-500;
}

/* Button focus */
button:focus-visible {
  @apply ring-2 ring-blue-500 ring-offset-2;
}
```

---

## Performance Considerations

### Virtual Scrolling (if needed)

```typescript
// If list > 100 items, implement virtual scrolling
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

<cdk-virtual-scroll-viewport itemSize="200" class="viewport">
  <ax-card *cdkVirtualFor="let template of templates">
    <!-- Card content -->
  </ax-card>
</cdk-virtual-scroll-viewport>
```

### Lazy Loading

```typescript
// Lazy load images in cards
<img [src]="template.thumbnail" loading="lazy" alt="Template preview">
```

### Change Detection

```typescript
// Use OnPush strategy for child components
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCardComponent {
  // Signals-based, minimal change detection
}
```

---

## Dark Mode Design

### Color Scheme

**Light Mode**:

- Background: `#ffffff`, `#f9fafb`
- Text: `#111827`, `#6b7280`
- Border: `#e5e7eb`

**Dark Mode**:

- Background: `#1f2937`, `#111827`
- Text: `#f9fafb`, `#d1d5db`
- Border: `#374151`

### Implementation

```html
<!-- Automatic dark mode classes -->
<div class="bg-white dark:bg-gray-800">
  <p class="text-gray-900 dark:text-gray-100">Content</p>
</div>

<!-- Material theme handled by Angular Material -->
<!-- TailwindCSS dark: prefix for custom elements -->
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('PdfTemplatesListComponent', () => {
  it('should display KPI cards', () => {
    // Test KPI cards rendering
  });

  it('should switch between grid and table views', () => {
    // Test view toggle
  });

  it('should filter templates on quick filter click', () => {
    // Test quick filters
  });

  it('should display empty state when no templates', () => {
    // Test empty state
  });
});
```

### Visual Regression Tests

- Screenshot comparison for different states
- Responsive breakpoints
- Dark mode vs Light mode

### Accessibility Tests

- Lighthouse accessibility audit
- Axe DevTools scan
- Keyboard navigation testing

---

## Migration Path

### Phase 1: Preparation

1. Create new component files (HTML, SCSS)
2. Copy template and styles
3. Verify everything still works

### Phase 2: Dashboard

1. Replace summary cards with ax-kpi-card
2. Test clickable functionality
3. Test responsive layout

### Phase 3: List View

1. Create TemplateCardComponent
2. Implement card grid
3. Add view toggle
4. Test responsiveness

### Phase 4: Filters

1. Refactor filters section
2. Add collapsible advanced filters
3. Implement filter chips
4. Test filter interactions

### Phase 5: Polish

1. Apply TailwindCSS utilities
2. Remove custom CSS
3. Test dark mode
4. Accessibility audit

---

**Design Version**: 1.0
**Last Updated**: 2025-12-19
**Status**: Ready for Implementation
