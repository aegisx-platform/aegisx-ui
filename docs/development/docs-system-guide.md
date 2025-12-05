# Documentation System Guide

> Comprehensive guide for creating Storybook-style documentation pages in AegisX Admin

## Overview

The AegisX documentation system provides a consistent, professional way to document UI components with live previews, code examples, API references, and usage guidelines.

---

## Architecture

```
apps/admin/src/app/
├── components/docs/           # Shared doc components
│   ├── doc-header/           # Page header with breadcrumbs
│   ├── code-tabs/            # Code examples with syntax highlighting
│   ├── live-preview/         # Live component preview container
│   ├── props-table/          # API properties table
│   ├── component-tokens/     # CSS tokens display
│   └── index.ts              # Barrel export
├── pages/docs/               # Documentation pages
│   └── components/aegisx/
│       ├── data-display/     # Badge, Card, Avatar, etc.
│       ├── forms/            # Input, DatePicker, etc.
│       ├── feedback/         # Alert, Toast, Loading, etc.
│       ├── navigation/       # Navbar, Breadcrumb, etc.
│       ├── layout/           # Drawer, Splitter, etc.
│       └── ...
├── routes/docs/              # Documentation routes
│   └── components-aegisx/    # Routes by category
└── types/docs.types.ts       # TypeScript interfaces
```

---

## Shared Components

### 1. DocHeaderComponent

**Selector:** `ax-doc-header`

Unified header for all documentation pages with breadcrumbs, status badge, version, and import statement.

```html
<ax-doc-header
  title="Loading Button"
  icon="smart_button"
  description="Material 3 button with built-in loading state..."
  [breadcrumbs]="[
    { label: 'Feedback', link: '/docs/components/aegisx/feedback' },
    { label: 'Loading Button' }
  ]"
  status="stable"
  version="1.0.0"
  importName="AxLoadingButtonComponent"
/>
```

**Inputs:**

| Input            | Type               | Default | Description                         |
| ---------------- | ------------------ | ------- | ----------------------------------- |
| `title`          | `string`           | -       | Component title                     |
| `description`    | `string`           | -       | Brief description                   |
| `breadcrumbs`    | `BreadcrumbItem[]` | `[]`    | Navigation path                     |
| `icon`           | `string`           | -       | Material icon name                  |
| `status`         | `ComponentStatus`  | -       | stable/beta/experimental/deprecated |
| `version`        | `string`           | -       | Version number                      |
| `importName`     | `string`           | -       | Component name for import           |
| `showImport`     | `boolean`          | `true`  | Show import statement               |
| `showQuickLinks` | `boolean`          | `true`  | Show jump-to links                  |

---

### 2. CodeTabsComponent

**Selector:** `ax-code-tabs`

Displays code examples with Prism.js syntax highlighting in tabbed format.

```html
<!-- Basic usage -->
<ax-code-tabs
  [tabs]="[
  { label: 'HTML', code: htmlCode, language: 'html' },
  { label: 'TypeScript', code: tsCode, language: 'typescript' }
]"
/>

<!-- With live preview tab -->
<ax-code-tabs
  [tabs]="[
  { label: 'Preview', code: '', language: 'preview' },
  { label: 'HTML', code: htmlCode, language: 'html' },
  { label: 'TypeScript', code: tsCode, language: 'typescript' }
]"
>
  <!-- Live component rendered here when Preview tab is active -->
  <ax-loading-button [loading]="isLoading">Click Me</ax-loading-button>
</ax-code-tabs>
```

**Inputs:**

| Input             | Type        | Default | Description        |
| ----------------- | ----------- | ------- | ------------------ |
| `tabs`            | `CodeTab[]` | `[]`    | Array of code tabs |
| `showLineNumbers` | `boolean`   | `false` | Show line numbers  |

**CodeTab Interface:**

```typescript
interface CodeTab {
  label: string;
  code: string;
  language: 'html' | 'typescript' | 'scss' | 'bash' | 'json' | 'preview';
}
```

**Features:**

- Mac-style window chrome (red/yellow/green dots)
- Copy-to-clipboard button
- Catppuccin Mocha syntax theme
- `preview` language renders `ng-content` as live demo

---

### 3. LivePreviewComponent

**Selector:** `ax-live-preview`

Container for displaying live component examples with flexible layout.

```html
<!-- Centered single item -->
<ax-live-preview variant="bordered">
  <ax-component />
</ax-live-preview>

<!-- Multiple items in row -->
<ax-live-preview variant="bordered" direction="row" gap="var(--ax-spacing-lg)">
  <ax-component variant="small" />
  <ax-component variant="medium" />
  <ax-component variant="large" />
</ax-live-preview>
```

**Inputs:**

| Input       | Type      | Default      | Description       |
| ----------- | --------- | ------------ | ----------------- |
| `variant`   | `string`  | `'bordered'` | Background style  |
| `align`     | `string`  | `'center'`   | Content alignment |
| `direction` | `string`  | `'row'`      | Flex direction    |
| `wrap`      | `boolean` | `true`       | Enable flex-wrap  |
| `gap`       | `string`  | token        | Gap between items |
| `minHeight` | `string`  | `'100px'`    | Minimum height    |

**Variants:** `'default' | 'dark' | 'subtle' | 'bordered' | 'white' | 'contrast'`

---

### 4. ComponentTokensComponent

**Selector:** `ax-component-tokens`

Displays CSS tokens/variables used by a component with live values.

```html
<ax-component-tokens
  [tokens]="[
  { cssVar: '--ax-brand-default', category: 'Colors', usage: 'Primary color' },
  { cssVar: '--ax-spacing-md', category: 'Spacing', usage: 'Default padding' },
  { cssVar: '--ax-shadow-sm', category: 'Shadows', usage: 'Card shadow' }
]"
/>
```

**ComponentToken Interface:**

```typescript
interface ComponentToken {
  cssVar: string; // CSS variable name
  category: string; // Token category
  usage: string; // How it's used
  value?: string; // Optional static value
}
```

---

### 5. PropsTableComponent

**Selector:** `ax-props-table`

Displays component properties in a formatted table.

```html
<ax-props-table
  [properties]="[
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading state',
    required: false
  },
  {
    name: 'variant',
    type: 'string',
    default: 'raised',
    description: 'Button style variant',
    values: ['raised', 'stroked', 'flat', 'basic']
  }
]"
/>
```

---

## Standard Page Structure

### File Location

```
apps/admin/src/app/pages/docs/components/aegisx/[category]/[component]/
└── [component]-doc.component.ts
```

### Standard Template

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AxComponentName } from '@aegisx/ui';
import { DocHeaderComponent, CodeTabsComponent, ComponentTokensComponent } from '../../../../../../components/docs';
import { ComponentToken } from '../../../../../../types/docs.types';

@Component({
  selector: 'ax-component-name-doc',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, AxComponentName, DocHeaderComponent, CodeTabsComponent, ComponentTokensComponent],
  template: `
    <div class="component-doc">
      <!-- Header -->
      <ax-doc-header title="Component Name" icon="icon_name" description="Component description..." [breadcrumbs]="[{ label: 'Category', link: '/docs/components/aegisx/category' }, { label: 'Component Name' }]" status="stable" version="1.0.0" importName="AxComponentName" />

      <!-- Tabs -->
      <mat-tab-group class="component-doc__tabs" animationDuration="150ms">
        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="component-doc__tab-content">
            <section class="component-doc__section">
              <h2>Basic Usage</h2>
              <p>Description...</p>
              <ax-code-tabs [tabs]="basicUsageTabs">
                <ax-component>Live Preview</ax-component>
              </ax-code-tabs>
            </section>

            <section class="component-doc__section">
              <h2>Variants</h2>
              <ax-code-tabs [tabs]="variantsTabs">
                <div class="component-doc__demo-row">
                  <ax-component variant="a" />
                  <ax-component variant="b" />
                </div>
              </ax-code-tabs>
            </section>
          </div>
        </mat-tab>

        <!-- Examples Tab -->
        <mat-tab label="Examples">
          <div class="component-doc__tab-content">
            <!-- Advanced examples -->
          </div>
        </mat-tab>

        <!-- API Tab -->
        <mat-tab label="API">
          <div class="component-doc__tab-content">
            <section class="component-doc__section">
              <h2>Properties (Inputs)</h2>
              <!-- API table -->
            </section>
            <section class="component-doc__section">
              <h2>Events (Outputs)</h2>
              <!-- Events table -->
            </section>
          </div>
        </mat-tab>

        <!-- Tokens Tab -->
        <mat-tab label="Tokens">
          <div class="component-doc__tab-content">
            <ax-component-tokens [tokens]="componentTokens" />
          </div>
        </mat-tab>

        <!-- Guidelines Tab -->
        <mat-tab label="Guidelines">
          <div class="component-doc__tab-content">
            <section class="component-doc__section">
              <h2>Do's and Don'ts</h2>
              <!-- Guidelines content -->
            </section>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .component-doc {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ax-spacing-xl);
      }
      .component-doc__tabs {
        margin-top: var(--ax-spacing-xl);
      }
      .component-doc__tab-content {
        padding: var(--ax-spacing-xl) 0;
      }
      .component-doc__section {
        margin-bottom: var(--ax-spacing-3xl);
      }
      .component-doc__section h2 {
        font-size: var(--ax-text-xl);
        font-weight: 600;
        margin: 0 0 var(--ax-spacing-sm) 0;
      }
      .component-doc__demo-row {
        display: flex;
        gap: var(--ax-spacing-md);
        flex-wrap: wrap;
        align-items: center;
      }
    `,
  ],
})
export class ComponentNameDocComponent {
  // Code tabs with Preview
  basicUsageTabs = [
    { label: 'Preview', language: 'preview' as const, code: '' },
    { label: 'HTML', language: 'html' as const, code: `<ax-component>...</ax-component>` },
    { label: 'TypeScript', language: 'typescript' as const, code: `import { ... }` },
  ];

  variantsTabs = [
    { label: 'Preview', language: 'preview' as const, code: '' },
    { label: 'HTML', language: 'html' as const, code: `...` },
  ];

  // CSS tokens
  componentTokens: ComponentToken[] = [{ cssVar: '--ax-brand-default', category: 'Colors', usage: 'Primary color' }];
}
```

---

## Tab Organization

### Standard 5-Tab Layout

| Tab            | Content                                |
| -------------- | -------------------------------------- |
| **Overview**   | Basic usage, variants, common examples |
| **Examples**   | Advanced usage, real-world scenarios   |
| **API**        | Properties, events, methods            |
| **Tokens**     | CSS variables, customization           |
| **Guidelines** | Do's/Don'ts, accessibility             |

---

## Code Tabs Pattern (Recommended)

### With Preview Tab (Saves Space)

```typescript
sectionTabs = [
  { label: 'Preview', language: 'preview' as const, code: '' },
  { label: 'HTML', language: 'html' as const, code: htmlCode },
  { label: 'TypeScript', language: 'typescript' as const, code: tsCode },
];
```

```html
<ax-code-tabs [tabs]="sectionTabs">
  <!-- Live component preview -->
  <div class="demo-row">
    <ax-component [loading]="isLoading" />
  </div>
</ax-code-tabs>
```

**Benefits:**

- Single component instead of `ax-live-preview + ax-code-tabs`
- Saves vertical space
- Consistent tab interface
- Preview is first tab (default view)

---

## Naming Conventions

### Files

```
[component-name]-doc.component.ts
```

### Selectors

```
ax-[component-name]-doc
```

### CSS Classes

```scss
.[component-name]-doc {
}
.[component-name]-doc__tabs {
}
.[component-name]-doc__tab-content {
}
.[component-name]-doc__section {
}
.[component-name]-doc__demo-row {
}
.[component-name]-doc__demo-column {
}
```

### Properties

```typescript
// Code tabs: [section]Tabs
basicUsageTabs = [];
variantsTabs = [];
iconsTabs = [];

// Tokens
componentTokens: ComponentToken[] = [];
```

---

## Routing

### Route File Location

```
apps/admin/src/app/routes/docs/components-aegisx/[category].routes.ts
```

### Route Pattern

```typescript
export const FEEDBACK_ROUTES: Route[] = [
  {
    path: 'feedback/loading-button',
    loadComponent: () => import('../../../pages/docs/components/aegisx/feedback/loading-button/loading-button-doc.component').then((m) => m.LoadingButtonDocComponent),
    data: {
      title: 'Loading Button',
      description: 'Button with loading state',
    },
  },
];
```

---

## Categories

| Category     | Path            | Components                      |
| ------------ | --------------- | ------------------------------- |
| Data Display | `data-display/` | Badge, Card, Avatar, Timeline   |
| Forms        | `forms/`        | Input, DatePicker, Knob         |
| Feedback     | `feedback/`     | Alert, Toast, Loading, Skeleton |
| Navigation   | `navigation/`   | Navbar, Breadcrumb, Stepper     |
| Layout       | `layout/`       | Drawer, Splitter, Enterprise    |
| Charts       | `charts/`       | Sparkline, CircularProgress     |
| Utilities    | `utilities/`    | ThemeBuilder                    |
| Auth         | `auth/`         | Login, Register examples        |
| Dashboard    | `dashboard/`    | Widget Framework                |

---

## Quick Reference

### Import All Doc Components

```typescript
import { DocHeaderComponent, CodeTabsComponent, LivePreviewComponent, ComponentTokensComponent } from '../../../../../../components/docs';
```

### Import Types

```typescript
import { ComponentToken, CodeTab } from '../../../../../../types/docs.types';
```

### Common Material Imports

```typescript
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
```

---

## Best Practices

1. **Always use Preview tab** - Use `language: 'preview'` for live demos
2. **Keep code examples concise** - Show essential code only
3. **Use semantic tokens** - Reference `--ax-*` CSS variables
4. **Document all inputs/outputs** - Complete API reference
5. **Include do's and don'ts** - Help users avoid mistakes
6. **Show real-world examples** - Practical use cases
7. **Test on dark mode** - Ensure examples work in both themes

---

## Example Reference

See complete implementation:

- `loading-button-doc.component.ts` - Full example with all patterns
- `card-doc.component.ts` - Comprehensive component documentation
