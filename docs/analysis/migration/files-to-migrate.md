---
title: 'Files to Migrate'
description: 'Inventory of files requiring migration'
category: analysis
tags: [analysis, migration]
---

# Files to Migrate - Knex to Drizzle ORM

Complete file inventory for migration effort estimation.

## Priority 2: Complex Domain Repositories (HIGH COMPLEXITY)

### RBAC System (2 files, ~900 lines)

| File                                        | Lines | Complexity | Challenges                                          |
| ------------------------------------------- | ----- | ---------- | --------------------------------------------------- |
| `apps/api/src/core/rbac/rbac.repository.ts` | 852   | VERY HIGH  | Subquery joins, aggregates, user counts, statistics |
| `apps/api/src/core/rbac/rbac.service.ts`    | 50+   | MEDIUM     | Calls repository methods                            |

**Specific Patterns Found:**

- Subquery with COUNT and grouping
- Multi-table joins with conditions
- Bulk operations (updateMany, deleteMany)
- Transaction-based role creation
- Statistics aggregation with FILTER clause
- Parent-child role hierarchy

**Effort:** 18-22 hours
**Dependencies:** Depends on BaseRepository
**Test Coverage:** Integration tests for complex joins
**Validation:** Verify role counts, permission loading, statistics accuracy

### User Management (2 files, ~200 lines)

| File                                          | Lines | Complexity | Details                                |
| --------------------------------------------- | ----- | ---------- | -------------------------------------- |
| `apps/api/src/core/users/users.repository.ts` | 150+  | HIGH       | Multi-table joins, soft delete filters |
| `apps/api/src/core/users/users.service.ts`    | 50+   | MEDIUM     | User operations                        |

**Specific Patterns:**

- Double join (users → user_roles → roles)
- Soft delete with whereNull
- Multiple filter conditions
- Role association loading

**Effort:** 12-15 hours
**Dependencies:** Depends on BaseRepository
**Test Coverage:** Role association tests, soft delete scenarios

## Priority 4: Audit & Logging (MEDIUM)

### Error Logging (2 files, ~150 lines)

| File                                                    | Lines | Complexity | Details           |
| ------------------------------------------------------- | ----- | ---------- | ----------------- |
| `apps/api/src/core/error-logs/error-logs.repository.ts` | 80+   | MEDIUM     | Error log queries |
| `apps/api/src/core/error-logs/error-logs.service.ts`    | 70+   | MEDIUM     | Error handling    |

**Patterns:**

- Structured error logging
- Error aggregation
- Filtering by error type

**Effort:** 8-10 hours

### File Audit (2 files, ~150 lines)

| File                                                                 | Lines | Complexity | Details         |
| -------------------------------------------------------------------- | ----- | ---------- | --------------- |
| `apps/api/src/core/audit-system/file-audit/file-audit.repository.ts` | 80+   | MEDIUM     | File audit logs |
| `apps/api/src/core/audit-system/file-audit/file-audit.service.ts`    | 70+   | MEDIUM     | File tracking   |

**Effort:** 8-10 hours

### Login Attempts (2 files, ~150 lines)

| File                                                                         | Lines | Complexity | Details             |
| ---------------------------------------------------------------------------- | ----- | ---------- | ------------------- |
| `apps/api/src/core/audit-system/login-attempts/login-attempts.repository.ts` | 80+   | MEDIUM     | Login tracking      |
| `apps/api/src/core/audit-system/login-attempts/login-attempts.service.ts`    | 70+   | MEDIUM     | Security monitoring |

**Effort:** 8-10 hours

## Priority 6: Specialized Features (LOW-MEDIUM)

### PDF Templates (2 files, ~150 lines)

| File                                                                   | Lines | Complexity | Details             |
| ---------------------------------------------------------------------- | ----- | ---------- | ------------------- |
| `apps/api/src/core/pdf-export/repositories/pdf-template.repository.ts` | 80+   | LOW        | Template CRUD       |
| `apps/api/src/services/pdf-template.service.ts`                        | 70+   | LOW        | Template management |

**Effort:** 6-8 hours

### API Keys (2 files, ~150 lines)

| File                                                            | Lines | Complexity | Details        |
| --------------------------------------------------------------- | ----- | ---------- | -------------- |
| `apps/api/src/core/api-keys/repositories/apiKeys.repository.ts` | 80+   | LOW        | Key storage    |
| `apps/api/src/core/api-keys/services/apiKeys.service.ts`        | 70+   | LOW        | Key management |

**Effort:** 6-8 hours

### Navigation (2 files, ~150 lines)

| File                                                          | Lines | Complexity | Details         |
| ------------------------------------------------------------- | ----- | ---------- | --------------- |
| `apps/api/src/core/navigation/navigation.repository.ts`       | 80+   | LOW        | Menu queries    |
| `apps/api/src/core/navigation/services/navigation.service.ts` | 70+   | LOW        | Menu management |

**Effort:** 6-8 hours

### Settings (2 files, ~150 lines)

| File                                                | Lines | Complexity | Details             |
| --------------------------------------------------- | ----- | ---------- | ------------------- |
| `apps/api/src/core/settings/settings.repository.ts` | 80+   | LOW        | Settings storage    |
| `apps/api/src/core/settings/settings.service.ts`    | 70+   | LOW        | Settings management |

**Effort:** 6-8 hours

### Test Products (CRUD Generated, ~150 lines)

| File                                                                         | Lines | Complexity | Details        |
| ---------------------------------------------------------------------------- | ----- | ---------- | -------------- |
| `apps/api/src/modules/testProducts/repositories/test-products.repository.ts` | 80+   | LOW        | CRUD generated |
| `apps/api/src/modules/testProducts/services/test-products.service.ts`        | 70+   | LOW        | CRUD generated |

**Effort:** 4-6 hours

## Service Layer Updates (20+ files, varies)

Files that call repositories and will need minor updates:

**Authentication Services:**

- `core/auth/services/auth.service.ts`
- `core/auth/services/email-verification.service.ts`
- `core/auth/services/password-reset.service.ts`
- `core/auth/services/account-lockout.service.ts`
- `core/auth/services/secure-auth.service.ts`

**User Services:**

- `core/users/users.service.ts`
- `core/user-profile/user-profile.service.ts`
- `core/user-profile/user-activity.service.ts`
- `core/user-profile/services/avatar.service.ts`

**Audit Services:**

- `core/audit-system/base/base.service.ts`
- `core/audit-system/file-audit/file-audit.service.ts`
- `core/audit-system/login-attempts/login-attempts.service.ts`

**Other Services:**

- `core/rbac/rbac.service.ts`
- `core/file-upload/file-upload.service.ts`
- `core/api-keys/services/apiKeys.service.ts`
- `core/settings/settings.service.ts`
- `core/navigation/services/navigation.service.ts`
- And 10+ more

**Effort:** 15-25 hours total (mostly find-and-replace)
**Changes:** Constructor injection updates, query method calls

## Summary Table

| Category          | Files   | Lines      | Effort       | Priority     |
| ----------------- | ------- | ---------- | ------------ | ------------ |
| Base Repositories | 2       | 920        | 40-50h       | 1 (CRITICAL) |
| Complex Repos     | 4       | 1,200      | 30-35h       | 2 (HIGH)     |
| Medium Repos      | 10      | 1,800      | 40-50h       | 3 (MEDIUM)   |
| Simple Repos      | 6       | 900        | 20-30h       | 4 (LOW)      |
| Migrations        | 19      | 3,653      | 10-15h       | 5 (LOW)      |
| Seeds             | 9       | 3,787      | 8-12h        | 5 (LOW)      |
| Service Updates   | 20+     | varies     | 15-25h       | 6 (MEDIUM)   |
| **TOTAL**         | **65+** | **15,000** | **163-217h** |              |

## Critical Dependencies

```
BaseRepository
    ├── RbacRepository
    ├── UsersRepository
    │   ├── AuthRepository
    │   └── UserProfileRepository
    ├── FileUploadRepository
    ├── ErrorLogsRepository
    ├── NavigationRepository
    └── ... (other domain repos)

All Domain Repos
    └── Service Layer
        └── Route Controllers
```

**Migration Strategy:** Start at bottom of dependency tree, move up.

## Configuration Files to Update

- `knexfile.ts` - Remove entirely
- `package.json` - Update scripts, dependencies
- `.env.example` - Update database setup docs
- `docker-compose.yml` - Verify database config
- Setup scripts - Update migration commands

**Effort:** 2-4 hours
