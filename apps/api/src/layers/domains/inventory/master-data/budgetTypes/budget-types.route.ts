import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetTypesController } from './budget-types.controller';
import {
  CreateBudgetTypesSchema,
  UpdateBudgetTypesSchema,
  BudgetTypesIdParamSchema,
  GetBudgetTypesQuerySchema,
  ListBudgetTypesQuerySchema,
  BudgetTypesResponseSchema,
  BudgetTypesListResponseSchema,
  FlexibleBudgetTypesListResponseSchema,
} from './budget-types.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../../schemas/registry';

export interface BudgetTypesRoutesOptions extends FastifyPluginOptions {
  controller: BudgetTypesController;
}

export async function budgetTypesRoutes(
  fastify: FastifyInstance,
  options: BudgetTypesRoutesOptions,
) {
  const { controller } = options;

  // Create budgetTypes
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Budget Types'],
      summary: 'Create a new budgetTypes',
      description: 'Create a new budgetTypes with the provided data',
      body: CreateBudgetTypesSchema,
      response: {
        201: BudgetTypesResponseSchema,
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
      fastify.verifyPermission('budgetTypes', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetTypes by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Budget Types'],
      summary: 'Get budgetTypes by ID',
      description: 'Retrieve a budgetTypes by its unique identifier',
      params: BudgetTypesIdParamSchema,
      querystring: GetBudgetTypesQuerySchema,
      response: {
        200: BudgetTypesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetTypes', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetTypess
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Budget Types'],
      summary: 'Get all budgetTypess with pagination and formats',
      description:
        'Retrieve budgetTypess with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetTypesQuerySchema,
      response: {
        200: FlexibleBudgetTypesListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetTypes', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetTypes
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Budget Types'],
      summary: 'Update budgetTypes by ID',
      description: 'Update an existing budgetTypes with new data',
      params: BudgetTypesIdParamSchema,
      body: UpdateBudgetTypesSchema,
      response: {
        200: BudgetTypesResponseSchema,
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
      fastify.verifyPermission('budgetTypes', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetTypes
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Budget Types'],
      summary: 'Delete budgetTypes by ID',
      description: 'Delete a budgetTypes by its unique identifier',
      params: BudgetTypesIdParamSchema,
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
      fastify.verifyPermission('budgetTypes', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
