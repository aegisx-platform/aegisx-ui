# Requirements Document - Distribution Frontend UI

## Introduction

The Distribution Frontend UI provides a modern, user-friendly interface for hospital pharmacists and department staff to manage drug distribution workflows from request to receipt. This Angular-based application integrates with the distribution-backend-api to deliver multi-level approval workflows, FIFO/FEFO lot tracking, and complete audit trails.

**Purpose:** Enable efficient distribution management through intuitive UI workflows that support Ministry of Public Health compliance and ensure proper drug rotation using FIFO/FEFO logic.

**Value to Users:**

- Department staff can easily request drugs from pharmacy with real-time stock validation
- Supervisors can review and approve distribution requests with clear visibility
- Pharmacists can dispense drugs using guided FIFO/FEFO workflows with automatic lot selection
- Department staff can confirm receipt and close distribution workflows
- Inventory managers can track drug consumption by department for usage analysis
- Finance officers can access distribution reports for cost allocation
- Auditors can trace complete distribution history with lot-level traceability

## Alignment with Product Vision

This feature aligns with INVS Modern's core objectives:

1. **Streamline Procurement Process**: Reduces distribution request processing time by 50% through intuitive forms and automated workflows
2. **Enhance Inventory Accuracy**: FIFO/FEFO lot tracking UI helps pharmacists dispense drugs before expiry (target: 30% reduction in expired drug waste)
3. **Improve Budget Control**: Track drug consumption by department for accurate cost center allocation
4. **Support Data-Driven Decisions**: Visual dashboards and reports enable informed inventory planning
5. **Ensure Compliance**: Complete audit trail for all distribution transactions meets Ministry requirements

**Technical Alignment:**

- Angular 18+ with Signals for reactive state management
- AegisX UI component library for consistent design
- Angular Material components for enhanced UX
- TailwindCSS for responsive styling
- TypeScript strict mode for type safety
- Integrates with distribution-backend-api (15 endpoints)

## Requirements

### REQ-1: Distribution List View

**User Story:** As a pharmacist, I want to view all distribution requests with status filtering, so that I can prioritize pending approvals and dispensing tasks.

#### Acceptance Criteria

1. **WHEN** user opens Distribution List page **THEN** system **SHALL** display:
   - Quick stats summary (Total Distributions, Pending Approval, Ready to Dispense, Completed Today)
   - Filter controls (Status dropdown, Department selector, Location selector, Date range picker, Search bar)
   - Distribution table with columns: Distribution Number, Date, Department, From Location, Status Badge, Total Items, Total Amount, Actions

2. **WHEN** user selects status filter **THEN** system **SHALL** filter distributions by status (PENDING, APPROVED, DISPENSED, COMPLETED, CANCELLED)

3. **WHEN** status is PENDING **THEN** system **SHALL** display 🟡 yellow badge and show "Approve" action button

4. **WHEN** status is APPROVED **THEN** system **SHALL** display 🔵 blue badge and show "Dispense" action button

5. **WHEN** status is DISPENSED **THEN** system **SHALL** display 🟢 green badge and show "Complete" action button

6. **WHEN** status is COMPLETED **THEN** system **SHALL** display ✅ checkmark badge and show "View Details" action only

7. **WHEN** status is CANCELLED **THEN** system **SHALL** display ❌ red badge and gray out row

8. **WHEN** user clicks distribution row **THEN** system **SHALL** navigate to Distribution Detail page

9. **WHEN** user clicks "Create Distribution" button **THEN** system **SHALL** open Create Distribution dialog

10. **WHEN** distributions list loads **THEN** system **SHALL** call GET /api/inventory/operations/drug-distributions with query filters

11. **WHEN** user types in search bar **THEN** system **SHALL** filter by distribution number or requester name (debounced 300ms)

12. **WHEN** table displays **THEN** system **SHALL** support pagination (20 items per page default)

13. **WHEN** table displays **THEN** system **SHALL** sort by distribution_date DESC by default (newest first)

### REQ-2: Create Distribution Dialog

**User Story:** As a department staff member, I want to create distribution requests easily, so that my department can receive needed medications.

#### Acceptance Criteria

1. **WHEN** user opens Create Distribution dialog **THEN** system **SHALL** display form with fields:
   - From Location (dropdown, required, filtered to pharmacy locations)
   - To Department (dropdown, required, defaults to user's department)
   - Distribution Date (date picker, defaults to today)
   - Requested By (text input, pre-filled with current user name, editable)
   - Items table with [+ Add Item] button
   - Notes (textarea, optional)

2. **WHEN** user clicks [+ Add Item] **THEN** system **SHALL** add new row to items table with:
   - Drug selector (autocomplete dropdown, searchable by name/code, required)
   - Quantity Requested (number input, required, > 0)
   - Available Stock (read-only, displayed after drug selected)
   - Status indicator (✓ Available / ⚠️ Limited / ❌ Insufficient)
   - [Remove] button

3. **WHEN** user selects drug **THEN** system **SHALL**:
   - Call GET /api/inventory/operations/inventory/stock/:drugId/:locationId to check availability
   - Display current available stock in "Available" column
   - Calculate status: ✓ if quantity ≤ available, ⚠️ if quantity = available, ❌ if quantity > available

4. **WHEN** user enters quantity > available stock **THEN** system **SHALL** display inline error "Insufficient stock. Available: X, Requested: Y"

5. **WHEN** all items have valid quantities **THEN** system **SHALL** enable "Submit Distribution" button

6. **IF** any item has insufficient stock **THEN** system **SHALL** disable "Submit Distribution" button

7. **WHEN** user clicks "Submit Distribution" **THEN** system **SHALL**:
   - Validate all required fields (from location, department, at least 1 item)
   - Call POST /api/inventory/operations/drug-distributions
   - Display success toast "Distribution created: {distribution_number}"
   - Close dialog and refresh Distribution List
   - Navigate to newly created distribution detail page (optional)

8. **WHEN** API returns 400 INSUFFICIENT_STOCK **THEN** system **SHALL** display error message with drug name and available quantity

9. **WHEN** user clicks "Cancel" **THEN** system **SHALL** show confirmation dialog if form has unsaved changes, then close without saving

10. **WHEN** form displays **THEN** system **SHALL** calculate and display preview totals: Total Items (count), Estimated Total Amount (sum of quantity × unit_cost from stock API)

### REQ-3: Distribution Detail View

**User Story:** As a pharmacist, I want to view complete distribution details including items and lot information, so that I can verify what was requested and dispensed.

#### Acceptance Criteria

1. **WHEN** user opens Distribution Detail page **THEN** system **SHALL** call GET /api/inventory/operations/drug-distributions/:id and display:
   - Header section: Distribution Number (large), Status Badge, Distribution Date
   - Information cards: From Location, To Department, Requested By, Approved By (if approved), Dispensed By (if dispensed)
   - Items table: Drug Name, Quantity Dispensed, Unit Cost, Lot Number, Expiry Date, Line Total
   - Summary: Total Items, Total Amount
   - Notes section (if notes exist)
   - Action buttons based on status

2. **WHEN** status is PENDING **THEN** system **SHALL** display action buttons: [Approve], [Cancel]

3. **WHEN** status is APPROVED **THEN** system **SHALL** display action buttons: [Dispense], [Cancel], [Preview Lots]

4. **WHEN** status is DISPENSED **THEN** system **SHALL** display action button: [Complete]

5. **WHEN** status is COMPLETED or CANCELLED **THEN** system **SHALL** display only [Print] button

6. **WHEN** items table displays **THEN** system **SHALL** show:
   - Drug trade name and generic name
   - Quantity with unit (e.g., "1,000 tablets")
   - Lot number (if dispensed, otherwise "Preview: LOT-XXX" from FIFO preview)
   - Expiry date formatted as "MMM YYYY" (e.g., "Mar 2026")
   - Days until expiry calculated (if dispensed)
   - Line total calculated (quantity × unit_cost)

7. **WHEN** expiry date is within 90 days **THEN** system **SHALL** display 🔴 warning icon next to expiry date

8. **WHEN** user clicks [Print] **THEN** system **SHALL** open print dialog with formatted distribution slip

9. **WHEN** detail page loads **THEN** system **SHALL** display audit trail timeline:
   - Created at {timestamp} by {requested_by}
   - Approved at {timestamp} by {approved_by} (if approved)
   - Dispensed at {timestamp} by {dispensed_by} (if dispensed)
   - Completed at {timestamp} (if completed)

### REQ-4: Approve Distribution Action

**User Story:** As a supervisor, I want to approve distribution requests after verifying policy compliance, so that pharmacy can proceed with dispensing.

#### Acceptance Criteria

1. **WHEN** user clicks [Approve] button **THEN** system **SHALL** open Approve Distribution dialog with:
   - Distribution summary (number, department, items count, total amount)
   - Approval form with field: Approved By (text input, pre-filled with current user name, required)
   - Stock re-validation message: "Re-checking stock availability..."
   - Warnings section (if any stock shortages detected)

2. **WHEN** dialog opens **THEN** system **SHALL** re-check stock availability for all items via backend

3. **IF** any item now has insufficient stock **THEN** system **SHALL**:
   - Display warning message "Stock changed since request. Insufficient stock for: {drug names}"
   - Disable [Approve] button
   - Show [Cancel Approval] button only

4. **IF** all items still have sufficient stock **THEN** system **SHALL** enable [Approve] button

5. **WHEN** user clicks [Approve] **THEN** system **SHALL**:
   - Call POST /api/inventory/operations/drug-distributions/:id/approve with {approvedBy}
   - Display success toast "Distribution approved: {distribution_number}"
   - Close dialog and refresh detail page
   - Update status badge to APPROVED
   - Show [Dispense] action button

6. **WHEN** API returns 400 INVALID_STATUS **THEN** system **SHALL** display error "Distribution must be PENDING to approve"

7. **WHEN** API returns 400 INSUFFICIENT_STOCK **THEN** system **SHALL** display error with drug details

### REQ-5: Cancel Distribution Action

**User Story:** As a supervisor, I want to cancel distribution requests when they don't comply with policy or stock is unavailable, so that resources are managed properly.

#### Acceptance Criteria

1. **WHEN** user clicks [Cancel] button **THEN** system **SHALL** open Cancel Distribution dialog with:
   - Distribution summary
   - Cancellation reason (textarea, required, placeholder: "Enter reason for cancellation...")
   - Warning message: "This action cannot be undone"

2. **WHEN** user enters reason and clicks [Confirm Cancel] **THEN** system **SHALL**:
   - Call POST /api/inventory/operations/drug-distributions/:id/cancel with {reason}
   - Display success toast "Distribution cancelled: {distribution_number}"
   - Close dialog and refresh detail page
   - Update status badge to CANCELLED
   - Gray out distribution and hide action buttons

3. **WHEN** API returns 400 INVALID_STATUS (e.g., already DISPENSED) **THEN** system **SHALL** display error "Cannot cancel dispensed distribution. Use Drug Return instead."

4. **WHEN** user clicks [Cancel] in dialog **THEN** system **SHALL** close dialog without cancelling distribution

### REQ-6: Dispense/Pick & Pack Dialog

**User Story:** As a pharmacist, I want to dispense drugs using guided FIFO/FEFO workflow, so that I pick correct lots and update inventory accurately.

#### Acceptance Criteria

1. **WHEN** user clicks [Dispense] button **THEN** system **SHALL** open Dispense/Pick & Pack dialog with:
   - Distribution header: To {department} | Date: {date}
   - Pick list table (FIFO order) with columns: Drug, Qty Needed, Pick From Lot, Lot Qty, Expiry Date, ☑ Picked
   - Form fields: Dispensed By (text input, pre-filled with current user), Confirmation checkboxes
   - [Complete Dispensing] button (disabled until all items checked)

2. **WHEN** dialog opens **THEN** system **SHALL**:
   - Call GET /api/inventory/operations/drug-distributions/:id/preview-lots
   - Display pick list with FIFO lot breakdown for each item
   - Show lot number, quantity to pick from each lot, expiry date, days until expiry

3. **WHEN** pick list displays **THEN** system **SHALL**:
   - Group lots by drug item
   - Display multiple lots per drug if quantity spans multiple lots
   - Highlight lots expiring within 90 days with 🔴 warning
   - Sort lots by FIFO order (oldest received first) within each drug group

4. **WHEN** pharmacist picks physical item **THEN** user **SHALL** check the ☑ Picked checkbox for that row

5. **WHEN** all items are checked ☑ **THEN** system **SHALL** enable confirmation checkboxes:
   - ☑ All items checked
   - ☑ Quantities verified
   - ☑ Expiry dates checked

6. **WHEN** all confirmation checkboxes are checked **THEN** system **SHALL** enable [Complete Dispensing] button

7. **WHEN** user clicks [Complete Dispensing] **THEN** system **SHALL**:
   - Call POST /api/inventory/operations/drug-distributions/:id/dispense with {dispensedBy, userId}
   - Show loading spinner "Dispensing and updating inventory..."
   - Wait for response (this triggers FIFO workflow, lot deduction, inventory update atomically)
   - Display success toast "Distribution dispensed: {distribution_number}. Inventory updated."
   - Close dialog and refresh detail page
   - Update status badge to DISPENSED
   - Show [Complete] action button

8. **WHEN** API returns 400 NO_FIFO_LOTS **THEN** system **SHALL** display error "No available lots for {drug_name}. Check inventory."

9. **WHEN** API returns transaction error **THEN** system **SHALL** display error "Dispensing failed. Inventory not updated. Please try again."

10. **WHEN** dispensing succeeds **THEN** system **SHALL** display lots used in success message: "Dispensed using lots: LOT-XXX (qty), LOT-YYY (qty)"

### REQ-7: Complete Distribution Dialog

**User Story:** As a department staff member, I want to confirm receipt of dispensed drugs, so that the distribution workflow is properly closed.

#### Acceptance Criteria

1. **WHEN** user clicks [Complete] button **THEN** system **SHALL** open Complete Distribution dialog with:
   - Distribution summary (number, items list with quantities)
   - Receipt confirmation form with field: Notes (textarea, optional, placeholder: "E.g., Received by Ward Nurse Jane")
   - Warning: "Please verify all items received before completing"

2. **WHEN** user clicks [Confirm Receipt] **THEN** system **SHALL**:
   - Call POST /api/inventory/operations/drug-distributions/:id/complete with {notes}
   - Display success toast "Distribution completed: {distribution_number}"
   - Close dialog and refresh detail page
   - Update status badge to COMPLETED ✅
   - Hide action buttons, show only [Print]

3. **WHEN** API returns 400 INVALID_STATUS **THEN** system **SHALL** display error "Distribution must be DISPENSED to complete"

4. **WHEN** user clicks [Cancel] **THEN** system **SHALL** close dialog without completing

### REQ-8: Preview FIFO Lots Action

**User Story:** As a pharmacist, I want to preview which lots will be used before dispensing, so that I can verify lot numbers and expiry dates.

#### Acceptance Criteria

1. **WHEN** user clicks [Preview Lots] button **THEN** system **SHALL** open Preview FIFO Lots dialog with:
   - Distribution header
   - Read-only pick list table (same format as Dispense dialog but without checkboxes)
   - Lot details: Lot Number, Quantity to Dispense, Unit Cost, Expiry Date, Days Until Expiry

2. **WHEN** dialog opens **THEN** system **SHALL** call GET /api/inventory/operations/drug-distributions/:id/preview-lots

3. **WHEN** lots display **THEN** system **SHALL**:
   - Group by drug item
   - Show FIFO order breakdown
   - Highlight expiring lots (<90 days) with 🔴 warning
   - Display total quantity per drug

4. **WHEN** user clicks [Close] **THEN** system **SHALL** close preview dialog and return to detail page

5. **WHEN** preview shows warnings **THEN** system **SHALL** display summary message: "⚠️ Warning: X lots expiring within 90 days"

### REQ-9: Department Distribution History

**User Story:** As an inventory manager, I want to view distribution history for a department, so that I can analyze drug consumption patterns.

#### Acceptance Criteria

1. **WHEN** user opens Department History page **THEN** system **SHALL** display:
   - Department selector (dropdown, required)
   - Date range picker (from date, to date, defaults to current month)
   - Status filter (dropdown: All/PENDING/APPROVED/DISPENSED/COMPLETED/CANCELLED)
   - [Export Report] button

2. **WHEN** user selects department and date range **THEN** system **SHALL**:
   - Call GET /api/inventory/operations/drug-distributions/by-department/:deptId with query filters
   - Display distributions table with columns: Distribution Number, Date, Status, Items, Total Amount
   - Display summary cards: Total Distributions, Total Value, Avg Value Per Distribution

3. **WHEN** "Include Items" toggle is enabled **THEN** system **SHALL** fetch distributions with items details and display expandable rows

4. **WHEN** user clicks distribution row **THEN** system **SHALL** expand row to show items list (if toggle enabled) or navigate to detail page

5. **WHEN** user clicks [Export Report] **THEN** system **SHALL** download Excel file with department history data

6. **WHEN** table displays **THEN** system **SHALL** sort by distribution_date DESC (newest first)

### REQ-10: Usage Report

**User Story:** As a finance manager, I want to see drug usage by department for cost allocation, so that I can charge departments accurately.

#### Acceptance Criteria

1. **WHEN** user opens Usage Report page **THEN** system **SHALL** display:
   - Filter controls: Department (dropdown, optional), Drug (autocomplete, optional), Date range (required)
   - [Generate Report] button

2. **WHEN** user clicks [Generate Report] **THEN** system **SHALL**:
   - Validate date range is provided
   - Call GET /api/inventory/operations/drug-distributions/usage-report with filters
   - Display usage table grouped by department and drug with columns:
     - Department Name
     - Drug Name (Trade + Generic)
     - Total Quantity Dispensed
     - Total Value
     - Distribution Count

3. **WHEN** table displays **THEN** system **SHALL**:
   - Group rows by department (expandable sections)
   - Show subtotals per department
   - Display grand total footer: Total Value, Total Distributions
   - Sort by total_value DESC (highest cost first)

4. **WHEN** user clicks [Export] **THEN** system **SHALL** download Excel file with:
   - Summary sheet (department totals)
   - Detail sheet (drug-level data)
   - Chart sheet (top 10 drugs by value)

5. **WHEN** no data matches filters **THEN** system **SHALL** display message "No distributions found for selected filters"

### REQ-11: Ministry Compliance Export

**User Story:** As a compliance officer, I want to export distribution data in DMSIC 2568 format, so that I can submit required reports to Ministry of Public Health.

#### Acceptance Criteria

1. **WHEN** user opens Ministry Export page **THEN** system **SHALL** display:
   - Date range picker (from date, to date, both required)
   - Format selector (radio buttons: CSV / Excel, default CSV)
   - Export button
   - Instructions: "Export will include all DISPENSED and COMPLETED distributions for selected date range in DMSIC 2568 format (11 fields)"

2. **WHEN** user clicks [Export] **THEN** system **SHALL**:
   - Validate fromDate and toDate are provided
   - Call GET /api/inventory/operations/drug-distributions/ministry-export with query params
   - Receive file download from backend
   - Trigger browser download with filename: distribution*export*{fromDate}\_{toDate}.csv or .xlsx

3. **WHEN** export file contains data **THEN** system **SHALL** include 11 DMSIC fields:
   - DISTNO (distribution number)
   - DISTDATE (distribution date)
   - DEPTCODE (department code)
   - DEPT_TYPE (consumption group)
   - DRUGCODE (drug code)
   - QTY (quantity dispensed)
   - UNITCOST (unit cost)
   - LOTNO (lot number)
   - EXPDATE (expiry date)
   - AMOUNT (total amount)
   - DISPENSER (pharmacist name)

4. **WHEN** export succeeds **THEN** system **SHALL** display success toast "Export downloaded: {filename}"

5. **WHEN** API returns error (e.g., date range too large) **THEN** system **SHALL** display error message

6. **WHEN** no data exists for date range **THEN** system **SHALL** display message "No distributions found for selected date range"

### REQ-12: Real-Time Updates via WebSocket

**User Story:** As a pharmacist, I want distribution statuses to update automatically when colleagues make changes, so that I always see current data without refreshing.

#### Acceptance Criteria

1. **WHEN** user is viewing Distribution List page **THEN** system **SHALL** subscribe to WebSocket channel 'distribution'

2. **WHEN** another user creates distribution **THEN** system **SHALL**:
   - Receive WebSocket event "distribution:created"
   - Add new row to table (if matches current filters)
   - Update "Total Distributions" stat card
   - Display toast notification: "New distribution created: {distribution_number}"

3. **WHEN** another user approves distribution **THEN** system **SHALL**:
   - Receive event "distribution:approved"
   - Update affected row status badge to APPROVED
   - Update action buttons
   - Display toast: "Distribution approved: {distribution_number}"

4. **WHEN** another user dispenses distribution **THEN** system **SHALL**:
   - Receive event "distribution:dispensed"
   - Update affected row status badge to DISPENSED
   - Update action buttons
   - Display toast: "Distribution dispensed: {distribution_number}"

5. **WHEN** user is viewing Distribution Detail page **THEN** system **SHALL** subscribe to specific distribution updates

6. **WHEN** distribution status changes **THEN** system **SHALL** refresh detail page data automatically

7. **WHEN** user navigates away from Distribution pages **THEN** system **SHALL** unsubscribe from WebSocket channels

8. **WHEN** WebSocket connection lost **THEN** system **SHALL** display warning "Real-time updates paused. Reconnecting..." and attempt reconnection

### REQ-13: Responsive Design and Mobile Support

**User Story:** As a mobile user, I want the distribution UI to work well on tablets and smartphones, so that I can manage distributions on-the-go.

#### Acceptance Criteria

1. **WHEN** application displays on screen width < 768px (tablet) **THEN** system **SHALL**:
   - Stack filter controls vertically
   - Show responsive data table with horizontal scroll
   - Resize buttons appropriately
   - Adjust dialog widths to fit screen

2. **WHEN** application displays on screen width < 480px (mobile) **THEN** system **SHALL**:
   - Convert tables to card layout (stacked)
   - Display critical info only (distribution number, status, amount)
   - Use bottom sheet instead of centered dialogs
   - Enlarge touch targets to minimum 44x44px

3. **WHEN** forms display on mobile **THEN** system **SHALL**:
   - Use native mobile keyboards (numeric for quantity, date pickers)
   - Adjust input sizes for touch
   - Minimize required scrolling

4. **WHEN** user rotates device **THEN** system **SHALL** adapt layout to new orientation

### REQ-14: Accessibility Compliance

**User Story:** As a user with disabilities, I want the distribution UI to be accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. **WHEN** user navigates with keyboard **THEN** system **SHALL**:
   - Support Tab key navigation through all interactive elements
   - Show visible focus indicators
   - Support Enter/Space for button activation
   - Support Escape to close dialogs

2. **WHEN** user uses screen reader **THEN** system **SHALL**:
   - Provide ARIA labels for all form fields
   - Announce status changes (e.g., "Distribution approved")
   - Describe icons with alt text
   - Use semantic HTML (header, nav, main, section)

3. **WHEN** status badges display **THEN** system **SHALL** use both color and text/icon for accessibility (not color alone)

4. **WHEN** errors occur **THEN** system **SHALL** announce errors to screen readers via aria-live regions

5. **WHEN** forms display **THEN** system **SHALL**:
   - Associate labels with inputs properly
   - Mark required fields with aria-required
   - Provide clear error messages linked to inputs

## Non-Functional Requirements

### Code Architecture and Modularity

- **Component Structure**: Each major view (List, Create, Detail) is a separate component
- **Smart/Dumb Components**: Container components (smart) manage state, presentation components (dumb) receive inputs
- **Service Layer**: DistributionService handles API calls, state management via Signals
- **Reusable Components**: Form controls, dialogs, tables extracted as shared components
- **Type Safety**: Full TypeScript interfaces for all API responses and form data

### Performance

- **Initial Load**: Distribution List page loads within 2 seconds on 3G connection
- **API Calls**: Debounced search inputs (300ms), cached reference data (locations, departments)
- **Pagination**: Default 20 items per page, lazy load on scroll (optional)
- **Image Optimization**: Use WebP format for icons, lazy load off-screen images
- **Bundle Size**: Lazy load feature modules, tree-shake unused code

### Security

- **Authentication**: All API calls include JWT token in Authorization header
- **Authorization**: Hide actions based on user permissions (e.g., only supervisors see [Approve])
- **Input Validation**: Client-side validation for all form inputs before API calls
- **XSS Prevention**: Sanitize user inputs, use Angular's built-in sanitization
- **CSRF Protection**: Include CSRF token in state-changing requests

### Reliability

- **Error Handling**: Graceful degradation on API errors, display user-friendly messages
- **Offline Support**: Display "You are offline" message, queue actions for retry (optional)
- **Data Consistency**: Refresh data after state-changing operations (create, approve, dispense, complete)
- **Retry Logic**: Automatic retry for failed API calls (max 3 attempts with exponential backoff)

### Usability

- **Loading States**: Display spinners during API calls, skeleton screens for initial load
- **Feedback**: Toast notifications for success/error, confirmation dialogs for destructive actions
- **Navigation**: Breadcrumbs for deep navigation, back buttons in dialogs
- **Search**: Instant search with debouncing, clear search button
- **Help**: Tooltips for complex fields, help icons with explanations

### Maintainability

- **Code Quality**: ESLint + Prettier enforced, strict TypeScript
- **Testing**: Unit tests for components (>70% coverage), E2E tests for critical workflows
- **Documentation**: JSDoc for public methods, README for feature modules
- **Logging**: Structured logs for errors, analytics events for user actions
- **Monitoring**: Track API response times, error rates, user engagement metrics
