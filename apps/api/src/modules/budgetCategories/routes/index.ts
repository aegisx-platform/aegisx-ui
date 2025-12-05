import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetCategoriesController } from '../controllers/budget-categories.controller';
import {
  CreateBudgetCategoriesSchema,
  UpdateBudgetCategoriesSchema,
  BudgetCategoriesIdParamSchema,
  GetBudgetCategoriesQuerySchema,
  ListBudgetCategoriesQuerySchema,
  BudgetCategoriesResponseSchema,
  BudgetCategoriesListResponseSchema,
  FlexibleBudgetCategoriesListResponseSchema,
} from '../schemas/budget-categories.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../schemas/base.schemas';
import { SchemaRefs } from '../../../schemas/registry';

export interface BudgetCategoriesRoutesOptions extends FastifyPluginOptions {
  controller: BudgetCategoriesController;
}

export async function budgetCategoriesRoutes(
  fastify: FastifyInstance,
  options: BudgetCategoriesRoutesOptions,
) {
  const { controller } = options;

  // Create budgetCategories
  fastify.post('/', {
    schema: {
      tags: ['BudgetCategories'],
      summary: 'Create a new budgetCategories',
      description: 'Create a new budgetCategories with the provided data',
      body: CreateBudgetCategoriesSchema,
      response: {
        201: BudgetCategoriesResponseSchema,
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
      fastify.verifyPermission('budgetCategories', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetCategories by ID
  fastify.get('/:id', {
    schema: {
      tags: ['BudgetCategories'],
      summary: 'Get budgetCategories by ID',
      description: 'Retrieve a budgetCategories by its unique identifier',
      params: BudgetCategoriesIdParamSchema,
      querystring: GetBudgetCategoriesQuerySchema,
      response: {
        200: BudgetCategoriesResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetCategories', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetCategoriess
  fastify.get('/', {
    schema: {
      tags: ['BudgetCategories'],
      summary: 'Get all budgetCategoriess with pagination and formats',
      description:
        'Retrieve budgetCategoriess with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetCategoriesQuerySchema,
      response: {
        200: FlexibleBudgetCategoriesListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetCategories', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetCategories
  fastify.put('/:id', {
    schema: {
      tags: ['BudgetCategories'],
      summary: 'Update budgetCategories by ID',
      description: 'Update an existing budgetCategories with new data',
      params: BudgetCategoriesIdParamSchema,
      body: UpdateBudgetCategoriesSchema,
      response: {
        200: BudgetCategoriesResponseSchema,
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
      fastify.verifyPermission('budgetCategories', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetCategories
  fastify.delete('/:id', {
    schema: {
      tags: ['BudgetCategories'],
      summary: 'Delete budgetCategories by ID',
      description: 'Delete a budgetCategories by its unique identifier',
      params: BudgetCategoriesIdParamSchema,
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
      fastify.verifyPermission('budgetCategories', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
