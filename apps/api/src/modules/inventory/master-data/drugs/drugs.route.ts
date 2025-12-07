import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { DrugsController } from './drugs.controller';
import {
  CreateDrugsSchema,
  UpdateDrugsSchema,
  DrugsIdParamSchema,
  GetDrugsQuerySchema,
  ListDrugsQuerySchema,
  DrugsResponseSchema,
  DrugsListResponseSchema,
  FlexibleDrugsListResponseSchema,
} from './drugs.schemas';
import {
  DropdownQuerySchema,
  DropdownResponseSchema,
  BulkCreateSchema,
  BulkUpdateSchema,
  BulkDeleteSchema,
  BulkResponseSchema,
  BulkStatusSchema,
  StatusToggleSchema,
  ValidationRequestSchema,
  ValidationResponseSchema,
  UniquenessParamSchema,
  UniquenessQuerySchema,
  UniquenessResponseSchema,
  StatisticsResponseSchema,
} from '../../../../schemas/base.schemas';
import { ExportQuerySchema } from '../../../../schemas/export.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface DrugsRoutesOptions extends FastifyPluginOptions {
  controller: DrugsController;
}

export async function drugsRoutes(
  fastify: FastifyInstance,
  options: DrugsRoutesOptions,
) {
  const { controller } = options;

  // Create drugs
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Create a new drugs',
      description: 'Create a new drugs with the provided data',
      body: CreateDrugsSchema,
      response: {
        201: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        409: SchemaRefs.Conflict,
        422: SchemaRefs.UnprocessableEntity,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // ⚠️ IMPORTANT: Export route must be BEFORE /:id route
  // Export drugs data
  fastify.get('/export', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Export drugs data',
      description: 'Export drugs data in various formats (CSV, Excel, PDF)',
      querystring: ExportQuerySchema,
      response: {
        200: {
          description: 'Export file download',
          type: 'string',
          format: 'binary',
        },
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'export'),
    ],
    handler: controller.export.bind(controller),
  });

  // Get drugs by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Get drugs by ID',
      description: 'Retrieve a drugs by its unique identifier',
      params: DrugsIdParamSchema,
      querystring: GetDrugsQuerySchema,
      response: {
        200: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all drugss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Get all drugss with pagination and formats',
      description:
        'Retrieve drugss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListDrugsQuerySchema,
      response: {
        200: FlexibleDrugsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update drugs
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Update drugs by ID',
      description: 'Update an existing drugs with new data',
      params: DrugsIdParamSchema,
      body: UpdateDrugsSchema,
      response: {
        200: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        409: SchemaRefs.Conflict,
        422: SchemaRefs.UnprocessableEntity,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete drugs
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Delete drugs by ID',
      description: 'Delete a drugs by its unique identifier',
      params: DrugsIdParamSchema,
      response: {
        200: SchemaRefs.OperationResult,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        422: SchemaRefs.UnprocessableEntity,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });

  // ===== ENHANCED CRUD ROUTES =====

  // Get dropdown options for UI components
  fastify.get('/dropdown', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Get drugs dropdown options',
      description: 'Get drugs options for dropdown/select components',
      querystring: DropdownQuerySchema,
      response: {
        200: DropdownResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'read'),
    ],
    handler: controller.getDropdownOptions.bind(controller),
  });

  // Bulk create drugss
  fastify.post('/bulk', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Bulk create drugss',
      description: 'Create multiple drugss in one operation',
      body: BulkCreateSchema(CreateDrugsSchema),
      response: {
        201: BulkResponseSchema(DrugsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'create'),
    ],
    handler: controller.bulkCreate.bind(controller),
  });

  // Bulk update drugss
  fastify.put('/bulk', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Bulk update drugss',
      description: 'Update multiple drugss in one operation',
      body: BulkUpdateSchema(UpdateDrugsSchema),
      response: {
        200: BulkResponseSchema(DrugsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ],
    handler: controller.bulkUpdate.bind(controller),
  });

  // Bulk delete drugss
  fastify.delete('/bulk', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Bulk delete drugss',
      description: 'Delete multiple drugss in one operation',
      body: BulkDeleteSchema,
      response: {
        200: BulkResponseSchema(DrugsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'delete'),
    ],
    handler: controller.bulkDelete.bind(controller),
  });

  // Bulk status update
  fastify.patch('/bulk/status', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Bulk update drugs status',
      description: 'Update status of multiple drugss',
      body: BulkStatusSchema,
      response: {
        200: BulkResponseSchema(DrugsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ],
    handler: controller.bulkUpdateStatus.bind(controller),
  });

  // Activate drugs
  fastify.patch('/:id/activate', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Activate drugs',
      description: 'Activate a drugs by setting is_active to true',
      params: DrugsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ],
    handler: controller.activate.bind(controller),
  });

  // Deactivate drugs
  fastify.patch('/:id/deactivate', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Deactivate drugs',
      description: 'Deactivate a drugs by setting is_active to false',
      params: DrugsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ],
    handler: controller.deactivate.bind(controller),
  });

  // Toggle drugs status
  fastify.patch('/:id/toggle', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Toggle drugs status',
      description: 'Toggle the is_active status of a drugs',
      params: DrugsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: DrugsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'update'),
    ],
    handler: controller.toggle.bind(controller),
  });

  // ===== FULL PACKAGE ROUTES =====

  // Validate data before save
  fastify.post('/validate', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Validate drugs data',
      description: 'Validate drugs data before saving',
      body: ValidationRequestSchema(CreateDrugsSchema),
      response: {
        200: ValidationResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'read'),
    ],
    handler: controller.validate.bind(controller),
  });

  // Check field uniqueness
  fastify.get('/check/:field', {
    schema: {
      tags: ['Inventory: Drugs'],
      summary: 'Check field uniqueness',
      description: 'Check if a field value is unique',
      params: UniquenessParamSchema,
      querystring: UniquenessQuerySchema,
      response: {
        200: UniquenessResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugs', 'read'),
    ],
    handler: controller.checkUniqueness.bind(controller),
  });
}
