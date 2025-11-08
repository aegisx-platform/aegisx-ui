import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create roles table with RBAC enhancements
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 50).unique().notNullable();
    table.string('description', 255);
    table.boolean('is_active').defaultTo(true).notNullable();
    table.boolean('is_system_role').defaultTo(false).notNullable();
    table.string('category', 50);
    table.integer('hierarchy_level').defaultTo(0).notNullable();

    // Role hierarchy support - allows parent-child relationships between roles
    table
      .uuid('parent_id')
      .nullable()
      .references('id')
      .inTable('roles')
      .onDelete('SET NULL')
      .comment('Parent role ID for role hierarchy/inheritance');

    table.timestamps(true, true);

    // Indexes for performance
    table.index('is_active');
    table.index('is_system_role');
    table.index('category');
    table.index('hierarchy_level');
    table.index('parent_id');
  });

  // Insert system roles - UUID will be auto-generated
  await knex('roles').insert([
    {
      name: 'admin',
      description: 'Administrator with full system access',
    },
    {
      name: 'user',
      description: 'Regular user with limited access',
    },
    {
      name: 'moderator',
      description: 'Moderator with elevated permissions',
    },
  ]);

  // Log created roles
  console.log('✅ Created roles and permissions tables');
  console.log('✅ Inserted system roles: admin, user, moderator');

  // Create permissions table with complete RBAC schema
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('resource', 100).notNullable();
    table.string('action', 50).notNullable();
    table.string('description', 255);

    // Permission categorization and status fields
    table.string('category', 50).defaultTo('general').notNullable();
    table.boolean('is_system_permission').defaultTo(false).notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.text('conditions').nullable();

    table.timestamps(true, true);

    // Create unique constraint on resource + action
    table.unique(['resource', 'action']);
  });

  // Create role_permissions junction table
  await knex.schema.createTable('role_permissions', (table) => {
    table.uuid('role_id').notNullable();
    table.uuid('permission_id').notNullable();
    table.timestamps(true, true);

    // Foreign keys
    table
      .foreign('role_id')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
    table
      .foreign('permission_id')
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE');

    // Composite primary key
    table.primary(['role_id', 'permission_id']);
  });

  // Create indexes for better performance
  await knex.schema.alterTable('permissions', (table) => {
    table.index('resource');
    table.index('action');
    table.index('category');
    table.index('is_system_permission');
    table.index('is_active');
  });

  // Create user_roles junction table for multi-role support
  // Only create if users table exists
  const hasUsersTable = await knex.schema.hasTable('users');

  if (hasUsersTable) {
    await knex.schema.createTable('user_roles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('role_id')
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE');

      // Role assignment metadata
      table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now());
      table
        .uuid('assigned_by')
        .nullable()
        .comment('User ID who assigned this role');
      table
        .timestamp('expires_at')
        .nullable()
        .comment('When this role assignment expires');
      table.boolean('is_active').defaultTo(true).notNullable();

      table.timestamps(true, true);

      // Indexes for better query performance
      table.index('user_id');
      table.index('role_id');
      table.index('is_active');
      table.index('expires_at');
      table.unique(['user_id', 'role_id']);
    });

    console.log('✅ Created user_roles table for multi-role support');

    // Populate initial user_roles for existing users
    // Find default 'user' role
    const defaultRole = await knex('roles').where('name', 'user').first();

    if (defaultRole) {
      // Get all users without role assignments
      const usersWithoutRoles = await knex('users')
        .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
        .where('user_roles.user_id', null)
        .select('users.id');

      if (usersWithoutRoles.length > 0) {
        // Assign default user role to all users
        const userRoleAssignments = usersWithoutRoles.map((user) => ({
          user_id: user.id,
          role_id: defaultRole.id,
          assigned_at: new Date(),
          assigned_by: null, // System migration
          is_active: true,
        }));

        await knex('user_roles').insert(userRoleAssignments);
        console.log(
          `✅ Assigned default 'user' role to ${usersWithoutRoles.length} existing users`,
        );
      }
    } else {
      console.warn(
        '⚠️  Warning: Default "user" role not found during migration',
      );
    }
  } else {
    console.warn(
      '⚠️  Warning: users table not found. Skipping user_roles creation.',
    );
    console.info(
      'ℹ️  user_roles table will be created once users table exists',
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
}
