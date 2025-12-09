# 📊 Hospital Budget Planning System - Technical Specification

**Version:** 2.1.0
**Date:** 2025-12-09
**Status:** Updated
**Author:** System Analysis Team
**Changes (v2.1.0):**

- Added comprehensive UI Mockups
- Added Operating Modes (Mode 1: Hospital-wide, Mode 2: Department-based)
- Added Gap Analysis and Implementation Status
- Added Button Visibility by Status matrix
- Added Schema Changes Required section
- Clarified approval workflow and budget allocation process

**Previous Changes (v2.0.0):**

- Clarified Initialize vs Export workflow
- Updated database schema for budget_request_items
- Added manual drug addition feature
- Aligned with actual SSCJ Excel format

---

## 📑 Table of Contents

1. [System Overview](#1-system-overview)
   - 1.4 [Operating Modes](#14-operating-modes) ⭐ NEW
   - 1.5 [Mode 2: Department-Based Architecture](#15-mode-2-department-based-architecture-future) ⭐ NEW
2. [Business Requirements](#2-business-requirements)
3. [System Workflow](#3-system-workflow)
4. [Database Design](#4-database-design)
5. [API Specifications](#5-api-specifications)
6. [Excel Export Format](#6-excel-export-format)
7. [Frontend Requirements](#7-frontend-requirements)
   - 7.0 [UI Mockups (Complete Flow)](#70-ui-mockups-complete-flow) ⭐ NEW
   - 7.0.1 [Button Visibility by Status](#701-button-visibility-by-status) ⭐ NEW
8. [Technical Requirements](#8-technical-requirements)
9. [Implementation Plan](#9-implementation-plan)
10. [Change Log](#10-change-log)
11. [Future Enhancements](#10-future-enhancements-optional)
12. [Gap Analysis & Implementation Status](#12-gap-analysis--implementation-status) ⭐ NEW
13. [Schema Changes Required](#13-schema-changes-required) ⭐ NEW
14. [Action Plan (3-Hour Sprint)](#14-action-plan-3-hour-sprint) ⭐ NEW

---

## 1. System Overview

### 1.1 Purpose

ระบบจัดทำแผนงบประมาณจัดซื้อยาประจำปี (Hospital Budget Planning System) สำหรับโรงพยาบาล เพื่อ:

- จัดทำแผนงบประมาณยา ระดับตัวยา (drug-level)
- ควบคุมการใช้จ่ายงบประมาณให้อยู่ในวงเงินที่อนุมัติ
- ส่งออกรายงาน Excel ตามรูปแบบ สำนักงานสาธารณสุขจังหวัด (สสจ.)

### 1.2 Key Features

1. **Initialize from Drug Master** - ดึงรายการยาทั้งหมด + คำนวณข้อมูลย้อนหลัง 3 ปี (กรณีมีข้อมูลในระบบ)
2. **Import Excel/CSV** - นำเข้าไฟล์ Excel/CSV (กรณีเริ่มระบบใหม่ หรือมีข้อมูลจากภายนอก)
3. **Manual Drug Addition** - เพิ่มยาใหม่ได้ตามต้องการ
4. **Historical Data Display** - แสดงยอดใช้ย้อนหลัง (2566, 2567, 2568)
5. **Real-time Calculation** - คำนวณยอดรวม, ประมาณการซื้อแบบทันที
6. **Quarterly Planning** - แบ่งยอดตามไตรมาส Q1-Q4
7. **Approval Workflow** - DRAFT → SUBMITTED → DEPT_APPROVED → FINANCE_APPROVED
8. **Excel Export (SSCJ Format)** - ส่งออกตามฟอร์แมต สสจ. พร้อม merged cells

### 1.3 Scope

**In Scope:**

- จัดทำแผนงบประมาณยา (รายตัวยา)
- อนุมัติแผนและล็อคงบประมาณ
- ตรวจสอบยอดงบประมาณคงเหลือ (API)
- รายงาน Excel ตามรูปแบบ สสจ.

**Out of Scope:**

- การจัดซื้อจริง (PO/PR) - ใช้ระบบเดิม
- การรับยาเข้าคลัง - ใช้ระบบเดิม
- การเบิกจ่ายยา - ใช้ระบบเดิม

### 1.4 Operating Modes

ระบบรองรับ 2 โหมดการทำงาน:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        OPERATING MODES COMPARISON                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  MODE 1: HOSPITAL-WIDE (ปัจจุบัน - SPEC V2)                       ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║                                                                   ║  │
│  ║  ┌─────────────────────────────────────────────────────────────┐ ║  │
│  ║  │         1 Budget Request / ปีงบประมาณ / โรงพยาบาล           │ ║  │
│  ║  │              (department_id = NULL)                         │ ║  │
│  ║  └──────────────────────────┬──────────────────────────────────┘ ║  │
│  ║                             │                                    ║  │
│  ║                             ▼                                    ║  │
│  ║  ┌─────────────────────────────────────────────────────────────┐ ║  │
│  ║  │           budget_request_items (2,000-3,000 ยา)             │ ║  │
│  ║  │                                                              │ ║  │
│  ║  │  [ยา A] [ยา B] [ยา C] [ยา D] [ยา E] ... [ยา N]             │ ║  │
│  ║  └──────────────────────────┬──────────────────────────────────┘ ║  │
│  ║                             │                                    ║  │
│  ║                             ▼                                    ║  │
│  ║  ┌─────────────────────────────────────────────────────────────┐ ║  │
│  ║  │         FINANCE_APPROVED → budget_allocations               │ ║  │
│  ║  └─────────────────────────────────────────────────────────────┘ ║  │
│  ║                                                                   ║  │
│  ║  Workflow: DRAFT → SUBMITTED → DEPT_APPROVED → FINANCE_APPROVED  ║  │
│  ║                                                                   ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗  │
│  ║  MODE 2: DEPARTMENT-BASED (อนาคต - Phase 2)                       ║  │
│  ╠═══════════════════════════════════════════════════════════════════╣  │
│  ║                                                                   ║  │
│  ║  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐     ║  │
│  ║  │  แผนก A   │  │  แผนก B   │  │  แผนก C   │  │  แผนก D   │     ║  │
│  ║  │  DRAFT    │  │  DRAFT    │  │  DRAFT    │  │  DRAFT    │     ║  │
│  ║  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘     ║  │
│  ║        │              │              │              │            ║  │
│  ║        ▼              ▼              ▼              ▼            ║  │
│  ║  ┌───────────────────────────────────────────────────────────┐  ║  │
│  ║  │            Aggregated Hospital Request                     │  ║  │
│  ║  │            (parent_request_id = NULL)                      │  ║  │
│  ║  │                                                            │  ║  │
│  ║  │  child_requests: [แผนก A, แผนก B, แผนก C, แผนก D]         │  ║  │
│  ║  └────────────────────────────┬──────────────────────────────┘  ║  │
│  ║                               │                                  ║  │
│  ║                               ▼                                  ║  │
│  ║  ┌───────────────────────────────────────────────────────────┐  ║  │
│  ║  │         FINANCE_APPROVED → budget_allocations              │  ║  │
│  ║  └───────────────────────────────────────────────────────────┘  ║  │
│  ║                                                                   ║  │
│  ║  Workflow: แผนก DRAFT → แผนก SUBMITTED → Aggregate →            ║  │
│  ║            Hospital SUBMITTED → DEPT_APPROVED → FINANCE_APPROVED ║  │
│  ║                                                                   ║  │
│  ╚═══════════════════════════════════════════════════════════════════╝  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Mode 1 (Hospital-wide) - ใช้ใน SPEC V2:**
- 1 Budget Request ต่อ 1 ปีงบประมาณ
- department_id = NULL (ระดับโรงพยาบาล)
- รายการยา 2,000-3,000 รายการ
- Pharmacist ทำแผนทั้งหมด
- เหมาะสำหรับโรงพยาบาลขนาดเล็ก-กลาง

**Mode 2 (Department-based) - อนาคต:**
- หลาย Budget Request ต่อ 1 ปีงบประมาณ (แยกแผนก)
- department_id = แผนก
- parent_request_id สำหรับ aggregation
- เหมาะสำหรับโรงพยาบาลขนาดใหญ่

### 1.5 Mode 2: Department-Based Architecture (Future)

#### 1.5.1 Independent Department Workflow

แต่ละแผนกทำงานอิสระ ไม่ต้องรอกัน:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  MODE 2: INDEPENDENT DEPARTMENT WORKFLOW                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Timeline                                                                        │
│  ────────────────────────────────────────────────────────────────────────────   │
│  วันที่ 1     วันที่ 5     วันที่ 10    วันที่ 15    วันที่ 20    Deadline      │
│     │           │            │            │            │            │           │
│     ▼           ▼            ▼            ▼            ▼            ▼           │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ แผนก A (เภสัช)                                                          │   │
│  │ budget_request { id: 1, dept_id: 1, status: ? }                         │   │
│  │                                                                          │   │
│  │ [สร้าง]──[Initialize]──[แก้ไข/บันทึก DRAFT]────[Submit]──[DEPT_APPROVED]│   │
│  │   Day1        Day2           Day3-8              Day9        Day10       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ แผนก B (อายุรกรรม)                                                      │   │
│  │ budget_request { id: 2, dept_id: 2, status: ? }                         │   │
│  │                                                                          │   │
│  │         [สร้าง]──[Initialize]──[แก้ไข DRAFT]──[Save]──[แก้ไข]──[Submit] │   │
│  │          Day5        Day5         Day6-12      Day12    Day13-18  Day19 │   │
│  │                                   ↑                                      │   │
│  │                         บันทึกเก็บไว้ก่อน ยังไม่ส่ง                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ แผนก C (กุมาร)                                                          │   │
│  │ budget_request { id: 3, dept_id: 3, status: DRAFT }                     │   │
│  │                                                                          │   │
│  │                   [สร้าง]──[Initialize]──[แก้ไข DRAFT]──[ยังไม่ส่ง...]  │   │
│  │                    Day10       Day10         Day11-??     ???           │   │
│  │                                               ↑                          │   │
│  │                                     เก็บ DRAFT ไว้ รอหัวหน้าเซ็น        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 1.5.2 Mode 2 Status Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MODE 2: STATUS FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Department Level (แต่ละแผนก)                                                   │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                                                                  │
│  DRAFT ──────► SUBMITTED ──────► DEPT_APPROVED ──────► AGGREGATED              │
│    │              │                   │                    │                    │
│    │              │                   │                    │                    │
│    ▼              ▼                   ▼                    ▼                    │
│  [แก้ไขได้]    [รออนุมัติ]         [รอรวม]            [รวมแล้ว]               │
│  [Initialize]  [ล็อค]             [ล็อค]              [ล็อค]                  │
│  [Save]                                                                         │
│                                                                                  │
│                          ↓ เมื่อ Admin กด "Aggregate"                           │
│                                                                                  │
│  Hospital Level (Parent Request)                                                │
│  ═══════════════════════════════════════════════════════════════════════════   │
│                                                                                  │
│  AGGREGATED ──────► FINANCE_SUBMITTED ──────► FINANCE_APPROVED                 │
│      │                     │                        │                           │
│      │                     │                        │                           │
│      ▼                     ▼                        ▼                           │
│  [รวมข้อมูล]           [รอ Finance]           [อนุมัติแล้ว]                    │
│  [จาก children]        [อนุมัติ]              [สร้าง allocations]              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 1.5.3 Mode 2 Database Schema

```sql
-- budget_requests: รองรับทั้ง Mode 1 และ Mode 2
ALTER TABLE inventory.budget_requests ADD COLUMN IF NOT EXISTS
  parent_request_id BIGINT REFERENCES inventory.budget_requests(id);

ALTER TABLE inventory.budget_requests ADD COLUMN IF NOT EXISTS
  is_aggregated BOOLEAN DEFAULT FALSE;

ALTER TABLE inventory.budget_requests ADD COLUMN IF NOT EXISTS
  aggregated_at TIMESTAMP;

-- Status values for Mode 2
-- DRAFT, SUBMITTED, DEPT_APPROVED  (same as Mode 1)
-- AGGREGATED        (new - child linked to parent)
-- FINANCE_SUBMITTED (new - parent sent to finance)
-- FINANCE_APPROVED  (same as Mode 1)

-- budget_request_items: track origin department
ALTER TABLE inventory.budget_request_items ADD COLUMN IF NOT EXISTS
  source_request_id BIGINT REFERENCES inventory.budget_requests(id);

ALTER TABLE inventory.budget_request_items ADD COLUMN IF NOT EXISTS
  source_department_id INTEGER REFERENCES inventory.departments(id);
```

#### 1.5.4 Aggregation Logic

```typescript
async aggregateDepartmentRequests(fiscalYear: number): Promise<BudgetRequest> {
  // 1. หา department requests ที่ DEPT_APPROVED แล้ว
  const approvedRequests = await db('budget_requests')
    .where({ fiscal_year: fiscalYear, status: 'DEPT_APPROVED' })
    .whereNotNull('department_id');

  if (approvedRequests.length === 0) {
    throw new Error('No approved department requests to aggregate');
  }

  // 2. สร้าง Parent Request (Aggregated)
  const [parentRequest] = await db('budget_requests').insert({
    fiscal_year: fiscalYear,
    department_id: null,  // Hospital-wide
    parent_request_id: null,
    status: 'AGGREGATED',
    is_aggregated: true,
    aggregated_at: new Date(),
    request_number: `BR-${fiscalYear}-AGG`,
  }).returning('*');

  // 3. Link children และ copy items
  for (const childRequest of approvedRequests) {
    // Update child: link to parent
    await db('budget_requests')
      .where({ id: childRequest.id })
      .update({
        parent_request_id: parentRequest.id,
        status: 'AGGREGATED'
      });

    // Copy items to parent
    const childItems = await db('budget_request_items')
      .where({ budget_request_id: childRequest.id });

    for (const item of childItems) {
      await db('budget_request_items').insert({
        ...item,
        id: undefined,
        budget_request_id: parentRequest.id,
        source_request_id: childRequest.id,
        source_department_id: childRequest.department_id,
      });
    }
  }

  // 4. Recalculate totals
  await this.recalculateTotalAmount(parentRequest.id);

  return parentRequest;
}
```

#### 1.5.5 Mode 2 Key Features

| Feature | Description |
|---------|-------------|
| **Independent Work** | แต่ละแผนกทำงานอิสระ ไม่ต้องรอกัน |
| **Save Draft** | บันทึก DRAFT เก็บไว้ได้ ไม่ต้อง Submit ทันที |
| **Separate Initialize** | แต่ละแผนกดึงยาเอง เลือกได้ตามต้องการ |
| **Partial Aggregation** | รวมเฉพาะแผนกที่ DEPT_APPROVED แล้ว |
| **Drug Overlap** | ยาซ้ำกันได้ (aggregate จะ merge) |
| **Track Origin** | items มี source_department_id |

---

## 2. Business Requirements

### 2.1 User Roles

| Role                     | Responsibilities       | Permissions                      |
| ------------------------ | ---------------------- | -------------------------------- |
| **Pharmacist (Planner)** | จัดทำแผนงบประมาณยา     | Create, Edit, Submit, Initialize |
| **Department Head**      | อนุมัติแผนระดับแผนก    | View, Approve (Dept), Reject     |
| **Finance Manager**      | อนุมัติแผนระดับการเงิน | View, Approve (Finance), Reject  |
| **Director**             | ดูภาพรวม               | View All                         |
| **System Admin**         | จัดการระบบ             | Full Access                      |

### 2.2 Business Rules

1. **Initialize**: ดึงรายการยาจาก `drug_generics` + คำนวณ
   - ยอดใช้ย้อนหลัง 3 ปี จาก `drug_distributions`
   - ยอดคงคลัง จาก `inventory`
   - ราคาล่าสุด จาก `drug_lots`
   - ประมาณการใช้ = เฉลี่ย 3 ปี × 1.05 (+ 5% growth)

2. **Manual Add**: สามารถเพิ่มยาใหม่ได้ (กรณียาตัวใหม่ยังไม่มีประวัติ)

3. **Auto Calculation**:
   - `เฉลี่ย = (ปี 66 + ปี 67 + ปี 68) / 3`
   - `ประมาณซื้อ = ประมาณการใช้ - คงคลัง`
   - `มูลค่า = จำนวนที่ขอ × ราคา/หน่วย`

4. **Quarterly Split**: `Q1 + Q2 + Q3 + Q4 = จำนวนที่ขอ`

5. **Budget Lock**: หลัง FINANCE_APPROVED → สร้าง `budget_allocations` อัตโนมัติ

6. **Editable Status Control**: 🔒 **CRITICAL BUSINESS RULE**
   - **DRAFT** = แก้ไขได้ทุกอย่าง (Initialize, Add, Delete, Update)
   - **SUBMITTED** = ล็อค ห้ามแก้ไข (รออนุมัติแผนก)
   - **DEPT_APPROVED** = ล็อค ห้ามแก้ไข (รออนุมัติการเงิน)
   - **FINANCE_APPROVED** = ล็อค ห้ามแก้ไข (งบล็อคแล้ว)
   - **REJECTED** = ล็อค ห้ามแก้ไข (ถูกปฏิเสธ)
   - ℹ️ ระหว่างทำแผนใช้เวลาหลายวัน ให้เก็บสถานะ DRAFT ไว้จนกว่าจะพร้อม Submit

### 2.3 Data Volume

- **รายการยา**: ~2,000 - 5,000 รายการ/ปี
- **Concurrent Users**: ~5-10 users
- **Response Time**: < 3 วินาที สำหรับ Initialize

---

## 3. System Workflow

### 3.1 Overall Workflow (4 Phases)

```
Phase 1: Initialize & Planning
├─ [Planner] สร้าง Budget Request (DRAFT)
├─ [Planner] เลือก 1 ใน 2 วิธี:
│
│   Option A: Initialize from Drug Master (ถ้ามีข้อมูลในระบบ)
│   ├─ กด "Initialize" → ระบบดึงรายการยาทั้งหมด
│   │   - ยอดใช้ย้อนหลัง 3 ปี (จาก drug_distributions)
│   │   - ยอดคงคลัง (จาก inventory)
│   │   - ราคาล่าสุด (จาก drug_lots)
│   │   - ประมาณการเบื้องต้น (auto-calculate)
│   │
│   Option B: Import Excel/CSV (กรณีเริ่มระบบใหม่/มีไฟล์ภายนอก)
│   ├─ กด "Import Excel/CSV"
│   ├─ อัพโหลดไฟล์ (Excel หรือ CSV)
│   ├─ ระบบ validate structure
│   ├─ แสดง preview ข้อมูล
│   ├─ ยืนยันการ import
│   └─ ระบบ insert เข้า budget_request_items
│
├─ [Planner] ลบยาที่ไม่ต้องการ (optional)
├─ [Planner] เพิ่มยาใหม่ (optional)
├─ [Planner] แก้ไขข้อมูล: ประมาณการ, จำนวนที่ขอ, Q1-Q4
└─ [Planner] Submit
         ↓
Phase 2: Department Approval
├─ [Dept Head] Review แผน
├─ [Dept Head] Approve หรือ Reject (+ เหตุผล)
└─ Status: SUBMITTED → DEPT_APPROVED
         ↓
Phase 3: Finance Approval
├─ [Finance Manager] Review แผน
├─ [Finance Manager] Approve หรือ Reject
├─ Status: DEPT_APPROVED → FINANCE_APPROVED
└─ **Auto-create budget_allocations** (ล็อคงบ)
         ↓
Phase 4: Export & Report
├─ [Planner] กด "Export SSCJ"
├─ ระบบสร้างไฟล์ Excel ตามฟอร์แมต สสจ.
│   - Multi-level headers (Row 3-4)
│   - Merged cells
│   - Number formatting
│   - Borders
└─ [Planner] ส่งไฟล์ให้ สสจ.
```

### 3.2 Phase 1: Initialize & Planning (Detail)

#### 3.2.1 Initialize API Call

```typescript
POST /api/inventory/budget-requests/:id/initialize

Response:
{
  "success": true,
  "data": {
    "initialized": 1250,
    "total": 1250,
    "message": "Successfully initialized 1,250 drug items"
  }
}
```

**Process:**

1. ดึงรายการยาทั้งหมดจาก `drug_generics` (WHERE is_active = true)
2. สำหรับแต่ละยา:
   - Query ยอดใช้ 3 ปีจาก `drug_distributions`
   - Query ยอดคงคลังจาก `inventory`
   - Query ราคาล่าสุดจาก `drug_lots`
   - คำนวณเฉลี่ย, ประมาณการ, ประมาณซื้อ
3. Insert/Update `budget_request_items`

#### 3.2.2 Manual Add Drug

```typescript
POST /api/inventory/budget-requests/:id/items

Request Body:
{
  "generic_id": 123,
  "estimated_usage_2569": 5000,
  "requested_qty": 5000,
  "q1_qty": 1250,
  "q2_qty": 1250,
  "q3_qty": 1250,
  "q4_qty": 1250
}
```

#### 3.2.3 Delete Drug

```typescript
DELETE /api/inventory/budget-requests/:id/items/:itemId
```

#### 3.2.4 Batch Update

```typescript
PUT /api/inventory/budget-requests/:id/items/batch

Request Body:
{
  "items": [
    {
      "id": 1,
      "estimated_usage_2569": 4662,
      "requested_qty": 5400,
      "q1_qty": 1350,
      "q2_qty": 1350,
      "q3_qty": 1350,
      "q4_qty": 1350
    },
    // ... more items
  ]
}
```

### 3.3 Phase 2-3: Approval Workflow

(Same as before - submit, approve-dept, approve-finance, reject)

### 3.4 Phase 4: Export SSCJ Format

```typescript
GET /api/inventory/budget-requests/:id/export-sscj

Response: Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
Filename: แผนงบประมาณยา_ปี2569_BR-2569-0001.xlsx
```

**Excel Structure:**

- Sheet Name: "แผนงบ 69"
- Row 1: Title (merged A1:AH1)
- Row 2: Summary
- Row 3: Main headers (with merged cells)
- Row 4: Sub-headers
- Row 5+: Data rows

---

## 4. Database Design

### 4.1 Enhanced budget_request_items Schema

```sql
-- Existing table (from Phase 0)
CREATE TABLE inventory.budget_request_items (
  id BIGSERIAL PRIMARY KEY,
  budget_request_id BIGINT REFERENCES inventory.budget_requests(id) ON DELETE CASCADE,

  -- ===== OLD FIELDS (เดิม) =====
  budget_id INTEGER REFERENCES inventory.budgets(id),  -- DEPRECATED: ไม่ใช้แล้ว
  requested_amount DECIMAL(15,2),
  q1_amount DECIMAL(15,2),  -- DEPRECATED: เปลี่ยนเป็น q1_qty
  q2_amount DECIMAL(15,2),  -- DEPRECATED: เปลี่ยนเป็น q2_qty
  q3_amount DECIMAL(15,2),  -- DEPRECATED: เปลี่ยนเป็น q3_qty
  q4_amount DECIMAL(15,2),  -- DEPRECATED: เปลี่ยนเป็น q4_qty
  item_justification TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== NEW MIGRATION (Phase 1.1) =====
ALTER TABLE inventory.budget_request_items

-- Drug Information
ADD COLUMN generic_id INTEGER REFERENCES inventory.drug_generics(id),
ADD COLUMN generic_code VARCHAR(50),        -- รหัสยา TMT
ADD COLUMN generic_name VARCHAR(500),       -- ชื่อยา
ADD COLUMN package_size VARCHAR(100),       -- ขนาดบรรจุ
ADD COLUMN unit VARCHAR(50),                -- หน่วยนับ
ADD COLUMN line_number INTEGER,             -- ลำดับ

-- Historical Usage (3 years back) - FLEXIBLE DESIGN
ADD COLUMN historical_usage JSONB DEFAULT '{}',       -- ยอดใช้ย้อนหลัง 3 ปี (Format: {"2566": 4200, "2567": 4400, "2568": 4527})
ADD COLUMN avg_usage DECIMAL(10,2) DEFAULT 0,         -- เฉลี่ย 3 ปี (คำนวณจาก historical_usage)

-- Planning
ADD COLUMN estimated_usage_2569 DECIMAL(10,2) DEFAULT 0,  -- ประมาณการใช้ปี 2569
ADD COLUMN current_stock DECIMAL(10,2) DEFAULT 0,         -- ยอดคงคลัง
ADD COLUMN estimated_purchase DECIMAL(10,2) DEFAULT 0,    -- ประมาณการซื้อ

-- Pricing
ADD COLUMN unit_price DECIMAL(10,2) DEFAULT 0,      -- ราคา/หน่วย

-- Request (จำนวนที่ขอจริง)
ADD COLUMN requested_qty DECIMAL(10,2) DEFAULT 0,   -- จำนวนที่ขอ
ADD COLUMN requested_amount_calc DECIMAL(15,2) GENERATED ALWAYS AS
  (requested_qty * unit_price) STORED,              -- มูลค่า (auto-calc)

-- Budget Split (งบประมาณ vs เงินบำรุง)
ADD COLUMN budget_qty DECIMAL(10,2) DEFAULT 0,      -- จำนวน (เงินงบประมาณ)
ADD COLUMN fund_qty DECIMAL(10,2) DEFAULT 0,        -- จำนวน (เงินบำรุง)

-- Quarterly (รายไตรมาส - จำนวน ไม่ใช่เงิน)
ADD COLUMN q1_qty DECIMAL(10,2) DEFAULT 0,          -- Q1 (ต.ค.-ธ.ค.)
ADD COLUMN q2_qty DECIMAL(10,2) DEFAULT 0,          -- Q2 (ม.ค.-มี.ค.)
ADD COLUMN q3_qty DECIMAL(10,2) DEFAULT 0,          -- Q3 (เม.ย.-มิ.ย.)
ADD COLUMN q4_qty DECIMAL(10,2) DEFAULT 0,          -- Q4 (ก.ค.-ก.ย.)

-- Notes
ADD COLUMN notes TEXT;

-- ===== CONSTRAINTS =====
ALTER TABLE inventory.budget_request_items
ADD CONSTRAINT budget_request_items_generic_unique
  UNIQUE (budget_request_id, generic_id),
ADD CONSTRAINT budget_request_items_quarterly_check
  CHECK (q1_qty + q2_qty + q3_qty + q4_qty = requested_qty),
ADD CONSTRAINT budget_request_items_budget_split_check
  CHECK (budget_qty + fund_qty = requested_qty);

-- ===== INDEXES =====
CREATE INDEX idx_budget_request_items_generic
  ON inventory.budget_request_items(generic_id);
CREATE INDEX idx_budget_request_items_code
  ON inventory.budget_request_items(generic_code);
CREATE INDEX idx_budget_request_items_line
  ON inventory.budget_request_items(budget_request_id, line_number);
```

### 4.2 Sample Data

| Field                 | Value                                 | Note                    |
| --------------------- | ------------------------------------- | ----------------------- |
| line_number           | 1                                     | ลำดับ                   |
| generic_code          | 100103660                             | รหัสยา TMT              |
| generic_name          | 0.1% Triamcinolone...                 | ชื่อยา                  |
| package_size          | 1                                     | ขนาดบรรจุ               |
| unit                  | หลอด                                  | หน่วยนับ                |
| historical_usage      | {"2566":4200,"2567":4400,"2568":4527} | ยอดใช้ย้อนหลัง 3 ปี     |
| avg_usage             | 4376                                  | เฉลี่ย                  |
| estimated_usage_2569  | 4662                                  | ประมาณการ (4376 × 1.05) |
| current_stock         | 851                                   | คงคลัง                  |
| estimated_purchase    | 3811                                  | ประมาณซื้อ (4662 - 851) |
| unit_price            | 15.00                                 | ราคา/หน่วย              |
| requested_qty         | 5400                                  | จำนวนที่ขอ              |
| requested_amount_calc | 81000                                 | มูลค่า (5400 × 15)      |
| budget_qty            | 0                                     | เงินงบประมาณ            |
| fund_qty              | 5400                                  | เงินบำรุง               |
| q1_qty                | 1350                                  | Q1                      |
| q2_qty                | 1350                                  | Q2                      |
| q3_qty                | 1350                                  | Q3                      |
| q4_qty                | 1350                                  | Q4                      |

---

## 5. API Specifications

### 5.1 Initialize Budget Request Items

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

```typescript
POST /api/inventory/budget-requests/:id/initialize

Headers:
  Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "initialized": 1250,
    "total": 1250,
    "message": "Successfully initialized 1,250 drug items"
  },
  "meta": {
    "timestamp": "2025-12-08T10:30:00Z",
    "requestId": "req_123"
  }
}

Response 400:
{
  "success": false,
  "error": {
    "code": "ALREADY_INITIALIZED",
    "message": "Budget request already has items. Use batch update instead."
  }
}

Response 422 (Not Editable):
{
  "success": false,
  "error": {
    "code": "NOT_EDITABLE",
    "message": "Cannot modify budget request with status: SUBMITTED. Only DRAFT requests can be modified."
  }
}
```

### 5.2 Add Drug to Budget Request

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

```typescript
POST /api/inventory/budget-requests/:id/items

Request Body:
{
  "generic_id": 123,
  "estimated_usage_2569": 5000,
  "requested_qty": 5000,
  "unit_price": 25.50,
  "budget_qty": 3000,
  "fund_qty": 2000,
  "q1_qty": 1250,
  "q2_qty": 1250,
  "q3_qty": 1250,
  "q4_qty": 1250,
  "notes": "ยาตัวใหม่"
}

Response 201:
{
  "success": true,
  "data": {
    "id": 1251,
    "generic_code": "100123456",
    "generic_name": "New Drug Name",
    "requested_qty": 5000,
    "requested_amount_calc": 127500
  }
}
```

### 5.3 Update Item (Single)

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

```typescript
PUT /api/inventory/budget-requests/:id/items/:itemId

Request Body:
{
  "estimated_usage_2569": 6000,
  "requested_qty": 5500,
  "q1_qty": 1375,
  "q2_qty": 1375,
  "q3_qty": 1375,
  "q4_qty": 1375
}

Response 200:
{
  "success": true,
  "data": { /* updated item */ }
}
```

### 5.4 Batch Update Items

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

```typescript
PUT /api/inventory/budget-requests/:id/items/batch

Request Body:
{
  "items": [
    {
      "id": 1,
      "estimated_usage_2569": 4662,
      "requested_qty": 5400,
      "q1_qty": 1350,
      "q2_qty": 1350,
      "q3_qty": 1350,
      "q4_qty": 1350
    },
    {
      "id": 2,
      "estimated_usage_2569": 473,
      "requested_qty": 350,
      "q1_qty": 87.5,
      "q2_qty": 87.5,
      "q3_qty": 87.5,
      "q4_qty": 87.5
    }
    // ... up to 100 items per request
  ]
}

Response 200:
{
  "success": true,
  "data": {
    "updated": 2,
    "failed": 0
  }
}
```

### 5.5 Delete Item

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

```typescript
DELETE /api/inventory/budget-requests/:id/items/:itemId

Response 200:
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### 5.6 Import Excel/CSV

**⚠️ Validation:** Only allowed when `status = 'DRAFT'`

**Purpose:** นำเข้าข้อมูลจากไฟล์ Excel/CSV (กรณีเริ่มระบบใหม่ หรือมีข้อมูลจากระบบเก่า)

```typescript
POST /api/inventory/budget-requests/:id/import-excel

Request:
  Content-Type: multipart/form-data

  Fields:
  - file: File (Excel .xlsx หรือ CSV .csv)
  - replace_all: boolean (default: false)
    - true = ลบข้อมูลเดิมทั้งหมด แล้ว insert ใหม่
    - false = merge กับข้อมูลเดิม (update ถ้าซ้ำ)

Response 200 (Success):
{
  "success": true,
  "data": {
    "imported": 1250,      // จำนวนรายการที่ import สำเร็จ
    "updated": 50,         // จำนวนรายการที่ update
    "skipped": 10,         // จำนวนรายการที่ skip (ไม่ valid)
    "errors": [
      {
        "row": 15,
        "field": "generic_code",
        "message": "Drug code '999999' not found in drug_generics"
      },
      {
        "row": 23,
        "field": "q1_qty",
        "message": "Quarterly split mismatch: Q1+Q2+Q3+Q4 ≠ requested_qty"
      }
    ]
  }
}

Response 422 (Validation Error):
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "File must be Excel (.xlsx) or CSV (.csv) format"
  }
}
```

**Excel Template Structure:**

| Column | Header         | Required | Type   | Example          |
| ------ | -------------- | -------- | ------ | ---------------- |
| A      | รหัสยา         | ✅       | Text   | 100103660        |
| B      | ชื่อยา         | ❌       | Text   | Triamcinolone... |
| C      | หน่วย          | ❌       | Text   | หลอด             |
| D      | ปี 2566        | ❌       | Number | 4200             |
| E      | ปี 2567        | ❌       | Number | 4400             |
| F      | ปี 2568        | ❌       | Number | 4527             |
| G      | ประมาณการ 2569 | ✅       | Number | 4662             |
| H      | คงคลัง         | ❌       | Number | 851              |
| I      | ราคา/หน่วย     | ✅       | Number | 15.00            |
| J      | จำนวนที่ขอ     | ✅       | Number | 5400             |
| K      | Q1             | ✅       | Number | 1350             |
| L      | Q2             | ✅       | Number | 1350             |
| M      | Q3             | ✅       | Number | 1350             |
| N      | Q4             | ✅       | Number | 1350             |
| O      | หมายเหตุ       | ❌       | Text   | -                |

**CSV Format:**

```csv
รหัสยา,ชื่อยา,หน่วย,ปี2566,ปี2567,ปี2568,ประมาณการ2569,คงคลัง,ราคา/หน่วย,จำนวนที่ขอ,Q1,Q2,Q3,Q4,หมายเหตุ
100103660,Triamcinolone,หลอด,4200,4400,4527,4662,851,15.00,5400,1350,1350,1350,1350,
100102902,SMOF,ถุง,340,480,459,473,100,1391.00,350,87.5,87.5,87.5,87.5,
```

**Validation Rules:**

1. **รหัสยา** ต้องมีใน `drug_generics.tmt_code`
2. **ราคา/หน่วย** > 0
3. **จำนวนที่ขอ** > 0
4. **Quarterly Split**: Q1 + Q2 + Q3 + Q4 = จำนวนที่ขอ
5. **File Size**: < 5 MB
6. **Max Rows**: < 10,000 rows

**Implementation Logic:**

```typescript
async importExcel(
  file: Buffer,
  budgetRequestId: number,
  replaceAll: boolean = false
): Promise<ImportResult> {

  // 1. Validate file format
  const ext = getFileExtension(file);
  if (!['xlsx', 'csv'].includes(ext)) {
    throw new Error('Invalid file format');
  }

  // 2. Parse file
  const rows = parseExcelOrCSV(file);

  // 3. Validate structure
  validateHeaders(rows[0]);

  // 4. Replace all if requested
  if (replaceAll) {
    await db('budget_request_items')
      .where({ budget_request_id: budgetRequestId })
      .delete();
  }

  // 5. Process each row
  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };

  for (const [index, row] of rows.entries()) {
    if (index === 0) continue; // Skip header

    try {
      // Validate drug code
      const drug = await db('drug_generics')
        .where({ tmt_code: row.รหัสยา })
        .first();

      if (!drug) {
        results.errors.push({
          row: index + 1,
          field: 'generic_code',
          message: `Drug code '${row.รหัสยา}' not found`
        });
        results.skipped++;
        continue;
      }

      // Validate quarterly split
      const quarterlySum =
        parseFloat(row.Q1 || 0) +
        parseFloat(row.Q2 || 0) +
        parseFloat(row.Q3 || 0) +
        parseFloat(row.Q4 || 0);

      if (Math.abs(quarterlySum - parseFloat(row.จำนวนที่ขอ)) > 0.01) {
        results.errors.push({
          row: index + 1,
          field: 'quarterly_split',
          message: 'Q1+Q2+Q3+Q4 ≠ จำนวนที่ขอ'
        });
        results.skipped++;
        continue;
      }

      // Calculate averages
      const avg = (
        parseFloat(row.ปี2566 || 0) +
        parseFloat(row.ปี2567 || 0) +
        parseFloat(row.ปี2568 || 0)
      ) / 3;

      const estimatedPurchase = Math.max(0,
        parseFloat(row.ประมาณการ2569) - parseFloat(row.คงคลัง || 0)
      );

      // Upsert
      const inserted = await db('budget_request_items')
        .insert({
          budget_request_id: budgetRequestId,
          generic_id: drug.id,
          generic_code: row.รหัสยา,
          generic_name: row.ชื่อยา || drug.generic_name,
          unit: row.หน่วย || drug.unit_name,
          usage_year_2566: parseFloat(row.ปี2566 || 0),
          usage_year_2567: parseFloat(row.ปี2567 || 0),
          usage_year_2568: parseFloat(row.ปี2568 || 0),
          avg_usage: avg,
          estimated_usage_2569: parseFloat(row.ประมาณการ2569),
          current_stock: parseFloat(row.คงคลัง || 0),
          estimated_purchase: estimatedPurchase,
          unit_price: parseFloat(row['ราคา/หน่วย']),
          requested_qty: parseFloat(row.จำนวนที่ขอ),
          q1_qty: parseFloat(row.Q1),
          q2_qty: parseFloat(row.Q2),
          q3_qty: parseFloat(row.Q3),
          q4_qty: parseFloat(row.Q4),
          notes: row.หมายเหตุ,
          line_number: index,
          created_at: new Date(),
          updated_at: new Date()
        })
        .onConflict(['budget_request_id', 'generic_id'])
        .merge();

      if (inserted) {
        results.imported++;
      } else {
        results.updated++;
      }

    } catch (error) {
      results.errors.push({
        row: index + 1,
        message: error.message
      });
      results.skipped++;
    }
  }

  return results;
}
```

### 5.7 Export SSCJ Format

```typescript
GET /api/inventory/budget-requests/:id/export-sscj

Query Parameters:
  - format: 'xlsx' (default) | 'csv'

Response:
  Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Content-Disposition: attachment; filename="แผนงบประมาณยา_ปี2569_BR-2569-0001.xlsx"

  <Excel Binary Data>
```

---

## 6. Excel Export Format

### 6.1 SSCJ Excel Structure

**File:** `แผนงบประมาณยา_ปี2569_BR-2569-0001.xlsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ Row 1: แผนงบประมาณจัดซื้อยา ปีงบประมาณ 2569                     │
│        (Merged A1:AH1, Center, Bold, Size 16)                   │
├─────────────────────────────────────────────────────────────────┤
│ Row 2: [L2] รวมมูลค่าจัดซื้อ  [P2] 1,352,058,096.49           │
├───┬────────┬──────────────┬──────┬──────┬──────────────┬────────┤
│   │        │              │      │      │ ข้อมูลอัตราฯ│        │
│ A │ B      │ C            │ D    │ E    │ F    G    H  │ I      │
│───│────────│──────────────│──────│──────│──────────────│────────│
│ลำ │ รหัส   │ รายการ       │ขนาด  │หน่วย │ปีงบ  ปีงบ ปีงบ│ประมาณฯ│
│ดับ│        │              │บรรจุ │นับ   │2566  2567 2568│2569   │
├───┼────────┼──────────────┼──────┼──────┼──────────────┼────────┤
│ 1 │100...  │Triamcino...  │  1   │หลอด  │4200  4400 4527│ 4662  │
│ 2 │100...  │SMOF...       │  1   │ถุง   │ 340   480  459│  473  │
└───┴────────┴──────────────┴──────┴──────┴──────────────┴────────┘

┌──────┬──────────┬──────┬──────────┬──────────┬───────────┐
│      │ยอดยา     │ประมาณฯ│ ราคา/   │จัดซื้อด้วย│ จัดซื้อด้วย│
│ J    │คงคลัง    │จัดซื้อ │หน่วยบรรจุ│เงินงบฯ   │เงินบำรุง  │
│      │          │        │          │ จำนวน มูลค่า│จำนวน มูลค่า│
├──────┼──────────┼────────┼──────────┼──────────┼───────────┤
│ 851  │3811      │   15   │ 0    0   │5400 81000│           │
│ 100  │ 373      │  1391  │ 0    0   │ 350 486850│          │
└──────┴──────────┴────────┴──────────┴──────────┴───────────┘

┌─────────────────────────────────────────────────────────────┐
│งวดที่ 1     │งวดที่ 2     │งวดที่ 3     │งวดที่ 4     │ยอดรวม│
│ต.ค.2568     │ม.ค.2569     │เม.ย 2569    │ก.ค 2569     │       │
│แผน มูลค่า   │แผน มูลค่า   │แผน มูลค่า   │แผน มูลค่า   │แผน มูลค่า│
├─────────────────────────────────────────────────────────────┤
│1350  20250  │1350  20250  │1350  20250  │1350  20250  │5400 81000│
│87.5 121713  │87.5 121713  │87.5 121713  │87.5 121713  │ 350 486850│
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Column Mapping

| Excel Column | Header (Row 3)          | Sub-header (Row 4) | Database Field          | Type                |
| ------------ | ----------------------- | ------------------ | ----------------------- | ------------------- |
| **A**        | ลำดับ                   | -                  | line_number             | Number              |
| **B**        | รหัส                    | -                  | generic_code            | Text                |
| **C**        | รายการ                  | -                  | generic_name            | Text                |
| **D**        | ขนาดบรรจุ               | -                  | package_size            | Text                |
| **E**        | หน่วยนับ                | -                  | unit                    | Text                |
| **F**        | ข้อมูลอัตราการใช้ฯ      | ปีงบฯ2566          | usage_year_2566         | Number              |
| **G**        | (merged with F)         | ปีงบฯ2567          | usage_year_2567         | Number              |
| **H**        | (merged with F)         | ปีงบฯ2568          | usage_year_2568         | Number              |
| **I**        | ประมาณการใช้ปีงบฯ 2569  | -                  | estimated_usage_2569    | Number              |
| **J**        | ยอดยาคงคลัง             | -                  | current_stock           | Number              |
| **K**        | ประมาณการจัดซื้อฯ       | -                  | estimated_purchase      | Number              |
| **L**        | ราคา/หน่วยขนาดบรรจุ     | -                  | unit_price              | Number (2 decimals) |
| **M**        | จัดซื้อด้วยเงินงบประมาณ | จำนวน              | budget_qty              | Number              |
| **N**        | (merged with M)         | มูลค่า             | budget_qty × unit_price | Calculated          |
| **O**        | จัดซื้อด้วยเงินบำรุง    | จำนวน              | fund_qty                | Number              |
| **P**        | (merged with O)         | มูลค่า             | fund_qty × unit_price   | Calculated          |
| **Q**        | งวดที่ 1 ต.ค.2568       | แผนจัดซื้อ         | q1_qty                  | Number              |
| **R**        | (merged with Q)         | มูลค่า             | q1_qty × unit_price     | Calculated          |
| **U**        | งวดที่ 2 ม.ค.2569       | แผนจัดซื้อ         | q2_qty                  | Number              |
| **V**        | (merged with U)         | มูลค่า             | q2_qty × unit_price     | Calculated          |
| **Y**        | งวดที่ 3 เม.ย 2569      | แผนจัดซื้อ         | q3_qty                  | Number              |
| **Z**        | (merged with Y)         | มูลค่า             | q3_qty × unit_price     | Calculated          |
| **AC**       | งวดที่ 4 ก.ค 2569       | แผนจัดซื้อ         | q4_qty                  | Number              |
| **AD**       | (merged with AC)        | มูลค่า             | q4_qty × unit_price     | Calculated          |
| **AG**       | ยอดรวม                  | แผนจัดซื้อ         | requested_qty           | Number              |
| **AH**       | (merged with AG)        | มูลค่า             | requested_amount_calc   | Calculated          |

### 6.3 Excel Formatting

**Number Formats:**

- Quantity: `#,##0` (no decimals)
- Amount: `#,##0.00` (2 decimals)
- Unit Price: `#,##0.00`

**Borders:**

- All cells: Thin black border
- Header cells: Bold + Center

**Merged Cells:**

- A1:AH1 (Title)
- F3:H3 (ข้อมูลอัตราการใช้ย้อนหลัง 3ปี)
- M3:N3, O3:P3 (จัดซื้อด้วยเงินงบ/บำรุง)
- Q3:T3, U3:X3, Y3:AB3, AC3:AF3 (งวดที่ 1-4)
- AG3:AH3 (ยอดรวม)

---

## 7. Frontend Requirements

### 7.0 UI Mockups (Complete Flow)

#### Screen 1: Budget Requests List Page
**URL:** `/inventory/budget/requests`

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🏠 Home > 📊 Inventory > 💰 Budget > 📋 Budget Requests                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  📋 รายการคำขอแผนงบประมาณ                              [➕ สร้างคำขอใหม่] │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ 🔍 Filter: [ปี 2569 ▼]  [สถานะทั้งหมด ▼]  [🔄 Reset]                       ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌──────┬─────────────────┬─────────────────┬───────────────┬──────────────────┐│
│  │ เลข  │ ปีงบประมาณ      │ มูลค่ารวม       │ สถานะ         │ Actions          ││
│  ├──────┼─────────────────┼─────────────────┼───────────────┼──────────────────┤│
│  │ BR-  │ 2569            │ 1,352,058,096   │ 🟡 DRAFT      │ [✏️][📋][🗑️]    ││
│  │ 0001 │                 │                 │               │                  ││
│  ├──────┼─────────────────┼─────────────────┼───────────────┼──────────────────┤│
│  │ BR-  │ 2568            │ 1,245,000,000   │ 🟢 APPROVED   │ [👁️][📋]        ││
│  │ 0001 │                 │                 │               │                  ││
│  └──────┴─────────────────┴─────────────────┴───────────────┴──────────────────┘│
│                                                                                  │
│  📊 Showing 1-2 of 2 items                                                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Actions by Status:**
| Status          | View | Edit | Items | Delete | Approve |
|-----------------|:----:|:----:|:-----:|:------:|:-------:|
| DRAFT           | ✅   | ✅   | ✅    | ✅     | ❌      |
| SUBMITTED       | ✅   | ❌   | ✅    | ❌     | ✅      |
| DEPT_APPROVED   | ✅   | ❌   | ✅    | ❌     | ✅      |
| FINANCE_APPROVED| ✅   | ❌   | ✅    | ❌     | ❌      |
| REJECTED        | ✅   | ❌   | ✅    | ❌     | ❌      |

---

#### Screen 2: Create/Edit Budget Request Form
**URL:** `/inventory/budget/requests/new` หรือ `/inventory/budget/requests/:id/edit`

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🏠 Home > 📊 Inventory > 💰 Budget > 📋 Budget Requests > ➕ สร้างคำขอใหม่     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  📝 สร้างคำขอแผนงบประมาณยา                                                │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                                                                              ││
│  │  ปีงบประมาณ: *                                                              ││
│  │  ┌─────────────────────────────────────────────┐                            ││
│  │  │ 2569                                     ▼  │                            ││
│  │  └─────────────────────────────────────────────┘                            ││
│  │                                                                              ││
│  │  หมายเหตุ:                                                                   ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐    ││
│  │  │ แผนงบประมาณจัดซื้อยาประจำปี 2569                                    │    ││
│  │  └─────────────────────────────────────────────────────────────────────┘    ││
│  │                                                                              ││
│  │                                                                              ││
│  │  ┌──────────────────────────────────────────────────────────────────┐       ││
│  │  │                    [❌ ยกเลิก]    [💾 บันทึกและไปหน้ารายการยา]    │       ││
│  │  └──────────────────────────────────────────────────────────────────┘       ││
│  │                                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Screen 3: Budget Request Items Page (Main Working Screen)
**URL:** `/inventory/budget/requests/:id/items`

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  🏠 > 📊 Inventory > 💰 Budget > 📋 Requests > 📦 BR-2569-0001                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ [⬅️ Back]  แผนงบประมาณจัดซื้อยา ปี 2569                                                        ││
│  │                                                                                                  ││
│  │ 📋 BR-2569-0001    🟡 DRAFT    💰 1,352,058,096.49 บาท    📦 2,547 รายการ                       ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ Action Bar (DRAFT mode - แสดงทุกปุ่ม)                                                           ││
│  │                                                                                                  ││
│  │ [🔄 Initialize] [📥 Import Excel] [➕ Add Drug]     [💾 Save All] [📤 Submit] [📊 Export SSCJ]  ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ 🔍 Search: [________________] [รหัสยา ▼] [🔍]                                                   ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ┌───┬─────────┬────────────────────────┬──────┬──────┬──────┬──────┬──────┬──────────┬──────────┐  │
│  │ # │ รหัสยา  │ ชื่อยา                 │ หน่วย │ ปี66 │ ปี67 │ ปี68 │เฉลี่ย│ประมาณการ │ คงคลัง  │  │
│  ├───┼─────────┼────────────────────────┼──────┼──────┼──────┼──────┼──────┼──────────┼──────────┤  │
│  │ 1 │100103660│Triamcinolone 0.1%      │ หลอด │ 4200 │ 4400 │ 4527 │ 4376 │[🟡 4662] │   851    │  │
│  │ 2 │100102902│SMOF Lipid              │ ถุง  │  340 │  480 │  459 │  426 │[🟡  473] │   100    │  │
│  │ 3 │100105432│Paracetamol 500mg       │ เม็ด │85000 │87500 │90000 │87500 │[🟡91875] │ 15000    │  │
│  │...│         │                        │      │      │      │      │      │          │          │  │
│  └───┴─────────┴────────────────────────┴──────┴──────┴──────┴──────┴──────┴──────────┴──────────┘  │
│                                                                                                      │
│  ┌──────────┬──────────┬──────────┬────────┬────────┬────────┬────────┬──────────┬─────────┐        │
│  │ประมาณซื้อ│ราคา/หน่วย│จำนวนที่ขอ│  Q1    │  Q2    │  Q3    │  Q4    │  มูลค่า  │ Actions │        │
│  ├──────────┼──────────┼──────────┼────────┼────────┼────────┼────────┼──────────┼─────────┤        │
│  │   3811   │[🟡 15.00]│[🟡 5400] │[🟡1350]│[🟡1350]│[🟡1350]│[🟡1350]│  81,000  │  [🗑️]  │        │
│  │    373   │[🟡1391.0]│[🟡  350] │[🟡  88]│[🟡  88]│[🟡  87]│[🟡  87]│ 486,850  │  [🗑️]  │        │
│  │  76875   │[🟡  2.50]│[🟡85000] │[🟡21250]│[🟡21250]│[🟡21250]│[🟡21250]│ 212,500  │  [🗑️]  │        │
│  │          │          │          │        │        │        │        │          │         │        │
│  └──────────┴──────────┴──────────┴────────┴────────┴────────┴────────┴──────────┴─────────┘        │
│                                                                                                      │
│  🟡 = Editable cells (คลิกเพื่อแก้ไข)                                                                │
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │  📊 Summary: 2,547 รายการ | รวมมูลค่า: 1,352,058,096.49 บาท                                     ││
│  │  ⚠️ Unsaved changes: 3 items modified                                                            ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Screen 4: Initialize Confirmation Dialog

```
┌───────────────────────────────────────────────────────────────────┐
│  🔄 Initialize Budget Request Items                        [✕]    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ⚠️ คำเตือน                                                       │
│                                                                   │
│  การ Initialize จะ:                                               │
│                                                                   │
│  ✅ ดึงรายการยาทั้งหมดจาก Drug Master (~2,500 รายการ)            │
│  ✅ คำนวณยอดใช้ย้อนหลัง 3 ปี                                     │
│  ✅ คำนวณยอดคงคลังปัจจุบัน                                        │
│  ✅ ดึงราคาล่าสุดจาก Drug Lots                                    │
│  ✅ ประมาณการใช้ปี 2569 (เฉลี่ย × 1.05)                          │
│                                                                   │
│  ❗ หากมีข้อมูลอยู่แล้ว จะถูกเขียนทับ                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │          [❌ ยกเลิก]         [✅ ยืนยัน Initialize]        │   │
│  │                                                            │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

#### Screen 5: Submit for Approval Dialog

```
┌───────────────────────────────────────────────────────────────────┐
│  📤 Submit for Approval                                    [✕]    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📋 สรุปคำขอแผนงบประมาณ                                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  เลขที่คำขอ:     BR-2569-0001                              │   │
│  │  ปีงบประมาณ:     2569                                      │   │
│  │  จำนวนรายการ:    2,547 รายการ                              │   │
│  │  มูลค่ารวม:      1,352,058,096.49 บาท                     │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ⚠️ หลังจาก Submit:                                               │
│  • สถานะจะเปลี่ยนเป็น "SUBMITTED"                                 │
│  • ไม่สามารถแก้ไขข้อมูลได้                                        │
│  • รอการอนุมัติจากหัวหน้าแผนก                                     │
│                                                                   │
│  หมายเหตุ:                                                        │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ ขอเสนอแผนจัดซื้อยาประจำปี 2569 เพื่อพิจารณาอนุมัติ        │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │          [❌ ยกเลิก]           [📤 ยืนยันส่งอนุมัติ]        │   │
│  │                                                            │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

#### Screen 6: Approval Screen (For Approvers)
**URL:** `/inventory/budget/requests/:id/approve`

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  🏠 > 📊 Inventory > 💰 Budget > 📋 Requests > ✅ Approval                                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ [⬅️ Back]  อนุมัติแผนงบประมาณจัดซื้อยา                                                         ││
│  │                                                                                                  ││
│  │ 📋 BR-2569-0001    🟠 SUBMITTED    💰 1,352,058,096.49 บาท    📦 2,547 รายการ                   ││
│  │                                                                                                  ││
│  │ ส่งโดย: นายสมชาย เภสัชกร    เมื่อ: 2025-12-08 10:30:00                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ 📊 AG Grid (Read-only mode - ไม่แสดงปุ่ม Edit)                                                  ││
│  │                                                                                                  ││
│  │ ┌───┬─────────┬────────────────────────┬──────┬──────┬──────────┬──────────┬──────────┐        ││
│  │ │ # │ รหัสยา  │ ชื่อยา                 │ หน่วย │เฉลี่ย│จำนวนที่ขอ│ ราคา/หน่วย│  มูลค่า  │        ││
│  │ ├───┼─────────┼────────────────────────┼──────┼──────┼──────────┼──────────┼──────────┤        ││
│  │ │ 1 │100103660│Triamcinolone 0.1%      │ หลอด │ 4376 │    5400  │   15.00  │  81,000  │        ││
│  │ │ 2 │100102902│SMOF Lipid              │ ถุง  │  426 │     350  │ 1,391.00 │ 486,850  │        ││
│  │ │...│         │                        │      │      │          │          │          │        ││
│  │ └───┴─────────┴────────────────────────┴──────┴──────┴──────────┴──────────┴──────────┘        ││
│  │                                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐│
│  │ 💬 Comments & Decision                                                                          ││
│  │                                                                                                  ││
│  │  หมายเหตุ:                                                                                      ││
│  │  ┌────────────────────────────────────────────────────────────────────────────────────────────┐ ││
│  │  │ พิจารณาแล้วเห็นสมควรอนุมัติ                                                                 │ ││
│  │  └────────────────────────────────────────────────────────────────────────────────────────────┘ ││
│  │                                                                                                  ││
│  │  ┌──────────────────────────────────────────────────────────────────────────────────────────┐  ││
│  │  │                                                                                           │  ││
│  │  │     [❌ Reject]                                              [✅ Approve (Dept Head)]    │  ││
│  │  │                                                                                           │  ││
│  │  └──────────────────────────────────────────────────────────────────────────────────────────┘  ││
│  │                                                                                                  ││
│  └─────────────────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 7.0.1 Button Visibility by Status

| Button/Action     | DRAFT | SUBMITTED | DEPT_APPROVED | FINANCE_APPROVED | REJECTED |
|-------------------|:-----:|:---------:|:-------------:|:----------------:|:--------:|
| Initialize        |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Import Excel      |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Add Drug          |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Edit Cells        |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Delete Item       |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Save All          |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Submit            |  ✅   |    ❌     |      ❌       |        ❌        |    ❌    |
| Export SSCJ       |  ✅   |    ✅     |      ✅       |        ✅        |    ✅    |
| Approve (Dept)    |  ❌   |    ✅     |      ❌       |        ❌        |    ❌    |
| Approve (Finance) |  ❌   |    ❌     |      ✅       |        ❌        |    ❌    |
| Reject            |  ❌   |    ✅     |      ✅       |        ❌        |    ❌    |
| Reopen            |  ❌   |    ❌     |      ❌       |        ❌        |    ✅    |

---

### 7.1 Budget Request Items Page

**URL:** `/inventory/budget/requests/:id/items`

**Components:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Header                                                           │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ แผนงบประมาณจัดซื้อยา ปี 2569                                │ │
│ │ Request Number: BR-2569-0001                                 │ │
│ │ Status: DRAFT                                                │ │
│ │ Total Amount: 1,352,058,096.49 บาท                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ Action Bar                                                       │
│ [🔄 Initialize] [➕ Add Drug] [💾 Save] [📤 Submit] [📥 Export] │
├─────────────────────────────────────────────────────────────────┤
│ AG Grid Table                                                    │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ [Filter Bar]                                              │   │
│ ├───┬────────┬──────────────┬──────┬──────┬──────┬──────┬──┤   │
│ │ # │ รหัสยา │ ชื่อยา       │ หน่วย │ ปี66 │ ปี67 │ ปี68 │..│   │
│ ├───┼────────┼──────────────┼──────┼──────┼──────┼──────┼──┤   │
│ │ 1 │ 100... │ Triamcino... │ หลอด │ 4200 │ 4400 │ 4527 │..│   │
│ │ 2 │ 100... │ SMOF...      │ ถุง  │ 340  │ 480  │ 459  │..│   │
│ │...│        │              │      │      │      │      │  │   │
│ └───┴────────┴──────────────┴──────┴──────┴──────┴──────┴──┘   │
│                                                                  │
│ Total: 1,250 items | Page 1 of 13                              │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 AG Grid Configuration

**Columns:**

| Field                 | Header     | Width | Editable | Type          |
| --------------------- | ---------- | ----- | -------- | ------------- |
| line_number           | #          | 60    | ❌       | Number        |
| generic_code          | รหัสยา     | 100   | ❌       | Text          |
| generic_name          | ชื่อยา     | 250   | ❌       | Text          |
| unit                  | หน่วย      | 80    | ❌       | Text          |
| usage_year_2566       | ปี 66      | 90    | ❌       | Number        |
| usage_year_2567       | ปี 67      | 90    | ❌       | Number        |
| usage_year_2568       | ปี 68      | 90    | ❌       | Number        |
| avg_usage             | เฉลี่ย     | 90    | ❌       | Number (calc) |
| estimated_usage_2569  | ประมาณการ  | 110   | ✅       | Number        |
| current_stock         | คงคลัง     | 90    | ❌       | Number        |
| estimated_purchase    | ประมาณซื้อ | 110   | ❌       | Number (calc) |
| unit_price            | ราคา/หน่วย | 100   | ✅       | Number        |
| requested_qty         | จำนวนที่ขอ | 110   | ✅       | Number        |
| q1_qty                | Q1         | 80    | ✅       | Number        |
| q2_qty                | Q2         | 80    | ✅       | Number        |
| q3_qty                | Q3         | 80    | ✅       | Number        |
| q4_qty                | Q4         | 80    | ✅       | Number        |
| requested_amount_calc | มูลค่า     | 120   | ❌       | Number (calc) |
| actions               | Actions    | 80    | -        | Buttons       |

**Editable Cells:**

- Background: Light yellow (#FFFACD)
- Cursor: Pointer

**Calculated Cells:**

- Background: Light gray (#F5F5F5)
- Font: Italic

**Validation:**

- `q1_qty + q2_qty + q3_qty + q4_qty` must equal `requested_qty`
- Show error badge if mismatch

### 7.3 Add Drug Modal

```
┌─────────────────────────────────────────────────┐
│ เพิ่มยาเข้าแผน                          [✕]     │
├─────────────────────────────────────────────────┤
│                                                 │
│ รายการยา: *                                     │
│ [🔍 Search drug by code or name...      ▼]     │
│    (Autocomplete dropdown - drug_generics)      │
│                                                 │
│ ข้อมูลย้อนหลัง:                                 │
│   ปี 2566: [_______]  (auto-filled if available)│
│   ปี 2567: [_______]                            │
│   ปี 2568: [_______]                            │
│                                                 │
│ ประมาณการใช้ปี 2569: * [_______]                │
│ ยอดคงคลัง:             [_______] (auto-filled) │
│ ราคา/หน่วย: *          [_______] (auto-filled) │
│                                                 │
│ จำนวนที่ขอ: * [_______]                         │
│                                                 │
│ แบ่งตามงวด:                                     │
│   Q1 (ต.ค.-ธ.ค.): * [_______]                  │
│   Q2 (ม.ค.-มี.ค.): * [_______]                 │
│   Q3 (เม.ย.-มิ.ย.): * [_______]                │
│   Q4 (ก.ค.-ก.ย.): * [_______]                  │
│                                                 │
│   ผลรวม: 0 / [จำนวนที่ขอ]                      │
│   ⚠️ ผลรวมไตรมาสต้องเท่ากับจำนวนที่ขอ          │
│                                                 │
│ หมายเหตุ: [_______________________]             │
│                                                 │
│          [Cancel]  [✅ Add Drug]                │
└─────────────────────────────────────────────────┘
```

---

## 8. Technical Requirements

### 8.1 Performance

- **Initialize**: < 5 seconds for 2,000 drugs
- **Load Items**: < 2 seconds for 2,000 rows
- **Edit Cell**: < 100ms response
- **Export Excel**: < 3 seconds for 2,000 rows
- **Batch Update**: < 2 seconds for 100 items

### 8.2 Tech Stack

**Backend:**

- Fastify (API)
- Knex.js (Query Builder)
- PostgreSQL 14+
- ExcelJS (Excel generation)

**Frontend:**

- Angular 17+
- AG Grid Enterprise
- TailwindCSS
- Angular Material

### 8.3 Security

- JWT Authentication
- Role-based permissions
- Input validation (TypeBox)
- SQL injection prevention (Knex parameterized queries)

---

## 9. Implementation Plan

### Phase 1: Database & API (Week 1-2)

**Week 1:**

- [x] Create budget_requests table ✅
- [x] Create budget_request_items table ✅
- [ ] Migration: Add new columns to budget_request_items
- [ ] Seed data: Sample drugs, distributions

**Week 2:**

- [ ] API: POST /budget-requests/:id/initialize
- [ ] API: POST /budget-requests/:id/items (add drug)
- [ ] API: PUT /budget-requests/:id/items/:itemId
- [ ] API: PUT /budget-requests/:id/items/batch
- [ ] API: DELETE /budget-requests/:id/items/:itemId
- [x] API: GET /budget-requests/:id/export-sscj ✅ (Phase 1.5 Completed)
- [ ] Unit tests

**Phase 1.5: Export SSCJ API** ✅ **COMPLETED**

- [x] Implemented GET /budget-requests/:id/export-sscj
- [x] ExcelJS integration
- [x] SSCJ format with merged cells
- [x] Tested and deployed

**Phase 2: Enhanced Features** ✅ **COMPLETED**

**Phase 2.1: Reopen Feature** ✅

- [x] API: POST /budget-requests/:id/reopen
- [x] Status validation (REJECTED → DRAFT allowed)
- [x] Audit trail integration

**Phase 2.2: Audit Log** ✅

- [x] Migration: Create budget_request_audit table
- [x] Audit service implementation
- [x] Integration with all workflow methods
- [x] Track CREATE, UPDATE, DELETE, SUBMIT, APPROVE, REJECT, REOPEN

**Phase 2.3: Comments Feature** 🔄 **IN PROGRESS**

- [ ] Migration: Create budget_request_comments table
- [ ] Generate CRUD endpoints
- [ ] Frontend integration

### Phase 3: Frontend (Week 3-4)

**Week 3:**

- [ ] Budget Request Items page
- [ ] AG Grid integration
- [ ] Initialize button
- [ ] Add Drug modal
- [ ] Edit inline cells

**Week 4:**

- [ ] Batch update
- [ ] Delete items
- [ ] Validation (quarterly split)
- [ ] Export button
- [ ] E2E tests

### Phase 4: Excel Export (Week 5)

- [ ] ExcelJS implementation
- [ ] Multi-level headers
- [ ] Merged cells
- [ ] Number formatting
- [ ] Borders
- [ ] Test with real data

### Phase 5: Testing & Deployment (Week 6)

- [ ] Integration testing
- [ ] Performance testing (2,000+ items)
- [ ] User acceptance testing
- [ ] Documentation
- [ ] Deployment

---

## 10. Change Log

### Version 2.0.0 (2025-12-08)

**Major Changes:**

1. **Clarified Initialize vs Export**
   - Initialize = ดึงรายการยาทั้งหมด + auto-calculate
   - Export = สร้างไฟล์ Excel ส่ง สสจ.

2. **Database Schema Updates**
   - Added 15+ new columns to budget_request_items
   - Changed from amount-based to quantity-based (q1_qty vs q1_amount)
   - Added budget_qty, fund_qty split
   - Added generated column: requested_amount_calc

3. **New Features**
   - Manual drug addition
   - Drug deletion
   - Batch update (up to 100 items)

4. **Excel Format**
   - Aligned with actual SSCJ format
   - Multi-level headers (Row 3-4)
   - Merged cells properly mapped
   - 34 columns (A-AH)

5. **API Enhancements**
   - Initialize endpoint
   - Add/Delete/Update items
   - Batch update
   - Export SSCJ format

---

## 10. Future Enhancements (Optional)

### 10.1 Reopen Feature ✅ **COMPLETED** (Phase 2.1)

**Purpose:** ส่งกลับแผนมาแก้ไขใหม่

**API:**

```typescript
POST /api/inventory/budget-requests/:id/reopen

Request Body:
{
  "reason": "ต้องการปรับเปลี่ยนยอดตามนโยบายใหม่"
}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "status": "DRAFT",
    "reopened_by": "user-123",
    "reopened_at": "2025-12-08T15:30:00Z"
  }
}
```

**Business Rules:**

- REJECTED → DRAFT (auto-allow)
- SUBMITTED → DRAFT (ต้องได้รับอนุมัติจาก Department Head)
- DEPT_APPROVED → DRAFT (ต้องได้รับอนุมัติจาก Finance Manager)
- FINANCE_APPROVED → ห้าม Reopen (งบล็อคแล้ว ต้องสร้างใหม่)

### 10.2 Audit Log ✅ **COMPLETED** (Phase 2.2)

**Purpose:** บันทึกประวัติการแก้ไข

**Table:**

```sql
CREATE TABLE inventory.budget_request_audit (
  id BIGSERIAL PRIMARY KEY,
  budget_request_id BIGINT REFERENCES inventory.budget_requests(id),
  action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'SUBMIT', 'APPROVE', 'REJECT', 'REOPEN'
  entity_type VARCHAR(50), -- 'BUDGET_REQUEST', 'BUDGET_REQUEST_ITEM'
  entity_id BIGINT,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**

- Track all changes (who, when, what)
- Show audit trail in UI
- Filter by user, date, action

### 10.3 Version History

**Purpose:** เก็บ snapshot ของแผนแต่ละเวอร์ชัน

**Table:**

```sql
CREATE TABLE inventory.budget_request_versions (
  id BIGSERIAL PRIMARY KEY,
  budget_request_id BIGINT REFERENCES inventory.budget_requests(id),
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL, -- Full data snapshot
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(budget_request_id, version)
);
```

**Features:**

- Auto-create version on each Submit
- Compare versions (diff view)
- Restore from previous version

### 10.4 Comments & Discussion 🔄 **IN PROGRESS** (Phase 2.3)

**Purpose:** สนทนาและแลกเปลี่ยนความคิดเห็นในแผน

**Table:**

```sql
CREATE TABLE inventory.budget_request_comments (
  id BIGSERIAL PRIMARY KEY,
  budget_request_id BIGINT REFERENCES inventory.budget_requests(id),
  parent_id BIGINT REFERENCES inventory.budget_request_comments(id), -- For reply
  comment TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Features:**

- Comment on budget request
- Reply to comments (thread)
- Mention users (@username)
- Attach files

### 10.5 Notifications

**Purpose:** แจ้งเตือนเมื่อมีการเปลี่ยนแปลงสถานะ

**Channels:**

- In-app notification
- Email notification
- LINE notification (optional)

**Events:**

- Budget request submitted
- Budget request approved
- Budget request rejected
- Budget request reopened
- Comment added

### 10.6 Approval Matrix

**Purpose:** กำหนดผู้อนุมัติตามเงื่อนไข

**Table:**

```sql
CREATE TABLE inventory.budget_approval_matrix (
  id SERIAL PRIMARY KEY,
  min_amount DECIMAL(15,2),
  max_amount DECIMAL(15,2),
  department_id INTEGER REFERENCES inventory.departments(id),
  approver_role VARCHAR(50), -- 'DEPT_HEAD', 'FINANCE_MANAGER', 'DIRECTOR'
  sequence INTEGER, -- Approval order
  is_required BOOLEAN DEFAULT true
);
```

**Example:**

- งบ < 100,000 → Dept Head only
- งบ 100,000 - 500,000 → Dept Head + Finance Manager
- งบ > 500,000 → Dept Head + Finance Manager + Director

### 10.7 Budget Control Lock Period

**Purpose:** กำหนดช่วงเวลาปิดรับแผน/เปิดรับแผน

**Table:**

```sql
CREATE TABLE inventory.budget_planning_periods (
  id SERIAL PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  planning_start_date DATE NOT NULL,
  planning_end_date DATE NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  locked_by UUID REFERENCES public.users(id),
  locked_at TIMESTAMP
);
```

**Features:**

- ปิดรับแผนหลังครบกำหนด
- ล็อคงบประมาณตามช่วงเวลา
- แจ้งเตือนก่อนปิดรับ

### 10.8 Excel Import (Reverse Flow)

**Purpose:** นำเข้าข้อมูลจากไฟล์ Excel กลับเข้าระบบ

**Use Case:**

- แก้ไขแผนใน Excel แล้วนำเข้ากลับ
- Import แผนจากระบบเก่า

**Implementation:**

```typescript
POST /api/inventory/budget-requests/:id/import-excel

Request:
  Content-Type: multipart/form-data
  File: แผนงบประมาณยา_ปี2569_BR-2569-0001.xlsx

Response:
{
  "success": true,
  "data": {
    "imported": 1250,
    "updated": 50,
    "errors": []
  }
}
```

**Validation:**

- Check Excel structure
- Validate drug codes
- Validate quarterly split
- Show preview before import

---

## 11. Implementation Priority

### Phase 1 (Core) - Week 1-6

- ✅ Database schema
- ✅ Initialize API
- ✅ Import Excel/CSV API
- ✅ Add/Delete/Update APIs
- ✅ Export SSCJ
- ✅ Frontend UI (with Import button)
- ✅ Status-based access control

### Phase 2 (Enhanced) - Week 7-8

- [ ] Reopen feature
- [ ] Audit log
- [ ] Comments

### Phase 3 (Advanced) - Week 9-10

- [ ] Version history
- [ ] Notifications
- [ ] Approval matrix

### Phase 4 (Optional) - Week 11-12

- [ ] Budget lock period
- [ ] Excel import (reverse)
- [ ] Advanced reporting

---

## 12. Gap Analysis & Implementation Status

### 12.1 Current Implementation Status

| Component                  | Status      | Notes                                |
|---------------------------|:-----------:|--------------------------------------|
| **Database**              |             |                                      |
| budget_requests table     | ✅ Done     | Created with basic fields            |
| budget_request_items table| ✅ Done     | Enhanced with drug planning fields   |
| budget_allocations table  | ✅ Done     | For budget lock after approval       |
| dept_id nullable          | ⚠️ TODO     | Need migration for Mode 1            |
| parent_request_id         | ⚠️ TODO     | Need migration for Mode 2            |
| **Backend API**           |             |                                      |
| CRUD endpoints            | ✅ Done     | Basic CRUD working                   |
| Initialize endpoint       | ⚠️ Partial  | Need full implementation             |
| Batch update              | ⚠️ TODO     | For 2000-3000 items performance      |
| approveFinance()          | 🐛 Bug      | Wrong field names (q1_amount→q1_qty) |
| recalculateTotalAmount()  | ⚠️ TODO     | Auto-sum all items                   |
| Export SSCJ               | ✅ Done     | Excel export working                 |
| **Frontend**              |             |                                      |
| Budget Requests List      | ✅ Done     | Basic list working                   |
| Budget Request Form       | ✅ Done     | Create/Edit form                     |
| Budget Request Items      | ⚠️ Partial  | AG Grid needs batch save             |
| Initialize button         | ⚠️ Partial  | UI exists, needs API integration     |
| Approval workflow UI      | ⚠️ TODO     | Approve/Reject buttons               |

### 12.2 Required Fixes (Priority Order)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CRITICAL FIXES FOR MODE 1                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1️⃣ MIGRATION: department_id nullable                                           │
│     ┌──────────────────────────────────────────────────────────────────────┐    │
│     │ ALTER TABLE inventory.budget_requests                                │    │
│     │   ALTER COLUMN department_id DROP NOT NULL;                          │    │
│     │                                                                      │    │
│     │ -- For Mode 2 (future)                                               │    │
│     │ ALTER TABLE inventory.budget_requests                                │    │
│     │   ADD COLUMN parent_request_id BIGINT                                │    │
│     │   REFERENCES inventory.budget_requests(id);                          │    │
│     └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  2️⃣ BUG FIX: approveFinance() wrong field names                                 │
│     ┌──────────────────────────────────────────────────────────────────────┐    │
│     │ File: budget-requests.service.ts                                     │    │
│     │                                                                      │    │
│     │ BEFORE (WRONG):                                                      │    │
│     │   q1_budget: item.q1_amount,  // ❌ field renamed                    │    │
│     │   budget_id: item.budget_id,  // ❌ doesn't exist                    │    │
│     │                                                                      │    │
│     │ AFTER (CORRECT):                                                     │    │
│     │   q1_budget: (item.q1_qty || 0) * (item.unit_price || 0),           │    │
│     │   budget_id: item.budget_type_id || 1,                               │    │
│     └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  3️⃣ NEW METHOD: recalculateTotalAmount()                                        │
│     ┌──────────────────────────────────────────────────────────────────────┐    │
│     │ async recalculateTotalAmount(budgetRequestId: number) {              │    │
│     │   const result = await db('budget_request_items')                    │    │
│     │     .where({ budget_request_id: budgetRequestId })                   │    │
│     │     .sum('requested_qty * unit_price as total');                     │    │
│     │                                                                      │    │
│     │   await db('budget_requests')                                        │    │
│     │     .where({ id: budgetRequestId })                                  │    │
│     │     .update({ total_requested_amount: result[0].total || 0 });       │    │
│     │ }                                                                    │    │
│     └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  4️⃣ BATCH SAVE API: For 2000-3000 items                                         │
│     ┌──────────────────────────────────────────────────────────────────────┐    │
│     │ PUT /api/inventory/budget-requests/:id/items/batch                   │    │
│     │                                                                      │    │
│     │ - Accept up to 100 items per request                                 │    │
│     │ - Frontend chunks 2000 items into 20 requests                        │    │
│     │ - Use Promise.all for parallel updates                               │    │
│     │ - Show progress indicator                                            │    │
│     └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  5️⃣ FRONTEND: Batch save + Approval UI                                          │
│     ┌──────────────────────────────────────────────────────────────────────┐    │
│     │ - Track modified cells in AG Grid                                    │    │
│     │ - "Save All" button saves only changed items                         │    │
│     │ - Show saving progress for large batches                             │    │
│     │ - Add Approve/Reject buttons for approvers                           │    │
│     └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 12.3 Complete Workflow Verification Checklist

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         MODE 1 WORKFLOW VERIFICATION                           ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  □ Phase 1: Create Budget Request                                             ║
║    □ POST /budget-requests (fiscal_year, department_id=NULL)                  ║
║    □ Status = DRAFT                                                           ║
║    □ Navigate to Items page                                                   ║
║                                                                               ║
║  □ Phase 2: Initialize Items                                                  ║
║    □ POST /budget-requests/:id/initialize                                     ║
║    □ Creates 2000-3000 items from drug_generics                               ║
║    □ Calculates historical usage, current_stock, unit_price                   ║
║    □ Auto-calculates estimated_usage = avg × 1.05                             ║
║                                                                               ║
║  □ Phase 3: Edit Items                                                        ║
║    □ AG Grid inline editing                                                   ║
║    □ Track modified cells                                                     ║
║    □ Validate Q1+Q2+Q3+Q4 = requested_qty                                     ║
║    □ PUT /budget-requests/:id/items/batch (chunked)                           ║
║    □ Update total_requested_amount                                            ║
║                                                                               ║
║  □ Phase 4: Submit                                                            ║
║    □ POST /budget-requests/:id/submit                                         ║
║    □ Status = SUBMITTED                                                       ║
║    □ Lock all items (no more editing)                                         ║
║                                                                               ║
║  □ Phase 5: Dept Approval                                                     ║
║    □ POST /budget-requests/:id/approve-dept                                   ║
║    □ Status = DEPT_APPROVED                                                   ║
║                                                                               ║
║  □ Phase 6: Finance Approval                                                  ║
║    □ POST /budget-requests/:id/approve-finance                                ║
║    □ Status = FINANCE_APPROVED                                                ║
║    □ AUTO-CREATE budget_allocations for each item                             ║
║    □ Budget is now LOCKED                                                     ║
║                                                                               ║
║  □ Phase 7: Export                                                            ║
║    □ GET /budget-requests/:id/export-sscj                                     ║
║    □ Download Excel file                                                      ║
║    □ Send to สสจ.                                                             ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 13. Schema Changes Required

### 13.1 Migration: Mode 1 Support

```sql
-- Migration: 20251209_budget_requests_mode1_support.ts

exports.up = async function(knex) {
  // 1. Make department_id nullable for hospital-wide mode
  await knex.raw(`
    ALTER TABLE inventory.budget_requests
    ALTER COLUMN department_id DROP NOT NULL
  `);

  // 2. Add parent_request_id for Mode 2 (future)
  await knex.schema.alterTable('inventory.budget_requests', (table) => {
    table.bigInteger('parent_request_id')
      .references('id')
      .inTable('inventory.budget_requests')
      .onDelete('SET NULL');
  });

  // 3. Add budget_type_id to items (for budget allocation)
  await knex.schema.alterTable('inventory.budget_request_items', (table) => {
    table.integer('budget_type_id')
      .references('id')
      .inTable('inventory.budget_types')
      .defaultTo(1); // Default to main budget type
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('inventory.budget_request_items', (table) => {
    table.dropColumn('budget_type_id');
  });

  await knex.schema.alterTable('inventory.budget_requests', (table) => {
    table.dropColumn('parent_request_id');
  });

  // Cannot easily restore NOT NULL constraint
};
```

### 13.2 Service Fix: approveFinance()

```typescript
// File: budget-requests.service.ts
// Method: approveFinance()

// BEFORE (BUGGY):
const allocationData = {
  budget_id: item.budget_id,  // ❌ doesn't exist
  total_budget: item.requested_amount,  // ❌ wrong field
  q1_budget: item.q1_amount,  // ❌ renamed to q1_qty
  q2_budget: item.q2_amount,
  q3_budget: item.q3_amount,
  q4_budget: item.q4_amount,
};

// AFTER (FIXED):
const allocationData = {
  budget_id: item.budget_type_id || 1,
  fiscal_year: budgetRequest.fiscal_year,
  department_id: budgetRequest.department_id || null,

  // Calculate amount from qty × price
  total_budget: (item.requested_qty || 0) * (item.unit_price || 0),
  q1_budget: (item.q1_qty || 0) * (item.unit_price || 0),
  q2_budget: (item.q2_qty || 0) * (item.unit_price || 0),
  q3_budget: (item.q3_qty || 0) * (item.unit_price || 0),
  q4_budget: (item.q4_qty || 0) * (item.unit_price || 0),

  // Track allocation source
  budget_request_id: budgetRequest.id,
  budget_request_item_id: item.id,
  generic_id: item.generic_id,

  // Metadata
  created_by: userId,
  created_at: new Date(),
  is_active: true,
};
```

---

## 14. Action Plan (3-Hour Sprint)

### Hour 1: Database & Backend Fixes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HOUR 1: DATABASE & BACKEND (60 min)                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [00:00-15:00] Migration                                                         │
│  ├─ Create migration file                                                        │
│  ├─ department_id DROP NOT NULL                                                  │
│  ├─ Add parent_request_id                                                        │
│  └─ Run: pnpm run db:migrate                                                     │
│                                                                                  │
│  [15:00-30:00] Fix approveFinance()                                              │
│  ├─ Update field names (q1_amount → q1_qty)                                      │
│  ├─ Calculate amount from qty × price                                            │
│  ├─ Use budget_type_id instead of budget_id                                      │
│  └─ Test with single item                                                        │
│                                                                                  │
│  [30:00-45:00] Add recalculateTotalAmount()                                      │
│  ├─ Sum all items: requested_qty × unit_price                                    │
│  ├─ Update budget_requests.total_requested_amount                                │
│  └─ Call after batch save                                                        │
│                                                                                  │
│  [45:00-60:00] Batch Update API                                                  │
│  ├─ PUT /budget-requests/:id/items/batch                                         │
│  ├─ Accept up to 100 items                                                       │
│  └─ Transaction for atomicity                                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Hour 2: Frontend Implementation

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HOUR 2: FRONTEND (60 min)                                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [60:00-75:00] AG Grid Modified Cells Tracking                                   │
│  ├─ Track which cells were edited                                                │
│  ├─ Maintain Set<itemId> of modified items                                       │
│  └─ Show "Unsaved changes: N items" indicator                                    │
│                                                                                  │
│  [75:00-90:00] Batch Save Implementation                                         │
│  ├─ "Save All" button                                                            │
│  ├─ Chunk modified items into batches of 100                                     │
│  ├─ Show progress indicator                                                      │
│  └─ Clear modified set after save                                                │
│                                                                                  │
│  [90:00-105:00] Submit & Approval Buttons                                        │
│  ├─ Submit button (DRAFT only)                                                   │
│  ├─ Confirmation dialog                                                          │
│  ├─ Approve/Reject buttons (for approvers)                                       │
│  └─ Status-based button visibility                                               │
│                                                                                  │
│  [105:00-120:00] Testing                                                         │
│  ├─ Test Initialize flow                                                         │
│  ├─ Test Edit + Save flow                                                        │
│  └─ Test Submit + Approve flow                                                   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Hour 3: Integration & Testing

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HOUR 3: INTEGRATION & TESTING (60 min)                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [120:00-135:00] End-to-End Flow Test                                            │
│  ├─ Create new Budget Request                                                    │
│  ├─ Initialize 2000+ items                                                       │
│  ├─ Edit some items                                                              │
│  └─ Save changes                                                                 │
│                                                                                  │
│  [135:00-150:00] Approval Flow Test                                              │
│  ├─ Submit for approval                                                          │
│  ├─ Approve (Dept)                                                               │
│  ├─ Approve (Finance)                                                            │
│  └─ Verify budget_allocations created                                            │
│                                                                                  │
│  [150:00-165:00] Export Test                                                     │
│  ├─ Export SSCJ Excel                                                            │
│  ├─ Verify format matches สสจ. requirement                                       │
│  └─ Check all columns and merged cells                                           │
│                                                                                  │
│  [165:00-180:00] Bug Fixes & Polish                                              │
│  ├─ Fix any issues found                                                         │
│  ├─ Update documentation                                                         │
│  └─ Prepare for demo                                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

**End of Specification v2.1.0**
