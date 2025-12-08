import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { DrugComponentsController } from './drug-components.controller';
import {
  CreateDrugComponentsSchema,
  UpdateDrugComponentsSchema,
  DrugComponentsIdParamSchema,
  GetDrugComponentsQuerySchema,
  ListDrugComponentsQuerySchema,
  DrugComponentsResponseSchema,
  DrugComponentsListResponseSchema,
  FlexibleDrugComponentsListResponseSchema,
} from './drug-components.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../schemas/registry';

export interface DrugComponentsRoutesOptions extends FastifyPluginOptions {
  controller: DrugComponentsController;
}

export async function drugComponentsRoutes(
  fastify: FastifyInstance,
  options: DrugComponentsRoutesOptions,
) {
  const { controller } = options;

  // Create drugComponents
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Drug Components'],
      summary: 'Create a new drugComponents',
      description: 'Create a new drugComponents with the provided data',
      body: CreateDrugComponentsSchema,
      response: {
        201: DrugComponentsResponseSchema,
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
      fastify.verifyPermission('drugComponents', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get drugComponents by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Drug Components'],
      summary: 'Get drugComponents by ID',
      description: 'Retrieve a drugComponents by its unique identifier',
      params: DrugComponentsIdParamSchema,
      querystring: GetDrugComponentsQuerySchema,
      response: {
        200: DrugComponentsResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugComponents', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all drugComponentss
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Drug Components'],
      summary: 'Get all drugComponentss with pagination and formats',
      description:
        'Retrieve drugComponentss with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListDrugComponentsQuerySchema,
      response: {
        200: FlexibleDrugComponentsListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('drugComponents', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update drugComponents
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Drug Components'],
      summary: 'Update drugComponents by ID',
      description: 'Update an existing drugComponents with new data',
      params: DrugComponentsIdParamSchema,
      body: UpdateDrugComponentsSchema,
      response: {
        200: DrugComponentsResponseSchema,
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
      fastify.verifyPermission('drugComponents', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete drugComponents
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Drug Components'],
      summary: 'Delete drugComponents by ID',
      description: 'Delete a drugComponents by its unique identifier',
      params: DrugComponentsIdParamSchema,
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
      fastify.verifyPermission('drugComponents', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
