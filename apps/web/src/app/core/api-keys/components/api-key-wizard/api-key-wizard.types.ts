import { ApiKeyScope } from '../../models/api-keys.types';

/**
 * API Key Permission - Represents a scope that can be granted to an API key
 */
export interface ApiKeyPermission {
  id: string;
  label: string;
  description: string;
  resource: string;
  actions: string[];
  icon?: string;
}

/**
 * Grouped permissions by resource type for UI organization
 */
export interface PermissionGroup {
  name: string;
  description: string;
  icon: string;
  permissions: ApiKeyPermission[];
}

/**
 * Form data for the API Key creation wizard
 */
export interface CreateApiKeyData {
  // Step 1: Details
  name?: string;
  description?: string;
  expiryOption?: 'never' | '30' | '60' | '90' | '365';
  customExpireDays?: number;

  // Step 2: Permissions
  selectedPermissions?: ApiKeyPermission[];
  scopes?: ApiKeyScope[];

  // Step 3: Review & Creation
  generatedKey?: {
    id: string;
    fullKey: string;
    preview: string;
    name: string;
    expires_at: string | null;
    scopes: ApiKeyScope[] | null;
  };
}

/**
 * Expiration options for API key
 */
export const EXPIRATION_OPTIONS = [
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
  { value: 'never', label: 'Never expires' },
];

/**
 * Available permissions grouped by resource type
 * These should match the backend scope definitions
 */
export const AVAILABLE_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: 'User Management',
    description: 'Permissions for managing users and profiles',
    icon: 'group',
    permissions: [
      {
        id: 'users:read',
        label: 'Read Users',
        description: 'View user profiles and information',
        resource: 'users',
        actions: ['read'],
        icon: 'visibility',
      },
      {
        id: 'users:write',
        label: 'Create/Update Users',
        description: 'Create and modify user accounts',
        resource: 'users',
        actions: ['create', 'update'],
        icon: 'edit',
      },
      {
        id: 'users:delete',
        label: 'Delete Users',
        description: 'Remove user accounts',
        resource: 'users',
        actions: ['delete'],
        icon: 'delete',
      },
    ],
  },
  {
    name: 'Role Management',
    description: 'Permissions for managing roles and access control',
    icon: 'security',
    permissions: [
      {
        id: 'roles:read',
        label: 'Read Roles',
        description: 'View role definitions and assignments',
        resource: 'roles',
        actions: ['read'],
        icon: 'visibility',
      },
      {
        id: 'roles:write',
        label: 'Manage Roles',
        description: 'Create and modify role definitions',
        resource: 'roles',
        actions: ['create', 'update'],
        icon: 'edit',
      },
    ],
  },
  {
    name: 'Monitoring & Audit',
    description: 'Permissions for viewing system monitoring and audit logs',
    icon: 'monitoring',
    permissions: [
      {
        id: 'monitoring:read',
        label: 'View Monitoring',
        description: 'Access system metrics and health status',
        resource: 'monitoring',
        actions: ['read'],
        icon: 'dashboard',
      },
      {
        id: 'audit:read',
        label: 'View Audit Logs',
        description: 'Access audit trail and activity logs',
        resource: 'audit',
        actions: ['read'],
        icon: 'history',
      },
    ],
  },
  {
    name: 'System Configuration',
    description: 'Permissions for system settings and configuration',
    icon: 'settings',
    permissions: [
      {
        id: 'settings:read',
        label: 'Read Settings',
        description: 'View system configuration',
        resource: 'settings',
        actions: ['read'],
        icon: 'visibility',
      },
      {
        id: 'settings:write',
        label: 'Manage Settings',
        description: 'Modify system configuration',
        resource: 'settings',
        actions: ['update'],
        icon: 'edit',
      },
    ],
  },
];
