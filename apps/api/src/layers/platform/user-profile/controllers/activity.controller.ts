import { FastifyRequest, FastifyReply } from 'fastify';
import { ActivityLogsService } from '../../../core/audit/activity-logs/activity-logs.service';
import { ActivityQuery } from '../../../core/audit/activity-logs/activity-logs.schemas';

/**
 * ActivityController
 *
 * Controller for user activity logs endpoints.
 * Provides access to activity logs for the authenticated user.
 *
 * Features:
 * - Get user activity logs with pagination
 * - Filter activity logs
 * - Sorted by timestamp (newest first)
 */
export class ActivityController {
  constructor(private activityLogsService: ActivityLogsService) {}

  /**
   * GET /profile/activity
   * Get activity logs for the authenticated user
   *
   * Retrieves paginated activity logs for the current user.
   * Supports pagination via query parameters.
   *
   * @param request - FastifyRequest with user context and query parameters
   * @param reply - FastifyReply for sending response
   * @returns Paginated activity logs
   */
  async getActivity(
    request: FastifyRequest<{ Querystring: Partial<ActivityQuery> }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const page = request.query.page || 1;
      const limit = request.query.limit || 10;

      request.log.info({ userId, page, limit }, 'Fetching user activity logs');

      // Build query with userId and pagination
      const query: Partial<ActivityQuery> = {
        ...request.query,
        userId,
        page,
        limit,
      };

      // Get activity logs using service
      const result = await this.activityLogsService.findAll(
        query as ActivityQuery,
      );

      request.log.info(
        {
          userId,
          count: result.data?.length || 0,
          total: result.total || 0,
        },
        'User activity logs retrieved successfully',
      );

      // Return paginated response in standard format
      return reply.send({
        success: true,
        data: result.data,
        pagination: {
          page: result.page || page,
          limit: result.limit || limit,
          total: result.total || 0,
          totalPages:
            result.totalPages ||
            Math.ceil((result.total || 0) / (limit as number)),
          hasNext: result.page ? result.page < (result.totalPages || 0) : false,
          hasPrev: (page as number) > 1,
        },
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          query: request.query,
        },
        'Error fetching user activity logs',
      );

      throw error;
    }
  }
}
