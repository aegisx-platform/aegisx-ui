/**
 * Test Data Seed - RBAC Permission Mapping Testing (Task 6)
 *
 * Creates realistic test data to simulate permission distribution patterns
 * for comprehensive testing of the permission mapping workflow.
 *
 * Part of: RBAC Permission Consolidation (Task 6)
 * Spec: .spec-workflow/specs/rbac-permission-consolidation/
 *
 * This seed creates test users and department assignments with various
 * permission flag combinations to test the mapping logic.
 *
 * Usage:
 *   npx knex seed:run --specific=task6-test-permission-mapping-data.ts
 *
 * Data Pattern:
 *   - Admin Users (2): All 5 permissions
 *   - Supervisor Users (3): 4 permissions (including approve)
 *   - Staff Users (5): 3 permissions (basic: create, edit, submit)
 *   - Viewer Users (2): 1 permission (view reports only)
 *   - Edge Case Users (1): Custom permission combo
 *
 * Total: 13 test users with department assignments
 *
 * Idempotency: Safe to run multiple times - checks for existing emails
 */

import type { Knex } from 'knex';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TestUserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  permissions: {
    can_create_requests: boolean;
    can_edit_requests: boolean;
    can_submit_requests: boolean;
    can_approve_requests: boolean;
    can_view_reports: boolean;
  };
  testCategory: string;
}

// ============================================================================
// TEST DATA DEFINITION
// ============================================================================

const testUsersData: TestUserData[] = [
  // Admin Users - All 5 Permissions
  {
    email: 'admin-test-1@aegisx.local',
    username: 'admin_test_1',
    firstName: 'Admin',
    lastName: 'TestUser1',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: true,
      can_view_reports: true,
    },
    testCategory: 'Admin (All 5 Permissions)',
  },
  {
    email: 'admin-test-2@aegisx.local',
    username: 'admin_test_2',
    firstName: 'Admin',
    lastName: 'TestUser2',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: true,
      can_view_reports: true,
    },
    testCategory: 'Admin (All 5 Permissions)',
  },

  // Supervisor Users - 4 Permissions (Including Approve)
  {
    email: 'supervisor-test-1@aegisx.local',
    username: 'supervisor_test_1',
    firstName: 'Supervisor',
    lastName: 'TestUser1',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: true,
      can_view_reports: false,
    },
    testCategory: 'Supervisor (4 Permissions w/ Approve)',
  },
  {
    email: 'supervisor-test-2@aegisx.local',
    username: 'supervisor_test_2',
    firstName: 'Supervisor',
    lastName: 'TestUser2',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: false,
      can_approve_requests: true,
      can_view_reports: true,
    },
    testCategory: 'Supervisor (4 Permissions w/ Approve)',
  },
  {
    email: 'supervisor-test-3@aegisx.local',
    username: 'supervisor_test_3',
    firstName: 'Supervisor',
    lastName: 'TestUser3',
    permissions: {
      can_create_requests: false,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: true,
      can_view_reports: true,
    },
    testCategory: 'Supervisor (4 Permissions w/ Approve)',
  },

  // Staff Users - 3 Permissions (Basic: Create, Edit, Submit)
  {
    email: 'staff-test-1@aegisx.local',
    username: 'staff_test_1',
    firstName: 'Staff',
    lastName: 'TestUser1',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: false,
      can_view_reports: false,
    },
    testCategory: 'Staff (3 Basic Permissions)',
  },
  {
    email: 'staff-test-2@aegisx.local',
    username: 'staff_test_2',
    firstName: 'Staff',
    lastName: 'TestUser2',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: false,
      can_view_reports: false,
    },
    testCategory: 'Staff (3 Basic Permissions)',
  },
  {
    email: 'staff-test-3@aegisx.local',
    username: 'staff_test_3',
    firstName: 'Staff',
    lastName: 'TestUser3',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: false,
      can_view_reports: false,
    },
    testCategory: 'Staff (3 Basic Permissions)',
  },
  {
    email: 'staff-test-4@aegisx.local',
    username: 'staff_test_4',
    firstName: 'Staff',
    lastName: 'TestUser4',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: false,
      can_view_reports: false,
    },
    testCategory: 'Staff (3 Basic Permissions)',
  },
  {
    email: 'staff-test-5@aegisx.local',
    username: 'staff_test_5',
    firstName: 'Staff',
    lastName: 'TestUser5',
    permissions: {
      can_create_requests: true,
      can_edit_requests: true,
      can_submit_requests: true,
      can_approve_requests: false,
      can_view_reports: false,
    },
    testCategory: 'Staff (3 Basic Permissions)',
  },

  // Viewer Users - 1 Permission (Report Access Only)
  {
    email: 'viewer-test-1@aegisx.local',
    username: 'viewer_test_1',
    firstName: 'Viewer',
    lastName: 'TestUser1',
    permissions: {
      can_create_requests: false,
      can_edit_requests: false,
      can_submit_requests: false,
      can_approve_requests: false,
      can_view_reports: true,
    },
    testCategory: 'Viewer (1 Permission: View Reports)',
  },
  {
    email: 'viewer-test-2@aegisx.local',
    username: 'viewer_test_2',
    firstName: 'Viewer',
    lastName: 'TestUser2',
    permissions: {
      can_create_requests: false,
      can_edit_requests: false,
      can_submit_requests: false,
      can_approve_requests: false,
      can_view_reports: true,
    },
    testCategory: 'Viewer (1 Permission: View Reports)',
  },

  // Edge Case Users - Custom Permission Combination
  {
    email: 'edge-case-test-1@aegisx.local',
    username: 'edge_case_test_1',
    firstName: 'EdgeCase',
    lastName: 'TestUser1',
    permissions: {
      can_create_requests: true,
      can_edit_requests: false,
      can_submit_requests: false,
      can_approve_requests: true,
      can_view_reports: false,
    },
    testCategory: 'Edge Case (Unusual: Create + Approve)',
  },
];

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Create test users (idempotent)
 */
async function createTestUsers(knex: Knex): Promise<Map<string, string>> {
  console.log('');
  console.log('Creating test users...');

  const userIdMap = new Map<string, string>();

  for (const userData of testUsersData) {
    // Check if user already exists
    const existing = await knex('users').where('email', userData.email).first();

    if (existing) {
      console.log(`⏭️  User already exists: ${userData.email}`);
      userIdMap.set(userData.email, existing.id);
      continue;
    }

    // Create new user
    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash('password123', 10);

    await knex('users').insert({
      id: userId,
      email: userData.email,
      username: userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName,
      password: hashedPassword,
      status: 'active',
    });

    console.log(`✓ Created user: ${userData.email}`);
    userIdMap.set(userData.email, userId);
  }

  console.log(`✓ Total users created/found: ${userIdMap.size}`);
  return userIdMap;
}

/**
 * Get or find a department for testing
 */
async function getTestDepartment(knex: Knex): Promise<number> {
  // Try to find existing department (prefer a main one)
  let department = await knex('departments').where('dept_code', 'GEN').first();

  if (!department) {
    // Fallback: get first available department
    department = await knex('departments').first();
  }

  if (!department) {
    throw new Error('No departments found in database. Run migrations first.');
  }

  console.log(
    `Using department for test data: ${department.dept_name} (#${department.id})`,
  );
  return department.id;
}

/**
 * Get or find a hospital for testing
 */
async function getTestHospital(knex: Knex): Promise<string | null> {
  try {
    const hospital = await knex('inventory.hospitals').first();
    return hospital ? hospital.id : null;
  } catch {
    // Hospitals table might not exist, that's ok
    return null;
  }
}

/**
 * Assign test users to departments with permission flags
 */
async function assignUsersToDepartments(
  knex: Knex,
  userIdMap: Map<string, string>,
  departmentId: number,
  hospitalId: string | null,
): Promise<void> {
  console.log('');
  console.log('Assigning users to departments with permission flags...');

  let assignmentCount = 0;

  for (const userData of testUsersData) {
    const userId = userIdMap.get(userData.email)!;

    // Check if assignment already exists
    const existing = await knex('user_departments')
      .where('user_id', userId)
      .where('department_id', departmentId)
      .first();

    if (existing) {
      console.log(
        `⏭️  Assignment exists: ${userData.email} → Department #${departmentId}`,
      );
      continue;
    }

    // Create department assignment with permission flags
    await knex('user_departments').insert({
      id: crypto.randomUUID(),
      user_id: userId,
      department_id: departmentId,
      hospital_id: hospitalId,
      is_primary: true,
      can_create_requests: userData.permissions.can_create_requests,
      can_edit_requests: userData.permissions.can_edit_requests,
      can_submit_requests: userData.permissions.can_submit_requests,
      can_approve_requests: userData.permissions.can_approve_requests,
      can_view_reports: userData.permissions.can_view_reports,
    });

    const permFlags = [
      userData.permissions.can_create_requests ? 'create' : '',
      userData.permissions.can_edit_requests ? 'edit' : '',
      userData.permissions.can_submit_requests ? 'submit' : '',
      userData.permissions.can_approve_requests ? 'approve' : '',
      userData.permissions.can_view_reports ? 'view' : '',
    ]
      .filter(Boolean)
      .join(', ');

    console.log(
      `✓ Assigned: ${userData.email} [${userData.testCategory}] (${permFlags})`,
    );
    assignmentCount++;
  }

  console.log(`✓ Total assignments created: ${assignmentCount}`);
}

/**
 * Print summary of test data created
 */
function printSummary(): void {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  TEST DATA CREATION SUMMARY');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Test Users Created by Category:');
  console.log('');
  console.log('Admin Users (All 5 Permissions):');
  console.log('  - admin-test-1@aegisx.local');
  console.log('  - admin-test-2@aegisx.local');
  console.log('  Total: 2 users');
  console.log('  Expected RBAC Role: admin');
  console.log('');

  console.log('Supervisor Users (4 Permissions + Approve):');
  console.log('  - supervisor-test-1@aegisx.local');
  console.log('  - supervisor-test-2@aegisx.local');
  console.log('  - supervisor-test-3@aegisx.local');
  console.log('  Total: 3 users');
  console.log('  Expected RBAC Role: supervisor');
  console.log('');

  console.log('Staff Users (3 Basic Permissions):');
  console.log('  - staff-test-1@aegisx.local');
  console.log('  - staff-test-2@aegisx.local');
  console.log('  - staff-test-3@aegisx.local');
  console.log('  - staff-test-4@aegisx.local');
  console.log('  - staff-test-5@aegisx.local');
  console.log('  Total: 5 users');
  console.log('  Expected RBAC Role: staff or user');
  console.log('');

  console.log('Viewer Users (1 Permission: View Reports):');
  console.log('  - viewer-test-1@aegisx.local');
  console.log('  - viewer-test-2@aegisx.local');
  console.log('  Total: 2 users');
  console.log('  Expected RBAC Role: user');
  console.log('');

  console.log('Edge Case Users (Custom Permission Combo):');
  console.log('  - edge-case-test-1@aegisx.local (create + approve)');
  console.log('  Total: 1 user');
  console.log('  Expected: Flagged for manual review');
  console.log('');

  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Next Steps:');
  console.log('1. Run pre-migration audit:');
  console.log(
    '   npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --export',
  );
  console.log('');
  console.log('2. Run dry-run permission mapping:');
  console.log(
    '   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --dry-run',
  );
  console.log('');
  console.log('3. Execute permission mapping:');
  console.log(
    '   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --force',
  );
  console.log('');
  console.log('4. Run post-migration audit:');
  console.log(
    '   npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --export',
  );
  console.log('');
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

export async function seed(knex: Knex): Promise<void> {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  TASK 6 TEST DATA SEED - RBAC Permission Mapping');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');

  try {
    // Step 1: Create test users
    const userIdMap = await createTestUsers(knex);

    // Step 2: Get test department and hospital
    const departmentId = await getTestDepartment(knex);
    const hospitalId = await getTestHospital(knex);

    // Step 3: Assign users to departments with permission flags
    await assignUsersToDepartments(knex, userIdMap, departmentId, hospitalId);

    // Step 4: Print summary
    printSummary();

    console.log('✓ Seed completed successfully');
    console.log('');
  } catch (error) {
    console.error('✗ Seed failed:', error);
    throw error;
  }
}
