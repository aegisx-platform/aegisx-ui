import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Add budget_request_status ENUM type
  await knex.raw(`
    CREATE TYPE inventory.budget_request_status AS ENUM (
      'DRAFT',
      'SUBMITTED',
      'DEPT_APPROVED',
      'FINANCE_APPROVED',
      'REJECTED'
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TYPE IF EXISTS inventory.budget_request_status CASCADE`);
}
