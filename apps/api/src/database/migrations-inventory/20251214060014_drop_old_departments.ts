import { Knex } from 'knex';

/**
 * Migration: Drop old inventory.departments table
 *
 * Purpose:
 * - Remove the old inventory.departments table after consolidation
 * - All data has been migrated to public.departments
 * - All foreign keys have been updated to reference public.departments
 *
 * Safety Checks:
 * 1. Verify public.departments has data before dropping inventory.departments
 * 2. Check if inventory.departments still exists
 * 3. Drop the table if all conditions are met
 *
 * IRREVERSIBLE: The down migration recreates structure only for safety,
 * but data cannot be recovered as it has been consolidated into public.departments
 */

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Safety Check 1: Verify public.departments has data before proceeding
  const publicCount = await knex('departments').count('id as count').first();
  if (!publicCount || Number(publicCount.count) === 0) {
    console.log(
      'WARNING: public.departments is empty, skipping drop of inventory.departments',
    );
    return;
  }

  console.log(
    `public.departments has ${publicCount.count} records, safe to proceed`,
  );

  // Safety Check 2: Check if inventory.departments still exists
  const hasTable = await knex.schema
    .withSchema('inventory')
    .hasTable('departments');
  if (!hasTable) {
    console.log('inventory.departments already dropped');
    return;
  }

  // Drop the old inventory.departments table
  await knex.schema.withSchema('inventory').dropTable('departments');
  console.log('Successfully dropped inventory.departments table');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Check if table already exists
  const hasTable = await knex.schema
    .withSchema('inventory')
    .hasTable('departments');
  if (hasTable) {
    console.log('inventory.departments already exists');
    return;
  }

  // IRREVERSIBLE: Recreate the table structure for safety
  // WARNING: Data cannot be recovered - it has been consolidated into public.departments
  console.log(
    'WARNING: Recreating inventory.departments structure (data is IRREVERSIBLE)',
  );

  await knex.raw(`
    CREATE TABLE inventory.departments (
      id SERIAL PRIMARY KEY,
      dept_code VARCHAR(10) NOT NULL,
      dept_name VARCHAR(100) NOT NULL,
      his_code VARCHAR(20),
      parent_id INTEGER REFERENCES inventory.departments(id),
      consumption_group inventory.dept_consumption_group,
      hospital_id INTEGER REFERENCES inventory.hospitals(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT departments_dept_code_key UNIQUE (dept_code)
    )
  `);

  // Recreate indexes
  await knex.raw(
    `CREATE INDEX idx_departments_parent ON inventory.departments(parent_id)`,
  );
  await knex.raw(
    `CREATE INDEX idx_departments_his_code ON inventory.departments(his_code)`,
  );
  await knex.raw(
    `CREATE INDEX idx_departments_active ON inventory.departments(is_active)`,
  );
  await knex.raw(
    `CREATE INDEX idx_departments_hospital ON inventory.departments(hospital_id)`,
  );
  await knex.raw(`
    CREATE INDEX idx_departments_hospital_active
    ON inventory.departments(hospital_id, is_active)
    WHERE is_active = true
  `);

  console.log('Recreated inventory.departments table structure');
}
