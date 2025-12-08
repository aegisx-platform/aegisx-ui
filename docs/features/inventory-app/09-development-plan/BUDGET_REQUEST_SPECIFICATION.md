# 📋 Budget Request Workflow - Complete Specification

**System:** Budget Management
**Feature:** Budget Request (การขอจัดสรรงบประมาณ)
**Version:** 1.0.0
**Created:** 2024-12-08
**Status:** Ready for Implementation

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [Database Schema](#database-schema)
4. [API Specification](#api-specification)
5. [Frontend UI Specification](#frontend-ui-specification)
6. [Business Rules](#business-rules)
7. [Integration Points](#integration-points)
8. [Implementation Checklist](#implementation-checklist)

---

## Overview

### Purpose

Budget Request Workflow เป็นขั้นตอนแรกของระบบงบประมาณ ที่ให้แผนกต่างๆ สามารถขอจัดสรรงบประมาณประจำปีได้ โดยผ่านกระบวนการอนุมัติ 2 ขั้นตอน:

1. หัวหน้าแผนกอนุมัติ (Department Head Approval)
2. ผู้จัดการฝ่ายการเงินอนุมัติ (Finance Manager Approval)

เมื่อได้รับอนุมัติแล้ว ระบบจะสร้าง **Budget Allocation** อัตโนมัติ

### Workflow Flow

```
แผนก → สร้าง Budget Request (DRAFT)
  ↓
ส่งขออนุมัติ (SUBMITTED)
  ↓
หัวหน้าแผนกพิจารณา
  ↓ อนุมัติ                    ↓ ปฏิเสธ
(DEPT_APPROVED)              (REJECTED)
  ↓
Finance Manager พิจารณา
  ↓ อนุมัติ                    ↓ ปฏิเสธ
(FINANCE_APPROVED)           (REJECTED)
  ↓
ระบบสร้าง Budget Allocation อัตโนมัติ
  ↓
เข้าสู่ Workflow 1: Budget Allocation
```

---

## User Stories

### US-1: สร้างคำขอจัดสรรงบประมาณ

**As a** Department Staff
**I want to** create a budget request for the next fiscal year
**So that** my department can receive budget allocation

**Acceptance Criteria:**

- ✅ เลือกปีงบประมาณได้ (fiscal_year)
- ✅ ระบุแผนกที่ขอ (department_id)
- ✅ เพิ่มรายการงบหลายรายการได้ (multiple budget types)
- ✅ แต่ละรายการระบุ:
  - ประเภทงบ (budget_type_id)
  - จำนวนเงินรวม (requested_amount)
  - การแบ่งไตรมาส Q1-Q4 (รวมต้องเท่า requested_amount)
  - เหตุผลในการขอ (justification)
- ✅ บันทึกเป็น DRAFT ได้
- ✅ แก้ไขได้เมื่อยัง DRAFT

### US-2: ส่งคำขออนุมัติ

**As a** Department Staff
**I want to** submit my budget request for approval
**So that** it can be reviewed by my department head

**Acceptance Criteria:**

- ✅ ส่งได้เมื่อสถานะเป็น DRAFT
- ✅ ต้องมีรายการอย่างน้อย 1 รายการ
- ✅ ทุกรายการต้อง validate ผ่าน (Q1+Q2+Q3+Q4 = Total)
- ✅ เมื่อส่งแล้วเปลี่ยนสถานะเป็น SUBMITTED
- ✅ แก้ไขไม่ได้เมื่อสถานะเป็น SUBMITTED
- ✅ แจ้งเตือนหัวหน้าแผนกอัตโนมัติ

### US-3: หัวหน้าแผนกอนุมัติ/ปฏิเสธ

**As a** Department Head
**I want to** approve or reject budget requests from my department
**So that** only valid requests go to finance manager

**Acceptance Criteria:**

- ✅ เห็นเฉพาะคำขอของแผนกตัวเอง
- ✅ เห็นเฉพาะสถานะ SUBMITTED
- ✅ สามารถ:
  - อนุมัติ → เปลี่ยนเป็น DEPT_APPROVED + ส่งต่อ Finance
  - ปฏิเสธ → เปลี่ยนเป็น REJECTED + ระบุเหตุผล
- ✅ ปรับจำนวนเงินได้ก่อนอนุมัติ (แต่ไม่บังคับ)
- ✅ บันทึกวันที่และผู้อนุมัติ

### US-4: Finance Manager อนุมัติ/ปฏิเสธ (Final)

**As a** Finance Manager
**I want to** give final approval to budget requests
**So that** budget allocations can be created

**Acceptance Criteria:**

- ✅ เห็นคำขอทุกแผนก
- ✅ เห็นเฉพาะสถานะ DEPT_APPROVED
- ✅ สามารถ:
  - อนุมัติ → เปลี่ยนเป็น FINANCE_APPROVED + สร้าง Allocation อัตโนมัติ
  - ปฏิเสธ → เปลี่ยนเป็น REJECTED + ระบุเหตุผล
- ✅ ปรับจำนวนเงินได้ก่อนอนุมัติ
- ✅ บันทึกวันที่และผู้อนุมัติ
- ✅ เมื่ออนุมัติแล้วต้องสร้าง Budget Allocation อัตโนมัติ

### US-5: ดูรายการคำขอ

**As a** User (any role)
**I want to** view budget requests based on my role
**So that** I can track the status

**Acceptance Criteria:**

- ✅ Department Staff: เห็นเฉพาะคำขอของแผนกตัวเอง
- ✅ Department Head: เห็นคำขอของแผนกตัวเอง (ทุกสถานะ)
- ✅ Finance Manager: เห็นคำขอทุกแผนก (ทุกสถานะ)
- ✅ Filter ได้ตาม:
  - ปีงบประมาณ (fiscal_year)
  - สถานะ (status)
  - แผนก (department_id)
- ✅ แสดงข้อมูลสรุป:
  - เลขที่คำขอ
  - ชื่อแผนก
  - จำนวนเงินรวม
  - สถานะ
  - วันที่สร้าง

---

## Database Schema

### Table: `budget_requests`

```sql
CREATE TABLE inventory.budget_requests (
  id BIGSERIAL PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,  -- Format: BR-YYYY-NNNN
  fiscal_year INT NOT NULL,
  department_id BIGINT NOT NULL REFERENCES inventory.departments(id),

  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  -- Status: DRAFT, SUBMITTED, DEPT_APPROVED, FINANCE_APPROVED, REJECTED

  -- Request details
  total_requested_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  justification TEXT,  -- เหตุผลโดยรวม

  -- Approval tracking
  submitted_by BIGINT REFERENCES users(id),
  submitted_at TIMESTAMP,

  dept_reviewed_by BIGINT REFERENCES users(id),
  dept_reviewed_at TIMESTAMP,
  dept_comments TEXT,

  finance_reviewed_by BIGINT REFERENCES users(id),
  finance_reviewed_at TIMESTAMP,
  finance_comments TEXT,

  rejection_reason TEXT,

  -- Audit fields
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,

  -- Indexes
  CONSTRAINT chk_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'DEPT_APPROVED', 'FINANCE_APPROVED', 'REJECTED'))
);

CREATE INDEX idx_budget_requests_fiscal_year ON inventory.budget_requests(fiscal_year);
CREATE INDEX idx_budget_requests_department ON inventory.budget_requests(department_id);
CREATE INDEX idx_budget_requests_status ON inventory.budget_requests(status);
CREATE INDEX idx_budget_requests_number ON inventory.budget_requests(request_number);
```

### Table: `budget_request_items`

```sql
CREATE TABLE inventory.budget_request_items (
  id BIGSERIAL PRIMARY KEY,
  budget_request_id BIGINT NOT NULL REFERENCES inventory.budget_requests(id) ON DELETE CASCADE,
  budget_id BIGINT NOT NULL REFERENCES inventory.budgets(id),

  -- Requested amounts
  requested_amount DECIMAL(15,2) NOT NULL,
  q1_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  q2_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  q3_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  q4_amount DECIMAL(15,2) NOT NULL DEFAULT 0,

  -- Justification
  item_justification TEXT,

  -- Audit fields
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Validation constraint
  CONSTRAINT chk_quarterly_sum CHECK (
    q1_amount + q2_amount + q3_amount + q4_amount = requested_amount
  )
);

CREATE INDEX idx_budget_request_items_request ON inventory.budget_request_items(budget_request_id);
CREATE INDEX idx_budget_request_items_budget ON inventory.budget_request_items(budget_id);
```

### Auto-generate Request Number Function

```sql
CREATE OR REPLACE FUNCTION inventory.generate_budget_request_number(
  p_fiscal_year INT
) RETURNS VARCHAR(50) AS $$
DECLARE
  v_seq INT;
  v_number VARCHAR(50);
BEGIN
  -- Get next sequence number for this fiscal year
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(request_number FROM 'BR-[0-9]{4}-([0-9]{4})') AS INT
    )
  ), 0) + 1 INTO v_seq
  FROM inventory.budget_requests
  WHERE fiscal_year = p_fiscal_year;

  -- Format: BR-2025-0001
  v_number := 'BR-' || p_fiscal_year || '-' || LPAD(v_seq::TEXT, 4, '0');

  RETURN v_number;
END;
$$ LANGUAGE plpgsql;
```

---

## API Specification

### Base URL: `/api/inventory/budget/requests`

### 1. Create Budget Request

**POST** `/api/inventory/budget/requests`

**Request Body:**

```typescript
{
  fiscal_year: number;        // 2025
  department_id: number;      // 2
  justification?: string;     // "งบประมาณสำหรับจัดซื้อยาและเวชภัณฑ์ประจำปี 2025"
  items: [
    {
      budget_id: number;           // 1 (OP001 - ยาและเวชภัณฑ์)
      requested_amount: number;    // 10000000.00
      q1_amount: number;           // 2500000.00
      q2_amount: number;           // 2500000.00
      q3_amount: number;           // 2500000.00
      q4_amount: number;           // 2500000.00
      item_justification?: string; // "งบสำหรับยาและเวชภัณฑ์"
    }
  ]
}
```

**Response (201 Created):**

```typescript
{
  success: true,
  data: {
    id: 1,
    request_number: "BR-2025-0001",
    fiscal_year: 2025,
    department_id: 2,
    department: {
      id: 2,
      name: "Pharmacy Department"
    },
    status: "DRAFT",
    total_requested_amount: 10000000.00,
    justification: "งบประมาณสำหรับจัดซื้อยาและเวชภัณฑ์ประจำปี 2025",
    items: [
      {
        id: 1,
        budget_id: 1,
        budget: {
          id: 1,
          budget_type: {
            type_code: "OP001",
            type_name: "ยาและเวชภัณฑ์"
          }
        },
        requested_amount: 10000000.00,
        q1_amount: 2500000.00,
        q2_amount: 2500000.00,
        q3_amount: 2500000.00,
        q4_amount: 2500000.00,
        item_justification: "งบสำหรับยาและเวชภัณฑ์"
      }
    ],
    created_by: 10,
    created_at: "2024-12-08T10:00:00Z",
    updated_at: "2024-12-08T10:00:00Z"
  }
}
```

**Validation:**

- ✅ `fiscal_year` ต้องเป็นปีในอนาคต (>= ปีปัจจุบัน)
- ✅ `department_id` ต้องมีอยู่ในระบบ
- ✅ `items` ต้องมีอย่างน้อย 1 รายการ
- ✅ แต่ละ item: `q1 + q2 + q3 + q4 = requested_amount`
- ✅ ไม่สามารถสร้างซ้ำได้ (same fiscal_year + department_id + status = DRAFT)

---

### 2. Update Budget Request (DRAFT only)

**PUT** `/api/inventory/budget/requests/:id`

**Request Body:**

```typescript
{
  justification?: string;
  items: [
    {
      id?: number;                 // ถ้ามี = แก้ไข, ไม่มี = สร้างใหม่
      budget_id: number;
      requested_amount: number;
      q1_amount: number;
      q2_amount: number;
      q3_amount: number;
      q4_amount: number;
      item_justification?: string;
    }
  ]
}
```

**Response (200 OK):**

```typescript
{
  success: true,
  data: { /* updated budget_request */ }
}
```

**Validation:**

- ✅ สถานะต้องเป็น `DRAFT` เท่านั้น
- ✅ User ต้องเป็น owner (created_by) หรือมี permission

**Error (400 Bad Request):**

```typescript
{
  success: false,
  error: {
    code: "CANNOT_UPDATE_NON_DRAFT",
    message: "Cannot update budget request. Status must be DRAFT."
  }
}
```

---

### 3. Submit Budget Request

**POST** `/api/inventory/budget/requests/:id/submit`

**Request Body:**

```typescript
{
  // No body required
}
```

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    id: 1,
    request_number: "BR-2025-0001",
    status: "SUBMITTED",  // Changed from DRAFT
    submitted_by: 10,
    submitted_at: "2024-12-08T11:00:00Z",
    // ... rest of data
  }
}
```

**Actions:**

1. Validate: status = DRAFT
2. Validate: มีรายการอย่างน้อย 1 item
3. Validate: ทุก item ผ่าน validation
4. Update: status = SUBMITTED
5. Update: submitted_by, submitted_at
6. Notify: หัวหน้าแผนก (department_head_id)

**Error (400 Bad Request):**

```typescript
{
  success: false,
  error: {
    code: "INVALID_STATUS",
    message: "Cannot submit. Request must be in DRAFT status."
  }
}
```

---

### 4. Department Head Approve

**POST** `/api/inventory/budget/requests/:id/approve-dept`

**Request Body:**

```typescript
{
  comments?: string;                  // Optional comments
  adjustments?: [                     // Optional: adjust amounts
    {
      item_id: number;
      requested_amount: number;
      q1_amount: number;
      q2_amount: number;
      q3_amount: number;
      q4_amount: number;
    }
  ]
}
```

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    id: 1,
    request_number: "BR-2025-0001",
    status: "DEPT_APPROVED",  // Changed from SUBMITTED
    dept_reviewed_by: 15,
    dept_reviewed_at: "2024-12-08T12:00:00Z",
    dept_comments: "อนุมัติตามที่เสนอ",
    // ... rest of data
  }
}
```

**Actions:**

1. Validate: status = SUBMITTED
2. Validate: User เป็น department_head ของแผนกนั้น
3. Apply adjustments (ถ้ามี)
4. Update: status = DEPT_APPROVED
5. Update: dept_reviewed_by, dept_reviewed_at, dept_comments
6. Notify: Finance Manager

**Permissions:**

- User ต้องมี role `DEPARTMENT_HEAD`
- User ต้องเป็น head ของ department_id นั้น

---

### 5. Department Head Reject

**POST** `/api/inventory/budget/requests/:id/reject-dept`

**Request Body:**

```typescript
{
  rejection_reason: string; // Required
}
```

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    id: 1,
    status: "REJECTED",
    dept_reviewed_by: 15,
    dept_reviewed_at: "2024-12-08T12:00:00Z",
    rejection_reason: "งบประมาณเกินจากที่กำหนด",
    // ... rest
  }
}
```

---

### 6. Finance Manager Approve (Final)

**POST** `/api/inventory/budget/requests/:id/approve-finance`

**Request Body:**

```typescript
{
  comments?: string;
  adjustments?: [
    {
      item_id: number;
      requested_amount: number;
      q1_amount: number;
      q2_amount: number;
      q3_amount: number;
      q4_amount: number;
    }
  ]
}
```

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    id: 1,
    status: "FINANCE_APPROVED",
    finance_reviewed_by: 20,
    finance_reviewed_at: "2024-12-08T13:00:00Z",
    finance_comments: "อนุมัติ",
    budget_allocations: [  // Created automatically
      {
        id: 101,
        fiscal_year: 2025,
        budget_id: 1,
        department_id: 2,
        total_budget: 10000000.00,
        // ...
      }
    ]
  }
}
```

**Actions:**

1. Validate: status = DEPT_APPROVED
2. Validate: User มี role `FINANCE_MANAGER`
3. Apply adjustments (ถ้ามี)
4. Update: status = FINANCE_APPROVED
5. Update: finance_reviewed_by, finance_reviewed_at, finance_comments
6. **Create Budget Allocations** (สำคัญ!):
   ```typescript
   for (const item of request.items) {
     await prisma.budgetAllocation.create({
       data: {
         fiscal_year: request.fiscal_year,
         budget_id: item.budget_id,
         department_id: request.department_id,
         total_budget: item.requested_amount,
         q1_budget: item.q1_amount,
         q2_budget: item.q2_amount,
         q3_budget: item.q3_amount,
         q4_budget: item.q4_amount,
         q1_spent: 0,
         q2_spent: 0,
         q3_spent: 0,
         q4_spent: 0,
         total_spent: 0,
         remaining_budget: item.requested_amount,
         is_active: true,
       },
     });
   }
   ```

---

### 7. Finance Manager Reject

**POST** `/api/inventory/budget/requests/:id/reject-finance`

**Request Body:**

```typescript
{
  rejection_reason: string; // Required
}
```

---

### 8. List Budget Requests

**GET** `/api/inventory/budget/requests`

**Query Parameters:**

- `fiscal_year` (optional): Filter by year
- `department_id` (optional): Filter by department
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    items: [
      {
        id: 1,
        request_number: "BR-2025-0001",
        fiscal_year: 2025,
        department: {
          id: 2,
          name: "Pharmacy Department"
        },
        total_requested_amount: 10000000.00,
        status: "SUBMITTED",
        submitted_at: "2024-12-08T11:00:00Z",
        created_at: "2024-12-08T10:00:00Z"
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      total_pages: 1
    }
  }
}
```

**RBAC:**

- **Department Staff**: เห็นเฉพาะของแผนกตัวเอง
- **Department Head**: เห็นเฉพาะของแผนกตัวเอง (ทุกสถานะ)
- **Finance Manager**: เห็นทุกแผนก
- **Admin**: เห็นทุกแผนก

---

### 9. Get Budget Request Details

**GET** `/api/inventory/budget/requests/:id`

**Response (200 OK):**

```typescript
{
  success: true,
  data: {
    id: 1,
    request_number: "BR-2025-0001",
    fiscal_year: 2025,
    department: {
      id: 2,
      name: "Pharmacy Department"
    },
    status: "SUBMITTED",
    total_requested_amount: 10000000.00,
    justification: "งบประมาณสำหรับจัดซื้อยาและเวชภัณฑ์ประจำปี 2025",

    items: [
      {
        id: 1,
        budget: {
          id: 1,
          budget_type: {
            type_code: "OP001",
            type_name: "ยาและเวชภัณฑ์"
          },
          budget_category: {
            category_code: "CAT001",
            category_name: "ยา"
          }
        },
        requested_amount: 10000000.00,
        q1_amount: 2500000.00,
        q2_amount: 2500000.00,
        q3_amount: 2500000.00,
        q4_amount: 2500000.00,
        item_justification: "งบสำหรับยาและเวชภัณฑ์"
      }
    ],

    // Audit trail
    created_by: {
      id: 10,
      name: "John Doe"
    },
    created_at: "2024-12-08T10:00:00Z",

    submitted_by: {
      id: 10,
      name: "John Doe"
    },
    submitted_at: "2024-12-08T11:00:00Z",

    dept_reviewed_by: null,
    dept_reviewed_at: null,
    dept_comments: null,

    finance_reviewed_by: null,
    finance_reviewed_at: null,
    finance_comments: null
  }
}
```

---

## Frontend UI Specification

### Page 1: Budget Request List (`/inventory/budget/requests`)

**Layout:** Standard CRUD list page

**Components:**

- Header with "Create Request" button
- Filters:
  - Fiscal Year (dropdown)
  - Department (dropdown) - hidden for dept staff
  - Status (multi-select)
- Table columns:
  - Request Number
  - Department
  - Fiscal Year
  - Total Amount (formatted)
  - Status (badge with color)
  - Submitted Date
  - Actions (View, Edit, Delete)

**Status Badge Colors:**

- DRAFT: gray
- SUBMITTED: blue
- DEPT_APPROVED: purple
- FINANCE_APPROVED: green
- REJECTED: red

**Actions per Status:**

- DRAFT: Edit, Delete, Submit
- SUBMITTED: View only
- DEPT_APPROVED: View only
- FINANCE_APPROVED: View only
- REJECTED: View only

---

### Page 2: Create/Edit Budget Request Form

**Route:** `/inventory/budget/requests/create` or `/inventory/budget/requests/:id/edit`

**Layout:** Multi-step form or single page form

**Section 1: Request Header**

```typescript
<form>
  <ax-select
    label="Fiscal Year"
    [options]="fiscalYears"
    formControlName="fiscal_year"
  />

  <ax-select
    label="Department"
    [options]="departments"
    formControlName="department_id"
    [disabled]="!isAdmin"  // Auto-select for dept users
  />

  <ax-textarea
    label="Justification (Overall)"
    formControlName="justification"
    rows="3"
  />
</form>
```

**Section 2: Budget Items (Table)**

```typescript
<ax-table>
  <thead>
    <tr>
      <th>Budget Type</th>
      <th>Total Amount</th>
      <th>Q1</th>
      <th>Q2</th>
      <th>Q3</th>
      <th>Q4</th>
      <th>Justification</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of items">
      <td>
        <ax-select
          [options]="budgetTypes"
          [(ngModel)]="item.budget_id"
        />
      </td>
      <td>
        <ax-input
          type="number"
          [(ngModel)]="item.requested_amount"
          (change)="autoDistribute(item)"
        />
      </td>
      <td>
        <ax-input
          type="number"
          [(ngModel)]="item.q1_amount"
          (change)="validateSum(item)"
        />
      </td>
      <td>
        <ax-input
          type="number"
          [(ngModel)]="item.q2_amount"
          (change)="validateSum(item)"
        />
      </td>
      <td>
        <ax-input
          type="number"
          [(ngModel)]="item.q3_amount"
          (change)="validateSum(item)"
        />
      </td>
      <td>
        <ax-input
          type="number"
          [(ngModel)]="item.q4_amount"
          (change)="validateSum(item)"
        />
      </td>
      <td>
        <ax-input
          [(ngModel)]="item.item_justification"
        />
      </td>
      <td>
        <ax-button
          icon="delete"
          variant="danger-ghost"
          (click)="removeItem(item)"
        />
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="8">
        <ax-button
          icon="add"
          (click)="addItem()"
        >
          Add Budget Item
        </ax-button>
      </td>
    </tr>
  </tfoot>
</ax-table>
```

**Section 3: Summary & Actions**

```typescript
<div class="summary">
  <h3>Summary</h3>
  <p>Total Requested: {{ totalAmount | currency:'THB' }}</p>
  <p>Number of Items: {{ items.length }}</p>
</div>

<div class="actions">
  <ax-button
    variant="secondary"
    (click)="cancel()"
  >
    Cancel
  </ax-button>

  <ax-button
    variant="primary"
    (click)="saveDraft()"
    [disabled]="!isValid()"
  >
    Save Draft
  </ax-button>

  <ax-button
    variant="primary"
    (click)="submitRequest()"
    [disabled]="!isValid()"
  >
    Submit for Approval
  </ax-button>
</div>
```

**Features:**

- ✅ Auto-distribute button: แบ่งเท่าๆ กัน 4 ไตรมาส
- ✅ Real-time validation: แสดง error ถ้า Q1+Q2+Q3+Q4 ≠ Total
- ✅ Add/Remove items dynamically
- ✅ Save as draft (DRAFT status)
- ✅ Submit directly (SUBMITTED status)

---

### Page 3: Budget Request Detail (View/Approve)

**Route:** `/inventory/budget/requests/:id`

**Layout:** Read-only view with approval actions

**Section 1: Request Info**

```typescript
<ax-card>
  <h2>Budget Request: {{ request.request_number }}</h2>

  <ax-info-grid>
    <ax-info-item label="Fiscal Year">
      {{ request.fiscal_year }}
    </ax-info-item>
    <ax-info-item label="Department">
      {{ request.department.name }}
    </ax-info-item>
    <ax-info-item label="Status">
      <ax-badge [color]="getStatusColor(request.status)">
        {{ request.status }}
      </ax-badge>
    </ax-info-item>
    <ax-info-item label="Total Amount">
      {{ request.total_requested_amount | currency:'THB' }}
    </ax-info-item>
  </ax-info-grid>

  <ax-info-item label="Justification">
    {{ request.justification }}
  </ax-info-item>
</ax-card>
```

**Section 2: Budget Items**

```typescript
<ax-card>
  <h3>Requested Budget Items</h3>

  <ax-table>
    <thead>
      <tr>
        <th>Budget Type</th>
        <th>Total</th>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q3</th>
        <th>Q4</th>
        <th>Justification</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of request.items">
        <td>{{ item.budget.budget_type.type_name }}</td>
        <td>{{ item.requested_amount | currency:'THB' }}</td>
        <td>{{ item.q1_amount | currency:'THB' }}</td>
        <td>{{ item.q2_amount | currency:'THB' }}</td>
        <td>{{ item.q3_amount | currency:'THB' }}</td>
        <td>{{ item.q4_amount | currency:'THB' }}</td>
        <td>{{ item.item_justification }}</td>
      </tr>
    </tbody>
  </ax-table>
</ax-card>
```

**Section 3: Approval History**

```typescript
<ax-card>
  <h3>Approval History</h3>

  <ax-timeline>
    <ax-timeline-item
      *ngIf="request.created_at"
      icon="create"
      color="blue"
    >
      <strong>Created</strong><br>
      By {{ request.created_by.name }}<br>
      {{ request.created_at | date:'medium' }}
    </ax-timeline-item>

    <ax-timeline-item
      *ngIf="request.submitted_at"
      icon="send"
      color="blue"
    >
      <strong>Submitted</strong><br>
      By {{ request.submitted_by.name }}<br>
      {{ request.submitted_at | date:'medium' }}
    </ax-timeline-item>

    <ax-timeline-item
      *ngIf="request.dept_reviewed_at"
      icon="check"
      [color]="request.status === 'DEPT_APPROVED' ? 'green' : 'red'"
    >
      <strong>Department Head Review</strong><br>
      By {{ request.dept_reviewed_by.name }}<br>
      {{ request.dept_reviewed_at | date:'medium' }}<br>
      <em *ngIf="request.dept_comments">{{ request.dept_comments }}</em>
    </ax-timeline-item>

    <ax-timeline-item
      *ngIf="request.finance_reviewed_at"
      icon="check_circle"
      [color]="request.status === 'FINANCE_APPROVED' ? 'green' : 'red'"
    >
      <strong>Finance Manager Review</strong><br>
      By {{ request.finance_reviewed_by.name }}<br>
      {{ request.finance_reviewed_at | date:'medium' }}<br>
      <em *ngIf="request.finance_comments">{{ request.finance_comments }}</em>
    </ax-timeline-item>
  </ax-timeline>
</ax-card>
```

**Section 4: Approval Actions (Conditional)**

For Department Head (when status = SUBMITTED):

```typescript
<ax-card *ngIf="canDeptApprove()">
  <h3>Department Head Approval</h3>

  <ax-textarea
    label="Comments"
    [(ngModel)]="approvalComments"
    rows="3"
  />

  <div class="actions">
    <ax-button
      variant="danger"
      icon="close"
      (click)="rejectByDept()"
    >
      Reject
    </ax-button>

    <ax-button
      variant="success"
      icon="check"
      (click)="approveByDept()"
    >
      Approve
    </ax-button>
  </div>
</ax-card>
```

For Finance Manager (when status = DEPT_APPROVED):

```typescript
<ax-card *ngIf="canFinanceApprove()">
  <h3>Finance Manager Approval</h3>

  <ax-textarea
    label="Comments"
    [(ngModel)]="approvalComments"
    rows="3"
  />

  <div class="actions">
    <ax-button
      variant="danger"
      icon="close"
      (click)="rejectByFinance()"
    >
      Reject
    </ax-button>

    <ax-button
      variant="success"
      icon="check"
      (click)="approveByFinance()"
    >
      Approve & Create Allocation
    </ax-button>
  </div>
</ax-card>
```

---

### Page 4: Budget Request Dashboard (Optional)

**Route:** `/inventory/budget/requests/dashboard`

**Components:**

- KPI Cards:
  - Total Requests (ทั้งหมด)
  - Pending Approval (รออนุมัติ)
  - Approved (อนุมัติแล้ว)
  - Rejected (ปฏิเสธ)
- Chart: Requests by Status (Pie Chart)
- Chart: Requests by Department (Bar Chart)
- Recent Requests Table

---

## Business Rules

### BR-REQ-001: Fiscal Year Validation

- ปีงบประมาณต้อง >= ปีปัจจุบัน
- ปีงบประมาณเริ่มต้น: 1 ตุลาคม - 30 กันยายน ปีถัดไป

### BR-REQ-002: Department Restriction

- Department Staff สร้างได้เฉพาะของแผนกตัวเอง
- Department Head เห็นได้เฉพาะของแผนกตัวเอง
- Finance Manager เห็นได้ทุกแผนก

### BR-REQ-003: Quarterly Distribution

- Q1 + Q2 + Q3 + Q4 = Total Requested Amount
- ทุก quarter ต้อง >= 0
- Total ต้อง > 0

### BR-REQ-004: Status Transition

- DRAFT → SUBMITTED (by creator)
- SUBMITTED → DEPT_APPROVED (by dept head)
- SUBMITTED → REJECTED (by dept head)
- DEPT_APPROVED → FINANCE_APPROVED (by finance manager)
- DEPT_APPROVED → REJECTED (by finance manager)
- **ไม่สามารถย้อนกลับได้** (no reverse transitions)

### BR-REQ-005: Edit Restrictions

- แก้ไขได้เฉพาะสถานะ DRAFT
- ลบได้เฉพาะสถานะ DRAFT
- สถานะอื่นๆ เป็น read-only

### BR-REQ-006: Duplicate Prevention

- ไม่สามารถมี DRAFT ซ้ำได้ (same fiscal_year + department_id)
- แต่สามารถมีหลาย requests ได้ถ้าสถานะต่างกัน

### BR-REQ-007: Approval Authority

- Department Head อนุมัติได้เฉพาะของแผนกตัวเอง
- Finance Manager อนุมัติได้ทุกแผนก
- ต้อง verify user role และ department_id

### BR-REQ-008: Auto-create Budget Allocation

- เมื่อ Finance Manager อนุมัติ (FINANCE_APPROVED)
- ระบบต้องสร้าง `budget_allocations` อัตโนมัติ
- 1 request item = 1 budget allocation
- ต้องใช้ transaction เพื่อความ atomic

### BR-REQ-009: Notification Rules

- Submit → แจ้ง Department Head
- Dept Approve → แจ้ง Finance Manager
- Finance Approve → แจ้ง Department (creator)
- Reject (any level) → แจ้ง Department (creator)

### BR-REQ-010: Amount Adjustment

- Department Head ปรับจำนวนได้ก่อนอนุมัติ
- Finance Manager ปรับจำนวนได้ก่อนอนุมัติ
- ต้อง validate ใหม่: Q1+Q2+Q3+Q4 = Total

---

## Integration Points

### 1. With Budget Allocation (Workflow 1)

**Trigger:** Finance Manager approves budget request

**Action:**

```typescript
async function createBudgetAllocations(requestId: number) {
  const request = await prisma.budgetRequest.findUnique({
    where: { id: requestId },
    include: { items: true },
  });

  const allocations = [];

  for (const item of request.items) {
    const allocation = await prisma.budgetAllocation.create({
      data: {
        fiscal_year: request.fiscal_year,
        budget_id: item.budget_id,
        department_id: request.department_id,
        total_budget: item.requested_amount,
        q1_budget: item.q1_amount,
        q2_budget: item.q2_amount,
        q3_budget: item.q3_amount,
        q4_budget: item.q4_amount,
        q1_spent: 0,
        q2_spent: 0,
        q3_spent: 0,
        q4_spent: 0,
        total_spent: 0,
        remaining_budget: item.requested_amount,
        is_active: true,
        created_from_request_id: request.id, // Optional: track source
      },
    });

    allocations.push(allocation);
  }

  return allocations;
}
```

### 2. With User Management (RBAC)

**Roles Required:**

- `DEPARTMENT_STAFF` - สร้าง/แก้ไข request
- `DEPARTMENT_HEAD` - อนุมัติระดับแผนก
- `FINANCE_MANAGER` - อนุมัติระดับการเงิน
- `ADMIN` - เห็นทุกอย่าง

**Permissions:**

```typescript
budget_requests.create;
budget_requests.read;
budget_requests.update;
budget_requests.delete;
budget_requests.submit;
budget_requests.approve_dept;
budget_requests.approve_finance;
budget_requests.reject;
```

### 3. With Notification System

**Events to Notify:**

```typescript
enum BudgetRequestEvent {
  CREATED = 'budget_request.created',
  SUBMITTED = 'budget_request.submitted',
  DEPT_APPROVED = 'budget_request.dept_approved',
  DEPT_REJECTED = 'budget_request.dept_rejected',
  FINANCE_APPROVED = 'budget_request.finance_approved',
  FINANCE_REJECTED = 'budget_request.finance_rejected',
}
```

**Notification Recipients:**

```typescript
switch (event) {
  case 'SUBMITTED':
    notifyDepartmentHead(request.department_id);
    break;
  case 'DEPT_APPROVED':
    notifyFinanceManagers();
    break;
  case 'FINANCE_APPROVED':
  case 'REJECTED':
    notifyRequestCreator(request.created_by);
    break;
}
```

---

## Implementation Checklist

### Phase 1: Database (Day 1-2)

#### Day 1: Schema & Migration

```bash
□ Create migration file: 20241208_create_budget_requests.ts
□ Add table: budget_requests (19 fields)
□ Add table: budget_request_items (10 fields)
□ Add indexes (5 indexes)
□ Add function: generate_budget_request_number()
□ Test migration: pnpm db:migrate
□ Verify tables in database
```

#### Day 2: Seed Data

```bash
□ Add seed data: budget_requests (3 samples)
  - 1 DRAFT
  - 1 SUBMITTED
  - 1 FINANCE_APPROVED
□ Add seed data: budget_request_items (6 items)
□ Test seed: pnpm db:seed
□ Verify data in database
```

---

### Phase 2: Backend API (Day 3-5)

#### Day 3: Setup & Basic CRUD

```typescript
// File structure
apps/api/src/modules/inventory/budget/budget-requests/
├── budget-requests.controller.ts
├── budget-requests.service.ts
├── budget-requests.routes.ts
├── budget-requests.schemas.ts
└── index.ts

□ Create TypeBox schemas (request/response validation)
□ Create service class with database methods
□ Implement: POST /requests (create)
□ Implement: PUT /requests/:id (update)
□ Implement: GET /requests (list with filters)
□ Implement: GET /requests/:id (detail)
□ Test with Postman/Thunder Client
```

#### Day 4: Workflow APIs

```typescript
□ Implement: POST /requests/:id/submit
  - Validate status = DRAFT
  - Update status = SUBMITTED
  - Send notification

□ Implement: POST /requests/:id/approve-dept
  - Validate status = SUBMITTED
  - Validate user role
  - Apply adjustments (if any)
  - Update status = DEPT_APPROVED
  - Send notification

□ Implement: POST /requests/:id/reject-dept
  - Validate status = SUBMITTED
  - Update status = REJECTED
  - Send notification

□ Test all workflow transitions
```

#### Day 5: Finance Approval + Integration

```typescript
□ Implement: POST /requests/:id/approve-finance
  - Validate status = DEPT_APPROVED
  - Validate user role
  - Apply adjustments (if any)
  - Update status = FINANCE_APPROVED
  - **Create budget_allocations** (CRITICAL!)
  - Send notification

□ Implement: POST /requests/:id/reject-finance
  - Validate status = DEPT_APPROVED
  - Update status = REJECTED
  - Send notification

□ Write integration function: createBudgetAllocations()
□ Test end-to-end workflow
□ Verify budget_allocations created correctly
```

---

### Phase 3: Frontend UI (Day 6-8)

#### Day 6: List Page

```typescript
// apps/web/src/app/features/inventory/modules/budget-requests/

□ Generate CRUD module using CLI
  pnpm run crud -- budget_requests \
    --target frontend \
    --shell inventory \
    --section budget \
    --force

□ Customize list component:
  - Add status badge with colors
  - Add fiscal_year filter
  - Add department_id filter
  - Add status filter
  - Implement RBAC (hide dept filter for staff)

□ Add "Submit" action button (for DRAFT status)
□ Test list page
```

#### Day 7: Form Page + Detail Page

```typescript
□ Customize form component:
  - Add budget items table (dynamic add/remove)
  - Add auto-distribute button
  - Add real-time validation
  - Add quarterly input fields
  - Add justification textarea

□ Create detail/view component:
  - Read-only display
  - Approval history timeline
  - Conditional approval actions

□ Test create/edit workflow
□ Test view page
```

#### Day 8: Approval UI

```typescript
□ Add approval section to detail page:
  - Department Head approval (if status = SUBMITTED)
  - Finance Manager approval (if status = DEPT_APPROVED)
  - Comments textarea
  - Approve/Reject buttons

□ Implement approval dialog/modal
□ Connect to approval APIs
□ Test approval workflow
  - Create → Submit → Dept Approve → Finance Approve
  - Verify budget_allocations created

□ Test rejection workflow
  - Submit → Dept Reject
  - Submit → Dept Approve → Finance Reject
```

---

### Phase 4: Testing & Polish (Day 9-10)

#### Day 9: Integration Testing

```bash
□ E2E Test: Full approval flow
  1. Dept staff creates request
  2. Submit for approval
  3. Dept head approves
  4. Finance manager approves
  5. Verify budget_allocation created
  6. Verify status = FINANCE_APPROVED

□ E2E Test: Rejection flows
  1. Dept head rejects
  2. Finance manager rejects

□ E2E Test: Permissions
  - Dept staff can't approve
  - Dept head can't approve other dept
  - Finance can approve all

□ API Testing: All endpoints
  - Create (valid/invalid)
  - Update (DRAFT only)
  - Submit (validations)
  - Approve (permissions)
  - Reject (permissions)
```

#### Day 10: Polish & Documentation

```bash
□ Add loading states
□ Add error handling
□ Add success/error toasts
□ Add confirmation dialogs
□ Improve UI/UX
□ Add tooltips/help text
□ Write API documentation (Swagger)
□ Update user guide
□ Create demo video (optional)
```

---

## Success Criteria

### Functional Requirements

✅ **FR-1:** แผนกสามารถสร้างคำขอจัดสรรงบได้
✅ **FR-2:** คำขอต้องผ่านการอนุมัติ 2 ขั้นตอน (Dept Head + Finance)
✅ **FR-3:** เมื่ออนุมัติแล้วต้องสร้าง Budget Allocation อัตโนมัติ
✅ **FR-4:** RBAC ทำงานถูกต้อง (permissions per role)
✅ **FR-5:** Notification ส่งถูกต้อง (submit, approve, reject)

### Data Integrity

✅ **DI-1:** Q1 + Q2 + Q3 + Q4 = Total Amount (always)
✅ **DI-2:** Status transition ต้องถูกต้อง (ไม่ข้ามขั้นตอน)
✅ **DI-3:** Budget Allocation สร้างถูกต้อง (fields mapping)
✅ **DI-4:** Audit trail ครบถ้วน (who, when, what)

### Performance

✅ **PERF-1:** List page load < 1 second
✅ **PERF-2:** Form submit < 2 seconds
✅ **PERF-3:** Approval action < 3 seconds (including allocation creation)

### UX Requirements

✅ **UX-1:** Form มี auto-distribute button
✅ **UX-2:** Real-time validation (quarterly sum)
✅ **UX-3:** Status badge มีสี clear (green/red/blue/gray)
✅ **UX-4:** Approval history timeline แสดงครบถ้วน
✅ **UX-5:** Error messages ชัดเจน

---

## Next Steps

หลังจากทำ Budget Request Workflow เสร็จ ให้ต่อด้วย:

1. **Phase 1: Core Workflow** (1 สัปดาห์)
   - Database Functions (check_budget_availability, reserve_budget, etc.)
   - Budget Reservation & Commitment
   - Integration กับ PR/PO

2. **Phase 2: Budget Planning** (1 สัปดาห์)
   - Drug-level planning
   - Historical data (3 years)
   - Plan approval workflow

3. **Phase 3: Budget Monitoring** (3-5 วัน)
   - Dashboard
   - KPIs
   - Charts & Reports

---

**Document Version:** 1.0.0
**Last Updated:** 2024-12-08
**Status:** Ready for Implementation
**Estimated Time:** 10 working days

---

**ผู้เกี่ยวข้อง:**

- Backend Developer: สร้าง API (Day 3-5)
- Frontend Developer: สร้าง UI (Day 6-8)
- QA: Integration testing (Day 9-10)
- Product Owner: Review & Approve

**Dependencies:**

- ✅ Budget Types & Categories (มีแล้ว)
- ✅ Departments (มีแล้ว)
- ✅ Users & Roles (มีแล้ว)
- ✅ Budget Allocations table (มีแล้ว)

**พร้อมเริ่มทำได้เลย! 🚀**
