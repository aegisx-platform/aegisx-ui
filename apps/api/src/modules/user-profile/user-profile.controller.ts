import { FastifyRequest, FastifyReply } from 'fastify';
// import { MultipartFile } from '@fastify/multipart'; // TODO: Re-enable when file upload is implemented
import { UserProfileService } from './services/user-profile.service';
import { UserProfileUpdateRequest, UserPreferencesUpdateRequest } from './user-profile.types';

export interface UserProfileControllerDependencies {
  userProfileService: UserProfileService;
}

export class UserProfileController {
  constructor(private deps: UserProfileControllerDependencies) {}

  async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      const profile = await this.deps.userProfileService.getUserProfile(userId);
      
      if (!profile) {
        return reply.notFound('User profile not found');
      }

      return reply.success(profile, 'User profile retrieved successfully');
    } catch (error) {
      request.log.error({ error }, 'Error retrieving user profile');
      return reply.internalServerError('Failed to retrieve user profile');
    }
  }

  async updateUserProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      const updates = request.body as UserProfileUpdateRequest;
      
      // Basic validation
      if (updates.name !== undefined && updates.name.trim().length === 0) {
        return reply.badRequest('Name cannot be empty');
      }
      
      if (updates.firstName !== undefined && updates.firstName.trim().length === 0) {
        return reply.badRequest('First name cannot be empty');
      }
      
      if (updates.lastName !== undefined && updates.lastName.trim().length === 0) {
        return reply.badRequest('Last name cannot be empty');
      }

      const updatedProfile = await this.deps.userProfileService.updateUserProfile(userId, updates);
      
      if (!updatedProfile) {
        return reply.notFound('User not found');
      }

      return reply.success(updatedProfile, 'User profile updated successfully');
    } catch (error) {
      request.log.error({ error }, 'Error updating user profile');
      
      if (error.message === 'USER_NOT_FOUND') {
        return reply.notFound('User not found');
      }
      
      if (error.message === 'INVALID_TIMEZONE') {
        return reply.badRequest('Invalid timezone provided');
      }
      
      if (error.message === 'INVALID_LANGUAGE_CODE') {
        return reply.badRequest('Invalid language code provided');
      }

      return reply.internalServerError('Failed to update user profile');
    }
  }

  async getUserPreferences(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      const preferences = await this.deps.userProfileService.getUserPreferences(userId);
      
      return reply.success(preferences, 'User preferences retrieved successfully');
    } catch (error) {
      request.log.error({ error }, 'Error retrieving user preferences');
      return reply.internalServerError('Failed to retrieve user preferences');
    }
  }

  async updateUserPreferences(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      const updates = request.body as UserPreferencesUpdateRequest;
      
      const updatedPreferences = await this.deps.userProfileService.updateUserPreferences(userId, updates);
      
      return reply.success(updatedPreferences, 'User preferences updated successfully');
    } catch (error) {
      request.log.error({ error }, 'Error updating user preferences');
      
      if (error.message === 'INVALID_TIMEZONE') {
        return reply.badRequest('Invalid timezone provided');
      }
      
      if (error.message === 'INVALID_LANGUAGE_CODE') {
        return reply.badRequest('Invalid language code provided');
      }
      
      if (error.message === 'PREFERENCES_UPDATE_FAILED') {
        return reply.internalServerError('Failed to update preferences');
      }

      return reply.internalServerError('Failed to update user preferences');
    }
  }

  async uploadUserAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      // Get the uploaded file
      const data = await request.file();
      
      if (!data) {
        return reply.badRequest('No file uploaded');
      }

      const result = await this.deps.userProfileService.uploadUserAvatar(userId, data);
      
      return reply.success(result, 'Avatar uploaded successfully');
    } catch (error) {
      request.log.error({ error }, 'Error uploading user avatar');
      
      if (error.message === 'UNSUPPORTED_MEDIA_TYPE') {
        return reply.code(415).send({
          success: false,
          error: {
            code: 'UNSUPPORTED_MEDIA_TYPE',
            message: 'Only JPEG, PNG, and WebP images are supported'
          }
        });
      }
      
      if (error.message === 'FILE_TOO_LARGE') {
        return reply.code(413).send({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds maximum limit of 5MB'
          }
        });
      }

      return reply.internalServerError('Failed to upload avatar');
    }
  }

  async deleteUserAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        return reply.unauthorized('Authentication required');
      }

      await this.deps.userProfileService.deleteUserAvatar(userId);
      
      return reply.success(
        { message: 'Avatar deleted successfully' },
        'Avatar deleted successfully'
      );
    } catch (error) {
      request.log.error({ error }, 'Error deleting user avatar');
      
      if (error.message === 'AVATAR_NOT_FOUND') {
        return reply.notFound('No avatar found for the current user');
      }

      return reply.internalServerError('Failed to delete avatar');
    }
  }
}