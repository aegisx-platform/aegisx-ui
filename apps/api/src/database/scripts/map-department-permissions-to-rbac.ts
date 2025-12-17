/**
 * Permission Mapping Script: Department Flags → RBAC Roles
 *
 * Maps existing department permission flags to RBAC role assignments.
 * Assigns roles based on permission combinations to ensure no access loss.
 *
 * Part of: RBAC Permission Consolidation (Task 4)
 * Spec: .spec-workflow/specs/rbac-permission-consolidation/
 *
 * Usage:
 *   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts
 *   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --dry-run
 *   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --force
 *
 * Options:
 *   --dry-run       Preview assignments without writing to database
 *   --force         Execute role assignments (writes to database)
 *   --help, -h      Show this help message
 *
 * Output:
 *   - Console report with assignment statistics
 *   - Audit log of all role assignments (/tmp/rbac-permission-mapping-log.json)
 *
 * Safety:
 *   - Idempotent: Safe to run multiple times (skips existing assignments)
 *   - Preserves existing RBAC roles (does not overwrite)
 *   - Uses transactions for atomicity
 *   - Logs all assignments for audit trail
 */

import knex from 'knex';
import type { Knex } from 'knex';
import { config } from 'dotenv';
import * as fs from 'fs';

// Load environment (same pattern as audit script)
config();
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local', override: true });
}

// Connection config
const connectionConfig = {
  host: process.env.DATABASE_HOST || process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(
    process.env.DATABASE_PORT || process.env.POSTGRES_PORT || '5432',
  ),
  database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'aegisx_db',
  user: process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
  password:
    process.env.DATABASE_PASSWORD ||
    process.env.POSTGRES_PASSWORD ||
    'postgres',
};

const db = knex({
  client: 'pg',
  connection: connectionConfig,
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UserDepartmentRecord {
  user_id: string;
  department_id: number;
  can_create_requests: boolean;
  can_edit_requests: boolean;
  can_submit_requests: boolean;
  can_approve_requests: boolean;
  can_view_reports: boolean;
}

interface RoleInfo {
  id: string;
  name: string;
  description: string | null;
}

interface RoleAssignment {
  user_id: string;
  role_id: string;
  role_name: string;
  reason: string;
  permission_flags: {
    can_create_requests: boolean;
    can_edit_requests: boolean;
    can_submit_requests: boolean;
    can_approve_requests: boolean;
    can_view_reports: boolean;
  };
  department_context: number;
  timestamp: string;
}

interface EdgeCase {
  user_id: string;
  department_id: number;
  permission_combination: string;
  reason: string;
  recommended_action: string;
}

interface MappingReport {
  execution_date: string;
  dry_run: boolean;
  total_users_processed: number;
  role_assignments_made: number;
  role_assignments_skipped: number;
  edge_cases_found: number;
  assignments: RoleAssignment[];
  edge_cases: EdgeCase[];
  statistics: {
    admin_assigned: number;
    supervisor_assigned: number;
    staff_assigned: number;
    user_assigned: number;
    moderator_assigned: number;
  };
}

// ============================================================================
// PERMISSION MAPPING TABLE (from design.md)
// ============================================================================

const PERMISSION_MAPPING = {
  can_create_requests: 'budget-requests:create',
  can_edit_requests: 'budget-requests:update',
  can_submit_requests: 'budget-requests:submit',
  can_approve_requests: 'budget-requests:approve',
  can_view_reports: 'reports:view',
} as const;

// ============================================================================
// ROLE ASSIGNMENT LOGIC
// ============================================================================

/**
 * Determine appropriate role based on permission flags
 *
 * Logic:
 * - All 5 permissions (including approve) → admin or supervisor role
 * - Including approve permission → supervisor role
 * - Basic permissions (create, edit, submit) → staff role (if exists)
 * - No permissions enabled → user role (base access)
 * - Custom combinations → edge case (log for review)
 */
function determineRole(
  record: UserDepartmentRecord,
  availableRoles: RoleInfo[],
): {
  roleId: string | null;
  roleName: string | null;
  reason: string;
  isEdgeCase: boolean;
} {
  const {
    can_create_requests,
    can_edit_requests,
    can_submit_requests,
    can_approve_requests,
    can_view_reports,
  } = record;

  // Count enabled permissions
  const enabledCount = [
    can_create_requests,
    can_edit_requests,
    can_submit_requests,
    can_approve_requests,
    can_view_reports,
  ].filter(Boolean).length;

  // All permissions enabled → admin or supervisor
  if (
    can_create_requests &&
    can_edit_requests &&
    can_submit_requests &&
    can_approve_requests &&
    can_view_reports
  ) {
    // Prefer admin role if exists
    const adminRole = availableRoles.find((r) => r.name === 'admin');
    if (adminRole) {
      return {
        roleId: adminRole.id,
        roleName: adminRole.name,
        reason: 'All 5 permissions enabled → admin role',
        isEdgeCase: false,
      };
    }

    // Fallback to supervisor
    const supervisorRole = availableRoles.find((r) =>
      r.name.toLowerCase().includes('supervisor'),
    );
    if (supervisorRole) {
      return {
        roleId: supervisorRole.id,
        roleName: supervisorRole.name,
        reason: 'All 5 permissions enabled → supervisor role (admin not found)',
        isEdgeCase: false,
      };
    }

    // Fallback to moderator
    const moderatorRole = availableRoles.find((r) => r.name === 'moderator');
    if (moderatorRole) {
      return {
        roleId: moderatorRole.id,
        roleName: moderatorRole.name,
        reason:
          'All 5 permissions enabled → moderator role (admin/supervisor not found)',
        isEdgeCase: false,
      };
    }

    return {
      roleId: null,
      roleName: null,
      reason:
        'All permissions enabled but no admin/supervisor/moderator role exists',
      isEdgeCase: true,
    };
  }

  // Approve permission enabled → supervisor
  if (can_approve_requests) {
    const supervisorRole = availableRoles.find((r) =>
      r.name.toLowerCase().includes('supervisor'),
    );
    if (supervisorRole) {
      return {
        roleId: supervisorRole.id,
        roleName: supervisorRole.name,
        reason: 'Approve permission enabled → supervisor role',
        isEdgeCase: false,
      };
    }

    const moderatorRole = availableRoles.find((r) => r.name === 'moderator');
    if (moderatorRole) {
      return {
        roleId: moderatorRole.id,
        roleName: moderatorRole.name,
        reason:
          'Approve permission enabled → moderator role (supervisor not found)',
        isEdgeCase: false,
      };
    }

    return {
      roleId: null,
      roleName: null,
      reason:
        'Approve permission enabled but no supervisor/moderator role exists',
      isEdgeCase: true,
    };
  }

  // Basic permissions (create, edit, submit) → staff role
  if (
    (can_create_requests || can_edit_requests || can_submit_requests) &&
    enabledCount >= 2
  ) {
    // Look for staff role
    const staffRole = availableRoles.find((r) =>
      r.name.toLowerCase().includes('staff'),
    );
    if (staffRole) {
      return {
        roleId: staffRole.id,
        roleName: staffRole.name,
        reason: 'Basic permissions (create, edit, submit) → staff role',
        isEdgeCase: false,
      };
    }

    // Fallback to user role
    const userRole = availableRoles.find((r) => r.name === 'user');
    if (userRole) {
      return {
        roleId: userRole.id,
        roleName: userRole.name,
        reason: 'Basic permissions → user role (staff role not found)',
        isEdgeCase: false,
      };
    }

    return {
      roleId: null,
      roleName: null,
      reason: 'Basic permissions but no staff/user role exists',
      isEdgeCase: true,
    };
  }

  // No permissions or only view reports → base user role
  if (enabledCount <= 1) {
    const userRole = availableRoles.find((r) => r.name === 'user');
    if (userRole) {
      return {
        roleId: userRole.id,
        roleName: userRole.name,
        reason: 'Minimal permissions → user role',
        isEdgeCase: false,
      };
    }

    return {
      roleId: null,
      roleName: null,
      reason: 'Minimal permissions but no user role exists',
      isEdgeCase: true,
    };
  }

  // Custom combination → edge case
  return {
    roleId: null,
    roleName: null,
    reason: `Custom permission combination (${enabledCount} flags enabled)`,
    isEdgeCase: true,
  };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Get all available roles
 */
async function getAvailableRoles(): Promise<RoleInfo[]> {
  const roles = await db('roles')
    .select('id', 'name', 'description')
    .orderBy('name');

  return roles as RoleInfo[];
}

/**
 * Get all user-department records with permission flags
 */
async function getUserDepartmentRecords(): Promise<UserDepartmentRecord[]> {
  const records = await db('user_departments')
    .select(
      'user_id',
      'department_id',
      'can_create_requests',
      'can_edit_requests',
      'can_submit_requests',
      'can_approve_requests',
      'can_view_reports',
    )
    .where(function () {
      this.whereNull('valid_until').orWhere('valid_until', '>=', db.fn.now());
    })
    .andWhere(function () {
      this.whereNull('valid_from').orWhere('valid_from', '<=', db.fn.now());
    })
    .orderBy(['user_id', 'department_id']);

  return records as UserDepartmentRecord[];
}

/**
 * Check if user already has a specific role
 */
async function userHasRole(
  trx: Knex.Transaction,
  userId: string,
  roleId: string,
): Promise<boolean> {
  const existing = await trx('user_roles')
    .where('user_id', userId)
    .andWhere('role_id', roleId)
    .first();

  return !!existing;
}

/**
 * Assign role to user (idempotent)
 */
async function assignRole(
  trx: Knex.Transaction,
  userId: string,
  roleId: string,
): Promise<boolean> {
  // Check if already assigned (idempotency)
  const hasRole = await userHasRole(trx, userId, roleId);
  if (hasRole) {
    return false; // Already has role, skip
  }

  // Insert new role assignment
  await trx('user_roles').insert({
    user_id: userId,
    role_id: roleId,
    created_at: trx.fn.now(),
    updated_at: trx.fn.now(),
  });

  return true; // New assignment made
}

// ============================================================================
// MAIN MAPPING LOGIC
// ============================================================================

/**
 * Process all user-department records and assign roles
 */
async function mapPermissionsToRoles(dryRun: boolean): Promise<MappingReport> {
  const report: MappingReport = {
    execution_date: new Date().toISOString(),
    dry_run: dryRun,
    total_users_processed: 0,
    role_assignments_made: 0,
    role_assignments_skipped: 0,
    edge_cases_found: 0,
    assignments: [],
    edge_cases: [],
    statistics: {
      admin_assigned: 0,
      supervisor_assigned: 0,
      staff_assigned: 0,
      user_assigned: 0,
      moderator_assigned: 0,
    },
  };

  // Get available roles
  console.log('Loading available roles...');
  const availableRoles = await getAvailableRoles();
  console.log(`Found ${availableRoles.length} roles in database`);
  console.log('');

  if (availableRoles.length === 0) {
    throw new Error('No roles found in database. Cannot map permissions.');
  }

  // Get all user-department records
  console.log('Loading user-department records...');
  const records = await getUserDepartmentRecords();
  console.log(`Found ${records.length} active user-department assignments`);
  console.log('');

  if (records.length === 0) {
    console.log('No active user-department records found. Nothing to map.');
    return report;
  }

  // Group by user to avoid duplicate assignments
  const userRecordsMap = new Map<string, UserDepartmentRecord[]>();
  for (const record of records) {
    if (!userRecordsMap.has(record.user_id)) {
      userRecordsMap.set(record.user_id, []);
    }
    userRecordsMap.get(record.user_id)!.push(record);
  }

  report.total_users_processed = userRecordsMap.size;

  console.log(`Processing ${userRecordsMap.size} unique users...`);
  console.log('');

  // Process each user
  if (dryRun) {
    console.log('DRY RUN MODE: No changes will be written to database');
    console.log('');
  }

  for (const [userId, userRecords] of Array.from(userRecordsMap.entries())) {
    // Determine role based on first department's permissions
    // (If user has multiple departments, we use the one with most permissions)
    const recordWithMostPermissions = userRecords.sort((a, b) => {
      const countA = [
        a.can_create_requests,
        a.can_edit_requests,
        a.can_submit_requests,
        a.can_approve_requests,
        a.can_view_reports,
      ].filter(Boolean).length;
      const countB = [
        b.can_create_requests,
        b.can_edit_requests,
        b.can_submit_requests,
        b.can_approve_requests,
        b.can_view_reports,
      ].filter(Boolean).length;
      return countB - countA;
    })[0];

    const { roleId, roleName, reason, isEdgeCase } = determineRole(
      recordWithMostPermissions,
      availableRoles,
    );

    if (isEdgeCase) {
      // Log edge case
      const permCombo = Object.entries(recordWithMostPermissions)
        .filter(([key]) => key.startsWith('can_'))
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');

      report.edge_cases.push({
        user_id: userId,
        department_id: recordWithMostPermissions.department_id,
        permission_combination: permCombo,
        reason,
        recommended_action:
          'Manually review and assign appropriate role via RBAC admin interface',
      });
      report.edge_cases_found++;
      continue;
    }

    if (!roleId || !roleName) {
      // Should not happen if edge case detection works
      report.edge_cases.push({
        user_id: userId,
        department_id: recordWithMostPermissions.department_id,
        permission_combination: 'Unknown',
        reason: 'Could not determine role',
        recommended_action: 'Manually assign role',
      });
      report.edge_cases_found++;
      continue;
    }

    // Check if user already has this role
    if (!dryRun) {
      await db.transaction(async (trx) => {
        const assigned = await assignRole(trx, userId, roleId);

        if (assigned) {
          // New assignment
          const assignment: RoleAssignment = {
            user_id: userId,
            role_id: roleId,
            role_name: roleName,
            reason,
            permission_flags: {
              can_create_requests:
                recordWithMostPermissions.can_create_requests,
              can_edit_requests: recordWithMostPermissions.can_edit_requests,
              can_submit_requests:
                recordWithMostPermissions.can_submit_requests,
              can_approve_requests:
                recordWithMostPermissions.can_approve_requests,
              can_view_reports: recordWithMostPermissions.can_view_reports,
            },
            department_context: recordWithMostPermissions.department_id,
            timestamp: new Date().toISOString(),
          };

          report.assignments.push(assignment);
          report.role_assignments_made++;

          // Update statistics
          if (roleName === 'admin') report.statistics.admin_assigned++;
          else if (roleName.toLowerCase().includes('supervisor'))
            report.statistics.supervisor_assigned++;
          else if (roleName.toLowerCase().includes('staff'))
            report.statistics.staff_assigned++;
          else if (roleName === 'moderator')
            report.statistics.moderator_assigned++;
          else if (roleName === 'user') report.statistics.user_assigned++;
        } else {
          // Already has role
          report.role_assignments_skipped++;
        }
      });
    } else {
      // Dry run: simulate assignment
      const hasRole = await userHasRole(
        db as unknown as Knex.Transaction,
        userId,
        roleId,
      );

      if (!hasRole) {
        const assignment: RoleAssignment = {
          user_id: userId,
          role_id: roleId,
          role_name: roleName,
          reason,
          permission_flags: {
            can_create_requests: recordWithMostPermissions.can_create_requests,
            can_edit_requests: recordWithMostPermissions.can_edit_requests,
            can_submit_requests: recordWithMostPermissions.can_submit_requests,
            can_approve_requests:
              recordWithMostPermissions.can_approve_requests,
            can_view_reports: recordWithMostPermissions.can_view_reports,
          },
          department_context: recordWithMostPermissions.department_id,
          timestamp: new Date().toISOString(),
        };

        report.assignments.push(assignment);
        report.role_assignments_made++;

        // Update statistics
        if (roleName === 'admin') report.statistics.admin_assigned++;
        else if (roleName.toLowerCase().includes('supervisor'))
          report.statistics.supervisor_assigned++;
        else if (roleName.toLowerCase().includes('staff'))
          report.statistics.staff_assigned++;
        else if (roleName === 'moderator')
          report.statistics.moderator_assigned++;
        else if (roleName === 'user') report.statistics.user_assigned++;
      } else {
        report.role_assignments_skipped++;
      }
    }
  }

  return report;
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Print formatted report to console
 */
function printReport(report: MappingReport) {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  RBAC PERMISSION MAPPING REPORT');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log(`Execution Date: ${report.execution_date}`);
  console.log(
    `Mode: ${report.dry_run ? 'DRY RUN (no changes written)' : 'EXECUTE (changes written)'}`,
  );
  console.log('');

  // Summary Statistics
  console.log('─────────────────────────────────────────────────────────────');
  console.log('SUMMARY STATISTICS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log(`Total Users Processed:        ${report.total_users_processed}`);
  console.log(`Role Assignments Made:        ${report.role_assignments_made}`);
  console.log(
    `Role Assignments Skipped:     ${report.role_assignments_skipped} (already had role)`,
  );
  console.log(
    `Edge Cases Found:             ${report.edge_cases_found} (need manual review)`,
  );
  console.log('');

  // Role Assignment Breakdown
  console.log('─────────────────────────────────────────────────────────────');
  console.log('ROLE ASSIGNMENT BREAKDOWN');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log(`Admin Role:       ${report.statistics.admin_assigned}`);
  console.log(`Supervisor Role:  ${report.statistics.supervisor_assigned}`);
  console.log(`Moderator Role:   ${report.statistics.moderator_assigned}`);
  console.log(`Staff Role:       ${report.statistics.staff_assigned}`);
  console.log(`User Role:        ${report.statistics.user_assigned}`);
  console.log('');

  // Recent Assignments (first 10)
  if (report.assignments.length > 0) {
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('RECENT ROLE ASSIGNMENTS');
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('');

    const displayLimit = 10;
    const displayAssignments = report.assignments.slice(0, displayLimit);

    for (let i = 0; i < displayAssignments.length; i++) {
      const assignment = displayAssignments[i];
      console.log(`${i + 1}. User: ${assignment.user_id}`);
      console.log(`   Role Assigned: ${assignment.role_name}`);
      console.log(`   Reason: ${assignment.reason}`);
      console.log(`   Department Context: ${assignment.department_context}`);
      console.log(
        `   Permission Flags: create=${assignment.permission_flags.can_create_requests}, edit=${assignment.permission_flags.can_edit_requests}, submit=${assignment.permission_flags.can_submit_requests}, approve=${assignment.permission_flags.can_approve_requests}, view=${assignment.permission_flags.can_view_reports}`,
      );
      console.log('');
    }

    if (report.assignments.length > displayLimit) {
      console.log(
        `... and ${report.assignments.length - displayLimit} more assignments`,
      );
      console.log('(See full log in JSON export file)');
      console.log('');
    }
  }

  // Edge Cases
  if (report.edge_cases.length > 0) {
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('EDGE CASES (REQUIRE MANUAL REVIEW)');
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('');
    console.log(
      `⚠ WARNING: ${report.edge_cases.length} users require manual role assignment`,
    );
    console.log('');

    const displayLimit = 10;
    const displayEdgeCases = report.edge_cases.slice(0, displayLimit);

    for (let i = 0; i < displayEdgeCases.length; i++) {
      const edgeCase = displayEdgeCases[i];
      console.log(`${i + 1}. User: ${edgeCase.user_id}`);
      console.log(`   Department: ${edgeCase.department_id}`);
      console.log(`   Permissions: ${edgeCase.permission_combination}`);
      console.log(`   Reason: ${edgeCase.reason}`);
      console.log(`   Action: ${edgeCase.recommended_action}`);
      console.log('');
    }

    if (report.edge_cases.length > displayLimit) {
      console.log(
        `... and ${report.edge_cases.length - displayLimit} more edge cases`,
      );
      console.log('(See full list in JSON export file)');
      console.log('');
    }
  } else {
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('EDGE CASES');
    console.log(
      '─────────────────────────────────────────────────────────────',
    );
    console.log('');
    console.log('✓ No edge cases found - all users mapped to standard roles');
    console.log('');
  }

  // Next Steps
  console.log('─────────────────────────────────────────────────────────────');
  console.log('NEXT STEPS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');

  if (report.dry_run) {
    console.log('1. Review the assignments above');
    console.log('2. If satisfied, run again with --force to apply changes:');
    console.log(
      '   npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --force',
    );
  } else {
    console.log('✓ Role assignments completed successfully');
    console.log('');
    console.log('Next: Verify assignments before migration');
    console.log('1. Run audit script to confirm no users at risk:');
    console.log(
      '   npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts',
    );
    console.log('');
    console.log(
      '2. If edge cases exist, manually assign roles via RBAC interface',
    );
    console.log('');
    console.log('3. Once verified, proceed to Phase 3 (migration)');
  }

  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
}

/**
 * Export report to JSON file
 */
function exportToJSON(report: MappingReport, filePath: string) {
  const json = JSON.stringify(report, null, 2);
  fs.writeFileSync(filePath, json, 'utf-8');
  console.log(`✓ Full report exported to: ${filePath}`);
  console.log('');
}

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

function parseArgs(): {
  dryRun: boolean;
  force: boolean;
  showHelp: boolean;
} {
  const args = process.argv.slice(2);
  let dryRun = true; // Default to dry run for safety
  let force = false;
  let showHelp = false;

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      force = false;
    } else if (arg === '--force') {
      dryRun = false;
      force = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp = true;
    }
  }

  // If no flags provided, default to dry run
  if (args.length === 0) {
    dryRun = true;
  }

  return { dryRun, force, showHelp };
}

function showHelpMessage() {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  RBAC PERMISSION MAPPING SCRIPT');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Description:');
  console.log('  Maps department permission flags to RBAC role assignments.');
  console.log('  Assigns roles based on permission combinations.');
  console.log('  Idempotent: Safe to run multiple times.');
  console.log('');
  console.log('Usage:');
  console.log(
    '  npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts',
  );
  console.log(
    '  npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --dry-run',
  );
  console.log(
    '  npx ts-node apps/api/src/database/scripts/map-department-permissions-to-rbac.ts --force',
  );
  console.log('');
  console.log('Options:');
  console.log(
    '  --dry-run       Preview assignments without writing (DEFAULT)',
  );
  console.log('  --force         Execute assignments (writes to database)');
  console.log('  --help, -h      Show this help message');
  console.log('');
  console.log('Role Assignment Logic:');
  console.log(
    '  - All 5 permissions (incl. approve) → admin or supervisor role',
  );
  console.log('  - Including approve permission → supervisor role');
  console.log('  - Basic permissions (create, edit, submit) → staff role');
  console.log('  - Minimal permissions → user role');
  console.log('  - Custom combinations → edge case (manual review)');
  console.log('');
  console.log('Output:');
  console.log('  - Console report with statistics');
  console.log('  - JSON log: /tmp/rbac-permission-mapping-log.json');
  console.log('');
  console.log('Part of: RBAC Permission Consolidation');
  console.log('Spec: .spec-workflow/specs/rbac-permission-consolidation/');
  console.log('');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const { dryRun, force, showHelp } = parseArgs();

  if (showHelp) {
    showHelpMessage();
    await db.destroy();
    process.exit(0);
  }

  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  RUNNING RBAC PERMISSION MAPPING');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Database:', connectionConfig.database);
  console.log('Host:', connectionConfig.host);
  console.log('Port:', connectionConfig.port);
  console.log('');
  console.log(
    `Mode: ${dryRun ? 'DRY RUN (preview only)' : 'EXECUTE (will write to database)'}`,
  );
  console.log('');

  if (!dryRun && !force) {
    console.error('✗ Error: Must specify --force to write to database');
    console.error('For safety, run with --dry-run first to preview changes');
    await db.destroy();
    process.exit(1);
  }

  try {
    // Verify tables exist
    const hasUserDepartments = await db.schema.hasTable('user_departments');
    const hasUserRoles = await db.schema.hasTable('user_roles');
    const hasRoles = await db.schema.hasTable('roles');

    if (!hasUserDepartments) {
      console.error('✗ Error: user_departments table not found');
      await db.destroy();
      process.exit(1);
    }

    if (!hasUserRoles) {
      console.error('✗ Error: user_roles table not found');
      await db.destroy();
      process.exit(1);
    }

    if (!hasRoles) {
      console.error('✗ Error: roles table not found');
      await db.destroy();
      process.exit(1);
    }

    // Execute mapping
    const report = await mapPermissionsToRoles(dryRun);

    // Print report
    printReport(report);

    // Export to JSON
    const exportPath = '/tmp/rbac-permission-mapping-log.json';
    exportToJSON(report, exportPath);

    console.log('✓ Mapping completed successfully');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('✗ Mapping failed:', error);
    console.error('');
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the script
main();
