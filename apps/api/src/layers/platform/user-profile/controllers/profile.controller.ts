import { FastifyRequest, FastifyReply } from 'fastify';
import { ProfileService } from '../services/profile.service';
import { Profile, UpdateProfile } from '../schemas/profile.schemas';

/**
 * ProfileController
 *
 * Controller for user profile management endpoints.
 * Handles GET and PUT operations for user profiles.
 *
 * Features:
 * - Get user profile by ID
 * - Update user profile with validation
 * - Error handling with appropriate HTTP status codes
 */
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * GET /profile
   * Get the authenticated user's profile
   *
   * Extracts userId from request.user.id and retrieves the profile.
   *
   * @param request - FastifyRequest with user context
   * @param reply - FastifyReply for sending response
   * @returns Profile object
   */
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      request.log.info({ userId }, 'Fetching user profile');

      const profile = await this.profileService.getProfile(userId);

      request.log.info({ userId }, 'User profile retrieved successfully');
      return reply.success(profile);
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
        },
        'Error fetching user profile',
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
   * PUT /profile
   * Update the authenticated user's profile
   *
   * Extracts userId from request.user.id and updates the profile with provided data.
   *
   * @param request - FastifyRequest with user context and body
   * @param reply - FastifyReply for sending response
   * @returns Updated profile object
   */
  async updateProfile(
    request: FastifyRequest<{ Body: Partial<UpdateProfile> }>,
    reply: FastifyReply,
  ) {
    try {
      const userId = request.user.id;
      const data = request.body;

      request.log.info(
        { userId, updateFields: Object.keys(data) },
        'Updating user profile',
      );

      const updatedProfile = await this.profileService.updateProfile(
        userId,
        data,
      );

      request.log.info({ userId }, 'User profile updated successfully');
      return reply.success(updatedProfile);
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
          body: request.body,
        },
        'Error updating user profile',
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
