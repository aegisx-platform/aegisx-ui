# Core Departments - System Init Integration

> **Bulk import guide for departments via System Init**

**Version:** 1.0.0
**Last Updated:** 2025-12-14
**Integration Type:** Bulk Import / Transactional

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Template Structure](#template-structure)
- [Import Workflow](#import-workflow)
- [Validation Rules](#validation-rules)
- [Code Mapping](#code-mapping)
- [Error Handling](#error-handling)
- [Rollback Operations](#rollback-operations)
- [Advanced Scenarios](#advanced-scenarios)
- [Troubleshooting](#troubleshooting)

---

## Overview

The **Core Departments** module integrates with the System Init bulk import system, allowing you to import hundreds or thousands of departments from CSV or Excel files in a single operation.

### Key Features

- **Batch Processing**: Import all departments in one transaction
- **Validation**: Pre-import validation catches errors before data changes
- **Parent Resolution**: Automatically resolves parent department codes to IDs
- **Transactional Safety**: All-or-nothing import (success or complete rollback)
- **Audit Trail**: Track which import batch created which records
- **Rollback Support**: Undo an import operation completely

### When to Use

- ✅ Initial system setup with organizational structure
- ✅ Migrating from legacy system
- ✅ Annual organizational restructuring
- ✅ Importing regional/branch data
- ✅ Updating large sections of hierarchy

### When NOT to Use

- ❌ Single department creation (use API directly)
- ❌ One-off edits (use UI)
- ❌ Minor hierarchy adjustments (use API)

---

## Quick Start

### 30-Second Overview

1. **Create CSV file** with department data
2. **Go to System Init** in admin dashboard
3. **Upload file** for departments module
4. **Validate** to check for errors
5. **Execute** to import
6. **Verify** departments appear

---

### Minimal Example

#### 1. Prepare CSV File

Save as `departments.csv`:

```csv
code,name,parent_code,is_active
HOSPITAL,Main Hospital,,true
NURSING,Nursing,HOSPITAL,true
ICU,Intensive Care,NURSING,true
MEDICAL,Medical,HOSPITAL,true
```

#### 2. Import via System Init

```bash
# Option A: Via Web UI
1. Go to Admin > System Init
2. Click "Import Data"
3. Select "Departments (แผนก)"
4. Upload departments.csv
5. Click "Validate"
6. Click "Execute"

# Option B: Via API
curl -X POST http://localhost:3000/api/admin/system-init/sessions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@departments.csv" \
  -F "module=departments"
```

#### 3. Verify

```bash
curl -X GET http://localhost:3000/api/departments \
  -H "Authorization: Bearer TOKEN"
```

Result: 4 new departments created with correct hierarchy.

---

## Template Structure

### CSV/Excel Format

System Init uses standardized format for all modules.

#### Required Columns

| Column | Type   | Required | Description                          | Example               |
| ------ | ------ | -------- | ------------------------------------ | --------------------- |
| `code` | String | **Yes**  | Department code (unique, 1-10 chars) | `ICU-01`              |
| `name` | String | **Yes**  | Department name (1-100 chars)        | `Intensive Care Unit` |

#### Optional Columns

| Column        | Type    | Required | Description                   | Example           |
| ------------- | ------- | -------- | ----------------------------- | ----------------- |
| `parent_code` | String  | No       | Parent department code        | `NURSING`         |
| `is_active`   | Boolean | No       | Active status (default: true) | `true` or `false` |

### CSV Examples

#### Minimal Format

```csv
code,name
HOSPITAL,Main Hospital
NURSING,Nursing Department
MEDICAL,Medical Department
```

#### With Parent Codes

```csv
code,name,parent_code
HOSPITAL,Main Hospital,
NURSING,Nursing Department,HOSPITAL
ICU,Intensive Care,NURSING
MEDICAL,Medical Department,HOSPITAL
CARDIOLOGY,Cardiology,MEDICAL
```

#### Complete Format

```csv
code,name,parent_code,is_active
HOSPITAL,Main Hospital,,true
NURSING,Nursing Department,HOSPITAL,true
ICU,Intensive Care Unit,NURSING,true
MEDICAL,Medical Department,HOSPITAL,true
CARDIOLOGY,Cardiology,MEDICAL,true
```

### Excel Format

Same columns as CSV, but in Excel spreadsheet:

1. Column A: `code`
2. Column B: `name`
3. Column C: `parent_code`
4. Column D: `is_active`

Data starts from row 2 (row 1 is headers).

---

### Data Type Rules

| Column        | Type    | Format          | Rules                                   |
| ------------- | ------- | --------------- | --------------------------------------- |
| `code`        | String  | Text            | A-Z, 0-9, -, \_ only; must be unique    |
| `name`        | String  | Text            | Any characters; max 100                 |
| `parent_code` | String  | Text            | Reference to existing code              |
| `is_active`   | Boolean | Text or Boolean | `true`/`false` or `yes`/`no` or `1`/`0` |

---

## Import Workflow

### Overview Diagram

```
                        ┌──────────────┐
                        │  Start       │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │ 1. Create CSV│
                        └──────┬───────┘
                               │
                        ┌──────▼────────┐
                        │ 2. Upload to  │
                        │    System Init│
                        └──────┬────────┘
                               │
                        ┌──────▼────────┐     Has Errors?
                        │ 3. Validate   ├─────────► Fix & Retry
                        └──────┬────────┘
                               │
                        ┌──────▼────────┐
                        │ 4. Execute    │
                        │ (Transaction) │
                        └──────┬────────┘
                               │
                     ┌─────────┴──────────┐
                     │                    │
            Success  │                    │  Failure
                     │                    │
            ┌────────▼─────┐   ┌────────▼──────┐
            │ 5. Verify    │   │ Automatic     │
            │ Import Done  │   │ Rollback      │
            └──────────────┘   └───────────────┘
```

### Step-by-Step Process

#### Step 1: Prepare Data

**Time**: 15-60 minutes

1. **Gather Information**
   - Collect all department codes and names
   - Map parent-child relationships
   - Verify codes are unique

2. **Create CSV File**
   - Use spreadsheet software (Excel, Google Sheets)
   - Create columns: code, name, parent_code, is_active
   - Enter department data
   - Save as CSV (UTF-8 encoding)

3. **Review Data**
   - Check for duplicates
   - Verify parent codes exist
   - Ensure codes are properly formatted

#### Step 2: Upload File

**Time**: 2-5 minutes

##### Via Web UI

1. Log in to Admin Dashboard
2. Go to **Core Systems > System Init**
3. Click **Import Data** button
4. Select **Departments** from module dropdown
5. Click **Choose File**
6. Select your CSV/Excel file
7. Click **Upload**
8. System creates import session
9. Note the Session ID for tracking

##### Via API

```bash
curl -X POST http://localhost:3000/api/admin/system-init/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@departments.csv" \
  -F "module=departments" \
  -F "domain=core"
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_20251214_abc123",
    "module": "departments",
    "domain": "core",
    "status": "created",
    "rowCount": 25,
    "createdAt": "2025-12-14T10:30:00Z"
  }
}
```

#### Step 3: Validate

**Time**: 1-5 minutes

Validation checks for errors WITHOUT modifying data.

##### Via Web UI

1. Click **Validate** button
2. System processes all rows
3. Shows validation results:
   - ✅ Total rows
   - ❌ Errors (if any)
   - ⚠️ Warnings (if any)

##### Via API

```bash
curl -X POST http://localhost:3000/api/admin/system-init/sessions/sess_20251214_abc123/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_20251214_abc123",
    "status": "validated",
    "rowCount": 25,
    "validRows": 25,
    "invalidRows": 0,
    "errors": [],
    "warnings": [],
    "canExecute": true
  }
}
```

#### Review Validation Results

**If All Valid** ✅

```
✅ All 25 rows validated successfully
❌ Errors: 0
⚠️ Warnings: 0

Status: Ready to import
```

→ Continue to Step 4: Execute

**If Errors Found** ❌

```
✅ Rows processed: 25
❌ Errors: 3
⚠️ Warnings: 2

Error Details:
- Row 5, Code: DUPLICATE_CODE (code already exists)
- Row 12, Name: INVALID_FORMAT (invalid characters)
- Row 18, Parent: INVALID_REFERENCE (parent not found)

Action: Fix these rows and retry validation
```

→ Fix errors in CSV, upload again

---

#### Step 4: Execute Import

**Time**: 2-10 minutes (depending on volume)

Import executes in a database transaction:

- All rows imported together
- If any error occurs, entire import rolled back
- Either all succeed or all fail (no partial imports)

##### Via Web UI

1. After validation succeeds, click **Execute** button
2. Confirm: "Import 25 departments?"
3. Click **Confirm**
4. System processes import in real-time
5. See progress bar
6. Success message shows import completed

##### Via API

```bash
curl -X POST http://localhost:3000/api/admin/system-init/sessions/sess_20251214_abc123/execute \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_20251214_abc123",
    "status": "completed",
    "rowCount": 25,
    "importedRows": 25,
    "skippedRows": 0,
    "errors": [],
    "batchId": "imp_20251214_xyz789",
    "completedAt": "2025-12-14T10:35:00Z"
  }
}
```

#### Step 5: Verify Results

**Time**: 5-10 minutes

Verify the import created the expected departments.

##### Check in Admin UI

1. Go to **Core Systems > Departments**
2. Search for newly imported departments
3. Check hierarchy tree
4. Verify counts and names

##### Check via API

```bash
# Get all departments
curl -X GET http://localhost:3000/api/departments?limit=100 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check hierarchy
curl -X GET http://localhost:3000/api/departments/hierarchy \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get statistics
curl -X GET http://localhost:3000/api/departments/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

##### Verify Criteria

- ✅ Count matches import row count
- ✅ All codes are present
- ✅ All names match
- ✅ Hierarchy is correct (parent-child relationships)
- ✅ Active status correct

---

## Validation Rules

### Pre-Import Validation

System Init validates all data BEFORE importing. It checks:

#### 1. Required Fields

| Field  | Rule              | Error            |
| ------ | ----------------- | ---------------- |
| `code` | Must not be empty | `REQUIRED_FIELD` |
| `name` | Must not be empty | `REQUIRED_FIELD` |

**Error Example:**

```json
{
  "row": 5,
  "field": "code",
  "severity": "ERROR",
  "code": "REQUIRED_FIELD",
  "message": "Department code is required"
}
```

#### 2. Format Validation

| Field  | Format            | Valid Examples            | Invalid Examples          |
| ------ | ----------------- | ------------------------- | ------------------------- |
| `code` | A-Z 0-9 - \_      | `ICU`, `ICU-01`, `ICU_01` | `ICU #1`, `icu`, `ICU.01` |
| `name` | Any text, max 100 | `Intensive Care`, `อ.ภาค` | (text > 100 chars)        |

**Error Example:**

```json
{
  "row": 8,
  "field": "code",
  "severity": "ERROR",
  "code": "INVALID_FORMAT",
  "message": "Code must contain only uppercase letters, numbers, hyphens, and underscores"
}
```

#### 3. Uniqueness Validation

| Field         | Check                                 | Action              |
| ------------- | ------------------------------------- | ------------------- |
| `code`        | Must be unique across all departments | Reject if exists    |
| `parent_code` | Must exist in database OR file        | Reject if not found |

**Error Example:**

```json
{
  "row": 12,
  "field": "code",
  "severity": "ERROR",
  "code": "DUPLICATE_CODE",
  "message": "Department code 'NURSING' already exists in database"
}
```

#### 4. Relationship Validation

| Check              | Rule                                       | Error                       |
| ------------------ | ------------------------------------------ | --------------------------- |
| Parent exists      | parent_code must point to valid department | `INVALID_REFERENCE`         |
| Circular hierarchy | parent cannot be self or descendant        | Caught at execution         |
| Parent active      | Can assign inactive parent                 | Allowed (will show warning) |

**Error Example:**

```json
{
  "row": 15,
  "field": "parent_code",
  "severity": "ERROR",
  "code": "INVALID_REFERENCE",
  "message": "Parent department with code 'UNKNOWN' does not exist"
}
```

#### 5. Type Validation

| Field       | Expected Type | Valid Formats              | Error            |
| ----------- | ------------- | -------------------------- | ---------------- |
| `is_active` | Boolean       | true, false, yes, no, 1, 0 | `INVALID_FORMAT` |

**Error Example:**

```json
{
  "row": 20,
  "field": "is_active",
  "severity": "ERROR",
  "code": "INVALID_FORMAT",
  "message": "Is Active must be true, false, yes, no, 1, or 0"
}
```

---

### Validation Errors vs Warnings

#### Errors (Import Blocked)

Cannot import if errors exist. Must fix and retry.

```
❌ Row 5: Code is required
❌ Row 12: Code 'NURSING' already exists
❌ Row 15: Parent 'UNKNOWN' not found
```

#### Warnings (Import Allowed)

Can import with warnings, but review carefully.

```
⚠️ Row 8: Assigning parent that is inactive
⚠️ Row 10: Code contains underscores (unusual)
```

---

## Code Mapping

### Parent Code Resolution

When importing departments with `parent_code`, the system:

1. Looks up parent code in database
2. Gets parent department ID
3. Uses ID in child's `parent_id` field
4. Creates the relationship

### Example

**Import File:**

```csv
code,name,parent_code
ICU-01,ICU Ward 1,ICU-NURSING
ICU-NURSING,ICU Nursing,NURSING
NURSING,Nursing Department,HOSPITAL
HOSPITAL,Main Hospital,
```

**Resolution Process:**

```
Row 1: ICU-01 → parent_code = ICU-NURSING
       → Lookup ICU-NURSING in DB
       → Gets ID = 2
       → Set parent_id = 2

Row 2: ICU-NURSING → parent_code = NURSING
       → Lookup NURSING in DB
       → Gets ID = 3
       → Set parent_id = 3

Row 3: NURSING → parent_code = HOSPITAL
       → Lookup HOSPITAL in DB
       → Gets ID = 1
       → Set parent_id = 1

Row 4: HOSPITAL → parent_code = (empty)
       → No parent
       → Set parent_id = NULL
```

**Result in Database:**

```sql
id | code        | name              | parent_id
1  | HOSPITAL    | Main Hospital     | NULL
2  | ICU-NURSING | ICU Nursing       | 1
3  | NURSING     | Nursing Dept      | 1
4  | ICU-01      | ICU Ward 1        | 2
```

---

### Code vs ID

**Important Distinction:**

| Field         | Purpose                   | Format              | Example       |
| ------------- | ------------------------- | ------------------- | ------------- |
| `code`        | Human-readable identifier | Text (A-Z 0-9 - \_) | `ICU-01`      |
| `id`          | Database identifier       | Integer             | `5`           |
| `parent_code` | Import reference          | Text                | `ICU-NURSING` |
| `parent_id`   | Database reference        | Integer             | `2`           |

**In Import Files:**

- Always use `code` and `parent_code` (text)
- Never use IDs (they might change)

**In API:**

- Both accepted for parent_id
- Use IDs when integrating with other systems

---

## Error Handling

### Common Errors & Solutions

#### Error: DUPLICATE_CODE

**Message:** `Department code 'NURSING' already exists in database`

**Cause:** Code in import file already in use

**Solutions:**

1. Use different code in import file
2. Delete existing department (if allowed)
3. Skip that row (manual post-import)

**Example Fix:**

```csv
# Before
code,name,parent_code
NURSING,Nursing Department,HOSPITAL

# After
code,name,parent_code
NURSING-WEST,Nursing Department West,HOSPITAL
```

---

#### Error: INVALID_REFERENCE

**Message:** `Parent department with code 'UNKNOWN' does not exist`

**Cause:** parent_code references non-existent department

**Solutions:**

1. Verify parent code spelling
2. Create parent department first
3. Leave parent_code empty for root departments

**Example:**

```csv
# Before (NURSING doesn't exist)
code,name,parent_code
ICU,Intensive Care,NURSING

# After (create NURSING first)
code,name,parent_code
NURSING,Nursing Department,HOSPITAL
ICU,Intensive Care,NURSING
```

---

#### Error: INVALID_FORMAT

**Message:** `Code must contain only uppercase letters, numbers, hyphens, and underscores`

**Cause:** Code contains invalid characters

**Valid Characters:**

- Uppercase: A-Z
- Numbers: 0-9
- Hyphen: -
- Underscore: \_

**Invalid Characters:**

- Spaces
- Lowercase letters
- Special characters: ! @ # $ % & \* ( ) etc.

**Example Fix:**

```csv
# Before (invalid)
code,name
ICU #1,ICU Ward 1
nursing,Nursing Dept
ICU (East),ICU East Wing

# After (valid)
code,name
ICU-01,ICU Ward 1
NURSING,Nursing Dept
ICU-EAST,ICU East Wing
```

---

#### Error: REQUIRED_FIELD

**Message:** `Department code is required`

**Cause:** Required column is empty

**Solutions:**

1. Add value to empty cells
2. Delete empty rows
3. Ensure all rows have code and name

**Example:**

```csv
# Before (row 3 has empty code)
code,name,parent_code
HOSPITAL,Main Hospital,
NURSING,Nursing Department,HOSPITAL
,Unnamed Dept,HOSPITAL

# After
code,name,parent_code
HOSPITAL,Main Hospital,
NURSING,Nursing Department,HOSPITAL
UNNAMED,Unnamed Dept,HOSPITAL
```

---

### Error Recovery Workflow

```
Upload File
    ↓
Validate
    ↓
Has Errors? ──Yes──→ Review Errors
    ↓                      ↓
   No           Fix CSV File
    ↓                      ↓
Execute      Re-upload & Validate
    ↓                      ↓
Success          Has Errors? ──Yes──→ Repeat
    ↓                  ↓
Verify            No
                   ↓
              Execute
```

---

## Rollback Operations

### When to Rollback

**Reasons to rollback an import:**

- ❌ Wrong departments imported
- ❌ Incorrect hierarchy
- ❌ Data quality issues discovered
- ❌ Need to re-import with corrections

**Safe to rollback:**

- ✅ Import just completed
- ✅ Only affected departments
- ✅ No user assignments yet
- ✅ Clean up with no dependencies

---

### How to Rollback

#### Via Web UI

1. Go to **Core Systems > System Init**
2. Find import session in history
3. Click **Rollback** button
4. Confirm: "Undo this import?"
5. Click **Confirm Rollback**
6. All imported departments deleted

#### Via API

```bash
curl -X POST http://localhost:3000/api/admin/system-init/sessions/sess_20251214_abc123/rollback \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_20251214_abc123",
    "status": "rolled_back",
    "deletedCount": 25,
    "rolledBackAt": "2025-12-14T11:00:00Z"
  }
}
```

---

### Rollback Scope

Rollback deletes ONLY departments created by that specific import:

**What Gets Deleted:**

- ✅ All departments with matching `import_batch_id`
- ✅ Only those created in that import session

**What Stays:**

- ✅ Departments from other imports
- ✅ Manually created departments
- ✅ Departments from other modules

**Example:**

```
Import Session A created: NURSING, ICU-NURSING, WARD-NURSING
Import Session B created: MEDICAL, CARDIOLOGY
Manual create: EMERGENCY

Rollback Session A:
- Deletes: NURSING, ICU-NURSING, WARD-NURSING
- Keeps: MEDICAL, CARDIOLOGY, EMERGENCY
```

---

### Limitations

**Cannot Rollback If:**

- ❌ Users assigned to imported departments
- ❌ Budget allocated to imported departments
- ❌ Other foreign key references exist
- ❌ More than 30 days have passed

In these cases:

1. Reassign users/budgets manually
2. Delete departments using API
3. Or contact system administrator

---

## Advanced Scenarios

### Scenario 1: Hierarchical Import

**Goal:** Import complex 5-level hierarchy in single file

**File:** `org_structure.csv`

```csv
code,name,parent_code,is_active
ORG,Organization,,true
REGION-N,North Region,ORG,true
REGION-S,South Region,ORG,true
HOSPITAL-N1,North Hospital 1,REGION-N,true
HOSPITAL-N2,North Hospital 2,REGION-N,true
NURSING-N1,Nursing - N1,HOSPITAL-N1,true
ICU-N1,ICU - N1,NURSING-N1,true
ICU-DAY-N1,ICU Day Shift,ICU-N1,true
```

**Process:**

1. Save file with all 8 departments
2. Upload to System Init
3. Validate (checks parent codes exist)
4. Execute (creates entire hierarchy)
5. Result: All 8 departments with correct relationships

---

### Scenario 2: Incremental Updates

**Goal:** Add departments to existing hierarchy

**Existing Structure:**

```
HOSPITAL (id=1)
  └─ NURSING (id=2)
  └─ MEDICAL (id=3)
```

**New Import File:** `additional_depts.csv`

```csv
code,name,parent_code,is_active
ICU-NURSING,ICU Nursing,NURSING,true
CARDIOLOGY,Cardiology,MEDICAL,true
NEUROLOGY,Neurology,MEDICAL,true
```

**Process:**

1. Parent codes reference existing departments
2. Validation finds NURSING and MEDICAL in database
3. Links new departments to parents
4. Result: 3 new departments added to hierarchy

---

### Scenario 3: Deactivating via Import

**Goal:** Import departments and mark some inactive

**File:** `departments_with_status.csv`

```csv
code,name,parent_code,is_active
ACTIVE-01,Active Department,HOSPITAL,true
ACTIVE-02,Another Active,HOSPITAL,true
INACTIVE-01,Closed Department,HOSPITAL,false
INACTIVE-02,Old Division,HOSPITAL,false
```

**Process:**

1. All 4 imported
2. 2 with is_active=true (appear in dropdowns)
3. 2 with is_active=false (hidden from UI)
4. Can reactivate later

---

### Scenario 4: Code Standardization

**Goal:** Import departments with specific code format

**Code Pattern:** `DEPT-REGION-NUMBER`

**File:** `standard_codes.csv`

```csv
code,name,parent_code
HOSPITAL-MAIN,Main Hospital,
HOSPITAL-MAIN-NURSING,Nursing,HOSPITAL-MAIN
HOSPITAL-MAIN-ICU-01,ICU Ward 1,HOSPITAL-MAIN-NURSING
HOSPITAL-MAIN-ICU-02,ICU Ward 2,HOSPITAL-MAIN-NURSING
HOSPITAL-SOUTH,South Hospital,
HOSPITAL-SOUTH-NURSING,Nursing,HOSPITAL-SOUTH
```

**Benefits:**

- Consistent code format
- Easy to parse code for analytics
- Hierarchical meaning in code itself

---

### Scenario 5: Migration from Legacy System

**Goal:** Migrate 500+ departments from old system

**Process:**

1. **Extract Data**
   - Export from legacy system
   - Map to import columns
   - Clean and standardize

2. **Create File**
   - 500+ rows of department data
   - All codes must be unique
   - All parents must exist in file or database

3. **Split Large Files** (if needed)

   ```
   departments_1_to_100.csv  (100 rows)
   departments_101_to_200.csv (100 rows)
   departments_201_to_300.csv (100 rows)
   ... etc
   ```

4. **Import in Order**
   - Import by parent relationships
   - Root departments first
   - Then children
   - Prevents "parent not found" errors

5. **Validate Each**
   - Validate before each execute
   - Fix errors
   - Retry until success

6. **Verify All**
   - After all imports, check total count
   - Verify hierarchy
   - Check for orphaned departments

---

## Troubleshooting

### Problem: Upload Fails

**Symptom:** File won't upload, shows error immediately

**Solutions:**

1. **Check file format**

   ```
   ✅ Accepted: .csv, .xlsx, .xls
   ❌ Not accepted: .txt, .json, .xml
   ```

2. **Check file size**

   ```
   Max: 10 MB per file
   If larger: Split into multiple files
   ```

3. **Check file encoding**

   ```
   Preferred: UTF-8
   Acceptable: ISO-8859-1
   ```

4. **Check column headers**
   ```
   Required in first row:
   code, name, parent_code (optional), is_active (optional)
   ```

---

### Problem: Validation Hangs

**Symptom:** Validation runs but never completes

**Cause:** Very large file (10,000+ rows) processing

**Solutions:**

1. **Wait longer**
   - Large files take 2-5 minutes
   - Don't close browser
   - Check browser console for errors

2. **Split file**

   ```
   file_all.csv (15,000 rows)
                    ↓
   file_part1.csv (5,000 rows) ✓
   file_part2.csv (5,000 rows) ✓
   file_part3.csv (5,000 rows) ✓
   ```

3. **Check server logs**
   - If validation still hangs
   - Contact system admin
   - Check server resources

---

### Problem: Execution Fails After Validation Passes

**Symptom:** Validation successful, but import fails during execute

**Cause:** Rare condition that only shows during actual database write

**Solutions:**

1. **Rollback** (automatic if transaction fails)
   - Entire import rolled back
   - No partial data

2. **Check error details**
   - System shows specific error
   - Usually validation error not caught
   - Verify data again

3. **Retry** with fixes
   - Fix the specific issue
   - Re-upload
   - Validate and execute again

---

### Problem: Cannot Find Import Session

**Symptom:** Import completed but can't find session history

**Solutions:**

1. **Check filters**
   - Filter by date range
   - Filter by status
   - Clear filters and search

2. **Session persistence**
   - Sessions kept for 30 days
   - Old sessions deleted
   - Check completion date

3. **Check module**
   - Ensure "Departments" module selected
   - Not filtering wrong module

---

### Problem: Rollback Not Working

**Symptom:** Rollback button disabled or fails

**Cause:** Dependencies prevent rollback

**Solutions:**

1. **Remove dependencies**
   - If users assigned: Reassign to other departments
   - If budgets allocated: Move budgets
   - If other references: Review what's blocking

2. **Manual deletion**
   - Use API DELETE endpoint
   - Delete departments manually
   - One by one if needed

3. **Contact admin**
   - If persistent issues
   - Request force-delete permissions
   - Or technical support

---

### Problem: Parent Code Not Found

**Symptom:** Error "Parent department with code 'X' does not exist"

**Solutions:**

1. **Verify parent code exists**

   ```bash
   # Check department list
   curl -X GET http://localhost:3000/api/departments \
     -H "Authorization: Bearer TOKEN"
   # Look for parent code in list
   ```

2. **Check spelling**
   - "NURSING" ≠ "Nursing" (case sensitive)
   - "ICU-01" ≠ "ICU 01" (hyphens vs spaces)

3. **Create parent first**
   - If parent doesn't exist
   - Create it before importing children
   - Or add to same import file before children

4. **Update CSV**

   ```csv
   # Before (parent doesn't exist)
   code,name,parent_code
   ICU,Intensive Care,NURSING

   # After (parent created first)
   code,name,parent_code
   NURSING,Nursing Department,HOSPITAL
   ICU,Intensive Care,NURSING
   ```

---

## Integration with Other Systems

### After Import: Next Steps

**Post-Import Tasks:**

1. **Assign Users**

   ```
   Go to User Management
   Assign users to imported departments
   ```

2. **Allocate Budgets**

   ```
   Go to Budget Management
   Allocate budgets to departments
   ```

3. **Create Shifts**

   ```
   Go to Scheduling
   Create department-specific shifts
   ```

4. **Set Permissions**

   ```
   Go to RBAC
   Assign department-based permissions
   ```

5. **Configure Reports**
   ```
   Go to Reporting
   Set default departments for reports
   ```

---

## API Reference

### Create Session

```bash
POST /api/admin/system-init/sessions
Content-Type: multipart/form-data

Parameters:
- file: CSV/Excel file
- module: "departments"
- domain: "core"
```

### Validate Session

```bash
POST /api/admin/system-init/sessions/{sessionId}/validate
```

### Execute Import

```bash
POST /api/admin/system-init/sessions/{sessionId}/execute
```

### Rollback Import

```bash
POST /api/admin/system-init/sessions/{sessionId}/rollback
```

### Get Session Details

```bash
GET /api/admin/system-init/sessions/{sessionId}
```

### List Sessions

```bash
GET /api/admin/system-init/sessions?module=departments&limit=20
```

---

## Best Practices

### Before Importing

1. ✅ **Validate data in spreadsheet**
   - Check for duplicates
   - Verify formats
   - Test formulas

2. ✅ **Plan hierarchy carefully**
   - Draw org chart
   - Identify all levels
   - Check for circular references

3. ✅ **Backup existing data**
   - Export current departments
   - Store backup file
   - Document changes

4. ✅ **Test with sample**
   - Import 10-20 rows first
   - Verify results
   - Then import full dataset

### During Importing

1. ✅ **Follow workflow**
   - Upload → Validate → Fix → Execute
   - Don't skip validation

2. ✅ **Monitor progress**
   - Watch for errors
   - Note error details
   - Fix immediately

3. ✅ **Keep session info**
   - Document session ID
   - Note batch ID after success
   - Save for audit trail

### After Importing

1. ✅ **Verify completely**
   - Check hierarchy structure
   - Count departments
   - Random spot checks

2. ✅ **Document results**
   - Note what was imported
   - List any issues
   - Record date and time

3. ✅ **Communicate changes**
   - Notify users of new structure
   - Update documentation
   - Train staff on changes

---

For API details, see [API_REFERENCE.md](./API_REFERENCE.md).
