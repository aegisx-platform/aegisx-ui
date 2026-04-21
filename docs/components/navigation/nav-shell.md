# Ax Nav Shell — Enterprise Navigation System

## Overview

`ax-nav-shell` is the top-level application chrome for AegisX apps — a
drop-in component that renders the sidebar / topbar / dock / rail plus the
command palette, notification panel, user menu, hospital switcher, and app
switcher. Behaviour is driven by a single singleton service, `AxNavService`,
backed by Angular signals.

The shell ships with **four layout modes** (rail, expanded, dock, topnav),
**eight accent presets**, and a three-level data model
(app group → module → child).

### Why `ax-nav-shell` vs `ax-navbar` / `ax-drawer`?

| Use case                                   | Reach for      |
| ------------------------------------------ | -------------- |
| Enterprise / multi-app shell, multi-tenant | `ax-nav-shell` |
| Simple top bar for a marketing site / SPA  | `ax-navbar`    |
| Simple left drawer with content slot       | `ax-drawer`    |

### Key Features

- **4 layout modes** — `rail` (icon sidebar), `expanded` (rail + panel),
  `dock` (floating sidebar with flush children panel), `topnav`
  (horizontal)
- **Mode persistence** — saved to `localStorage` under the `ax-nav-state:*`
  namespace
- **Accent presets** — 8 built-in color themes (slate, zinc, indigo, blue,
  emerald, rose, white, stone) + custom `NavAccent` objects
- **3-level navigation model** — `AppGroup → NavModule → NavChild`
- **Dock children panel** — `ax-nav-dock-panel` slides out flush with the
  sidebar when a module with `children[]` is clicked in dock mode. Closes on
  Escape, outside click, or selecting any non-expanding module.
- **Topbar dark theme** — `<ax-nav-topbar theme="dark">` for use inside
  `ax-dashboard-panel`
- **Notifications, command palette, app switcher, hospital switcher** all
  built-in
- **Signal-based state** throughout, **OnPush** change detection
- **Zero-dependency RxJS events** for module clicks / app switches / mode
  changes

## Installation

```ts
import { AxNavShellComponent, AxNavService, AppGroup, NavUser, Hospital } from '@aegisx/ui';
```

## Quick Start

```ts
// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { AxNavShellComponent, AxNavService } from '@aegisx/ui';

@Component({
  standalone: true,
  imports: [AxNavShellComponent],
  template: `
    <ax-nav-shell>
      <router-outlet />
    </ax-nav-shell>
  `,
})
export class AppComponent implements OnInit {
  private readonly nav = inject(AxNavService);

  ngOnInit() {
    this.nav.configure({
      defaultAppId: 'inventory',
      appGroups: [
        {
          id: 'inventory',
          label: 'Inventory',
          labelTh: 'คลังสินค้า',
          icon: 'inventory_2',
          color: '#3b82f6',
          route: 'inventory',
          permission: 'inventory:read',
          modules: [
            { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
            { id: 'stock', icon: 'inventory', label: 'Stock', route: 'stock', badge: 3 },
            {
              id: 'purchase',
              icon: 'shopping_cart',
              label: 'Purchase',
              route: 'purchase',
              children: [
                { id: 'pr', label: 'Requests', route: '/inventory/pr' },
                { id: 'po', label: 'Orders', route: '/inventory/po' },
              ],
            },
          ],
        },
      ],
      hospitals: [{ id: 'h1', label: 'Bangkok Hospital', code: 'BKK', shortName: 'BKK' }],
      user: {
        id: 'u1',
        name: 'Dr. Somchai',
        shortName: 'Somchai',
        initials: 'DS',
        role: 'Admin',
        online: true,
      },
    });
  }
}
```

## Data Model

```ts
interface AppGroup {
  id: string; // 'inventory'
  label: string; // 'Inventory'
  labelTh: string; // 'คลังสินค้า'
  icon: string; // Material icon or 'ax:drug'
  color: string; // Hex or HSL
  route: string; // Base route segment
  permission: string; // Gate key
  modules: NavModule[];
  iconStyle?: 'mono' | 'diamond';
}

interface NavModule {
  id: string;
  icon: string;
  label: string;
  labelEn?: string;
  route?: string;
  type?: 'route' | 'action' | 'external' | 'divider'; // default 'route'
  action?: string; // for type='action'
  externalUrl?: string; // for type='external'
  permission?: string;
  badge?: number; // small red pill
  children?: NavChild[]; // drives dock-panel expansion
  iconStyle?: 'mono' | 'diamond';
}

interface NavChild {
  id: string;
  label: string;
  route: string;
  icon?: string;
  badge?: number;
}
```

## Layout Modes

| Mode       | When to use                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `rail`     | Default — compact 80 px icon sidebar, modules labeled on hover                                                        |
| `expanded` | Rail + sliding panel showing sub-routes; auto-collapses on route change unless pinned                                 |
| `dock`     | Floating rounded sidebar with subtle shadow. Modules with `children[]` open a flush `ax-nav-dock-panel` to the right. |
| `topnav`   | Horizontal top bar — modules as tabs; no panel, no rail                                                               |

Switch mode imperatively:

```ts
const nav = inject(AxNavService);
nav.setMode('dock'); // persisted to localStorage
```

Or let users switch via the built-in config popover (gear icon).

## `AxNavService` API

### State (signals)

| Signal             | Type                            | Description                           |
| ------------------ | ------------------------------- | ------------------------------------- |
| `mode`             | `Signal<NavMode>`               | Current layout mode                   |
| `activeAppId`      | `Signal<string>`                | Currently selected app group          |
| `activeApp`        | `Signal<AppGroup \| undefined>` | Resolved active app                   |
| `activeModuleId`   | `Signal<string>`                | Currently selected module             |
| `visibleModules`   | `Signal<NavModule[]>`           | Modules in active app                 |
| `expandedModuleId` | `Signal<string \| null>`        | Module whose dock panel is open       |
| `expandedModule`   | `Signal<NavModule \| null>`     | Resolved expanded module              |
| `hospitalId`       | `Signal<string>`                | Currently selected hospital           |
| `activeHospital`   | `Signal<Hospital \| undefined>` | Resolved active hospital              |
| `visibleApps`      | `Signal<AppGroup[]>`            | All registered apps                   |
| `hospitals`        | `Signal<Hospital[]>`            | All registered hospitals              |
| `user`             | `Signal<NavUser \| null>`       | Current user                          |
| `notifications`    | `Signal<NavNotification[]>`     | Notification list                     |
| `unreadCount`      | `Signal<number>`                | Unread notification count             |
| `pinned`           | `Signal<boolean>`               | Whether expanded panel is pinned open |
| `accent`           | `Signal<NavAccent>`             | Currently active accent preset        |
| `accentId`         | `Signal<string>`                | Current accent id                     |
| `iconStyle`        | `Signal<'mono' \| 'diamond'>`   | Global icon style                     |

### Methods

```ts
configure(config: {
  appGroups: AppGroup[];
  hospitals?: Hospital[];
  defaultAppId?: string;
  user?: NavUser;
  iconStyle?: 'mono' | 'diamond';
}): void;

setMode(mode: NavMode): void;
setActiveApp(appId: string): void;
setActiveModule(moduleId: string): void;   // handles route/action/external + dock expansion
setActiveChild(child: NavChild): void;      // navigates, keeps parent active
toggleModuleExpand(moduleId: string): void;
collapseModule(): void;
setHospital(hospitalId: string): void;
togglePin(): void;                          // toggle expanded-panel pin
setUser(user: NavUser): void;
setAccent(accentId: string): void;
addNotification(n: NavNotification): void;
markAllNotificationsRead(): void;
```

### RxJS Events

The service also exposes imperative event streams for analytics / logging:

```ts
readonly moduleClick$:   Subject<NavModuleClickEvent>;
readonly actionClick$:   Subject<NavActionEvent>;
readonly appSwitch$:     Subject<NavAppSwitchEvent>;
readonly hospitalSwitch$: Subject<NavHospitalSwitchEvent>;
readonly modeChange$:    Subject<NavModeChangeEvent>;
```

## Dock Mode + Children Panel

When `mode === 'dock'` and a user clicks a module whose `children[]` is
non-empty, the shell keeps the parent marked as active, **does not
navigate**, and renders `ax-nav-dock-panel` flush to the right of the
sidebar.

- Click a child → navigate to `child.route`, parent stays active
- Click the parent again → panel closes
- Click **any other module** → panel closes (even if no expansion target)
- Press **Escape** → panel closes
- Click outside the sidebar or panel → panel closes

```ts
// Data with children — enables dock expansion
{
  id: 'purchase',
  icon: 'shopping_cart',
  label: 'Purchase',
  route: 'purchase',
  children: [
    { id: 'pr', label: 'Requests', route: '/inventory/pr' },
    { id: 'po', label: 'Orders',   route: '/inventory/po' },
  ],
}
```

## Accent Presets

Eight built-in accents are exported via `NAV_ACCENTS`:

```ts
'slate' | 'zinc' | 'indigo' | 'blue' | 'emerald' | 'rose' | 'white' | 'stone';
```

```ts
nav.setAccent('indigo');
```

Each preset maps to a `NavAccent` object (`bg`, `text`, `iconDefault`,
`iconHover`, `iconActive`, `btnHover`, `btnActive`, `divider`). Add your own
by pushing onto your consumer's accent list and calling `setAccent(id)` with
the matching id.

## Using `ax-nav-topbar` Standalone

The topbar also works outside the shell — for dashboard headers inside
[`ax-dashboard-panel`](../layout/dashboard-panel.md). The dark theme variant
matches the dark-gradient panel surface:

```html
<ax-dashboard-panel>
  <ax-nav-topbar axNav theme="dark" />
  <!-- … -->
</ax-dashboard-panel>
```

| Input   | Type                | Default   | Description                             |
| ------- | ------------------- | --------- | --------------------------------------- |
| `theme` | `'light' \| 'dark'` | `'light'` | Use `'dark'` on dark gradient surfaces. |

## Exports

All from `@aegisx/ui`:

```ts
// Shell
AxNavShellComponent;

// Layouts
AxNavRailComponent;
AxNavExpandedComponent;
AxNavTopbarComponent;

// Features (overlays)
AxAppSwitcherComponent;
AxNavContextSwitcherComponent;
AxNavUserMenuComponent;
AxNavConfigPopoverComponent;
AxNotificationPanelComponent;

// Shared
AxNavLogoComponent;
AxNavAvatarComponent;
AxNavBadgeComponent;
AxNavActiveBarComponent;
AxNavRailItemComponent; // renamed from internal AxNavItemComponent
AxNavExpandedPanelComponent;
AxNavDockPanelComponent; // new in 0.5.0

// Services
AxNavService;
AxNavShortcutsService;

// Types & events
(NavMode, NavModuleType, AppGroup, NavModule, NavChild, Hospital, NavNotification, NavUser, NavAccent, NavCommandItem, NavLayoutOption, NavAppSwitchEvent, NavHospitalSwitchEvent, NavModeChangeEvent, NavModuleClickEvent, NavActionEvent, NavNotificationClickEvent, NavCommandExecuteEvent, NavUserMenuEvent);

// Constants
NAV_ACCENTS;
NAV_LAYOUT_OPTIONS;
```

## Accessibility

- All modes render an ARIA-labeled `<nav>` / `<header>` / `<aside>`
- Active module uses `aria-current="page"`
- Dock panel has `role="navigation"` + descriptive `aria-label`
- Escape and outside-click handlers registered via
  `takeUntilDestroyed(DestroyRef)` — no manual subscription cleanup required
- User menu, hospital switcher, config popover, and app switcher all use
  `@angular/cdk/dialog` for focus trap + keyboard handling

## Related

- **[Navigation overview](./navigation.md)** — higher-level navigation
  primitives (`ax-breadcrumb`, `ax-navbar`, `ax-tab-pills`, `ax-command-palette`).
- **[`ax-dashboard-panel`](../layout/dashboard-panel.md)** — dark-gradient
  wrapper that often hosts `ax-nav-topbar theme="dark"`.
