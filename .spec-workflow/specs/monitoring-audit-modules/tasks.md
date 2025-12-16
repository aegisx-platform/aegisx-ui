# Tasks Document: Monitoring & Audit Modules Restoration

## Overview

This task breakdown implements the restoration of four backend modules (Error Logs, Activity Logs, User Profile, API Keys) with modern UI/UX. Tasks are organized in dependency order and can be parallelized where indicated.

**Total Estimated Time:** 80 hours (2 weeks)
**Phases:** Backend (40h) → Frontend (30h) → Testing (10h)

---

## Phase 1: Database & Infrastructure (4 hours)

### - [ ] 1.1. Create API Keys Database Migration

- **Files:** `apps/api/src/database/migrations/XXX_create_api_keys_table.ts`
- **Description:** Create migration for `api_keys` table with proper indexes
- **Dependencies:** None
- **Time:** 1 hour
- **\_Leverage:** Existing migrations in `apps/api/src/database/migrations/`, Knex migration patterns
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Engineer with PostgreSQL expertise | Task: Create Knex migration for api_keys table with columns (id UUID PK, user_id UUID FK, name VARCHAR, key_hash VARCHAR, key_prefix VARCHAR, permissions TEXT[], last_used_at TIMESTAMP, usage_count INTEGER, expires_at TIMESTAMP, revoked BOOLEAN, revoked_at TIMESTAMP, created/updated timestamps) and indexes (user_id, key_hash, revoked) | Restrictions: Must use uuid_generate_v4() for id, add FK constraint to users table with ON DELETE CASCADE, create indexes for performance | Success: Migration runs successfully, table created with proper constraints and indexes, can rollback cleanly | Instructions: 1) Mark task in-progress in tasks.md, 2) Create migration file, 3) Test up/down migrations, 4) Log implementation with artifacts, 5) Mark task completed

### - [ ] 1.2. Run Database Migrations

- **Files:** Run `pnpm run db:migrate`
- **Description:** Apply new api_keys migration to database
- **Dependencies:** 1.1
- **Time:** 15 minutes
- **\_Leverage:** Existing database connection in `apps/api/src/database/`
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with database migration expertise | Task: Run database migrations to create api_keys table in development database | Restrictions: Verify existing tables are not affected, backup database before running, confirm migration success | Success: api_keys table exists in database, indexes created, can query table | Instructions: 1) Mark in-progress, 2) Run migration command, 3) Verify table created, 4) Log implementation, 5) Mark completed

### - [ ] 1.3. Re-enable Activity Logging Middleware

- **Files:**
  - `apps/api/src/bootstrap/plugin.loader.ts` (uncomment line 18-19)
  - `apps/api/src/plugins/activity-logging/activity-logging.plugin.ts` (verify configuration)
- **Description:** Re-enable activity logging middleware that was disabled
- **Dependencies:** None (can run in parallel with 1.1-1.2)
- **Time:** 30 minutes
- **\_Leverage:** Existing activity-logging plugin code in `apps/api/src/plugins/activity-logging/`
- **\_Requirements:** Requirement 2 (Activity Logs)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify plugin expertise | Task: Re-enable activity logging middleware by uncommenting import in plugin.loader.ts and verifying plugin configuration | Restrictions: Do not modify activity logging logic, ensure plugin loads after database connection, verify activity_logs table exists | Success: Activity logging plugin loads successfully, activities are logged to activity_logs table on user actions | Instructions: 1) Mark in-progress, 2) Uncomment import and registration, 3) Test by making authenticated request, 4) Verify log entry created, 5) Log implementation, 6) Mark completed

---

## Phase 2: Backend - Error Logs Module (Core Layer) (6 hours)

**Can start in parallel after Phase 1 completes**

### - [x] 2.1. Create Error Logs TypeBox Schemas

- **Files:** `apps/api/src/layers/core/audit/error-logs/error-logs.schemas.ts`
- **Description:** Define TypeBox schemas for error logs API (query, response, stats)
- **Dependencies:** 1.2
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.schemas.ts`, existing TypeBox patterns
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with TypeBox schema expertise | Task: Create comprehensive TypeBox schemas for error logs (ErrorLogSchema, ErrorQuerySchema, ErrorStatsSchema, ErrorLogResponseSchema) extending base schemas | Restrictions: Must use Type.Object for all schemas, include proper JSDoc comments, export both schema and inferred types, validate UUID format for ids | Success: All schemas compile, types are properly inferred, schemas can validate API requests/responses | Instructions: 1) Mark in-progress, 2) Create schemas file, 3) Test schema validation, 4) Log with artifacts (schemas created), 5) Mark completed

### - [x] 2.2. Create Error Logs Repository

- **Files:** `apps/api/src/layers/core/audit/error-logs/error-logs.repository.ts`
- **Description:** Implement ErrorLogsRepository extending BaseAuditRepository
- **Dependencies:** 2.1
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.repository.ts`
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with database patterns expertise | Task: Create ErrorLogsRepository class extending BaseAuditRepository, configure table name as 'error_logs', add custom method getStatsByLevel() | Restrictions: Must call super() in constructor, do not reimplement base methods, use Knex query builder, handle errors properly | Success: Repository extends base class, can query error_logs table, getStatsByLevel returns grouped statistics | Instructions: 1) Mark in-progress, 2) Create repository class, 3) Test queries, 4) Log with artifacts (class created, methods: constructor, getStatsByLevel), 5) Mark completed

### - [x] 2.3. Create Error Logs Service

- **Files:** `apps/api/src/layers/core/audit/error-logs/error-logs.service.ts`
- **Description:** Implement ErrorLogsService extending BaseAuditService
- **Dependencies:** 2.2
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.service.ts`, Redis for caching
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with service layer expertise | Task: Create ErrorLogsService class extending BaseAuditService, implement stats caching with Redis (5 min TTL), add getStatsByLevel method | Restrictions: Must call super(repository, 'error_logs'), cache stats in Redis with key 'error-logs:stats', handle cache misses, do not reimplement base methods | Success: Service extends base, stats are cached, cache invalidates properly, all base methods work | Instructions: 1) Mark in-progress, 2) Create service class, 3) Test with cache, 4) Log with artifacts (class created, methods: constructor, getStatsByLevel, caching integration), 5) Mark completed

### - [x] 2.4. Create Error Logs Controller

- **Files:** `apps/api/src/layers/core/audit/error-logs/error-logs.controller.ts`
- **Description:** Implement ErrorLogsController extending BaseAuditController
- **Dependencies:** 2.3
- **Time:** 30 minutes
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.controller.ts`
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with controller patterns expertise | Task: Create ErrorLogsController class extending BaseAuditController with type parameters <ErrorLog, ErrorQuery, ErrorStats, ErrorLogsService>, implement getExportFilename() returning 'error-logs' | Restrictions: Must call super(service, 'Error log') in constructor, do not reimplement base methods, all CRUD inherited automatically | Success: Controller extends base, getExportFilename returns correct name, inherits all endpoints | Instructions: 1) Mark in-progress, 2) Create controller (minimal code), 3) Log with artifacts (class created, minimal implementation leveraging base), 5) Mark completed

### - [x] 2.5. Create Error Logs Routes

- **Files:** `apps/api/src/layers/core/audit/error-logs/error-logs.routes.ts`
- **Description:** Define Fastify routes for error logs with authentication and RBAC
- **Dependencies:** 2.4, 2.1 (schemas)
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.routes.ts`, auth strategies
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify routing expertise | Task: Create error logs routes (GET /, GET /stats, GET /:id, DELETE /:id, DELETE /cleanup, GET /export) with JWT auth and RBAC permissions (monitoring:read for GET, monitoring:write for DELETE) | Restrictions: Must use fastify.authenticate preValidation hook, use verifyPermission for RBAC, reference schemas from error-logs.schemas.ts, register all routes under error-logs.plugin.ts | Success: All 6 endpoints registered, authentication required, permissions checked, schemas validate requests | Instructions: 1) Mark in-progress, 2) Create routes, 3) Test with Postman/curl, 4) Log with artifacts (apiEndpoints: 6 routes documented), 5) Mark completed

### - [x] 2.6. Create Error Logs Plugin

- **Files:**
  - `apps/api/src/layers/core/audit/error-logs/error-logs.plugin.ts`
  - `apps/api/src/layers/core/audit/error-logs/index.ts`
- **Description:** Create Fastify plugin to register error logs module
- **Dependencies:** 2.5
- **Time:** 30 minutes
- **\_Leverage:** Existing plugin patterns, `apps/api/src/layers/core/audit/file-audit/file-audit.plugin.ts`
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify plugin architecture expertise | Task: Create error-logs.plugin.ts to register routes under /error-logs prefix, initialize service and controller, export plugin with fp() wrapper | Restrictions: Must use fastify-plugin wrapper, set plugin name 'error-logs-module', depend on ['knex-plugin', 'redis-plugin', 'schemas-plugin'], register routes with prefix '/error-logs' | Success: Plugin loads successfully, routes accessible at /api/error-logs/\*, dependencies loaded | Instructions: 1) Mark in-progress, 2) Create plugin, 3) Test loading, 4) Log with artifacts, 5) Mark completed

### - [x] 2.7. Register Error Logs Plugin in Plugin Loader

- **Files:** `apps/api/src/bootstrap/plugin.loader.ts`
- **Description:** Add error-logs plugin to core layer group
- **Dependencies:** 2.6
- **Time:** 15 minutes
- **\_Leverage:** Existing plugin registration patterns in plugin.loader.ts
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with Fastify application bootstrapping expertise | Task: Import error-logs plugin and register in createCoreLayerGroup() alongside file-audit and login-attempts plugins | Restrictions: Must import from correct path, register in Core layer (not Platform), maintain plugin loading order, do not break existing plugins | Success: Plugin loads on server start, no errors in logs, routes accessible | Instructions: 1) Mark in-progress, 2) Add import and registration, 3) Start server and verify, 4) Log implementation, 5) Mark completed

---

## Phase 3: Backend - Activity Logs Module (Core Layer) (5 hours)

**Can run in parallel with Phase 2 after Phase 1 completes**

### - [x] 3.1. Create Activity Logs TypeBox Schemas

- **Files:** `apps/api/src/layers/core/audit/activity-logs/activity-logs.schemas.ts`
- **Description:** Define TypeBox schemas for activity logs API
- **Dependencies:** 1.3
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/core/audit/base/base.schemas.ts`, error-logs.schemas.ts (reference)
- **\_Requirements:** Requirement 2 (Activity Logs Auditing)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with TypeBox schema expertise | Task: Create TypeBox schemas for activity logs (ActivityLogSchema, ActivityQuerySchema, ActivityStatsSchema) following same pattern as error-logs schemas | Restrictions: Must extend base schemas, include severity enum ('info' | 'warning' | 'error' | 'critical'), export types and schemas | Success: Schemas compile, types inferred, similar structure to error-logs | Instructions: 1) Mark in-progress, 2) Create schemas, 3) Test validation, 4) Log with artifacts (schemas created), 5) Mark completed

### - [x] 3.2. Create Activity Logs Repository, Service, Controller

- **Files:**
  - `apps/api/src/layers/core/audit/activity-logs/activity-logs.repository.ts`
  - `apps/api/src/layers/core/audit/activity-logs/activity-logs.service.ts`
  - `apps/api/src/layers/core/audit/activity-logs/activity-logs.controller.ts`
- **Description:** Implement repository, service, controller extending base classes (similar to error logs)
- **Dependencies:** 3.1
- **Time:** 2 hours
- **\_Leverage:** BaseAuditRepository, BaseAuditService, BaseAuditController, error-logs module (reference)
- **\_Requirements:** Requirement 2 (Activity Logs Auditing)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with audit patterns expertise | Task: Create ActivityLogsRepository (table: 'activity_logs'), ActivityLogsService (with Redis caching), and ActivityLogsController (export filename: 'activity-logs') following exact same pattern as error logs module | Restrictions: Must extend base classes, use same caching strategy, implement all required methods, configure table name correctly | Success: All three classes work together, inherit base functionality, stats cached properly | Instructions: 1) Mark in-progress, 2) Create all 3 files, 3) Test CRUD operations, 4) Log with artifacts (3 classes created), 5) Mark completed

### - [x] 3.3. Create Activity Logs Routes and Plugin

- **Files:**
  - `apps/api/src/layers/core/audit/activity-logs/activity-logs.routes.ts`
  - `apps/api/src/layers/core/audit/activity-logs/activity-logs.plugin.ts`
  - `apps/api/src/layers/core/audit/activity-logs/index.ts`
- **Description:** Define routes and plugin (similar to error logs)
- **Dependencies:** 3.2
- **Time:** 1 hour
- **\_Leverage:** error-logs.routes.ts, error-logs.plugin.ts (copy and modify)
- **\_Requirements:** Requirement 2 (Activity Logs Auditing)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify routing expertise | Task: Create activity logs routes (6 endpoints like error logs) with permissions (audit:read for GET, audit:admin for DELETE/export), create plugin with prefix '/activity-logs' | Restrictions: Must use authentication, check audit permissions (not monitoring), follow same structure as error logs | Success: 6 endpoints work, proper permissions enforced, plugin loads | Instructions: 1) Mark in-progress, 2) Create routes and plugin, 3) Test endpoints, 4) Log with artifacts (6 API endpoints), 5) Mark completed

### - [x] 3.4. Register Activity Logs Plugin

- **Files:** `apps/api/src/bootstrap/plugin.loader.ts`
- **Description:** Register activity-logs plugin in core layer
- **Dependencies:** 3.3
- **Time:** 15 minutes
- **\_Leverage:** plugin.loader.ts patterns
- **\_Requirements:** Requirement 2 (Activity Logs Auditing)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with plugin registration expertise | Task: Import and register activity-logs plugin in createCoreLayerGroup() in plugin.loader.ts | Restrictions: Register in Core layer, maintain order, verify server starts | Success: Plugin loads, routes work, no conflicts | Instructions: 1) Mark in-progress, 2) Register plugin, 3) Test server start, 4) Log implementation, 5) Mark completed

---

## Phase 4: Backend - User Profile Module (Platform Layer) (10 hours)

**Can start after Phase 1 completes, parallel with Phases 2-3**

### - [x] 4.1. Create Profile TypeBox Schemas

- **Files:** `apps/api/src/layers/platform/user-profile/schemas/profile.schemas.ts`
- **Description:** Define schemas for profile operations (get, update, preferences)
- **Dependencies:** 1.2
- **Time:** 1.5 hours
- **\_Leverage:** `apps/api/src/layers/platform/users/users.schemas.ts` for User type
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with schema design expertise | Task: Create TypeBox schemas (ProfileSchema with id, email, first_name, last_name, department_id, avatar_url, theme, language, notifications; UpdateProfileSchema; PreferencesSchema; ProfileResponseSchema) | Restrictions: Must include department_id field, validate theme enum ('light' | 'dark' | 'auto'), language enum ('en' | 'th'), UUID validation | Success: Schemas compile, types inferred, includes all profile fields | Instructions: 1) Mark in-progress, 2) Create schemas, 3) Test validation, 4) Log with artifacts (schemas created), 5) Mark completed

### - [x] 4.2. Create Profile Repository

- **Files:** `apps/api/src/layers/platform/user-profile/repositories/profile.repository.ts`
- **Description:** Repository for profile data access (uses users table)
- **Dependencies:** 4.1
- **Time:** 1 hour
- **\_Leverage:** `apps/api/src/layers/platform/users/users.repository.ts` (may reuse or wrap)
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with repository pattern expertise | Task: Create ProfileRepository with methods getProfile(userId), updateProfile(userId, data), wrapping or extending UserRepository to query 'users' table | Restrictions: Query 'users' table, include department join if needed, validate department_id exists, return profile data only (not password hash) | Success: Repository can get/update profile, department validated, password excluded | Instructions: 1) Mark in-progress, 2) Create repository, 3) Test queries, 4) Log with artifacts (class created, methods documented), 5) Mark completed

### - [x] 4.3. Create Profile Service

- **Files:** `apps/api/src/layers/platform/user-profile/services/profile.service.ts`
- **Description:** Business logic for profile operations
- **Dependencies:** 4.2
- **Time:** 1 hour
- **\_Leverage:** ProfileRepository, department validation logic
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with service layer expertise | Task: Create ProfileService with getProfile(userId), updateProfile(userId, data), validateDepartment(departmentId) methods | Restrictions: Must validate department exists before update, sanitize inputs, throw appropriate errors (404 for not found, 400 for invalid department), do not expose sensitive data | Success: Service validates properly, updates profile, checks department, handles errors | Instructions: 1) Mark in-progress, 2) Create service, 3) Test business logic, 4) Log with artifacts (class and methods), 5) Mark completed

### - [x] 4.4. Create Avatar Service

- **Files:** `apps/api/src/layers/platform/user-profile/services/avatar.service.ts`
- **Description:** Handle avatar upload/delete operations
- **Dependencies:** 4.3
- **Time:** 2 hours
- **\_Leverage:** `apps/api/src/layers/platform/file-upload/` plugin for file handling
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with file upload expertise | Task: Create AvatarService with uploadAvatar(userId, file), deleteAvatar(userId) methods using FileUploadPlugin for storage, resize to 200x200px, convert to WebP | Restrictions: Validate file type (image/\*), max size 5MB, store in avatars/ directory, update users.avatar_url, delete old avatar on new upload | Success: Avatar uploads, resized, stored, URL returned, old avatar deleted | Instructions: 1) Mark in-progress, 2) Create service, 3) Test upload/delete, 4) Log with artifacts (class, methods, file storage integration), 5) Mark completed

### - [x] 4.5. Create Profile Controllers

- **Files:**
  - `apps/api/src/layers/platform/user-profile/controllers/profile.controller.ts`
  - `apps/api/src/layers/platform/user-profile/controllers/avatar.controller.ts`
  - `apps/api/src/layers/platform/user-profile/controllers/preferences.controller.ts`
  - `apps/api/src/layers/platform/user-profile/controllers/activity.controller.ts`
- **Description:** Controllers for profile, avatar, preferences, activity endpoints
- **Dependencies:** 4.4
- **Time:** 2 hours
- **\_Leverage:** ProfileService, AvatarService, ActivityLogsService (for activity endpoint)
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with controller patterns expertise | Task: Create 4 controllers - ProfileController (GET/PUT /profile), AvatarController (POST/DELETE /profile/avatar), PreferencesController (GET/PUT /profile/preferences), ActivityController (GET /profile/activity - read-only user's activities) | Restrictions: Extract userId from request.user, use services, return standardized responses with reply.success(), handle errors with reply.error() | Success: All controllers handle requests correctly, use services, proper responses | Instructions: 1) Mark in-progress, 2) Create 4 controllers, 3) Test each, 4) Log with artifacts (4 classes created), 5) Mark completed

### - [x] 4.6. Create Profile Routes

- **Files:** `apps/api/src/layers/platform/user-profile/routes/profile.routes.ts`
- **Description:** Define all profile-related routes
- **Dependencies:** 4.5, 4.1 (schemas)
- **Time:** 1.5 hours
- **\_Leverage:** Auth strategies, multipart plugin for avatar upload
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify routing expertise | Task: Create profile routes - GET /profile, PUT /profile, POST /profile/avatar (multipart), DELETE /profile/avatar, GET/PUT /profile/preferences, GET /profile/activity - all require authentication, reference schemas | Restrictions: All routes must use authenticate preValidation hook, avatar routes use multipart, GET /profile/activity uses pagination params, reference correct controllers | Success: 8 profile endpoints registered, authenticated, schemas validate | Instructions: 1) Mark in-progress, 2) Create routes, 3) Test all endpoints, 4) Log with artifacts (8 API endpoints documented), 5) Mark completed

### - [x] 4.7. Create User Profile Plugin

- **Files:**
  - `apps/api/src/layers/platform/user-profile/user-profile.plugin.ts`
  - `apps/api/src/layers/platform/user-profile/index.ts`
- **Description:** Plugin to register user profile module
- **Dependencies:** 4.6
- **Time:** 30 minutes
- **\_Leverage:** Platform plugin patterns
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify plugin expertise | Task: Create user-profile.plugin.ts to register profile routes under /v1/platform/profile prefix, initialize services and controllers | Restrictions: Must use fp() wrapper, plugin name 'user-profile-module', depend on knex, redis, file-upload plugins, register under /v1/platform/profile | Success: Plugin loads, routes accessible at /api/v1/platform/profile/\* | Instructions: 1) Mark in-progress, 2) Create plugin, 3) Test loading, 4) Log with artifacts, 5) Mark completed

### - [x] 4.8. Register User Profile Plugin

- **Files:** `apps/api/src/bootstrap/plugin.loader.ts`
- **Description:** Register user-profile plugin in platform layer
- **Dependencies:** 4.7
- **Time:** 15 minutes
- **\_Leverage:** plugin.loader.ts Platform layer registration
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with plugin loading expertise | Task: Import and register user-profile plugin in createPlatformLayerGroup() in plugin.loader.ts | Restrictions: Register in Platform layer (not Core), maintain order, verify server starts | Success: Plugin loads, routes accessible, no errors | Instructions: 1) Mark in-progress, 2) Register plugin, 3) Test server, 4) Log implementation, 5) Mark completed

---

## Phase 5: Backend - API Keys Module (Platform Layer) (14 hours)

**Can start after Phase 1 completes**

### - [x] 5.1. Create API Keys TypeBox Schemas

- **Files:** `apps/api/src/layers/platform/api-keys/api-keys.schemas.ts`
- **Description:** Define schemas for API key operations
- **Dependencies:** 1.2
- **Time:** 2 hours
- **\_Leverage:** TypeBox patterns, UUID validation
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with API schema expertise | Task: Create TypeBox schemas (ApiKeySchema, CreateApiKeySchema with name/permissions/expires_at, ApiKeyResponseSchema excluding key_hash, UsageStatsSchema) | Restrictions: Must validate permissions array, expires_at optional ISO date, key_hash never exposed in responses, UUID validation | Success: Schemas compile, security enforced (no key_hash exposure), types inferred | Instructions: 1) Mark in-progress, 2) Create schemas, 3) Test validation, 4) Log with artifacts (schemas created), 5) Mark completed

### - [x] 5.2. Create Crypto Service for Key Hashing

- **Files:** `apps/api/src/layers/platform/api-keys/services/crypto.service.ts`
- **Description:** Service for generating and hashing API keys
- **Dependencies:** 5.1
- **Time:** 2 hours
- **\_Leverage:** bcrypt library, crypto.randomBytes for key generation
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Security Engineer with cryptography expertise | Task: Create CryptoService with generateApiKey() (returns 32-byte random key with prefix 'pk*live*'), hashKey(key) (bcrypt cost=12), verifyKey(key, hash) methods | Restrictions: Must use crypto.randomBytes for secure randomness, bcrypt for hashing (never plain text), key format 'pk*live*{base64}', prefix for display purposes | Success: Keys generated securely, hashed with bcrypt, verification works, prefix extractable | Instructions: 1) Mark in-progress, 2) Create service, 3) Test generation/hashing, 4) Log with artifacts (class, security methods), 5) Mark completed

### - [x] 5.3. Create API Keys Repository

- **Files:** `apps/api/src/layers/platform/api-keys/api-keys.repository.ts`
- **Description:** Repository for API keys data access
- **Dependencies:** 5.2
- **Time:** 2 hours
- **\_Leverage:** Knex query builder, api_keys table
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with repository pattern expertise | Task: Create ApiKeysRepository with methods: create(userId, data), findByUserId(userId), findById(id), findByKeyHash(hash), update(id, data), revoke(id), incrementUsage(id) | Restrictions: Store key_hash (never plain key), query api_keys table, filter by revoked=false for active keys, include user_id in queries for security | Success: Repository performs CRUD, finds by hash, increments usage, proper filtering | Instructions: 1) Mark in-progress, 2) Create repository, 3) Test queries, 4) Log with artifacts (class, methods documented), 5) Mark completed

### - [x] 5.4. Create API Keys Service

- **Files:** `apps/api/src/layers/platform/api-keys/api-keys.service.ts`
- **Description:** Business logic for API key management
- **Dependencies:** 5.3
- **Time:** 3 hours
- **\_Leverage:** ApiKeysRepository, CryptoService, ActivityLogsService for audit trail
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with API security expertise | Task: Create ApiKeysService with createKey(userId, name, permissions, expiresAt) returns {key, keyData}, listKeys(userId), getKey(id), updateKey(id, data), revokeKey(userId, keyId), verifyKey(key), getUsage(keyId) | Restrictions: Generate key with CryptoService, hash before storage, return plain key ONLY on creation, validate permissions, check expiration on verify, log all operations to activity logs, enforce user ownership | Success: Keys created securely, verified correctly, usage tracked, audit logged | Instructions: 1) Mark in-progress, 2) Create service, 3) Test all methods, 4) Log with artifacts (class, methods, audit integration), 5) Mark completed

### - [x] 5.5. Create API Key Authentication Middleware

- **Files:** `apps/api/src/layers/platform/api-keys/middleware/api-key-auth.middleware.ts`
- **Description:** Middleware to authenticate requests using API keys
- **Dependencies:** 5.4
- **Time:** 2 hours
- **\_Leverage:** ApiKeysService, existing auth patterns
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Security Engineer with authentication middleware expertise | Task: Create API key authentication middleware - check X-API-Key header, verify key with ApiKeysService.verifyKey(), check expiration, check revoked status, load user and permissions into request.user, increment usage count | Restrictions: Return 401 if key invalid/expired/revoked, do not throw errors (causes timeout), use reply.unauthorized(), rate limit per key (1000 req/hour), log authentication attempts | Success: Middleware authenticates API key requests, loads user context, enforces rate limits, handles errors gracefully | Instructions: 1) Mark in-progress, 2) Create middleware, 3) Test with valid/invalid keys, 4) Log with artifacts (middleware, integration pattern), 5) Mark completed

### - [x] 5.6. Create API Keys Controller

- **Files:** `apps/api/src/layers/platform/api-keys/api-keys.controller.ts`
- **Description:** Controller for API key management endpoints
- **Dependencies:** 5.5
- **Time:** 2 hours
- **\_Leverage:** ApiKeysService
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with API controller expertise | Task: Create ApiKeysController with methods: listKeys(GET /), createKey(POST /), getKey(GET /:id), updateKey(PUT /:id), revokeKey(DELETE /:id), getUsage(GET /:id/usage) | Restrictions: Extract userId from request.user, validate user owns key, return key plaintext ONLY on creation with warning, use services, standardized responses | Success: All endpoints work, security enforced (ownership), key shown once | Instructions: 1) Mark in-progress, 2) Create controller, 3) Test endpoints, 4) Log with artifacts (class, methods), 5) Mark completed

### - [x] 5.7. Create API Keys Routes and Plugin

- **Files:**
  - `apps/api/src/layers/platform/api-keys/api-keys.routes.ts`
  - `apps/api/src/layers/platform/api-keys/api-keys.plugin.ts`
  - `apps/api/src/layers/platform/api-keys/index.ts`
- **Description:** Routes and plugin for API keys module
- **Dependencies:** 5.6, 5.1 (schemas)
- **Time:** 1 hour
- **\_Leverage:** Platform routing patterns, RBAC permissions
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer with Fastify routing expertise | Task: Create api-keys routes (GET /, POST /, GET /:id, PUT /:id, DELETE /:id, GET /:id/usage) with authentication and permission 'api-keys:manage', create plugin with prefix /v1/platform/api-keys | Restrictions: All routes require authenticate hook, check api-keys:manage permission, reference schemas, register in plugin with dependencies | Success: 6 endpoints work, authenticated, permissions enforced | Instructions: 1) Mark in-progress, 2) Create routes and plugin, 3) Test all endpoints, 4) Log with artifacts (6 API endpoints documented), 5) Mark completed

### - [x] 5.8. Register API Keys Plugin

- **Files:** `apps/api/src/bootstrap/plugin.loader.ts`
- **Description:** Register api-keys plugin in platform layer
- **Dependencies:** 5.7
- **Time:** 15 minutes
- **\_Leverage:** plugin.loader.ts Platform registration
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer | Task: Import and register api-keys plugin in createPlatformLayerGroup() | Restrictions: Platform layer, maintain order, verify server starts | Success: Plugin loads, routes work | Instructions: 1) Mark in-progress, 2) Register, 3) Test, 4) Log, 5) Mark completed

---

## Phase 6: Frontend - Update Services & Shared Components (8 hours)

**Can start in parallel with backend development**

### - [x] 6.1. Update Error Logs Service baseUrl

- **Files:** `apps/web/src/app/core/monitoring/services/error-logs.service.ts` (line 36)
- **Description:** Update baseUrl from '/error-logs' to '/error-logs' (already correct - verify only)
- **Dependencies:** None
- **Time:** 15 minutes
- **\_Leverage:** Existing service implementation
- **\_Requirements:** Requirement 1 (Error Logs Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Verify ErrorLogsService baseUrl is '/error-logs' (Core layer pattern), if not update it, test service can call backend | Restrictions: Do not modify service logic, only verify/update baseUrl, baseUrl should be '/error-logs' without /api prefix (interceptor adds it) | Success: Service baseUrl correct, can fetch error logs from backend | Instructions: 1) Mark in-progress, 2) Check line 36, 3) Test API call, 4) Log implementation, 5) Mark completed

### - [x] 6.2. Update Activity Logs Service baseUrl

- **Files:** `apps/web/src/app/core/monitoring/services/activity-logs.service.ts` (line 39)
- **Description:** Update baseUrl from '/activity-logs' to '/activity-logs' (already correct - verify only)
- **Dependencies:** None
- **Time:** 15 minutes
- **\_Leverage:** Existing service implementation
- **\_Requirements:** Requirement 2 (Activity Logs Auditing)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Verify ActivityLogsService baseUrl is '/activity-logs', if not update it, test service | Restrictions: Only verify/update baseUrl, should be '/activity-logs' without /api | Success: Service baseUrl correct, can fetch activities | Instructions: 1) Mark in-progress, 2) Check line 39, 3) Test, 4) Log, 5) Mark completed

### - [x] 6.3. Add Profile Methods to User Service

- **Files:** `apps/web/src/app/core/users/services/user.service.ts`
- **Description:** Add methods for profile operations (getProfile, updateProfile, uploadAvatar, etc.)
- **Dependencies:** None (can run in parallel)
- **Time:** 2 hours
- **\_Leverage:** Existing UserService structure, HttpClient
- **\_Requirements:** Requirement 3 (User Profile Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular services expertise | Task: Add profile methods to UserService - getProfile(), updateProfile(data), uploadAvatar(file), deleteAvatar(), getPreferences(), updatePreferences(data), getUserActivity(query), all calling /v1/platform/profile/\* endpoints | Restrictions: Use HttpClient, return Observables, handle errors with catchError, follow existing service patterns in UserService | Success: All profile methods work, call correct endpoints, return typed responses | Instructions: 1) Mark in-progress, 2) Add 7 methods, 3) Test each, 4) Log with artifacts (methods added to UserService), 5) Mark completed

### - [x] 6.4. Create API Keys Service

- **Files:** `apps/web/src/app/core/api-keys/services/api-keys.service.ts`
- **Description:** New service for API keys management with Signal state
- **Dependencies:** None
- **Time:** 2 hours
- **\_Leverage:** ErrorLogsService as reference for Signal-based state pattern
- **\_Requirements:** Requirement 4 (API Keys Management)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular Signals expertise | Task: Create ApiKeysService with Signal state (keys, loading, error), methods: listKeys(), createKey(data), getKey(id), updateKey(id, data), revokeKey(id), getUsage(id), all calling /v1/platform/api-keys/\* | Restrictions: Use Signal-based state like ErrorLogsService, baseUrl='/v1/platform/api-keys', handle key display (show once warning), return Observables | Success: Service manages state with Signals, all methods work, calls correct endpoints | Instructions: 1) Mark in-progress, 2) Create service, 3) Test all methods, 4) Log with artifacts (ApiKeysService created with 6 methods), 5) Mark completed

### - [x] 6.5. Create Shared DataTable Component

- **Files:** `apps/web/src/app/shared/components/data-table/data-table.component.ts`
- **Description:** Reusable data table component using Angular Material Table
- **Dependencies:** None
- **Time:** 3 hours
- **\_Leverage:** Angular Material MatTable, MatPaginator, MatSort
- **\_Requirements:** Requirement 5 (UI/UX Design System)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular Material expertise | Task: Create reusable DataTableComponent with @Inputs (data, columns, totalItems, pageSize, loading), @Outputs (pageChange, sortChange, rowClick, actionClick), using mat-table, mat-paginator, mat-sort, support custom cell templates | Restrictions: Must be generic <T>, use MatTableDataSource, emit events for parent handling, style with TailwindCSS, support column types (text, date, badge, actions) | Success: Component is reusable, displays data in table, paginated, sortable, emits events | Instructions: 1) Mark in-progress, 2) Create component, 3) Test with sample data, 4) Log with artifacts (DataTableComponent created, reusable), 5) Mark completed

---

## Phase 7: Frontend - Error Logs Pages (4 hours)

**Depends on Phase 6.1, 6.5**

### - [ ] 7.1. Create Error Logs List Page

- **Files:**
  - `apps/web/src/app/core/monitoring/pages/error-logs/error-logs-list.page.ts`
  - `apps/web/src/app/core/monitoring/pages/error-logs/error-logs-list.page.html`
  - `apps/web/src/app/core/monitoring/pages/error-logs/error-logs.config.ts`
- **Description:** List page for error logs with table, filters, stats
- **Dependencies:** 6.1, 6.5
- **Time:** 3 hours
- **\_Leverage:** DataTableComponent, ErrorLogsService, AegisX stats-card, Angular Material
- **\_Requirements:** Requirement 1, 5 (Error Logs + UI/UX)
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular page development expertise | Task: Create ErrorLogsListPage using ErrorLogsService Signals, display DataTableComponent with error logs, add filter panel (date range, level, type, user), show stats cards (total, by level) using ax-stats-card, add export button | Restrictions: Use Signals from service (errorLogs(), loading(), errorStats()), call service methods onInit, style with TailwindCSS classes, use Angular Material for filters, responsive layout | Success: Page displays error logs in table, filters work, stats shown, export works, responsive | Instructions: 1) Mark in-progress, 2) Create page component, 3) Test functionality, 4) Log with artifacts (ErrorLogsListPage component, integrations with DataTable and service), 5) Mark completed

### - [ ] 7.2. Create Error Logs Detail Page

- **Files:**
  - `apps/web/src/app/core/monitoring/pages/error-logs/error-logs-detail.page.ts`
  - `apps/web/src/app/core/monitoring/pages/error-logs/error-logs-detail.page.html`
- **Description:** Detail page showing full error information
- **Dependencies:** 7.1
- **Time:** 1 hour
- **\_Leverage:** ErrorLogsService, AegisX card, badge, description-list
- **\_Requirements:** Requirement 1, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create ErrorLogsDetailPage to show full error details using ax-card, ax-badge for level, ax-description-list for error properties, expandable stack trace section | Restrictions: Get error ID from route params, call errorLogsService.getErrorLog(id), display all fields, format timestamps, show stack trace with code formatting | Success: Detail page shows all error info, formatted nicely, navigable from list | Instructions: 1) Mark in-progress, 2) Create component, 3) Test navigation and display, 4) Log with artifacts, 5) Mark completed

---

## Phase 8: Frontend - Activity Logs Pages (4 hours)

**Depends on Phase 6.2, 6.5**

### - [ ] 8.1. Create Activity Logs List Page

- **Files:**
  - `apps/web/src/app/core/monitoring/pages/activity-logs/activity-logs-list.page.ts`
  - `apps/web/src/app/core/monitoring/pages/activity-logs/activity-logs-list.page.html`
  - `apps/web/src/app/core/monitoring/pages/activity-logs/activity-logs.config.ts`
- **Description:** List page with timeline view of activities
- **Dependencies:** 6.2, 6.5
- **Time:** 3 hours
- **\_Leverage:** ActivityLogsService, ax-timeline, DataTableComponent (alternative view)
- **\_Requirements:** Requirement 2, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with timeline UI expertise | Task: Create ActivityLogsListPage using ax-timeline component for activity display (grouped by date), add filters (user, action, date range, severity), stats cards, export button, toggle between timeline and table views | Restrictions: Use ActivityLogsService Signals, call service on init, style timeline with activity icons, color-code by severity, responsive | Success: Timeline displays activities, filters work, stats shown, can toggle to table view | Instructions: 1) Mark in-progress, 2) Create page, 3) Test timeline and filters, 4) Log with artifacts (ActivityLogsListPage with timeline integration), 5) Mark completed

### - [ ] 8.2. Create Activity Logs Detail Page

- **Files:**
  - `apps/web/src/app/core/monitoring/pages/activity-logs/activity-logs-detail.page.ts`
  - `apps/web/src/app/core/monitoring/pages/activity-logs/activity-logs-detail.page.html`
- **Description:** Detail page for single activity
- **Dependencies:** 8.1
- **Time:** 1 hour
- **\_Leverage:** ActivityLogsService, AegisX components
- **\_Requirements:** Requirement 2, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create ActivityLogsDetailPage showing full activity details with ax-card, ax-description-list, display metadata, IP, user agent, severity badge | Restrictions: Get activity ID from params, call service.getActivityLog(id), format all fields, link to user/entity if applicable | Success: Shows activity details, formatted, navigable | Instructions: 1) Mark in-progress, 2) Create component, 3) Test, 4) Log, 5) Mark completed

---

## Phase 9: Frontend - Profile Pages (8 hours)

**Depends on Phase 6.3**

### - [ ] 9.1. Create Profile Info Component

- **Files:** `apps/web/src/app/core/users/pages/profile/components/profile-info.component.ts`
- **Description:** Component for basic profile info (name, email, department)
- **Dependencies:** 6.3
- **Time:** 2 hours
- **\_Leverage:** UserService, ax-card, mat-form-field, mat-select for department
- **\_Requirements:** Requirement 3, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with forms expertise | Task: Create ProfileInfoComponent with form for first_name, last_name, email (readonly), department_id (mat-select dropdown), save button, using ax-card wrapper | Restrictions: Use Angular Reactive Forms, load departments from DepartmentsService, validate required fields, call userService.updateProfile(data) on submit, show success/error messages | Success: Form displays profile info, department selector works, updates profile, validation works | Instructions: 1) Mark in-progress, 2) Create component with form, 3) Test update, 4) Log with artifacts (ProfileInfoComponent with department integration), 5) Mark completed

### - [ ] 9.2. Create Profile Avatar Component

- **Files:** `apps/web/src/app/core/users/pages/profile/components/profile-avatar.component.ts`
- **Description:** Component for avatar upload/delete
- **Dependencies:** 6.3
- **Time:** 2 hours
- **\_Leverage:** UserService, ax-avatar, file upload with drag-and-drop
- **\_Requirements:** Requirement 3, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with file upload expertise | Task: Create ProfileAvatarComponent displaying ax-avatar with current avatar, file upload area (drag-and-drop or click), upload/delete buttons, show file size/type validation errors | Restrictions: Validate file type (image/\*), max 5MB, show preview before upload, call userService.uploadAvatar(file) and deleteAvatar(), update avatar display on success | Success: Avatar displays, upload works with drag-drop, preview shown, deletes properly | Instructions: 1) Mark in-progress, 2) Create component, 3) Test upload/delete, 4) Log with artifacts (ProfileAvatarComponent with file upload), 5) Mark completed

### - [ ] 9.3. Create Profile Preferences Component

- **Files:** `apps/web/src/app/core/users/pages/profile/components/profile-preferences.component.ts`
- **Description:** Component for user preferences (theme, language, notifications)
- **Dependencies:** 6.3
- **Time:** 2 hours
- **\_Leverage:** UserService, mat-slide-toggle, mat-select
- **\_Requirements:** Requirement 3, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with settings UI expertise | Task: Create ProfilePreferencesComponent with theme selector (light/dark/auto with icons), language selector (en/th with flags), notification toggles (email, push) using mat-slide-toggle | Restrictions: Load preferences from userService.getPreferences(), update on change with userService.updatePreferences(data), show live theme preview, save automatically on change | Success: Preferences display, theme changes apply immediately, language selector works, toggles update | Instructions: 1) Mark in-progress, 2) Create component, 3) Test all preferences, 4) Log with artifacts, 5) Mark completed

### - [ ] 9.4. Create Profile Activity Component

- **Files:** `apps/web/src/app/core/users/pages/profile/components/profile-activity.component.ts`
- **Description:** Component showing user's recent activities (read-only)
- **Dependencies:** 6.3
- **Time:** 1 hour
- **\_Leverage:** UserService, ax-timeline
- **\_Requirements:** Requirement 3, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create ProfileActivityComponent displaying user's recent activities using ax-timeline, show last 10 activities, format with icons and descriptions | Restrictions: Call userService.getUserActivity(), display in timeline, read-only (no actions), link to activity detail if needed | Success: Shows user's activities, formatted in timeline, updates on load | Instructions: 1) Mark in-progress, 2) Create component, 3) Test, 4) Log, 5) Mark completed

### - [ ] 9.5. Create Profile Page (Container)

- **Files:**
  - `apps/web/src/app/core/users/pages/profile/profile.page.ts`
  - `apps/web/src/app/core/users/pages/profile/profile.page.html`
  - `apps/web/src/app/core/users/pages/profile/profile.config.ts`
- **Description:** Container page integrating all profile components with tabs
- **Dependencies:** 9.1, 9.2, 9.3, 9.4
- **Time:** 1 hour
- **\_Leverage:** All profile components, mat-tab-group
- **\_Requirements:** Requirement 3, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with page composition expertise | Task: Create ProfilePage with mat-tab-group containing 4 tabs (Profile Info, Avatar, Preferences, Activity), load profile on init with userService.getProfile(), pass data to child components | Restrictions: Use mat-tab-group, each tab contains one component, load profile once and pass down, handle loading state, responsive tabs | Success: Profile page with tabs, each tab shows correct component, data flows correctly | Instructions: 1) Mark in-progress, 2) Create page with tabs, 3) Test all tabs, 4) Log with artifacts (ProfilePage container with 4 child components), 5) Mark completed

---

## Phase 10: Frontend - API Keys Pages (8 hours)

**Depends on Phase 6.4, 6.5**

### - [ ] 10.1. Create API Keys List Page

- **Files:**
  - `apps/web/src/app/core/api-keys/pages/api-keys-list.page.ts`
  - `apps/web/src/app/core/api-keys/pages/api-keys-list.page.html`
  - `apps/web/src/app/core/api-keys/pages/api-keys.config.ts`
- **Description:** List page for API keys with status badges
- **Dependencies:** 6.4, 6.5
- **Time:** 3 hours
- **\_Leverage:** ApiKeysService, DataTableComponent, ax-badge, ax-button
- **\_Requirements:** Requirement 4, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Create ApiKeysListPage displaying API keys in DataTableComponent with columns (name, prefix, status badge, last used, created, actions), add "Create Key" button, filter by status | Restrictions: Use ApiKeysService Signals, call listKeys() on init, format dates, status badges (Active=green, Expired=gray, Revoked=red), revoke action with confirmation dialog | Success: Keys displayed in table, statuses color-coded, can filter, create button works | Instructions: 1) Mark in-progress, 2) Create page, 3) Test display and filters, 4) Log with artifacts (ApiKeysListPage component), 5) Mark completed

### - [ ] 10.2. Create API Key Creation Wizard

- **Files:** `apps/web/src/app/core/api-keys/pages/components/api-key-wizard.component.ts`
- **Description:** Multi-step wizard for creating API keys
- **Dependencies:** 10.1
- **Time:** 4 hours
- **\_Leverage:** ApiKeysService, mat-stepper, mat-checkbox, mat-datepicker
- **\_Requirements:** Requirement 4, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with wizard UI expertise | Task: Create API key creation wizard using mat-stepper with 4 steps - (1) Name input, (2) Permissions checkboxes (grouped), (3) Expiration datepicker with presets (30d, 90d, 1y, never), (4) Review and create, show generated key with copy button on success | Restrictions: Use Reactive Forms, validate each step, group permissions by category, call apiKeysService.createKey(data), show key ONCE with warning, provide copy-to-clipboard button | Success: Wizard guides through steps, key created, shown once with copy function, clear warnings | Instructions: 1) Mark in-progress, 2) Create wizard component, 3) Test full flow, 4) Log with artifacts (ApiKeyWizardComponent with mat-stepper), 5) Mark completed

### - [ ] 10.3. Create API Keys Detail Page

- **Files:**
  - `apps/web/src/app/core/api-keys/pages/api-keys-detail.page.ts`
  - `apps/web/src/app/core/api-keys/pages/api-keys-detail.page.html`
- **Description:** Detail page showing key info and usage stats
- **Dependencies:** 10.2
- **Time:** 1 hour
- **\_Leverage:** ApiKeysService, ax-card, Chart.js for usage chart
- **\_Requirements:** Requirement 4, 5
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with data visualization | Task: Create ApiKeysDetailPage displaying key details (name, prefix, permissions, expiration, status) using ax-card and ax-description-list, show usage chart (requests over time) using Chart.js | Restrictions: Get key ID from params, call apiKeysService.getKey(id) and getUsage(id), never display full key (only prefix), chart shows usage trend, revoke button with confirmation | Success: Detail shows key info, usage chart displays, can revoke key | Instructions: 1) Mark in-progress, 2) Create page, 3) Test display and chart, 4) Log with artifacts, 5) Mark completed

---

## Phase 11: Navigation & Routing (2 hours)

**Depends on all frontend pages (7, 8, 9, 10)**

### - [ ] 11.1. Add Routes to Navigation

- **Files:**
  - `apps/web/src/app/app.routes.ts` (or feature routing files)
  - Navigation menu configuration
- **Description:** Add new routes for error logs, activity logs, profile, API keys
- **Dependencies:** 7.2, 8.2, 9.5, 10.3
- **Time:** 1 hour
- **\_Leverage:** Existing routing configuration
- **\_Requirements:** All frontend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with Angular routing expertise | Task: Add lazy-loaded routes for error-logs-list, error-logs-detail/:id, activity-logs-list, activity-logs-detail/:id, profile, api-keys-list, api-keys-detail/:id, configure route guards if needed | Restrictions: Use lazy loading for each feature module, add to navigation menu with icons, set RBAC permissions (monitoring:read, audit:read, profile:write, api-keys:manage) | Success: All routes work, lazy loaded, protected by permissions, navigation menu updated | Instructions: 1) Mark in-progress, 2) Add routes, 3) Test navigation, 4) Log with artifacts (routes added), 5) Mark completed

### - [ ] 11.2. Update Navigation Menu

- **Files:** Navigation configuration (sidebar/header menu)
- **Description:** Add menu items for new pages
- **Dependencies:** 11.1
- **Time:** 1 hour
- **\_Leverage:** Existing navigation structure
- **\_Requirements:** All frontend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer | Task: Add navigation menu items - "Monitoring" section with "Error Logs", "Activity Logs" sub-items; "Profile" in user menu; "API Keys" in settings or user menu, add icons | Restrictions: Follow existing menu structure, add icons, set permissions visibility, maintain responsive menu | Success: Menu items appear, navigate correctly, hidden based on permissions | Instructions: 1) Mark in-progress, 2) Add menu items, 3) Test navigation, 4) Log, 5) Mark completed

---

## Phase 12: Testing (10 hours)

**Can start unit tests in parallel with development, integration/E2E after features complete**

### - [ ] 12.1. Backend Unit Tests - Error & Activity Logs

- **Files:**
  - `apps/api/src/layers/core/audit/error-logs/__tests__/`
  - `apps/api/src/layers/core/audit/activity-logs/__tests__/`
- **Description:** Unit tests for error logs and activity logs modules
- **Dependencies:** 2.7, 3.4
- **Time:** 3 hours
- **\_Leverage:** Vitest, existing test helpers
- **\_Requirements:** All backend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with backend testing expertise | Task: Write unit tests for ErrorLogsService, ErrorLogsRepository, ActivityLogsService, ActivityLogsRepository - test CRUD operations, stats calculation, caching, pagination, filtering | Restrictions: Mock database with test data, mock Redis, test business logic in isolation, achieve >80% coverage | Success: Tests pass, cover main functionality, no external dependencies | Instructions: 1) Mark in-progress, 2) Write tests, 3) Run and verify, 4) Log with artifacts (test files created, coverage %), 5) Mark completed

### - [ ] 12.2. Backend Unit Tests - Profile & API Keys

- **Files:**
  - `apps/api/src/layers/platform/user-profile/__tests__/`
  - `apps/api/src/layers/platform/api-keys/__tests__/`
- **Description:** Unit tests for profile and API keys modules
- **Dependencies:** 4.8, 5.8
- **Time:** 3 hours
- **\_Leverage:** Vitest, test helpers, mock services
- **\_Requirements:** All backend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer | Task: Write unit tests for ProfileService, AvatarService, ApiKeysService, CryptoService - test profile update with department validation, avatar upload/delete, API key generation/hashing/verification, permissions validation | Restrictions: Mock database, file storage, test crypto functions with known inputs/outputs, >80% coverage | Success: Tests pass, security functions tested, coverage met | Instructions: 1) Mark in-progress, 2) Write tests, 3) Run, 4) Log with artifacts (test files, coverage), 5) Mark completed

### - [ ] 12.3. Backend Integration Tests

- **Files:** `apps/api/src/__tests__/integration/monitoring-audit-modules.test.ts`
- **Description:** Integration tests for all API endpoints
- **Dependencies:** 2.7, 3.4, 4.8, 5.8
- **Time:** 2 hours
- **\_Leverage:** Supertest, test database
- **\_Requirements:** All backend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with API testing expertise | Task: Write integration tests using Supertest - test complete flows (create error log → fetch → delete, create activity → query, update profile with department, create API key → authenticate with key) | Restrictions: Use test database, seed test data, test with real HTTP requests, verify response formats, test authentication and permissions | Success: All API flows tested, authentication works, responses valid | Instructions: 1) Mark in-progress, 2) Write tests, 3) Run against test server, 4) Log with artifacts (integration test file), 5) Mark completed

### - [ ] 12.4. Frontend E2E Tests

- **Files:** `apps/web-e2e/src/monitoring-audit-modules.spec.ts`
- **Description:** End-to-end tests for user flows
- **Dependencies:** 11.2 (all pages complete)
- **Time:** 2 hours
- **\_Leverage:** Playwright, existing E2E test helpers
- **\_Requirements:** All frontend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Automation Engineer with E2E testing expertise | Task: Write Playwright E2E tests - (1) Admin views and filters error logs, (2) User updates profile with department and avatar, (3) Developer creates API key and uses it to call API, (4) Compliance officer views activity logs | Restrictions: Test real user flows, use test accounts, verify UI elements, test navigation, verify API calls succeed | Success: All user scenarios pass, UI interactions work, data flows correctly | Instructions: 1) Mark in-progress, 2) Write E2E tests, 3) Run in test environment, 4) Log with artifacts (E2E test file), 5) Mark completed

---

## Phase 13: Documentation & Deployment (2 hours)

### - [ ] 13.1. Update API Documentation

- **Files:** Swagger/OpenAPI specs, README updates
- **Description:** Document all new API endpoints in Swagger
- **Dependencies:** 2.7, 3.4, 4.8, 5.8
- **Time:** 1 hour
- **\_Leverage:** Existing Swagger setup
- **\_Requirements:** All backend requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with API documentation expertise | Task: Update Swagger/OpenAPI documentation with all new endpoints (error logs, activity logs, profile, API keys) - add descriptions, request/response examples, authentication requirements | Restrictions: Follow existing Swagger format, include all endpoints, add examples, document permissions | Success: Swagger UI shows all new endpoints, examples provided, can test from UI | Instructions: 1) Mark in-progress, 2) Update docs, 3) Verify Swagger UI, 4) Log, 5) Mark completed

### - [ ] 13.2. Deployment & Verification

- **Files:** Deployment scripts, verification checklist
- **Description:** Deploy to staging/production and verify
- **Dependencies:** All tasks complete
- **Time:** 1 hour
- **\_Leverage:** Existing CI/CD pipeline
- **\_Requirements:** All requirements
- **\_Prompt:** Implement the task for spec monitoring-audit-modules, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with deployment expertise | Task: Deploy backend and frontend to staging, run smoke tests (verify each module's main endpoint works, test authentication, check logs), verify database migrations applied, deploy to production with monitoring | Restrictions: Follow deployment checklist, backup database before production deployment, monitor error rates, verify RBAC permissions work | Success: Deployed to production, all endpoints work, no errors in logs, monitoring shows normal metrics | Instructions: 1) Mark in-progress, 2) Deploy to staging, 3) Run smoke tests, 4) Deploy to production, 5) Monitor for 1 hour, 6) Log with artifacts (deployment log, verification results), 7) Mark completed

---

## Summary

**Total Tasks:** 50
**Total Estimated Time:** ~80 hours (2 weeks)

**Phase Breakdown:**

- Phase 1: Database & Infrastructure (4h)
- Phase 2: Backend - Error Logs (6h)
- Phase 3: Backend - Activity Logs (5h)
- Phase 4: Backend - User Profile (10h)
- Phase 5: Backend - API Keys (14h)
- Phase 6: Frontend - Services & Shared (8h)
- Phase 7: Frontend - Error Logs Pages (4h)
- Phase 8: Frontend - Activity Logs Pages (4h)
- Phase 9: Frontend - Profile Pages (8h)
- Phase 10: Frontend - API Keys Pages (8h)
- Phase 11: Navigation & Routing (2h)
- Phase 12: Testing (10h)
- Phase 13: Documentation & Deployment (2h)

**Parallelization Opportunities:**

- Phases 2, 3, 4, 5 can run in parallel (backend modules)
- Phase 6 can start early (frontend services)
- Unit tests can be written alongside development
- Frontend pages (7-10) can be developed in parallel once services ready

**Critical Path:**
1 → 2 → 7 → 11 → 12 → 13 (or)
1 → 5 → 10 → 11 → 12 → 13

**Next Step:** Begin Phase 1 (Database & Infrastructure) after tasks approval.
