import { FastifyInstance } from 'fastify';

/**
 * File Access Level
 */
export enum FileAccessLevel {
  OWNER = 'owner', // Full access (read, write, delete, share)
  WRITE = 'write', // Read and write access
  READ = 'read', // Read-only access
  NONE = 'none', // No access
}

/**
 * File Permission
 */
export enum FilePermission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
}

/**
 * Access Control Entry
 */
export interface AccessControlEntry {
  userId: string;
  accessLevel: FileAccessLevel;
  grantedBy?: string; // User ID who granted access
  grantedAt?: Date;
  expiresAt?: Date; // Optional expiration
}

/**
 * File Access Policy
 */
export interface FileAccessPolicy {
  fileId: string;
  ownerId: string;
  isPublic: boolean;
  sharedWith: AccessControlEntry[];
  patientId?: string; // For HIS - files belong to specific patient
  departmentId?: string; // For HIS - department-level access
  restrictedToRoles?: string[]; // Only specific roles can access
}

/**
 * Access Check Result
 */
export interface AccessCheckResult {
  allowed: boolean;
  accessLevel: FileAccessLevel;
  reason?: string;
}

/**
 * AccessControlService
 *
 * Provides role-based access control (RBAC) and patient-specific file access.
 *
 * Features:
 * - Owner-based access control
 * - File sharing between users with different access levels
 * - Patient-specific access (HIS use case)
 * - Department-level access control
 * - Role-based restrictions
 * - Public file access
 * - Time-limited access (expiration)
 *
 * Access Hierarchy:
 * 1. Owner - Full access (read, write, delete, share)
 * 2. Shared with WRITE - Read and write access
 * 3. Shared with READ - Read-only access
 * 4. Public files - Read-only for all authenticated users
 * 5. Patient access (HIS) - Healthcare providers can access patient files
 * 6. Department access - Department members can access department files
 *
 * Example Usage:
 * ```typescript
 * const service = new AccessControlService(fastify);
 *
 * // Check if user can read file
 * const canRead = await service.checkPermission(
 *   userId,
 *   fileId,
 *   FilePermission.READ
 * );
 *
 * // Share file with another user
 * await service.shareFile(
 *   fileId,
 *   ownerId,
 *   targetUserId,
 *   FileAccessLevel.READ
 * );
 *
 * // Check patient file access (HIS)
 * const canAccessPatient = await service.checkPatientFileAccess(
 *   userId,
 *   patientId,
 *   fileId
 * );
 * ```
 */
export class AccessControlService {
  constructor(private fastify?: FastifyInstance) {}

  /**
   * Check if user has specific permission for a file
   *
   * @param userId - User requesting access
   * @param fileId - File to check access for
   * @param permission - Required permission
   * @param policy - File access policy (from database)
   * @returns Access check result
   */
  async checkPermission(
    userId: string,
    fileId: string,
    permission: FilePermission,
    policy: FileAccessPolicy,
  ): Promise<AccessCheckResult> {
    // 1. Check if user is the owner
    if (policy.ownerId === userId) {
      return {
        allowed: true,
        accessLevel: FileAccessLevel.OWNER,
      };
    }

    // 2. Check if file is public (read-only access)
    if (policy.isPublic && permission === FilePermission.READ) {
      return {
        allowed: true,
        accessLevel: FileAccessLevel.READ,
        reason: 'Public file',
      };
    }

    // 3. Check shared access
    const sharedEntry = policy.sharedWith.find(
      (entry) => entry.userId === userId,
    );

    if (sharedEntry) {
      // Check if access has expired
      if (sharedEntry.expiresAt && new Date() > sharedEntry.expiresAt) {
        return {
          allowed: false,
          accessLevel: FileAccessLevel.NONE,
          reason: 'Access expired',
        };
      }

      // Check if access level permits the requested permission
      const hasPermission = this.hasPermission(
        sharedEntry.accessLevel,
        permission,
      );

      if (hasPermission) {
        return {
          allowed: true,
          accessLevel: sharedEntry.accessLevel,
        };
      }
    }

    // 4. No access
    return {
      allowed: false,
      accessLevel: FileAccessLevel.NONE,
      reason: 'Access denied',
    };
  }

  /**
   * Check if access level includes specific permission
   *
   * @param accessLevel - User's access level
   * @param permission - Required permission
   * @returns true if access level includes permission
   */
  private hasPermission(
    accessLevel: FileAccessLevel,
    permission: FilePermission,
  ): boolean {
    switch (accessLevel) {
      case FileAccessLevel.OWNER:
        return true; // Owner has all permissions

      case FileAccessLevel.WRITE:
        return [FilePermission.READ, FilePermission.WRITE].includes(permission);

      case FileAccessLevel.READ:
        return permission === FilePermission.READ;

      case FileAccessLevel.NONE:
        return false;

      default:
        return false;
    }
  }

  /**
   * Share file with another user
   *
   * @param fileId - File to share
   * @param ownerId - Owner granting access
   * @param targetUserId - User to grant access to
   * @param accessLevel - Access level to grant
   * @param expiresIn - Optional expiration time in seconds
   * @returns Updated access control entry
   */
  async shareFile(
    fileId: string,
    ownerId: string,
    targetUserId: string,
    accessLevel: FileAccessLevel,
    expiresIn?: number,
  ): Promise<AccessControlEntry> {
    const entry: AccessControlEntry = {
      userId: targetUserId,
      accessLevel,
      grantedBy: ownerId,
      grantedAt: new Date(),
    };

    if (expiresIn) {
      entry.expiresAt = new Date(Date.now() + expiresIn * 1000);
    }

    // TODO: Save to database (file_access_control table)
    // await this.saveAccessControlEntry(fileId, entry);

    return entry;
  }

  /**
   * Revoke file access for a user
   *
   * @param fileId - File to revoke access for
   * @param ownerId - Owner revoking access
   * @param targetUserId - User to revoke access from
   */
  async revokeAccess(
    _fileId: string,
    _ownerId: string,
    _targetUserId: string,
  ): Promise<void> {
    // TODO: Remove from database (file_access_control table)
    // await this.removeAccessControlEntry(fileId, targetUserId);
  }

  /**
   * Get all users who have access to a file
   *
   * @param fileId - File to check
   * @param policy - File access policy
   * @returns List of users with access
   */
  async getFileAccessList(
    fileId: string,
    policy: FileAccessPolicy,
  ): Promise<AccessControlEntry[]> {
    const accessList: AccessControlEntry[] = [
      // Owner always has access
      {
        userId: policy.ownerId,
        accessLevel: FileAccessLevel.OWNER,
      },
    ];

    // Add shared users (filter out expired access)
    const now = new Date();
    const activeShares = policy.sharedWith.filter(
      (entry) => !entry.expiresAt || entry.expiresAt > now,
    );

    accessList.push(...activeShares);

    return accessList;
  }

  /**
   * Check patient file access (HIS use case)
   *
   * Healthcare providers can access files belonging to their patients.
   *
   * @param userId - User requesting access
   * @param patientId - Patient ID
   * @param fileId - File to access
   * @param userRole - User's role (doctor, nurse, etc.)
   * @returns Access check result
   */
  async checkPatientFileAccess(
    userId: string,
    patientId: string,
    fileId: string,
    userRole?: string,
  ): Promise<AccessCheckResult> {
    // TODO: Implement patient-provider relationship check
    // Check if user is assigned to this patient
    // const isAssignedProvider = await this.isPatientProvider(userId, patientId);

    // For now, allow access if user has appropriate role
    const allowedRoles = ['doctor', 'nurse', 'admin', 'healthcare_provider'];

    if (userRole && allowedRoles.includes(userRole)) {
      return {
        allowed: true,
        accessLevel: FileAccessLevel.READ,
        reason: 'Healthcare provider access',
      };
    }

    return {
      allowed: false,
      accessLevel: FileAccessLevel.NONE,
      reason: 'Not authorized to access patient files',
    };
  }

  /**
   * Check department file access
   *
   * Department members can access department files.
   *
   * @param userId - User requesting access
   * @param departmentId - Department ID
   * @param fileId - File to access
   * @returns Access check result
   */
  async checkDepartmentFileAccess(
    _userId: string,
    _departmentId: string,
    _fileId: string,
  ): Promise<AccessCheckResult> {
    // TODO: Implement department membership check
    // const isMember = await this.isDepartmentMember(userId, departmentId);

    // For now, return basic implementation
    return {
      allowed: false,
      accessLevel: FileAccessLevel.NONE,
      reason: 'Department access not implemented',
    };
  }

  /**
   * Check role-based access
   *
   * @param userRole - User's role
   * @param restrictedToRoles - Required roles
   * @returns true if user has required role
   */
  checkRoleAccess(userRole: string, restrictedToRoles: string[]): boolean {
    if (!restrictedToRoles || restrictedToRoles.length === 0) {
      return true; // No role restrictions
    }

    return restrictedToRoles.includes(userRole);
  }

  /**
   * Create default file access policy
   *
   * @param ownerId - File owner
   * @param isPublic - Whether file is public
   * @param patientId - Optional patient ID (HIS)
   * @returns Default access policy
   */
  createDefaultPolicy(
    ownerId: string,
    isPublic: boolean,
    patientId?: string,
  ): Omit<FileAccessPolicy, 'fileId'> {
    return {
      ownerId,
      isPublic,
      sharedWith: [],
      patientId,
    };
  }

  /**
   * Validate access control entry
   *
   * @param entry - Entry to validate
   * @returns true if valid
   */
  validateAccessEntry(entry: AccessControlEntry): boolean {
    if (!entry.userId) {
      return false;
    }

    if (!Object.values(FileAccessLevel).includes(entry.accessLevel)) {
      return false;
    }

    if (entry.expiresAt && entry.expiresAt <= new Date()) {
      return false; // Already expired
    }

    return true;
  }

  /**
   * Merge access policies (useful for combining multiple sources)
   *
   * @param policies - Policies to merge
   * @returns Merged policy with highest access level for each user
   */
  mergePolicies(policies: FileAccessPolicy[]): FileAccessPolicy {
    if (policies.length === 0) {
      throw new Error('Cannot merge empty policy list');
    }

    const base = policies[0];
    const mergedSharedWith = new Map<string, AccessControlEntry>();

    // Merge shared access from all policies
    for (const policy of policies) {
      for (const entry of policy.sharedWith) {
        const existing = mergedSharedWith.get(entry.userId);

        if (
          !existing ||
          this.isHigherAccessLevel(entry.accessLevel, existing.accessLevel)
        ) {
          mergedSharedWith.set(entry.userId, entry);
        }
      }
    }

    return {
      ...base,
      sharedWith: Array.from(mergedSharedWith.values()),
    };
  }

  /**
   * Compare access levels
   *
   * @param level1 - First access level
   * @param level2 - Second access level
   * @returns true if level1 is higher than level2
   */
  private isHigherAccessLevel(
    level1: FileAccessLevel,
    level2: FileAccessLevel,
  ): boolean {
    const hierarchy = {
      [FileAccessLevel.OWNER]: 4,
      [FileAccessLevel.WRITE]: 3,
      [FileAccessLevel.READ]: 2,
      [FileAccessLevel.NONE]: 1,
    };

    return hierarchy[level1] > hierarchy[level2];
  }
}
