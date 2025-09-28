import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { ThemesController } from '../controllers/themes.controller';
import {
  ThemesSchema,
  CreateThemesSchema,
  UpdateThemesSchema,
  ThemesIdParamSchema,
  GetThemesQuerySchema,
  ListThemesQuerySchema,
  ThemesResponseSchema,
  ThemesListResponseSchema,
} from '../schemas/themes.schemas';
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
import { BulkResponseSchema } from '../../../schemas/base.schemas';

export interface ThemesRoutesOptions extends FastifyPluginOptions {
  controller: ThemesController;
}

export async function themesRoutes(
  fastify: FastifyInstance,
  options: ThemesRoutesOptions,
) {
  const { controller } = options;

  // Create themes
  fastify.post('/', {
    schema: {
      tags: ['Themes'],
      summary: 'Create a new themes',
      description: 'Create a new themes with the provided data',
      body: CreateThemesSchema,
      response: {
        201: ThemesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        409: SchemaRefs.Conflict,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes', 'admin']),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get themes by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Themes'],
      summary: 'Get themes by ID',
      description: 'Retrieve a themes by its unique identifier',
      params: ThemesIdParamSchema,
      querystring: GetThemesQuerySchema,
      response: {
        200: ThemesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.read', 'admin']),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all themess
  fastify.get('/', {
    schema: {
      tags: ['Themes'],
      summary: 'Get all themess with pagination',
      description:
        'Retrieve a paginated list of themess with optional filtering',
      querystring: ListThemesQuerySchema,
      response: {
        200: ThemesListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.read', 'admin']),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update themes
  fastify.put('/:id', {
    schema: {
      tags: ['Themes'],
      summary: 'Update themes by ID',
      description: 'Update an existing themes with new data',
      params: ThemesIdParamSchema,
      body: UpdateThemesSchema,
      response: {
        200: ThemesResponseSchema,
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
      fastify.authorize(['themes.update', 'admin']),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete themes
  fastify.delete('/:id', {
    schema: {
      tags: ['Themes'],
      summary: 'Delete themes by ID',
      description: 'Delete a themes by its unique identifier',
      params: ThemesIdParamSchema,
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
      fastify.authorize(['themes.delete', 'admin']),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });

  // ===== ENHANCED CRUD ROUTES =====

  // Get dropdown options for UI components
  fastify.get('/dropdown', {
    schema: {
      tags: ['Themes'],
      summary: 'Get themes dropdown options',
      description: 'Get themes options for dropdown/select components',
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
      fastify.authorize(['themes.read', 'admin']),
    ],
    handler: controller.getDropdownOptions.bind(controller),
  });

  // Bulk create themess
  fastify.post('/bulk', {
    schema: {
      tags: ['Themes'],
      summary: 'Bulk create themess',
      description: 'Create multiple themess in one operation',
      body: BulkCreateSchema(CreateThemesSchema),
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                created: { type: 'array', items: ThemesSchema },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          item: {
                            type: 'object',
                            additionalProperties: true, // Allow any properties in original data
                          }, // Original data that failed
                          error: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
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
      fastify.authorize(['themes.create', 'admin']),
    ],
    handler: controller.bulkCreate.bind(controller),
  });

  // Bulk update themess
  fastify.put('/bulk', {
    schema: {
      tags: ['Themes'],
      summary: 'Bulk update themess',
      description: 'Update multiple themess in one operation',
      body: BulkUpdateSchema(UpdateThemesSchema),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                updated: { type: 'array', items: ThemesSchema },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          item: {
                            type: 'object',
                            additionalProperties: true, // Allow any properties in original data
                          }, // Original data that failed
                          error: { type: 'string' },
                        },
                      },
                    },
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
      fastify.authorize(['themes.update', 'admin']),
    ],
    handler: controller.bulkUpdate.bind(controller),
  });

  // Bulk delete themess
  fastify.delete('/bulk', {
    schema: {
      tags: ['Themes'],
      summary: 'Bulk delete themess',
      description: 'Delete multiple themess in one operation',
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
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: ['string', 'number'] },
                          error: { type: 'string' },
                        },
                      },
                    },
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
      fastify.authorize(['themes.delete', 'admin']),
    ],
    handler: controller.bulkDelete.bind(controller),
  });

  // Bulk status update
  fastify.patch('/bulk/status', {
    schema: {
      tags: ['Themes'],
      summary: 'Bulk update themes status',
      description: 'Update status of multiple themess',
      body: BulkStatusSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                updated: { type: 'array', items: ThemesSchema },
                summary: {
                  type: 'object',
                  properties: {
                    successful: { type: 'number' },
                    failed: { type: 'number' },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          item: {
                            type: 'object',
                            additionalProperties: true, // Allow any properties in original data
                          }, // Original data that failed
                          error: { type: 'string' },
                        },
                      },
                    },
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
      fastify.authorize(['themes.update', 'admin']),
    ],
    handler: controller.bulkUpdateStatus.bind(controller),
  });

  // Activate themes
  fastify.patch('/:id/activate', {
    schema: {
      tags: ['Themes'],
      summary: 'Activate themes',
      description: 'Activate a themes by setting is_active to true',
      params: ThemesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: ThemesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.update', 'admin']),
    ],
    handler: controller.activate.bind(controller),
  });

  // Deactivate themes
  fastify.patch('/:id/deactivate', {
    schema: {
      tags: ['Themes'],
      summary: 'Deactivate themes',
      description: 'Deactivate a themes by setting is_active to false',
      params: ThemesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: ThemesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.update', 'admin']),
    ],
    handler: controller.deactivate.bind(controller),
  });

  // Toggle themes status
  fastify.patch('/:id/toggle', {
    schema: {
      tags: ['Themes'],
      summary: 'Toggle themes status',
      description: 'Toggle the is_active status of a themes',
      params: ThemesIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: ThemesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.update', 'admin']),
    ],
    handler: controller.toggle.bind(controller),
  });

  // Get statistics
  fastify.get('/stats', {
    schema: {
      tags: ['Themes'],
      summary: 'Get themes statistics',
      description: 'Get statistical information about themes',
      response: {
        200: StatisticsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.authorize(['themes.read', 'admin']),
    ],
    handler: controller.getStats.bind(controller),
  });

  // ===== FULL PACKAGE ROUTES =====

  // Validate data before save
  fastify.post('/validate', {
    schema: {
      tags: ['Themes'],
      summary: 'Validate themes data',
      description: 'Validate themes data before saving',
      body: ValidationRequestSchema(CreateThemesSchema),
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
      fastify.authorize(['themes.create', 'themes.update', 'admin']),
    ],
    handler: controller.validate.bind(controller),
  });

  // Check field uniqueness
  fastify.get('/check/:field', {
    schema: {
      tags: ['Themes'],
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
      fastify.authorize(['themes.read', 'admin']),
    ],
    handler: controller.checkUniqueness.bind(controller),
  });
}
