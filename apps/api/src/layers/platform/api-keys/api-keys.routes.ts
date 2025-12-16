import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Static } from '@sinclair/typebox';
import { ApiKeysController } from './api-keys.controller';
import {
  ListApiKeysQuerySchema,
  CreateApiKeyRequestSchema,
  CreateApiKeyResponseSchema,
  GetApiKeyResponseSchema,
  UpdateApiKeyRequestSchema,
  UpdateApiKeyResponseSchema,
  RevokeApiKeyResponseSchema,
  ApiKeyIdParamSchema,
  ApiKeyUsageStatsResponseSchema,
  ListApiKeysResponseSchema,
} from './api-keys.schemas';

/**
 * API Keys Routes
 *
 * Registers REST API routes for API key management.
 * All routes require JWT authentication via fastify.authenticate.
 *
 * Routes:
 * - GET    /                - List user's API keys (paginated)
 * - POST   /                - Create new API key
 * - GET    /:id             - Get single API key details
 * - PUT    /:id             - Update API key (name, permissions)
 * - DELETE /:id             - Revoke API key
 * - GET    /:id/usage       - Get usage statistics
 */
export async function registerApiKeysRoutes(
  fastify: FastifyInstance,
  controller: ApiKeysController,
): Promise<void> {
  /**
   * GET /
   * List user's API keys with pagination
   */
  fastify.get(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'List API keys',
        tags: ['API Keys'],
        summary:
          'Retrieve all API keys for the authenticated user with pagination',
        security: [{ bearerAuth: [] }],
        querystring: ListApiKeysQuerySchema,
        response: {
          200: ListApiKeysResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: Static<typeof ListApiKeysQuerySchema>;
      }>,
      reply: FastifyReply,
    ) => controller.listKeys(req, reply),
  );

  /**
   * POST /
   * Create new API key
   */
  fastify.post(
    '/',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Create API key',
        tags: ['API Keys'],
        summary: 'Create a new API key with specified permissions',
        security: [{ bearerAuth: [] }],
        body: CreateApiKeyRequestSchema,
        response: {
          200: CreateApiKeyResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Body: Static<typeof CreateApiKeyRequestSchema> }>,
      reply: FastifyReply,
    ) => controller.createKey(req, reply),
  );

  /**
   * GET /:id
   * Get single API key
   */
  fastify.get(
    '/:keyId',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get API key',
        tags: ['API Keys'],
        summary: 'Retrieve details of a specific API key',
        security: [{ bearerAuth: [] }],
        params: ApiKeyIdParamSchema,
        response: {
          200: GetApiKeyResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: Static<typeof ApiKeyIdParamSchema> }>,
      reply: FastifyReply,
    ) => controller.getKey(req, reply),
  );

  /**
   * PUT /:id
   * Update API key
   */
  fastify.put(
    '/:keyId',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Update API key',
        tags: ['API Keys'],
        summary: 'Update name and/or permissions of an API key',
        security: [{ bearerAuth: [] }],
        params: ApiKeyIdParamSchema,
        body: UpdateApiKeyRequestSchema,
        response: {
          200: UpdateApiKeyResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: Static<typeof ApiKeyIdParamSchema>;
        Body: Static<typeof UpdateApiKeyRequestSchema>;
      }>,
      reply: FastifyReply,
    ) => controller.updateKey(req, reply),
  );

  /**
   * DELETE /:id
   * Revoke API key
   */
  fastify.delete(
    '/:keyId',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Revoke API key',
        tags: ['API Keys'],
        summary: 'Permanently revoke an API key',
        security: [{ bearerAuth: [] }],
        params: ApiKeyIdParamSchema,
        response: {
          200: RevokeApiKeyResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: Static<typeof ApiKeyIdParamSchema> }>,
      reply: FastifyReply,
    ) => controller.revokeKey(req, reply),
  );

  /**
   * GET /:id/usage
   * Get usage statistics
   */
  fastify.get(
    '/:keyId/usage',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get API key usage statistics',
        tags: ['API Keys'],
        summary: 'Retrieve usage statistics and metrics for an API key',
        security: [{ bearerAuth: [] }],
        params: ApiKeyIdParamSchema,
        response: {
          200: ApiKeyUsageStatsResponseSchema,
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: Static<typeof ApiKeyIdParamSchema> }>,
      reply: FastifyReply,
    ) => controller.getUsageStats(req, reply),
  );
}
