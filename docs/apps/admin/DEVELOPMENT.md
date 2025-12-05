# Development Guide

> Complete guide for developing with AegisX Admin application

---

## Documentation Menu

| Document                               | Description                             |
| -------------------------------------- | --------------------------------------- |
| [README.md](./README.md)               | Overview & Quick Start                  |
| [COMPONENTS.md](./COMPONENTS.md)       | UI Components Reference (42 components) |
| [PATTERNS.md](./PATTERNS.md)           | Development Patterns (10 patterns)      |
| **[DEVELOPMENT.md](./DEVELOPMENT.md)** | Development Guide (คุณอยู่ที่นี่)       |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | Application Architecture                |

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Using AegisX MCP for Development](#using-aegisx-mcp-for-development)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 20+
- pnpm 8+
- Angular CLI 19+

## Getting Started

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/aegisx-platform/aegisx-starter.git
cd aegisx-starter

# Install dependencies
pnpm install
```

### 2. Start Development Server

```bash
# Start admin app
pnpm run dev:admin

# Or using Nx
nx serve admin
```

### 3. Access Application

Open [http://localhost:4200](http://localhost:4200)

---

## Development Workflow

### Creating New Components

#### 1. Using Angular CLI

```bash
# Generate component in pages
nx g @angular/core:component pages/my-feature/my-component --project=admin

# Generate in shared components
nx g @angular/core:component components/my-shared --project=admin
```

#### 2. Component Template

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxCardComponent, AxBadgeComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, AxCardComponent, AxBadgeComponent],
  template: `
    <ax-card>
      <ax-card-header>
        <ax-card-title>{{ title() }}</ax-card-title>
      </ax-card-header>
      <ax-card-content>
        <ax-badge [color]="status()">{{ statusLabel() }}</ax-badge>
      </ax-card-content>
    </ax-card>
  `,
})
export class MyComponent {
  // Signals for reactive state
  title = signal('My Component');
  status = signal<'success' | 'warning' | 'danger'>('success');

  // Computed values
  statusLabel = computed(() => {
    const statusMap = {
      success: 'Active',
      warning: 'Pending',
      danger: 'Error',
    };
    return statusMap[this.status()];
  });
}
```

### Creating Documentation Pages

#### 1. File Structure

```
pages/docs/components/aegisx/
├── my-component/
│   ├── my-component-doc.component.ts
│   ├── my-component-doc.component.html
│   └── index.ts
```

#### 2. Documentation Component Template

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocHeaderComponent, LivePreviewComponent, CodeTabsComponent, PropsTableComponent } from '../../../../components/docs';
import { AxMyComponent } from '@aegisx/ui';

@Component({
  selector: 'app-my-component-doc',
  standalone: true,
  imports: [CommonModule, DocHeaderComponent, LivePreviewComponent, CodeTabsComponent, PropsTableComponent, AxMyComponent],
  templateUrl: './my-component-doc.component.html',
})
export class MyComponentDocComponent {
  // Properties for props table
  properties = [
    { name: 'value', type: 'string', default: "''", description: 'Input value' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable input' },
  ];

  // Code examples
  basicExample = `
<ax-my-component [value]="'Hello'"></ax-my-component>
  `.trim();

  advancedExample = `
<ax-my-component
  [value]="myValue"
  [disabled]="isDisabled"
  (valueChange)="onValueChange($event)">
</ax-my-component>
  `.trim();
}
```

### Adding Routes

#### 1. Update Route File

```typescript
// routes/docs/components-aegisx.routes.ts
export const COMPONENTS_AEGISX_ROUTES: Route[] = [
  // ... existing routes
  {
    path: 'my-component',
    loadComponent: () => import('../../pages/docs/components/aegisx/my-component/my-component-doc.component').then((m) => m.MyComponentDocComponent),
    data: { title: 'My Component' },
  },
];
```

#### 2. Update Navigation Config

```typescript
// config/navigation.config.ts
const MY_CATEGORY_ITEMS: AxNavigationItem[] = [
  // ... existing items
  {
    id: 'my-component',
    title: 'My Component',
    type: 'item',
    icon: 'widgets',
    link: '/docs/components/aegisx/my-category/my-component',
  },
];
```

---

## Using AegisX MCP for Development

### Component Discovery

```bash
# Find components for a use case
aegisx_components_search "loading"
aegisx_components_search "form"
aegisx_components_search "chart"

# Get full component API
aegisx_components_get "Badge"
aegisx_components_get "KPI Card"
```

### Pattern Discovery

```bash
# List all patterns
aegisx_patterns_list

# Get pattern by category
aegisx_patterns_list --category "frontend"

# Get pattern code example
aegisx_patterns_get "Angular Signal-based Component"
aegisx_patterns_get "Angular HTTP Service"
```

### Pattern Suggestions

```bash
# Get pattern suggestions for a task
aegisx_patterns_suggest "create API endpoint"
aegisx_patterns_suggest "build form component"
aegisx_patterns_suggest "add validation"
```

---

## Code Standards

### TypeScript

```typescript
// Use signals for reactive state
const count = signal(0);
const doubled = computed(() => count() * 2);

// Use inject() for dependency injection
const http = inject(HttpClient);
const router = inject(Router);

// Use strict typing
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Angular Components

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,  // Always use standalone
  imports: [...],    // Import only what you need
  changeDetection: ChangeDetectionStrategy.OnPush,  // Use OnPush
  template: `...`,
})
export class MyComponent {
  // Inputs using signal
  readonly title = input<string>('');
  readonly disabled = input<boolean>(false);

  // Outputs
  readonly valueChange = output<string>();

  // Internal state
  private readonly value = signal('');
}
```

### Styling

```scss
// Use TailwindCSS utilities
@apply flex items-center gap-2 p-4;

// Use CSS variables for theming
color: var(--ax-text-primary);
background: var(--ax-surface-card);

// Use component-scoped styles
:host {
  display: block;
}
```

---

## Testing

### Unit Tests

```bash
# Run all tests
nx test admin

# Run specific test file
nx test admin --testFile=my-component.spec.ts

# Watch mode
nx test admin --watch
```

### Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title.set('Test Title');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('h1');
    expect(titleEl.textContent).toContain('Test Title');
  });
});
```

---

## Building for Production

### Build Commands

```bash
# Production build
nx build admin

# Build with stats
nx build admin --stats-json

# Analyze bundle
npx webpack-bundle-analyzer dist/apps/admin/stats.json
```

### Build Configuration

```json
// project.json
{
  "configurations": {
    "production": {
      "budgets": [
        { "type": "initial", "maximumWarning": "2mb", "maximumError": "2.5mb" },
        { "type": "anyComponentStyle", "maximumWarning": "12kb", "maximumError": "20kb" }
      ],
      "outputHashing": "all"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

#### 2. Build Errors

```bash
# Clear Nx cache
nx reset

# Rebuild
nx build admin
```

#### 3. Component Not Rendering

- Check standalone component imports
- Verify selector matches template usage
- Check for console errors

#### 4. Styling Issues

- Verify TailwindCSS is configured
- Check CSS variable availability
- Inspect computed styles in DevTools
