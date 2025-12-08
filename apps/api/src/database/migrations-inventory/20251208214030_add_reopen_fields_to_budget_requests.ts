import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Add reopened_by and reopened_at fields to budget_requests table
  await knex.raw(`
    ALTER TABLE inventory.budget_requests
    ADD COLUMN IF NOT EXISTS reopened_by UUID REFERENCES public.users(id),
    ADD COLUMN IF NOT EXISTS reopened_at TIMESTAMP WITH TIME ZONE
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Remove reopened_by and reopened_at fields
  await knex.raw(`
    ALTER TABLE inventory.budget_requests
    DROP COLUMN IF EXISTS reopened_by,
    DROP COLUMN IF EXISTS reopened_at
  `);
}
