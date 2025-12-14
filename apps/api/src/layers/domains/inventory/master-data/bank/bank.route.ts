import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BankController } from './bank.controller';
import {
  CreateBankSchema,
  UpdateBankSchema,
  BankIdParamSchema,
  GetBankQuerySchema,
  ListBankQuerySchema,
  BankResponseSchema,
  BankListResponseSchema,
  FlexibleBankListResponseSchema,
} from './bank.schemas';
import { ApiErrorResponseSchema as ErrorResponseSchema } from '../../../../../schemas/base.schemas';
import { SchemaRefs } from '../../../../../schemas/registry';

export interface BankRoutesOptions extends FastifyPluginOptions {
  controller: BankController;
}

export async function bankRoutes(
  fastify: FastifyInstance,
  options: BankRoutesOptions,
) {
  const { controller } = options;

  // Create bank
  fastify.post('/', {
    schema: {
      tags: ['Inventory: Bank'],
      summary: 'Create a new bank',
      description: 'Create a new bank with the provided data',
      body: CreateBankSchema,
      response: {
        201: BankResponseSchema,
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
      fastify.verifyPermission('bank', 'create'),
    ], // Authentication & authorization required
    handler: controller.create.bind(controller),
  });

  // Get bank by ID
  fastify.get('/:id', {
    schema: {
      tags: ['Inventory: Bank'],
      summary: 'Get bank by ID',
      description: 'Retrieve a bank by its unique identifier',
      params: BankIdParamSchema,
      querystring: GetBankQuerySchema,
      response: {
        200: BankResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        404: SchemaRefs.NotFound,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('bank', 'read'),
    ], // Authentication & authorization required
    handler: controller.findOne.bind(controller),
  });

  // Get all banks
  fastify.get('/', {
    schema: {
      tags: ['Inventory: Bank'],
      summary: 'Get all banks with pagination and formats',
      description:
        'Retrieve banks with flexible formatting: ?format=dropdown for UI components, ?format=minimal for lightweight data, ?fields=id,name for custom field selection',
      querystring: ListBankQuerySchema,
      response: {
        200: FlexibleBankListResponseSchema,
        400: SchemaRefs.ValidationError,
        401: SchemaRefs.Unauthorized,
        403: SchemaRefs.Forbidden,
        500: SchemaRefs.ServerError,
      },
    },
    preValidation: [
      fastify.authenticate,
      fastify.verifyPermission('bank', 'read'),
    ], // Authentication & authorization required
    handler: controller.findMany.bind(controller),
  });

  // Update bank
  fastify.put('/:id', {
    schema: {
      tags: ['Inventory: Bank'],
      summary: 'Update bank by ID',
      description: 'Update an existing bank with new data',
      params: BankIdParamSchema,
      body: UpdateBankSchema,
      response: {
        200: BankResponseSchema,
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
      fastify.verifyPermission('bank', 'update'),
    ], // Authentication & authorization required
    handler: controller.update.bind(controller),
  });

  // Delete bank
  fastify.delete('/:id', {
    schema: {
      tags: ['Inventory: Bank'],
      summary: 'Delete bank by ID',
      description: 'Delete a bank by its unique identifier',
      params: BankIdParamSchema,
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
      fastify.verifyPermission('bank', 'delete'),
    ], // Authentication & authorization required
    handler: controller.delete.bind(controller),
  });
}
