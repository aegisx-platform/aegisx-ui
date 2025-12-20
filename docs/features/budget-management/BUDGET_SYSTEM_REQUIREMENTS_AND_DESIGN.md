# Hospital Budget Management System - Requirements & Design Summary

**Document Version:** 1.0
**Date:** December 19, 2025
**Status:** Pending Opus Review
**Purpose:** Comprehensive summary for architectural review and validation against hospital standards

---

## Executive Summary

This document summarizes the complete requirements, design decisions, and workflow for the hospital's budget management system. The system supports **central budget procurement** where a central warehouse purchases for all departments from a single annual budget pool.

**Key Business Model:**

- Central budget (not per-department)
- Central warehouse purchases for entire hospital
- One budget request per fiscal year (collaborative editing)
- Quarterly planning and tracking (Q1-Q4)
- Configurable budget control (Soft/Hard) per item

---

## 1. Business Requirements

### BR-1: Central Budget Management

**Priority:** Critical

**Context:**

- Hospital uses CENTRAL budget pool (not separated by department)
- Central warehouse ("คลังกลาง") purchases for all departments
- One consolidated budget request per fiscal year
- Multiple users from different departments collaborate on the same request

**Requirements:**

- ✅ Support null department_id for central requests
- ✅ Use department_id=1 (คลังกลาง/งบรวม) for budget allocations
- ✅ All departments reserve from same central pool when creating PR/PO
- ✅ Track purchases across entire hospital, not per department

---

### BR-2: Quarterly Planning and Tracking

**Priority:** High

**Context:**

- Thai fiscal year: October 1 - September 30
- Budget divided into 4 quarters
- Need to track both PLANNED and ACTUAL purchases per quarter

**Requirements:**

- ✅ Plan quantities per quarter (q1_qty, q2_qty, q3_qty, q4_qty)
- ✅ Track actual purchases per quarter (q1_purchased_qty, etc.)
- ✅ Calculate variance: Planned vs Actual
- ✅ Display remaining budget per quarter

**Example:**

```
Item: Paracetamol 500mg
Q1 Planned: 1000 tablets → Q1 Purchased: 950 tablets (95%)
Q2 Planned: 1200 tablets → Q2 Purchased: 1250 tablets (104%)
```

---

### BR-3: Item-Level Budget Control

**Priority:** High

**Context:**

- Some items require strict budget control (critical drugs)
- Some items can have flexible tolerance (general supplies)
- Some items don't need budget checking (vitamins, supplements)

**Requirements:**

- ✅ Configurable control type per item: NONE, SOFT, HARD
- ✅ Configurable price variance tolerance (e.g., ±10%)
- ✅ HARD control: Block purchase if exceeds budget
- ✅ SOFT control: Show warning but allow purchase
- ✅ NONE control: No budget checking

**Examples:**

**Paracetamol (HARD Control):**

```
Budgeted: 1000 tablets @ 5 THB = 5,000 THB
Already purchased: 900 tablets = 4,500 THB
PR tries to buy: 200 tablets
Result: ❌ BLOCKED - Exceeds budget by 100 tablets
```

**Ibuprofen (SOFT Control, 10% tolerance):**

```
Budgeted: 500 tablets @ 10 THB = 5,000 THB
Already purchased: 480 tablets = 4,800 THB
PR tries to buy: 30 tablets @ 11 THB (price variance 10%)
Result: ⚠️ WARNING - Price 10% higher, but allowed
```

**Vitamin C (NONE Control):**

```
No budget checking - Always allow purchase
```

---

### BR-4: Historical Data for Planning

**Priority:** Medium

**Context:**

- Need past usage data to estimate future needs
- Old system (invs) tracked 3 years of historical data

**Requirements:**

- ✅ Store last_year_qty (previous fiscal year usage)
- ✅ Store two_years_ago_qty
- ✅ Store three_years_ago_qty
- ✅ Calculate 3-year average for planning
- ✅ Display trend analysis in UI

---

### BR-5: Workflow Simplification

**Priority:** High

**Context:**

- Original design had separate Budget Request and Budget Planning
- Now both workflows are redundant (same data, same purpose)

**Requirements:**

- ✅ Eliminate Budget Planning workflow
- ✅ Budget Request serves both purposes: Request + Planning
- ✅ Q1-Q4 fields in Budget Request handle planning
- ✅ Drop budget_plans, budget_plan_items tables

**Why?**
Budget Request already has all planning fields (q1_qty, q2_qty, q3_qty, q4_qty), so Budget Planning is duplicate work.

---

## 2. Complete Workflow

### Phase 1: Budget Request Creation (Annual)

**Participants:** Finance Officer, Department Heads, Pharmacy

**Steps:**

1. Finance creates Budget Request for fiscal year 2568
   - department_id = null (central budget)
   - Status: DRAFT
2. Users add drug items with quantities:
   - generic_id, requested_qty, unit_price
   - q1_qty, q2_qty, q3_qty, q4_qty (quarterly breakdown)
   - budget_type_id (e.g., ยาหลัก, ยาผู้ป่วยใน)
3. Set budget control per item:
   - quantity_control_type: NONE/SOFT/HARD
   - price_control_type: NONE/SOFT/HARD
   - price_variance_percent: 10
4. Submit for approval (Status: SUBMITTED)

**Database Actions:**

```sql
INSERT INTO budget_requests (fiscal_year, department_id, status)
VALUES (2568, NULL, 'DRAFT');

INSERT INTO budget_request_items (
  budget_request_id,
  generic_id,
  requested_qty,
  q1_qty, q2_qty, q3_qty, q4_qty,
  unit_price,
  quantity_control_type,
  price_control_type,
  price_variance_percent
) VALUES (...);
```

---

### Phase 2: Department Approval

**Participants:** Department Director

**Steps:**

1. Review budget request items
2. Approve (Status: DEPT_APPROVED)

**Database Actions:**

```sql
UPDATE budget_requests
SET status = 'DEPT_APPROVED',
    dept_reviewed_by = 'user-123',
    dept_reviewed_at = NOW()
WHERE id = 1;
```

---

### Phase 3: Finance Approval

**Participants:** Finance Manager

**Steps:**

1. Review total budget amounts
2. Approve (Status: FINANCE_APPROVED)
3. **System creates budget_allocations**

**Database Actions:**

```sql
-- Update status
UPDATE budget_requests
SET status = 'FINANCE_APPROVED',
    finance_reviewed_by = 'user-456',
    finance_reviewed_at = NOW()
WHERE id = 1;

-- Create budget_allocations for central pool
INSERT INTO budget_allocations (
  fiscal_year,
  budget_id,
  department_id,           -- = 1 (คลังกลาง/งบรวม)
  total_budget,
  q1_budget, q2_budget, q3_budget, q4_budget,
  remaining_budget,
  total_spent,
  is_active
) VALUES (...);
```

**Key Point:** All allocations use department_id=1 (central pool), not actual department IDs.

---

### Phase 4: Purchase Request (PR) Creation

**Participants:** Pharmacy, Department staff

**Steps:**

1. Department creates PR for specific items
2. **System checks budget availability:**
   - Call check_budget_availability() for total budget
   - Call check_item_budget_control() for item-level budget
3. If available, **reserve budget:**
   - Call reserve_budget() to lock budget
   - Create budget_reservations record
   - Expires in 30 days
4. If item budget control violations:
   - HARD control: Block PR creation, show error
   - SOFT control: Show warning, require reason, allow creation
   - NONE control: Skip checking

**Database Actions:**

```sql
-- Check total budget
SELECT * FROM inventory.check_budget_availability(
  2568,           -- fiscal_year
  1,              -- budget_id
  1,              -- department_id (central pool)
  50000.00,       -- amount
  2               -- quarter
);

-- Check item budget
SELECT * FROM inventory.check_item_budget_control(
  123,            -- budget_request_item_id
  100,            -- pr_quantity
  12.50,          -- pr_unit_price
  2               -- quarter
);

-- If approved, reserve budget
SELECT * FROM inventory.reserve_budget(
  2568,           -- fiscal_year
  1,              -- budget_id
  1,              -- department_id
  456,            -- pr_id
  50000.00,       -- amount
  2,              -- quarter
  30              -- expires_days
);
```

---

### Phase 5: Purchase Order (PO) Approval

**Participants:** Procurement officer

**Steps:**

1. PR converted to PO
2. PO approved
3. **System commits budget:**
   - Call commit_budget() to deduct budget
   - Update q{x}\_spent in budget_allocations
   - Release budget reservation
   - **Update purchased quantities in budget_request_items**

**Database Actions:**

```sql
-- Commit budget
SELECT * FROM inventory.commit_budget(
  456,            -- pr_id
  48500.00,       -- actual_amount (may differ from reserved)
  'user-789'      -- committed_by
);

-- Update purchased quantities in budget_request_items
UPDATE budget_request_items
SET q2_purchased_qty = q2_purchased_qty + 100,
    total_purchased_qty = total_purchased_qty + 100,
    total_purchased_value = total_purchased_value + 1250.00
WHERE id = 123;
```

**Key Point:** This is where actual purchase tracking happens.

---

### Phase 6: PR Rejection/Cancellation

**Participants:** Any approver

**Steps:**

1. PR rejected or cancelled
2. **System releases budget reservation:**
   - Call release_budget_reservation()
   - Budget becomes available again

**Database Actions:**

```sql
SELECT * FROM inventory.release_budget_reservation(
  456,            -- pr_id
  'Duplicate request'  -- reason
);
```

---

### Phase 7: Automated Cleanup (Daily Cron)

**Participants:** System

**Steps:**

1. Daily at 2:00 AM: Run auto_release_expired_reservations()
2. Release all reservations where expires_date < NOW()
3. Log released amounts for audit

**Database Actions:**

```sql
SELECT * FROM inventory.auto_release_expired_reservations();

-- Returns: { released_count: 5, total_amount: 150000.00, details: [...] }
```

---

## 3. Database Schema Design

### 3.1 budget_requests

```sql
CREATE TABLE inventory.budget_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,
  fiscal_year INTEGER NOT NULL,
  department_id INTEGER REFERENCES departments(id),  -- NULL for central
  status VARCHAR(50) DEFAULT 'DRAFT',
  total_requested_amount DECIMAL(15,2),
  justification TEXT,
  dept_reviewed_by INTEGER,
  dept_reviewed_at TIMESTAMP,
  finance_reviewed_by INTEGER,
  finance_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.2 budget_request_items (Enhanced)

```sql
CREATE TABLE inventory.budget_request_items (
  id SERIAL PRIMARY KEY,
  budget_request_id INTEGER REFERENCES budget_requests(id),
  generic_id INTEGER REFERENCES generics(id),
  budget_type_id INTEGER REFERENCES budget_types(id),

  -- Planning quantities
  requested_qty INTEGER NOT NULL,
  q1_qty INTEGER DEFAULT 0,
  q2_qty INTEGER DEFAULT 0,
  q3_qty INTEGER DEFAULT 0,
  q4_qty INTEGER DEFAULT 0,

  -- Pricing
  unit_price DECIMAL(15,2) NOT NULL,

  -- Budget Control Settings ⭐ NEW
  quantity_control_type VARCHAR(10) DEFAULT 'SOFT',  -- NONE/SOFT/HARD
  price_control_type VARCHAR(10) DEFAULT 'SOFT',
  price_variance_percent INTEGER DEFAULT 10,

  -- Purchase Tracking ⭐ NEW
  q1_purchased_qty INTEGER DEFAULT 0,
  q2_purchased_qty INTEGER DEFAULT 0,
  q3_purchased_qty INTEGER DEFAULT 0,
  q4_purchased_qty INTEGER DEFAULT 0,
  total_purchased_qty INTEGER DEFAULT 0,
  total_purchased_value DECIMAL(15,2) DEFAULT 0,

  -- Historical Data ⭐ NEW
  last_year_qty INTEGER,
  two_years_ago_qty INTEGER,
  three_years_ago_qty INTEGER,

  item_justification TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraints
  CONSTRAINT requested_qty_check
    CHECK (requested_qty = q1_qty + q2_qty + q3_qty + q4_qty),
  CONSTRAINT purchased_qty_check
    CHECK (total_purchased_qty = q1_purchased_qty + q2_purchased_qty +
           q3_purchased_qty + q4_purchased_qty),
  CONSTRAINT purchased_value_check
    CHECK (total_purchased_value >= 0)
);
```

---

### 3.3 budget_allocations

```sql
CREATE TABLE inventory.budget_allocations (
  id BIGSERIAL PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  budget_id INTEGER REFERENCES budget_types(id),
  department_id INTEGER REFERENCES departments(id),  -- = 1 for central

  -- Budget amounts
  total_budget DECIMAL(15,2) NOT NULL,
  q1_budget DECIMAL(15,2) DEFAULT 0,
  q2_budget DECIMAL(15,2) DEFAULT 0,
  q3_budget DECIMAL(15,2) DEFAULT 0,
  q4_budget DECIMAL(15,2) DEFAULT 0,

  -- Spending tracking
  q1_spent DECIMAL(15,2) DEFAULT 0,
  q2_spent DECIMAL(15,2) DEFAULT 0,
  q3_spent DECIMAL(15,2) DEFAULT 0,
  q4_spent DECIMAL(15,2) DEFAULT 0,
  total_spent DECIMAL(15,2) DEFAULT 0,

  remaining_budget DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,

  notes TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_allocation
    UNIQUE (fiscal_year, budget_id, department_id)
);
```

**Key Point:** For central budget, all records use department_id=1.

---

### 3.4 budget_reservations

```sql
CREATE TABLE inventory.budget_reservations (
  id BIGSERIAL PRIMARY KEY,
  allocation_id BIGINT REFERENCES budget_allocations(id),
  pr_id BIGINT REFERENCES purchase_requests(id),

  reserved_amount DECIMAL(15,2) NOT NULL,
  quarter INTEGER NOT NULL,  -- 1-4

  reservation_date TIMESTAMP DEFAULT NOW(),
  expires_date TIMESTAMP NOT NULL,

  is_released BOOLEAN DEFAULT false,
  released_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_pr_reservation UNIQUE (pr_id)
);
```

---

## 4. PostgreSQL Functions

### 4.1 check_budget_availability()

**Purpose:** Check if budget is available for PR creation

**Parameters:**

- p_fiscal_year: Fiscal year
- p_budget_id: Budget type ID
- p_department_id: Department ID (always 1 for central)
- p_amount: Requested amount
- p_quarter: Quarter (1-4)

**Returns:**

- available: Boolean
- remaining: Remaining budget
- budget_allocated: Total allocated
- budget_spent: Already spent
- budget_reserved: Currently reserved

**Logic:**

```
remaining = quarter_budget - quarter_spent - active_reservations
available = (remaining >= p_amount)
```

---

### 4.2 reserve_budget()

**Purpose:** Lock budget when PR is created

**Parameters:**

- p_fiscal_year, p_budget_id, p_department_id
- p_pr_id: Purchase request ID
- p_amount: Amount to reserve
- p_quarter: Quarter
- p_expires_days: Days until expiration (default 30)

**Returns:**

- reservation_id: Created reservation ID
- success: Boolean
- message: Status message

**Logic:**

1. Check budget availability
2. If insufficient: Return error
3. If sufficient: Create reservation with expires_date = NOW() + 30 days

---

### 4.3 commit_budget()

**Purpose:** Deduct budget when PO is approved

**Parameters:**

- p_pr_id: Purchase request ID
- p_actual_amount: Actual purchase amount
- p_committed_by: User ID

**Returns:**

- success: Boolean
- message: Status message
- allocation_id, quarter
- previous_spent, new_spent

**Logic:**

1. Find active reservation by pr_id
2. Update budget_allocations: q{x}\_spent += actual_amount
3. Mark reservation as released
4. **TODO: Update budget_request_items purchased quantities**

---

### 4.4 release_budget_reservation()

**Purpose:** Release budget when PR is rejected/cancelled

**Parameters:**

- p_pr_id: Purchase request ID
- p_reason: Reason for release

**Returns:**

- success: Boolean
- message: Status message
- released_amount: Amount released

---

### 4.5 auto_release_expired_reservations()

**Purpose:** Daily cron job to release expired reservations

**Returns:**

- released_count: Number of reservations released
- total_amount: Total amount released
- details: JSONB array of released reservations

---

### 4.6 check_item_budget_control() ⭐ NEW (To be implemented)

**Purpose:** Check item-level budget control before PR creation

**Parameters:**

- p_budget_request_item_id: Budget request item ID
- p_pr_quantity: Quantity in PR
- p_pr_unit_price: Unit price in PR
- p_quarter: Quarter

**Returns:**

- allowed: Boolean
- control_level: VARCHAR (NONE/SOFT/HARD)
- quantity_status: VARCHAR (OK/WARNING/EXCEEDED)
- price_status: VARCHAR (OK/WARNING/EXCEEDED)
- remaining_qty: INTEGER
- price_variance_pct: DECIMAL
- message: JSONB (detailed messages for UI)

**Logic:**

```sql
1. Get budget_request_item settings
2. Calculate purchased_qty per quarter
3. Calculate remaining_qty = q{x}_qty - q{x}_purchased_qty

-- Quantity Control
IF quantity_control_type = 'NONE' THEN
  quantity_status = 'OK'
ELSIF quantity_control_type = 'SOFT' THEN
  IF pr_quantity > remaining_qty THEN
    quantity_status = 'WARNING'
    allowed = true (with warning message)
  END IF
ELSIF quantity_control_type = 'HARD' THEN
  IF pr_quantity > remaining_qty THEN
    quantity_status = 'EXCEEDED'
    allowed = false (block)
  END IF
END IF

-- Price Control
price_variance = ((pr_unit_price - budgeted_unit_price) / budgeted_unit_price) * 100

IF price_control_type = 'NONE' THEN
  price_status = 'OK'
ELSIF price_control_type = 'SOFT' THEN
  IF ABS(price_variance) > price_variance_percent THEN
    price_status = 'WARNING'
  END IF
ELSIF price_control_type = 'HARD' THEN
  IF ABS(price_variance) > price_variance_percent THEN
    price_status = 'EXCEEDED'
    allowed = false
  END IF
END IF

RETURN message with details for UI display
```

---

## 5. Design Decisions & Rationale

### Decision 1: Eliminate Budget Planning Workflow

**Rationale:**

- Budget Request already has Q1-Q4 planning fields
- Budget Planning is duplicate work
- Simpler workflow = less user confusion

**Before:**

```
Budget Request → Submit → Approve → Budget Planning → Plan items → Quarterly breakdown
```

**After:**

```
Budget Request → Add items with Q1-Q4 → Submit → Approve
```

---

### Decision 2: Use department_id=1 for Central Budget

**Rationale:**

- budget_allocations requires department_id (FK constraint)
- Using null would require schema changes
- Creating "คลังกลาง/งบรวม" department is cleaner
- All hospital budgets allocate to one central pool
- Individual departments reserve from pool when creating PR

**Alternative Considered:** Allow null department_id
**Rejected Because:** Complicates queries and requires schema changes

---

### Decision 3: Hybrid Purchase Tracking

**Rationale:**

- Need fast queries for budget dashboard (summary data)
- Need detailed audit trail for reports (transaction data)
- Hybrid approach: Summary in budget_request_items + Detail via joins

**Approaches Compared:**

1. **Simple Aggregate** (old system): Only totals, no detail
2. **Transaction Log**: New table, complex queries
3. **Hybrid** ✅: Summary + joins to purchase_order_items

**Implementation:**

- Add purchased_qty fields to budget_request_items (fast queries)
- Join to purchase_order_items for detail (which PO, when, price)

---

### Decision 4: Configurable Control (NONE/SOFT/HARD)

**Rationale:**

- Different items have different criticality levels
- Some require strict control (critical drugs)
- Some need flexibility (general supplies)
- Configurable per item = maximum flexibility

**Examples:**

- Paracetamol (critical): HARD control
- Ibuprofen (general): SOFT control
- Vitamin C (supplement): NONE control

---

### Decision 5: 30-Day Budget Reservation Expiry

**Rationale:**

- PR approval usually takes 1-2 weeks
- 30 days provides buffer
- Auto-release prevents budget lock forever
- Follows common procurement practices

---

## 6. Integration Points

### 6.1 PR Creation Integration

**File:** `purchase-requests.service.ts`

**Required Changes:**

```typescript
async create(data: CreatePurchaseRequest, userId: string) {
  // 1. Check total budget availability
  const budgetCheck = await knex.raw(`
    SELECT * FROM inventory.check_budget_availability(?, ?, ?, ?, ?)
  `, [fiscalYear, budgetId, 1, totalAmount, quarter]);

  if (!budgetCheck.rows[0].available) {
    throw new Error('INSUFFICIENT_BUDGET');
  }

  // 2. Check item-level budget control
  for (const item of data.items) {
    const itemCheck = await knex.raw(`
      SELECT * FROM inventory.check_item_budget_control(?, ?, ?, ?)
    `, [item.budget_request_item_id, item.quantity, item.unit_price, quarter]);

    const result = itemCheck.rows[0];

    if (!result.allowed) {
      throw new Error(`BUDGET_EXCEEDED: ${result.message.quantity.message}`);
    }

    if (result.quantity_status === 'WARNING' || result.price_status === 'WARNING') {
      // Store warnings for UI display
      warnings.push(result.message);
    }
  }

  // 3. Create PR
  const pr = await super.create(data);

  // 4. Reserve budget
  await knex.raw(`
    SELECT * FROM inventory.reserve_budget(?, ?, ?, ?, ?, ?, ?)
  `, [fiscalYear, budgetId, 1, pr.id, totalAmount, quarter, 30]);

  return { pr, warnings };
}
```

---

### 6.2 PO Approval Integration

**File:** `purchase-orders.service.ts`

**Required Changes:**

```typescript
async approve(id: number, userId: string) {
  const po = await this.findById(id);

  // 1. Commit budget (deduct + release reservation)
  const result = await knex.raw(`
    SELECT * FROM inventory.commit_budget(?, ?, ?)
  `, [po.pr_id, po.total_amount, userId]);

  if (!result.rows[0].success) {
    throw new Error(result.rows[0].message);
  }

  // 2. Update purchased quantities in budget_request_items
  for (const item of po.items) {
    const quarter = this.getCurrentQuarter(po.approved_at);
    const quarterField = `q${quarter}_purchased_qty`;

    await knex('inventory.budget_request_items')
      .where('id', item.budget_request_item_id)
      .increment(quarterField, item.quantity)
      .increment('total_purchased_qty', item.quantity)
      .increment('total_purchased_value', item.quantity * item.unit_price);
  }

  // 3. Update PO status
  await knex('purchase_orders')
    .where('id', id)
    .update({
      status: 'APPROVED',
      approved_by: userId,
      approved_at: knex.fn.now()
    });
}

private getCurrentQuarter(date: Date): number {
  const month = date.getMonth() + 1;
  // Thai fiscal year: Oct=1, Nov=2, Dec=3 (Q1)
  if (month >= 10) return 1;
  if (month >= 1 && month <= 3) return 2;
  if (month >= 4 && month <= 6) return 3;
  return 4;
}
```

---

### 6.3 PR Rejection Integration

**File:** `purchase-requests.service.ts`

**Required Changes:**

```typescript
async reject(id: number, userId: string, reason: string) {
  // 1. Release budget reservation
  await knex.raw(`
    SELECT * FROM inventory.release_budget_reservation(?, ?)
  `, [id, reason]);

  // 2. Update PR status
  await knex('purchase_requests')
    .where('id', id)
    .update({
      status: 'REJECTED',
      rejected_by: userId,
      rejected_at: knex.fn.now(),
      rejection_reason: reason
    });
}
```

---

## 7. UI Requirements

### 7.1 Budget Request Form Enhancement

**Location:** `budget-requests-form.component.ts`

**New Fields per Item:**

```html
<ax-select
  label="Quantity Control"
  [(value)]="item.quantity_control_type"
  [options]="[
    { label: 'None', value: 'NONE' },
    { label: 'Soft (Warning)', value: 'SOFT' },
    { label: 'Hard (Block)', value: 'HARD' }
  ]"
/>

<ax-select label="Price Control" [(value)]="item.price_control_type" [options]="controlTypeOptions" />

<ax-input-number label="Price Variance (%)" [(value)]="item.price_variance_percent" [min]="0" [max]="100" [disabled]="item.price_control_type === 'NONE'" />

<div class="historical-data">
  <ax-input-number label="Last Year Usage" [(value)]="item.last_year_qty" />
  <ax-input-number label="2 Years Ago" [(value)]="item.two_years_ago_qty" />
  <ax-input-number label="3 Years Ago" [(value)]="item.three_years_ago_qty" />
  <span class="avg">3-Year Avg: {{ calculateAverage() }}</span>
</div>
```

---

### 7.2 PR Creation Form Enhancement

**Location:** `purchase-requests-form.component.ts`

**Budget Control Display:**

```html
<div *ngFor="let item of items" class="pr-item">
  <div class="item-info">{{ item.generic_name }}</div>

  <!-- Budget Control Warnings/Errors -->
  <ax-alert *ngIf="item.budgetCheck?.quantity_status === 'WARNING'" type="warning">
    ⚠️ {{ item.budgetCheck.message.quantity.message }}
    <br />Remaining: {{ item.budgetCheck.remaining_qty }} <br />Requested: {{ item.quantity }}
  </ax-alert>

  <ax-alert *ngIf="item.budgetCheck?.quantity_status === 'EXCEEDED'" type="error">
    ❌ {{ item.budgetCheck.message.quantity.message }}
    <br />Budget exceeded - Cannot proceed
  </ax-alert>

  <ax-alert *ngIf="item.budgetCheck?.price_status === 'WARNING'" type="warning">
    ⚠️ {{ item.budgetCheck.message.price.message }}
    <br />Budgeted: {{ item.budgeted_price }} THB <br />Actual: {{ item.unit_price }} THB <br />Variance: {{ item.budgetCheck.price_variance_pct }}%
  </ax-alert>
</div>

<!-- Require reason for warnings -->
<ax-textarea *ngIf="hasWarnings" label="Reason for exceeding budget" [(value)]="budgetExceedReason" required />
```

---

### 7.3 Budget Dashboard

**New Component:** `budget-dashboard.component.ts`

**Features:**

```
┌─────────────────────────────────────────────────────┐
│ Budget Overview - Fiscal Year 2568                  │
├─────────────────────────────────────────────────────┤
│ Total Budget: 10,000,000 THB                        │
│ Spent: 2,500,000 THB (25%)                          │
│ Reserved: 500,000 THB (5%)                          │
│ Available: 7,000,000 THB (70%)                      │
│                                                     │
│ [Progress bar: ████░░░░░░░░░░░░░░░░]              │
├─────────────────────────────────────────────────────┤
│ Quarterly Breakdown                                 │
│                                                     │
│ Q1 (Oct-Dec)  [████████░░]  80% spent              │
│ Q2 (Jan-Mar)  [███░░░░░░░]  30% spent              │
│ Q3 (Apr-Jun)  [░░░░░░░░░░]   0% spent              │
│ Q4 (Jul-Sep)  [░░░░░░░░░░]   0% spent              │
├─────────────────────────────────────────────────────┤
│ Top 10 Items by Budget                              │
│                                                     │
│ Paracetamol 500mg     Planned: 1000  Purchased: 950 │
│ Ibuprofen 400mg       Planned: 500   Purchased: 480 │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

---

## 8. Reports

### 8.1 Planned vs Actual Report

**Output:**

```
Fiscal Year 2568 - Budget Performance Report
Generated: 2025-12-19

Item                  | Q1 Plan | Q1 Actual | Variance | Q2 Plan | Q2 Actual | Variance
--------------------- | ------- | --------- | -------- | ------- | --------- | --------
Paracetamol 500mg     | 1000    | 950       | -50 (-5%)| 1200    | 1250      | +50 (+4%)
Ibuprofen 400mg       | 500     | 480       | -20 (-4%)| 600     | 650       | +50 (+8%)
...

Summary:
- Total Items: 5000
- Items Over Budget: 120 (2.4%)
- Items Under Budget: 3500 (70%)
- Items On Target: 1380 (27.6%)
```

---

### 8.2 Purchase History per Item

**Query:**

```sql
SELECT
  g.generic_name,
  bri.requested_qty,
  bri.total_purchased_qty,
  bri.total_purchased_value,
  po.po_number,
  po.approved_at,
  poi.quantity,
  poi.unit_price
FROM budget_request_items bri
JOIN generics g ON g.id = bri.generic_id
JOIN purchase_order_items poi ON poi.budget_request_item_id = bri.id
JOIN purchase_orders po ON po.id = poi.purchase_order_id
WHERE bri.id = 123
ORDER BY po.approved_at;
```

**Output:**

```
Paracetamol 500mg - Purchase History

Budgeted: 1000 tablets @ 5 THB = 5,000 THB

PO Number       | Date       | Quantity | Unit Price | Total
--------------- | ---------- | -------- | ---------- | ------
PO-2568-001     | 2024-10-15 | 200      | 5.00       | 1,000
PO-2568-015     | 2024-11-20 | 250      | 4.80       | 1,200
PO-2568-032     | 2024-12-10 | 500      | 5.20       | 2,600
--------------- | ---------- | -------- | ---------- | ------
Total Purchased:              | 950      | Avg: 5.05  | 4,800

Variance: -50 tablets (-5%)
Value Variance: -200 THB (-4%)
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe('Budget Control Functions', () => {
  test('check_item_budget_control - HARD control blocks excess', async () => {
    const result = await knex.raw(
      `
      SELECT * FROM inventory.check_item_budget_control(?, ?, ?, ?)
    `,
      [123, 200, 5.0, 1],
    );

    expect(result.rows[0].allowed).toBe(false);
    expect(result.rows[0].quantity_status).toBe('EXCEEDED');
  });

  test('check_item_budget_control - SOFT control warns', async () => {
    const result = await knex.raw(`...`);

    expect(result.rows[0].allowed).toBe(true);
    expect(result.rows[0].quantity_status).toBe('WARNING');
  });
});
```

---

### 9.2 Integration Tests

```typescript
describe('PR Creation with Budget Control', () => {
  test('PR blocked if HARD control exceeded', async () => {
    await expect(
      purchaseRequestsService.create({
        items: [{ generic_id: 123, quantity: 200 }],
      }),
    ).rejects.toThrow('BUDGET_EXCEEDED');
  });

  test('PR allowed if SOFT control with reason', async () => {
    const result = await purchaseRequestsService.create({
      items: [{ generic_id: 456, quantity: 120 }],
      budget_exceed_reason: 'Emergency situation',
    });

    expect(result.pr.id).toBeDefined();
    expect(result.warnings).toHaveLength(1);
  });
});
```

---

## 10. Pending Implementation Tasks

### Phase 1: Schema Changes (Priority: HIGH)

- [ ] Run migration 20251218000002 (purchased tracking fields)
- [ ] Create migration 20251218000003 (budget control settings)
- [ ] Drop budget_plans and budget_plan_items tables
- [ ] Re-approve Budget Request #6 to create allocations

### Phase 2: Database Functions (Priority: HIGH)

- [ ] Implement check_item_budget_control() function
- [ ] Update commit_budget() to update purchased_qty
- [ ] Add tests for all 6 functions

### Phase 3: Service Integration (Priority: HIGH)

- [ ] Integrate budget checks into PR service
- [ ] Integrate budget commit into PO service
- [ ] Integrate budget release into PR rejection
- [ ] Add getCurrentQuarter() helper

### Phase 4: UI Implementation (Priority: MEDIUM)

- [ ] Add control type fields to Budget Request form
- [ ] Add historical data inputs
- [ ] Enhance PR form with budget warnings
- [ ] Create budget dashboard component

### Phase 5: Reports (Priority: MEDIUM)

- [ ] Planned vs Actual report
- [ ] Purchase history per item
- [ ] Budget utilization dashboard APIs

### Phase 6: Monitoring (Priority: LOW)

- [ ] Set up cron job for auto_release_expired_reservations()
- [ ] Create budget threshold alerts
- [ ] Add logging for all budget operations

---

## 11. Questions for Opus Review

### Q1: Architecture Validation

Does this design match standard hospital budget/procurement planning systems?

**Specific Areas:**

- Central budget pool approach (vs per-department)
- Quarterly planning and tracking
- Budget reservation/commitment pattern
- Item-level budget control

---

### Q2: Workflow Validation

Is the workflow complete and correct?

**Specific Concerns:**

- Budget Request combining request + planning
- Elimination of Budget Planning workflow
- PR/PO integration points
- Budget reservation expiry (30 days)

---

### Q3: Data Model Validation

Is the schema design appropriate?

**Specific Concerns:**

- Using department_id=1 for central pool
- Purchased tracking fields in budget_request_items
- Historical data storage (3 years)
- Hybrid approach (summary + detail)

---

### Q4: Control Mechanism Validation

Is the NONE/SOFT/HARD control design correct?

**Specific Concerns:**

- Configurable per item
- Price variance tolerance
- Warning vs blocking behavior
- Reason requirement for SOFT warnings

---

### Q5: Missing Components

What's missing from this design?

**Possible Gaps:**

- Budget transfer between quarters?
- Budget amendments/revisions?
- Multi-year budget tracking?
- Budget forecasting/analytics?
- Rollover budget to next year?

---

## 12. Success Criteria

This design is successful if:

✅ Finance can create ONE central budget request per fiscal year
✅ Multiple users can collaborate on the same request
✅ System tracks both planned and actual purchases per quarter
✅ Item-level budget control is configurable (NONE/SOFT/HARD)
✅ PR creation checks budget and blocks/warns appropriately
✅ PO approval deducts budget and updates purchased quantities
✅ Budget reservations prevent over-commitment
✅ Reports show planned vs actual with variance analysis
✅ Workflow is simpler than before (no redundant Budget Planning)
✅ Design matches standard hospital procurement practices

---

**Document End**

**Next Step:** Opus review and validation
