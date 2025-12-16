import { promises as fs } from 'fs';
import * as path from 'path';
import { Knex } from 'knex';
import sharp from 'sharp';
import { ProfileRepository } from '../repositories/profile.repository';

/**
 * AvatarService
 *
 * Service for handling user avatar upload and deletion operations.
 * Manages file storage, validation, and updates to user avatar_url field.
 *
 * Features:
 * - Upload and process avatar images (convert to WebP)
 * - Validate image types and file sizes
 * - Delete old avatars on new upload
 * - Update user avatar_url in database
 * - Proper error handling and validation
 */
export class AvatarService {
  private repository: ProfileRepository;
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  constructor(private knex: Knex) {
    this.repository = new ProfileRepository(knex);
  }

  /**
   * Initialize upload directory
   *
   * Creates the upload directory if it doesn't exist.
   * Called during service initialization or on first upload.
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
      throw new Error('Failed to initialize file storage');
    }
  }

  /**
   * Upload and process user avatar
   *
   * Validates the file, converts to WebP format, stores it, and updates the database.
   * Deletes old avatar if a new one is uploaded.
   *
   * @param userId - User ID (UUID)
   * @param file - Image file buffer
   * @param mimetype - MIME type of the uploaded file
   * @returns Object with avatarUrl and uploadedAt timestamp
   * @throws Error with code 'INVALID_FILE_TYPE' (400) if file type not allowed
   * @throws Error with code 'FILE_TOO_LARGE' (400) if file exceeds 5MB
   * @throws Error with code 'PROFILE_NOT_FOUND' (404) if user not found
   */
  async uploadAvatar(
    userId: string,
    file: Buffer,
    mimetype: string,
  ): Promise<{ avatarUrl: string; uploadedAt: string }> {
    // Validate file
    this.validateFileType(mimetype);
    this.validateFileSize(file);

    // Ensure upload directory exists
    await this.ensureUploadDir();

    // Check if user profile exists
    const profile = await this.repository.getProfile(userId);
    if (!profile) {
      const error = new Error('User profile not found');
      (error as any).statusCode = 404;
      (error as any).code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    // Delete old avatar if it exists
    if (profile.avatarUrl) {
      await this.deleteAvatarFile(profile.avatarUrl);
    }

    // Process and save new avatar
    const filename = `${userId}.webp`;
    const filePath = path.join(this.uploadDir, filename);
    const relativeAvatarUrl = `/uploads/avatars/${filename}`;

    try {
      // Convert to WebP and resize to 200x200px using sharp
      await sharp(file)
        .resize(200, 200, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 90 })
        .toFile(filePath);

      // Update database with new avatar URL
      const updatedProfile = await this.repository.updateProfile(userId, {
        avatarUrl: relativeAvatarUrl,
      });

      if (!updatedProfile) {
        // Clean up file if database update failed
        await this.deleteAvatarFile(relativeAvatarUrl);
        throw new Error('Failed to update avatar in database');
      }

      return {
        avatarUrl: relativeAvatarUrl,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      // Clean up file on error
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up avatar file:', cleanupError);
      }
      throw error;
    }
  }

  /**
   * Delete user avatar
   *
   * Removes the user's avatar file and clears the avatar_url field in the database.
   *
   * @param userId - User ID (UUID)
   * @throws Error with code 'PROFILE_NOT_FOUND' (404) if user not found
   */
  async deleteAvatar(userId: string): Promise<void> {
    // Check if user profile exists
    const profile = await this.repository.getProfile(userId);
    if (!profile) {
      const error = new Error('User profile not found');
      (error as any).statusCode = 404;
      (error as any).code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    // Delete file if avatar exists
    if (profile.avatarUrl) {
      await this.deleteAvatarFile(profile.avatarUrl);
    }

    // Clear avatar_url in database
    const updatedProfile = await this.repository.updateProfile(userId, {
      avatarUrl: null,
    });

    if (!updatedProfile) {
      throw new Error('Failed to clear avatar from database');
    }
  }

  /**
   * Delete avatar file from storage
   *
   * Removes the physical avatar file from the uploads directory.
   * Silently fails if file doesn't exist (idempotent).
   *
   * @param avatarUrl - Relative avatar URL (e.g., /uploads/avatars/{userId}.webp)
   */
  private async deleteAvatarFile(avatarUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      // avatarUrl format: /uploads/avatars/{userId}.webp
      const filename = avatarUrl.split('/').pop();
      if (!filename) {
        return;
      }

      const filePath = path.join(this.uploadDir, filename);

      // Verify the file is within the upload directory (security check)
      const realPath = await fs.realpath(filePath).catch(() => null);
      const realUploadDir = await fs.realpath(this.uploadDir).catch(() => null);

      if (!realPath || !realUploadDir || !realPath.startsWith(realUploadDir)) {
        console.warn(
          'Attempted to delete file outside upload directory:',
          filePath,
        );
        return;
      }

      // Delete the file
      await fs.unlink(filePath);
    } catch (error: any) {
      // Silently ignore file not found errors
      if (error.code !== 'ENOENT') {
        console.error('Error deleting avatar file:', error);
      }
    }
  }

  /**
   * Validate file type
   *
   * @param mimetype - MIME type to validate
   * @throws Error with code 'INVALID_FILE_TYPE' (400) if type not allowed
   */
  private validateFileType(mimetype: string): void {
    if (!this.allowedMimeTypes.includes(mimetype)) {
      const error = new Error(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
      (error as any).statusCode = 400;
      (error as any).code = 'INVALID_FILE_TYPE';
      throw error;
    }
  }

  /**
   * Validate file size
   *
   * @param file - File buffer
   * @throws Error with code 'FILE_TOO_LARGE' (400) if file exceeds max size
   */
  private validateFileSize(file: Buffer): void {
    if (file.length > this.maxFileSize) {
      const error = new Error(
        `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`,
      );
      (error as any).statusCode = 400;
      (error as any).code = 'FILE_TOO_LARGE';
      throw error;
    }
  }
}
