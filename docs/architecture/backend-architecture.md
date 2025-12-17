# Backend Architecture Overview

## 📁 Backend Documentation Structure

<!-- Planned Advanced Guides (Coming Soon):

### 🔌 Fastify Plugins & Configuration

Complete plugin setup including:

- Plugin registration order
- Essential plugin configurations
- Security, caching, file upload, WebSocket

### 🔐 RBAC & Authentication

Advanced authentication patterns:

- @fastify/auth strategies
- Complex permission logic
- Role-based access control
- Permission service

### 🗄️ Knex CRUD Patterns

Database operations with:

- Base repository pattern
- Pagination & filtering
- Advanced Knex queries
- Type transformations

### 📋 OpenAPI Schemas & Responses

Schema enforcement and standards:

- Mandatory schema system
- Response format standards
- Validation patterns
- Error handling

### 🔍 Logging Standards

Enterprise logging patterns:

- Pino logger configuration
- Request/response logging
- Audit logging for security
- Performance monitoring
- Error tracking with correlation

-->

## Feature Module Pattern

The backend uses a modular architecture where each feature is self-contained with clear separation of concerns.

### Why Feature Module Pattern?

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Easy to mock and test each layer independently
- **Maintainability**: Easy to locate and fix issues
- **Scalability**: Easy to add new features or convert to microservices
- **Team Collaboration**: Teams can work on different modules without conflicts

### Module Structure Decision Guide

**Use Single Controller Structure when:**

- Simple CRUD operations
- Single resource management
- Less than 20 endpoints
- Single team ownership

**Use Multiple Controllers Structure when:**

- Complex business domain
- Multiple sub-resources
- Related but distinct operations
- More than 20 endpoints
- Different access levels (public, user, admin)

### Route Organization Examples

**User Module with Multiple Controllers:**

```
# UserController - Basic CRUD
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

# UserProfileController - Profile Management
GET    /api/users/:id/profile
PUT    /api/users/:id/profile
POST   /api/users/:id/avatar

# UserAuthController - Authentication
POST   /api/users/:id/change-password
POST   /api/users/:id/verify-email
GET    /api/users/:id/sessions

# UserAdminController - Admin Operations
PATCH  /api/users/:id/status
POST   /api/users/bulk-import
GET    /api/users/statistics
```

## Fastify Best Practices

### 1. Plugin-First Architecture with MANDATORY OpenAPI Schema

```typescript
// apps/api/src/modules/user/user.plugin.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { UserService } from './user.service.js';

export default fp(
  async function userPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    // Register dependencies
    const userService = new UserService(fastify.knex);
    fastify.decorate('userService', userService);

    // Route registration with REQUIRED schemas
    await fastify.register(userRoutes, { prefix: '/api/users' });
  },
  {
    name: 'user-plugin',
    dependencies: ['knex-plugin', 'schema-plugin'],
  },
);

async function userRoutes(fastify: FastifyInstance) {
  // ⚠️ IMPORTANT: ALL routes MUST have complete schema definition
  // No route should be registered without schema

  // GET /api/users - List with pagination
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get paginated list of users with filtering and sorting',
      tags: ['Users'],
      querystring: {
        type: 'object',
        properties: {
          // Pagination
          page: { type: 'integer', minimum: 1, default: 1, description: 'Page number' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Items per page' },

          // Search & Filters
          search: { type: 'string', minLength: 1, description: 'Search across email, name, username' },
          role: { type: 'string', description: 'Filter by single role name' },
          roles: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by multiple roles',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Filter by status',
          },

          // Date range filters
          createdAfter: {
            type: 'string',
            format: 'date-time',
            description: 'Filter users created after this date',
          },
          createdBefore: {
            type: 'string',
            format: 'date-time',
            description: 'Filter users created before this date',
          },

          // Sorting
          sortBy: {
            type: 'string',
            enum: ['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'username', 'role', 'status'],
            default: 'created_at',
            description: 'Sort field',
          },
          sortOrder: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
            description: 'Sort direction',
          },
        },
      },
      response: {
        200: { $ref: 'paginatedUsersResponse#' },
        400: { $ref: 'errorResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        403: { $ref: 'forbiddenResponse#' },
        500: { $ref: 'serverErrorResponse#' },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const filters = request.query as GetUsersQuery;
      const { users, total } = await fastify.userService.getUsers(filters);
      return reply.paginated(users, filters.page || 1, filters.limit || 10, total, 'Users retrieved successfully');
    },
  });

  // POST /api/users - Create user
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create new user',
      tags: ['Users'],
      body: { $ref: 'createUserRequest#' },
      response: {
        201: { $ref: 'userResponse#' },
        400: { $ref: 'validationErrorResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        403: { $ref: 'forbiddenResponse#' },
        409: { $ref: 'conflictResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin'])],
    handler: async (request, reply) => {
      const user = await fastify.userService.createUser(request.body);
      return reply.created(user, 'User created successfully');
    },
  });

  // PUT /api/users/:id - Update user
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      description: 'Update user by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'User ID' },
        },
      },
      body: { $ref: 'updateUserRequest#' },
      response: {
        200: { $ref: 'userResponse#' },
        400: { $ref: 'validationErrorResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        403: { $ref: 'forbiddenResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin', 'manager'])],
    handler: async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.userService.updateUser(id, request.body);
      if (!user) return reply.notFound('User not found');
      return reply.success(user, 'User updated successfully');
    },
  });

  // DELETE /api/users/:id - Delete user
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete user by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'User ID' },
        },
      },
      response: {
        200: { $ref: 'deleteResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        403: { $ref: 'forbiddenResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin'])],
    handler: async (request, reply) => {
      const { id } = request.params;
      const deleted = await fastify.userService.deleteUser(id);
      if (!deleted) return reply.notFound('User not found');
      return reply.success({ id }, 'User deleted successfully');
    },
  });
}
```

### 2. Complete OpenAPI Schema System (MANDATORY)

#### Schema Organization Standards

1. **File Structure**:
   - Each module must have its own `{module}.schemas.ts` file
   - All schemas must be exported as a single object
   - Schema files must be in the module directory, not in routes

2. **Schema Registration Pattern**:

   ```typescript
   // Standardized schema registration in plugin
   export default fp(async function modulePlugin(fastify: FastifyInstance) {
     // Register schemas first
     Object.values(moduleSchemas).forEach((schema) => {
       fastify.addSchema(schema);
     });

     // Initialize services and controllers
     const service = new ModuleService(fastify.knex);
     const controller = new ModuleController(service);

     // Register routes with controller
     await fastify.register(moduleRoutes, { controller });
   });
   ```

3. **Controller Pattern**:
   - Every module must have a separate controller file
   - Controllers handle request/response logic
   - Services handle business logic
   - Routes only define endpoints and schemas

```typescript
// apps/api/src/modules/user/user.schemas.ts
export const userSchemas = {
  // Base entity schemas
  user: {
    $id: 'user',
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
      email: { type: 'string', format: 'email', description: 'User email address' },
      username: { type: 'string', minLength: 3, maxLength: 50, description: 'Username' },
      firstName: { type: 'string', minLength: 1, maxLength: 100, description: 'First name' },
      lastName: { type: 'string', minLength: 1, maxLength: 100, description: 'Last name' },
      isActive: { type: 'boolean', description: 'User active status' },
      role: { $ref: 'role#' },
      createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
      updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
    },
    required: ['id', 'email', 'username', 'firstName', 'lastName', 'isActive', 'role', 'createdAt', 'updatedAt'],
    additionalProperties: false,
  },

  // Request schemas
  createUserRequest: {
    $id: 'createUserRequest',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
        maxLength: 255,
      },
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_-]+$',
        description: 'Username (alphanumeric, underscore, hyphen only)',
      },
      firstName: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        description: 'First name',
      },
      lastName: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        description: 'Last name',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        description: 'Password (minimum 8 characters)',
      },
      roleId: {
        type: 'string',
        format: 'uuid',
        description: 'Role identifier',
      },
      isActive: {
        type: 'boolean',
        default: true,
        description: 'Initial active status',
      },
    },
    required: ['email', 'username', 'firstName', 'lastName', 'password', 'roleId'],
    additionalProperties: false,
  },

  updateUserRequest: {
    $id: 'updateUserRequest',
    type: 'object',
    properties: {
      firstName: { type: 'string', minLength: 1, maxLength: 100 },
      lastName: { type: 'string', minLength: 1, maxLength: 100 },
      isActive: { type: 'boolean' },
      roleId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
    minProperties: 1,
  },

  // Response schemas - ALL REQUIRED
  userResponse: {
    $id: 'userResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: true },
      data: { $ref: 'user#' },
      message: { type: 'string' },
    },
    required: ['success', 'data'],
    additionalProperties: false,
  },

  paginatedUsersResponse: {
    $id: 'paginatedUsersResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: true },
      data: {
        type: 'array',
        items: { $ref: 'user#' },
      },
      message: { type: 'string' },
      pagination: { $ref: 'pagination#' },
    },
    required: ['success', 'data', 'pagination'],
    additionalProperties: false,
  },
};

// Common error response schemas
export const commonSchemas = {
  errorResponse: {
    $id: 'errorResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string' },
      message: { type: 'string' },
    },
    required: ['success', 'error'],
    additionalProperties: false,
  },

  validationErrorResponse: {
    $id: 'validationErrorResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string', const: 'VALIDATION_ERROR' },
      message: { type: 'string' },
      meta: {
        type: 'object',
        properties: {
          details: { type: 'array', items: { type: 'object' } },
        },
      },
    },
    required: ['success', 'error', 'message'],
    additionalProperties: false,
  },

  unauthorizedResponse: {
    $id: 'unauthorizedResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string', const: 'UNAUTHORIZED' },
      message: { type: 'string', default: 'Authentication required' },
    },
    required: ['success', 'error', 'message'],
    additionalProperties: false,
  },

  forbiddenResponse: {
    $id: 'forbiddenResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string', const: 'FORBIDDEN' },
      message: { type: 'string', default: 'Insufficient permissions' },
    },
    required: ['success', 'error', 'message'],
    additionalProperties: false,
  },

  notFoundResponse: {
    $id: 'notFoundResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string', const: 'NOT_FOUND' },
      message: { type: 'string' },
    },
    required: ['success', 'error', 'message'],
    additionalProperties: false,
  },

  conflictResponse: {
    $id: 'conflictResponse',
    type: 'object',
    properties: {
      success: { type: 'boolean', const: false },
      error: { type: 'string', const: 'CONFLICT' },
      message: { type: 'string' },
    },
    required: ['success', 'error', 'message'],
    additionalProperties: false,
  },

  pagination: {
    $id: 'pagination',
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100 },
      total: { type: 'integer', minimum: 0 },
      totalPages: { type: 'integer', minimum: 0 },
    },
    required: ['page', 'limit', 'total', 'totalPages'],
    additionalProperties: false,
  },
};
```

### 3. Schema Enforcement Plugin

```typescript
// apps/api/src/plugins/schema-enforcement.plugin.ts
export default fp(async function schemaEnforcementPlugin(fastify: FastifyInstance) {
  // Hook to validate that all routes have schemas
  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.schema) {
      throw new Error(`Route ${routeOptions.method} ${routeOptions.url} must have schema definition`);
    }

    // Ensure all routes have response schemas
    if (!routeOptions.schema.response) {
      throw new Error(`Route ${routeOptions.method} ${routeOptions.url} must have response schema`);
    }

    // Ensure POST/PUT/PATCH routes have body schemas
    if (['POST', 'PUT', 'PATCH'].includes(routeOptions.method) && !routeOptions.schema.body) {
      throw new Error(`Route ${routeOptions.method} ${routeOptions.url} must have body schema`);
    }

    // Ensure routes with params have params schema
    if (routeOptions.url.includes(':') && !routeOptions.schema.params) {
      throw new Error(`Route ${routeOptions.method} ${routeOptions.url} must have params schema`);
    }
  });

  // Hook to add standard error responses if not specified
  fastify.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema?.response) {
      const responses = routeOptions.schema.response;

      // Add standard error responses if missing
      if (!responses['401']) {
        responses['401'] = { $ref: 'unauthorizedResponse#' };
      }
      if (!responses['500']) {
        responses['500'] = { $ref: 'serverErrorResponse#' };
      }
    }
  });
});
```

### 4. RBAC with @fastify/auth (Complex Authentication)

```typescript
// apps/api/src/plugins/auth-strategies.plugin.ts
export default fp(
  async function authStrategiesPlugin(fastify: FastifyInstance) {
    // Strategy 1: JWT Authentication
    fastify.decorate('verifyJWT', async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw new Error('INVALID_TOKEN');
      }
    });

    // Strategy 2: Role-based Authorization
    fastify.decorate('verifyRole', function (allowedRoles: string[]) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as any;
        if (!user || !allowedRoles.includes(user.role)) {
          throw new Error('INSUFFICIENT_PERMISSIONS');
        }
      };
    });

    // Strategy 3: Resource Ownership
    fastify.decorate('verifyOwnership', function (resourceParam: string = 'id') {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as any;
        const resourceId = (request.params as any)[resourceParam];

        // Check if user owns resource or is admin
        if (user.role !== 'admin' && user.id !== resourceId) {
          throw new Error('RESOURCE_ACCESS_DENIED');
        }
      };
    });

    // Strategy 4: Permission-based Authorization
    fastify.decorate('verifyPermission', function (resource: string, action: string) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as any;

        // Check user permissions from database or cache
        const hasPermission = await fastify.permissionService.checkPermission(user.id, resource, action);

        if (!hasPermission) {
          throw new Error('PERMISSION_DENIED');
        }
      };
    });

    // Strategy 5: Time-based Access (business hours)
    fastify.decorate('verifyBusinessHours', async function (request: FastifyRequest, reply: FastifyReply) {
      const now = new Date();
      const hour = now.getHours();

      // Allow only during business hours (9 AM - 6 PM)
      if (hour < 9 || hour >= 18) {
        throw new Error('OUTSIDE_BUSINESS_HOURS');
      }
    });

    // Strategy 6: Rate Limiting per User
    fastify.decorate('verifyUserRateLimit', function (maxRequests: number) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as any;
        const key = `rate_limit:${user.id}`;

        // Check Redis for user rate limit
        const current = await fastify.redis.incr(key);
        if (current === 1) {
          await fastify.redis.expire(key, 60); // 1 minute window
        }

        if (current > maxRequests) {
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
      };
    });
  },
  {
    name: 'auth-strategies-plugin',
    dependencies: ['jwt-plugin', 'auth-plugin'],
  },
);

// TypeScript declarations
declare module 'fastify' {
  interface FastifyInstance {
    verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyOwnership: (param?: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyPermission: (resource: string, action: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyBusinessHours: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyUserRateLimit: (max: number) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
```

### 5. RBAC Route Examples with @fastify/auth

```typescript
// Complex authentication combinations
async function userRoutes(fastify: FastifyInstance) {
  // Public endpoint - no auth
  fastify.route({
    method: 'GET',
    url: '/public-info',
    schema: {
      /* ... */
    },
    handler: async () => ({ info: 'public' }),
  });

  // Simple JWT auth
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: async () => {
      /* list users */
    },
  });

  // JWT + Role authorization
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin', 'manager'])]),
    handler: async () => {
      /* create user */
    },
  });

  // JWT + Permission-based
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth([fastify.verifyJWT, fastify.verifyPermission('users', 'update')]),
    handler: async () => {
      /* update user */
    },
  });

  // Complex: JWT + (Admin OR Owner)
  fastify.route({
    method: 'GET',
    url: '/:id/profile',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth(
      [
        fastify.verifyJWT,
        // Either admin role OR resource owner
        [fastify.verifyRole(['admin']), fastify.verifyOwnership('id')],
      ],
      { relation: 'or' },
    ), // OR relationship
    handler: async () => {
      /* get profile */
    },
  });

  // Multiple conditions with AND
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth([
      fastify.verifyJWT, // Must be authenticated
      fastify.verifyRole(['admin']), // Must be admin
      fastify.verifyBusinessHours, // Must be business hours
      fastify.verifyUserRateLimit(5), // Max 5 deletes per minute
    ]), // AND relationship (default)
    handler: async () => {
      /* delete user */
    },
  });

  // Advanced: Multiple strategies with mixed logic
  fastify.route({
    method: 'POST',
    url: '/:id/sensitive-action',
    schema: {
      /* ... */
    },
    preHandler: fastify.auth(
      [
        fastify.verifyJWT,
        // (Admin + Business Hours) OR (SuperAdmin anytime)
        [[fastify.verifyRole(['admin']), fastify.verifyBusinessHours], fastify.verifyRole(['super-admin'])],
      ],
      { relation: 'or' },
    ),
    handler: async () => {
      /* sensitive action */
    },
  });
}
```

### 6. Permission Service for Fine-grained RBAC

```typescript
// apps/api/src/services/permission.service.ts
export class PermissionService {
  constructor(private knex: Knex) {}

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const result = await this.knex('users')
      .join('roles', 'users.role_id', 'roles.id')
      .join('role_permissions', 'roles.id', 'role_permissions.role_id')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .where({
        'users.id': userId,
        'permissions.resource': resource,
        'permissions.action': action,
      })
      .first();

    return !!result;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const permissions = await this.knex('users').join('roles', 'users.role_id', 'roles.id').join('role_permissions', 'roles.id', 'role_permissions.role_id').join('permissions', 'role_permissions.permission_id', 'permissions.id').where('users.id', userId).select('permissions.resource', 'permissions.action');

    return permissions.map((p) => `${p.resource}:${p.action}`);
  }
}
```

### 7. Auth Registration in Main App

```typescript
// Update plugin registration order
await app.register(import('@fastify/jwt'), {
  /* ... */
});
await app.register(import('@fastify/cookie'), {
  /* ... */
});
await app.register(import('@fastify/auth')); // Add this
await app.register(import('./plugins/auth-strategies.plugin.js'));
```

### 5. Error Handling (Fastify Way)

```typescript
// apps/api/src/plugins/error-handler.plugin.ts
export default fp(async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error, request, reply) => {
    const { statusCode = 500, message } = error;

    fastify.log.error({
      error,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
      },
    });

    // Validation errors
    if (error.validation) {
      return reply.error('VALIDATION_ERROR', 'Invalid request data', 400, error.validation);
    }

    // Custom business errors
    if (error.code?.startsWith('USER_')) {
      return reply.error(error.code, error.message, 400);
    }

    // Generic errors
    return reply.error(statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR', statusCode >= 500 ? 'An unexpected error occurred' : message, statusCode, process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined);
  });
});
```

### 6. TypeScript Integration

```typescript
// Proper Fastify TypeScript patterns for CRUD with pagination & filters
interface GetUsersQuery {
  // Pagination
  page?: number;
  limit?: number;

  // Search & Filters
  search?: string;
  role?: string;
  roles?: string[];
  status?: 'active' | 'inactive';

  // Date range
  createdAfter?: string;
  createdBefore?: string;

  // Sorting
  sortBy?: 'created_at' | 'updated_at' | 'email' | 'first_name' | 'last_name' | 'username' | 'role' | 'status';
  sortOrder?: 'asc' | 'desc';
}

interface GetUsersFilters extends GetUsersQuery {
  page: number;
  limit: number;
}

interface CreateUserBody {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  isActive?: boolean;
}

interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleId?: string;
}

// Route with proper typing
fastify.route<{
  Querystring: GetUsersQuery;
  Reply: { data: User[]; pagination: Pagination };
}>({
  method: 'GET',
  url: '/',
  schema: {
    /* ... */
  },
  handler: async (request, reply) => {
    // request.query is properly typed as GetUsersQuery
    // reply.send() expects the Reply type
  },
});
```

### 7. Plugin Registration Order

```typescript
// apps/api/src/app.ts
import fastify from 'fastify';

const app = fastify({
  logger: process.env.NODE_ENV === 'production',
});

// 1. Configuration and environment
await app.register(import('@fastify/env'), {
  schema: {
    type: 'object',
    required: ['DATABASE_URL', 'JWT_ACCESS_SECRET'],
    properties: {
      DATABASE_URL: { type: 'string' },
      JWT_ACCESS_SECRET: { type: 'string' },
      JWT_REFRESH_SECRET: { type: 'string' },
      NODE_ENV: { type: 'string', default: 'development' },
    },
  },
});

// 2. Essential utilities and sensible defaults
await app.register(import('@fastify/sensible'));

// 3. Infrastructure plugins
await app.register(import('@fastify/cors'), {
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com', 'https://admin.yourdomain.com'] : true,
  credentials: true,
});

await app.register(import('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});

await app.register(import('@fastify/rate-limit'), {
  global: true,
  max: 100,
  timeWindow: '1 minute',
});

await app.register(import('@fastify/under-pressure'), {
  maxEventLoopDelay: 1000,
  maxHeapUsedBytes: 100000000,
  maxRssBytes: 100000000,
  maxEventLoopUtilization: 0.98,
});

// 4. Database connection (Knex)
await app.register(import('./plugins/knex.plugin.js'));

// 5. Authentication
await app.register(import('@fastify/jwt'), {
  secret: {
    private: process.env.JWT_ACCESS_SECRET,
    public: process.env.JWT_ACCESS_SECRET,
  },
  sign: { expiresIn: '15m' },
});

// 6. Cookie support (for refresh tokens)
await app.register(import('@fastify/cookie'), {
  secret: process.env.JWT_REFRESH_SECRET,
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// 6.1. Authentication strategies
await app.register(import('@fastify/auth'));

// 6.2. Redis for caching & sessions
await app.register(import('@fastify/redis'), {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
});

// 6.3. File upload support
await app.register(import('@fastify/multipart'), {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
});

// 6.4. Form data parsing
await app.register(import('@fastify/formbody'), {
  bodyLimit: 1048576, // 1MB
});

// 6.5. Static file serving
await app.register(import('@fastify/static'), {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
});

// 6.6. WebSocket support
await app.register(import('@fastify/websocket'), {
  connectionOptions: {
    heartbeatInterval: 30000,
  },
});

// 7. Error handling
await app.register(import('./plugins/error-handler.plugin.js'));

// 8. Schema enforcement (ensures all routes have schemas)
await app.register(import('./plugins/schema-enforcement.plugin.js'));

// 9. Schemas and type providers
await app.register(import('./schemas/index.js'));

// 10. Feature modules (auto-loaded)
await app.register(import('@fastify/autoload'), {
  dir: path.join(__dirname, 'modules'),
  options: { prefix: '/api' },
});

// 11. Swagger documentation (last)
await app.register(import('@fastify/swagger'), {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'Enterprise API',
      description: 'Enterprise monorepo API documentation',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
      { url: 'https://api.yourdomain.com', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

await app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});
```

### 8. Standard API Response Format

```typescript
// apps/api/src/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
}

// Success responses
export const createSuccessResponse = <T>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T> => ({
  success: true,
  data,
  message,
  meta,
});

// Paginated responses
export const createPaginatedResponse = <T>(data: T[], page: number, limit: number, total: number, message?: string): ApiResponse<T[]> => ({
  success: true,
  data,
  message,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});

// Error responses
export const createErrorResponse = (error: string, message?: string, details?: any): ApiResponse => ({
  success: false,
  error,
  message,
  ...(details && { meta: { details } }),
});
```

### 9. Response Handler Plugin

```typescript
// apps/api/src/plugins/response-handler.plugin.ts
export default fp(async function responseHandlerPlugin(fastify: FastifyInstance) {
  // Decorate reply with helper methods
  fastify.decorateReply('success', function (data: any, message?: string) {
    return this.send(createSuccessResponse(data, message));
  });

  fastify.decorateReply('paginated', function (data: any[], page: number, limit: number, total: number, message?: string) {
    return this.send(createPaginatedResponse(data, page, limit, total, message));
  });

  fastify.decorateReply('error', function (error: string, statusCode: number = 400, message?: string) {
    return this.code(statusCode).send(createErrorResponse(error, message));
  });

  fastify.decorateReply('created', function (data: any, message?: string) {
    return this.code(201).send(createSuccessResponse(data, message));
  });

  fastify.decorateReply('notFound', function (message: string = 'Resource not found') {
    return this.code(404).send(createErrorResponse('NOT_FOUND', message));
  });
});

// TypeScript declarations
declare module 'fastify' {
  interface FastifyReply {
    success(data: any, message?: string): FastifyReply;
    paginated(data: any[], page: number, limit: number, total: number, message?: string): FastifyReply;
    error(error: string, statusCode?: number, message?: string): FastifyReply;
    created(data: any, message?: string): FastifyReply;
    notFound(message?: string): FastifyReply;
  }
}
```

### 10. Essential Fastify Plugins for Enterprise

**Essential Fastify Plugins:**

```typescript
// package.json dependencies
{
  "@fastify/env": "^4.x",           // Environment configuration
  "@fastify/sensible": "^5.x",      // HTTP utilities & errors
  "@fastify/cors": "^9.x",          // CORS handling
  "@fastify/helmet": "^11.x",       // Security headers
  "@fastify/rate-limit": "^9.x",    // Rate limiting
  "@fastify/under-pressure": "^8.x", // Health monitoring
  "knex": "^3.x",                   // Query builder & migrations
  "pg": "^8.x",                     // PostgreSQL driver for Knex
  "@fastify/jwt": "^8.x",           // JWT authentication
  "@fastify/cookie": "^9.x",        // Cookie handling
  "@fastify/auth": "^4.x",          // Composite authentication strategies
  "@fastify/redis": "^6.x",         // Redis integration
  "@fastify/static": "^7.x",        // Static file serving
  "@fastify/websocket": "^10.x",    // WebSocket support
  "@fastify/multipart": "^8.x",     // File upload handling
  "@fastify/formbody": "^7.x",      // Form data parsing
  "@fastify/swagger": "^8.x",       // OpenAPI generation
  "@fastify/swagger-ui": "^4.x",    // API documentation UI
  "@fastify/autoload": "^5.x"       // Auto plugin loading
}
```

### Plugin Configuration Examples

#### @fastify/helmet - Security Headers

```typescript
await app.register(import('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.yourdomain.com'],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding
});
```

#### @fastify/redis - Caching & Sessions

```typescript
await app.register(import('@fastify/redis'), {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  family: 4,
  lazyConnect: true,
});

// Usage in services
export class CacheService {
  constructor(private redis: Redis) {}

  async getUserCache(userId: string) {
    const cached = await this.redis.get(`user:${userId}`);
    return cached ? JSON.parse(cached) : null;
  }

  async setUserCache(userId: string, data: any, ttl: number = 300) {
    await this.redis.setex(`user:${userId}`, ttl, JSON.stringify(data));
  }
}
```

#### @fastify/static - File Serving

```typescript
await app.register(import('@fastify/static'), {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
  decorateReply: false,
  schemaHide: true,
  serve: true,
  acceptRanges: true,
  cacheControl: true,
  dotfiles: 'ignore',
  etag: true,
  extensions: ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'],
  immutable: true,
  index: false,
  lastModified: true,
  maxAge: '1d',
});
```

#### @fastify/websocket - Real-time Features

```typescript
await app.register(import('@fastify/websocket'), {
  connectionOptions: {
    heartbeatInterval: 30000,
    maxPayload: 1048576, // 1MB
  },
});

// WebSocket route
app.register(async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/ws/notifications',
    websocket: true,
    schema: {
      description: 'Real-time notifications websocket',
      tags: ['WebSocket'],
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    wsHandler: (connection, request) => {
      const user = request.user as any;

      // Subscribe to user-specific notifications
      fastify.redis.subscribe(`notifications:${user.id}`);

      connection.socket.on('message', (message) => {
        // Handle incoming messages
      });

      connection.socket.on('close', () => {
        fastify.redis.unsubscribe(`notifications:${user.id}`);
      });
    },
  });
});
```

#### @fastify/multipart - File Upload

```typescript
await app.register(import('@fastify/multipart'), {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
    headerPairs: 2000,
  },
  attachFieldsToBody: 'keyValues',
});

// File upload route
fastify.route({
  method: 'POST',
  url: '/upload',
  schema: {
    description: 'Upload files',
    tags: ['Files'],
    consumes: ['multipart/form-data'],
    body: {
      type: 'object',
      properties: {
        file: { type: 'object' },
        description: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              url: { type: 'string' },
              size: { type: 'number' },
            },
          },
        },
      },
    },
  },
  preHandler: [fastify.auth([fastify.verifyJWT])],
  handler: async (request, reply) => {
    const data = await request.file();
    const buffer = await data.file.toBuffer();

    // Save file logic
    const filename = `${Date.now()}-${data.filename}`;
    const filepath = path.join('./uploads', filename);

    await fs.writeFile(filepath, buffer);

    return reply.success(
      {
        filename,
        url: `/uploads/${filename}`,
        size: buffer.length,
      },
      'File uploaded successfully',
    );
  },
});
```

#### @fastify/formbody - Form Data Parsing

```typescript
await app.register(import('@fastify/formbody'), {
  bodyLimit: 1048576, // 1MB
  parser: (str) => querystring.parse(str),
});

// Form submission route
fastify.route({
  method: 'POST',
  url: '/contact',
  schema: {
    description: 'Contact form submission',
    tags: ['Forms'],
    consumes: ['application/x-www-form-urlencoded'],
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        message: { type: 'string', minLength: 10 },
      },
      required: ['name', 'email', 'message'],
    },
  },
  handler: async (request, reply) => {
    const { name, email, message } = request.body as any;

    // Process form submission
    await fastify.emailService.sendContactForm({ name, email, message });

    return reply.success({}, 'Message sent successfully');
  },
});
```

### 11. MANDATORY Schema Validation Rules

Every route MUST follow these schema requirements:

```typescript
// ⚠️ CRITICAL: No route without complete schema
fastify.route({
  method: 'ANY',
  url: '/any-endpoint',
  schema: {
    // REQUIRED: Description and tags
    description: 'Clear description of what this endpoint does',
    tags: ['FeatureName'],

    // REQUIRED: Query parameters (if any)
    querystring: {
      /* schema */
    },

    // REQUIRED: Path parameters (if any)
    params: {
      /* schema */
    },

    // REQUIRED: Request body (for POST/PUT/PATCH)
    body: {
      /* schema */
    },

    // REQUIRED: All possible response schemas
    response: {
      200: {
        /* success schema */
      },
      400: { $ref: 'errorResponse#' },
      401: { $ref: 'unauthorizedResponse#' },
      403: { $ref: 'forbiddenResponse#' },
      404: { $ref: 'notFoundResponse#' },
      500: { $ref: 'serverErrorResponse#' },
    },
  },
  handler: async (request, reply) => {
    /* implementation */
  },
});
```

### 12. Complete Knex CRUD Repository Pattern

```typescript
// apps/api/src/plugins/knex.plugin.ts
import fp from 'fastify-plugin';
import knex from 'knex';

export default fp(
  async function knexPlugin(fastify: FastifyInstance) {
    const db = knex({
      client: 'postgresql',
      connection: process.env.DATABASE_URL,
      pool: {
        min: parseInt(process.env.DB_POOL_MIN || '2'),
        max: parseInt(process.env.DB_POOL_MAX || '10'),
      },
      migrations: {
        directory: './database/migrations',
        tableName: 'knex_migrations',
      },
      seeds: {
        directory: './database/seeds',
      },
    });

    // Decorate fastify with knex instance
    fastify.decorate('knex', db);
    fastify.decorate('db', db); // Alias for convenience

    // Graceful shutdown
    fastify.addHook('onClose', async () => {
      await db.destroy();
    });
  },
  {
    name: 'knex-plugin',
  },
);

// TypeScript declarations
declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
    db: Knex;
  }
}
```

### 13. Base Repository Class (Reusable CRUD)

```typescript
// apps/api/src/repositories/base.repository.ts
import { Knex } from 'knex';

interface BaseListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

interface ListResult<T> {
  data: T[];
  total: number;
}

abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(
    protected knex: Knex,
    protected tableName: string,
    protected searchFields: string[] = [],
  ) {}

  // Abstract methods to implement
  abstract transformToEntity(dbRow: any): T;
  abstract transformToDb(dto: CreateDto | UpdateDto): any;
  abstract getJoinQuery?(): Knex.QueryBuilder;

  // Common CRUD operations
  async findById(id: string): Promise<T | null> {
    const query = this.getJoinQuery?.() || this.knex(this.tableName);
    const row = await query.where(`${this.tableName}.id`, id).first();
    return row ? this.transformToEntity(row) : null;
  }

  async create(data: CreateDto): Promise<T> {
    const dbData = this.transformToDb(data);
    const [row] = await this.knex(this.tableName).insert(dbData).returning('*');
    return this.transformToEntity(row);
  }

  async update(id: string, data: UpdateDto): Promise<T | null> {
    const dbData = this.transformToDb(data);
    const [row] = await this.knex(this.tableName)
      .where({ id })
      .update({ ...dbData, updated_at: new Date() })
      .returning('*');
    return row ? this.transformToEntity(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deletedRows = await this.knex(this.tableName).where({ id }).del();
    return deletedRows > 0;
  }

  async list(query: BaseListQuery): Promise<ListResult<T>> {
    const { page = 1, limit = 10, search, sortBy = 'created_at', sortOrder = 'desc', ...filters } = query;

    // Base query
    const baseQuery = this.getJoinQuery?.() || this.knex(this.tableName);

    // Apply search
    if (search && this.searchFields.length > 0) {
      baseQuery.where(function () {
        this.searchFields.forEach((field, index) => {
          if (index === 0) {
            this.whereILike(field, `%${search}%`);
          } else {
            this.orWhereILike(field, `%${search}%`);
          }
        });
      });
    }

    // Apply custom filters
    this.applyCustomFilters(baseQuery, filters);

    // Get total count
    const countQuery = baseQuery.clone().clearSelect().count(`${this.tableName}.id as total`);
    const [{ total }] = await countQuery;

    // Apply sorting and pagination
    const data = await baseQuery
      .orderBy(this.getSortField(sortBy), sortOrder)
      .offset((page - 1) * limit)
      .limit(limit);

    return {
      data: data.map((row) => this.transformToEntity(row)),
      total: parseInt(total as string),
    };
  }

  // Override in child classes for custom filtering
  protected applyCustomFilters(query: Knex.QueryBuilder, filters: any) {
    // Default implementation - override in child classes
  }

  // Override in child classes for custom sorting
  protected getSortField(sortBy: string): string {
    return `${this.tableName}.${sortBy}`;
  }
}
```

### 13.1. UUID Validation in Base Repository

The Base Repository includes comprehensive UUID validation to prevent PostgreSQL casting errors and improve user experience when dealing with UUID-based filters.

#### Why UUID Validation?

PostgreSQL is strict about UUID format validation. When an invalid UUID is passed in a query filter (e.g., `?user_id=invalid`), PostgreSQL will throw an error:

```
ERROR: invalid input syntax for type uuid: "invalid"
```

The UUID validation system prevents these errors by:

- **Auto-detecting UUID fields** based on field names and values
- **Validating UUIDs** before they reach the database
- **Providing multiple strategies** for handling invalid UUIDs (strict, graceful, warn)
- **Improving UX** by returning empty results instead of 500 errors

#### UUID Validation Strategies

The system supports three validation strategies:

**1. STRICT Strategy**

- Throws an error immediately when an invalid UUID is detected
- Best for: API development, debugging, strict validation requirements
- User Experience: Returns 400 Bad Request with clear error message

```typescript
// Example error with STRICT strategy
{
  "error": "Invalid UUID format for field \"user_id\": \"invalid-uuid\". Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**2. GRACEFUL Strategy (Default)**

- Silently removes invalid UUID from filters
- Continues processing with remaining valid filters
- Best for: Production environments, user-facing APIs
- User Experience: Returns empty results or results matching other valid filters

```typescript
// Example with GRACEFUL strategy
// Request: GET /api/items?user_id=invalid&status=active
// Invalid user_id is removed, query becomes: status=active
// Returns: Items with status=active (ignoring invalid user_id)
```

**3. WARN Strategy**

- Logs a warning but continues processing
- Removes invalid UUID from filters
- Best for: Monitoring, identifying UUID validation issues
- User Experience: Same as GRACEFUL but with server-side logging

```typescript
// Console output with WARN strategy
// [WARN] Invalid UUID provided for field "user_id": "invalid-uuid"
```

#### UUID Validation Configuration

**Environment Variables**

Configure default behavior via environment variables:

```bash
# .env
UUID_VALIDATION_STRATEGY=graceful  # strict | graceful | warn
UUID_ALLOW_ANY_VERSION=true        # true = allow any UUID version, false = v4 only
UUID_LOG_INVALID=true              # true = log invalid attempts, false = silent
```

**Repository-Level Configuration**

Override validation behavior for specific repositories:

```typescript
// apps/api/src/modules/user/user.repository.ts
import { BaseRepository } from '../../shared/repositories/base.repository';
import { UUIDValidationStrategy } from '../../shared/utils/uuid.utils';

class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  constructor(knex: Knex) {
    super(
      knex,
      'users',
      ['users.email', 'users.first_name'], // searchFields
      ['user_id', 'organization_id'], // explicitUUIDFields
    );

    // Set strict validation for user repository
    this.setUUIDValidationConfig({
      strategy: UUIDValidationStrategy.STRICT,
      allowAnyVersion: false, // Only allow UUID v4
      logInvalidAttempts: true,
    });
  }
}
```

**Dynamic Configuration**

Change validation behavior at runtime:

```typescript
const userRepository = new UserRepository(knex);

// Enable strict mode for admin operations
userRepository.setUUIDValidationConfig({
  strategy: UUIDValidationStrategy.STRICT,
});

// Add additional UUID fields to validate
userRepository.addUUIDFields(['department_id', 'manager_id']);

// Or replace all UUID fields
userRepository.setUUIDFields(['user_id', 'org_id']);
```

#### Auto-Detection of UUID Fields

The system automatically detects UUID fields based on:

**Field Name Patterns:**

- Fields ending with `_id` (e.g., `user_id`, `organization_id`)
- Fields named exactly `id`
- Fields containing `uuid` (e.g., `user_uuid`, `uuid_reference`)

**Value Patterns:**

- Minimum length of 32 characters (UUID without dashes)
- Contains dashes (`-`)
- Only hexadecimal characters and dashes

**Explicit Exclusions:**

- Numeric-only values (e.g., `123`, `456`) are excluded
- This handles integer IDs like `budget_id`, `drug_id` in legacy tables

```typescript
// Examples of auto-detection
const filters = {
  user_id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8', // ✅ Detected as UUID
  organization_id: 'invalid-uuid', // ✅ Detected as UUID (then validated)
  budget_id: '123', // ❌ NOT detected (numeric ID)
  id: 'f7e8d9c0-b1a2-4f5e-9d8c-7b6a5e4f3d2c', // ✅ Detected as UUID
  name: 'John Doe', // ❌ NOT detected (not UUID-like)
};
```

#### Validation in Action

**Scenario 1: Graceful Handling (Default)**

```typescript
// Client request with invalid UUID
GET /api/users?user_id=invalid-uuid&status=active

// BaseRepository.applyCustomFilters() automatically validates
// Invalid user_id is removed from filters
// Query executes with: status=active only

// Response: 200 OK with users having status=active
{
  "data": [...],
  "pagination": {...}
}
```

**Scenario 2: Strict Validation**

```typescript
// Repository configured with STRICT strategy
class AdminUserRepository extends BaseRepository {
  constructor(knex: Knex) {
    super(knex, 'users', [], ['user_id']);
    this.setUUIDValidationConfig({
      strategy: UUIDValidationStrategy.STRICT,
    });
  }
}

// Client request with invalid UUID
GET /api/admin/users?user_id=invalid-uuid

// BaseRepository throws error immediately
// Response: 400 Bad Request
{
  "error": "Invalid UUID in query filters: Invalid UUID format for field \"user_id\": \"invalid-uuid\". Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Scenario 3: Mixed Valid and Invalid UUIDs**

```typescript
// Client request with one invalid UUID
GET /api/items?user_id=invalid&category_id=a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8

// With GRACEFUL strategy:
// - user_id=invalid is removed
// - category_id remains (valid UUID)
// Query executes with: category_id=a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8

// Response: 200 OK with items matching category_id
```

#### Implementation Details

The UUID validation is implemented in `BaseRepository.applyCustomFilters()`:

```typescript
// apps/api/src/shared/repositories/base.repository.ts
protected applyCustomFilters(query: Knex.QueryBuilder, filters: any): void {
  // 🛡️ UUID Validation: Clean filters to prevent PostgreSQL UUID casting errors
  let validatedFilters = filters;
  try {
    validatedFilters = smartValidateUUIDs(
      filters,
      this.explicitUUIDFields,
      this.uuidValidationConfig,
    );
  } catch (error) {
    // If strict validation is enabled and UUID is invalid, re-throw the error
    if (this.uuidValidationConfig.strategy === UUIDValidationStrategy.STRICT) {
      throw new Error(`Invalid UUID in query filters: ${error.message}`);
    }
    // Otherwise continue with original filters (graceful/warn modes)
    validatedFilters = filters;
  }

  // Continue with normal filter processing...
  Object.keys(validatedFilters).forEach((key) => {
    if (validatedFilters[key] !== undefined && validatedFilters[key] !== null) {
      query.where(`${this.tableName}.${key}`, validatedFilters[key]);
    }
  });
}
```

#### Utility Functions

The validation logic is provided by `uuid.utils.ts`:

**isValidUUID()**

```typescript
import { isValidUUID, DEFAULT_UUID_CONFIG } from '../../shared/utils/uuid.utils';

// Basic UUID validation
if (isValidUUID('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8')) {
  // Valid UUID
}

// With custom configuration
if (
  isValidUUID('a1b2c3d4-e5f6-1234-a012-b3c4d5e6f7a8', {
    ...DEFAULT_UUID_CONFIG,
    allowAnyVersion: false, // Only accept UUID v4
  })
) {
  // Valid UUID v4
}
```

**validateUUID()**

```typescript
import { validateUUID, UUIDValidationStrategy } from '../../shared/utils/uuid.utils';

// Returns validated UUID or null
const uuid = validateUUID('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8', 'user_id');
// Result: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8'

// With invalid UUID (GRACEFUL mode - default)
const invalidUuid = validateUUID('invalid', 'user_id');
// Result: null (logged warning to console)

// With invalid UUID (STRICT mode)
try {
  const strictUuid = validateUUID('invalid', 'user_id', {
    strategy: UUIDValidationStrategy.STRICT,
    allowAnyVersion: true,
    logInvalidAttempts: true,
  });
} catch (error) {
  // Throws: Invalid UUID format for field "user_id": "invalid". Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
}
```

**smartValidateUUIDs()**

```typescript
import { smartValidateUUIDs } from '../../shared/utils/uuid.utils';

// Auto-detect and validate UUIDs in filters
const filters = {
  user_id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8', // Valid
  org_id: 'invalid-uuid', // Invalid
  status: 'active', // Not a UUID
};

const cleanedFilters = smartValidateUUIDs(filters, ['user_id', 'org_id']);
// Result: { user_id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8', status: 'active' }
// Note: org_id was removed (invalid UUID)
```

**detectUUIDFields()**

```typescript
import { detectUUIDFields } from '../../shared/utils/uuid.utils';

// Auto-detect UUID-like fields
const filters = {
  user_id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8',
  budget_id: '123', // Numeric - not detected
  name: 'John Doe',
  id: 'f7e8d9c0-b1a2-4f5e-9d8c-7b6a5e4f3d2c',
};

const uuidFields = detectUUIDFields(filters);
// Result: ['user_id', 'id']
```

#### Common Errors and Solutions

**Error: PostgreSQL UUID Casting Error**

```bash
ERROR: invalid input syntax for type uuid: "invalid"
```

**Solution:**
Enable UUID validation in your repository or use explicit UUID fields:

```typescript
class MyRepository extends BaseRepository {
  constructor(knex: Knex) {
    super(
      knex,
      'my_table',
      ['name'],
      ['user_id', 'org_id'], // Explicit UUID fields
    );
  }
}
```

**Error: Valid UUID Rejected**

If a valid UUID is being rejected, check:

1. **UUID Version**: By default, all UUID versions are accepted. If you set `allowAnyVersion: false`, only UUID v4 is accepted.

```typescript
// Only accepts UUID v4 (4xxx in third group)
this.setUUIDValidationConfig({
  allowAnyVersion: false,
});
```

2. **Whitespace**: UUIDs are automatically trimmed, but ensure no extra characters.

**Error: Integer IDs Treated as UUIDs**

If numeric IDs are being validated as UUIDs:

```typescript
// This should NOT happen - numeric values are excluded
const filters = { budget_id: '123' };
const detected = detectUUIDFields(filters);
// Result: [] (numeric values are excluded)

// But if you explicitly mark it as UUID field:
class BudgetRepository extends BaseRepository {
  constructor(knex: Knex) {
    super(
      knex,
      'budgets',
      ['name'],
      ['budget_id'], // ❌ WRONG: budget_id is numeric, not UUID
    );
  }
}

// Solution: Don't include numeric ID fields in explicitUUIDFields
```

#### Best Practices

1. **Use GRACEFUL in Production**
   - Provides better user experience
   - Returns empty results instead of errors
   - Prevents unnecessary error logs

2. **Use STRICT in Development**
   - Catches UUID validation issues early
   - Helps identify frontend bugs sending invalid UUIDs
   - Provides clear error messages for debugging

3. **Explicit UUID Fields**
   - Always declare UUID fields explicitly in repository constructor
   - Don't rely only on auto-detection for critical fields
   - Prevents false positives and improves performance

4. **Environment-Based Configuration**
   - Use environment variables for default strategy
   - Override per repository when needed
   - Keep production config separate from development

```typescript
// Example: Environment-based repository configuration
class UserRepository extends BaseRepository {
  constructor(knex: Knex) {
    super(knex, 'users', ['email'], ['user_id', 'org_id']);

    // Strict in development, graceful in production
    if (process.env.NODE_ENV === 'development') {
      this.setUUIDValidationConfig({
        strategy: UUIDValidationStrategy.STRICT,
      });
    }
  }
}
```

5. **Logging for Monitoring**
   - Enable `logInvalidAttempts` in production with WARN strategy
   - Monitor logs for patterns of invalid UUIDs
   - Use monitoring tools to alert on high rates of invalid UUIDs

```typescript
// Production monitoring configuration
this.setUUIDValidationConfig({
  strategy: UUIDValidationStrategy.WARN,
  logInvalidAttempts: true, // Log for monitoring
});
```

### 13.2. Field Selection with Security Controls

The BaseRepository supports selective field retrieval through the `fields` query parameter, enabling API clients to request only the data they need. This feature optimizes network bandwidth, reduces response payload size, and improves performance.

#### Basic Field Selection

```typescript
// Client request - select specific fields only
GET /api/users?fields=id,email,first_name,last_name

// Repository processes the fields parameter
async list(query: BaseListQuery): Promise<PaginatedListResult<T>> {
  const { page = 1, limit = 10, search, sort, fields, ...filters } = query;

  const baseQuery = this.getJoinQuery?.() || this.query();

  // Handle field selection if specified
  if (fields && Array.isArray(fields) && fields.length > 0) {
    // Map field names to table columns with proper prefixing
    const validFields = fields
      .filter(field =>
        typeof field === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field)
      )
      .map(field => `${this.tableName}.${field}`);

    if (validFields.length > 0) {
      baseQuery.clearSelect().select(validFields);
    }
  }

  // ... rest of query building
}
```

#### Field Validation Rules

The repository implements strict validation to prevent SQL injection and unauthorized field access:

**Validation Pattern:**

- **Field Name Format**: `^[a-zA-Z_][a-zA-Z0-9_]*$` (alphanumeric + underscore only)
- **Automatic Prefixing**: Fields prefixed with table name (e.g., `users.email`)
- **Invalid Fields**: Silently filtered out (no error thrown)
- **Empty Result**: If all fields invalid, default SELECT is preserved

```typescript
// ✅ Valid field requests
?fields=id,email,first_name                    // Standard fields
?fields=id&fields=email&fields=created_at      // Array format (Fastify)
?fields[]=id&fields[]=email                    // Alternative array format

// ❌ Invalid field attempts (filtered out)
?fields=id,email;DELETE FROM users             // SQL injection attempt
?fields=id,../../sensitive_column              // Path traversal attempt
?fields=id,users.password_hash                 // Table prefix not allowed
```

#### Security Implications

**⚠️ CRITICAL SECURITY CONSIDERATIONS:**

1. **Sensitive Field Exposure**: The `fields` parameter does NOT enforce field-level access control. It only validates field name syntax.

```typescript
// ❌ DANGER: This exposes password hash if not protected
GET /api/users?fields=id,email,password_hash

// ✅ SOLUTION: Override transformToEntity to exclude sensitive fields
transformToEntity(dbRow: any): User {
  return {
    id: dbRow.id,
    email: dbRow.email,
    firstName: dbRow.first_name,
    lastName: dbRow.last_name,
    // password_hash is NEVER included in entity transformation
    // Even if selected via fields parameter, it won't appear in response
    role: dbRow.role,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
}
```

2. **Authorization-Based Filtering**: For multi-tenant or role-based systems, implement field authorization in child repositories:

```typescript
class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  // Override to enforce field-level permissions
  protected validateFieldAccess(fields: string[], userRole: string): string[] {
    const publicFields = ['id', 'email', 'first_name', 'last_name', 'created_at'];
    const adminOnlyFields = ['is_active', 'role_id', 'password_last_changed'];

    if (userRole === 'admin') {
      return fields; // Admins can access all fields
    }

    // Non-admins: filter out admin-only fields
    return fields.filter((field) => publicFields.includes(field) || !adminOnlyFields.includes(field));
  }

  async list(query: BaseListQuery, userRole: string): Promise<PaginatedListResult<User>> {
    // Validate fields based on user role before passing to parent
    if (query.fields) {
      query.fields = this.validateFieldAccess(query.fields, userRole);
    }

    return super.list(query);
  }
}
```

#### Performance Optimization

**Use Cases for Field Selection:**

1. **Mobile API Optimization**: Reduce payload size for bandwidth-constrained clients
2. **List View Optimization**: Load only display fields (exclude large text columns)
3. **Aggregation Queries**: Select only fields needed for calculations
4. **Export Operations**: Select specific columns for CSV/Excel exports

```typescript
// Example: Mobile-optimized user list (minimal data)
GET /api/users?fields=id,first_name,avatar_url&limit=50

// Example: Admin export (full data)
GET /api/users?fields=id,email,first_name,last_name,role,created_at,is_active&limit=1000&format=csv
```

#### Working with Joins

When using `getJoinQuery()` with joined tables, field selection applies to the main table only:

```typescript
class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  getJoinQuery() {
    return this.knex('users')
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .select(
        'users.id',
        'users.email',
        'users.first_name',
        'users.last_name',
        this.knex.raw("json_build_object('id', roles.id, 'name', roles.name) as role")
      );
  }
}

// Field selection with joins
GET /api/users?fields=id,email,first_name

// Resulting query (simplified):
SELECT users.id, users.email, users.first_name
FROM users
LEFT JOIN roles ON users.role_id = roles.id

// ⚠️ NOTE: 'role' field is NOT selected because it's from joined table
// To include joined fields, they must be part of getJoinQuery() default selection
```

**Best Practice for Joins:**

```typescript
// Override field selection to handle joins properly
protected applyFieldSelection(query: Knex.QueryBuilder, fields: string[]) {
  const mainTableFields = ['id', 'email', 'first_name', 'last_name'];
  const joinedFields = ['role']; // Fields from joined tables

  const requestedMainFields = fields.filter(f => mainTableFields.includes(f));
  const requestedJoinedFields = fields.filter(f => joinedFields.includes(f));

  const selectColumns = [
    ...requestedMainFields.map(f => `users.${f}`),
  ];

  // Always include joined object if any joined field requested
  if (requestedJoinedFields.length > 0 || requestedMainFields.length === 0) {
    selectColumns.push(
      this.knex.raw("json_build_object('id', roles.id, 'name', roles.name) as role")
    );
  }

  query.clearSelect().select(selectColumns);
}
```

### 13.3. Multi-Sort Support

The BaseRepository supports sorting by multiple fields with individual sort directions using the `sort` query parameter. This enables complex sorting scenarios like "sort by status ascending, then by created_at descending".

#### Multi-Sort Syntax

**Format:** `field1:direction1,field2:direction2,field3:direction3`

- **Field**: Column name (validated via `getSortField()`)
- **Direction**: `asc` or `desc` (defaults to `desc` if omitted)
- **Separator**: Comma (`,`) between sort pairs

```typescript
// Sort by single field (legacy support)
GET /api/users?sort=created_at:desc

// Sort by multiple fields
GET /api/users?sort=is_active:desc,created_at:desc

// Sort with mixed directions
GET /api/users?sort=role:asc,last_name:asc,first_name:asc

// Sort with default direction (desc assumed)
GET /api/users?sort=priority,due_date:asc,created_at
```

#### Implementation in BaseRepository

```typescript
// From base.repository.ts
protected applyMultipleSort(query: any, sort: string): void {
  if (sort.includes(',')) {
    // Multiple sort format: field1:desc,field2:asc,field3:desc
    const sortPairs = sort.split(',');
    sortPairs.forEach((pair) => {
      const [field, direction] = pair.split(':');
      const mappedField = this.getSortField(field.trim());
      const sortDirection =
        direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
      query.orderBy(mappedField, sortDirection);
    });
  } else {
    // Single sort field (fallback for legacy format)
    const mappedField = this.getSortField(sort);
    query.orderBy(mappedField, 'desc');
  }
}

// In list() method
async list(query: BaseListQuery = {}): Promise<PaginatedListResult<T>> {
  const { page = 1, limit = 10, search, sort, fields, ...filters } = query;

  // ... query building ...

  // Apply sorting (check for multiple sort first)
  if (sort) {
    this.applyMultipleSort(baseQuery, sort);
  } else {
    baseQuery.orderBy(this.getSortField('created_at'), 'desc');
  }

  // ... pagination ...
}
```

#### Sort Field Mapping

Override `getSortField()` to map sort parameter names to actual database columns:

```typescript
class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  protected getSortField(sortBy: string): string {
    const sortFields = {
      created_at: 'users.created_at',
      updated_at: 'users.updated_at',
      email: 'users.email',
      first_name: 'users.first_name',
      last_name: 'users.last_name',
      username: 'users.username',
      role: 'roles.name', // Joined table column
      status: 'users.is_active', // Mapped to different column name
    };

    return sortFields[sortBy] || 'users.created_at'; // Fallback to default
  }
}
```

#### Complex Sorting Scenarios

**Scenario 1: Status-Priority Sorting**

```typescript
// Sort active users first, then by priority (high to low), then by name
GET /api/tasks?sort=is_active:desc,priority:desc,title:asc

// Resulting SQL:
SELECT * FROM tasks
ORDER BY
  tasks.is_active DESC,     -- Active tasks first
  tasks.priority DESC,      -- High priority first
  tasks.title ASC           -- Alphabetical by title

// Result order:
// 1. Active + High Priority + "AAA Task"
// 2. Active + High Priority + "BBB Task"
// 3. Active + Low Priority + "CCC Task"
// 4. Inactive + High Priority + "DDD Task"
// 5. Inactive + Low Priority + "EEE Task"
```

**Scenario 2: Grouped Sorting with Joins**

```typescript
// Sort by department name, then by employee last name
GET /api/employees?sort=department:asc,last_name:asc,first_name:asc

class EmployeeRepository extends BaseRepository<Employee, CreateDto, UpdateDto> {
  getJoinQuery() {
    return this.knex('employees')
      .leftJoin('departments', 'employees.department_id', 'departments.id')
      .select('employees.*', 'departments.name as department_name');
  }

  protected getSortField(sortBy: string): string {
    const sortFields = {
      department: 'departments.name',     // Join-aware mapping
      last_name: 'employees.last_name',
      first_name: 'employees.first_name',
      created_at: 'employees.created_at',
    };
    return sortFields[sortBy] || 'employees.created_at';
  }
}

// Resulting SQL:
SELECT employees.*, departments.name as department_name
FROM employees
LEFT JOIN departments ON employees.department_id = departments.id
ORDER BY
  departments.name ASC,        -- Engineering, Finance, HR, etc.
  employees.last_name ASC,     -- Anderson, Brown, Chen, etc.
  employees.first_name ASC     -- Alice, Bob, Charlie, etc.
```

**Scenario 3: Null Handling in Sorts**

```typescript
// Sort with null values - PostgreSQL NULLS LAST behavior
GET /api/projects?sort=due_date:asc,priority:desc

// Override getSortField for null handling
protected getSortField(sortBy: string): string {
  const sortFields = {
    // PostgreSQL: NULL values appear last in ASC, first in DESC
    due_date: 'projects.due_date',      // NULLs will appear last when ASC
    priority: 'projects.priority',
    created_at: 'projects.created_at',
  };

  return sortFields[sortBy] || 'projects.created_at';
}

// Advanced: Custom null handling
protected applyMultipleSort(query: any, sort: string): void {
  if (sort.includes(',')) {
    const sortPairs = sort.split(',');
    sortPairs.forEach((pair) => {
      const [field, direction] = pair.split(':');
      const sortDirection = direction?.trim().toLowerCase() === 'asc' ? 'asc' : 'desc';

      // Special handling for nullable date fields
      if (field === 'due_date') {
        // Always put nulls last regardless of direction
        query.orderByRaw(`${this.getSortField(field)} ${sortDirection.toUpperCase()} NULLS LAST`);
      } else {
        query.orderBy(this.getSortField(field.trim()), sortDirection);
      }
    });
  } else {
    super.applyMultipleSort(query, sort);
  }
}
```

#### Performance Considerations

**Database Indexes for Multi-Sort:**

```sql
-- Single column index (good for single-field sort)
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Composite index (optimal for multi-field sort)
CREATE INDEX idx_users_active_created ON users(is_active DESC, created_at DESC);

-- Covering index (includes all sorted and selected columns)
CREATE INDEX idx_users_active_role_created
ON users(is_active DESC, role_id, created_at DESC)
INCLUDE (id, email, first_name, last_name);
```

**Sort Performance Tips:**

1. **Index Order Matters**: Index columns should match sort order and direction
2. **Limit Sort Fields**: More than 3-4 sort fields can degrade performance
3. **Monitor Query Plans**: Use `EXPLAIN ANALYZE` to verify index usage
4. **Consider Materialized Views**: For complex multi-table sorts used frequently

```typescript
// Check if multi-sort is using indexes
const result = await this.knex.raw(`
  EXPLAIN ANALYZE
  SELECT * FROM users
  ORDER BY is_active DESC, created_at DESC
  LIMIT 10
`);

// Look for "Index Scan" vs "Seq Scan" in output
console.log(result.rows);
```

#### Sort Validation and Security

**Prevent Sort Injection:**

```typescript
class SecureUserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  private readonly allowedSortFields = ['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'role', 'status'];

  protected getSortField(sortBy: string): string {
    // Validate sort field against whitelist
    if (!this.allowedSortFields.includes(sortBy)) {
      // Log potential attack attempt
      console.warn(`Invalid sort field attempted: ${sortBy}`);
      return 'users.created_at'; // Fallback to safe default
    }

    const sortFields = {
      created_at: 'users.created_at',
      updated_at: 'users.updated_at',
      email: 'users.email',
      first_name: 'users.first_name',
      last_name: 'users.last_name',
      role: 'roles.name',
      status: 'users.is_active',
    };

    return sortFields[sortBy];
  }
}
```

### 13.4. Audit Fields Configuration

The BaseRepository provides automatic tracking of record creation and modification through configurable audit fields. This feature handles `created_at`, `updated_at`, `created_by`, and `updated_by` fields based on your table structure.

#### RepositoryFieldConfig Interface

```typescript
// From base.repository.ts
export interface RepositoryFieldConfig {
  /** Table has created_at column (auto-managed by DB) */
  hasCreatedAt?: boolean;

  /** Table has updated_at column (auto-set on UPDATE) */
  hasUpdatedAt?: boolean;

  /** Table has created_by column (set from request context) */
  hasCreatedBy?: boolean;

  /** Table has updated_by column (set from request context) */
  hasUpdatedBy?: boolean;

  /** Custom name for created_at field (default: 'created_at') */
  createdAtField?: string;

  /** Custom name for updated_at field (default: 'updated_at') */
  updatedAtField?: string;

  /** Custom name for created_by field (default: 'created_by') */
  createdByField?: string;

  /** Custom name for updated_by field (default: 'updated_by') */
  updatedByField?: string;
}
```

#### Default Configuration

```typescript
export abstract class BaseRepository<T, CreateDto = any, UpdateDto = any> {
  protected fieldConfig: RepositoryFieldConfig;

  constructor(
    protected knex: Knex,
    protected tableName: string,
    protected searchFields: string[] = [],
    protected explicitUUIDFields: string[] = [],
    fieldConfig: RepositoryFieldConfig = {},
  ) {
    // Default configuration - assume modern tables have timestamp fields
    this.fieldConfig = {
      hasCreatedAt: true, // Most tables have created_at
      hasUpdatedAt: true, // Most tables have updated_at
      hasCreatedBy: false, // User tracking not enabled by default
      hasUpdatedBy: false, // User tracking not enabled by default
      createdAtField: 'created_at',
      updatedAtField: 'updated_at',
      createdByField: 'created_by',
      updatedByField: 'updated_by',
      ...fieldConfig, // Override with custom config
    };
  }
}
```

#### Automatic Field Management

**created_at - Database-Managed:**

```sql
-- Migration: created_at with DEFAULT constraint
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Auto-set by database
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```typescript
// Repository does NOT set created_at (database handles it)
async create(data: CreateDto, userId?: string | number): Promise<T> {
  const dbData = this.transformToDb ? this.transformToDb(data) : data;
  const createData: any = { ...dbData };

  // Add created_by if configured
  if (this.fieldConfig.hasCreatedBy && userId !== undefined) {
    createData[this.fieldConfig.createdByField!] = userId;
  }

  // Note: created_at is NOT set here - database DEFAULT handles it

  const [row] = await this.query().insert(createData).returning('*');
  return this.transformToEntity ? this.transformToEntity(row) : row;
}
```

**updated_at - Repository-Managed:**

```typescript
// Repository sets updated_at on every update
async update(
  id: string | number,
  data: UpdateDto,
  userId?: string | number,
): Promise<T | null> {
  const dbData = this.transformToDb ? this.transformToDb(data) : data;
  const updateData: any = { ...dbData };

  // Add updated_at if table has this column
  if (this.fieldConfig.hasUpdatedAt) {
    updateData[this.fieldConfig.updatedAtField!] = new Date();
  }

  // Add updated_by if configured
  if (this.fieldConfig.hasUpdatedBy && userId !== undefined) {
    updateData[this.fieldConfig.updatedByField!] = userId;
  }

  const [row] = await this.query()
    .where({ id })
    .update(updateData)
    .returning('*');

  if (!row) return null;
  return this.transformToEntity ? this.transformToEntity(row) : row;
}
```

**created_by / updated_by - User Context:**

```typescript
// Controller passes userId from authenticated request
async createUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id; // From JWT/session
  const userData = request.body;

  // userId automatically tracked in created_by
  const user = await this.userRepository.create(userData, userId);

  return reply.success(user, 'User created successfully');
}

async updateUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;
  const { id } = request.params;
  const userData = request.body;

  // userId automatically tracked in updated_by
  const user = await this.userRepository.update(id, userData, userId);

  return reply.success(user, 'User updated successfully');
}
```

#### Configuration Examples

**Example 1: Modern Table with Full Audit Tracking**

```typescript
// Migration
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id)
);

// Repository with audit tracking enabled
class DepartmentRepository extends BaseRepository<
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto
> {
  constructor(knex: Knex) {
    super(
      knex,
      'departments',
      ['departments.name', 'departments.code'], // searchFields
      [], // explicitUUIDFields
      {
        // Enable all audit fields
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: true,   // ✅ Track who created
        hasUpdatedBy: true,   // ✅ Track who updated
      }
    );
  }
}

// Usage in controller
async createDepartment(request: FastifyRequest, reply: FastifyReply) {
  const currentUserId = request.user.id;
  const department = await this.departmentRepository.create(
    request.body,
    currentUserId  // Automatically sets created_by
  );
  return reply.success(department);
}
```

**Example 2: Legacy Table Without Audit Fields**

```typescript
// Legacy table without timestamp columns
CREATE TABLE legacy_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50),
  description TEXT
);

// Repository configured for legacy table
class LegacyCodeRepository extends BaseRepository<
  LegacyCode,
  CreateLegacyCodeDto,
  UpdateLegacyCodeDto
> {
  constructor(knex: Knex) {
    super(
      knex,
      'legacy_codes',
      ['legacy_codes.code', 'legacy_codes.description'],
      [],
      {
        // Disable all audit fields for legacy table
        hasCreatedAt: false,
        hasUpdatedAt: false,
        hasCreatedBy: false,
        hasUpdatedBy: false,
      }
    );
  }
}

// create() and update() work without timestamp errors
await legacyCodeRepository.create({ code: 'ABC', description: 'Test' });
// No updated_at set, no errors thrown
```

**Example 3: Custom Field Names**

```typescript
// Table with non-standard field names
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100),
  event_data JSONB,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Non-standard name
  recorded_by UUID REFERENCES users(id),              -- Non-standard name
  modified_at TIMESTAMP,                              -- Non-standard name
  modified_by UUID REFERENCES users(id)               -- Non-standard name
);

// Repository with custom field name mapping
class AuditLogRepository extends BaseRepository<
  AuditLog,
  CreateAuditLogDto,
  UpdateAuditLogDto
> {
  constructor(knex: Knex) {
    super(
      knex,
      'audit_logs',
      ['audit_logs.event_type'],
      [],
      {
        hasCreatedAt: true,
        hasUpdatedAt: true,
        hasCreatedBy: true,
        hasUpdatedBy: true,
        // Map to custom field names
        createdAtField: 'recorded_at',
        createdByField: 'recorded_by',
        updatedAtField: 'modified_at',
        updatedByField: 'modified_by',
      }
    );
  }
}

// Usage - same API, different field names
await auditLogRepository.create(
  { event_type: 'USER_LOGIN', event_data: {...} },
  userId  // Sets recorded_by instead of created_by
);

await auditLogRepository.update(
  logId,
  { event_data: {...} },
  userId  // Sets modified_by and modified_at
);
```

#### Bulk Operations with Audit Fields

```typescript
// createMany - applies created_by to all records
async createMany(data: CreateDto[], userId?: string | number): Promise<T[]> {
  let dbData = this.transformToDb
    ? data.map((item) => this.transformToDb!(item))
    : data;

  // Add created_by to all records if configured
  if (this.fieldConfig.hasCreatedBy && userId !== undefined) {
    dbData = dbData.map((item: any) => ({
      ...item,
      [this.fieldConfig.createdByField!]: userId,
    }));
  }

  const rows = await this.query().insert(dbData).returning('*');

  return this.transformToEntity
    ? rows.map((row) => this.transformToEntity!(row))
    : rows;
}

// Usage: Bulk import with user tracking
const importedDepartments = await departmentRepository.createMany(
  [
    { name: 'Engineering', code: 'ENG' },
    { name: 'Finance', code: 'FIN' },
    { name: 'HR', code: 'HR' },
  ],
  request.user.id  // All 3 records track this user as creator
);

// updateMany - applies updated_by to all records
async updateMany(
  ids: (string | number)[],
  data: UpdateDto,
  userId?: string | number,
): Promise<number> {
  const dbData = this.transformToDb ? this.transformToDb(data) : data;
  const updateData: any = { ...dbData };

  // Add updated_at if configured
  if (this.fieldConfig.hasUpdatedAt) {
    updateData[this.fieldConfig.updatedAtField!] = new Date();
  }

  // Add updated_by if configured
  if (this.fieldConfig.hasUpdatedBy && userId !== undefined) {
    updateData[this.fieldConfig.updatedByField!] = userId;
  }

  const updatedCount = await this.query().whereIn('id', ids).update(updateData);
  return updatedCount;
}

// Usage: Bulk status update with user tracking
await departmentRepository.updateMany(
  [dept1Id, dept2Id, dept3Id],
  { is_active: false },
  request.user.id  // All 3 records track this user as updater
);
```

#### Querying Audit Fields

```typescript
// Query by creator
GET /api/departments?created_by=550e8400-e29b-41d4-a716-446655440000

// Query by date range with creator
GET /api/departments?created_at_min=2025-01-01&created_by=550e8400-e29b-41d4-a716-446655440000

// Custom filter in repository
protected applyCustomFilters(query: Knex.QueryBuilder, filters: any): void {
  super.applyCustomFilters(query, filters); // Apply base filters

  // Custom audit field filters
  if (filters.created_by) {
    query.where(`${this.tableName}.created_by`, filters.created_by);
  }

  if (filters.updated_by) {
    query.where(`${this.tableName}.updated_by`, filters.updated_by);
  }

  if (filters.created_at_min) {
    query.where(`${this.tableName}.created_at`, '>=', filters.created_at_min);
  }

  if (filters.created_at_max) {
    query.where(`${this.tableName}.created_at`, '<=', filters.created_at_max);
  }
}
```

#### Best Practices

1. **Enable audit fields for all business-critical tables** (departments, users, orders, transactions)
2. **Use database DEFAULT for created_at** (more reliable than application-level)
3. **Set updated_at in repository** (allows business logic to override if needed)
4. **Always pass userId in controllers** (never trust client-provided user IDs)
5. **Join with users table for audit reports:**

```typescript
class DepartmentRepository extends BaseRepository<Department, CreateDto, UpdateDto> {
  async listWithAuditInfo(query: BaseListQuery): Promise<PaginatedListResult<any>> {
    const baseQuery = this.knex('departments')
      .leftJoin('users as creator', 'departments.created_by', 'creator.id')
      .leftJoin('users as updater', 'departments.updated_by', 'updater.id')
      .select(
        'departments.*',
        this.knex.raw(`
          json_build_object(
            'id', creator.id,
            'name', CONCAT(creator.first_name, ' ', creator.last_name),
            'email', creator.email
          ) as created_by_user
        `),
        this.knex.raw(`
          json_build_object(
            'id', updater.id,
            'name', CONCAT(updater.first_name, ' ', updater.last_name),
            'email', updater.email
          ) as updated_by_user
        `)
      );

    // Use base list logic with custom query
    return this.listWithCustomQuery(baseQuery, query);
  }
}

// Response includes full user information
{
  "data": [
    {
      "id": "dept-uuid",
      "name": "Engineering",
      "code": "ENG",
      "created_at": "2025-12-15T10:00:00Z",
      "created_by_user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "updated_at": "2025-12-17T14:30:00Z",
      "updated_by_user": {
        "id": "admin-uuid",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  ]
}
```

### 14. User Repository Implementation

```typescript
// apps/api/src/modules/user/user.repository.ts
import { BaseRepository } from '../../repositories/base.repository';
import { User, CreateUserRequest, UpdateUserRequest } from '@org/api-client';

interface GetUsersFilters extends BaseListQuery {
  role?: string;
  roles?: string[];
  status?: 'active' | 'inactive';
  createdAfter?: string;
  createdBefore?: string;
}

class UserRepository extends BaseRepository<User, CreateUserRequest, UpdateUserRequest> {
  constructor(knex: Knex) {
    super(
      knex,
      'users',
      ['users.email', 'users.first_name', 'users.last_name', 'users.username'], // searchFields
    );
  }

  // Join with roles table
  getJoinQuery() {
    return this.knex('users').leftJoin('roles', 'users.role_id', 'roles.id').select('users.id', 'users.email', 'users.username', 'users.first_name', 'users.last_name', 'users.is_active', 'users.created_at', 'users.updated_at', this.knex.raw("json_build_object('id', roles.id, 'name', roles.name, 'description', roles.description) as role"));
  }

  // Custom filters for users
  protected applyCustomFilters(query: Knex.QueryBuilder, filters: any) {
    const { role, roles, status, createdAfter, createdBefore } = filters;

    // Single role filter
    if (role) {
      query.where('roles.name', role);
    }

    // Multiple roles filter
    if (roles && roles.length > 0) {
      query.whereIn('roles.name', roles);
    }

    // Status filter
    if (status) {
      query.where('users.is_active', status === 'active');
    }

    // Date range filters
    if (createdAfter) {
      query.where('users.created_at', '>=', createdAfter);
    }

    if (createdBefore) {
      query.where('users.created_at', '<=', createdBefore);
    }
  }

  // Custom sort fields mapping
  protected getSortField(sortBy: string): string {
    const sortFields = {
      created_at: 'users.created_at',
      updated_at: 'users.updated_at',
      email: 'users.email',
      first_name: 'users.first_name',
      last_name: 'users.last_name',
      username: 'users.username',
      role: 'roles.name',
      status: 'users.is_active',
    };

    return sortFields[sortBy] || 'users.created_at';
  }

  // Transform database row to entity
  transformToEntity(dbRow: any): User {
    return {
      id: dbRow.id,
      email: dbRow.email,
      username: dbRow.username,
      firstName: dbRow.first_name,
      lastName: dbRow.last_name,
      isActive: dbRow.is_active,
      role: dbRow.role,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
    };
  }

  // Transform DTO to database format
  transformToDb(dto: CreateUserRequest | UpdateUserRequest): any {
    const transformed: any = {};

    if ('email' in dto) transformed.email = dto.email;
    if ('username' in dto) transformed.username = dto.username;
    if ('firstName' in dto) transformed.first_name = dto.firstName;
    if ('lastName' in dto) transformed.last_name = dto.lastName;
    if ('password' in dto) transformed.password = dto.password;
    if ('roleId' in dto) transformed.role_id = dto.roleId;
    if ('isActive' in dto) transformed.is_active = dto.isActive;

    return transformed;
  }

  // Additional user-specific methods
  async findByEmail(email: string): Promise<User | null> {
    const query = this.getJoinQuery();
    const row = await query.where('users.email', email).first();
    return row ? this.transformToEntity(row) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = this.getJoinQuery();
    const row = await query.where('users.username', username).first();
    return row ? this.transformToEntity(row) : null;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.knex('users').where({ id }).update({
      password: hashedPassword,
      updated_at: new Date(),
    });
  }

  async getUserStats(): Promise<{ total: number; active: number; inactive: number }> {
    const stats = await this.knex('users').select(this.knex.raw('COUNT(*) as total'), this.knex.raw('COUNT(CASE WHEN is_active = true THEN 1 END) as active'), this.knex.raw('COUNT(CASE WHEN is_active = false THEN 1 END) as inactive')).first();

    return {
      total: parseInt(stats.total),
      active: parseInt(stats.active),
      inactive: parseInt(stats.inactive),
    };
  }
}
```

### 15. Generic CRUD Service Pattern

```typescript
// apps/api/src/services/base.service.ts
import { BaseRepository } from '../repositories/base.repository';

abstract class BaseService<T, CreateDto, UpdateDto> {
  constructor(protected repository: BaseRepository<T, CreateDto, UpdateDto>) {}

  async getList(query: any) {
    // Set defaults
    const filters = {
      page: Math.max(1, parseInt(query.page) || 1),
      limit: Math.min(100, Math.max(1, parseInt(query.limit) || 10)),
      ...query,
    };

    return this.repository.list(filters);
  }

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async create(data: CreateDto): Promise<T> {
    await this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateDto): Promise<T | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    await this.validateUpdate(id, data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) return false;

    await this.validateDelete(id);
    return this.repository.delete(id);
  }

  // Override in child classes for validation
  protected async validateCreate(data: CreateDto): Promise<void> {}
  protected async validateUpdate(id: string, data: UpdateDto): Promise<void> {}
  protected async validateDelete(id: string): Promise<void> {}
}

// User service implementation
export class UserService extends BaseService<User, CreateUserRequest, UpdateUserRequest> {
  constructor(userRepository: UserRepository) {
    super(userRepository);
  }

  // User-specific validation
  protected async validateCreate(data: CreateUserRequest): Promise<void> {
    // Check email uniqueness
    const existingEmail = await (this.repository as UserRepository).findByEmail(data.email);
    if (existingEmail) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Check username uniqueness
    const existingUsername = await (this.repository as UserRepository).findByUsername(data.username);
    if (existingUsername) {
      throw new Error('USERNAME_ALREADY_EXISTS');
    }
  }

  protected async validateUpdate(id: string, data: UpdateUserRequest): Promise<void> {
    // Additional business logic validation
  }

  // User-specific methods
  async changePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await (this.repository as UserRepository).updatePassword(id, hashedPassword);
  }

  async getUserStats() {
    return (this.repository as UserRepository).getUserStats();
  }
}
```

### 16. Complete Route Handler Example

```typescript
// apps/api/src/modules/user/user.routes.ts
async function userRoutes(fastify: FastifyInstance) {
  // GET /api/users - Advanced list with all features
  fastify.route<{
    Querystring: GetUsersQuery;
    Reply: ApiResponse<User[]>;
  }>({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get paginated, filtered, and sorted list of users',
      tags: ['Users'],
      querystring: {
        type: 'object',
        properties: {
          // Pagination
          page: { type: 'integer', minimum: 1, default: 1, description: 'Page number' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Items per page' },

          // Search
          search: { type: 'string', minLength: 1, description: 'Search across email, name, username' },

          // Filters
          role: { type: 'string', description: 'Filter by role name' },
          roles: { type: 'array', items: { type: 'string' }, description: 'Filter by multiple roles' },
          status: { type: 'string', enum: ['active', 'inactive'], description: 'Filter by status' },
          createdAfter: { type: 'string', format: 'date-time', description: 'Created after date' },
          createdBefore: { type: 'string', format: 'date-time', description: 'Created before date' },

          // Sorting
          sortBy: {
            type: 'string',
            enum: ['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'username', 'role', 'status'],
            default: 'created_at',
          },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        },
      },
      response: {
        200: { $ref: 'paginatedUsersResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        500: { $ref: 'serverErrorResponse#' },
      },
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { data, total } = await fastify.userService.getList(request.query);
      const { page = 1, limit = 10 } = request.query;

      return reply.paginated(data, page, limit, total, 'Users retrieved successfully');
    },
  });

  // POST /api/users - Create with business validation
  fastify.route<{
    Body: CreateUserRequest;
    Reply: ApiResponse<User>;
  }>({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create new user',
      tags: ['Users'],
      body: { $ref: 'createUserRequest#' },
      response: {
        201: { $ref: 'userResponse#' },
        400: { $ref: 'validationErrorResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        409: { $ref: 'conflictResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin'])],
    handler: async (request, reply) => {
      const user = await fastify.userService.create(request.body);
      return reply.created(user, 'User created successfully');
    },
  });

  // PUT /api/users/:id - Update with optimistic locking
  fastify.route<{
    Params: { id: string };
    Body: UpdateUserRequest;
    Reply: ApiResponse<User>;
  }>({
    method: 'PUT',
    url: '/:id',
    schema: {
      description: 'Update user by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: { $ref: 'updateUserRequest#' },
      response: {
        200: { $ref: 'userResponse#' },
        400: { $ref: 'validationErrorResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin', 'manager'])],
    handler: async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.userService.update(id, request.body);

      if (!user) {
        return reply.notFound('User not found');
      }

      return reply.success(user, 'User updated successfully');
    },
  });

  // DELETE /api/users/:id - Soft delete option
  fastify.route<{
    Params: { id: string };
    Reply: ApiResponse<{ id: string }>;
  }>({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete user by ID',
      tags: ['Users'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: { $ref: 'deleteResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin'])],
    handler: async (request, reply) => {
      const { id } = request.params;
      const deleted = await fastify.userService.delete(id);

      if (!deleted) {
        return reply.notFound('User not found');
      }

      return reply.success({ id }, 'User deleted successfully');
    },
  });

  // GET /api/users/stats - Statistics endpoint
  fastify.route({
    method: 'GET',
    url: '/stats',
    schema: {
      description: 'Get user statistics',
      tags: ['Users'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', const: true },
            data: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                active: { type: 'integer' },
                inactive: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize(['admin'])],
    handler: async (request, reply) => {
      const stats = await fastify.userService.getUserStats();
      return reply.success(stats, 'User statistics retrieved');
    },
  });
}
```

### 17. Example Usage URLs

```bash
# Basic pagination
GET /api/users?page=1&limit=20

# Search with pagination
GET /api/users?search=john&page=1&limit=10

# Multiple filters
GET /api/users?role=admin&status=active&page=1

# Date range filter
GET /api/users?createdAfter=2024-01-01&createdBefore=2024-12-31

# Multiple roles filter
GET /api/users?roles[]=admin&roles[]=manager

# Sorting
GET /api/users?sortBy=email&sortOrder=asc

# Complex query
GET /api/users?search=john&roles[]=admin&roles[]=manager&status=active&sortBy=created_at&sortOrder=desc&page=2&limit=25
```

**Knex Features:**

- **Migration System** - Database schema versioning
- **Query Builder** - Type-safe SQL generation
- **Connection Pooling** - Better performance
- **Transaction Support** - ACID compliance
- **Multiple DB Support** - PostgreSQL, MySQL, SQLite
- **Seed System** - Test data management
- **Advanced Filtering** - Complex WHERE conditions
- **Join Support** - Easy table relationships

### 13. Module Structure (Fastify Way)

#### Single Controller Structure

```
apps/api/src/modules/user/
├── user.plugin.ts              # Main plugin entry
├── user.service.ts             # Business logic
├── user.repository.ts          # Data access
├── user.schemas.ts             # JSON schemas (MANDATORY)
├── user.types.ts              # TypeScript types
├── user.test.ts               # Tests
└── hooks/                     # Custom hooks
    ├── validate-user.hook.ts
    └── format-response.hook.ts
```

#### Multiple Controllers Structure (Complex Modules)

```
apps/api/src/modules/user/
├── user.plugin.ts              # Main plugin entry - registers all routes
├── controllers/                # Multiple controllers
│   ├── user.controller.ts         # Basic CRUD operations
│   ├── user-profile.controller.ts # Profile management
│   ├── user-auth.controller.ts    # Authentication endpoints
│   └── user-admin.controller.ts   # Admin-only operations
├── services/                   # Business logic layer
│   ├── user.service.ts
│   ├── user-profile.service.ts
│   ├── user-auth.service.ts
│   └── user-admin.service.ts
├── repositories/               # Data access layer
│   ├── user.repository.ts
│   └── user-session.repository.ts
├── schemas/                    # JSON schemas (MANDATORY)
│   ├── user.schemas.ts
│   ├── profile.schemas.ts
│   ├── auth.schemas.ts
│   └── admin.schemas.ts
├── types/                      # TypeScript types
│   ├── user.types.ts
│   ├── auth.types.ts
│   └── admin.types.ts
├── hooks/                      # Custom hooks
│   ├── validate-user.hook.ts
│   ├── audit-log.hook.ts
│   └── format-response.hook.ts
├── tests/                      # Test files
│   ├── user.controller.test.ts
│   ├── user.service.test.ts
│   ├── user.repository.test.ts
│   └── integration.test.ts
└── utils/                      # Module-specific utilities
    ├── password.utils.ts
    └── validation.utils.ts
```

#### Route Organization for Multiple Controllers

```typescript
// apps/api/src/modules/user/user.plugin.ts
export default fp(
  async function userPlugin(fastify: FastifyInstance) {
    // Initialize repositories
    const userRepository = new UserRepository(fastify.knex);
    const sessionRepository = new UserSessionRepository(fastify.knex);

    // Initialize services
    const userService = new UserService(userRepository);
    const profileService = new UserProfileService(userRepository);
    const authService = new UserAuthService(userRepository, sessionRepository);
    const adminService = new UserAdminService(userRepository);

    // Decorate fastify instance
    fastify.decorate('userService', userService);
    fastify.decorate('profileService', profileService);
    fastify.decorate('authService', authService);
    fastify.decorate('adminService', adminService);

    // Register all controller routes with prefixes
    await fastify.register(userController, { prefix: '' }); // /api/users
    await fastify.register(profileController, { prefix: '' }); // /api/users/:id/profile
    await fastify.register(authController, { prefix: '/auth' }); // /api/users/auth
    await fastify.register(adminController, { prefix: '/admin' }); // /api/users/admin
  },
  {
    name: 'user-plugin',
    dependencies: ['knex-plugin', 'auth-plugin', 'schema-plugin'],
  },
);
```

#### Controller Implementation Examples

**Basic User Controller:**

```typescript
// apps/api/src/modules/user/controllers/user.controller.ts
export default async function userController(fastify: FastifyInstance) {
  // GET /api/users - List users
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get paginated list of users',
      tags: ['Users'],
      querystring: { $ref: 'getUsersQuery#' },
      response: {
        200: { $ref: 'paginatedUsersResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    handler: async (request, reply) => {
      const { data, total } = await fastify.userService.getList(request.query);
      const { page = 1, limit = 10 } = request.query as any;
      return reply.paginated(data, page, limit, total);
    },
  });

  // GET /api/users/:id - Get single user
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Get user by ID',
      tags: ['Users'],
      params: { $ref: 'userParamsSchema#' },
      response: {
        200: { $ref: 'userResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const user = await fastify.userService.getById(id);
      if (!user) return reply.notFound('User not found');
      return reply.success(user);
    },
  });

  // POST /api/users - Create user
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Create new user',
      tags: ['Users'],
      body: { $ref: 'createUserRequest#' },
      response: {
        201: { $ref: 'userResponse#' },
        409: { $ref: 'conflictResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const user = await fastify.userService.create(request.body);
      return reply.created(user, 'User created successfully');
    },
  });

  // PUT /api/users/:id - Update user
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      description: 'Update user by ID',
      tags: ['Users'],
      params: { $ref: 'userParamsSchema#' },
      body: { $ref: 'updateUserRequest#' },
      response: {
        200: { $ref: 'userResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin', 'manager'])])],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const user = await fastify.userService.update(id, request.body);
      if (!user) return reply.notFound('User not found');
      return reply.success(user, 'User updated successfully');
    },
  });

  // DELETE /api/users/:id - Delete user
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      description: 'Delete user by ID',
      tags: ['Users'],
      params: { $ref: 'userParamsSchema#' },
      response: {
        200: { $ref: 'deleteResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const deleted = await fastify.userService.delete(id);
      if (!deleted) return reply.notFound('User not found');
      return reply.success({ id }, 'User deleted successfully');
    },
  });
}
```

**Profile Management Controller:**

```typescript
// apps/api/src/modules/user/controllers/user-profile.controller.ts
export default async function profileController(fastify: FastifyInstance) {
  // GET /api/users/:id/profile - Get user profile
  fastify.route({
    method: 'GET',
    url: '/:id/profile',
    schema: {
      description: 'Get user profile details',
      tags: ['User Profile'],
      params: { $ref: 'userParamsSchema#' },
      response: {
        200: { $ref: 'userProfileResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: fastify.auth([fastify.verifyJWT, [fastify.verifyRole(['admin']), fastify.verifyOwnership('id')]], { relation: 'or' }),
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const profile = await fastify.profileService.getProfile(id);
      if (!profile) return reply.notFound('Profile not found');
      return reply.success(profile);
    },
  });

  // PUT /api/users/:id/profile - Update profile
  fastify.route({
    method: 'PUT',
    url: '/:id/profile',
    schema: {
      description: 'Update user profile',
      tags: ['User Profile'],
      params: { $ref: 'userParamsSchema#' },
      body: { $ref: 'updateProfileRequest#' },
      response: {
        200: { $ref: 'userProfileResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: fastify.auth([fastify.verifyJWT, [fastify.verifyRole(['admin']), fastify.verifyOwnership('id')]], { relation: 'or' }),
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const profile = await fastify.profileService.updateProfile(id, request.body);
      if (!profile) return reply.notFound('Profile not found');
      return reply.success(profile, 'Profile updated successfully');
    },
  });

  // POST /api/users/:id/avatar - Upload avatar
  fastify.route({
    method: 'POST',
    url: '/:id/avatar',
    schema: {
      description: 'Upload user avatar',
      tags: ['User Profile'],
      params: { $ref: 'userParamsSchema#' },
      consumes: ['multipart/form-data'],
      response: {
        200: { $ref: 'avatarUploadResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: fastify.auth([fastify.verifyJWT, [fastify.verifyRole(['admin']), fastify.verifyOwnership('id')]], { relation: 'or' }),
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const avatar = await fastify.profileService.uploadAvatar(id, request);
      return reply.success(avatar, 'Avatar uploaded successfully');
    },
  });
}
```

**Authentication Controller:**

```typescript
// apps/api/src/modules/user/controllers/user-auth.controller.ts
export default async function authController(fastify: FastifyInstance) {
  // POST /api/users/auth/change-password - Change password
  fastify.route({
    method: 'POST',
    url: '/change-password',
    schema: {
      description: 'Change user password',
      tags: ['User Authentication'],
      body: { $ref: 'changePasswordRequest#' },
      response: {
        200: { $ref: 'successResponse#' },
        400: { $ref: 'validationErrorResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    handler: async (request, reply) => {
      const user = request.user as any;
      await fastify.authService.changePassword(user.id, request.body);
      return reply.success({}, 'Password changed successfully');
    },
  });

  // POST /api/users/auth/verify-email - Verify email
  fastify.route({
    method: 'POST',
    url: '/verify-email',
    schema: {
      description: 'Verify user email address',
      tags: ['User Authentication'],
      body: { $ref: 'verifyEmailRequest#' },
      response: {
        200: { $ref: 'successResponse#' },
        400: { $ref: 'validationErrorResponse#' },
      },
    },
    handler: async (request, reply) => {
      await fastify.authService.verifyEmail(request.body);
      return reply.success({}, 'Email verified successfully');
    },
  });

  // GET /api/users/auth/sessions - Get user sessions
  fastify.route({
    method: 'GET',
    url: '/sessions',
    schema: {
      description: 'Get user active sessions',
      tags: ['User Authentication'],
      response: {
        200: { $ref: 'userSessionsResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    handler: async (request, reply) => {
      const user = request.user as any;
      const sessions = await fastify.authService.getUserSessions(user.id);
      return reply.success(sessions);
    },
  });

  // DELETE /api/users/auth/sessions/:sessionId - Revoke session
  fastify.route({
    method: 'DELETE',
    url: '/sessions/:sessionId',
    schema: {
      description: 'Revoke user session',
      tags: ['User Authentication'],
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: { $ref: 'successResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT])],
    handler: async (request, reply) => {
      const user = request.user as any;
      const { sessionId } = request.params as any;
      const revoked = await fastify.authService.revokeSession(user.id, sessionId);
      if (!revoked) return reply.notFound('Session not found');
      return reply.success({}, 'Session revoked successfully');
    },
  });
}
```

**Admin Operations Controller:**

```typescript
// apps/api/src/modules/user/controllers/user-admin.controller.ts
export default async function adminController(fastify: FastifyInstance) {
  // PATCH /api/users/admin/:id/status - Toggle user status
  fastify.route({
    method: 'PATCH',
    url: '/:id/status',
    schema: {
      description: 'Toggle user active status',
      tags: ['User Administration'],
      params: { $ref: 'userParamsSchema#' },
      body: {
        type: 'object',
        required: ['isActive'],
        properties: {
          isActive: { type: 'boolean' },
        },
      },
      response: {
        200: { $ref: 'userResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const { isActive } = request.body as any;
      const user = await fastify.adminService.toggleUserStatus(id, isActive);
      if (!user) return reply.notFound('User not found');
      return reply.success(user, 'User status updated');
    },
  });

  // POST /api/users/admin/bulk-import - Bulk import users
  fastify.route({
    method: 'POST',
    url: '/bulk-import',
    schema: {
      description: 'Bulk import users from CSV',
      tags: ['User Administration'],
      consumes: ['multipart/form-data'],
      response: {
        200: { $ref: 'bulkImportResponse#' },
        400: { $ref: 'validationErrorResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const result = await fastify.adminService.bulkImportUsers(request);
      return reply.success(result, 'Bulk import completed');
    },
  });

  // GET /api/users/admin/statistics - Get user statistics
  fastify.route({
    method: 'GET',
    url: '/statistics',
    schema: {
      description: 'Get detailed user statistics',
      tags: ['User Administration'],
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['day', 'week', 'month', 'year'], default: 'month' },
        },
      },
      response: {
        200: { $ref: 'userStatisticsResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const { period } = request.query as any;
      const stats = await fastify.adminService.getUserStatistics(period);
      return reply.success(stats);
    },
  });

  // POST /api/users/admin/:id/reset-password - Admin reset password
  fastify.route({
    method: 'POST',
    url: '/:id/reset-password',
    schema: {
      description: 'Reset user password (admin only)',
      tags: ['User Administration'],
      params: { $ref: 'userParamsSchema#' },
      body: {
        type: 'object',
        properties: {
          sendEmail: { type: 'boolean', default: true },
        },
      },
      response: {
        200: { $ref: 'passwordResetResponse#' },
        404: { $ref: 'notFoundResponse#' },
      },
    },
    preHandler: [fastify.auth([fastify.verifyJWT, fastify.verifyRole(['admin'])])],
    handler: async (request, reply) => {
      const { id } = request.params as any;
      const { sendEmail } = request.body as any;
      const result = await fastify.adminService.resetUserPassword(id, sendEmail);
      if (!result) return reply.notFound('User not found');
      return reply.success(result, 'Password reset successfully');
    },
  });
}
```

#### When to Use Multiple Controllers

**Use Multiple Controllers when:**

- Module has 15+ endpoints
- Different access levels (public, user, admin)
- Distinct functional areas (CRUD, auth, profile, admin)
- Different teams working on same resource
- Complex business domains

**Example Route Mapping:**

```
# Basic CRUD (user.controller.ts)
GET    /api/users              # List users
GET    /api/users/:id          # Get user
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user

# Profile Management (user-profile.controller.ts)
GET    /api/users/:id/profile     # Get profile
PUT    /api/users/:id/profile     # Update profile
POST   /api/users/:id/avatar      # Upload avatar
DELETE /api/users/:id/avatar     # Remove avatar

# Authentication (user-auth.controller.ts)
POST   /api/users/auth/change-password      # Change password
POST   /api/users/auth/verify-email         # Verify email
GET    /api/users/auth/sessions             # Get sessions
DELETE /api/users/auth/sessions/:sessionId  # Revoke session

# Admin Operations (user-admin.controller.ts)
PATCH  /api/users/admin/:id/status          # Toggle status
POST   /api/users/admin/bulk-import         # Bulk import
GET    /api/users/admin/statistics          # Statistics
POST   /api/users/admin/:id/reset-password  # Reset password
```

## Navigation to Detailed Sections

For comprehensive logging implementation details, refer to the Audit Logs Plugin and Error Logs Plugin sections above.

## Module Structure Guidelines

## Best Practices

1. **Thin Controllers**: Keep controllers focused on HTTP handling
2. **Rich Services**: Put all business logic in services
3. **Pure Repositories**: Only database queries, no business logic
4. **Schema Validation**: MANDATORY for all routes with official plugins
5. **Test Layers**: Test each layer independently
6. **Share Types**: Use generated types from OpenAPI
7. **Custom Errors**: Throw from services, handle in controllers
8. **Plugin Dependencies**: Always specify plugin dependencies correctly
9. **Auto-loading**: Use @fastify/autoload for module discovery
10. **Official Plugins**: Prefer official @fastify/\* plugins over third-party
11. **Use Knex**: For database operations instead of @fastify/postgres
12. **MANDATORY Schemas**: Every route must have complete schema definition
