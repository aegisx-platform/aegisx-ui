import type { Knex } from 'knex';

/**
 * Seed: inventory.budget_types, budget_categories, and budgets
 *
 * Creates prerequisite data for budget system:
 * 1. budget_types - 8 types (OPD, NHSO, UC, LGO, SSO, GOV, EMG, INV)
 * 2. budget_categories - 2 categories (DRUG, MED_SUP)
 * 3. budgets - 13 combinations
 *
 * Required for budget_request_items FK constraint
 */
export async function seed(knex: Knex): Promise<void> {
  console.log('🌱 Seeding inventory budget master data...');

  // Wrap entire logic in try-catch to handle missing tables gracefully
  try {
    // Set search path to inventory schema
    await knex.raw(`SET search_path TO inventory, public`);

    // === 1. Seed budget_types ===
    const existingTypes = await knex('inventory.budget_types')
      .count('id as count')
      .first();

    if (existingTypes && Number(existingTypes.count) === 0) {
      console.log('📝 Creating budget_types...');
      // budget_class enum values: OPERATIONAL, INVESTMENT, EMERGENCY, RESEARCH
      await knex.raw(`
        INSERT INTO inventory.budget_types (id, type_code, type_name, budget_class, description, is_active) VALUES
          (1, 'OPD', 'ผู้ป่วยนอก', 'OPERATIONAL', 'งบผู้ป่วยนอก OPD', true),
          (2, 'NHSO', 'สปสช', 'OPERATIONAL', 'งบ สปสช (สำนักงานหลักประกันสุขภาพแห่งชาติ)', true),
          (3, 'UC', 'บัตรทอง', 'OPERATIONAL', 'งบบัตรทอง/หลักประกันสุขภาพถ้วนหน้า', true),
          (4, 'LGO', 'อปท', 'OPERATIONAL', 'งบองค์กรปกครองส่วนท้องถิ่น', true),
          (5, 'SSO', 'ประกันสังคม', 'OPERATIONAL', 'งบสำนักงานประกันสังคม', true),
          (6, 'GOV', 'งบประมาณแผ่นดิน', 'INVESTMENT', 'งบประมาณจากรัฐบาล', true),
          (7, 'EMG', 'ฉุกเฉิน', 'EMERGENCY', 'งบฉุกเฉิน/เร่งด่วน', true),
          (8, 'INV', 'สำรอง', 'INVESTMENT', 'งบสำรองคลัง', true)
        ON CONFLICT (type_code) DO NOTHING
      `);
      // Reset sequence
      await knex.raw(`SELECT setval('inventory.budget_types_id_seq', 8, true)`);
      console.log('✅ Created 8 budget_types');
    } else {
      console.log(
        `⏭️  Skipping budget_types - ${existingTypes?.count} records exist`,
      );
    }

    // === 2. Seed budget_categories ===
    const existingCategories = await knex('inventory.budget_categories')
      .count('id as count')
      .first();

    if (existingCategories && Number(existingCategories.count) === 0) {
      console.log('📝 Creating budget_categories...');
      await knex.raw(`
        INSERT INTO inventory.budget_categories (id, category_code, category_name, accounting_code, description, is_active) VALUES
          (1, 'DRUG', 'ยา', '2101', 'หมวดยาและเวชภัณฑ์ที่เป็นยา', true),
          (2, 'MED_SUP', 'เวชภัณฑ์', '2102', 'หมวดเวชภัณฑ์มิใช่ยา', true)
        ON CONFLICT (category_code) DO NOTHING
      `);
      // Reset sequence
      await knex.raw(
        `SELECT setval('inventory.budget_categories_id_seq', 2, true)`,
      );
      console.log('✅ Created 2 budget_categories');
    } else {
      console.log(
        `⏭️  Skipping budget_categories - ${existingCategories?.count} records exist`,
      );
    }

    // === 3. Seed budgets ===
    const existingBudgets = await knex('inventory.budgets')
      .count('id as count')
      .first();

    if (existingBudgets && Number(existingBudgets.count) === 0) {
      console.log('📝 Creating budgets...');
      await knex.raw(`
        INSERT INTO inventory.budgets (budget_type_id, budget_category_id, description, is_active) VALUES
          (1, 1, 'OPD - DRUG', true),
          (1, 2, 'OPD - MED_SUP', true),
          (2, 1, 'NHSO - DRUG', true),
          (2, 2, 'NHSO - MED_SUP', true),
          (3, 1, 'UC - DRUG', true),
          (3, 2, 'UC - MED_SUP', true),
          (4, 1, 'LGO - DRUG', true),
          (4, 2, 'LGO - MED_SUP', true),
          (5, 1, 'SSO - DRUG', true),
          (5, 2, 'SSO - MED_SUP', true),
          (6, 1, 'GOV - DRUG', true),
          (7, 1, 'EMG - DRUG', true),
          (8, 1, 'INV - DRUG', true)
        ON CONFLICT (budget_type_id, budget_category_id) DO NOTHING
      `);
      console.log('✅ Created 13 budget records');
    } else {
      console.log(
        `⏭️  Skipping budgets - ${existingBudgets?.count} records exist`,
      );
    }

    // === 4. Seed drug_generics (sample test data) ===
    const existingGenerics = await knex('inventory.drug_generics')
      .count('id as count')
      .first();

    if (existingGenerics && Number(existingGenerics.count) === 0) {
      console.log('📝 Creating sample drug_generics...');
      // ed_category enum: ED, NED, CM, NDMS
      await knex.raw(`
        INSERT INTO inventory.drug_generics (working_code, generic_name, dosage_form, strength_unit, ed_category, is_active) VALUES
          ('GEN001', 'Paracetamol 500mg', 'Tablet', 'mg', 'ED', true),
          ('GEN002', 'Amoxicillin 500mg', 'Capsule', 'mg', 'ED', true),
          ('GEN003', 'Omeprazole 20mg', 'Capsule', 'mg', 'ED', true),
          ('GEN004', 'Metformin 500mg', 'Tablet', 'mg', 'ED', true),
          ('GEN005', 'Amlodipine 5mg', 'Tablet', 'mg', 'ED', true),
          ('GEN006', 'Atorvastatin 20mg', 'Tablet', 'mg', 'NED', true),
          ('GEN007', 'Losartan 50mg', 'Tablet', 'mg', 'ED', true),
          ('GEN008', 'Simvastatin 10mg', 'Tablet', 'mg', 'ED', true),
          ('GEN009', 'Ibuprofen 400mg', 'Tablet', 'mg', 'ED', true),
          ('GEN010', 'Ciprofloxacin 500mg', 'Tablet', 'mg', 'ED', true)
        ON CONFLICT (working_code) DO NOTHING
      `);
      console.log('✅ Created 10 sample drug_generics');
    } else {
      console.log(
        `⏭️  Skipping drug_generics - ${existingGenerics?.count} records exist`,
      );
    }

    console.log('🎉 Budget master data seeding complete!');
  } catch (error) {
    console.log(
      '⏭️  [DEV] Inventory budget tables do not exist yet, skipping seed',
    );
  }
}
