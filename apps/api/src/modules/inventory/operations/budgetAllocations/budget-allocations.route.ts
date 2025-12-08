import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetAllocationsController } from './budget-allocations.controller';
import {
  CreateBudgetAllocationsSchema,
  UpdateBudgetAllocationsSchema,
  BudgetAllocationsIdParamSchema,
  GetBudgetAllocationsQuerySchema,
  ListBudgetAllocationsQuerySchema,
  BudgetAllocationsResponseSchema,
  BudgetAllocationsListResponseSchema,
  FlexibleBudgetAllocationsListResponseSchema,
} from './budget-allocations.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface BudgetAllocationsRoutesOptions extends FastifyPluginOptions {
  controller: BudgetAllocationsController;
}

export async function budgetAllocationsRoutes(
  fastify: FastifyInstance,
  options: BudgetAllocationsRoutesOptions,
) {
  const { controller } = options;

  // Create budgetAllocations
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Budget Allocations'],
      summary: 'Create a new budgetAllocations',
      description: 'Create a new budgetAllocations with the provided data',
      body: CreateBudgetAllocationsSchema,
      response: {
        201: BudgetAllocationsResponseSchema,
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
      fastify.verifyPermission('budgetAllocations', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetAllocations by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Budget Allocations'],
      summary: 'Get budgetAllocations by ID',
      description: 'Retrieve a budgetAllocations by its unique identifier',
      params: BudgetAllocationsIdParamSchema,
      querystring: GetBudgetAllocationsQuerySchema,
      response: {
        200: BudgetAllocationsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetAllocations', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetAllocationss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Budget Allocations'],
      summary: 'Get all budgetAllocationss with pagination and formats',
      description:
        'Retrieve budgetAllocationss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetAllocationsQuerySchema,
      response: {
        200: FlexibleBudgetAllocationsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetAllocations', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetAllocations
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Budget Allocations'],
      summary: 'Update budgetAllocations by ID',
      description: 'Update an existing budgetAllocations with new data',
      params: BudgetAllocationsIdParamSchema,
      body: UpdateBudgetAllocationsSchema,
      response: {
        200: BudgetAllocationsResponseSchema,
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
      fastify.verifyPermission('budgetAllocations', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetAllocations
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Budget Allocations'],
      summary: 'Delete budgetAllocations by ID',
      description: 'Delete a budgetAllocations by its unique identifier',
      params: BudgetAllocationsIdParamSchema,
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
      fastify.verifyPermission('budgetAllocations', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
