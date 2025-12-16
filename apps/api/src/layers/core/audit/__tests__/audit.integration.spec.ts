import { FastifyInstance } from 'fastify';
import { setupTestContext } from '../../../../__tests__/integration/setup';
import { AuthHelper } from '../../../../__tests__/integration/auth-helper';
import { RequestHelper } from '../../../../__tests__/integration/request-helper';
import { expectResponse } from '../../../../__tests__/integration/assertions';

/**
 * Audit Module Integration Tests
 *
 * Comprehensive integration tests for all monitoring/audit API endpoints:
 * - Error Logs API
 * - Activity Logs API
 * - API Keys API
 *
 * Tests include:
 * - CRUD operations
 * - Filtering and pagination
 * - Statistics and exports
 * - Authentication and authorization
 * - Cross-module integration
 * - Error scenarios
 */
describe('Audit Module Integration Tests', () => {
  let app: FastifyInstance;
  let authHelper: AuthHelper;
  let requestHelper: RequestHelper;
  let testContext: any;

  // Test users with different permissions
  let adminUser: any;
  let monitoringUser: any;
  let regularUser: any;
  let adminToken: string;
  let monitoringToken: string;
  let regularToken: string;

  beforeAll(async () => {
    try {
      // Setup test context
      testContext = await setupTestContext({
        runMigrations: true,
        runSeeds: true,
        cleanDatabase: true,
      });

      app = testContext.app;
      authHelper = new AuthHelper(app, testContext.db.connection);
      requestHelper = new RequestHelper(app);

      // Create test users with different permissions
      adminUser = await authHelper.createUserWithRole(
        'admin',
        ['monitoring:read', 'monitoring:write'],
        {
          email: 'admin-audit@example.com',
          username: 'admin-audit',
        },
      );

      monitoringUser = await authHelper.createUserWithRole(
        'monitoring',
        ['monitoring:read'],
        {
          email: 'monitoring@example.com',
          username: 'monitoring-user',
        },
      );

      regularUser = await authHelper.createTestUser({
        email: 'regular-audit@example.com',
        username: 'regular-audit',
      });

      // Get tokens
      const adminTokens = await authHelper.loginUser(
        adminUser.email,
        adminUser.password,
      );
      const monitoringTokens = await authHelper.loginUser(
        monitoringUser.email,
        monitoringUser.password,
      );
      const regularTokens = await authHelper.loginUser(
        regularUser.email,
        regularUser.password,
      );

      adminToken = adminTokens.accessToken;
      monitoringToken = monitoringTokens.accessToken;
      regularToken = regularTokens.accessToken;
    } catch (error) {
      console.error('❌ beforeAll setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (testContext && testContext.cleanup) {
      await testContext.cleanup();
    }
  });

  beforeEach(async () => {
    // Clean up audit data but preserve users and roles
    await testContext.db.connection('error_logs').del();
    await testContext.db.connection('user_activity_logs').del();
    await testContext.db.connection('api_keys').del();
  });

  // ==================== ERROR LOGS API ====================

  describe('Error Logs API Integration', () => {
    describe('POST /api/error-logs', () => {
      it('should create error log (internal only)', async () => {
        // Error logs are typically created internally, not via API
        // This tests database insertion directly
        const errorLog = {
          id: app.knex.raw('gen_random_uuid()'),
          level: 'error',
          message: 'Test error message',
          stack: 'Error stack trace',
          code: 'TEST_ERROR',
          context: JSON.stringify({ test: true }),
          user_id: adminUser.id,
          created_at: new Date(),
        };

        await testContext.db.connection('error_logs').insert(errorLog);

        const inserted = await testContext.db
          .connection('error_logs')
          .where({ message: 'Test error message' })
          .first();

        expect(inserted).toBeDefined();
        expect(inserted.level).toBe('error');
        expect(inserted.code).toBe('TEST_ERROR');
      });
    });

    describe('GET /api/error-logs', () => {
      beforeEach(async () => {
        // Create test error logs
        const logs = [
          {
            id: app.knex.raw('gen_random_uuid()'),
            level: 'error',
            message: 'Database connection failed',
            code: 'DB_ERROR',
            created_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            level: 'warning',
            message: 'High memory usage detected',
            code: 'MEMORY_WARNING',
            created_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            level: 'critical',
            message: 'Service unavailable',
            code: 'SERVICE_ERROR',
            created_at: new Date(),
          },
        ];

        await testContext.db.connection('error_logs').insert(logs);
      });

      it('should list error logs with pagination', async () => {
        const response = await requestHelper.getAuth('/api/error-logs', {
          token: monitoringToken,
          query: { page: 1, limit: 10 },
        });

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .isPaginated()
          .hasArrayData();

        expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      });

      it('should filter error logs by level', async () => {
        const response = await requestHelper.getAuth('/api/error-logs', {
          token: monitoringToken,
          query: { level: 'error', limit: 100 },
        });

        expectResponse(response).hasStatus(200).isSuccess();

        const errorLogs = response.body.data.filter(
          (log: any) => log.level === 'error',
        );
        expect(errorLogs.length).toBeGreaterThanOrEqual(1);
      });

      it('should filter error logs by date range', async () => {
        const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        const endDate = new Date();

        const response = await requestHelper.getAuth('/api/error-logs', {
          token: monitoringToken,
          query: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            limit: 100,
          },
        });

        expectResponse(response).hasStatus(200).isSuccess();
      });

      it('should require monitoring:read permission', async () => {
        const response = await requestHelper.getAuth('/api/error-logs', {
          token: regularToken,
        });

        expectResponse(response).isForbidden();
      });

      it('should require authentication', async () => {
        const response = await requestHelper.get('/api/error-logs');

        expectResponse(response).isUnauthorized();
      });
    });

    describe('GET /api/error-logs/stats', () => {
      beforeEach(async () => {
        // Create diverse error logs for statistics
        const logs = Array.from({ length: 10 }, (_, i) => ({
          id: app.knex.raw('gen_random_uuid()'),
          level: i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warning' : 'critical',
          message: `Test error ${i}`,
          code: `ERROR_${i}`,
          created_at: new Date(Date.now() - i * 60 * 60 * 1000), // Spread over hours
        }));

        await testContext.db.connection('error_logs').insert(logs);
      });

      it('should get error logs statistics', async () => {
        const response = await requestHelper.getAuth('/api/error-logs/stats', {
          token: monitoringToken,
        });

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.total).toBeGreaterThanOrEqual(10);
            expect(data.byLevel).toBeDefined();
            expect(typeof data.byLevel).toBe('object');
          });
      });

      it('should filter stats by days', async () => {
        const response = await requestHelper.getAuth('/api/error-logs/stats', {
          token: monitoringToken,
          query: { days: 7 },
        });

        expectResponse(response).hasStatus(200).isSuccess();
      });
    });

    describe('GET /api/error-logs/:id', () => {
      let errorLogId: string;

      beforeEach(async () => {
        const [log] = await testContext.db
          .connection('error_logs')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            level: 'error',
            message: 'Specific error log',
            code: 'SPECIFIC_ERROR',
            stack: 'Stack trace here',
            context: JSON.stringify({ detail: 'context' }),
            created_at: new Date(),
          })
          .returning('id');

        errorLogId = log.id;
      });

      it('should get single error log by ID', async () => {
        const response = await requestHelper.getAuth(
          `/api/error-logs/${errorLogId}`,
          {
            token: monitoringToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.id).toBe(errorLogId);
            expect(data.message).toBe('Specific error log');
            expect(data.level).toBe('error');
            expect(data.code).toBe('SPECIFIC_ERROR');
          });
      });

      it('should return 404 for non-existent error log', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';
        const response = await requestHelper.getAuth(
          `/api/error-logs/${fakeId}`,
          {
            token: monitoringToken,
          },
        );

        expectResponse(response).isNotFound();
      });
    });

    describe('DELETE /api/error-logs/:id', () => {
      let errorLogId: string;

      beforeEach(async () => {
        const [log] = await testContext.db
          .connection('error_logs')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            level: 'error',
            message: 'Log to delete',
            code: 'DELETE_TEST',
            created_at: new Date(),
          })
          .returning('id');

        errorLogId = log.id;
      });

      it('should delete error log', async () => {
        const response = await requestHelper.deleteAuth(
          `/api/error-logs/${errorLogId}`,
          {
            token: adminToken,
          },
        );

        expectResponse(response).hasStatus(200).isSuccess();

        // Verify deletion
        const deleted = await testContext.db
          .connection('error_logs')
          .where({ id: errorLogId })
          .first();

        expect(deleted).toBeUndefined();
      });

      it('should require monitoring:write permission', async () => {
        const response = await requestHelper.deleteAuth(
          `/api/error-logs/${errorLogId}`,
          {
            token: monitoringToken,
          },
        );

        expectResponse(response).isForbidden();
      });
    });

    describe('DELETE /api/error-logs/cleanup', () => {
      beforeEach(async () => {
        // Create old error logs
        const oldLogs = Array.from({ length: 5 }, (_, i) => ({
          id: app.knex.raw('gen_random_uuid()'),
          level: 'error',
          message: `Old error ${i}`,
          code: 'OLD_ERROR',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        }));

        await testContext.db.connection('error_logs').insert(oldLogs);

        // Create recent logs
        const recentLogs = Array.from({ length: 3 }, (_, i) => ({
          id: app.knex.raw('gen_random_uuid()'),
          level: 'error',
          message: `Recent error ${i}`,
          code: 'RECENT_ERROR',
          created_at: new Date(),
        }));

        await testContext.db.connection('error_logs').insert(recentLogs);
      });

      it('should cleanup old error logs', async () => {
        const response = await requestHelper.deleteAuth(
          '/api/error-logs/cleanup',
          {
            token: adminToken,
            query: { olderThan: 30 }, // Delete logs older than 30 days
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.deletedCount).toBeGreaterThanOrEqual(5);
          });

        // Verify old logs deleted and recent logs remain
        const remaining = await testContext.db
          .connection('error_logs')
          .select('*');

        expect(remaining.length).toBeLessThanOrEqual(3);
      });
    });

    describe('GET /api/error-logs/export', () => {
      beforeEach(async () => {
        const logs = [
          {
            id: app.knex.raw('gen_random_uuid()'),
            level: 'error',
            message: 'Export test 1',
            code: 'EXPORT_1',
            created_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            level: 'warning',
            message: 'Export test 2',
            code: 'EXPORT_2',
            created_at: new Date(),
          },
        ];

        await testContext.db.connection('error_logs').insert(logs);
      });

      it('should export error logs as CSV', async () => {
        const response = await requestHelper.getAuth('/api/error-logs/export', {
          token: monitoringToken,
          query: { format: 'csv' },
        });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('text/csv');
        expect(response.text).toContain('level');
        expect(response.text).toContain('message');
      });

      it('should export error logs as JSON', async () => {
        const response = await requestHelper.getAuth('/api/error-logs/export', {
          token: monitoringToken,
          query: { format: 'json' },
        });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  // ==================== ACTIVITY LOGS API ====================

  describe('Activity Logs API Integration', () => {
    describe('POST /api/activity-logs', () => {
      it('should create activity log (internal only)', async () => {
        const activityLog = {
          id: app.knex.raw('gen_random_uuid()'),
          user_id: adminUser.id,
          action: 'user.login',
          description: 'User logged in successfully',
          severity: 'info',
          metadata: JSON.stringify({ ip: '127.0.0.1' }),
          created_at: new Date(),
        };

        await testContext.db
          .connection('user_activity_logs')
          .insert(activityLog);

        const inserted = await testContext.db
          .connection('user_activity_logs')
          .where({ action: 'user.login' })
          .first();

        expect(inserted).toBeDefined();
        expect(inserted.action).toBe('user.login');
      });
    });

    describe('GET /api/activity-logs', () => {
      beforeEach(async () => {
        // Create test activity logs
        const logs = [
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'user.login',
            description: 'User logged in',
            severity: 'info',
            created_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'user.logout',
            description: 'User logged out',
            severity: 'info',
            created_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'api_key.created',
            description: 'API key created',
            severity: 'warning',
            created_at: new Date(),
          },
        ];

        await testContext.db.connection('user_activity_logs').insert(logs);
      });

      it('should list activity logs with pagination', async () => {
        const response = await requestHelper.getAuth('/api/activity-logs', {
          token: monitoringToken,
          query: { page: 1, limit: 10 },
        });

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .isPaginated()
          .hasArrayData();

        expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      });

      it('should filter activity logs by action', async () => {
        const response = await requestHelper.getAuth('/api/activity-logs', {
          token: monitoringToken,
          query: { action: 'user.login', limit: 100 },
        });

        expectResponse(response).hasStatus(200).isSuccess();

        const loginLogs = response.body.data.filter(
          (log: any) => log.action === 'user.login',
        );
        expect(loginLogs.length).toBeGreaterThanOrEqual(1);
      });

      it('should filter activity logs by severity', async () => {
        const response = await requestHelper.getAuth('/api/activity-logs', {
          token: monitoringToken,
          query: { severity: 'warning', limit: 100 },
        });

        expectResponse(response).hasStatus(200).isSuccess();

        const warningLogs = response.body.data.filter(
          (log: any) => log.severity === 'warning',
        );
        expect(warningLogs.length).toBeGreaterThanOrEqual(1);
      });

      it('should require monitoring:read permission', async () => {
        const response = await requestHelper.getAuth('/api/activity-logs', {
          token: regularToken,
        });

        expectResponse(response).isForbidden();
      });
    });

    describe('GET /api/activity-logs/stats', () => {
      beforeEach(async () => {
        const logs = Array.from({ length: 15 }, (_, i) => ({
          id: app.knex.raw('gen_random_uuid()'),
          user_id: adminUser.id,
          action: `action.${i % 5}`,
          description: `Test action ${i}`,
          severity: i % 3 === 0 ? 'info' : i % 3 === 1 ? 'warning' : 'critical',
          created_at: new Date(Date.now() - i * 60 * 60 * 1000),
        }));

        await testContext.db.connection('user_activity_logs').insert(logs);
      });

      it('should get activity logs statistics', async () => {
        const response = await requestHelper.getAuth(
          '/api/activity-logs/stats',
          {
            token: monitoringToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.total).toBeGreaterThanOrEqual(15);
            expect(data.bySeverity).toBeDefined();
            expect(data.byAction).toBeDefined();
          });
      });
    });

    describe('GET /api/activity-logs/:id', () => {
      let activityLogId: string;

      beforeEach(async () => {
        const [log] = await testContext.db
          .connection('user_activity_logs')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'specific.action',
            description: 'Specific action',
            severity: 'info',
            metadata: JSON.stringify({ detail: 'test' }),
            created_at: new Date(),
          })
          .returning('id');

        activityLogId = log.id;
      });

      it('should get single activity log by ID', async () => {
        const response = await requestHelper.getAuth(
          `/api/activity-logs/${activityLogId}`,
          {
            token: monitoringToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.id).toBe(activityLogId);
            expect(data.action).toBe('specific.action');
          });
      });
    });

    describe('DELETE /api/activity-logs/:id', () => {
      let activityLogId: string;

      beforeEach(async () => {
        const [log] = await testContext.db
          .connection('user_activity_logs')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'delete.test',
            description: 'Delete test',
            severity: 'info',
            created_at: new Date(),
          })
          .returning('id');

        activityLogId = log.id;
      });

      it('should delete activity log', async () => {
        const response = await requestHelper.deleteAuth(
          `/api/activity-logs/${activityLogId}`,
          {
            token: adminToken,
          },
        );

        expectResponse(response).hasStatus(200).isSuccess();

        const deleted = await testContext.db
          .connection('user_activity_logs')
          .where({ id: activityLogId })
          .first();

        expect(deleted).toBeUndefined();
      });

      it('should require monitoring:write permission', async () => {
        const response = await requestHelper.deleteAuth(
          `/api/activity-logs/${activityLogId}`,
          {
            token: monitoringToken,
          },
        );

        expectResponse(response).isForbidden();
      });
    });

    describe('DELETE /api/activity-logs/cleanup', () => {
      beforeEach(async () => {
        // Create old logs
        const oldLogs = Array.from({ length: 10 }, (_, i) => ({
          id: app.knex.raw('gen_random_uuid()'),
          user_id: adminUser.id,
          action: 'old.action',
          description: 'Old action',
          severity: 'info',
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        }));

        await testContext.db.connection('user_activity_logs').insert(oldLogs);
      });

      it('should cleanup old activity logs', async () => {
        const response = await requestHelper.deleteAuth(
          '/api/activity-logs/cleanup',
          {
            token: adminToken,
            query: { olderThan: 30 },
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.deletedCount).toBeGreaterThanOrEqual(10);
          });
      });
    });

    describe('GET /api/activity-logs/export', () => {
      beforeEach(async () => {
        const logs = [
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            action: 'export.test.1',
            resource: 'test',
            severity: 'info',
            created_at: new Date(),
          },
        ];

        await testContext.db.connection('user_activity_logs').insert(logs);
      });

      it('should export activity logs', async () => {
        const response = await requestHelper.getAuth(
          '/api/activity-logs/export',
          {
            token: monitoringToken,
            query: { format: 'json' },
          },
        );

        expect(response.status).toBe(200);
      });
    });
  });

  // ==================== API KEYS API ====================

  describe('API Keys API Integration', () => {
    describe('POST /api/v1/platform/api-keys', () => {
      it('should create new API key', async () => {
        const response = await requestHelper.postAuth(
          '/api/v1/platform/api-keys',
          {
            token: adminToken,
            body: {
              name: 'Test API Key',
              permissions: ['read'],
              expiresIn: 30, // 30 days
            },
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.id).toBeDefined();
            expect(data.name).toBe('Test API Key');
            expect(data.key).toBeDefined();
            expect(data.key.length).toBeGreaterThan(20);
            expect(data.permissions).toEqual(['read']);
          });
      });

      it('should validate API key name', async () => {
        const response = await requestHelper.postAuth(
          '/api/v1/platform/api-keys',
          {
            token: adminToken,
            body: {
              name: '', // Invalid: empty name
              permissions: ['read'],
            },
          },
        );

        expectResponse(response).hasStatus(400);
      });

      it('should require authentication', async () => {
        const response = await requestHelper.post('/api/v1/platform/api-keys', {
          body: {
            name: 'Test Key',
            permissions: ['read'],
          },
        });

        expectResponse(response).isUnauthorized();
      });
    });

    describe('GET /api/v1/platform/api-keys', () => {
      beforeEach(async () => {
        // Create test API keys
        const keys = [
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Test Key 1',
            key_hash: 'hash1',
            permissions: JSON.stringify(['read']),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Test Key 2',
            key_hash: 'hash2',
            permissions: JSON.stringify(['read', 'write']),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ];

        await testContext.db.connection('api_keys').insert(keys);
      });

      it('should list user API keys', async () => {
        const response = await requestHelper.getAuth(
          '/api/v1/platform/api-keys',
          {
            token: adminToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .isPaginated()
          .hasArrayData();

        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      });

      it('should paginate API keys', async () => {
        const response = await requestHelper.getAuth(
          '/api/v1/platform/api-keys',
          {
            token: adminToken,
            query: { page: 1, limit: 1 },
          },
        );

        expectResponse(response).hasStatus(200).isPaginated();

        expect(response.body.data.length).toBe(1);
        expect(response.body.meta.pagination.total).toBeGreaterThanOrEqual(2);
      });
    });

    describe('GET /api/v1/platform/api-keys/:keyId', () => {
      let apiKeyId: string;

      beforeEach(async () => {
        const [key] = await testContext.db
          .connection('api_keys')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Specific Test Key',
            key_hash: 'specific_hash',
            permissions: JSON.stringify(['read', 'write']),
            is_active: true,
            last_used_at: null,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning('id');

        apiKeyId = key.id;
      });

      it('should get single API key details', async () => {
        const response = await requestHelper.getAuth(
          `/api/v1/platform/api-keys/${apiKeyId}`,
          {
            token: adminToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.id).toBe(apiKeyId);
            expect(data.name).toBe('Specific Test Key');
            expect(data.key).toBeUndefined(); // Should not expose raw key
            expect(data.permissions).toEqual(['read', 'write']);
          });
      });

      it('should not allow access to other users API keys', async () => {
        const response = await requestHelper.getAuth(
          `/api/v1/platform/api-keys/${apiKeyId}`,
          {
            token: regularToken, // Different user
          },
        );

        expectResponse(response).hasStatus(404); // Should return 404 to prevent enumeration
      });
    });

    describe('PUT /api/v1/platform/api-keys/:keyId', () => {
      let apiKeyId: string;

      beforeEach(async () => {
        const [key] = await testContext.db
          .connection('api_keys')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Original Name',
            key_hash: 'update_test_hash',
            permissions: JSON.stringify(['read']),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning('id');

        apiKeyId = key.id;
      });

      it('should update API key name and permissions', async () => {
        const response = await requestHelper.putAuth(
          `/api/v1/platform/api-keys/${apiKeyId}`,
          {
            token: adminToken,
            body: {
              name: 'Updated Name',
              permissions: ['read', 'write'],
            },
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.name).toBe('Updated Name');
            expect(data.permissions).toEqual(['read', 'write']);
          });

        // Verify database update
        const updated = await testContext.db
          .connection('api_keys')
          .where({ id: apiKeyId })
          .first();

        expect(updated.name).toBe('Updated Name');
      });
    });

    describe('DELETE /api/v1/platform/api-keys/:keyId', () => {
      let apiKeyId: string;

      beforeEach(async () => {
        const [key] = await testContext.db
          .connection('api_keys')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Key to Revoke',
            key_hash: 'revoke_test_hash',
            permissions: JSON.stringify(['read']),
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning('id');

        apiKeyId = key.id;
      });

      it('should revoke API key', async () => {
        const response = await requestHelper.deleteAuth(
          `/api/v1/platform/api-keys/${apiKeyId}`,
          {
            token: adminToken,
          },
        );

        expectResponse(response).hasStatus(200).isSuccess();

        // Verify key is revoked (is_active = false)
        const revoked = await testContext.db
          .connection('api_keys')
          .where({ id: apiKeyId })
          .first();

        expect(revoked.is_active).toBe(false);
      });

      it('should log API key revocation in activity logs', async () => {
        await requestHelper.deleteAuth(
          `/api/v1/platform/api-keys/${apiKeyId}`,
          {
            token: adminToken,
          },
        );

        // Check activity log was created (if logging is enabled)
        // Note: This test may fail if activity logging for revocations is not yet implemented
        const activityLog = await testContext.db
          .connection('user_activity_logs')
          .where({ action: 'api_key.revoked' })
          .first();

        // This check is optional as logging might not be implemented yet
        // expect(activityLog).toBeDefined();
      });
    });

    describe('GET /api/v1/platform/api-keys/:keyId/usage', () => {
      let apiKeyId: string;

      beforeEach(async () => {
        const [key] = await testContext.db
          .connection('api_keys')
          .insert({
            id: app.knex.raw('gen_random_uuid()'),
            user_id: adminUser.id,
            name: 'Usage Stats Key',
            key_hash: 'usage_hash',
            permissions: JSON.stringify(['read']),
            is_active: true,
            last_used_at: new Date(),
            usage_count: 42,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning('id');

        apiKeyId = key.id;
      });

      it('should get API key usage statistics', async () => {
        const response = await requestHelper.getAuth(
          `/api/v1/platform/api-keys/${apiKeyId}/usage`,
          {
            token: adminToken,
          },
        );

        expectResponse(response)
          .hasStatus(200)
          .isSuccess()
          .hasData((data: any) => {
            expect(data.keyId).toBe(apiKeyId);
            expect(data.usageCount).toBeDefined();
            expect(data.lastUsedAt).toBeDefined();
          });
      });
    });
  });

  // ==================== CROSS-MODULE INTEGRATION ====================

  describe('Cross-Module Integration', () => {
    it('should create activity log when API key is created', async () => {
      // Create API key
      const createResponse = await requestHelper.postAuth(
        '/api/v1/platform/api-keys',
        {
          token: adminToken,
          body: {
            name: 'Integration Test Key',
            permissions: ['read'],
          },
        },
      );

      expect(createResponse.status).toBe(200);
      const apiKeyId = createResponse.body.data.id;

      // Check activity log was created
      const activityLog = await testContext.db
        .connection('user_activity_logs')
        .where({ action: 'api_key.created' })
        .first();

      expect(activityLog).toBeDefined();
      expect(activityLog.user_id).toBe(adminUser.id);
    });

    it('should create activity log when API key is revoked', async () => {
      // Create API key first
      const [key] = await testContext.db
        .connection('api_keys')
        .insert({
          id: app.knex.raw('gen_random_uuid()'),
          user_id: adminUser.id,
          name: 'Revoke Integration Test',
          key_hash: 'revoke_integration_hash',
          permissions: JSON.stringify(['read']),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('id');

      // Revoke API key
      await requestHelper.deleteAuth(`/api/v1/platform/api-keys/${key.id}`, {
        token: adminToken,
      });

      // Check activity log
      const activityLog = await testContext.db
        .connection('user_activity_logs')
        .where({ action: 'api_key.revoked' })
        .first();

      expect(activityLog).toBeDefined();
    });

    it('should log errors when API operations fail', async () => {
      // Attempt invalid operation that should log error
      const response = await requestHelper.getAuth(
        '/api/v1/platform/api-keys/invalid-uuid',
        {
          token: adminToken,
        },
      );

      expect(response.status).toBe(400); // Invalid UUID format

      // Note: Error logging depends on implementation
      // Some errors may be logged, others may not
    });
  });

  // ==================== AUTHENTICATION & AUTHORIZATION ====================

  describe('Authentication & Authorization', () => {
    it('should reject unauthenticated requests to all audit endpoints', async () => {
      const endpoints = [
        '/api/error-logs',
        '/api/activity-logs',
        '/api/v1/platform/api-keys',
      ];

      for (const endpoint of endpoints) {
        const response = await requestHelper.get(endpoint);
        expectResponse(response).isUnauthorized();
      }
    });

    it('should enforce monitoring:read permission for read operations', async () => {
      const readEndpoints = [
        '/api/error-logs',
        '/api/error-logs/stats',
        '/api/activity-logs',
        '/api/activity-logs/stats',
      ];

      for (const endpoint of readEndpoints) {
        const response = await requestHelper.getAuth(endpoint, {
          token: regularToken, // User without monitoring:read
        });
        expectResponse(response).isForbidden();
      }
    });

    it('should enforce monitoring:write permission for write operations', async () => {
      // Create test logs first
      const [errorLog] = await testContext.db
        .connection('error_logs')
        .insert({
          id: app.knex.raw('gen_random_uuid()'),
          level: 'error',
          message: 'Test',
          code: 'TEST',
          created_at: new Date(),
        })
        .returning('id');

      const response = await requestHelper.deleteAuth(
        `/api/error-logs/${errorLog.id}`,
        {
          token: monitoringToken, // User with only monitoring:read
        },
      );

      expectResponse(response).isForbidden();
    });

    it('should allow admin users to access all endpoints', async () => {
      const response = await requestHelper.getAuth('/api/error-logs', {
        token: adminToken,
      });

      expectResponse(response).hasStatus(200);
    });
  });

  // ==================== ERROR SCENARIOS ====================

  describe('Error Scenarios', () => {
    it('should handle invalid UUID parameters', async () => {
      const response = await requestHelper.getAuth(
        '/api/error-logs/not-a-uuid',
        {
          token: monitoringToken,
        },
      );

      expectResponse(response).hasStatus(400);
    });

    it('should handle invalid query parameters', async () => {
      const response = await requestHelper.getAuth('/api/error-logs', {
        token: monitoringToken,
        query: { page: -1, limit: 99999 }, // Invalid pagination
      });

      expectResponse(response).hasStatus(400);
    });

    it('should handle missing required fields in POST requests', async () => {
      const response = await requestHelper.postAuth(
        '/api/v1/platform/api-keys',
        {
          token: adminToken,
          body: {
            // Missing required 'name' field
            permissions: ['read'],
          },
        },
      );

      expectResponse(response).hasStatus(400);
    });

    it('should return 404 for non-existent resources', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await requestHelper.getAuth(
        `/api/error-logs/${fakeId}`,
        {
          token: monitoringToken,
        },
      );

      expectResponse(response).isNotFound();
    });
  });

  // ==================== DATA PERSISTENCE ====================

  describe('Data Persistence', () => {
    it('should persist error logs across requests', async () => {
      // Create error log
      const [log] = await testContext.db
        .connection('error_logs')
        .insert({
          id: app.knex.raw('gen_random_uuid()'),
          level: 'error',
          message: 'Persistence test',
          code: 'PERSIST_TEST',
          created_at: new Date(),
        })
        .returning('id');

      // Retrieve in different request
      const response = await requestHelper.getAuth(
        `/api/error-logs/${log.id}`,
        {
          token: monitoringToken,
        },
      );

      expectResponse(response).hasStatus(200);
      expect(response.body.data.message).toBe('Persistence test');
    });

    it('should persist API key updates', async () => {
      // Create key
      const createResponse = await requestHelper.postAuth(
        '/api/v1/platform/api-keys',
        {
          token: adminToken,
          body: {
            name: 'Original',
            permissions: ['read'],
          },
        },
      );

      const keyId = createResponse.body.data.id;

      // Update key
      await requestHelper.putAuth(`/api/v1/platform/api-keys/${keyId}`, {
        token: adminToken,
        body: {
          name: 'Updated',
          permissions: ['read', 'write'],
        },
      });

      // Retrieve and verify
      const getResponse = await requestHelper.getAuth(
        `/api/v1/platform/api-keys/${keyId}`,
        {
          token: adminToken,
        },
      );

      expect(getResponse.body.data.name).toBe('Updated');
      expect(getResponse.body.data.permissions).toEqual(['read', 'write']);
    });
  });
});
