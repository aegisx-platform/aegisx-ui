# Requirements Document - Drug Return Frontend UI

## Introduction

The Drug Return Frontend UI provides an intuitive, workflow-driven interface for hospital departments and pharmacy staff to manage drug returns efficiently. This Angular-based application integrates with the drug-return-backend-api to deliver a complete drug return lifecycle from creation through disposal, with real-time status updates and comprehensive audit trails.

**Purpose:** Enable efficient drug return management through user-friendly workflows that support pharmacy verification, good/damaged separation, and quarantine management while maintaining full traceability.

**Value to Users:**

- Streamlined return request creation with lot number tracking
- Clear verification workflow for pharmacist inspection
- Automated good/damaged separation with inventory integration
- Real-time status updates for all stakeholders
- Complete visibility of quarantine stock and disposal processes
- Full audit trail for compliance and accountability

## Alignment with Product Vision

This feature aligns with INVS Modern's core objectives:

1. **Enhance Inventory Accuracy**: Proper return processing ensures inventory records match physical stock, especially for returned drugs
2. **Minimize Drug Waste**: Early detection and systematic handling of damaged/expired drugs reduces losses (target: 25% reduction in untracked waste)
3. **Support Data-Driven Decisions**: Comprehensive return analytics help identify patterns and optimize procurement
4. **Ensure Compliance**: Complete audit trail for all returns meets Ministry of Public Health requirements
5. **Improve User Experience**: Intuitive workflows reduce training time and processing errors

## Requirements

### REQ-1: Return Dashboard

**User Story:** As a ward staff or pharmacist, I want to view all drug returns with status filtering, so that I can track and manage returns efficiently.

#### Acceptance Criteria

1. **WHEN** user opens Return Dashboard **THEN** system **SHALL** display:
   - Quick stats summary (Total Returns, Pending Verification, Verified Today, Quarantine Items)
   - Return list table with columns: Return Number, Department, Date, Status, Total Items, Total Value, Actions
   - Status filter buttons (All/Draft/Submitted/Verified/Posted/Cancelled)
   - Date range picker
   - Search bar (by return number, department name)
   - Department filter dropdown (if user has access to multiple departments)

2. **WHEN** status is DRAFT **THEN** system **SHALL** display badge with 📝 gray color
3. **WHEN** status is SUBMITTED **THEN** system **SHALL** display badge with 🔵 blue color
4. **WHEN** status is VERIFIED **THEN** system **SHALL** display badge with 🟢 green color
5. **WHEN** status is POSTED **THEN** system **SHALL** display badge with ✅ success color
6. **WHEN** status is CANCELLED **THEN** system **SHALL** display badge with ❌ red color

7. **WHEN** user clicks status filter button **THEN** system **SHALL** filter table to show only returns with that status

8. **WHEN** user applies date range **THEN** system **SHALL** filter returns by return_date within range

9. **WHEN** user types in search bar **THEN** system **SHALL** filter results by return number or department name (case-insensitive, partial match)

10. **WHEN** user clicks "View Details" button **THEN** system **SHALL** navigate to Return Details page

11. **WHEN** user clicks "Create Return" button **THEN** system **SHALL** navigate to Create Return page

12. **WHEN** backend emits WebSocket event for return update **THEN** system **SHALL** refresh dashboard data automatically

### REQ-2: Quick Stats Cards

**User Story:** As a pharmacist, I want to see summary statistics at a glance, so that I can prioritize verification work.

#### Acceptance Criteria

1. **WHEN** Return Dashboard loads **THEN** system **SHALL** display 4 stat cards:
   - 📦 Total Returns (count of all returns in selected period)
   - ⏳ Pending Verification (count with status=SUBMITTED)
   - ✅ Verified Today (count verified today)
   - ⚠️ Quarantine Items (count of lots in quarantine)

2. **WHEN** user clicks on stat card **THEN** system **SHALL** filter table to show relevant returns

3. **WHEN** backend data updates **THEN** system **SHALL** refresh stat cards automatically (via WebSocket)

### REQ-3: Create Return Form

**User Story:** As a ward staff, I want to create a drug return request with multiple items, so that I can return excess, expired, or damaged drugs to pharmacy.

#### Acceptance Criteria

1. **WHEN** user opens Create Return page **THEN** system **SHALL** display form with sections:
   - **Return Information**:
     - From Department (dropdown, auto-selected for ward users)
     - To Location (dropdown, defaults to "Central Pharmacy")
     - Return Date (date picker, defaults to today)
     - Return By (user selector dropdown)
     - Return Reason (dropdown with common reasons: Excess Stock, Near Expiry, Damaged, Wrong Drug, Patient Discharged, Other)
     - Notes (textarea, optional)
   - **Items to Return**:
     - Dynamic table with "Add Item" button
     - Columns: Drug, Lot Number, Expiry Date, Total Quantity, Unit, Condition, Actions

2. **WHEN** user clicks "Add Item" button **THEN** system **SHALL** add new row with:
   - Drug selector (searchable dropdown via API)
   - Lot Number selector (filtered by selected drug and department)
   - Expiry Date (auto-filled from selected lot, read-only)
   - Total Quantity (number input, required, must be > 0)
   - Unit (auto-filled from drug master, read-only)
   - Condition radio buttons (Good/Damaged, informational only)
   - Remove button (trash icon)

3. **WHEN** user selects drug **THEN** system **SHALL** call GET /api/lots?drug_id=X&location_id=Y to populate lot dropdown

4. **WHEN** user selects lot number **THEN** system **SHALL**:
   - Auto-fill expiry date
   - Display available quantity for that lot
   - Validate that return quantity ≤ available quantity

5. **IF** return quantity > available quantity **THEN** system **SHALL** display error "Cannot return more than available quantity (X units)"

6. **WHEN** user clicks "Save Draft" button **THEN** system **SHALL**:
   - Validate all required fields (department, return reason, at least 1 item)
   - Call POST /api/inventory/operations/drug-returns with status=DRAFT
   - Display success message "Return draft saved (RET-YYYY-MM-###)"
   - Navigate back to Return Dashboard

7. **WHEN** user clicks "Submit Return" button **THEN** system **SHALL**:
   - Validate all required fields
   - Validate at least 1 item exists
   - Call POST /api/inventory/operations/drug-returns with status=SUBMITTED
   - Display success message "Return submitted for verification"
   - Emit WebSocket event to notify pharmacist
   - Navigate back to Return Dashboard

8. **WHEN** user clicks "Cancel" button **THEN** system **SHALL** show confirmation dialog, and if confirmed, discard changes and navigate back

9. **WHEN** user clicks remove item button **THEN** system **SHALL** remove that row from table

10. **WHEN** form has validation errors **THEN** system **SHALL** display inline error messages with red border

### REQ-4: Return Details View

**User Story:** As a user, I want to view complete details of a return request, so that I can review all information and history.

#### Acceptance Criteria

1. **WHEN** user opens Return Details page **THEN** system **SHALL** call GET /api/inventory/operations/drug-returns/:id and display:
   - **Header Section**:
     - Return Number (large, prominent)
     - Status badge with color coding
     - From Department → To Location (with arrow)
     - Return Date, Return By
   - **Return Information**:
     - Return Reason
     - Notes
     - Total Items count
     - Total Value (if verified/posted)
   - **Items Table**:
     - Columns: #, Drug Name, Lot Number, Expiry Date, Total Qty, Good Qty, Damaged Qty, Unit, Notes
     - Color-coded rows: good_quantity > 0 (green), damaged_quantity > 0 (orange)
   - **Status History Timeline**:
     - DRAFT → SUBMITTED → VERIFIED → POSTED
     - Show timestamp and user for each status
   - **Action Buttons** (context-dependent):
     - If status=DRAFT and user is creator: "Edit", "Submit", "Delete"
     - If status=SUBMITTED and user is pharmacist: "Verify Return"
     - If status=VERIFIED and user is pharmacist: "Post to Inventory"

2. **WHEN** user clicks "Edit" button (DRAFT only) **THEN** system **SHALL** navigate to Edit Return page with pre-filled data

3. **WHEN** user clicks "Submit" button (DRAFT only) **THEN** system **SHALL**:
   - Call PUT /api/inventory/operations/drug-returns/:id/submit
   - Update status to SUBMITTED
   - Display success message
   - Refresh page

4. **WHEN** user clicks "Delete" button (DRAFT only) **THEN** system **SHALL**:
   - Show confirmation dialog "Are you sure you want to delete this return?"
   - If confirmed, call DELETE /api/inventory/operations/drug-returns/:id
   - Display success message
   - Navigate back to Return Dashboard

5. **WHEN** user clicks "Verify Return" button (SUBMITTED) **THEN** system **SHALL** navigate to Verify Return page

6. **WHEN** user clicks "Post to Inventory" button (VERIFIED) **THEN** system **SHALL**:
   - Show confirmation dialog "Post this return to inventory? This will update stock levels."
   - If confirmed, call POST /api/inventory/operations/drug-returns/:id/post
   - Display success message "Return posted successfully. Inventory updated."
   - Refresh page

7. **WHEN** user clicks "Print" button **THEN** system **SHALL** open printable view with return details

8. **WHEN** backend emits WebSocket event for this return **THEN** system **SHALL** refresh page data automatically

### REQ-5: Verify Return Form (Pharmacist)

**User Story:** As a pharmacist, I want to verify returned items and separate good/damaged quantities, so that I can properly process returns and update inventory.

#### Acceptance Criteria

1. **WHEN** pharmacist opens Verify Return page **THEN** system **SHALL** display:
   - **Return Header** (read-only):
     - Return Number, Department, Return Reason, Total Items
   - **Verification Form**:
     - Items table with columns: Drug Name, Lot Number, Expiry Date, Claimed Qty, Actual Qty (input), Good Qty (input), Damaged Qty (input), Notes (input)
     - Verified By (user selector, defaults to current user)
     - Verified Date (date picker, defaults to today)
     - Verification Notes (textarea, optional)
   - **Action Buttons**:
     - "Reject Return" (returns to department)
     - "Save Progress" (saves as SUBMITTED, can continue later)
     - "Complete Verification" (changes to VERIFIED)

2. **WHEN** pharmacist enters Actual Qty **THEN** system **SHALL**:
   - Auto-copy to Good Qty if Actual Qty matches Claimed Qty
   - Validate Actual Qty ≥ 0

3. **WHEN** pharmacist enters Good Qty and Damaged Qty **THEN** system **SHALL**:
   - Real-time validation: Good Qty + Damaged Qty = Actual Qty
   - Display error if sum ≠ Actual Qty: "Good + Damaged must equal Actual (X units)"
   - Auto-calculate and display: Total Good, Total Damaged across all items

4. **IF** Good Qty + Damaged Qty ≠ Actual Qty **THEN** system **SHALL**:
   - Highlight row with red border
   - Display inline error message
   - Disable "Complete Verification" button

5. **WHEN** pharmacist clicks "Reject Return" **THEN** system **SHALL**:
   - Show confirmation dialog with reason input
   - If confirmed, call POST /api/inventory/operations/drug-returns/:id/reject with reason
   - Update status to CANCELLED
   - Display message "Return rejected. Department notified."
   - Navigate back to Return Dashboard

6. **WHEN** pharmacist clicks "Save Progress" **THEN** system **SHALL**:
   - Validate at least some quantities entered
   - Call PUT /api/inventory/operations/drug-returns/:id with partial verification data
   - Keep status as SUBMITTED
   - Display success message "Progress saved"
   - Stay on page

7. **WHEN** pharmacist clicks "Complete Verification" **THEN** system **SHALL**:
   - Validate all items have Good Qty + Damaged Qty = Actual Qty
   - Validate Verified By is selected
   - Call POST /api/inventory/operations/drug-returns/:id/verify with complete verification data
   - Update status to VERIFIED
   - Display success message "Verification complete. Return ready to post."
   - Navigate to Return Details page

8. **WHEN** verification is complete **THEN** system **SHALL** emit WebSocket event to notify department and inventory managers

### REQ-6: Post Return Confirmation

**User Story:** As a pharmacist, I want to post verified returns to inventory with clear preview of changes, so that I can ensure accuracy before updating stock.

#### Acceptance Criteria

1. **WHEN** pharmacist clicks "Post to Inventory" on VERIFIED return **THEN** system **SHALL** display confirmation dialog with:
   - **Summary**:
     - Total Good Quantity (will be added to inventory)
     - Total Damaged Quantity (will move to quarantine)
   - **Inventory Changes Preview**:
     - Table showing: Drug, Location, Current Stock, Good Qty, New Stock (Current + Good)
   - **Quarantine Lots**:
     - Table showing: Drug, Lot Number, Damaged Qty, Quarantine Location
   - **Warnings**:
     - If any items have damaged_quantity > 0: "⚠️ X items will be moved to quarantine for disposal"
   - **Action Buttons**:
     - "Cancel"
     - "Confirm & Post to Inventory"

2. **WHEN** pharmacist clicks "Confirm & Post to Inventory" **THEN** system **SHALL**:
   - Call POST /api/inventory/operations/drug-returns/:id/post
   - Display loading indicator with message "Posting return to inventory..."
   - On success:
     - Display success message "Return posted successfully. Inventory updated, X items in quarantine."
     - Emit WebSocket event to refresh inventory views
     - Close dialog and refresh Return Details page
   - On error:
     - Display error message with details
     - Keep dialog open

3. **WHEN** posting fails (API error) **THEN** system **SHALL**:
   - Display user-friendly error message
   - Show technical details in collapsible section (for support)
   - Suggest retry or contact support
   - Keep return in VERIFIED status (can retry)

### REQ-7: Quarantine Management View

**User Story:** As a pharmacist, I want to view all items in quarantine with disposal status, so that I can plan and execute disposal procedures.

#### Acceptance Criteria

1. **WHEN** user opens Quarantine Management page **THEN** system **SHALL** display:
   - **Summary Cards**:
     - Total Quarantine Items (count of lots)
     - Total Value (sum of lot values)
     - Pending Disposal (count awaiting disposal committee review)
     - Disposed This Month (count of completed disposals)
   - **Quarantine Lots Table**:
     - Columns: Drug Name, Lot Number, Quantity, Unit Cost, Total Value, Expiry Date, Days in Quarantine, Source (Return Number link), Disposal Status, Actions
   - **Filters**:
     - Disposal Status (All/Pending/Scheduled/Completed)
     - Date range (received in quarantine)
     - Drug search
   - **Bulk Actions**:
     - "Select All" checkbox
     - "Schedule Disposal" button (for selected items)

2. **WHEN** disposal status is Pending **THEN** system **SHALL** display badge with ⏳ yellow color

3. **WHEN** disposal status is Scheduled **THEN** system **SHALL** display badge with 📅 blue color and disposal date

4. **WHEN** disposal status is Completed **THEN** system **SHALL** display badge with ✅ green color and disposal date

5. **WHEN** user clicks "View Details" on quarantine lot **THEN** system **SHALL** open dialog showing:
   - Complete lot information
   - Source return details (link to return)
   - Damaged reason from verification
   - Photos (if uploaded)
   - Disposal history (if applicable)

6. **WHEN** user selects lots and clicks "Schedule Disposal" **THEN** system **SHALL** open Schedule Disposal dialog

7. **WHEN** user clicks Source return number link **THEN** system **SHALL** navigate to Return Details page for that return

8. **WHEN** table displays **THEN** system **SHALL** calculate and show totals in footer:
   - Total lots count
   - Total quantity
   - Total value

### REQ-8: Schedule Disposal Dialog

**User Story:** As a pharmacist, I want to schedule disposal for quarantine items with committee assignment, so that I can organize disposal procedures.

#### Acceptance Criteria

1. **WHEN** user opens Schedule Disposal dialog **THEN** system **SHALL** display form with:
   - **Selected Items Summary**:
     - Count of lots selected
     - Total quantity
     - Total value
     - Table preview: Drug Name, Lot Number, Quantity
   - **Disposal Information**:
     - Disposal Date (date picker, defaults to today, can set future date)
     - Disposal Method dropdown (Incineration, Chemical Destruction, Return to Vendor, Landfill, Other)
     - Committee Members (multi-select user picker, minimum 3 required)
     - Notes (textarea, optional)
   - **Action Buttons**:
     - "Cancel"
     - "Schedule Disposal"

2. **WHEN** user selects disposal method **THEN** system **SHALL** display method-specific guidelines (from master data)

3. **WHEN** user selects fewer than 3 committee members **THEN** system **SHALL**:
   - Display validation error "Disposal requires at least 3 committee members"
   - Disable "Schedule Disposal" button

4. **WHEN** user clicks "Schedule Disposal" button **THEN** system **SHALL**:
   - Validate all required fields
   - Call POST /api/inventory/operations/drug-disposals with selected lot IDs and disposal info
   - Display success message "Disposal scheduled for [date]. Committee members notified."
   - Close dialog
   - Refresh Quarantine Management page

5. **WHEN** disposal is scheduled **THEN** system **SHALL** emit WebSocket event to notify committee members

### REQ-9: Complete Disposal Form

**User Story:** As a disposal committee member, I want to record disposal completion with photo evidence, so that I can maintain compliance documentation.

#### Acceptance Criteria

1. **WHEN** user opens Complete Disposal page (from scheduled disposal) **THEN** system **SHALL** display:
   - **Disposal Information** (read-only):
     - Disposal Date, Method, Committee Members
   - **Items Being Disposed**:
     - Table: Drug Name, Lot Number, Quantity, Expiry Date
   - **Completion Form**:
     - Actual Disposal Date (date picker)
     - Disposal Location (text input, e.g., "Hospital Incinerator #2")
     - Photo Evidence (file upload, multiple files, required)
     - Committee Signatures (checkboxes for each member to confirm)
     - Completion Notes (textarea)
   - **Action Buttons**:
     - "Cancel"
     - "Complete Disposal"

2. **WHEN** user uploads photo **THEN** system **SHALL**:
   - Validate file type (JPEG, PNG, PDF only)
   - Validate file size (max 10MB per file)
   - Display thumbnail preview
   - Allow multiple files (min 1, max 10)

3. **WHEN** user tries to complete without all signatures **THEN** system **SHALL**:
   - Display error "All committee members must sign off"
   - Disable "Complete Disposal" button

4. **WHEN** user tries to complete without photo evidence **THEN** system **SHALL**:
   - Display error "Photo evidence is required"
   - Disable "Complete Disposal" button

5. **WHEN** user clicks "Complete Disposal" **THEN** system **SHALL**:
   - Validate all required fields and signatures
   - Upload photos to backend via POST /api/attachments
   - Call PUT /api/inventory/operations/drug-disposals/:id/complete with photo URLs
   - Update quarantine lot status to DISPOSED
   - Deactivate lots (quantity_available = 0)
   - Display success message "Disposal completed and documented"
   - Navigate to Disposal History page

6. **WHEN** disposal is completed **THEN** system **SHALL** emit WebSocket event to update dashboards

### REQ-10: Return Analytics Dashboard

**User Story:** As an inventory manager, I want to view return analytics and trends, so that I can identify patterns and improve inventory management.

#### Acceptance Criteria

1. **WHEN** user opens Return Analytics page **THEN** system **SHALL** display:
   - **KPI Cards**:
     - Total Returns (this month)
     - Good Return Rate (good_qty / total_qty %)
     - Damaged Value (total value of damaged items)
     - Average Processing Time (SUBMITTED → POSTED)
   - **Charts**:
     - Returns by Reason (pie chart)
     - Returns Trend (line chart, last 6 months)
     - Top Departments by Return Count (bar chart)
     - Good vs Damaged Quantities (stacked bar chart)
   - **Filters**:
     - Date range picker
     - Department filter
     - Return reason filter

2. **WHEN** user applies date range **THEN** system **SHALL** call GET /api/inventory/operations/drug-returns/analytics?from=X&to=Y and refresh all charts

3. **WHEN** user clicks chart segment **THEN** system **SHALL** drill down to detailed data:
   - Pie chart segment → filter returns by that reason
   - Bar chart bar → filter returns by that department

4. **WHEN** user hovers over chart element **THEN** system **SHALL** display tooltip with:
   - Label
   - Value
   - Percentage (if applicable)

5. **WHEN** user clicks "Export Report" **THEN** system **SHALL** download Excel file with:
   - Summary sheet (KPIs)
   - Returns list sheet (all returns in period)
   - Analytics sheet (chart data)

### REQ-11: Return Reason Master Data

**User Story:** As an administrator, I want to manage return reason codes, so that users can select from standardized reasons.

#### Acceptance Criteria

1. **WHEN** admin opens Return Reasons page **THEN** system **SHALL** display:
   - Table with columns: Reason Code, Reason Description, Is Active, Created Date, Actions
   - "Add Reason" button
   - Search bar

2. **WHEN** admin clicks "Add Reason" **THEN** system **SHALL** open dialog with:
   - Reason Code (text input, required, unique)
   - Reason Description (textarea, required)
   - Is Active checkbox (defaults to true)

3. **WHEN** admin saves new reason **THEN** system **SHALL**:
   - Validate uniqueness of reason code
   - Call POST /api/master-data/return-reasons
   - Display success message
   - Refresh table

4. **WHEN** admin clicks "Edit" **THEN** system **SHALL** open dialog with pre-filled data

5. **WHEN** admin clicks "Deactivate" **THEN** system **SHALL**:
   - Show confirmation dialog
   - If confirmed, call PUT /api/master-data/return-reasons/:id with is_active=false
   - Refresh table

6. **WHEN** reason is deactivated **THEN** system **SHALL**:
   - Keep existing returns with that reason unchanged
   - Hide from dropdown in Create Return form

### REQ-12: Real-time Updates via WebSocket

**User Story:** As a user, I want to receive real-time updates when returns are created, verified, or posted, so that I always see current data.

#### Acceptance Criteria

1. **WHEN** user opens any Drug Return page **THEN** system **SHALL**:
   - Connect to WebSocket endpoint /ws/drug-returns
   - Subscribe to relevant events based on user role and department

2. **WHEN** WebSocket receives "return.created" event **THEN** system **SHALL**:
   - If on Return Dashboard: add new return to table or refresh table
   - Display toast notification "New return created: RET-YYYY-MM-###"

3. **WHEN** WebSocket receives "return.submitted" event **THEN** system **SHALL**:
   - If user is pharmacist: display toast notification "Return awaiting verification: RET-YYYY-MM-###"
   - If on Return Dashboard: update return status badge

4. **WHEN** WebSocket receives "return.verified" event **THEN** system **SHALL**:
   - If on Return Dashboard: update status and verified_by columns
   - Display toast notification "Return verified: RET-YYYY-MM-###"

5. **WHEN** WebSocket receives "return.posted" event **THEN** system **SHALL**:
   - If on Return Dashboard: update status to POSTED
   - If on Inventory Dashboard (other module): refresh stock levels
   - Display toast notification "Return posted to inventory: RET-YYYY-MM-###"

6. **WHEN** WebSocket receives "disposal.scheduled" event **THEN** system **SHALL**:
   - If on Quarantine Management page: refresh table
   - If user is committee member: display notification "You are assigned to disposal committee"

7. **WHEN** WebSocket connection is lost **THEN** system **SHALL**:
   - Attempt auto-reconnect every 5 seconds
   - Display warning banner "Real-time updates paused. Reconnecting..."
   - Remove banner when reconnected

### REQ-13: Permissions and Role-Based Access

**User Story:** As a system administrator, I want to control who can create, verify, and post returns based on roles, so that I can maintain proper segregation of duties.

#### Acceptance Criteria

1. **WHEN** user with role "Ward Staff" logs in **THEN** system **SHALL** allow:
   - ✅ Create returns for their department
   - ✅ View returns for their department
   - ✅ Edit/Delete DRAFT returns they created
   - ❌ Verify returns
   - ❌ Post returns
   - ❌ Access Quarantine Management

2. **WHEN** user with role "Pharmacist" logs in **THEN** system **SHALL** allow:
   - ✅ View all returns
   - ✅ Verify returns (SUBMITTED → VERIFIED)
   - ✅ Post returns (VERIFIED → POSTED)
   - ✅ Access Quarantine Management
   - ✅ Schedule disposals
   - ❌ Edit returns created by departments

3. **WHEN** user with role "Disposal Committee" logs in **THEN** system **SHALL** allow:
   - ✅ View scheduled disposals
   - ✅ Complete disposals (record evidence)
   - ✅ View Quarantine Management (read-only)
   - ❌ Create returns
   - ❌ Verify returns
   - ❌ Schedule disposals (only pharmacist can)

4. **WHEN** user with role "Inventory Manager" logs in **THEN** system **SHALL** allow:
   - ✅ View all returns (all departments)
   - ✅ Access Return Analytics
   - ✅ Export reports
   - ❌ Create/Edit/Verify/Post returns

5. **WHEN** user with role "Administrator" logs in **THEN** system **SHALL** allow:
   - ✅ All actions
   - ✅ Manage Return Reasons master data

6. **WHEN** user attempts unauthorized action **THEN** system **SHALL**:
   - Hide action buttons not allowed for their role
   - If API call attempted: display error "You do not have permission to perform this action"

### REQ-14: Mobile Responsive Design

**User Story:** As a ward staff using a tablet, I want the interface to work well on mobile devices, so that I can create returns at the point of care.

#### Acceptance Criteria

1. **WHEN** user accesses Drug Return UI on tablet (width 768px-1024px) **THEN** system **SHALL**:
   - Display tables with horizontal scroll if needed
   - Stack form fields vertically
   - Use full-width buttons
   - Maintain readable font sizes (min 14px)

2. **WHEN** user accesses Drug Return UI on mobile (width <768px) **THEN** system **SHALL**:
   - Hide non-essential columns in tables (show Drug, Qty, Status only)
   - Use card layout instead of table for Return List
   - Stack all form sections vertically
   - Use mobile-optimized date/time pickers
   - Ensure touch targets are min 44px

3. **WHEN** user opens dialogs on mobile **THEN** system **SHALL**:
   - Display as full-screen modal
   - Add "Back" button in header
   - Stack all content vertically

### REQ-15: Accessibility (WCAG 2.1 AA)

**User Story:** As a user with visual impairment, I want the interface to be accessible with screen readers, so that I can perform my job independently.

#### Acceptance Criteria

1. **WHEN** user navigates with keyboard only **THEN** system **SHALL**:
   - Support Tab/Shift+Tab for focus navigation
   - Show visible focus indicators (outline)
   - Support Enter/Space for button activation
   - Support Escape to close dialogs

2. **WHEN** user uses screen reader **THEN** system **SHALL**:
   - Provide ARIA labels for all interactive elements
   - Announce form validation errors
   - Announce dynamic content updates (toast notifications)
   - Provide table headers and row/column labels

3. **WHEN** displaying color-coded status badges **THEN** system **SHALL**:
   - Include text label in addition to color
   - Use icon + text + color (not color alone)
   - Maintain 4.5:1 contrast ratio

4. **WHEN** displaying charts **THEN** system **SHALL**:
   - Provide alternative text description
   - Include data table view option
   - Support keyboard navigation

### REQ-16: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages and loading indicators, so that I understand system status and know how to fix issues.

#### Acceptance Criteria

1. **WHEN** form validation fails **THEN** system **SHALL**:
   - Display inline error message below invalid field (red text)
   - Highlight field with red border
   - Focus on first invalid field
   - Display summary error message at top of form

2. **WHEN** API call is in progress **THEN** system **SHALL**:
   - Display loading spinner on button that triggered the action
   - Disable submit buttons to prevent double-submit
   - For slow operations (>2s): display progress message

3. **WHEN** API call succeeds **THEN** system **SHALL**:
   - Display success toast notification (green) with message
   - Auto-dismiss after 5 seconds
   - Provide "Undo" option if applicable

4. **WHEN** API call fails **THEN** system **SHALL**:
   - Display error toast notification (red) with user-friendly message
   - Show technical error in collapsible section (for support)
   - Provide "Retry" button if operation is retryable
   - Suggest next steps or contact support

5. **WHEN** network is offline **THEN** system **SHALL**:
   - Display persistent banner "You are offline. Some features unavailable."
   - Cache read-only data for viewing
   - Queue mutations to retry when online (if feasible)

6. **WHEN** session expires **THEN** system **SHALL**:
   - Display dialog "Your session has expired. Please log in again."
   - Redirect to login page
   - Preserve unsaved form data in localStorage (if possible, recover after re-login)

### REQ-17: Performance and Optimization

**User Story:** As a user, I want the interface to load quickly and respond smoothly, so that I can work efficiently.

#### Acceptance Criteria

1. **WHEN** user opens Return Dashboard **THEN** system **SHALL**:
   - Load initial view within 2 seconds
   - Use pagination or virtual scrolling for large tables (>100 rows)
   - Display skeleton loaders during data fetch

2. **WHEN** user filters or searches **THEN** system **SHALL**:
   - Debounce search input (300ms delay)
   - Show loading indicator if API call takes >500ms
   - Cancel previous API call if new filter applied

3. **WHEN** user scrolls large table **THEN** system **SHALL**:
   - Use virtual scrolling (render only visible rows + buffer)
   - Maintain smooth scrolling (60fps)

4. **WHEN** user navigates between pages **THEN** system **SHALL**:
   - Prefetch data for likely next pages (e.g., Return Details when hovering row)
   - Use route guards to prevent navigation with unsaved changes

5. **WHEN** displaying images (disposal photos) **THEN** system **SHALL**:
   - Use lazy loading (load when scrolled into view)
   - Display placeholder while loading
   - Compress images client-side before upload

### REQ-18: Print and Export

**User Story:** As a pharmacist, I want to print return documents and export data for audits, so that I can maintain physical records.

#### Acceptance Criteria

1. **WHEN** user clicks "Print" on Return Details **THEN** system **SHALL**:
   - Open print preview with formatted document
   - Include: Return header, items table, signatures (verified_by, received_by)
   - Hide action buttons and navigation
   - Use print-friendly CSS (@media print)

2. **WHEN** user clicks "Export to Excel" on Return Dashboard **THEN** system **SHALL**:
   - Generate Excel file with columns: Return Number, Date, Department, Status, Total Items, Total Value, Verified By, Posted By
   - Include only filtered/visible rows
   - Auto-download file named "drug-returns-YYYY-MM-DD.xlsx"

3. **WHEN** user clicks "Export Analytics Report" **THEN** system **SHALL**:
   - Generate Excel file with multiple sheets:
     - Summary (KPIs)
     - Returns List (detailed)
     - Charts (data tables)
   - Auto-download file named "drug-return-analytics-YYYY-MM-DD.xlsx"

4. **WHEN** user clicks "Export Disposal Report" **THEN** system **SHALL**:
   - Generate PDF with disposal document format
   - Include: Disposal header, items table, committee signatures, photo thumbnails
   - Auto-download file named "disposal-report-YYYY-MM-DD.pdf"

### REQ-19: Integration with Backend API

**User Story:** As a developer, I want all frontend components to integrate seamlessly with drug-return-backend-api, so that data flows correctly.

#### Acceptance Criteria

1. **WHEN** frontend makes API calls **THEN** system **SHALL**:
   - Use environment-specific base URL (from environment.ts)
   - Include authentication token in Authorization header
   - Set Content-Type: application/json for POST/PUT requests

2. **WHEN** API returns 401 Unauthorized **THEN** system **SHALL**:
   - Clear stored token
   - Redirect to login page
   - Display message "Session expired. Please log in."

3. **WHEN** API returns 403 Forbidden **THEN** system **SHALL**:
   - Display error "You do not have permission to perform this action"
   - Do not retry request

4. **WHEN** API returns 400 Bad Request with validation errors **THEN** system **SHALL**:
   - Parse error response (expected format: { field: "error message" })
   - Display inline validation errors on corresponding form fields

5. **WHEN** API returns 500 Internal Server Error **THEN** system **SHALL**:
   - Display generic error "An error occurred. Please try again or contact support."
   - Log full error to console for debugging
   - Optionally report to error tracking service

6. **WHEN** API call times out (>30s) **THEN** system **SHALL**:
   - Cancel request
   - Display error "Request timed out. Please check your connection and try again."

### REQ-20: Component Reusability

**User Story:** As a developer, I want to build reusable components following AegisX UI + Angular Material patterns, so that I can maintain consistency and reduce code duplication.

#### Acceptance Criteria

1. **WHEN** building UI components **THEN** system **SHALL**:
   - Use AegisX UI components as base (ax-table, ax-form, ax-dialog, ax-badge, ax-button)
   - Extend with Angular Material components where AegisX doesn't provide (mat-datepicker, mat-select)
   - Apply TailwindCSS utility classes for spacing, colors, responsive design
   - Follow project theming (primary, accent, warn colors)

2. **WHEN** creating shared components **THEN** system **SHALL**:
   - Place in libs/aegisx-ui or apps/admin/src/app/shared/components
   - Provide @Input() for configuration
   - Emit @Output() events for actions
   - Include JSDoc comments for public API
   - Create Storybook stories for documentation

3. **WHEN** creating feature components **THEN** system **SHALL**:
   - Place in apps/admin/src/app/features/drug-returns/
   - Use standalone components (Angular 17+ pattern)
   - Inject services via constructor
   - Use Signals for state management

4. **WHEN** styling components **THEN** system **SHALL**:
   - Use TailwindCSS utility-first approach
   - Follow spacing scale (p-4, m-2, gap-6, etc.)
   - Use semantic color classes (bg-primary, text-error)
   - Apply responsive classes (md:flex, lg:grid-cols-3)

## Summary

This specification defines a comprehensive Drug Return Frontend UI that streamlines the complete drug return lifecycle from creation through disposal. By leveraging AegisX UI components, Angular Material, and TailwindCSS, we deliver a modern, accessible, and user-friendly interface that integrates seamlessly with the drug-return-backend-api.

**Key Features:**

- Intuitive return creation with lot tracking
- Structured verification workflow with good/damaged separation
- Real-time updates via WebSocket
- Comprehensive quarantine and disposal management
- Rich analytics and reporting
- Role-based access control
- Mobile-responsive design
- Full accessibility compliance

**Impact:**

- Reduce return processing time by 40%
- Improve inventory accuracy through proper return handling
- Minimize untracked drug waste by 25%
- Ensure compliance with disposal documentation requirements
- Enhance user satisfaction with intuitive workflows
