import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiKeysService } from './services/api-keys.service';
import {
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ListApiKeysQuery,
  ApiKeyIdParam,
} from './api-keys.schemas';

/**
 * ApiKeysController
 *
 * Controller for API key management endpoints.
 * Handles all CRUD operations for API keys with proper authorization.
 *
 * Features:
 * - Create new API keys
 * - List user's API keys
 * - Get single API key details
 * - Update API key (name, permissions)
 * - Revoke API keys
 * - Get usage statistics
 *
 * All operations require JWT authentication and verify user ownership.
 */
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  /**
   * POST /
   * Create a new API key
   *
   * Generates a secure API key with the provided permissions.
   * The full key is returned ONLY once - it's never shown again after creation.
   *
   * @param request - FastifyRequest with user context and body
   * @param reply - FastifyReply for sending response
   * @returns Created API key with the plain key (shown only once)
   */
  async createKey(
    request: FastifyRequest<{ Body: CreateApiKeyRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { name, permissions, expiresAt } = request.body;

      request.log.info(
        { userId, keyName: name, permissionsCount: permissions.length },
        'Creating API key',
      );

      const result = await this.apiKeysService.createKey(
        userId,
        name,
        permissions,
        expiresAt ? new Date(expiresAt) : undefined,
      );

      request.log.info(
        { userId, keyId: result.keyData.id },
        'API key created successfully',
      );

      return reply.code(201).send({
        success: true,
        data: {
          ...result.keyData,
          key: result.key, // Plain key shown only once
        },
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          body: request.body,
        },
        'Error creating API key',
      );

      if (error.code === 'API_KEY_INVALID') {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'API_KEY_INVALID',
            message: error.message,
          },
        });
      }

      throw error;
    }
  }

  /**
   * GET /
   * List all API keys for the authenticated user
   *
   * Returns non-revoked API keys with pagination support.
   *
   * @param request - FastifyRequest with user context and query params
   * @param reply - FastifyReply for sending response
   * @returns Paginated list of API keys
   */
  async listKeys(
    request: FastifyRequest<{ Querystring: ListApiKeysQuery }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { page = 1, limit = 20 } = request.query as any;

      request.log.info({ userId, page, limit }, 'Listing API keys');

      const keys = await this.apiKeysService.listKeys(userId);

      // Simple pagination
      const start = (page - 1) * limit;
      const paginatedKeys = keys.slice(start, start + limit);

      request.log.info(
        { userId, totalKeys: keys.length, returnedKeys: paginatedKeys.length },
        'API keys listed successfully',
      );

      return reply.code(200).send({
        success: true,
        data: paginatedKeys,
        pagination: {
          page,
          limit,
          total: keys.length,
          totalPages: Math.ceil(keys.length / limit),
        },
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
        },
        'Error listing API keys',
      );

      throw error;
    }
  }

  /**
   * GET /:id
   * Get a single API key by ID
   *
   * Returns detailed information about a specific API key.
   * User must own the key to view it.
   *
   * @param request - FastifyRequest with user context and params
   * @param reply - FastifyReply for sending response
   * @returns API key details
   */
  async getKey(
    request: FastifyRequest<{ Params: ApiKeyIdParam }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { keyId } = request.params as any;

      request.log.info({ userId, keyId }, 'Fetching API key details');

      const key = await this.apiKeysService.getKey(userId, keyId);

      request.log.info(
        { userId, keyId },
        'API key details retrieved successfully',
      );

      return reply.code(200).send({
        success: true,
        data: key,
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          keyId: request.params.keyId,
        },
        'Error fetching API key',
      );

      if (error.code === 'API_KEY_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
      }

      if (error.code === 'API_KEY_FORBIDDEN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'API_KEY_FORBIDDEN',
            message: 'Access denied: You do not own this API key',
          },
        });
      }

      throw error;
    }
  }

  /**
   * PUT /:id
   * Update an API key
   *
   * Updates the name and/or permissions for a key.
   * Cannot update the key itself or revocation status through this endpoint.
   *
   * @param request - FastifyRequest with user context, params, and body
   * @param reply - FastifyReply for sending response
   * @returns Updated API key
   */
  async updateKey(
    request: FastifyRequest<{
      Params: ApiKeyIdParam;
      Body: UpdateApiKeyRequest;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { keyId } = request.params as any;
      const { name, permissions } = request.body;

      request.log.info({ userId, keyId }, 'Updating API key');

      const updated = await this.apiKeysService.updateKey(userId, keyId, {
        name,
        permissions,
      });

      request.log.info({ userId, keyId }, 'API key updated successfully');

      return reply.code(200).send({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          keyId: request.params.keyId,
        },
        'Error updating API key',
      );

      if (error.code === 'API_KEY_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
      }

      if (error.code === 'API_KEY_FORBIDDEN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'API_KEY_FORBIDDEN',
            message: 'Access denied: You do not own this API key',
          },
        });
      }

      throw error;
    }
  }

  /**
   * DELETE /:id
   * Revoke an API key
   *
   * Permanently deactivates an API key. Revoked keys cannot be used for authentication.
   *
   * @param request - FastifyRequest with user context and params
   * @param reply - FastifyReply for sending response
   * @returns Confirmation with revoked key ID and timestamp
   */
  async revokeKey(
    request: FastifyRequest<{ Params: ApiKeyIdParam }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { keyId } = request.params as any;

      request.log.info({ userId, keyId }, 'Revoking API key');

      // Get key details before revoking (for response and ownership verification)
      const key = await this.apiKeysService.getKey(userId, keyId);

      // Revoke the key
      await this.apiKeysService.revokeKey(userId, keyId);

      request.log.info({ userId, keyId }, 'API key revoked successfully');

      return reply.code(200).send({
        success: true,
        data: {
          id: keyId,
          message: `API key "${key.name}" has been revoked`,
          revokedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          keyId: request.params.keyId,
        },
        'Error revoking API key',
      );

      if (error.code === 'API_KEY_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
      }

      if (error.code === 'API_KEY_FORBIDDEN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'API_KEY_FORBIDDEN',
            message: 'Access denied: You do not own this API key',
          },
        });
      }

      throw error;
    }
  }

  /**
   * GET /:id/usage
   * Get API key usage statistics
   *
   * Returns usage metrics for a specific API key.
   * Useful for monitoring API usage and activity.
   *
   * @param request - FastifyRequest with user context and params
   * @param reply - FastifyReply for sending response
   * @returns Usage statistics
   */
  async getUsageStats(
    request: FastifyRequest<{ Params: ApiKeyIdParam }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const { keyId } = request.params as any;

      request.log.info({ userId, keyId }, 'Fetching API key usage statistics');

      // Get full key details first (for verification and to include in response)
      const keyDetails = await this.apiKeysService.getKey(userId, keyId);
      const stats = await this.apiKeysService.getUsageStats(userId, keyId);

      request.log.info({ userId, keyId }, 'API key usage statistics retrieved');

      return reply.code(200).send({
        success: true,
        data: {
          id: keyDetails.id,
          name: keyDetails.name,
          keyPrefix: keyDetails.keyPrefix,
          usageCount: stats.usageCount,
          lastUsedAt: stats.lastUsedAt,
          createdAt: stats.createdAt,
          expiresAt: keyDetails.expiresAt,
          revoked: keyDetails.revoked,
          permissions: keyDetails.permissions,
        },
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          keyId: request.params.keyId,
        },
        'Error fetching API key usage statistics',
      );

      if (error.code === 'API_KEY_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
      }

      if (error.code === 'API_KEY_FORBIDDEN') {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'API_KEY_FORBIDDEN',
            message: 'Access denied: You do not own this API key',
          },
        });
      }

      throw error;
    }
  }
}
