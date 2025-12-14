import type { Knex } from 'knex';

/**
 * Migration: Update user_departments foreign key
 *
 * Updates the department_id foreign key to point to public.departments
 * instead of inventory.departments. This aligns with the unified
 * department management in the public schema.
 *
 * Part of: Department Management System (Week 1: Database Layer)
 *
 * Changes:
 * - Drops existing FK constraint pointing to inventory.departments
 * - Adds new FK constraint pointing to public.departments
 * - Maintains CASCADE delete behavior for data integrity
 */

export async function up(knex: Knex): Promise<void> {
  // Check if user_departments table exists
  const hasTable = await knex.schema.hasTable('user_departments');
  if (!hasTable) {
    console.log('user_departments table not found, skipping FK update');
    return;
  }

  // Drop old FK if exists (to inventory.departments)
  await knex.raw(`
    ALTER TABLE user_departments
    DROP CONSTRAINT IF EXISTS user_departments_department_id_fkey
  `);

  // Add new FK to public.departments
  await knex.raw(`
    ALTER TABLE user_departments
    ADD CONSTRAINT user_departments_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Check if user_departments table exists
  const hasTable = await knex.schema.hasTable('user_departments');
  if (!hasTable) {
    console.log('user_departments table not found, skipping FK revert');
    return;
  }

  // Reverse: point back to inventory.departments
  await knex.raw(`
    ALTER TABLE user_departments
    DROP CONSTRAINT IF EXISTS user_departments_department_id_fkey
  `);

  await knex.raw(`
    ALTER TABLE user_departments
    ADD CONSTRAINT user_departments_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES inventory.departments(id) ON DELETE CASCADE
  `);
}
