---
title: 'Feature Development Standard'
description: 'Standard workflow for developing new features in the AegisX Platform'
category: guides
tags: [development, workflow, standards]
---

# Feature Development Standard

> **🚨 MANDATORY STANDARD** - This standard MUST be followed for every feature development to ensure quality, maintainability, and prevent conflicts in multi-feature environments.

## 📋 **Feature Development Lifecycle**

### Phase 1: Planning & Documentation (MANDATORY)

Every feature development MUST begin with proper planning and documentation. This phase ensures all stakeholders understand the requirements, technical approach, and success criteria before any code is written.

#### Step 1.1: Database Schema Design

**Database-first approach is MANDATORY.** The database schema drives the entire feature architecture.

```bash
# 1. Create migration file
npx knex migrate:make create_feature_table

# 2. Define schema in migration
# database/migrations/TIMESTAMP_create_feature_table.ts
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('features', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.text('description');
    table.boolean('is_active').defaultTo(true);
    table.uuid('created_by').references('id').inTable('users');
    table.uuid('updated_by').references('id').inTable('users');
    table.timestamps(true, true);

    // Indexes for performance
    table.index(['is_active']);
    table.index(['created_at']);
    table.index(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('features');
}

# 3. Run migration
npx knex migrate:latest

# 4. Verify table created
psql $DATABASE_URL -c "\d+ features"
```

**Checklist:**

- [ ] Migration file created with proper naming
- [ ] UUID primary key with auto-generation
- [ ] All required fields defined with constraints
- [ ] Indexes added for frequently queried columns
- [ ] Foreign keys defined for relationships
- [ ] Timestamps configured (created_at, updated_at)
- [ ] Audit fields added (created_by, updated_by)
- [ ] Migration tested (up and down)

**Common Pitfalls:**

- Forgetting to add indexes on foreign keys
- Missing NOT NULL constraints on required fields
- Not defining down migration for rollback
- Using VARCHAR without length limit

#### Step 1.2: API Contract Definition

Define the API endpoints, request/response schemas, and error handling BEFORE implementation.

**Create API Contract Document:**

```bash
# Create feature API contract
touch docs/features/my-feature/API_CONTRACTS.md
```

**API Contract Template:**

````markdown
# Feature API Contracts

## Endpoints

### 1. List Features

**Endpoint:** `GET /api/features`
**Authentication:** Required (JWT)
**Authorization:** All authenticated users

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| search | string | No | Search by name/description |
| is_active | boolean | No | Filter by active status |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "is_active": true,
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
````

### 2. Get Feature by ID

**Endpoint:** `GET /api/features/:id`
...

````

**Checklist:**
- [ ] All CRUD endpoints documented
- [ ] Authentication requirements specified
- [ ] Authorization rules defined
- [ ] Request schemas with validation rules
- [ ] Response schemas with examples
- [ ] Error responses documented (400, 401, 403, 404, 500)
- [ ] Query parameters and filters defined
- [ ] Pagination approach specified

**Reference:** See [API Calling Standard](./api-calling-standard.md) for URL patterns and conventions.

#### Step 1.3: Domain Architecture Decision

**CRITICAL:** Determine correct domain placement using Domain Architecture Guide.

```bash
# Use Domain Checker before creating any CRUD
bash /tmp/check_domain.sh features
````

**Decision Matrix:**

| Question                           | Answer | Domain Placement                   |
| ---------------------------------- | ------ | ---------------------------------- |
| Is this shared across all domains? | Yes    | `/v1/platform/{resource}`          |
| Is this organizational structure?  | Yes    | `/v1/platform/{resource}`          |
| Is this business-specific?         | Yes    | `/{domain}/{section}/{resource}`   |
| Is this lookup/reference data?     | Yes    | `/{domain}/master-data/{resource}` |
| Is this transactional data?        | Yes    | `/{domain}/operations/{resource}`  |

**Examples:**

- Users, Departments, Roles → Platform (`/v1/platform/`)
- Drugs, Budget Types → Inventory Master Data (`/inventory/master-data/`)
- Budget Allocations → Inventory Operations (`/inventory/operations/`)

**Checklist:**

- [ ] Domain placement determined
- [ ] Section identified (master-data, operations, etc.)
- [ ] URL pattern defined
- [ ] Cross-domain dependencies documented

**Reference:** See [Domain Architecture Guide](../../architecture/domain-architecture-guide.md)

#### Step 1.4: Create Feature Specification Document

Document requirements, user stories, acceptance criteria, and technical approach.

```bash
# Create feature documentation structure
mkdir -p docs/features/my-feature
touch docs/features/my-feature/{OVERVIEW.md,REQUIREMENTS.md,DESIGN.md}
```

**REQUIREMENTS.md Template:**

```markdown
# Feature Requirements

## Overview

Brief description of what this feature does and why it's needed.

## User Stories

- As a [role], I want to [action] so that [benefit]
- As a [role], I want to [action] so that [benefit]

## Functional Requirements

1. The system SHALL allow users to create new features
2. The system SHALL validate feature names are unique
3. The system SHALL support soft delete for features

## Non-Functional Requirements

1. API response time < 500ms for list operations
2. Support up to 10,000 features without performance degradation
3. 99.9% uptime for feature management

## Success Criteria

- [ ] All user stories completed and tested
- [ ] All acceptance criteria met
- [ ] Performance benchmarks achieved
- [ ] Documentation complete
```

**Checklist:**

- [ ] Feature overview documented
- [ ] User stories defined with roles and benefits
- [ ] Functional requirements specified
- [ ] Non-functional requirements defined
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Risks documented

### Phase 2: Backend Implementation

Backend implementation follows the Database-First, API-First approach. All backend code must be completed and tested before frontend development begins.

#### Step 2.1: TypeBox Schema Definition

**MANDATORY:** Every route MUST have TypeBox schemas for validation and OpenAPI documentation.

```typescript
// apps/api/src/modules/features/schemas/features.schemas.ts
import { Type, Static } from '@sinclair/typebox';

// Base entity schema
export const FeatureSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid', description: 'Feature ID' }),
    name: Type.String({ minLength: 1, maxLength: 100, description: 'Feature name' }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    is_active: Type.Boolean({ description: 'Active status' }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'Feature', additionalProperties: false },
);

// Request schemas
export const CreateFeatureRequestSchema = Type.Object(
  {
    name: Type.String({ minLength: 1, maxLength: 100, description: 'Feature name' }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    is_active: Type.Optional(Type.Boolean({ default: true })),
  },
  { $id: 'CreateFeatureRequest', additionalProperties: false },
);

export const UpdateFeatureRequestSchema = Type.Partial(
  Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
    description: Type.String({ maxLength: 500 }),
    is_active: Type.Boolean(),
  }),
  { $id: 'UpdateFeatureRequest', additionalProperties: false, minProperties: 1 },
);

// Response schemas
export const FeatureResponseSchema = Type.Object(
  {
    success: Type.Literal(true),
    data: Type.Ref(FeatureSchema),
    message: Type.Optional(Type.String()),
  },
  { $id: 'FeatureResponse' },
);

export const PaginatedFeatureResponseSchema = Type.Object(
  {
    success: Type.Literal(true),
    data: Type.Array(Type.Ref(FeatureSchema)),
    pagination: Type.Object({
      page: Type.Number(),
      limit: Type.Number(),
      total: Type.Number(),
      totalPages: Type.Number(),
    }),
  },
  { $id: 'PaginatedFeatureResponse' },
);

// Export types
export type Feature = Static<typeof FeatureSchema>;
export type CreateFeatureRequest = Static<typeof CreateFeatureRequestSchema>;
export type UpdateFeatureRequest = Static<typeof UpdateFeatureRequestSchema>;
```

**Checklist:**

- [ ] All schemas have unique $id
- [ ] Entity schema matches database table
- [ ] Request schemas have proper validation
- [ ] Response schemas include success field
- [ ] All schemas exported as types
- [ ] additionalProperties: false (security)
- [ ] Field descriptions provided

**Reference:** See [TypeBox Schema Standard](../../reference/api/typebox-schema-standard.md)

#### Step 2.2: Repository Implementation

Extend BaseRepository for type-safe database operations with automatic UUID validation, field selection, and audit tracking.

```typescript
// apps/api/src/modules/features/repositories/features.repository.ts
import { Knex } from 'knex';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { Feature, CreateFeatureRequest, UpdateFeatureRequest } from '../schemas/features.schemas';

export class FeaturesRepository extends BaseRepository<Feature, CreateFeatureRequest, UpdateFeatureRequest> {
  constructor(knex: Knex) {
    super(
      knex,
      'features', // table name
      ['features.name', 'features.description'], // search fields
      {
        createdByField: 'created_by',
        updatedByField: 'updated_by',
      },
    );
  }

  // Transform database row to entity (camelCase)
  transformToEntity(dbRow: any): Feature {
    return {
      id: dbRow.id,
      name: dbRow.name,
      description: dbRow.description,
      is_active: dbRow.is_active,
      created_at: dbRow.created_at,
      updated_at: dbRow.updated_at,
    };
  }

  // Transform DTO to database format (snake_case)
  transformToDb(dto: CreateFeatureRequest | UpdateFeatureRequest): any {
    const transformed: any = {};
    if ('name' in dto) transformed.name = dto.name;
    if ('description' in dto) transformed.description = dto.description;
    if ('is_active' in dto) transformed.is_active = dto.is_active;
    return transformed;
  }

  // Custom filtering
  protected applyCustomFilters(query: Knex.QueryBuilder, filters: any) {
    const { is_active } = filters;
    if (is_active !== undefined) {
      query.where('features.is_active', is_active);
    }
  }
}
```

**Checklist:**

- [ ] Extends BaseRepository with correct types
- [ ] Table name matches migration
- [ ] Search fields defined for full-text search
- [ ] transformToEntity converts snake_case to camelCase
- [ ] transformToDb converts camelCase to snake_case
- [ ] Audit fields configured (created_by, updated_by)
- [ ] Custom filters implemented if needed

**Reference:** See [Backend Architecture - Repository Pattern](../../architecture/backend-architecture.md#base-repository-pattern)

#### Step 2.3: Service Layer Implementation

Implement business logic, validation, and orchestration in the service layer.

```typescript
// apps/api/src/modules/features/services/features.service.ts
import { FeaturesRepository } from '../repositories/features.repository';
import { CreateFeatureRequest, UpdateFeatureRequest, Feature } from '../schemas/features.schemas';
import { ConflictError, NotFoundError } from '../../../shared/errors';

export class FeaturesService {
  constructor(private repository: FeaturesRepository) {}

  async list(params: any, userId?: string) {
    return this.repository.list(params, userId);
  }

  async findById(id: string, userId?: string): Promise<Feature> {
    const feature = await this.repository.findById(id, userId);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }
    return feature;
  }

  async create(data: CreateFeatureRequest, userId?: string): Promise<Feature> {
    // Business validation
    const existing = await this.repository.findOne({ name: data.name });
    if (existing) {
      throw new ConflictError('Feature with this name already exists');
    }

    return this.repository.create(data, userId);
  }

  async update(id: string, data: UpdateFeatureRequest, userId?: string): Promise<Feature> {
    // Verify exists
    await this.findById(id, userId);

    // Business validation
    if (data.name) {
      const existing = await this.repository.findOne({ name: data.name });
      if (existing && existing.id !== id) {
        throw new ConflictError('Feature with this name already exists');
      }
    }

    return this.repository.update(id, data, userId);
  }

  async delete(id: string, userId?: string): Promise<void> {
    await this.findById(id, userId); // Verify exists
    return this.repository.delete(id, userId);
  }
}
```

**Checklist:**

- [ ] All CRUD operations implemented
- [ ] Business validation logic added
- [ ] Proper error handling with custom errors
- [ ] userId passed for audit tracking
- [ ] NotFoundError thrown when appropriate
- [ ] ConflictError for uniqueness violations

#### Step 2.4: Controller and Routes Implementation

Define Fastify routes with complete schema validation, authentication, and authorization.

```typescript
// apps/api/src/modules/features/features.plugin.ts
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { FeaturesRepository } from './repositories/features.repository';
import { FeaturesService } from './services/features.service';
import { FeatureSchema, CreateFeatureRequestSchema, UpdateFeatureRequestSchema, FeatureResponseSchema, PaginatedFeatureResponseSchema } from './schemas/features.schemas';

export default fp(
  async function featuresPlugin(fastify: FastifyInstance) {
    // Register schemas
    fastify.addSchema(FeatureSchema);
    fastify.addSchema(CreateFeatureRequestSchema);
    fastify.addSchema(UpdateFeatureRequestSchema);
    fastify.addSchema(FeatureResponseSchema);
    fastify.addSchema(PaginatedFeatureResponseSchema);

    // Initialize repository and service
    const repository = new FeaturesRepository(fastify.knex);
    const service = new FeaturesService(repository);

    // List features
    fastify.route({
      method: 'GET',
      url: '/api/features',
      schema: {
        description: 'List all features with pagination',
        tags: ['Features'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
            search: { type: 'string' },
            is_active: { type: 'boolean' },
          },
        },
        response: {
          200: { $ref: 'PaginatedFeatureResponse#' },
          401: { $ref: 'unauthorizedResponse#' },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
      handler: async (request, reply) => {
        const userId = request.user?.id;
        const result = await service.list(request.query, userId);
        return reply.success(result);
      },
    });

    // Get feature by ID
    fastify.route({
      method: 'GET',
      url: '/api/features/:id',
      schema: {
        description: 'Get feature by ID',
        tags: ['Features'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: { $ref: 'FeatureResponse#' },
          401: { $ref: 'unauthorizedResponse#' },
          404: { $ref: 'notFoundResponse#' },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWT]),
      handler: async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user?.id;
        const feature = await service.findById(id, userId);
        return reply.success(feature);
      },
    });

    // Create feature
    fastify.route({
      method: 'POST',
      url: '/api/features',
      schema: {
        description: 'Create new feature',
        tags: ['Features'],
        body: { $ref: 'CreateFeatureRequest#' },
        response: {
          201: { $ref: 'FeatureResponse#' },
          400: { $ref: 'validationErrorResponse#' },
          401: { $ref: 'unauthorizedResponse#' },
          409: { $ref: 'conflictResponse#' },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin', 'manager'])]),
      handler: async (request, reply) => {
        const userId = request.user?.id;
        const feature = await service.create(request.body, userId);
        return reply.created(feature, 'Feature created successfully');
      },
    });

    // Update feature
    fastify.route({
      method: 'PUT',
      url: '/api/features/:id',
      schema: {
        description: 'Update feature',
        tags: ['Features'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        body: { $ref: 'UpdateFeatureRequest#' },
        response: {
          200: { $ref: 'FeatureResponse#' },
          400: { $ref: 'validationErrorResponse#' },
          401: { $ref: 'unauthorizedResponse#' },
          404: { $ref: 'notFoundResponse#' },
          409: { $ref: 'conflictResponse#' },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin', 'manager'])]),
      handler: async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user?.id;
        const feature = await service.update(id, request.body, userId);
        return reply.success(feature, 'Feature updated successfully');
      },
    });

    // Delete feature
    fastify.route({
      method: 'DELETE',
      url: '/api/features/:id',
      schema: {
        description: 'Delete feature',
        tags: ['Features'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: { $ref: 'successResponse#' },
          401: { $ref: 'unauthorizedResponse#' },
          404: { $ref: 'notFoundResponse#' },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])]),
      handler: async (request, reply) => {
        const { id } = request.params as { id: string };
        const userId = request.user?.id;
        await service.delete(id, userId);
        return reply.success(null, 'Feature deleted successfully');
      },
    });
  },
  {
    name: 'features-plugin',
    dependencies: ['knex-plugin', 'auth-plugin'],
  },
);
```

**Checklist:**

- [ ] All schemas registered with addSchema
- [ ] Repository and service initialized
- [ ] All CRUD routes defined
- [ ] Complete schema for each route (params, query, body, response)
- [ ] Authentication with fastify.auth([fastify.verifyJWT])
- [ ] Authorization with fastify.verifyRole for protected actions
- [ ] Proper HTTP status codes (200, 201, 400, 401, 404, 409)
- [ ] userId from request.user passed to service
- [ ] Descriptive success/error messages

#### Step 2.5: Backend Testing

Test all endpoints with curl before moving to frontend.

```bash
# Start API server
pnpm run dev:api

# Test authentication (get token first)
TOKEN=$(curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.data.token')

# Test list features
curl -X GET "http://localhost:3333/api/features?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# Test create feature
curl -X POST http://localhost:3333/api/features \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Feature","description":"Test description"}' \
  | jq .

# Test get by ID
FEATURE_ID=$(curl -X POST http://localhost:3333/api/features \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Feature 2"}' \
  | jq -r '.data.id')

curl -X GET "http://localhost:3333/api/features/$FEATURE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# Test update
curl -X PUT "http://localhost:3333/api/features/$FEATURE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Feature"}' \
  | jq .

# Test delete
curl -X DELETE "http://localhost:3333/api/features/$FEATURE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# Test error cases
# 400 - Validation error
curl -X POST http://localhost:3333/api/features \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}' \
  | jq .

# 401 - Unauthorized
curl -X GET http://localhost:3333/api/features \
  | jq .

# 404 - Not found
curl -X GET "http://localhost:3333/api/features/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $TOKEN" \
  | jq .

# Verify OpenAPI documentation
open http://localhost:3333/documentation
```

**Checklist:**

- [ ] All CRUD operations work via curl
- [ ] Authentication required returns 401
- [ ] Authorization enforced (admin-only routes)
- [ ] Validation errors return 400 with details
- [ ] Not found returns 404
- [ ] Conflict returns 409 for duplicates
- [ ] Success responses match schema
- [ ] OpenAPI documentation updated

**Reference:** See [API Response Standard](../../reference/api/api-response-standard.md)

### Phase 3: Frontend Implementation

Frontend implementation begins ONLY after backend is fully tested and working. Follow the API-First approach.

#### Step 3.1: TypeScript Interfaces

Create TypeScript interfaces matching backend schemas.

```typescript
// apps/admin/src/app/features/types/features.types.ts

export interface Feature {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeatureRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateFeatureRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface FeatureResponse {
  success: boolean;
  data: Feature;
  message?: string;
}

export interface PaginatedFeatureResponse {
  success: boolean;
  data: Feature[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Checklist:**

- [ ] Interfaces match backend schemas exactly
- [ ] Optional fields marked with ?
- [ ] Date fields as strings (ISO8601)
- [ ] Response wrappers included

#### Step 3.2: Service Implementation

Implement Angular service for API calls following the API Calling Standard.

```typescript
// apps/admin/src/app/features/services/features.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feature, CreateFeatureRequest, UpdateFeatureRequest, FeatureResponse, PaginatedFeatureResponse } from '../types/features.types';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/features'; // BaseUrlInterceptor adds /api prefix

  list(params?: { page?: number; limit?: number; search?: string; is_active?: boolean }): Observable<PaginatedFeatureResponse> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active);

    return this.http.get<PaginatedFeatureResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<FeatureResponse> {
    return this.http.get<FeatureResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateFeatureRequest): Observable<FeatureResponse> {
    return this.http.post<FeatureResponse>(this.baseUrl, data);
  }

  update(id: string, data: UpdateFeatureRequest): Observable<FeatureResponse> {
    return this.http.put<FeatureResponse>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
```

**Checklist:**

- [ ] Service uses inject() for HttpClient
- [ ] baseUrl WITHOUT /api prefix (interceptor adds it)
- [ ] All CRUD methods implemented
- [ ] Query parameters properly constructed
- [ ] Return types match backend responses
- [ ] Service provided in 'root'

**Reference:** See [API Calling Standard](./api-calling-standard.md)

#### Step 3.3: Component Implementation

Create Angular components for UI using signals and modern patterns.

```typescript
// apps/admin/src/app/features/pages/features-list/features-list.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeaturesService } from '../../services/features.service';
import { Feature } from '../../types/features.types';

@Component({
  selector: 'app-features-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-list.component.html',
})
export class FeaturesListComponent implements OnInit {
  private featuresService = inject(FeaturesService);
  private router = inject(Router);

  features = signal<Feature[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  pagination = signal({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  ngOnInit() {
    this.loadFeatures();
  }

  loadFeatures() {
    this.loading.set(true);
    this.error.set(null);

    this.featuresService.list({ page: this.pagination().page, limit: this.pagination().limit }).subscribe({
      next: (response) => {
        this.features.set(response.data);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load features');
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number) {
    this.pagination.update((p) => ({ ...p, page }));
    this.loadFeatures();
  }

  onEdit(feature: Feature) {
    this.router.navigate(['/features', feature.id, 'edit']);
  }

  onDelete(feature: Feature) {
    if (!confirm(`Delete feature "${feature.name}"?`)) return;

    this.featuresService.delete(feature.id).subscribe({
      next: () => {
        this.loadFeatures(); // Reload list
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to delete feature');
      },
    });
  }
}
```

**Checklist:**

- [ ] Component uses signals for state management
- [ ] Loading and error states handled
- [ ] Service injected with inject()
- [ ] Pagination implemented
- [ ] Error messages displayed to user
- [ ] Confirmation for destructive actions

#### Step 3.4: Form Implementation

Create forms for create/update operations with validation.

```typescript
// apps/admin/src/app/features/pages/feature-form/feature-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'app-feature-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feature-form.component.html',
})
export class FeatureFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private featuresService = inject(FeaturesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal(false);
  featureId = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.featureId.set(id);
      this.loadFeature(id);
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      is_active: [true],
    });
  }

  loadFeature(id: string) {
    this.loading.set(true);
    this.featuresService.getById(id).subscribe({
      next: (response) => {
        this.form.patchValue(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load feature');
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const operation = this.isEditMode() ? this.featuresService.update(this.featureId()!, this.form.value) : this.featuresService.create(this.form.value);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/features']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to save feature');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/features']);
  }
}
```

**Checklist:**

- [ ] ReactiveFormsModule imported
- [ ] Form validation matches backend schema
- [ ] Edit mode loads existing data
- [ ] Loading state during save
- [ ] Error handling with user feedback
- [ ] Cancel button navigates back

### Phase 4: Integration & Testing

Comprehensive testing ensures quality and prevents regressions.

#### Step 4.1: Build Verification

**MANDATORY before any commit.**

```bash
# Build all projects
pnpm run build

# Type checking
nx run-many --target=typecheck --all

# Expected: All successful, no errors
```

**Checklist:**

- [ ] All projects build successfully
- [ ] No TypeScript errors
- [ ] No circular dependencies
- [ ] Build completes in reasonable time

#### Step 4.2: Code Quality Checks

```bash
# Lint all projects
nx run-many --target=lint --all

# Auto-fix lint issues
nx run-many --target=lint --all --fix

# Expected: No linting errors (warnings OK)
```

**Checklist:**

- [ ] No linting errors
- [ ] Code follows style guide
- [ ] No unused imports
- [ ] Proper naming conventions

#### Step 4.3: Manual Integration Testing

**Test complete user workflows end-to-end.**

```bash
# Start development environment
pnpm run docker:up
pnpm run dev:api
pnpm run dev:admin
```

**Test Scenarios:**

**Scenario 1: Create Feature**

1. Navigate to Features page
2. Click "Create Feature" button
3. Fill form with valid data
4. Submit form
5. Verify: Feature appears in list
6. Verify: Success message displayed

**Scenario 2: Edit Feature**

1. Click edit button on existing feature
2. Modify name and description
3. Submit form
4. Verify: Changes reflected in list
5. Verify: Success message displayed

**Scenario 3: Delete Feature**

1. Click delete button on feature
2. Confirm deletion
3. Verify: Feature removed from list
4. Verify: Success message displayed

**Scenario 4: Validation Errors**

1. Try to create feature with empty name
2. Verify: Validation error shown
3. Try to create duplicate feature
4. Verify: Conflict error shown

**Scenario 5: Pagination**

1. Create 25+ features
2. Navigate through pages
3. Verify: Pagination works correctly
4. Verify: Page numbers accurate

**Scenario 6: Search/Filter**

1. Enter search term
2. Verify: Filtered results shown
3. Clear search
4. Verify: All results shown

**Checklist:**

- [ ] All user workflows work end-to-end
- [ ] Form validation works
- [ ] Error messages are user-friendly
- [ ] Loading states display correctly
- [ ] No console errors in browser
- [ ] Responsive on mobile/tablet/desktop

**Reference:** See [QA Checklist](./qa-checklist.md)

#### Step 4.4: Browser Console Verification

**Open Chrome DevTools (F12) and verify:**

```bash
# Console tab
- [ ] No red errors
- [ ] No unhandled promise rejections
- [ ] No deprecation warnings

# Network tab
- [ ] All API calls successful (200, 201)
- [ ] No 404 errors
- [ ] Proper request/response format
- [ ] Authorization headers present

# Performance tab
- [ ] Page load < 3 seconds
- [ ] API responses < 500ms
- [ ] No memory leaks
```

### Phase 5: Documentation & Deployment

Complete documentation and prepare for deployment.

#### Step 5.1: API Documentation Update

Verify OpenAPI documentation is accurate.

```bash
# Access Swagger UI
open http://localhost:3333/documentation

# Verify each endpoint:
- [ ] All endpoints listed
- [ ] Request schemas accurate
- [ ] Response examples correct
- [ ] Authentication requirements shown
- [ ] Try it out functionality works
```

#### Step 5.2: Feature Documentation

Update feature documentation with implementation details.

```bash
# Update feature docs
docs/features/my-feature/
├── OVERVIEW.md       # Feature description
├── REQUIREMENTS.md   # Requirements (updated)
├── DESIGN.md         # Technical design
└── API_CONTRACTS.md  # API documentation
```

**Add Implementation Notes:**

```markdown
# Implementation Notes

## Database

- Table: `features`
- Migration: `20250117_create_features_table.ts`

## Backend

- Plugin: `apps/api/src/modules/features/features.plugin.ts`
- Repository: Uses BaseRepository pattern
- Authentication: JWT required
- Authorization: Admin/Manager for create/update, Admin for delete

## Frontend

- Service: `apps/admin/src/app/features/services/features.service.ts`
- Components: List, Form
- Routes: `/features`, `/features/new`, `/features/:id/edit`

## Testing

- Backend: curl scripts in Phase 2.5
- Frontend: Manual test scenarios in Phase 4.3

## Known Issues

- None

## Future Enhancements

- [ ] Bulk operations
- [ ] Export to CSV
- [ ] Advanced filtering
```

**Checklist:**

- [ ] Implementation details documented
- [ ] API contracts match implementation
- [ ] Known issues listed
- [ ] Future enhancements identified

#### Step 5.3: Update Project Documentation

Link feature documentation from main docs.

```bash
# Update docs/README.md or appropriate section
echo "- [My Feature](./features/my-feature/OVERVIEW.md)" >> docs/features/README.md
```

#### Step 5.4: Git Commit

**Follow git rules from CLAUDE.md.**

```bash
# Stage specific files only (NEVER git add -A)
git add apps/api/src/modules/features/
git add apps/admin/src/app/features/
git add database/migrations/*_create_features_table.ts
git add docs/features/my-feature/

# Check staged changes
git status

# Commit with proper message (NO "Generated with Claude Code")
git commit -m "feat(features): add feature management CRUD

- Add features table migration with UUID primary key
- Implement backend with BaseRepository pattern
- Add TypeBox schemas for validation
- Create Angular service and components
- Add comprehensive API documentation
- Include manual testing scenarios

IMPORTANT: Tested end-to-end, all CRUD operations working"

# Build verification before push
pnpm run build

# Push to remote
git push origin feature/feature-management
```

**Checklist:**

- [ ] Only relevant files staged
- [ ] Commit message follows convention
- [ ] NO "Generated with Claude Code" or "Co-Authored-By: Claude"
- [ ] NO "BREAKING CHANGE:" (forbidden)
- [ ] Build passes before push
- [ ] Pushed to feature branch (not main)

## 🔄 **Common Patterns & Best Practices**

### Database-First Development Workflow

**Why Database-First?**

- Database schema is the single source of truth
- API contracts derive from database structure
- Frontend types mirror backend schemas
- Prevents schema drift and misalignment

**Workflow:**

1. Design database schema → 2. Run migration → 3. Define API contracts → 4. Implement backend → 5. Test backend → 6. Implement frontend

### API-First Development Workflow

**Why API-First?**

- Backend must be complete before frontend
- API contracts serve as development contracts
- Enables parallel frontend/backend development (if contracts are stable)
- Reduces integration issues

**Workflow:**

1. Define API contracts → 2. Implement backend → 3. Test with curl → 4. Verify OpenAPI docs → 5. Implement frontend

### Repository Pattern Best Practices

**Leverage BaseRepository:**

```typescript
// DO: Extend BaseRepository for CRUD operations
class MyRepository extends BaseRepository<MyEntity, CreateDto, UpdateDto> {
  // Only add custom methods
  async findByCustomCriteria() {
    /* ... */
  }
}

// DON'T: Reimplement CRUD operations
class MyRepository {
  async findAll() {
    /* Reinventing the wheel */
  }
  async create() {
    /* Unnecessary duplication */
  }
}
```

**Transform Methods:**

```typescript
// DO: Handle all possible fields
transformToEntity(dbRow: any): Entity {
  return {
    id: dbRow.id,
    name: dbRow.name,
    // Handle nullable fields
    description: dbRow.description ?? undefined,
    // Transform snake_case to camelCase
    isActive: dbRow.is_active,
  };
}

// DON'T: Forget nullable fields or transformations
transformToEntity(dbRow: any): Entity {
  return dbRow; // Missing transformations
}
```

### TypeBox Schema Best Practices

**Schema Organization:**

```typescript
// DO: Organize schemas by purpose
export const EntitySchema = Type.Object({ /* ... */ }, { $id: 'Entity' });
export const CreateRequestSchema = Type.Object({ /* ... */ }, { $id: 'CreateRequest' });
export const UpdateRequestSchema = Type.Partial(/* ... */, { $id: 'UpdateRequest' });
export const ResponseSchema = Type.Object({ /* ... */ }, { $id: 'Response' });

// DON'T: Mix schemas without clear $id
const schema = Type.Object({ /* ... */ }); // Missing $id
```

**Validation Rules:**

```typescript
// DO: Match database constraints
name: Type.String({ minLength: 1, maxLength: 100 }), // Matches VARCHAR(100) NOT NULL

// DO: Use Type.Optional for nullable fields
description: Type.Optional(Type.String({ maxLength: 500 })),

// DO: Set additionalProperties: false for security
Type.Object({ /* ... */ }, { additionalProperties: false })
```

### Frontend Service Best Practices

**URL Patterns:**

```typescript
// DO: Use relative URLs without /api prefix
private readonly baseUrl = '/features'; // Interceptor adds /api

// DON'T: Include /api prefix in service
private readonly baseUrl = '/api/features'; // Results in /api/api/features
```

**Error Handling:**

```typescript
// DO: Handle errors gracefully
this.service.create(data).subscribe({
  next: (response) => {
    /* success */
  },
  error: (err) => {
    this.error.set(err.error?.message || 'Operation failed');
  },
});

// DON'T: Ignore errors
this.service.create(data).subscribe((response) => {
  /* no error handling */
});
```

### Component State Management

**Use Signals:**

```typescript
// DO: Use signals for reactive state
loading = signal(false);
error = signal<string | null>(null);
data = signal<MyData[]>([]);

// DON'T: Use plain properties without reactivity
loading = false; // Not reactive
```

## 🚨 **Common Pitfalls & Solutions**

### Pitfall 1: Skipping Database Schema Design

**Problem:** Starting with API or frontend without database schema
**Impact:** Schema changes force API changes, which force frontend changes
**Solution:** Always start with database migration, verify with psql

### Pitfall 2: Missing /api Prefix or Double Prefix

**Problem:** URLs like `/features` (missing) or `/api/api/features` (double)
**Impact:** 404 errors, broken API calls
**Solution:** Use `/features` in service (interceptor adds `/api`), verify in Network tab

### Pitfall 3: Not Testing Backend Before Frontend

**Problem:** Implementing frontend without verifying backend works
**Impact:** Integration issues, wasted time debugging
**Solution:** Test all endpoints with curl in Phase 2.5, verify 200/201 responses

### Pitfall 4: Mismatched TypeScript Interfaces

**Problem:** Frontend interfaces don't match backend schemas
**Impact:** Type errors, runtime errors, data loss
**Solution:** Copy backend schema structure to frontend types, verify field names and types

### Pitfall 5: Missing Error Handling

**Problem:** No error handling in components/services
**Impact:** Silent failures, poor user experience
**Solution:** Always add error: (err) => handler in subscribe, display user-friendly messages

### Pitfall 6: Forgetting Authorization

**Problem:** All endpoints allow all authenticated users
**Impact:** Security vulnerabilities, unauthorized access
**Solution:** Add fastify.verifyRole for create/update/delete operations

### Pitfall 7: Not Using BaseRepository Features

**Problem:** Reimplementing search, pagination, filtering manually
**Impact:** Code duplication, bugs, inconsistency
**Solution:** Use BaseRepository.list() with query parameters, leverage built-in features

### Pitfall 8: Hardcoded Values

**Problem:** Hardcoded ports, URLs, or configuration
**Impact:** Multi-instance conflicts, environment issues
**Solution:** Use environment variables, read from .env.local

### Pitfall 9: Committing Before Build Verification

**Problem:** Pushing code that doesn't build or has type errors
**Impact:** CI/CD failures, broken builds for team
**Solution:** Run `pnpm run build` before every commit (mandatory)

### Pitfall 10: Wrong Domain Placement

**Problem:** Putting shared resources in domain layer or vice versa
**Impact:** 404 errors, architectural confusion
**Solution:** Use Domain Checker script, follow decision matrix in Phase 1.3

## 🎯 **Quick Reference Checklists**

### Pre-Development Checklist

Before writing any code:

- [ ] Database schema designed and migrated
- [ ] Table verified with psql \d+ command
- [ ] Domain placement determined (platform vs domain)
- [ ] API contracts documented
- [ ] Requirements and user stories defined
- [ ] Dependencies identified
- [ ] Success criteria defined

### Backend Implementation Checklist

- [ ] TypeBox schemas created with unique $id
- [ ] Repository extends BaseRepository
- [ ] transformToEntity and transformToDb implemented
- [ ] Service layer with business logic
- [ ] Error handling (NotFoundError, ConflictError)
- [ ] Fastify plugin with route registration
- [ ] All schemas registered with addSchema
- [ ] Authentication with fastify.verifyJWT
- [ ] Authorization with fastify.verifyRole
- [ ] Tested with curl scripts

### Frontend Implementation Checklist

- [ ] TypeScript interfaces match backend schemas
- [ ] Service uses relative URLs (no /api prefix)
- [ ] All CRUD methods implemented
- [ ] Components use signals for state
- [ ] Loading and error states handled
- [ ] Form validation matches backend
- [ ] Error messages user-friendly
- [ ] Responsive design tested

### Integration Testing Checklist

- [ ] Build successful (`pnpm run build`)
- [ ] Type check passes
- [ ] Lint passes (no errors)
- [ ] All CRUD workflows work end-to-end
- [ ] Form validation works
- [ ] Pagination works
- [ ] Search/filtering works
- [ ] Error handling works
- [ ] No console errors
- [ ] Responsive on all devices

### Documentation Checklist

- [ ] API contracts documented
- [ ] OpenAPI documentation verified
- [ ] Feature requirements documented
- [ ] Implementation notes added
- [ ] Known issues listed
- [ ] Future enhancements identified
- [ ] Links from main docs updated

### Git Commit Checklist

- [ ] Only relevant files staged (no git add -A)
- [ ] Commit message follows convention
- [ ] NO "Generated with Claude Code"
- [ ] NO "BREAKING CHANGE:"
- [ ] Build passes before push
- [ ] Pushed to feature branch

## 🚨 **Claude Integration**

When Claude is working on features, it MUST:

1. **Always check** if feature documentation exists before coding
2. **Create documentation first** if starting a new feature
3. **Update progress** after completing each task
4. **Log session notes** when pausing work
5. **Follow the task order** defined in TASKS.md
6. **Check for conflicts** before making changes
7. **Validate completion** against Definition of Done

This standard ensures consistent, trackable, and maintainable feature development across all projects.
