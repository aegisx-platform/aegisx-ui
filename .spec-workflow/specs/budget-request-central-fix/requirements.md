# Budget Request Central Fix - Requirements

**Version:** 1.0.0
**Created:** 2025-12-17
**Status:** Active
**Priority:** High

---

## Overview

Fix budget request creation to support central (hospital-wide) budget requests where `department_id = null`. Currently, users without department assignment cannot create budget requests due to validation errors.

---

## Business Requirements

### BR-1: Support Central Budget Requests

**Priority:** High (Blocker)
**Description:** Allow creation of hospital-wide budget requests with `department_id = null`

**Current Problem:**

- Users without `department_id` (e.g., Finance, Admin) cannot create budget requests
- Error: `USER_NO_DEPARTMENT` (422) thrown at service.ts:112-121
- Blocks collaborative budget planning workflow

**Business Context:**

- Budget request is CENTRAL (hospital-wide, not per department)
- Drug list covers entire hospital (~5,000 items)
- ONE request per fiscal year (collaborative editing)
- Multiple users from different departments contribute
- Workflow: Create → Edit → Submit → Approve (Dept) → Approve (Finance) → PO/PR

**Acceptance Criteria:**

- ✅ Users without `department_id` can create budget requests
- ✅ Budget request with `department_id = null` is valid
- ✅ No "USER_NO_DEPARTMENT" error thrown
- ✅ Central requests flow through approval workflow successfully

---

### BR-2: Finance Approval for Central Requests

**Priority:** High
**Description:** Allow finance approval to complete for central budget requests without creating department-specific allocations

**Current Problem:**

- Finance approval fails if `department_id = null`
- Error: `BUDGET_REQUEST_NO_DEPARTMENT` (400) at service.ts:618-628
- Blocks final approval stage

**Business Logic:**

- Central requests don't need immediate budget allocations
- Allocations created later at PO/PR stage when items distributed to departments
- Finance approval indicates budget availability, not allocation

**Acceptance Criteria:**

- ✅ Finance approval succeeds for central requests
- ✅ No error about missing department_id
- ✅ Status changes to `FINANCE_APPROVED`
- ✅ Logs indicate skipped allocation (audit trail)

---

### BR-3: Collaborative Editing

**Priority:** High
**Description:** Support multiple users editing the same central budget request

**Business Context:**

- Finance user creates request (department_id = null)
- Pharmacy staff updates drug quantities
- Nursing staff updates medical supplies
- Multiple users work simultaneously on same request

**Acceptance Criteria:**

- ✅ All users can edit items regardless of their department_id
- ✅ Permission-based access (not department-based)
- ✅ No conflicts with null department_id

---

## Technical Requirements

### TR-1: Remove Auto-Population Logic

**File:** `budget-requests.service.ts`
**Location:** Lines 100-132 in `create()` method

**Requirements:**

- Remove auto-populate department_id from user profile
- Accept department_id from request data directly
- Allow null values for central requests
- Keep 0 → null conversion for TypeBox coercion

---

### TR-2: Skip Budget Allocations for Central Requests

**File:** `budget-requests.service.ts`
**Location:** Lines 618-628 in `approveFinance()` method

**Requirements:**

- Check if department_id is null
- Skip budget_allocations creation (don't throw error)
- Log info message for audit trail
- Allow approval to complete successfully

---

### TR-3: Schema Validation

**File:** `budget-requests.schemas.ts`

**Current Status:** ✅ Already correct

- `department_id` is `Type.Optional(Type.Union([Type.Integer(), Type.Null()]))`
- Schema already allows null values

**Requirements:**

- Verify schema accepts null
- No changes needed

---

### TR-4: Frontend Compatibility

**File:** `budget-requests-form.component.ts`

**Current Status:** ✅ Already correct

- Form has optional department dropdown
- Auto-populates from user if available
- Sends null if not selected
- Shows informational warning (not error)

**Requirements:**

- Verify form behavior with null department_id
- No changes needed

---

## User Scenarios

### Scenario 1: Finance User Creates Central Request

```
User: Finance Officer (department_id = null)
Action: Create budget request for fiscal year 2568
Expected: Success (201 Created)
```

### Scenario 2: Department User Edits Items

```
User: Pharmacy Head (department_id = 5)
Action: Update drug quantities in central request
Expected: Success (PATCH succeeds)
```

### Scenario 3: Finance Approval

```
User: Finance Manager
Action: Approve central budget request (department_id = null)
Expected: Status → FINANCE_APPROVED (no allocations created)
```

---

## Constraints

### Business Constraints

- ✅ One central request per fiscal year
- ✅ department_id must always be null for central requests
- ✅ Allocations deferred to PO/PR stage

### Technical Constraints

- ✅ Must maintain backward compatibility with department-specific requests
- ✅ No breaking changes to existing API
- ✅ Schema already correct (no migration needed)

---

## Success Metrics

1. **Error Rate:** Zero "USER_NO_DEPARTMENT" errors
2. **Approval Success:** 100% finance approval success rate for central requests
3. **User Satisfaction:** Finance team can create budgets without admin intervention
4. **Code Quality:** Reduced from ~60 lines to ~30 lines in create() method

---

## Out of Scope

- ❌ Budget allocation distribution logic (future PO/PR module)
- ❌ Permission-based access control (already implemented)
- ❌ Frontend UI changes (already supports null department_id)
- ❌ Multi-fiscal-year requests (one per year only)
