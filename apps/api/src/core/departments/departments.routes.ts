import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { DepartmentsController } from './departments.controller';
import {
  CreateDepartmentsSchema,
  UpdateDepartmentsSchema,
  DepartmentsIdParamSchema,
  GetDepartmentsQuerySchema,
  ListDepartmentsQuerySchema,
  DepartmentsResponseSchema,
  DepartmentsListResponseSchema,
  FlexibleDepartmentsListResponseSchema,
} from './departments.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../schemas/base.schemas';
import { SchemaRefs } from '../../schemas/registry';
import { DropdownQuerySchema } from '../../schemas/base.schemas';

export interface DepartmentsRoutesOptions extends FastifyPluginOptions {
  controller: DepartmentsController;
}

export async function departmentsRoutes(
  fastify: FastifyInstance,
  options: DepartmentsRoutesOptions,
) {
  const { controller } = options;

  // GET / - List all departments
  fastify.get('/', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Get all departments with pagination and filters',
      description:
        'Retrieve departments with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,dept_code for custom field selection',
      querystring: ListDepartmentsQuerySchema,
      response: {
        200: FlexibleDepartmentsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('departments', 'read'),
    ], // Authentication & authorization required
    handler: controller.list.bind(controller),
  });

  // GET /dropdown - Get dropdown list
  fastify.get('/dropdown', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Get departments dropdown list',
      description:
        'Retrieve simplified list of active departments for UI dropdowns',
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
                      id: { type: 'number' },
                      dept_code: { type: 'string' },
                      dept_name: { type: 'string' },
                      parent_id: { type: ['number', 'null'] },
                      is_active: { type: 'boolean' },
                    },
                  },
                },
                total: { type: 'number' },
              },
            },
          },
        },
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('departments', 'read'),
    ], // Authentication & authorization required
    handler: controller.dropdown.bind(controller),
  });

  // GET /hierarchy - Get department hierarchy tree
  fastify.get('/hierarchy', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Get department hierarchy tree',
      description:
        'Retrieve nested hierarchical structure for organizational tree views',
      querystring: {
        type: 'object',
        properties: {
          parentId: { type: ['string', 'number'] },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                hierarchy: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      dept_code: { type: 'string' },
                      dept_name: { type: 'string' },
                      parent_id: { type: ['number', 'null'] },
                      is_active: { type: 'boolean' },
                      children: { type: 'array' },
                    },
                  },
                },
                total: { type: 'number' },
              },
            },
          },
        },
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('departments', 'read'),
    ], // Authentication & authorization required
    handler: controller.hierarchy.bind(controller),
  });

  // GET /:id - Get department by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Get department by ID',
      description: 'Retrieve a department by its unique identifier',
      params: DepartmentsIdParamSchema,
      querystring: GetDepartmentsQuerySchema,
      response: {
        200: DepartmentsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('departments', 'read'),
    ], // Authentication & authorization required
    handler: controller.getById.bind(controller),
  });

  // POST / - Create department
  fastify.post('/', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Create a new department',
      description: 'Create a new department with the provided data',
      body: CreateDepartmentsSchema,
      response: {
        201: DepartmentsResponseSchema,
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
      fastify.verifyPermission('departments', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // PUT /:id - Update department
  fastify.put('/:id', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Update department by ID',
      description: 'Update an existing department with new data',
      params: DepartmentsIdParamSchema,
      body: UpdateDepartmentsSchema,
      response: {
        200: DepartmentsResponseSchema,
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
      fastify.verifyPermission('departments', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // DELETE /:id - Delete department
  fastify.delete('/:id', {
    schema: {
      tags: ['Core: Departments'],
      summary: 'Delete department by ID',
      description: 'Delete a department by its unique identifier',
      params: DepartmentsIdParamSchema,
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
      fastify.verifyPermission('departments', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
