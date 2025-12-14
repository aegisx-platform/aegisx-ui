import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Check if source table exists
  const hasInventoryDepts = await knex.schema
    .withSchema('inventory')
    .hasTable('departments');

  if (!hasInventoryDepts) {
    console.log('inventory.departments not found, skipping data migration');
    return;
  }

  // Check if target already has data
  const existingCount = await knex('departments').count('id as count').first();

  if (existingCount && Number(existingCount.count) > 0) {
    console.log('public.departments already has data, skipping migration');
    return;
  }

  // Check if source has any data
  const sourceCount = await knex('inventory.departments')
    .count('id as count')
    .first();

  if (!sourceCount || Number(sourceCount.count) === 0) {
    console.log('inventory.departments is empty, skipping data migration');
    return;
  }

  // Copy data from inventory.departments to public.departments
  // Only copy core fields, exclude inventory-specific fields: consumption_group, his_code, hospital_id
  await knex.raw(`
    INSERT INTO departments (id, dept_code, dept_name, parent_id, is_active, created_at, updated_at)
    SELECT id, dept_code, dept_name, parent_id, is_active, created_at, updated_at
    FROM inventory.departments
    WHERE is_active = true OR id IN (SELECT parent_id FROM inventory.departments WHERE parent_id IS NOT NULL)
    ORDER BY parent_id NULLS FIRST, id
  `);

  // Reset sequence to ensure future inserts use correct IDs (only if data was migrated)
  const migratedCount = await knex('departments').count('id as count').first();

  if (migratedCount && Number(migratedCount.count) > 0) {
    await knex.raw(
      `SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments))`,
    );
  }

  console.log(
    'Successfully migrated departments data from inventory to public schema',
  );
}

export async function down(knex: Knex): Promise<void> {
  // Do NOT delete data - too risky to rollback a data migration
  console.log(
    'Down migration for data migration skipped - data preservation required',
  );
}
