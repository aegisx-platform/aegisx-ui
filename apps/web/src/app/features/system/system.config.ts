import { AxNavigationItem } from '@aegisx/ui';

/**
 * System App Configuration
 */
export interface SystemAppConfig {
  name: string;
  showFooter?: boolean;
  footerContent?: string;
}

export const SYSTEM_APP_CONFIG: SystemAppConfig = {
  name: 'System Administration',
  showFooter: true,
  footerContent: 'AegisX Platform',
};

/**
 * System Navigation Configuration
 *
 * Navigation items for the System Administration app.
 * Uses AxNavigationItem format from @aegisx/ui
 *
 * Properties:
 * - id: unique identifier
 * - title: display text
 * - icon: material icon name
 * - link: route path
 * - children: nested items
 * - type: 'collapsible' for expandable groups
 */
export const SYSTEM_NAVIGATION: AxNavigationItem[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/system',
  },

  // User Management Section
  {
    id: 'user-management',
    title: 'User Management',
    icon: 'people',
    type: 'collapsible',
    children: [
      {
        id: 'users',
        title: 'Users',
        icon: 'manage_accounts',
        link: '/system/users',
      },
      {
        id: 'profile',
        title: 'My Profile',
        icon: 'person',
        link: '/system/profile',
      },
    ],
  },

  // Security & Access
  {
    id: 'security',
    title: 'Security',
    icon: 'security',
    type: 'collapsible',
    children: [
      {
        id: 'rbac',
        title: 'RBAC Management',
        icon: 'admin_panel_settings',
        link: '/system/rbac',
      },
      {
        id: 'audit',
        title: 'Audit Logs',
        icon: 'history',
        link: '/system/audit',
      },
    ],
  },

  // System
  {
    id: 'system-config',
    title: 'System',
    icon: 'settings_applications',
    type: 'collapsible',
    children: [
      {
        id: 'settings',
        title: 'Settings',
        icon: 'settings',
        link: '/system/settings',
      },
      {
        id: 'monitoring',
        title: 'Monitoring',
        icon: 'monitoring',
        link: '/system/monitoring',
      },
    ],
  },

  // Tools
  {
    id: 'tools',
    title: 'Tools',
    icon: 'build',
    type: 'collapsible',
    children: [
      {
        id: 'pdf-templates',
        title: 'PDF Templates',
        icon: 'picture_as_pdf',
        link: '/system/tools/pdf-templates',
      },
      {
        id: 'file-upload',
        title: 'File Manager',
        icon: 'folder',
        link: '/system/tools/file-upload',
      },
      {
        id: 'theme-showcase',
        title: 'Theme Showcase',
        icon: 'palette',
        link: '/system/tools/theme-showcase',
      },
    ],
  },

  // Components (Development)
  {
    id: 'components',
    title: 'Components',
    icon: 'widgets',
    type: 'collapsible',
    children: [
      {
        id: 'buttons',
        title: 'Buttons',
        icon: 'smart_button',
        link: '/system/components/buttons',
      },
      {
        id: 'cards',
        title: 'Cards',
        icon: 'web_asset',
        link: '/system/components/cards',
      },
      {
        id: 'forms',
        title: 'Forms',
        icon: 'list_alt',
        link: '/system/components/forms',
      },
      {
        id: 'tables',
        title: 'Tables',
        icon: 'table_chart',
        link: '/system/components/tables',
      },
    ],
  },
];
