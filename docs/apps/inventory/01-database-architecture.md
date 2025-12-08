# Database Architecture

> **Phase 1 Complete - Database foundation for Hospital Drug Inventory System**

## Summary

| Category          | Count         |
| ----------------- | ------------- |
| **Migrations**    | 37 files      |
| **Tables**        | 57 tables     |
| **Views**         | 12 views      |
| **Functions**     | 9 functions   |
| **Enums**         | 31 enum types |
| **Total Objects** | 109 objects   |

## Design Principles

### 1. Schema Isolation

```
PostgreSQL Database (aegisx_db)
├── public schema        <- Core platform (users, roles, permissions)
└── inventory schema     <- Drug inventory module (isolated)
```

**Why separate schema?**

- **Clear boundaries**: Inventory can be deployed/upgraded independently
- **No naming conflicts**: `inventory.drugs` vs potential `public.drugs`
- **Easy backup/restore**: Can backup just inventory schema
- **Customer-specific**: Different sites can have different versions

### 2. Schema Structure Overview

```
inventory schema (109 objects)
├── Reference Tables (11)      <- Master data, rarely changes
├── Drug Tables (11)           <- Drug master & components
├── Procurement Tables (11)    <- PR/PO/Receipt
├── Budget Tables (8)          <- Budget management
├── Inventory Tables (2)       <- Stock tracking
├── TMT Tables (7)             <- Thai Medical Terminology
├── HPP Tables (2)             <- Hospital Pharmaceutical Products
├── Payment/Approval (3)       <- Payment documents
├── System Tables (4)          <- Metadata & migrations
├── Views (12)                 <- Reports & dashboards
├── Functions (9)              <- Business logic
└── Enums (31)                 <- Data integrity
```

## Complete Table List (57 Tables)

### Reference Tables (11 tables)

| Table                | Purpose                  | Thai Description       |
| -------------------- | ------------------------ | ---------------------- |
| `adjustment_reasons` | Stock adjustment reasons | เหตุผลการปรับปรุงสต็อก |
| `bank`               | Bank information         | ธนาคาร                 |
| `companies`          | Vendors & manufacturers  | บริษัทยา/ผู้ผลิต       |
| `departments`        | Hospital departments     | แผนก/หน่วยงาน          |
| `distribution_types` | Distribution categories  | ประเภทการเบิกจ่าย      |
| `dosage_forms`       | Drug forms               | รูปแบบยา               |
| `drug_units`         | Measurement units        | หน่วยนับยา             |
| `hospitals`          | Hospital info            | ข้อมูลโรงพยาบาล        |
| `locations`          | Storage locations        | คลังยา/สถานที่เก็บ     |
| `return_actions`     | Return action types      | การดำเนินการคืนยา      |
| `return_reasons`     | Return reasons           | เหตุผลการคืนยา         |

### Drug Tables (11 tables)

| Table                              | Purpose                 | Key Fields                              |
| ---------------------------------- | ----------------------- | --------------------------------------- |
| `drugs`                            | Drug master             | trade_name, generic_id, manufacturer_id |
| `drug_generics`                    | Generic names           | generic_name, dosage_form_id, strength  |
| `drug_lots`                        | Lot tracking            | lot_number, expiry_date, quantity       |
| `drug_components`                  | Drug ingredients        | drug_id, ingredient, amount             |
| `drug_focus_lists`                 | Focus drug lists        | category, priority                      |
| `drug_pack_ratios`                 | Pack conversions        | base_unit, pack_unit, ratio             |
| `drug_distributions`               | Distribution records    | from_location, to_location              |
| `drug_distribution_items`          | Distribution line items | drug_id, quantity                       |
| `drug_returns`                     | Return documents        | return_reason, return_date              |
| `drug_return_items`                | Return line items       | drug_id, quantity                       |
| `hospital_pharmaceutical_products` | HPP master              | hpp_code, hpp_name                      |

### Procurement Tables (11 tables)

| Table                    | Purpose             | Key Fields                           |
| ------------------------ | ------------------- | ------------------------------------ |
| `purchase_methods`       | Procurement methods | วิธีเฉพาะเจาะจง, วิธี e-bidding      |
| `purchase_types`         | Purchase categories | จัดซื้อปกติ, จัดซื้อฉุกเฉิน          |
| `purchase_requests`      | PR documents        | pr_number, department_id, status     |
| `purchase_request_items` | PR line items       | drug_id, quantity, unit_price        |
| `purchase_orders`        | PO documents        | po_number, vendor_id, contract_id    |
| `purchase_order_items`   | PO line items       | drug_id, quantity, unit_price        |
| `contracts`              | Vendor contracts    | contract_no, vendor_id, validity     |
| `contract_items`         | Contract line items | drug_id, contracted_price            |
| `receipts`               | GR documents        | receipt_number, po_id, received_date |
| `receipt_items`          | Receipt line items  | lot_number, quantity, expiry_date    |
| `receipt_inspectors`     | Receipt inspectors  | inspector_name, role                 |

### Budget Tables (8 tables)

| Table                 | Purpose             | Key Fields                      |
| --------------------- | ------------------- | ------------------------------- |
| `budget_types`        | Budget types        | OPD, NHSO, UC, SSO, GOV         |
| `budget_categories`   | Budget categories   | ยาและเวชภัณฑ์, วัสดุการแพทย์    |
| `budgets`             | Budget master       | fiscal_year, amount, balance    |
| `budget_plans`        | Budget planning     | plan_year, planned_amount       |
| `budget_plan_items`   | Plan line items     | drug_id, planned_quantity       |
| `budget_allocations`  | Budget allocation   | department_id, allocated_amount |
| `budget_reservations` | Budget reservations | pr_id, reserved_amount          |

### Inventory Tables (2 tables)

| Table                    | Purpose       | Key Fields                            |
| ------------------------ | ------------- | ------------------------------------- |
| `inventory`              | Current stock | drug_id, location_id, quantity        |
| `inventory_transactions` | Movement log  | transaction_type, quantity, reference |

### TMT Tables (7 tables)

| Table               | Purpose             | Key Fields                          |
| ------------------- | ------------------- | ----------------------------------- |
| `tmt_concepts`      | TMT concepts        | tmt_id, tmt_level, name_th, name_en |
| `tmt_relationships` | Concept links       | source_id, target_id, relation_type |
| `tmt_mappings`      | Drug-to-TMT mapping | drug_id, tmt_concept_id, status     |
| `tmt_attributes`    | TMT attributes      | concept_id, attribute_name, value   |
| `tmt_dosage_forms`  | TMT dosage forms    | form_code, form_name                |
| `tmt_units`         | TMT units           | unit_code, unit_name                |
| `tmt_manufacturers` | TMT manufacturers   | manufacturer_code, name             |

### HPP Tables (2 tables)

| Table                              | Purpose          | Key Fields                   |
| ---------------------------------- | ---------------- | ---------------------------- |
| `hospital_pharmaceutical_products` | HPP master       | hpp_code, hpp_name, category |
| `hpp_formulations`                 | HPP formulations | hpp_id, formulation_details  |

### Payment/Approval Tables (3 tables)

| Table                 | Purpose           | Key Fields                          |
| --------------------- | ----------------- | ----------------------------------- |
| `approval_documents`  | Approval workflow | document_type, status, approver_id  |
| `payment_documents`   | Payment records   | po_id, payment_amount, payment_date |
| `payment_attachments` | Payment files     | document_id, file_path              |

### System Tables (4 tables)

| Table                            | Purpose               |
| -------------------------------- | --------------------- |
| `knex_migrations_inventory`      | Migration tracking    |
| `knex_migrations_inventory_lock` | Migration lock        |
| `seed_metadata`                  | Seed version tracking |
| `system_info`                    | Schema version info   |

## Complete Enum List (31 Enums)

| Enum Name                | Purpose                       | Values                                                                    |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------- |
| `adjustment_type`        | Stock adjustment types        | INCREASE, DECREASE, EXPIRED, DAMAGED                                      |
| `approval_doc_type`      | Approval document types       | PR, PO, PAYMENT                                                           |
| `budget_class`           | Budget classification         | OPERATIONAL, INVESTMENT, EMERGENCY, RESEARCH                              |
| `budget_plan_status`     | Budget plan status            | DRAFT, SUBMITTED, APPROVED, REJECTED                                      |
| `company_type`           | Company types                 | MANUFACTURER, DISTRIBUTOR, IMPORTER                                       |
| `contract_status`        | Contract status               | DRAFT, ACTIVE, EXPIRED, TERMINATED                                        |
| `contract_type`          | Contract types                | FRAMEWORK, SPOT, CONSIGNMENT                                              |
| `dept_consumption_group` | Department consumption groups | HIGH, MEDIUM, LOW                                                         |
| `distribution_status`    | Distribution status           | PENDING, IN_TRANSIT, DELIVERED, CANCELLED                                 |
| `drug_status`            | Drug status                   | ACTIVE, INACTIVE, DISCONTINUED                                            |
| `his_mapping_status`     | HIS mapping status            | MAPPED, UNMAPPED, PENDING                                                 |
| `hpp_type`               | HPP types                     | EXTEMPORANEOUS, REPACK, COMPOUND                                          |
| `inspector_role`         | Receipt inspector roles       | QC, PHARMACIST, WITNESS                                                   |
| `location_type`          | Location types                | WAREHOUSE, PHARMACY, WARD, EMERGENCY, OPERATING, ICU, STORAGE, QUARANTINE |
| `nlem_status`            | NLEM status                   | ED, NED, HERBAL                                                           |
| `payment_method`         | Payment methods               | TRANSFER, CHECK, CASH                                                     |
| `payment_status`         | Payment status                | PENDING, PAID, PARTIAL, CANCELLED                                         |
| `payment_terms`          | Payment terms                 | NET30, NET45, NET60, COD                                                  |
| `po_status`              | PO status                     | DRAFT, PENDING, APPROVED, SENT, PARTIAL, COMPLETED, CANCELLED             |
| `pr_priority`            | PR priority                   | NORMAL, URGENT, EMERGENCY                                                 |
| `pr_status`              | PR status                     | DRAFT, PENDING, APPROVED, REJECTED, CANCELLED                             |
| `product_category`       | Product categories            | DRUG, SUPPLY, CHEMICAL                                                    |
| `receipt_status`         | Receipt status                | PENDING, INSPECTING, ACCEPTED, REJECTED, PARTIAL                          |
| `reservation_status`     | Budget reservation status     | RESERVED, COMMITTED, RELEASED, EXPIRED                                    |
| `return_action_type`     | Return action types           | REPLACE, REFUND, CREDIT, DISPOSE                                          |
| `return_status`          | Return status                 | PENDING, PROCESSING, COMPLETED, CANCELLED                                 |
| `return_type`            | Return types                  | TO_VENDOR, TO_WAREHOUSE, EXPIRED, DAMAGED                                 |
| `tmt_level`              | TMT hierarchy levels          | VTM, GPU, TPU, GP, TP, GPUID, TPUID                                       |
| `tmt_relation_type`      | TMT relationship types        | PARENT, CHILD, EQUIVALENT, REPLACES                                       |
| `transaction_type`       | Inventory transaction types   | RECEIPT, ISSUE, TRANSFER, ADJUSTMENT, RETURN                              |
| `unit_type`              | Unit measurement types        | WEIGHT, VOLUME, QUANTITY, POTENCY                                         |

## Complete View List (12 Views)

| View                           | Purpose                    | Thai Description      |
| ------------------------------ | -------------------------- | --------------------- |
| `v_current_stock_summary`      | Stock by drug and location | สรุปสต็อกปัจจุบัน     |
| `v_drug_lot_details`           | Lot details with expiry    | รายละเอียด Lot ยา     |
| `v_expiring_drugs`             | Drugs expiring soon        | ยาใกล้หมดอายุ         |
| `v_low_stock_items`            | Below minimum stock        | ยาต่ำกว่าระดับขั้นต่ำ |
| `v_drug_movement`              | Movement history           | ประวัติการเคลื่อนไหว  |
| `v_procurement_summary`        | PR/PO status summary       | สรุปการจัดซื้อ        |
| `v_budget_summary`             | Budget utilization         | สรุปการใช้งบประมาณ    |
| `v_hpp_summary`                | HPP drug summary           | สรุปยา HPP            |
| `v_ministry_drug_export`       | Ministry format export     | ส่งออกข้อมูลยา สธ.    |
| `v_ministry_stock_export`      | Ministry stock export      | ส่งออกสต็อก สธ.       |
| `v_distribution_by_department` | Usage by department        | การเบิกจ่ายตามแผนก    |
| `v_tmt_mapping_status`         | TMT mapping progress       | สถานะการ mapping TMT  |

## Complete Function List (9 Functions)

| Function                          | Purpose                   | Thai Description            |
| --------------------------------- | ------------------------- | --------------------------- |
| `update_updated_at()`             | Auto-update timestamps    | อัพเดท updated_at อัตโนมัติ |
| `check_budget_availability()`     | Check budget balance      | ตรวจสอบงบประมาณคงเหลือ      |
| `reserve_budget()`                | Reserve budget for PR     | จองงบประมาณสำหรับ PR        |
| `commit_budget()`                 | Commit reserved budget    | ยืนยันการใช้งบที่จอง        |
| `release_budget()`                | Release reserved budget   | ปล่อยงบที่จองไว้            |
| `get_fifo_lots()`                 | Get lots by FIFO          | ดึง Lot ตามหลัก FIFO        |
| `get_fefo_lots()`                 | Get lots by FEFO          | ดึง Lot ตามหลัก FEFO        |
| `deduct_inventory()`              | Deduct stock              | ตัดสต็อก                    |
| `update_inventory_from_receipt()` | Update stock from receipt | อัพเดทสต็อกจากใบรับ         |

## Key Relationships

### Drug Master Data

```
drug_generics (Generic Names)
    ↓ dosage_form_id
dosage_forms (Tablet, Capsule, etc.)

drugs (Trade Names)
    ↓ generic_id
drug_generics
    ↓ manufacturer_id
companies (Manufacturers)

drug_lots (Lot/Batch Tracking)
    ↓ drug_id
drugs
    ↓ location_id
locations
```

### Procurement Flow

```
purchase_requests (PR)
    ↓ approved
purchase_orders (PO)
    ↓ vendor_id
companies (Vendors)
    ↓ received
receipts (GR)
    ↓ inspected
drug_lots (Stock In)
```

### Inventory Movement

```
inventory (Current Stock)
    ↓ transfer
drug_distributions
    ↓ from/to
locations

inventory
    ↓ issue/return
drug_returns
    ↓ reason
return_reasons
```

## Thai Medical Terminology (TMT) Integration

### TMT Table Structure

```
tmt_concepts (Main TMT data)
├── tmt_id (UUID)
├── tmt_level (VTM, GPU, TPU, GP, TP, GPUID, TPUID)
├── name_th, name_en
├── status (ACTIVE, INACTIVE)
└── parent_tmt_id (hierarchy)

tmt_relationships (Concept links)
├── source_tmt_id
├── target_tmt_id
└── relationship_type

tmt_mappings (Drug-to-TMT mapping)
├── drug_id -> drugs.id
├── tmt_concept_id -> tmt_concepts.id
└── mapping_status (VERIFIED, PENDING)
```

### TMT Hierarchy

```
VTM (Virtual Therapeutic Moiety)
 └── GPU (Generic Product Unspecified)
      └── TPU (Trade Product Unspecified)
           └── GP (Generic Product)
                └── TP (Trade Product)
                     ├── GPUID (GP + Unique ID)
                     └── TPUID (TP + Unique ID)
```

## Ministry Export Compliance

Views formatted for กระทรวงสาธารณสุข reporting:

### v_ministry_drug_export

```sql
SELECT
  hospital_code,        -- รหัสสถานพยาบาล
  drug_code,           -- รหัสยา
  tmt_id,              -- รหัส TMT
  generic_name,        -- ชื่อสามัญทางยา
  trade_name,          -- ชื่อการค้า
  strength,            -- ความแรง
  dosage_form,         -- รูปแบบยา
  package_size,        -- ขนาดบรรจุ
  unit_price,          -- ราคาต่อหน่วย
  nlem_category        -- บัญชียาหลักแห่งชาติ
FROM inventory.v_ministry_drug_export;
```

### v_ministry_stock_export

```sql
SELECT
  hospital_code,       -- รหัสสถานพยาบาล
  report_date,         -- วันที่รายงาน
  drug_code,           -- รหัสยา
  beginning_balance,   -- ยอดยกมา
  received_qty,        -- รับเข้า
  issued_qty,          -- จ่ายออก
  adjusted_qty,        -- ปรับปรุง
  ending_balance       -- คงเหลือ
FROM inventory.v_ministry_stock_export;
```

## Schema Version Tracking

```sql
-- Track schema version for upgrades
CREATE TABLE inventory.system_info (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Current tracked values:
-- schema_version: '1.0.0'
-- last_seeded_at: ISO timestamp
-- installed_at: ISO timestamp
```

## Migration Files (37 files)

```
20251205000001_create_inventory_schema.ts
20251205000002_create_enums.ts
20251205000003_create_locations.ts
20251205000004_create_departments.ts
20251205000005_create_budget_types.ts
20251205000006_create_budget_categories.ts
20251205000007_create_budgets.ts
20251205000008_create_bank.ts
20251205000009_create_companies.ts
20251205000010_create_dosage_forms.ts
20251205000011_create_drug_units.ts
20251205000012_create_drug_generics.ts
20251205000013_create_drugs.ts
20251205000014_create_drug_components.ts
20251205000015_create_drug_focus_lists.ts
20251205000016_create_drug_pack_ratios.ts
20251205000017_create_adjustment_reasons.ts
20251205000018_create_hospitals.ts
20251205000019_create_return_actions.ts
20251205000020_create_purchase_methods.ts
20251205000021_create_purchase_types.ts
20251205000022_create_budget_allocations.ts
20251205000023_create_budget_plans.ts
20251205000024_create_budget_reservations.ts
20251205000025_create_contracts.ts
20251205000026_create_purchase_requests.ts
20251205000027_create_purchase_orders.ts
20251205000028_create_receipts.ts
20251205000029_create_approvals_payments.ts
20251205000030_create_inventory_tables.ts
20251205000031_create_distribution_tables.ts
20251205000032_create_return_tables.ts
20251205000033_create_tmt_tables.ts
20251205000034_create_hpp_tables.ts
20251205000035_create_functions.ts
20251205000036_create_views.ts
20251205000037_create_seed_metadata.ts
```
