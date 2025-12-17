import { PermissionCacheInvalidationService } from '../permission-cache-invalidation.service';
import { PermissionCacheService } from '../permission-cache.service';
import { Knex } from 'knex';

describe('PermissionCacheInvalidationService', () => {
  let service: PermissionCacheInvalidationService;
  let mockPermissionCache: any;
  let mockDb: any;
  let mockFastify: any;

  beforeEach(() => {
    // Mock PermissionCacheService
    mockPermissionCache = {
      invalidate: jest.fn().mockResolvedValue(true),
      invalidateAll: jest.fn().mockResolvedValue(100),
    };

    // Mock Knex database
    mockDb = jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockReturnThis(),
      whereIn: jest.fn().mockReturnThis(),
    }));

    // Mock Fastify logger
    mockFastify = {
      log: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
      },
    };

    service = new PermissionCacheInvalidationService(
      mockPermissionCache,
      mockDb as unknown as Knex,
      mockFastify,
    );
  });

  describe('invalidateUser', () => {
    it('should invalidate cache for a single user successfully', async () => {
      const userId = 'user-123';

      await service.invalidateUser(userId);

      expect(mockPermissionCache.invalidate).toHaveBeenCalledWith(userId);
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { userId },
        'Permission cache invalidated for user',
      );
    });

    it('should handle cache invalidation errors gracefully', async () => {
      const userId = 'user-123';
      const error = new Error('Redis connection failed');
      mockPermissionCache.invalidate.mockRejectedValueOnce(error);

      // Should not throw
      await expect(service.invalidateUser(userId)).resolves.toBeUndefined();

      expect(mockFastify.log.error).toHaveBeenCalledWith(
        { error, userId },
        'Cache invalidation failed for user - cache may be stale',
      );
    });
  });

  describe('invalidateUsers', () => {
    it('should invalidate cache for multiple users in parallel', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];

      await service.invalidateUsers(userIds);

      expect(mockPermissionCache.invalidate).toHaveBeenCalledTimes(3);
      expect(mockPermissionCache.invalidate).toHaveBeenCalledWith('user-1');
      expect(mockPermissionCache.invalidate).toHaveBeenCalledWith('user-2');
      expect(mockPermissionCache.invalidate).toHaveBeenCalledWith('user-3');
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { count: 3 },
        'Permission cache invalidated for multiple users',
      );
    });

    it('should handle partial failures in bulk invalidation', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      mockPermissionCache.invalidate
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce(true);

      // Should not throw even if some fail (catches error internally)
      await expect(service.invalidateUsers(userIds)).resolves.toBeUndefined();

      expect(mockFastify.log.error).toHaveBeenCalled();
    });

    it('should handle empty user array', async () => {
      const userIds: string[] = [];

      await service.invalidateUsers(userIds);

      expect(mockPermissionCache.invalidate).not.toHaveBeenCalled();
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { count: 0 },
        'Permission cache invalidated for multiple users',
      );
    });
  });

  describe('invalidateUsersWithRole', () => {
    it('should query users with role and invalidate their cache', async () => {
      const roleId = 'role-123';
      const mockResults = [{ user_id: 'user-1' }, { user_id: 'user-2' }];

      mockDb.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockResults),
      });

      await service.invalidateUsersWithRole(roleId);

      expect(mockPermissionCache.invalidate).toHaveBeenCalledTimes(2);
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { roleId, userCount: 2 },
        'Permission cache invalidated for all users with role',
      );
    });

    it('should skip invalidation if no users have the role', async () => {
      const roleId = 'role-123';

      mockDb.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      });

      await service.invalidateUsersWithRole(roleId);

      expect(mockPermissionCache.invalidate).not.toHaveBeenCalled();
      expect(mockFastify.log.debug).toHaveBeenCalledWith(
        { roleId },
        'No active users found for role - skipping cache invalidation',
      );
    });

    it('should handle database query errors', async () => {
      const roleId = 'role-123';
      const error = new Error('Database connection failed');

      mockDb.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockRejectedValue(error),
      });

      await service.invalidateUsersWithRole(roleId);

      expect(mockFastify.log.error).toHaveBeenCalledWith(
        { error, roleId },
        'Failed to invalidate users with role - cache may be stale',
      );
    });
  });

  describe('invalidateUsersWithRoles', () => {
    it('should invalidate users with multiple roles', async () => {
      const roleIds = ['role-1', 'role-2'];
      const mockResults = [
        { user_id: 'user-1' },
        { user_id: 'user-2' },
        { user_id: 'user-3' },
      ];

      mockDb.mockReturnValue({
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(mockResults),
      });

      await service.invalidateUsersWithRoles(roleIds);

      expect(mockPermissionCache.invalidate).toHaveBeenCalledTimes(3);
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { roleCount: 2, userCount: 3 },
        'Permission cache invalidated for users with multiple roles',
      );
    });

    it('should use DISTINCT to avoid duplicate invalidations', async () => {
      const roleIds = ['role-1', 'role-2'];
      const mockResults = [{ user_id: 'user-1' }, { user_id: 'user-1' }]; // Duplicate

      const mockQuery = {
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(mockResults),
      };

      mockDb.mockReturnValue(mockQuery);

      await service.invalidateUsersWithRoles(roleIds);

      expect(mockQuery.distinct).toHaveBeenCalled();
    });
  });

  describe('invalidateUsersWithPermission', () => {
    it('should find roles with permission and invalidate affected users', async () => {
      const permissionId = 'perm-123';
      const mockRoleResults = [{ role_id: 'role-1' }, { role_id: 'role-2' }];
      const mockUserResults = [{ user_id: 'user-1' }, { user_id: 'user-2' }];

      // First query: Get roles with permission
      const firstQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(mockRoleResults),
      };

      // Second query: Get users with those roles
      const secondQuery = {
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(mockUserResults),
      };

      mockDb.mockReturnValueOnce(firstQuery).mockReturnValueOnce(secondQuery);

      await service.invalidateUsersWithPermission(permissionId);

      expect(mockPermissionCache.invalidate).toHaveBeenCalledTimes(2);
      expect(mockFastify.log.info).toHaveBeenCalledWith(
        { permissionId, roleCount: 2 },
        'Permission cache invalidated for users with permission',
      );
    });

    it('should skip if no roles have the permission', async () => {
      const permissionId = 'perm-123';

      mockDb.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue([]),
      });

      await service.invalidateUsersWithPermission(permissionId);

      expect(mockPermissionCache.invalidate).not.toHaveBeenCalled();
      expect(mockFastify.log.debug).toHaveBeenCalledWith(
        { permissionId },
        'No roles found for permission - skipping cache invalidation',
      );
    });
  });

  describe('invalidateAll', () => {
    it('should clear all permission caches', async () => {
      await service.invalidateAll();

      expect(mockPermissionCache.invalidateAll).toHaveBeenCalled();
      expect(mockFastify.log.warn).toHaveBeenCalledWith(
        'All permission caches invalidated',
      );
    });

    it('should handle errors when clearing all caches', async () => {
      const error = new Error('Redis flush failed');
      mockPermissionCache.invalidateAll.mockRejectedValueOnce(error);

      await service.invalidateAll();

      expect(mockFastify.log.error).toHaveBeenCalledWith(
        { error },
        'Failed to invalidate all caches - manual intervention may be needed',
      );
    });
  });

  describe('Error Handling Philosophy', () => {
    it('should never throw errors (fail gracefully)', async () => {
      mockPermissionCache.invalidate.mockRejectedValue(
        new Error('Critical error'),
      );

      // All methods should handle errors gracefully (never throw)
      await expect(
        service.invalidateUser('user-123'),
      ).resolves.toBeUndefined();
      await expect(
        service.invalidateUsers(['user-1']),
      ).resolves.toBeUndefined(); // Catches errors internally
      await expect(
        service.invalidateAll(),
      ).resolves.toBeUndefined();
    });

    it('should log errors but continue operation', async () => {
      const error = new Error('Redis timeout');
      mockPermissionCache.invalidate.mockRejectedValueOnce(error);

      await service.invalidateUser('user-123');

      expect(mockFastify.log.error).toHaveBeenCalled();
      // No exception thrown
    });
  });

  describe('Performance Characteristics', () => {
    it('should invalidate users in parallel for bulk operations', async () => {
      const userIds = Array.from({ length: 100 }, (_, i) => `user-${i}`);

      await service.invalidateUsers(userIds);

      // Should call invalidate 100 times (in parallel via Promise.all)
      expect(mockPermissionCache.invalidate).toHaveBeenCalledTimes(100);
    });

    it('should minimize database queries', async () => {
      const roleId = 'role-123';
      mockDb.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([
          { user_id: 'user-1' },
          { user_id: 'user-2' },
        ]),
      });

      await service.invalidateUsersWithRole(roleId);

      // Should only query database once to get all users
      expect(mockDb).toHaveBeenCalledTimes(1);
    });
  });
});
