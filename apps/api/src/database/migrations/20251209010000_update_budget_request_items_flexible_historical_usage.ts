import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Migrate existing data from hardcoded year columns to JSONB
  // First, add the new historical_usage column
  await knex.raw(`
    ALTER TABLE inventory.budget_request_items
    ADD COLUMN IF NOT EXISTS historical_usage JSONB DEFAULT '{}'
  `);

  // Migrate existing data: Copy values from usage_year_XXXX to historical_usage JSONB
  await knex.raw(`
    UPDATE inventory.budget_request_items
    SET historical_usage = jsonb_build_object(
      '2566', COALESCE(usage_year_2566, 0),
      '2567', COALESCE(usage_year_2567, 0),
      '2568', COALESCE(usage_year_2568, 0)
    )
    WHERE historical_usage = '{}'::jsonb
  `);

  // Drop the old hardcoded year columns
  await knex.raw(`
    ALTER TABLE inventory.budget_request_items
    DROP COLUMN IF EXISTS usage_year_2566,
    DROP COLUMN IF EXISTS usage_year_2567,
    DROP COLUMN IF EXISTS usage_year_2568
  `);

  // Add comment for documentation
  await knex.raw(`
    COMMENT ON COLUMN inventory.budget_request_items.historical_usage IS
    'Historical usage data stored as JSONB. Format: {"2566": 4200, "2567": 4400, "2568": 4527}.
    Flexible design - no schema changes needed when adding new years.'
  `);

  await knex.raw(`
    COMMENT ON COLUMN inventory.budget_request_items.avg_usage IS
    'Average usage calculated from historical_usage JSONB field (sum of all years / count)'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`SET search_path TO inventory, public`);

  // Restore the old hardcoded year columns
  await knex.raw(`
    ALTER TABLE inventory.budget_request_items
    ADD COLUMN IF NOT EXISTS usage_year_2566 NUMERIC(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS usage_year_2567 NUMERIC(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS usage_year_2568 NUMERIC(10,2) DEFAULT 0
  `);

  // Migrate data back from JSONB to individual columns (if historical_usage exists)
  await knex.raw(`
    UPDATE inventory.budget_request_items
    SET
      usage_year_2566 = COALESCE((historical_usage->>'2566')::numeric, 0),
      usage_year_2567 = COALESCE((historical_usage->>'2567')::numeric, 0),
      usage_year_2568 = COALESCE((historical_usage->>'2568')::numeric, 0)
    WHERE historical_usage IS NOT NULL AND historical_usage != '{}'::jsonb
  `);

  // Drop the JSONB column
  await knex.raw(`
    ALTER TABLE inventory.budget_request_items
    DROP COLUMN IF EXISTS historical_usage
  `);
}
