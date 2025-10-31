import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ErrorLogsController } from './error-logs.controller';
import { SchemaRefs } from '../../schemas/registry';
import { ErrorLogsQuery, CleanupQuery } from './error-logs.schemas';

export interface ErrorLogsRoutesOptions {
  controller: ErrorLogsController;
}

async function errorLogsRoutes(
  fastify: FastifyInstance,
  options: ErrorLogsRoutesOptions,
) {
  const { controller } = options;
  const typedFastify = fastify.withTypeProvider<TypeBoxTypeProvider>();

  // GET /error-logs - List all error logs with filters
  typedFastify.get(
    '/',
    {
      schema: {
        summary: 'List error logs',
        description: 'Get paginated list of error logs with optional filters',
        tags: ['error-logs'],
        querystring: SchemaRefs.module('error-logs', 'error-logs-query'),
        response: {
          200: SchemaRefs.module('error-logs', 'error-logs-list-response'),
          400: SchemaRefs.ServerError,
          401: SchemaRefs.Unauthorized,
          500: SchemaRefs.ServerError,
        },
      },
      preValidation: [
        fastify.verifyJWT,
        fastify.verifyPermission(['error-logs:read', '*:*']),
      ],
    },
    controller.findAll.bind(controller),
  );

  // GET /error-logs/stats - Get error statistics
  typedFastify.get(
    '/stats',
    {
      schema: {
        summary: 'Get error statistics',
        description: 'Get error statistics and trends',
        tags: ['error-logs'],
        querystring: Type.Object({
          days: Type.Optional(Type.Number({ minimum: 1, maximum: 365 })),
        }),
        response: {
          200: SchemaRefs.module('error-logs', 'error-stats-response'),
          401: SchemaRefs.Unauthorized,
          500: SchemaRefs.ServerError,
        },
      },
      preValidation: [
        fastify.verifyJWT,
        fastify.verifyPermission(['error-logs:read', '*:*']),
      ],
    },
    controller.getStats.bind(controller),
  );

  // GET /error-logs/:id - Get single error log
  typedFastify.get(
    '/:id',
    {
      schema: {
        summary: 'Get error log by ID',
        description: 'Get detailed error log by ID',
        tags: ['error-logs'],
        params: Type.Object({
          id: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: SchemaRefs.module('error-logs', 'error-log-response'),
          401: SchemaRefs.Unauthorized,
          404: SchemaRefs.NotFound,
          500: SchemaRefs.ServerError,
        },
      },
      preValidation: [
        fastify.verifyJWT,
        fastify.verifyPermission(['error-logs:read', '*:*']),
      ],
    },
    controller.findById.bind(controller),
  );

  // DELETE /error-logs/cleanup - Cleanup old errors
  typedFastify.delete(
    '/cleanup',
    {
      schema: {
        summary: 'Cleanup old error logs',
        description: 'Delete error logs older than specified days',
        tags: ['error-logs'],
        querystring: SchemaRefs.module('error-logs', 'cleanup-query'),
        response: {
          200: SchemaRefs.module('error-logs', 'cleanup-response'),
          401: SchemaRefs.Unauthorized,
          403: SchemaRefs.Forbidden,
          500: SchemaRefs.ServerError,
        },
      },
      preValidation: [
        fastify.verifyJWT,
        fastify.verifyPermission(['error-logs:delete', '*:*']),
      ],
    },
    controller.cleanup.bind(controller),
  );
}

export default errorLogsRoutes;
