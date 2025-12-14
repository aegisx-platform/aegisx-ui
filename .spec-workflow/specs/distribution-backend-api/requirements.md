# Requirements Document - Distribution Backend API

## Introduction

The **Distribution Backend API** provides comprehensive backend services for hospital drug distribution management with multi-level approval workflows, FIFO/FEFO lot tracking, and complete audit trails. This API serves as the core backend for the Drug Distribution system, managing:

- **Distribution Requests**: Department-to-department drug requests with stock availability validation
- **Approval Workflows**: Multi-level approval process (PENDING → APPROVED → DISPENSED → COMPLETED)
- **FIFO/FEFO Dispensing**: Automatic lot selection using inventory system's lot tracking functions
- **Real-time Stock Control**: Atomic inventory deduction with transaction logging
- **Department Usage Tracking**: Consumption reports and cost center allocation
- **Ministry Compliance**: DMSIC 2568 DISTRIBUTION export (11 fields) for regulatory reporting

**Value to Users:**

- Department staff can request drugs from pharmacy with real-time stock validation
- Supervisors can approve/reject distribution requests based on policy and availability
- Pharmacists can dispense drugs using FIFO/FEFO logic with automatic lot selection
- Department staff can confirm receipt and complete the distribution workflow
- Inventory managers can track drug consumption by department for usage analysis
- Finance officers can access distribution cost data for budget allocation
- Auditors can trace complete distribution history with lot-level traceability

## Alignment with Product Vision

This feature supports the **INVS Modern** vision of a comprehensive hospital drug inventory management system by:

1. **Streamline Procurement Process**: Reduces distribution request processing time by 50% through automated workflows and real-time stock validation
2. **Enhance Inventory Accuracy**: FIFO/FEFO lot tracking ensures proper drug rotation and minimizes waste from expired medications (target: 30% reduction)
3. **Ensure Ministry Compliance**: Supports DMSIC 2568 DISTRIBUTION export (11 fields) for regulatory reporting
4. **Support Data-Driven Decisions**: Department usage analysis enables informed inventory planning and budget allocation
5. **Improve Budget Control**: Tracks drug consumption by department for accurate cost center allocation

**Technical Alignment:**

- Follows AegisX platform standards (TypeBox schemas, Fastify routes, service layer pattern)
- Implements domain-driven design in `inventory/operations` domain
- Uses PostgreSQL schema `inventory` with 3 core tables (drug_distributions, drug_distribution_items, distribution_types)
- Integrates with Inventory API for FIFO/FEFO lot selection and stock updates
- Integrates with Master Data API for locations, departments, and drugs reference data
- Uses database functions for FIFO/FEFO logic (get_fifo_lots, get_fefo_lots)

**Integration Points:**

- **Distribution → Inventory**: Stock reduction using FIFO/FEFO logic, creates ISSUE transactions
- **Master Data → Distribution**: Locations, departments, drugs reference data
- **Distribution → Budget**: Department consumption tracking for cost allocation
- **Distribution → Ministry Reporting**: export_distribution view for compliance

## Requirements

### Phase 1: Distribution CRUD & Inquiry (Week 1)

#### REQ-1: List Distribution Requests

**User Story:** As a pharmacist, I want to view all distribution requests with status filtering, so that I can prioritize pending approvals and dispensing tasks.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions` **THEN** system **SHALL** return paginated list of distribution records
2. **WHEN** `status` query parameter provided **THEN** system **SHALL** filter by status (PENDING, APPROVED, DISPENSED, COMPLETED, CANCELLED)
3. **WHEN** `requestingDeptId` query parameter provided **THEN** system **SHALL** filter by requesting department
4. **WHEN** `fromLocationId` query parameter provided **THEN** system **SHALL** filter by source location
5. **WHEN** `fromDate` and `toDate` query parameters provided **THEN** system **SHALL** filter by distribution date range
6. **WHEN** `search` query parameter provided **THEN** system **SHALL** search by distribution number or requester name
7. **WHEN** distribution data returned **THEN** system **SHALL** include distribution header (number, date, status), requesting department, from/to locations, totals
8. **WHEN** distribution data returned **THEN** system **SHALL** include item count and total amount
9. **WHEN** `includeItems=true` parameter provided **THEN** system **SHALL** include distribution items with drug details
10. **IF** user has department restriction **THEN** system **SHALL** filter to show only authorized department requests

#### REQ-2: Get Distribution Details

**User Story:** As a department staff member, I want to view complete details of a distribution request including all items and lot information, so that I can verify what drugs were requested and dispensed.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions/:id` **THEN** system **SHALL** return complete distribution record
2. **IF** distribution not found **THEN** system **SHALL** return 404 with error code `DISTRIBUTION_NOT_FOUND`
3. **WHEN** distribution data returned **THEN** system **SHALL** include all header fields (number, date, status, locations, departments, totals)
4. **WHEN** distribution data returned **THEN** system **SHALL** include all distribution items with drug details (code, name, generic)
5. **WHEN** distribution data returned **THEN** system **SHALL** include lot information for each item (lot number, expiry date, unit cost)
6. **WHEN** distribution data returned **THEN** system **SHALL** include approval information (requested_by, approved_by, dispensed_by)
7. **WHEN** distribution data returned **THEN** system **SHALL** include timestamps (created_at, updated_at)
8. **WHEN** distribution data returned **THEN** system **SHALL** include notes field

#### REQ-3: List Distribution Items

**User Story:** As a pharmacist, I want to view all items for a specific distribution with lot details, so that I can prepare drugs for dispensing.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distribution-items?distributionId={id}` **THEN** system **SHALL** return list of items for that distribution
2. **WHEN** items returned **THEN** system **SHALL** include item number, drug details, quantity dispensed, lot information
3. **WHEN** items returned **THEN** system **SHALL** include unit cost and line total (quantity × unit_cost)
4. **WHEN** items returned **THEN** system **SHALL** include expiry date and days until expiry
5. **WHEN** items returned **THEN** system **SHALL** order by item_number ascending
6. **WHEN** distribution status is PENDING **THEN** system **SHALL** include preview of FIFO lots that will be used
7. **IF** distribution not found **THEN** system **SHALL** return empty array

#### REQ-4: Get Distribution Types

**User Story:** As a system administrator, I want to view available distribution types, so that I can categorize distributions properly.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/distribution-types` **THEN** system **SHALL** return list of distribution types
2. **WHEN** distribution types returned **THEN** system **SHALL** include id, name, description
3. **WHEN** distribution types returned **THEN** system **SHALL** include is_active flag
4. **WHEN** `activeOnly=true` parameter provided **THEN** system **SHALL** filter to active types only
5. **WHEN** distribution types returned **THEN** system **SHALL** order by name ascending

### Phase 2: Distribution Workflow Operations (Week 2)

#### REQ-5: Create Distribution Request

**User Story:** As a department staff member, I want to create a distribution request for drugs from pharmacy, so that my department can receive needed medications.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-distributions` **THEN** system **SHALL** validate that from_location_id exists in locations table
2. **WHEN** user calls `POST /api/inventory/operations/drug-distributions` **THEN** system **SHALL** validate that requesting_dept_id exists in departments table
3. **WHEN** distribution created **THEN** system **SHALL** check stock availability for each item at from_location
4. **IF** insufficient stock for any item **THEN** system **SHALL** return 400 error `INSUFFICIENT_STOCK` with details (requested vs available)
5. **WHEN** distribution created **THEN** system **SHALL** generate unique distribution_number in format DIST-{YYYY}-{MM}-{###}
6. **WHEN** distribution created **THEN** system **SHALL** set distribution_date to current date
7. **WHEN** distribution created **THEN** system **SHALL** set initial status to PENDING
8. **WHEN** distribution created **THEN** system **SHALL** create distribution items with item_number sequence (1, 2, 3...)
9. **WHEN** distribution created **THEN** system **SHALL** preview FIFO lots for each item using `get_fifo_lots()` function
10. **WHEN** distribution created **THEN** system **SHALL** populate lot_number, unit_cost, expiry_date from preview lots
11. **WHEN** distribution created **THEN** system **SHALL** calculate total_items (count of items)
12. **WHEN** distribution created **THEN** system **SHALL** calculate total_amount (sum of quantity × unit_cost)
13. **WHEN** distribution created **THEN** system **SHALL** record requested_by from authenticated user
14. **WHEN** all validations pass **THEN** system **SHALL** execute all operations in single atomic transaction
15. **IF** any step fails **THEN** system **SHALL** rollback all changes and return error

#### REQ-6: Approve Distribution Request

**User Story:** As a supervisor, I want to approve distribution requests after verifying policy compliance and stock availability, so that pharmacy can proceed with dispensing.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-distributions/:id/approve` **THEN** system **SHALL** validate that distribution exists
2. **IF** distribution not found **THEN** system **SHALL** return 404 with error code `DISTRIBUTION_NOT_FOUND`
3. **IF** distribution status is not PENDING **THEN** system **SHALL** return 400 error `INVALID_STATUS` with message "Distribution must be PENDING to approve"
4. **WHEN** approval requested **THEN** system **SHALL** re-check stock availability for all items (stock may have changed)
5. **IF** stock becomes insufficient **THEN** system **SHALL** return 400 error `INSUFFICIENT_STOCK` with details
6. **WHEN** approval successful **THEN** system **SHALL** update status to APPROVED
7. **WHEN** approval successful **THEN** system **SHALL** record approved_by from authenticated user
8. **WHEN** approval successful **THEN** system **SHALL** update updated_at timestamp
9. **WHEN** approval successful **THEN** system **SHALL** return updated distribution record
10. **IF** user lacks approval permission **THEN** system **SHALL** return 403 error `FORBIDDEN`

#### REQ-7: Reject/Cancel Distribution Request

**User Story:** As a supervisor, I want to reject or cancel distribution requests when they don't comply with policy or stock is unavailable, so that resources are managed properly.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-distributions/:id/cancel` **THEN** system **SHALL** validate that distribution exists
2. **IF** distribution status is DISPENSED or COMPLETED **THEN** system **SHALL** return 400 error `INVALID_STATUS` with message "Cannot cancel dispensed/completed distribution"
3. **WHEN** cancellation requested **THEN** system **SHALL** require cancellation reason in request body
4. **WHEN** cancellation successful **THEN** system **SHALL** update status to CANCELLED
5. **WHEN** cancellation successful **THEN** system **SHALL** store cancellation reason in notes field
6. **WHEN** cancellation successful **THEN** system **SHALL** update updated_at timestamp
7. **WHEN** cancellation successful **THEN** system **SHALL** return updated distribution record
8. **WHEN** distribution cancelled **THEN** system **SHALL NOT** make any inventory changes

#### REQ-8: Dispense Distribution (FIFO/FEFO)

**User Story:** As a pharmacist, I want to dispense drugs for approved distributions using FIFO/FEFO logic, so that inventory is automatically updated with proper lot tracking.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-distributions/:id/dispense` **THEN** system **SHALL** validate that distribution exists
2. **IF** distribution status is not APPROVED **THEN** system **SHALL** return 400 error `INVALID_STATUS` with message "Distribution must be APPROVED to dispense"
3. **WHEN** dispensing starts **THEN** system **SHALL** process each distribution item sequentially
4. **FOR** each item **WHEN** dispensing **THEN** system **SHALL** call `get_fifo_lots(drug_id, location_id, quantity)` to get lots in FIFO order
5. **IF** no lots available **THEN** system **SHALL** return 400 error `NO_FIFO_LOTS` with drug details
6. **FOR** each lot selected **WHEN** dispensing **THEN** system **SHALL** deduct quantity from drug_lots.quantity_available
7. **WHEN** lot quantity_available reaches 0 **THEN** system **SHALL** set lot is_active to false
8. **FOR** each item **WHEN** dispensing **THEN** system **SHALL** deduct quantity_dispensed from inventory.quantity_on_hand
9. **FOR** each item **WHEN** dispensing **THEN** system **SHALL** create inventory_transaction record with type ISSUE
10. **WHEN** transaction created **THEN** system **SHALL** record negative quantity (-quantity_dispensed), unit_cost, reference_id (distribution.id), reference_type 'distribution'
11. **WHEN** transaction created **THEN** system **SHALL** record notes "Distribution {number} to {department_name}"
12. **WHEN** all items dispensed **THEN** system **SHALL** update distribution status to DISPENSED
13. **WHEN** dispensing successful **THEN** system **SHALL** record dispensed_by from authenticated user
14. **WHEN** dispensing successful **THEN** system **SHALL** update updated_at timestamp
15. **WHEN** all steps complete **THEN** system **SHALL** execute all operations in single atomic transaction
16. **IF** any step fails **THEN** system **SHALL** rollback all changes and return error
17. **IF** user lacks dispensing permission **THEN** system **SHALL** return 403 error `FORBIDDEN`

#### REQ-9: Complete Distribution (Receipt Confirmation)

**User Story:** As a department staff member, I want to confirm receipt of dispensed drugs, so that the distribution workflow is properly closed.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-distributions/:id/complete` **THEN** system **SHALL** validate that distribution exists
2. **IF** distribution status is not DISPENSED **THEN** system **SHALL** return 400 error `INVALID_STATUS` with message "Distribution must be DISPENSED to complete"
3. **WHEN** completion requested **THEN** system **SHALL** update status to COMPLETED
4. **WHEN** completion requested **THEN** system **SHALL** optionally record notes from request body (e.g., "Received by Ward Nurse Jane")
5. **WHEN** completion successful **THEN** system **SHALL** update updated_at timestamp
6. **WHEN** completion successful **THEN** system **SHALL** return updated distribution record
7. **IF** user lacks completion permission **THEN** system **SHALL** return 403 error `FORBIDDEN`

#### REQ-10: Preview FIFO Lots Before Dispensing

**User Story:** As a pharmacist, I want to preview which lots will be used before dispensing, so that I can verify lot numbers and expiry dates.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions/:id/preview-lots` **THEN** system **SHALL** validate that distribution exists
2. **IF** distribution status is not APPROVED **THEN** system **SHALL** return 400 error `INVALID_STATUS`
3. **WHEN** preview requested **THEN** system **SHALL** call `get_fifo_lots()` for each distribution item
4. **WHEN** lots returned **THEN** system **SHALL** include lot_id, lot_number, quantity to dispense from this lot, unit_cost, expiry_date, days until expiry
5. **WHEN** lots returned **THEN** system **SHALL** group by distribution item with item_number and drug details
6. **WHEN** lots returned **THEN** system **SHALL** order lots within each item by FIFO order (oldest first)
7. **IF** insufficient lots for any item **THEN** system **SHALL** return warning with details

### Phase 3: Distribution Reporting & Integration (Week 3)

#### REQ-11: Get Distribution History by Department

**User Story:** As an inventory manager, I want to view distribution history for a department, so that I can analyze drug consumption patterns.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions/by-department/:deptId` **THEN** system **SHALL** return distributions for that department
2. **WHEN** `fromDate` and `toDate` parameters provided **THEN** system **SHALL** filter by date range
3. **WHEN** `status` parameter provided **THEN** system **SHALL** filter by status
4. **WHEN** distributions returned **THEN** system **SHALL** include distribution summary (number, date, status, total_amount)
5. **WHEN** distributions returned **THEN** system **SHALL** order by distribution_date descending (newest first)
6. **WHEN** `includeItems=true` parameter provided **THEN** system **SHALL** include detailed items with drug information
7. **WHEN** distributions returned **THEN** system **SHALL** include summary totals: count of distributions, total value dispensed

#### REQ-12: Get Distribution Usage Report

**User Story:** As a finance manager, I want to see drug usage by department for cost allocation, so that I can charge departments accurately.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions/usage-report` **THEN** system **SHALL** return department drug usage summary
2. **WHEN** `deptId` parameter provided **THEN** system **SHALL** filter to specific department
3. **WHEN** `drugId` parameter provided **THEN** system **SHALL** filter to specific drug
4. **WHEN** `fromDate` and `toDate` parameters provided **THEN** system **SHALL** filter by date range
5. **WHEN** report returned **THEN** system **SHALL** group by department and drug
6. **WHEN** report returned **THEN** system **SHALL** include department name, drug name (trade and generic), total quantity dispensed, total value
7. **WHEN** report returned **THEN** system **SHALL** include count of distributions for each department-drug combination
8. **WHEN** report returned **THEN** system **SHALL** order by total_value descending (highest cost first)
9. **WHEN** report returned **THEN** system **SHALL** include grand totals across all departments

#### REQ-13: Get Ministry Compliance Export

**User Story:** As a compliance officer, I want to export distribution data in DMSIC 2568 format, so that I can submit required reports to Ministry of Public Health.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-distributions/ministry-export` **THEN** system **SHALL** query export_distribution view
2. **WHEN** `fromDate` and `toDate` parameters provided **THEN** system **SHALL** filter by distribution date range
3. **WHEN** export data returned **THEN** system **SHALL** include all 11 DMSIC fields: DISTNO, DISTDATE, DEPTCODE, DEPT_TYPE, DRUGCODE, QTY, UNITCOST, LOTNO, EXPDATE, AMOUNT, DISPENSER
4. **WHEN** export data returned **THEN** system **SHALL** only include distributions with status DISPENSED or COMPLETED
5. **WHEN** export data returned **THEN** system **SHALL** format dates as YYYY-MM-DD
6. **WHEN** export data returned **THEN** system **SHALL** format decimals with 4 decimal places for costs, 3 for quantities
7. **WHEN** `format=csv` parameter provided **THEN** system **SHALL** return CSV file with headers
8. **WHEN** `format=excel` parameter provided **THEN** system **SHALL** return Excel file
9. **WHEN** export data returned **THEN** system **SHALL** include summary row with totals

#### REQ-14: Update Distribution Item

**User Story:** As a pharmacist, I want to update distribution item quantities before approval, so that I can correct mistakes in pending requests.

##### Acceptance Criteria

1. **WHEN** user calls `PUT /api/inventory/operations/drug-distribution-items/:id` **THEN** system **SHALL** validate that item exists
2. **WHEN** user calls `PUT /api/inventory/operations/drug-distribution-items/:id` **THEN** system **SHALL** get parent distribution status
3. **IF** parent distribution status is not PENDING **THEN** system **SHALL** return 400 error `INVALID_STATUS` with message "Cannot update items for non-pending distributions"
4. **WHEN** quantity updated **THEN** system **SHALL** re-check stock availability at from_location
5. **IF** new quantity exceeds available stock **THEN** system **SHALL** return 400 error `INSUFFICIENT_STOCK`
6. **WHEN** item updated **THEN** system **SHALL** re-preview FIFO lots for new quantity
7. **WHEN** item updated **THEN** system **SHALL** update lot_number, unit_cost, expiry_date from new preview
8. **WHEN** item updated **THEN** system **SHALL** recalculate parent distribution total_amount
9. **WHEN** update successful **THEN** system **SHALL** return updated item record

#### REQ-15: Delete Distribution Item

**User Story:** As a pharmacist, I want to remove items from pending distribution requests, so that I can correct mistakes before approval.

##### Acceptance Criteria

1. **WHEN** user calls `DELETE /api/inventory/operations/drug-distribution-items/:id` **THEN** system **SHALL** validate that item exists
2. **WHEN** user calls `DELETE /api/inventory/operations/drug-distribution-items/:id` **THEN** system **SHALL** get parent distribution status
3. **IF** parent distribution status is not PENDING **THEN** system **SHALL** return 400 error `INVALID_STATUS`
4. **WHEN** item deleted **THEN** system **SHALL** recalculate parent distribution total_items and total_amount
5. **IF** deleting last item **THEN** system **SHALL** return 400 error "Cannot delete last item, cancel distribution instead"
6. **WHEN** deletion successful **THEN** system **SHALL** return success response

## Workflow Requirements

### WF-1: Integration with Inventory System

**User Story:** As the system, I want to integrate with Inventory API for FIFO/FEFO lot selection and stock updates, so that distributions use proper lot tracking.

#### Acceptance Criteria

1. **WHEN** creating distribution **THEN** system **SHALL** call Inventory API to check stock availability
2. **WHEN** creating distribution **THEN** system **SHALL** call `get_fifo_lots()` database function to preview lots
3. **WHEN** dispensing distribution **THEN** system **SHALL** call `get_fifo_lots()` to select actual lots in FIFO order
4. **WHEN** dispensing distribution **THEN** system **SHALL** update inventory.quantity_on_hand via direct database access
5. **WHEN** dispensing distribution **THEN** system **SHALL** update drug_lots.quantity_available via direct database access
6. **WHEN** dispensing distribution **THEN** system **SHALL** create inventory_transactions records
7. **WHEN** any inventory operation fails **THEN** system **SHALL** rollback entire distribution transaction

### WF-2: Integration with Master Data

**User Story:** As the system, I want to validate locations and departments against Master Data, so that only valid references are used.

#### Acceptance Criteria

1. **WHEN** creating distribution **THEN** system **SHALL** validate from_location_id exists in locations table
2. **WHEN** creating distribution **THEN** system **SHALL** validate to_location_id exists in locations table (if provided)
3. **WHEN** creating distribution **THEN** system **SHALL** validate requesting_dept_id exists in departments table
4. **WHEN** creating distribution items **THEN** system **SHALL** validate drug_id exists in drugs table
5. **IF** any foreign key validation fails **THEN** system **SHALL** return 400 error with specific field name

### WF-3: Automatic Distribution Number Generation

**User Story:** As the system, I want to generate unique distribution numbers automatically, so that each distribution has a traceable identifier.

#### Acceptance Criteria

1. **WHEN** creating distribution **THEN** system **SHALL** generate distribution_number in format DIST-{YYYY}-{MM}-{###}
2. **WHEN** generating number **THEN** system **SHALL** find highest number for current year-month
3. **WHEN** generating number **THEN** system **SHALL** increment by 1 with zero-padding (001, 002, 003...)
4. **WHEN** new month starts **THEN** system **SHALL** reset sequence to 001
5. **WHEN** concurrent creations occur **THEN** system **SHALL** ensure unique numbers via database constraints

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each module (repository, service, controller) has single, well-defined purpose
- **Modular Design**: Distribution, DistributionItems, DistributionTypes isolated with clear boundaries
- **Dependency Management**: Service layer coordinates between repositories, no direct DB access in controllers
- **Clear Interfaces**: TypeBox schemas define contracts between layers
- **Transaction Management**: All multi-step operations wrapped in database transactions

### Performance

- **Response Time**: API endpoints respond within 500ms for 95% of requests
- **Pagination**: List endpoints support pagination with default page size 20, max 100
- **Database Indexing**: Indexes on distribution_number, status, requesting_dept_id, from_location_id, distribution_date for fast queries
- **FIFO Query Optimization**: get_fifo_lots() function uses indexed queries for sub-second response
- **Concurrent Operations**: Support 50 concurrent distribution creations without deadlocks

### Security

- **Authentication**: All endpoints require valid JWT token
- **Authorization**: Role-based access control (RBAC) enforced via permissions
- **Department Restriction**: Users can only create distributions for their assigned departments
- **Audit Trail**: All state changes logged with user ID and timestamp
- **Input Validation**: TypeBox schemas validate all inputs, prevent SQL injection
- **Rate Limiting**: 100 requests per minute per user

### Reliability

- **Atomic Transactions**: All multi-step operations succeed or fail completely (no partial updates)
- **Error Recovery**: Failed operations rollback cleanly without data corruption
- **Data Integrity**: Foreign key constraints prevent orphaned records
- **Idempotency**: Approval/dispensing operations can be retried safely
- **Availability**: 99.9% uptime during business hours (7am-7pm)

### Usability

- **Error Messages**: Clear, actionable error messages with error codes (INSUFFICIENT_STOCK, INVALID_STATUS, etc.)
- **API Documentation**: Auto-generated Swagger/OpenAPI docs at /documentation endpoint
- **Consistent Response Format**: All endpoints return standardized JSON structure
- **Search and Filter**: Flexible query parameters for list endpoints
- **Export Formats**: Support CSV and Excel export for reports

### Compliance

- **Ministry Reporting**: 100% compliance with DMSIC 2568 DISTRIBUTION format (11 fields)
- **Audit Trail**: Immutable transaction log for all inventory movements
- **Lot Traceability**: Complete lot-level tracking from receipt to dispensing
- **Data Retention**: Distribution records retained for 7 years minimum
- **Privacy**: No patient data stored in distribution records (department-level only)

### Scalability

- **Database Design**: PostgreSQL schema `inventory` supports millions of distributions
- **Partition Strategy**: Distribution tables can be partitioned by year for performance
- **Read Replicas**: Support read-only replicas for reporting queries
- **Caching**: Frequently accessed master data (locations, departments) cached in Redis
- **Horizontal Scaling**: Stateless API design allows multiple instances behind load balancer

### Maintainability

- **Code Quality**: ESLint, Prettier enforced via pre-commit hooks
- **Test Coverage**: 80% minimum code coverage for services and repositories
- **Documentation**: All public methods documented with JSDoc
- **Logging**: Structured JSON logs with correlation IDs for distributed tracing
- **Monitoring**: Prometheus metrics for request rate, error rate, response time
