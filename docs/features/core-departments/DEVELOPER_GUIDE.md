# Core Departments - Developer Guide

> **Complete implementation guide for developers extending or maintaining the feature**

**Version:** 1.0.0
**Last Updated:** 2025-12-14
**Audience:** Backend Developers, Developers extending the feature

---

## Table of Contents

- [Development Setup](#development-setup)
- [Code Structure](#code-structure)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Performance Tips](#performance-tips)
- [Best Practices](#best-practices)

---

## Development Setup

### Prerequisites

```bash
Node.js: v18+
pnpm: v8+
PostgreSQL: v14+
Docker (optional, for local database)
```

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/aegisx-platform/aegisx-starter-1.git
cd aegisx-starter-1

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env.local
```

### Environment Configuration

```bash
# apps/api/.env.local
DATABASE_URL=postgres://user:password@localhost:5432/aegisx_dev
API_PORT=3000
NODE_ENV=development
```

### Start Development Server

```bash
# Terminal 1: Start API server
pnpm run dev:api

# Terminal 2: Watch for file changes
pnpm run dev:watch

# Terminal 3: Run tests
pnpm run test:watch
```

### Database Setup

```bash
# Run migrations (creates departments table)
pnpm run db:migrate

# Seed sample data (optional)
pnpm run db:seed
```

---

## Code Structure

### File Organization

```
apps/api/src/core/departments/
├── index.ts                          # Module exports
├── departments.types.ts              # TypeScript types & error codes
├── departments.schemas.ts            # TypeBox validation schemas
├── departments.routes.ts             # Fastify route definitions
├── departments.controller.ts          # HTTP request/response handling
├── departments.service.ts            # Business logic & validation
├── departments.repository.ts          # Database queries
├── departments-import.service.ts      # System Init integration
└── __tests__/
    ├── departments.test.ts           # Unit tests
    └── departments.integration.test.ts # Integration tests
```

### Import Order (Dependency Flow)

```
1. types.ts          (No dependencies)
2. schemas.ts        (Depends on types)
3. repository.ts     (Database access)
4. service.ts        (Business logic, uses repository)
5. import-service.ts (Import logic, uses repository)
6. controller.ts     (HTTP, uses service)
7. routes.ts         (Routing, uses controller)
```

---

### Understanding Each File

#### 1. departments.types.ts

**Purpose:** Define TypeScript types and error codes

```typescript
// Entity type (what you get from database)
interface Department {
  id: number;
  dept_code: string;
  dept_name: string;
  parent_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Input types (what client sends)
interface CreateDepartment {
  dept_code: string;
  dept_name: string;
  parent_id?: number | null;
  is_active?: boolean;
}

// Error codes (for error handling)
enum DepartmentsErrorCode {
  NOT_FOUND = 'DEPARTMENTS_NOT_FOUND',
  CODE_EXISTS = 'DEPARTMENTS_CODE_EXISTS',
  CIRCULAR_HIERARCHY = 'DEPARTMENTS_CIRCULAR_HIERARCHY',
}
```

**When to Edit:**

- ❌ Changing API responses (edit controller instead)
- ✅ Adding new error codes
- ✅ Adding fields to Department entity
- ✅ Creating new interfaces

---

#### 2. departments.schemas.ts

**Purpose:** Define validation schemas for input validation

```typescript
import { Type, Static } from '@sinclair/typebox';

// Schema definition (TypeBox format)
export const CreateDepartmentsSchema = Type.Object({
  dept_code: Type.String({ maxLength: 10 }),
  dept_name: Type.String({ maxLength: 100 }),
  parent_id: Type.Optional(Type.Integer()),
  is_active: Type.Optional(Type.Boolean({ default: true })),
});

// Export type from schema (ensures consistency)
export type CreateDepartments = Static<typeof CreateDepartmentsSchema>;
```

**When to Edit:**

- ✅ Adding validation rules (maxLength, pattern, etc.)
- ✅ Adding new fields to schema
- ❌ Changing error messages (edit service instead)
- ❌ Changing database logic (edit repository)

---

#### 3. departments.repository.ts

**Purpose:** Database queries and data access

```typescript
export class DepartmentsRepository extends BaseRepository<...> {
  // Standard CRUD (inherited from BaseRepository)
  async findById(id: number): Promise<Department | null>
  async create(data: CreateDepartments): Promise<Department>
  async update(id: number, data: UpdateDepartments): Promise<Department | null>
  async delete(id: number): Promise<boolean>

  // Custom queries (department-specific)
  async findByCode(code: string): Promise<Department | null>
  async getHierarchy(parentId?: number): Promise<DepartmentHierarchyNode[]>
  async getDropdown(): Promise<DepartmentDropdownItem[]>

  // Validation helpers
  async validateParent(parentId: number): Promise<boolean>
  async hasCircularHierarchy(id: number, parentId: number): Promise<boolean>
  async canBeDeleted(id: number): Promise<DeleteValidationResult>
}
```

**When to Edit:**

- ✅ Adding new queries
- ✅ Optimizing SQL performance
- ✅ Adding indexes
- ❌ Business logic (goes in service)
- ❌ Response formatting (goes in controller)

**Example: Add New Query**

```typescript
// Find all active departments under a parent
async getActiveChildrenRecursive(parentId: number): Promise<Department[]> {
  const children = await this.knex('departments')
    .where('parent_id', parentId)
    .where('is_active', true);

  let allDescendants = [...children];

  for (const child of children) {
    const grandchildren = await this.getActiveChildrenRecursive(child.id);
    allDescendants = allDescendants.concat(grandchildren);
  }

  return allDescendants;
}
```

---

#### 4. departments.service.ts

**Purpose:** Business logic and validation

```typescript
export class DepartmentsService extends BaseService<...> {
  // CRUD operations (inherited, can override)
  async create(data: CreateDepartments): Promise<Department>
  async update(id: number, data: UpdateDepartments): Promise<Department | null>
  async delete(id: number): Promise<boolean>

  // Validation hooks (override these for custom validation)
  protected async validateCreate(data: CreateDepartments): Promise<void>
  protected async validateUpdate(id: number, data: UpdateDepartments): Promise<void>
  protected async validateDelete(id: number): Promise<void>

  // Business logic hooks
  protected async beforeCreate(data: CreateDepartments): Promise<CreateDepartments>
  protected async afterCreate(dept: Department): Promise<void>
  protected async afterUpdate(dept: Department): Promise<void>
  protected async afterDelete(dept: Department): Promise<void>

  // Specialized operations
  async getHierarchy(parentId?: number): Promise<DepartmentHierarchyNode[]>
  async getDropdown(): Promise<DepartmentDropdownItem[]>
  async canDelete(id: number): Promise<DeleteValidationResult>
}
```

**When to Edit:**

- ✅ Adding validation rules
- ✅ Adding business logic
- ✅ Adding new operations
- ✅ Modifying hooks (before/after)
- ❌ HTTP response formatting (goes in controller)
- ❌ Database queries (goes in repository)

**Example: Add Validation Rule**

```typescript
// Prevent deleting default department
protected async validateDelete(id: number): Promise<void> {
  const dept = await this.getById(id);

  if (dept?.dept_code === 'SYSTEM-DEFAULT') {
    throw new AppError(
      'Cannot delete system default department',
      400,
      'CANNOT_DELETE_SYSTEM_DEFAULT'
    );
  }

  // Continue with other validations
  await super.validateDelete(id);
}
```

---

#### 5. departments.controller.ts

**Purpose:** HTTP request/response handling

```typescript
export class DepartmentsController {
  // CRUD endpoints
  async list(request, reply): Promise<void>;
  async getById(request, reply): Promise<void>;
  async create(request, reply): Promise<void>;
  async update(request, reply): Promise<void>;
  async delete(request, reply): Promise<void>;

  // Specialized endpoints
  async dropdown(request, reply): Promise<void>;
  async hierarchy(request, reply): Promise<void>;
  async stats(request, reply): Promise<void>;
}
```

**When to Edit:**

- ✅ Adding new HTTP endpoints
- ✅ Changing response format
- ✅ Adding logging/monitoring
- ❌ Business logic (goes in service)
- ❌ Database queries (goes in repository)

**Example: Add Endpoint**

```typescript
// In controller
async search(
  request: FastifyRequest<{ Querystring: { q: string } }>,
  reply: FastifyReply
) {
  const { q } = request.query;
  const results = await this.departmentsService.findMany({
    search: q,
    limit: 10
  });
  return reply.success(results);
}

// In routes
fastify.get('/search', {
  schema: {
    querystring: { q: Type.String({ minLength: 1 }) }
  },
  handler: controller.search.bind(controller)
});
```

---

#### 6. departments.routes.ts

**Purpose:** Define HTTP routes and schemas

```typescript
export async function departmentsRoutes(fastify, options) {
  // GET /api/departments
  fastify.get('/', { schema: {...}, handler: ... });

  // POST /api/departments
  fastify.post('/', { schema: {...}, handler: ... });

  // PUT /api/departments/:id
  fastify.put('/:id', { schema: {...}, handler: ... });

  // DELETE /api/departments/:id
  fastify.delete('/:id', { schema: {...}, handler: ... });

  // Specialized routes
  fastify.get('/hierarchy', { schema: {...}, handler: ... });
  fastify.get('/dropdown', { schema: {...}, handler: ... });
}
```

**When to Edit:**

- ✅ Adding new routes
- ✅ Modifying route patterns
- ✅ Changing permission requirements
- ❌ Handler logic (goes in controller)
- ❌ Validation (goes in schemas)

---

#### 7. departments-import.service.ts

**Purpose:** Bulk import via System Init

```typescript
@ImportService({ module: 'departments', domain: 'core', ... })
export class DepartmentsImportService extends BaseImportService {
  // Template columns
  getTemplateColumns(): TemplateColumn[]

  // Validation per row
  async validateRow(row: any, rowNumber: number): Promise<ValidationError[]>

  // Batch insertion
  protected async insertBatch(batch: any[], trx: Knex.Transaction): Promise<Departments[]>

  // Rollback
  protected async performRollback(batchId: string, knex: Knex): Promise<number>
}
```

**When to Edit:**

- ✅ Modifying template columns
- ✅ Adding import validation rules
- ✅ Changing data transformation
- ❌ HTTP endpoints (goes in routes)
- ❌ Business logic (goes in service)

---

## Adding Features

### Feature 1: Add Department Metadata Field

**Goal:** Store metadata (phone, email, budget) as JSONB

**Steps:**

#### 1. Create Database Migration

```bash
# Create migration file
touch apps/api/src/database/migrations/202512XX_add_department_metadata.ts
```

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('departments', (table) => {
    table.jsonb('metadata').nullable().comment('Department metadata (phone, email, budget, etc.)');

    table.index(['id', 'metadata'], 'idx_departments_metadata');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('departments', (table) => {
    table.dropColumn('metadata');
  });
}
```

#### 2. Update Types

```typescript
// departments.types.ts
interface Department {
  id: number;
  dept_code: string;
  dept_name: string;
  parent_id: number | null;
  is_active: boolean;
  metadata?: {
    // NEW
    phone?: string;
    email?: string;
    budget?: number;
    head_id?: string;
  };
  created_at: Date;
  updated_at: Date;
}

interface CreateDepartment {
  dept_code: string;
  dept_name: string;
  parent_id?: number | null;
  is_active?: boolean;
  metadata?: Record<string, any>; // NEW
}
```

#### 3. Update Schema Validation

```typescript
// departments.schemas.ts
export const CreateDepartmentsSchema = Type.Object({
  dept_code: Type.String({ maxLength: 10 }),
  dept_name: Type.String({ maxLength: 100 }),
  parent_id: Type.Optional(Type.Integer()),
  is_active: Type.Optional(Type.Boolean({ default: true })),
  metadata: Type.Optional(
    Type.Object({
      // NEW
      phone: Type.Optional(Type.String()),
      email: Type.Optional(Type.String({ format: 'email' })),
      budget: Type.Optional(Type.Number({ minimum: 0 })),
      head_id: Type.Optional(Type.String({ format: 'uuid' })),
    }),
  ),
});
```

#### 4. Update Repository

```typescript
// departments.repository.ts
transformToEntity(dbRow: any): Department {
  return {
    id: dbRow.id,
    dept_code: dbRow.dept_code,
    dept_name: dbRow.dept_name,
    parent_id: dbRow.parent_id || null,
    is_active: dbRow.is_active,
    metadata: dbRow.metadata,  // NEW
    created_at: new Date(dbRow.created_at),
    updated_at: new Date(dbRow.updated_at),
  };
}
```

#### 5. Run Migration

```bash
pnpm run db:migrate
```

#### 6. Test

```typescript
// Test creating with metadata
const dept = await service.create({
  dept_code: 'ICU',
  dept_name: 'Intensive Care',
  metadata: {
    phone: '555-0123',
    email: 'icu@hospital.com',
    budget: 500000,
  },
});

expect(dept.metadata.phone).toBe('555-0123');
```

---

### Feature 2: Add Department Status Enum

**Goal:** Replace boolean `is_active` with enum (active, inactive, archived)

**Steps:**

#### 1. Plan Database Changes

```typescript
// New status values
enum DepartmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

// Migration strategy:
// 1. Add new status column (nullable)
// 2. Migrate data (is_active=true → status='active')
// 3. Drop is_active column
// 4. Rename status to is_active (or is_status for clarity)
```

#### 2. Create Migration

```typescript
export async function up(knex: Knex): Promise<void> {
  // Add new column
  await knex.schema.alterTable('departments', (table) => {
    table.enum('status', ['active', 'inactive', 'archived']).defaultTo('active');
  });

  // Migrate data
  await knex('departments').where('is_active', true).update({ status: 'active' });

  await knex('departments').where('is_active', false).update({ status: 'inactive' });

  // Drop old column
  await knex.schema.alterTable('departments', (table) => {
    table.dropColumn('is_active');
  });
}
```

#### 3. Update Types

```typescript
enum DepartmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

interface Department {
  status: DepartmentStatus;
  // (instead of is_active: boolean)
}
```

#### 4. Add Helper Methods

```typescript
class DepartmentsService {
  isActive(dept: Department): boolean {
    return dept.status === DepartmentStatus.ACTIVE;
  }

  async activate(id: number): Promise<Department | null> {
    return this.update(id, { status: DepartmentStatus.ACTIVE });
  }

  async deactivate(id: number): Promise<Department | null> {
    return this.update(id, { status: DepartmentStatus.INACTIVE });
  }

  async archive(id: number): Promise<Department | null> {
    return this.update(id, { status: DepartmentStatus.ARCHIVED });
  }
}
```

---

### Feature 3: Add Department Soft Delete

**Goal:** Use `deleted_at` timestamp for soft delete

**Steps:**

#### 1. Create Migration

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('departments', (table) => {
    table.timestamp('deleted_at').nullable().comment('Soft delete timestamp');

    table.index(['deleted_at'], 'idx_departments_deleted');
  });
}
```

#### 2. Update Repository

```typescript
// Always filter out soft-deleted by default
async findMany(options: any): Promise<PaginatedListResult<Department>> {
  let query = this.knex('departments')
    .whereNull('deleted_at');  // NEW

  // ... rest of query building
}

// Soft delete instead of hard delete
async delete(id: number | string): Promise<boolean> {
  const result = await this.knex('departments')
    .where('id', id)
    .update({ deleted_at: this.knex.fn.now() });

  return result > 0;
}

// Restore soft-deleted
async restore(id: number): Promise<Department | null> {
  await this.knex('departments')
    .where('id', id)
    .update({ deleted_at: null });

  return this.findById(id);
}
```

#### 3. Add Controller Endpoint

```typescript
async restore(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) {
  const dept = await this.departmentsService.restore(request.params.id);
  if (!dept) return reply.code(404).error('NOT_FOUND');
  return reply.success(dept);
}
```

#### 4. Register Route

```typescript
fastify.patch('/:id/restore', {
  schema: { ... },
  preValidation: [authenticate, authorize],
  handler: controller.restore.bind(controller)
});
```

---

## Testing

### Unit Tests

```typescript
// departments.test.ts
describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: DepartmentsRepository;

  beforeEach(() => {
    // Create mocks
    repository = mock<DepartmentsRepository>();
    service = new DepartmentsService(repository);
  });

  describe('create', () => {
    it('should create department with unique code', async () => {
      repository.findByCode.mockResolvedValue(null); // Code not found

      const result = await service.create({
        dept_code: 'ICU',
        dept_name: 'Intensive Care',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(result.dept_code).toBe('ICU');
    });

    it('should throw error if code exists', async () => {
      repository.findByCode.mockResolvedValue({
        id: 1,
        dept_code: 'ICU',
      } as Department);

      await expect(
        service.create({
          dept_code: 'ICU',
          dept_name: 'Intensive Care',
        }),
      ).rejects.toThrow('CODE_EXISTS');
    });
  });

  describe('validateParent', () => {
    it('should validate parent exists', async () => {
      repository.findById.mockResolvedValue({ id: 1 } as Department);

      const result = await service.validateParent(1);
      expect(result).toBe(true);
    });

    it('should reject non-existent parent', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.validateParent(999);
      expect(result).toBe(false);
    });
  });

  describe('hasCircularHierarchy', () => {
    it('should detect circular hierarchy', async () => {
      // Setup: 1 → 2 → 3
      repository.findById.mockResolvedValueOnce({ id: 2, parent_id: 3 }).mockResolvedValueOnce({ id: 3, parent_id: null });

      // Try to set parent of 1 to 3: 1 → 3 → 1 (circle)
      const hasCircle = await service.hasCircularHierarchy(1, 3);
      expect(hasCircle).toBe(true);
    });
  });
});
```

### Integration Tests

```typescript
// departments.integration.test.ts
describe('Departments API Integration', () => {
  let app: FastifyInstance;
  let db: Knex;

  beforeAll(async () => {
    // Start server with test database
    app = await buildApp();
    db = app.diContainer.get('database');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/departments', () => {
    it('should create department', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/departments',
        payload: {
          dept_code: 'ICU',
          dept_name: 'Intensive Care',
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.data.dept_code).toBe('ICU');

      // Verify in database
      const dept = await db('departments').where('dept_code', 'ICU').first();
      expect(dept).toBeDefined();
      expect(dept.dept_name).toBe('Intensive Care');
    });

    it('should reject duplicate code', async () => {
      // Create first
      await app.inject({
        method: 'POST',
        url: '/api/departments',
        payload: { dept_code: 'ICU', dept_name: 'First' },
        headers: { Authorization: `Bearer ${validToken}` },
      });

      // Try to create second with same code
      const response = await app.inject({
        method: 'POST',
        url: '/api/departments',
        payload: { dept_code: 'ICU', dept_name: 'Second' },
        headers: { Authorization: `Bearer ${validToken}` },
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.error.code).toBe('DEPARTMENTS_CODE_EXISTS');
    });
  });

  describe('GET /api/departments/hierarchy', () => {
    beforeEach(async () => {
      // Setup hierarchy
      await db('departments').insert([
        { id: 1, dept_code: 'HOSPITAL', dept_name: 'Hospital', parent_id: null },
        { id: 2, dept_code: 'NURSING', dept_name: 'Nursing', parent_id: 1 },
        { id: 3, dept_code: 'ICU', dept_name: 'ICU', parent_id: 2 },
      ]);
    });

    it('should return hierarchy tree', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/departments/hierarchy',
        headers: { Authorization: `Bearer ${validToken}` },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body.data.hierarchy).toHaveLength(1);
      expect(body.data.hierarchy[0].dept_code).toBe('HOSPITAL');
      expect(body.data.hierarchy[0].children).toHaveLength(1);
      expect(body.data.hierarchy[0].children[0].children).toHaveLength(1);
    });
  });
});
```

### Run Tests

```bash
# Run all tests
pnpm run test

# Run in watch mode
pnpm run test:watch

# Run specific test file
pnpm run test -- departments.test.ts

# Run with coverage
pnpm run test:coverage
```

---

## Debugging

### Enable Logging

```typescript
// In service method
async create(data: CreateDepartments): Promise<Department> {
  console.log('Creating department:', { code: data.dept_code });

  const existing = await this.departmentsRepository.findByCode(data.dept_code);
  if (existing) {
    console.warn('Duplicate code found:', existing.id);
    throw new AppError('CODE_EXISTS', 409);
  }

  const result = await super.create(data);
  console.log('Department created:', result.id);

  return result;
}
```

### Pino Logger (Recommended)

```typescript
// Using Fastify's built-in logger
async create(request: FastifyRequest, reply: FastifyReply) {
  request.log.info({ body: request.body }, 'Creating department');

  try {
    const dept = await this.service.create(request.body);
    request.log.info({ id: dept.id }, 'Department created successfully');
    return reply.code(201).send(dept);
  } catch (error) {
    request.log.error({ error }, 'Error creating department');
    throw error;
  }
}
```

### Debug Queries

```typescript
// Enable query logging in development
const knex = require('knex')({
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV === 'development', // Log all queries
});

// Or trace specific queries
knex('departments')
  .where('dept_code', 'ICU')
  .on('query', (query) => {
    console.log('Query:', query.sql);
    console.log('Bindings:', query.bindings);
  })
  .then((result) => console.log('Result:', result));
```

### Browser DevTools

```typescript
// Check API calls in browser Network tab
// Look for request/response headers and body

// Example API call in DevTools:
// POST /api/departments
// Headers: Authorization: Bearer ...
// Body: {"dept_code":"ICU","dept_name":"ICU"}
```

---

## Common Tasks

### Task 1: Add a New Endpoint

**Example:** GET /api/departments/:code (get by code instead of ID)

```typescript
// 1. Add to controller
async getByCode(
  request: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply
) {
  const dept = await this.service.findByCode(request.params.code);
  if (!dept) {
    return reply.code(404).error('NOT_FOUND', 'Department not found');
  }
  return reply.success(dept);
}

// 2. Add to routes
fastify.get('/code/:code', {
  schema: {
    params: Type.Object({ code: Type.String() }),
    response: { 200: DepartmentsResponseSchema }
  },
  preValidation: [authenticate, authorize],
  handler: controller.getByCode.bind(controller)
});

// 3. Test it
it('should get department by code', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/api/departments/code/ICU',
    headers: { Authorization: `Bearer ${token}` }
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).data.dept_code).toBe('ICU');
});
```

---

### Task 2: Modify Validation Rule

**Example:** Make department code case-insensitive

```typescript
// 1. Update schema validation
export const CreateDepartmentsSchema = Type.Object({
  dept_code: Type.String({
    maxLength: 10,
    pattern: '^[A-Za-z0-9_-]+$'  // Updated: allow lowercase
  }),
  // ...
});

// 2. Update service to normalize
protected async beforeCreate(data: CreateDepartments): Promise<CreateDepartments> {
  return {
    ...data,
    dept_code: data.dept_code.toUpperCase()  // Normalize to uppercase
  };
}

// 3. Test it
it('should uppercase department code', async () => {
  const dept = await service.create({
    dept_code: 'icu',  // lowercase
    dept_name: 'ICU'
  });

  expect(dept.dept_code).toBe('ICU');  // Stored as uppercase
});
```

---

### Task 3: Optimize Query Performance

**Example:** Cache dropdown list

```typescript
// 1. Add caching to repository
class DepartmentsRepository {
  private dropdownCache: DepartmentDropdownItem[] | null = null;
  private cacheTime = 0;

  async getDropdown(): Promise<DepartmentDropdownItem[]> {
    // Return cache if fresh (< 5 minutes)
    if (this.dropdownCache && Date.now() - this.cacheTime < 5 * 60 * 1000) {
      return this.dropdownCache;
    }

    // Load from database
    this.dropdownCache = await this.knex('departments').select('id', 'dept_code', 'dept_name', 'parent_id', 'is_active').where('is_active', true).orderBy('dept_code');

    this.cacheTime = Date.now();
    return this.dropdownCache;
  }

  // Invalidate cache on mutations
  async create(data: CreateDepartments): Promise<Department> {
    const result = await super.create(data);
    this.dropdownCache = null; // Clear cache
    return result;
  }
}

// 2. Test cache effectiveness
it('should cache dropdown results', async () => {
  // First call: hits database
  const start1 = Date.now();
  const result1 = await repo.getDropdown();
  const time1 = Date.now() - start1;

  // Second call: returns cache immediately
  const start2 = Date.now();
  const result2 = await repo.getDropdown();
  const time2 = Date.now() - start2;

  expect(result1).toEqual(result2);
  expect(time2).toBeLessThan(time1); // Cache is much faster
});
```

---

## Performance Tips

### 1. Use Indexes Wisely

```typescript
// Good: indexed columns
SELECT * FROM departments WHERE parent_id = 1;        // Fast (indexed)
SELECT * FROM departments WHERE dept_code = 'ICU';    // Fast (indexed)

// Bad: non-indexed columns
SELECT * FROM departments WHERE dept_name LIKE '%Care%';  // Slow (full table scan)

// Better: use tsvector for full-text search
ALTER TABLE departments ADD COLUMN search_text tsvector;
CREATE INDEX idx_departments_search ON departments USING gin(search_text);
```

### 2. Batch Operations

```typescript
// Bad: Multiple individual inserts
for (const dept of departments) {
  await repo.create(dept); // N queries
}

// Good: Single batch insert
const results = await knex('departments').insert(departments).returning('*'); // 1 query
```

### 3. Select Only Needed Fields

```typescript
// Bad: Select all fields
SELECT * FROM departments;

// Good: Select specific fields
SELECT id, dept_code, dept_name FROM departments;
```

### 4. Pagination for Large Lists

```typescript
// Bad: Load all 10,000 departments
SELECT * FROM departments;

// Good: Load one page at a time
SELECT * FROM departments LIMIT 20 OFFSET 0;
```

---

## Best Practices

### 1. Always Validate Input

```typescript
// Bad: Trust user input
async create(data: any) {
  return super.create(data);
}

// Good: Validate explicitly
async create(data: CreateDepartments) {
  await this.validateCreate(data);
  return super.create(data);
}
```

### 2. Use Transactions for Atomic Operations

```typescript
// Bad: Multiple separate operations
await repo.create(parent);
await repo.create(child); // If fails, parent left orphaned

// Good: Use transaction
await knex.transaction(async (trx) => {
  const parent = await repo.create(parentData, { trx });
  const child = await repo.create(childData, { trx });
}); // All-or-nothing
```

### 3. Provide Clear Error Messages

```typescript
// Bad: Generic error
throw new Error('Operation failed');

// Good: Specific, actionable error
throw new AppError('Cannot delete department - has 3 child departments. Reassign children first.', 422, 'CANNOT_DELETE_HAS_CHILDREN', { childCount: 3 });
```

### 4. Log Important Operations

```typescript
// Log what matters
async create(data: CreateDepartments): Promise<Department> {
  this.logger.info('Creating department', { code: data.dept_code });

  const result = await super.create(data);

  this.logger.info('Department created', { id: result.id });

  return result;
}
```

### 5. Type Everything

```typescript
// Bad: Any types
async findDepts(filter: any): any[] {
  return this.repo.findMany(filter);
}

// Good: Explicit types
async findDepts(filter: ListDepartmentsQuery): Promise<Department[]> {
  return this.repo.findMany(filter);
}
```

---

For more information, see:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design details
- [API_REFERENCE.md](./API_REFERENCE.md) - Endpoint documentation
- [SYSTEM_INIT_INTEGRATION.md](./SYSTEM_INIT_INTEGRATION.md) - Bulk import
