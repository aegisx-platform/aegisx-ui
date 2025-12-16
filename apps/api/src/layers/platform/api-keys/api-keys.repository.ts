import { Knex } from 'knex';
import { ApiKeyResponse } from './api-keys.schemas';

/**
 * ApiKeysRepository
 *
 * Repository for api_keys table with secure key storage and querying.
 * Handles CRUD operations for API keys with proper filtering and field mapping.
 *
 * Security Features:
 * - key_hash is stored but NEVER exposed in API responses
 * - Only hashed keys stored in database, never plain text
 * - Filter by revoked status automatically to get active keys
 * - Include user_id checks for ownership verification
 *
 * Field Mapping (snake_case DB ↔ camelCase API):
 * - user_id ↔ userId
 * - key_hash ↔ keyHash
 * - key_prefix ↔ keyPrefix
 * - last_used_at ↔ lastUsedAt
 * - usage_count ↔ usageCount
 * - expires_at ↔ expiresAt
 * - revoked_at ↔ revokedAt
 * - created_at ↔ createdAt
 * - updated_at ↔ updatedAt
 *
 * Usage:
 * ```typescript
 * const repository = new ApiKeysRepository(knex);
 * const keys = await repository.findByUserId(userId); // Active keys only
 * const key = await repository.findByKeyHash(hash); // For authentication
 * await repository.incrementUsage(keyId);
 * ```
 */
export class ApiKeysRepository {
  constructor(private knex: Knex) {}

  /**
   * Create a new API key record
   *
   * Stores the hashed key and metadata in the database.
   * Returns the stored key data without the hash.
   *
   * @param data - Key data including userId, name, keyHash, keyPrefix, permissions
   * @returns Created API key data (without keyHash)
   */
  async create(data: {
    userId: string;
    name: string;
    keyHash: string;
    keyPrefix: string;
    permissions: string[];
    expiresAt?: Date;
  }): Promise<ApiKeyResponse> {
    const [result] = await this.knex('api_keys')
      .insert({
        user_id: data.userId,
        name: data.name,
        key_hash: data.keyHash,
        key_prefix: data.keyPrefix,
        permissions: JSON.stringify(data.permissions),
        expires_at: data.expiresAt || null,
        revoked: false,
        usage_count: 0,
      })
      .returning([
        'id',
        'user_id',
        'name',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ]);

    return this.mapToApiKeyResponse(result);
  }

  /**
   * Find all non-revoked API keys for a user
   *
   * Returns only active (non-revoked) keys for the user.
   * Excludes revoked keys by default for security.
   *
   * @param userId - User ID (UUID)
   * @returns Array of active API keys for the user
   */
  async findByUserId(userId: string): Promise<ApiKeyResponse[]> {
    const results = await this.knex('api_keys')
      .select([
        'id',
        'user_id',
        'name',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ])
      .where('user_id', userId)
      .where('revoked', false)
      .orderBy('created_at', 'desc');

    return results.map((row) => this.mapToApiKeyResponse(row));
  }

  /**
   * Find a single API key by ID
   *
   * Retrieves a key with all metadata but without the key_hash for security.
   *
   * @param id - API key ID (UUID)
   * @returns API key data or null if not found
   */
  async findById(id: string): Promise<ApiKeyResponse | null> {
    const result = await this.knex('api_keys')
      .select([
        'id',
        'user_id',
        'name',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ])
      .where('id', id)
      .first();

    return result ? this.mapToApiKeyResponse(result) : null;
  }

  /**
   * Find API key by prefix (for authentication)
   *
   * Finds potential key matches by prefix for authentication.
   * Returns the hash for bcrypt verification in the service layer.
   * Does NOT check revoked status - service layer handles that.
   *
   * @param keyPrefix - Key prefix (first part of the key) for lookup
   * @returns Full API key entity with hash or null if not found
   */
  async findByKeyPrefix(
    keyPrefix: string,
  ): Promise<(ApiKeyResponse & { keyHash: string }) | null> {
    const result = await this.knex('api_keys')
      .select([
        'id',
        'user_id',
        'name',
        'key_hash',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ])
      .where('key_prefix', keyPrefix)
      .first();

    if (!result) return null;

    // Return with keyHash included for bcrypt verification
    return {
      ...this.mapToApiKeyResponse(result),
      keyHash: result.key_hash,
    };
  }

  /**
   * Find API key by hash (for authentication)
   *
   * Internal method used to retrieve a key record by its exact hash.
   * This is an exact match query, useful when the full hash is known.
   * Returns full entity including hash for verification purposes.
   *
   * @param keyHash - Bcrypt hash of the API key
   * @returns Full API key entity with hash or null if not found
   */
  async findByKeyHash(
    keyHash: string,
  ): Promise<(ApiKeyResponse & { keyHash: string }) | null> {
    const result = await this.knex('api_keys')
      .select([
        'id',
        'user_id',
        'name',
        'key_hash',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ])
      .where('key_hash', keyHash)
      .first();

    if (!result) return null;

    // Return with keyHash included for verification (service layer handles security)
    return {
      ...this.mapToApiKeyResponse(result),
      keyHash: result.key_hash,
    };
  }

  /**
   * Update API key fields (name, permissions)
   *
   * Only allows updating name and permissions.
   * Cannot update key_hash or revoked status through this method.
   *
   * @param id - API key ID
   * @param data - Fields to update (name, permissions)
   * @returns Updated API key data or null if not found
   */
  async update(
    id: string,
    data: {
      name?: string;
      permissions?: string[];
    },
  ): Promise<ApiKeyResponse | null> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.permissions !== undefined)
      updateData.permissions = JSON.stringify(data.permissions);

    // Set updated_at timestamp
    updateData.updated_at = this.knex.fn.now();

    const [result] = await this.knex('api_keys')
      .where('id', id)
      .update(updateData)
      .returning([
        'id',
        'user_id',
        'name',
        'key_prefix',
        'permissions',
        'last_used_at',
        'usage_count',
        'expires_at',
        'revoked',
        'revoked_at',
        'created_at',
        'updated_at',
      ]);

    return result ? this.mapToApiKeyResponse(result) : null;
  }

  /**
   * Revoke an API key
   *
   * Sets revoked=true and revoked_at timestamp.
   * Revoked keys cannot be used for authentication.
   *
   * @param id - API key ID
   * @returns true if revoke was successful, false if key not found
   */
  async revoke(id: string): Promise<boolean> {
    const result = await this.knex('api_keys').where('id', id).update({
      revoked: true,
      revoked_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    });

    return result > 0;
  }

  /**
   * Increment usage count and update last_used_at
   *
   * Called after successful key authentication.
   * Updates usage_count and last_used_at timestamp.
   *
   * @param id - API key ID
   * @returns true if update successful, false if key not found
   */
  async incrementUsage(id: string): Promise<boolean> {
    const result = await this.knex('api_keys')
      .where('id', id)
      .increment('usage_count', 1)
      .update({
        last_used_at: this.knex.fn.now(),
      });

    return result > 0;
  }

  /**
   * Delete expired API keys
   *
   * Removes all keys where expires_at < now().
   * Called by cleanup job.
   *
   * @returns Number of keys deleted
   */
  async deleteExpired(): Promise<number> {
    const result = await this.knex('api_keys')
      .where('expires_at', '<', this.knex.fn.now())
      .delete();

    return result;
  }

  /**
   * Helper: Map database row to camelCase response object
   *
   * Converts snake_case database columns to camelCase API format.
   * Never includes key_hash in response for security.
   *
   * @param row - Raw database row
   * @returns ApiKeyResponse with camelCase fields
   */
  private mapToApiKeyResponse(row: any): ApiKeyResponse {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      keyPrefix: row.key_prefix,
      permissions: Array.isArray(row.permissions)
        ? row.permissions
        : JSON.parse(row.permissions || '[]'),
      lastUsedAt: row.last_used_at
        ? new Date(row.last_used_at).toISOString()
        : undefined,
      usageCount: row.usage_count || 0,
      expiresAt: row.expires_at
        ? new Date(row.expires_at).toISOString()
        : undefined,
      revoked: row.revoked || false,
      revokedAt: row.revoked_at
        ? new Date(row.revoked_at).toISOString()
        : undefined,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  }
}
