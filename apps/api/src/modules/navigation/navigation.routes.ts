import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createNavigationController } from './navigation.controller';
import { navigationRouteSchemas } from './navigation.schemas';

/**
 * Navigation Routes
 * Defines HTTP routes for the navigation API
 * Includes authentication, validation, and proper error handling
 */
export default async function navigationRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // Get navigation service from fastify instance
  const navigationService = fastify.navigationService;
  if (!navigationService) {
    throw new Error('NavigationService not found. Make sure the navigation plugin is registered.');
  }

  // Create controller instance
  const controller = createNavigationController(navigationService);

  /**
   * GET /navigation
   * Get complete navigation structure
   * Requires authentication and navigation.view permission
   */
  fastify.get('/navigation', {
    schema: navigationRouteSchemas.getNavigation,
    preHandler: [
      fastify.authenticate, // JWT authentication
      fastify.verifyPermission('navigation', 'view') // Permission check
    ],
    handler: controller.getNavigation
  });

  /**
   * GET /navigation/user
   * Get user-specific navigation filtered by permissions
   * Requires authentication
   */
  fastify.get('/navigation/user', {
    schema: navigationRouteSchemas.getUserNavigation,
    preHandler: [
      fastify.authenticate // JWT authentication only
    ],
    handler: controller.getUserNavigation
  });

  // Health check for navigation module
  fastify.get('/navigation/health', {
    schema: {
      description: 'Navigation module health check',
      tags: ['Navigation', 'Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            module: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const startTime = process.hrtime.bigint();
      
      try {
        // Simple database connectivity test
        await fastify.knex.raw('SELECT 1');
        
        const endTime = process.hrtime.bigint();
        const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

        return reply.success({
          module: 'navigation',
          status: 'healthy',
          database: 'connected',
          responseTime: `${responseTime.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }, 'Navigation module is healthy');
      } catch (error) {
        fastify.log.error(`Navigation health check failed: ${error}`);
        
        return reply.error(
          'HEALTH_CHECK_FAILED',
          'Navigation module health check failed',
          500,
          {
            module: 'navigation',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        );
      }
    }
  });

  // Log registered routes
  fastify.log.info('Navigation routes registered successfully');
}