# Code Cleanup Guide (Task 8.6)

## Overview

This guide provides step-by-step instructions for **removing old code** after successful migration to layer-based architecture, completing the final cleanup phase.

**What This Does:**

- Deletes old module directories (`apps/api/src/core/*`, `apps/api/src/modules/*`)
- Removes route aliasing infrastructure
- Cleans up plugin loader legacy code
- Updates all remaining references

**Prerequisites:**

- ✅ Task 8.5 completed (old routes disabled for 7+ days)
- ✅ System stable (no errors, no rollbacks)
- ✅ All clients migrated to new routes (<1% 404 rate)

---

## Pre-Cleanup Analysis

### Old Directories to Remove

**apps/api/src/core/** (18 directories)

```
apps/api/src/core/api-keys/           → Migrated to layers/platform/api-keys (via import plugin)
apps/api/src/core/attachments/        → Migrated to layers/platform/attachments
apps/api/src/core/departments/        → Migrated to layers/platform/departments
apps/api/src/core/email/              → Keep (not migrated, standalone utility)
apps/api/src/core/error-logs/         → Migrated to layers/core/audit/error-logs
apps/api/src/core/errors/             → Keep (shared error types, not a module)
apps/api/src/core/file-upload/        → Migrated to layers/platform/file-upload
apps/api/src/core/import/             → Migrated to layers/platform/import
apps/api/src/core/monitoring/         → Migrated to layers/core/monitoring
apps/api/src/core/navigation/         → Migrated to layers/platform/navigation
apps/api/src/core/pdf-export/         → Migrated to layers/platform/pdf-export
apps/api/src/core/pdf-templates/      → Part of pdf-export (safe to remove)
apps/api/src/core/rbac/               → Migrated to layers/platform/rbac
apps/api/src/core/settings/           → Migrated to layers/platform/settings
apps/api/src/core/system/             → Keep (contains default.plugin for root route)
apps/api/src/core/user-profile/       → Migrated to layers/platform/users
apps/api/src/core/users/              → Migrated to layers/platform/users
```

**apps/api/src/modules/** (4 directories)

```
apps/api/src/modules/admin/           → Migrated to layers/domains/admin
apps/api/src/modules/inventory/       → Migrated to layers/domains/inventory
apps/api/src/modules/testProducts/    → Migrated to layers/domains/testProducts
apps/api/src/modules/users/           → Duplicate of core/users (safe to remove)
```

### Files with Old References

**Found 7 files with imports from old locations:**

1. **apps/api/src/types/fastify.d.ts**
   - `import { ErrorQueueService } from '../core/monitoring/services/error-queue.service'`
   - `import { PermissionCacheService } from '../core/rbac/services/permission-cache.service'`
   - `import { ImportDiscoveryService } from '../core/import/discovery/import-discovery.service'`

2. **apps/api/src/bootstrap/index.ts**
   - `import { WelcomeResponseSchema } from '../core/system/default.schemas'`

3. **apps/api/src/plugins/monitoring.plugin.ts**
   - `import { createErrorQueueService } from '../core/monitoring/services/error-queue.service'`
   - `import { ErrorQueueService } from '../core/monitoring/services/error-queue.service'`

4. **apps/api/src/test-helpers/app-helper.ts**
   - `// import userProfilePlugin from '../core/user-profile/user-profile.plugin';` (commented)

### Route Aliasing Files to Remove

```
apps/api/src/config/route-aliases.ts         (320 lines)
```

---

## Cleanup Steps

### Phase 1: Fix Import References (CRITICAL)

Before deleting any code, update all imports to point to new locations.

#### Step 1.1: Update fastify.d.ts Type Declarations

**File:** `apps/api/src/types/fastify.d.ts`

```typescript
// OLD (remove these lines)
import { ErrorQueueService } from '../core/monitoring/services/error-queue.service';
import { PermissionCacheService } from '../core/rbac/services/permission-cache.service';
import { ImportDiscoveryService } from '../core/import/discovery/import-discovery.service';

// NEW (add these lines)
import { ErrorQueueService } from '../layers/core/monitoring/services/error-queue.service';
import { PermissionCacheService } from '../layers/platform/rbac/services/permission-cache.service';
import { ImportDiscoveryService } from '../layers/platform/import/discovery/import-discovery.service';
```

#### Step 1.2: Update bootstrap/index.ts

**File:** `apps/api/src/bootstrap/index.ts`

```typescript
// OLD
import { WelcomeResponseSchema } from '../core/system/default.schemas';

// NEW
import { WelcomeResponseSchema } from '../core/system/default.schemas'; // Keep as-is (core/system not migrated)
// OR create new welcome route in layers/platform if needed
```

**Decision:** Keep `apps/api/src/core/system/` for now (contains default welcome route)

#### Step 1.3: Update monitoring.plugin.ts

**File:** `apps/api/src/plugins/monitoring.plugin.ts`

```typescript
// OLD
import { createErrorQueueService } from '../core/monitoring/services/error-queue.service';
import { ErrorQueueService } from '../core/monitoring/services/error-queue.service';

// NEW
import { createErrorQueueService } from '../layers/core/monitoring/services/error-queue.service';
import { ErrorQueueService } from '../layers/core/monitoring/services/error-queue.service';
```

#### Step 1.4: Clean up test-helpers/app-helper.ts

**File:** `apps/api/src/test-helpers/app-helper.ts`

```typescript
// Remove commented line
// import userProfilePlugin from '../core/user-profile/user-profile.plugin';
```

#### Step 1.5: Verify No More Old References

```bash
# Check for any remaining imports from old locations
grep -r "from.*'\.\.\/core\/" apps/api/src --include="*.ts" | grep -v "layers/core" | grep -v "core/errors" | grep -v "core/email" | grep -v "core/system"

# Expected: No results (or only core/errors, core/email, core/system which we keep)

grep -r "from.*'\.\.\/modules\/" apps/api/src --include="*.ts"

# Expected: No results
```

### Phase 2: Test After Import Fixes

```bash
# Build must pass before proceeding
pnpm run build

# Expected: Build succeeds with 0 errors related to missing imports

# Run tests
pnpm test

# Expected: Tests pass (or same failure rate as before cleanup)
```

**STOP HERE if build fails! Fix all import errors before proceeding.**

---

### Phase 3: Remove Old Module Directories

**⚠️ WARNING: This step is irreversible (without git restore)**

#### Step 3.1: Backup Current State

```bash
# Create git commit before deletion
git add .
git commit -m "fix: update imports to layers/ before cleanup

- Updated fastify.d.ts type declarations
- Updated monitoring.plugin.ts imports
- Updated bootstrap/index.ts imports
- Removed commented imports from app-helper.ts

Preparing for Task 8.6: old code cleanup"

# Tag this commit for easy rollback
git tag pre-cleanup-8.6
```

#### Step 3.2: Remove Old Core Modules (Migrated)

```bash
# Remove migrated core modules
rm -rf apps/api/src/core/api-keys
rm -rf apps/api/src/core/attachments
rm -rf apps/api/src/core/departments
rm -rf apps/api/src/core/error-logs
rm -rf apps/api/src/core/file-upload
rm -rf apps/api/src/core/import
rm -rf apps/api/src/core/monitoring
rm -rf apps/api/src/core/navigation
rm -rf apps/api/src/core/pdf-export
rm -rf apps/api/src/core/pdf-templates
rm -rf apps/api/src/core/rbac
rm -rf apps/api/src/core/settings
rm -rf apps/api/src/core/user-profile
rm -rf apps/api/src/core/users

echo "✅ Removed 14 old core modules"
```

**Keep:**

- `apps/api/src/core/errors/` (shared error types)
- `apps/api/src/core/email/` (standalone utility)
- `apps/api/src/core/system/` (default welcome route)

#### Step 3.3: Remove Old Modules Directory

```bash
# Remove entire old modules directory
rm -rf apps/api/src/modules

echo "✅ Removed old modules directory (admin, inventory, testProducts, users)"
```

#### Step 3.4: Verify Deletion

```bash
# Check old directories no longer exist
ls apps/api/src/core/users 2>&1
# Expected: No such file or directory

ls apps/api/src/modules 2>&1
# Expected: No such file or directory

# Count remaining core subdirectories (should be 3: errors, email, system)
find apps/api/src/core -maxdepth 1 -type d | wc -l
# Expected: 4 (including core/ itself, so 3 subdirectories)
```

---

### Phase 4: Remove Route Aliasing Infrastructure

#### Step 4.1: Remove Route Aliases Plugin

```bash
# Remove route aliasing plugin (no longer needed)
rm apps/api/src/config/route-aliases.ts

echo "✅ Removed route-aliases.ts (320 lines)"
```

#### Step 4.2: Remove Import from Plugin Loader

**File:** `apps/api/src/bootstrap/plugin.loader.ts`

```typescript
// Remove this import
import { routeAliasPlugin } from '../config/route-aliases';
```

```bash
# Use sed to remove the import line
sed -i.bak "/import.*route-aliases/d" apps/api/src/bootstrap/plugin.loader.ts
rm apps/api/src/bootstrap/plugin.loader.ts.bak

echo "✅ Removed route-aliases import from plugin loader"
```

#### Step 4.3: Remove Route Alias Plugin Registration

**File:** `apps/api/src/bootstrap/plugin.loader.ts`

Find and remove:

```typescript
{
  name: 'route-alias',
  plugin: routeAliasPlugin,
  required: false,
  // Note: This plugin is conditionally loaded based on enableNewRoutes flag
  // It will skip registration if new routes are not enabled
  // Dependencies: Must load after logging-plugin for fastify.log availability
  // Must load before feature routes to establish alias mappings
},
```

#### Step 4.4: Verify Plugin Loader Cleanup

```bash
# Check route-alias no longer referenced
grep -i "route.*alias" apps/api/src/bootstrap/plugin.loader.ts

# Expected: No results

# Check build still passes
pnpm run build
```

---

### Phase 5: Clean Up Documentation References

#### Step 5.1: Update Migration Guide Status

**File:** `docs/architecture/api-standards/06-migration-guide.md`

Add completion banner:

```markdown
# ✅ MIGRATION COMPLETE (2025-12-XX)

This migration has been successfully completed. All modules have been migrated
to the layer-based architecture (Core/Platform/Domains).

**Final State:**

- Old routes: Removed (return 404)
- New routes: /api/v1/{layer}/{resource}
- Migration artifacts: Archived

For historical reference only.
```

#### Step 5.2: Update Architecture Documentation

**File:** `docs/architecture/api-standards/02-architecture-specification.md`

Add completion note:

```markdown
## Migration Status

✅ **Completed:** 2025-12-XX

All modules successfully migrated to layer-based architecture:

- Core layer: 3 modules (auth, monitoring, audit)
- Platform layer: 9 modules (users, rbac, departments, settings, navigation, file-upload, attachments, pdf-export, import)
- Domains layer: 2 domains (inventory, admin)

Old code removed: Task 8.6
```

#### Step 5.3: Archive Migration Guides

Move migration guides to archive section:

```bash
# Create archive directory
mkdir -p docs/archive/api-migration-2025

# Move migration-specific docs (keep architecture specs)
mv docs/architecture/api-standards/06-migration-guide.md \
   docs/archive/api-migration-2025/

mv docs/architecture/api-standards/07-migration-patterns.md \
   docs/archive/api-migration-2025/

mv docs/architecture/api-standards/08-plugin-migration-guide.md \
   docs/archive/api-migration-2025/

mv docs/architecture/api-standards/09-old-routes-cutover-guide.md \
   docs/archive/api-migration-2025/

mv docs/architecture/api-standards/09a-old-routes-cutover-testing.md \
   docs/archive/api-migration-2025/

mv docs/architecture/api-standards/10-code-cleanup-guide.md \
   docs/archive/api-migration-2025/

echo "✅ Archived migration guides"
```

**Keep (Active Documentation):**

- `01-requirements-specification.md`
- `02-architecture-specification.md`
- `03-plugin-pattern-specification.md`
- `04-url-routing-specification.md`
- `05-crud-generator-specification.md`

---

### Phase 6: Final Verification

#### Step 6.1: Build Verification

```bash
# Clean build
pnpm run build

# Expected: Build succeeds with no errors
```

#### Step 6.2: Test Suite Verification

```bash
# Run full test suite
pnpm test

# Expected: Pass rate same or better than before cleanup
```

#### Step 6.3: Code Size Reduction

```bash
# Count lines removed
echo "Old core modules:"
find apps/api/src/core -name "*.ts" 2>/dev/null | xargs wc -l | tail -1

echo "Route aliases plugin:"
echo "320 lines (removed)"

# Expected: Thousands of lines removed
```

#### Step 6.4: Import Verification

```bash
# Verify no broken imports
grep -r "from.*'\.\.\/core/" apps/api/src --include="*.ts" | grep -v "layers/core" | grep -v "core/errors" | grep -v "core/email" | grep -v "core/system"

# Expected: No results (only kept directories remain)

grep -r "from.*'\.\.\/modules/" apps/api/src --include="*.ts"

# Expected: No results
```

#### Step 6.5: Git Status Check

```bash
# Check deleted files
git status

# Expected: Many deleted files shown
# Example:
# deleted:    apps/api/src/core/users/
# deleted:    apps/api/src/modules/
# deleted:    apps/api/src/config/route-aliases.ts
```

---

### Phase 7: Commit Cleanup

#### Step 7.1: Create Cleanup Commit

```bash
git add -A

git commit -m "feat(cleanup): remove old code after successful migration (Task 8.6)

BREAKING CHANGE: Old module locations no longer available

Removed:
- 14 old core modules (migrated to layers/platform and layers/core)
- 4 old modules directories (migrated to layers/domains)
- Route aliasing plugin (no longer needed after cutover)
- Migration-specific documentation (archived)

Kept:
- core/errors (shared error types)
- core/email (standalone utility)
- core/system (default welcome route)

Migration complete. All modules now in layer-based architecture:
- Core: apps/api/src/layers/core
- Platform: apps/api/src/layers/platform
- Domains: apps/api/src/layers/domains

Task: api-architecture-standardization/8.6"
```

#### Step 7.2: Tag Release

```bash
# Tag completion of migration
git tag migration-complete-v1.0
git tag task-8.6-complete

# Push to remote
git push origin develop
git push origin --tags
```

---

## Rollback Procedure

If issues discovered after cleanup:

### Emergency Rollback (30 seconds)

```bash
# Restore from pre-cleanup tag
git checkout pre-cleanup-8.6

# Or restore specific directories
git checkout HEAD~1 -- apps/api/src/core/users
git checkout HEAD~1 -- apps/api/src/modules
git checkout HEAD~1 -- apps/api/src/config/route-aliases.ts

# Rebuild
pnpm run build
```

### Selective Restore

```bash
# Restore only specific module (if needed)
git checkout HEAD~1 -- apps/api/src/core/users

# Rebuild
pnpm run build
```

---

## Success Criteria

### Immediate Success

- ✅ All imports updated (no broken references)
- ✅ Build passes with 0 errors
- ✅ Tests pass (same or better rate)
- ✅ Old directories removed (14 core modules, 4 domain modules)
- ✅ Route aliases plugin removed (320 lines)
- ✅ Git commit created with clear message

### Long-Term Success

- ✅ System runs normally for 7 days
- ✅ No errors related to missing modules
- ✅ Codebase cleaner (thousands of lines removed)
- ✅ Documentation updated
- ✅ Migration guides archived

---

## Files Deleted Summary

### Core Modules (14 directories)

```
apps/api/src/core/api-keys/
apps/api/src/core/attachments/
apps/api/src/core/departments/
apps/api/src/core/error-logs/
apps/api/src/core/file-upload/
apps/api/src/core/import/
apps/api/src/core/monitoring/
apps/api/src/core/navigation/
apps/api/src/core/pdf-export/
apps/api/src/core/pdf-templates/
apps/api/src/core/rbac/
apps/api/src/core/settings/
apps/api/src/core/user-profile/
apps/api/src/core/users/
```

### Domain Modules (1 directory, 4 subdirectories)

```
apps/api/src/modules/
apps/api/src/modules/admin/
apps/api/src/modules/inventory/
apps/api/src/modules/testProducts/
apps/api/src/modules/users/
```

### Infrastructure Files (1 file)

```
apps/api/src/config/route-aliases.ts (320 lines)
```

### Documentation Archived (6 files)

```
docs/architecture/api-standards/06-migration-guide.md
docs/architecture/api-standards/07-migration-patterns.md
docs/architecture/api-standards/08-plugin-migration-guide.md
docs/architecture/api-standards/09-old-routes-cutover-guide.md
docs/architecture/api-standards/09a-old-routes-cutover-testing.md
docs/architecture/api-standards/10-code-cleanup-guide.md
```

**Total Reduction:** ~10,000+ lines of code (estimated)

---

## Next Steps

After successful cleanup:

**Task 8.7: Archive Migration Artifacts**

- Archive migration logs and metrics
- Document lessons learned
- Create migration case study
- Update project documentation

---

## Reference

- Task 8.5: Old routes cutover guide
- Task 8.6: Code cleanup (this document)
- Architecture Specification: `docs/architecture/api-standards/02-architecture-specification.md`
- Layer Structure: `apps/api/src/layers/{core,platform,domains}/`

---

**Document Version:** 1.0
**Created:** 2025-12-15
**Task:** 8.6 - Remove old code and route aliasing
**Status:** Ready for execution
