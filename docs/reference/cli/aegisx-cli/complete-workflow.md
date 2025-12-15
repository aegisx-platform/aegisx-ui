---
title: 'Complete Workflow'
description: 'End-to-end workflow for CRUD generation'
category: reference
tags: [cli, workflow, crud]
---

# AegisX CLI Complete Workflow Guide

> **Complete guide from database table to production-ready feature**

## Overview

The AegisX CLI generates complete CRUD features from database tables:

```
Database Table → Backend API → Frontend UI → Navigation
```

**What gets generated:**

| Layer    | Components                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Controller, Service, Repository, Routes, Schemas, Types |
| Frontend | List, Create Dialog, Edit Dialog, View Dialog, Service  |

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE CRUD WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐ │
│  │   Database   │ →  │   Backend    │ →  │   Frontend   │ →  │ Navigation │ │
│  │    Table     │    │     API      │    │      UI      │    │   Config   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘    └────────────┘ │
│         │                   │                   │                  │         │
│         ▼                   ▼                   ▼                  ▼         │
│  • Migration         • Controller        • List Component   • Menu Item     │
│  • Schema            • Service           • Create Dialog    • Permissions   │
│  • Indexes           • Repository        • Edit Dialog      • Routes        │
│                      • Routes            • View Dialog                      │
│                      • Schemas           • Service                          │
│                      • Types             • Types                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step 2: Backend Generation

### Basic Commands

| Command                                 | Description             |
| --------------------------------------- | ----------------------- |
| `pnpm run crud -- TABLE --force`        | Basic CRUD              |
| `pnpm run crud:import -- TABLE --force` | CRUD + Excel/CSV Import |
| `pnpm run crud:events -- TABLE --force` | CRUD + WebSocket Events |
| `pnpm run crud:full -- TABLE --force`   | CRUD + Import + Events  |

### Examples

```bash
# Basic CRUD for products table
pnpm run crud -- products --force

# With import functionality
pnpm run crud:import -- products --force

# With real-time WebSocket events
pnpm run crud:events -- products --force

# Full package (import + events)
pnpm run crud:full -- products --force
```

### Generated Files

```
apps/api/src/modules/products/
├── controllers/
│   └── products.controller.ts    # HTTP request handlers
├── routes/
│   └── products.routes.ts        # Fastify route definitions
├── services/
│   └── products.service.ts       # Business logic
├── repositories/
│   └── products.repository.ts    # Database operations
├── schemas/
│   └── products.schemas.ts       # TypeBox validation schemas
├── types/
│   └── products.types.ts         # TypeScript interfaces
└── index.ts                      # Module exports
```

### Auto-Registration

Routes are automatically registered in:

```typescript
// apps/api/src/bootstrap/plugin.loader.ts
await fastify.register(import('../modules/products'), { prefix: '/api/products' });
```

### Verify Backend

```bash
# Build and start API
pnpm run build && pnpm run dev:api

# Test endpoints
curl http://localhost:3333/api/products
curl http://localhost:3333/api/products/1
```

## Step 4: Navigation & Routes

### Register Routes

```typescript
// apps/web/src/app/app.routes.ts
export const appRoutes: Routes = [
  // ... existing routes
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
];
```

### Add Navigation Item

```typescript
// apps/web/src/app/config/navigation.config.ts
export const NAVIGATION_ITEMS: NavigationItem[] = [
  // ... existing items
  {
    label: 'Products',
    icon: 'inventory_2',
    route: '/products',
    permission: 'products:read',
  },
];
```

### Shell Navigation (If using shells)

```typescript
// apps/web/src/app/shells/inventory/inventory.config.ts
export const INVENTORY_NAV_ITEMS = [
  {
    section: 'Master Data',
    items: [{ label: 'Products', icon: 'inventory_2', route: 'master-data/products' }],
  },
];
```

## Quick Reference

### One-Liner Commands

```bash
# Complete feature (backend + frontend)
pnpm run crud:full -- products --force && \
cd libs/aegisx-cli && \
./bin/cli.js generate products --target frontend --with-import --force

# Domain feature (schema + backend + frontend)
cd libs/aegisx-cli && \
./bin/cli.js generate drugs --schema inventory --force && \
./bin/cli.js generate drugs --target frontend --shell inventory --section master-data --force
```

### All CLI Options

| Option          | Values                           | Description               |
| --------------- | -------------------------------- | ------------------------- |
| `--target`      | `backend`, `frontend`            | Generation target         |
| `--force`       | -                                | Overwrite existing files  |
| `--dry-run`     | -                                | Preview without creating  |
| `--with-import` | -                                | Include Excel/CSV import  |
| `--with-events` | -                                | Include WebSocket events  |
| `--schema`      | schema name                      | Database schema           |
| `--shell`       | shell name                       | Target shell for frontend |
| `--section`     | section name                     | Section within shell      |
| `--app`         | `web`, `admin`, `api`            | Target application        |
| `--package`     | `standard`, `enterprise`, `full` | Feature package           |

### Package Scripts

```bash
# Backend shortcuts
pnpm run crud -- TABLE --force          # Basic
pnpm run crud:import -- TABLE --force   # + Import
pnpm run crud:events -- TABLE --force   # + Events
pnpm run crud:full -- TABLE --force     # Full

# Utility
pnpm run crud:list                      # List tables
pnpm run crud:validate -- TABLE         # Validate module
```

## Related Documentation

- [CLI Installation](./INSTALLATION.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Shell Guide](./SHELL_GUIDE.md)
- [Domain Guide](./DOMAIN_GUIDE.md)
- [Import Guide](./IMPORT_GUIDE.md)
- [Events Guide](./EVENTS_GUIDE.md)
