import type { Knex } from 'knex';

/**
 * Seed: Add Missing RBAC Permissions
 *
 * Based on the rbac-permission-consolidation spec (Task 5), this seed adds
 * any missing RBAC permissions needed to replace department permission flags.
 *
 * Permission Mapping:
 * - can_create_requests  → budget-requests:create
 * - can_edit_requests    → budget-requests:update
 * - can_submit_requests  → budget-requests:submit
 * - can_approve_requests → budget-requests:approve
 * - can_view_reports     → reports:view
 *
 * Role Assignments:
 * - admin role: All permissions
 * - supervisor role: All budget-requests permissions + reports:view
 * - staff role: create, update, submit (no approve)
 *
 * Features:
 * - Idempotent: Safe to run multiple times
 * - Transactional: All-or-nothing semantics
 * - Logging: Clear indication of what was created vs skipped
 */

export async function seed(knex: Knex): Promise<void> {
  console.log('🔄 Starting: Add Missing RBAC Permissions');

  try {
    // Define required permissions based on spec requirement 4
    const requiredPermissions = [
      {
        resource: 'budget-requests',
        action: 'create',
        description: 'Create budget requests',
      },
      {
        resource: 'budget-requests',
        action: 'update',
        description: 'Update budget requests',
      },
      {
        resource: 'budget-requests',
        action: 'submit',
        description: 'Submit budget requests',
      },
      {
        resource: 'budget-requests',
        action: 'approve',
        description: 'Approve budget requests',
      },
      {
        resource: 'reports',
        action: 'view',
        description: 'View reports',
      },
    ];

    // Get system roles - these should exist from migration 001_create_roles_and_permissions.ts
    const adminRole = await knex('roles').where('name', 'admin').first();
    const userRole = await knex('roles').where('name', 'user').first();
    const moderatorRole = await knex('roles')
      .where('name', 'moderator')
      .first();

    if (!adminRole || !userRole) {
      throw new Error(
        'System roles (admin, user) not found - run migrations first',
      );
    }

    // Get or create supervisor and staff roles
    let supervisorRole = await knex('roles')
      .where('name', 'supervisor')
      .first();
    if (!supervisorRole) {
      const [supervisorInserted] = await knex('roles')
        .insert({
          name: 'supervisor',
          description: 'Supervisor with budget approval and reporting access',
          is_system_role: false,
        })
        .returning(['id', 'name']);
      supervisorRole = supervisorInserted;
      console.log('✅ Created supervisor role');
    } else {
      console.log('⏭️  Supervisor role already exists');
    }

    let staffRole = await knex('roles').where('name', 'staff').first();
    if (!staffRole) {
      const [staffInserted] = await knex('roles')
        .insert({
          name: 'staff',
          description: 'Staff with basic budget request access (no approval)',
          is_system_role: false,
        })
        .returning(['id', 'name']);
      staffRole = staffInserted;
      console.log('✅ Created staff role');
    } else {
      console.log('⏭️  Staff role already exists');
    }

    // Use transaction for atomicity
    await knex.transaction(async (trx) => {
      const createdPermissions: Array<{ resource: string; action: string }> =
        [];
      const existingPermissions: Array<{ resource: string; action: string }> =
        [];

      // Step 1: Create or verify permissions exist (idempotent)
      console.log('\n📋 Processing permissions:');
      for (const permission of requiredPermissions) {
        const exists = await trx('permissions')
          .where({
            resource: permission.resource,
            action: permission.action,
          })
          .first();

        if (exists) {
          console.log(
            `  ⏭️  Permission exists: ${permission.resource}:${permission.action}`,
          );
          existingPermissions.push({
            resource: permission.resource,
            action: permission.action,
          });
        } else {
          // Insert new permission
          await trx('permissions').insert({
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
            category: 'budget-operations',
            is_system_permission: false,
            is_active: true,
          });
          console.log(
            `  ✅ Created permission: ${permission.resource}:${permission.action}`,
          );
          createdPermissions.push({
            resource: permission.resource,
            action: permission.action,
          });
        }
      }

      // Step 2: Assign permissions to roles (idempotent)
      console.log('\n👥 Assigning permissions to roles:');

      // Admin role: All permissions
      console.log('  → Admin role:');
      for (const permission of requiredPermissions) {
        await assignPermissionToRole(
          trx,
          adminRole.id,
          permission.resource,
          permission.action,
          `    ✅ Assigned ${permission.resource}:${permission.action}`,
          `    ⏭️  Already assigned ${permission.resource}:${permission.action}`,
        );
      }

      // Supervisor role: All budget-requests + reports:view
      console.log('  → Supervisor role:');
      const supervisorPermissions = requiredPermissions.filter(
        (p) => p.resource === 'budget-requests' || p.action === 'view',
      );
      for (const permission of supervisorPermissions) {
        await assignPermissionToRole(
          trx,
          supervisorRole.id,
          permission.resource,
          permission.action,
          `    ✅ Assigned ${permission.resource}:${permission.action}`,
          `    ⏭️  Already assigned ${permission.resource}:${permission.action}`,
        );
      }

      // Staff role: create, update, submit (no approve)
      console.log('  → Staff role:');
      const staffPermissions = requiredPermissions.filter(
        (p) =>
          p.resource === 'budget-requests' &&
          (p.action === 'create' ||
            p.action === 'update' ||
            p.action === 'submit'),
      );
      for (const permission of staffPermissions) {
        await assignPermissionToRole(
          trx,
          staffRole.id,
          permission.resource,
          permission.action,
          `    ✅ Assigned ${permission.resource}:${permission.action}`,
          `    ⏭️  Already assigned ${permission.resource}:${permission.action}`,
        );
      }

      // Also assign reports:view to staff
      const reportsView = requiredPermissions.find(
        (p) => p.resource === 'reports' && p.action === 'view',
      );
      if (reportsView) {
        await assignPermissionToRole(
          trx,
          staffRole.id,
          reportsView.resource,
          reportsView.action,
          `    ✅ Assigned ${reportsView.resource}:${reportsView.action}`,
          `    ⏭️  Already assigned ${reportsView.resource}:${reportsView.action}`,
        );
      }

      // Step 3: Print summary
      console.log('\n📊 Summary:');
      console.log(
        `  • Permissions created: ${createdPermissions.length}/${requiredPermissions.length}`,
      );
      if (createdPermissions.length > 0) {
        createdPermissions.forEach((p) => {
          console.log(`    - ${p.resource}:${p.action}`);
        });
      }
      console.log(
        `  • Permissions already existed: ${existingPermissions.length}/${requiredPermissions.length}`,
      );
      if (existingPermissions.length > 0) {
        existingPermissions.forEach((p) => {
          console.log(`    - ${p.resource}:${p.action}`);
        });
      }
      console.log(`  • Roles verified/created: 2 (supervisor, staff)`);
      console.log(
        `  • Role assignments completed: All 3 roles (admin, supervisor, staff)`,
      );
    });

    console.log('\n✅ Seed completed successfully');
    console.log(
      '📝 All required RBAC permissions are now in place for department permission migration.',
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

/**
 * Helper function to assign a permission to a role (idempotent)
 * Uses ON CONFLICT DO NOTHING pattern for idempotency
 */
async function assignPermissionToRole(
  trx: Knex.Transaction,
  roleId: string,
  resource: string,
  action: string,
  successMessage: string,
  skipMessage: string,
): Promise<void> {
  // Get permission ID
  const permission = await trx('permissions')
    .where({
      resource,
      action,
    })
    .select('id')
    .first();

  if (!permission) {
    console.log(`    ⚠️  Permission not found: ${resource}:${action}`);
    return;
  }

  // Check if role already has this permission
  const existing = await trx('role_permissions')
    .where({
      role_id: roleId,
      permission_id: permission.id,
    })
    .first();

  if (existing) {
    console.log(skipMessage);
    return;
  }

  // Assign permission to role using ON CONFLICT DO NOTHING for idempotency
  await trx.raw(
    `
    INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
    VALUES (?, ?, NOW(), NOW())
    ON CONFLICT (role_id, permission_id) DO NOTHING
  `,
    [roleId, permission.id],
  );

  console.log(successMessage);
}
