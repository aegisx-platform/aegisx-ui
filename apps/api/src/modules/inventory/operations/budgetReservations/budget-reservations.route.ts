import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BudgetReservationsController } from './budget-reservations.controller';
import {
  CreateBudgetReservationsSchema,
  UpdateBudgetReservationsSchema,
  BudgetReservationsIdParamSchema,
  GetBudgetReservationsQuerySchema,
  ListBudgetReservationsQuerySchema,
  BudgetReservationsResponseSchema,
  BudgetReservationsListResponseSchema,
  FlexibleBudgetReservationsListResponseSchema,
} from './budget-reservations.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface BudgetReservationsRoutesOptions extends FastifyPluginOptions {
  controller: BudgetReservationsController;
}

export async function budgetReservationsRoutes(
  fastify: FastifyInstance,
  options: BudgetReservationsRoutesOptions,
) {
  const { controller } = options;

  // Create budgetReservations
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Budget Reservations'],
      summary: 'Create a new budgetReservations',
      description: 'Create a new budgetReservations with the provided data',
      body: CreateBudgetReservationsSchema,
      response: {
        201: BudgetReservationsResponseSchema,
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
      fastify.verifyPermission('budgetReservations', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get budgetReservations by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Budget Reservations'],
      summary: 'Get budgetReservations by ID',
      description: 'Retrieve a budgetReservations by its unique identifier',
      params: BudgetReservationsIdParamSchema,
      querystring: GetBudgetReservationsQuerySchema,
      response: {
        200: BudgetReservationsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetReservations', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all budgetReservationss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Budget Reservations'],
      summary: 'Get all budgetReservationss with pagination and formats',
      description:
        'Retrieve budgetReservationss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBudgetReservationsQuerySchema,
      response: {
        200: FlexibleBudgetReservationsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('budgetReservations', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update budgetReservations
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Budget Reservations'],
      summary: 'Update budgetReservations by ID',
      description: 'Update an existing budgetReservations with new data',
      params: BudgetReservationsIdParamSchema,
      body: UpdateBudgetReservationsSchema,
      response: {
        200: BudgetReservationsResponseSchema,
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
      fastify.verifyPermission('budgetReservations', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete budgetReservations
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Budget Reservations'],
      summary: 'Delete budgetReservations by ID',
      description: 'Delete a budgetReservations by its unique identifier',
      params: BudgetReservationsIdParamSchema,
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
      fastify.verifyPermission('budgetReservations', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
