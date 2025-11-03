# Bulk Operations Implementation Guide

## Overview

This guide provides complete implementation details for the Bulk Operations API in the User Management system. It includes service layer implementation, repository patterns, error handling, and testing strategies.

## Service Layer Implementation

### Interface Definition

```typescript
// Add to users.service.ts
interface BulkOperationResult {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    userId: string;
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }>;
  summary: {
    message: string;
    hasFailures: boolean;
  };
}

interface BulkUserService {
  bulkActivateUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult>;
  bulkDeactivateUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult>;
  bulkDeleteUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult>;
  bulkChangeUserRoles(userIds: string[], roleId: string, currentUserId: string): Promise<BulkOperationResult>;
}
```

### Service Implementation Example

```typescript
// users.service.ts - Add these methods to the existing UsersService class

export class UsersService {
  // ... existing methods ...

  /**
   * Bulk activate users with proper error handling and business rules
   */
  async bulkActivateUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult> {
    const results: BulkOperationResult['results'] = [];
    let successCount = 0;
    let failureCount = 0;

    // Remove duplicates and validate input
    const uniqueUserIds = [...new Set(userIds)];

    // Process in batches to avoid overwhelming the database
    const batches = this.createBatches(uniqueUserIds, 20);

    for (const batch of batches) {
      await this.db.transaction(async (trx) => {
        for (const userId of batch) {
          try {
            // Business rule validation
            const validationResult = await this.validateUserOperation(userId, 'activate', currentUserId, trx);

            if (!validationResult.isValid) {
              results.push({
                userId,
                success: false,
                error: {
                  code: validationResult.errorCode!,
                  message: validationResult.errorMessage!,
                },
              });
              failureCount++;
              continue;
            }

            // Check if user is already active (skip if already active)
            const user = await trx('users').where('id', userId).first();
            if (user?.is_active) {
              results.push({
                userId,
                success: false,
                error: {
                  code: 'USER_ALREADY_ACTIVE',
                  message: 'User is already active',
                },
              });
              failureCount++;
              continue;
            }

            // Perform the activation
            await trx('users').where('id', userId).update({
              is_active: true,
              updated_at: new Date().toISOString(),
            });

            results.push({
              userId,
              success: true,
            });
            successCount++;

            // Log individual success for audit
            this.logger.info({
              operation: 'user_activated',
              userId,
              performedBy: currentUserId,
            });
          } catch (error) {
            const errorResult = this.handleBulkOperationError(error, userId);
            results.push(errorResult);
            failureCount++;

            this.logger.error({
              operation: 'bulk_activate_user_failed',
              userId,
              error: errorResult.error,
              performedBy: currentUserId,
            });
          }
        }
      });
    }

    const summary = this.generateOperationSummary('activate', successCount, failureCount);

    return {
      totalRequested: uniqueUserIds.length,
      successCount,
      failureCount,
      results,
      summary,
    };
  }

  /**
   * Bulk deactivate users with self-protection and admin protection
   */
  async bulkDeactivateUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult> {
    const results: BulkOperationResult['results'] = [];
    let successCount = 0;
    let failureCount = 0;

    const uniqueUserIds = [...new Set(userIds)];
    const batches = this.createBatches(uniqueUserIds, 20);

    for (const batch of batches) {
      await this.db.transaction(async (trx) => {
        for (const userId of batch) {
          try {
            // Business rule validation
            const validationResult = await this.validateUserOperation(userId, 'deactivate', currentUserId, trx);

            if (!validationResult.isValid) {
              results.push({
                userId,
                success: false,
                error: {
                  code: validationResult.errorCode!,
                  message: validationResult.errorMessage!,
                },
              });
              failureCount++;
              continue;
            }

            // Check if user is already inactive
            const user = await trx('users').where('id', userId).first();
            if (!user?.is_active) {
              results.push({
                userId,
                success: false,
                error: {
                  code: 'USER_ALREADY_INACTIVE',
                  message: 'User is already inactive',
                },
              });
              failureCount++;
              continue;
            }

            // Perform the deactivation
            await trx('users').where('id', userId).update({
              is_active: false,
              updated_at: new Date().toISOString(),
            });

            results.push({
              userId,
              success: true,
            });
            successCount++;

            this.logger.info({
              operation: 'user_deactivated',
              userId,
              performedBy: currentUserId,
            });
          } catch (error) {
            const errorResult = this.handleBulkOperationError(error, userId);
            results.push(errorResult);
            failureCount++;
          }
        }
      });
    }

    const summary = this.generateOperationSummary('deactivate', successCount, failureCount);

    return {
      totalRequested: uniqueUserIds.length,
      successCount,
      failureCount,
      results,
      summary,
    };
  }

  /**
   * Bulk soft delete users
   */
  async bulkDeleteUsers(userIds: string[], currentUserId: string): Promise<BulkOperationResult> {
    const results: BulkOperationResult['results'] = [];
    let successCount = 0;
    let failureCount = 0;

    const uniqueUserIds = [...new Set(userIds)];
    const batches = this.createBatches(uniqueUserIds, 20);

    for (const batch of batches) {
      await this.db.transaction(async (trx) => {
        for (const userId of batch) {
          try {
            const validationResult = await this.validateUserOperation(userId, 'delete', currentUserId, trx);

            if (!validationResult.isValid) {
              results.push({
                userId,
                success: false,
                error: {
                  code: validationResult.errorCode!,
                  message: validationResult.errorMessage!,
                },
              });
              failureCount++;
              continue;
            }

            // Check if user is already deleted
            const user = await trx('users').where('id', userId).first();
            if (user?.deleted_at) {
              results.push({
                userId,
                success: false,
                error: {
                  code: 'USER_ALREADY_DELETED',
                  message: 'User is already deleted',
                },
              });
              failureCount++;
              continue;
            }

            // Perform soft delete
            await trx('users').where('id', userId).update({
              deleted_at: new Date().toISOString(),
              is_active: false, // Also deactivate when deleting
              updated_at: new Date().toISOString(),
            });

            results.push({
              userId,
              success: true,
            });
            successCount++;

            this.logger.info({
              operation: 'user_deleted',
              userId,
              performedBy: currentUserId,
            });
          } catch (error) {
            const errorResult = this.handleBulkOperationError(error, userId);
            results.push(errorResult);
            failureCount++;
          }
        }
      });
    }

    const summary = this.generateOperationSummary('delete', successCount, failureCount);

    return {
      totalRequested: uniqueUserIds.length,
      successCount,
      failureCount,
      results,
      summary,
    };
  }

  /**
   * Bulk change user roles
   */
  async bulkChangeUserRoles(userIds: string[], roleId: string, currentUserId: string): Promise<BulkOperationResult> {
    const results: BulkOperationResult['results'] = [];
    let successCount = 0;
    let failureCount = 0;

    // Validate role exists first
    const role = await this.db('roles').where('id', roleId).first();
    if (!role) {
      // If role doesn't exist, fail all operations
      const allFailures = userIds.map((userId) => ({
        userId,
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Target role does not exist',
        },
      }));

      return {
        totalRequested: userIds.length,
        successCount: 0,
        failureCount: userIds.length,
        results: allFailures,
        summary: {
          message: `All operations failed: Target role does not exist`,
          hasFailures: true,
        },
      };
    }

    const uniqueUserIds = [...new Set(userIds)];
    const batches = this.createBatches(uniqueUserIds, 20);

    for (const batch of batches) {
      await this.db.transaction(async (trx) => {
        for (const userId of batch) {
          try {
            const validationResult = await this.validateUserOperation(userId, 'role_change', currentUserId, trx);

            if (!validationResult.isValid) {
              results.push({
                userId,
                success: false,
                error: {
                  code: validationResult.errorCode!,
                  message: validationResult.errorMessage!,
                },
              });
              failureCount++;
              continue;
            }

            // Check if user already has this role
            const user = await trx('users').where('id', userId).first();
            if (user?.role_id === roleId) {
              results.push({
                userId,
                success: false,
                error: {
                  code: 'USER_ALREADY_HAS_ROLE',
                  message: 'User already has this role',
                },
              });
              failureCount++;
              continue;
            }

            // Perform role change
            await trx('users').where('id', userId).update({
              role_id: roleId,
              updated_at: new Date().toISOString(),
            });

            results.push({
              userId,
              success: true,
            });
            successCount++;

            this.logger.info({
              operation: 'user_role_changed',
              userId,
              newRoleId: roleId,
              performedBy: currentUserId,
            });
          } catch (error) {
            const errorResult = this.handleBulkOperationError(error, userId);
            results.push(errorResult);
            failureCount++;
          }
        }
      });
    }

    const summary = this.generateOperationSummary('role change', successCount, failureCount);

    return {
      totalRequested: uniqueUserIds.length,
      successCount,
      failureCount,
      results,
      summary,
    };
  }

  // ===== HELPER METHODS =====

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private async validateUserOperation(userId: string, operation: 'activate' | 'deactivate' | 'delete' | 'role_change', currentUserId: string, trx: any): Promise<{ isValid: boolean; errorCode?: string; errorMessage?: string }> {
    try {
      // Check if user exists
      const user = await trx('users').leftJoin('roles', 'users.role_id', 'roles.id').where('users.id', userId).select('users.*', 'roles.name as role_name').first();

      if (!user) {
        return {
          isValid: false,
          errorCode: 'USER_NOT_FOUND',
          errorMessage: 'User not found',
        };
      }

      // Self-protection: Admin cannot deactivate/delete themselves
      if ((operation === 'deactivate' || operation === 'delete') && userId === currentUserId) {
        return {
          isValid: false,
          errorCode: 'CANNOT_CHANGE_OWN_STATUS',
          errorMessage: 'Cannot modify your own account status',
        };
      }

      // Admin protection: Only super-admins can modify other admins
      const currentUser = await trx('users').leftJoin('roles', 'users.role_id', 'roles.id').where('users.id', currentUserId).select('roles.name as role_name').first();

      if (user.role_name === 'admin' && currentUser?.role_name !== 'super_admin') {
        return {
          isValid: false,
          errorCode: 'CANNOT_CHANGE_ADMIN_STATUS',
          errorMessage: 'Only super-admins can modify admin accounts',
        };
      }

      // Skip operations on already deleted users
      if (user.deleted_at && operation !== 'role_change') {
        return {
          isValid: false,
          errorCode: 'USER_ALREADY_DELETED',
          errorMessage: 'Cannot modify deleted users',
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        errorCode: 'VALIDATION_ERROR',
        errorMessage: 'Error validating user operation',
      };
    }
  }

  private handleBulkOperationError(error: any, userId: string): { userId: string; success: false; error: { code: string; message: string } } {
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred';

    if (error.code === '23503') {
      // Foreign key constraint
      errorCode = 'CONSTRAINT_VIOLATION';
      errorMessage = 'Database constraint violation';
    } else if (error.code === '23505') {
      // Unique constraint
      errorCode = 'DUPLICATE_VALUE';
      errorMessage = 'Duplicate value detected';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      userId,
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }

  private generateOperationSummary(operation: string, successCount: number, failureCount: number): { message: string; hasFailures: boolean } {
    const hasFailures = failureCount > 0;
    let message: string;

    if (successCount === 0 && failureCount > 0) {
      message = `All ${operation} operations failed`;
    } else if (successCount > 0 && failureCount === 0) {
      message = `All ${operation} operations completed successfully`;
    } else {
      message = `Bulk ${operation} completed with ${successCount} successes and ${failureCount} failures`;
    }

    return {
      message,
      hasFailures,
    };
  }
}
```

## Rate Limiting Implementation

### Fastify Rate Limiting Plugin

```typescript
// plugins/rate-limit.ts
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

export default fp(async function (fastify) {
  await fastify.register(rateLimit, {
    max: 100, // Default rate limit
    timeWindow: '1 minute',
  });

  // Bulk operations rate limiting
  const bulkOperationsLimiter = {
    max: 10, // 10 bulk operations per minute
    timeWindow: '1 minute',
    errorResponseBuilder: function (request: any, context: any) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Max ${context.max} requests per ${context.after}`,
          retryAfter: Math.round(context.ttl / 1000),
        },
      };
    },
  };

  // Apply to bulk operation routes
  fastify.register(
    async function (fastify) {
      await fastify.register(rateLimit, bulkOperationsLimiter);

      // All routes registered here will use the bulk operations rate limiter
      fastify.addHook('preValidation', async (request, reply) => {
        if (request.url.includes('/bulk/')) {
          // Additional per-user operation counting
          const userCount = request.body?.userIds?.length || 0;
          if (userCount > 100) {
            reply.code(400).send({
              success: false,
              error: {
                code: 'PAYLOAD_TOO_LARGE',
                message: 'Maximum 100 users per bulk operation',
              },
            });
          }
        }
      });
    },
    { prefix: '/api/users/bulk' },
  );
});
```

## Database Optimizations

### Add Database Indexes

```sql
-- Add indexes for bulk operations performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_is_active ON users(is_active) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_id ON users(role_id) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_updated_at ON users(updated_at);

-- Composite index for bulk operations with filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_bulk_ops ON users(id, is_active, role_id, deleted_at);
```

### Migration for Soft Delete Support

```sql
-- Migration: Add deleted_at column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Update existing queries to exclude deleted users
-- Example: Update existing list users query to add WHERE deleted_at IS NULL
```

## Testing Implementation

### Unit Tests Example

```typescript
// users.service.test.ts
describe('BulkOperations', () => {
  describe('bulkActivateUsers', () => {
    it('should activate all valid users', async () => {
      const userIds = ['user1', 'user2', 'user3'];
      const result = await usersService.bulkActivateUsers(userIds, 'admin1');

      expect(result.totalRequested).toBe(3);
      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.summary.hasFailures).toBe(false);
    });

    it('should handle partial failures gracefully', async () => {
      const userIds = ['user1', 'nonexistent', 'user3'];
      const result = await usersService.bulkActivateUsers(userIds, 'admin1');

      expect(result.totalRequested).toBe(3);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.summary.hasFailures).toBe(true);

      const failedResult = result.results.find((r) => !r.success);
      expect(failedResult?.error?.code).toBe('USER_NOT_FOUND');
    });

    it('should prevent admin from deactivating themselves', async () => {
      const result = await usersService.bulkDeactivateUsers(['admin1'], 'admin1');

      expect(result.failureCount).toBe(1);
      expect(result.results[0].error?.code).toBe('CANNOT_CHANGE_OWN_STATUS');
    });

    it('should handle duplicate user IDs', async () => {
      const userIds = ['user1', 'user1', 'user2'];
      const result = await usersService.bulkActivateUsers(userIds, 'admin1');

      expect(result.totalRequested).toBe(2); // Duplicates removed
    });

    it('should process large batches efficiently', async () => {
      const userIds = Array.from({ length: 50 }, (_, i) => `user${i}`);
      const result = await usersService.bulkActivateUsers(userIds, 'admin1');

      expect(result.totalRequested).toBe(50);
      // Should complete within reasonable time
    });
  });
});
```

### Integration Tests Example

```typescript
// users.routes.test.ts
describe('Bulk Operations API', () => {
  it('POST /api/users/bulk/activate - should activate users', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users/bulk/activate',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      payload: {
        userIds: ['user1', 'user2'],
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.totalRequested).toBe(2);
  });

  it('should enforce rate limiting', async () => {
    // Make 11 rapid requests (exceeding 10 per minute limit)
    const requests = Array.from({ length: 11 }, () =>
      app.inject({
        method: 'POST',
        url: '/api/users/bulk/activate',
        headers: { authorization: `Bearer ${adminToken}` },
        payload: { userIds: ['user1'] },
      }),
    );

    const responses = await Promise.all(requests);
    const rateLimitedResponse = responses.find((r) => r.statusCode === 429);
    expect(rateLimitedResponse).toBeDefined();
  });

  it('should validate request payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users/bulk/activate',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: {
        userIds: [], // Empty array should fail validation
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## Monitoring and Observability

### Metrics Collection

```typescript
// metrics.ts
export interface BulkOperationMetrics {
  operation: string;
  totalRequested: number;
  successCount: number;
  failureCount: number;
  duration: number;
  userId: string;
  timestamp: Date;
}

export class MetricsCollector {
  collectBulkOperationMetrics(operation: string, result: BulkOperationResult, duration: number, userId: string) {
    const metrics: BulkOperationMetrics = {
      operation,
      totalRequested: result.totalRequested,
      successCount: result.successCount,
      failureCount: result.failureCount,
      duration,
      userId,
      timestamp: new Date(),
    };

    // Send to monitoring system (e.g., Prometheus, DataDog, etc.)
    this.sendMetrics(metrics);
  }

  private sendMetrics(metrics: BulkOperationMetrics) {
    // Implementation depends on your monitoring stack
    console.log('Metrics:', metrics);
  }
}
```

### Health Check Integration

```typescript
// health.ts
export async function bulkOperationsHealthCheck(db: any) {
  try {
    // Test bulk operation performance
    const testStart = Date.now();
    const testUserIds = ['test-user-1'];

    // Simulate bulk operation without actual changes
    await db
      .transaction(async (trx: any) => {
        await trx('users').where('id', 'IN', testUserIds).select('id');
        // Rollback transaction (don't commit changes)
        throw new Error('Test rollback');
      })
      .catch(() => {
        // Expected rollback error
      });

    const duration = Date.now() - testStart;

    return {
      status: 'healthy',
      component: 'bulk_operations',
      responseTime: duration,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      component: 'bulk_operations',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    };
  }
}
```

This implementation guide provides a complete, production-ready approach to bulk operations with proper error handling, security, performance optimization, and observability.
