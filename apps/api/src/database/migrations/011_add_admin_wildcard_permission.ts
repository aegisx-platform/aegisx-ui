import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add wildcard permission for admin access
  const [wildcardPermission] = await knex('permissions')
    .insert({
      resource: '*',
      action: '*',
      description: 'Full administrative access to all resources and actions',
    })
    .returning(['id']);

  // Get admin role
  const adminRole = await knex('roles').where({ name: 'admin' }).first();

  if (adminRole && wildcardPermission) {
    // Check if this permission is already assigned to admin role
    const existingAssignment = await knex('role_permissions')
      .where({
        role_id: adminRole.id,
        permission_id: wildcardPermission.id,
      })
      .first();

    if (!existingAssignment) {
      // Assign wildcard permission to admin role
      await knex('role_permissions').insert({
        role_id: adminRole.id,
        permission_id: wildcardPermission.id,
      });
    }
  }

  console.log('✅ Added admin wildcard permission (*:*)');
}

export async function down(knex: Knex): Promise<void> {
  // Remove wildcard permission
  await knex('permissions').where({ resource: '*', action: '*' }).del();

  console.log('✅ Removed admin wildcard permission');
}
