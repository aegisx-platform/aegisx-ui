/**
 * Phase 18-19: Add VEN Analysis and Procurement Data fields
 *
 * Phase 18 - VEN Analysis:
 * - ven_category: V=Vital, E=Essential, N=Non-essential
 *
 * Phase 19 - Procurement Data:
 * - last_buy_cost: ราคาซื้อล่าสุด
 * - last_vendor_code: รหัสผู้จำหน่ายล่าสุด
 * - hosp_list: บัญชียา รพ. (1-21)
 */

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Create VenCategory enum type
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE "inventory"."VenCategory" AS ENUM ('V', 'E', 'N');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  // 2. Add new columns to drug_generics
  await knex.schema
    .withSchema('inventory')
    .alterTable('drug_generics', (table) => {
      // Phase 18: VEN Analysis
      table
        .specificType('ven_category', '"inventory"."VenCategory"')
        .nullable()
        .comment('V=Vital, E=Essential, N=Non-essential');

      // Phase 19: Procurement Data
      table.integer('hosp_list').nullable().comment('บัญชียา รพ. (1-21)');

      table
        .decimal('last_buy_cost', 12, 2)
        .nullable()
        .comment('ราคาซื้อล่าสุด');

      table
        .string('last_vendor_code', 6)
        .nullable()
        .comment('รหัสผู้จำหน่ายล่าสุด');
    });

  // 3. Add indexes for commonly queried fields
  await knex.schema
    .withSchema('inventory')
    .alterTable('drug_generics', (table) => {
      table.index('ven_category', 'idx_drug_generics_ven_category');
      table.index('hosp_list', 'idx_drug_generics_hosp_list');
    });

  // 4. Add comments
  await knex.raw(`
    COMMENT ON COLUMN "inventory"."drug_generics"."ven_category" IS 'VEN Analysis: V=Vital (ยาช่วยชีวิต), E=Essential (ยาจำเป็น), N=Non-essential (ยาไม่จำเป็น)';
    COMMENT ON COLUMN "inventory"."drug_generics"."hosp_list" IS 'บัญชียา รพ. (Hospital drug list category 1-21)';
    COMMENT ON COLUMN "inventory"."drug_generics"."last_buy_cost" IS 'ราคาซื้อล่าสุด (Last purchase cost)';
    COMMENT ON COLUMN "inventory"."drug_generics"."last_vendor_code" IS 'รหัสผู้จำหน่ายล่าสุด (Last vendor code)';
  `);
}

export async function down(knex: Knex): Promise<void> {
  // 1. Drop indexes
  await knex.schema
    .withSchema('inventory')
    .alterTable('drug_generics', (table) => {
      table.dropIndex('ven_category', 'idx_drug_generics_ven_category');
      table.dropIndex('hosp_list', 'idx_drug_generics_hosp_list');
    });

  // 2. Drop columns
  await knex.schema
    .withSchema('inventory')
    .alterTable('drug_generics', (table) => {
      table.dropColumn('ven_category');
      table.dropColumn('hosp_list');
      table.dropColumn('last_buy_cost');
      table.dropColumn('last_vendor_code');
    });

  // 3. Drop enum type
  await knex.raw('DROP TYPE IF EXISTS "inventory"."VenCategory"');
}
