# @aegisx/ui

A comprehensive enterprise Angular UI library featuring layouts, components, and services built with Angular Material and TailwindCSS. Supports Angular 17+ with multiple integration patterns.

[![npm version](https://badge.fury.io/js/%40aegisx%2Fui.svg)](https://badge.fury.io/js/%40aegisx%2Fui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install @aegisx/ui
# or
pnpm add @aegisx/ui
# or
yarn add @aegisx/ui
```

### Setup Options

#### 🆕 **Option 1: Provider Functions (Recommended for Angular 17+)**

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAegisxUI } from '@aegisx/ui';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAegisxUI({
      theme: { name: 'indigo', scheme: 'auto' },
      layout: { default: 'sidebar', sidenavWidth: 280 },
      features: { darkMode: true, animations: true },
    }),
  ],
});
```

#### **Option 2: NgModule (Legacy Support)**

```typescript
// app.module.ts
import { AegisxUIModule } from '@aegisx/ui';

@NgModule({
  imports: [
    AegisxUIModule.forRoot({
      theme: { name: 'default', scheme: 'light' },
      layout: { default: 'sidebar' },
    }),
  ],
})
export class AppModule {}
```

#### **Option 3: Direct standalone imports (Tree-shakable)**

```typescript
// component.ts — pick only the components you actually use
import { AxSidebarLayoutComponent, AxCardComponent, AxThemeSwitcherComponent } from '@aegisx/ui';

@Component({
  standalone: true,
  imports: [AxSidebarLayoutComponent, AxCardComponent, AxThemeSwitcherComponent],
})
export class AppComponent {}
```

### Basic Usage

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { AxSidebarLayoutComponent, AxCardComponent } from '@aegisx/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AxSidebarLayoutComponent, AxCardComponent],
  template: `
    <ax-sidebar-layout appName="Dashboard">
      <ax-card title="Welcome" subtitle="Getting started">
        <p>Your content here</p>
      </ax-card>
    </ax-sidebar-layout>
  `,
})
export class AppComponent {}
```

## ✨ Features

### 📐 Layout System

- **📱 Responsive** - Mobile-first design with automatic adaptation
- **🎨 Customizable** - Configurable sidebars, headers, and navigation
- **🚀 Modern** - Built with Angular Signals and standalone components

| Layout                    | Description                                        | Best For                    |
| ------------------------- | -------------------------------------------------- | --------------------------- |
| `ax-sidebar-layout`       | Left sidebar navigation                            | Most admin / SaaS apps      |
| `ax-enterprise-layout`    | Horizontal top-nav bar                             | Multi-module enterprise UIs |
| `ax-docs-layout`          | Sidebar nav + table of contents                    | Documentation sites         |
| `ax-empty-layout`         | Minimal centered layout, no chrome                 | Login, error, standalone    |
| `ax-dashboard-panel`      | Composable dashboard sub-region                    | Inside other layouts        |
| `ax-nav-shell` (next-gen) | Composable shell (top-bar / rail / expanded modes) | Custom or multi-mode apps   |

### 🛠️ Core Services

| Service                     | Purpose                  | Features                             |
| --------------------------- | ------------------------ | ------------------------------------ |
| `AegisxConfigService`       | Configuration management | Theme switching, layout preferences  |
| `AegisxNavigationService`   | Navigation state         | Dynamic menu generation, breadcrumbs |
| `AegisxLoadingService`      | Loading states           | Global loading indicators            |
| `AegisxMediaWatcherService` | Responsive breakpoints   | Mobile/desktop detection             |

### 🎨 UI Components

| Component   | Selector           | Description                       |
| ----------- | ------------------ | --------------------------------- |
| Card        | `<ax-card>`        | Enhanced Material Design cards    |
| Alert       | `<ax-alert>`       | Notification alerts with variants |
| Drawer      | `<ax-drawer>`      | Configurable side panels          |
| Navigation  | `<ax-navigation>`  | Flexible navigation trees         |
| Breadcrumb  | `<ax-breadcrumb>`  | Dynamic breadcrumb navigation     |
| Loading Bar | `<ax-loading-bar>` | Global progress indicators        |
| Navbar User | `<ax-navbar-user>` | User profile dropdown for navbars |

### 🎯 Developer Experience

- **🔤 TypeScript** - Fully typed with strict mode
- **📦 Tree-shakable** - Import only what you need
- **🔄 SSR Ready** - Server-side rendering support
- **♿ Accessible** - WCAG 2.1 compliant components
- **🎨 Themeable** - Custom theme support with CSS variables

## Usage Examples

### Using Layouts

```typescript
// Sidebar Layout
<ax-sidebar-layout
  appName="My App"
  [navigation]="navItems"
  [showFooter]="true"
  (logoutClicked)="logout()">
  <ng-template #headerActions>
    <ax-theme-switcher />
    <button mat-icon-button aria-label="Settings">
      <mat-icon>settings</mat-icon>
    </button>
  </ng-template>

  <!-- Page content -->
  <div class="p-6">
    <h1>Welcome to AegisX</h1>
  </div>
</ax-sidebar-layout>
```

### Using Services

```typescript
import { AegisxConfigService, AegisxNavigationService } from '@aegisx/ui';

export class AppComponent {
  constructor(
    private config: AegisxConfigService,
    private navigation: AegisxNavigationService,
  ) {
    // Set configuration
    this.config.update({ scheme: 'dark' });

    // Set navigation
    this.navigation.setNavigation('default', [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/dashboard',
      },
    ]);
  }
}
```

### Using Components

```typescript
// Card Component
<ax-card
  title="Statistics"
  subtitle="Monthly overview"
  icon="bar_chart"
  appearance="elevated"
>
  <p>Your content here</p>
  <div card-actions>
    <button mat-button>View Details</button>
  </div>
</ax-card>

// Alert Component
<ax-alert
  type="success"
  title="Success!"
  [dismissible]="true"
>
  Your operation completed successfully.
</ax-alert>

// Drawer Component
<ax-drawer #drawer title="Settings" size="md">
  <h3>Application Settings</h3>
  <!-- Settings content -->
  <div drawer-footer>
    <button mat-button (click)="drawer.close()">Cancel</button>
    <button mat-raised-button color="primary">Save</button>
  </div>
</ax-drawer>
```

### Using Directives

```typescript
// Custom Scrollbar
<div axScrollbar="thin" class="overflow-auto h-64">
  <!-- Scrollable content -->
</div>

// Scroll Reset
<main axScrollReset>
  <router-outlet></router-outlet>
</main>
```

## 🎨 Advanced Configuration

### Theme Customization

```typescript
import { provideAegisxUI } from '@aegisx/ui';

bootstrapApplication(AppComponent, {
  providers: [
    provideAegisxUI({
      theme: {
        name: 'custom',
        scheme: 'auto', // 'light' | 'dark' | 'auto'
        colors: {
          primary: '#6366f1',
          accent: '#f59e0b',
          warn: '#ef4444',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
      },
      layout: {
        default: 'classic',
        sidenavWidth: 320,
        showBranding: true,
        collapsible: true,
      },
      features: {
        darkMode: true,
        animations: true,
        rtl: false,
      },
    }),
  ],
});
```

### Runtime Configuration Updates

```typescript
import { AegisxConfigService } from '@aegisx/ui';

@Component({...})
export class SettingsComponent {
  constructor(private config: AegisxConfigService) {}

  toggleDarkMode() {
    this.config.update({
      theme: { scheme: 'dark' }
    });
  }

  changeLayout(layout: 'classic' | 'compact') {
    this.config.update({
      layout: { default: layout }
    });
  }
}
```

## 🔄 Migration Guide

### From v0.0.x to v0.1.x

**1. Update Package Installation**

```bash
# Remove old version
npm uninstall @aegisx/ui

# Install new version
npm install @aegisx/ui@^0.1.0
```

**2. Configuration Changes**

```typescript
// ❌ Old configuration (v0.0.x)
AegisxUIModule.forRoot({
  theme: 'default',
  scheme: 'light',
  layout: 'classic',
});

// ✅ New configuration (v0.1.x)
AegisxUIModule.forRoot({
  theme: { name: 'default', scheme: 'light' },
  layout: { default: 'classic' },
});

// 🆕 Or use provider functions (recommended)
provideAegisxUI({
  theme: { name: 'default', scheme: 'light' },
  layout: { default: 'classic' },
});
```

**3. Component Import Updates**

```typescript
// ✅ Standardized imports (all components are standalone)
import { AxSidebarLayoutComponent } from '@aegisx/ui';

// Component usage
<ax-sidebar-layout>...</ax-sidebar-layout>
```

**4. Tree-shakable provider functions (Recommended)**

```typescript
// Pick only what you need (modern Angular)
import { provideAegisxConfig, provideAegisxLayouts, provideAegisxComponents, provideAegisxTheme } from '@aegisx/ui';

bootstrapApplication(AppComponent, {
  providers: [
    provideAegisxConfig({
      /* … */
    }),
    provideAegisxLayouts(),
    provideAegisxComponents(),
    provideAegisxTheme(),
  ],
});
```

## Development

### Running unit tests

Run `nx test aegisx-ui` to execute the unit tests.

### Building the library

Run `nx build aegisx-ui` to build the library.

## Requirements

- Angular 17 - 20
- Angular Material 17 - 20
- TailwindCSS 3.x
- @angular/cdk 17 - 20
- @angular/animations 17 - 20
- @angular/forms 17 - 20 (optional)
- @angular/router 17 - 20 (optional)

## Package Information

- **Current Version**: 0.1.0
- **Package Name**: @aegisx/ui
- **NPM Registry**: https://www.npmjs.com/package/@aegisx/ui
- **License**: MIT

## License

MIT
