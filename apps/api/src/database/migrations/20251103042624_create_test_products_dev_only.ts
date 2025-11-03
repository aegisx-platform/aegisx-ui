import type { Knex } from 'knex';

/**
 * 🧪 DEVELOPMENT-ONLY TABLE: test_products
 *
 * Purpose: Comprehensive CRUD generator testing with all field types
 * Environment: Only created in development/test
 * Production: Safely skipped with early return
 *
 * Coverage (35+ fields):
 * - Unique constraint (sku)
 * - 3 Enum types (status, condition, availability)
 * - 6 JSONB fields (attributes, tags, images, pricing_tiers, dimensions, seo_metadata)
 * - 5 Boolean fields
 * - 4 Decimal fields (different precisions)
 * - 3 Integer range fields
 * - 2 Date fields
 * - 2 Timestamp fields
 * - 4 Foreign keys (category_id, parent_product_id, supplier_id, audit fields)
 */

export async function up(knex: Knex): Promise<void> {
  // 🛡️ PRODUCTION SAFETY: Skip in production
  const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  if (!isDevelopment) {
    console.log('⏭️  [PROD] Skipping test_products creation');
    return;
  }

  // 🧪 CREATE TEST TABLE (Development/Test Only)
  await knex.schema.createTable('test_products', (table) => {
    // Primary Key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // ===== STRING TYPES (4 fields) =====
    table
      .string('sku', 50)
      .notNullable()
      .unique()
      .comment('Stock Keeping Unit - unique identifier');
    table.string('name', 255).notNullable();
    table.string('barcode', 100).nullable();
    table.string('manufacturer', 200).nullable();

    // ===== TEXT TYPES (3 fields) =====
    table.text('description').nullable();
    table.text('long_description').nullable();
    table.text('specifications').nullable();

    // ===== NUMERIC TYPES (7 fields) =====
    table
      .integer('quantity')
      .defaultTo(0)
      .comment('Business rule: must be >= 0');
    table.integer('min_quantity').defaultTo(1);
    table.integer('max_quantity').nullable();
    table
      .decimal('price', 10, 2)
      .notNullable()
      .comment('Selling price (99999999.99)');
    table.decimal('cost', 10, 2).nullable().comment('Cost price');
    table
      .decimal('weight', 8, 3)
      .nullable()
      .comment('Weight in kg (99999.999)');
    table
      .decimal('discount_percentage', 5, 2)
      .nullable()
      .comment('Discount % (999.99)');

    // ===== BOOLEAN TYPES (5 fields) =====
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_taxable').defaultTo(true);
    table.boolean('is_shippable').defaultTo(true);
    table.boolean('allow_backorder').defaultTo(false);

    // ===== ENUM TYPES (3 fields) =====
    table
      .enum('status', ['draft', 'active', 'inactive', 'discontinued'])
      .defaultTo('draft');
    table.enum('condition', ['new', 'refurbished', 'used']).defaultTo('new');
    table
      .enum('availability', ['in_stock', 'out_of_stock', 'pre_order'])
      .defaultTo('in_stock');

    // ===== DATE/TIME TYPES (4 fields) =====
    table.date('launch_date').nullable();
    table.date('discontinued_date').nullable();
    table.timestamp('last_stock_check').nullable();
    table.timestamp('next_restock_date').nullable();

    // ===== JSONB TYPES (6 fields) =====
    table
      .jsonb('attributes')
      .nullable()
      .comment('Product attributes (color, size, etc.)');
    table.jsonb('tags').nullable().comment('Array of tags');
    table.jsonb('images').nullable().comment('Array of image objects');
    table
      .jsonb('pricing_tiers')
      .nullable()
      .comment('Bulk pricing configuration');
    table
      .jsonb('dimensions')
      .nullable()
      .comment('Width, height, depth measurements');
    table
      .jsonb('seo_metadata')
      .nullable()
      .comment('SEO title, description, keywords');

    // ===== FOREIGN KEYS (4 relationships) =====

    // Required FK to test_categories (RESTRICT - cannot delete if products exist)
    table.uuid('category_id').notNullable();
    table
      .foreign('category_id')
      .references('test_categories.id')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Optional Self-referencing FK (variants/parent-child)
    table.uuid('parent_product_id').nullable().comment('For product variants');
    table
      .foreign('parent_product_id')
      .references('test_products.id')
      .onDelete('SET NULL');

    // Optional FK to users (supplier)
    table.uuid('supplier_id').nullable();
    table.foreign('supplier_id').references('users.id').onDelete('SET NULL');

    // Audit Fields (FK to users)
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.foreign('created_by').references('users.id').onDelete('SET NULL');
    table.foreign('updated_by').references('users.id').onDelete('SET NULL');

    // ===== SOFT DELETE =====
    table.timestamp('deleted_at').nullable();

    // ===== TIMESTAMPS =====
    table.timestamps(true, true);

    // ===== INDEXES (11 indexes) =====
    table.index('sku', 'idx_test_products_sku');
    table.index('name', 'idx_test_products_name');
    table.index('category_id', 'idx_test_products_category_id');
    table.index('status', 'idx_test_products_status');
    table.index('is_active', 'idx_test_products_is_active');
    table.index('availability', 'idx_test_products_availability');
    table.index('created_at', 'idx_test_products_created_at');
    table.index('parent_product_id', 'idx_test_products_parent_id');
    table.index('supplier_id', 'idx_test_products_supplier_id');
    // Composite indexes
    table.index(['category_id', 'status'], 'idx_test_products_cat_status');
    table.index(['is_active', 'status'], 'idx_test_products_active_status');
  });

  console.log('✅ [DEV] Created test_products table');
}

export async function down(knex: Knex): Promise<void> {
  // ✅ Drop in correct order (child first, then parent)
  await knex.schema.dropTableIfExists('test_products');
  console.log('✅ Dropped test_products table');
}
