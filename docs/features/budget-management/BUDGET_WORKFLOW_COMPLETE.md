# ระบบงบประมาณ - Workflow สมบูรณ์

**เอกสารฉบับนี้:** อธิบาย workflow การทำงานจริงของระบบงบประมาณ ตั้งแต่จัดสรรงบจนถึงการตัดงบและติดตาม

**วันที่สร้าง:** 18 ธันวาคม 2025
**สถานะ:** Draft - รอ Review และ Implement

---

## 📋 สารบัญ

1. [ภาพรวม Business Process](#1-ภาพรวม-business-process)
2. [Workflow 1: Budget Request & Allocation](#2-workflow-1-budget-request--allocation)
3. [Workflow 2: Budget Planning](#3-workflow-2-budget-planning)
4. [Workflow 3: Purchase Request (PR)](#4-workflow-3-purchase-request-pr)
5. [Workflow 4: Purchase Order (PO)](#5-workflow-4-purchase-order-po)
6. [Workflow 5: Goods Receipt & Inventory](#6-workflow-5-goods-receipt--inventory)
7. [สรุปสิ่งที่ต้องปรับปรุง](#7-สรุปสิ่งที่ต้องปรับปรุง)

---

## 1. ภาพรวม Business Process

### 1.1 แนวคิดหลัก

**งบประมาณในโรงพยาบาล = งบกลาง (Central Budget Pool)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    งบประมาณยารวมโรงพยาบาล                         │
│                    5,000,000 บาท/ปี                             │
│                                                                 │
│   ไม่แบ่งแยกรายแผนก - ทุกแผนกใช้ร่วมกัน                          │
│   คลังกลางเป็นผู้ซื้อรวม                                         │
└─────────────────────────────────────────────────────────────────┘
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │
    ┌────▼────┐      ┌──────▼─────┐    ┌──────▼─────┐    ┌──────▼─────┐
    │ แผนก A  │      │  แผนก B   │    │  แผนก C   │    │  แผนก D   │
    │ อายุรกรรม│      │  ศัลยกรรม  │    │  เภสัช     │    │  ห้องฉุกเฉิน│
    └─────────┘      └────────────┘    └────────────┘    └────────────┘
         │                  │                  │                  │
         └──────────────────┴──────────────────┴──────────────────┘
                                  │
                      ┌───────────▼──────────┐
                      │   คลังกลางจัดซื้อรวม  │
                      │   (Central Warehouse) │
                      └──────────────────────┘
```

**หลักการทำงาน:**

1. **งบรวม** - ไม่จำกัดรายแผนก ใครก็ใช้ได้
2. **ติดตามการใช้** - แต่ละแผนกใช้เท่าไหร่ ต้องรู้ (เพื่อวางแผนปีหน้า)
3. **คลังกลางซื้อ** - จัดซื้อรวมทั้งโรงพยาบาล (ประหยัดต้นทุน)
4. **แบ่งตามไตรมาส** - Q1-Q4 เพื่อควบคุมการใช้จ่ายให้สม่ำเสมอ

---

### 1.2 Timeline ตลอดปีงบประมาณ

```
ปีงบประมาณ 2568 (1 ต.ค. 2567 - 30 ก.ย. 2568)

เดือน 1-3:    ก.ค.-ก.ย. 2567    [เตรียมงบประมาณปี 2568]
              └─> สร้าง Budget Request
              └─> รวบรวมความต้องการ
              └─> อนุมัติงบ

Q1:           ต.ค.-ธ.ค. 2567    [วางแผน + จัดซื้อ Q1]
              └─> วางแผนรายยา (Budget Plan)
              └─> สร้าง PR/PO สำหรับ Q1
              └─> รับของเข้าคลัง

Q2:           ม.ค.-มี.ค. 2568   [จัดซื้อ Q2]
              └─> สร้าง PR/PO สำหรับ Q2
              └─> ติดตามงบ Q1

Q3:           เม.ย.-มิ.ย. 2568  [จัดซื้อ Q3]
              └─> สร้าง PR/PO สำหรับ Q3
              └─> ติดตามงบ Q1-Q2

Q4:           ก.ค.-ก.ย. 2568    [จัดซื้อ Q4 + Review]
              └─> สร้าง PR/PO สำหรับ Q4
              └─> ติดตามงบ Q1-Q3
              └─> เตรียมงบปี 2569
```

---

### 1.3 ผู้เกี่ยวข้อง (Actors)

| บทบาท               | ความรับผิดชอบ                      | Permission                                      |
| ------------------- | ---------------------------------- | ----------------------------------------------- |
| **Finance Manager** | จัดสรรงบประมาณ, อนุมัติงบ          | `budgetRequests:approve_finance`                |
| **Department Head** | อนุมัติคำขอของแผนก                 | `budgetRequests:approve_dept`                   |
| **Pharmacist**      | วางแผนยา, สร้าง PR                 | `budgetPlans:create`, `purchaseRequests:create` |
| **Warehouse Staff** | สร้าง PO, รับของ                   | `purchaseOrders:create`, `inventory:receive`    |
| **System**          | Reserve/Commit/Release งบอัตโนมัติ | -                                               |

---

## 2. Workflow 1: Budget Request & Allocation

### 2.1 จุดประสงค์

**สร้างคำขอตั้งงบประมาณรายปี และจัดสรรงบเมื่อได้รับอนุมัติ**

---

### 2.2 ขั้นตอนการทำงาน

#### Step 1.1: สร้าง Budget Request (User: Finance/Pharmacist)

**Input:**

- ปีงบประมาณ (fiscal_year): 2568
- แผนก (department_id): **NULL** (งบกลาง)
- เหตุผล (justification): "งบประมาณยาประจำปี 2568"

**Action:**

```http
POST /api/inventory/budget/budget-requests
{
  "fiscal_year": 2568,
  "department_id": null,
  "justification": "งบประมาณยาประจำปี 2568 สำหรับยาทั้งหมด ~5,000 รายการ"
}
```

**Database:**

```sql
INSERT INTO inventory.budget_requests (
  request_number,      -- 'BR-2568-001' (auto-generated)
  fiscal_year,         -- 2568
  department_id,       -- NULL (งบกลาง)
  status,              -- 'DRAFT'
  total_requested_amount, -- 0 (คำนวณจาก items)
  created_by,          -- user_id
  created_at
) VALUES (...);
```

**Output:**

- `budget_requests` record สถานะ `DRAFT`

---

#### Step 1.2: เพิ่มรายการยา (Add Items)

**Input:**

- รายการยา 5,000 รายการ (import จาก Excel)

**Action:**

```http
POST /api/inventory/budget/budget-requests/1/items
[
  {
    "generic_id": 100,           // Paracetamol 500mg
    "requested_qty": 120000,     // 120,000 เม็ด
    "unit_price": 2.50,
    "q1_qty": 30000,             // Q1: 30,000 เม็ด
    "q2_qty": 30000,
    "q3_qty": 30000,
    "q4_qty": 30000,
    "budget_type_id": 1          // งบดำเนินงาน
  },
  // ... อีก 4,999 รายการ
]
```

**Database:**

```sql
INSERT INTO inventory.budget_request_items (
  budget_request_id,   -- 1
  line_number,         -- 1, 2, 3, ...
  generic_id,          -- 100
  requested_qty,       -- 120000
  unit_price,          -- 2.50
  q1_qty, q2_qty, q3_qty, q4_qty,
  budget_type_id,      -- 1
  item_justification
) VALUES (...);

-- คำนวณ total_requested_amount
UPDATE inventory.budget_requests
SET total_requested_amount = (
  SELECT SUM(requested_qty * unit_price)
  FROM budget_request_items
  WHERE budget_request_id = 1
)
WHERE id = 1;
```

**Output:**

- `budget_request_items` 5,000 records
- `total_requested_amount` = 5,000,000 บาท

---

#### Step 1.3: Submit (ส่งคำขอ)

**Action:**

```http
POST /api/inventory/budget/budget-requests/1/submit
```

**Database:**

```sql
UPDATE inventory.budget_requests
SET status = 'SUBMITTED',
    submitted_by = user_id,
    submitted_at = NOW()
WHERE id = 1;
```

**Output:**

- Status: `DRAFT` → `SUBMITTED`

---

#### Step 1.4: Department Approve (หัวหน้าแผนกอนุมัติ)

**⚠️ หมายเหตุ:** สำหรับงบกลาง อาจข้าม step นี้ หรือให้ Finance ทำทั้ง 2 step

**Action:**

```http
POST /api/inventory/budget/budget-requests/1/approve-dept
{
  "comments": "เห็นชอบคำขอตั้งงบประมาณยาปี 2568"
}
```

**Database:**

```sql
UPDATE inventory.budget_requests
SET status = 'DEPT_APPROVED',
    dept_reviewed_by = user_id,
    dept_reviewed_at = NOW(),
    dept_comments = 'เห็นชอบ...'
WHERE id = 1;
```

**Output:**

- Status: `SUBMITTED` → `DEPT_APPROVED`

---

#### Step 1.5: Finance Approve (การเงินอนุมัติ) ⭐ **สร้าง Budget Allocations**

**Action:**

```http
POST /api/inventory/budget/budget-requests/1/approve-finance
{
  "comments": "อนุมัติงบประมาณยาปี 2568 จำนวน 5,000,000 บาท"
}
```

**Database Transaction:**

```sql
BEGIN;

-- 1. Update budget request status
UPDATE inventory.budget_requests
SET status = 'FINANCE_APPROVED',
    finance_reviewed_by = user_id,
    finance_reviewed_at = NOW(),
    finance_comments = 'อนุมัติ...'
WHERE id = 1;

-- 2. Fetch all items
SELECT * FROM budget_request_items WHERE budget_request_id = 1;

-- 3. สร้าง budget_allocations สำหรับแต่ละรายการ
-- (Loop for each item)

FOR EACH item:
  -- กำหนด department_id
  -- ถ้า request.department_id = NULL → ใช้ department_id = 1 (คลังกลาง)
  target_department_id = request.department_id || 1;

  -- คำนวณงบแต่ละไตรมาส
  total_amount = item.requested_qty * item.unit_price;
  q1_amount = item.q1_qty * item.unit_price;
  q2_amount = item.q2_qty * item.unit_price;
  q3_amount = item.q3_qty * item.unit_price;
  q4_amount = item.q4_qty * item.unit_price;

  -- UPSERT budget_allocations
  INSERT INTO inventory.budget_allocations (
    fiscal_year,         -- 2568
    budget_id,           -- item.budget_type_id || 1
    department_id,       -- 1 (คลังกลาง)
    total_budget,        -- total_amount
    q1_budget,           -- q1_amount
    q2_budget,           -- q2_amount
    q3_budget,           -- q3_amount
    q4_budget,           -- q4_amount
    total_spent,         -- 0
    q1_spent, q2_spent, q3_spent, q4_spent,  -- 0
    remaining_budget,    -- total_amount (เท่ากับ total_budget)
    is_active,           -- true
    created_at, updated_at
  ) VALUES (...)
  ON CONFLICT (fiscal_year, budget_id, department_id)
  DO UPDATE SET
    total_budget = budget_allocations.total_budget + EXCLUDED.total_budget,
    q1_budget = budget_allocations.q1_budget + EXCLUDED.q1_budget,
    q2_budget = budget_allocations.q2_budget + EXCLUDED.q2_budget,
    q3_budget = budget_allocations.q3_budget + EXCLUDED.q3_budget,
    q4_budget = budget_allocations.q4_budget + EXCLUDED.q4_budget,
    remaining_budget = budget_allocations.remaining_budget + EXCLUDED.total_budget,
    updated_at = NOW();

COMMIT;
```

**Output:**

- Status: `DEPT_APPROVED` → `FINANCE_APPROVED`
- สร้าง `budget_allocations` record:

```
budget_allocations (example):
├─ fiscal_year: 2568
├─ budget_id: 1 (งบดำเนินงาน)
├─ department_id: 1 (คลังกลาง/งบรวม)
├─ total_budget: 5,000,000.00
├─ q1_budget: 1,250,000.00
├─ q2_budget: 1,250,000.00
├─ q3_budget: 1,250,000.00
├─ q4_budget: 1,250,000.00
├─ total_spent: 0
├─ q1_spent: 0
├─ q2_spent: 0
├─ q3_spent: 0
├─ q4_spent: 0
├─ remaining_budget: 5,000,000.00
└─ is_active: true
```

---

### 2.3 สรุป Workflow 1

```
User Input                   Database Tables                    Output
───────────────────────────────────────────────────────────────────────
1. สร้าง Request        →  budget_requests              →  BR-2568-001 (DRAFT)
2. เพิ่มรายการยา        →  budget_request_items (5,000) →  Total: 5M
3. Submit              →  budget_requests (SUBMITTED)   →  รอ Approve
4. Dept Approve        →  budget_requests (DEPT_APPROVED) → รอ Finance
5. Finance Approve     →  budget_requests (FINANCE_APPROVED)
                       →  budget_allocations (create!)  →  งบพร้อมใช้งาน
```

**สิ่งที่เกิดขึ้นหลัง Finance Approve:**

- ✅ งบถูกจัดสรรแล้ว (allocations created)
- ✅ งบพร้อมใช้งาน (remaining_budget = total_budget)
- ✅ สามารถสร้าง PR/PO ได้

---

## 3. Workflow 2: Budget Planning

### 3.1 จุดประสงค์

**วางแผนการใช้งบประมาณระดับยา - ว่าแต่ละยาจะซื้อเท่าไหร่ ไตรมาสไหน**

---

### 3.2 ขั้นตอนการทำงาน

#### Step 2.1: สร้าง Budget Plan (User: Pharmacist)

**Input:**

- ปีงบประมาณ: 2568
- แผนก: 1 (คลังกลาง)
- ชื่อแผน: "แผนจัดซื้อยาปี 2568"

**Action:**

```http
POST /api/inventory/budget/budget-plans
{
  "fiscal_year": 2568,
  "department_id": 1,  // คลังกลาง
  "plan_name": "แผนจัดซื้อยาปี 2568",
  "notes": "แผนจัดซื้อยาครอบคลุมทุกแผนก"
}
```

**Database:**

```sql
INSERT INTO inventory.budget_plans (
  fiscal_year,         -- 2568
  department_id,       -- 1
  plan_name,           -- "แผนจัดซื้อยาปี 2568"
  total_planned_amount,-- 0 (คำนวณจาก items)
  status,              -- 'DRAFT'
  created_by
) VALUES (...);
```

---

#### Step 2.2: เพิ่มรายการยา (Add Plan Items)

**Input:**

- รายการยา พร้อมข้อมูลย้อนหลัง 3 ปี

**Action:**

```http
POST /api/inventory/budget/budget-plans/1/items
[
  {
    "generic_id": 100,              // Paracetamol 500mg
    "last_year_qty": 115000,        // ปี 2567 ใช้ 115,000
    "two_years_ago_qty": 110000,    // ปี 2566 ใช้ 110,000
    "three_years_ago_qty": 105000,  // ปี 2565 ใช้ 105,000
    "planned_quantity": 120000,     // วางแผนซื้อ 120,000
    "estimated_unit_price": 2.50,
    "total_planned_value": 300000,  // 120,000 × 2.50
    "q1_planned_qty": 30000,
    "q2_planned_qty": 30000,
    "q3_planned_qty": 30000,
    "q4_planned_qty": 30000
  },
  // ... อีก 4,999 รายการ
]
```

**Database:**

```sql
INSERT INTO inventory.budget_plan_items (
  budget_plan_id,
  generic_id,
  last_year_qty,
  two_years_ago_qty,
  three_years_ago_qty,
  planned_quantity,
  estimated_unit_price,
  total_planned_value,
  q1_planned_qty,
  q2_planned_qty,
  q3_planned_qty,
  q4_planned_qty,
  total_purchased_qty,      -- 0 (ยังไม่ซื้อ)
  total_purchased_value,    -- 0
  q1_purchased_qty,         -- 0
  q2_purchased_qty,         -- 0
  q3_purchased_qty,         -- 0
  q4_purchased_qty          -- 0
) VALUES (...);
```

---

#### Step 2.3: Submit & Approve

**Action:**

```http
POST /api/inventory/budget/budget-plans/1/submit
POST /api/inventory/budget/budget-plans/1/approve
```

**Database:**

```sql
UPDATE inventory.budget_plans
SET status = 'APPROVED',
    approved_by = user_id,
    approved_at = NOW()
WHERE id = 1;
```

**Output:**

- Status: `DRAFT` → `SUBMITTED` → `APPROVED`

---

### 3.3 สรุป Workflow 2

```
User Input                   Database Tables                    Output
───────────────────────────────────────────────────────────────────────
1. สร้าง Plan          →  budget_plans                  →  Plan-2568-001
2. เพิ่มยา + ประวัติ   →  budget_plan_items (5,000)    →  Total: 4.8M
3. Approve             →  budget_plans (APPROVED)       →  แผนพร้อมใช้งาน
```

**ประโยชน์ของ Budget Plan:**

- ✅ เห็นภาพ historical consumption (3 ปีย้อนหลัง)
- ✅ วางแผนจัดซื้อได้แม่นยำ
- ✅ ติดตามว่าซื้อไปแล้วเท่าไหร่ (purchased vs planned)

---

## 4. Workflow 3: Purchase Request (PR)

### 4.1 จุดประสงค์

**สร้างคำขอจัดซื้อยา พร้อมจองงบประมาณชั่วคราว**

---

### 4.2 ขั้นตอนการทำงาน (ระบบปัจจุบัน vs ที่ควรเป็น)

#### Step 3.1: สร้าง PR (User: Pharmacist/Warehouse)

**Input:**

- ยาที่ต้องการ: Amoxicillin 500mg
- ปริมาณ: 5,000 แคปซูล
- ไตรมาส: Q1

**Action:**

```http
POST /api/inventory/purchase-requests
{
  "pr_number": "PR-2568-Q1-001",  // auto-generated
  "fiscal_year": 2568,
  "department_id": 5,              // แผนกเภสัช (คนขอซื้อ)
  "budget_id": 1,                  // งบดำเนินงาน
  "required_date": "2024-11-15",
  "purpose": "จัดซื้อยาไตรมาส 1",
  "items": [
    {
      "generic_id": 101,           // Amoxicillin 500mg
      "quantity": 5000,
      "unit": "CAP",
      "estimated_unit_price": 15.00,
      "estimated_total": 75000.00
    }
  ]
}
```

---

#### Step 3.2: ✅ **ตรวจสอบงบ** (ระบบควรทำ - ยังไม่มี!)

**Database Function (ต้องสร้าง):**

```sql
SELECT * FROM check_budget_availability(
  2568,        -- fiscal_year
  1,           -- budget_id
  1,           -- department_id (คลังกลาง)
  75000.00,    -- amount
  1            -- quarter (Q1)
);
```

**Logic:**

```sql
-- ดึงงบไตรมาส Q1
SELECT q1_budget, q1_spent FROM budget_allocations
WHERE fiscal_year = 2568
  AND budget_id = 1
  AND department_id = 1;

-- ผลลัพธ์:
q1_budget: 1,250,000.00
q1_spent: 0

-- ดึง active reservations ใน Q1
SELECT COALESCE(SUM(reserved_amount), 0) FROM budget_reservations
WHERE allocation_id = (
  SELECT id FROM budget_allocations
  WHERE fiscal_year = 2568 AND budget_id = 1 AND department_id = 1
)
AND status = 'active'
AND quarter = 1;

-- ผลลัพธ์:
reserved: 0

-- คำนวณ available
available = q1_budget - q1_spent - reserved
          = 1,250,000 - 0 - 0
          = 1,250,000.00

-- เทียบกับจำนวนที่ขอ
requested = 75,000.00

-- Result:
available >= requested → TRUE (มีงบพอ)
remaining = 1,250,000 - 75,000 = 1,175,000.00
```

**Output:**

```json
{
  "available": true,
  "remaining": 1175000.0
}
```

---

#### Step 3.3: ✅ **จองงบประมาณ** (ระบบควรทำ - ยังไม่มี!)

**Database Transaction:**

```sql
BEGIN;

-- 1. สร้าง PR
INSERT INTO inventory.purchase_requests (
  pr_number, fiscal_year, department_id, budget_id,
  total_amount, status, requested_by
) VALUES (
  'PR-2568-Q1-001', 2568, 5, 1,
  75000.00, 'SUBMITTED', user_id
) RETURNING id; -- id = 1

-- 2. สร้าง PR Items
INSERT INTO inventory.purchase_request_items (
  pr_id, generic_id, quantity, estimated_unit_price, estimated_total
) VALUES (1, 101, 5000, 15.00, 75000.00);

-- 3. จองงบ (Reserve Budget)
INSERT INTO inventory.budget_reservations (
  allocation_id,       -- (SELECT id FROM budget_allocations WHERE ...)
  pr_id,               -- 1
  reserved_amount,     -- 75000.00
  quarter,             -- 1
  reservation_date,    -- NOW()
  expires_date,        -- NOW() + INTERVAL '30 days'
  is_released,         -- false
  released_at          -- NULL
) VALUES (...);

COMMIT;
```

**Output:**

```
budget_reservations:
├─ allocation_id: 1
├─ pr_id: 1
├─ reserved_amount: 75,000.00
├─ quarter: 1
├─ reservation_date: 2024-10-15
├─ expires_date: 2024-11-14 (30 วัน)
├─ is_released: false
└─ released_at: NULL
```

**งบประมาณหลังจอง:**

```
Available (Q1) = q1_budget - q1_spent - reserved
               = 1,250,000 - 0 - 75,000
               = 1,175,000.00 บาท
```

---

#### Step 3.4: ถ้า PR Rejected → Release Budget

**Action:**

```http
POST /api/inventory/purchase-requests/1/reject
{
  "reason": "ราคาสูงเกินไป ต้องเจรจาใหม่"
}
```

**Database Transaction (ควรทำ - ยังไม่มี!):**

```sql
BEGIN;

-- 1. Update PR status
UPDATE inventory.purchase_requests
SET status = 'REJECTED',
    rejected_by = user_id,
    rejected_at = NOW(),
    rejection_reason = 'ราคาสูงเกินไป...'
WHERE id = 1;

-- 2. Release reservation
UPDATE inventory.budget_reservations
SET is_released = true,
    released_at = NOW()
WHERE pr_id = 1
  AND is_released = false;

COMMIT;
```

**Output:**

- PR status → `REJECTED`
- Reservation → `is_released = true`
- งบประมาณกลับมาใช้ได้ (available เพิ่มขึ้น 75,000)

---

### 4.3 สรุป Workflow 3

| Step                 | ระบบปัจจุบัน | ควรเป็น   | Status    |
| -------------------- | ------------ | --------- | --------- |
| 1. สร้าง PR          | ✅ มี        | ✅        | ใช้งานได้ |
| 2. Check Budget      | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |
| 3. Reserve Budget    | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |
| 4. Release on Reject | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |

**สิ่งที่ขาด:**

1. ❌ Database function: `check_budget_availability()`
2. ❌ Logic: Reserve budget หลังสร้าง PR
3. ❌ Logic: Release budget เมื่อ reject PR
4. ❌ Validation: ห้ามสร้าง PR ถ้างบไม่พอ

---

## 5. Workflow 4: Purchase Order (PO)

### 5.1 จุดประสงค์

**สร้าง PO จาก PR ที่ approved และตัดงบจริงเมื่อ PO approved**

---

### 5.2 ขั้นตอนการทำงาน

#### Step 4.1: สร้าง PO จาก PR (User: Warehouse)

**Action:**

```http
POST /api/inventory/purchase-orders
{
  "po_number": "PO-2568-Q1-001",  // auto-generated
  "pr_id": 1,                      // Reference to PR
  "vendor_id": 100,                // บริษัทยา ABC จำกัด
  "po_date": "2024-10-20",
  "delivery_date": "2024-11-15",
  "payment_terms": "NET30",
  "items": [
    {
      "pr_item_id": 1,
      "generic_id": 101,
      "quantity": 5000,
      "unit_price": 14.50,         // ต่อรองได้ถูกกว่า! (จาก 15.00)
      "discount_percent": 5,
      "discount_amount": 3625,
      "total_price": 68875.00      // (5000 × 14.50) - 3625
    }
  ],
  "total_amount": 68875.00,
  "vat_amount": 4821.25,           // 7%
  "grand_total": 73696.25
}
```

**Database:**

```sql
INSERT INTO inventory.purchase_orders (
  po_number, pr_id, vendor_id, po_date, delivery_date,
  total_amount, vat_amount, grand_total,
  status, payment_terms
) VALUES (
  'PO-2568-Q1-001', 1, 100, '2024-10-20', '2024-11-15',
  68875.00, 4821.25, 73696.25,
  'DRAFT', 'NET30'
);
```

---

#### Step 4.2: ✅ **Approve PO → Commit Budget** (ควรทำ - ยังไม่มี!)

**Action:**

```http
POST /api/inventory/purchase-orders/1/approve
```

**Database Transaction (ควรทำ):**

```sql
BEGIN;

-- 1. Update PO status
UPDATE inventory.purchase_orders
SET status = 'APPROVED',
    approved_by = user_id,
    approved_at = NOW()
WHERE id = 1;

-- 2. หา allocation และ reservation
SELECT ba.id as allocation_id,
       br.id as reservation_id,
       br.reserved_amount
FROM budget_reservations br
JOIN budget_allocations ba ON ba.id = br.allocation_id
WHERE br.pr_id = 1
  AND br.is_released = false;

-- 3. ตัดงบจริง (Commit Budget)
-- คำนวณไตรมาส
quarter = EXTRACT(QUARTER FROM po_date);  -- Q1 = 1

-- Update budget allocation
UPDATE inventory.budget_allocations
SET q1_spent = q1_spent + 68875.00,      -- ตัดงบ Q1
    total_spent = total_spent + 68875.00,
    remaining_budget = remaining_budget - 68875.00,
    updated_at = NOW()
WHERE id = allocation_id;

-- 4. Release reservation (เปลี่ยนสถานะ)
UPDATE inventory.budget_reservations
SET is_released = true,
    released_at = NOW()
WHERE id = reservation_id;

-- 5. คืนส่วนต่าง (ถ้าราคาจริงถูกกว่า)
-- Reserved: 75,000.00
-- Actual: 68,875.00
-- Refund: 6,125.00
UPDATE inventory.budget_allocations
SET q1_spent = q1_spent - 6125.00,
    total_spent = total_spent - 6125.00,
    remaining_budget = remaining_budget + 6125.00
WHERE id = allocation_id;

-- Final spent:
-- q1_spent = 68875 - 6125 = 62750 ❌ ผิด!
-- ควรเป็น: q1_spent = 68875 (ไม่ต้องคืน เพราะเราตัดตามจริง)

-- ✅ ถูกต้อง: ตัดตามราคาจริงเลย ไม่ต้องคืน
UPDATE inventory.budget_allocations
SET q1_spent = q1_spent + 68875.00,
    total_spent = total_spent + 68875.00,
    remaining_budget = total_budget - total_spent
WHERE id = allocation_id;

COMMIT;
```

**สำคัญ:** ตัดงบตาม **PO Amount จริง** ไม่ใช่ตาม Reserved Amount

**ผลลัพธ์:**

```
ก่อน Approve PO:
  q1_budget: 1,250,000.00
  q1_spent: 0
  remaining_budget: 5,000,000.00
  reserved (active): 75,000.00

หลัง Approve PO:
  q1_budget: 1,250,000.00
  q1_spent: 68,875.00          ← ตัดงบจริง
  remaining_budget: 4,931,125.00
  reserved (active): 0         ← ปลดล็อคแล้ว
```

---

#### Step 4.3: ✅ **Update Budget Plan** (ควรทำ - ยังไม่มี!)

**Database (ควรทำในขั้นตอนเดียวกับ commit budget):**

```sql
-- อัปเดต purchased quantity ใน budget_plan_items
UPDATE inventory.budget_plan_items
SET q1_purchased_qty = q1_purchased_qty + 5000,
    total_purchased_qty = total_purchased_qty + 5000,
    total_purchased_value = total_purchased_value + 68875.00,
    updated_at = NOW()
WHERE budget_plan_id = 1
  AND generic_id = 101;
```

**ผลลัพธ์:**

```
budget_plan_items (Amoxicillin):
  planned_quantity: 5,000
  q1_planned_qty: 1,250
  q1_purchased_qty: 5,000 ✅ (ซื้อเกินแผน Q1!)
  total_purchased_qty: 5,000
  total_purchased_value: 68,875.00 (ถูกกว่าประมาณการ!)
```

---

### 5.3 สรุป Workflow 4

| Step                   | ระบบปัจจุบัน | ควรเป็น   | Status    |
| ---------------------- | ------------ | --------- | --------- |
| 1. สร้าง PO            | ✅ มี        | ✅        | ใช้งานได้ |
| 2. Approve PO          | ✅ มี        | ✅        | ใช้งานได้ |
| 3. Commit Budget       | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |
| 4. Release Reservation | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |
| 5. Update Plan         | ❌ ไม่มี     | ✅ ต้องมี | ต้องเพิ่ม |

**สิ่งที่ขาด:**

1. ❌ Logic: Commit budget หลัง PO approved
2. ❌ Logic: Release reservation
3. ❌ Logic: Update budget_plan_items
4. ❌ Validation: ห้าม approve PO ถ้าไม่มี reservation

---

## 6. Workflow 5: Goods Receipt & Inventory

### 6.1 จุดประสงค์

**รับของเข้าคลัง และอัปเดตข้อมูลสต็อก (ไม่เกี่ยวกับงบแล้ว)**

---

### 6.2 ขั้นตอนการทำงาน

**Action:**

```http
POST /api/inventory/transactions
{
  "transaction_type": "RECEIVE",
  "po_id": 1,
  "items": [
    {
      "generic_id": 101,
      "quantity": 5000,
      "unit_price": 14.50,
      "lot_number": "LOT2024-001",
      "expiry_date": "2026-10-01"
    }
  ]
}
```

**Database:**

```sql
-- อัปเดตสต็อก
UPDATE inventory.drug_stocks
SET quantity = quantity + 5000,
    last_received_date = NOW()
WHERE generic_id = 101;

-- บันทึก transaction
INSERT INTO inventory.inventory_transactions (
  transaction_type, po_id, generic_id, quantity, unit_price
) VALUES ('RECEIVE', 1, 101, 5000, 14.50);
```

---

## 7. สรุปสิ่งที่ต้องปรับปรุง

### 7.1 ตารางข้อมูล

| ตาราง                  | สถานะ          | ปัญหา                   | แนวทางแก้ไข                      |
| ---------------------- | -------------- | ----------------------- | -------------------------------- |
| `budget_requests`      | ✅ พร้อม       | -                       | -                                |
| `budget_request_items` | ✅ พร้อม       | -                       | -                                |
| `budget_allocations`   | ✅ พร้อม       | -                       | -                                |
| `budget_plans`         | ✅ พร้อม       | -                       | -                                |
| `budget_plan_items`    | ✅ พร้อม       | -                       | -                                |
| `budget_reservations`  | ⚠️ มีแต่ไม่ใช้ | Schema ไม่ตรง functions | แก้ schema หรือเขียนฟังก์ชันใหม่ |
| `purchase_requests`    | ✅ พร้อม       | -                       | -                                |
| `purchase_orders`      | ✅ พร้อม       | -                       | -                                |

---

### 7.2 Database Functions ที่ต้องสร้าง

| Function                              | Purpose                | Priority   |
| ------------------------------------- | ---------------------- | ---------- |
| `check_budget_availability()`         | ตรวจสอบงบคงเหลือ       | 🔴 สูงมาก  |
| `reserve_budget()`                    | จองงบเมื่อสร้าง PR     | 🔴 สูงมาก  |
| `commit_budget()`                     | ตัดงบเมื่อ PO approved | 🔴 สูงมาก  |
| `release_budget_reservation()`        | ปลดล็อคงบ              | 🔴 สูงมาก  |
| `auto_release_expired_reservations()` | Auto-release หมดอายุ   | 🟡 ปานกลาง |

---

### 7.3 Application Hooks ที่ต้องเพิ่ม

| Event           | Current        | Should Be                                                 | File                           |
| --------------- | -------------- | --------------------------------------------------------- | ------------------------------ |
| **PR Created**  | สร้าง PR เฉยๆ  | + Check budget<br>+ Reserve budget                        | `purchase-requests.service.ts` |
| **PR Approved** | เปลี่ยน status | (เหมือนเดิม)                                              | -                              |
| **PR Rejected** | เปลี่ยน status | + Release budget                                          | `purchase-requests.service.ts` |
| **PO Approved** | เปลี่ยน status | + Commit budget<br>+ Release reservation<br>+ Update plan | `purchase-orders.service.ts`   |

---

### 7.4 Validations ที่ต้องเพิ่ม

| Validation                    | Current    | Should Be             |
| ----------------------------- | ---------- | --------------------- |
| สร้าง PR ต้องมีงบพอ           | ❌ ไม่เช็ค | ✅ เช็คก่อนสร้าง      |
| Approve PO ต้องมี reservation | ❌ ไม่เช็ค | ✅ เช็คก่อน approve   |
| ยาต้องอยู่ใน budget plan      | ❌ ไม่เช็ค | 🟡 Optional (warning) |
| ไตรมาสต้องมีงบเพียงพอ         | ❌ ไม่เช็ค | ✅ เช็คแยกรายไตรมาส   |

---

### 7.5 Monitoring & Alerts

| Feature              | Current  | Should Be               | Priority   |
| -------------------- | -------- | ----------------------- | ---------- |
| Budget Dashboard     | ❌ ไม่มี | ✅ แสดง utilization     | 🟡 ปานกลาง |
| Active Reservations  | ❌ ไม่มี | ✅ แสดงรายการที่จองอยู่ | 🟡 ปานกลาง |
| Budget > 80% Alert   | ❌ ไม่มี | ✅ ส่ง notification     | 🟢 ต่ำ     |
| Expired Reservations | ❌ ไม่มี | ✅ Cron job ปล่อยงบ     | 🟡 ปานกลาง |

---

### 7.6 แผนการพัฒนา (Implementation Plan)

#### Phase 1: แก้ Schema & Functions (3-5 วัน)

**ขั้นตอน:**

1. แก้ `budget_reservations` schema ให้ตรงกับ functions
2. สร้าง 5 database functions
3. Test functions

**Deliverables:**

- Migration script
- Function SQL files
- Unit tests

---

#### Phase 2: เพิ่ม Application Hooks (3-5 วัน)

**ขั้นตอน:**

1. เพิ่ม reserve logic ใน PR service
2. เพิ่ม commit logic ใน PO service
3. เพิ่ม release logic ใน PR reject
4. Test workflow end-to-end

**Deliverables:**

- Updated services
- Integration tests
- API documentation

---

#### Phase 3: Monitoring & Cron Jobs (2-3 วัน)

**ขั้นตอน:**

1. สร้าง budget dashboard API
2. เพิ่ม cron job auto-release
3. เพิ่ม alert system

**Deliverables:**

- Dashboard APIs
- Cron job scripts
- Alert configurations

---

## 8. ภาคผนวก

### 8.1 Example: Complete Flow (End-to-End)

**Scenario:** จัดซื้อยา Amoxicillin 5,000 แคปซูล

```
วันที่ 1 ก.ย. 2567
┌──────────────────────────────────────────────┐
│ 1. Finance สร้าง Budget Request             │
│    - ยา 5,000 รายการ                         │
│    - งบรวม 5,000,000 บาท                     │
│    → Status: DRAFT                           │
└──────────────────────────────────────────────┘

วันที่ 15 ก.ย. 2567
┌──────────────────────────────────────────────┐
│ 2. Finance Approve                           │
│    → budget_allocations สร้าง!              │
│    → งบพร้อมใช้งาน 5,000,000 บาท             │
└──────────────────────────────────────────────┘

วันที่ 1 ต.ค. 2567 (เริ่มปีงบ 2568)
┌──────────────────────────────────────────────┐
│ 3. Pharmacist สร้าง Budget Plan             │
│    - วางแผนยา 5,000 รายการ                   │
│    - แบ่งเป็นรายไตรมาส                       │
└──────────────────────────────────────────────┘

วันที่ 15 ต.ค. 2567
┌──────────────────────────────────────────────┐
│ 4. Pharmacist สร้าง PR-2568-Q1-001          │
│    - Amoxicillin 5,000 CAP @ 15.00           │
│    - Total: 75,000 บาท                       │
│                                              │
│ ✅ System Auto:                              │
│    - Check budget: OK (1,250,000 available)  │
│    - Reserve: 75,000 บาท                     │
│    - Expires: 14 พ.ย. 2567 (30 วัน)         │
└──────────────────────────────────────────────┘

Available Budget = 1,250,000 - 75,000 = 1,175,000

วันที่ 20 ต.ค. 2567
┌──────────────────────────────────────────────┐
│ 5. Warehouse สร้าง PO-2568-Q1-001           │
│    - Vendor: บริษัทยา ABC                    │
│    - ต่อรองราคาได้: 14.50/CAP                │
│    - Total: 68,875 บาท (ถูกกว่า!)           │
└──────────────────────────────────────────────┘

วันที่ 25 ต.ค. 2567
┌──────────────────────────────────────────────┐
│ 6. Manager Approve PO                        │
│                                              │
│ ✅ System Auto:                              │
│    - Commit budget: 68,875 บาท               │
│    - Release reservation                     │
│    - Update budget_plan_items                │
└──────────────────────────────────────────────┘

งบหลัง Commit:
  q1_spent: 68,875
  remaining: 4,931,125
  saved: 6,125 (จากการต่อรองราคา)

วันที่ 15 พ.ย. 2567
┌──────────────────────────────────────────────┐
│ 7. Warehouse รับของเข้าคลัง                  │
│    - Amoxicillin 5,000 CAP                   │
│    - Lot: LOT2024-001                        │
│    - Exp: 01/10/2026                         │
└──────────────────────────────────────────────┘

✅ Workflow สมบูรณ์!
```

---

### 8.2 ตัวอย่าง SQL Queries สำหรับ Monitoring

**Query 1: งบคงเหลือแต่ละไตรมาส**

```sql
SELECT
  fiscal_year,
  budget_id,
  q1_budget,
  q1_spent,
  q1_budget - q1_spent as q1_remaining,
  ROUND((q1_spent / NULLIF(q1_budget, 0)) * 100, 2) as q1_utilization,
  q2_budget,
  q2_spent,
  q2_budget - q2_spent as q2_remaining,
  ROUND((q2_spent / NULLIF(q2_budget, 0)) * 100, 2) as q2_utilization
FROM budget_allocations
WHERE fiscal_year = 2568
  AND department_id = 1
ORDER BY budget_id;
```

**Query 2: Active Reservations**

```sql
SELECT
  br.id,
  pr.pr_number,
  br.reserved_amount,
  br.quarter,
  br.reservation_date,
  br.expires_date,
  DATE_PART('day', br.expires_date - CURRENT_DATE) as days_until_expire
FROM budget_reservations br
JOIN purchase_requests pr ON pr.id = br.pr_id
WHERE br.is_released = false
  AND br.expires_date > CURRENT_DATE
ORDER BY br.expires_date ASC;
```

**Query 3: Budget vs Actual (Variance Analysis)**

```sql
SELECT
  bpi.generic_id,
  dg.generic_name,
  bpi.planned_quantity,
  bpi.total_purchased_qty,
  bpi.planned_quantity - bpi.total_purchased_qty as variance_qty,
  ROUND((bpi.total_purchased_qty / NULLIF(bpi.planned_quantity, 0)) * 100, 2) as fulfillment_rate,
  bpi.total_planned_value,
  bpi.total_purchased_value,
  bpi.total_planned_value - bpi.total_purchased_value as savings
FROM budget_plan_items bpi
JOIN drug_generics dg ON dg.id = bpi.generic_id
WHERE bpi.budget_plan_id = 1
ORDER BY variance_qty DESC;
```

---

## เอกสารนี้สร้างขึ้นเพื่อ:

1. ✅ เข้าใจ workflow ทั้งหมดอย่างชัดเจน
2. ✅ เห็นความแตกต่างระหว่างระบบปัจจุบัน vs ที่ควรเป็น
3. ✅ ระบุสิ่งที่ต้องปรับปรุง
4. ✅ วางแผนการพัฒนาระบบให้สมบูรณ์

**Next Steps:**

1. Review เอกสารนี้
2. Approve แนวทางการพัฒนา
3. เริ่ม Implementation ตาม Phase 1-3

---

**สิ้นสุดเอกสาร**
