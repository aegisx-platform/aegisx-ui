# AegisX CLI - Shell & Section Generation Guide

> Create complete Angular app shells and sections with a single command

---

## Overview

App shells provide the foundational layout structure for Angular applications. The `aegisx shell` command generates complete, ready-to-use shell modules with navigation, routing, and theming support.

Sections allow you to create sub-pages within a shell, each with its own `ax-launcher` for organizing CRUD modules.

---

## Quick Start

```bash
# Generate enterprise shell (most common)
aegisx shell reports --force

# Generate simple shell (for auth pages)
aegisx shell auth --type simple --force

# Generate multi-app shell (for complex modules)
aegisx shell inventory --type multi-app --force

# Create a section within a shell
aegisx section inventory master-data --force
```

---

## Shell Types

### Simple Shell

```bash
aegisx shell auth --type simple --force
```

**Uses:** `AxEmptyLayoutComponent`

**Features:**

- Minimal layout without navigation
- Clean, distraction-free design
- Centered content area

**Best for:**

- Login/Register pages
- Landing pages
- Error pages (404, 500)
- Single-page wizards

**Generated Structure:**

```
features/auth/
├── auth.component.ts        # Shell component
├── auth.config.ts           # Shell configuration
├── auth.routes.ts           # Lazy-loaded routes
└── index.ts                 # Public exports
```

---

### Enterprise Shell (Default)

```bash
aegisx shell system --force
# or
aegisx shell system --type enterprise --force
```

**Uses:** `AxEnterpriseLayoutComponent`

**Features:**

- Full navigation header with active route indicator
- Header with user actions and theme support
- Footer with version info
- **Portal link** (back to main `/` route)
- **ax-launcher main page** for card-based navigation
- **Dashboard page** for analytics and KPIs
- Auto-registration of CRUD modules
- Responsive design

**Best for:**

- Admin panels
- Management systems
- Dashboard applications
- Business applications

**Generated Structure:**

```
features/system/
├── system-shell.component.ts   # Shell component with MultiAppService
├── system.config.ts            # Navigation config with exactMatch
├── system.routes.ts            # Lazy-loaded routes with auto-gen markers
├── pages/
│   ├── main/                   # Main page (ax-launcher cards)
│   │   ├── main.page.ts
│   │   └── main.config.ts      # MODULE_ITEMS with auto-gen markers
│   └── dashboard/              # Dashboard page (analytics/KPIs)
│       └── dashboard.page.ts
├── modules/                    # CRUD modules auto-registered here
│   └── .gitkeep
└── index.ts
```

**Navigation Structure:**

```typescript
// 3-item navigation automatically generated:
const systemNavigation: AxNavigationItem[] = [
  { id: 'portal', title: 'Portal', icon: 'home', link: '/', exactMatch: true },
  { id: 'system', title: 'System', icon: 'apps', link: '/system', exactMatch: true },
  { id: 'dashboard', title: 'Dashboard', icon: 'dashboard', link: '/system/dashboard', exactMatch: true },
];
```

---

### Multi-App Shell

```bash
aegisx shell inventory --type multi-app --force
```

**Uses:** `AxEnterpriseLayoutComponent` with sub-app tabs

**Features:**

- All enterprise features, plus:
- Sub-application tabs in header
- Dynamic navigation per sub-app
- Shared services across sub-apps

**Best for:**

- Complex modules with multiple sections
- ERP-style applications
- Multi-function modules

**Example Use Cases:**

- Inventory: Warehouse, Receiving, Shipping
- HR: Employees, Payroll, Leave
- Finance: Accounting, Billing, Reports

**Generated Structure:**

```
features/inventory/
├── inventory.component.ts   # Shell with tabs
├── inventory.config.ts      # Sub-app configuration
├── inventory.routes.ts      # Sub-app routing
├── apps/
│   ├── warehouse/           # Sub-app 1
│   ├── receiving/           # Sub-app 2
│   └── shipping/            # Sub-app 3
└── index.ts
```

---

## Section Generation

Sections are sub-pages within a shell that have their own `ax-launcher` for organizing CRUD modules. They're perfect for categorizing modules (e.g., Master Data, Transactions, Reports).

### Create a Section

```bash
aegisx section <shell-name> <section-name> [options]
```

### Section Options

| Option          | Alias | Default | Description                          |
| --------------- | ----- | ------- | ------------------------------------ |
| `-a, --app`     | `-a`  | `web`   | Target app: `web`, `admin`           |
| `-n, --name`    | `-n`  | -       | Display name for the section         |
| `-f, --force`   | `-f`  | `false` | Overwrite existing files             |
| `-d, --dry-run` | `-d`  | `false` | Preview without creating             |
| `--no-format`   | -     | `false` | Skip auto-formatting generated files |

### Section Examples

```bash
# Create master-data section in inventory shell
aegisx section inventory master-data --force

# With custom display name
aegisx section inventory master-data --name "Master Data Management" --force

# For admin app
aegisx section system users --app admin --force

# Preview first
aegisx section inventory transactions --dry-run
```

### Section Generated Structure

```
features/<shell-name>/
├── <shell-name>.routes.ts            # Updated with section route + markers
└── pages/
    └── <section-name>/               # New section page
        ├── <section-name>.page.ts    # Page component with ax-launcher
        └── <section-name>.config.ts  # Section config with MODULE_ITEMS markers
```

### How Section Routes Work

The section generator adds a route with `children` array and markers:

```typescript
// In shell.routes.ts
{
  path: 'master-data',
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/master-data/master-data.page').then(m => m.MasterDataPage),
      data: { title: 'Master Data' },
    },
    // === MASTER-DATA ROUTES START ===
    // CRUD modules auto-registered here
    // === MASTER-DATA ROUTES END ===
  ],
},
```

### Section Config Structure

```typescript
// In pages/master-data/master-data.config.ts
export const MASTER_DATA_MODULE_ITEMS: AxLauncherItem[] = [
  // === MASTER-DATA MODULES START ===
  // CRUD module cards auto-registered here
  // === MASTER-DATA MODULES END ===
];
```

---

## Shell Command Options

```bash
aegisx shell <name> [options]
```

| Option                  | Default      | Description                                       |
| ----------------------- | ------------ | ------------------------------------------------- |
| `-t, --type <type>`     | `enterprise` | Shell type: `simple`, `enterprise`, `multi-app`   |
| `-a, --app <app>`       | `web`        | Target Angular app: `web`, `admin`                |
| `-n, --name <name>`     | -            | Display name (default: capitalized shell name)    |
| `--theme <theme>`       | `default`    | Theme preset: `default`, `indigo`, `teal`, `rose` |
| `--order <number>`      | `0`          | Order in app launcher                             |
| `--with-dashboard`      | `true`       | Include dashboard page                            |
| `--with-master-data`    | `true`       | Include Master Data page with ax-launcher         |
| `--with-settings`       | `false`      | Include settings page                             |
| `--with-auth`           | `true`       | Include AuthGuard protection                      |
| `--with-theme-switcher` | `false`      | Include theme switcher component                  |
| `-f, --force`           | `false`      | Overwrite existing files                          |
| `-d, --dry-run`         | `false`      | Preview without creating files                    |
| `--no-format`           | `false`      | Skip auto-formatting generated files              |

---

## Complete Workflow: Shell + Section + CRUD Module

This is the **recommended workflow** for creating full-stack features with organized structure:

### Step 1: Create Shell

```bash
aegisx shell inventory --app web --force
```

Creates:

- Shell component with enterprise layout
- Main page with ax-launcher
- Dashboard page
- Routes with auto-registration markers

### Step 2: Create Section

```bash
aegisx section inventory master-data --force
```

Creates:

- Master Data page with ax-launcher
- Section config with MODULE_ITEMS markers
- Route added to shell.routes.ts with children array

### Step 3: Generate Backend

```bash
aegisx generate drugs --domain inventory/master-data --schema inventory --force
```

Creates:

- Backend module at `modules/inventory/master-data/drugs/`
- API route: `/api/inventory/master-data/drugs`
- Auto-registered in domain aggregator

### Step 4: Generate Frontend into Section

```bash
aegisx generate drugs --target frontend --shell inventory --section master-data --force
```

Creates:

- Frontend module at `features/inventory/modules/drugs/`
- Route auto-registered in section markers
- Card auto-added to section's ax-launcher

### Result

```
Backend:
modules/inventory/master-data/drugs/
├── controllers/
├── repositories/
├── routes/
├── schemas/
├── services/
└── types/

Frontend:
features/inventory/
├── inventory-shell.component.ts
├── inventory.routes.ts
├── pages/
│   ├── main/
│   │   ├── main.page.ts
│   │   └── main.config.ts
│   ├── master-data/
│   │   ├── master-data.page.ts     # Has ax-launcher with drugs card
│   │   └── master-data.config.ts   # MODULE_ITEMS includes drugs
│   └── dashboard/
│       └── dashboard.page.ts
└── modules/
    └── drugs/
        ├── drugs-list.component.ts
        ├── drugs-form.component.ts
        ├── drugs-view.dialog.ts
        ├── drugs.routes.ts
        ├── drugs.service.ts
        └── types/

Routes:
/inventory                       → Main page (ax-launcher)
/inventory/master-data           → Master Data page (ax-launcher with drugs card)
/inventory/master-data/drugs     → Drugs list component
/inventory/dashboard             → Dashboard page

API:
/api/inventory/master-data/drugs → Drugs CRUD endpoints
```

---

## Auto-Registration (v3.1.0+)

The shell and section generators include **automatic CRUD module registration**:

### How It Works

1. **Routes auto-registration** in `shell.routes.ts`:

```typescript
// === AUTO-GENERATED ROUTES START ===
// CRUD modules will be auto-registered here by the generator
// === AUTO-GENERATED ROUTES END ===
```

2. **Navigation cards auto-registration** in `pages/main/main.config.ts`:

```typescript
export const MODULE_ITEMS: AxLauncherItem[] = [
  // === AUTO-GENERATED MODULES START ===
  // CRUD modules will be auto-added here
  // === AUTO-GENERATED MODULES END ===
];
```

3. **Section-specific registration** in `pages/<section>/<section>.config.ts`:

```typescript
export const SECTION_MODULE_ITEMS: AxLauncherItem[] = [
  // === SECTION-NAME MODULES START ===
  // CRUD modules for this section auto-added here
  // === SECTION-NAME MODULES END ===
];
```

### Using Auto-Registration with Sections

When you generate a frontend module with `--section`:

```bash
aegisx generate drugs --target frontend --shell inventory --section master-data --force
```

Result:

- Route added to section's `children` array (between section markers)
- Card added to section's `MODULE_ITEMS` config
- Module folder created in `modules/drugs/`

### Disabling Auto-Registration

If you want to manually control registration:

```bash
aegisx generate drugs --target frontend --no-register --force
```

---

## Examples

### Basic Enterprise Shell

```bash
aegisx shell reports --force
```

### Shell with Settings Page

```bash
aegisx shell admin --with-settings --force
```

### Shell with Theme Switcher

```bash
aegisx shell dashboard --with-theme-switcher --force
```

### Shell for Admin App

```bash
aegisx shell system --app admin --force
```

### Preview Before Creating

```bash
aegisx shell analytics --dry-run
```

### Custom Display Name

```bash
aegisx shell hr --name "Human Resources" --force
```

### Multiple Sections in One Shell

```bash
# Create shell
aegisx shell inventory --force

# Create multiple sections
aegisx section inventory master-data --name "Master Data" --force
aegisx section inventory transactions --name "Transactions" --force
aegisx section inventory reports --name "Reports" --force
```

---

## Next Steps After Generation

After running `aegisx shell`, you need to:

### 1. Register Shell Routes

Add to your `app.routes.ts`:

```typescript
{
  path: 'reports',
  loadChildren: () => import('./features/reports/reports.routes')
    .then(m => m.REPORTS_ROUTES),
},
```

### 2. Add to App Launcher (Optional)

Add to your navigation config:

```typescript
{
  id: 'reports',
  name: 'Reports',
  icon: 'analytics',
  route: '/reports',
},
```

### 3. Customize Navigation

Edit `features/reports/reports.config.ts` to add your navigation items.

---

## Theme Presets

| Theme     | Primary Color | Description              |
| --------- | ------------- | ------------------------ |
| `default` | Material Blue | Standard Material Design |
| `indigo`  | Indigo        | Professional, corporate  |
| `teal`    | Teal          | Fresh, modern            |
| `rose`    | Rose          | Warm, friendly           |

```bash
aegisx shell reports --theme indigo --force
```

---

## View Available Shell Types

```bash
aegisx shell-types
```

This displays detailed information about each shell type, including:

- Layout component used
- Features included
- Best use cases
- Example commands

---

## Troubleshooting

### "Shell already exists"

Use `--force` to overwrite:

```bash
aegisx shell reports --force
```

### "Invalid shell type"

Valid types are: `simple`, `enterprise`, `multi-app`

### Routes Not Working

1. Check that routes are registered in `app.routes.ts`
2. Verify lazy loading path is correct
3. Ensure AuthGuard is configured

### Section Not Creating Children Array

The section generator creates a `children` array structure. If the shell routes don't have the expected format, run:

```bash
aegisx shell <shell-name> --force
aegisx section <shell-name> <section-name> --force
```

### Frontend Module Not Registering in Section

Ensure you use both `--shell` and `--section` options:

```bash
# CORRECT
aegisx generate drugs --target frontend --shell inventory --section master-data --force

# WRONG - will register in main shell instead of section
aegisx generate drugs --target frontend --shell inventory --force
```

---

## See Also

- [CLI Reference](./CLI_REFERENCE.md) - Complete command documentation
- [Quick Reference](./QUICK_REFERENCE.md) - All commands at a glance
- [Domain Guide](./DOMAIN_GUIDE.md) - Backend domain organization
- [Events Guide](./EVENTS_GUIDE.md) - WebSocket integration
- [Import Guide](./IMPORT_GUIDE.md) - Bulk import feature

---

**Last Updated:** 2025-12-07

**Copyright (c) 2025 AegisX Team. All rights reserved.**
