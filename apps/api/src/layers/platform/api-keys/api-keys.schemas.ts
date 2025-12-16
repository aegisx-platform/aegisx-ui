import { Type, Static } from '@sinclair/typebox';
import {
  ApiSuccessResponseSchema,
  PaginatedResponseSchema,
} from '../../../schemas/base.schemas';

/**
 * API Keys Schemas
 * Defines TypeBox schemas for API key management endpoints
 * SECURITY: key_hash is NEVER exposed in response schemas
 */

// ===== CORE ENTITY SCHEMAS =====

// Complete API key entity (internal use only - includes key_hash)
const ApiKeyEntitySchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'Unique API key identifier' }),
  userId: Type.String({
    format: 'uuid',
    description: 'User who owns this API key',
  }),
  name: Type.String({
    minLength: 1,
    maxLength: 100,
    description: 'Human-readable name for the API key',
  }),
  keyHash: Type.String({
    description: 'Bcrypt hash of the API key (NEVER exposed in responses)',
  }),
  keyPrefix: Type.String({
    minLength: 1,
    maxLength: 20,
    description:
      'First characters of the API key for display purposes (e.g., pk_live_abc...)',
  }),
  permissions: Type.Array(Type.String(), {
    description:
      'Array of permission strings (e.g., [users:read, users:write])',
  }),
  lastUsedAt: Type.Optional(Type.String({ format: 'date-time' })),
  usageCount: Type.Number({
    minimum: 0,
    default: 0,
    description: 'Number of times this API key has been used',
  }),
  expiresAt: Type.Optional(
    Type.String({
      format: 'date-time',
      description: 'ISO 8601 timestamp when the key expires (optional)',
    }),
  ),
  revoked: Type.Boolean({
    default: false,
    description: 'Whether the API key has been revoked',
  }),
  revokedAt: Type.Optional(
    Type.String({
      format: 'date-time',
      description: 'ISO 8601 timestamp when the key was revoked',
    }),
  ),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// API key response schema (SAFE - never includes key_hash)
export const ApiKeyResponseSchema = Type.Omit(ApiKeyEntitySchema, ['keyHash']);

// ===== REQUEST SCHEMAS =====

// Create API key request
export const CreateApiKeyRequestSchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 100,
    description: 'Human-readable name for the API key',
  }),
  permissions: Type.Array(Type.String(), {
    minItems: 1,
    description: 'Array of permission strings to grant to this key',
  }),
  expiresAt: Type.Optional(
    Type.String({
      format: 'date-time',
      description: 'Optional expiration date in ISO 8601 format',
    }),
  ),
});

// Create API key response (includes the full key, but only returned once)
export const CreateApiKeyResponseSchema = ApiSuccessResponseSchema(
  Type.Intersect([
    ApiKeyResponseSchema,
    Type.Object({
      key: Type.String({
        description: 'The full API key (shown only once at creation)',
      }),
    }),
  ]),
);

// Update API key request
export const UpdateApiKeyRequestSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      minLength: 1,
      maxLength: 100,
      description: 'New name for the API key',
    }),
  ),
  permissions: Type.Optional(
    Type.Array(Type.String(), {
      minItems: 1,
      description: 'Updated permissions array',
    }),
  ),
});

// Update API key response
export const UpdateApiKeyResponseSchema =
  ApiSuccessResponseSchema(ApiKeyResponseSchema);

// ===== USAGE STATISTICS =====

export const ApiKeyUsageStatsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  keyPrefix: Type.String(),
  usageCount: Type.Number({ minimum: 0 }),
  lastUsedAt: Type.Optional(Type.String({ format: 'date-time' })),
  createdAt: Type.String({ format: 'date-time' }),
  expiresAt: Type.Optional(Type.String({ format: 'date-time' })),
  revoked: Type.Boolean(),
  permissions: Type.Array(Type.String()),
});

export const ApiKeyUsageStatsResponseSchema = ApiSuccessResponseSchema(
  ApiKeyUsageStatsSchema,
);

// ===== LIST/PAGINATED RESPONSES =====

// List API keys response
export const ListApiKeysResponseSchema =
  PaginatedResponseSchema(ApiKeyResponseSchema);

// Get single API key response
export const GetApiKeyResponseSchema =
  ApiSuccessResponseSchema(ApiKeyResponseSchema);

// Delete API key response
export const DeleteApiKeyResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    id: Type.String({ format: 'uuid' }),
    message: Type.String(),
  }),
);

// Revoke API key response
export const RevokeApiKeyResponseSchema = ApiSuccessResponseSchema(
  Type.Object({
    id: Type.String({ format: 'uuid' }),
    message: Type.String(),
    revokedAt: Type.String({ format: 'date-time' }),
  }),
);

// ===== QUERY PARAMETERS =====

export const ListApiKeysQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 20 })),
  search: Type.Optional(Type.String({ minLength: 1 })),
  sortBy: Type.Optional(
    Type.Union([
      Type.Literal('name'),
      Type.Literal('createdAt'),
      Type.Literal('lastUsedAt'),
      Type.Literal('usageCount'),
    ]),
  ),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal('asc'), Type.Literal('desc')]),
  ),
});

// ===== PATH PARAMETERS =====

export const ApiKeyIdParamSchema = Type.Object({
  keyId: Type.String({ format: 'uuid' }),
});

// ===== EXPORT SCHEMAS FOR REGISTRATION =====

export const apiKeysSchemas = {
  'api-key-entity': ApiKeyEntitySchema,
  'api-key-response': ApiKeyResponseSchema,
  'create-api-key-request': CreateApiKeyRequestSchema,
  'create-api-key-response': CreateApiKeyResponseSchema,
  'update-api-key-request': UpdateApiKeyRequestSchema,
  'update-api-key-response': UpdateApiKeyResponseSchema,
  'api-key-usage-stats': ApiKeyUsageStatsSchema,
  'api-key-usage-stats-response': ApiKeyUsageStatsResponseSchema,
  'list-api-keys-response': ListApiKeysResponseSchema,
  'get-api-key-response': GetApiKeyResponseSchema,
  'delete-api-key-response': DeleteApiKeyResponseSchema,
  'revoke-api-key-response': RevokeApiKeyResponseSchema,
  'list-api-keys-query': ListApiKeysQuerySchema,
  'api-key-id-param': ApiKeyIdParamSchema,
};

// ===== EXPORT TYPES =====

export type ApiKeyEntity = Static<typeof ApiKeyEntitySchema>;
export type ApiKeyResponse = Static<typeof ApiKeyResponseSchema>;
export type CreateApiKeyRequest = Static<typeof CreateApiKeyRequestSchema>;
export type CreateApiKeyResponse = Static<typeof CreateApiKeyResponseSchema>;
export type UpdateApiKeyRequest = Static<typeof UpdateApiKeyRequestSchema>;
export type UpdateApiKeyResponse = Static<typeof UpdateApiKeyResponseSchema>;
export type ApiKeyUsageStats = Static<typeof ApiKeyUsageStatsSchema>;
export type ApiKeyUsageStatsResponse = Static<
  typeof ApiKeyUsageStatsResponseSchema
>;
export type ListApiKeysResponse = Static<typeof ListApiKeysResponseSchema>;
export type GetApiKeyResponse = Static<typeof GetApiKeyResponseSchema>;
export type DeleteApiKeyResponse = Static<typeof DeleteApiKeyResponseSchema>;
export type RevokeApiKeyResponse = Static<typeof RevokeApiKeyResponseSchema>;
export type ListApiKeysQuery = Static<typeof ListApiKeysQuerySchema>;
export type ApiKeyIdParam = Static<typeof ApiKeyIdParamSchema>;
