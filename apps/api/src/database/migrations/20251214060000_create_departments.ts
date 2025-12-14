import type { Knex } from 'knex';

/**
 * Migration: Create public.departments table
 *
 * Core department hierarchy and organizational structure
 * Part of: Core Departments Module
 *
 * Table purpose:
 * - Defines the organizational department hierarchy
 * - Supports self-referencing parent-child relationships
 * - Tracks import batches for data reconciliation and rollback
 * - Provides a master reference for all department-related operations
 */

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('departments', (table) => {
    // Primary key
    table.increments('id').primary();

    // Department identification
    table
      .string('dept_code', 10)
      .notNullable()
      .unique()
      .comment('Department code identifier (unique across organization)');

    table
      .string('dept_name', 100)
      .notNullable()
      .comment('Department name/display label');

    // Hierarchy
    table
      .integer('parent_id')
      .nullable()
      .references('id')
      .inTable('departments')
      .onDelete('SET NULL')
      .comment('Parent department ID for hierarchical structure');

    // Status management
    table
      .boolean('is_active')
      .notNullable()
      .defaultTo(true)
      .comment('Department active status');

    // Import tracking
    table
      .string('import_batch_id', 100)
      .nullable()
      .comment('Import batch ID for tracking rollback operations');

    // Audit fields
    table.timestamps(true, true);

    // ========================================================================
    // INDEXES
    // ========================================================================

    // Hierarchy queries
    table.index(['parent_id'], 'idx_departments_parent');

    // Status filtering
    table.index(['is_active'], 'idx_departments_active');

    // Import tracking
    table.index(['import_batch_id'], 'idx_departments_batch');

    // Combined indexes for common queries
    table.index(['is_active', 'created_at'], 'idx_departments_active_date');
    table.index(
      ['import_batch_id', 'created_at'],
      'idx_departments_batch_date',
    );
  });

  // Add table comment
  await knex.raw(`
    COMMENT ON TABLE departments IS
    'Core organizational department hierarchy with import batch tracking for rollback support'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('departments');
}
