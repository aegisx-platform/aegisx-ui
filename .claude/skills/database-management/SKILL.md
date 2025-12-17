# Database Management Skill

## When to Use This Skill

Use this skill when you need to:

- Create, run, or rollback database migrations
- Understand which knexfile to use for a specific task
- Set up a new database domain
- Seed database with initial or test data
- Check migration status or troubleshoot migration issues
- Work with domain-separated schemas (public, inventory, hr, etc.)

## Architecture Overview

This project uses **domain-separated migrations** with two migration systems:

### Main System (Core Platform)

- **Knexfile**: `knexfile.ts`
- **Migrations**: `apps/api/src/database/migrations/`
- **Seeds**: `apps/api/src/database/seeds/`
- **Schema**: `public`
- **Migration Table**: `public.knex_migrations`
- **Purpose**: Core platform features (users, roles, permissions, authentication)

### Domain: Inventory

- **Knexfile**: `knexfile-inventory.ts`
- **Migrations**: `apps/api/src/database/migrations-inventory/`
- **Seeds**: `apps/api/src/database/seeds-inventory/`
- **Schema**: `inventory`
- **Migration Table**: `inventory.knex_migrations_inventory`
- **Purpose**: Inventory management (drugs, budgets, stock, etc.)

## Decision Tree: Which Knexfile?

```
Is this a core platform feature?
├─ YES: Authentication, Users, Roles, Permissions
│  └─ Use knexfile.ts (Main System)
│
└─ NO: Is it domain-specific?
   ├─ Inventory-related (drugs, budgets, stock, etc.)
   │  └─ Use knexfile-inventory.ts
   │
   ├─ HR-related (employees, payroll, etc.)
   │  └─ Use knexfile-hr.ts (future)
   │
   └─ Finance-related (accounting, transactions, etc.)
      └─ Use knexfile-finance.ts (future)
```

## Safe Migration Workflow

### Before Creating Any Migration

1. **Understand the domain** - Is this main system or domain-specific?
2. **Check existing schema** - Run status command first
3. **Plan the change** - What tables/columns are affected?
4. **Consider rollback** - How will you undo this change?

### Creating New Migration

#### Main System Migration

```bash
# 1. Create migration file
pnpm knex migrate:make create_users_table --knexfile=knexfile.ts

# 2. Edit the migration file in apps/api/src/database/migrations/
# - Implement up() function (apply changes)
# - Implement down() function (rollback changes)

# 3. Test the migration
pnpm run db:migrate

# 4. Verify it worked
pnpm run db:status

# 5. Test rollback
pnpm run db:rollback

# 6. Re-apply
pnpm run db:migrate
```

#### Domain Migration (Inventory)

```bash
# 1. Create migration file
pnpm knex migrate:make create_drugs_table --knexfile=knexfile-inventory.ts

# 2. Edit the migration file in apps/api/src/database/migrations-inventory/
# - Use withSchema('inventory') for all table operations
# - Implement up() and down() functions

# 3. Test the migration
pnpm run db:migrate:inventory

# 4. Verify it worked
pnpm run db:migrate:inventory:status

# 5. Test rollback
pnpm run db:migrate:inventory:rollback

# 6. Re-apply
pnpm run db:migrate:inventory
```

### Migration Template (Main System)

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true); // created_at, updated_at
  });

  console.log('✅ Created users table');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  console.log('⚠️  Dropped users table');
}
```

### Migration Template (Domain - Inventory)

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('inventory').createTable('drugs', (table) => {
    table.bigIncrements('id').primary();
    table.string('name', 255).notNullable();
    table.string('code', 50).notNullable().unique();
    table.decimal('price', 10, 2).notNullable();

    // Reference main system user (cross-schema FK)
    table.uuid('created_by').references('id').inTable('users');

    table.timestamps(true, true);
  });

  console.log('✅ Created inventory.drugs table');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('inventory').dropTableIfExists('drugs');
  console.log('⚠️  Dropped inventory.drugs table');
}
```

## Common Mistakes Prevention

### 1. Running Wrong Knexfile

```bash
# ❌ WRONG: Running main system migrate for inventory table
pnpm run db:migrate  # This won't create inventory.drugs

# ✅ CORRECT: Use domain-specific command
pnpm run db:migrate:inventory
```

### 2. Forgetting Schema in Domain Migrations

```typescript
// ❌ WRONG: Missing withSchema()
await knex.schema.createTable('drugs', (table) => {
  // This creates public.drugs instead of inventory.drugs!
});

// ✅ CORRECT: Always use withSchema() for domains
await knex.schema.withSchema('inventory').createTable('drugs', (table) => {
  // Creates inventory.drugs
});
```

### 3. Missing FK Constraints

```typescript
// ❌ WRONG: Foreign key without proper references
table.uuid('created_by'); // No FK constraint

// ✅ CORRECT: Proper FK with references
table
  .uuid('created_by')
  .references('id')
  .inTable('users') // References public.users
  .onDelete('SET NULL');
```

### 4. Not Checking Existing Columns

**CRITICAL**: Always use raw SQL to check for existing columns:

```typescript
// ✅ CORRECT: Raw SQL check (reliable)
export async function up(knex: Knex): Promise<void> {
  const columnCheck = await knex.raw(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'inventory'
      AND table_name = 'drugs'
      AND column_name = 'generic_name'
  `);

  if (columnCheck.rows.length === 0) {
    await knex.schema.withSchema('inventory').alterTable('drugs', (table) => {
      table.string('generic_name', 255).nullable();
    });
  }
}

// ❌ WRONG: Using hasColumn() - unreliable in transactions
const hasColumn = await knex.schema.withSchema('inventory').hasColumn('drugs', 'generic_name');
// May return false even if column exists!
```

### 5. Missing Rollback Function

```typescript
// ❌ WRONG: Empty or missing down() function
export async function down(knex: Knex): Promise<void> {
  // No implementation - can't rollback!
}

// ✅ CORRECT: Proper rollback implementation
export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('inventory').dropTableIfExists('drugs');
}
```

### 6. Cross-Domain References

```typescript
// ❌ WRONG: Referencing other domain tables
table.integer('employee_id').references('id').inTable('hr.employees'); // Cross-domain dependency!

// ✅ CORRECT: Reference main system or store UUID
table.uuid('user_id').references('id').inTable('users'); // Reference public.users only
```

## Testing Before Commit

**MANDATORY**: Always test migrations before committing:

```bash
# 1. Check current status
pnpm run db:status
pnpm run db:migrate:inventory:status

# 2. Run the migration
pnpm run db:migrate              # Main system
pnpm run db:migrate:inventory    # Inventory domain

# 3. Verify it worked
pnpm run db:status
# Check database directly if needed

# 4. Test rollback
pnpm run db:rollback             # Main system
pnpm run db:migrate:inventory:rollback  # Inventory

# 5. Re-apply
pnpm run db:migrate
pnpm run db:migrate:inventory

# 6. Run build to ensure no TypeScript errors
pnpm run build

# 7. Now safe to commit
git add apps/api/src/database/migrations/...
git commit -m "feat(db): add users table migration"
```

## Quick Commands Reference

### Main System Commands

```bash
# Create migration
pnpm knex migrate:make MIGRATION_NAME --knexfile=knexfile.ts

# Run migrations
pnpm run db:migrate

# Rollback last batch
pnpm run db:rollback

# Check migration status
pnpm run db:status

# Run seeds
pnpm run db:seed

# Full reset (rollback + migrate + seed)
pnpm run db:reset
```

### Inventory Domain Commands

```bash
# Create migration
pnpm knex migrate:make MIGRATION_NAME --knexfile=knexfile-inventory.ts

# Run migrations
pnpm run db:migrate:inventory

# Rollback last batch
pnpm run db:migrate:inventory:rollback

# Check migration status
pnpm run db:migrate:inventory:status

# Run seeds
pnpm run db:seed:inventory

# Full setup (migrate + seed)
pnpm run inventory:setup
```

### Database Verification

```bash
# Connect to database
docker exec -it aegisx_postgres psql -U postgres -d aegisx_db

# Check schemas
\dn

# List tables in public schema
\dt public.*

# List tables in inventory schema
\dt inventory.*

# View migration history (main)
SELECT * FROM public.knex_migrations ORDER BY id DESC;

# View migration history (inventory)
SELECT * FROM inventory.knex_migrations_inventory ORDER BY id DESC;

# Exit psql
\q
```

## Creating New Domain

When adding a new domain (e.g., HR, Finance):

```bash
# 1. Create knexfile (copy from knexfile-inventory.ts)
cp knexfile-inventory.ts knexfile-hr.ts

# 2. Update knexfile-hr.ts:
# - Change schema name to 'hr'
# - Change migrations directory to 'migrations-hr'
# - Change seeds directory to 'seeds-hr'
# - Change migration table to 'knex_migrations_hr'
# - Update afterCreate hook to create 'hr' schema

# 3. Create directories
mkdir -p apps/api/src/database/migrations-hr
mkdir -p apps/api/src/database/seeds-hr

# 4. Create first migration (schema creation)
pnpm knex migrate:make create_hr_schema --knexfile=knexfile-hr.ts

# 5. Add npm scripts to package.json
"db:migrate:hr": "node --loader ts-node/esm ./node_modules/knex/bin/cli.js migrate:latest --knexfile knexfile-hr.ts",
"db:migrate:hr:rollback": "node --loader ts-node/esm ./node_modules/knex/bin/cli.js migrate:rollback --knexfile knexfile-hr.ts",
"db:migrate:hr:status": "node --loader ts-node/esm ./node_modules/knex/bin/cli.js migrate:status --knexfile knexfile-hr.ts",
"db:seed:hr": "node --loader ts-node/esm ./node_modules/knex/bin/cli.js seed:run --knexfile knexfile-hr.ts",
"hr:setup": "pnpm run db:migrate:hr && pnpm run db:seed:hr"

# 6. Run the setup
pnpm run db:migrate:hr
```

## Troubleshooting

### Error: "column already exists"

**Cause**: Migration was partially run or you're running it again.

**Solution**:

1. Check if column really exists:
   ```sql
   \d inventory.drugs
   ```
2. If exists, rollback and fix migration:
   ```bash
   pnpm run db:migrate:inventory:rollback
   # Edit migration to check for existing column first
   pnpm run db:migrate:inventory
   ```

### Error: "schema does not exist"

**Cause**: Missing `afterCreate` hook in knexfile.

**Solution**: Add `afterCreate` hook to domain knexfile:

```typescript
pool: {
  min: 2,
  max: 10,
  afterCreate: (conn: unknown, done: (err?: Error) => void) => {
    (conn as { query: (sql: string, cb: (err?: Error) => void) => void })
      .query('CREATE SCHEMA IF NOT EXISTS inventory', (err?: Error) => {
        done(err);
      });
  },
}
```

### Error: "migration table not found"

**Cause**: Missing `schemaName` in migrations config.

**Solution**: Add `schemaName` to knexfile:

```typescript
migrations: {
  directory: './apps/api/src/database/migrations-inventory',
  tableName: 'knex_migrations_inventory',
  schemaName: 'inventory',  // ← MUST SET THIS
  extension: 'ts',
}
```

### Migrations Not Running

**Problem**: Running `pnpm run db:migrate` doesn't run inventory migrations.

**Solution**: Domain migrations must be run explicitly:

```bash
pnpm run db:migrate:inventory
```

## Best Practices Summary

1. **Always write rollback functions** - Every `up()` needs a corresponding `down()`
2. **Test before commit** - Run migrate, rollback, re-migrate, build
3. **Use correct knexfile** - Main system vs domain-specific
4. **Check for existing columns** - Use raw SQL, not `hasColumn()`
5. **Include console.log** - Helpful for debugging migrations
6. **Use withSchema() for domains** - Never forget schema prefix
7. **Reference public only** - Domains can only reference main system tables
8. **Document complex migrations** - Add comments for future developers
9. **Keep migrations small** - One logical change per migration
10. **Never edit applied migrations** - Create new migration instead

## Related Documentation

- Full guide: `docs/guides/infrastructure/domain-separated-migrations.md`
- Database architecture: `docs/architecture/database-architecture.md`
- Domain architecture: `docs/architecture/domain-architecture-guide.md`
