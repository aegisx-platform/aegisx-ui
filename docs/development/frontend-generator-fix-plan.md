# Frontend Generator Fix Plan - Add --with-export Flag

> **Created**: 2025-12-07
> **Status**: Ready for Implementation
> **Assignee**: Haiku Model
> **Estimated Time**: 2-3 hours

---

## 🎯 Objective

แก้ไข frontend generator ให้มี `--with-export` flag และปรับปรุง feature flag logic ให้ชัดเจน consistent

---

## 📋 Current Issues

### 1. **No `--with-export` Flag**

```bash
# Currently CAN'T do this:
./cli.js generate drugs --package enterprise --with-export  # ❌ Not supported

# Forced to use full package for export:
./cli.js generate drugs --package full  # ✅ But get everything
```

### 2. **Inconsistent Auto-Enhancement**

```javascript
// Current logic - Auto-enables without user request:
includeEnhanced: options.enhanced ||
  options.full ||
  apiInfo.hasEnhancedOps || // ⚠️ Auto-enables!
  dropdownDependencies.length > 0; // ⚠️ Auto-enables!
```

### 3. **Export Hard-coded to Full Package**

```javascript
// Current:
includeExport: options.full; // Only full package

// Want:
includeExport: options.full || options.withExport; // Flexible
```

---

## 🔧 Implementation Tasks

### **Task 1: Add `--with-export` CLI Flag**

**File**: `libs/aegisx-cli/bin/cli.js`

**Location**: หาบรรทัดที่มี `--with-import` (ใกล้ line 100-150)

**Add this option**:

```javascript
.option('--with-export', 'Include export functionality (CSV/Excel/PDF export)')
```

**Expected help output**:

```bash
./cli.js generate --help
# Should show:
#   --with-import    Include bulk import functionality (Excel/CSV upload)
#   --with-export    Include export functionality (CSV/Excel/PDF export)  # ← NEW
```

---

### **Task 2: Update Frontend Generator Context Logic**

**File**: `libs/aegisx-cli/lib/generators/frontend-generator.js`

#### **Change 1 - Service Generation (Line ~1863-1868)**

**Search for**:

```javascript
includeEnhanced:
  options.enhanced ||
  options.full ||
  apiInfo.hasEnhancedOps ||
  dropdownDependencies.length > 0,
```

**Replace with**:

```javascript
includeEnhanced:
  options.enhanced ||
  options.full ||
  (options.enterprise && apiInfo.hasEnhancedOps) ||  // Only auto-enable if enterprise
  dropdownDependencies.length > 0,
```

**Explanation**: Prevent auto-enhancement unless explicitly enterprise package

---

#### **Change 2 - List Component Generation (Line ~1979-1984)**

**Search for**:

```javascript
includeEnhanced:
  options.enhanced || options.full || apiInfo.hasEnhancedOps,
includeExport: options.full,
withImport: options.withImport || false,
withEvents: options.withEvents || false,
```

**Replace with**:

```javascript
includeEnhanced:
  options.enhanced ||
  options.full ||
  (options.enterprise && apiInfo.hasEnhancedOps),
includeExport: options.full || options.withExport || false,  // ← CHANGED
withImport: options.withImport || false,
withExport: options.withExport || false,  // ← NEW
withEvents: options.withEvents || false,
```

---

#### **Change 3 - Dialog Component Generation**

**Search for similar pattern in `generateDialogComponents` method**

If you find:

```javascript
includeEnhanced: options.enhanced || options.full || apiInfo.hasEnhancedOps,
```

Update to:

```javascript
includeEnhanced: options.enhanced || options.full || (options.enterprise && apiInfo.hasEnhancedOps),
includeExport: options.full || options.withExport || false,
```

---

### **Task 3: Update Service Template**

**File**: `libs/aegisx-cli/templates/frontend/v2/service.hbs`

**Search for all export-related code blocks wrapped in**:

```handlebars
{{#if includeEnhanced}}
  // Export methods
  export{{pascalCaseHelper singularName}}(options: ExportOptions): Observable<Blob> {
    ...
  }
{{/if}}
```

**Change ALL occurrences to**:

```handlebars
{{#if includeExport}}
  // Export methods
  export{{pascalCaseHelper singularName}}(options: ExportOptions): Observable<Blob> {
    ...
  }
{{/if}}
```

**How to find all locations**:

```bash
grep -n "{{#if includeEnhanced}}" libs/aegisx-cli/templates/frontend/v2/service.hbs
```

---

### **Task 4: Add Validation & Warnings**

**File**: `libs/aegisx-cli/lib/generators/frontend-generator.js`

**Location**: In main `generate()` method, near the beginning (after options parsing)

**Add this validation block**:

```javascript
/**
 * Main generate method for frontend module
 */
async generate(moduleName, options = {}) {
  try {
    console.log(`\n🚀 Starting frontend generation for: ${moduleName}`);
    console.log(`📊 Options:`, options);

    // ===== ADD THIS VALIDATION BLOCK HERE =====
    // Validate feature flag combinations
    if (options.withExport && !options.full && !options.enhanced) {
      console.warn('⚠️  Warning: --with-export works best with --package enterprise or --full');
      console.warn('   Export feature requires enhanced API endpoints.');
    }

    if (options.withImport && !options.full && !options.enhanced) {
      console.warn('⚠️  Warning: --with-import requires backend import endpoints.');
      console.warn('   Make sure your backend was generated with --with-import flag.');
    }
    // ===== END VALIDATION BLOCK =====

    const generatedFiles = [];

    // ... rest of the method
```

---

### **Task 5: Update CLI Help Text**

**File**: `libs/aegisx-cli/bin/cli.js`

**Find the generate command section** and update help text:

**Add examples after command definition**:

```javascript
generateCommand
  .option('-t, --target <type>', 'Generation target (backend, frontend)', 'backend')
  .option('-p, --package <type>', 'Feature package: standard, enterprise, full')
  .option('--with-import', 'Include bulk import functionality (Excel/CSV upload)')
  .option('--with-export', 'Include export functionality (CSV/Excel/PDF export)') // NEW
  .option('-e, --with-events', 'Include real-time events integration')
  .option('--force', 'Overwrite existing files')
  .addHelpText(
    'after',
    `

Examples:
  Generate standard frontend (CRUD only):
    $ aegisx generate users --target frontend --package standard

  Generate enterprise with import:
    $ aegisx generate users --target frontend --package enterprise --with-import

  Generate enterprise with export:
    $ aegisx generate users --target frontend --package enterprise --with-export

  Generate full package with all features:
    $ aegisx generate users --target frontend --package full --with-import --with-export

Feature Matrix:
  ┌─────────────┬──────────┬────────────┬──────┐
  │ Feature     │ Standard │ Enterprise │ Full │
  ├─────────────┼──────────┼────────────┼──────┤
  │ CRUD        │    ✅    │     ✅     │  ✅  │
  │ Bulk Ops    │    ❌    │     ✅     │  ✅  │
  │ Export      │    ❌    │  --with-export │  ✅  │
  │ Import      │    ❌    │  --with-import │  ✅* │
  │ Events      │ --with-events │ --with-events │ --with-events │
  └─────────────┴──────────┴────────────┴──────┘
  * = Can combine with --with-import for import dialog
`,
  );
```

---

## 🧪 Testing Checklist

Run these tests **in order** and verify results:

### **Test 1: Standard Package (No Export)**

```bash
cd /Users/sathitseethaphon/projects/aegisx-platform/aegisx-starter-1

rm -rf apps/web/src/app/features/inventory/modules/drugs

node libs/aegisx-cli/bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --package standard \
  --force \
  --domain inventory/master-data \
  --schema inventory
```

**Verify**:

```bash
# Should NOT have export code
grep -c "SharedExportComponent\|exportServiceAdapter" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts

# Expected output: 0
```

---

### **Test 2: Enterprise Package (No Export by Default)**

```bash
rm -rf apps/web/src/app/features/inventory/modules/drugs

node libs/aegisx-cli/bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --package enterprise \
  --force \
  --domain inventory/master-data \
  --schema inventory
```

**Verify**:

```bash
# Should NOT have export code
grep -c "SharedExportComponent\|exportServiceAdapter" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts

# Expected output: 0
```

---

### **Test 3: Enterprise + with-export (NEW - Most Important)**

```bash
rm -rf apps/web/src/app/features/inventory/modules/drugs

node libs/aegisx-cli/bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --package enterprise \
  --with-export \
  --force \
  --domain inventory/master-data \
  --schema inventory
```

**Verify**:

```bash
# SHOULD have export code
grep -c "SharedExportComponent" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts

# Expected output: 2 (import and component usage)

grep -c "exportServiceAdapter" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts

# Expected output: 1

grep -c "app-export" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.html

# Expected output: 1
```

---

### **Test 4: Full Package (Has Export by Default)**

```bash
rm -rf apps/web/src/app/features/inventory/modules/drugs

node libs/aegisx-cli/bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --package full \
  --force \
  --domain inventory/master-data \
  --schema inventory
```

**Verify**:

```bash
# SHOULD have export code
grep -c "SharedExportComponent\|exportServiceAdapter" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts

# Expected output: 3 (import, component, adapter)
```

---

### **Test 5: Full + with-import + with-export (All Features)**

```bash
rm -rf apps/web/src/app/features/inventory/modules/drugs

node libs/aegisx-cli/bin/cli.js generate drugs \
  --target frontend \
  --shell inventory \
  --section master-data \
  --package full \
  --with-import \
  --with-export \
  --force \
  --domain inventory/master-data \
  --schema inventory
```

**Verify**:

```bash
# Should have BOTH import and export
ls -la apps/web/src/app/features/inventory/modules/drugs/components/ | grep -E "import|export"

# Expected: drugs-import.dialog.ts exists
# AND export code in list component

grep -c "ImportDialogComponent" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts
# Expected: > 0

grep -c "SharedExportComponent" \
  apps/web/src/app/features/inventory/modules/drugs/components/drugs-list.component.ts
# Expected: > 0
```

---

### **Test 6: Build Verification (Critical)**

```bash
pnpm run build
```

**Expected output**:

```
NX   Successfully ran target build for 5 projects
```

**If build fails**, check errors:

```bash
pnpm run build 2>&1 | grep -E "Error:|TS\d+:"
```

---

## ✅ Success Criteria

After all tests pass, verify:

- [ ] `--with-export` flag appears in help text
- [ ] Enterprise + `--with-export` generates export code
- [ ] Standard package has NO export code
- [ ] Full package has export code by default
- [ ] Build passes without errors
- [ ] All 5 test cases verified
- [ ] Import path correct: `../../../../../shared/components/shared-export/shared-export.component`
- [ ] Export types imported: `ExportOptions`, `ExportService`, `SharedExportComponent`

---

## 📁 Files Modified Summary

| File                                                   | Line Numbers          | Changes                                    | Status     |
| ------------------------------------------------------ | --------------------- | ------------------------------------------ | ---------- |
| `libs/aegisx-cli/bin/cli.js`                           | ~100-150              | Add `--with-export` option + help text     | ⏳ Pending |
| `libs/aegisx-cli/lib/generators/frontend-generator.js` | ~1863-1868            | Fix auto-enhancement logic                 | ⏳ Pending |
| `libs/aegisx-cli/lib/generators/frontend-generator.js` | ~1979-1984            | Add `includeExport` + `withExport`         | ⏳ Pending |
| `libs/aegisx-cli/lib/generators/frontend-generator.js` | Start of `generate()` | Add validation warnings                    | ⏳ Pending |
| `libs/aegisx-cli/templates/frontend/v2/service.hbs`    | Multiple              | Change `includeEnhanced` → `includeExport` | ⏳ Pending |

---

## 🎯 Expected Outcome

### New Feature Matrix

| Package        | Default Features                  | Available Flags                                   |
| -------------- | --------------------------------- | ------------------------------------------------- |
| **standard**   | CRUD only                         | `--with-events`                                   |
| **enterprise** | CRUD + Bulk ops                   | `--with-import`, `--with-export`, `--with-events` |
| **full**       | CRUD + Bulk + Validation + Export | `--with-import`, `--with-events`                  |

### Command Examples

```bash
# Basic CRUD
./cli.js generate users --package standard

# Enterprise with import
./cli.js generate users --package enterprise --with-import

# Enterprise with export (NEW)
./cli.js generate users --package enterprise --with-export

# Enterprise with both (NEW)
./cli.js generate users --package enterprise --with-import --with-export

# Full package (all features)
./cli.js generate users --package full --with-import
```

---

## 🚨 Important Notes

1. **Import Path**: Export component located at:

   ```
   apps/web/src/app/shared/components/shared-export/shared-export.component.ts
   ```

   Relative path from list component: `../../../../../shared/components/shared-export/`

2. **Template Version**: Currently using v2 templates (`templates/frontend/v2/`)

3. **Build Must Pass**: After changes, always run `pnpm run build` to verify

4. **Backup Before Changes**:
   ```bash
   git status  # Check current state
   git stash   # Backup if needed
   ```

---

## 📞 Support

If issues arise during implementation:

1. Check file exists:

   ```bash
   ls -la apps/web/src/app/shared/components/shared-export/
   ```

2. Verify template version:

   ```bash
   ls -la libs/aegisx-cli/templates/frontend/
   ```

3. Check current generator logic:
   ```bash
   grep -n "includeExport" libs/aegisx-cli/lib/generators/frontend-generator.js
   ```

---

**Ready for Implementation** ✅

Created: 2025-12-07
Last Updated: 2025-12-07
Version: 1.0
