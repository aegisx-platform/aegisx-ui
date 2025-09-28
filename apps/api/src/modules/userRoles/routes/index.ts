import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { UserRolesController } from '../controllers/userRoles.controller';
import {
  CreateUserRolesSchema,
  UpdateUserRolesSchema,
  UserRolesIdParamSchema,
  GetUserRolesQuerySchema,
  ListUserRolesQuerySchema,
  UserRolesResponseSchema,
  UserRolesListResponseSchema,
} from '../schemas/userRoles.schemas';
import {
  DropdownQuerySchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  StatusToggleSchema,
  ValidationRequestSchema,
  UniquenessCheckSchema,
  StatisticsResponseSchema,
} from '../../../schemas/base.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../schemas/base.schemas';
import { SchemaRefs } from '../../../schemas/registry';

export interface UserRolesRoutesOptions extends FastifyPluginOptions {
  controller: UserRolesController;
}

export async function userRolesRoutes(
  fastify: FastifyInstance,
  options: UserRolesRoutesOptions,
) {
  const { controller } = options;

  // Create userRoles
  fastify.post('/', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Create a new userRoles',
      description: 'Create a new userRoles with the provided data',
      body: CreateUserRolesSchema,
      response: {
        201: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        409: SchemaRefs.Conflict,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles', 'admin']),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get userRoles by ID
  fastify.get('/:id', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Get userRoles by ID',
      description: 'Retrieve a userRoles by its unique identifier',
      params: UserRolesIdParamSchema,
      querystring: GetUserRolesQuerySchema,
      response: {
        200: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.read', 'admin']),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all userRoless
  fastify.get('/', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Get all userRoless with pagination',
      description:
        'Retrieve a paginated list of userRoless with optional filtering',
      querystring: ListUserRolesQuerySchema,
      response: {
        200: UserRolesListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.read', 'admin']),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update userRoles
  fastify.put('/:id', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Update userRoles by ID',
      description: 'Update an existing userRoles with new data',
      params: UserRolesIdParamSchema,
      body: UpdateUserRolesSchema,
      response: {
        200: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        409: SchemaRefs.Conflict,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete userRoles
  fastify.delete('/:id', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Delete userRoles by ID',
      description: 'Delete a userRoles by its unique identifier',
      params: UserRolesIdParamSchema,
      response: {
        200: SchemaRefs.OperationResult,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.delete', 'admin']),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });

  // ===== ENHANCED CRUD ROUTES =====

  // Get dropdown options for UI components
  fastify.get('/dropdown', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Get userRoles dropdown options',
      description: 'Get userRoles options for dropdown/select components',
      querystring: DropdownQuerySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                options: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      value: { type: ['string', 'number'] },
                      label: { type: 'string' },
                      disabled: { type: 'boolean' },
                    },
                  },
                },
                total: { type: 'number' },
              },
            },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.read', 'admin']),
    ],
    handler: controller.getDropdownOptions.bind(controller),
  });

  // Bulk create userRoless
  fastify.post('/bulk', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Bulk create userRoless',
      description: 'Create multiple userRoless in one operation',
      body: BulkCreateSchema(CreateUserRolesSchema),
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
            meta: { type: 'object' },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.create', 'admin']),
    ],
    handler: controller.bulkCreate.bind(controller),
  });

  // Bulk update userRoless
  fastify.put('/bulk', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Bulk update userRoless',
      description: 'Update multiple userRoless in one operation',
      body: BulkUpdateSchema(UpdateUserRolesSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                updated: { type: 'array', items: UserRolesResponseSchema },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: { type: 'array' },
                  },
                },
              },
            },
            message: { type: 'string' },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ],
    handler: controller.bulkUpdate.bind(controller),
  });

  // Bulk delete userRoless
  fastify.delete('/bulk', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Bulk delete userRoless',
      description: 'Delete multiple userRoless in one operation',
      body: BulkDeleteSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                deleted: {
                  type: 'array',
                  items: { type: ['string', 'number'] },
                },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: { type: 'array' },
                  },
                },
              },
            },
            message: { type: 'string' },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.delete', 'admin']),
    ],
    handler: controller.bulkDelete.bind(controller),
  });

  // Bulk status update
  fastify.patch('/bulk/status', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Bulk update userRoles status',
      description: 'Update status of multiple userRoless',
      body: BulkStatusSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                updated: { type: 'array', items: UserRolesResponseSchema },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: { type: 'array' },
                  },
                },
              },
            },
            message: { type: 'string' },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ],
    handler: controller.bulkUpdateStatus.bind(controller),
  });

  // Activate userRoles
  fastify.patch('/:id/activate', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Activate userRoles',
      description: 'Activate a userRoles by setting is_active to true',
      params: UserRolesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ],
    handler: controller.activate.bind(controller),
  });

  // Deactivate userRoles
  fastify.patch('/:id/deactivate', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Deactivate userRoles',
      description: 'Deactivate a userRoles by setting is_active to false',
      params: UserRolesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ],
    handler: controller.deactivate.bind(controller),
  });

  // Toggle userRoles status
  fastify.patch('/:id/toggle', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Toggle userRoles status',
      description: 'Toggle the is_active status of a userRoles',
      params: UserRolesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: UserRolesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.update', 'admin']),
    ],
    handler: controller.toggle.bind(controller),
  });

  // ===== FULL PACKAGE ROUTES =====

  // Validate data before save
  fastify.post('/validate', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Validate userRoles data',
      description: 'Validate userRoles data before saving',
      body: ValidationRequestSchema(CreateUserRolesSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                valid: { type: 'boolean' },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.create', 'userRoles.update', 'admin']),
    ],
    handler: controller.validate.bind(controller),
  });

  // Check field uniqueness
  fastify.get('/check/:field', {
    schema: {
      tags: ['UserRoles'],
      summary: 'Check field uniqueness',
      description: 'Check if a field value is unique',
      params: Type.Object({
        field: Type.String({
          description: 'Field name to check for uniqueness',
        }),
      }),
      querystring: Type.Object({
        value: Type.Union([Type.String(), Type.Number()], {
          description: 'Value to check for uniqueness',
        }),
        excludeId: Type.Optional(
          Type.Union([Type.String(), Type.Number()], {
            description: 'ID to exclude from uniqueness check (for updates)',
          }),
        ),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                unique: { type: 'boolean' },
                exists: { type: 'object' },
              },
            },
          },
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['userRoles.read', 'admin']),
    ],
    handler: controller.checkUniqueness.bind(controller),
  });
}
