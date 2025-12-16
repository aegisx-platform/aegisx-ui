# Documentation Organization Recommendations

This document provides analysis and recommendations for the remaining documentation directories reviewed during the Q1 2025 cleanup.

---

## 1. docs/apps/ - RETAIN (ACTIVELY USED)

### Status: Keep in current location

**Total Size:** 2,165 lines across 6 files
**Recommendation:** NO CHANGES - This directory is actively referenced and contains crucial application documentation.

### Contents:

```
apps/
├── admin/
│   ├── README.md (148 lines)          - AegisX Admin application overview
│   └── architecture.md (521 lines)    - Angular architecture patterns
└── inventory/
    ├── README.md (131 lines)          - Inventory module overview
    ├── 01-database-architecture.md (402 lines)
    ├── 02-migration-standards.md (434 lines)
    └── 03-seed-system.md (529 lines)
```

### Why Keep:

- ✅ Referenced in CLAUDE.md quick start commands
- ✅ Part of Diátaxis Framework (Getting Started section)
- ✅ Active development guide for feature teams
- ✅ Domain-specific architecture documentation
- ✅ Database and migration standards (critical for developers)

### Suggested Next Steps:

- Consider adding to VitePress sidebar navigation in `.vitepress/config.ts`
- Link from main `/docs/index.md` under "Getting Started" section
- Add cross-references from `/docs/architecture/` to these domain-specific docs

---

## 2. docs/business/ - RECOMMENDED MOVE TO reference/

### Status: 3 files with strategic content

**Total Size:** ~50KB

### Contents:

```
business/
├── business-strategy.md               - Open Core business model (23KB)
├── license-system-roadmap.md          - License system phases (8KB)
└── license-system-spec.md             - Technical license spec (20KB)
```

### Analysis:

- ✅ **Strategic Value:** Excellent documentation of business model
- ✅ **Technical Content:** License system spec is technical reference
- ❌ **Wrong Location:** Under "business/" but contains technical specifications

### Recommended Organization:

**Option A (Recommended): Split by content type**

1. **Move to `/docs/reference/business-model/`:**
   - `business-strategy.md` - Business model overview
   - Purpose: Reference for stakeholders, partners, developers understanding monetization

2. **Move to `/docs/reference/licensing/`:**
   - `license-system-spec.md` - Technical specification
   - `license-system-roadmap.md` - Implementation roadmap
   - Purpose: Technical reference for license validation implementation

**Option B: Keep together under `/docs/reference/business/`**

- All files together if you want unified business documentation
- Less granular but simpler structure

### Why Reorganize:

- ✅ Follows Diátaxis Framework (Reference section)
- ✅ Makes technical specs easier to find
- ✅ Separates strategic docs (business-strategy) from technical specs
- ✅ Aligns with project structure where licensing is a technical implementation detail

---

## 3. docs/rbac/ - RECOMMENDED MOVE TO features/ OR reference/

### Status: 3 audit and testing documents

**Total Size:** ~36KB

### Contents:

```
rbac/
├── permission-mapping-fix-summary.md      - Implementation complete ✅
├── rbac-migration-audit.md                - Audit findings (migration strategy)
└── rbac-ux-testing-report.md              - UX testing results with critical findings
```

### Analysis of Each File:

#### permission-mapping-fix-summary.md (12KB)

- **Status:** ✅ COMPLETED - Permission naming fix applied
- **Content:** Summary of 35 permission updates across 6 files
- **Type:** Implementation completion report
- **Recommendation:** ARCHIVE to `docs/archive/2025-Q1-cleanup/` (COMPLETED work)

#### rbac-migration-audit.md (11KB)

- **Status:** ✅ COMPLETED - Audit done (2025-10-28)
- **Content:** Detailed audit of 42 authorization instances across 4 modules
- **Type:** Architectural audit report
- **Recommendation:** Move to `/docs/reference/rbac/` as technical reference
- **Reason:** Provides comprehensive mapping of RBAC implementation and permission architecture

#### rbac-ux-testing-report.md (13KB)

- **Status:** ✅ COMPLETED - All findings resolved (permission naming mismatch fixed)
- **Content:** UX testing results and validation of permission implementation
- **Type:** QA/Testing report
- **Recommendation:** Move to `/docs/archive/` or keep in `/docs/reference/rbac/`
- **Reason:** Completed testing cycle; useful for understanding RBAC validation approach

### Recommended Organization:

```
/docs/reference/rbac/
├── README.md                              - RBAC overview and quick links
├── rbac-migration-audit.md                - Comprehensive permission mapping
├── rbac-ux-testing-report.md              - Testing validation results
└── permission-mapping-fix-summary.md      - Implementation detail (optional)
```

**Or move completed items to archive:**

```
/docs/archive/2025-Q1-cleanup/rbac/
├── permission-mapping-fix-summary.md      - Completed implementation
└── rbac-ux-testing-report.md              - Completed testing
```

### Why Reorganize:

- ✅ `rbac-migration-audit.md` provides architectural reference value
- ✅ Completed work should move to archive or reference (not active guides)
- ✅ RBAC is a platform feature, belongs in features/ or reference/
- ✅ Currently orphaned at root level of docs/

---

## 4. docs/sessions/ - PARTIALLY CLEANED

### Status: Cleaned partially

**Current Contents:** Only `.current/system-init-refactor.log` exists

### Action Taken:

- ✅ Moved `.current/system-init-refactor.log` to `/docs/archive/2025-Q1-cleanup/session-logs/`

### Recommendation for remaining sessions/:

- If `/docs/sessions/` is empty or only contains logs: Can be removed or repurposed
- If you plan to use for active session tracking: Create `.sessions/README.md` explaining its purpose
- Suggested purpose: "Active development session notes and logs" (only current work)

---

## 5. Summary of Completed Actions

### Files Archived:

```
✅ docs/fixes/                          → docs/archive/2025-Q1-cleanup/fixes/
   - form-field-overlap-fix.md
   - login-form-css-fix.md

✅ docs/specs/ (inventory spec)         → docs/archive/2025-Q1-cleanup/specs/
   - inventory-routes-refactoring.md

✅ docs/progress.md                      → docs/archive/2025-Q1-cleanup/
   - Replaced by PROJECT_STATUS.md

✅ docs/sessions/.current/               → docs/archive/2025-Q1-cleanup/session-logs/
   - system-init-refactor.log
```

### Files Moved:

```
✅ docs/ssl-tls-setup.md                 → docs/guides/infrastructure/security/
   - Enhanced discoverability under security context

✅ docs/websocket-system.md              → docs/guides/development/
   - Moved to active development guides
```

### Files NOT Moved (By Design):

```
✅ docs/apps/                            - RETAINED (actively used)
   - Contains crucial application documentation
   - Referenced in project standards

⏳ docs/business/                        - AWAITING DECISION
   - Recommendation: Move to docs/reference/
   - Contains strategic and technical specs

⏳ docs/rbac/                            - AWAITING DECISION
   - Recommendation: Move completed items to archive
   - Keep architectural audit as reference

⏳ docs/sessions/                        - PARTIALLY CLEANED
   - Recommendation: Define purpose or remove if empty
```

---

## 6. Next Steps

### Priority 1 - Quick Wins:

1. ✅ Archive cleanup (DONE)
2. Create `/docs/reference/rbac/` and move audit file
3. Update main docs index to link to business documentation

### Priority 2 - Structural:

1. Move `docs/business/` to `docs/reference/business-model/` and `docs/reference/licensing/`
2. Create README files in each new reference subdirectory
3. Update sidebar navigation in `.vitepress/config.ts`

### Priority 3 - Documentation:

1. Add cross-references from CLAUDE.md to new locations
2. Update docs/index.md with new structure
3. Add "see also" sections linking related documentation

---

## Recommendations Summary Table

| Directory          | Status            | Recommendation                            | Priority |
| ------------------ | ----------------- | ----------------------------------------- | -------- |
| `docs/fixes/`      | Archived          | Keep archived - resolved issues           | Done     |
| `docs/specs/`      | Archived          | Keep archived - completed work            | Done     |
| `docs/progress.md` | Archived          | Keep archived - superseded                | Done     |
| `docs/sessions/`   | Partially cleaned | Define purpose or remove                  | Medium   |
| `docs/apps/`       | Active            | NO CHANGES - Keep as is                   | Done     |
| `docs/business/`   | Retained          | Move to reference/                        | Medium   |
| `docs/rbac/`       | Retained          | Move audit to reference/, archive testing | Medium   |

---

## Notes

- All recommended moves maintain backward compatibility through proper folder structure
- Cross-references should be updated to prevent broken links
- VitePress sidebar will need updates for new locations
- Consider adding a `MIGRATION_GUIDE.md` if moving many files users might reference
