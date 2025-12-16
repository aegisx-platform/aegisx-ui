import { Profile, UpdateProfile } from '../schemas/profile.schemas';

/**
 * ProfileRepository
 *
 * Handles database operations for user profiles, including retrieval and updates.
 * Works with the users table and maps snake_case database columns to camelCase API fields.
 */
export class ProfileRepository {
  constructor(private knex: any) {}

  /**
   * Get user profile by ID
   *
   * Retrieves a user's profile information from the users table,
   * excluding sensitive data like password_hash.
   *
   * @param userId - User ID (UUID)
   * @returns Profile object or null if user not found
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const user = await this.knex('users')
      .select(
        'id',
        'email',
        'first_name',
        'last_name',
        'department_id',
        'avatar_url',
        'theme',
        'language',
        'notifications',
        'created_at',
        'updated_at',
      )
      .where('id', userId)
      .whereNull('deleted_at') // Exclude soft-deleted users
      .first();

    if (!user) return null;

    return this.mapToProfile(user);
  }

  /**
   * Update user profile
   *
   * Updates profile fields for a user. Only provided fields are updated.
   * Returns the updated profile.
   *
   * @param userId - User ID (UUID)
   * @param data - Partial profile data to update
   * @returns Updated profile or null if user not found
   */
  async updateProfile(
    userId: string,
    data: Partial<UpdateProfile>,
  ): Promise<Profile | null> {
    // Build update object with snake_case column names
    const updateData: any = {};

    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.departmentId !== undefined)
      updateData.department_id = data.departmentId;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.notifications !== undefined)
      updateData.notifications = data.notifications;

    // Add updated_at timestamp
    updateData.updated_at = this.knex.fn.now();

    // Update and return
    const [user] = await this.knex('users')
      .where('id', userId)
      .whereNull('deleted_at') // Only update non-deleted users
      .update(updateData)
      .returning([
        'id',
        'email',
        'first_name',
        'last_name',
        'department_id',
        'avatar_url',
        'theme',
        'language',
        'notifications',
        'created_at',
        'updated_at',
      ]);

    if (!user) return null;

    return this.mapToProfile(user);
  }

  /**
   * Map database row to Profile object
   *
   * Converts snake_case database columns to camelCase API fields
   * and formats timestamps as ISO strings.
   *
   * @param row - Raw database row
   * @returns Profile object
   */
  private mapToProfile(row: any): Profile {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      departmentId: row.department_id || undefined,
      avatarUrl: row.avatar_url || undefined,
      theme: row.theme || 'auto',
      language: row.language || 'en',
      notifications: row.notifications ?? true,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  }
}
