# Frontend Development Checklist

**App**: `apps/web`
**Total Pages**: ~40 pages across 8 systems

---

## Quick Status

| System       | Pages   | Done   | %        | Notes                                            |
| ------------ | ------- | ------ | -------- | ------------------------------------------------ |
| Setup        | 3       | 0      | 0%       |                                                  |
| Master Data  | 16      | 16     | **100%** | ✅ All 16 modules generated (full+import+export) |
| Budget       | 5       | 0      | 0%       |                                                  |
| Procurement  | 10      | 0      | 0%       |                                                  |
| Inventory    | 6       | 0      | 0%       |                                                  |
| Distribution | 3       | 0      | 0%       |                                                  |
| Return       | 3       | 0      | 0%       |                                                  |
| Reports      | 4       | 0      | 0%       |                                                  |
| **Total**    | **~44** | **16** | **36%**  | ✅ Master Data CRUD complete - all 16 modules    |

---

## Setup & Structure

- [ ] Create `inventory/` module folder
- [ ] Create `inventory.routes.ts`
- [ ] Create `inventory-shell.component.ts`
- [ ] Add to app routes

---

## Shared Components (Priority 1)

| Component          | Description           | Status |
| ------------------ | --------------------- | ------ |
| DrugSelector       | Search & select drugs | [ ]    |
| LocationSelector   | Select location       | [ ]    |
| DepartmentSelector | Select department     | [ ]    |
| CompanySelector    | Search vendors        | [ ]    |
| LotSelector        | Select drug lot       | [ ]    |
| StatusBadge        | Display status        | [ ]    |
| ApprovalFlow       | Workflow steps        | [ ]    |

---

## Master Data Pages - Generation Status (2025-12-08)

**All 16 master-data modules generated with `--package full --with-import --with-export`** ✅

### Locations ✅ GENERATED

- [x] `location-list.component.ts` - ✅ Auto-generated
- [x] `location-form.component.ts` - ✅ Auto-generated
- [x] `location-import.dialog.ts` - ✅ Auto-generated
- [x] `location.service.ts` - ✅ Auto-generated with export methods

### Departments ✅ GENERATED

- [x] `department-list.component.ts` - ✅ Auto-generated
- [x] `department-form.component.ts` - ✅ Auto-generated
- [x] `department-import.dialog.ts` - ✅ Auto-generated
- [x] `department.service.ts` - ✅ Auto-generated

### Companies ✅ GENERATED

- [x] `company-list.component.ts` - ✅ Auto-generated
- [x] `company-form.component.ts` - ✅ Auto-generated
- [x] `company-import.dialog.ts` - ✅ Auto-generated
- [x] `company.service.ts` - ✅ Auto-generated

### Drugs ✅ GENERATED

- [x] `drug-list.component.ts` - ✅ Auto-generated
- [x] `drug-form.component.ts` - ✅ Auto-generated
- [x] `drug-import.dialog.ts` - ✅ Auto-generated
- [x] `drug.service.ts` - ✅ Auto-generated with export methods
- [x] `drug-view.dialog.ts` - ✅ Auto-generated

### Hospitals ✅ GENERATED

- [x] `hospital-list.component.ts` - ✅ Auto-generated
- [x] `hospital-form.component.ts` - ✅ Auto-generated
- [x] `hospital-import.dialog.ts` - ✅ Auto-generated
- [x] `hospital.service.ts` - ✅ Auto-generated

### Drug Generics ✅ GENERATED

- [x] `generic-list.component.ts` - ✅ Auto-generated
- [x] `generic-form.component.ts` - ✅ Auto-generated
- [x] `drug-generics.service.ts` - ✅ Auto-generated with export methods

### Budget Tables ✅ GENERATED

- [x] Budget Types - ✅ Auto-generated
- [x] Budget Categories - ✅ Auto-generated
- [x] Budgets - ✅ Auto-generated with export methods

### Drug Detail Tables ✅ GENERATED

- [x] Drug Components - ✅ Auto-generated
- [x] Drug Focus Lists - ✅ Auto-generated
- [x] Drug Pack Ratios - ✅ Auto-generated

### Lookup Tables ✅ GENERATED

- [x] Dosage Forms - ✅ Auto-generated
- [x] Drug Units - ✅ Auto-generated
- [x] Adjustment Reasons - ✅ Auto-generated
- [x] Return Actions - ✅ Auto-generated
- [x] Bank - ✅ Auto-generated with export methods

---

## Budget Pages

### Allocations

- [ ] `allocation-list.component.ts`
- [ ] `allocation-form.component.ts`
- [ ] `allocation-quarterly.component.ts`

### Budget Plans

- [ ] `plan-list.component.ts`
- [ ] `plan-form.component.ts`
- [ ] `plan-items.component.ts`
- [ ] `plan-approval.component.ts`

### Dashboard

- [ ] `budget-dashboard.component.ts`

---

## Procurement Pages

### Contracts

- [ ] `contract-list.component.ts`
- [ ] `contract-form.component.ts`
- [ ] `contract-items.component.ts`

### Purchase Requests

- [ ] `pr-list.component.ts`
- [ ] `pr-form.component.ts`
- [ ] `pr-items.component.ts`
- [ ] `pr-approval.component.ts`

### Purchase Orders

- [ ] `po-list.component.ts`
- [ ] `po-form.component.ts`
- [ ] `po-from-pr.component.ts` (convert wizard)
- [ ] `po-items.component.ts`

### Receipts

- [ ] `receipt-list.component.ts`
- [ ] `receipt-form.component.ts`
- [ ] `receipt-items.component.ts`
- [ ] `receipt-verify.component.ts`
- [ ] `receipt-inspectors.component.ts`

---

## Inventory Pages

### Stock Management

- [ ] `stock-list.component.ts`
- [ ] `stock-card.component.ts`
- [ ] `stock-adjust.component.ts`

### Drug Lots

- [ ] `lot-list.component.ts`
- [ ] `lot-expiry.component.ts`

### Dashboard

- [ ] `stock-dashboard.component.ts`

---

## Distribution Pages

- [ ] `dist-list.component.ts`
- [ ] `dist-form.component.ts`
- [ ] `dist-dispense.component.ts`
- [ ] `dist-items.component.ts`

---

## Return Pages

- [ ] `return-list.component.ts`
- [ ] `return-form.component.ts`
- [ ] `return-verify.component.ts`
- [ ] `return-items.component.ts`

---

## Report Pages

- [ ] `ministry-reports.component.ts`
- [ ] `stock-reports.component.ts`
- [ ] `analytics-dashboard.component.ts`
- [ ] `expiry-report.component.ts`

---

## Navigation

- [ ] Create sidebar navigation config
- [ ] Create breadcrumb config
- [ ] Integrate with shell app

---

## Services

| Service                | Purpose            | Status |
| ---------------------- | ------------------ | ------ |
| LocationService        | Location CRUD      | [ ]    |
| DepartmentService      | Department CRUD    | [ ]    |
| CompanyService         | Company CRUD       | [ ]    |
| DrugService            | Drug CRUD          | [ ]    |
| DrugGenericService     | Generic CRUD       | [ ]    |
| BudgetService          | Budget operations  | [ ]    |
| PurchaseRequestService | PR operations      | [ ]    |
| PurchaseOrderService   | PO operations      | [ ]    |
| ReceiptService         | Receipt operations | [ ]    |
| InventoryService       | Stock operations   | [ ]    |
| DistributionService    | Distribution ops   | [ ]    |
| ReturnService          | Return operations  | [ ]    |
| TmtService             | TMT integration    | [ ]    |

---

_Updated: 2025-12-08_

## Completion Summary

✅ **Master Data Phase Complete!**

All 16 master-data frontend modules have been successfully generated and verified:

- **drugs**, **locations**, **hospitals**, **companies**, **departments**, **bank** (6 initial modules)
- **drug_generics**, **budget_types**, **budget_categories** (3 budget-related)
- **drug_components**, **drug_focus_lists**, **drug_pack_ratios** (3 drug detail tables)
- **dosage_forms**, **drug_units**, **adjustment_reasons**, **return_actions** (4 lookup tables)

Each module includes:

- Full CRUD operations (Create, Read, Update, Delete)
- Advanced filtering and search
- Bulk delete operations
- Excel/CSV import functionality
- Data export capabilities
- Sorting and pagination
- Error handling and validation

Build Status: ✅ All modules compile successfully (0 TypeScript errors)
