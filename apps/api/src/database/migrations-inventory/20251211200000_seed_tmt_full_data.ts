import type { Knex } from 'knex';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

/**
 * TMT (Thai Medicines Terminology) Full Data Seed Migration
 *
 * Seeds complete TMT data from compressed SQL file:
 * - tmt_concepts: 76,904 records
 * - tmt_units: 85 records
 *
 * Source: invs-modern database (migrated from MySQL invs_banpong)
 */
export async function up(knex: Knex): Promise<void> {
  console.log('📦 Loading TMT seed data from SQL file...');

  // Use process.cwd() for path resolution (works in both ESM and CJS)
  const sqlGzPath = path.join(
    process.cwd(),
    'apps/api/src/database/migrations-inventory/data/tmt_seed_data.sql.gz',
  );

  // Check if file exists
  if (!fs.existsSync(sqlGzPath)) {
    console.log('⚠️  TMT seed data file not found, skipping...');
    console.log(`   Expected path: ${sqlGzPath}`);
    return;
  }

  // Read and decompress the SQL file
  const compressedData = fs.readFileSync(sqlGzPath);
  const sqlContent = zlib.gunzipSync(compressedData).toString('utf8');

  console.log('📋 Executing TMT seed SQL...');
  console.log(
    `   File size: ${(compressedData.length / 1024 / 1024).toFixed(2)} MB compressed`,
  );
  console.log(
    `   SQL size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB uncompressed`,
  );

  // Extract only INSERT statements from SQL
  const insertStatements = sqlContent
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('INSERT INTO'));

  console.log(`   Total INSERT statements: ${insertStatements.length}`);

  // Clear existing data first (outside transaction for performance)
  console.log('🗑️  Clearing existing TMT data...');
  await knex.raw('SET session_replication_role = replica');
  await knex.raw('TRUNCATE inventory.tmt_concepts CASCADE');
  await knex.raw('TRUNCATE inventory.tmt_units CASCADE');

  // Execute INSERT statements in batches
  const batchSize = 500;
  let processed = 0;

  for (let i = 0; i < insertStatements.length; i += batchSize) {
    const batch = insertStatements.slice(i, i + batchSize);
    const batchSql = batch.join(';\n') + ';';

    await knex.raw(batchSql);

    processed += batch.length;
    if (processed % 10000 === 0) {
      console.log(
        `   Processed ${processed}/${insertStatements.length} statements...`,
      );
    }
  }

  // Reset sequences
  await knex.raw(
    "SELECT setval('inventory.tmt_units_id_seq', COALESCE((SELECT MAX(id) FROM inventory.tmt_units), 1))",
  );
  await knex.raw(
    "SELECT setval('inventory.tmt_concepts_id_seq', COALESCE((SELECT MAX(id) FROM inventory.tmt_concepts), 1))",
  );

  // Re-enable triggers
  await knex.raw('SET session_replication_role = DEFAULT');

  // Verify counts
  const unitCount = await knex('inventory.tmt_units')
    .count('* as count')
    .first();
  const conceptCount = await knex('inventory.tmt_concepts')
    .count('* as count')
    .first();

  console.log('✅ TMT seed data loaded successfully!');
  console.log(`   tmt_units: ${unitCount?.count} records`);
  console.log(`   tmt_concepts: ${conceptCount?.count} records`);
}

export async function down(knex: Knex): Promise<void> {
  console.log('🗑️  Clearing TMT seed data...');

  await knex.raw('TRUNCATE inventory.tmt_concepts CASCADE');
  await knex.raw('TRUNCATE inventory.tmt_units CASCADE');

  console.log('✅ TMT seed data cleared');
}
