import type { Knex } from 'knex';

/**
 * Migration: Add import_batch_id to departments and users tables
 *
 * Supports Fix #4: Time-based Rollback
 * Adds import_batch_id column to track which import batch created each record.
 *
 * This enables:
 * - Precise rollback by batch ID (not time window)
 * - Tracking source of imported data
 * - Complete audit trail for imported records
 *
 * Tables affected:
 * - inventory.departments: Add import_batch_id (nullable, indexed)
 * - users: Add import_batch_id (nullable, indexed)
 *
 * The column is nullable to support:
 * - Manually created records (without import)
 * - Historical records before batch tracking was implemented
 */

export async function up(knex: Knex): Promise<void> {
  // Check if inventory.departments table exists and add column if not present
  const hasInventoryDepts = await knex.schema
    .withSchema('inventory')
    .hasTable('departments');

  if (hasInventoryDepts) {
    const hasBatchColumn = await knex.schema
      .withSchema('inventory')
      .hasColumn('departments', 'import_batch_id');

    if (!hasBatchColumn) {
      await knex.schema.alterTable('inventory.departments', (table) => {
        table
          .string('import_batch_id', 100)
          .nullable()
          .index('idx_inv_departments_import_batch')
          .comment(
            'Batch ID from import_history table for precise rollback tracking',
          );
      });
    } else {
      console.log(
        'inventory.departments.import_batch_id already exists, skipping',
      );
    }
  } else {
    console.log('inventory.departments table not found, skipping');
  }

  // Add import_batch_id to users table (in public schema)
  const hasUserBatchColumn = await knex.schema.hasColumn(
    'users',
    'import_batch_id',
  );

  if (!hasUserBatchColumn) {
    await knex.schema.alterTable('users', (table) => {
      table
        .string('import_batch_id', 100)
        .nullable()
        .index('idx_users_import_batch')
        .comment(
          'Batch ID from import_history table for precise rollback tracking',
        );
    });
  } else {
    console.log('users.import_batch_id already exists, skipping');
  }
}

export async function down(knex: Knex): Promise<void> {
  // Drop import_batch_id from users table first (to avoid foreign key issues)
  const hasUserBatchColumn = await knex.schema.hasColumn(
    'users',
    'import_batch_id',
  );
  if (hasUserBatchColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('import_batch_id');
    });
  }

  // Drop import_batch_id from inventory.departments table
  const hasInventoryDepts = await knex.schema
    .withSchema('inventory')
    .hasTable('departments');

  if (hasInventoryDepts) {
    const hasBatchColumn = await knex.schema
      .withSchema('inventory')
      .hasColumn('departments', 'import_batch_id');

    if (hasBatchColumn) {
      await knex.schema.alterTable('inventory.departments', (table) => {
        table.dropColumn('import_batch_id');
      });
    }
  }
}
