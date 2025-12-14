import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Define tables that need FK updates
  const tables = [
    {
      table: 'budget_allocations',
      column: 'department_id',
      constraint: 'budget_allocations_department_id_fkey',
    },
    {
      table: 'budget_plans',
      column: 'department_id',
      constraint: 'budget_plans_department_id_fkey',
    },
    {
      table: 'purchase_requests',
      column: 'department_id',
      constraint: 'purchase_requests_department_id_fkey',
    },
    {
      table: 'drug_distributions',
      column: 'requesting_dept_id',
      constraint: 'drug_distributions_requesting_dept_id_fkey',
    },
    {
      table: 'drug_returns',
      column: 'department_id',
      constraint: 'drug_returns_department_id_fkey',
    },
  ];

  // Update FK constraints for each table
  for (const { table, column, constraint } of tables) {
    // Check if table exists in inventory schema
    const hasTable = await knex.schema.withSchema('inventory').hasTable(table);
    if (!hasTable) {
      console.log(`Table inventory.${table} does not exist, skipping...`);
      continue;
    }

    // Drop old FK constraint if it exists
    await knex.raw(`
      ALTER TABLE inventory.${table}
      DROP CONSTRAINT IF EXISTS ${constraint}
    `);

    // Add new FK constraint pointing to public.departments
    await knex.raw(`
      ALTER TABLE inventory.${table}
      ADD CONSTRAINT ${constraint}
      FOREIGN KEY (${column}) REFERENCES public.departments(id)
    `);

    console.log(
      `Updated FK for inventory.${table}.${column} to reference public.departments`,
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Define tables that need FK updates (same as up)
  const tables = [
    {
      table: 'budget_allocations',
      column: 'department_id',
      constraint: 'budget_allocations_department_id_fkey',
    },
    {
      table: 'budget_plans',
      column: 'department_id',
      constraint: 'budget_plans_department_id_fkey',
    },
    {
      table: 'purchase_requests',
      column: 'department_id',
      constraint: 'purchase_requests_department_id_fkey',
    },
    {
      table: 'drug_distributions',
      column: 'requesting_dept_id',
      constraint: 'drug_distributions_requesting_dept_id_fkey',
    },
    {
      table: 'drug_returns',
      column: 'department_id',
      constraint: 'drug_returns_department_id_fkey',
    },
  ];

  // Revert FK constraints back to inventory.departments
  for (const { table, column, constraint } of tables) {
    // Check if table exists in inventory schema
    const hasTable = await knex.schema.withSchema('inventory').hasTable(table);
    if (!hasTable) {
      console.log(`Table inventory.${table} does not exist, skipping...`);
      continue;
    }

    // Drop new FK constraint if it exists
    await knex.raw(`
      ALTER TABLE inventory.${table}
      DROP CONSTRAINT IF EXISTS ${constraint}
    `);

    // Add back old FK constraint pointing to inventory.departments
    await knex.raw(`
      ALTER TABLE inventory.${table}
      ADD CONSTRAINT ${constraint}
      FOREIGN KEY (${column}) REFERENCES inventory.departments(id)
    `);

    console.log(
      `Reverted FK for inventory.${table}.${column} to reference inventory.departments`,
    );
  }
}
