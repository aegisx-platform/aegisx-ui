import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiKeysService } from '../services/api-keys.service';

/**
 * API Key Authentication Middleware
 *
 * Authenticates requests using API keys from the X-API-Key header.
 *
 * Flow:
 * 1. Extract API key from X-API-Key header
 * 2. If missing, return 401 Unauthorized
 * 3. Verify key with ApiKeysService.verifyKey()
 * 4. If invalid/expired/revoked, return 401 Unauthorized
 * 5. Attach authenticated user data to request object
 * 6. Continue to route handler
 *
 * CRITICAL: Never throw errors in middleware - use reply methods instead.
 * Throwing errors causes request timeouts in preValidation hooks.
 *
 * @param request - FastifyRequest object
 * @param reply - FastifyReply object
 * @param apiKeysService - Injected ApiKeysService instance
 */
export async function apiKeyAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  apiKeysService: ApiKeysService,
) {
  try {
    // 1. Extract API key from X-API-Key header
    const apiKey = request.headers['x-api-key'] as string;

    // 2. If no key provided, return 401
    if (!apiKey) {
      request.log.warn('API key authentication failed: no API key provided');
      return reply.unauthorized('API key required');
    }

    // 3. Verify key with ApiKeysService
    // verifyKey() returns null for invalid/expired/revoked keys (doesn't throw)
    const keyData = await apiKeysService.verifyKey(apiKey);

    // 4. If invalid/expired/revoked, return 401
    if (!keyData) {
      request.log.warn(
        { keyPrefix: apiKey.substring(0, 10) },
        'API key authentication failed: invalid or expired key',
      );
      return reply.unauthorized('Invalid or expired API key');
    }

    // 5. Check if key is revoked (additional safety check)
    if (keyData.revoked) {
      request.log.warn(
        { keyId: keyData.id, userId: keyData.userId },
        'API key authentication failed: key is revoked',
      );
      return reply.unauthorized('API key has been revoked');
    }

    // 6. Check if key has expired
    if (keyData.expiresAt) {
      const expiresAtDate = new Date(keyData.expiresAt);
      if (expiresAtDate < new Date()) {
        request.log.warn(
          { keyId: keyData.id, expiresAt: keyData.expiresAt },
          'API key authentication failed: key has expired',
        );
        return reply.unauthorized('API key has expired');
      }
    }

    // 7. Attach authenticated user data to request
    // Structure matches JWT token format for consistency
    request.user = {
      id: keyData.userId,
      permissions: keyData.permissions,
      keyId: keyData.id,
      keyName: keyData.name,
      authenticatedVia: 'api-key',
    };

    request.log.info(
      { userId: keyData.userId, keyId: keyData.id },
      'API key authentication successful',
    );

    // 8. Continue to route handler
    return;
  } catch (error) {
    // Log unexpected errors but don't expose details to client
    request.log.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Unexpected error in API key authentication',
    );

    // Return generic error response
    return reply.unauthorized('Authentication failed');
  }
}

/**
 * Factory function to create a preValidation hook with injected service
 *
 * Usage in route registration:
 * ```typescript
 * const middleware = createApiKeyAuthMiddleware(apiKeysService);
 * fastify.post('/api/endpoint', { preValidation: middleware }, handler);
 * ```
 *
 * @param apiKeysService - The ApiKeysService instance
 * @returns A function compatible with Fastify preValidation hooks
 */
export function createApiKeyAuthMiddleware(apiKeysService: ApiKeysService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    return apiKeyAuthMiddleware(request, reply, apiKeysService);
  };
}

// Extend Fastify module declaration for type safety
declare module 'fastify' {
  interface FastifyInstance {
    apiKeyAuth: ReturnType<typeof createApiKeyAuthMiddleware>;
  }
}
