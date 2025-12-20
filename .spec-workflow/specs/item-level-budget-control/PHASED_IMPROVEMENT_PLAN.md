# Item-Level Budget Control - Phased Improvement Plan

**Created:** December 19, 2025
**Status:** Planning Phase
**Approach:** ทีละส่วน (Step-by-Step Implementation)

---

## Overview: ระบบงบประมาณแบบ 3 ระดับ

```
┌─────────────────────────────────────────────────────────────┐
│ ระดับ 1: การเลือกงบประมาณกับแผน (Budget Selection & Plan) │
│ - เลือกประเภทงบ (budget_types)                             │
│ - สร้างแผนงบ (budget_request + items)                      │
│ - อนุมัติแผน (DRAFT → FINANCE_APPROVED)                    │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ ระดับ 2: การควบคุมงบทั้งหมด (Overall Budget Control)      │
│ - budget_allocations (aggregate level)                     │
│ - ควบคุมงบรวมตาม budget_type + department                 │
│ - reserve/commit/release mechanism                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ ระดับ 3: การควบคุมงบราย Item (Item-Level Control)         │
│ - budget_request_items (detailed level)                   │
│ - ควบคุมแยกแต่ละยา/รายการ                                  │
│ - NONE/SOFT/HARD validation                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### ✅ ที่มีอยู่แล้ว (Implemented)

1. **ระดับ 1: Budget Selection & Plan**
   - ✅ budget_requests table
   - ✅ budget_request_items table
   - ✅ Workflow: DRAFT → SUBMITTED → DEPT_APPROVED → FINANCE_APPROVED
   - ✅ Quarterly planning (q1_qty, q2_qty, etc.)
   - ✅ Finance approval creates budget_allocations

2. **ระดับ 2: Overall Budget Control**
   - ✅ budget_allocations table (aggregate level)
   - ✅ Structure: (fiscal_year, budget_id, department_id)
   - ✅ Quarterly tracking (q1_budget, q1_spent, etc.)
   - ⚠️ Reserve/commit mechanism (มี schema แต่ยังไม่ integrate กับ PR/PO)

3. **ระดับ 3: Item-Level Control**
   - ✅ budget_request_items has purchased tracking fields
   - ❌ NO control type fields (quantity_control_type, price_control_type)
   - ❌ NO validation function
   - ❌ NO UI for configuration

### ❌ ที่ขาดหายไป (Missing)

1. **PO Approval Integration**
   - ❌ ไม่มีการ update q1_purchased_qty เมื่อ PO approved
   - ❌ ไม่มีการ update q1_spent in budget_allocations
   - ❌ ไม่มี sync mechanism

2. **Budget Reservation/Commitment Flow**
   - ⚠️ มี table budget_reservations แต่ไม่ได้ใช้
   - ❌ PR creation ไม่ได้ reserve budget
   - ❌ PO approval ไม่ได้ commit budget

3. **Item-Level Budget Control**
   - ❌ ทั้งหมดตาม spec (ยังไม่ได้ทำเลย)

---

## Phase-by-Phase Improvement Plan

### 🔵 Phase 0: Foundation & Understanding (CURRENT)

**Objective:** เข้าใจ architecture ที่มีอยู่ และวางแผนการปรับปรุง

**Tasks:**

- [x] อ่านและทำความเข้าใจ code ที่มีอยู่
- [x] วิเคราะห์ alignment ระหว่าง spec กับ implementation
- [ ] ตัดสินใจ architecture: 2-level tracking (allocations + items)
- [ ] Review กับ team เพื่อ confirm approach

**Deliverables:**

- ✅ ALIGNMENT_REVIEW.md
- ✅ PHASED_IMPROVEMENT_PLAN.md (ไฟล์นี้)
- ⏳ Architectural Decision Document (pending)

**Effort:** 1 day
**Status:** 80% complete

---

### 🟢 Phase 1: PO Approval Integration (Foundation Layer)

**Why First?**

- ทุกอย่างขึ้นอยู่กับ PO approval updating purchased quantities
- ไม่มีอันนี้ item-level control ไม่ทำงาน
- ต้องทำก่อนเพราะเป็น foundation

**Objective:** เมื่อ PO approved ให้ update:

1. budget_request_items.q1_purchased_qty (item level)
2. budget_allocations.q1_spent (aggregate level)

#### Subtasks:

##### 1.1 ตรวจสอบ PR/PO Schema (0.5 hour)

```bash
# ตรวจสอบว่า PR/PO มี budget_request_item_id หรือไม่
grep -r "purchase_request_items\|purchase_order_items" \
  apps/api/src/database/migrations-inventory/
```

**Questions to Answer:**

- PR items มี budget_request_item_id field หรือไม่?
- PO items reference PR items อย่างไร?
- มี link จาก PO → budget request item ไหม?

##### 1.2 Create PO Approval Hook (2 hours)

**File:** `apps/api/src/layers/domains/inventory/procurement/purchaseOrders/purchase-orders.service.ts`

**Logic:**

```typescript
async approvePurchaseOrder(id: string, userId: string) {
  const trx = await this.knex.transaction();

  try {
    // 1. Approve PO (existing logic)
    const po = await this.updateStatus(id, 'APPROVED');

    // 2. Get PO items with budget_request_item_id
    const poItems = await trx('inventory.purchase_order_items')
      .where({ purchase_order_id: id })
      .select('*');

    // 3. Update budget_request_items (item level)
    for (const item of poItems) {
      if (!item.budget_request_item_id) continue;

      const quarter = this.getCurrentQuarter();
      const qtyField = `q${quarter}_purchased_qty`;

      await trx('inventory.budget_request_items')
        .where({ id: item.budget_request_item_id })
        .increment(qtyField, item.quantity)
        .increment('total_purchased_qty', item.quantity)
        .increment('total_purchased_value', item.quantity * item.unit_price);
    }

    // 4. Update budget_allocations (aggregate level)
    const budgetItem = await trx('inventory.budget_request_items')
      .where({ id: poItems[0].budget_request_item_id })
      .first();

    const budgetRequest = await trx('inventory.budget_requests')
      .where({ id: budgetItem.budget_request_id })
      .first();

    const quarter = this.getCurrentQuarter();
    const spentField = `q${quarter}_spent`;
    const totalAmount = poItems.reduce((sum, item) =>
      sum + (item.quantity * item.unit_price), 0);

    await trx('inventory.budget_allocations')
      .where({
        fiscal_year: budgetRequest.fiscal_year,
        budget_id: budgetItem.budget_type_id || 1,
        department_id: budgetRequest.department_id || 1
      })
      .increment(spentField, totalAmount)
      .increment('total_spent', totalAmount)
      .decrement('remaining_budget', totalAmount);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

getCurrentQuarter(): number {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12

  // Thai fiscal year starts October 1
  // Q1: Oct-Dec (10,11,12)
  // Q2: Jan-Mar (1,2,3)
  // Q3: Apr-Jun (4,5,6)
  // Q4: Jul-Sep (7,8,9)

  if (month >= 10) return 1; // Oct-Dec
  if (month <= 3) return 2;  // Jan-Mar
  if (month <= 6) return 3;  // Apr-Jun
  return 4;                  // Jul-Sep
}
```

##### 1.3 Write Tests (1 hour)

**Test Scenarios:**

```typescript
describe('PO Approval → Budget Update', () => {
  it('should update budget_request_items.q1_purchased_qty', async () => {
    // Create budget request with items
    // Create PR referencing budget items
    // Create PO from PR
    // Approve PO
    // Verify q1_purchased_qty incremented
  });

  it('should update budget_allocations.q1_spent', async () => {
    // Same setup
    // Verify aggregate spent updated
  });

  it('should keep both levels in sync', async () => {
    // Verify item totals = allocation totals
  });

  it('should handle different quarters correctly', async () => {
    // Test Q1-Q4 logic
  });
});
```

##### 1.4 Manual Testing (0.5 hour)

**Test Plan:**

1. Create budget request with 3 items
2. Finance approve (creates allocations)
3. Create PR with budget_request_item_ids
4. Create PO from PR
5. Approve PO
6. Verify:
   - ✅ q1_purchased_qty updated in budget_request_items
   - ✅ q1_spent updated in budget_allocations
   - ✅ remaining_budget decreased
   - ✅ Both levels match

**Deliverables:**

- ✅ PO approval updates purchased quantities
- ✅ Two-level sync working
- ✅ Tests passing
- ✅ Manual verification complete

**Effort:** 4 hours
**Dependencies:** None (foundation)
**Critical Path:** YES (blocks all other phases)

---

### 🟡 Phase 2: Budget Reservation Flow (PR Creation)

**Why Second?**

- ต้องมี PO integration ก่อน (Phase 1)
- PR creation ต้อง reserve budget เพื่อป้องกัน over-commitment
- เป็นพื้นฐานสำหรับ item-level validation

**Objective:** เมื่อสร้าง PR ให้ reserve budget ไว้ก่อน

#### Subtasks:

##### 2.1 Review Existing Budget Reservations (0.5 hour)

**Check:**

- มี table budget_reservations หรือไม่?
- Structure เป็นอย่างไร?
- มี functions reserve_budget(), release_budget() หรือไม่?

##### 2.2 Implement PR → Reserve Budget (2 hours)

**File:** `apps/api/src/layers/domains/inventory/procurement/purchaseRequests/purchase-requests.service.ts`

**Logic:**

```typescript
async createPurchaseRequest(data: CreatePurchaseRequest, userId: string) {
  const trx = await this.knex.transaction();

  try {
    // 1. Create PR (existing logic)
    const pr = await this.create(data);

    // 2. Reserve budget for each item
    for (const item of data.items) {
      if (!item.budget_request_item_id) continue;

      const budgetItem = await trx('inventory.budget_request_items')
        .where({ id: item.budget_request_item_id })
        .first();

      const budgetRequest = await trx('inventory.budget_requests')
        .where({ id: budgetItem.budget_request_id })
        .first();

      const quarter = this.getCurrentQuarter();
      const amount = item.quantity * item.unit_price;

      // Call PostgreSQL function (if exists)
      await trx.raw(`
        SELECT inventory.reserve_budget(?, ?, ?, ?, ?, ?, ?)
      `, [
        budgetRequest.fiscal_year,
        budgetItem.budget_type_id || 1,
        budgetRequest.department_id || 1,
        quarter,
        amount,
        `PR-${pr.id}`,
        userId
      ]);
    }

    await trx.commit();
    return pr;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
```

##### 2.3 Implement PO Approval → Commit Budget (1 hour)

**Update PO approval from Phase 1:**

```typescript
// After updating purchased_qty...

// Commit reserved budget (change reservation → commitment)
await trx.raw(
  `
  SELECT inventory.commit_budget(?, ?)
`,
  [`PR-${pr.id}`, `PO-${po.id}`],
);
```

##### 2.4 Implement PR Rejection → Release Budget (1 hour)

**File:** `purchase-requests.service.ts`

```typescript
async rejectPurchaseRequest(id: string, reason: string) {
  const trx = await this.knex.transaction();

  try {
    // Update PR status
    await this.updateStatus(id, 'REJECTED');

    // Release budget reservation
    await trx.raw(`
      SELECT inventory.release_budget_reservation(?)
    `, [`PR-${id}`]);

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
```

##### 2.5 Test Reservation Flow (1 hour)

**Test Scenarios:**

```typescript
describe('Budget Reservation Flow', () => {
  it('should reserve budget when PR created', async () => {});
  it('should commit budget when PO approved', async () => {});
  it('should release budget when PR rejected', async () => {});
  it('should prevent over-commitment', async () => {
    // Create PR that would exceed budget
    // Expect error
  });
});
```

**Deliverables:**

- ✅ PR reserves budget
- ✅ PO commits budget
- ✅ Rejection releases budget
- ✅ Over-commitment prevented

**Effort:** 5.5 hours
**Dependencies:** Phase 1 (PO integration)
**Critical Path:** YES (blocks Phase 3)

---

### 🔴 Phase 3: Item-Level Budget Control (Main Feature)

**Why Third?**

- ต้องมี PO integration (Phase 1) เพื่อ populate purchased_qty
- ต้องมี reservation flow (Phase 2) เพื่อ check availability
- ตอนนี้พร้อมแล้วสำหรับ item-level validation

**Objective:** เพิ่ม NONE/SOFT/HARD control per item

#### Subtasks (ตาม spec ที่ทำไว้):

##### 3.1 Database Schema (1 hour)

- ✅ Already defined in spec: Task 1.1
- Add control type fields to budget_request_items

##### 3.2 Validation Function (2 hours)

- ✅ Already defined in spec: Task 1.2
- Create check_item_budget_control() function

##### 3.3 Backend Integration (3 hours)

- ✅ Already defined in spec: Tasks 2.1-2.4
- TypeBox schemas, PR validation, tests

##### 3.4 Frontend - Item Settings Modal (2 hours)

- ✅ Already defined in spec: Tasks 3.1-3.2
- Modal component, control badges

##### 3.5 Frontend - PR Validation Alerts (2 hours)

- ✅ Already defined in spec: Tasks 4.1-4.2
- Red/yellow alerts, reason textarea

##### 3.6 Frontend - Dashboard (2 hours)

- ✅ Already defined in spec: Tasks 5.1-5.2
- Summary cards, filterable table

##### 3.7 Testing & Docs (2 hours)

- ✅ Already defined in spec: Tasks 6.1-6.4
- Integration tests, API docs, user guide

**Deliverables:**

- ✅ Item-level control fully implemented
- ✅ All tests passing
- ✅ Documentation complete

**Effort:** 14 hours (ตามที่ estimate ไว้ใน spec)
**Dependencies:** Phase 1 + Phase 2
**Critical Path:** NO (main feature, not blocker)

---

### 🟣 Phase 4: Enhancements & Optimization (Optional)

**Objective:** ปรับปรุงประสิทธิภาพและเพิ่มฟีเจอร์เสริม

#### Optional Features:

##### 4.1 Budget Dashboard Performance

- Virtual scrolling for 1000+ items
- Caching mechanism
- Real-time WebSocket updates

##### 4.2 Bulk Control Settings

- Set control types for multiple items at once
- Copy settings from previous fiscal year
- Import/export control configurations

##### 4.3 Advanced Reporting

- Budget vs. actual comparison charts
- Variance analysis reports
- Forecasting based on historical data

##### 4.4 Budget Amendments (From Opus review)

- Support mid-year budget increases/decreases
- Approval workflow for amendments
- Audit trail for all changes

**Effort:** 10-20 hours
**Dependencies:** Phase 3 complete
**Priority:** LOW (nice-to-have)

---

## Summary Timeline

```
Phase 0: Foundation & Understanding        [████████████] 1 day   ✅ 80%
    ↓
Phase 1: PO Approval Integration          [████████    ] 4 hours ⏳ 0%
    ↓
Phase 2: Budget Reservation Flow          [            ] 5.5 hours ⏳ 0%
    ↓
Phase 3: Item-Level Control              [            ] 14 hours ⏳ 0%
    ↓
Phase 4: Enhancements (Optional)          [            ] 10-20 hours ⏳ 0%

Total Core Implementation: ~23.5 hours (3 days)
Total with Enhancements: ~43.5 hours (5-6 days)
```

---

## Decision Points

### 🔵 Decision 1: Two-Level Tracking Architecture

**Question:** Keep both budget_allocations (aggregate) and budget_request_items (detailed)?

**Options:**

- A) Keep both, sync via PO approval ✅ **RECOMMENDED**
- B) Items only (remove allocations)
- C) Allocations only (no item-level)

**Recommendation:** Option A

- Pros: Best performance, granular control, aligned with current architecture
- Cons: Must maintain sync (handled in Phase 1)

**Status:** ⏳ Pending team approval

---

### 🟡 Decision 2: PR → Budget Item Linkage

**Question:** How does PR reference budget items?

**Need to verify:**

- Does purchase_request_items table have budget_request_item_id field?
- Is it required or optional?
- What happens if PR created without budget reference?

**Status:** ⏳ Need to check schema (Phase 1.1)

---

### 🟢 Decision 3: Validation Timing

**Question:** When to validate item-level control?

**Options:**

- A) PR creation (before save) ✅ **SPEC ASSUMES THIS**
- B) PR submission (after save, before workflow)
- C) PO creation (too late?)

**Recommendation:** Option A (as per spec)

- Validate in validateCreate() method
- Show errors immediately in UI
- Prevent invalid PR creation

**Status:** ✅ Aligned with spec

---

## Risk Assessment

### 🔴 HIGH RISK

1. **PO Approval Integration (Phase 1)**
   - Risk: May not have budget_request_item_id in PR/PO schema
   - Mitigation: Check schema first (Phase 1.1), design workaround if needed
   - Impact: Blocks everything

2. **Sync Mechanism**
   - Risk: Items and allocations get out of sync
   - Mitigation: Use database transactions, add validation checks
   - Impact: Data integrity issues

### 🟡 MEDIUM RISK

3. **Performance**
   - Risk: Dashboard slow with 1000+ items
   - Mitigation: Virtual scrolling, pagination, caching
   - Impact: User experience

4. **Concurrent Updates**
   - Risk: Two POs updating same item simultaneously
   - Mitigation: Database row-level locking
   - Impact: Race conditions

### 🟢 LOW RISK

5. **UI Complexity**
   - Risk: Users confused by NONE/SOFT/HARD controls
   - Mitigation: Clear labeling, tooltips, examples
   - Impact: User adoption

---

## Next Actions

### Immediate (Today)

1. **Review with team** (1 hour)
   - Present this plan
   - Confirm architectural approach
   - Get approval to proceed

2. **Verify PR/PO Schema** (30 minutes)
   - Check if budget_request_item_id exists
   - Document findings
   - Update plan if needed

### This Week

3. **Implement Phase 1** (4 hours)
   - PO approval integration
   - Test sync mechanism
   - Verify both levels update correctly

4. **Implement Phase 2** (5.5 hours)
   - Budget reservation flow
   - Test over-commitment prevention

### Next Week

5. **Implement Phase 3** (14 hours)
   - Item-level control feature
   - Follow spec tasks 1.1-6.4
   - Full testing

---

## Success Criteria

### Phase 1 Complete:

- ✅ PO approval updates purchased_qty
- ✅ Both levels (items + allocations) in sync
- ✅ Tests passing
- ✅ Manual verification successful

### Phase 2 Complete:

- ✅ PR reserves budget
- ✅ PO commits reserved budget
- ✅ Rejection releases budget
- ✅ Over-commitment prevented

### Phase 3 Complete:

- ✅ Item-level control working
- ✅ NONE/SOFT/HARD validation
- ✅ UI components functional
- ✅ Dashboard displays correct data

### Overall Success:

- ✅ All 3 levels working together
- ✅ Data integrity maintained
- ✅ Performance acceptable
- ✅ User acceptance

---

**Status:** Ready for team review and decision on next steps
