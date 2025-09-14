# Activity Logging Plugin Examples

This document provides comprehensive examples of how to use the activity logging middleware system in your Fastify routes.

## Table of Contents

1. [Basic Route Configuration](#basic-route-configuration)
2. [Authentication Routes](#authentication-routes)
3. [Profile Management Routes](#profile-management-routes)
4. [Security-Sensitive Routes](#security-sensitive-routes)
5. [Conditional Logging](#conditional-logging)
6. [Manual Activity Logging](#manual-activity-logging)
7. [Error Logging](#error-logging)
8. [Using Utility Functions](#using-utility-functions)
9. [Advanced Configurations](#advanced-configurations)

## Basic Route Configuration

### Simple Activity Logging

```typescript
// Enable basic activity logging for a route
fastify.post('/api/users', {
  schema: {
    // ... your schema
    activityLog: {
      enabled: true,
      action: 'user_created',
      description: 'New user account created',
    }
  },
  handler: createUserHandler
});
```

### Skip Successful GET Requests

```typescript
// Only log errors for GET requests
fastify.get('/api/data', {
  schema: {
    activityLog: {
      enabled: true,
      skipSuccessfulGets: true, // Only log if status >= 300
    }
  },
  handler: getDataHandler
});
```

## Authentication Routes

### Login Route with Success/Failure Detection

```typescript
fastify.post('/api/auth/login', {
  schema: {
    body: loginRequestSchema,
    response: {
      200: authResponseSchema,
      401: errorSchema,
    },
    activityLog: {
      enabled: true,
      action: 'login_attempt',
      description: 'User attempted to log in',
      severity: 'info',
      includeRequestData: false, // Never log passwords!
      async: false, // Login events should be synchronous
      shouldLog: (request, reply) => true, // Log both success and failure
    },
  },
  handler: loginHandler
});
```

### Registration with Data Sanitization

```typescript
fastify.post('/api/auth/register', {
  schema: {
    activityLog: {
      enabled: true,
      action: 'register',
      description: 'User registered new account',
      includeRequestData: false, // Don't log password
      metadata: {
        registration_source: 'web_app',
      },
    },
  },
  handler: registerHandler
});
```

### Logout Route

```typescript
fastify.post('/api/auth/logout', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      action: 'logout',
      description: 'User logged out',
      async: true, // Can be async
    },
  },
  handler: logoutHandler
});
```

## Profile Management Routes

### Profile Updates

```typescript
fastify.put('/api/profile', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      action: 'profile_update',
      description: 'Profile information updated',
      includeRequestData: true,
      shouldLog: (request, reply) => reply.statusCode < 300, // Only successful updates
    },
  },
  handler: updateProfileHandler
});
```

### Password Changes (High Security)

```typescript
fastify.put('/api/profile/password', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      action: 'password_change',
      description: 'User changed password',
      severity: 'warning', // Security event
      includeRequestData: false, // Never log passwords
      async: false, // Security events should be synchronous
      shouldLog: (request, reply) => reply.statusCode < 300,
    },
  },
  handler: changePasswordHandler
});
```

### Avatar Upload

```typescript
fastify.post('/api/profile/avatar', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      action: 'avatar_upload',
      description: 'Profile avatar uploaded',
      includeRequestData: false, // Don't log file data
      metadata: {
        upload_type: 'avatar',
      },
    },
  },
  handler: uploadAvatarHandler
});
```

## Security-Sensitive Routes

### Administrative Actions

```typescript
fastify.delete('/api/admin/users/:id', {
  preHandler: [fastify.authenticateJWT, fastify.requireRole('admin')],
  schema: {
    activityLog: {
      enabled: true,
      action: 'user_deletion',
      description: 'Admin deleted user account',
      severity: 'critical',
      includeRequestData: true,
      async: false, // Critical events must be synchronous
      metadata: {
        admin_action: true,
        requires_audit: true,
      },
    },
  },
  handler: deleteUserHandler
});
```

### Suspicious Activity Detection

```typescript
fastify.post('/api/sensitive-action', {
  preHandler: [fastify.authenticateJWT, detectSuspiciousActivity],
  schema: {
    activityLog: {
      enabled: true,
      shouldLog: (request, reply) => {
        const isSuspicious = request.suspicious === true;
        return isSuspicious || reply.statusCode >= 400;
      },
      action: 'sensitive_operation',
      severity: 'warning',
    },
  },
  handler: sensitiveActionHandler
});
```

## Conditional Logging

### Time-Based Logging

```typescript
fastify.get('/api/reports', {
  schema: {
    activityLog: {
      enabled: true,
      shouldLog: (request, reply) => {
        const hour = new Date().getHours();
        // Only log during business hours (9 AM - 5 PM)
        return hour >= 9 && hour < 17;
      },
    },
  },
  handler: getReportsHandler
});
```

### User Role-Based Logging

```typescript
fastify.get('/api/data', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      shouldLog: (request, reply) => {
        const user = request.user;
        // Only log for admin users
        return user?.role === 'admin';
      },
      action: 'admin_data_access',
    },
  },
  handler: getDataHandler
});
```

### Response Status-Based Logging

```typescript
fastify.post('/api/process', {
  schema: {
    activityLog: {
      enabled: true,
      shouldLog: (request, reply) => {
        // Only log errors and warnings
        return reply.statusCode >= 400;
      },
      severity: 'error',
    },
  },
  handler: processHandler
});
```

## Manual Activity Logging

### In Route Handlers

```typescript
async function customActionHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Your business logic here
    const result = await performCustomAction(request.body);
    
    // Manual activity logging
    await fastify.logActivity(
      request.user.id,
      'custom_action_completed',
      'User completed custom action successfully',
      request,
      {
        severity: 'info',
        metadata: {
          action_type: 'custom',
          result_count: result.length,
        },
      }
    );
    
    return reply.success(result);
  } catch (error) {
    // Error will be automatically logged by the plugin
    throw error;
  }
}
```

### In Services

```typescript
export class CustomService {
  constructor(private fastify: FastifyInstance) {}
  
  async performSensitiveOperation(userId: string, data: any) {
    try {
      const result = await this.database.sensitiveOperation(data);
      
      // Log the operation
      await this.fastify.logActivity(
        userId,
        'sensitive_operation',
        'Sensitive operation performed',
        undefined, // No request object in service
        {
          severity: 'warning',
          metadata: {
            operation_type: data.type,
            affected_records: result.affectedRows,
          },
        }
      );
      
      return result;
    } catch (error) {
      // Log the error
      await this.fastify.logActivity(
        userId,
        'sensitive_operation_failed',
        `Sensitive operation failed: ${error.message}`,
        undefined,
        { severity: 'error' }
      );
      throw error;
    }
  }
}
```

## Error Logging

### Automatic Error Logging

The plugin automatically logs API errors when `autoLogErrors` is enabled:

```typescript
// Plugin configuration
await fastify.register(activityLoggingPlugin, {
  config: {
    autoLogErrors: true, // Automatically log all 4xx and 5xx responses
  }
});
```

### Custom Error Logging

```typescript
fastify.setErrorHandler(async (error, request, reply) => {
  // Custom error logging with additional context
  if (request.user?.id) {
    await fastify.logActivity(
      request.user.id,
      'api_error',
      `API error: ${error.message}`,
      request,
      {
        severity: 'error',
        metadata: {
          error_code: error.code,
          stack_trace: error.stack,
          endpoint: `${request.method} ${request.url}`,
        },
      }
    );
  }
  
  // Default error handling
  return reply.status(500).send({ error: 'Internal Server Error' });
});
```

## Using Utility Functions

### Pre-configured Activity Types

```typescript
import { ActivityUtils } from '../plugins/activity-logging';

// Authentication routes
fastify.post('/api/auth/login', {
  schema: {
    activityLog: ActivityUtils.loginAttempt(),
  },
  handler: loginHandler
});

// Profile routes
fastify.put('/api/profile', {
  schema: {
    activityLog: ActivityUtils.profileUpdate(),
  },
  handler: updateProfileHandler
});

// Security routes
fastify.put('/api/profile/password', {
  schema: {
    activityLog: ActivityUtils.passwordChange(),
  },
  handler: changePasswordHandler
});
```

### Custom Configurations with Utilities

```typescript
// Merge utility config with custom settings
fastify.post('/api/auth/login', {
  schema: {
    activityLog: {
      ...ActivityUtils.loginAttempt(),
      metadata: {
        login_source: 'mobile_app',
      },
    },
  },
  handler: loginHandler
});
```

### Using the Activity Helper

```typescript
// Using the withActivityLogging helper
const loginRoute = fastify.withActivityLogging(
  ActivityUtils.loginAttempt(),
  {
    method: 'POST',
    url: '/api/auth/login',
    schema: loginSchema,
    handler: loginHandler,
  }
);

fastify.route(loginRoute);
```

## Advanced Configurations

### GDPR Compliance Logging

```typescript
fastify.get('/api/export-data', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: ActivityUtils.dataExport({
      includeRequestData: true,
      metadata: {
        compliance: 'gdpr_export',
        legal_basis: 'user_request',
      },
    }),
  },
  handler: exportUserDataHandler
});

fastify.delete('/api/account', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: ActivityUtils.accountDeletion({
      metadata: {
        compliance: 'gdpr_deletion',
        retention_period: '30_days',
      },
    }),
  },
  handler: deleteAccountHandler
});
```

### Bulk Operations

```typescript
fastify.post('/api/bulk/users', {
  preHandler: [fastify.authenticateJWT, fastify.requireRole('admin')],
  schema: {
    activityLog: ActivityUtils.bulkOperation('user_creation', {
      includeRequestData: true,
      metadata: {
        operation_type: 'bulk_import',
      },
    }),
  },
  handler: bulkCreateUsersHandler
});
```

### Rate Limit Logging

```typescript
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  onExceeding: (request, key) => {
    // Log rate limit hits
    if (request.user?.id) {
      fastify.logActivity(
        request.user.id,
        'rate_limit_hit',
        'Rate limit exceeded',
        request,
        { severity: 'warning' }
      );
    }
  },
});
```

### Custom Metadata Enrichment

```typescript
fastify.post('/api/orders', {
  preHandler: [fastify.authenticateJWT],
  schema: {
    activityLog: {
      enabled: true,
      action: 'order_created',
      includeRequestData: true,
      metadata: {
        // Static metadata
        business_unit: 'ecommerce',
        // Dynamic metadata can be added in the handler
      },
    },
  },
  handler: async (request, reply) => {
    const order = await createOrder(request.body);
    
    // Enrich activity log with order details
    request.activityMetadata = {
      ...request.activityMetadata,
      order_id: order.id,
      order_value: order.total,
      payment_method: order.paymentMethod,
    };
    
    return reply.success(order);
  }
});
```

## Performance Considerations

### Async Logging for High-Traffic Routes

```typescript
// High-traffic route with async logging
fastify.get('/api/products', {
  schema: {
    activityLog: {
      enabled: true,
      async: true, // Don't wait for logging to complete
      skipSuccessfulGets: true, // Reduce log volume
    },
  },
  handler: getProductsHandler
});
```

### Batch Logging Configuration

```typescript
// Configure batching at plugin level for better performance
await fastify.register(activityLoggingPlugin, {
  config: {
    enableBatching: true,
    batchSize: 50,
    batchInterval: 5000, // 5 seconds
  }
});
```

### Selective Logging Based on Load

```typescript
fastify.get('/api/heavy-operation', {
  schema: {
    activityLog: {
      enabled: true,
      shouldLog: (request, reply) => {
        // Only log during low-traffic hours or for errors
        const hour = new Date().getHours();
        const isLowTraffic = hour < 8 || hour > 22;
        const hasError = reply.statusCode >= 400;
        
        return isLowTraffic || hasError;
      },
    },
  },
  handler: heavyOperationHandler
});
```

## Testing Activity Logging

### Manual Flush for Testing

```typescript
// In your tests
afterEach(async () => {
  // Ensure all activity logs are written before test cleanup
  await fastify.flushActivityLogs();
});
```

### Disable Logging in Tests

```typescript
// Test configuration
const testApp = Fastify();
await testApp.register(activityLoggingPlugin, {
  config: {
    enabled: false, // Disable for tests
  }
});
```

This comprehensive guide shows how to implement activity logging across different scenarios in your Fastify application. Remember to balance security, compliance, and performance requirements when configuring activity logging for your specific use cases.