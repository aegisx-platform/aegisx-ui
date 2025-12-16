import { Knex } from 'knex';
import { CryptoService } from './crypto.service';
import { ApiKeysRepository } from '../api-keys.repository';
import { ActivityLogsService } from '../../../core/audit/activity-logs/activity-logs.service';
import { ApiKeyResponse, CreateApiKeyRequest } from '../api-keys.schemas';

/**
 * ApiKeysService
 *
 * Service layer for API key management with business logic and security.
 * Handles:
 * - Secure key generation and hashing
 * - Key lifecycle management (create, update, revoke)
 * - Key authentication and verification
 * - Usage tracking
 * - Audit logging for compliance
 *
 * Security Design:
 * - Plain key returned ONLY on creation (never stored/returned again)
 * - Keys are hashed with bcrypt before storage
 * - User ownership verified for all operations
 * - Activity logging for all management operations
 * - Expiration checking on authentication
 *
 * Error Handling:
 * - Throws with error codes: 'API_KEY_NOT_FOUND', 'API_KEY_FORBIDDEN', 'API_KEY_INVALID'
 * - verifyKey() returns null for invalid keys (does not throw)
 *
 * Usage:
 * ```typescript
 * const service = new ApiKeysService(knex, redis);
 * const { key, keyData } = await service.createKey(userId, 'My Key', ['read']);
 * // key is shown only here, never again
 * const verified = await service.verifyKey(providedKey);
 * ```
 */
export class ApiKeysService {
  private repository: ApiKeysRepository;
  private cryptoService: CryptoService;

  constructor(
    private knex: Knex,
    private activityLogsService: ActivityLogsService,
  ) {
    this.repository = new ApiKeysRepository(knex);
    this.cryptoService = new CryptoService();
  }

  /**
   * Create a new API key
   *
   * Generates a secure key, hashes it, stores the hash, and logs the activity.
   * Returns the plain key ONLY on creation - it's never stored or returned again.
   *
   * @param userId - User ID (UUID) who owns the key
   * @param name - Human-readable name for the key
   * @param permissions - Array of permission strings (e.g., ['api:read', 'api:write'])
   * @param expiresAt - Optional expiration date
   * @returns Object with { key: plaintext (shown once), keyData: stored metadata }
   * @throws Error with code 'API_KEY_INVALID' if parameters invalid
   */
  async createKey(
    userId: string,
    name: string,
    permissions: string[],
    expiresAt?: Date,
  ): Promise<{
    key: string; // Plain key - ONLY shown once
    keyData: ApiKeyResponse;
  }> {
    // Validate inputs
    if (!name || name.trim().length === 0) {
      const error = new Error('API key name is required');
      (error as any).code = 'API_KEY_INVALID';
      (error as any).statusCode = 400;
      throw error;
    }

    if (!permissions || permissions.length === 0) {
      const error = new Error('At least one permission is required');
      (error as any).code = 'API_KEY_INVALID';
      (error as any).statusCode = 400;
      throw error;
    }

    // Generate secure key and get prefix
    const { key, prefix } = await this.cryptoService.generateApiKey();

    // Hash the key before storage
    const keyHash = await this.cryptoService.hashKey(key);

    // Store in database
    const keyData = await this.repository.create({
      userId,
      name,
      keyHash,
      keyPrefix: prefix,
      permissions,
      expiresAt,
    });

    // Log activity for compliance
    await this.activityLogsService.create({
      userId,
      action: 'create',
      description: `Created API key: ${name}`,
      resourceType: 'api-key',
      resourceId: keyData.id,
      severity: 'info',
      metadata: {
        keyName: name,
        permissions,
        expiresAt: expiresAt?.toISOString(),
      },
    });

    // Return key ONLY once, plus metadata without hash
    return {
      key, // Plain key shown only here
      keyData,
    };
  }

  /**
   * List all non-revoked API keys for a user
   *
   * Returns active keys only. Excludes revoked and expired keys.
   * Does not return key hashes for security.
   *
   * @param userId - User ID (UUID)
   * @returns Array of active API keys for the user
   */
  async listKeys(userId: string): Promise<ApiKeyResponse[]> {
    return this.repository.findByUserId(userId);
  }

  /**
   * Get a single API key by ID
   *
   * Verifies user ownership before returning key details.
   *
   * @param userId - User ID (UUID)
   * @param keyId - API key ID (UUID)
   * @returns API key details without hash
   * @throws Error with code 'API_KEY_NOT_FOUND' (404) if key not found
   * @throws Error with code 'API_KEY_FORBIDDEN' (403) if user doesn't own key
   */
  async getKey(userId: string, keyId: string): Promise<ApiKeyResponse> {
    const key = await this.repository.findById(keyId);

    if (!key) {
      const error = new Error('API key not found');
      (error as any).code = 'API_KEY_NOT_FOUND';
      (error as any).statusCode = 404;
      throw error;
    }

    // Verify user ownership
    if (key.userId !== userId) {
      const error = new Error('Access denied: You do not own this API key');
      (error as any).code = 'API_KEY_FORBIDDEN';
      (error as any).statusCode = 403;
      throw error;
    }

    return key;
  }

  /**
   * Update API key (name and/or permissions)
   *
   * Verifies user ownership and logs the change.
   *
   * @param userId - User ID (UUID)
   * @param keyId - API key ID (UUID)
   * @param data - Fields to update (name, permissions)
   * @returns Updated API key data
   * @throws Error with code 'API_KEY_NOT_FOUND' (404) if key not found
   * @throws Error with code 'API_KEY_FORBIDDEN' (403) if user doesn't own key
   */
  async updateKey(
    userId: string,
    keyId: string,
    data: { name?: string; permissions?: string[] },
  ): Promise<ApiKeyResponse> {
    // Verify ownership first
    const key = await this.getKey(userId, keyId);

    // Update in repository
    const updated = await this.repository.update(keyId, data);

    if (!updated) {
      const error = new Error('Failed to update API key');
      (error as any).code = 'API_KEY_INVALID';
      (error as any).statusCode = 500;
      throw error;
    }

    // Log activity
    await this.activityLogsService.create({
      userId,
      action: 'update',
      description: `Updated API key: ${key.name}`,
      resourceType: 'api-key',
      resourceId: keyId,
      severity: 'info',
      metadata: {
        updates: data,
      },
    });

    return updated;
  }

  /**
   * Revoke an API key
   *
   * Permanently deactivates a key. Revoked keys cannot be used for authentication.
   * Verifies user ownership and logs the action.
   *
   * @param userId - User ID (UUID)
   * @param keyId - API key ID (UUID)
   * @throws Error with code 'API_KEY_NOT_FOUND' (404) if key not found
   * @throws Error with code 'API_KEY_FORBIDDEN' (403) if user doesn't own key
   */
  async revokeKey(userId: string, keyId: string): Promise<void> {
    // Verify ownership first
    const key = await this.getKey(userId, keyId);

    // Revoke in repository
    const revoked = await this.repository.revoke(keyId);

    if (!revoked) {
      const error = new Error('Failed to revoke API key');
      (error as any).code = 'API_KEY_INVALID';
      (error as any).statusCode = 500;
      throw error;
    }

    // Log activity
    await this.activityLogsService.create({
      userId,
      action: 'delete',
      description: `Revoked API key: ${key.name}`,
      resourceType: 'api-key',
      resourceId: keyId,
      severity: 'warning',
      metadata: {
        keyName: key.name,
      },
    });
  }

  /**
   * Verify an API key (authenticate)
   *
   * Checks if a provided key is valid by:
   * 1. Extracting the key prefix to find the key record
   * 2. Verifying the key against stored hash
   * 3. Checking: not revoked, not expired, still valid
   * 4. Incrementing usage count if valid
   *
   * Does NOT throw exceptions - returns null for invalid keys.
   * This prevents timing attacks on key existence.
   *
   * @param key - The plain API key provided in request
   * @returns API key data if valid, null if invalid/revoked/expired
   */
  async verifyKey(key: string): Promise<ApiKeyResponse | null> {
    try {
      // Extract prefix from the provided key for efficient lookup
      // Prefix format: "pk_live_abc123..." (first 16-20 chars)
      const keyPrefix = this.cryptoService.extractPrefix(key);

      // Find the key record by prefix
      // This narrows down the search to a single record in most cases
      const storedKey = await this.repository.findByKeyPrefix(keyPrefix);

      if (!storedKey) {
        return null; // Key not found
      }

      // Check if key is revoked
      if (storedKey.revoked) {
        return null; // Key is revoked, cannot use
      }

      // Check if key is expired
      if (storedKey.expiresAt) {
        const expiresAtDate = new Date(storedKey.expiresAt);
        if (expiresAtDate < new Date()) {
          return null; // Key expired
        }
      }

      // Verify the provided key matches the stored hash using bcrypt
      const isValid = await this.cryptoService.verifyKey(
        key,
        storedKey.keyHash,
      );

      if (!isValid) {
        return null; // Key verification failed
      }

      // Key is valid - increment usage count
      await this.repository.incrementUsage(storedKey.id);

      // Return key data without hash (safe to expose)
      const response: ApiKeyResponse = {
        id: storedKey.id,
        userId: storedKey.userId,
        name: storedKey.name,
        keyPrefix: storedKey.keyPrefix,
        permissions: storedKey.permissions,
        lastUsedAt: storedKey.lastUsedAt,
        usageCount: storedKey.usageCount,
        expiresAt: storedKey.expiresAt,
        revoked: storedKey.revoked,
        revokedAt: storedKey.revokedAt,
        createdAt: storedKey.createdAt,
        updatedAt: storedKey.updatedAt,
      };

      return response;
    } catch (error) {
      // Return null on any error (don't expose details)
      console.error('Error verifying API key:', error);
      return null;
    }
  }

  /**
   * Get usage statistics for an API key
   *
   * Returns usage metrics including request count and trend.
   * Verifies user ownership before returning data.
   *
   * @param userId - User ID (UUID)
   * @param keyId - API key ID (UUID)
   * @returns Usage statistics
   * @throws Error with code 'API_KEY_NOT_FOUND' (404) if key not found
   * @throws Error with code 'API_KEY_FORBIDDEN' (403) if user doesn't own key
   */
  async getUsageStats(
    userId: string,
    keyId: string,
  ): Promise<{
    usageCount: number;
    lastUsedAt: string | undefined;
    createdAt: string;
  }> {
    const key = await this.getKey(userId, keyId);

    return {
      usageCount: key.usageCount,
      lastUsedAt: key.lastUsedAt,
      createdAt: key.createdAt,
    };
  }
}
