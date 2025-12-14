# Requirements Document - Drug Return Backend API

## Introduction

The **Drug Return Backend API** provides comprehensive backend services for the hospital drug return management system. This API handles the complete lifecycle of drug returns from departments back to the pharmacy, including good/damaged separation, inventory updates, and disposal management.

**System Overview:**
The Drug Return system manages returns from departments/wards when they have:

- Excess stock (patient discharged, order cancelled)
- Expired or near-expiry drugs
- Damaged drugs (broken packaging, contamination)
- Wrong drugs (dispensing errors)
- Adverse drug reactions (ADR - patient cannot tolerate)

**Core Workflow:**

1. **Department creates return** → Records drugs to return with lot numbers and reasons
2. **Pharmacist verifies** → Physically inspects and separates good vs damaged quantities
3. **System posts to inventory** → Good drugs restocked, damaged moved to quarantine
4. **Disposal management** → Periodic disposal of damaged/expired drugs with committee approval

**Value to Users:**

- Department staff can return excess/unused drugs efficiently with proper documentation
- Pharmacists can verify and accept returns with good/damaged separation
- Inventory automatically updated with RETURN transactions and lot tracking
- Finance officers can track value of returned drugs for cost recovery
- Management can monitor return patterns to identify issues (overstocking, dispensing errors)
- Compliance team can maintain complete audit trail for regulatory inspections

**Technical Foundation:**

- 3 database tables: `drug_returns`, `drug_return_items`, `return_reasons`
- Status workflow: DRAFT → SUBMITTED → VERIFIED → POSTED
- Integration with Inventory API for stock updates and lot management
- Integration with Distribution API for original lot traceability
- Ministry compliance: Supports disposal documentation requirements

## Alignment with Product Vision

This feature supports the **INVS Modern** vision of a comprehensive hospital drug inventory management system by:

1. **Closed-Loop Inventory Management**: Completes the inventory cycle by handling returns, ensuring accurate stock levels across all locations
2. **Quality Control Integration**: Good/damaged separation ensures only quality drugs are restocked, maintaining pharmacy standards
3. **FIFO/FEFO Integrity**: Lot-based returns maintain traceability from distribution → usage → return → restock or disposal
4. **Waste Reduction**: Enables departments to return excess drugs for reuse instead of disposal, reducing costs
5. **Audit Trail Compliance**: Complete transaction history from return request to inventory posting for regulatory compliance
6. **Cross-System Integration**: Seamless data flow between Distribution, Drug Return, and Inventory systems

**Technical Alignment:**

- Follows AegisX platform standards (TypeBox schemas, Fastify routes, service layer pattern)
- Implements domain-driven design in `inventory/operations` domain
- Uses PostgreSQL schema `inventory` with transaction support
- Integrates with existing Inventory API for stock updates
- Reuses Distribution API patterns for lot validation

**Business Impact:**

- Reduces drug waste through efficient return and restock processes
- Improves inventory accuracy by accounting for all drug movements
- Enables cost recovery from returned drugs
- Supports quality management through damaged drug tracking

## Requirements

### Phase 1: CRUD Operations

#### REQ-1: List Drug Returns with Filters

**User Story:** As a pharmacist, I want to view all drug returns with filtering options, so that I can prioritize pending returns and track return history.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns` **THEN** system **SHALL** return paginated list of drug returns
2. **WHEN** `status` query parameter provided **THEN** system **SHALL** filter returns by status (DRAFT, SUBMITTED, VERIFIED, POSTED, CANCELLED)
3. **WHEN** `departmentId` query parameter provided **THEN** system **SHALL** filter returns by department
4. **WHEN** `dateFrom` and `dateTo` parameters provided **THEN** system **SHALL** filter by return_date range
5. **WHEN** `search` parameter provided **THEN** system **SHALL** search by return_number or department name
6. **WHEN** return data returned **THEN** system **SHALL** include department details, total items, total amount, and status
7. **WHEN** return data returned **THEN** system **SHALL** order by return_date DESC (newest first) by default
8. **IF** user has department restriction **THEN** system **SHALL** filter to show only returns from authorized departments

#### REQ-2: Get Return Details

**User Story:** As a pharmacist, I want to view complete details of a specific return including all items, so that I can verify and process the return.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns/:id` **THEN** system **SHALL** return complete return details
2. **IF** return not found **THEN** system **SHALL** return 404 with error code `RETURN_NOT_FOUND`
3. **WHEN** return details returned **THEN** system **SHALL** include all header fields (return_number, department, return_date, reason, status)
4. **WHEN** return details returned **THEN** system **SHALL** include all return items with drug details, lot numbers, quantities
5. **WHEN** return details returned **THEN** system **SHALL** include good_quantity and damaged_quantity for each item if verified
6. **WHEN** return details returned **THEN** system **SHALL** include return reason details from return_reasons table
7. **WHEN** return details returned **THEN** system **SHALL** include audit fields (created_by, verified_by, received_by, timestamps)

#### REQ-3: Create Drug Return Request

**User Story:** As a department staff member, I want to create a return request for excess or expired drugs, so that I can return them to the pharmacy properly.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-returns` **THEN** system **SHALL** validate that department_id exists
2. **WHEN** creating return **THEN** system **SHALL** auto-generate return_number in format RET-{YYYY}-{MM}-{###}
3. **WHEN** creating return **THEN** system **SHALL** validate that all item lot_numbers exist in drug_lots table
4. **WHEN** creating return **THEN** system **SHALL** validate that return_reason_id exists in return_reasons table
5. **WHEN** creating return **THEN** system **SHALL** set initial status to DRAFT
6. **WHEN** creating return **THEN** system **SHALL** calculate total_items count automatically
7. **WHEN** return items added **THEN** system **SHALL** require drug_id, total_quantity, lot_number, expiry_date, return_type (PURCHASED/FREE), location_id for each item
8. **WHEN** return created successfully **THEN** system **SHALL** return complete return details with generated return_number
9. **IF** any validation fails **THEN** system **SHALL** rollback transaction and return appropriate error

#### REQ-4: Update Draft Return

**User Story:** As a department staff member, I want to edit my draft return request before submitting, so that I can correct mistakes or add more items.

##### Acceptance Criteria

1. **WHEN** user calls `PUT /api/inventory/operations/drug-returns/:id` **THEN** system **SHALL** validate that return status is DRAFT
2. **IF** return status is not DRAFT **THEN** system **SHALL** return 400 error "Cannot edit return after submission"
3. **WHEN** updating return **THEN** system **SHALL** allow changes to return_reason, notes, and items
4. **WHEN** updating items **THEN** system **SHALL** validate lot numbers and quantities
5. **WHEN** updating items **THEN** system **SHALL** recalculate total_items count
6. **WHEN** update successful **THEN** system **SHALL** update updated_at timestamp
7. **WHEN** update successful **THEN** system **SHALL** return updated return details

#### REQ-5: Delete/Cancel Return

**User Story:** As a department staff member, I want to cancel a return request that I created by mistake, so that it doesn't clutter the system.

##### Acceptance Criteria

1. **WHEN** user calls `DELETE /api/inventory/operations/drug-returns/:id` **THEN** system **SHALL** validate that return status is DRAFT
2. **IF** return status is SUBMITTED or later **THEN** system **SHALL** use cancel workflow instead (status = CANCELLED)
3. **WHEN** deleting DRAFT return **THEN** system **SHALL** delete return items first, then return header
4. **WHEN** cancelling return (SUBMITTED/VERIFIED) **THEN** system **SHALL** update status to CANCELLED and record cancellation reason
5. **WHEN** cancelling return **THEN** system **SHALL** record cancelled_by user and cancelled_at timestamp
6. **IF** return already POSTED **THEN** system **SHALL** return 400 error "Cannot cancel posted return"
7. **WHEN** cancel successful **THEN** system **SHALL** return confirmation message

#### REQ-6: List Return Reasons

**User Story:** As a department staff member, I want to see available return reasons, so that I can select the appropriate reason for my return.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/return-reasons` **THEN** system **SHALL** return list of all active return reasons
2. **WHEN** return reasons returned **THEN** system **SHALL** include reason_code, reason_name, reason_category (CLINICAL, OPERATIONAL, QUALITY)
3. **WHEN** return reasons returned **THEN** system **SHALL** order by reason_category, then reason_name
4. **WHEN** `category` parameter provided **THEN** system **SHALL** filter by reason_category
5. **WHEN** return reasons returned **THEN** system **SHALL** include is_active flag

### Phase 2: Workflow Endpoints

#### REQ-7: Submit Return for Verification

**User Story:** As a department staff member, I want to submit my return request for pharmacist verification, so that the return can be processed.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-returns/:id/submit` **THEN** system **SHALL** validate that return status is DRAFT
2. **IF** return status is not DRAFT **THEN** system **SHALL** return 400 error "Return already submitted"
3. **WHEN** submitting return **THEN** system **SHALL** validate that return has at least 1 item
4. **WHEN** submitting return **THEN** system **SHALL** update status to SUBMITTED
5. **WHEN** submitting return **THEN** system **SHALL** record submitted_at timestamp
6. **WHEN** submit successful **THEN** system **SHALL** send notification to pharmacy department (via event bus)
7. **WHEN** submit successful **THEN** system **SHALL** return updated return details with SUBMITTED status

#### REQ-8: Verify and Separate Good/Damaged Quantities

**User Story:** As a pharmacist, I want to verify returned drugs and separate good vs damaged quantities, so that only quality drugs are restocked.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-returns/:id/verify` **THEN** system **SHALL** validate that return status is SUBMITTED
2. **IF** return status is not SUBMITTED **THEN** system **SHALL** return 400 error "Return must be submitted before verification"
3. **WHEN** verifying return **THEN** system **SHALL** require good_quantity and damaged_quantity for each item
4. **WHEN** verifying return **THEN** system **SHALL** validate that `total_quantity = good_quantity + damaged_quantity` for each item
5. **IF** quantities don't match **THEN** system **SHALL** return 400 error with item details "Good + Damaged must equal Total"
6. **WHEN** verification data valid **THEN** system **SHALL** update all items with good_quantity and damaged_quantity
7. **WHEN** verification successful **THEN** system **SHALL** update status to VERIFIED
8. **WHEN** verification successful **THEN** system **SHALL** record verified_by user and verified_at timestamp
9. **WHEN** verification successful **THEN** system **SHALL** calculate total_amount based on good_quantity × unit_cost
10. **WHEN** verification successful **THEN** system **SHALL** return updated return details with VERIFIED status

#### REQ-9: Post Return to Inventory

**User Story:** As a pharmacist, I want to post verified returns to inventory, so that good drugs are automatically restocked and damaged drugs moved to quarantine.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-returns/:id/post` **THEN** system **SHALL** validate that return status is VERIFIED
2. **IF** return status is not VERIFIED **THEN** system **SHALL** return 400 error "Return must be verified before posting"
3. **WHEN** posting return **THEN** system **SHALL** process within database transaction for atomicity
4. **FOR EACH** item with good_quantity > 0:
   - **THEN** system **SHALL** find or create inventory record for (drug_id, location_id)
   - **THEN** system **SHALL** increment inventory.quantity_on_hand by good_quantity
   - **THEN** system **SHALL** find or create drug lot with matching lot_number
   - **THEN** system **SHALL** increment drug_lot.quantity_available by good_quantity
   - **THEN** system **SHALL** create inventory_transaction with type = RETURN and reference to return
5. **FOR EACH** item with damaged_quantity > 0:
   - **THEN** system **SHALL** find QUARANTINE location (location_code = 'QUARANTINE')
   - **IF** QUARANTINE not found **THEN** system **SHALL** return 400 error "Quarantine location not configured"
   - **THEN** system **SHALL** create drug lot in QUARANTINE with lot_number suffix "-DMG"
   - **THEN** system **SHALL** set lot is_active = false (for disposal only)
6. **WHEN** all items processed **THEN** system **SHALL** update return status to POSTED
7. **WHEN** posting successful **THEN** system **SHALL** record received_by user and posted_at timestamp
8. **WHEN** posting successful **THEN** system **SHALL** return posting summary (items restocked, items quarantined)
9. **IF** any step fails **THEN** system **SHALL** rollback entire transaction and return error

#### REQ-10: Cancel Return Workflow

**User Story:** As a department manager, I want to cancel a return request that is no longer needed, so that it doesn't proceed to posting.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-returns/:id/cancel` **THEN** system **SHALL** validate that return status is SUBMITTED or VERIFIED
2. **IF** return already POSTED **THEN** system **SHALL** return 400 error "Cannot cancel posted return"
3. **WHEN** cancelling return **THEN** system **SHALL** require cancellation_reason
4. **WHEN** cancel successful **THEN** system **SHALL** update status to CANCELLED
5. **WHEN** cancel successful **THEN** system **SHALL** record cancelled_by user, cancelled_at timestamp, and cancellation_reason
6. **WHEN** cancel successful **THEN** system **SHALL** send notification to requester
7. **WHEN** cancel successful **THEN** system **SHALL** return updated return details with CANCELLED status

### Phase 3: Inventory Integration

#### REQ-11: Create Inventory Transactions for Returns

**User Story:** As a system, I want to create proper inventory transactions for all returns, so that there is complete audit trail of stock movements.

##### Acceptance Criteria

1. **WHEN** return is posted **THEN** system **SHALL** create inventory_transaction record for each item with good_quantity > 0
2. **WHEN** creating transaction **THEN** system **SHALL** set transaction_type = RETURN
3. **WHEN** creating transaction **THEN** system **SHALL** set quantity = good_quantity (positive number for stock increase)
4. **WHEN** creating transaction **THEN** system **SHALL** set reference_type = "drug_return" and reference_id = return.id
5. **WHEN** creating transaction **THEN** system **SHALL** include notes with department name, lot number, and quantities
6. **WHEN** creating transaction **THEN** system **SHALL** record created_by user
7. **WHEN** transaction created **THEN** system **SHALL** ensure transaction is immutable (no updates allowed)

#### REQ-12: Update Inventory Quantities

**User Story:** As a system, I want to update inventory quantities correctly when returns are posted, so that stock levels are accurate.

##### Acceptance Criteria

1. **WHEN** posting return with good_quantity **THEN** system **SHALL** find inventory record by (drug_id, location_id)
2. **IF** inventory record not found **THEN** system **SHALL** create new inventory record with quantity = good_quantity
3. **IF** inventory record exists **THEN** system **SHALL** increment quantity_on_hand by good_quantity
4. **WHEN** updating inventory **THEN** system **SHALL** update last_updated timestamp
5. **WHEN** creating new inventory **THEN** system **SHALL** initialize average_cost and last_cost to 0 (will be updated by costing system)
6. **WHEN** inventory updated **THEN** system **SHALL** return updated inventory details

#### REQ-13: Update/Create Drug Lots

**User Story:** As a system, I want to update or create drug lots when returns are posted, so that lot traceability is maintained.

##### Acceptance Criteria

1. **WHEN** posting return with good_quantity **THEN** system **SHALL** search for existing lot by (drug_id, location_id, lot_number)
2. **IF** lot found **THEN** system **SHALL** increment lot.quantity_available by good_quantity
3. **IF** lot found **THEN** system **SHALL** set is_active = true (reactivate if was inactive)
4. **IF** lot not found **THEN** system **SHALL** create new lot with:
   - drug_id, location_id, lot_number, expiry_date from return item
   - quantity_available = good_quantity
   - unit_cost = 0 (will be updated by costing system)
   - received_date = return.return_date
   - is_active = true
5. **WHEN** lot created/updated **THEN** system **SHALL** validate expiry_date is in future
6. **IF** expiry_date < current_date **THEN** system **SHALL** log warning but allow creation (for audit purposes)

#### REQ-14: Move Damaged Drugs to Quarantine

**User Story:** As a system, I want to move damaged drugs to quarantine location when returns are posted, so that they are isolated for disposal.

##### Acceptance Criteria

1. **WHEN** posting return with damaged_quantity > 0 **THEN** system **SHALL** find QUARANTINE location
2. **IF** QUARANTINE location not found **THEN** system **SHALL** return 400 error "Quarantine location not configured"
3. **WHEN** moving to quarantine **THEN** system **SHALL** create new drug lot in QUARANTINE with:
   - lot_number = original_lot_number + "-DMG" suffix
   - quantity_available = damaged_quantity
   - is_active = false (cannot be used for distribution)
   - notes = "Damaged return from {department_name}. Reason: {return_reason}"
4. **WHEN** quarantine lot created **THEN** system **SHALL** record source return information
5. **WHEN** quarantine lot created **THEN** system **SHALL** return quarantine lot details

#### REQ-15: Validate Lot Traceability

**User Story:** As a system, I want to validate that returned lots match original distribution lots, so that returns are traceable to their source.

##### Acceptance Criteria

1. **WHEN** creating return item **THEN** system **SHALL** validate that lot_number exists in drug_lots table
2. **WHEN** validating lot **THEN** system **SHALL** validate that lot belongs to the specified drug_id
3. **WHEN** validating lot **THEN** system **SHALL** check if lot was distributed to the returning department (optional validation)
4. **IF** lot not found **THEN** system **SHALL** return 400 error "Invalid lot number for this drug"
5. **WHEN** lot valid **THEN** system **SHALL** allow return creation
6. **WHEN** return posted **THEN** system **SHALL** maintain link to original lot in transaction notes

### Phase 4: Reporting & Analytics

#### REQ-16: Return History by Department

**User Story:** As a department manager, I want to view return history for my department, so that I can identify patterns and improve ordering.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns/department/:departmentId/history` **THEN** system **SHALL** return list of returns for that department
2. **WHEN** `dateFrom` and `dateTo` parameters provided **THEN** system **SHALL** filter by return_date range
3. **WHEN** `status` parameter provided **THEN** system **SHALL** filter by status
4. **WHEN** return history returned **THEN** system **SHALL** include summary statistics:
   - Total returns count
   - Total items returned
   - Total value of returns
   - Return reasons breakdown
5. **WHEN** return history returned **THEN** system **SHALL** order by return_date DESC
6. **WHEN** return history returned **THEN** system **SHALL** include item details for each return

#### REQ-17: Damaged Drugs Summary

**User Story:** As a quality manager, I want to see summary of damaged drugs returned, so that I can identify quality issues with vendors or storage.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns/damaged-summary` **THEN** system **SHALL** return summary of all damaged quantities
2. **WHEN** `dateFrom` and `dateTo` parameters provided **THEN** system **SHALL** filter by return_date range
3. **WHEN** damaged summary returned **THEN** system **SHALL** group by drug and show:
   - Drug name and code
   - Total damaged quantity
   - Number of returns with damage
   - Most common damage reasons
   - Total value of damaged drugs
4. **WHEN** damaged summary returned **THEN** system **SHALL** order by total damaged quantity DESC
5. **WHEN** damaged summary returned **THEN** system **SHALL** include percentage of total returns that were damaged

#### REQ-18: Quarantine Stock Report

**User Story:** As a pharmacist, I want to view all drugs currently in quarantine, so that I can plan for disposal.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns/quarantine` **THEN** system **SHALL** return list of drug lots in QUARANTINE location
2. **WHEN** quarantine stock returned **THEN** system **SHALL** filter to lots with is_active = false
3. **WHEN** quarantine stock returned **THEN** system **SHALL** include:
   - Drug details (name, code)
   - Lot number and expiry date
   - Quantity in quarantine
   - Days in quarantine (since lot created)
   - Source return information
4. **WHEN** quarantine stock returned **THEN** system **SHALL** order by days_in_quarantine DESC (oldest first)
5. **WHEN** quarantine stock returned **THEN** system **SHALL** include summary: total items, total quantity, total value

#### REQ-19: Return Statistics Dashboard

**User Story:** As management, I want to view return statistics and trends, so that I can make informed decisions about procurement and inventory management.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-returns/statistics` **THEN** system **SHALL** return comprehensive statistics
2. **WHEN** `period` parameter provided (daily, weekly, monthly, yearly) **THEN** system **SHALL** aggregate by specified period
3. **WHEN** statistics returned **THEN** system **SHALL** include:
   - Total returns count by status
   - Total value returned (good + damaged)
   - Average processing time (submitted to posted)
   - Top 10 most returned drugs
   - Return reasons distribution
   - Good vs damaged ratio
   - Returns by department ranking
4. **WHEN** statistics returned **THEN** system **SHALL** include trend data (comparison with previous period)
5. **WHEN** statistics returned **THEN** system **SHALL** return data in format suitable for charts/graphs

### Phase 5: Disposal Management (Optional)

#### REQ-20: Create Disposal Document

**User Story:** As a pharmacy manager, I want to create disposal documents for quarantined drugs, so that I can properly document drug destruction.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-disposals` **THEN** system **SHALL** require array of quarantine lot IDs
2. **WHEN** creating disposal **THEN** system **SHALL** validate that all lots exist and are in QUARANTINE (is_active = false)
3. **WHEN** creating disposal **THEN** system **SHALL** require disposal_method (INCINERATION, CHEMICAL_DESTRUCTION, RETURN_TO_VENDOR)
4. **WHEN** creating disposal **THEN** system **SHALL** require minimum 3 committee members (chairman, member, secretary)
5. **WHEN** disposal created **THEN** system **SHALL** auto-generate disposal_number in format DISP-{YYYY}-{MM}-{###}
6. **WHEN** disposal created **THEN** system **SHALL** set status to PENDING
7. **WHEN** disposal created **THEN** system **SHALL** calculate total_items and total_quantity from selected lots
8. **WHEN** disposal created **THEN** system **SHALL** return disposal details with items

#### REQ-21: Disposal Committee Management

**User Story:** As a pharmacy manager, I want to assign committee members to disposal documents, so that proper authorities approve drug destruction.

##### Acceptance Criteria

1. **WHEN** creating disposal **THEN** system **SHALL** create records in disposal_committee table for each member
2. **WHEN** adding committee member **THEN** system **SHALL** require user_id and role (CHAIRMAN, MEMBER, SECRETARY)
3. **WHEN** committee member assigned **THEN** system **SHALL** validate that user exists and has appropriate permissions
4. **WHEN** disposal has fewer than 3 members **THEN** system **SHALL** prevent completion
5. **WHEN** all members assigned **THEN** system **SHALL** allow disposal completion

#### REQ-22: Complete Disposal with Evidence

**User Story:** As a pharmacy manager, I want to mark disposal as complete with photo evidence, so that there is proof of drug destruction.

##### Acceptance Criteria

1. **WHEN** user calls `POST /api/inventory/operations/drug-disposals/:id/complete` **THEN** system **SHALL** validate that disposal status is PENDING
2. **WHEN** completing disposal **THEN** system **SHALL** require at least 3 committee signatures
3. **WHEN** completing disposal **THEN** system **SHALL** require photo evidence URLs (minimum 2 photos)
4. **WHEN** completing disposal **THEN** system **SHALL** process within transaction:
   - Update all quarantine lots: set quantity_available = 0
   - Update all quarantine lots: append disposal notes
   - Update disposal status to COMPLETED
   - Record completed_at timestamp
5. **WHEN** disposal completed **THEN** system **SHALL** store photo URLs in disposal record
6. **WHEN** disposal completed **THEN** system **SHALL** return completion confirmation
7. **IF** any step fails **THEN** system **SHALL** rollback transaction and return error

#### REQ-23: List Disposal Documents

**User Story:** As a compliance officer, I want to view all disposal documents, so that I can audit drug destruction processes.

##### Acceptance Criteria

1. **WHEN** user calls `GET /api/inventory/operations/drug-disposals` **THEN** system **SHALL** return paginated list of disposals
2. **WHEN** `status` parameter provided **THEN** system **SHALL** filter by status (PENDING, COMPLETED)
3. **WHEN** `dateFrom` and `dateTo` parameters provided **THEN** system **SHALL** filter by disposal_date range
4. **WHEN** disposal list returned **THEN** system **SHALL** include:
   - Disposal number and date
   - Disposal method
   - Total items and quantity
   - Committee members
   - Status
5. **WHEN** disposal list returned **THEN** system **SHALL** order by disposal_date DESC
6. **WHEN** `includeItems=true` **THEN** system **SHALL** include detailed item list for each disposal

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each file should have a single, well-defined purpose
  - Controllers handle HTTP request/response only
  - Services contain business logic and validation
  - Repositories handle database operations only
  - Schemas define data structures and validation rules

- **Modular Design**: Components should be isolated and reusable
  - Drug return workflow logic separate from inventory updates
  - Quarantine management reusable across different contexts
  - Disposal logic independent of return logic

- **Dependency Management**: Minimize interdependencies between modules
  - Drug Return API depends on Inventory API for stock updates
  - Drug Return API depends on Master Data API for drugs/departments/locations
  - No circular dependencies between services

- **Clear Interfaces**: Define clean contracts between components
  - TypeBox schemas for all API inputs and outputs
  - Service layer interfaces documented with JSDoc
  - Repository methods with clear parameter and return types

### Performance

- **Response Time**:
  - List operations: < 500ms for 100 records
  - Single record retrieval: < 200ms
  - Create/update operations: < 1s
  - Post to inventory: < 3s (includes inventory transactions)

- **Concurrency**:
  - Support 50 concurrent return requests
  - Handle 10 concurrent posting operations
  - Database connection pooling (max 20 connections)

- **Scalability**:
  - Horizontal scaling via stateless API design
  - Database indexing on frequently queried fields (status, department_id, return_date)
  - Pagination for all list endpoints (max 100 records per page)

### Security

- **Authentication**:
  - JWT-based authentication for all endpoints
  - Token validation on every request
  - Session timeout after 8 hours

- **Authorization**:
  - Role-based access control (RBAC)
  - Department-level data access restrictions
  - Pharmacists can verify/post all returns
  - Department staff can only create/view their own returns
  - Finance managers can view all returns for reporting

- **Data Protection**:
  - Input validation using TypeBox schemas
  - SQL injection prevention via parameterized queries
  - No sensitive data in logs
  - Audit trail for all status changes

### Reliability

- **Data Integrity**:
  - Database transactions for multi-step operations
  - Rollback on any failure during posting
  - Foreign key constraints to prevent orphaned records
  - Check constraints for quantity validations (good + damaged = total)

- **Error Handling**:
  - Graceful error handling with user-friendly messages
  - Detailed error logging for troubleshooting
  - Retry logic for transient failures
  - Circuit breaker for external API calls

- **Availability**:
  - 99.9% uptime SLA
  - Database backup every 24 hours
  - Point-in-time recovery capability
  - Health check endpoint for monitoring

### Usability

- **API Design**:
  - RESTful URL conventions
  - Consistent error response format
  - Pagination metadata in responses
  - Clear HTTP status codes (200, 201, 400, 404, 500)

- **Documentation**:
  - OpenAPI/Swagger documentation auto-generated
  - Example requests and responses
  - Error code reference
  - Integration guide for frontend developers

- **Logging**:
  - Structured JSON logging
  - Request ID for tracing
  - Operation timestamps
  - User action audit trail

### Maintainability

- **Code Quality**:
  - TypeScript strict mode enabled
  - ESLint rules enforced
  - Unit test coverage > 80%
  - Integration test coverage for critical workflows

- **Database**:
  - Database schema versioning
  - Migration scripts for schema changes
  - Seed data for development/testing
  - Index optimization for query performance
