# CRUD Generator - Command Reference

Detailed reference for all CRUD Generator commands and options (v2.3.0)

---

## Table of Contents

1. [Package Scripts](#package-scripts)
2. [CLI Commands](#cli-commands)
   - [generate](#command-generate) - Generate CRUD module
   - [domain](#command-domain) - Generate domain module
   - [domain:init](#command-domaininit) - Initialize domain infrastructure
   - [domain:list](#command-domainlist) - List initialized domains
   - [route](#command-route) - Add route to existing domain
   - [shell](#command-shell) - Generate App Shell for Angular
   - [shell-types](#command-shell-types) - Show available shell types
   - [section](#command-section) - Generate section within shell
   - [list-tables](#command-list-tables) - List available tables
   - [validate](#command-validate) - Validate module structure
   - [packages](#command-packages) - Display feature packages
   - [templates](#command-templates) - Manage templates
   - [config](#command-config) - Manage configuration
3. [Flags Reference](#flags-reference)
   - [Target Selection Flags](#target-selection-flags)
   - [Schema and Domain Flags (Backend)](#schema-and-domain-flags-backend)
   - [Shell and Section Flags (Frontend)](#shell-and-section-flags-frontend)
   - [Layer Classification Logic](#layer-classification-logic)
   - [Feature Package Flags](#feature-package-flags)
   - [Feature Flags](#feature-flags)
   - [Generation Control Flags](#generation-control-flags)
4. [Examples](#examples)
   - [Example 6: Core Layer](#example-6-core-layer-infrastructure-services)
   - [Example 7: Platform Layer](#example-7-platform-layer-shared-services)
   - [Example 8: Domains Layer](#example-8-domains-layer-business-logic)
   - [Example 9: Layer Migration](#example-9-layer-migration)
   - [Example 10: Complete Multi-Domain Application](#example-10-complete-multi-domain-application)
5. [Table Name Conventions](#table-name-conventions)

---

## Package Scripts

All scripts defined in `package.json`:

### 1. `pnpm run crud -- TABLE [OPTIONS]`

**Full Command**: `./bin/cli.js generate TABLE [OPTIONS]`

**Description**: Generate basic CRUD module (standard package)

**Examples**:

```bash
# Interactive if no table
pnpm run crud

# With table name
pnpm run crud -- products --force

# With custom package
pnpm run crud -- products --package enterprise --force

# With import
pnpm run crud -- products --with-import --force

# Dry run
pnpm run crud -- products --dry-run
```

### 2. `pnpm run crud:import -- TABLE [OPTIONS]`

**Full Command**: `./bin/cli.js generate TABLE --with-import [OPTIONS]`

**Description**: Generate CRUD with import functionality (Excel/CSV)

**Examples**:

```bash
# Basic import
pnpm run crud:import -- budgets --force

# With events
pnpm run crud:import -- products --with-events --force

# Full package with import
pnpm run crud:import -- orders --package full --force
```

**Includes**:

- Backend import service
- Frontend import dialog
- Validation and error handling
- Progress tracking

### 3. `pnpm run crud:events -- TABLE [OPTIONS]`

**Full Command**: `./bin/cli.js generate TABLE --with-events [OPTIONS]`

**Description**: Generate CRUD with WebSocket events

**Examples**:

```bash
# Basic events
pnpm run crud:events -- notifications --force

# With import
pnpm run crud:events -- products --with-import --force

# Full package with events
pnpm run crud:events -- orders --package full --force
```

**Includes**:

- EventService integration
- Event emission on CRUD operations
- Bulk operation events
- Real-time updates

### 4. `pnpm run crud:full -- TABLE [OPTIONS]`

**Full Command**: `./bin/cli.js generate TABLE --package full [OPTIONS]`

**Description**: Generate with full feature package

**Examples**:

```bash
# Full package
pnpm run crud:full -- products --force

# Full + import + events
./bin/cli.js generate products --package full --with-import --with-events --force
```

**Includes**:

- All standard features
- Bulk operations
- Advanced validation
- Field uniqueness checking
- Export capabilities
- Advanced search/filter
- Statistics endpoints

### 5. `pnpm run crud:list`

**Full Command**: `./bin/cli.js list-tables`

**Description**: List available database tables

**Examples**:

```bash
# List tables
pnpm run crud:list

# Output example:
# Available database tables:
#   • test_products (18 columns)
#   • test_categories (15 columns)
#   • users (12 columns)
```

### 6. `pnpm run crud:validate -- MODULE`

**Full Command**: `./bin/cli.js validate MODULE`

**Description**: Validate generated module structure

**Examples**:

```bash
# Validate module
pnpm run crud:validate -- products

# Output example:
# ✅ Module 'products' is valid
# OR
# ❌ Module 'products' has issues:
#   • Missing controller.ts
#   • Missing service.ts
```

---

## CLI Commands

Direct CLI commands for advanced usage:

### Command: `generate`

**Syntax**:

```bash
./bin/cli.js generate [TABLE_NAME] [OPTIONS]
./libs/aegisx-cli/bin/cli.js generate [TABLE_NAME] [OPTIONS]
```

**Aliases**: `g`

**Description**: Generate CRUD module (core command)

**Arguments**:

- `[TABLE_NAME]` - Optional. Database table name in snake_case (e.g., `test_products`)
  - If not provided, enters interactive mode

**Key Options**:

- `-t, --target <type>` - Generation target: `backend` (default) or `frontend`
- `--package <type>` - Feature package: `standard` (default), `enterprise`, `full`
- `-f, --force` - Overwrite existing files without prompt
- `-d, --dry-run` - Preview files without creating
- `--with-import` - Include import functionality
- `-e, --with-events` - Include WebSocket events
- `-a, --app <app>` - Target app: `api` (default), `web`, `admin`
- `--no-roles` - Skip role generation
- `--flat` - Use flat structure instead of domain

**Examples**:

```bash
# Basic backend
./bin/cli.js generate products --force

# Frontend only
./bin/cli.js generate products --target frontend --force

# With all options
./bin/cli.js generate products --package full --with-import --with-events --force

# Dry run
./bin/cli.js generate products --dry-run

# For specific app
./bin/cli.js generate settings --app admin --force
```

---

### Command: `domain`

**Syntax**:

```bash
./bin/cli.js domain <DOMAIN_NAME> [OPTIONS]
```

**Aliases**: `d`

**Description**: Generate organized domain module with multiple routes

**Arguments**:

- `<DOMAIN_NAME>` - Required. Domain name (e.g., `auth`, `users`)

**Key Options**:

- `-r, --routes <routes>` - Comma-separated routes (e.g., `core,sessions,profiles`)
- `-t, --target <type>` - Generation target: `backend` (default) or `frontend`
- `-s, --schema <schema>` - PostgreSQL schema (default: `public`)
- `-e, --with-events` - Include WebSocket events
- `-f, --force` - Overwrite existing files

**Examples**:

```bash
# Domain with routes
./bin/cli.js domain users --routes core,sessions,profiles --force

# Domain with events
./bin/cli.js domain orders --routes core,tracking,returns --with-events --force

# Domain with custom schema
./bin/cli.js domain drugs --schema inventory --routes core,list --force
```

---

### Command: `domain:init`

**Syntax**:

```bash
./bin/cli.js domain:init <DOMAIN_NAME> [OPTIONS]
```

**Aliases**: `di`

**Description**: Initialize domain infrastructure (knexfile, migrations folder, modules folder)

**Arguments**:

- `<DOMAIN_NAME>` - Required. Domain name (e.g., `inventory`, `hr`)

**Key Options**:

- `-d, --dry-run` - Preview files without creating
- `-f, --force` - Force reinitialize if exists

**Creates**:

- `knexfile-{domain}.ts` - Knex configuration for domain
- `apps/api/src/database/migrations-{domain}/` - Migrations folder
- `apps/api/src/database/seeds-{domain}/` - Seeds folder
- `apps/api/src/modules/{domain}/index.ts` - Domain plugin

**Examples**:

```bash
# Initialize inventory domain
./bin/cli.js domain:init inventory

# Dry run
./bin/cli.js domain:init hr --dry-run

# Force reinitialize
./bin/cli.js domain:init inventory --force
```

---

### Command: `domain:list`

**Syntax**:

```bash
./bin/cli.js domain:list
```

**Aliases**: `dl`

**Description**: List all initialized domains

**Examples**:

```bash
./bin/cli.js domain:list

# Output:
# 📦 Initialized Domains:
#
#   Inventory
#     Schema: inventory
#     Knexfile: ✓ knexfile-inventory.ts
#     Modules: ✓ modules/inventory/
```

---

### Command: `route`

**Syntax**:

```bash
./bin/cli.js route <DOMAIN/ROUTE> [OPTIONS]
```

**Aliases**: `r`

**Description**: Add new route to existing domain

**Arguments**:

- `<DOMAIN/ROUTE>` - Required. Route path in format "domain/route" (e.g., `users/sessions`)

**Key Options**:

- `-t, --target <type>` - Generation target: `backend` (default) or `frontend`
- `-e, --with-events` - Include WebSocket events
- `-f, --force` - Overwrite existing files

**Examples**:

```bash
# Add route to domain
./bin/cli.js route users/notifications --force

# Route with events
./bin/cli.js route orders/refunds --with-events --force
```

---

### Command: `shell`

**Syntax**:

```bash
./bin/cli.js shell <SHELL_NAME> [OPTIONS]
```

**Aliases**: `sh`

**Description**: Generate App Shell (simple, enterprise, or multi-app) for Angular frontend

**Arguments**:

- `<SHELL_NAME>` - Required. Shell name in kebab-case (e.g., `inventory`, `system`)

**Key Options**:

- `-t, --type <type>` - Shell type: `simple`, `enterprise` (default), `multi-app`
- `-a, --app <app>` - Target app: `web` (default), `admin`
- `-n, --name <name>` - Display name for the shell
- `--theme <theme>` - Theme preset: `default`, `indigo`, `teal`, `rose`
- `--order <number>` - App order in launcher (default: 0)
- `--with-dashboard` - Include dashboard page (default: true)
- `--with-master-data` - Include Master Data page with ax-launcher (default: true)
- `--with-settings` - Include settings page
- `--with-auth` - Include AuthGuard and AuthService (default: true)
- `--with-theme-switcher` - Include theme switcher component
- `-f, --force` - Force overwrite existing files

**Creates**:

- `features/{shell}/` - Shell feature folder
- `features/{shell}/{shell}-shell.component.ts` - Shell component
- `features/{shell}/{shell}.routes.ts` - Shell routes
- `features/{shell}/pages/main/main.page.ts` - Main page with ax-launcher
- `features/{shell}/pages/dashboard/dashboard.page.ts` - Dashboard page (if enabled)
- `features/{shell}/pages/master-data/master-data.page.ts` - Master data page (if enabled)
- `features/{shell}/config/navigation.config.ts` - Navigation config
- `features/{shell}/config/main.config.ts` - Main launcher config

**Examples**:

```bash
# Create inventory shell
./bin/cli.js shell inventory --force

# Create system shell for admin app
./bin/cli.js shell system --app admin --force

# Create simple shell (no navigation)
./bin/cli.js shell auth --type simple --force

# Create multi-app shell with theme
./bin/cli.js shell erp --type multi-app --theme indigo --force

# Custom display name
./bin/cli.js shell inventory --name "Inventory Management" --force
```

---

### Command: `shell-types`

**Syntax**:

```bash
./bin/cli.js shell-types
```

**Description**: Show available shell types and their features

**Output**:

```
🐚 Available Shell Types

SIMPLE
   Uses AxEmptyLayoutComponent
   • Minimal layout without navigation
   • Suitable for: Auth pages, landing pages, error pages
   • Example: Login shell, 404 shell

ENTERPRISE (default)
   Uses AxEnterpriseLayoutComponent
   • Full navigation sidebar
   • Header with actions
   • Footer with version
   • Single sub-app navigation
   • Suitable for: Admin panels, management systems
   • Example: System shell, Reports shell

MULTI-APP
   Uses AxEnterpriseLayoutComponent with sub-app tabs
   • All enterprise features, plus:
   • Sub-app tabs in header
   • Suitable for: Large enterprise applications
   • Example: ERP shell with multiple sub-apps
```

---

### Command: `section`

**Syntax**:

```bash
./bin/cli.js section <SHELL_NAME> <SECTION_NAME> [OPTIONS]
```

**Aliases**: `sec`

**Description**: Generate a section within a shell (sub-page with ax-launcher for grouping CRUD modules)

**Arguments**:

- `<SHELL_NAME>` - Required. Parent shell name (e.g., `inventory`)
- `<SECTION_NAME>` - Required. Section name (e.g., `master-data`, `reports`)

**Key Options**:

- `-a, --app <app>` - Target app: `web` (default), `admin`
- `-n, --name <name>` - Display name for the section
- `-f, --force` - Force overwrite existing files
- `-d, --dry-run` - Preview files without creating

**Creates**:

- `features/{shell}/pages/{section}/{section}.page.ts` - Section page component
- `features/{shell}/pages/{section}/{section}.config.ts` - Section launcher config
- Updates `{shell}.routes.ts` - Adds section route

**Examples**:

```bash
# Create master-data section in inventory shell
./bin/cli.js section inventory master-data --force

# Create reports section
./bin/cli.js section inventory reports --force

# Custom display name
./bin/cli.js section inventory master-data --name "Master Data Management" --force

# Preview without creating
./bin/cli.js section inventory settings --dry-run
```

---

### Command: `list-tables`

**Syntax**:

```bash
./bin/cli.js list-tables [OPTIONS]
```

**Aliases**: `ls`

**Description**: List available database tables

**Key Options**:

- `-s, --schema <schema>` - PostgreSQL schema (default: `public`)

**Examples**:

```bash
# List tables from public schema
./bin/cli.js list-tables

# List tables from inventory schema
./bin/cli.js list-tables --schema inventory

# Output:
# 📊 Available database tables in schema "inventory":
#   • drugs (16 columns)
#   • budgets (7 columns)
#   Total: 58 tables
```

---

### Command: `validate`

**Syntax**:

```bash
./bin/cli.js validate <MODULE_NAME>
```

**Description**: Validate module structure

**Arguments**:

- `<MODULE_NAME>` - Module name to validate

**Examples**:

```bash
./bin/cli.js validate products
```

---

### Command: `packages`

**Syntax**:

```bash
./bin/cli.js packages
```

**Aliases**: `pkg`

**Description**: Display feature package information

**Examples**:

```bash
./bin/cli.js packages
```

**Output**:

```
📦 Available Feature Packages:

🟢 STANDARD (default)
   • Basic CRUD operations
   • Standard REST API endpoints
   • Role-based access control
   • TypeBox schema validation
   • Pagination and filtering

🟡 ENTERPRISE
   • Everything in Standard, plus:
   • Dropdown/Options API
   • Bulk operations
   • Status management
   • Statistics endpoints
   • Enhanced error handling

🔴 FULL
   • Everything in Enterprise, plus:
   • Data validation
   • Field uniqueness checking
   • Advanced search/filter
   • Export capabilities
   • Business rule validation
```

---

### Command: `templates`

**Syntax**:

```bash
./bin/cli.js templates <SUBCOMMAND>
```

**Aliases**: `t`

**Description**: Manage CRUD generator templates

**Subcommands**:

#### `templates list [TYPE]`

- **Aliases**: `ls`
- **Arguments**: `[TYPE]` - Optional: `backend`, `frontend`, or `all`
- **Description**: List available templates

#### `templates set-default`

- **Aliases**: `default`
- **Description**: Set default template (interactive)

#### `templates add`

- **Description**: Add custom template (interactive)

#### `templates remove`

- **Aliases**: `rm`
- **Description**: Remove custom template (interactive)

---

### Command: `config`

**Syntax**:

```bash
./bin/cli.js config <SUBCOMMAND>
```

**Aliases**: `cfg`

**Description**: Manage CRUD generator configuration

**Subcommands**:

#### `config init`

- **Options**: `-f, --force` - Overwrite existing config
- **Description**: Initialize `.crudgen.json` configuration file

#### `config show`

- **Description**: Display current configuration

---

## Flags Reference

### Target Selection Flags

#### `-t, --target <type>`

- **Options**: `backend`, `frontend`
- **Default**: `backend`
- **Description**: Specify what to generate
- **Important**: Generate backend FIRST, then frontend

#### `-a, --app <app>`

- **Options**: `api`, `web`, `admin`
- **Default**: `api`
- **Description**: Target application directory

#### `-o, --output <dir>`

- **Default**: Auto-determined based on app and target
- **Description**: Custom output directory

---

### Schema and Domain Flags (Backend)

#### `-s, --schema <schema>`

- **Default**: `public`
- **Description**: PostgreSQL schema to read table metadata from
- **Use Case**: Multi-schema database architecture (e.g., `inventory`, `hr`)
- **Impact**: Reads table columns from specified schema

**Example**:

```bash
# Generate from inventory schema
./bin/cli.js generate drugs --schema inventory --force

# List tables from specific schema
./bin/cli.js list-tables --schema inventory
```

#### `--domain <path>`

- **Default**: None (uses flat structure)
- **Description**: Domain path for module organization in backend
- **Use Case**: Organize modules into logical domains (e.g., `inventory/master-data`)
- **Impact**: Changes output path and API route prefix

**Example**:

```bash
# Generate in domain path
./bin/cli.js generate drugs --domain inventory/master-data --force

# Output: apps/api/src/modules/inventory/master-data/drugs/
# API: /api/inventory/master-data/drugs
```

#### `--layer <layer>`

- **Options**: `core`, `platform`, `domains`
- **Default**: Auto-determined based on module characteristics
- **Description**: Specify architectural layer for module generation
- **Use Case**: Override automatic layer classification for precise control
- **Impact**: Changes output path, URL prefix, and plugin wrapper pattern

**Layer Architecture**:

| Layer    | Purpose                        | Example Modules              | Output Path                               | URL Pattern                         |
| -------- | ------------------------------ | ---------------------------- | ----------------------------------------- | ----------------------------------- |
| Core     | Infrastructure services        | auth, monitoring, audit      | `layers/core/{module}`                    | `/api/v1/core/{module}`             |
| Platform | Shared multi-domain services   | users, departments, files    | `layers/platform/{module}`                | `/api/v1/platform/{module}`         |
| Domains  | Domain-specific business logic | drugs, requisitions, budgets | `layers/domains/{domain}/{type}/{module}` | `/api/v1/domains/{domain}/{module}` |

**Automatic Classification**:

The generator automatically determines the layer based on:

1. **Infrastructure modules** → Core layer
   - Matches: `auth`, `authentication`, `security`, `monitoring`, `logging`, `audit`, `health-check`
   - Characteristics: System-wide infrastructure services

2. **Platform modules** → Platform layer
   - Matches: `users`, `roles`, `permissions`, `departments`, `files`, `settings`
   - Characteristics: Shared services used by multiple domains
   - Special rule: Lookup tables (ending with `-types`, `-categories`, `-statuses`) → Platform

3. **Domain modules** → Domains layer
   - Matches: Business domain keywords (`inventory`, `hr`, `finance`, etc.)
   - Characteristics: Domain-specific business logic and transactional data
   - Requires: `--domain` option for proper path generation

**Manual Override Examples**:

```bash
# Override auto-classification to Core layer
./bin/cli.js generate system-config --layer core --force

# Override auto-classification to Platform layer
./bin/cli.js generate users --layer platform --force

# Override auto-classification to Domains layer
./bin/cli.js generate drugs --layer domains --domain inventory/master-data --force
```

**Combined with Domain**:

```bash
# Domains layer with domain path (recommended)
./bin/cli.js generate drugs --layer domains --domain inventory/master-data --schema inventory --force

# Output: layers/domains/inventory/master-data/drugs/
# API: /api/v1/domains/inventory/drugs
```

**When to use --layer**:

- ✅ When auto-classification doesn't match your architecture
- ✅ When migrating modules between layers
- ✅ When creating new module types not covered by auto-classification
- ❌ Don't use if auto-classification is correct (let the generator decide)

---

### Shell and Section Flags (Frontend)

#### `--shell <shell>`

- **Default**: None
- **Description**: Target shell for frontend generation
- **Use Case**: Generate CRUD module inside an existing shell
- **Impact**:
  - Output to `features/{shell}/modules/`
  - Routes registered in shell's routes file
  - Module registered in shell's config

**Example**:

```bash
# Generate frontend in inventory shell
./bin/cli.js generate drugs --target frontend --shell inventory --force

# Output: apps/web/src/app/features/inventory/modules/drugs/
# Route: /inventory/drugs
```

#### `--section <section>`

- **Default**: None
- **Description**: Target section within a shell
- **Use Case**: Group CRUD modules under a section (e.g., master-data)
- **Requires**: `--shell` must also be specified
- **Impact**:
  - Route registered under section path
  - Module registered in section's config instead of main config

**Example**:

```bash
# Generate in master-data section of inventory shell
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force

# Output: apps/web/src/app/features/inventory/modules/drugs/
# Route: /inventory/master-data/drugs
# Config: features/inventory/pages/master-data/master-data.config.ts
```

---

### Combined Backend + Frontend Workflow

**For multi-schema, domain-based architecture:**

```bash
# Step 1: Backend (with schema and domain)
./bin/cli.js generate drugs --schema inventory --domain inventory/master-data --force

# Step 2: Frontend (with shell and section)
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force
```

**Result:**

- Backend: `apps/api/src/modules/inventory/master-data/drugs/`
- Frontend: `apps/web/src/app/features/inventory/modules/drugs/`
- API Route: `/api/inventory/master-data/drugs`
- Frontend Route: `/inventory/master-data/drugs`

---

## Layer Classification Logic

### Overview

The CRUD Generator uses an intelligent classification system to automatically determine which architectural layer a module belongs to. This ensures consistent organization and prevents modules from being placed in incorrect layers.

### Classification Decision Tree

The generator follows this 5-step decision process:

```
1. Is it an Infrastructure module?
   └─ YES → Core layer (auth, monitoring, audit, etc.)
   └─ NO → Continue to step 2

2. Is it a Platform module?
   └─ YES → Platform layer (users, departments, files, etc.)
   └─ NO → Continue to step 3

3. Is it a Domain-specific module?
   └─ YES → Domains layer (drugs, requisitions, budgets, etc.)
   └─ NO → Continue to step 4

4. No domain specified?
   └─ YES → Platform layer (default for shared services)
   └─ NO → Continue to step 5

5. Has domain but no match?
   └─ YES → Domains layer (explicit domain classification)
```

### Step 1: Infrastructure Module Detection (Core Layer)

**Matches when**:

- Module name matches infrastructure keywords
- Domain is `core`, `infrastructure`, or `system`

**Infrastructure Keywords**:

```
auth, authentication, security, api-keys, rate-limiting,
monitoring, logging, metrics, health-check, audit,
audit-trail, compliance
```

**Examples**:

```bash
./bin/cli.js generate auth --force
# → Core layer: layers/core/auth
# → URL: /api/v1/core/auth
# → Uses fp() wrapper

./bin/cli.js generate monitoring --force
# → Core layer: layers/core/monitoring
# → URL: /api/v1/core/monitoring
# → Uses fp() wrapper
```

**Characteristics**:

- System-wide infrastructure services
- Decorate Fastify instance or provide cross-cutting concerns
- Always use `fp()` wrapper pattern

---

### Step 2: Platform Module Detection (Platform Layer)

**Matches when**:

- Module name matches platform keywords
- Domain is `platform`, `shared`, or `common`
- Module name ends with lookup indicators (types, categories, statuses)

**Platform Keywords**:

```
users, user, rbac, roles, permissions, departments, department,
files, file-upload, file-download, attachments, attachment,
pdf, pdf-export, pdf-templates, settings, setting,
configuration, config, navigation, menu, import, export,
import-export
```

**Lookup Table Indicators**:

```
Modules ending with: -types, -categories, -statuses, -codes,
-classifications, -options, -configs, -templates
```

**Examples**:

```bash
./bin/cli.js generate users --force
# → Platform layer: layers/platform/users
# → URL: /api/v1/platform/users
# → Plain async function (no fp wrapper)

./bin/cli.js generate departments --force
# → Platform layer: layers/platform/departments
# → URL: /api/v1/platform/departments
# → Plain async function

./bin/cli.js generate budget-types --domain inventory/master-data --schema inventory --force
# → Platform layer: layers/platform/budget-types
# → URL: /api/v1/platform/budget-types
# → Classified as Platform despite domain association (lookup table rule)
```

**Characteristics**:

- Shared services used by multiple domains
- Horizontal functionality across application
- Lookup/reference data (even if domain-specific)
- Leaf modules use plain async functions

---

### Step 3: Domain Module Detection (Domains Layer)

**Matches when**:

- Module name contains business domain keywords
- Domain parameter matches business domains
- Module type is `operations` or `transactions`
- NOT a lookup table

**Business Domain Keywords**:

```
inventory, hr, human-resources, finance, accounting,
procurement, sales, marketing, admin, administration,
budget, budgeting
```

**Operational Type Indicators**:

```
operations, transactions, operational, transactional
```

**Examples**:

```bash
./bin/cli.js generate drugs --domain inventory/master-data --schema inventory --force
# → Domains layer: layers/domains/inventory/master-data/drugs
# → URL: /api/v1/domains/inventory/drugs
# → Plain async function

./bin/cli.js generate requisitions --domain inventory/operations --schema inventory --force
# → Domains layer: layers/domains/inventory/operations/requisitions
# → URL: /api/v1/domains/inventory/requisitions
# → Plain async function (transactional data)

./bin/cli.js generate employees --domain hr/master-data --schema hr --force
# → Domains layer: layers/domains/hr/master-data/employees
# → URL: /api/v1/domains/hr/employees
```

**Characteristics**:

- Domain-specific business logic
- Transactional/operational data
- Requires `--domain` option for proper path
- Leaf modules use plain async functions

---

### Step 4 & 5: Default Handling

**Step 4 - No Domain Specified**:

```bash
./bin/cli.js generate custom-module --force
# → Platform layer (default for shared services)
```

**Step 5 - Has Domain but No Match**:

```bash
./bin/cli.js generate special-data --domain custom-domain --force
# → Domains layer (explicit domain classification)
```

---

### Special Classification Rules

#### Rule 1: Lookup Tables → Always Platform

Lookup tables (master data ending with types/categories/etc.) are ALWAYS classified as Platform, even if they belong to a specific domain.

**Why?** Lookup tables are configuration/reference data used across domains, not transactional business logic.

```bash
# These go to Platform layer despite domain association
./bin/cli.js generate budget-types --domain inventory/master-data --force
./bin/cli.js generate drug-categories --domain inventory/master-data --force
./bin/cli.js generate department-types --domain hr/master-data --force

# All output to: layers/platform/{module-name}
# All use URL: /api/v1/platform/{module-name}
```

#### Rule 2: Aggregator Plugins → Always use fp()

Modules that register child plugins (aggregators) always use `fp()` wrapper, regardless of layer.

```bash
./bin/cli.js generate inventory --type aggregator --force
# → Uses fp() wrapper even in Domains layer
```

#### Rule 3: Core Layer → Always fp()

All Core layer modules use `fp()` wrapper because they provide infrastructure services.

---

### Plugin Wrapper Rules

| Layer    | Module Type | Wrapper Pattern      | Reason                  |
| -------- | ----------- | -------------------- | ----------------------- |
| Core     | Any         | `fp()` wrapper       | Infrastructure services |
| Platform | Aggregator  | `fp()` wrapper       | Registers child plugins |
| Platform | Leaf        | Plain async function | Standard route module   |
| Domains  | Aggregator  | `fp()` wrapper       | Registers child plugins |
| Domains  | Leaf        | Plain async function | Standard route module   |

**Example - Core layer**:

```typescript
// layers/core/auth/index.ts
import fp from 'fastify-plugin';

export default fp(async function authPlugin(fastify, opts) {
  // Infrastructure service
});
```

**Example - Platform/Domains leaf**:

```typescript
// layers/platform/users/index.ts
export default async function usersPlugin(fastify, opts) {
  // Standard route module
}
```

---

### Validation and Warnings

The generator validates classifications and provides warnings:

```bash
./bin/cli.js generate users --layer core --force

# ⚠️  Warning: Core layer modules should use fp() wrapper
```

Common warnings:

- Core modules without `fp()` wrapper
- Platform leaf modules with `fp()` wrapper (should be plain async)
- Domains leaf modules with `fp()` wrapper (should be plain async)

---

### Using --layer to Override

You can override automatic classification with `--layer`:

```bash
# Force to Core layer
./bin/cli.js generate custom-service --layer core --force

# Force to Platform layer
./bin/cli.js generate shared-util --layer platform --force

# Force to Domains layer
./bin/cli.js generate business-logic --layer domains --domain custom/operations --force
```

**When to override**:

1. Creating new module types not in predefined lists
2. Migrating modules between layers
3. Custom architecture requirements

**Best practice**: Let auto-classification work unless you have specific architectural needs.

---

### Quick Reference Table

| Module Name    | Auto-Classification | Output Path                                        | URL Pattern                              |
| -------------- | ------------------- | -------------------------------------------------- | ---------------------------------------- |
| auth           | Core                | `layers/core/auth`                                 | `/api/v1/core/auth`                      |
| users          | Platform            | `layers/platform/users`                            | `/api/v1/platform/users`                 |
| departments    | Platform            | `layers/platform/departments`                      | `/api/v1/platform/departments`           |
| budget-types   | Platform            | `layers/platform/budget-types`                     | `/api/v1/platform/budget-types`          |
| drugs\*        | Domains             | `layers/domains/inventory/master-data/drugs`       | `/api/v1/domains/inventory/drugs`        |
| requisitions\* | Domains             | `layers/domains/inventory/operations/requisitions` | `/api/v1/domains/inventory/requisitions` |

\* Requires `--domain` option

---

### Feature Package Flags

#### `--package <type>`

- **Options**: `standard`, `enterprise`, `full`
- **Default**: `standard`
- **Description**: Feature package level

| Package    | CRUD | Bulk Ops | Validation | Export | Search   | Stats | Import   |
| ---------- | ---- | -------- | ---------- | ------ | -------- | ----- | -------- |
| standard   | ✅   | ❌       | ❌         | ❌     | Basic    | ❌    | Optional |
| enterprise | ✅   | ✅       | ❌         | ❌     | Good     | ✅    | Optional |
| full       | ✅   | ✅       | ✅         | ✅     | Advanced | ✅    | Optional |

---

### Feature Flags

#### `-e, --with-events`

- **Default**: `false`
- **Description**: Include WebSocket event integration
- **Generates**: EventService, event emission, real-time updates

#### `--with-import`

- **Default**: `false`
- **Description**: Include bulk import (Excel/CSV)
- **Generates**: Import service, import dialog, validation

#### `--smart-stats`

- **Default**: `false`
- **Description**: Auto-detect statistics fields
- **Affects**: Standard statistics endpoint generation

#### `--multiple-roles`

- **Default**: `false`
- **Description**: Generate multiple roles (admin, editor, viewer)
- **Default**: Single role generation

#### `--include-audit-fields`

- **Default**: `false`
- **Description**: Include audit fields in forms (created_at, updated_at, deleted_at, created_by, updated_by)
- **Target**: Frontend only
- **Use Case**: Admin interfaces, data migration tools, or when manual control over audit fields is needed
- **Note**: By default, audit fields are excluded from forms as they are auto-managed by the backend

**Example**:

```bash
# Default: audit fields hidden from forms
./bin/cli.js generate products --target frontend --force

# Include audit fields in forms (admin use case)
./bin/cli.js generate products --target frontend --include-audit-fields --force
```

---

### Generation Control Flags

#### `-f, --force`

- **Default**: `false`
- **Description**: Overwrite existing files without prompting
- **Recommended**: Always use for CI/CD and automated generation

#### `-d, --dry-run`

- **Default**: `false`
- **Description**: Preview files without creating
- **Use Case**: Review changes before generating

#### `--flat`

- **Default**: `false`
- **Description**: Use flat structure instead of domain-based
- **Impact**: Affects folder organization

#### `--no-register`

- **Default**: `false`
- **Description**: Skip auto-registration in plugin.loader.ts
- **Use Case**: Manual registration needed

#### `--no-format`

- **Default**: `false`
- **Description**: Skip Prettier code formatting
- **Use Case**: When Prettier is not available

#### `--no-roles`

- **Default**: `false`
- **Description**: Skip role/permission generation
- **Impact**: No permission migration generated

#### `--migration-only`

- **Default**: `false`
- **Description**: Generate migration file only
- **Use Case**: Manual code generation

#### `--direct-db`

- **Default**: `false`
- **Description**: Write roles directly to database
- **WARNING**: Development only, use with caution

---

### Configuration Flags

#### `-c, --config <file>`

- **Description**: Path to custom .crudgen.json configuration file
- **Default**: Searches from project root

---

## Examples

### Example 1: Basic CRUD (Backend + Frontend)

```bash
# Step 1: Generate backend
pnpm run crud -- products --force

# Step 2: Generate frontend
./bin/cli.js generate products --target frontend --force

# Result:
# - API: /api/products
# - Frontend: /products route
# - Components: list, create, edit, view dialogs
```

### Example 2: Import Feature

```bash
# Step 1: Backend with import
pnpm run crud:import -- budgets --force

# Step 2: Frontend with import dialog
./bin/cli.js generate budgets --target frontend --with-import --force

# Result:
# - POST /api/budgets/import endpoint
# - Excel/CSV upload support
# - Frontend import dialog
```

### Example 3: Real-Time Feature

```bash
# Step 1: Backend with events
pnpm run crud:events -- notifications --force

# Step 2: Frontend with event handling
./bin/cli.js generate notifications --target frontend --with-events --force

# Result:
# - WebSocket event emission
# - Real-time list updates
# - Event listeners in UI
```

### Example 4: Enterprise Admin Interface

```bash
# Backend with all features
./bin/cli.js generate users --package enterprise --with-import --with-events --force

# Frontend with all features
./bin/cli.js generate users --target frontend --package enterprise --with-import --with-events --force

# Result:
# - Bulk operations
# - Status management
# - Statistics endpoints
# - Import dialog
# - Real-time updates
```

### Example 5: Regenerate After Template Update

```bash
# Preview changes
pnpm run crud -- products --dry-run

# Apply changes if satisfied
pnpm run crud -- products --force
```

---

### Example 6: Core Layer (Infrastructure Services)

```bash
# Generate authentication module in Core layer
./bin/cli.js generate auth --layer core --force

# Generate monitoring module in Core layer
./bin/cli.js generate monitoring --layer core --force

# Generate audit trail module in Core layer
./bin/cli.js generate audit-trail --layer core --force

# Result:
# - Output: layers/core/{module}/
# - URL: /api/v1/core/{module}
# - Uses fp() wrapper pattern
# - System-wide infrastructure services
```

**When to use Core layer**:

- Infrastructure services that decorate Fastify instance
- System-wide services (auth, monitoring, logging, audit)
- Services that provide cross-cutting concerns
- Rate limiting, security, health checks

---

### Example 7: Platform Layer (Shared Services)

```bash
# Generate users module (shared across all domains)
./bin/cli.js generate users --layer platform --force

# Generate departments module (organizational structure)
./bin/cli.js generate departments --layer platform --force

# Generate file-upload module (shared utility)
./bin/cli.js generate file-upload --layer platform --force

# Generate lookup table (budget-types)
./bin/cli.js generate budget-types --layer platform --force

# Result:
# - Output: layers/platform/{module}/
# - URL: /api/v1/platform/{module}
# - Uses plain async function (leaf modules)
# - Shared services used by multiple domains
```

**When to use Platform layer**:

- Services used by multiple domains (users, roles, permissions)
- Organizational structures (departments, positions)
- Shared utilities (files, PDF export, import/export)
- Lookup/reference data (types, categories, statuses)
- Configuration and settings

---

### Example 8: Domains Layer (Business Logic)

```bash
# Step 1: Generate backend in Domains layer
./bin/cli.js generate drugs \
  --layer domains \
  --domain inventory/master-data \
  --schema inventory \
  --force

# Step 2: Generate frontend
./bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --force

# Result (Backend):
# - Output: layers/domains/inventory/master-data/drugs/
# - URL: /api/v1/domains/inventory/drugs
# - Plain async function (leaf module)
# - Domain-specific master data

# Result (Frontend):
# - Output: features/inventory/modules/drugs/
# - Route: /inventory/master-data/drugs
```

**More Domains Examples**:

```bash
# Operational/transactional data
./bin/cli.js generate requisitions \
  --layer domains \
  --domain inventory/operations \
  --schema inventory \
  --package enterprise \
  --with-events \
  --force

# HR domain
./bin/cli.js generate employees \
  --layer domains \
  --domain hr/master-data \
  --schema hr \
  --force

# Finance domain
./bin/cli.js generate budget-allocations \
  --layer domains \
  --domain finance/operations \
  --schema finance \
  --package full \
  --force
```

**When to use Domains layer**:

- Domain-specific business logic (inventory, HR, finance)
- Transactional/operational data (requisitions, orders, invoices)
- Domain-specific master data (drugs, employees, assets)
- Business rules specific to a domain

---

### Example 9: Layer Migration

```bash
# Scenario: Moving a module from one layer to another

# Step 1: Regenerate in new layer
./bin/cli.js generate users --layer platform --force

# Step 2: Update imports in dependent modules
# Step 3: Update plugin loader registration
# Step 4: Test API endpoints
# Step 5: Remove old module directory

# New paths:
# - Old: apps/api/src/modules/users/
# - New: apps/api/src/layers/platform/users/
# - Old URL: /api/users
# - New URL: /api/v1/platform/users
```

---

### Example 10: Complete Multi-Domain Application

```bash
# Core layer - Infrastructure
./bin/cli.js generate auth --layer core --force
./bin/cli.js generate monitoring --layer core --force

# Platform layer - Shared services
./bin/cli.js generate users --layer platform --force
./bin/cli.js generate departments --layer platform --force
./bin/cli.js generate roles --layer platform --force

# Domains layer - Inventory domain
./bin/cli.js generate drugs --layer domains --domain inventory/master-data --schema inventory --force
./bin/cli.js generate requisitions --layer domains --domain inventory/operations --schema inventory --force

# Domains layer - HR domain
./bin/cli.js generate employees --layer domains --domain hr/master-data --schema hr --force
./bin/cli.js generate leave-requests --layer domains --domain hr/operations --schema hr --force

# Result: Clean 3-tier architecture
# - Core: System infrastructure
# - Platform: Shared services
# - Domains: Business logic per domain
```

---

## Table Name Conventions

### Automatic Conversions

CRUD Generator automatically converts table names:

| Context         | Format     | Example               |
| --------------- | ---------- | --------------------- |
| Database table  | snake_case | `test_products`       |
| Module folder   | kebab-case | `test-products/`      |
| TypeScript type | PascalCase | `TestProducts`        |
| API route       | kebab-case | `/api/test-products`  |
| Service class   | PascalCase | `TestProductsService` |

### Rules

1. **Input**: Always use database table name (snake_case)

   ```bash
   pnpm run crud -- test_products --force
   ```

2. **Generation**:
   - Folder: `test-products/`
   - Types: `TestProducts`, `CreateTestProducts`, `UpdateTestProducts`
   - Service: `TestProductsService`
   - Routes: `GET /api/test-products`, `POST /api/test-products`, etc.

3. **Naming Pattern**:
   ```
   test_products (database)
   └── test-products/ (folder)
       ├── services/
       │   └── test-products.service.ts
       ├── types/
       │   └── test-products.types.ts
       ├── controllers/
       │   └── test-products.controller.ts
       └── routes/
           └── index.ts
   ```

---

## Quick Reference

### Most Used Commands

```bash
pnpm run crud -- TABLE --force
pnpm run crud:import -- TABLE --force
pnpm run crud:events -- TABLE --force
pnpm run crud:full -- TABLE --force
pnpm run crud:list
./bin/cli.js generate TABLE --target frontend --force
./bin/cli.js list-tables
```

### Important Points

- ✅ Always use `--` with pnpm scripts
- ✅ Generate backend BEFORE frontend
- ✅ Use snake_case for table names
- ✅ Add `--force` to skip prompts
- ❌ Don't use `pnpm aegisx-crud` (doesn't exist)
- ❌ Don't use `--entity` flag (doesn't exist)
- ❌ Don't skip `--` separator with pnpm

---

**Generator Version**: 2.3.0
**Last Updated**: December 14, 2025
**Added**: Layer classification system with `--layer` option, comprehensive documentation for Core/Platform/Domains layers
**Status**: ✅ Production Ready
