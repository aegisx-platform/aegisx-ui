import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import {
  UserCreateData,
  UserUpdateData,
  UserListOptions,
  UserWithRole,
  BulkOperationResult,
} from './users.types';
import { AppError } from '../../core/errors/app-error';

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async listUsers(options: UserListOptions): Promise<{
    users: UserWithRole[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { users, total } = await this.usersRepository.findAll(options);
    const { page = 1, limit = 10 } = options;

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string): Promise<UserWithRole> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  async createUser(data: UserCreateData): Promise<UserWithRole> {
    // Check if email already exists
    const existingEmailUser = await this.usersRepository.findByEmail(
      data.email,
    );
    if (existingEmailUser) {
      throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
    }

    // Check if username already exists
    const existingUsernameUser = await this.usersRepository.findByUsername(
      data.username,
    );
    if (existingUsernameUser) {
      throw new AppError('Username already exists', 409, 'USERNAME_EXISTS');
    }

    // If role name is provided instead of roleId, convert it
    let roleId = data.roleId;
    if (!roleId && (data as any).role) {
      const roles = await this.usersRepository.getRoles();
      const role = roles.find((r) => r.name === (data as any).role);
      if (role) {
        roleId = role.id;
      } else {
        throw new AppError('Invalid role', 400, 'INVALID_ROLE');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.usersRepository.create({
      ...data,
      roleId,
      password: hashedPassword,
    });

    return user;
  }

  async updateUser(id: string, data: UserUpdateData): Promise<UserWithRole> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if email is being changed and already exists
    if (data.email && data.email !== existingUser.email) {
      const emailUser = await this.usersRepository.findByEmail(data.email);
      if (emailUser) {
        throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
      }
    }

    // Check if username is being changed and already exists
    if (data.username && data.username !== existingUser.username) {
      const usernameUser = await this.usersRepository.findByUsername(
        data.username,
      );
      if (usernameUser) {
        throw new AppError('Username already exists', 409, 'USERNAME_EXISTS');
      }
    }

    // Update user
    const updatedUser = await this.usersRepository.update(id, data);

    if (!updatedUser) {
      throw new AppError('Failed to update user', 500, 'UPDATE_FAILED');
    }

    return updatedUser;
  }

  async changeUserPassword(id: string, newPassword: string): Promise<void> {
    // Check if user exists
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const success = await this.usersRepository.updatePassword(
      id,
      hashedPassword,
    );

    if (!success) {
      throw new AppError('Failed to update password', 500, 'UPDATE_FAILED');
    }
  }

  async deleteUser(id: string, currentUserId: string): Promise<void> {
    // Prevent user from deleting themselves
    if (id === currentUserId) {
      throw new AppError(
        'Cannot delete your own account',
        400,
        'CANNOT_DELETE_SELF',
      );
    }

    // Check if user exists
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Delete user
    const success = await this.usersRepository.delete(id);

    if (!success) {
      throw new AppError('Failed to delete user', 500, 'DELETE_FAILED');
    }
  }

  async listRoles() {
    return this.usersRepository.getRoles();
  }

  /**
   * Bulk activate users with proper error handling and business rules
   */
  async bulkActivateUsers(
    userIds: string[],
    currentUserId: string,
  ): Promise<BulkOperationResult> {
    return this.executeBulkOperation(userIds, currentUserId, 'activate', {
      validateCurrentState: (user) => !user.isActive,
      stateErrorCode: 'USER_ALREADY_ACTIVE',
      stateErrorMessage: 'User is already active',
      operation: async (userId) => {
        await this.usersRepository.update(userId, { isActive: true });
      },
    });
  }

  /**
   * Bulk deactivate users with proper error handling and business rules
   */
  async bulkDeactivateUsers(
    userIds: string[],
    currentUserId: string,
  ): Promise<BulkOperationResult> {
    return this.executeBulkOperation(userIds, currentUserId, 'deactivate', {
      validateCurrentState: (user) => user.isActive,
      stateErrorCode: 'USER_ALREADY_INACTIVE',
      stateErrorMessage: 'User is already inactive',
      operation: async (userId) => {
        await this.usersRepository.update(userId, { isActive: false });
      },
    });
  }

  /**
   * Bulk delete users (soft delete) with proper error handling and business rules
   */
  async bulkDeleteUsers(
    userIds: string[],
    currentUserId: string,
  ): Promise<BulkOperationResult> {
    return this.executeBulkOperation(userIds, currentUserId, 'delete', {
      validateCurrentState: () => true, // Always allow if other validations pass
      stateErrorCode: '',
      stateErrorMessage: '',
      operation: async (userId) => {
        await this.usersRepository.delete(userId);
      },
    });
  }

  /**
   * Bulk change user roles with proper error handling and business rules
   */
  async bulkChangeUserRoles(
    userIds: string[],
    roleId: string,
    currentUserId: string,
  ): Promise<BulkOperationResult> {
    // Validate role exists first
    const roles = await this.usersRepository.getRoles();
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) {
      throw new AppError('Target role not found', 400, 'ROLE_NOT_FOUND');
    }

    return this.executeBulkOperation(userIds, currentUserId, 'role-change', {
      validateCurrentState: (user) => user.roleId !== roleId,
      stateErrorCode: 'USER_ALREADY_HAS_ROLE',
      stateErrorMessage: `User already has role: ${targetRole.name}`,
      operation: async (userId) => {
        await this.usersRepository.update(userId, { roleId });
      },
    });
  }

  /**
   * Generic bulk operation executor with business rule validation
   */
  private async executeBulkOperation(
    userIds: string[],
    currentUserId: string,
    operationType: 'activate' | 'deactivate' | 'delete' | 'role-change',
    options: {
      validateCurrentState: (user: UserWithRole) => boolean;
      stateErrorCode: string;
      stateErrorMessage: string;
      operation: (userId: string) => Promise<void>;
    },
  ): Promise<BulkOperationResult> {
    const results: BulkOperationResult['results'] = [];
    let successCount = 0;
    let failureCount = 0;

    // Remove duplicates and validate input
    const uniqueUserIds = [...new Set(userIds)];

    for (const userId of uniqueUserIds) {
      try {
        // Check if user exists
        const user = await this.usersRepository.findById(userId);
        if (!user) {
          results.push({
            userId,
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          });
          failureCount++;
          continue;
        }

        // Business rule: Cannot modify own account (for deactivate/delete)
        if (
          (operationType === 'deactivate' || operationType === 'delete') &&
          userId === currentUserId
        ) {
          results.push({
            userId,
            success: false,
            error: {
              code:
                operationType === 'delete'
                  ? 'CANNOT_DELETE_SELF'
                  : 'CANNOT_DEACTIVATE_SELF',
              message:
                operationType === 'delete'
                  ? 'Cannot delete your own account'
                  : 'Cannot deactivate your own account',
            },
          });
          failureCount++;
          continue;
        }

        // Business rule: Validate current state
        if (!options.validateCurrentState(user)) {
          results.push({
            userId,
            success: false,
            error: {
              code: options.stateErrorCode,
              message: options.stateErrorMessage,
            },
          });
          failureCount++;
          continue;
        }

        // Execute the operation
        await options.operation(userId);

        results.push({
          userId,
          success: true,
        });
        successCount++;
      } catch (error) {
        results.push({
          userId,
          success: false,
          error: {
            code: 'OPERATION_FAILED',
            message:
              error instanceof Error ? error.message : 'Unknown error occurred',
          },
        });
        failureCount++;
      }
    }

    return {
      totalRequested: uniqueUserIds.length,
      successCount,
      failureCount,
      results,
      summary: {
        message: `Bulk ${operationType} completed with ${successCount} successes and ${failureCount} failures`,
        hasFailures: failureCount > 0,
      },
    };
  }
}
