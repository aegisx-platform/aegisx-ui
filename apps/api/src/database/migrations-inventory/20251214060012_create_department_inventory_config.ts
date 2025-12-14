import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Create inventory.department_inventory_config table
  await knex.raw(`
    CREATE TABLE inventory.department_inventory_config (
      id SERIAL PRIMARY KEY,
      department_id INTEGER NOT NULL,
      consumption_group inventory.dept_consumption_group,
      his_code VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT department_inventory_config_department_id_key UNIQUE (department_id),
      CONSTRAINT department_inventory_config_department_id_fk FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE
    )
  `);

  // Create index on department_id
  await knex.raw(
    `CREATE INDEX idx_department_inventory_config_department_id ON inventory.department_inventory_config(department_id)`,
  );

  // Migrate existing data from inventory.departments
  await knex.raw(`
    INSERT INTO inventory.department_inventory_config (department_id, consumption_group, his_code, created_at, updated_at)
    SELECT id, consumption_group, his_code, created_at, updated_at
    FROM inventory.departments
    WHERE consumption_group IS NOT NULL OR his_code IS NOT NULL
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `DROP TABLE IF EXISTS inventory.department_inventory_config CASCADE`,
  );
}
