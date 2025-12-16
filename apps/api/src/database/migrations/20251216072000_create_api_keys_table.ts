import type { Knex } from 'knex';

/**
 * Migration: Create public.api_keys table
 *
 * API Key Management for programmatic access
 * Part of: API Keys Module (Platform Layer)
 *
 * Table purpose:
 * - Stores hashed API keys for secure programmatic access
 * - Manages scope-based permissions per key
 * - Tracks usage statistics and expiration
 * - Supports key rotation and revocation
 */

export async function up(knex: Knex): Promise<void> {
  // Check if table already exists (from archived migration)
  const exists = await knex.schema.hasTable('api_keys');
  if (exists) {
    console.log('Table api_keys already exists, skipping creation');
    return;
  }

  await knex.schema.createTable('api_keys', (table) => {
    // ========================================================================
    // PRIMARY KEY
    // ========================================================================
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // ========================================================================
    // USER REFERENCE
    // ========================================================================
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .comment('Owner of the API key');

    // ========================================================================
    // API KEY IDENTIFICATION
    // ========================================================================
    table
      .string('name', 100)
      .notNullable()
      .comment('Human-readable name for the API key');

    table
      .string('key_hash', 255)
      .notNullable()
      .comment('bcrypt hash of the full API key');

    table
      .string('key_prefix', 11)
      .notNullable()
      .comment('API key prefix (ak_xxxxxxxx) for fast lookup');

    // ========================================================================
    // PERMISSIONS AND SCOPES
    // ========================================================================
    table
      .jsonb('scopes')
      .nullable()
      .comment(
        'Array of permission scopes {resource: string, actions: string[]}',
      );

    // ========================================================================
    // USAGE TRACKING
    // ========================================================================
    table
      .timestamp('last_used_at')
      .nullable()
      .comment('Last time this API key was used');

    table
      .string('last_used_ip', 45)
      .nullable()
      .comment('Last IP address that used this key (IPv4/IPv6)');

    // ========================================================================
    // EXPIRATION AND STATUS
    // ========================================================================
    table
      .timestamp('expires_at')
      .nullable()
      .comment('When this API key expires (null = never expires)');

    table
      .boolean('is_active')
      .notNullable()
      .defaultTo(true)
      .comment('Whether this API key is active');

    // ========================================================================
    // AUDIT TIMESTAMPS
    // ========================================================================
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('When this API key was created');

    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('When this API key was last updated');

    // ========================================================================
    // INDEXES
    // ========================================================================

    // Primary indexes for performance
    table.index(['user_id'], 'idx_api_keys_user');
    table.index(['key_prefix'], 'idx_api_keys_prefix');
    table.index(['is_active'], 'idx_api_keys_active');
    table.index(['expires_at'], 'idx_api_keys_expiry');

    // Composite indexes for common queries
    table.index(['user_id', 'is_active'], 'idx_api_keys_user_active');
    table.index(['key_prefix', 'is_active'], 'idx_api_keys_prefix_active');
    table.index(['expires_at', 'is_active'], 'idx_api_keys_expiry_active');

    // Index for usage tracking queries
    table.index(['last_used_at'], 'idx_api_keys_last_used');
  });

  // Add table comment
  await knex.raw(`
    COMMENT ON TABLE api_keys IS 'API keys for programmatic access with scope-based permissions and usage tracking'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('api_keys');
}
