# AegisX CLI - Complete Command Reference

> Comprehensive documentation for all CLI commands, options, and features

---

## Table of Contents

1. [generate](#generate-command)
2. [shell](#shell-command)
3. [section](#section-command)
4. [domain](#domain-command)
5. [domain:init](#domaininit-command)
6. [domain:list](#domainlist-command)
7. [route](#route-command)
8. [list-tables](#list-tables-command)
9. [validate](#validate-command)
10. [packages](#packages-command)
11. [templates](#templates-command)
12. [config](#config-command)
13. [License Commands](#license-commands)

---

## generate Command

Generate CRUD modules for backend or frontend.

### Syntax

```bash
aegisx generate [table-name] [options]
aegisx g [table-name] [options]
```

### Arguments

| Argument     | Required | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `table-name` | Optional | Database table name. Interactive mode if empty |

### Options

| Option                   | Alias | Default    | Description                                                                                              |
| ------------------------ | ----- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `--target <type>`        | `-t`  | `backend`  | Generation target: `backend`, `frontend`                                                                 |
| `--domain <path>`        | -     | -          | Domain path for backend (e.g., `inventory/master-data`)                                                  |
| `--shell <name>`         | -     | -          | Target shell for frontend (e.g., `inventory`). Output goes to `features/{shell}/modules/`                |
| `--section <name>`       | -     | -          | Target section within a shell (e.g., `master-data`). Module registered in section instead of main config |
| `--schema <schema>`      | `-s`  | `public`   | PostgreSQL schema to read table from                                                                     |
| `--app <app>`            | `-a`  | `api`      | Target app: `api`, `web`, `admin`                                                                        |
| `--output <dir>`         | `-o`  | -          | Custom output directory (overrides --app)                                                                |
| `--package <type>`       | -     | `standard` | Package: `standard`, `enterprise`, `full`                                                                |
| `--with-events`          | `-e`  | `false`    | Include WebSocket events                                                                                 |
| `--with-import`          | -     | `false`    | Include bulk import (Excel/CSV)                                                                          |
| `--force`                | `-f`  | `false`    | Force overwrite existing files                                                                           |
| `--dry-run`              | `-d`  | `false`    | Preview files without creating                                                                           |
| `--no-register`          | -     | `false`    | Skip auto-registration in plugin.loader.ts / routes                                                      |
| `--include-audit-fields` | -     | `false`    | Include audit fields (created_at, updated_at) in forms                                                   |
| `--direct-db`            | -     | `false`    | Write roles directly to database (dev only)                                                              |
| `--no-roles`             | -     | `false`    | Skip role generation entirely                                                                            |
| `--migration-only`       | -     | `false`    | Generate migration file only                                                                             |
| `--multiple-roles`       | -     | `false`    | Generate admin, editor, viewer roles                                                                     |
| `--smart-stats`          | -     | `false`    | Enable smart statistics detection                                                                        |
| `--no-format`            | -     | `false`    | Skip auto-formatting generated files                                                                     |
| `--config <file>`        | `-c`  | -          | Configuration file path                                                                                  |
| `--help`                 | `-h`  | -          | Display help                                                                                             |

### Backend Examples

```bash
# Basic backend CRUD
aegisx generate products --force

# With domain structure
aegisx generate drugs --domain inventory/master-data --force

# From specific PostgreSQL schema
aegisx generate drug_lots --schema inventory --force

# Full-featured backend (events + import)
aegisx generate orders --with-events --with-import --force

# Enterprise package with all features
aegisx generate invoices --package enterprise --with-events --force

# Migration file only (no CRUD)
aegisx generate users --migration-only --force

# Dry run to preview
aegisx generate users --dry-run

# Interactive mode
aegisx generate
```

### Frontend Examples

```bash
# Basic frontend component
aegisx generate products --target frontend --force

# Frontend into specific shell
aegisx generate drugs --target frontend --shell inventory --force

# Frontend into shell + section (recommended)
aegisx generate drugs --target frontend --shell inventory --section master-data --force

# Frontend with import dialog
aegisx generate products --target frontend --with-import --force

# Frontend with event handling
aegisx generate products --target frontend --with-events --force

# Target admin app instead of web
aegisx generate products --target frontend --app admin --force
```

### Complete Workflow Examples

```bash
# Full-stack with shell and section structure
# Step 1: Create shell (if not exists)
aegisx shell inventory --app web --force

# Step 2: Create section (if using sections)
aegisx section inventory master-data --app web --force

# Step 3: Generate backend
aegisx generate drugs --domain inventory/master-data --schema inventory --force

# Step 4: Generate frontend into shell + section
aegisx generate drugs --target frontend --shell inventory --section master-data --force
```

---

## shell Command

Generate Angular app shell (layout with navigation).

### Syntax

```bash
aegisx shell <shell-name> [options]
aegisx sh <shell-name> [options]
```

### Arguments

| Argument     | Required | Description            |
| ------------ | -------- | ---------------------- |
| `shell-name` | Yes      | Shell name to generate |

### Options

| Option                  | Alias | Default      | Description                                       |
| ----------------------- | ----- | ------------ | ------------------------------------------------- |
| `--type <type>`         | `-t`  | `enterprise` | Shell type: `simple`, `enterprise`, `multi-app`   |
| `--app <app>`           | `-a`  | `web`        | Target app: `web`, `admin`                        |
| `--name <name>`         | `-n`  | -            | Display name for the shell                        |
| `--theme <theme>`       | -     | `default`    | Theme preset: `default`, `indigo`, `teal`, `rose` |
| `--order <number>`      | -     | `0`          | App order in launcher                             |
| `--with-dashboard`      | -     | `true`       | Include dashboard page                            |
| `--with-master-data`    | -     | `true`       | Include Master Data page with ax-launcher         |
| `--with-settings`       | -     | `false`      | Include settings page                             |
| `--with-auth`           | -     | `true`       | Include AuthGuard and AuthService                 |
| `--with-theme-switcher` | -     | `false`      | Include theme switcher component                  |
| `--force`               | `-f`  | `false`      | Force overwrite                                   |
| `--dry-run`             | `-d`  | `false`      | Preview without creating                          |
| `--no-format`           | -     | `false`      | Skip auto-formatting                              |
| `--help`                | `-h`  | -            | Display help                                      |

### Shell Types

| Type         | Description                         | Layout Component              |
| ------------ | ----------------------------------- | ----------------------------- |
| `simple`     | Minimal layout without navigation   | `AxEmptyLayoutComponent`      |
| `enterprise` | Full sidebar + header (default)     | `AxEnterpriseLayoutComponent` |
| `multi-app`  | Enterprise + sub-app tabs in header | `AxEnterpriseLayoutComponent` |

### Examples

```bash
# Enterprise shell (default)
aegisx shell reports --force

# Simple shell for auth pages
aegisx shell auth --type simple --force

# Multi-app shell for complex modules
aegisx shell warehouse --type multi-app --force

# With additional features
aegisx shell admin --with-settings --with-theme-switcher --force

# For admin app
aegisx shell system --app admin --force

# With custom theme
aegisx shell inventory --theme indigo --force

# Custom display name
aegisx shell hr --name "Human Resources" --force

# Preview before creating
aegisx shell analytics --dry-run
```

### Generated Structure (Enterprise)

```
features/<shell-name>/
├── <shell-name>-shell.component.ts   # Shell component
├── <shell-name>.config.ts            # Navigation config
├── <shell-name>.routes.ts            # Lazy-loaded routes with markers
├── pages/
│   ├── main/                         # Main page (ax-launcher cards)
│   │   ├── main.page.ts
│   │   └── main.config.ts            # MODULE_ITEMS with markers
│   ├── master-data/                  # Master Data page (if enabled)
│   │   ├── master-data.page.ts
│   │   └── master-data.config.ts
│   └── dashboard/                    # Dashboard page
│       └── dashboard.page.ts
├── modules/                          # CRUD modules folder
│   └── .gitkeep
└── index.ts
```

---

## section Command

Generate a section within a shell (sub-page with ax-launcher for CRUD modules).

### Syntax

```bash
aegisx section <shell-name> <section-name> [options]
aegisx sec <shell-name> <section-name> [options]
```

### Arguments

| Argument       | Required | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `shell-name`   | Yes      | Parent shell name (e.g., `inventory`)        |
| `section-name` | Yes      | Section name to create (e.g., `master-data`) |

### Options

| Option          | Alias | Default | Description                          |
| --------------- | ----- | ------- | ------------------------------------ |
| `--app <app>`   | `-a`  | `web`   | Target app: `web`, `admin`           |
| `--name <name>` | `-n`  | -       | Display name for the section         |
| `--force`       | `-f`  | `false` | Force overwrite existing files       |
| `--dry-run`     | `-d`  | `false` | Preview files without creating       |
| `--no-format`   | -     | `false` | Skip auto-formatting generated files |
| `--help`        | `-h`  | -       | Display help                         |

### Examples

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

### Generated Structure

```
features/<shell-name>/
├── <shell-name>.routes.ts            # Updated with section route
└── pages/
    └── <section-name>/               # New section page
        ├── <section-name>.page.ts    # Page component with ax-launcher
        └── <section-name>.config.ts  # Section config with MODULE_ITEMS
```

### How Sections Work

1. **Section creates a sub-page** within the shell with its own `ax-launcher`
2. **Routes are registered** under the shell's children with markers:
   ```typescript
   // In shell.routes.ts
   {
     path: 'master-data',
     children: [
       {
         path: '',
         loadComponent: () => import('./pages/master-data/master-data.page').then(m => m.MasterDataPage),
       },
       // === MASTER-DATA ROUTES START ===
       // CRUD modules auto-registered here
       // === MASTER-DATA ROUTES END ===
     ],
   },
   ```
3. **Frontend generation with --section** registers modules to section markers instead of main config

### Complete Workflow

```bash
# Step 1: Create shell
aegisx shell inventory --app web --force

# Step 2: Create section within shell
aegisx section inventory master-data --force

# Step 3: Generate backend module
aegisx generate drugs --domain inventory/master-data --schema inventory --force

# Step 4: Generate frontend into section
aegisx generate drugs --target frontend --shell inventory --section master-data --force

# Result: Module appears in inventory/master-data/drugs route
# with card in master-data page's ax-launcher
```

---

## domain Command

Generate a domain module with organized structure.

### Syntax

```bash
aegisx domain <domain-name> [options]
aegisx d <domain-name> [options]
```

### Arguments

| Argument      | Required | Description             |
| ------------- | -------- | ----------------------- |
| `domain-name` | Yes      | Domain name to generate |

### Options

| Option              | Alias | Default   | Description                    |
| ------------------- | ----- | --------- | ------------------------------ |
| `--routes <routes>` | `-r`  | -         | Comma-separated list of routes |
| `--with-events`     | `-e`  | `false`   | Include real-time events       |
| `--target <type>`   | `-t`  | `backend` | Generation target              |
| `--app <app>`       | `-a`  | `api`     | Target app                     |
| `--output <dir>`    | `-o`  | -         | Custom output directory        |
| `--force`           | `-f`  | `false`   | Force overwrite                |
| `--dry-run`         | `-d`  | `false`   | Preview without creating       |
| `--config <file>`   | `-c`  | -         | Configuration file path        |
| `--help`            | `-h`  | -         | Display help                   |

### Examples

```bash
# Basic domain with routes
aegisx domain users --routes core,profiles,preferences --force

# Domain with events
aegisx domain notifications --routes alerts,inbox --with-events --force

# Preview domain structure
aegisx domain inventory --routes master-data,transactions --dry-run
```

---

## domain:init Command

Initialize a new domain with knexfile, migrations, and modules folder.

### Syntax

```bash
aegisx domain:init <domain-name> [options]
aegisx di <domain-name> [options]
```

### Arguments

| Argument      | Required | Description               |
| ------------- | -------- | ------------------------- |
| `domain-name` | Yes      | Domain name to initialize |

### Options

| Option      | Alias | Default | Description                          |
| ----------- | ----- | ------- | ------------------------------------ |
| `--dry-run` | `-d`  | `false` | Preview files without creating       |
| `--force`   | `-f`  | `false` | Force reinitialize if already exists |
| `--help`    | `-h`  | -       | Display help                         |

### Examples

```bash
# Initialize inventory domain
aegisx domain:init inventory --force

# Preview first
aegisx domain:init queue --dry-run
```

### Generated Structure

```
apps/api/src/
├── database/
│   ├── domains/
│   │   └── inventory/
│   │       ├── knexfile.ts           # Domain-specific knex config
│   │       ├── migrations/           # Domain migrations folder
│   │       └── seeds/                # Domain seeds folder
└── modules/
    └── inventory/
        └── index.ts                  # Domain plugin aggregator
```

---

## domain:list Command

List all initialized domains.

### Syntax

```bash
aegisx domain:list
aegisx dl
```

### Example Output

```
📂 Initialized Domains:

┌──────────┬────────────────────────────────────────────┬──────────┐
│ Domain   │ Path                                       │ Modules  │
├──────────┼────────────────────────────────────────────┼──────────┤
│ inventory│ apps/api/src/modules/inventory             │ 5        │
│ queue    │ apps/api/src/modules/queue                 │ 2        │
└──────────┴────────────────────────────────────────────┴──────────┘
```

---

## route Command

Add route to existing domain module.

### Syntax

```bash
aegisx route <route-path> [options]
aegisx r <route-path> [options]
```

### Arguments

| Argument     | Required | Description                                                  |
| ------------ | -------- | ------------------------------------------------------------ |
| `route-path` | Yes      | Route path in format `domain/route` (e.g., `users/sessions`) |

### Options

| Option            | Alias | Default   | Description              |
| ----------------- | ----- | --------- | ------------------------ |
| `--with-events`   | `-e`  | `false`   | Include real-time events |
| `--target <type>` | `-t`  | `backend` | Generation target        |
| `--app <app>`     | `-a`  | `api`     | Target app               |
| `--output <dir>`  | `-o`  | -         | Custom output directory  |
| `--force`         | `-f`  | `false`   | Force overwrite          |
| `--dry-run`       | `-d`  | `false`   | Preview without creating |
| `--help`          | `-h`  | -         | Display help             |

### Examples

```bash
# Add route to existing domain
aegisx route users/sessions --force

# With WebSocket events
aegisx route notifications/alerts --with-events --force
```

---

## list-tables Command

List available database tables.

### Syntax

```bash
aegisx list-tables [options]
aegisx ls [options]
```

### Options

| Option            | Alias | Default  | Description               |
| ----------------- | ----- | -------- | ------------------------- |
| `--schema <name>` | `-s`  | `public` | PostgreSQL schema to list |
| `--help`          | `-h`  | -        | Display help              |

### Examples

```bash
# List tables in public schema
aegisx list-tables

# List tables in specific schema
aegisx list-tables --schema inventory
```

### Example Output

```
📊 Tables in 'inventory' schema:

┌────┬─────────────────────┬─────────┬─────────────────────────────────────────────┐
│ #  │ Table Name          │ Columns │ Description                                 │
├────┼─────────────────────┼─────────┼─────────────────────────────────────────────┤
│ 1  │ drugs               │ 15      │ Drug inventory items                        │
│ 2  │ drug_generics       │ 8       │ Generic drug information                    │
│ 3  │ drug_lots           │ 12      │ Drug lot tracking                           │
│ 4  │ suppliers           │ 10      │ Supplier information                        │
└────┴─────────────────────┴─────────┴─────────────────────────────────────────────┘

Total: 4 tables
```

---

## validate Command

Validate generated module structure.

### Syntax

```bash
aegisx validate <module-name>
```

### Arguments

| Argument      | Required | Description             |
| ------------- | -------- | ----------------------- |
| `module-name` | Yes      | Module name to validate |

### Examples

```bash
# Validate module
aegisx validate products

# Validate domain module
aegisx validate inventory/master-data/drugs
```

### What It Validates

- ✅ Required files exist (controller, service, repository, routes, schemas, types)
- ✅ TypeBox schemas are valid
- ✅ Export structure is correct
- ✅ Import paths are valid
- ✅ Route registration is complete

---

## packages Command

Show available feature packages.

### Syntax

```bash
aegisx packages
aegisx pkg
```

### Output

```
📦 Available Feature Packages:

🟢 STANDARD (default)
   • Basic CRUD operations (Create, Read, Update, Delete)
   • Standard REST API endpoints
   • Role-based access control
   • TypeBox schema validation
   • Pagination and filtering

🟡 ENTERPRISE
   • Everything in Standard, plus:
   • Dropdown/Options API for UI components
   • Bulk operations (create, update, delete)
   • Status management (activate, deactivate, toggle)
   • Statistics and analytics endpoints
   • Enhanced error handling

🔴 FULL
   • Everything in Enterprise, plus:
   • Data validation before save
   • Field uniqueness checking
   • Advanced search and filtering
   • Export capabilities
   • Business rule validation
```

---

## templates Command

Manage CRUD generator templates.

### Syntax

```bash
aegisx templates <subcommand>
aegisx t <subcommand>
```

### Subcommands

| Subcommand    | Alias     | Description              |
| ------------- | --------- | ------------------------ |
| `list`        | `ls`      | List available templates |
| `set-default` | `default` | Set default template     |
| `add`         | -         | Add custom template      |
| `remove`      | `rm`      | Remove custom template   |

### Examples

```bash
# List all templates
aegisx templates list

# List backend templates only
aegisx templates list backend

# List frontend templates only
aegisx templates list frontend

# Set default template (interactive)
aegisx templates set-default

# Add custom template (interactive)
aegisx templates add

# Remove custom template (interactive)
aegisx templates remove
```

---

## config Command

Manage CRUD generator configuration.

### Syntax

```bash
aegisx config <subcommand>
aegisx cfg <subcommand>
```

### Subcommands

| Subcommand | Description                            |
| ---------- | -------------------------------------- |
| `init`     | Initialize .crudgen.json configuration |
| `show`     | Show current configuration             |

### Examples

```bash
# Initialize config file
aegisx config init

# Show current configuration
aegisx config show
```

### Configuration File (.crudgen.json)

```json
{
  "defaultPackage": "standard",
  "defaultTarget": "backend",
  "defaultApp": "api",
  "autoFormat": true,
  "autoRegister": true,
  "templates": {
    "backend": "default",
    "frontend": "default"
  },
  "database": {
    "schema": "public"
  }
}
```

---

## License Commands

### Start Trial

```bash
aegisx trial
```

Starts a 14-day free trial with full features.

### Activate License

```bash
aegisx activate <license-key>
```

### Check License Status

```bash
aegisx license
aegisx status
```

### Deactivate License

```bash
aegisx deactivate
```

### License Key Format

```
AEGISX-[TIER]-[SERIAL]-[CHECKSUM]
```

| Tier         | Example                   |
| ------------ | ------------------------- |
| Professional | `AEGISX-PRO-A7X9K2M4-5C`  |
| Team         | `AEGISX-TEAM-B8Y0L3N5-9D` |
| Enterprise   | `AEGISX-ENT-C9Z1M4P6-3E`  |

---

## Global Options

These options work with most commands:

| Option      | Alias | Description         |
| ----------- | ----- | ------------------- |
| `--version` | `-V`  | Show version number |
| `--help`    | `-h`  | Display help        |

---

## Exit Codes

| Code | Description               |
| ---- | ------------------------- |
| 0    | Success                   |
| 1    | General error             |
| 2    | Invalid arguments         |
| 3    | License error             |
| 4    | Database connection error |
| 5    | File system error         |

---

## Environment Variables

| Variable          | Description                       |
| ----------------- | --------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string      |
| `AEGISX_LICENSE`  | License key (alternative to file) |
| `AEGISX_NO_COLOR` | Disable colored output            |
| `AEGISX_DEBUG`    | Enable debug logging              |

---

## Common Workflows

### 1. Backend + Frontend in Shell with Section

```bash
# Step 1: Create shell
aegisx shell inventory --app web --force

# Step 2: Create section
aegisx section inventory master-data --force

# Step 3: Generate backend with domain
aegisx generate drugs --domain inventory/master-data --schema inventory --force

# Step 4: Generate frontend into shell + section
aegisx generate drugs --target frontend --shell inventory --section master-data --force
```

### 2. Simple Backend + Frontend

```bash
# Backend
aegisx generate products --force

# Frontend
aegisx generate products --target frontend --force
```

### 3. Full-Featured Module

```bash
# Backend with all features
aegisx generate orders --package full --with-events --with-import --force

# Frontend with all features
aegisx generate orders --target frontend --with-events --with-import --force
```

---

## See Also

- [Quick Reference](./QUICK_REFERENCE.md) - Commands at a glance
- [Domain Guide](./DOMAIN_GUIDE.md) - Domain-based organization
- [Shell Guide](./SHELL_GUIDE.md) - Angular shell generation
- [Section Guide](#section-command) - Section generation within shells
- [Events Guide](./EVENTS_GUIDE.md) - WebSocket integration
- [Import Guide](./IMPORT_GUIDE.md) - Bulk import feature
- [Installation](./INSTALLATION.md) - Setup guide

---

**Last Updated:** 2025-12-07

**Copyright (c) 2025 AegisX Team. All rights reserved.**
