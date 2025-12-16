import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { ProfileService } from './services/profile.service';
import { AvatarService } from './services/avatar.service';
import { ProfileController } from './controllers/profile.controller';
import { AvatarController } from './controllers/avatar.controller';
import { PreferencesController } from './controllers/preferences.controller';
import { ActivityController } from './controllers/activity.controller';
import { registerProfileRoutes } from './routes/profile.routes';
import { ActivityLogsRepository } from '../../core/audit/activity-logs/activity-logs.repository';
import { ActivityLogsService } from '../../core/audit/activity-logs/activity-logs.service';

/**
 * User Profile Plugin
 *
 * Fastify plugin that registers the complete user profile module.
 * Initializes repositories, services, controllers, and routes.
 *
 * Dependencies:
 * - knex-plugin: Database connection
 * - redis-plugin: Caching (optional)
 * - file-upload-plugin: File upload handling
 * - schemas-plugin: TypeBox schemas validation
 *
 * Provides:
 * - REST API endpoints for user profile management
 * - User avatar upload and management
 * - User preferences management (theme, language, notifications)
 * - User activity logs retrieval
 * - Account deletion capability
 *
 * Endpoints registered under /v1/platform/profile prefix:
 * - GET    /profile                 - Get user profile
 * - PUT    /profile                 - Update profile
 * - DELETE /profile                 - Delete profile (account deletion)
 * - POST   /profile/avatar          - Upload avatar
 * - DELETE /profile/avatar          - Delete avatar
 * - GET    /profile/preferences     - Get preferences
 * - PUT    /profile/preferences     - Update preferences
 * - GET    /profile/activity        - Get user activity logs
 */
async function userProfilePlugin(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
): Promise<void> {
  // Verify required plugins are loaded
  if (!fastify.knex) {
    throw new Error('User profile plugin requires knex plugin');
  }

  // Initialize profile service (creates its own repository internally)
  const profileService = new ProfileService(fastify.knex);

  // Initialize avatar service (creates its own repository internally)
  const avatarService = new AvatarService(fastify.knex);

  // Initialize activity logs repository and service (for activity controller)
  const activityLogsRepository = new ActivityLogsRepository(fastify.knex);
  const activityLogsService = new ActivityLogsService(
    fastify.knex,
    fastify.redis || null,
  );

  // Initialize controllers
  const profileController = new ProfileController(profileService);
  const avatarController = new AvatarController(avatarService);
  const preferencesController = new PreferencesController(profileService);
  const activityController = new ActivityController(activityLogsService);

  // Register routes with prefix
  await fastify.register(
    async (instance) => {
      await registerProfileRoutes(instance, {
        profile: profileController,
        avatar: avatarController,
        preferences: preferencesController,
        activity: activityController,
      });
    },
    { prefix: '/v1/platform/profile' },
  );

  fastify.log.info('User profile module loaded successfully');
}

/**
 * Export plugin with fastify-plugin wrapper
 *
 * This ensures the plugin can access decorators from parent scope
 * and properly declares its dependencies.
 */
export const userProfileModulePlugin = fp(userProfilePlugin, {
  name: 'user-profile-module',
  dependencies: [
    'knex-plugin',
    'redis-plugin',
    'file-upload-plugin',
    'schemas-plugin',
  ],
});
