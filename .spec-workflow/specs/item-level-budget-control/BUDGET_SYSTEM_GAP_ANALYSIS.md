# Budget System - Gap Analysis (Focus เฉพาะ Budget)

**Date:** December 19, 2025
**Scope:** Budget Management System ONLY (ไม่รวม PR/PO integration)
**Status:** Identifying what's missing in budget system itself

---

## 📋 Checklist: Budget System Features

### ✅ LEVEL 1: Budget Request & Approval Workflow

| Feature                               | Designed | Implemented | Tested | Status |
| ------------------------------------- | -------- | ----------- | ------ | ------ |
| Create budget request (DRAFT)         | ✅       | ✅          | ⏳     | 90%    |
| Add budget request items              | ✅       | ✅          | ⏳     | 90%    |
| Quarterly planning (q1-q4)            | ✅       | ✅          | ⏳     | 100%   |
| Submit for approval                   | ✅       | ✅          | ⏳     | 90%    |
| Department approval                   | ✅       | ✅          | ⏳     | 90%    |
| Finance approval                      | ✅       | ✅          | ⏳     | 90%    |
| Finance approval creates allocations  | ✅       | ✅          | ⏳     | 100%   |
| Central budget support (dept_id=null) | ✅       | ✅          | ⏳     | 100%   |
| Reopen/revision workflow              | ✅       | ✅          | ⏳     | 90%    |
| Audit trail logging                   | ✅       | ✅          | ⏳     | 100%   |
| Comments system                       | ✅       | ✅          | ⏳     | 100%   |

**Level 1 Status:** ✅ **COMPLETE** (~95%)

---

### ⚠️ LEVEL 2: Budget Allocation Management

| Feature                              | Designed | Implemented | Tested | Status  |
| ------------------------------------ | -------- | ----------- | ------ | ------- |
| budget_allocations table             | ✅       | ✅          | ⏳     | 100%    |
| Create allocations (finance approve) | ✅       | ✅          | ⏳     | 100%    |
| Quarterly budget tracking            | ✅       | ✅          | ⏳     | 100%    |
| UPSERT logic (accumulate budgets)    | ✅       | ✅          | ⏳     | 100%    |
| Spent tracking (q1_spent, etc.)      | ✅       | ✅          | ❌     | **50%** |
| Remaining budget calculation         | ✅       | ✅          | ⏳     | 100%    |
| View allocations UI                  | ✅       | ❌          | ❌     | **0%**  |
| Edit allocations UI                  | ✅       | ❌          | ❌     | **0%**  |
| Budget amendments                    | ⚠️       | ❌          | ❌     | **0%**  |
| Quarter transfer                     | ⚠️       | ❌          | ❌     | **0%**  |

**Level 2 Status:** ⚠️ **PARTIAL** (~60%)

**Missing:**

- ❌ **UI for viewing budget allocations** (หน้าจอดูงบจัดสรร)
- ❌ **UI for editing allocations** (แก้ไขงบหลัง approve)
- ❌ **Budget amendment workflow** (เพิ่ม/ลดงบกลางปี)
- ❌ **Quarter transfer function** (โอนงบระหว่างไตรมาส)
- ⚠️ **Spent tracking** (มี field แต่ยังไม่มีการ update - รอ PO)

---

### ❌ LEVEL 3: Item-Level Budget Control

| Feature                           | Designed | Implemented | Tested | Status |
| --------------------------------- | -------- | ----------- | ------ | ------ |
| Control type fields in schema     | ✅       | ❌          | ❌     | **0%** |
| quantity_control_type field       | ✅       | ❌          | ❌     | **0%** |
| price_control_type field          | ✅       | ❌          | ❌     | **0%** |
| quantity_variance_percent field   | ✅       | ❌          | ❌     | **0%** |
| price_variance_percent field      | ✅       | ❌          | ❌     | **0%** |
| check_item_budget_control() func  | ✅       | ❌          | ❌     | **0%** |
| UI for setting control types      | ✅       | ❌          | ❌     | **0%** |
| Item settings modal               | ✅       | ❌          | ❌     | **0%** |
| Recommended settings by drug type | ✅       | ❌          | ❌     | **0%** |
| Impact preview                    | ✅       | ❌          | ❌     | **0%** |
| Budget dashboard                  | ✅       | ❌          | ❌     | **0%** |
| Item status monitoring            | ✅       | ❌          | ❌     | **0%** |

**Level 3 Status:** ❌ **NOT STARTED** (0%)

**This is the entire Item-Level Budget Control spec!**

---

### ⚠️ LEVEL 4: Budget Reservation & Commitment

| Feature                           | Designed | Implemented | Tested | Status |
| --------------------------------- | -------- | ----------- | ------ | ------ |
| budget_reservations table         | ✅       | ✅          | ⏳     | 100%   |
| check_budget_availability() func  | ✅       | ✅          | ⏳     | 100%   |
| reserve_budget() func             | ✅       | ✅          | ⏳     | 100%   |
| commit_budget() func              | ✅       | ✅          | ⏳     | 100%   |
| release_budget_reservation() func | ✅       | ✅          | ⏳     | 100%   |
| auto_release_expired() func       | ✅       | ✅          | ⏳     | 100%   |
| **Integration with PR creation**  | ✅       | ❌          | ❌     | **0%** |
| **Integration with PO approval**  | ✅       | ❌          | ❌     | **0%** |
| **Cron job for auto-release**     | ✅       | ❌          | ❌     | **0%** |

**Level 4 Status:** ⚠️ **FUNCTIONS READY, NO INTEGRATION** (60%)

**Missing:**

- ❌ **PR creation ไม่ได้เรียก reserve_budget()**
- ❌ **PO approval ไม่ได้เรียก commit_budget()**
- ❌ **PR rejection ไม่ได้เรียก release_budget()**
- ❌ **Cron job ยังไม่มี** (auto_release_expired_reservations)

**แต่ตอนนี้ไม่ต้องทำ เพราะรอ PR/PO spec**

---

### ⚠️ LEVEL 5: Historical Data & Planning

| Feature                    | Designed | Implemented | Tested | Status |
| -------------------------- | -------- | ----------- | ------ | ------ |
| last_year_qty field        | ✅       | ✅          | ⏳     | 100%   |
| two_years_ago_qty field    | ✅       | ✅          | ⏳     | 100%   |
| three_years_ago_qty field  | ✅       | ✅          | ⏳     | 100%   |
| 3-year average calculation | ✅       | ❌          | ❌     | **0%** |
| Trend analysis UI          | ✅       | ❌          | ❌     | **0%** |
| Auto-suggest quantities    | ✅       | ❌          | ❌     | **0%** |

**Level 5 Status:** ⚠️ **SCHEMA READY, NO LOGIC** (30%)

**Missing:**

- ❌ **Calculation logic** (3-year average)
- ❌ **UI to display trends**
- ❌ **Auto-suggest based on history**

---

### ⚠️ LEVEL 6: Purchased Tracking

| Feature                               | Designed | Implemented | Tested | Status |
| ------------------------------------- | -------- | ----------- | ------ | ------ |
| q1_purchased_qty field                | ✅       | ✅          | ⏳     | 100%   |
| q2_purchased_qty field                | ✅       | ✅          | ⏳     | 100%   |
| q3_purchased_qty field                | ✅       | ✅          | ⏳     | 100%   |
| q4_purchased_qty field                | ✅       | ✅          | ⏳     | 100%   |
| total_purchased_qty field             | ✅       | ✅          | ⏳     | 100%   |
| total_purchased_value field           | ✅       | ✅          | ⏳     | 100%   |
| **Update logic when PO approved**     | ✅       | ❌          | ❌     | **0%** |
| **Sync with allocations.spent**       | ✅       | ❌          | ❌     | **0%** |
| Variance analysis (planned vs actual) | ✅       | ❌          | ❌     | **0%** |
| Over/under purchase alerts            | ✅       | ❌          | ❌     | **0%** |

**Level 6 Status:** ⚠️ **FIELDS EXIST, NO UPDATE LOGIC** (40%)

**Missing:**

- ❌ **PO approval ไม่ได้ update purchased_qty** (รอ PO spec)
- ❌ **Variance analysis UI**
- ❌ **Alerts when over/under budget**

---

## 📊 Overall Budget System Completion

```
Level 1: Budget Request Workflow      [█████████████████████] 95%  ✅
Level 2: Budget Allocations            [████████████░░░░░░░░] 60%  ⚠️
Level 3: Item-Level Control            [░░░░░░░░░░░░░░░░░░░░]  0%  ❌
Level 4: Reservation/Commitment        [████████████░░░░░░░░] 60%  ⚠️
Level 5: Historical Data               [██████░░░░░░░░░░░░░░] 30%  ⚠️
Level 6: Purchased Tracking            [████████░░░░░░░░░░░░] 40%  ⚠️

Overall:                               [███████████░░░░░░░░░] 47%
```

---

## 🎯 What Can We Complete NOW (Without PR/PO)

### 🟢 HIGH PRIORITY - Can Do Now

#### 1. Item-Level Budget Control (Level 3) ✅ **CAN DO**

**Why we can do this:**

- เป็นการตั้งค่าที่ budget request items
- ไม่ต้องรอ PR/PO
- UI สำหรับตั้งค่า control types
- Database schema changes

**Tasks:**

```
✅ Add control type fields to budget_request_items:
   - quantity_control_type (NONE/SOFT/HARD)
   - price_control_type (NONE/SOFT/HARD)
   - quantity_variance_percent (0-100)
   - price_variance_percent (0-100)

✅ Create check_item_budget_control() function
   - Input: budget_request_item_id, pr_quantity, pr_unit_price, quarter
   - Output: allowed, quantity_status, price_status, message
   - Logic: Compare planned vs purchased, check tolerance

✅ UI: Item Settings Modal
   - Select control types per item
   - Set variance percentages
   - Show recommended settings by drug type
   - Real-time impact preview

✅ UI: Budget Dashboard (Read-Only)
   - List items with control types
   - Show status badges (🔴 HARD, 🟡 SOFT, ⚪ NONE)
   - Filter by control type
   - Display budget usage (based on purchased_qty)
```

**Effort:** ~14 hours (ตาม spec ที่เขียนไว้)
**Impact:** High - เตรียมระบบไว้สำหรับ PR/PO validation
**Dependencies:** None (ไม่ต้องรอ PR/PO spec)

---

#### 2. Budget Allocations UI (Level 2) ✅ **CAN DO**

**Why we can do this:**

- Data มีแล้ว (finance approve สร้างไว้)
- แค่ทำ UI ให้ดูและแก้ไขได้

**Tasks:**

```
✅ View Budget Allocations Page
   - List allocations by fiscal year
   - Show quarterly breakdown
   - Display spent/remaining
   - Filter by department, budget type

✅ Edit Allocation (Manual Adjustment)
   - Form to edit q1-q4 budgets
   - Recalculate totals
   - Require reason + approval
   - Audit log changes

✅ Budget Amendment Workflow (Basic)
   - Request increase/decrease
   - Approval flow
   - Update allocations
   - Track amendments
```

**Effort:** ~8 hours
**Impact:** Medium - ให้ finance แก้ไขงบได้
**Dependencies:** None

---

#### 3. Historical Data Calculations (Level 5) ✅ **CAN DO**

**Why we can do this:**

- Fields มีแล้ว (last_year_qty, etc.)
- แค่ทำ calculation logic

**Tasks:**

```
✅ 3-Year Average Calculation
   - Function: calculate_historical_average(item_id)
   - Use last_year + 2_years + 3_years / 3
   - Handle nulls gracefully

✅ Trend Analysis
   - Determine if usage increasing/decreasing
   - Calculate growth rate
   - Suggest next year quantity

✅ Auto-Suggest Feature
   - When adding item, show suggestion
   - "Based on 3-year average: 1,200 units"
   - User can accept or override
```

**Effort:** ~4 hours
**Impact:** Medium - ช่วยในการวางแผน
**Dependencies:** None

---

### 🔴 BLOCKED - Cannot Do Now (Need PR/PO)

#### 4. Reservation Integration (Level 4) ❌ **BLOCKED**

- PR creation → reserve_budget()
- PO approval → commit_budget()
- PR rejection → release_budget()
- **Reason:** ต้องรอ PR/PO spec ก่อน

#### 5. Purchased Tracking Update (Level 6) ❌ **BLOCKED**

- PO approval → update q1_purchased_qty
- Sync with allocations.q1_spent
- **Reason:** ต้องรอ PO approval flow ก่อน

#### 6. Item-Level Validation in PR (Level 3 validation part) ❌ **BLOCKED**

- PR creation → call check_item_budget_control()
- Show red/yellow alerts
- Require reason for SOFT warnings
- **Reason:** ต้องรอ PR creation flow ก่อน

---

## 🚀 Recommended Focus Plan

### Phase A: Item-Level Budget Control Setup (NOW)

**Timeline:** 2-3 days
**Effort:** ~14 hours

**Deliverables:**

1. ✅ Schema: Control type fields in budget_request_items
2. ✅ Function: check_item_budget_control()
3. ✅ UI: Item settings modal (set control types)
4. ✅ UI: Budget dashboard (view items with control types)
5. ✅ Tests: Function validation logic
6. ✅ Docs: User guide for setting controls

**Why this first:**

- เตรียม infrastructure ไว้
- ไม่ต้องรอ PR/PO
- Finance สามารถเริ่มตั้งค่า control types ได้เลย
- เมื่อ PR/PO พร้อม ก็เชื่อมได้ทันที

---

### Phase B: Budget Allocations Management (NEXT)

**Timeline:** 1-2 days
**Effort:** ~8 hours

**Deliverables:**

1. ✅ UI: View allocations page
2. ✅ UI: Edit allocation form
3. ✅ Workflow: Budget amendment approval
4. ✅ Function: transfer_budget() (quarter transfer)

**Why this next:**

- Finance ต้องการแก้ไขงบกลางปี
- ไม่ขึ้นกับ PR/PO
- เป็น management feature

---

### Phase C: Historical Data & Planning (OPTIONAL)

**Timeline:** 0.5-1 day
**Effort:** ~4 hours

**Deliverables:**

1. ✅ Calculation: 3-year average
2. ✅ UI: Trend display
3. ✅ Feature: Auto-suggest quantities

**Why optional:**

- Nice-to-have, not critical
- ช่วยในการวางแผน
- ทำเมื่อมีเวลาเหลือ

---

### Phase D: PR/PO Integration (WAIT FOR PR/PO SPEC)

**Timeline:** TBD (depends on PR/PO spec completion)
**Effort:** ~10 hours

**Deliverables:**

1. ⏳ PR creation → reserve_budget()
2. ⏳ PO approval → commit_budget() + update purchased_qty
3. ⏳ PR rejection → release_budget()
4. ⏳ Item-level validation in PR UI
5. ⏳ Cron job for auto-release

**Why wait:**

- ต้องการ PR/PO spec ก่อน
- ต้องเข้าใจ workflow ของ PR/PO
- ไม่ควรทำก่อนเวลา

---

## ✅ Immediate Action Plan

### Today (4 hours):

1. **Decision: Proceed with Phase A?** (30 min)
   - Review this gap analysis
   - Confirm we can start item-level control
   - No need to wait for PR/PO spec

2. **Start Phase A: Database Schema** (1 hour)
   - Create migration: Add control type fields
   - Run migration
   - Verify schema

3. **Create check_item_budget_control() Function** (2 hours)
   - Write PL/pgSQL function
   - Test with sample data
   - Document function

4. **Update TypeBox Schemas** (30 min)
   - Add control type schemas
   - Update budget request item schemas

### Tomorrow (6 hours):

5. **UI: Item Settings Modal** (3 hours)
   - Angular component
   - Reactive forms
   - Control type dropdowns
   - Variance inputs

6. **UI: Budget Dashboard** (3 hours)
   - List items
   - Show control badges
   - Filter by type
   - Status indicators

### Day 3 (4 hours):

7. **Testing** (2 hours)
   - Function tests
   - UI component tests
   - Integration tests

8. **Documentation** (2 hours)
   - User guide
   - API docs
   - Examples

---

## 🎯 Success Criteria (Phase A Complete)

### Database:

- ✅ budget_request_items has control type fields
- ✅ check_item_budget_control() function works
- ✅ Validation logic correct (NONE/SOFT/HARD)
- ✅ Tests pass

### Backend:

- ✅ TypeBox schemas updated
- ✅ API endpoints for CRUD on control settings
- ✅ Function callable via API

### Frontend:

- ✅ Item settings modal functional
- ✅ Can set NONE/SOFT/HARD per item
- ✅ Variance percentages editable
- ✅ Budget dashboard displays items
- ✅ Status badges show control types

### Business:

- ✅ Finance can configure control types
- ✅ Settings saved to database
- ✅ Ready for PR validation (when PR/PO ready)

---

## 📝 Summary

### What Budget System Has NOW:

✅ Budget request workflow (95% complete)
✅ Budget allocations (60% complete - missing UI)
✅ Reservation functions (60% complete - no integration)
✅ Purchased tracking fields (40% complete - no update logic)
✅ Historical data fields (30% complete - no calculation)
❌ Item-level control (0% complete - entire spec)

### What We Can Do WITHOUT PR/PO:

1. ✅ **Item-Level Budget Control** (14 hours) - HIGH PRIORITY
2. ✅ **Budget Allocations UI** (8 hours) - MEDIUM PRIORITY
3. ✅ **Historical Data Calculations** (4 hours) - LOW PRIORITY

### What We MUST WAIT FOR:

1. ❌ **Reservation integration** - need PR/PO spec
2. ❌ **Purchased tracking update** - need PO approval flow
3. ❌ **Item validation in PR** - need PR creation flow

---

**Recommendation:**
🎯 **เริ่ม Phase A (Item-Level Budget Control) เลย** - ไม่ต้องรอ PR/PO spec, ใช้เวลา 2-3 วัน, ได้ระบบที่พร้อมใช้และเชื่อมต่อได้ทันทีเมื่อ PR/PO พร้อม
