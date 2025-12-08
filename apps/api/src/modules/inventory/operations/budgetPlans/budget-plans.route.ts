import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetPlansController } from './budget-plans.controller';
import {
  CreateBudgetPlansSchema,
  UpdateBudgetPlansSchema,
  BudgetPlansIdParamSchema,
  GetBudgetPlansQuerySchema,
  ListBudgetPlansQuerySchema,
  BudgetPlansResponseSchema,
  BudgetPlansListResponseSchema,
  FlexibleBudgetPlansListResponseSchema,
} from './budget-plans.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface BudgetPlansRoutesOptions extends FastifyPluginOptions {
  controller: BudgetPlansController;
}

export async function budgetPlansRoutes(
  fastify: FastifyInstance,
  options: BudgetPlansRoutesOptions,
) {
  const { controller } = options;

  // Create budgetPlans
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Budget Plans'],
      summary: 'Create a new budgetPlans',
      description: 'Create a new budgetPlans with the provided data',
      body: CreateBudgetPlansSchema,
      response: {
        201: BudgetPlansResponseSchema,
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
      fastify.verifyPermission('budgetPlans', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetPlans by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Budget Plans'],
      summary: 'Get budgetPlans by ID',
      description: 'Retrieve a budgetPlans by its unique identifier',
      params: BudgetPlansIdParamSchema,
      querystring: GetBudgetPlansQuerySchema,
      response: {
        200: BudgetPlansResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetPlans', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetPlanss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Budget Plans'],
      summary: 'Get all budgetPlanss with pagination and formats',
      description:
        'Retrieve budgetPlanss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetPlansQuerySchema,
      response: {
        200: FlexibleBudgetPlansListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetPlans', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetPlans
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Budget Plans'],
      summary: 'Update budgetPlans by ID',
      description: 'Update an existing budgetPlans with new data',
      params: BudgetPlansIdParamSchema,
      body: UpdateBudgetPlansSchema,
      response: {
        200: BudgetPlansResponseSchema,
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
      fastify.verifyPermission('budgetPlans', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetPlans
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Budget Plans'],
      summary: 'Delete budgetPlans by ID',
      description: 'Delete a budgetPlans by its unique identifier',
      params: BudgetPlansIdParamSchema,
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
      fastify.verifyPermission('budgetPlans', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
