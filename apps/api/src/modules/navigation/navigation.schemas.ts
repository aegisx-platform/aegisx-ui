import { FastifyInstance } from 'fastify';

/**
 * Navigation API Schemas
 * Fastify schemas for request validation and response serialization
 * Based on OpenAPI specification: navigation-api.yaml
 */

// Navigation Badge Schema
const navigationBadgeSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    classes: { type: 'string' },
    variant: { 
      type: 'string', 
      enum: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] 
    }
  },
  additionalProperties: false
};

// Navigation Item Schema (recursive)
const navigationItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    type: { 
      type: 'string', 
      enum: ['item', 'group', 'collapsible', 'divider', 'spacer'] 
    },
    icon: { type: 'string' },
    link: { type: 'string' },
    target: { 
      type: 'string', 
      enum: ['_self', '_blank', '_parent', '_top'],
      default: '_self'
    },
    disabled: { type: 'boolean', default: false },
    hidden: { type: 'boolean', default: false },
    badge: navigationBadgeSchema,
    permissions: {
      type: 'array',
      items: { type: 'string' }
    },
    children: {
      type: 'array',
      items: { $ref: '#navigationItem' }
    },
    meta: {
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['id', 'title', 'type'],
  additionalProperties: false,
  $id: '#navigationItem'
};

// Navigation Response Schema
const navigationResponseSchema = {
  type: 'object',
  properties: {
    default: {
      type: 'array',
      items: { $ref: '#navigationItem' }
    },
    compact: {
      type: 'array',
      items: { $ref: '#navigationItem' }
    },
    horizontal: {
      type: 'array',
      items: { $ref: '#navigationItem' }
    },
    mobile: {
      type: 'array',
      items: { $ref: '#navigationItem' }
    }
  },
  additionalProperties: false
};

// API Meta Schema
const apiMetaSchema = {
  type: 'object',
  properties: {
    timestamp: { type: 'string', format: 'date-time' },
    version: { type: 'string' },
    requestId: { type: 'string' }
  },
  additionalProperties: false
};

// API Response Schema
const apiResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {},
    message: { type: 'string' },
    meta: apiMetaSchema
  },
  required: ['success'],
  additionalProperties: false
};

// API Error Schema
const apiErrorSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', const: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: {},
        field: { type: 'string' }
      },
      required: ['code', 'message'],
      additionalProperties: false
    }
  },
  required: ['success', 'error'],
  additionalProperties: false
};

// Request Query Schemas
const getNavigationQuerySchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['default', 'compact', 'horizontal', 'mobile']
    },
    includeDisabled: {
      type: 'boolean',
      default: false
    }
  },
  additionalProperties: false
};

const getUserNavigationQuerySchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['default', 'compact', 'horizontal', 'mobile']
    }
  },
  additionalProperties: false
};

// Route Schemas
export const navigationRouteSchemas = {
  getNavigation: {
    querystring: getNavigationQuerySchema,
    response: {
      200: {
        ...apiResponseSchema,
        properties: {
          ...apiResponseSchema.properties,
          data: navigationResponseSchema
        }
      },
      401: apiErrorSchema,
      403: apiErrorSchema,
      500: apiErrorSchema
    }
  },

  getUserNavigation: {
    querystring: getUserNavigationQuerySchema,
    response: {
      200: {
        ...apiResponseSchema,
        properties: {
          ...apiResponseSchema.properties,
          data: navigationResponseSchema
        }
      },
      401: apiErrorSchema,
      500: apiErrorSchema
    }
  }
};

/**
 * Register navigation schemas with Fastify instance
 * @param fastify Fastify instance
 */
export function registerNavigationSchemas(fastify: FastifyInstance) {
  // Register base schemas that can be referenced
  fastify.addSchema({
    $id: 'navigationBadge',
    ...navigationBadgeSchema
  });

  fastify.addSchema({
    $id: 'navigationItem',
    ...navigationItemSchema
  });

  fastify.addSchema({
    $id: 'navigationResponse',
    ...navigationResponseSchema
  });

  fastify.addSchema({
    $id: 'apiMeta',
    ...apiMetaSchema
  });

  fastify.addSchema({
    $id: 'apiResponse',
    ...apiResponseSchema
  });

  fastify.addSchema({
    $id: 'apiError',
    ...apiErrorSchema
  });

  fastify.log.info('Navigation schemas registered successfully');
}

// Export individual schemas for testing and documentation
export const schemas = {
  navigationBadge: navigationBadgeSchema,
  navigationItem: navigationItemSchema,
  navigationResponse: navigationResponseSchema,
  apiMeta: apiMetaSchema,
  apiResponse: apiResponseSchema,
  apiError: apiErrorSchema,
  getNavigationQuery: getNavigationQuerySchema,
  getUserNavigationQuery: getUserNavigationQuerySchema
};

// JSON Schema compilation options
export const schemaOptions = {
  removeAdditional: true, // Remove properties not defined in schema
  useDefaults: true, // Apply default values
  coerceTypes: true, // Coerce types (string to boolean, etc.)
  addUsedSchema: false // Don't add used schemas to compiled schema
};