import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ActivityLogsController } from './activity-logs.controller';
import {
  ActivityLogsSchemas,
  ActivityQuery,
  ActivityQuerySchema,
} from './activity-logs.schemas';
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
 * Activity Logs Routes
 *
 * Registers REST API routes for activity logs with authentication and RBAC.
 *
 * Routes:
 * - GET    /activity-logs          - List activity logs (monitoring:read)
 * - GET    /activity-logs/stats    - Get statistics (monitoring:read)
 * - GET    /activity-logs/:id      - Get single log (monitoring:read)
 * - DELETE /activity-logs/:id      - Delete log (monitoring:write)
 * - DELETE /activity-logs/cleanup  - Cleanup old logs (monitoring:write)
 * - GET    /activity-logs/export   - Export logs (monitoring:read)
 *
 * All routes require JWT authentication.
 * Permissions enforced via RBAC (monitoring:read, monitoring:write).
 */
export async function registerActivityLogsRoutes(
  fastify: FastifyInstance,
  controller: ActivityLogsController,
): Promise<void> {
  // ==================== PUBLIC ROUTES (WITH AUTH) ====================

  /**
   * GET /activity-logs
   * List activity logs with pagination and filters
   */
  fastify.get(
    '/',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'List activity logs with pagination and filters',
        tags: ['Activity Logs'],
        querystring: ActivityQuerySchema,
        response: {
          200: ActivityLogsSchemas.ActivityLogsListResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: ActivityQuery }>,
      reply: FastifyReply,
    ) => controller.findAll(req, reply),
  );

  /**
   * GET /activity-logs/stats
   * Get activity logs statistics
   */
  fastify.get(
    '/stats',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Get activity logs statistics',
        tags: ['Activity Logs'],
        querystring: DaysParamSchema,
        response: {
          200: ActivityLogsSchemas.ActivityStatsResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: DaysParam }>,
      reply: FastifyReply,
    ) => controller.getStats(req, reply),
  );

  /**
   * GET /activity-logs/export
   * Export activity logs to CSV or JSON
   */
  fastify.get(
    '/export',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Export activity logs to CSV or JSON',
        tags: ['Activity Logs'],
        querystring: ExportQuerySchema,
      },
    },
    async (
      req: FastifyRequest<{ Querystring: ExportQuery }>,
      reply: FastifyReply,
    ) => controller.export(req, reply),
  );

  /**
   * GET /activity-logs/:id
   * Get single activity log by ID
   */
  fastify.get(
    '/:id',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'read'),
      ],
      schema: {
        description: 'Get single activity log by ID',
        tags: ['Activity Logs'],
        params: IdParamSchema,
        response: {
          200: ActivityLogsSchemas.ActivityLogResponse,
        },
      },
    },
    async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) =>
      controller.findById(req, reply),
  );

  /**
   * DELETE /activity-logs/:id
   * Delete single activity log
   */
  fastify.delete(
    '/:id',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'write'),
      ],
      schema: {
        description: 'Delete single activity log',
        tags: ['Activity Logs'],
        params: IdParamSchema,
        response: {
          200: ActivityLogsSchemas.ActivityDeleteResponse,
        },
      },
    },
    async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) =>
      controller.delete(req, reply),
  );

  /**
   * DELETE /activity-logs/cleanup
   * Cleanup old activity logs
   */
  fastify.delete(
    '/cleanup',
    {
      preValidation: [
        fastify.authenticate,
        fastify.verifyPermission('monitoring', 'write'),
      ],
      schema: {
        description: 'Cleanup old activity logs',
        tags: ['Activity Logs'],
        querystring: CleanupQuerySchema,
        response: {
          200: ActivityLogsSchemas.ActivityCleanupResponse,
        },
      },
    },
    async (
      req: FastifyRequest<{ Querystring: CleanupQuery }>,
      reply: FastifyReply,
    ) => controller.cleanup(req, reply),
  );
}
