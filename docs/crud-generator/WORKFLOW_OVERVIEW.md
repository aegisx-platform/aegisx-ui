# AegisX CLI - Workflow Overview

> **Complete guide to CLI architecture, workflows, and generated files**

**Version**: 2.3.0 | **Last Updated**: December 7, 2025

---

## Table of Contents

1. [CLI Architecture Overview](#cli-architecture-overview)
2. [Feature Categories](#feature-categories)
3. [Backend Generation](#backend-generation)
4. [Frontend Generation](#frontend-generation)
5. [Shell & Section System](#shell--section-system)
6. [Domain Management](#domain-management)
7. [Complete Workflows](#complete-workflows)

---

## CLI Architecture Overview

### System Diagram

```
                                    AegisX CLI (aegisx-cli)
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            │                               │                               │
    ┌───────▼───────┐              ┌────────▼────────┐             ┌────────▼────────┐
    │   Database    │              │    Backend      │             │    Frontend     │
    │   Commands    │              │    Generator    │             │    Generator    │
    └───────┬───────┘              └────────┬────────┘             └────────┬────────┘
            │                               │                               │
    ┌───────▼───────┐              ┌────────▼────────┐             ┌────────▼────────┐
    │ • list-tables │              │ • generate      │             │ • generate      │
    │ • domain:init │              │ • domain        │             │   --target      │
    │ • domain:list │              │ • route         │             │   frontend      │
    └───────────────┘              └────────┬────────┘             │ • shell         │
                                            │                       │ • section       │
                                            ▼                       └────────┬────────┘
                                   ┌─────────────────┐                       │
                                   │   PostgreSQL    │                       ▼
                                   │   Database      │              ┌─────────────────┐
                                   │  (Schema Read)  │              │  Angular Apps   │
                                   └─────────────────┘              │  (web, admin)   │
                                                                    └─────────────────┘
```

### CLI Entry Point

```
libs/aegisx-cli/bin/cli.js
        │
        ├── generate [table]        → Backend/Frontend CRUD
        ├── domain <name>           → Domain module (multi-route)
        ├── domain:init <name>      → Domain infrastructure
        ├── domain:list             → List domains
        ├── route <domain/route>    → Add route to domain
        ├── shell <name>            → App Shell (Angular)
        ├── section <shell> <name>  → Section in shell
        ├── list-tables             → List DB tables
        ├── shell-types             → Show shell types
        ├── packages                → Show packages info
        ├── validate <module>       → Validate module
        ├── templates               → Manage templates
        └── config                  → Configuration
```

---

## Feature Categories

### 1. Database Commands

| Command       | Description                              | Use Case                               |
| ------------- | ---------------------------------------- | -------------------------------------- |
| `list-tables` | List tables from schema                  | See available tables before generating |
| `domain:init` | Initialize domain (knexfile, migrations) | Multi-schema enterprise setup          |
| `domain:list` | List initialized domains                 | Check existing domains                 |

### 2. Backend Generation Commands

| Command         | Description                  | Use Case                               |
| --------------- | ---------------------------- | -------------------------------------- |
| `generate`      | Generate CRUD module         | Create API endpoints for a table       |
| `domain <name>` | Generate domain module       | Multi-route domain (auth, users, etc.) |
| `route`         | Add route to existing domain | Extend domain with new route           |

### 3. Frontend Generation Commands

| Command                      | Description               | Use Case                       |
| ---------------------------- | ------------------------- | ------------------------------ |
| `generate --target frontend` | Generate CRUD frontend    | Angular module with components |
| `shell <name>`               | Generate App Shell        | Layout, navigation, routes     |
| `section <shell> <section>`  | Generate section in shell | Sub-page with ax-launcher      |

---

## Backend Generation

### What Gets Generated

When you run `./bin/cli.js generate TABLE_NAME --force`, the CLI:

1. **Reads database schema** from PostgreSQL
2. **Analyzes constraints** (unique, foreign keys, not null)
3. **Detects business rules** (email, date, price fields)
4. **Generates complete module** with all layers

### Generated File Structure

```
apps/api/src/modules/{table-name}/
├── index.ts                    # Route registration (Fastify plugin)
├── {table-name}.controller.ts  # Request handlers
├── {table-name}.service.ts     # Business logic + validation
├── {table-name}.repository.ts  # Database operations (Knex)
├── {table-name}.schemas.ts     # TypeBox schemas (request/response)
├── {table-name}.types.ts       # TypeScript types + error codes
└── {table-name}.routes.ts      # Route definitions

# With --with-import flag:
├── {table-name}-import.service.ts  # Bulk import service

# With --with-events flag:
└── (EventService integration in controller)
```

### Generated API Endpoints

| Method | Endpoint                    | Description          | Package      |
| ------ | --------------------------- | -------------------- | ------------ |
| GET    | `/api/{table}`              | List with pagination | Standard     |
| GET    | `/api/{table}/:id`          | Get by ID            | Standard     |
| POST   | `/api/{table}`              | Create               | Standard     |
| PUT    | `/api/{table}/:id`          | Update               | Standard     |
| DELETE | `/api/{table}/:id`          | Delete               | Standard     |
| GET    | `/api/{table}/dropdown`     | For select/dropdown  | Enterprise   |
| POST   | `/api/{table}/bulk`         | Bulk create          | Enterprise   |
| PUT    | `/api/{table}/bulk`         | Bulk update          | Enterprise   |
| DELETE | `/api/{table}/bulk`         | Bulk delete          | Enterprise   |
| GET    | `/api/{table}/export`       | Export CSV/Excel     | Enterprise   |
| GET    | `/api/{table}/stats`        | Statistics           | Enterprise   |
| POST   | `/api/{table}/validate`     | Pre-save validation  | Full         |
| GET    | `/api/{table}/check/:field` | Uniqueness check     | Full         |
| POST   | `/api/{table}/import`       | Bulk import          | +with-import |

### Auto-Detection Features

The generator automatically detects from database schema:

| Detection              | Result                       | Status Code |
| ---------------------- | ---------------------------- | ----------- |
| UNIQUE constraint      | Duplicate check + error code | 409         |
| Foreign Key references | Cannot delete check          | 422         |
| `*email*` field        | Email format validation      | 422         |
| `*birth*`, `*dob*`     | Date not future validation   | 422         |
| `*price*`, `*cost*`    | Positive number validation   | 422         |
| `*url*`, `*website*`   | URL format validation        | 422         |
| `*phone*`, `*tel*`     | Phone format validation      | 422         |
| NOT NULL constraint    | Required field validation    | 400         |

### Backend Generation Options

```bash
# Basic CRUD
./bin/cli.js generate products --force

# With schema (non-public)
./bin/cli.js generate drugs --schema inventory --force

# With domain path
./bin/cli.js generate drugs --domain inventory/master-data --force

# With import service
./bin/cli.js generate drugs --with-import --force

# With event emission
./bin/cli.js generate drugs --with-events --force

# Full package with all features
./bin/cli.js generate drugs --package full --with-import --with-events --force
```

### Auto-Registration

Generated modules are automatically registered:

1. **Plugin Loader** (`apps/api/src/core/plugin.loader.ts`)
2. **Permission Migration** (creates `{table}.read`, `{table}.write`, etc.)

---

## Frontend Generation

### What Gets Generated

When you run `./bin/cli.js generate TABLE_NAME --target frontend --force`:

1. **Reads backend types** (syncs with backend module)
2. **Generates Angular module** with all components
3. **Creates reactive state** using Angular Signals
4. **Registers routes** in appropriate shell/app routes

### Generated File Structure

```
apps/{app}/src/app/features/{table-name}/
├── index.ts                           # Module exports
├── {table-name}.routes.ts             # Angular routes
├── components/
│   ├── {table-name}-list/
│   │   ├── {table-name}-list.component.ts
│   │   ├── {table-name}-list.component.html
│   │   └── {table-name}-list.component.scss
│   ├── {table-name}-create-dialog/
│   │   ├── {table-name}-create-dialog.component.ts
│   │   ├── {table-name}-create-dialog.component.html
│   │   └── {table-name}-create-dialog.component.scss
│   ├── {table-name}-edit-dialog/
│   │   ├── {table-name}-edit-dialog.component.ts
│   │   ├── {table-name}-edit-dialog.component.html
│   │   └── {table-name}-edit-dialog.component.scss
│   └── {table-name}-view-dialog/
│       ├── {table-name}-view-dialog.component.ts
│       ├── {table-name}-view-dialog.component.html
│       └── {table-name}-view-dialog.component.scss
├── services/
│   └── {table-name}.service.ts        # API service with signals
├── types/
│   └── {table-name}.types.ts          # TypeScript interfaces
└── store/
    └── {table-name}.store.ts          # Signal-based state (optional)

# With --with-import flag:
├── components/
│   └── {table-name}-import-dialog/
│       ├── {table-name}-import-dialog.component.ts
│       ├── {table-name}-import-dialog.component.html
│       └── {table-name}-import-dialog.component.scss
```

### Generated Angular Components

| Component      | Description                             | Features                      |
| -------------- | --------------------------------------- | ----------------------------- |
| List Component | Data table with pagination              | Search, sort, filter, actions |
| Create Dialog  | Form for creating new record            | Validation, submit handling   |
| Edit Dialog    | Form for editing existing record        | Pre-populated, validation     |
| View Dialog    | Read-only detail view                   | All fields display            |
| Import Dialog  | Bulk import wizard (with --with-import) | Excel/CSV upload, preview     |

### Frontend Generation Options

```bash
# Basic frontend (default app: web)
./bin/cli.js generate products --target frontend --force

# Specify app
./bin/cli.js generate products --target frontend --app admin --force

# With shell (route registration)
./bin/cli.js generate products --target frontend --shell system --force

# With section (nested in shell)
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force

# With import dialog
./bin/cli.js generate products --target frontend --with-import --force

# Include audit fields in forms (admin use)
./bin/cli.js generate products --target frontend --include-audit-fields --force
```

### Route Registration Modes

| Mode        | Where Routes Go                      | Use Case                    |
| ----------- | ------------------------------------ | --------------------------- |
| Default     | `apps/{app}/src/app/app.routes.ts`   | Standalone module           |
| `--shell`   | `features/{shell}/{shell}.routes.ts` | Inside shell's children     |
| `--section` | Section routes + section config      | Grouped in section launcher |

---

## Shell & Section System

### Hierarchy

```
App Shell (inventory)
├── Main Page (ax-launcher showing all modules)
├── Dashboard Page
└── Sections
    ├── master-data (ax-launcher showing drugs, budgets, etc.)
    │   ├── drugs (CRUD module)
    │   ├── budgets (CRUD module)
    │   └── ...
    └── transactions
        ├── drug-returns (CRUD module)
        └── ...
```

### Shell Types

| Type         | Layout                        | Features                      |
| ------------ | ----------------------------- | ----------------------------- |
| `simple`     | `AxEmptyLayoutComponent`      | No navigation (auth, landing) |
| `enterprise` | `AxEnterpriseLayoutComponent` | Full sidebar, header, footer  |
| `multi-app`  | Enterprise + sub-app tabs     | For complex multi-domain apps |

### Shell Generation

```bash
# Create enterprise shell (default)
./bin/cli.js shell inventory --app web --force

# Create simple shell
./bin/cli.js shell auth --type simple --force

# Create with settings page
./bin/cli.js shell reports --with-settings --force
```

**Generated Structure:**

```
apps/web/src/app/features/inventory/
├── inventory-shell.component.ts      # Shell layout
├── inventory.routes.ts               # Shell routes
├── config/
│   ├── navigation.config.ts          # Sidebar navigation
│   └── main.config.ts                # Main launcher items
├── pages/
│   ├── main/main.page.ts             # Main page (ax-launcher)
│   ├── dashboard/dashboard.page.ts   # Dashboard
│   └── master-data/
│       ├── master-data.page.ts       # Section page
│       └── master-data.config.ts     # Section launcher items
└── modules/                          # CRUD modules go here
    └── drugs/
```

### Section Generation

```bash
# Create section in shell
./bin/cli.js section inventory master-data --force

# Create with custom name
./bin/cli.js section inventory reports --name "Reports & Analytics" --force
```

**Generated Files:**

- `pages/{section}/{section}.page.ts` - Section component with ax-launcher
- `pages/{section}/{section}.config.ts` - Launcher items configuration
- Updates `{shell}.routes.ts` - Adds section route

### Adding CRUD to Section

```bash
# Backend (with domain path matching frontend structure)
./bin/cli.js generate drugs --schema inventory --domain inventory/master-data --force

# Frontend (with shell and section)
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force
```

**What Happens:**

1. Frontend module goes to `features/inventory/modules/drugs/`
2. Route registered in `inventory.routes.ts` under `master-data` path
3. Launcher item added to `master-data.config.ts`

---

## Domain Management

### Multi-Schema Architecture

```
PostgreSQL Database
├── public (schema)           # System tables (users, roles, permissions)
│   ├── users
│   ├── roles
│   └── permissions
├── inventory (schema)        # Inventory domain tables
│   ├── drugs
│   ├── budgets
│   └── drug_returns
└── hr (schema)               # HR domain tables
    ├── employees
    └── departments
```

### Initialize Domain

```bash
./bin/cli.js domain:init inventory

# Creates:
# - knexfile-inventory.ts
# - apps/api/src/database/migrations-inventory/
# - apps/api/src/database/seeds-inventory/
# - apps/api/src/modules/inventory/index.ts
```

### Run Domain Migration

```bash
# Create schema
npx knex migrate:latest --knexfile knexfile-inventory.ts
```

### Generate for Domain

```bash
# Backend: read from inventory schema, place in inventory/master-data
./bin/cli.js generate drugs --schema inventory --domain inventory/master-data --force

# Frontend: place in inventory shell, master-data section
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force
```

---

## Complete Workflows

### Workflow 1: Basic CRUD (Simple)

**Scenario**: Add products table to existing app

```bash
# Step 1: List available tables
./bin/cli.js list-tables

# Step 2: Generate backend
pnpm run crud -- products --force

# Step 3: Generate frontend
./bin/cli.js generate products --target frontend --force

# Step 4: Verify
pnpm run build
```

**Result:**

- API: `/api/products` (CRUD endpoints)
- Frontend: `/products` route with list, create, edit, view

---

### Workflow 2: Enterprise Domain Setup

**Scenario**: Create inventory management system with separate schema

```bash
# Step 1: Initialize domain
./bin/cli.js domain:init inventory

# Step 2: Run schema migration
npx knex migrate:latest --knexfile knexfile-inventory.ts

# Step 3: Create your table migration in migrations-inventory/
# (create drugs table, budgets table, etc.)

# Step 4: Run table migrations
npx knex migrate:latest --knexfile knexfile-inventory.ts

# Step 5: Create App Shell
./bin/cli.js shell inventory --app web --force

# Step 6: Create Section
./bin/cli.js section inventory master-data --force

# Step 7: Generate CRUD modules
./bin/cli.js generate drugs --schema inventory --domain inventory/master-data --force
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force

./bin/cli.js generate budgets --schema inventory --domain inventory/master-data --force
./bin/cli.js generate budgets --target frontend --shell inventory --section master-data --force

# Step 8: Build and verify
pnpm run build
```

**Result:**

```
Frontend:
  /inventory                    → Main page (ax-launcher)
  /inventory/dashboard          → Dashboard
  /inventory/master-data        → Master data section (ax-launcher)
  /inventory/master-data/drugs  → Drugs CRUD
  /inventory/master-data/budgets → Budgets CRUD

Backend:
  /api/inventory/master-data/drugs    → Drugs API
  /api/inventory/master-data/budgets  → Budgets API
```

---

### Workflow 3: Full-Featured Module with Import & Events

**Scenario**: Products with bulk import and real-time updates

```bash
# Backend with all features
./bin/cli.js generate products --package full --with-import --with-events --force

# Frontend with import dialog
./bin/cli.js generate products --target frontend --with-import --with-events --force
```

**Result:**

- Import dialog for Excel/CSV upload
- Real-time event emission on CRUD operations
- All full-package features (validation, uniqueness check, bulk ops)

---

### Workflow 4: Admin Panel Feature

**Scenario**: Add user management to admin app (different from web app)

```bash
# Backend (same for all apps)
pnpm run crud -- users --force

# Frontend for admin app specifically
./bin/cli.js generate users --target frontend --app admin --shell system --force
```

**Result:**

- Backend: `/api/users`
- Admin Frontend: `apps/admin/src/app/features/system/modules/users/`
- Admin Route: `/system/users`

---

## Quick Reference

### Package Comparison

| Feature                          | Standard | Enterprise | Full     |
| -------------------------------- | -------- | ---------- | -------- |
| CRUD (Create/Read/Update/Delete) | ✅       | ✅         | ✅       |
| Pagination & Search              | ✅       | ✅         | ✅       |
| Error Handling                   | ✅       | ✅         | ✅       |
| Dropdown API                     | ❌       | ✅         | ✅       |
| Bulk Operations                  | ❌       | ✅         | ✅       |
| Export (CSV/Excel)               | ❌       | ✅         | ✅       |
| Statistics                       | ❌       | ✅         | ✅       |
| Pre-save Validation              | ❌       | ❌         | ✅       |
| Uniqueness Check                 | ❌       | ❌         | ✅       |
| Import (Excel/CSV)               | Optional | Optional   | Optional |
| Events (WebSocket)               | Optional | Optional   | Optional |

### Key Flags Summary

| Flag            | Target   | Description                            |
| --------------- | -------- | -------------------------------------- |
| `--schema`      | Backend  | PostgreSQL schema to read table from   |
| `--domain`      | Backend  | Domain path for module organization    |
| `--shell`       | Frontend | Target shell for route registration    |
| `--section`     | Frontend | Section within shell for nested routes |
| `--app`         | Frontend | Target Angular app (web, admin)        |
| `--with-import` | Both     | Include import functionality           |
| `--with-events` | Both     | Include WebSocket event integration    |
| `--package`     | Both     | Feature package level                  |
| `--force`       | Both     | Overwrite existing files               |
| `--dry-run`     | Both     | Preview without generating             |

---

## Related Documentation

- [COMMAND_REFERENCE.md](./COMMAND_REFERENCE.md) - Complete command reference
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick command lookup
- [EVENTS_GUIDE.md](./EVENTS_GUIDE.md) - WebSocket events integration
- [IMPORT_GUIDE.md](./IMPORT_GUIDE.md) - Bulk import functionality
- [ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md) - Error codes and handling

---

**Generator Version**: 2.3.0
**Last Updated**: December 7, 2025
**Status**: Production Ready
