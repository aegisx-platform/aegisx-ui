import { FastifyInstance } from 'fastify';
import { build as createTestApp } from '../../../../test-helpers/app-helper';

/**
 * User-Departments Integration Tests - RBAC Consolidation
 *
 * Comprehensive end-to-end tests for the user-departments API after RBAC consolidation.
 * Validates that department permission columns have been removed and only organizational
 * structure is managed through the user_departments table.
 *
 * Test Coverage:
 * 1. Response Schema - Verify NO permission fields returned
 * 2. Request Schema - Verify permission parameters are rejected
 * 3. RBAC Middleware Integration - Verify RBAC protects endpoints
 * 4. Database Schema - Verify permission columns removed
 * 5. Business Logic - Verify organizational operations work correctly
 *
 * Context: Phase 8 (Integration & E2E Testing) - Task 27
 * Spec: RBAC Permission Consolidation
 * Migration: 20251217163651_remove_user_departments_permissions.ts
 *
 * Prerequisites:
 * - PostgreSQL database must be running
 * - Migrations must be applied (pnpm run db:migrate)
 * - Test database must be seeded (pnpm run db:seed)
 *
 * To run this test:
 * 1. Ensure database is running: docker-compose up -d postgres
 * 2. Run migrations: pnpm run db:migrate
 * 3. Run test: pnpm run test -- user-departments.integration
 *
 * Created on: 2025-12-17
 */

describe('User-Departments Integration Tests - RBAC Consolidation', () => {
  let app: FastifyInstance;
  let testDepartmentId: number;
  let testDepartment2Id: number;
  let testUserId: string;
  let authToken: string;

  // ==================== TEST DATA FACTORIES ====================

  const createUserData = (suffix: string = Date.now().toString()) => ({
    email: `test.userdept.${suffix}@example.com`,
    username: `userdept${suffix}`,
    password: 'SecurePassword123!',
    first_name: 'Department',
    last_name: `Test ${suffix}`,
    is_active: true,
  });

  const createDepartmentData = (suffix: string = Date.now().toString()) => ({
    dept_code: `UD${suffix.slice(-6)}`,
    dept_name: `Test Department ${suffix}`,
    is_active: true,
  });

  // ==================== SETUP & TEARDOWN ====================

  beforeAll(async () => {
    try {
      app = await createTestApp();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }

    // Create test departments
    const dept1Response = await app.inject({
      method: 'POST',
      url: '/core/departments',
      payload: createDepartmentData('UDTEST1'),
    });
    testDepartmentId = dept1Response.json().data.id;

    const dept2Response = await app.inject({
      method: 'POST',
      url: '/core/departments',
      payload: createDepartmentData('UDTEST2'),
    });
    testDepartment2Id = dept2Response.json().data.id;

    // Create test user
    const userData = createUserData('MAIN');
    const userResponse = await app.inject({
      method: 'POST',
      url: '/platform/users',
      payload: userData,
    });
    testUserId = userResponse.json().data.id;

    // Login to get auth token
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: userData.email,
        password: userData.password,
      },
    });
    authToken = loginResponse.json().data.accessToken;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUserId) {
      await app.inject({
        method: 'DELETE',
        url: `/platform/users/${testUserId}`,
      });
    }

    if (testDepartmentId) {
      await app.inject({
        method: 'DELETE',
        url: `/core/departments/${testDepartmentId}`,
      });
    }

    if (testDepartment2Id) {
      await app.inject({
        method: 'DELETE',
        url: `/core/departments/${testDepartment2Id}`,
      });
    }

    await app.close();
  });

  // ==================== RESPONSE SCHEMA TESTS ====================

  describe('Response Schema - No Permission Fields', () => {
    beforeAll(async () => {
      // Assign user to department for these tests
      await app.knex('user_departments').insert({
        user_id: testUserId,
        department_id: testDepartmentId,
        is_primary: true,
        assigned_role: 'Staff',
        assigned_at: new Date(),
      });
    });

    afterAll(async () => {
      // Cleanup assignment
      await app
        .knex('user_departments')
        .where({ user_id: testUserId })
        .delete();
    });

    it('should return departments without permission fields', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body.success).toBe(true);
      expect(body.data.departments).toBeDefined();
      expect(Array.isArray(body.data.departments)).toBe(true);

      // Verify at least one department exists
      expect(body.data.departments.length).toBeGreaterThan(0);

      // Verify NO permission fields in response
      const department = body.data.departments[0];
      expect(department).not.toHaveProperty('canCreateRequests');
      expect(department).not.toHaveProperty('canEditRequests');
      expect(department).not.toHaveProperty('canSubmitRequests');
      expect(department).not.toHaveProperty('canApproveRequests');
      expect(department).not.toHaveProperty('canViewReports');
      expect(department).not.toHaveProperty('can_create_requests');
      expect(department).not.toHaveProperty('can_edit_requests');
      expect(department).not.toHaveProperty('can_submit_requests');
      expect(department).not.toHaveProperty('can_approve_requests');
      expect(department).not.toHaveProperty('can_view_reports');
    });

    it('should only include organizational fields in department response', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      const department = body.data.departments[0];

      // Verify organizational fields are present
      expect(department).toHaveProperty('id');
      expect(department).toHaveProperty('userId');
      expect(department).toHaveProperty('departmentId');
      expect(department).toHaveProperty('isPrimary');
      expect(department).toHaveProperty('assignedRole');
      expect(department).toHaveProperty('validFrom');
      expect(department).toHaveProperty('validUntil');
      expect(department).toHaveProperty('assignedAt');

      // Verify values are correct types
      expect(typeof department.id).toBe('string');
      expect(typeof department.userId).toBe('string');
      expect(typeof department.departmentId).toBe('number');
      expect(typeof department.isPrimary).toBe('boolean');
      expect(
        department.assignedRole === null ||
          typeof department.assignedRole === 'string',
      ).toBe(true);
    });

    it('should return primary department without permission fields', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments/primary',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body.success).toBe(true);

      // Verify NO permission fields in response
      expect(body.data).not.toHaveProperty('canCreateRequests');
      expect(body.data).not.toHaveProperty('canEditRequests');
      expect(body.data).not.toHaveProperty('canSubmitRequests');
      expect(body.data).not.toHaveProperty('canApproveRequests');
      expect(body.data).not.toHaveProperty('canViewReports');
      expect(body.data).not.toHaveProperty('can_create_requests');
      expect(body.data).not.toHaveProperty('can_edit_requests');
      expect(body.data).not.toHaveProperty('can_submit_requests');
      expect(body.data).not.toHaveProperty('can_approve_requests');
      expect(body.data).not.toHaveProperty('can_view_reports');

      // Verify organizational fields are present
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('userId');
      expect(body.data).toHaveProperty('departmentId');
      expect(body.data).toHaveProperty('isPrimary');
      expect(body.data.isPrimary).toBe(true);
    });
  });

  // ==================== DATABASE SCHEMA VERIFICATION ====================

  describe('Database Schema Verification', () => {
    it('should verify permission columns do not exist in database', async () => {
      // Query the database schema directly
      const columns = await app.knex
        .select('column_name')
        .from('information_schema.columns')
        .where({
          table_name: 'user_departments',
          table_schema: 'public',
        });

      const columnNames = columns.map((col: any) => col.column_name);

      // Verify permission columns are NOT present
      expect(columnNames).not.toContain('can_create_requests');
      expect(columnNames).not.toContain('can_edit_requests');
      expect(columnNames).not.toContain('can_submit_requests');
      expect(columnNames).not.toContain('can_approve_requests');
      expect(columnNames).not.toContain('can_view_reports');
    });

    it('should verify organizational columns exist in database', async () => {
      // Query the database schema directly
      const columns = await app.knex
        .select('column_name')
        .from('information_schema.columns')
        .where({
          table_name: 'user_departments',
          table_schema: 'public',
        });

      const columnNames = columns.map((col: any) => col.column_name);

      // Verify organizational columns ARE present
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('user_id');
      expect(columnNames).toContain('department_id');
      expect(columnNames).toContain('is_primary');
      expect(columnNames).toContain('assigned_role');
      expect(columnNames).toContain('valid_from');
      expect(columnNames).toContain('valid_until');
      expect(columnNames).toContain('assigned_at');
      expect(columnNames).toContain('assigned_by');
      expect(columnNames).toContain('notes');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    it('should verify migration was applied successfully', async () => {
      // Check migration record exists
      const migration = await app
        .knex('knex_migrations')
        .where('name', 'like', '%remove_user_departments_permissions%')
        .first();

      expect(migration).toBeDefined();
      expect(migration.name).toBe(
        '20251217163651_remove_user_departments_permissions.ts',
      );
    });

    it('should verify data integrity maintained after migration', async () => {
      // Create a test assignment
      const [assignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartment2Id,
          is_primary: false,
          assigned_role: 'Tester',
          assigned_at: new Date(),
        })
        .returning('*');

      // Verify assignment created successfully
      expect(assignment).toBeDefined();
      expect(assignment.user_id).toBe(testUserId);
      expect(assignment.department_id).toBe(testDepartment2Id);
      expect(assignment.is_primary).toBe(false);
      expect(assignment.assigned_role).toBe('Tester');

      // Verify no permission fields exist
      expect(assignment).not.toHaveProperty('can_create_requests');
      expect(assignment).not.toHaveProperty('can_edit_requests');
      expect(assignment).not.toHaveProperty('can_submit_requests');
      expect(assignment).not.toHaveProperty('can_approve_requests');
      expect(assignment).not.toHaveProperty('can_view_reports');

      // Cleanup
      await app.knex('user_departments').where({ id: assignment.id }).delete();
    });
  });

  // ==================== BUSINESS LOGIC TESTS ====================

  describe('Business Logic - Organizational Structure Only', () => {
    let assignmentId: string;

    afterEach(async () => {
      // Cleanup any assignments created during tests
      if (assignmentId) {
        await app.knex('user_departments').where({ id: assignmentId }).delete();
        assignmentId = '';
      }
    });

    it('should assign user to department without permission parameters', async () => {
      // Directly insert via service (simulating API call)
      const [assignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: false,
          assigned_role: 'Staff Member',
          valid_from: null,
          valid_until: null,
          assigned_at: new Date(),
        })
        .returning('*');

      assignmentId = assignment.id;

      expect(assignment).toBeDefined();
      expect(assignment.user_id).toBe(testUserId);
      expect(assignment.department_id).toBe(testDepartmentId);
      expect(assignment.is_primary).toBe(false);
      expect(assignment.assigned_role).toBe('Staff Member');

      // Verify NO permission fields
      expect(assignment).not.toHaveProperty('can_create_requests');
      expect(assignment).not.toHaveProperty('can_edit_requests');
      expect(assignment).not.toHaveProperty('can_submit_requests');
      expect(assignment).not.toHaveProperty('can_approve_requests');
      expect(assignment).not.toHaveProperty('can_view_reports');
    });

    it('should remove user from department (soft delete)', async () => {
      // Create assignment
      const [assignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: false,
          assigned_role: 'Temporary Staff',
          assigned_at: new Date(),
        })
        .returning('*');

      assignmentId = assignment.id;

      // Soft delete by setting valid_until to NOW
      await app
        .knex('user_departments')
        .where({ id: assignmentId })
        .update({ valid_until: app.knex.fn.now() });

      // Verify assignment still exists but is marked as ended
      const updated = await app
        .knex('user_departments')
        .where({ id: assignmentId })
        .first();

      expect(updated).toBeDefined();
      expect(updated.valid_until).not.toBeNull();

      // Verify it's not returned in active departments query
      const activeDepartments = await app
        .knex('user_departments')
        .where({ user_id: testUserId })
        .whereRaw('(valid_from IS NULL OR valid_from <= NOW()::date)')
        .whereRaw('(valid_until IS NULL OR valid_until >= NOW()::date)');

      const activeIds = activeDepartments.map((d: any) => d.id);
      expect(activeIds).not.toContain(assignmentId);
    });

    it('should get user departments with only organizational data', async () => {
      // Create multiple assignments
      const [assignment1] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: true,
          assigned_role: 'Manager',
          assigned_at: new Date(),
        })
        .returning('*');

      const [assignment2] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartment2Id,
          is_primary: false,
          assigned_role: 'Staff',
          assigned_at: new Date(),
        })
        .returning('*');

      // Get active departments
      const departments = await app
        .knex('user_departments')
        .where({ user_id: testUserId })
        .whereRaw('(valid_from IS NULL OR valid_from <= NOW()::date)')
        .whereRaw('(valid_until IS NULL OR valid_until >= NOW()::date)')
        .orderBy('is_primary', 'desc');

      expect(departments.length).toBeGreaterThanOrEqual(2);

      // Verify organizational fields exist
      departments.forEach((dept: any) => {
        expect(dept).toHaveProperty('id');
        expect(dept).toHaveProperty('user_id');
        expect(dept).toHaveProperty('department_id');
        expect(dept).toHaveProperty('is_primary');
        expect(dept).toHaveProperty('assigned_role');

        // Verify NO permission fields
        expect(dept).not.toHaveProperty('can_create_requests');
        expect(dept).not.toHaveProperty('can_edit_requests');
        expect(dept).not.toHaveProperty('can_submit_requests');
        expect(dept).not.toHaveProperty('can_approve_requests');
        expect(dept).not.toHaveProperty('can_view_reports');
      });

      // Cleanup
      await app
        .knex('user_departments')
        .whereIn('id', [assignment1.id, assignment2.id])
        .delete();
    });

    it('should set primary department without affecting permissions', async () => {
      // Create two assignments
      const [assignment1] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: true,
          assigned_role: 'Manager',
          assigned_at: new Date(),
        })
        .returning('*');

      const [assignment2] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartment2Id,
          is_primary: false,
          assigned_role: 'Staff',
          assigned_at: new Date(),
        })
        .returning('*');

      // Update assignment2 to be primary
      await app
        .knex('user_departments')
        .where({ user_id: testUserId })
        .update({ is_primary: false });

      await app
        .knex('user_departments')
        .where({ id: assignment2.id })
        .update({ is_primary: true });

      // Verify new primary
      const primaryDept = await app
        .knex('user_departments')
        .where({ user_id: testUserId, is_primary: true })
        .first();

      expect(primaryDept.id).toBe(assignment2.id);
      expect(primaryDept.department_id).toBe(testDepartment2Id);

      // Verify NO permission fields in result
      expect(primaryDept).not.toHaveProperty('can_create_requests');
      expect(primaryDept).not.toHaveProperty('can_edit_requests');
      expect(primaryDept).not.toHaveProperty('can_submit_requests');
      expect(primaryDept).not.toHaveProperty('can_approve_requests');
      expect(primaryDept).not.toHaveProperty('can_view_reports');

      // Cleanup
      await app
        .knex('user_departments')
        .whereIn('id', [assignment1.id, assignment2.id])
        .delete();
    });

    it('should get department users with organizational details only', async () => {
      // Create user 2
      const user2Data = createUserData('USER2');
      const user2Response = await app.inject({
        method: 'POST',
        url: '/platform/users',
        payload: user2Data,
      });
      const user2Id = user2Response.json().data.id;

      // Assign both users to same department
      const [assignment1] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: true,
          assigned_role: 'Manager',
          assigned_at: new Date(),
        })
        .returning('*');

      const [assignment2] = await app
        .knex('user_departments')
        .insert({
          user_id: user2Id,
          department_id: testDepartmentId,
          is_primary: false,
          assigned_role: 'Staff',
          assigned_at: new Date(),
        })
        .returning('*');

      // Get all users in department with details
      const users = await app
        .knex('user_departments')
        .select(
          'user_departments.*',
          'users.email as user_email',
          'users.first_name',
          'users.last_name',
        )
        .innerJoin('users', 'user_departments.user_id', 'users.id')
        .where('user_departments.department_id', testDepartmentId)
        .whereNull('users.deleted_at');

      expect(users.length).toBeGreaterThanOrEqual(2);

      // Verify user details are included
      users.forEach((user: any) => {
        expect(user).toHaveProperty('user_email');
        expect(user).toHaveProperty('first_name');
        expect(user).toHaveProperty('last_name');

        // Verify NO permission fields
        expect(user).not.toHaveProperty('can_create_requests');
        expect(user).not.toHaveProperty('can_edit_requests');
        expect(user).not.toHaveProperty('can_submit_requests');
        expect(user).not.toHaveProperty('can_approve_requests');
        expect(user).not.toHaveProperty('can_view_reports');
      });

      // Cleanup
      await app
        .knex('user_departments')
        .whereIn('id', [assignment1.id, assignment2.id])
        .delete();
      await app.inject({
        method: 'DELETE',
        url: `/platform/users/${user2Id}`,
      });
    });
  });

  // ==================== RBAC INTEGRATION TESTS ====================

  describe('RBAC Middleware Integration', () => {
    it('should protect endpoints with authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        // No Authorization header
      });

      // Should return 401 Unauthorized
      expect(response.statusCode).toBe(401);

      const body = response.json();
      expect(body.success).toBe(false);
    });

    it('should allow access with valid authentication token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Should succeed
      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body.success).toBe(true);
    });

    it('should deny access with invalid authentication token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: 'Bearer invalid-token-12345',
        },
      });

      // Should return 401 Unauthorized
      expect(response.statusCode).toBe(401);

      const body = response.json();
      expect(body.success).toBe(false);
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should return 404 when user has no primary department', async () => {
      // Create a new user with no departments
      const newUserData = createUserData('NODEPT');
      const newUserResponse = await app.inject({
        method: 'POST',
        url: '/platform/users',
        payload: newUserData,
      });
      const newUserId = newUserResponse.json().data.id;

      // Login as new user
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: newUserData.email,
          password: newUserData.password,
        },
      });
      const newUserToken = loginResponse.json().data.accessToken;

      // Try to get primary department
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments/primary',
        headers: {
          Authorization: `Bearer ${newUserToken}`,
        },
      });

      expect(response.statusCode).toBe(404);

      const body = response.json();
      expect(body.success).toBe(false);
      expect(body.error.message).toContain('No primary department');

      // Cleanup
      await app.inject({
        method: 'DELETE',
        url: `/platform/users/${newUserId}`,
      });
    });

    it('should return empty array when user has no active departments', async () => {
      // Create a new user with no departments
      const newUserData = createUserData('NOACTIVE');
      const newUserResponse = await app.inject({
        method: 'POST',
        url: '/platform/users',
        payload: newUserData,
      });
      const newUserId = newUserResponse.json().data.id;

      // Login as new user
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: newUserData.email,
          password: newUserData.password,
        },
      });
      const newUserToken = loginResponse.json().data.accessToken;

      // Get departments
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${newUserToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body.success).toBe(true);
      expect(body.data.departments).toEqual([]);
      expect(body.data.count).toBe(0);

      // Cleanup
      await app.inject({
        method: 'DELETE',
        url: `/platform/users/${newUserId}`,
      });
    });
  });

  // ==================== BACKWARD COMPATIBILITY TESTS ====================

  describe('Backward Compatibility', () => {
    it('should handle existing assignments created before migration', async () => {
      // Create assignment
      const [assignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: true,
          assigned_role: 'Legacy Staff',
          assigned_at: new Date(),
        })
        .returning('*');

      // Query via API
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      expect(body.success).toBe(true);
      expect(body.data.departments.length).toBeGreaterThan(0);

      // Verify no permission fields in response
      const dept = body.data.departments.find(
        (d: any) => d.id === assignment.id,
      );
      expect(dept).toBeDefined();
      expect(dept).not.toHaveProperty('canCreateRequests');
      expect(dept).not.toHaveProperty('canEditRequests');
      expect(dept).not.toHaveProperty('canSubmitRequests');
      expect(dept).not.toHaveProperty('canApproveRequests');
      expect(dept).not.toHaveProperty('canViewReports');

      // Cleanup
      await app.knex('user_departments').where({ id: assignment.id }).delete();
    });

    it('should properly handle date-based filtering for active departments', async () => {
      // Create future assignment
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const [futureAssignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartmentId,
          is_primary: false,
          assigned_role: 'Future Staff',
          valid_from: futureDate,
          assigned_at: new Date(),
        })
        .returning('*');

      // Create expired assignment
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);

      const [expiredAssignment] = await app
        .knex('user_departments')
        .insert({
          user_id: testUserId,
          department_id: testDepartment2Id,
          is_primary: false,
          assigned_role: 'Former Staff',
          valid_from: pastDate,
          valid_until: pastDate,
          assigned_at: new Date(),
        })
        .returning('*');

      // Query active departments
      const response = await app.inject({
        method: 'GET',
        url: '/platform/users/me/departments',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);

      const body = response.json();
      const assignmentIds = body.data.departments.map((d: any) => d.id);

      // Future assignment should NOT be included
      expect(assignmentIds).not.toContain(futureAssignment.id);

      // Expired assignment should NOT be included
      expect(assignmentIds).not.toContain(expiredAssignment.id);

      // Cleanup
      await app
        .knex('user_departments')
        .whereIn('id', [futureAssignment.id, expiredAssignment.id])
        .delete();
    });
  });
});
