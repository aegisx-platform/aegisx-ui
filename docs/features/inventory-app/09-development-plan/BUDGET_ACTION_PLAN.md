# 🎯 Budget System - Action Plan (แผนทำงานชัดเจน)

**Created:** 2024-12-08
**Status:** Ready to implement

---

## ✅ สิ่งที่มีแล้ว (เสร็จ 100%)

### Backend:

- ✅ 7 CRUD modules (budgets, budget_types, budget_categories, budget_allocations, budget_plans, budget_plan_items, budget_reservations)
- ✅ Basic GET/POST/PUT/DELETE APIs
- ✅ Database migrations (ตาราง 7 tables)

### Frontend:

- ✅ 7 list pages + form pages
- ✅ Import/Export ready

---

## ❌ สิ่งที่ยังไม่มี (ต้องทำ)

### 1. Database Functions (6 functions)

```sql
-- ต้องสร้างใน migrations:
1. check_budget_availability()    -- เช็คงบเหลือ
2. reserve_budget()                -- จองงบ
3. commit_budget()                 -- ตัดงบ
4. release_budget_reservation()    -- ปลดล็อก
5. check_drug_in_budget_plan()     -- เช็คยาในแผน
6. update_budget_plan_purchase()   -- อัพเดตซื้อแล้ว
```

### 2. Workflow APIs (15 endpoints)

```typescript
// Phase 1: Critical (ต่อกับ PR/PO)
POST /api/budget/check-availability
POST /api/budget/reserve
POST /api/budget/commit
POST /api/budget/reservations/:id/release

// Phase 2: Allocation
GET  /api/budget/dashboard/:year/:dept
POST /api/budget/allocations (validate Q1-Q4 sum)

// Phase 3: Planning
POST /api/budget/plans/:id/items
POST /api/budget/plans/:id/submit
POST /api/budget/plans/:id/approve
GET  /api/budget/plans/:id/drug-history/:drugId

// Phase 4: Monitoring
GET  /api/budget/status
GET  /api/budget/reservations/active
GET  /api/budget/trends/:year/:dept
```

### 3. Custom UI (6 screens)

```typescript
// 1. Budget Dashboard
/inventory/budget/dashboard
  - KPI cards (total, spent, remaining)
  - Quarterly breakdown chart
  - Active reservations table

// 2. Budget Allocation Wizard
/inventory/budget/allocations/create
  - Step 1: Select year, dept, budget type
  - Step 2: Enter total & distribute Q1-Q4
  - Auto-calculate 25% button
  - Preview before save

// 3. Budget Planning Screen
/inventory/budget/plans/create
  - Add drugs to plan
  - Show 3-year history
  - Quarterly quantity distribution
  - Submit for approval

// 4. Plan Approval Interface
/inventory/budget/plans/:id/approve
  - Show plan summary
  - Approve/Reject buttons
  - Validation errors

// 5. Drug History Lookup
Component: DrugHistoryComponent
  - Show last 3 years consumption
  - Calculate average
  - Suggest quantity

// 6. Budget Monitoring Charts
Component: BudgetChartsComponent
  - Monthly spending trend (line chart)
  - Department comparison (bar chart)
  - Utilization gauge
```

---

## 🚀 แผนทำงาน 3 Options

### Option 1: Dashboard Only (1-2 วัน)

```
Day 1:
□ Create /inventory/budget/dashboard page
□ Add KPI cards (use existing APIs)
□ Add quarterly breakdown table

Day 2:
□ Add active reservations table
□ Add basic charts
□ Test & polish
```

**ผลลัพธ์:**

- ✅ เห็นภาพรวมงบประมาณ
- ✅ ไม่ต้องแก้ backend
- ⚠️ ยังไม่ต่อกับ PR/PO

---

### Option 2: Core Workflow (1 สัปดาห์) ⭐ แนะนำ

```
Day 1-2: Database Functions
□ Create check_budget_availability() function
□ Create reserve_budget() function
□ Test functions with SQL

Day 3-4: Workflow APIs
□ Create budget-workflow.service.ts
□ Implement check-availability endpoint
□ Implement reserve endpoint
□ Add validation & error handling

Day 5-6: Integration
□ Integrate with PR creation
□ Test budget check when create PR
□ Test auto-reserve
□ Test 30-day expiry

Day 7: Testing
□ Test full flow: check → reserve → expire
□ Test insufficient budget scenario
□ Fix bugs
```

**ผลลัพธ์:**

- ✅ PR/PO ต่อกับงบประมาณได้
- ✅ ตรวจสอบงบเหลือก่อนสร้าง PR
- ✅ จองงบอัตโนมัติ
- ⚠️ ยังไม่มี UI dashboard

---

### Option 3: Full Budget System (4-6 สัปดาห์)

```
Week 1: Database + Core Workflow (Option 2)
□ All 6 database functions
□ 4 critical APIs (check, reserve, commit, release)
□ Integrate with PR/PO

Week 2: Budget Management
□ Budget allocation wizard UI
□ Quarterly distribution validation
□ Duplicate check
□ Preview screen

Week 3: Budget Planning
□ Drug history API (3 years)
□ Plan creation wizard
□ Plan approval flow
□ Validation

Week 4: Monitoring & Dashboard
□ Budget dashboard page
□ KPI calculations
□ Charts (spending trends)
□ Active reservations table

Week 5-6: Testing & Polish
□ E2E testing all workflows
□ Performance optimization
□ Bug fixes
□ Documentation
```

**ผลลัพธ์:**

- ✅ ระบบครบทุก workflow
- ✅ UI/UX สมบูรณ์
- ✅ พร้อมใช้งานจริง

---

## 📋 แนะนำ: เริ่มจาก Option 2

**เพราะ:**

1. ✅ Unblock ระบบ Procurement (สร้าง PR/PO ได้)
2. ✅ เห็นผลเร็ว (1 สัปดาห์)
3. ✅ สำคัญที่สุด (core business logic)
4. ✅ ทำต่อเป็น Option 3 ได้ภายหลัง

**ลำดับที่ถูก:**

```
Option 2 (Week 1) → Dashboard (Week 2) → Full System (Week 3-6)
```

---

## 🛠️ Implementation Checklist (Option 2)

### Backend Tasks:

```typescript
// 1. Database Functions (apps/api/src/database/migrations-inventory/)
□ 20241208_create_budget_functions.ts
  - check_budget_availability(fiscalYear, budgetTypeId, deptId, amount, quarter)
  - reserve_budget(allocationId, prId, amount, expiresDays)
  - commit_budget(allocationId, poId, amount, quarter)
  - release_budget_reservation(reservationId)

// 2. Workflow Service (apps/api/src/modules/inventory/budget/)
□ budget-workflow/
  - budget-workflow.service.ts
  - budget-workflow.controller.ts
  - budget-workflow.routes.ts
  - budget-workflow.schemas.ts

// 3. Integration
□ Modify PR creation to call check + reserve
□ Modify PO approval to call commit
□ Add cron job for auto-release expired reservations
```

### Frontend Tasks (Minimal):

```typescript
// 1. Budget Check Component (when creating PR)
□ Show budget availability before submit
□ Display error if insufficient budget

// 2. Budget Status Display
□ Show reservation info in PR detail
□ Show committed amount in PO detail
```

---

## 📝 Detailed Steps for Option 2

### Step 1: Create Database Functions

```sql
-- File: apps/api/src/database/migrations-inventory/20241208_create_budget_functions.ts

exports.up = function(knex) {
  return knex.raw(`
    -- Function 1: check_budget_availability
    CREATE OR REPLACE FUNCTION inventory.check_budget_availability(
      p_fiscal_year INT,
      p_budget_type_id BIGINT,
      p_department_id BIGINT,
      p_amount DECIMAL(15,2),
      p_quarter INT
    ) RETURNS TABLE (
      available BOOLEAN,
      remaining DECIMAL(15,2)
    ) AS $$
    DECLARE
      v_allocation RECORD;
      v_quarter_budget DECIMAL(15,2);
      v_quarter_spent DECIMAL(15,2);
      v_reserved DECIMAL(15,2);
    BEGIN
      -- Get allocation
      SELECT * INTO v_allocation
      FROM inventory.budget_allocations ba
      JOIN inventory.budgets b ON ba.budget_id = b.id
      WHERE ba.fiscal_year = p_fiscal_year
        AND b.budget_type = (SELECT type_code FROM inventory.budget_types WHERE id = p_budget_type_id)
        AND ba.department_id = p_department_id
        AND ba.status = 'ACTIVE'
      LIMIT 1;

      IF v_allocation IS NULL THEN
        RETURN QUERY SELECT FALSE, 0::DECIMAL(15,2);
        RETURN;
      END IF;

      -- Get quarterly budget & spent
      CASE p_quarter
        WHEN 1 THEN
          v_quarter_budget := v_allocation.q1_budget;
          v_quarter_spent := v_allocation.q1_spent;
        WHEN 2 THEN
          v_quarter_budget := v_allocation.q2_budget;
          v_quarter_spent := v_allocation.q2_spent;
        WHEN 3 THEN
          v_quarter_budget := v_allocation.q3_budget;
          v_quarter_spent := v_allocation.q3_spent;
        WHEN 4 THEN
          v_quarter_budget := v_allocation.q4_budget;
          v_quarter_spent := v_allocation.q4_spent;
      END CASE;

      -- Get active reservations for this quarter
      SELECT COALESCE(SUM(reserved_amount), 0) INTO v_reserved
      FROM inventory.budget_reservations
      WHERE allocation_id = v_allocation.id
        AND status = 'ACTIVE'
        AND expires_date > CURRENT_DATE;

      -- Calculate remaining
      v_remaining := v_quarter_budget - v_quarter_spent - v_reserved;

      -- Check if available
      RETURN QUERY SELECT (v_remaining >= p_amount), v_remaining;
    END;
    $$ LANGUAGE plpgsql;

    -- Function 2: reserve_budget
    CREATE OR REPLACE FUNCTION inventory.reserve_budget(
      p_allocation_id BIGINT,
      p_pr_id BIGINT,
      p_amount DECIMAL(15,2),
      p_expires_days INT DEFAULT 30
    ) RETURNS BIGINT AS $$
    DECLARE
      v_reservation_id BIGINT;
    BEGIN
      INSERT INTO inventory.budget_reservations (
        allocation_id,
        pr_id,
        reserved_amount,
        reservation_date,
        status,
        expires_date
      ) VALUES (
        p_allocation_id,
        p_pr_id,
        p_amount,
        CURRENT_DATE,
        'ACTIVE',
        CURRENT_DATE + INTERVAL '1 day' * p_expires_days
      ) RETURNING id INTO v_reservation_id;

      RETURN v_reservation_id;
    END;
    $$ LANGUAGE plpgsql;

    -- Function 3: commit_budget (simplified)
    CREATE OR REPLACE FUNCTION inventory.commit_budget(
      p_allocation_id BIGINT,
      p_po_id BIGINT,
      p_amount DECIMAL(15,2),
      p_quarter INT
    ) RETURNS BOOLEAN AS $$
    DECLARE
      v_quarter_field TEXT;
    BEGIN
      -- Update quarterly spent
      v_quarter_field := 'q' || p_quarter || '_spent';

      EXECUTE format('
        UPDATE inventory.budget_allocations
        SET %I = %I + $1,
            total_spent = total_spent + $1,
            remaining_budget = remaining_budget - $1
        WHERE id = $2
      ', v_quarter_field, v_quarter_field)
      USING p_amount, p_allocation_id;

      -- Release reservation
      UPDATE inventory.budget_reservations
      SET status = 'COMMITTED'
      WHERE pr_id IN (
        SELECT pr_id FROM inventory.purchase_orders WHERE id = p_po_id
      );

      RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;

    -- Function 4: release_budget_reservation
    CREATE OR REPLACE FUNCTION inventory.release_budget_reservation(
      p_reservation_id BIGINT
    ) RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE inventory.budget_reservations
      SET status = 'RELEASED'
      WHERE id = p_reservation_id;

      RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    DROP FUNCTION IF EXISTS inventory.check_budget_availability;
    DROP FUNCTION IF EXISTS inventory.reserve_budget;
    DROP FUNCTION IF EXISTS inventory.commit_budget;
    DROP FUNCTION IF EXISTS inventory.release_budget_reservation;
  `);
};
```

### Step 2: Create Workflow Service

```typescript
// File: apps/api/src/modules/inventory/budget/budget-workflow.service.ts

import { Knex } from 'knex';

export class BudgetWorkflowService {
  constructor(private db: Knex) {}

  async checkBudgetAvailability(params: { fiscalYear: number; budgetTypeId: number; departmentId: number; amount: number; quarter: number }): Promise<{ available: boolean; remaining: number }> {
    const result = await this.db.raw(`SELECT * FROM inventory.check_budget_availability(?, ?, ?, ?, ?)`, [params.fiscalYear, params.budgetTypeId, params.departmentId, params.amount, params.quarter]);

    return result.rows[0];
  }

  async reserveBudget(params: { allocationId: number; prId: number; amount: number; expiresDays?: number }): Promise<number> {
    const result = await this.db.raw(`SELECT inventory.reserve_budget(?, ?, ?, ?) as reservation_id`, [params.allocationId, params.prId, params.amount, params.expiresDays || 30]);

    return result.rows[0].reservation_id;
  }

  async commitBudget(params: { allocationId: number; poId: number; amount: number; quarter: number }): Promise<boolean> {
    const result = await this.db.raw(`SELECT inventory.commit_budget(?, ?, ?, ?)`, [params.allocationId, params.poId, params.amount, params.quarter]);

    return result.rows[0].commit_budget;
  }

  async releaseBudgetReservation(reservationId: number): Promise<boolean> {
    const result = await this.db.raw(`SELECT inventory.release_budget_reservation(?)`, [reservationId]);

    return result.rows[0].release_budget_reservation;
  }
}
```

### Step 3: Create API Routes

```typescript
// File: apps/api/src/modules/inventory/budget/budget-workflow.routes.ts

import { FastifyPluginAsync } from 'fastify';
import { BudgetWorkflowService } from './budget-workflow.service';

export const budgetWorkflowRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BudgetWorkflowService(fastify.knex);

  // POST /api/budget/check-availability
  fastify.post('/check-availability', async (request, reply) => {
    const result = await service.checkBudgetAvailability(request.body);

    if (!result.available) {
      return reply.code(400).send({
        success: false,
        error: {
          code: 'INSUFFICIENT_BUDGET',
          message: `Insufficient budget. Available: ${result.remaining}`,
        },
      });
    }

    return { success: true, data: result };
  });

  // POST /api/budget/reserve
  fastify.post('/reserve', async (request, reply) => {
    const reservationId = await service.reserveBudget(request.body);
    return { success: true, data: { reservationId } };
  });

  // POST /api/budget/commit
  fastify.post('/commit', async (request, reply) => {
    await service.commitBudget(request.body);
    return { success: true, message: 'Budget committed successfully' };
  });

  // POST /api/budget/reservations/:id/release
  fastify.post('/reservations/:id/release', async (request, reply) => {
    await service.releaseBudgetReservation(request.params.id);
    return { success: true, message: 'Reservation released' };
  });
};
```

---

## ✅ Success Criteria (Option 2)

เมื่อเสร็จแล้วต้อง:

1. ✅ สร้าง PR ได้ และเช็คงบอัตโนมัติ
2. ✅ ถ้างบไม่พอ แสดง error ชัดเจน
3. ✅ ถ้างบพอ จองงบอัตโนมัติ
4. ✅ PO approved แล้ว ตัดงบอัตโนมัติ
5. ✅ Reservation หมดอายุ 30 วัน auto-release

---

**Last Updated:** 2024-12-08
**Recommended:** Start with Option 2 (1 week) → Then expand to full system
