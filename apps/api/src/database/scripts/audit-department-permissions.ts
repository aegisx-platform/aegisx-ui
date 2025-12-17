/**
 * Pre-Migration Audit Script: Department Permissions
 *
 * Analyzes user_departments permission flags before migrating to RBAC system.
 * Identifies users at risk of losing access during migration.
 *
 * Part of: RBAC Permission Consolidation (Task 3)
 * Spec: .spec-workflow/specs/auth-rbac-improvements/
 *
 * Usage:
 *   npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts
 *   npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --export
 *
 * Options:
 *   --export, -e    Export results to JSON file (/tmp/department-permissions-audit.json)
 *   --help, -h      Show this help message
 *
 * Output:
 *   - Console report with statistics and recommendations
 *   - Optional JSON file with detailed user records
 *
 * Read-only: This script does NOT modify any data
 */

import knex from 'knex';
import { config } from 'dotenv';
import * as fs from 'fs';

// Load environment (same pattern as inventory-import-tmt.ts)
config();
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local', override: true });
}

// Connection config (same pattern as inventory-import-tmt.ts)
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

interface PermissionStats {
  flag: string;
  count: number;
  percentage: number;
}

interface UserAtRisk {
  user_id: string;
  email: string;
  username: string;
  department_id: number;
  department_name: string;
  is_primary: boolean;
  can_create_requests: boolean;
  can_edit_requests: boolean;
  can_submit_requests: boolean;
  can_approve_requests: boolean;
  can_view_reports: boolean;
  valid_from: string | null;
  valid_until: string | null;
  assigned_at: string;
}

interface AuditReport {
  audit_date: string;
  total_records: number;
  total_active_records: number;
  total_unique_users: number;
  permission_flags: PermissionStats[];
  users_without_rbac: {
    count: number;
    users: UserAtRisk[];
  };
  recommendations: string[];
}

/**
 * Parse command-line arguments
 */
function parseArgs(): { exportToFile: boolean; showHelp: boolean } {
  const args = process.argv.slice(2);
  let exportToFile = false;
  let showHelp = false;

  for (const arg of args) {
    if (arg === '--export' || arg === '-e') {
      exportToFile = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp = true;
    }
  }

  return { exportToFile, showHelp };
}

/**
 * Show help message
 */
function showHelpMessage() {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  DEPARTMENT PERMISSIONS AUDIT SCRIPT');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Description:');
  console.log(
    '  Analyzes user_departments permission flags before RBAC migration.',
  );
  console.log('  Identifies users at risk of losing access.');
  console.log('');
  console.log('Usage:');
  console.log(
    '  npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts',
  );
  console.log(
    '  npx ts-node apps/api/src/database/scripts/audit-department-permissions.ts --export',
  );
  console.log('');
  console.log('Options:');
  console.log(
    '  --export, -e    Export results to /tmp/department-permissions-audit.json',
  );
  console.log('  --help, -h      Show this help message');
  console.log('');
  console.log('Part of: RBAC Permission Consolidation');
  console.log('Spec: .spec-workflow/specs/auth-rbac-improvements/');
  console.log('');
}

/**
 * Get total user-department records
 */
async function getTotalRecords(): Promise<{
  total: number;
  active: number;
}> {
  const [totalResult, activeResult] = await Promise.all([
    db('user_departments').count('* as count').first(),
    db('user_departments')
      .where(function () {
        this.whereNull('valid_until').orWhere('valid_until', '>=', db.fn.now());
      })
      .andWhere(function () {
        this.whereNull('valid_from').orWhere('valid_from', '<=', db.fn.now());
      })
      .count('* as count')
      .first(),
  ]);

  return {
    total: parseInt(totalResult?.count as string) || 0,
    active: parseInt(activeResult?.count as string) || 0,
  };
}

/**
 * Get unique user count
 */
async function getTotalUniqueUsers(): Promise<number> {
  const result = await db('user_departments')
    .countDistinct('user_id as count')
    .first();
  return parseInt(result?.count as string) || 0;
}

/**
 * Get permission flag statistics
 */
async function getPermissionStats(
  totalRecords: number,
): Promise<PermissionStats[]> {
  const flags = [
    'can_create_requests',
    'can_edit_requests',
    'can_submit_requests',
    'can_approve_requests',
    'can_view_reports',
  ];

  const stats: PermissionStats[] = [];

  for (const flag of flags) {
    const result = await db('user_departments')
      .where(flag, true)
      .count('* as count')
      .first();

    const count = parseInt(result?.count as string) || 0;
    const percentage = totalRecords > 0 ? (count / totalRecords) * 100 : 0;

    stats.push({
      flag,
      count,
      percentage,
    });
  }

  return stats;
}

/**
 * Get users with department permissions but NO RBAC roles
 */
async function getUsersWithoutRBAC(): Promise<UserAtRisk[]> {
  // user_departments.department_id references public.departments
  const users = await db('user_departments as ud')
    .leftJoin('user_roles as ur', 'ud.user_id', 'ur.user_id')
    .leftJoin('users as u', 'ud.user_id', 'u.id')
    .leftJoin('departments as d', 'ud.department_id', 'd.id')
    .whereNull('ur.user_id') // Users without ANY role assignment
    .select(
      'ud.user_id',
      'u.email',
      'u.username',
      'ud.department_id',
      'd.dept_name as department_name',
      'ud.is_primary',
      'ud.can_create_requests',
      'ud.can_edit_requests',
      'ud.can_submit_requests',
      'ud.can_approve_requests',
      'ud.can_view_reports',
      'ud.valid_from',
      'ud.valid_until',
      'ud.assigned_at',
    )
    .orderBy('u.email');

  return users as UserAtRisk[];
}

/**
 * Generate recommendations based on audit results
 */
function generateRecommendations(report: AuditReport): string[] {
  const recommendations: string[] = [];

  // Check for users without RBAC roles
  if (report.users_without_rbac.count > 0) {
    recommendations.push(
      `Assign RBAC roles to ${report.users_without_rbac.count} users before migration to prevent access loss`,
    );

    // Count users with specific permissions
    const createCount = report.users_without_rbac.users.filter(
      (u) => u.can_create_requests,
    ).length;
    const editCount = report.users_without_rbac.users.filter(
      (u) => u.can_edit_requests,
    ).length;
    const submitCount = report.users_without_rbac.users.filter(
      (u) => u.can_submit_requests,
    ).length;
    const approveCount = report.users_without_rbac.users.filter(
      (u) => u.can_approve_requests,
    ).length;
    const viewReportsCount = report.users_without_rbac.users.filter(
      (u) => u.can_view_reports,
    ).length;

    if (createCount > 0) {
      recommendations.push(
        `  → ${createCount} users need 'budget-requests:create' permission`,
      );
    }
    if (editCount > 0) {
      recommendations.push(
        `  → ${editCount} users need 'budget-requests:update' permission`,
      );
    }
    if (submitCount > 0) {
      recommendations.push(
        `  → ${submitCount} users need 'budget-requests:submit' permission`,
      );
    }
    if (approveCount > 0) {
      recommendations.push(
        `  → ${approveCount} users need 'budget-requests:approve' permission`,
      );
    }
    if (viewReportsCount > 0) {
      recommendations.push(
        `  → ${viewReportsCount} users need 'reports:view' permission`,
      );
    }
  } else {
    recommendations.push('✓ All users have RBAC role assignments');
  }

  // Check for inactive records
  const inactiveRecords = report.total_records - report.total_active_records;
  if (inactiveRecords > 0) {
    recommendations.push(
      `${inactiveRecords} inactive user-department records found (expired or future-dated)`,
    );
    recommendations.push(
      '  → Consider archiving these records before migration',
    );
  }

  // Permission usage analysis
  const createPerm = report.permission_flags.find(
    (p) => p.flag === 'can_create_requests',
  );
  const approvePerm = report.permission_flags.find(
    (p) => p.flag === 'can_approve_requests',
  );

  if (createPerm && createPerm.percentage > 90) {
    recommendations.push(
      `${createPerm.percentage.toFixed(1)}% of users have 'can_create_requests' enabled`,
    );
    recommendations.push(
      '  → Consider making this a default permission in RBAC',
    );
  }

  if (approvePerm && approvePerm.percentage < 10) {
    recommendations.push(
      `Only ${approvePerm.percentage.toFixed(1)}% of users have 'can_approve_requests' enabled`,
    );
    recommendations.push(
      '  → This should remain a restricted permission in RBAC',
    );
  }

  return recommendations;
}

/**
 * Print formatted report to console
 */
function printReport(report: AuditReport) {
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  DEPARTMENT PERMISSIONS AUDIT REPORT');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log(`Audit Date: ${report.audit_date}`);
  console.log('');

  // Summary Statistics
  console.log('─────────────────────────────────────────────────────────────');
  console.log('SUMMARY STATISTICS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log(`Total User-Department Records:    ${report.total_records}`);
  console.log(
    `Active Records (current):          ${report.total_active_records}`,
  );
  console.log(
    `Inactive Records (expired/future): ${report.total_records - report.total_active_records}`,
  );
  console.log(
    `Total Unique Users:                ${report.total_unique_users}`,
  );
  console.log('');

  // Permission Flag Statistics
  console.log('─────────────────────────────────────────────────────────────');
  console.log('PERMISSION FLAG STATISTICS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('Flag                       | Count | Percentage');
  console.log('─────────────────────────────────────────────────────────────');

  for (const stat of report.permission_flags) {
    const flagName = stat.flag.padEnd(26);
    const count = stat.count.toString().padStart(5);
    const percentage = `${stat.percentage.toFixed(1)}%`.padStart(10);
    console.log(`${flagName} | ${count} | ${percentage}`);
  }
  console.log('');

  // Users Without RBAC Roles
  console.log('─────────────────────────────────────────────────────────────');
  console.log('USERS WITHOUT RBAC ROLES (AT RISK)');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');

  if (report.users_without_rbac.count === 0) {
    console.log('✓ No users at risk - all users have RBAC role assignments');
  } else {
    console.log(`⚠ WARNING: ${report.users_without_rbac.count} users found`);
    console.log('');
    console.log('These users have department permissions but NO RBAC roles.');
    console.log(
      'They will lose access unless roles are assigned before migration.',
    );
    console.log('');

    // Show first 10 users in detail
    const displayLimit = 10;
    const displayUsers = report.users_without_rbac.users.slice(0, displayLimit);

    for (let i = 0; i < displayUsers.length; i++) {
      const user = displayUsers[i];
      console.log(`${i + 1}. ${user.email} (${user.username || 'N/A'})`);
      console.log(`   User ID: ${user.user_id}`);
      console.log(
        `   Department: ${user.department_name} (#${user.department_id})${user.is_primary ? ' [PRIMARY]' : ''}`,
      );
      console.log('   Permissions:');
      console.log(
        `     - Create Requests:  ${user.can_create_requests ? '✓' : '✗'}`,
      );
      console.log(
        `     - Edit Requests:    ${user.can_edit_requests ? '✓' : '✗'}`,
      );
      console.log(
        `     - Submit Requests:  ${user.can_submit_requests ? '✓' : '✗'}`,
      );
      console.log(
        `     - Approve Requests: ${user.can_approve_requests ? '✓' : '✗'}`,
      );
      console.log(
        `     - View Reports:     ${user.can_view_reports ? '✓' : '✗'}`,
      );
      console.log(
        `   Valid: ${user.valid_from || 'immediate'} to ${user.valid_until || 'indefinite'}`,
      );
      console.log('');
    }

    if (report.users_without_rbac.count > displayLimit) {
      console.log(
        `... and ${report.users_without_rbac.count - displayLimit} more users`,
      );
      console.log('(Use --export flag to see complete list in JSON file)');
      console.log('');
    }
  }

  // Recommendations
  console.log('─────────────────────────────────────────────────────────────');
  console.log('RECOMMENDATIONS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');

  if (report.recommendations.length === 0) {
    console.log('✓ No issues found - system is ready for migration');
  } else {
    for (let i = 0; i < report.recommendations.length; i++) {
      const rec = report.recommendations[i];
      if (rec.startsWith('  →')) {
        console.log(rec);
      } else {
        console.log(`${i + 1}. ${rec}`);
      }
    }
  }

  console.log('');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('PERMISSION MAPPING (for reference)');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
  console.log('Department Flag             → RBAC Permission');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('can_create_requests         → budget-requests:create');
  console.log('can_edit_requests           → budget-requests:update');
  console.log('can_submit_requests         → budget-requests:submit');
  console.log('can_approve_requests        → budget-requests:approve');
  console.log('can_view_reports            → reports:view');
  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
}

/**
 * Export report to JSON file
 */
function exportToJSON(report: AuditReport, filePath: string) {
  const json = JSON.stringify(report, null, 2);
  fs.writeFileSync(filePath, json, 'utf-8');
  console.log(`✓ Report exported to: ${filePath}`);
  console.log('');
}

/**
 * Main execution
 */
async function main() {
  const { exportToFile, showHelp } = parseArgs();

  if (showHelp) {
    showHelpMessage();
    await db.destroy();
    process.exit(0);
  }

  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('  RUNNING DEPARTMENT PERMISSIONS AUDIT');
  console.log(
    '═══════════════════════════════════════════════════════════════',
  );
  console.log('');
  console.log('Database:', connectionConfig.database);
  console.log('Host:', connectionConfig.host);
  console.log('Port:', connectionConfig.port);
  console.log('');
  console.log('Analyzing user_departments table...');
  console.log('Read-only operation - no data will be modified');
  console.log('');

  try {
    // Verify tables exist
    const hasUserDepartments = await db.schema.hasTable('user_departments');
    const hasUserRoles = await db.schema.hasTable('user_roles');
    const hasUsers = await db.schema.hasTable('users');

    if (!hasUserDepartments) {
      console.error('✗ Error: user_departments table not found');
      await db.destroy();
      process.exit(1);
    }

    if (!hasUserRoles) {
      console.warn('⚠ Warning: user_roles table not found');
      console.warn('  All users will be flagged as at-risk');
      console.log('');
    }

    if (!hasUsers) {
      console.error('✗ Error: users table not found');
      await db.destroy();
      process.exit(1);
    }

    // Gather audit data
    console.log('Collecting statistics...');
    const records = await getTotalRecords();
    const uniqueUsers = await getTotalUniqueUsers();
    const permissionStats = await getPermissionStats(records.total);

    console.log('Identifying users at risk...');
    const usersWithoutRBAC = await getUsersWithoutRBAC();

    // Build report
    const report: AuditReport = {
      audit_date: new Date().toISOString(),
      total_records: records.total,
      total_active_records: records.active,
      total_unique_users: uniqueUsers,
      permission_flags: permissionStats,
      users_without_rbac: {
        count: usersWithoutRBAC.length,
        users: usersWithoutRBAC,
      },
      recommendations: [],
    };

    // Generate recommendations
    report.recommendations = generateRecommendations(report);

    // Print to console
    printReport(report);

    // Export to file if requested
    if (exportToFile) {
      const exportPath = '/tmp/department-permissions-audit.json';
      exportToJSON(report, exportPath);
    }

    console.log('✓ Audit completed successfully');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('✗ Audit failed:', error);
    console.error('');
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

// Run the script
main();
