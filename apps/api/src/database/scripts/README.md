# Database Utility Scripts

This directory contains utility scripts for database operations, auditing, and data management.

## Available Scripts

### audit-department-permissions.ts

**Purpose:** Pre-migration audit script for analyzing department permissions before RBAC consolidation.

**Part of:** RBAC Permission Consolidation (Spec: `.spec-workflow/specs/auth-rbac-improvements/`)

**Description:**
Analyzes the `user_departments` table to identify:

- Total user-department records and active assignments
- Permission flag usage statistics
- Users with department permissions but NO RBAC roles (at risk of losing access)
- Provides actionable recommendations for migration

**Usage:**

```bash
# Run audit (console output only)
npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts

# Run audit with JSON export
npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --export

# Show help
npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --help
```

**Output:**

- Console: Formatted report with statistics, at-risk users, and recommendations
- JSON export (optional): `/tmp/department-permissions-audit.json`

**Read-only:** This script does NOT modify any data.

**Permission Mapping Reference:**

```
Department Flag           → RBAC Permission
─────────────────────────────────────────────
can_create_requests       → budget-requests:create
can_edit_requests         → budget-requests:update
can_submit_requests       → budget-requests:submit
can_approve_requests      → budget-requests:approve
can_view_reports          → reports:view
```

---

### inventory-import-tmt.ts

**Purpose:** Import Thai Medical Terminology (TMT) data into inventory schema.

**Usage:**

```bash
pnpm run inventory:import-tmt -- --path=/path/to/tmt-data
```

**Status:** Placeholder - implementation pending TMT data format finalization.

---

## Adding New Scripts

When creating new database scripts:

1. **Follow existing patterns:**
   - Use the same database connection pattern (see existing scripts)
   - Load environment with dotenv
   - Include detailed JSDoc comments

2. **Make scripts executable:**

   ```typescript
   npx ts-node apps/api/src/database/scripts/your-script.ts
   ```

3. **Include help text:**
   - Add `--help` flag support
   - Document all command-line options
   - Provide usage examples

4. **Error handling:**
   - Always use try/catch blocks
   - Provide clear error messages
   - Clean up database connections (use `finally` block)

5. **Document in this README:**
   - Purpose and context
   - Usage instructions
   - Expected inputs/outputs
   - Read-only vs. data-modifying operations
