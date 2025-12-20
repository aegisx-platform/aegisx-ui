# Design Document

## Overview

This design outlines the implementation of 10 comprehensive documentation pages for inventory management components in the @apps/admin application. The implementation follows the established documentation patterns used throughout the admin app, ensuring consistency with existing component documentation pages like Card, Badge, and other AegisX UI components.

Each documentation page will follow the standard 5-tab structure (Overview, Examples, API, Tokens, Guidelines) and leverage existing documentation helper components (DocHeader, LivePreview, CodeTabs, ComponentTokens). The pages will be organized under a new "Inventory" category in the navigation system, with proper routing and lazy-loading configuration.

## Steering Document Alignment

### Technical Standards (tech.md)

Since no steering documents exist, this design follows the technical patterns observed in the existing codebase:

- **Angular Standalone Components**: All documentation pages use standalone component architecture
- **Lazy Loading**: Routes use dynamic imports for code splitting and performance
- **TypeScript Strict Mode**: All code adheres to strict type checking
- **Material Design**: Consistent use of Angular Material components
- **Design Tokens**: Adherence to AegisX design token system (CSS variables)
- **Accessibility**: WCAG 2.1 AA compliance throughout

### Project Structure (structure.md)

Following the established admin app structure:

```
apps/admin/src/app/
├── pages/docs/components/aegisx/
│   └── inventory/                    # New category directory
│       ├── stock-level/
│       ├── stock-alert-panel/
│       ├── location-picker/
│       ├── quantity-input/
│       ├── barcode-scanner/
│       ├── batch-selector/
│       ├── expiry-badge/
│       ├── stock-movement-timeline/
│       ├── transfer-wizard/
│       └── variant-selector/
├── routes/docs/components-aegisx/
│   └── inventory.routes.ts           # New routes file
└── config/
    └── navigation.config.ts          # Update with inventory items
```

## Code Reuse Analysis

### Existing Components to Leverage

1. **Doc Helper Components** (`apps/admin/src/app/components/docs/`):
   - `DocHeaderComponent`: Page header with breadcrumbs, title, description, import statement
   - `LivePreviewComponent`: Live component demonstration container with customizable backgrounds
   - `CodeTabsComponent`: Syntax-highlighted code display with copy functionality
   - `ComponentTokensComponent`: Design token display system
   - `CodePreviewComponent`: Additional code preview utilities

2. **Documentation Types** (`apps/admin/src/app/types/docs.types.ts`):
   - `CodeTab`: Interface for multi-language code examples
   - `ComponentToken`: Interface for design token documentation
   - `BreadcrumbItem`: Navigation breadcrumb structure
   - `ComponentStatus`: Status badge types (stable/beta/experimental)

3. **Existing Route Patterns**:
   - Reuse lazy-loading pattern from `data-display.routes.ts`, `forms.routes.ts`
   - Follow consistent route data structure with title and description
   - Apply same path naming conventions (kebab-case)

4. **Navigation Configuration Pattern**:
   - Extend `DOCS_NAVIGATION` in `navigation.config.ts`
   - Use existing navigation item structure with id, title, icon, link
   - Follow category grouping conventions

### Integration Points

1. **Routing System** (`apps/admin/src/app/app.routes.ts`):
   - Integrate `INVENTORY_ROUTES` into `COMPONENTS_AEGISX_ROUTES`
   - Maintain consistent route hierarchy: `/docs/components/aegisx/inventory/{component}`

2. **Navigation System** (`apps/admin/src/app/config/navigation.config.ts`):
   - Add "Inventory" section under Components category
   - Include all 10 components with appropriate Material icons
   - Maintain alphabetical ordering within sections

3. **Component Library** (`@aegisx/ui`):
   - Import all 10 inventory components from `libs/aegisx-ui/src/lib/components/inventory/`
   - Reference component type definitions for API documentation
   - Use actual component instances in live previews

## Architecture

### Modular Design Principles

Each documentation page follows these principles:

- **Single File Responsibility**: Each component doc file handles documentation for exactly one inventory component
- **Component Isolation**: Documentation pages are independent, standalone modules with no cross-dependencies
- **Service Layer Separation**: Documentation logic (code examples, token definitions) separated from presentation (template)
- **Utility Modularity**: Shared utilities accessed through doc helper components, not duplicated

### Architecture Diagram

```mermaid
graph TD
    A[Admin App Routes] --> B[Inventory Routes Module]
    B --> C1[Stock Level Doc Component]
    B --> C2[Stock Alert Panel Doc Component]
    B --> C3[Location Picker Doc Component]
    B --> C4[Quantity Input Doc Component]
    B --> C5[Barcode Scanner Doc Component]
    B --> C6[Batch Selector Doc Component]
    B --> C7[Expiry Badge Doc Component]
    B --> C8[Stock Movement Timeline Doc Component]
    B --> C9[Transfer Wizard Doc Component]
    B --> C10[Variant Selector Doc Component]

    C1 --> D[Doc Helper Components]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D
    C7 --> D
    C8 --> D
    C9 --> D
    C10 --> D

    D --> D1[DocHeader]
    D --> D2[LivePreview]
    D --> D3[CodeTabs]
    D --> D4[ComponentTokens]

    C1 --> E[@aegisx/ui Inventory Components]
    C2 --> E
    C3 --> E
    C4 --> E
    C5 --> E
    C6 --> E
    C7 --> E
    C8 --> E
    C9 --> E
    C10 --> E
```

### Component Documentation Page Structure

Each documentation component follows this standard structure:

```typescript
@Component({
  selector: 'ax-[component]-doc',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    // ... other Material modules as needed
    [InventoryComponent],        // The component being documented
    DocHeaderComponent,
    LivePreviewComponent,
    CodeTabsComponent,
    ComponentTokensComponent,
  ],
  templateUrl: './[component]-doc.component.html',
  styleUrls: ['./[component]-doc.component.scss']
})
export class [Component]DocComponent {
  // Breadcrumb navigation
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Documentation', link: '/docs' },
    { label: 'Components', link: '/docs/components' },
    { label: 'Inventory', link: '/docs/components/aegisx/inventory' },
    { label: '[Component Name]' }
  ];

  // Code examples for each section
  basicUsageCode: CodeTab[] = [...];
  variantsCode: CodeTab[] = [...];
  exampleCode: CodeTab[] = [...];

  // Design tokens
  componentTokens: ComponentToken[] = [...];

  // Component status
  status: ComponentStatus = 'stable';
}
```

## Components and Interfaces

### Component 1: Stock Level Documentation Component

- **Purpose:** Document the Stock Level component showing progress bar with color-coded zones
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/stock-level/stock-level-doc.component.ts`
- **Interfaces:**
  - Implements standard 5-tab documentation structure
  - Provides code examples for traffic-light and gradient color schemes
  - Documents size variants (sm/md/lg)
- **Dependencies:** MatTabsModule, DocHelper components, AxStockLevelComponent
- **Reuses:** Existing DocHeader, LivePreview, CodeTabs patterns from Card/Badge docs

### Component 2: Stock Alert Panel Documentation Component

- **Purpose:** Document the Stock Alert Panel for displaying inventory alerts with filtering
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/stock-alert-panel/stock-alert-panel-doc.component.ts`
- **Interfaces:**
  - Shows alert severity levels (critical/warning/info)
  - Demonstrates filtering and action handling
  - WebSocket integration examples
- **Dependencies:** MatTabsModule, DocHelper components, AxStockAlertPanelComponent
- **Reuses:** Alert-style documentation patterns, table components for API reference

### Component 3: Location Picker Documentation Component

- **Purpose:** Document the Location Picker tree view component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/location-picker/location-picker-doc.component.ts`
- **Interfaces:**
  - Tree view navigation examples
  - Search and favorites functionality
  - Multi-select mode demonstrations
- **Dependencies:** MatTabsModule, MatTreeModule, DocHelper components, AxLocationPickerComponent
- **Reuses:** Tree-based component documentation patterns

### Component 4: Quantity Input Documentation Component

- **Purpose:** Document the Quantity Input numeric control component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/quantity-input/quantity-input-doc.component.ts`
- **Interfaces:**
  - Basic increment/decrement controls
  - Min/max validation examples
  - Step increments and decimal support
- **Dependencies:** MatTabsModule, MatFormFieldModule, DocHelper components, AxQuantityInputComponent
- **Reuses:** Form input documentation patterns from date-picker/file-upload docs

### Component 5: Barcode Scanner Documentation Component

- **Purpose:** Document the Barcode Scanner camera integration component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/barcode-scanner/barcode-scanner-doc.component.ts`
- **Interfaces:**
  - Camera scanning mode examples
  - Manual entry fallback
  - Supported barcode formats
- **Dependencies:** MatTabsModule, DocHelper components, AxBarcodeScannerComponent
- **Reuses:** Interactive component documentation patterns

### Component 6: Batch Selector Documentation Component

- **Purpose:** Document the Batch Selector FIFO/FEFO/LIFO component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/batch-selector/batch-selector-doc.component.ts`
- **Interfaces:**
  - FIFO/FEFO/LIFO strategy examples
  - Batch selection with quantities
  - Expiry tracking integration
- **Dependencies:** MatTabsModule, MatRadioModule, DocHelper components, AxBatchSelectorComponent
- **Reuses:** Selection component documentation patterns

### Component 7: Expiry Badge Documentation Component

- **Purpose:** Document the Expiry Badge status indicator component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/expiry-badge/expiry-badge-doc.component.ts`
- **Interfaces:**
  - Color-coded status examples
  - Size and variant options
  - Compact mode for tables
- **Dependencies:** MatTabsModule, DocHelper components, AxExpiryBadgeComponent
- **Reuses:** Badge documentation patterns from existing badge-doc component

### Component 8: Stock Movement Timeline Documentation Component

- **Purpose:** Document the Stock Movement Timeline history component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/stock-movement-timeline/stock-movement-timeline-doc.component.ts`
- **Interfaces:**
  - Timeline view with Chart.js integration
  - Filtering and grouping options
  - Export functionality (PDF/Excel)
- **Dependencies:** MatTabsModule, DocHelper components, AxStockMovementTimelineComponent
- **Reuses:** Chart component documentation patterns, data display patterns

### Component 9: Transfer Wizard Documentation Component

- **Purpose:** Document the Transfer Wizard multi-step form component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/transfer-wizard/transfer-wizard-doc.component.ts`
- **Interfaces:**
  - 5-step workflow demonstration
  - Form validation at each step
  - Draft save/load functionality
- **Dependencies:** MatTabsModule, MatStepperModule, DocHelper components, AxTransferWizardComponent
- **Reuses:** Stepper/wizard documentation patterns

### Component 10: Variant Selector Documentation Component

- **Purpose:** Document the Variant Selector product variant component
- **File:** `apps/admin/src/app/pages/docs/components/aegisx/inventory/variant-selector/variant-selector-doc.component.ts`
- **Interfaces:**
  - Grid/list/compact layout modes
  - Multi-dimensional variant selection
  - Stock availability display
- **Dependencies:** MatTabsModule, MatGridListModule, DocHelper components, AxVariantSelectorComponent
- **Reuses:** Selection and filtering documentation patterns

## Data Models

### CodeTab Model (Existing - Reused)

```typescript
interface CodeTab {
  label: string; // Tab label (e.g., "HTML", "TypeScript")
  code: string; // Code content
  language: 'typescript' | 'html' | 'scss' | 'bash' | 'json' | 'preview';
}
```

**Usage:** Used in all documentation components to provide multi-language code examples

### ComponentToken Model (Existing - Reused)

```typescript
interface ComponentToken {
  category: string; // Token category (e.g., "Colors", "Spacing")
  cssVar: string; // CSS variable name (e.g., "--ax-brand-default")
  usage: string; // Description of usage
  value?: string; // Optional default value
}
```

**Usage:** Documents design tokens used by each inventory component

### BreadcrumbItem Model (Existing - Reused)

```typescript
interface BreadcrumbItem {
  label: string; // Breadcrumb text
  link?: string; // Optional navigation link
}
```

**Usage:** Navigation breadcrumbs in doc-header component

### DocumentationPageConfig (New - Internal)

```typescript
interface DocumentationPageConfig {
  component: {
    name: string; // Component name for display
    selector: string; // Component HTML selector
    importPath: string; // Import path from @aegisx/ui
    status: ComponentStatus; // stable | beta | experimental | deprecated
    version?: string; // Optional version number
  };
  sections: {
    overview: {
      basicUsage: CodeTab[];
      variants?: CodeTab[];
      sizes?: CodeTab[];
      states?: CodeTab[];
    };
    examples: {
      title: string;
      description: string;
      code: CodeTab[];
    }[];
    api: {
      inputs: APIProperty[];
      outputs: APIProperty[];
      methods?: APIProperty[];
    };
    tokens: ComponentToken[];
    guidelines: {
      dos: string[];
      donts: string[];
      accessibility: string[];
    };
  };
}
```

**Usage:** Internal configuration model for organizing documentation content

### APIProperty Model (New - Internal)

```typescript
interface APIProperty {
  name: string; // Property/event/method name
  type: string; // TypeScript type
  default?: string; // Default value (if applicable)
  description: string; // Description of purpose and usage
  required?: boolean; // Whether required (for inputs)
}
```

**Usage:** Documents component inputs, outputs, and methods in API tables

## Error Handling

### Error Scenarios

1. **Component Import Failure**
   - **Handling:** Wrap component imports in try-catch, display error message in live preview
   - **User Impact:** User sees "Component failed to load" with error details instead of broken page
   - **Implementation:** Use Angular error boundaries or ngOnInit error handling

2. **Code Syntax Highlighting Failure**
   - **Handling:** Fallback to plain text display if Prism.js fails
   - **User Impact:** Code is still readable, just without syntax highlighting
   - **Implementation:** Error handling in CodeTabsComponent

3. **Route Navigation Error**
   - **Handling:** Redirect to 404 page or documentation home if route doesn't exist
   - **User Impact:** Clear error message with navigation options
   - **Implementation:** Angular route guards and error handling

4. **Live Preview Rendering Error**
   - **Handling:** Catch component errors, display error state with code example
   - **User Impact:** User can still see code even if live preview fails
   - **Implementation:** Error boundaries in LivePreviewComponent

5. **Invalid Component Configuration**
   - **Handling:** Validate example data, show warning in development mode
   - **User Impact:** Prevents broken examples from being displayed
   - **Implementation:** TypeScript validation + runtime checks

## Routing Configuration

### Route Structure

File: `apps/admin/src/app/routes/docs/components-aegisx/inventory.routes.ts`

```typescript
import { Route } from '@angular/router';

export const INVENTORY_ROUTES: Route[] = [
  {
    path: 'inventory/stock-level',
    loadComponent: () => import('../../../pages/docs/components/aegisx/inventory/stock-level/stock-level-doc.component').then((m) => m.StockLevelDocComponent),
    data: {
      title: 'Stock Level Component',
      description: 'Progress bar indicator for inventory levels with color-coded zones',
    },
  },
  {
    path: 'inventory/stock-alert-panel',
    loadComponent: () => import('../../../pages/docs/components/aegisx/inventory/stock-alert-panel/stock-alert-panel-doc.component').then((m) => m.StockAlertPanelDocComponent),
    data: {
      title: 'Stock Alert Panel Component',
      description: 'Alert management panel with filtering and action handling',
    },
  },
  // ... 8 more routes following same pattern
];
```

### Integration with Main Routes

File: `apps/admin/src/app/routes/docs/components-aegisx/index.ts`

```typescript
import { INVENTORY_ROUTES } from './inventory.routes';

export const COMPONENTS_AEGISX_ROUTES: Route[] = [
  ...DATA_DISPLAY_ROUTES,
  ...FORMS_ROUTES,
  ...FEEDBACK_ROUTES,
  ...NAVIGATION_ROUTES,
  ...LAYOUT_ROUTES,
  ...UTILITIES_ROUTES,
  ...DASHBOARD_ROUTES,
  ...AUTH_ROUTES,
  ...UI_BLOCKS_ROUTES,
  ...INVENTORY_ROUTES, // New addition
];
```

## Navigation Configuration

### Navigation Items

File: `apps/admin/src/app/config/navigation.config.ts`

Add to `DOCS_NAVIGATION` under Components section:

```typescript
{
  id: 'components-inventory',
  title: 'Inventory',
  type: 'collapsable',
  icon: 'inventory_2',
  children: [
    {
      id: 'barcode-scanner',
      title: 'Barcode Scanner',
      type: 'item',
      icon: 'qr_code_scanner',
      link: '/docs/components/aegisx/inventory/barcode-scanner',
    },
    {
      id: 'batch-selector',
      title: 'Batch Selector',
      type: 'item',
      icon: 'widgets',
      link: '/docs/components/aegisx/inventory/batch-selector',
    },
    {
      id: 'expiry-badge',
      title: 'Expiry Badge',
      type: 'item',
      icon: 'event_busy',
      link: '/docs/components/aegisx/inventory/expiry-badge',
    },
    {
      id: 'location-picker',
      title: 'Location Picker',
      type: 'item',
      icon: 'place',
      link: '/docs/components/aegisx/inventory/location-picker',
    },
    {
      id: 'quantity-input',
      title: 'Quantity Input',
      type: 'item',
      icon: 'add_circle',
      link: '/docs/components/aegisx/inventory/quantity-input',
    },
    {
      id: 'stock-alert-panel',
      title: 'Stock Alert Panel',
      type: 'item',
      icon: 'notifications',
      link: '/docs/components/aegisx/inventory/stock-alert-panel',
    },
    {
      id: 'stock-level',
      title: 'Stock Level',
      type: 'item',
      icon: 'trending_up',
      link: '/docs/components/aegisx/inventory/stock-level',
    },
    {
      id: 'stock-movement-timeline',
      title: 'Stock Movement Timeline',
      type: 'item',
      icon: 'timeline',
      link: '/docs/components/aegisx/inventory/stock-movement-timeline',
    },
    {
      id: 'transfer-wizard',
      title: 'Transfer Wizard',
      type: 'item',
      icon: 'swap_horiz',
      link: '/docs/components/aegisx/inventory/transfer-wizard',
    },
    {
      id: 'variant-selector',
      title: 'Variant Selector',
      type: 'item',
      icon: 'tune',
      link: '/docs/components/aegisx/inventory/variant-selector',
    },
  ],
}
```

## Template Structure

### Standard 5-Tab Documentation Template

Each component documentation page uses this HTML template structure:

```html
<!-- Doc Header -->
<ax-doc-header [breadcrumbs]="breadcrumbs" [title]="componentName" [description]="componentDescription" [status]="status" [importStatement]="importStatement" [quickLinks]="quickLinks"> </ax-doc-header>

<!-- Tabbed Content -->
<mat-tab-group class="component-doc__tabs">
  <!-- Tab 1: Overview -->
  <mat-tab label="Overview">
    <section id="basic-usage">
      <h2>Basic Usage</h2>
      <ax-live-preview variant="bordered">
        <!-- Live component example -->
      </ax-live-preview>
      <ax-code-tabs [tabs]="basicUsageCode"></ax-code-tabs>
    </section>

    <section id="variants">
      <h2>Variants</h2>
      <!-- Multiple live examples with code -->
    </section>

    <!-- Additional sections as needed -->
  </mat-tab>

  <!-- Tab 2: Examples -->
  <mat-tab label="Examples">
    <section id="example-1">
      <h2>Example Title</h2>
      <p>Description of use case</p>
      <ax-live-preview>
        <!-- Real-world example -->
      </ax-live-preview>
      <ax-code-tabs [tabs]="exampleCode"></ax-code-tabs>
    </section>

    <!-- 3-5 examples total -->
  </mat-tab>

  <!-- Tab 3: API -->
  <mat-tab label="API">
    <section id="properties">
      <h2>Input Properties</h2>
      <table class="api-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <!-- Property rows -->
        </tbody>
      </table>
    </section>

    <section id="events">
      <h2>Output Events</h2>
      <table class="api-table">
        <!-- Event rows -->
      </table>
    </section>

    <section id="methods">
      <h2>Methods</h2>
      <table class="api-table">
        <!-- Method rows -->
      </table>
    </section>
  </mat-tab>

  <!-- Tab 4: Tokens -->
  <mat-tab label="Tokens">
    <ax-component-tokens [tokens]="componentTokens"></ax-component-tokens>
  </mat-tab>

  <!-- Tab 5: Guidelines -->
  <mat-tab label="Guidelines">
    <section id="dos-donts">
      <h2>Do's and Don'ts</h2>
      <div class="guidelines-grid">
        <div class="guideline guideline--do">
          <!-- Do examples -->
        </div>
        <div class="guideline guideline--dont">
          <!-- Don't examples -->
        </div>
      </div>
    </section>

    <section id="accessibility">
      <h2>Accessibility</h2>
      <ul>
        <!-- A11y guidelines -->
      </ul>
    </section>
  </mat-tab>
</mat-tab-group>
```

## Testing Strategy

### Unit Testing

**Approach:** Test each documentation component in isolation

**Key Components to Test:**

1. Component initialization (breadcrumbs, code examples, tokens)
2. Tab rendering and switching
3. Code example data structure validation
4. API table generation from property definitions
5. Import statement generation accuracy

**Test Files:** Create `[component]-doc.component.spec.ts` for each documentation component

**Example Test Cases:**

```typescript
describe('StockLevelDocComponent', () => {
  it('should create breadcrumb navigation correctly', () => {
    // Test breadcrumb structure
  });

  it('should display all 5 tabs', () => {
    // Test tab presence
  });

  it('should have valid code examples', () => {
    // Test code tab structure
  });

  it('should document all component inputs', () => {
    // Test API documentation completeness
  });
});
```

### Integration Testing

**Approach:** Test routing and navigation integration

**Key Flows to Test:**

1. Navigation from components menu to documentation page
2. Route lazy-loading and component initialization
3. Breadcrumb navigation links
4. Quick links within documentation
5. Code copy functionality
6. Tab switching and deep linking

**Test Scenarios:**

- Navigate to `/docs/components/aegisx/inventory/stock-level`
- Click breadcrumb to navigate back to components overview
- Click quick link to jump to API section
- Copy code example to clipboard
- Switch between tabs and verify content loads

### End-to-End Testing

**Approach:** Test complete user documentation exploration workflows

**User Scenarios to Test:**

**Scenario 1: Discover and Learn About Component**

1. User opens admin app
2. Navigates to Documentation > Components > Inventory
3. Clicks "Stock Level" from navigation
4. Views Overview tab examples
5. Switches to Examples tab to see real-world usage
6. Checks API tab for property reference
7. Copies code example to clipboard
8. Reviews Guidelines for accessibility best practices

**Scenario 2: Compare Multiple Inventory Components**

1. User opens Stock Level documentation
2. Notes pattern for progress indicators
3. Navigates to Stock Movement Timeline
4. Compares Chart.js integration approach
5. Returns to Stock Level using breadcrumbs
6. Switches between components using navigation menu

**Scenario 3: Mobile Documentation Access**

1. User opens documentation on mobile device
2. Navigation menu collapses appropriately
3. Code examples remain readable
4. Live previews scale to viewport
5. Tables scroll horizontally on small screens
6. Tab interface adapts to touch

**E2E Test Tools:**

- Playwright or Cypress for automated testing
- Manual testing checklist for visual verification
- Accessibility audit using axe-core

## File Organization Summary

```
apps/admin/src/app/
├── pages/docs/components/aegisx/inventory/
│   ├── barcode-scanner/
│   │   ├── barcode-scanner-doc.component.ts
│   │   ├── barcode-scanner-doc.component.html
│   │   ├── barcode-scanner-doc.component.scss
│   │   └── barcode-scanner-doc.component.spec.ts
│   ├── batch-selector/
│   │   ├── batch-selector-doc.component.ts
│   │   ├── batch-selector-doc.component.html
│   │   ├── batch-selector-doc.component.scss
│   │   └── batch-selector-doc.component.spec.ts
│   ├── expiry-badge/
│   │   ├── expiry-badge-doc.component.ts
│   │   ├── expiry-badge-doc.component.html
│   │   ├── expiry-badge-doc.component.scss
│   │   └── expiry-badge-doc.component.spec.ts
│   ├── location-picker/
│   │   ├── location-picker-doc.component.ts
│   │   ├── location-picker-doc.component.html
│   │   ├── location-picker-doc.component.scss
│   │   └── location-picker-doc.component.spec.ts
│   ├── quantity-input/
│   │   ├── quantity-input-doc.component.ts
│   │   ├── quantity-input-doc.component.html
│   │   ├── quantity-input-doc.component.scss
│   │   └── quantity-input-doc.component.spec.ts
│   ├── stock-alert-panel/
│   │   ├── stock-alert-panel-doc.component.ts
│   │   ├── stock-alert-panel-doc.component.html
│   │   ├── stock-alert-panel-doc.component.scss
│   │   └── stock-alert-panel-doc.component.spec.ts
│   ├── stock-level/
│   │   ├── stock-level-doc.component.ts
│   │   ├── stock-level-doc.component.html
│   │   ├── stock-level-doc.component.scss
│   │   └── stock-level-doc.component.spec.ts
│   ├── stock-movement-timeline/
│   │   ├── stock-movement-timeline-doc.component.ts
│   │   ├── stock-movement-timeline-doc.component.html
│   │   ├── stock-movement-timeline-doc.component.scss
│   │   └── stock-movement-timeline-doc.component.spec.ts
│   ├── transfer-wizard/
│   │   ├── transfer-wizard-doc.component.ts
│   │   ├── transfer-wizard-doc.component.html
│   │   ├── transfer-wizard-doc.component.scss
│   │   └── transfer-wizard-doc.component.spec.ts
│   └── variant-selector/
│       ├── variant-selector-doc.component.ts
│       ├── variant-selector-doc.component.html
│       ├── variant-selector-doc.component.scss
│       └── variant-selector-doc.component.spec.ts
├── routes/docs/components-aegisx/
│   └── inventory.routes.ts                    # New routes file
└── config/
    └── navigation.config.ts                   # Updated with inventory section
```

**Total Files to Create:** 44 files (40 component files + 1 routes file + 3 config updates)

## Implementation Phases

This design will be implemented in phases aligned with the task breakdown:

**Phase 1: Infrastructure Setup**

- Create inventory directory structure
- Create and configure inventory.routes.ts
- Update navigation.config.ts
- Update main routes integration

**Phase 2: Component Documentation (Batch 1: Simple Components)**

- Stock Level
- Expiry Badge
- Quantity Input

**Phase 3: Component Documentation (Batch 2: Interactive Components)**

- Location Picker
- Barcode Scanner
- Batch Selector

**Phase 4: Component Documentation (Batch 3: Complex Components)**

- Stock Alert Panel
- Stock Movement Timeline
- Transfer Wizard
- Variant Selector

**Phase 5: Testing and Polish**

- Unit tests for all documentation components
- Integration tests for routing
- E2E tests for user workflows
- Accessibility audit and fixes
- Documentation review and refinement
