# AegisX CLI Documentation

> **Automatic CRUD API generation with built-in error handling and validation**

---

## Quick Start

```bash
# Install globally
npm install -g @aegisx/cli

# Start 14-day trial
aegisx trial

# List available tables
aegisx list-tables

# Generate backend CRUD
aegisx generate products --force

# Generate frontend CRUD
aegisx generate products --target frontend --force
```

---

## Documentation Index

### Getting Started

| Guide                                           | Description                           | Priority   |
| ----------------------------------------------- | ------------------------------------- | ---------- |
| **[Workflow Overview](./WORKFLOW_OVERVIEW.md)** | CLI architecture & complete workflows | Start Here |
| **[Quick Reference](./QUICK_REFERENCE.md)**     | All commands at a glance              | Daily Use  |
| **[Installation](./INSTALLATION.md)**           | Install, activate license, setup      | First Time |
| **[CLI Reference](./CLI_REFERENCE.md)**         | Complete command documentation        | Reference  |
| **[Command Reference](./COMMAND_REFERENCE.md)** | All flags and options                 | Reference  |

### Feature Guides

| Guide                                                 | Description                      | When to Use       |
| ----------------------------------------------------- | -------------------------------- | ----------------- |
| **[Domain Guide](./DOMAIN_GUIDE.md)**                 | Domain-based module organization | API organization  |
| **[Shell Guide](./SHELL_GUIDE.md)**                   | Angular app shells               | Frontend setup    |
| **[Events Guide](./EVENTS_GUIDE.md)**                 | WebSocket real-time events       | Real-time updates |
| **[Import Guide](./IMPORT_GUIDE.md)**                 | Excel/CSV bulk import            | Data import       |
| **[Error Handling](./ERROR_HANDLING_GUIDE.md)**       | Error codes & validation         | Error handling    |
| **[Validation Reference](./VALIDATION_REFERENCE.md)** | Field validation rules           | Form validation   |

### Templates & Development

| Guide                                                       | Description                       |
| ----------------------------------------------------------- | --------------------------------- |
| **[Template Patterns](./TEMPLATE_PATTERNS.md)**             | Handlebars template documentation |
| **[Template Development](./TEMPLATE_DEVELOPMENT_GUIDE.md)** | Custom template creation          |

### Reference

| Document                                    | Description                    |
| ------------------------------------------- | ------------------------------ |
| **[Quick Commands](./QUICK_COMMANDS.md)**   | Fast command lookup            |
| **[Changelog](./CHANGELOG.md)**             | Version history & migrations   |
| **[Migration Guide](./MIGRATION_GUIDE.md)** | Upgrade from previous versions |

---

## What You Get

When you generate a CRUD module, you automatically get:

### Backend (Fastify + TypeBox)

```
modules/products/
├── products.routes.ts      # REST API endpoints
├── products.controller.ts  # Business logic
├── products.service.ts     # Database operations
├── products.repository.ts  # Query builder
├── products.schemas.ts     # TypeBox validation
├── products.types.ts       # TypeScript types
└── index.ts               # Module exports
```

### Frontend (Angular 17+ Standalone)

```
products/
├── products.component.ts      # Smart component
├── products.component.html    # Material Design template
├── products.component.scss    # Tailwind CSS styles
├── products.service.ts        # API service
├── products-dialog.component.ts  # Create/Edit dialog
├── products.routes.ts         # Lazy-loaded routes
└── index.ts                   # Public API
```

---

## Features

| Feature                 | Description                               |
| ----------------------- | ----------------------------------------- |
| **Backend Generation**  | Fastify routes, services, repositories    |
| **Frontend Generation** | Angular components with Material Design   |
| **Domain Organization** | Organize modules in domain structure      |
| **Shell Generation**    | Complete app layouts (enterprise, simple) |
| **WebSocket Events**    | Real-time updates with `--with-events`    |
| **Bulk Import**         | Excel/CSV import with `--with-import`     |
| **TypeBox Schemas**     | Type-safe validation                      |
| **Multi-Package**       | Standard, Enterprise, Full packages       |
| **PostgreSQL Schema**   | Read from any PostgreSQL schema           |

---

## Feature Packages

| Package        | Features                                                       |
| -------------- | -------------------------------------------------------------- |
| **Standard**   | Basic CRUD, TypeBox schemas, pagination, filtering             |
| **Enterprise** | + Dropdown API, bulk operations, status management, statistics |
| **Full**       | + Data validation, uniqueness checking, export capabilities    |

```bash
# Use enterprise package
aegisx generate orders --package enterprise --force

# Use full package
aegisx generate invoices --package full --force
```

---

## HIS Mode (Hospital Information System)

**v2.1.0+** includes HIS Mode for critical enterprise systems:

- Data Accuracy First: UI always shows actual database state
- Backend Always Emits Events: Audit trail and event-driven ready
- Optional Real-Time Mode: Easy to enable when needed
- No User Confusion: Never show outdated data

---

## pnpm Scripts (Monorepo)

For monorepo projects using this CLI, use these shortcuts:

```bash
# Basic generation
pnpm run crud -- <table_name> --force

# With import
pnpm run crud:import -- <table_name> --force

# With events
pnpm run crud:events -- <table_name> --force

# Full package
pnpm run crud:full -- <table_name> --force

# List tables
pnpm run crud:list

# Validate module
pnpm run crud:validate -- <module_name>
```

**Important:** Always use `--` separator before table name when using pnpm scripts!

---

## License Tiers

| Tier         | Price     | Developers | Features                  |
| ------------ | --------- | ---------- | ------------------------- |
| Trial        | Free      | 1          | 14 days, limited          |
| Professional | $49       | 1          | All features, 1yr updates |
| Team         | $199/year | Up to 10   | Priority support          |
| Enterprise   | Contact   | Unlimited  | On-premise, SLA           |

---

## Support

- **Documentation**: This folder (`docs/`)
- **Community**: GitHub Issues
- **Email**: support@aegisx.dev (Team/Enterprise)

---

**Version:** 3.0.0
**Last Updated:** 2025-12-07

**Copyright (c) 2024 AegisX Team. All rights reserved.**
