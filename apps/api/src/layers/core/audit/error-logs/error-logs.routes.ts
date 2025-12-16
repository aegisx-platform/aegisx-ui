import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ErrorLogsController } from './error-logs.controller';
import {
  ErrorLogsSchemas,
  ErrorQuery,
  ErrorQuerySchema,
} from './error-logs.schemas';
import {
  IdParamSchema,
  DaysParamSchema,
  CleanupQuerySchema,
  ExportQuerySchema,
  type IdParam,
  type DaysParam,
  type CleanupQuery,
  type ExportQuery,
} from '../base/base.schemas';

/**
 * Error Logs Routes
 *
 * Registers REST API routes for error logs with authentication and RBAC.
 *
 * Routes:
 * - GET    /error-logs          - List error logs (monitoring:read)
 * - GET    /error-logs/stats    - Get statistics (monitoring:read)
 * - GET    /error-logs/:id      - Get single log (monitoring:read)
 * - DELETE /error-logs/:id      - Delete log (monitoring:write)
 * - DELETE /error-logs/cleanup  - Cleanup old logs (monitoring:write)
 * - GET    /error-logs/export   - Export logs (monitoring:read)
 *
 * All routes require JWT authentication.
 * Permissions enforced via RBAC (monitoring:read, monitoring:write).
 */
export async function registerErrorLogsRoutes(
  fastify: FastifyInstance,
  controller: ErrorLogsController,
): Promise<void> {
  // ==================== PUBLIC ROUTES (WITH AUTH) ====================

  /**
   * GET /error-logs
   * List error logs with pagination and filters
   */
  fastify.get(
    '/',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'List error logs with pagination and filters',
        tags: ['Error Logs'],
        querystring: ErrorQuerySchema,
        response: {
          200: ErrorLogsSchemas.ErrorLogsListResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: ErrorQuery }>,
      reply: FastifyReply,
    ) => controller.findAll(req, reply),
  );

  /**
   * GET /error-logs/stats
   * Get error logs statistics
   */
  fastify.get(
    '/stats',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Get error logs statistics',
        tags: ['Error Logs'],
        querystring: DaysParamSchema,
        response: {
          200: ErrorLogsSchemas.ErrorStatsResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: DaysParam }>,
      reply: FastifyReply,
    ) => controller.getStats(req, reply),
  );

  /**
   * GET /error-logs/export
   * Export error logs to CSV or JSON
   */
  fastify.get(
    '/export',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Export error logs to CSV or JSON',
        tags: ['Error Logs'],
        querystring: ExportQuerySchema,
      },
    },
    async (
      req: FastifyRequest<{ Querystring: ExportQuery }>,
      reply: FastifyReply,
    ) => controller.export(req, reply),
  );

  /**
   * GET /error-logs/:id
   * Get single error log by ID
   */
  fastify.get(
    '/:id',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Get single error log by ID',
        tags: ['Error Logs'],
        params: IdParamSchema,
        response: {
          200: ErrorLogsSchemas.ErrorLogResponse,
        },
      },
    },
    async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) =>
      controller.findById(req, reply),
  );

  /**
   * DELETE /error-logs/:id
   * Delete single error log
   */
  fastify.delete(
    '/:id',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'write'),
      ],
      schema: {
        description: 'Delete single error log',
        tags: ['Error Logs'],
        params: IdParamSchema,
        response: {
          200: ErrorLogsSchemas.ErrorDeleteResponse,
        },
      },
    },
    async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) =>
      controller.delete(req, reply),
  );

  /**
   * DELETE /error-logs/cleanup
   * Cleanup old error logs
   */
  fastify.delete(
    '/cleanup',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'write'),
      ],
      schema: {
        description: 'Cleanup old error logs',
        tags: ['Error Logs'],
        querystring: CleanupQuerySchema,
        response: {
          200: ErrorLogsSchemas.ErrorCleanupResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: CleanupQuery }>,
      reply: FastifyReply,
    ) => controller.cleanup(req, reply),
  );
}
