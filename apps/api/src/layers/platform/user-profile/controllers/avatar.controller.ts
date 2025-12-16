import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { AvatarService } from '../services/avatar.service';

/**
 * AvatarController
 *
 * Controller for user avatar management endpoints.
 * Handles avatar upload and deletion operations.
 *
 * Features:
 * - Upload user avatar (image file processing)
 * - Delete user avatar
 * - File validation and error handling
 */
export class AvatarController {
  constructor(private avatarService: AvatarService) {}

  /**
   * POST /profile/avatar
   * Upload user avatar (multipart file upload)
   *
   * Accepts a multipart form with file upload, validates the image,
   * processes it, and stores it.
   *
   * @param request - FastifyRequest with multipart file data
   * @param reply - FastifyReply for sending response
   * @returns Object with avatarUrl and uploadedAt timestamp
   */
  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      request.log.info({ userId }, 'Processing avatar upload');

      // Get file from multipart form
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'NO_FILE_PROVIDED',
            message: 'No file provided in request',
          },
        });
      }

      // Extract file buffer and mimetype
      const fileBuffer = await data.toBuffer();
      const mimetype = data.mimetype;

      request.log.info(
        { userId, mimetype, fileSize: fileBuffer.length },
        'Avatar file received',
      );

      // Upload avatar through service
      const result = await this.avatarService.uploadAvatar(
        userId,
        fileBuffer,
        mimetype,
      );

      request.log.info(
        { userId, avatarUrl: result.avatarUrl },
        'Avatar uploaded successfully',
      );
      return reply.success(result);
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
        },
        'Error uploading avatar',
      );

      if (error.code === 'INVALID_FILE_TYPE') {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: error.message,
          },
        });
      }

      if (error.code === 'FILE_TOO_LARGE') {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: error.message,
          },
        });
      }

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
   * DELETE /profile/avatar
   * Delete user's avatar
   *
   * Removes the avatar file and clears the avatar_url field in the database.
   *
   * @param request - FastifyRequest with user context
   * @param reply - FastifyReply for sending response
   * @returns Success message
   */
  async deleteAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;

      request.log.info({ userId }, 'Deleting user avatar');

      await this.avatarService.deleteAvatar(userId);

      request.log.info({ userId }, 'Avatar deleted successfully');
      return reply.success({
        message: 'Avatar deleted successfully',
      });
    } catch (error: any) {
      request.log.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: request.user.id,
        },
        'Error deleting avatar',
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
}
