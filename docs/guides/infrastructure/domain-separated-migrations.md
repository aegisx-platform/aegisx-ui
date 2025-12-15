# Domain-Separated Migrations Architecture

## Overview

This project uses **domain-separated migrations** to organize database schema changes by business domains. This architecture improves scalability, maintainability, and team collaboration in large enterprise systems.

## Why Domain-Separated Migrations?

### Problems with Single Migration Directory

In large systems with multiple business domains (Inventory, HR, Finance, etc.), using a single migration directory causes:

1. **Merge Conflicts**: Multiple teams working on different domains create migrations with same timestamps
2. **Complex Dependencies**: Hard to track which migrations belong to which domain
3. **Schema Pollution**: All tables mixed in single `public` schema
4. **Slow Migrations**: All domains must migrate together even if only one changed
5. **Unclear Ownership**: Hard to know which team owns which migrations

### Benefits of Domain Separation

1. **Clear Boundaries**: Each domain has its own knexfile, migrations, schema, and migration table
2. **Independent Deployments**: Domains can migrate separately without affecting others
3. **Team Autonomy**: Teams can work on their domain without interfering with others
4. **Better Organization**: Easy to find domain-specific migrations
5. **Scalability**: Easy to add new domains without affecting existing ones

## Architecture

### Main System vs Domains

```
Main System (Core Platform)
├── knexfile.ts                          → Main system configuration
├── apps/api/src/database/
│   ├── migrations/                      → Core system migrations
│   │   ├── 20XX_create_users.ts         → Users, roles, permissions
│   │   ├── 20XX_create_roles.ts
│   │   └── 20XX_create_permissions.ts
│   └── seeds/                           → Core system seeds
└── Database Schema: public              → PostgreSQL public schema

Domain: Inventory
├── knexfile-inventory.ts                → Inventory domain configuration
├── apps/api/src/database/
│   ├── migrations-inventory/            → Inventory migrations (100+ files)
│   │   ├── 20XX_create_inventory_schema.ts
│   │   ├── 20XX_create_drugs.ts
│   │   ├── 20XX_create_budget_requests.ts
│   │   └── ...
│   └── seeds-inventory/                 → Inventory seeds
└── Database Schema: inventory           → Separate PostgreSQL schema

Future Domains (HR, Finance, CRM, etc.)
├── knexfile-hr.ts
├── knexfile-finance.ts
└── ...
```

### Key Configuration Differences

| Aspect                 | Main System       | Domain (Inventory)          |
| ---------------------- | ----------------- | --------------------------- |
| Knexfile               | `knexfile.ts`     | `knexfile-inventory.ts`     |
| Migrations Dir         | `migrations/`     | `migrations-inventory/`     |
| Seeds Dir              | `seeds/`          | `seeds-inventory/`          |
| Schema                 | `public`          | `inventory`                 |
| Migration Table        | `knex_migrations` | `knex_migrations_inventory` |
| Migration Table Schema | `public`          | `inventory`                 |

## Running Migrations

### Main System Migrations

```bash
# Run main system migrations (users, roles, permissions)
pnpm run db:migrate

# Internally runs:
# pnpm knex migrate:latest --knexfile=knexfile.ts
```

### Domain Migrations (Inventory)

```bash
# Run inventory domain migrations
pnpm knex migrate:latest --knexfile=knexfile-inventory.ts

# Or add npm script to package.json:
pnpm run db:migrate:inventory
```

### Full System Setup

```bash
# 1. Start Docker services (PostgreSQL, Redis)
pnpm run docker:up

# 2. Run main system migrations
pnpm run db:migrate

# 3. Run inventory domain migrations
pnpm knex migrate:latest --knexfile=knexfile-inventory.ts

# 4. Run seeds (if needed)
pnpm run db:seed
```

## Migration Table Tracking

Each domain maintains its own migration history:

```sql
-- Main system migrations
SELECT * FROM public.knex_migrations;

-- Inventory domain migrations
SELECT * FROM inventory.knex_migrations_inventory;
```

This prevents conflicts and allows independent rollbacks per domain.

## Creating New Domains

### Step 1: Create Domain Knexfile

Create `knexfile-[domain].ts`:

```typescript
import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local', override: true });
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'aegisx_db',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
      // CRITICAL: Create schema before Knex uses it
      afterCreate: (conn: unknown, done: (err?: Error) => void) => {
        (conn as { query: (sql: string, cb: (err?: Error) => void) => void }).query('CREATE SCHEMA IF NOT EXISTS [domain_name]', (err?: Error) => {
          done(err);
        });
      },
    },
    migrations: {
      directory: './apps/api/src/database/migrations-[domain]',
      tableName: 'knex_migrations_[domain]',
      schemaName: '[domain_name]', // Store migration table in domain schema
      extension: 'ts',
    },
    seeds: {
      directory: './apps/api/src/database/seeds-[domain]',
      extension: 'ts',
    },
  },
  production: {
    // ... similar config
  },
};

export default config;
```

### Step 2: Create Migration Directory

```bash
mkdir -p apps/api/src/database/migrations-[domain]
mkdir -p apps/api/src/database/seeds-[domain]
```

### Step 3: Create First Migration (Schema Creation)

```bash
pnpm knex migrate:make create_[domain]_schema --knexfile=knexfile-[domain].ts
```

Example migration:

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Schema is already created by afterCreate hook
  // This migration just confirms it exists
  await knex.raw('CREATE SCHEMA IF NOT EXISTS [domain_name]');
  console.log('✅ [Domain] schema created');
}

export async function down(knex: Knex): Promise<void> {
  // WARNING: This drops entire domain schema!
  await knex.raw('DROP SCHEMA IF EXISTS [domain_name] CASCADE');
  console.log('⚠️  [Domain] schema dropped');
}
```

### Step 4: Add npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "db:migrate:[domain]": "knex migrate:latest --knexfile=knexfile-[domain].ts",
    "db:rollback:[domain]": "knex migrate:rollback --knexfile=knexfile-[domain].ts",
    "db:seed:[domain]": "knex seed:run --knexfile=knexfile-[domain].ts"
  }
}
```

## Best Practices

### 1. Schema Organization

```sql
-- ✅ GOOD: Domain tables in domain schema
CREATE TABLE inventory.budget_requests (...);
CREATE TABLE inventory.drugs (...);
CREATE TABLE hr.employees (...);

-- ❌ BAD: Domain tables in public schema
CREATE TABLE public.budget_requests (...);  -- Should be in inventory schema
```

### 2. Cross-Domain References

```typescript
// ✅ GOOD: Reference main system tables (users, roles) from domain tables
await knex.schema.withSchema('inventory').createTable('budget_requests', (table) => {
  table.bigIncrements('id').primary();
  table.uuid('created_by').references('id').inTable('users'); // References public.users
  table.integer('department_id').references('id').inTable('inventory.departments');
});

// ❌ BAD: Domain tables referencing other domain tables
table.integer('hr_employee_id').references('id').inTable('hr.employees'); // Cross-domain dependency!
```

**Rule**: Domains can reference `public` schema (main system), but should NOT reference other domains directly.

### 3. Migration File Naming

Use domain prefix for clarity:

```bash
# Inventory domain
20251205000001_create_inventory_schema.ts
20251205000002_create_drugs.ts
20251208100001_create_budget_requests.ts

# HR domain
20251206000001_create_hr_schema.ts
20251206000002_create_employees.ts
```

### 4. Handling Existing Columns

**CRITICAL**: Always use raw SQL checks instead of Knex's `hasColumn()` to avoid caching issues:

```typescript
// ✅ GOOD: Raw SQL check (reliable)
const columnCheck = await knex.raw(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'inventory'
    AND table_name = 'departments'
    AND column_name = 'new_column'
`);

if (columnCheck.rows.length === 0) {
  await knex.schema.alterTable('inventory.departments', (table) => {
    table.string('new_column', 100).nullable();
  });
}

// ❌ BAD: Knex hasColumn (unreliable in transactions)
const hasColumn = await knex.schema.withSchema('inventory').hasColumn('departments', 'new_column');
if (!hasColumn) {
  // May still fail if column exists!
}
```

### 5. afterCreate Hook

**CRITICAL**: Always include `afterCreate` hook in domain knexfiles:

```typescript
pool: {
  afterCreate: (conn: unknown, done: (err?: Error) => void) => {
    // This runs BEFORE Knex tries to create migration table
    (conn as { query: (sql: string, cb: (err?: Error) => void) => void })
      .query('CREATE SCHEMA IF NOT EXISTS inventory', (err?: Error) => {
        done(err);
      });
  },
}
```

Without this, Knex will fail trying to create `inventory.knex_migrations_inventory` because the schema doesn't exist yet.

## Common Issues and Solutions

### Issue 1: Column Already Exists

**Error**: `column "import_batch_id" of relation "users" already exists`

**Cause**: Knex's `hasColumn()` returned false even though column exists (caching issue)

**Solution**: Use raw SQL check (see Best Practices #4)

### Issue 2: Schema Does Not Exist

**Error**: `schema "inventory" does not exist`

**Cause**: Missing `afterCreate` hook in knexfile

**Solution**: Add `afterCreate` hook to create schema before migrations run

### Issue 3: Migration Table Not Found

**Error**: `relation "inventory.knex_migrations_inventory" does not exist`

**Cause**: `schemaName` not set in migrations config

**Solution**:

```typescript
migrations: {
  directory: './apps/api/src/database/migrations-inventory',
  tableName: 'knex_migrations_inventory',
  schemaName: 'inventory',  // ← MUST SET THIS
  extension: 'ts',
}
```

### Issue 4: Migrations Not Running

**Problem**: Running `pnpm run db:migrate` doesn't run inventory migrations

**Cause**: Default `db:migrate` only runs main system migrations

**Solution**: Run domain migrations explicitly:

```bash
pnpm knex migrate:latest --knexfile=knexfile-inventory.ts
```

### Issue 5: Cross-Domain Foreign Keys

**Problem**: Want to reference `hr.employees` from `inventory.budget_requests`

**Solution**: DON'T. Instead:

1. Store employee UUID (references `public.users`)
2. Or use application-level joins
3. Or create a shared lookup table in `public` schema

## Migration Commands Reference

### Main System

```bash
# Create new migration
pnpm knex migrate:make migration_name --knexfile=knexfile.ts

# Run migrations
pnpm run db:migrate

# Rollback last batch
pnpm knex migrate:rollback --knexfile=knexfile.ts

# Check migration status
pnpm knex migrate:status --knexfile=knexfile.ts
```

### Domain (Inventory)

```bash
# Create new migration
pnpm knex migrate:make migration_name --knexfile=knexfile-inventory.ts

# Run migrations
pnpm knex migrate:latest --knexfile=knexfile-inventory.ts

# Rollback last batch
pnpm knex migrate:rollback --knexfile=knexfile-inventory.ts

# Check migration status
pnpm knex migrate:status --knexfile=knexfile-inventory.ts
```

## Verification

After running migrations, verify domain setup:

```sql
-- Check schemas
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('public', 'inventory', 'hr', 'finance');

-- Check migration tables
SELECT * FROM public.knex_migrations ORDER BY id DESC LIMIT 5;
SELECT * FROM inventory.knex_migrations_inventory ORDER BY id DESC LIMIT 5;

-- Check domain tables
\dt inventory.*
\dt hr.*

-- Verify table counts
SELECT
  schemaname,
  COUNT(*) as table_count
FROM pg_tables
WHERE schemaname IN ('public', 'inventory', 'hr', 'finance')
GROUP BY schemaname;
```

## Future Expansion

When adding new domains (HR, Finance, CRM, etc.):

1. Create `knexfile-[domain].ts` (copy from `knexfile-inventory.ts`)
2. Create migration directories
3. Add npm scripts
4. Document domain-specific tables and relationships
5. Update this guide with domain-specific notes

## Summary

- ✅ **Main System**: `knexfile.ts` → `migrations/` → `public` schema
- ✅ **Inventory**: `knexfile-inventory.ts` → `migrations-inventory/` → `inventory` schema
- ✅ **Future Domains**: Follow same pattern
- ✅ **Run separately**: Each domain migrates independently
- ✅ **Clear boundaries**: Each domain owns its schema and migrations
- ✅ **Scalable**: Easy to add new domains without affecting existing ones

## Related Documentation

- [Multi-Instance Setup](./multi-instance-setup.md) - Managing multiple dev instances
- [Git Subtree Guide](./git-subtree-guide.md) - Shared library management
- [Database Architecture](../../architecture/database-architecture.md) - Overall database design
