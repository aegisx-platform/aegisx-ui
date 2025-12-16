import { FastifyRequest, FastifyReply } from 'fastify';
import { ProfileService } from '../services/profile.service';
import {
  Profile,
  UpdateProfile,
  UpdatePreferences,
  Theme,
  Language,
} from '../schemas/profile.schemas';

/**
 * Preferences Interface
 *
 * User preference settings extracted from profile
 */
export interface UserPreferences {
  theme?: Theme;
  language?: Language;
  notifications?: boolean;
}

/**
 * PreferencesController
 *
 * Controller for user preferences management endpoints.
 * Handles retrieval and update of user preferences (theme, language, notifications).
 *
 * Features:
 * - Get user preferences
 * - Update user preferences
 * - Extract preferences from profile data
 */
export class PreferencesController {
  constructor(private profileService: ProfileService) {}

  /**
   * GET /profile/preferences
   * Get the authenticated user's preferences
   *
   * Retrieves the user's profile and extracts preference settings.
   *
   * @param request - FastifyRequest with user context
   * @param reply - FastifyReply for sending response
   * @returns UserPreferences object with theme, language, notifications
   */
  async getPreferences(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      request.log.info({ userId }, 'Fetching user preferences');

      const profile = await this.profileService.getProfile(userId);

      // Extract preferences from profile
      const preferences: UserPreferences = {
        theme: (profile as any).theme,
        language: (profile as any).language,
        notifications: (profile as any).notifications,
      };

      request.log.info({ userId }, 'User preferences retrieved successfully');
      return reply.success(preferences);
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
        },
        'Error fetching user preferences',
      );

      if (error.code === 'PROFILE_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'User profile not found',
          },
        });
      }

      throw error;
    }
  }

  /**
   * PUT /profile/preferences
   * Update the authenticated user's preferences
   *
   * Updates user preferences such as theme, language, and notifications.
   *
   * @param request - FastifyRequest with user context and body
   * @param reply - FastifyReply for sending response
   * @returns Updated preferences
   */
  async updatePreferences(
    request: FastifyRequest<{ Body: UserPreferences }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const preferences = request.body;

      request.log.info(
        { userId, preferenceFields: Object.keys(preferences) },
        'Updating user preferences',
      );

      // Convert preferences to profile update data (with proper types)
      const updateData: Partial<UpdateProfile> = {};
      if (preferences.theme !== undefined) {
        updateData.theme = preferences.theme;
      }
      if (preferences.language !== undefined) {
        updateData.language = preferences.language;
      }
      if (preferences.notifications !== undefined) {
        updateData.notifications = preferences.notifications;
      }

      const updatedProfile = await this.profileService.updateProfile(
        userId,
        updateData,
      );

      // Extract updated preferences from profile
      const updatedPreferences: UserPreferences = {
        theme: (updatedProfile as any).theme,
        language: (updatedProfile as any).language,
        notifications: (updatedProfile as any).notifications,
      };

      request.log.info({ userId }, 'User preferences updated successfully');
      return reply.success(updatedPreferences);
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          preferences: request.body,
        },
        'Error updating user preferences',
      );

      if (error.code === 'PROFILE_NOT_FOUND') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'User profile not found',
          },
        });
      }

      if (error.code === 'INVALID_DEPARTMENT') {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'INVALID_DEPARTMENT',
            message: 'Invalid department ID',
          },
        });
      }

      throw error;
    }
  }
}
