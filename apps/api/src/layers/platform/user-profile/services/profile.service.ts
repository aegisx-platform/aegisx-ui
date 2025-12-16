import { Knex } from 'knex';
import { Profile, UpdateProfile } from '../schemas/profile.schemas';
import { ProfileRepository } from '../repositories/profile.repository';

/**
 * ProfileService
 *
 * Service layer for user profile management, providing business logic and validation
 * for profile operations including department validation.
 *
 * Features:
 * - Get user profile
 * - Update user profile with validation
 * - Validate department existence
 * - Error handling with appropriate HTTP status codes
 */
export class ProfileService {
  private repository: ProfileRepository;

  constructor(private knex: Knex) {
    this.repository = new ProfileRepository(knex);
  }

  /**
   * Get user profile
   *
   * Retrieves a user's profile information by ID.
   *
   * @param userId - User ID (UUID)
   * @returns Profile object
   * @throws Error with code 'PROFILE_NOT_FOUND' (404) if user not found
   */
  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.repository.getProfile(userId);

    if (!profile) {
      const error = new Error('User profile not found');
      (error as any).statusCode = 404;
      (error as any).code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    return profile;
  }

  /**
   * Update user profile
   *
   * Updates user profile with validation of required fields.
   * Validates department_id if provided.
   *
   * @param userId - User ID (UUID)
   * @param data - Partial profile data to update
   * @returns Updated profile object
   * @throws Error with code 'PROFILE_NOT_FOUND' (404) if user not found
   * @throws Error with code 'INVALID_DEPARTMENT' (400) if department is invalid
   */
  async updateProfile(
    userId: string,
    data: Partial<UpdateProfile>,
  ): Promise<Profile> {
    // Validate that user exists first
    const existingProfile = await this.repository.getProfile(userId);
    if (!existingProfile) {
      const error = new Error('User profile not found');
      (error as any).statusCode = 404;
      (error as any).code = 'PROFILE_NOT_FOUND';
      throw error;
    }

    // Validate department if provided and not null
    if (data.departmentId !== undefined && data.departmentId !== null) {
      const isValidDepartment = await this.validateDepartment(
        data.departmentId,
      );
      if (!isValidDepartment) {
        const error = new Error('Invalid department ID');
        (error as any).statusCode = 400;
        (error as any).code = 'INVALID_DEPARTMENT';
        throw error;
      }
    }

    // Update profile
    const updatedProfile = await this.repository.updateProfile(userId, data);

    if (!updatedProfile) {
      const error = new Error('Failed to update user profile');
      (error as any).statusCode = 500;
      (error as any).code = 'UPDATE_FAILED';
      throw error;
    }

    return updatedProfile;
  }

  /**
   * Validate department exists
   *
   * Checks if a department with the given ID exists and is active in the departments table.
   *
   * @param departmentId - Department ID to validate
   * @returns true if department exists and is active, false otherwise
   */
  async validateDepartment(departmentId: string): Promise<boolean> {
    try {
      const department = await this.knex('departments')
        .select('id', 'is_active')
        .where('id', departmentId)
        .first();

      if (!department) {
        return false;
      }

      // Check if department is active
      return department.is_active === true;
    } catch (error) {
      // If error querying departments table, log and return false
      console.error('Error validating department:', error);
      return false;
    }
  }
}
