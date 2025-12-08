# AegisX UI Components Reference

> Complete reference for all AegisX UI components with MCP integration examples

---

## Documentation Menu

| Document                             | Description                             |
| ------------------------------------ | --------------------------------------- |
| [README.md](./README.md)             | Overview & Quick Start                  |
| **[COMPONENTS.md](./COMPONENTS.md)** | UI Components Reference (คุณอยู่ที่นี่) |
| [PATTERNS.md](./PATTERNS.md)         | Development Patterns (10 patterns)      |
| [DEVELOPMENT.md](./DEVELOPMENT.md)   | Development Guide                       |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Application Architecture                |

---

## Table of Contents

- [Component Categories](#component-categories)
- [Using AegisX MCP](#using-aegisx-mcp)
- [Data Display Components](#data-display-components)
- [Form Components](#form-components)
- [Feedback Components](#feedback-components)
- [Navigation Components](#navigation-components)
- [Layout Components](#layout-components)
- [Auth Components](#auth-components)
- [Advanced Components](#advanced-components)
- [Overlay Components](#overlay-components)
- [Import Guide](#import-guide)

---

## Component Categories

| Category     | Components | Description                  |
| ------------ | ---------- | ---------------------------- |
| Data Display | 12         | Cards, badges, lists, charts |
| Forms        | 6          | Date picker, OTP, scheduler  |
| Feedback     | 5          | Alerts, loading, skeleton    |
| Navigation   | 4          | Breadcrumb, navbar, launcher |
| Layout       | 4          | Enterprise, compact, empty   |
| Auth         | 4          | Login, register, social      |
| Advanced     | 6          | Calendar, gridster, upload   |
| Overlays     | 1          | Drawer/sheet                 |

**Total: 42 Components**

---

## Using AegisX MCP

### List Components

```bash
# List all components
aegisx_components_list

# List by category
aegisx_components_list --category "data-display"
aegisx_components_list --category "forms"
aegisx_components_list --category "feedback"
aegisx_components_list --category "navigation"
aegisx_components_list --category "layout"
aegisx_components_list --category "auth"
aegisx_components_list --category "advanced"
aegisx_components_list --category "overlays"
```

### Get Component Details

```bash
# Get full component documentation
aegisx_components_get "Badge"
aegisx_components_get "Drawer"
aegisx_components_get "KPI Card"
```

### Search Components

```bash
# Search by keyword
aegisx_components_search "loading"
aegisx_components_search "chart"
aegisx_components_search "form"
```

---

## Data Display Components

### Badge (`ax-badge`)

Display status indicators, counts, or labels.

```html
<ax-badge color="success">Active</ax-badge>
<ax-badge color="warning" [count]="5">Pending</ax-badge>
<ax-badge variant="outline">Draft</ax-badge>
```

**MCP**: `aegisx_components_get "Badge"`

### Avatar (`ax-avatar`)

Display user profile images with fallback.

```html
<ax-avatar [src]="user.avatar" [name]="user.name"></ax-avatar> <ax-avatar icon="person" size="lg"></ax-avatar>
```

**MCP**: `aegisx_components_get "Avatar"`

### Card (`ax-card`)

Container for grouping related content.

```html
<ax-card>
  <ax-card-header>
    <ax-card-title>Title</ax-card-title>
  </ax-card-header>
  <ax-card-content>Content here...</ax-card-content>
</ax-card>
```

**MCP**: `aegisx_components_get "Card"`

### KPI Card (`ax-kpi-card`)

Display key performance indicators.

```html
<ax-kpi-card title="Revenue" [value]="125000" [trend]="12.5" trendDirection="up" prefix="$"> </ax-kpi-card>
```

**MCP**: `aegisx_components_get "KPI Card"`

### Stats Card (`ax-stats-card`)

Compact statistics display.

```html
<ax-stats-card label="Total Users" [value]="1234" icon="people"> </ax-stats-card>
```

**MCP**: `aegisx_components_get "Stats Card"`

### List (`ax-list`)

Flexible list for displaying items.

```html
<ax-list [items]="items" [selectable]="true">
  <ng-template #itemTemplate let-item> {{ item.name }} </ng-template>
</ax-list>
```

**MCP**: `aegisx_components_get "List"`

### Timeline (`ax-timeline`)

Chronological events display.

```html
<ax-timeline [items]="events" orientation="vertical"> </ax-timeline>
```

**MCP**: `aegisx_components_get "Timeline"`

### Circular Progress (`ax-circular-progress`)

Circular progress indicator.

```html
<ax-circular-progress [value]="75" [showLabel]="true"> </ax-circular-progress>
```

**MCP**: `aegisx_components_get "Circular Progress"`

### Segmented Progress (`ax-segmented-progress`)

Multi-segment progress bar.

```html
<ax-segmented-progress
  [segments]="[
  { value: 30, color: 'success' },
  { value: 20, color: 'warning' },
  { value: 10, color: 'danger' }
]"
></ax-segmented-progress>
```

**MCP**: `aegisx_components_get "Segmented Progress"`

### Sparkline (`ax-sparkline`)

Compact inline chart.

```html
<ax-sparkline [data]="[10, 20, 15, 25, 30]" type="line"> </ax-sparkline>
```

**MCP**: `aegisx_components_get "Sparkline"`

### Description List (`ax-description-list`)

Key-value pair display.

```html
<ax-description-list
  [items]="[
  { label: 'Name', value: 'John Doe' },
  { label: 'Email', value: 'john@example.com' }
]"
></ax-description-list>
```

**MCP**: `aegisx_components_get "Description List"`

### Field Display (`ax-field-display`)

Single field with label and value.

```html
<ax-field-display label="Status" value="Active" type="badge"> </ax-field-display>
```

**MCP**: `aegisx_components_get "Field Display"`

---

## Form Components

### Date Picker (`ax-date-picker`)

Date selection with calendar popup.

```html
<ax-date-picker [(ngModel)]="selectedDate" [range]="false" placeholder="Select date"> </ax-date-picker>
```

**MCP**: `aegisx_components_get "Date Picker"`

### Input OTP (`ax-input-otp`)

One-time password input.

```html
<ax-input-otp [length]="6" [(ngModel)]="otpCode" (complete)="onOtpComplete($event)"> </ax-input-otp>
```

**MCP**: `aegisx_components_get "Input OTP"`

### Knob (`ax-knob`)

Rotary knob control.

```html
<ax-knob [(ngModel)]="volume" [min]="0" [max]="100" [step]="1"> </ax-knob>
```

**MCP**: `aegisx_components_get "Knob"`

### Popup Edit (`ax-popup-edit`)

Inline editing with popup.

```html
<ax-popup-edit [(value)]="cellValue" type="text"> {{ cellValue }} </ax-popup-edit>
```

**MCP**: `aegisx_components_get "Popup Edit"`

### Scheduler (`ax-scheduler`)

Week/day scheduler.

```html
<ax-scheduler [events]="appointments" [view]="'week'" (eventClick)="onEventClick($event)"> </ax-scheduler>
```

**MCP**: `aegisx_components_get "Scheduler"`

### Time Slots (`ax-time-slots`)

Time slot picker.

```html
<ax-time-slots [slots]="availableSlots" [(selected)]="selectedSlot" [interval]="30"> </ax-time-slots>
```

**MCP**: `aegisx_components_get "Time Slots"`

---

## Feedback Components

### Alert (`ax-alert`)

Contextual feedback messages.

```html
<ax-alert type="success" [dismissible]="true"> Operation completed successfully! </ax-alert>

<ax-alert type="warning" icon="warning"> Please review before proceeding. </ax-alert>
```

**MCP**: `aegisx_components_get "Alert"`

### Loading Bar (`ax-loading-bar`)

Top loading bar for transitions.

```html
<ax-loading-bar [loading]="isLoading" color="primary"> </ax-loading-bar>
```

**MCP**: `aegisx_components_get "Loading Bar"`

### Inner Loading (`ax-inner-loading`)

Loading overlay for containers.

```html
<ax-inner-loading [loading]="isLoading" message="Loading data...">
  <div>Content to overlay</div>
</ax-inner-loading>
```

**MCP**: `aegisx_components_get "Inner Loading"`

### Splash Screen (`ax-splash-screen`)

Full page loading screen.

```html
<ax-splash-screen [show]="isInitializing" logo="/assets/logo.svg" message="Loading application..."> </ax-splash-screen>
```

**MCP**: `aegisx_components_get "Splash Screen"`

### Skeleton (`ax-skeleton`)

Placeholder loading animation.

```html
<ax-skeleton type="text" [lines]="3"></ax-skeleton>
<ax-skeleton type="avatar" size="lg"></ax-skeleton>
<ax-skeleton type="card"></ax-skeleton>
```

**MCP**: `aegisx_components_get "Skeleton"`

---

## Navigation Components

### Breadcrumb (`ax-breadcrumb`)

Navigation breadcrumbs.

```html
<ax-breadcrumb
  [items]="[
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Details' }
]"
></ax-breadcrumb>
```

**MCP**: `aegisx_components_get "Breadcrumb"`

### Command Palette (`ax-command-palette`)

Keyboard-driven command search (Cmd+K).

```html
<ax-command-palette [commands]="commands" [shortcut]="'cmd+k'" (select)="onCommandSelect($event)"> </ax-command-palette>
```

**MCP**: `aegisx_components_get "Command Palette"`

### Navbar (`ax-navbar`)

Top navigation bar.

```html
<ax-navbar [logo]="logoConfig" [items]="navItems" [user]="currentUser"> </ax-navbar>
```

**MCP**: `aegisx_components_get "Navbar"`

### Launcher (`ax-launcher`)

App launcher grid.

```html
<ax-launcher
  [apps]="[
  { name: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
  { name: 'Settings', icon: 'settings', link: '/settings' }
]"
></ax-launcher>
```

**MCP**: `aegisx_components_get "Launcher"`

---

## Layout Components

### Classic Layout (`ax-classic-layout`)

Traditional sidebar layout.

```html
<ax-classic-layout [navigation]="navItems" [user]="currentUser">
  <router-outlet></router-outlet>
</ax-classic-layout>
```

**MCP**: `aegisx_components_get "Classic Layout"`

### Compact Layout (`ax-compact-layout`)

Space-efficient icon-only sidebar.

```html
<ax-compact-layout [navigation]="navItems" [collapsible]="true">
  <router-outlet></router-outlet>
</ax-compact-layout>
```

**MCP**: `aegisx_components_get "Compact Layout"`

### Enterprise Layout (`ax-enterprise-layout`)

Full-featured enterprise layout.

```html
<ax-enterprise-layout [topNav]="topNavItems" [sideNav]="sideNavItems" [user]="currentUser" [notifications]="notifications">
  <router-outlet></router-outlet>
</ax-enterprise-layout>
```

**MCP**: `aegisx_components_get "Enterprise Layout"`

### Empty Layout (`ax-empty-layout`)

Minimal layout for auth pages.

```html
<ax-empty-layout [centered]="true">
  <ax-login-form></ax-login-form>
</ax-empty-layout>
```

**MCP**: `aegisx_components_get "Empty Layout"`

---

## Auth Components

### Login Form (`ax-login-form`)

Complete login form.

```html
<ax-login-form [logo]="'/assets/logo.svg'" [showSocial]="true" [showRemember]="true" (login)="onLogin($event)" (forgotPassword)="onForgotPassword()"> </ax-login-form>
```

**MCP**: `aegisx_components_get "Login Form"`

### Register Form (`ax-register-form`)

User registration form.

```html
<ax-register-form [fields]="['email', 'password', 'name']" [showTerms]="true" (register)="onRegister($event)"> </ax-register-form>
```

**MCP**: `aegisx_components_get "Register Form"`

### Reset Password Form (`ax-reset-password-form`)

Password reset request.

```html
<ax-reset-password-form (submit)="onResetPassword($event)" (backToLogin)="goToLogin()"> </ax-reset-password-form>
```

**MCP**: `aegisx_components_get "Reset Password Form"`

### Social Login (`ax-social-login`)

Social login buttons.

```html
<ax-social-login [providers]="['google', 'github', 'microsoft']" (login)="onSocialLogin($event)"> </ax-social-login>
```

**MCP**: `aegisx_components_get "Social Login"`

---

## Advanced Components

### Calendar (`ax-calendar`)

Full calendar with events.

```html
<ax-calendar [events]="calendarEvents" [view]="'month'" (eventClick)="onEventClick($event)" (dateClick)="onDateClick($event)"> </ax-calendar>
```

**MCP**: `aegisx_components_get "Calendar"`

### Gridster (`ax-gridster`)

Drag-and-drop dashboard grid.

```html
<ax-gridster [options]="gridsterOptions">
  <ax-gridster-item *ngFor="let item of widgets" [item]="item">
    <ng-container [ngSwitch]="item.type">
      <ax-kpi-card *ngSwitchCase="'kpi'" [config]="item.config"> </ax-kpi-card>
    </ng-container>
  </ax-gridster-item>
</ax-gridster>
```

**MCP**: `aegisx_components_get "Gridster"`

### File Upload (`ax-file-upload`)

File upload with drag-and-drop.

```html
<ax-file-upload [multiple]="true" [accept]="'image/*,.pdf'" [maxSize]="10485760" (filesSelected)="onFilesSelected($event)" (uploadComplete)="onUploadComplete($event)"> </ax-file-upload>
```

**MCP**: `aegisx_components_get "File Upload"`

### Theme Builder (`ax-theme-builder`)

Visual theme customization.

```html
<ax-theme-builder [theme]="currentTheme" (themeChange)="onThemeChange($event)" (export)="onExportTheme($event)"> </ax-theme-builder>
```

**MCP**: `aegisx_components_get "Theme Builder"`

### Theme Switcher (`ax-theme-switcher`)

Quick theme/dark mode toggle.

```html
<ax-theme-switcher [themes]="availableThemes" [(selected)]="currentTheme"> </ax-theme-switcher>
```

**MCP**: `aegisx_components_get "Theme Switcher"`

### Code Tabs (`ax-code-tabs`)

Tabbed code snippets.

```html
<ax-code-tabs
  [tabs]="[
  { label: 'HTML', language: 'html', code: htmlCode },
  { label: 'TypeScript', language: 'typescript', code: tsCode }
]"
></ax-code-tabs>
```

**MCP**: `aegisx_components_get "Code Tabs"`

---

## Overlay Components

### Drawer (`ax-drawer`)

Slide-out panel.

```html
<button (click)="drawerOpen = true">Open Drawer</button>

<ax-drawer [(opened)]="drawerOpen" position="right" width="500px" [hasBackdrop]="true">
  <h2>Drawer Title</h2>
  <p>Drawer content...</p>
  <button (click)="drawerOpen = false">Close</button>
</ax-drawer>
```

**Properties:**

| Property      | Type                                     | Default   | Description       |
| ------------- | ---------------------------------------- | --------- | ----------------- |
| `opened`      | `boolean`                                | `false`   | Drawer open state |
| `position`    | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Drawer position   |
| `mode`        | `'over' \| 'push'`                       | `'over'`  | Overlay mode      |
| `width`       | `string`                                 | `'400px'` | Drawer width      |
| `hasBackdrop` | `boolean`                                | `true`    | Show backdrop     |

**Events:**

| Event          | Type                    | Description        |
| -------------- | ----------------------- | ------------------ |
| `openedChange` | `EventEmitter<boolean>` | Open state changed |

**MCP**: `aegisx_components_get "Drawer"`

---

## Import Guide

### Import Individual Components

```typescript
import { AxBadgeComponent } from '@aegisx/ui/badge';
import { AxCardComponent } from '@aegisx/ui/card';
import { AxDrawerComponent } from '@aegisx/ui/drawer';

@Component({
  standalone: true,
  imports: [AxBadgeComponent, AxCardComponent, AxDrawerComponent],
  // ...
})
export class MyComponent {}
```

### Import All Components

```typescript
import { AegisxUiModule } from '@aegisx/ui';

@Component({
  standalone: true,
  imports: [AegisxUiModule],
  // ...
})
export class MyComponent {}
```
