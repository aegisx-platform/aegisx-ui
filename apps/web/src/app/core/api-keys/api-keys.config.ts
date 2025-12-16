import { ApiKey, ApiKeyWithPreview } from './models/api-keys.types';

/**
 * API Keys Table Column Configuration
 *
 * Defines the column structure and formatting for the API keys data table.
 * Includes sorting, formatting, and action definitions.
 */

type TableColumn<T> = Record<string, any>;

export const API_KEYS_COLUMNS: TableColumn<ApiKeyWithPreview>[] = [
  {
    key: 'name',
    header: 'Key Name',
    type: 'text',
    sortable: true,
    format: (value: string) => value || '-',
  },
  {
    key: 'preview',
    header: 'API Key',
    type: 'code',
    format: (value: string) => value || '-',
  },
  {
    key: 'status',
    header: 'Status',
    type: 'badge',
    sortable: true,
  },
  {
    key: 'created_at',
    header: 'Created',
    type: 'date',
    sortable: true,
    format: (value: string) => value || '-',
  },
  {
    key: 'expires_at',
    header: 'Expires',
    type: 'date',
    sortable: true,
    format: (value: string) => value || '-',
  },
  {
    key: 'actions',
    header: 'Actions',
    type: 'actions',
    actions: [
      {
        label: 'View Details',
        icon: 'visibility',
        action: 'view',
        color: 'primary',
      },
      {
        label: 'Copy Key',
        icon: 'content_copy',
        action: 'copy',
        color: 'accent',
      },
      {
        label: 'Revoke',
        icon: 'block',
        action: 'revoke',
        color: 'warning',
      },
      {
        label: 'Delete',
        icon: 'delete',
        action: 'delete',
        color: 'warn',
      },
    ],
  },
];

/**
 * Status badge styling for API keys
 */
export const API_KEY_STATUS_BADGE_STYLES = {
  active: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-success-faint text-success-emphasis ring-success-200 dark:bg-success-400/10 dark:text-success-300 dark:ring-success-400/20',
    label: 'Active',
    icon: 'check_circle',
  },
  expired: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-warning-faint text-warning-emphasis ring-warning-200 dark:bg-warning-400/10 dark:text-warning-300 dark:ring-warning-400/20',
    label: 'Expired',
    icon: 'schedule',
  },
  revoked: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-error-faint text-error-emphasis ring-error-200 dark:bg-error-400/10 dark:text-error-300 dark:ring-error-400/20',
    label: 'Revoked',
    icon: 'cancel',
  },
};

/**
 * Page configuration for API Keys List
 */
export const API_KEYS_PAGE_CONFIG = {
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  title: 'API Keys',
  description: 'Manage your API keys for programmatic access',
};

/**
 * Mask API key for display
 * Shows first 8 characters followed by "..."
 *
 * @param key - The API key preview string
 * @returns Masked key string (e.g., "sk_live_..." or "preview" if already masked)
 */
export function maskApiKey(key: string): string {
  if (!key) return '-';
  // If it's already a preview (ends with ...), return as is
  if (key.endsWith('...')) return key;
  // Otherwise mask it
  if (key.length > 8) {
    return key.substring(0, 8) + '...';
  }
  return key;
}

/**
 * Determine API key status based on properties
 *
 * @param key - The API key object
 * @returns Status string: 'active', 'expired', or 'revoked'
 */
export function getApiKeyStatus(
  key: ApiKeyWithPreview,
): 'active' | 'expired' | 'revoked' {
  if (!key.is_active) {
    return 'revoked';
  }

  if (key.expires_at) {
    const expiresDate = new Date(key.expires_at);
    if (expiresDate < new Date()) {
      return 'expired';
    }
  }

  return 'active';
}

/**
 * Format date for display in table
 *
 * @param dateString - ISO date string
 * @returns Formatted date string or '-' if no date provided
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Format datetime for display (includes time)
 *
 * @param dateString - ISO date string
 * @returns Formatted datetime string or '-' if no date provided
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '-';
  }
}

/**
 * Get badge style config for a status
 *
 * @param status - Status string ('active', 'expired', 'revoked')
 * @returns Badge style configuration object
 */
export function getStatusBadgeStyle(
  status: string,
): (typeof API_KEY_STATUS_BADGE_STYLES)['active'] {
  return (
    API_KEY_STATUS_BADGE_STYLES[
      status as keyof typeof API_KEY_STATUS_BADGE_STYLES
    ] || API_KEY_STATUS_BADGE_STYLES.active
  );
}

/**
 * Check if key is expiring soon (within 7 days)
 *
 * @param expiresAt - ISO date string
 * @returns True if expires within 7 days
 */
export function isExpiringsoon(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;

  try {
    const expiresDate = new Date(expiresAt);
    const today = new Date();
    const sevenDaysFromNow = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    return expiresDate > today && expiresDate <= sevenDaysFromNow;
  } catch {
    return false;
  }
}
