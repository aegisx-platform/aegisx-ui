import { ActivityLog } from '../../models/monitoring.types';

/**
 * Activity Logs Configuration
 *
 * Defines constants, mappings, and configurations for the activity logs page.
 * Includes action types, severity badges, icons, and page settings.
 */

// ============================================================================
// Activity Actions Configuration
// ============================================================================

export const ACTIVITY_ACTIONS = {
  // User Management
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_PASSWORD_CHANGED: 'user.password.changed',
  USER_PROFILE_UPDATED: 'user.profile.updated',

  // Data Management
  DATA_CREATE: 'data.create',
  DATA_UPDATE: 'data.update',
  DATA_DELETE: 'data.delete',
  DATA_EXPORT: 'data.export',
  DATA_IMPORT: 'data.import',

  // Admin Actions
  ADMIN_CONFIG_CHANGED: 'admin.config.changed',
  ADMIN_SETTINGS_UPDATED: 'admin.settings.updated',
  ADMIN_CLEANUP: 'admin.cleanup',

  // System Actions
  SYSTEM_ERROR: 'system.error',
  SYSTEM_WARNING: 'system.warning',
  SYSTEM_INFO: 'system.info',
} as const;

// ============================================================================
// Severity Badge Styles
// ============================================================================

export const SEVERITY_BADGES = {
  info: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
    label: 'Info',
    color: 'info',
    icon: 'info',
  },
  warning: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-500 dark:ring-amber-400/20',
    label: 'Warning',
    color: 'warning',
    icon: 'warning',
  },
  error: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20',
    label: 'Error',
    color: 'error',
    icon: 'error',
  },
  critical: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-red-100 text-red-800 ring-red-600/20 dark:bg-red-900/40 dark:text-red-200 dark:ring-red-400/20',
    label: 'Critical',
    color: 'error',
    icon: 'crisis_alert',
  },
};

// ============================================================================
// Action Icons Mapping
// ============================================================================

export const ACTION_ICONS = {
  // User actions
  'user.login': 'login',
  'user.logout': 'logout',
  'user.create': 'person_add',
  'user.update': 'person',
  'user.delete': 'person_remove',
  'user.password.changed': 'lock',
  'user.profile.updated': 'edit',

  // Data actions
  'data.create': 'add_circle',
  'data.update': 'edit',
  'data.delete': 'delete',
  'data.export': 'download',
  'data.import': 'upload',

  // Admin actions
  'admin.config.changed': 'settings',
  'admin.settings.updated': 'tune',
  'admin.cleanup': 'delete_sweep',

  // System actions
  'system.error': 'error',
  'system.warning': 'warning',
  'system.info': 'info',
} as Record<string, string>;

// ============================================================================
// Timeline Card Color Mapping by Severity
// ============================================================================

export const TIMELINE_SEVERITY_COLORS = {
  info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950',
  warning:
    'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950',
  error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950',
  critical: 'border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/50',
} as Record<string, string>;

// ============================================================================
// Timeline Dot Colors
// ============================================================================

export const TIMELINE_DOT_COLORS = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  critical: 'bg-red-700',
} as Record<string, string>;

// ============================================================================
// Page Configuration
// ============================================================================

export const ACTIVITY_LOGS_PAGE_CONFIG = {
  pageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  title: 'Activity Logs',
  description: 'View and manage user activity timeline',
  itemsPerPage: 20,
};

/**
 * Helper function to get severity badge configuration
 */
export function getSeverityBadge(severity: string) {
  return (
    SEVERITY_BADGES[severity as keyof typeof SEVERITY_BADGES] ||
    SEVERITY_BADGES.info
  );
}

/**
 * Helper function to get action icon
 */
export function getActionIcon(action: string): string {
  return ACTION_ICONS[action] || 'history';
}

/**
 * Helper function to get timeline card color
 */
export function getTimelineCardColor(severity: string): string {
  return (
    TIMELINE_SEVERITY_COLORS[
      severity as keyof typeof TIMELINE_SEVERITY_COLORS
    ] || TIMELINE_SEVERITY_COLORS['info']
  );
}

/**
 * Helper function to get timeline dot color
 */
export function getTimelineDotColor(severity: string): string {
  return (
    TIMELINE_DOT_COLORS[severity as keyof typeof TIMELINE_DOT_COLORS] ||
    TIMELINE_DOT_COLORS['info']
  );
}

/**
 * Format timestamp for display in timeline
 */
export function formatTimelineTimestamp(timestamp: string): {
  date: string;
  time: string;
  relative: string;
} {
  if (!timestamp) {
    return { date: '-', time: '-', relative: '-' };
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let relative = '';
  if (diffMins < 1) {
    relative = 'Just now';
  } else if (diffMins < 60) {
    relative = `${diffMins}m ago`;
  } else if (diffHours < 24) {
    relative = `${diffHours}h ago`;
  } else if (diffDays < 7) {
    relative = `${diffDays}d ago`;
  } else {
    relative = date.toLocaleDateString();
  }

  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    relative,
  };
}
