# Core Departments - User Guide

> **Step-by-step guide for managing departments in AegisX**

**Version:** 1.0.0
**Last Updated:** 2025-12-14
**Audience:** End Users, Administrators

---

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Common Tasks](#common-tasks)
- [Department Hierarchy](#department-hierarchy)
- [Advanced Features](#advanced-features)
- [Tips & Best Practices](#tips--best-practices)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is the Departments Feature?

The Core Departments feature allows you to organize your institution's structure hierarchically. You can create departments at any level of nesting to match your organizational needs:

```
Organization
  ├── Hospital
  │   ├── Nursing Department
  │   │   ├── ICU Nursing
  │   │   │   ├── ICU Day Shift
  │   │   │   └── ICU Night Shift
  │   │   └── Ward Nursing
  │   └── Medical Department
  │       ├── Cardiology
  │       ├── Neurology
  │       └── Orthopedics
  └── Clinic
      ├── General Practice
      └── Dental
```

### Key Concepts

**Department**: An organizational unit with a unique code and name

**Parent-Child Relationship**: Departments can have parent departments (except root departments)

**Active Status**: Mark departments as active or inactive without deleting them

**Hierarchy Levels**: Create unlimited nesting levels for complex structures

---

## Prerequisites

### Permissions Required

To work with departments, you need at least one of these permissions:

- **View Departments** (`departments:read`) - Required to see departments
- **Create Departments** (`departments:create`) - Required to add new departments
- **Edit Departments** (`departments:update`) - Required to modify departments
- **Delete Departments** (`departments:delete`) - Required to remove departments

### How to Check Your Permissions

1. Log in to AegisX Admin Dashboard
2. Go to **Settings > User Management**
3. Select your user account
4. Check **Permissions** tab for department-related permissions

If you don't have the required permission:

1. Contact your system administrator
2. Request the specific permission
3. Wait for approval and relogin

---

## Common Tasks

### Task 1: View Department List

#### Step by Step

1. **Open Admin Dashboard**
   - Navigate to Core Systems > Departments

2. **View the List**
   - You'll see all departments in a table with columns:
     - Code: Unique identifier (e.g., "NURSING")
     - Name: Display name (e.g., "Nursing Department")
     - Parent: Parent department (if any)
     - Status: Active/Inactive
     - Created: Creation date

3. **Search Departments**
   - Use the search box at the top
   - Type department name or code
   - Results appear in real-time

4. **Filter Results**
   - Click **Filters** button
   - Select:
     - Status: Active, Inactive, or All
     - Parent Department: Choose from dropdown
   - Click **Apply**

5. **Sort List**
   - Click column headers to sort
   - Click again to reverse sort direction
   - Available sorts: Code, Name, Status, Created Date

#### Example

To find all active nursing departments:

1. Search: "nursing"
2. Filter: Status = Active
3. Click **Apply**

---

### Task 2: Create a New Department

#### Simple Department (Root Level)

1. **Click Create Button**
   - Go to Core Systems > Departments
   - Click **+ New Department** button

2. **Fill in Form**
   - **Code** (Required): Short identifier
     - Example: "HOSPITAL", "CLINIC", "ICU"
     - Use uppercase letters, numbers, hyphens, underscores
     - Must be unique
   - **Name** (Required): Full department name
     - Example: "Main Hospital", "Outpatient Clinic"
     - Can use any characters (Thai, English, etc.)
   - **Active**: Toggle to true/false
     - Default: true (active)
   - **Parent Department**: Leave empty for root

3. **Save**
   - Click **Create** button
   - You'll see success message
   - New department appears in list

#### Example: Create "HOSPITAL" Department

```
Code: HOSPITAL
Name: Main Hospital Complex
Active: Yes
Parent: (none)
```

Click **Create**

---

#### Nested Department (With Parent)

1. **Click Create Button**
   - Go to Core Systems > Departments
   - Click **+ New Department** button

2. **Fill in Form**
   - **Code**: "NURSING"
   - **Name**: "Nursing Department"
   - **Active**: Yes
   - **Parent Department**: Select "HOSPITAL" from dropdown

3. **Save**
   - Click **Create** button
   - Department is now child of HOSPITAL

#### Example: Create "NURSING" Under "HOSPITAL"

```
Code: NURSING
Name: Nursing Department
Active: Yes
Parent: HOSPITAL
```

Click **Create**

---

#### Deep Nesting (Multi-level)

You can create departments at any depth:

```
HOSPITAL (Level 1)
  └─ NURSING (Level 2)
      └─ ICU-NURSING (Level 3)
          └─ ICU-DAY (Level 4)
              └─ ICU-BED-A (Level 5)
```

To create each level:

1. Create HOSPITAL (parent = none)
2. Create NURSING (parent = HOSPITAL)
3. Create ICU-NURSING (parent = NURSING)
4. Create ICU-DAY (parent = ICU-NURSING)
5. Create ICU-BED-A (parent = ICU-DAY)

---

### Task 3: Edit Department Details

#### Update Department Name

1. **Open Department**
   - Go to Core Systems > Departments
   - Find department in list
   - Click the department name or **Edit** button

2. **Modify Information**
   - Change **Name** field
   - Keep other fields same
   - Click **Save**

3. **Confirm Changes**
   - You'll see success message
   - List updates automatically

#### Example

Change "Nursing Department" to "Nursing & Midwifery Department":

1. Find "NURSING" in list
2. Click **Edit**
3. Change Name to "Nursing & Midwifery Department"
4. Click **Save**

---

#### Move Department (Change Parent)

1. **Open Department**
   - Find department in list
   - Click **Edit**

2. **Change Parent**
   - Click **Parent Department** dropdown
   - Select different parent
   - Click **Save**

3. **Confirm Move**
   - Department hierarchy updates
   - All child departments move with it

#### Warning: Moving Departments

Be careful when moving departments:

- ❌ Cannot make a department its own child (circular)
- ❌ Cannot move a department under one of its own children
- ✅ Can always move a department to a new parent at same or higher level

---

#### Deactivate Department

Mark a department inactive without deleting it:

1. **Open Department**
   - Find department in list
   - Click **Edit**

2. **Toggle Status**
   - Click **Active** toggle to OFF
   - Click **Save**

3. **Effects of Deactivating**
   - Department won't appear in dropdown lists
   - Users can't be assigned to inactive departments
   - Data is preserved
   - Can reactivate anytime

---

### Task 4: View Department Hierarchy

#### Organizational Chart View

1. **Go to Departments**
   - Core Systems > Departments

2. **Click Hierarchy Tab**
   - See tree view of all departments
   - Departments shown with children indented

3. **Expand/Collapse**
   - Click arrow next to department
   - Shows/hides child departments
   - Use **Expand All** to see full tree
   - Use **Collapse All** to hide details

#### Example Tree Structure

```
▼ HOSPITAL
  ├─ ▼ NURSING
  │  ├─ ICU-NURSING
  │  └─ WARD-NURSING
  ├─ ▼ MEDICAL
  │  ├─ CARDIOLOGY
  │  └─ NEUROLOGY
  └─ ADMIN
```

#### Visual Navigation

- Click any department in tree to select it
- Right-click for quick actions: Edit, Delete, View Details
- Hover for department details (code, status, count of users)

---

### Task 5: Delete Department

#### When Can You Delete?

A department can be deleted ONLY if:

- ✅ It has NO child departments
- ✅ It has NO assigned users
- ✅ It's not referenced in other systems

If delete is blocked, you'll see why.

#### Steps to Delete

1. **Find Department**
   - Go to Core Systems > Departments
   - Find department in list

2. **Click Delete**
   - Click **Delete** button (trash icon)
   - Confirm: "Are you sure?"

3. **Resolve Conflicts** (if delete is blocked)
   - Move child departments first
   - Reassign users to other departments
   - Try delete again

#### Example: Delete "ICU-BED-A"

```
ICU-BED-A
  └─ No children
  └─ No users assigned
  └─ Can DELETE
```

#### Example: Cannot Delete "NURSING"

```
NURSING
  └─ Has 3 child departments (ICU-NURSING, WARD-NURSING, ADMIN-NURSING)
  └─ Has 45 users assigned
  ❌ CANNOT DELETE

Solution:
1. Move child departments to different parent
2. Reassign 45 users to other departments
3. Then delete
```

---

## Department Hierarchy

### Understanding Levels

Departments are organized in levels:

| Level          | Example                   | Notes                     |
| -------------- | ------------------------- | ------------------------- |
| Level 1 (Root) | HOSPITAL                  | No parent, top of tree    |
| Level 2        | NURSING, MEDICAL          | Direct children of root   |
| Level 3        | ICU-NURSING, WARD-NURSING | Children of Level 2       |
| Level 4+       | ICU-DAY, ICU-NIGHT        | Any deeper nesting needed |

### Rules for Hierarchy

**Allowed:**

- ✅ Department with multiple children
- ✅ Multiple root departments (departments without parent)
- ✅ Moving department to different parent
- ✅ Any nesting depth

**Not Allowed:**

- ❌ Circular hierarchy (A → B → C → A)
- ❌ Department as its own parent
- ❌ Department as child of its own child

---

### View Parent-Child Relationships

#### Method 1: Hierarchy Tab

1. Go to Departments
2. Click **Hierarchy** tab
3. See full tree structure
4. Expand/collapse to navigate

#### Method 2: Department Details

1. Open department
2. See **Parent Department** field
3. Click parent name to jump to parent
4. Use breadcrumb to navigate back

#### Method 3: Children List

1. Open department with children
2. Go to **Children** tab
3. See all direct children
4. Click child to open

---

## Advanced Features

### Bulk Import Departments

Import many departments at once from CSV or Excel file.

#### When to Use Bulk Import

- Initial setup with 100+ departments
- Migrating from another system
- Annual organizational restructuring
- Importing regional data

#### How to Import

1. **Prepare File**
   - Use Excel or CSV format
   - Columns needed:
     - `code`: Department code (required, unique)
     - `name`: Department name (required)
     - `parent_code`: Parent's code (optional)
     - `is_active`: true/false (optional, default: true)

2. **Example File**

   ```csv
   code,name,parent_code,is_active
   HOSPITAL,Main Hospital,,true
   NURSING,Nursing Department,HOSPITAL,true
   ICU-NURSING,ICU Nursing,NURSING,true
   MEDICAL,Medical Department,HOSPITAL,true
   CARDIOLOGY,Cardiology,MEDICAL,true
   ```

3. **Upload File**
   - Go to Core Systems > System Init
   - Click **Import Data**
   - Select **Departments** from module list
   - Upload your file
   - Click **Validate**

4. **Review Validation**
   - System checks each row
   - Shows errors if any (duplicate codes, invalid parents)
   - Must resolve errors before importing

5. **Execute Import**
   - After validation passes
   - Click **Import** to execute
   - System creates all departments
   - Shows success count

6. **Verify Results**
   - Go to Departments list
   - Check new departments are there
   - Verify hierarchy is correct

#### Rollback an Import

If something went wrong after import:

1. Go to Core Systems > System Init
2. Find the import session
3. Click **Rollback**
4. Confirm deletion
5. All imported departments removed

---

### Dropdown Lists

Departments appear in dropdowns throughout the system. Where you'll see them:

- **User Management**: Assign users to departments
- **Budget Management**: Allocate budgets to departments
- **Inventory Management**: Track inventory by department
- **Scheduling**: Assign staff to department shifts
- **Reports**: Filter reports by department

#### Using Department Dropdowns

1. Click dropdown
2. Search by name or code
3. Select department
4. Value saved

---

### Statistics & Reporting

#### View Department Statistics

1. Go to Core Systems > Departments
2. Click **Statistics** button (or tab)
3. See metrics:
   - Total departments: count of all
   - Active departments: count of is_active=true
   - Inactive departments: count of is_active=false

#### Example

```
Total Departments:    157
Active Departments:   152
Inactive Departments: 5
```

---

## Tips & Best Practices

### Department Code Naming

**Good Codes:**

- `HOSPITAL` - Short, clear, unique
- `ICU-NURSING` - Hierarchical indication
- `OPD-GENERAL` - Functional grouping
- `DEPT-001` - Sequential for large structures

**Avoid:**

- ❌ `Department 1` - Duplicate patterns
- ❌ `dept_name` - Using spaces
- ❌ `Nursing` - Lowercase (use uppercase)
- ❌ `abcdef!@#` - Special characters except - and \_

### Organizational Best Practices

1. **Plan Hierarchy Before Creating**
   - Draw org chart on paper first
   - Identify all levels
   - Then create in system
   - Avoids moving departments later

2. **Use Consistent Naming**
   - If level 2 is "Department", use for all
   - If level 3 is "Division", use for all
   - Helps users understand structure

3. **Keep Active/Inactive Clean**
   - Deactivate old departments instead of deleting
   - Helps with historical reporting
   - Can reactivate if needed

4. **Regular Audits**
   - Monthly: Check for orphaned departments
   - Quarterly: Review and update structure
   - Yearly: Major restructuring

5. **Document Changes**
   - Note major changes (date, reason)
   - Keep in institutional wiki
   - Helps onboard new staff

---

## FAQ

### Can I Create a Root Department?

**Yes.** Departments without a parent (parent field empty) are root departments. You can have multiple root departments.

Example:

```
HOSPITAL (root)
CLINIC (root)
```

Both are root level departments.

---

### What's the Maximum Nesting Depth?

**Unlimited.** You can create departments at any depth:

```
Level 1: ORGANIZATION
  Level 2: DIVISION
    Level 3: DEPARTMENT
      Level 4: UNIT
        Level 5: TEAM
          ... (as deep as needed)
```

However, practically:

- 4-6 levels is typical for organizations
- 8+ levels becomes hard to navigate
- Performance is not affected

---

### Can I Have Departments with Same Name?

**Yes, but avoid it.** Multiple departments can have the same name, but they must have different codes.

Example:

```
Code: ICU-EAST, Name: "Intensive Care Unit"
Code: ICU-WEST, Name: "Intensive Care Unit"
```

**Better approach:**

```
Code: ICU-EAST, Name: "ICU - East Wing"
Code: ICU-WEST, Name: "ICU - West Wing"
```

---

### Can I Change a Department Code?

**Yes, in most cases.** When editing:

1. Change the code
2. Code must still be unique
3. External references might break if any systems use the code

**Recommendation:** Avoid changing codes if possible, especially once in use.

---

### How Do I Merge Two Departments?

There's no automatic merge. To combine departments:

1. Reassign all users from Department A to Department B
2. Move all children of A under B
3. Delete Department A

---

### What Happens When I Deactivate a Department?

When you toggle a department to inactive:

- ✅ Data is preserved
- ✅ Can be reactivated anytime
- ❌ Won't appear in dropdown lists
- ❌ Can't assign new users to it
- ✅ Existing user assignments stay (but marked inactive)

---

### Can I Delete an Inactive Department?

**Yes, same rules apply:**

- ✅ Must have no children
- ✅ Must have no assigned users
- ✅ Must not be referenced elsewhere

Active/Inactive status doesn't matter for deletion.

---

### How Do I View All Users in a Department?

In the Department Details page:

1. Open department
2. Click **Users** tab
3. See all users assigned to this department
4. Includes users in child departments
5. Can reassign from here

---

### Can I Export Department List?

1. Go to Core Systems > Departments
2. Click **Export** button (top right)
3. Choose format:
   - CSV - For Excel
   - JSON - For integration
   - PDF - For printing
4. File downloads

---

## Troubleshooting

### Problem: Cannot Create Department

**Symptom:** Create button is grayed out or unavailable

**Solutions:**

1. Check permissions
   - Go to Settings > User Profile
   - Verify you have `departments:create` permission
   - If not, ask administrator

2. Check if code is unique
   - Search for code in list
   - If exists, use different code

3. Browser cache
   - Clear browser cache and reload
   - Try different browser

---

### Problem: Cannot Find Department

**Symptom:** Department doesn't appear in search

**Solutions:**

1. **Check filters**
   - Clear active filters
   - Check if department is inactive
   - Try removing search terms

2. **Check permissions**
   - You need `departments:read` permission
   - Check Settings > User Profile
   - Ask administrator if missing

3. **Database sync**
   - Department might be on different server
   - Wait 1-2 minutes
   - Refresh page (F5)

---

### Problem: Delete Button Blocked

**Symptom:** "Cannot delete - has children" or "has users"

**Solutions:**

1. **If has children:**
   - Go to department
   - Click **Children** tab
   - Move children to different parent
   - Then try delete again

2. **If has users:**
   - Go to department
   - Click **Users** tab
   - Select users and **Reassign**
   - Choose new department
   - Then try delete again

---

### Problem: Circular Hierarchy Error

**Symptom:** "Cannot create circular hierarchy" when trying to move department

**Cause:** Trying to make a department a child of its own descendant

**Example of Error:**

```
Department A
  └─ Department B
      └─ Department C

Try to: Move A under C ❌
This creates: A → B → C → A (circle)
```

**Solution:**

1. Don't move A under C
2. Move C under A instead (if needed)
3. Or move A to different parent

---

### Problem: Import Failed

**Symptom:** Import validation shows errors

**Solutions:**

1. **Check error details**
   - Click error message
   - Shows specific row and column
   - Example: "Row 5, Code: DUPLICATE_CODE"

2. **Common import errors:**

   | Error            | Cause                       | Fix                   |
   | ---------------- | --------------------------- | --------------------- |
   | `DUPLICATE_CODE` | Code already exists         | Use unique code       |
   | `INVALID_PARENT` | Parent code not found       | Check parent spelling |
   | `REQUIRED_FIELD` | Missing required column     | Add code or name      |
   | `INVALID_FORMAT` | Code has invalid characters | Use only A-Z 0-9 - \_ |

3. **Fix and retry**
   - Fix errors in CSV file
   - Re-upload file
   - Revalidate

---

### Problem: Performance Slow

**Symptom:** Department list takes long time to load

**Solutions:**

1. **Reduce filter criteria**
   - Clear unnecessary filters
   - Search for specific department

2. **Check page limit**
   - Reduce items per page
   - Instead of 100, try 20

3. **Contact support**
   - If still slow, report to team
   - May need database optimization

---

### Problem: Real-time Updates Not Working

**Symptom:** Department changes don't appear immediately in other browser tabs

**Solutions:**

1. **Check WebSocket connection**
   - Open browser DevTools (F12)
   - Go to Network > WS
   - Look for WebSocket connection
   - Should show connected status

2. **Refresh page**
   - Press F5
   - Changes will appear

3. **Reconnect**
   - Close browser tab
   - Reopen
   - Automatic reconnection

---

## Quick Reference

### Common Actions

| Action             | Steps                                           |
| ------------------ | ----------------------------------------------- |
| **Create**         | Click +New, fill form, Save                     |
| **Edit**           | Click Edit, change fields, Save                 |
| **Delete**         | Click Delete, Confirm, handle errors            |
| **Search**         | Type in search box, results update              |
| **Filter**         | Click Filters, select criteria, Apply           |
| **View Hierarchy** | Click Hierarchy tab, expand/collapse            |
| **Export**         | Click Export, choose format, Download           |
| **Import**         | Use System Init, upload file, validate, execute |

### Keyboard Shortcuts

| Shortcut | Action             |
| -------- | ------------------ |
| `Ctrl+F` | Search departments |
| `Ctrl+N` | New department     |
| `Esc`    | Close dialog       |
| `Enter`  | Save changes       |

---

Need help? Contact your system administrator or see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more details.
