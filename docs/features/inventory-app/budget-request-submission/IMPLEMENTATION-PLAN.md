# Budget Request Submission - Implementation Plan

**Version:** 1.0.0
**Date:** 2025-12-12
**Format:** Claude Planner

[← Back to Index](./README.md)

---

## GOAL

Implement a complete Budget Request Submission workflow with:

- Role-based permission system (4 roles)
- Pre-submission validation with checklist
- Budget allocation tracking and dashboard
- Integration with budget plans and allocations
- Audit trail and notification system

**Business Value:**

- Prevent unauthorized budget requests
- Ensure data quality before submission
- Real-time budget monitoring
- Clear approval workflow
- Complete audit trail

---

## INPUT

### Existing Resources

**Documentation (Complete):**

- [01-WORKFLOW-ANALYSIS.md](./01-WORKFLOW-ANALYSIS.md) - Status flow and transitions
- [02-PERMISSION-MATRIX.md](./02-PERMISSION-MATRIX.md) - Role definitions and permission rules
- [03-VALIDATION-RULES.md](./03-VALIDATION-RULES.md) - Field and business rule validation
- [04-DASHBOARD-SPEC.md](./04-DASHBOARD-SPEC.md) - Dashboard components and widgets
- [05-UI-UX-IMPROVEMENTS.md](./05-UI-UX-IMPROVEMENTS.md) - Progress stepper, dialogs, badges
- [06-INTEGRATION-SPEC.md](./06-INTEGRATION-SPEC.md) - Budget plans, allocations, notifications

**Database (Existing):**

- `inventory.budget_requests` - Main table with status enum
- `inventory.budget_request_items` - Line items with quarterly distribution
- `inventory.budget_request_comments` - Comments/notes
- `inventory.budget_request_audit` - Audit trail
- `inventory.budget_plans` - Annual budget plans
- `inventory.budget_plan_items` - Planned drugs
- `inventory.budget_allocations` - Budget allocated per department
- `inventory.departments` - Department master data
- `public.users` - User accounts
- `public.roles` - Role definitions

**API (Existing):**

- `GET /inventory/budget/budget-requests` - List requests
- `GET /inventory/budget/budget-requests/:id` - Get single request
- `POST /inventory/budget/budget-requests` - Create request
- `PUT /inventory/budget/budget-requests/:id` - Update request
- `DELETE /inventory/budget/budget-requests/:id` - Delete request
- `POST /inventory/budget/budget-requests/:id/submit` - Submit
- `POST /inventory/budget/budget-requests/:id/approve-dept` - Dept approval
- `POST /inventory/budget/budget-requests/:id/approve-finance` - Finance approval

---

## OUTPUT

### Deliverables

**Backend (Fastify/TypeScript):**

1. Permission service with role checking
2. Validation service (field + business rules)
3. New API endpoints (13 endpoints)
4. Budget integration service
5. Notification service
6. Audit trail service

**Frontend (Angular 18):**

1. Progress stepper component
2. Pre-submission checklist dialog
3. Validation feedback components
4. Status badge component
5. Dashboard pages (3 pages)
6. Dashboard widgets (7 widgets)

**Database:**

1. Permission records (13 permissions)
2. Role-permission assignments
3. Sample seed data

---

## QUESTIONS

### Clarifications Needed

1. **Budget Reservation System**
   - Should we implement budget reservation (reserve on submit, release on reject) now or later?
   - **Recommendation:** Skip for Phase 1, implement in Phase 2

2. **Notification Channels**
   - Email only, or also in-app notifications, or both?
   - **Recommendation:** Both (email + in-app)

3. **Reopen Limit**
   - Should there be a limit on how many times a rejected request can be reopened?
   - **Recommendation:** Max 2 reopens, then must create new request

4. **Quarterly Budget Enforcement**
   - Should we validate quarterly budget limits strictly, or just warn?
   - **Recommendation:** Warn only (soft validation)

5. **Multi-budget Type Support**
   - Can a single request have items from different budget types?
   - **Recommendation:** Yes, but validate each type's allocation separately

---

## DATA_MODEL

### Core Entities

```typescript
// Budget Request
interface BudgetRequest {
  id: number;
  request_number: string; // BR-2568-001
  fiscal_year: number; // 2568
  department_id: number;
  justification: string; // Min 20 chars
  status: BudgetRequestStatus; // ENUM

  // Submission tracking
  created_by: string;
  created_at: Date;
  submitted_by?: string;
  submitted_at?: Date;

  // Department approval
  dept_reviewed_by?: string;
  dept_reviewed_at?: Date;
  dept_comments?: string;

  // Finance approval
  finance_reviewed_by?: string;
  finance_reviewed_at?: Date;
  finance_comments?: string;

  // Rejection
  rejection_reason?: string;

  // Reopen
  reopened_by?: string;
  reopened_at?: Date;
  parent_request_id?: number;
  reopen_count: number; // Track reopens

  // Calculated
  total_requested_amount: number;

  // Relations
  items: BudgetRequestItem[];
  comments: BudgetRequestComment[];
  audit: BudgetRequestAudit[];
}

// Status Enum
enum BudgetRequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  DEPT_APPROVED = 'DEPT_APPROVED',
  FINANCE_APPROVED = 'FINANCE_APPROVED',
  REJECTED = 'REJECTED',
}

// Item
interface BudgetRequestItem {
  id: number;
  budget_request_id: number;
  line_number: number;
  generic_id: number;
  requested_qty: number;
  unit_price: number;
  requested_amount: number; // qty * price

  // Quarterly distribution
  q1_qty: number;
  q2_qty: number;
  q3_qty: number;
  q4_qty: number;

  // Budget classification
  budget_type_id: number;
  budget_category_id?: number;

  // Drug classification
  ed_category?: string;
  tmt_gpu_code?: string;
  working_code?: string;
}

// Audit Trail
interface BudgetRequestAudit {
  id: number;
  budget_request_id: number;
  action: string; // CREATED, SUBMITTED, APPROVED, etc.
  performed_by: string;
  performed_at: Date;
  old_status?: string;
  new_status?: string;
  changes?: any; // JSON
  comments?: string;
  ip_address?: string;
  user_agent?: string;
}
```

### Permissions

```typescript
// Permission definitions
const PERMISSIONS = {
  // Create & Edit
  'budget_requests.create': 'Create budget requests',
  'budget_requests.view_own': 'View own requests',
  'budget_requests.view_dept': 'View department requests',
  'budget_requests.view_all': 'View all requests',
  'budget_requests.edit_own': 'Edit own requests (DRAFT)',
  'budget_requests.edit_dept': 'Edit department requests (DRAFT)',
  'budget_requests.delete_own': 'Delete own requests (DRAFT)',

  // Workflow
  'budget_requests.submit': 'Submit for approval',
  'budget_requests.approve_dept': 'Department approval',
  'budget_requests.approve_finance': 'Finance approval',
  'budget_requests.reject': 'Reject requests',
  'budget_requests.reopen_own': 'Reopen own rejected requests',
  'budget_requests.reopen_dept': 'Reopen department rejected requests',
};

// Role assignments
const ROLE_PERMISSIONS = {
  'inventory.pharmacist': ['budget_requests.create', 'budget_requests.view_own', 'budget_requests.view_dept', 'budget_requests.edit_own', 'budget_requests.delete_own', 'budget_requests.submit', 'budget_requests.reopen_own'],
  'inventory.department_head': ['budget_requests.create', 'budget_requests.view_dept', 'budget_requests.edit_dept', 'budget_requests.submit', 'budget_requests.approve_dept', 'budget_requests.reject', 'budget_requests.reopen_dept'],
  'inventory.finance_manager': ['budget_requests.view_all', 'budget_requests.approve_finance', 'budget_requests.reject'],
  admin: ['*'], // All permissions
};
```

### Validation Rules

```typescript
// Validation result
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

// Validation rules
const VALIDATION_RULES = {
  // Header
  fiscal_year: { required: true, min: currentYear - 1, max: currentYear + 2 },
  department_id: { required: true },
  justification: { required_for_submit: true, minLength: 20, maxLength: 1000 },

  // Items
  min_items: 1,

  // Item fields
  generic_id: { required: true, no_duplicates: true },
  requested_qty: { required: true, min: 1, max: 999999999 },
  unit_price: { required: true, min: 0.01, max: 999999.99, decimals: 2 },

  // Quarterly distribution
  quarterly_sum_equals_total: true,

  // Budget type
  budget_type_id: { required: true },
  budget_category_id: { required_if_has_category: true },
};

// Business rules
const BUSINESS_RULES = {
  budget_allocation_check: true, // Must have sufficient budget
  drug_in_plan_warning: true, // Warn if drug not in plan
  duplicate_request_warning: true, // Warn if similar request exists
  high_utilization_warning: 0.8, // Warn if >80% budget used
  unusual_quantity_threshold: 10, // Warn if >10x average usage
  price_variance_threshold: 0.2, // Warn if price differs >20%
};
```

---

## API_SPEC

### New Endpoints to Implement

```typescript
// ============================================
// 1. PERMISSION ENDPOINTS
// ============================================

/**
 * Check if user can perform action on request
 */
GET /inventory/budget/budget-requests/:id/can/:action
Parameters:
  - id: number (request ID)
  - action: string (view | edit | submit | approve_dept | approve_finance | reject | reopen)
Response:
{
  "can_perform": boolean,
  "reason"?: string  // If false
}

// ============================================
// 2. VALIDATION ENDPOINTS
// ============================================

/**
 * Validate request before submit
 */
POST /inventory/budget/budget-requests/:id/validate
Response:
{
  "valid": boolean,
  "errors": string[],
  "warnings": string[],
  "info": string[]
}

// ============================================
// 3. BUDGET INTEGRATION ENDPOINTS
// ============================================

/**
 * Check if drugs are in budget plan
 */
POST /inventory/budget/budget-plans/check-drugs
Request Body:
{
  "fiscal_year": number,
  "department_id": number,
  "drug_ids": number[]
}
Response:
{
  "plan_exists": boolean,
  "plan_id"?: number,
  "results": Array<{
    "generic_id": number,
    "in_plan": boolean,
    "planned_qty"?: number,
    "warning"?: string
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
Request Body:
{
  "fiscal_year": number,
  "department_id": number,
  "budget_type_id": number,
  "amount": number,
  "quarter"?: number
}
Response:
{
  "available": boolean,
  "allocation": {
    "id": number,
    "total_budget": number,
    "total_used": number,
    "total_reserved": number,
    "remaining_budget": number
  },
  "impact": {
    "before": { "available": number, "utilization_percent": number },
    "after": { "available": number, "utilization_percent": number }
  },
  "warnings": string[]
}

// ============================================
// 4. DASHBOARD ENDPOINTS
// ============================================

/**
 * Get dashboard stats
 */
GET /inventory/budget/budget-requests/stats/total
GET /inventory/budget/budget-requests/stats/pending
GET /inventory/budget/budget-requests/stats/approved
GET /inventory/budget/budget-requests/status-summary

/**
 * Get budget allocation summary
 */
GET /inventory/budget/allocations/summary?fiscal_year={year}&department_id={id}

/**
 * Get pending actions for current user
 */
GET /inventory/budget/budget-requests/my-pending-actions

/**
 * Get recent requests
 */
GET /inventory/budget/budget-requests/recent?limit={n}

/**
 * Get quarterly breakdown
 */
GET /inventory/budget/allocations/quarterly-breakdown?fiscal_year={year}

/**
 * Get spending trend
 */
GET /inventory/budget/allocations/spending-trend?fiscal_year={year}&months={n}

// ============================================
// 5. AUDIT & NOTIFICATIONS
// ============================================

/**
 * Get audit trail
 */
GET /inventory/budget/budget-requests/:id/audit-trail

/**
 * Get timeline
 */
GET /inventory/budget/budget-requests/:id/timeline
```

---

## UI_SPEC

### Component Hierarchy

```
BudgetRequestModule
├── Pages
│   ├── BudgetRequestListPage
│   ├── BudgetRequestDetailPage
│   └── DashboardPages
│       ├── OverviewDashboardPage
│       ├── BudgetTrackingDashboardPage
│       └── RequestStatusDashboardPage
│
├── Components
│   ├── BudgetRequestProgressStepperComponent
│   ├── BudgetRequestStatusBadgeComponent
│   ├── BudgetRequestActionBarComponent
│   ├── BudgetProgressBarComponent
│   └── ValidationFeedbackComponent
│
├── Dialogs
│   ├── PreSubmissionChecklistDialog
│   ├── ConfirmActionDialog
│   └── ValidationErrorsDialog
│
├── Widgets
│   ├── StatsCardComponent
│   ├── PendingActionsWidgetComponent
│   ├── RecentRequestsWidgetComponent
│   ├── BudgetAllocationStatusWidgetComponent
│   ├── QuarterlyBreakdownComponent
│   ├── SpendingTrendChartComponent
│   └── ApprovalTimelineWidgetComponent
│
└── Services
    ├── BudgetRequestService
    ├── BudgetRequestPermissionService
    ├── BudgetRequestValidationService
    ├── BudgetAllocationService
    └── NotificationService
```

### Key Components Specification

#### 1. Progress Stepper Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.ts`

**Purpose:** Visual progress indicator showing workflow status

**Inputs:**

- `budgetRequest: BudgetRequest` - The request object

**Features:**

- Mat-stepper with 4 steps (DRAFT, SUBMITTED, DEPT_APPROVED, FINANCE_APPROVED)
- Shows current status, completed steps, pending steps
- Displays timestamps and user names for each step
- Special handling for REJECTED status

#### 2. Pre-submission Checklist Dialog

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.ts`

**Purpose:** Validation summary before submit

**Inputs:**

- `request: BudgetRequest` - The request to validate
- `validation: ValidationResults` - Validation results
- `budgetImpact: BudgetImpact` - Budget impact calculation

**Features:**

- Show all validation errors (blocking)
- Show warnings (non-blocking)
- Display budget impact summary
- Require checkbox confirmation before submit

#### 3. Status Badge Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/budget-request-status-badge.component.ts`

**Purpose:** Color-coded status indicator

**Inputs:**

- `status: BudgetRequestStatus` - Current status

**Features:**

- Different colors for each status
- Icon + text label
- Responsive sizing

#### 4. Dashboard Widgets

**Files:**

- `stats-card/stats-card.component.ts` - Reusable stat card
- `pending-actions-widget/pending-actions-widget.component.ts` - Pending approvals
- `budget-progress-bar/budget-progress-bar.component.ts` - Budget usage bar
- `quarterly-breakdown/quarterly-breakdown.component.ts` - Quarterly table
- `spending-trend-chart/spending-trend-chart.component.ts` - Line chart

---

## TASKS

### Phase 1: Backend - Permission & Validation (Priority: HIGH)

**Objective:** Implement permission system and validation logic

#### Task 1.1: Create Permission Service

**File:** `apps/api/src/core/permissions/budget-request-permissions.service.ts`

**Steps:**

1. Create service class with dependency injection
2. Implement `canView(userId, requestId)` method
3. Implement `canEdit(userId, requestId)` method
4. Implement `canApproveDepartment(userId, requestId)` method
5. Implement `canApproveFinance(userId, requestId)` method
6. Add helper methods: `getUserWithRoles()`, `getBudgetRequest()`, `hasRole()`, `isAdmin()`
7. Write unit tests

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/core/permissions/budget-request-permissions.service.ts`
- CREATE: `apps/api/src/core/permissions/budget-request-permissions.service.spec.ts`

**Acceptance Criteria:**

- ✅ All role checks work correctly
- ✅ Self-approval prevention works
- ✅ Department-based filtering works
- ✅ Unit tests pass (coverage >80%)

---

#### Task 1.2: Create Permission Guard

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/guards/budget-request.guard.ts`

**Steps:**

1. Create Fastify preValidation hook
2. Read permission requirement from route config
3. Call permission service
4. Return 403 if no permission (use `reply.forbidden()` - NOT throw Error)
5. Apply guard to routes

**Dependencies:** Task 1.1

**Files to create/modify:**

- CREATE: `apps/api/src/modules/inventory/operations/budgetRequests/guards/budget-request.guard.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`

**Acceptance Criteria:**

- ✅ Guard blocks unauthorized access
- ✅ Guard allows authorized access
- ✅ Proper error messages returned
- ✅ No request timeouts (must use reply.forbidden(), not throw)

---

#### Task 1.3: Create Validation Service

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/services/budget-request-validation.service.ts`

**Steps:**

1. Create service class
2. Implement field-level validation methods
3. Implement business rule validation methods
4. Implement `validateForSubmit()` method
5. Add helper methods for budget/plan checks
6. Write unit tests

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/modules/inventory/operations/budgetRequests/services/budget-request-validation.service.ts`
- CREATE: `apps/api/src/modules/inventory/operations/budgetRequests/services/budget-request-validation.service.spec.ts`

**Acceptance Criteria:**

- ✅ All validation rules implemented
- ✅ Returns errors, warnings, and info separately
- ✅ Quarterly sum validation works
- ✅ Budget check integration works

---

#### Task 1.4: Add Validation Endpoint

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`

**Steps:**

1. Add `POST /budget-requests/:id/validate` route
2. Add TypeBox schema for response
3. Call validation service
4. Return validation results
5. Test endpoint

**Dependencies:** Task 1.3

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.controller.ts`

**Acceptance Criteria:**

- ✅ Endpoint returns validation results
- ✅ Response matches TypeBox schema
- ✅ Works for all validation scenarios

---

#### Task 1.5: Insert Permission Records

**File:** `apps/api/src/database/seeds/budget-request-permissions.seed.ts`

**Steps:**

1. Create seed file
2. Insert 13 permission records
3. Assign permissions to roles (pharmacist, dept_head, finance_manager)
4. Run seed script
5. Verify in database

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/database/seeds/budget-request-permissions.seed.ts`
- MODIFY: `apps/api/src/database/seeds/index.ts`

**Acceptance Criteria:**

- ✅ All permissions inserted
- ✅ All role assignments correct
- ✅ Seed is idempotent (can run multiple times)

---

### Phase 2: Backend - API Endpoints (Priority: HIGH)

**Objective:** Implement new API endpoints for integrations and dashboard

#### Task 2.1: Budget Plan Integration

**File:** `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.service.ts`

**Steps:**

1. Add `checkDrugsInPlan()` method
2. Query approved budget plan
3. Query plan items
4. Compare requested drugs vs plan
5. Return results with warnings
6. Create route and controller

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetPlans/budget-plans.controller.ts`

**Acceptance Criteria:**

- ✅ Returns plan status correctly
- ✅ Identifies drugs not in plan
- ✅ Returns summary statistics
- ✅ Handles "no plan" scenario

---

#### Task 2.2: Budget Allocation Check

**File:** `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`

**Steps:**

1. Add `checkAvailability()` method
2. Query budget allocations
3. Calculate used, reserved, available
4. Calculate impact (before/after)
5. Generate warnings if needed
6. Create route and controller

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.controller.ts`

**Acceptance Criteria:**

- ✅ Correctly calculates available budget
- ✅ Returns impact analysis
- ✅ Generates high utilization warnings
- ✅ Supports quarterly filtering

---

#### Task 2.3: Dashboard Stats Endpoints

**Files:** Multiple route/controller files

**Steps:**

1. Implement `/stats/total` endpoint
2. Implement `/stats/pending` endpoint
3. Implement `/stats/approved` endpoint
4. Implement `/status-summary` endpoint
5. Add proper filtering by role/department
6. Test all endpoints

**Dependencies:** Task 1.1 (permission service)

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.controller.ts`

**Acceptance Criteria:**

- ✅ All stats endpoints return correct data
- ✅ Data filtered by user permission
- ✅ Response times <500ms
- ✅ Proper caching implemented

---

#### Task 2.4: Budget Allocation Summary & Breakdown

**File:** `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`

**Steps:**

1. Implement `getSummary()` method
2. Implement `getQuarterlyBreakdown()` method
3. Implement `getSpendingTrend()` method
4. Add routes and controllers
5. Test all endpoints

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetAllocations/budget-allocations.controller.ts`

**Acceptance Criteria:**

- ✅ Summary includes all budget types
- ✅ Quarterly breakdown accurate
- ✅ Spending trend shows 12 months
- ✅ Data aggregation correct

---

#### Task 2.5: My Pending Actions & Recent Requests

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`

**Steps:**

1. Implement `getMyPendingActions()` method
2. Filter by user role (dept head sees SUBMITTED, finance sees DEPT_APPROVED)
3. Calculate days waiting
4. Implement `getRecentRequests()` method
5. Add routes and controllers

**Dependencies:** Task 1.1

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.controller.ts`

**Acceptance Criteria:**

- ✅ Pending actions filtered by role
- ✅ Days waiting calculated correctly
- ✅ Recent requests sorted by date
- ✅ Limit parameter works

---

### Phase 3: Backend - Audit & Notifications (Priority: MEDIUM)

**Objective:** Implement audit trail and notification system

#### Task 3.1: Audit Trail Service

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/services/audit-trail.service.ts`

**Steps:**

1. Create audit service
2. Implement `createAuditRecord()` method
3. Capture IP address and user agent
4. Add audit calls to all workflow actions
5. Implement `getAuditTrail()` endpoint
6. Implement `getTimeline()` endpoint

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/modules/inventory/operations/budgetRequests/services/audit-trail.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`

**Acceptance Criteria:**

- ✅ All actions logged to audit table
- ✅ Audit trail complete and accurate
- ✅ Timeline shows progression correctly
- ✅ User info captured

---

#### Task 3.2: Notification Service

**File:** `apps/api/src/modules/notifications/notification.service.ts`

**Steps:**

1. Create notification service
2. Implement email sending (use existing email service)
3. Implement in-app notification creation
4. Create notification methods:
   - `notifyBudgetRequestSubmitted()`
   - `notifyBudgetRequestApproved()`
   - `notifyBudgetRequestRejected()`
5. Integrate with workflow actions
6. Create email templates

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/api/src/modules/notifications/notification.service.ts`
- CREATE: `apps/api/src/modules/notifications/templates/budget-request-*.html` (3 templates)
- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`

**Acceptance Criteria:**

- ✅ Email sent on submit/approve/reject
- ✅ In-app notification created
- ✅ Correct users notified
- ✅ Templates render correctly

---

#### Task 3.3: Update Workflow Actions with Integrations

**File:** `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`

**Steps:**

1. Update `submitBudgetRequest()` - add validation, audit, notification
2. Update `approveDepartment()` - add permission check, audit, notification
3. Update `approveFinance()` - add budget update, audit, notification
4. Update `rejectRequest()` - add audit, notification
5. Use database transactions for atomic operations
6. Test all workflows

**Dependencies:** Task 3.1, Task 3.2, Task 2.2

**Files to create/modify:**

- MODIFY: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`

**Acceptance Criteria:**

- ✅ All workflows include audit trail
- ✅ All workflows send notifications
- ✅ Budget updated on finance approval
- ✅ Transactions rollback on error
- ✅ No partial updates

---

### Phase 4: Frontend - Core Components (Priority: HIGH)

**Objective:** Build reusable components and services

#### Task 4.1: Permission Service (Frontend)

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.ts`

**Steps:**

1. Create service with signals
2. Inject AuthService to get current user
3. Implement permission checking methods:
   - `canView(request)`
   - `canEdit(request)`
   - `canApproveDepartment(request)`
   - `canApproveFinance(request)`
   - `canReopen(request)`
4. Match backend logic
5. Write unit tests

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.spec.ts`

**Acceptance Criteria:**

- ✅ All permission methods work
- ✅ Uses signals for reactivity
- ✅ Matches backend logic
- ✅ Tests pass

---

#### Task 4.2: Validation Service (Frontend)

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.ts`

**Steps:**

1. Create service
2. Implement field validators
3. Implement `validateForSubmit()` method
4. Call backend validation endpoint
5. Merge client + server validation results
6. Write unit tests

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.spec.ts`

**Acceptance Criteria:**

- ✅ Client-side validation works
- ✅ Calls backend for full validation
- ✅ Returns errors/warnings/info
- ✅ Fast response (<100ms for client-only)

---

#### Task 4.3: Progress Stepper Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.ts`

**Steps:**

1. Create standalone component
2. Use mat-stepper
3. Define 4 steps with labels
4. Compute current step from status
5. Show timestamps and users
6. Handle REJECTED status separately
7. Add styles
8. Test component

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.scss`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/budget-request-progress-stepper.component.spec.ts`

**Acceptance Criteria:**

- ✅ Shows correct current step
- ✅ Displays user names and dates
- ✅ Rejected status shown prominently
- ✅ Responsive on mobile

---

#### Task 4.4: Status Badge Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/budget-request-status-badge.component.ts`

**Steps:**

1. Create standalone component
2. Define color mapping for each status
3. Define icon mapping
4. Add styles with CSS variables
5. Test all status variants

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/budget-request-status-badge.component.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/budget-request-status-badge.component.scss`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/budget-request-status-badge.component.spec.ts`

**Acceptance Criteria:**

- ✅ Correct colors for each status
- ✅ Correct icons displayed
- ✅ Readable on all backgrounds
- ✅ Component reusable

---

#### Task 4.5: Pre-submission Checklist Dialog

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.ts`

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

**Dependencies:** Task 4.2

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.scss`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/pre-submission-checklist.dialog.spec.ts`

**Acceptance Criteria:**

- ✅ Shows all validation results
- ✅ Budget impact calculated correctly
- ✅ Submit disabled until confirmed
- ✅ Returns true/false on close

---

### Phase 5: Frontend - Dashboard (Priority: MEDIUM)

**Objective:** Build dashboard pages and widgets

#### Task 5.1: Stats Card Component (Reusable)

**File:** `apps/web/src/app/shared/components/stats-card/stats-card.component.ts`

**Steps:**

1. Create reusable standalone component
2. Inputs: title, value, icon, color, badge, change
3. Use mat-card
4. Display icon, value, change indicator
5. Add styles
6. Test component

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/shared/components/stats-card/stats-card.component.ts`
- CREATE: `apps/web/src/app/shared/components/stats-card/stats-card.component.scss`
- CREATE: `apps/web/src/app/shared/components/stats-card/stats-card.component.spec.ts`

**Acceptance Criteria:**

- ✅ Accepts all inputs correctly
- ✅ Displays data correctly
- ✅ Responsive design
- ✅ Reusable across modules

---

#### Task 5.2: Budget Progress Bar Component

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-progress-bar/budget-progress-bar.component.ts`

**Steps:**

1. Create component
2. Inputs: budgetType, allocated, used, reserved
3. Calculate available and percentage
4. Use mat-progress-bar
5. Color based on utilization (green <70%, yellow 70-90%, red >90%)
6. Show details (available, reserved, used)
7. Test component

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-progress-bar/budget-progress-bar.component.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-progress-bar/budget-progress-bar.component.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-progress-bar/budget-progress-bar.component.scss`

**Acceptance Criteria:**

- ✅ Calculates percentage correctly
- ✅ Colors change based on utilization
- ✅ Shows breakdown details
- ✅ Responsive

---

#### Task 5.3: Pending Actions Widget

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/widgets/pending-actions-widget/pending-actions-widget.component.ts`

**Steps:**

1. Create widget component
2. Call `/my-pending-actions` API
3. Display pending requests in mat-list
4. Show days waiting
5. Mark urgent (>7 days) with warning icon
6. Make request numbers clickable
7. Test widget

**Dependencies:** Task 2.5

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/widgets/pending-actions-widget/pending-actions-widget.component.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/widgets/pending-actions-widget/pending-actions-widget.component.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/widgets/pending-actions-widget/pending-actions-widget.component.scss`

**Acceptance Criteria:**

- ✅ Loads pending actions
- ✅ Displays correctly
- ✅ Urgent items highlighted
- ✅ Links work

---

#### Task 5.4: Overview Dashboard Page

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/pages/overview-dashboard/overview-dashboard.page.ts`

**Steps:**

1. Create page component
2. Add 4 stats cards (total, pending, approved, budget usage)
3. Add budget allocation status widget
4. Add recent requests widget
5. Add pending actions widget
6. Arrange with responsive grid layout
7. Load all data on init
8. Test page

**Dependencies:** Task 5.1, Task 5.2, Task 5.3, Task 2.3

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/overview-dashboard/overview-dashboard.page.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/overview-dashboard/overview-dashboard.page.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/overview-dashboard/overview-dashboard.page.scss`

**Acceptance Criteria:**

- ✅ All widgets display correctly
- ✅ Data loads on init
- ✅ Responsive layout
- ✅ Performance <2s load time

---

#### Task 5.5: Budget Tracking Dashboard Page

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-tracking-dashboard/budget-tracking-dashboard.page.ts`

**Steps:**

1. Create page component
2. Add annual budget overview section
3. Add quarterly breakdown table
4. Add spending trend chart (use Chart.js or ngx-charts)
5. Add budget type breakdown
6. Add export functionality
7. Test page

**Dependencies:** Task 2.4

**Files to create/modify:**

- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-tracking-dashboard/budget-tracking-dashboard.page.ts`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-tracking-dashboard/budget-tracking-dashboard.page.html`
- CREATE: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-tracking-dashboard/budget-tracking-dashboard.page.scss`

**Acceptance Criteria:**

- ✅ All charts render correctly
- ✅ Data accurate
- ✅ Export works
- ✅ Responsive

---

### Phase 6: Frontend - Integration & Polish (Priority: MEDIUM)

**Objective:** Integrate all components and add final touches

#### Task 6.1: Update Detail Page with New Components

**File:** `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-request-detail/budget-request-detail.page.ts`

**Steps:**

1. Add progress stepper at top
2. Add status badge
3. Add smart action bar with permission checks
4. Add inline validation feedback
5. Integrate pre-submission checklist dialog
6. Test all interactions

**Dependencies:** Task 4.3, Task 4.4, Task 4.5

**Files to create/modify:**

- MODIFY: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-request-detail/budget-request-detail.page.ts`
- MODIFY: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-request-detail/budget-request-detail.page.html`

**Acceptance Criteria:**

- ✅ Progress stepper shows correct status
- ✅ Action buttons show/hide based on permission
- ✅ Validation works
- ✅ Submit flow complete

---

#### Task 6.2: Add Toast Notifications

**File:** Various action methods

**Steps:**

1. Inject MatSnackBar
2. Add success toasts (submit, approve, save)
3. Add error toasts (validation fail, permission denied)
4. Add warning toasts (unsaved changes, high budget usage)
5. Test all notifications

**Dependencies:** None

**Files to create/modify:**

- MODIFY: `apps/web/src/app/features/inventory/modules/budget-requests/pages/budget-request-detail/budget-request-detail.page.ts`
- MODIFY: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request.service.ts`

**Acceptance Criteria:**

- ✅ Toasts show on all actions
- ✅ Correct messages
- ✅ Proper styling
- ✅ Auto-dismiss timing appropriate

---

#### Task 6.3: Add Confirmation Dialogs

**File:** `apps/web/src/app/shared/dialogs/confirm-dialog/confirm-dialog.component.ts`

**Steps:**

1. Create reusable confirm dialog
2. Support: title, message, content (HTML), requireReason, confirmText, cancelText
3. Use for reject, delete, approve with warning
4. Test all scenarios

**Dependencies:** None

**Files to create/modify:**

- CREATE: `apps/web/src/app/shared/dialogs/confirm-dialog/confirm-dialog.component.ts`
- CREATE: `apps/web/src/app/shared/dialogs/confirm-dialog/confirm-dialog.component.html`
- CREATE: `apps/web/src/app/shared/dialogs/confirm-dialog/confirm-dialog.component.scss`

**Acceptance Criteria:**

- ✅ Dialog reusable
- ✅ Reason input works
- ✅ Returns confirmation + reason
- ✅ Styling consistent

---

#### Task 6.4: Mobile Responsiveness

**Files:** All component SCSS files

**Steps:**

1. Add responsive breakpoints (@media queries)
2. Test action bar on mobile (stack vertically)
3. Test tables on mobile (card layout)
4. Test dashboard on mobile (single column)
5. Test stepper on mobile
6. Fix any layout issues

**Dependencies:** All frontend tasks

**Files to create/modify:**

- MODIFY: All component SCSS files

**Acceptance Criteria:**

- ✅ All pages work on mobile
- ✅ No horizontal scroll
- ✅ Touch-friendly buttons
- ✅ Readable text

---

#### Task 6.5: E2E Testing

**File:** `apps/web-e2e/src/e2e/budget-request-submission.cy.ts`

**Steps:**

1. Write Cypress E2E test
2. Test complete submission flow (create → submit → approve dept → approve finance)
3. Test rejection flow
4. Test reopen flow
5. Test permission blocking
6. Run tests

**Dependencies:** All tasks complete

**Files to create/modify:**

- CREATE: `apps/web-e2e/src/e2e/budget-request-submission.cy.ts`

**Acceptance Criteria:**

- ✅ All flows tested
- ✅ Tests pass consistently
- ✅ Coverage >80%

---

## REVIEW

### Success Criteria

#### Backend

- [ ] All 13 new API endpoints working
- [ ] Permission system enforcing all 4 roles correctly
- [ ] Validation service catching all errors/warnings
- [ ] Budget integration updating allocations correctly
- [ ] Audit trail capturing all actions
- [ ] Notifications sent on all events
- [ ] All endpoints respond <500ms
- [ ] Unit test coverage >80%

#### Frontend

- [ ] Progress stepper showing correct status
- [ ] Permission-based UI (buttons show/hide correctly)
- [ ] Pre-submission checklist working
- [ ] Dashboard loading all data correctly
- [ ] All charts/graphs rendering
- [ ] Toasts and dialogs working
- [ ] Mobile responsive
- [ ] E2E tests passing

#### Integration

- [ ] Submit flow complete (DRAFT → SUBMITTED)
- [ ] Department approval flow complete (SUBMITTED → DEPT_APPROVED)
- [ ] Finance approval flow complete (DEPT_APPROVED → FINANCE_APPROVED)
- [ ] Budget updated after finance approval
- [ ] Rejection flow working
- [ ] Reopen flow working
- [ ] Notifications sent to correct users
- [ ] Audit trail complete

### Testing Checklist

#### Manual Testing

1. **Create Request**
   - [ ] Pharmacist can create
   - [ ] Finance manager cannot create
   - [ ] Department filter works

2. **Edit Request**
   - [ ] Pharmacist can edit own DRAFT
   - [ ] Pharmacist cannot edit others' DRAFT
   - [ ] Department head can edit any dept DRAFT
   - [ ] Cannot edit after SUBMITTED

3. **Submit Request**
   - [ ] Validation errors block submit
   - [ ] Warnings shown in checklist
   - [ ] Budget impact shown
   - [ ] Status changes to SUBMITTED
   - [ ] Department head notified

4. **Department Approval**
   - [ ] Only dept head can approve
   - [ ] Cannot approve own request
   - [ ] Status changes to DEPT_APPROVED
   - [ ] Finance manager notified
   - [ ] Requester notified

5. **Finance Approval**
   - [ ] Only finance manager can approve
   - [ ] Budget availability checked
   - [ ] Insufficient budget blocks approval
   - [ ] Budget allocation updated
   - [ ] Status changes to FINANCE_APPROVED
   - [ ] All parties notified

6. **Rejection**
   - [ ] Dept head can reject SUBMITTED
   - [ ] Finance can reject DEPT_APPROVED
   - [ ] Reason required
   - [ ] Status changes to REJECTED
   - [ ] Requester notified

7. **Reopen**
   - [ ] Requester can reopen own rejected
   - [ ] Dept head can reopen any dept rejected
   - [ ] Status changes back to DRAFT
   - [ ] Can edit again

8. **Dashboard**
   - [ ] Stats cards show correct numbers
   - [ ] Budget progress bars accurate
   - [ ] Pending actions filtered by role
   - [ ] Charts render correctly

### Performance Benchmarks

- [ ] API response time <500ms (average)
- [ ] Dashboard load time <2s
- [ ] Validation response <200ms (client-side)
- [ ] Database queries optimized (use indexes)
- [ ] No N+1 query issues

### Security Checklist

- [ ] All routes protected by authentication
- [ ] Permission checks on all actions
- [ ] SQL injection prevented (use TypeBox + Prisma)
- [ ] XSS prevented (Angular sanitization)
- [ ] CSRF tokens in place
- [ ] Audit trail complete and immutable

---

## DEPLOYMENT

### Pre-deployment Checklist

- [ ] All tests passing (unit + E2E)
- [ ] Database migrations ready
- [ ] Seed data ready
- [ ] Environment variables configured
- [ ] API documentation updated
- [ ] User guide prepared

### Deployment Steps

1. **Database**

   ```bash
   pnpm run db:migrate
   pnpm run db:seed
   ```

2. **Backend**

   ```bash
   pnpm run build:api
   pnpm run start:api
   ```

3. **Frontend**

   ```bash
   pnpm run build:admin
   ```

4. **Verification**
   - [ ] Health check passes
   - [ ] Sample request can be created
   - [ ] Sample workflow completes
   - [ ] Dashboard loads

---

## APPENDIX

### File Path Reference

**Backend:**

- Permissions: `apps/api/src/core/permissions/budget-request-permissions.service.ts`
- Validation: `apps/api/src/modules/inventory/operations/budgetRequests/services/budget-request-validation.service.ts`
- Audit: `apps/api/src/modules/inventory/operations/budgetRequests/services/audit-trail.service.ts`
- Notifications: `apps/api/src/modules/notifications/notification.service.ts`
- Routes: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.route.ts`
- Controller: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.controller.ts`
- Service: `apps/api/src/modules/inventory/operations/budgetRequests/budget-requests.service.ts`

**Frontend:**

- Permission Service: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-permission.service.ts`
- Validation Service: `apps/web/src/app/features/inventory/modules/budget-requests/services/budget-request-validation.service.ts`
- Progress Stepper: `apps/web/src/app/features/inventory/modules/budget-requests/components/budget-request-progress-stepper/`
- Status Badge: `apps/web/src/app/features/inventory/modules/budget-requests/components/status-badge/`
- Pre-submission Dialog: `apps/web/src/app/features/inventory/modules/budget-requests/dialogs/pre-submission-checklist/`
- Dashboard Pages: `apps/web/src/app/features/inventory/modules/budget-requests/pages/`

### API Endpoint Summary

**New Endpoints:**

```
GET    /inventory/budget/budget-requests/:id/can/:action
POST   /inventory/budget/budget-requests/:id/validate
POST   /inventory/budget/budget-plans/check-drugs
POST   /inventory/budget/allocations/check-availability
GET    /inventory/budget/budget-requests/stats/total
GET    /inventory/budget/budget-requests/stats/pending
GET    /inventory/budget/budget-requests/stats/approved
GET    /inventory/budget/budget-requests/status-summary
GET    /inventory/budget/allocations/summary
GET    /inventory/budget/budget-requests/my-pending-actions
GET    /inventory/budget/budget-requests/recent
GET    /inventory/budget/allocations/quarterly-breakdown
GET    /inventory/budget/allocations/spending-trend
GET    /inventory/budget/budget-requests/:id/audit-trail
GET    /inventory/budget/budget-requests/:id/timeline
```

---

**Ready for Gemini Implementation! 🚀**

[← Back to Index](./README.md)
