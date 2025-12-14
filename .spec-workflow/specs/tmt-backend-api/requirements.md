# Requirements Document: TMT Backend API

## Introduction

The **TMT Backend API** (Thai Medical Terminology Integration API) provides RESTful endpoints for managing the standardized drug terminology system required by Thailand's Ministry of Public Health (MOPH). This API enables:

1. **TMT Concepts Management** - Access to 76,904 Thai Medical Terminology concepts across 5 hierarchical levels
2. **Drug-to-TMT Mapping** - Pharmacist-verified mapping between hospital drugs and TMT standard codes
3. **Compliance Tracking** - Real-time monitoring of TMT mapping coverage (target: ≥95%)
4. **Ministry Reporting** - Export data in DMSIC Standards พ.ศ. 2568 format

**Business Value:**

- Ensures 100% compliance with Ministry of Public Health reporting standards
- Reduces manual effort in drug standardization by 70% through AI-assisted mapping
- Provides real-time compliance visibility to prevent ministry audit issues
- Enables accurate drug usage statistics for national health planning

**Context:**

- Part of INVS Modern Hospital Inventory Management System
- Phase 3 priority feature (Ministry Requirement)
- Current status: 561 drugs mapped (47.99% coverage) - requires improvement to meet 95% target
- Integration with existing `inventory` schema (PostgreSQL)

## Alignment with Product Vision

This API directly supports the following system goals:

1. **Ministry Compliance** (from BRD Section 1.2)
   - Achieves 100% DMSIC Standards พ.ศ. 2568 compliance
   - Provides required TMT code in DRUGLIST export (field 10)
   - Enables quarterly ministry reporting

2. **Data-Driven Decisions** (from BRD Section 1.2)
   - Tracks TMT mapping coverage trends
   - Identifies high-usage unmapped drugs for priority action
   - Provides compliance analytics dashboard

3. **Operational Efficiency**
   - AI-assisted mapping suggestions reduce pharmacist workload
   - Batch mapping operations for faster compliance achievement
   - Cached TMT concept lookups for sub-second search performance

## Requirements

### Requirement 1: TMT Concepts Search and Lookup

**User Story:** As a **pharmacist**, I want to **search and browse TMT concepts by name, code, or hierarchy level**, so that **I can find the correct TMT standard code to map to hospital drugs**.

#### Acceptance Criteria

1. WHEN pharmacist searches TMT concepts by Thai/English name THEN system SHALL return matching concepts within 1 second with fuzzy matching support
2. WHEN pharmacist filters by TMT level (VTM, GP, GPU, TP, TPU) THEN system SHALL return only concepts at that hierarchy level
3. WHEN pharmacist views a TMT concept THEN system SHALL display full hierarchy (parent → current → children) with relationship types
4. WHEN pharmacist paginates search results THEN system SHALL return configurable page size (default 20, max 100) with total count
5. IF TMT concept has children THEN system SHALL indicate count of child concepts and allow drill-down navigation

**Technical Notes:**

- Search across `tmt_concepts.preferred_term`, `tmt_concepts.fsn`, `tmt_concepts.concept_code`
- Support case-insensitive, partial matching
- Include parent concept data in response for context
- Return drug mapping count per concept for usage insights

---

### Requirement 2: Drug-to-TMT Mapping Management

**User Story:** As a **pharmacist**, I want to **create, update, and verify mappings between hospital drugs and TMT concepts**, so that **the hospital meets Ministry compliance requirements (≥95% coverage)**.

#### Acceptance Criteria

1. WHEN pharmacist creates a new drug-TMT mapping THEN system SHALL validate that both drug and TMT concept exist before saving
2. WHEN pharmacist maps a drug that already has TMT mapping THEN system SHALL reject with error code `MAPPING_EXISTS` and HTTP 409
3. WHEN pharmacist saves a mapping THEN system SHALL require pharmacist verification flag and record verified_by user ID with timestamp
4. WHEN pharmacist updates an existing mapping THEN system SHALL preserve audit trail (created_at, created_by, updated_at, updated_by)
5. IF mapping targets invalid TMT level (not VTM/GP/GPU/TP/TPU) THEN system SHALL reject with error code `INVALID_TMT_LEVEL` and HTTP 400
6. WHEN pharmacist deletes a mapping THEN system SHALL soft-delete (mark is_active=false) to maintain audit history

**Business Rules:**

- One-to-one mapping: Each drug can have only ONE active TMT mapping
- Preferred mapping level: GP (Generic Product) or TP (Trade Product)
- Verification required: All mappings must be verified by qualified pharmacist (role check)
- Mapping within 7 days: New drugs should be mapped within 7 days of creation

---

### Requirement 3: AI-Assisted Mapping Suggestions

**User Story:** As a **pharmacist**, I want to **receive AI-suggested TMT matches for unmapped drugs with confidence scores**, so that **I can quickly map drugs without manual searching**.

#### Acceptance Criteria

1. WHEN pharmacist requests mapping suggestions for a drug THEN system SHALL search TMT concepts using drug's generic name + strength + dosage form
2. WHEN system generates suggestions THEN system SHALL calculate confidence score (0-100%) based on name similarity (50%), strength match (30%), and dosage form match (20%)
3. WHEN system returns suggestions THEN system SHALL rank by confidence score descending and return top 10 matches
4. IF confidence score ≥ 90% THEN system SHALL flag as "HIGH" confidence
5. IF confidence score 70-89% THEN system SHALL flag as "MEDIUM" confidence
6. IF confidence score < 70% THEN system SHALL flag as "LOW" confidence and recommend manual verification
7. WHEN pharmacist accepts a suggestion THEN system SHALL create mapping with suggestion metadata (confidence score, matched_fields)

**Technical Notes:**

- Use Levenshtein distance or trigram similarity for name matching
- Exact match on strength and dosage_form for higher confidence
- Consider TMT level appropriateness (prefer GP/TP over VTM)

---

### Requirement 4: Compliance Rate Monitoring

**User Story:** As a **finance manager** or **pharmacist**, I want to **view real-time TMT mapping compliance rate and unmapped drugs list**, so that **I can track progress toward the 95% Ministry target**.

#### Acceptance Criteria

1. WHEN user requests compliance report THEN system SHALL calculate: (mapped_drugs / total_active_drugs) × 100%
2. WHEN displaying compliance THEN system SHALL show breakdown: total drugs, mapped (verified), unmapped, coverage percentage
3. WHEN compliance rate < 95% THEN system SHALL flag as "NON_COMPLIANT" with warning indicator
4. WHEN compliance rate ≥ 95% THEN system SHALL flag as "COMPLIANT" with success indicator
5. WHEN user requests unmapped drugs THEN system SHALL return list sorted by usage count descending (prioritize high-usage drugs)
6. IF drug unmapped > 7 days THEN system SHALL flag as "OVERDUE" priority
7. WHEN system generates compliance report THEN system SHALL include trend data (last 6 months) and compliance breakdown by TMT level

**Data Included:**

- Total active drugs count
- Mapped drugs count (verified only)
- Unmapped drugs count with details (code, name, usage, days_unmapped)
- Compliance rate percentage
- Breakdown by confidence level (HIGH/MEDIUM/LOW)
- Breakdown by TMT level (VTM/GP/GPU/TP/TPU)

---

### Requirement 5: Ministry Export and Reporting

**User Story:** As a **finance manager**, I want to **generate and export TMT mapping data in Ministry-compliant format**, so that **I can submit quarterly DMSIC reports to MOPH**.

#### Acceptance Criteria

1. WHEN user generates ministry export THEN system SHALL include all mapped drugs with TMT code in DRUGLIST format (11 fields)
2. WHEN export includes unmapped drugs THEN system SHALL use default TMT code (0000000000) with flag `is_mapped=false`
3. WHEN generating report THEN system SHALL validate 100% data completeness (no null TMT codes for mapped drugs)
4. WHEN export completes THEN system SHALL save report metadata to `ministry_reports` table with timestamp and compliance_rate
5. IF compliance rate < 95% during export THEN system SHALL include warning note in report header
6. WHEN user downloads export THEN system SHALL provide formats: CSV, Excel (XLSX), JSON

**DRUGLIST Export Fields:**

1. DRUGCODE - Hospital drug code
2. DRUGNAME - Trade name
3. WORKINGCODE - Working code
4. **TMTCODE** - TMT code (required)
5. TMTLEVEL - TMT hierarchy level
6. NLEM - National List Essential Medicine status
7. STATUS - Drug status
8. MANUFACTURER - Manufacturer code
9. DOSAGEFORM - Dosage form
10. STRENGTH - Drug strength
11. UNIT - Unit of measure

---

### Requirement 6: TMT Data Loading (Admin)

**User Story:** As a **system administrator**, I want to **load TMT concept data from Ministry CSV files**, so that **the system has the latest TMT standard codes**.

#### Acceptance Criteria

1. WHEN admin uploads TMT concepts CSV THEN system SHALL validate file format (required columns: TMT_ID, CONCEPT_CODE, LEVEL, FSN, PREFERRED_TERM_TH)
2. WHEN loading TMT data THEN system SHALL batch insert 1,000 records per transaction for performance
3. WHEN duplicate TMT_ID detected THEN system SHALL skip duplicate and continue processing (skipDuplicates: true)
4. WHEN loading relationships CSV THEN system SHALL validate parent-child TMT_IDs exist before creating relationship
5. WHEN load completes THEN system SHALL return summary: total_records, inserted_count, skipped_count, error_count
6. IF load fails mid-process THEN system SHALL rollback transaction to maintain data consistency

**Data Sources:**

- `tmt_concepts.csv` - 76,904 TMT concepts
- `tmt_relationships.csv` - Parent-child hierarchy
- `tmt_attributes.csv` - Additional metadata
- `tmt_manufacturers.csv` - Manufacturer codes
- `tmt_dosage_forms.csv` - 87 dosage form codes
- `tmt_units.csv` - Unit codes with conversion factors

---

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**: Each API endpoint handler focuses on one business operation (e.g., `createMapping`, `searchConcepts`)
- **Modular Design**:
  - Controllers handle HTTP requests/responses
  - Services contain business logic (mapping validation, compliance calculation)
  - Repositories handle database access (TMT concepts, mappings)
  - Utilities for shared logic (confidence scoring, fuzzy search)
- **Dependency Management**: Use dependency injection for services and repositories
- **Clear Interfaces**: TypeBox schemas define strict request/response contracts
- **Layer Structure**: Follow existing `apps/api/src/layers/inventory/` pattern (or operations based on domain classification)

### Performance

1. **Search Response Time**
   - TMT concept search MUST return results within 1 second for queries with 10,000+ concepts
   - Implement Redis caching for frequently accessed TMT concepts (TTL: 1 hour)
   - Use database indexes on `tmt_concepts.preferred_term`, `tmt_concepts.concept_code`, `tmt_concepts.level`

2. **Bulk Operations**
   - CSV data loading MUST process 1,000 records per batch transaction
   - Compliance calculation MUST complete within 2 seconds for 10,000+ drugs
   - Batch mapping suggestions MUST process 100 drugs within 5 seconds

3. **Pagination**
   - All list endpoints MUST support pagination (default 20, max 100 per page)
   - Return total count for frontend pagination controls

### Security

1. **Authentication**
   - ALL endpoints require JWT authentication (except health check)
   - Token validation using existing Fastify JWT strategy

2. **Authorization (RBAC)**
   - **Finance Manager**: Full access (view, map, export)
   - **Pharmacist**: Full access (view, map, export)
   - **Department Head**: Read-only (view concepts, mappings)
   - **Nurse**: Read-only (view concepts, mappings)
   - **Other Staff**: No access (403 Forbidden)

3. **Input Validation**
   - ALL requests validated using TypeBox schemas
   - UUID validation for all ID parameters
   - Sanitize search query inputs to prevent SQL injection
   - Validate TMT level enum values (VTM, GP, GPU, TP, TPU)

4. **Data Protection**
   - Audit trail for all mapping operations (who, when, what)
   - Soft delete for mappings to preserve history
   - Rate limiting: 100 requests per minute per user

### Reliability

1. **Error Handling**
   - Use custom error codes for TMT-specific errors (TMT_CONCEPT_NOT_FOUND, MAPPING_EXISTS, etc.)
   - Return Thai and English error messages for user-facing errors
   - Log all errors with context (user_id, drug_id, tmt_concept_id)

2. **Data Integrity**
   - Use database transactions for mapping creation (validate → insert → update stats)
   - Foreign key constraints enforce referential integrity (drug_id → drugs, tmt_concept_id → tmt_concepts)
   - Unique constraint prevents duplicate mappings per drug

3. **Idempotency**
   - CSV load operations are idempotent (skipDuplicates: true)
   - PUT mapping updates are idempotent (same data = no change)

### Usability

1. **API Response Format**
   - Consistent response structure: `{ success, data, meta, error }`
   - Include helpful error details and suggestions (e.g., "ใช้ /api/tmt/concepts/search เพื่อค้นหา TMT")
   - Provide pagination metadata (page, limit, total)

2. **Search UX**
   - Fuzzy matching tolerates typos (e.g., "Paracetamol" matches "Paracetamol")
   - Case-insensitive search (Thai and English)
   - Return parent context in search results (e.g., show VTM parent for GP concepts)

3. **API Documentation**
   - Auto-generated OpenAPI/Swagger documentation
   - Include request/response examples
   - Document all error codes and HTTP status codes

### Scalability

1. **Database**
   - Use connection pooling (Prisma default)
   - Indexes on frequently queried columns (preferred_term, concept_code, level)
   - Archive old ministry_reports after 2 years

2. **Caching Strategy**
   - Cache TMT concepts in Redis (rarely change, high read volume)
   - Cache compliance rate for 5 minutes (reduce calculation overhead)
   - Invalidate cache on new mappings or TMT data updates

3. **Future Growth**
   - Design supports 100,000+ TMT concepts (currently 76,904)
   - Supports 50,000+ drug mappings (currently 561)
   - Horizontal scaling via stateless API design

### Maintainability

1. **Code Standards**
   - Follow existing AegisX backend patterns (BaseRepository, TypeBox schemas)
   - Use TypeScript strict mode
   - Unit test coverage ≥ 80% for business logic
   - Integration tests for all API endpoints

2. **Logging**
   - Log all mapping operations (INFO level)
   - Log search queries for analytics (DEBUG level)
   - Log errors with stack traces (ERROR level)

3. **Monitoring**
   - Track API response times (target: p95 < 500ms)
   - Monitor compliance rate daily
   - Alert if compliance drops below 90%

### Compatibility

1. **Database**
   - PostgreSQL 14+ (existing `inventory` schema)
   - Prisma ORM for database access
   - Support for BigInt primary keys

2. **API Standards**
   - RESTful design (GET, POST, PUT, DELETE)
   - JSON request/response bodies
   - HTTP status codes: 200, 201, 400, 401, 403, 404, 409, 500

3. **Frontend Integration**
   - CORS enabled for `apps/web` origin
   - Consistent API URL pattern: `/api/tmt/*`
   - Support for query parameters (search, filters, pagination)
