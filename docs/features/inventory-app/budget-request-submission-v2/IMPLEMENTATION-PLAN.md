# Budget Request Submission - Implementation Plan (Based on Existing System)

**Version:** 2.0.0
**Date:** 2025-12-12
**Format:** Claude Planner

[← Back to Parent Spec](../budget-request-submission/README.md)

---

## 🎯 GOAL

เพิ่มฟีเจอร์ให้กับ Budget Request Submission ที่**มีอยู่แล้ว** ด้วย:

- ✅ Permission-based access control (เพิ่ม 13 permissions)
- ✅ Pre-submission validation checklist
- ✅ Dashboard สำหรับติดตามงบประมาณ
- ✅ Integration กับ Budget Plans และ Allocations
- ✅ UI/UX improvements (Progress stepper, dialogs, widgets)

**Business Value:**

- ป้องกันการ submit งบที่ไม่ครบถ้วน
- ติดตามงบประมาณแบบ real-time
- Workflow ชัดเจนกว่าเดิม
- User experience ดีขึ้น

---

## 📦 INPUT

### ✅ สิ่งที่มีอยู่แล้ว (Existing System)

#### Backend - Budget Requests Module

**Location:** `apps/api/src/modules/inventory/budget/budgetRequests/`

**Files:**

- `budget-requests.service.ts` (65KB) - Service layer
- `budget-requests.controller.ts` (32KB) - Controller
- `budget-requests.repository.ts` (15KB) - Database layer
- `budget-requests.route.ts` (25KB) - API routes
- `budget-requests.schemas.ts` (8.3KB) - TypeBox schemas
- `budget-requests-audit.service.ts` (6.1KB) - Audit trail

**Existing Endpoints:**

```
✅ POST   /budget-requests                    (create)
✅ GET    /budget-requests                    (list)
✅ GET    /budget-requests/:id                (detail)
✅ PUT    /budget-requests/:id                (update)
✅ DELETE /budget-requests/:id                (delete)
✅ POST   /budget-requests/:id/submit         (workflow)
✅ POST   /budget-requests/:id/approve-dept   (workflow)
✅ POST   /budget-requests/:id/approve-finance (workflow)
✅ POST   /budget-requests/:id/reject         (workflow)
✅ POST   /budget-requests/:id/reopen         (workflow)
✅ POST   /budget-requests/:id/initialize     (helper)
✅ POST   /budget-requests/:id/initialize-from-master (helper)
✅ POST   /budget-requests/:id/import-excel   (import)
✅ GET    /budget-requests/:id/export-sscj    (export)
✅ POST   /budget-requests/:id/items          (item CRUD)
✅ PUT    /budget-requests/:id/items/:itemId  (item CRUD)
✅ DELETE /budget-requests/:id/items/:itemId  (item CRUD)
✅ POST   /budget-requests/:id/items/batch    (item batch)
✅ POST   /budget-requests/:id/items/bulk-delete (item bulk)
```

**Existing Permissions (Currently Used):**

```
✅ budgetRequests:create
✅ budgetRequests:read
✅ budgetRequests:update
✅ budgetRequests:delete
✅ budgetRequests:submit
✅ budgetRequests:approve_dept
✅ budgetRequests:approve_finance
✅ budgetRequests:reject
✅ budgetRequests:reopen
```

**Database Tables (Existing):**

- ✅ `inventory.budget_requests` - Main table
- ✅ `inventory.budget_request_items` - Line items
- ✅ `inventory.budget_request_comments` - Comments
- ✅ `inventory.budget_request_audit` - Audit trail

#### Core RBAC System

**Location:** `apps/api/src/core/rbac/`

**Available:**

- ✅ `fastify.verifyPermission(resource, action)` - Permission guard
- ✅ `fastify.authenticate` - JWT authentication
- ✅ `fastify.permissionCache` - Redis cache for permissions
- ✅ Permission format: `resource:action` (e.g., `budgetRequests:read`)
- ✅ Wildcard support: `*:*`, `budgetRequests:*`, `*:read`

**Tables:**

- ✅ `public.permissions` - Permission definitions
- ✅ `public.roles` - Role definitions
- ✅ `public.role_permissions` - Role-Permission mapping
- ✅ `public.user_roles` - User-Role assignments

---

## ❌ สิ่งที่ยังขาด (What Needs to Be Added)

### Backend

1. **Additional Permissions** - ขาด view_own, view_dept, edit_own
2. **Validation Endpoint** - `POST /:id/validate` สำหรับ pre-submit check
3. **Dashboard Stats Endpoints** - สถิติ, pending actions, budget tracking
4. **Budget Integration Endpoints** - Check drugs in plan, budget availability
5. **Notification Service** - Email + in-app notifications

### Frontend

1. **Permission Service** - Frontend permission checking
2. **Validation Service** - Client-side + server-side validation
3. **Progress Stepper Component** - Workflow visualization
4. **Status Badge Component** - Color-coded status
5. **Pre-submission Checklist Dialog** - Validation summary
6. **Dashboard Pages** (3 pages):
   - Overview Dashboard
   - Budget Tracking Dashboard
   - Request Status Dashboard
7. **Dashboard Widgets** (7 widgets):
   - Stats Cards
   - Budget Progress Bar
   - Pending Actions Widget
   - Recent Requests Widget
   - Quarterly Breakdown
   - Spending Trend Chart
   - Approval Timeline

---

## 📤 OUTPUT

### Deliverables

**Backend:**

1. Migration: Add 4 new permissions
2. New endpoints: 7 endpoints (validation, stats, dashboard)
3. Budget integration: 2 new service methods
4. Notification service: 3 notification methods

**Frontend:**

1. Services: 2 services (permission, validation)
2. Components: 4 components (stepper, badge, progress bar, confirm dialog)
3. Dialogs: 1 dialog (pre-submission checklist)
4. Pages: 3 dashboard pages
5. Widgets: 7 widgets

**Total:**

- Backend: 1 migration + 7 endpoints + 5 service methods
- Frontend: 2 services + 4 components + 1 dialog + 3 pages + 7 widgets

---

## ❓ QUESTIONS

### Clarifications Needed

1. **Permission Granularity**
   - ใช้ `budgetRequests:read` อันเดียวพอหรือไม่?
   - หรือต้องแยกเป็น `view_own`, `view_dept`, `view_all`?
   - **Recommendation:** แยกเพื่อ fine-grained control

2. **Notification Channels**
   - Email only หรือต้องมี in-app notifications ด้วย?
   - **Recommendation:** Both (email + in-app)

3. **Budget Reservation**
   - ต้องการ reserve งบเมื่อ submit หรือไม่?
   - **Recommendation:** Skip Phase 1, add later in Phase 2

4. **Reopen Limit**
   - จำกัดจำนวนครั้งที่ reopen ได้หรือไม่?
   - **Recommendation:** Max 2 times

5. **Validation Strictness**
   - Quarterly budget ต้อง enforce strict หรือ warning only?
   - **Recommendation:** Warning only (soft validation)

---

## 🗂️ DATA_MODEL

### Core Entities (Already Exist - No Changes Needed)

```typescript
// ตาราง inventory.budget_requests มีอยู่แล้ว
interface BudgetRequest {
  id: number;
  request_number: string; // BR-2568-001
  fiscal_year: number;
  department_id: number;
  justification: string;
  status: 'DRAFT' | 'SUBMITTED' | 'DEPT_APPROVED' | 'FINANCE_APPROVED' | 'REJECTED';

  created_by: string;
  created_at: Date;
  submitted_by?: string;
  submitted_at?: Date;

  dept_reviewed_by?: string;
  dept_reviewed_at?: Date;
  dept_comments?: string;

  finance_reviewed_by?: string;
  finance_reviewed_at?: Date;
  finance_comments?: string;

  rejection_reason?: string;

  reopened_by?: string;
  reopened_at?: Date;
  parent_request_id?: number;
  reopen_count: number;

  total_requested_amount: number;
}
```

### Permissions (New - To Be Added)

```typescript
// เพิ่ม permissions ใหม่ 4 ตัว (รวมกับเดิม = 13 permissions)
const NEW_PERMISSIONS = {
  'budgetRequests:view_own': 'View own budget requests only',
  'budgetRequests:view_dept': 'View department budget requests',
  'budgetRequests:view_all': 'View all budget requests (all departments)',
  'budgetRequests:edit_own': 'Edit own budget requests (DRAFT only)',
};

// Permissions ที่มีอยู่แล้ว (ไม่ต้องสร้างใหม่)
const EXISTING_PERMISSIONS = {
  'budgetRequests:create': 'Create budget requests',
  'budgetRequests:read': 'Read budget requests',
  'budgetRequests:update': 'Update budget requests',
  'budgetRequests:delete': 'Delete budget requests',
  'budgetRequests:submit': 'Submit for approval',
  'budgetRequests:approve_dept': 'Department approval',
  'budgetRequests:approve_finance': 'Finance approval',
  'budgetRequests:reject': 'Reject requests',
  'budgetRequests:reopen': 'Reopen rejected requests',
};
```

### Validation Result (New Type)

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  info: ValidationMessage[];
}

interface ValidationMessage {
  field?: string;
  message: string;
  code?: string;
}
```

---

## 🔌 API_SPEC

### New Endpoints to Add

```typescript
// ===== VALIDATION ENDPOINT =====

/**
 * Validate request before submit
 */
POST /inventory/budget/budget-requests/:id/validate
Response: {
  "valid": boolean,
  "errors": ValidationMessage[],
  "warnings": ValidationMessage[],
  "info": ValidationMessage[]
}

// ===== DASHBOARD STATS ENDPOINTS =====

/**
 * Get total requests count
 */
GET /inventory/budget/budget-requests/stats/total?fiscal_year=2568&department_id=2
Response: {
  "total": number,
  "by_status": {
    "DRAFT": number,
    "SUBMITTED": number,
    "DEPT_APPROVED": number,
    "FINANCE_APPROVED": number,
    "REJECTED": number
  }
}

/**
 * Get pending actions for current user
 */
GET /inventory/budget/budget-requests/my-pending-actions
Response: {
  "pending": BudgetRequest[],
  "count": number
}

/**
 * Get recent requests
 */
GET /inventory/budget/budget-requests/recent?limit=10
Response: {
  "requests": BudgetRequest[],
  "count": number
}

// ===== BUDGET INTEGRATION ENDPOINTS =====

/**
 * Check if drugs are in budget plan
 */
POST /inventory/budget/budget-plans/check-drugs
Request: {
  "fiscal_year": number,
  "department_id": number,
  "drug_ids": number[]
}
Response: {
  "plan_exists": boolean,
  "plan_id"?: number,
  "results": Array<{
    "generic_id": number,
    "in_plan": boolean,
    "planned_qty"?: number
  }>,
  "summary": {
    "total_drugs": number,
    "in_plan": number,
    "not_in_plan": number
  }
}

/**
 * Check budget availability
 */
POST /inventory/budget/allocations/check-availability
Request: {
  "fiscal_year": number,
  "department_id": number,
  "budget_type_id": number,
  "amount": number
}
Response: {
  "available": boolean,
  "allocation": {
    "total_budget": number,
    "total_used": number,
    "remaining_budget": number
  },
  "impact": {
    "before": { "available": number, "utilization_percent": number },
    "after": { "available": number, "utilization_percent": number }
  },
  "warnings": string[]
}

/**
 * Get budget allocation summary
 */
GET /inventory/budget/allocations/summary?fiscal_year=2568&department_id=2
Response: {
  "fiscal_year": number,
  "department_id": number,
  "budget_types": Array<{
    "budget_type_id": number,
    "budget_type_name": string,
    "total_budget": number,
    "total_used": number,
    "remaining": number,
    "utilization_percent": number
  }>
}
```

---

## 🎨 UI_SPEC

### Component Hierarchy

```
BudgetRequestModule (Already Exists)
├── Pages (Existing)
│   ├── BudgetRequestListPage          ← EXISTS
│   └── BudgetRequestDetailPage        ← EXISTS (needs updates)
│
├── Pages (New - To Add)
│   └── DashboardPages
│       ├── OverviewDashboardPage      ← NEW
│       ├── BudgetTrackingDashboardPage ← NEW
│       └── RequestStatusDashboardPage  ← NEW
│
├── Components (New - To Add)
│   ├── BudgetRequestProgressStepperComponent  ← NEW
│   ├── BudgetRequestStatusBadgeComponent     ← NEW
│   ├── BudgetProgressBarComponent            ← NEW
│   └── ValidationFeedbackComponent           ← NEW
│
├── Dialogs (New - To Add)
│   ├── PreSubmissionChecklistDialog   ← NEW
│   └── ConfirmActionDialog            ← NEW
│
├── Widgets (New - To Add)
│   ├── StatsCardComponent             ← NEW
│   ├── PendingActionsWidgetComponent  ← NEW
│   ├── RecentRequestsWidgetComponent  ← NEW
│   ├── BudgetAllocationStatusWidget   ← NEW
│   ├── QuarterlyBreakdownComponent    ← NEW
│   ├── SpendingTrendChartComponent    ← NEW
│   └── ApprovalTimelineWidget         ← NEW
│
└── Services (New - To Add)
    ├── BudgetRequestPermissionService  ← NEW
    └── BudgetRequestValidationService  ← NEW
```

---

## ✅ TASKS

### Phase 1: Backend - Permissions & Validation (Priority: HIGH)

**Objective:** เพิ่ม permissions ใหม่ และ validation endpoint

#### Task 1.1: Add New Budget Request Permissions

**File:** `apps/api/src/database/migrations-inventory/YYYYMMDDHHMMSS_add_additional_budget_request_permissions.ts`

**Steps:**

1. Create migration: `pnpm run db:migrate:make add_additional_budget_request_permissions`
2. Use permission helper: `const { createPermissionsForResource, linkPermissionsToRole } = require('../helpers/permission-helper')`
3. Add 4 new permissions:
   - `budgetRequests:view_own` - View own requests only
   - `budgetRequests:view_dept` - View department requests
   - `budgetRequests:view_all` - View all requests
   - `budgetRequests:edit_own` - Edit own requests (DRAFT only)
4. Assign to roles (check actual role names in database first!)
5. Run migration: `pnpm run db:migrate`

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/database/migrations-inventory/YYYYMMDDHHMMSS_add_additional_budget_request_permissions.ts`

**Acceptance Criteria:**

- ✅ 4 permissions inserted into `permissions` table
- ✅ Permissions assigned to appropriate roles
- ✅ Migration is reversible (has `down()`)
- ✅ Admin role already has `*:*` wildcard

**Example Migration:**

```typescript
const { createPermissionsForResource, linkPermissionsToRole } = require('../helpers/permission-helper');

exports.up = async function (knex) {
  // Add 4 new granular permissions
  await createPermissionsForResource(knex, {
    resource: 'budgetRequests',
    category: 'inventory',
    actions: [
      { action: 'view_own', description: 'View own budget requests only' },
      { action: 'view_dept', description: 'View department budget requests' },
      { action: 'view_all', description: 'View all budget requests' },
      { action: 'edit_own', description: 'Edit own budget requests (DRAFT)' },
    ],
  });

  // Example role assignments (adjust based on actual role names!)
  await linkPermissionsToRole(knex, 'inventory.staff', ['budgetRequests:create', 'budgetRequests:view_own', 'budgetRequests:edit_own', 'budgetRequests:submit']);

  await linkPermissionsToRole(knex, 'inventory.department_head', ['budgetRequests:view_dept', 'budgetRequests:approve_dept', 'budgetRequests:reject']);

  await linkPermissionsToRole(knex, 'inventory.finance_manager', ['budgetRequests:view_all', 'budgetRequests:approve_finance', 'budgetRequests:reject']);
};

exports.down = async function (knex) {
  // Remove only the 4 new permissions
  await knex('permissions').where('resource', 'budgetRequests').whereIn('action', ['view_own', 'view_dept', 'view_all', 'edit_own']).del();
};
```

---

#### Task 1.2: Add Validation Endpoint

**File:** `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.route.ts`

**Steps:**

1. Add new route `POST /:id/validate`
2. Create validation method in service: `validateForSubmit(id)`
3. Return structured validation results (errors, warnings, info)
4. Apply permission guard: `fastify.verifyPermission('budgetRequests', 'read')`
5. Test endpoint

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.route.ts`
- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.service.ts`
- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.controller.ts`

**Acceptance Criteria:**

- ✅ Endpoint returns validation results
- ✅ Validates: fiscal_year, justification (min 20 chars), min 1 item
- ✅ Validates quarterly sum = total quantity
- ✅ Returns errors/warnings/info separately
- ✅ Permission protected

**Code Example:**

```typescript
// In budget-requests.route.ts
fastify.post('/:id/validate', {
  schema: {
    tags: ['Inventory: Budget Requests'],
    summary: 'Validate budget request before submit',
    params: BudgetRequestsIdParamSchema,
    response: {
      200: Type.Object({
        valid: Type.Boolean(),
        errors: Type.Array(Type.Object({
          field: Type.Optional(Type.String()),
          message: Type.String(),
          code: Type.Optional(Type.String())
        })),
        warnings: Type.Array(Type.Object({
          field: Type.Optional(Type.String()),
          message: Type.String()
        })),
        info: Type.Array(Type.String())
      })
    }
  },
  preValidation: [
    fastify.authenticate,
    fastify.verifyPermission('budgetRequests', 'read')
  ],
  handler: controller.validate.bind(controller)
});

// In budget-requests.service.ts
async validateForSubmit(id: number) {
  const request = await this.repository.findById(id, { include: ['items'] });

  const errors = [];
  const warnings = [];
  const info = [];

  // Validate fiscal year
  if (!request.fiscal_year || request.fiscal_year < 2560) {
    errors.push({ field: 'fiscal_year', message: 'Invalid fiscal year' });
  }

  // Validate justification
  if (!request.justification || request.justification.length < 20) {
    errors.push({ field: 'justification', message: 'Justification must be at least 20 characters', code: 'MIN_LENGTH' });
  }

  // Validate items
  if (!request.items || request.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  }

  // Validate quarterly distribution
  for (const item of request.items) {
    const sum = (item.q1_qty || 0) + (item.q2_qty || 0) + (item.q3_qty || 0) + (item.q4_qty || 0);
    if (sum !== item.requested_qty) {
      errors.push({
        field: `items[${item.line_number}].quarterly`,
        message: `Quarterly sum (${sum}) does not equal total quantity (${item.requested_qty})`
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info
  };
}
```

---

### Phase 2: Backend - Dashboard Endpoints (Priority: HIGH)

**Objective:** เพิ่ม API endpoints สำหรับ dashboard

#### Task 2.1: Add Stats Endpoints

**File:** `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.route.ts`

**Steps:**

1. Add `GET /stats/total` - Total count by status
2. Add `GET /my-pending-actions` - Pending approvals for current user
3. Add `GET /recent` - Recent requests (last 10)
4. Implement service methods with proper permission filtering
5. Test all endpoints

**Dependencies:** Task 1.1

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.route.ts`
- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.service.ts`
- MODIFY: `apps/api/src/modules/inventory/budget/budgetRequests/budget-requests.controller.ts`

**Acceptance Criteria:**

- ✅ All stats endpoints return correct data
- ✅ Data filtered by user permission (view_own/view_dept/view_all)
- ✅ Response times <500ms
- ✅ Proper error handling

**Code Example:**

```typescript
// GET /stats/total
fastify.get('/stats/total', {
  schema: {
    tags: ['Inventory: Budget Requests'],
    summary: 'Get total request counts',
    querystring: Type.Object({
      fiscal_year: Type.Optional(Type.Number()),
      department_id: Type.Optional(Type.Number())
    }),
    response: {
      200: Type.Object({
        total: Type.Number(),
        by_status: Type.Object({
          DRAFT: Type.Number(),
          SUBMITTED: Type.Number(),
          DEPT_APPROVED: Type.Number(),
          FINANCE_APPROVED: Type.Number(),
          REJECTED: Type.Number()
        })
      })
    }
  },
  preValidation: [fastify.authenticate],
  handler: controller.getStats.bind(controller)
});

// Service method
async getStats(userId: string, filters: any) {
  const userPermissions = await this.getUserPermissions(userId);

  let query = this.repository.db('budget_requests');

  // Apply permission-based filtering
  if (!userPermissions.includes('budgetRequests:view_all')) {
    if (userPermissions.includes('budgetRequests:view_dept')) {
      const userDeptId = await this.getUserDepartmentId(userId);
      query = query.where('department_id', userDeptId);
    } else {
      query = query.where('created_by', userId);
    }
  }

  if (filters.fiscal_year) {
    query = query.where('fiscal_year', filters.fiscal_year);
  }

  const results = await query
    .select('status')
    .count('* as count')
    .groupBy('status');

  const byStatus = {
    DRAFT: 0,
    SUBMITTED: 0,
    DEPT_APPROVED: 0,
    FINANCE_APPROVED: 0,
    REJECTED: 0
  };

  results.forEach(row => {
    byStatus[row.status] = parseInt(row.count);
  });

  return {
    total: Object.values(byStatus).reduce((sum, count) => sum + count, 0),
    by_status: byStatus
  };
}
```

---

#### Task 2.2: Add Budget Integration Endpoints

**File:** `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.service.ts`

**Steps:**

1. Add `checkDrugsInPlan()` method in BudgetPlansService
2. Query approved budget plan for fiscal year + department
3. Compare requested drugs vs planned drugs
4. Return results with warnings
5. Add route in budget-plans.route.ts
6. Test endpoint

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.controller.ts`

**Acceptance Criteria:**

- ✅ Returns plan status (exists/not exists)
- ✅ Identifies drugs not in plan
- ✅ Returns summary statistics
- ✅ Handles multiple plans gracefully

---

#### Task 2.3: Add Budget Allocation Check

**File:** `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`

**Steps:**

1. Add `checkAvailability()` method
2. Query budget allocations for fiscal year + department + type
3. Calculate: allocated, used, reserved, available
4. Calculate impact (before/after)
5. Generate warnings if utilization > 80%
6. Add routes
7. Test endpoint

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.controller.ts`

**Acceptance Criteria:**

- ✅ Correctly calculates available budget
- ✅ Returns impact analysis
- ✅ Generates warnings for high utilization
- ✅ Handles missing allocations

---

### Phase 3: Frontend - Core Components (Priority: HIGH)

**Objective:** สร้าง reusable components

#### Task 3.1: Permission Service (Frontend)

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.ts`

**Steps:**

1. Create service with signals
2. Inject AuthService to get current user
3. Implement permission checking methods
4. Match backend logic
5. Write unit tests

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.spec.ts`

**Acceptance Criteria:**

- ✅ Can check: canView, canEdit, canSubmit, canApprove
- ✅ Uses signals for reactivity
- ✅ Matches backend permission logic
- ✅ Tests pass

---

#### Task 3.2: Validation Service (Frontend)

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.ts`

**Steps:**

1. Create service
2. Implement client-side field validators
3. Implement `validateForSubmit()` that calls backend
4. Merge client + server results
5. Write unit tests

**Dependencies:** Task 1.2

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.spec.ts`

**Acceptance Criteria:**

- ✅ Client-side validation works (fast)
- ✅ Calls backend `/validate` endpoint
- ✅ Returns structured errors/warnings/info
- ✅ Response <100ms for client-only

---

#### Task 3.3: Progress Stepper Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/`

**Steps:**

1. Create standalone component
2. Use `mat-stepper` from Angular Material
3. Define 4 steps: DRAFT, SUBMITTED, DEPT_APPROVED, FINANCE_APPROVED
4. Compute current step from status
5. Show timestamps and user names
6. Handle REJECTED status separately
7. Add styles
8. Test component

**Dependencies:** None

**Files to create/modify:**

- CREATE: `.../budget-request-progress-stepper.component.ts`
- CREATE: `.../budget-request-progress-stepper.component.html`
- CREATE: `.../budget-request-progress-stepper.component.scss`
- CREATE: `.../budget-request-progress-stepper.component.spec.ts`

**Acceptance Criteria:**

- ✅ Shows correct current step
- ✅ Displays user names and dates
- ✅ Rejected status shown prominently
- ✅ Responsive on mobile

---

#### Task 3.4: Status Badge Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/`

**Steps:**

1. Create standalone component
2. Define color mapping for each status
3. Define icon mapping
4. Add styles with CSS variables
5. Test all status variants

**Dependencies:** None

**Files to create/modify:**

- CREATE: `.../budget-request-status-badge.component.ts`
- CREATE: `.../budget-request-status-badge.component.scss`
- CREATE: `.../budget-request-status-badge.component.spec.ts`

**Acceptance Criteria:**

- ✅ Correct colors for each status
- ✅ Correct icons displayed
- ✅ Readable on all backgrounds
- ✅ Component reusable

---

#### Task 3.5: Pre-submission Checklist Dialog

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/`

**Steps:**

1. Create dialog component
2. Accept data: request, validation, budgetImpact
3. Display validation errors (blocking)
4. Display warnings (non-blocking)
5. Display budget impact summary
6. Add confirmation checkbox
7. Enable submit only if valid + confirmed
8. Add styles
9. Test dialog

**Dependencies:** Task 3.2

**Files to create/modify:**

- CREATE: `.../pre-submission-checklist.dialog.ts`
- CREATE: `.../pre-submission-checklist.dialog.html`
- CREATE: `.../pre-submission-checklist.dialog.scss`
- CREATE: `.../pre-submission-checklist.dialog.spec.ts`

**Acceptance Criteria:**

- ✅ Shows all validation results
- ✅ Budget impact calculated correctly
- ✅ Submit disabled until confirmed
- ✅ Returns true/false on close

---

### Phase 4: Frontend - Dashboard (Priority: MEDIUM)

**Objective:** Build dashboard pages and widgets

#### Task 4.1: Stats Card Component (Reusable)

**File:** `apps/web/src/app/shared/components/stats-card/`

**Steps:**

1. Create reusable standalone component
2. Inputs: title, value, icon, color, badge, change
3. Use mat-card
4. Display icon, value, change indicator
5. Add styles
6. Test component

**Dependencies:** None

**Files to create/modify:**

- CREATE: `.../stats-card.component.ts`
- CREATE: `.../stats-card.component.scss`
- CREATE: `.../stats-card.component.spec.ts`

**Acceptance Criteria:**

- ✅ Accepts all inputs correctly
- ✅ Displays data correctly
- ✅ Responsive design
- ✅ Reusable across modules

---

#### Task 4.2: Overview Dashboard Page

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/pages/overview-dashboard/`

**Steps:**

1. Create page component
2. Add 4 stats cards
3. Add budget allocation widget
4. Add recent requests widget
5. Add pending actions widget
6. Arrange with responsive grid
7. Load all data on init
8. Test page

**Dependencies:** Task 4.1, Task 2.1

**Files to create/modify:**

- CREATE: `.../overview-dashboard.page.ts`
- CREATE: `.../overview-dashboard.page.html`
- CREATE: `.../overview-dashboard.page.scss`

**Acceptance Criteria:**

- ✅ All widgets display correctly
- ✅ Data loads on init
- ✅ Responsive layout
- ✅ Performance <2s load time

---

### Phase 5: Integration & Polish (Priority: MEDIUM)

#### Task 5.1: Update Detail Page with New Components

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-request-detail/`

**Steps:**

1. Add progress stepper at top
2. Add status badge
3. Add smart action bar with permission checks
4. Integrate pre-submission checklist dialog
5. Test all interactions

**Dependencies:** Task 3.3, Task 3.4, Task 3.5

**Files to create/modify:**

- MODIFY: `.../budget-request-detail.page.ts`
- MODIFY: `.../budget-request-detail.page.html`

**Acceptance Criteria:**

- ✅ Progress stepper shows correct status
- ✅ Action buttons show/hide based on permission
- ✅ Validation works
- ✅ Submit flow complete

---

#### Task 5.2: Add Toast Notifications

**File:** Various action methods

**Steps:**

1. Inject MatSnackBar
2. Add success toasts
3. Add error toasts
4. Add warning toasts
5. Test all notifications

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `.../budget-request-detail.page.ts`
- MODIFY: `.../budget-request.service.ts`

**Acceptance Criteria:**

- ✅ Toasts show on all actions
- ✅ Correct messages
- ✅ Proper styling
- ✅ Auto-dismiss timing appropriate

---

## 📊 REVIEW

### Success Criteria

#### Backend

- [ ] 4 new permissions added to database
- [ ] Permission guards applied to all routes
- [ ] Validation endpoint working
- [ ] 3 stats endpoints working
- [ ] Budget integration endpoints working
- [ ] All endpoints respond <500ms

#### Frontend

- [ ] Permission service working
- [ ] Validation service working
- [ ] Progress stepper displays correctly
- [ ] Status badge shows correct colors
- [ ] Pre-submission checklist functional
- [ ] Dashboard loads data correctly
- [ ] Mobile responsive

#### Integration

- [ ] Submit flow complete with validation
- [ ] Permission checks prevent unauthorized access
- [ ] Dashboard shows real-time data
- [ ] Toasts and dialogs working

### Testing Checklist

**Backend:**

1. Test permission guards on all routes
2. Test validation endpoint with various data
3. Test stats endpoints with different user permissions
4. Test budget integration accuracy

**Frontend:**

1. Test permission service matches backend
2. Test validation service (client + server)
3. Test all components render correctly
4. Test dashboard widgets load data
5. Test mobile responsiveness

---

## 🚀 DEPLOYMENT

### Pre-deployment

- [ ] All tests passing
- [ ] Migration ready
- [ ] Environment variables configured
- [ ] Documentation updated

### Steps

1. **Database**: `pnpm run db:migrate`
2. **Backend**: `pnpm run build:api`
3. **Frontend**: `pnpm run build:admin`
4. **Verify**: Health check, sample workflow

---

**Ready for Gemini Implementation! 🚀**

ไฟล์นี้อิงจากระบบที่มีอยู่จริง 100% - ไม่มีการสร้างใหม่ที่ซ้ำซ้อน
