# Budget Request Central Fix - Technical Design

**Version:** 1.0.0
**Created:** 2025-12-17
**Last Updated:** 2025-12-17

---

## Architecture Overview

### Current Flow (Broken)

```
User without department_id
    ↓
Frontend sends: { fiscal_year: 2568, department_id: null }
    ↓
Backend service.create() tries auto-populate
    ↓
user.department_id is also null
    ↓
❌ Throws: USER_NO_DEPARTMENT (422)
```

### New Flow (Fixed)

```
User (any department_id or null)
    ↓
Frontend sends: { fiscal_year: 2568, department_id: null }
    ↓
Backend service.create() accepts null directly
    ↓
✅ Budget request created with department_id = null
    ↓
Workflow: Submit → Dept Approve → Finance Approve
    ↓
Finance Approve: Skip allocations, log info
    ↓
✅ Status: FINANCE_APPROVED
```

---

## Design Decisions

### Decision 1: Remove Auto-Population Logic

**Problem:** Auto-population logic throws error if user has no department_id

**Options Considered:**

1. **Remove auto-populate entirely** ✅ CHOSEN
   - Pros: Simplest, allows null values, reduces code complexity
   - Cons: Users must explicitly select department (but that's okay for central requests)

2. Allow null as fallback (keep auto-populate)
   - Pros: Backward compatible
   - Cons: More complex logic, still tries to query user

3. Check permission instead of department
   - Pros: More flexible
   - Cons: Permission system already handles access control separately

**Chosen Solution:** Remove auto-populate logic

- Accept department_id from request data directly
- Allow null for central requests
- Simplify code from ~60 lines to ~30 lines

---

### Decision 2: Budget Allocations Handling

**Problem:** Finance approval tries to create allocations but department_id is null

**Options Considered:**

1. **Skip allocation creation** ✅ CHOSEN
   - Pros: Clean separation, allocations created later at PO/PR stage
   - Cons: Two-stage allocation process

2. Create allocations for "Central" department (ID = 1)
   - Pros: Allocations exist immediately
   - Cons: Artificial department, complicates queries

3. Reject approval until department assigned
   - Pros: Enforces department requirement
   - Cons: Blocks business workflow

**Chosen Solution:** Skip allocation creation

- Log info message for audit trail
- Allocations created later when items distributed to departments (PO/PR stage)
- Cleaner separation of concerns

---

## Component Design

### Component 1: BudgetRequestsService.create()

**Current Implementation (Lines 87-148):**

```typescript
async create(data: CreateBudgetRequests, userId?: string) {
  let departmentId = data.department_id;

  // ❌ PROBLEM: Auto-populate logic
  if ((!departmentId || departmentId === 0) && userId) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw error: 'USER_NOT_FOUND' (404)
    }

    // ❌ Throws error if user has no department
    if (!user.department_id) {
      throw error: 'USER_NO_DEPARTMENT' (422)
    }

    departmentId = user.department_id;
  }

  // Create with auto-populated departmentId
  return super.create({
    ...data,
    department_id: departmentId === 0 ? null : departmentId,
  });
}
```

**New Implementation (~30 lines):**

```typescript
async create(data: CreateBudgetRequests, userId?: string): Promise<BudgetRequests> {
  // Auto-generate request_number
  const requestNumber = data.request_number ||
    await this.generateRequestNumber(data.fiscal_year);

  // Use department_id from request (allow null)
  let departmentId = data.department_id;

  // Convert 0 to null (TypeBox coercion)
  if (departmentId === 0) {
    departmentId = null;
  }

  // Log for audit (if null)
  if (departmentId === null) {
    this.logger.info(
      { userId, fiscalYear: data.fiscal_year, requestNumber },
      'Creating central budget request (department_id = null)'
    );
  }

  // Build create data
  const createData: CreateBudgetRequests = {
    ...data,
    request_number: requestNumber,
    status: data.status || 'DRAFT',
    total_requested_amount: data.total_requested_amount ?? 0,
    department_id: departmentId,  // Allow null
  };

  return await super.create(createData);
}
```

**Changes:**

- ✅ Removed lines 100-132 (auto-populate logic)
- ✅ Accept null department_id directly
- ✅ Added audit logging
- ✅ Simplified from ~60 lines to ~30 lines

---

### Component 2: BudgetRequestsService.approveFinance()

**Current Implementation (Lines 618-628):**

```typescript
async approveFinance(id: string | number, userId: string, comments?: string) {
  // ... fetch request and items ...

  for (const item of requestItems) {
    // ❌ PROBLEM: Throws error if department_id is null
    if (!request.department_id) {
      throw error: 'BUDGET_REQUEST_NO_DEPARTMENT' (400)
    }

    // Create budget_allocations
    await knex('inventory.budget_allocations').insert({
      department_id: request.department_id,  // Requires non-null
      // ...
    });
  }
}
```

**New Implementation:**

```typescript
async approveFinance(id: string | number, userId: string, comments?: string) {
  // ... fetch request and items ...

  for (const item of requestItems) {
    // ✅ Skip allocation for central requests
    if (!request.department_id) {
      this.logger.info(
        {
          budgetRequestId: id,
          fiscalYear: request.fiscal_year,
          itemCount: requestItems.length,
        },
        'Skipping budget_allocations creation for central budget request ' +
        '(department_id = null). Allocations will be created at PO/PR stage.'
      );
      continue;  // Skip this item
    }

    // Create allocation for specific department
    await knex('inventory.budget_allocations').insert({
      department_id: request.department_id,
      // ...
    });
  }

  // Update status to FINANCE_APPROVED
  // (works even if no allocations created)
}
```

**Changes:**

- ✅ Removed error throw for null department_id
- ✅ Added skip logic with continue
- ✅ Added audit logging
- ✅ Approval completes successfully

---

## Data Flow

### Creation Flow

```
┌─────────────────────────────────────┐
│ Frontend Form                       │
│ - fiscal_year: 2568                 │
│ - department_id: null               │
│ - justification: "..."              │
└─────────────────────────────────────┘
           ↓ POST /api/.../budget-requests
┌─────────────────────────────────────┐
│ Controller                          │
│ - Validate schema (already allows   │
│   null)                             │
│ - Extract userId from auth          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Service.create()                    │
│ - Accept department_id: null        │
│ - Generate request_number           │
│ - Log audit message                 │
│ - Create record                     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Database                            │
│ INSERT INTO budget_requests         │
│ (fiscal_year, department_id, ...)  │
│ VALUES (2568, NULL, ...)            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Response: 201 Created               │
│ {                                   │
│   id: 123,                          │
│   request_number: "BR-2568-001",    │
│   department_id: null,              │
│   status: "DRAFT"                   │
│ }                                   │
└─────────────────────────────────────┘
```

### Finance Approval Flow

```
┌─────────────────────────────────────┐
│ Budget Request                      │
│ - status: DEPT_APPROVED             │
│ - department_id: null               │
│ - items: 5000                       │
└─────────────────────────────────────┘
           ↓ POST .../approve-finance
┌─────────────────────────────────────┐
│ Service.approveFinance()            │
│ - Fetch request + items             │
│ - Loop through items                │
│ - Check: department_id is null?     │
│   Yes → Skip allocation, log info   │
│   No → Create allocation            │
│ - Update status: FINANCE_APPROVED   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ Response: 200 OK                    │
│ {                                   │
│   id: 123,                          │
│   status: "FINANCE_APPROVED",       │
│   finance_reviewed_by: "user-456"   │
│ }                                   │
│                                     │
│ Logs:                               │
│ "Skipping budget_allocations..."    │
└─────────────────────────────────────┘
```

---

## Error Handling

### Scenario 1: Null Department (BEFORE FIX)

```
Input: { fiscal_year: 2568, department_id: null }
Error: USER_NO_DEPARTMENT (422)
Response: {
  success: false,
  error: {
    code: "USER_NO_DEPARTMENT",
    message: "You are not assigned to a department...",
    statusCode: 422
  }
}
```

### Scenario 1: Null Department (AFTER FIX)

```
Input: { fiscal_year: 2568, department_id: null }
Success: 201 Created
Response: {
  success: true,
  data: {
    id: 123,
    request_number: "BR-2568-001",
    fiscal_year: 2568,
    department_id: null,  ← Allowed
    status: "DRAFT"
  }
}
```

---

## Database Schema

### budget_requests Table

```sql
CREATE TABLE inventory.budget_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,
  fiscal_year INTEGER NOT NULL,
  department_id INTEGER REFERENCES departments(id),  ← Nullable FK
  status VARCHAR(50) DEFAULT 'DRAFT',
  -- ... other fields
);
```

**Key Point:** `department_id` is already nullable in database schema!

---

## Testing Strategy

### Unit Tests

```typescript
describe('BudgetRequestsService.create()', () => {
  it('should create budget request with null department_id', async () => {
    const data = {
      fiscal_year: 2568,
      department_id: null, // Central request
    };

    const result = await service.create(data, 'user-123');

    expect(result.department_id).toBeNull();
    expect(result.status).toBe('DRAFT');
  });

  it('should not throw USER_NO_DEPARTMENT error', async () => {
    const data = { fiscal_year: 2568, department_id: null };

    await expect(service.create(data, 'user-123')).resolves.not.toThrow();
  });
});

describe('BudgetRequestsService.approveFinance()', () => {
  it('should approve central request without creating allocations', async () => {
    const request = {
      id: 123,
      department_id: null,
      status: 'DEPT_APPROVED',
    };

    const result = await service.approveFinance(123, 'finance-user', 'Approved');

    expect(result.status).toBe('FINANCE_APPROVED');
    // Verify no allocations created
    const allocations = await knex('budget_allocations').where({ fiscal_year: 2568 });
    expect(allocations).toHaveLength(0);
  });
});
```

---

## Rollback Plan

If issues occur:

### Immediate Rollback

```bash
git revert <commit-hash>
git push origin develop
```

### Temporary Workaround

```sql
-- Assign all users to "Central" department
UPDATE users SET department_id = 1 WHERE department_id IS NULL;
```

### Long-term Fix

- Implement permission-based creation
- Add "can_create_central_budgets" permission
- Remove department_id requirement entirely

---

## Security Considerations

### Permission Checks

- ✅ Already implemented: `budgetRequests:create` permission
- ✅ Permission-based, not department-based
- ✅ No security impact from allowing null department_id

### Audit Trail

- ✅ Log central request creation
- ✅ Log allocation skipping
- ✅ Track all user actions

---

## Performance Impact

### Before Fix

- ~60 lines in create() method
- Extra database query (user lookup)
- Auto-populate logic overhead

### After Fix

- ~30 lines in create() method (50% reduction)
- No extra database query
- Simpler, faster execution

**Expected:** 10-15ms faster request creation

---

## Backward Compatibility

### Department-Specific Requests (Still Supported)

```json
POST /api/inventory/budget/budget-requests
{
  "fiscal_year": 2568,
  "department_id": 5  ← Still works!
}
```

### Finance Approval (Still Creates Allocations)

- If department_id is not null → creates allocations
- If department_id is null → skips allocations
- Both cases succeed

**Impact:** ✅ Zero breaking changes
