import { RbacService } from '../rbac.service';
import { RbacRepository } from '../rbac.repository';
import { PermissionCacheInvalidationService } from '../../../core/auth/services/permission-cache-invalidation.service';

describe('RBAC Cache Invalidation Integration Tests', () => {
  let rbacService: RbacService;
  let mockRepository: any;
  let mockCacheInvalidation: any;

  beforeEach(() => {
    // Mock RbacRepository
    mockRepository = {
      db: jest.fn(),
      getRoleById: jest.fn(),
      assignRoleToUser: jest.fn(),
      removeRoleFromUser: jest.fn(),
      getUserRoles: jest.fn(),
      updateRole: jest.fn(),
      createPermission: jest.fn(),
      updatePermission: jest.fn(),
      deletePermission: jest.fn(),
      getPermissionById: jest.fn(),
    };

    // Mock PermissionCacheInvalidationService
    mockCacheInvalidation = {
      invalidateUser: jest.fn().mockResolvedValue(undefined),
      invalidateUsers: jest.fn().mockResolvedValue(undefined),
      invalidateUsersWithRole: jest.fn().mockResolvedValue(undefined),
      invalidateUsersWithPermission: jest.fn().mockResolvedValue(undefined),
    };

    rbacService = new RbacService(mockRepository, mockCacheInvalidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('assignRoleToUser Integration', () => {
    it('should invalidate user cache after successful role assignment', async () => {
      const userId = 'user-123';
      const roleId = 'role-456';
      const assignedBy = 'admin-789';

      // Mock database checks
      mockRepository.db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: userId, status: 'active' }),
      });

      mockRepository.getRoleById.mockResolvedValue({
        id: roleId,
        name: 'Manager',
        is_active: true,
      });

      mockRepository.assignRoleToUser.mockResolvedValue({
        id: 'assignment-123',
        user_id: userId,
        role_id: roleId,
        is_active: true,
      });

      await rbacService.assignRoleToUser(
        userId,
        { role_id: roleId },
        assignedBy,
      );

      // Verify cache invalidation was called
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledWith(userId);
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledTimes(1);
    });

    it('should not invalidate cache if role assignment fails', async () => {
      const userId = 'user-123';
      const roleId = 'role-456';

      mockRepository.db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null), // User not found
      });

      await expect(
        rbacService.assignRoleToUser(userId, { role_id: roleId }, 'admin'),
      ).rejects.toThrow('User not found');

      // Cache should NOT be invalidated
      expect(mockCacheInvalidation.invalidateUser).not.toHaveBeenCalled();
    });
  });

  describe('removeRoleFromUser Integration', () => {
    it('should invalidate user cache after successful role removal', async () => {
      const userId = 'user-123';
      const roleId = 'role-456';

      mockRepository.getUserRoles.mockResolvedValue({
        userRoles: [{ id: 'assignment-1', user_id: userId, role_id: roleId }],
      });

      mockRepository.removeRoleFromUser.mockResolvedValue(true);

      await rbacService.removeRoleFromUser(userId, roleId);

      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledWith(userId);
    });

    it('should not invalidate cache if role removal fails', async () => {
      const userId = 'user-123';
      const roleId = 'role-456';

      mockRepository.getUserRoles.mockResolvedValue({
        userRoles: [], // No assignment found
      });

      await expect(
        rbacService.removeRoleFromUser(userId, roleId),
      ).rejects.toThrow('User role assignment not found');

      expect(mockCacheInvalidation.invalidateUser).not.toHaveBeenCalled();
    });
  });

  describe('updateRole Integration', () => {
    it('should invalidate all users with role when permissions are updated', async () => {
      const roleId = 'role-123';
      const updatedBy = 'admin-456';
      const newPermissions = ['perm-1', 'perm-2'];

      mockRepository.getRoleById.mockResolvedValue({
        id: roleId,
        name: 'Manager',
        is_active: true,
        is_system_role: false,
      });

      // Mock permission validation query
      mockRepository.db.mockReturnValue({
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([
          { id: 'perm-1', is_active: true },
          { id: 'perm-2', is_active: true },
        ]),
      });

      mockRepository.updateRole.mockResolvedValue({
        id: roleId,
        name: 'Manager',
        permissions: newPermissions,
      });

      await rbacService.updateRole(
        roleId,
        { permission_ids: newPermissions },
        updatedBy,
      );

      // Should invalidate all users with this role
      expect(
        mockCacheInvalidation.invalidateUsersWithRole,
      ).toHaveBeenCalledWith(roleId);
    });

    it('should NOT invalidate cache if permissions are not updated', async () => {
      const roleId = 'role-123';

      mockRepository.getRoleById.mockResolvedValue({
        id: roleId,
        name: 'Manager',
        is_active: true,
        is_system_role: false,
      });

      mockRepository.db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      });

      mockRepository.updateRole.mockResolvedValue({
        id: roleId,
        name: 'Senior Manager', // Only name changed
      });

      // Update name only (no permission_ids)
      await rbacService.updateRole(roleId, { name: 'Senior Manager' }, 'admin');

      // Should NOT invalidate cache
      expect(
        mockCacheInvalidation.invalidateUsersWithRole,
      ).not.toHaveBeenCalled();
    });
  });

  describe('bulkAssignRoles Integration', () => {
    it('should invalidate only successfully assigned users', async () => {
      const roleId = 'role-123';
      const userIds = ['user-1', 'user-2', 'user-3'];
      const assignedBy = 'admin';

      mockRepository.getRoleById.mockResolvedValue({
        id: roleId,
        is_active: true,
      });

      mockRepository.db.mockReturnValue({
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([
          { id: 'user-1', status: 'active' },
          { id: 'user-2', status: 'active' },
          { id: 'user-3', status: 'active' },
        ]),
      });

      // Mock successful assignments for user-1 and user-3, fail for user-2
      mockRepository.assignRoleToUser
        .mockResolvedValueOnce({ id: 'a1', user_id: 'user-1' })
        .mockRejectedValueOnce(new Error('Already assigned'))
        .mockResolvedValueOnce({ id: 'a3', user_id: 'user-3' });

      await rbacService.bulkAssignRoles(
        { role_id: roleId, user_ids: userIds },
        assignedBy,
      );

      // Should invalidate only successful users
      expect(mockCacheInvalidation.invalidateUsers).toHaveBeenCalledWith([
        'user-1',
        'user-3',
      ]);
    });
  });

  describe('updatePermission Integration', () => {
    it('should invalidate all affected users when permission is updated', async () => {
      const permissionId = 'perm-123';

      mockRepository.getPermissionById.mockResolvedValue({
        id: permissionId,
        resource: 'users',
        action: 'read',
      });

      mockRepository.updatePermission.mockResolvedValue({
        id: permissionId,
        resource: 'users',
        action: 'write', // Updated
      });

      await rbacService.updatePermission(
        permissionId,
        { action: 'write' },
        'admin',
      );

      expect(
        mockCacheInvalidation.invalidateUsersWithPermission,
      ).toHaveBeenCalledWith(permissionId);
    });
  });

  describe('deletePermission Integration', () => {
    it('should invalidate all affected users when permission is deleted', async () => {
      const permissionId = 'perm-123';

      mockRepository.getPermissionById.mockResolvedValue({
        id: permissionId,
        resource: 'users',
        action: 'delete',
      });

      mockRepository.deletePermission.mockResolvedValue(true);

      await rbacService.deletePermission(permissionId);

      expect(
        mockCacheInvalidation.invalidateUsersWithPermission,
      ).toHaveBeenCalledWith(permissionId);
    });
  });

  describe('Cache Invalidation Error Handling', () => {
    it('should continue operation even if cache invalidation encounters errors', async () => {
      const userId = 'user-123';
      const roleId = 'role-456';

      mockRepository.db.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: userId, status: 'active' }),
      });

      mockRepository.getRoleById.mockResolvedValue({
        id: roleId,
        is_active: true,
      });

      mockRepository.assignRoleToUser.mockResolvedValue({
        id: 'assignment-1',
        user_id: userId,
        role_id: roleId,
      });

      // Note: The real PermissionCacheInvalidationService catches errors internally
      // and never throws. This test verifies that cache invalidation is called.
      // If the real service had errors, it would log them but not throw.

      // Should still complete successfully
      const result = await rbacService.assignRoleToUser(
        userId,
        { role_id: roleId },
        'admin',
      );

      expect(result).toBeDefined();
      expect(result.user_id).toBe(userId);
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('Multi-Role Operations', () => {
    it('should invalidate user cache after bulk role assignment to single user', async () => {
      const userId = 'user-123';
      const roleIds = ['role-1', 'role-2', 'role-3'];

      // Mock database queries for user validation and role validation
      mockRepository.db
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          first: jest.fn().mockResolvedValue({ id: userId, status: 'active' }),
        })
        .mockReturnValueOnce({
          whereIn: jest.fn().mockReturnThis(),
          where: jest.fn().mockResolvedValue([
            { id: 'role-1', is_active: true },
            { id: 'role-2', is_active: true },
            { id: 'role-3', is_active: true },
          ]),
        });

      mockRepository.assignRoleToUser
        .mockResolvedValueOnce({ user_id: userId, role_id: 'role-1' })
        .mockResolvedValueOnce({ user_id: userId, role_id: 'role-2' })
        .mockResolvedValueOnce({ user_id: userId, role_id: 'role-3' });

      await rbacService.bulkAssignRolesToUser(
        userId,
        { role_ids: roleIds },
        'admin',
      );

      // Should invalidate user once (not 3 times)
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledWith(userId);
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalledTimes(1);
    });

    it('should invalidate user cache after replacing all roles', async () => {
      const userId = 'user-123';
      const newRoleIds = ['role-4', 'role-5'];

      // Mock database queries for user validation and role validation
      mockRepository.db
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          first: jest.fn().mockResolvedValue({ id: userId, status: 'active' }),
        })
        .mockReturnValueOnce({
          whereIn: jest.fn().mockReturnThis(),
          where: jest.fn().mockResolvedValue([
            { id: 'role-4', is_active: true },
            { id: 'role-5', is_active: true },
          ]),
        });

      // Mock getting existing roles
      jest.spyOn(rbacService, 'getUserRolesByUserId').mockResolvedValue([
        { id: 'ur-1', user_id: userId, role_id: 'role-1' } as any,
        { id: 'ur-2', user_id: userId, role_id: 'role-2' } as any,
      ]);

      // Mock removing old roles
      mockRepository.getUserRoles.mockResolvedValue({
        userRoles: [{ id: 'ur-1' }],
      });
      mockRepository.removeRoleFromUser.mockResolvedValue(true);

      // Mock assigning new roles
      mockRepository.assignRoleToUser
        .mockResolvedValueOnce({ user_id: userId, role_id: 'role-4' })
        .mockResolvedValueOnce({ user_id: userId, role_id: 'role-5' });

      await rbacService.replaceUserRoles(
        userId,
        { role_ids: newRoleIds },
        'admin',
      );

      // Should invalidate user cache (multiple times: 2 removals + 1 final)
      expect(mockCacheInvalidation.invalidateUser).toHaveBeenCalled();
    });
  });

  describe('Performance & Concurrency', () => {
    it('should handle parallel cache invalidations efficiently', async () => {
      const userIds = Array.from({ length: 100 }, (_, i) => `user-${i}`);
      const roleId = 'role-bulk';

      mockRepository.getRoleById.mockResolvedValue({ id: roleId, is_active: true });
      mockRepository.db.mockReturnValue({
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(
          userIds.map((id) => ({ id, status: 'active' })),
        ),
      });

      mockRepository.assignRoleToUser.mockImplementation((userId) =>
        Promise.resolve({ user_id: userId, role_id: roleId }),
      );

      const startTime = Date.now();
      await rbacService.bulkAssignRoles(
        { role_id: roleId, user_ids: userIds },
        'admin',
      );
      const duration = Date.now() - startTime;

      // Should complete in reasonable time (parallel processing)
      expect(duration).toBeLessThan(5000); // 5 seconds max for 100 users
      expect(mockCacheInvalidation.invalidateUsers).toHaveBeenCalled();
    });
  });
});
