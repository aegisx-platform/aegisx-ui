// import { TableColumn } from '../../../shared/components/data-table';
import { ErrorLog } from '../../models/monitoring.types';

/**
 * Error Logs Table Configuration
 *
 * Defines the column structure and formatting for the error logs data table.
 * Includes sorting, formatting, and action definitions.
 *
 * Note: This file is for configuration reference. The actual list component
 * uses error-logs.component.ts which directly implements table columns.
 */

// Type alias for compatibility
type TableColumn<T> = Record<string, any>;

export const ERROR_LOGS_COLUMNS: TableColumn<ErrorLog>[] = [
  {
    key: 'timestamp',
    header: 'Time',
    type: 'date',
    sortable: true,
    format: (value: string) => {
      if (!value) return '-';
      return new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    },
  },
  {
    key: 'level',
    header: 'Level',
    type: 'badge',
    sortable: true,
    cssClass: 'level-badge',
    format: (value: string) => value?.toUpperCase() || 'UNKNOWN',
  },
  {
    key: 'type',
    header: 'Type',
    type: 'text',
    sortable: true,
    format: (value: string) => value || '-',
  },
  {
    key: 'message',
    header: 'Message',
    type: 'text',
    cssClass: 'max-w-md',
    format: (value: string) => {
      if (!value) return '-';
      return value.length > 100 ? value.substring(0, 100) + '...' : value;
    },
  },
  {
    key: 'userId',
    header: 'User',
    type: 'text',
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
        label: 'Delete',
        icon: 'delete',
        action: 'delete',
        color: 'warn',
      },
    ],
  },
];

/**
 * Badge style mapping for error log levels
 */
export const ERROR_LEVEL_BADGE_STYLES = {
  error: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 chip-error',
    label: 'Error',
  },
  warn: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 chip-warning ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-500 dark:ring-amber-400/20',
    label: 'Warning',
  },
  info: {
    class:
      'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset gap-2 bg-surface-container text-primary ring-blue-600/20 dark:bg-blue-400/10 dark:text-primary dark:ring-blue-400/20',
    label: 'Info',
  },
};

/**
 * Page configuration
 */
export const ERROR_LOGS_PAGE_CONFIG = {
  pageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
  title: 'Error Logs',
  description: 'View and manage application error logs',
};
