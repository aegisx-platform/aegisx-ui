import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetPlanItemsController } from './budget-plan-items.controller';
import {
  CreateBudgetPlanItemsSchema,
  UpdateBudgetPlanItemsSchema,
  BudgetPlanItemsIdParamSchema,
  GetBudgetPlanItemsQuerySchema,
  ListBudgetPlanItemsQuerySchema,
  BudgetPlanItemsResponseSchema,
  BudgetPlanItemsListResponseSchema,
  FlexibleBudgetPlanItemsListResponseSchema,
} from './budget-plan-items.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface BudgetPlanItemsRoutesOptions extends FastifyPluginOptions {
  controller: BudgetPlanItemsController;
}

export async function budgetPlanItemsRoutes(
  fastify: FastifyInstance,
  options: BudgetPlanItemsRoutesOptions,
) {
  const { controller } = options;

  // Create budgetPlanItems
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Budget Plan Items'],
      summary: 'Create a new budgetPlanItems',
      description: 'Create a new budgetPlanItems with the provided data',
      body: CreateBudgetPlanItemsSchema,
      response: {
        201: BudgetPlanItemsResponseSchema,
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
      fastify.verifyPermission('budgetPlanItems', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetPlanItems by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Budget Plan Items'],
      summary: 'Get budgetPlanItems by ID',
      description: 'Retrieve a budgetPlanItems by its unique identifier',
      params: BudgetPlanItemsIdParamSchema,
      querystring: GetBudgetPlanItemsQuerySchema,
      response: {
        200: BudgetPlanItemsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetPlanItems', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetPlanItemss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Budget Plan Items'],
      summary: 'Get all budgetPlanItemss with pagination and formats',
      description:
        'Retrieve budgetPlanItemss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetPlanItemsQuerySchema,
      response: {
        200: FlexibleBudgetPlanItemsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetPlanItems', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetPlanItems
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Budget Plan Items'],
      summary: 'Update budgetPlanItems by ID',
      description: 'Update an existing budgetPlanItems with new data',
      params: BudgetPlanItemsIdParamSchema,
      body: UpdateBudgetPlanItemsSchema,
      response: {
        200: BudgetPlanItemsResponseSchema,
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
      fastify.verifyPermission('budgetPlanItems', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetPlanItems
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Budget Plan Items'],
      summary: 'Delete budgetPlanItems by ID',
      description: 'Delete a budgetPlanItems by its unique identifier',
      params: BudgetPlanItemsIdParamSchema,
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
      fastify.verifyPermission('budgetPlanItems', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
