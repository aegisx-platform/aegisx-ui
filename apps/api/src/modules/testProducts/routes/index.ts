import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { TestProductsController } from '../controllers/test-products.controller';
import {
  CreateTestProductsSchema,
  UpdateTestProductsSchema,
  TestProductsIdParamSchema,
  GetTestProductsQuerySchema,
  ListTestProductsQuerySchema,
  TestProductsResponseSchema,
  TestProductsListResponseSchema,
  FlexibleTestProductsListResponseSchema,
} from '../schemas/test-products.schemas';
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
} from '../../../schemas/base.schemas';
import { ExportQuerySchema } from '../../../schemas/export.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../schemas/base.schemas';
import { SchemaRefs } from '../../../schemas/registry';

export interface TestProductsRoutesOptions extends FastifyPluginOptions {
  controller: TestProductsController;
}

export async function testProductsRoutes(
  fastify: FastifyInstance,
  options: TestProductsRoutesOptions,
) {
  const { controller } = options;

  // Create testProducts
  fastify.post('/', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Create a new testProducts',
      description: 'Create a new testProducts with the provided data',
      body: CreateTestProductsSchema,
      response: {
        201: TestProductsResponseSchema,
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
      fastify.verifyPermission('testProducts', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // ⚠️ IMPORTANT: Export route must be BEFORE /:id route
  // Export testProducts data
  fastify.get('/export', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Export testProducts data',
      description:
        'Export testProducts data in various formats (CSV, Excel, PDF)',
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
      fastify.verifyPermission('testProducts', 'export'),
    ],
    handler: controller.export.bind(controller),
  });

  // Get testProducts by ID
  fastify.get('/:id', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Get testProducts by ID',
      description: 'Retrieve a testProducts by its unique identifier',
      params: TestProductsIdParamSchema,
      querystring: GetTestProductsQuerySchema,
      response: {
        200: TestProductsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all testProductss
  fastify.get('/', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Get all testProductss with pagination and formats',
      description:
        'Retrieve testProductss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListTestProductsQuerySchema,
      response: {
        200: FlexibleTestProductsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update testProducts
  fastify.put('/:id', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Update testProducts by ID',
      description: 'Update an existing testProducts with new data',
      params: TestProductsIdParamSchema,
      body: UpdateTestProductsSchema,
      response: {
        200: TestProductsResponseSchema,
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
      fastify.verifyPermission('testProducts', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete testProducts
  fastify.delete('/:id', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Delete testProducts by ID',
      description: 'Delete a testProducts by its unique identifier',
      params: TestProductsIdParamSchema,
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
      fastify.verifyPermission('testProducts', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });

  // ===== ENHANCED CRUD ROUTES =====

  // Get dropdown options for UI components
  fastify.get('/dropdown', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Get testProducts dropdown options',
      description: 'Get testProducts options for dropdown/select components',
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
      fastify.verifyPermission('testProducts', 'read'),
    ],
    handler: controller.getDropdownOptions.bind(controller),
  });

  // Bulk create testProductss
  fastify.post('/bulk', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Bulk create testProductss',
      description: 'Create multiple testProductss in one operation',
      body: BulkCreateSchema(CreateTestProductsSchema),
      response: {
        201: BulkResponseSchema(TestProductsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'create'),
    ],
    handler: controller.bulkCreate.bind(controller),
  });

  // Bulk update testProductss
  fastify.put('/bulk', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Bulk update testProductss',
      description: 'Update multiple testProductss in one operation',
      body: BulkUpdateSchema(UpdateTestProductsSchema),
      response: {
        200: BulkResponseSchema(TestProductsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'update'),
    ],
    handler: controller.bulkUpdate.bind(controller),
  });

  // Bulk delete testProductss
  fastify.delete('/bulk', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Bulk delete testProductss',
      description: 'Delete multiple testProductss in one operation',
      body: BulkDeleteSchema,
      response: {
        200: BulkResponseSchema(TestProductsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'delete'),
    ],
    handler: controller.bulkDelete.bind(controller),
  });

  // Bulk status update
  fastify.patch('/bulk/status', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Bulk update testProducts status',
      description: 'Update status of multiple testProductss',
      body: BulkStatusSchema,
      response: {
        200: BulkResponseSchema(TestProductsResponseSchema),
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'update'),
    ],
    handler: controller.bulkUpdateStatus.bind(controller),
  });

  // Activate testProducts
  fastify.patch('/:id/activate', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Activate testProducts',
      description: 'Activate a testProducts by setting is_active to true',
      params: TestProductsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: TestProductsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'update'),
    ],
    handler: controller.activate.bind(controller),
  });

  // Deactivate testProducts
  fastify.patch('/:id/deactivate', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Deactivate testProducts',
      description: 'Deactivate a testProducts by setting is_active to false',
      params: TestProductsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: TestProductsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'update'),
    ],
    handler: controller.deactivate.bind(controller),
  });

  // Toggle testProducts status
  fastify.patch('/:id/toggle', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Toggle testProducts status',
      description: 'Toggle the is_active status of a testProducts',
      params: TestProductsIdParamSchema,
      body: StatusToggleSchema,
      response: {
        200: TestProductsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('testProducts', 'update'),
    ],
    handler: controller.toggle.bind(controller),
  });

  // ===== FULL PACKAGE ROUTES =====

  // Validate data before save
  fastify.post('/validate', {
    schema: {
      tags: ['TestProducts'],
      summary: 'Validate testProducts data',
      description: 'Validate testProducts data before saving',
      body: ValidationRequestSchema(CreateTestProductsSchema),
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
      fastify.verifyPermission('testProducts', 'read'),
    ],
    handler: controller.validate.bind(controller),
  });

  // Check field uniqueness
  fastify.get('/check/:field', {
    schema: {
      tags: ['TestProducts'],
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
      fastify.verifyPermission('testProducts', 'read'),
    ],
    handler: controller.checkUniqueness.bind(controller),
  });
}
