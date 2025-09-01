import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Helper function to safely insert navigation items
  async function insertNavigationItems(items: any[]) {
    const insertedItems = [];
    
    for (const item of items) {
      // Check if the navigation item already exists
      const existing = await knex('navigation_items')
        .where({ key: item.key })
        .first();
      
      if (!existing) {
        const [inserted] = await knex('navigation_items')
          .insert(item)
          .returning('*');
        insertedItems.push(inserted);
      } else {
        insertedItems.push(existing);
      }
    }
    
    return insertedItems;
  }

  // Clear existing navigation preferences and permissions
  await knex('user_navigation_preferences').del();
  await knex('navigation_permissions').del();
  
  // Add additional permissions that align with OpenAPI specs
  const permissionsToAdd = [
    // Navigation permissions
    { resource: 'navigation', action: 'view', description: 'View navigation structure' },
    { resource: 'navigation', action: 'manage', description: 'Manage navigation items' },
    
    // Dashboard permissions
    { resource: 'dashboard', action: 'view', description: 'View dashboard' },
    { resource: 'dashboard', action: 'analytics', description: 'View analytics data' },
    
    // Settings permissions
    { resource: 'settings', action: 'view', description: 'View settings' },
    { resource: 'settings', action: 'update', description: 'Update settings' },
    { resource: 'settings', action: 'theme', description: 'Change theme settings' },
    { resource: 'settings', action: 'notifications', description: 'Manage notification settings' },
    
    // Profile permissions (additional to existing)
    { resource: 'profile', action: 'avatar', description: 'Upload/delete avatar' },
    { resource: 'profile', action: 'preferences', description: 'Update user preferences' },
    
    // System permissions
    { resource: 'system', action: 'monitor', description: 'Monitor system health' },
    { resource: 'system', action: 'logs', description: 'View system logs' },
    { resource: 'system', action: 'settings', description: 'Manage system settings' }
  ];

  // Insert permissions that don't already exist
  const additionalPermissions = [];
  for (const perm of permissionsToAdd) {
    const existing = await knex('permissions')
      .where({ resource: perm.resource, action: perm.action })
      .first();
    
    if (!existing) {
      const [inserted] = await knex('permissions')
        .insert(perm)
        .returning(['id', 'resource', 'action']);
      additionalPermissions.push(inserted);
    }
  }

  console.log('✅ Added additional permissions');

  // Get all permissions for role assignment
  const allPermissions = await knex('permissions').select(['id', 'resource', 'action']);
  const adminRole = await knex('roles').where({ name: 'admin' }).first();
  const userRole = await knex('roles').where({ name: 'user' }).first();

  // Assign new permissions to admin role (check for duplicates first)
  for (const perm of additionalPermissions) {
    const existing = await knex('role_permissions')
      .where({ role_id: adminRole.id, permission_id: perm.id })
      .first();
    
    if (!existing) {
      await knex('role_permissions').insert({
        role_id: adminRole.id,
        permission_id: perm.id
      });
    }
  }

  // Assign limited permissions to user role
  const userPermissionList = [
    'navigation.view', 'dashboard.view', 'profile.read', 'profile.update', 
    'profile.avatar', 'profile.preferences', 'settings.view', 'settings.update', 
    'settings.theme', 'settings.notifications'
  ];
  
  // Insert user permissions (check for duplicates first)
  const userPermissions = allPermissions
    .filter(perm => userPermissionList.includes(`${perm.resource}.${perm.action}`));
  
  for (const perm of userPermissions) {
    const existing = await knex('role_permissions')
      .where({ role_id: userRole.id, permission_id: perm.id })
      .first();
    
    if (!existing) {
      await knex('role_permissions').insert({
        role_id: userRole.id,
        permission_id: perm.id
      });
    }
  }

  console.log('✅ Updated role permissions');

  // Create additional navigation structure (extending from seed 002)
  // Note: seed 002 already created: dashboard, user-management, settings, divider-1
  const navigationToAdd = [
    // Additional Main Navigation Items (not in seed 002)
    {
      key: 'analytics',
      title: 'Analytics',
      type: 'item',
      icon: 'heroicons_outline:chart-bar',
      link: '/analytics',
      sort_order: 2,
      show_in_compact: false
    },
    {
      key: 'system',
      title: 'System',
      type: 'collapsible',
      icon: 'heroicons_outline:server',
      sort_order: 20,
      show_in_compact: false,
      show_in_horizontal: false
    },
    {
      key: 'divider-main',
      title: '',
      type: 'divider',
      sort_order: 40,
      show_in_horizontal: false
    },
    {
      key: 'help-support',
      title: 'Help & Support',
      type: 'group',
      sort_order: 50,
      show_in_compact: false
    }
  ];

  // Insert navigation items that don't already exist
  const mainNavItems = await insertNavigationItems(navigationToAdd);
  console.log('✅ Created/found main navigation items');

  // Get parent items (some from seed 002, some from this seed)
  const userMgmtParent = await knex('navigation_items').where({ key: 'user-management' }).first();
  const systemParent = mainNavItems.find(item => item.key === 'system');
  const settingsParent = await knex('navigation_items').where({ key: 'settings' }).first();
  const helpParent = mainNavItems.find(item => item.key === 'help-support');

  // User Management sub-items (only add what's not in seed 002)
  // Note: seed 002 already created: users-list, users-roles
  if (userMgmtParent) {
    await insertNavigationItems([
      {
        parent_id: userMgmtParent.id,
        key: 'users-sessions',
        title: 'Active Sessions',
        type: 'item',
        icon: 'heroicons_outline:device-phone-mobile',
        link: '/users/sessions',
        sort_order: 3
      }
    ]);
  }

  // System sub-items
  if (systemParent) {
    await insertNavigationItems([
      {
        parent_id: systemParent.id,
        key: 'system-monitor',
        title: 'System Monitor',
        type: 'item',
        icon: 'heroicons_outline:cpu-chip',
        link: '/system/monitor',
        sort_order: 1
      },
      {
        parent_id: systemParent.id,
        key: 'system-logs',
        title: 'Logs',
        type: 'item',
        icon: 'heroicons_outline:document-text',
        link: '/system/logs',
        sort_order: 2
      },
      {
        parent_id: systemParent.id,
        key: 'system-settings',
        title: 'System Settings',
        type: 'item',
        icon: 'heroicons_outline:wrench-screwdriver',
        link: '/system/settings',
        sort_order: 3
      }
    ]);
  }

  // Settings sub-items (only add what's not in seed 002)
  // Note: seed 002 already created: settings-profile, settings-preferences, settings-security
  if (settingsParent) {
    await insertNavigationItems([
      {
        parent_id: settingsParent.id,
        key: 'settings-theme',
        title: 'Theme',
        type: 'item',
        icon: 'heroicons_outline:swatch',
        link: '/settings/theme',
        sort_order: 3
      },
      {
        parent_id: settingsParent.id,
        key: 'settings-notifications',
        title: 'Notifications',
        type: 'item',
        icon: 'heroicons_outline:bell',
        link: '/settings/notifications',
        sort_order: 4
      },
      {
        parent_id: settingsParent.id,
        key: 'settings-api-keys',
        title: 'API Keys',
        type: 'item',
        icon: 'heroicons_outline:key',
        link: '/settings/api-keys',
        sort_order: 6
      }
    ]);
  }

  // Help & Support sub-items
  if (helpParent) {
    await insertNavigationItems([
      {
        parent_id: helpParent.id,
        key: 'help-documentation',
        title: 'Documentation',
        type: 'item',
        icon: 'heroicons_outline:book-open',
        link: '/help/docs',
        target: '_blank',
        sort_order: 1
      },
      {
        parent_id: helpParent.id,
        key: 'help-support',
        title: 'Contact Support',
        type: 'item',
        icon: 'heroicons_outline:chat-bubble-left-right',
        link: '/help/support',
        sort_order: 2
      },
      {
        parent_id: helpParent.id,
        key: 'help-about',
        title: 'About',
        type: 'item',
        icon: 'heroicons_outline:information-circle',
        link: '/help/about',
        sort_order: 3
      }
    ]);
  }

  console.log('✅ Created sub-navigation items');

  // Link navigation items with permissions
  const allNavItems = await knex('navigation_items').select(['id', 'key']);
  
  const navigationPermissionMappings = [
    // Dashboard
    { nav_key: 'dashboard', permission: 'dashboard.view' },
    { nav_key: 'analytics', permission: 'dashboard.analytics' },
    
    // User Management
    { nav_key: 'user-management', permission: 'users.read' },
    { nav_key: 'users-list', permission: 'users.read' },
    { nav_key: 'users-roles', permission: 'roles.read' },
    { nav_key: 'users-sessions', permission: 'users.read' },
    
    // System
    { nav_key: 'system', permission: 'system.monitor' },
    { nav_key: 'system-monitor', permission: 'system.monitor' },
    { nav_key: 'system-logs', permission: 'system.logs' },
    { nav_key: 'system-settings', permission: 'system.settings' },
    
    // Settings
    { nav_key: 'settings', permission: 'settings.view' },
    { nav_key: 'settings-profile', permission: 'profile.read' },
    { nav_key: 'settings-preferences', permission: 'profile.preferences' },
    { nav_key: 'settings-theme', permission: 'settings.theme' },
    { nav_key: 'settings-notifications', permission: 'settings.notifications' },
    { nav_key: 'settings-security', permission: 'profile.update' },
    { nav_key: 'settings-api-keys', permission: 'profile.read' }
  ];

  // Create navigation-permission links (check for duplicates)
  for (const mapping of navigationPermissionMappings) {
    const navItem = allNavItems.find(item => item.key === mapping.nav_key);
    const [resource, action] = mapping.permission.split('.');
    const permission = allPermissions.find(perm => 
      perm.resource === resource && perm.action === action
    );
    
    if (navItem && permission) {
      // Check if the link already exists
      const existingLink = await knex('navigation_permissions')
        .where({ 
          navigation_item_id: navItem.id, 
          permission_id: permission.id 
        })
        .first();
      
      if (!existingLink) {
        await knex('navigation_permissions').insert({
          navigation_item_id: navItem.id,
          permission_id: permission.id
        });
      }
    }
  }

  console.log('✅ Linked navigation items with permissions');

  // Create default notification preferences for existing users
  const allUsers = await knex('users').select(['id']);
  const notificationTypes = ['security', 'updates', 'marketing', 'reminders', 'system'];

  for (const user of allUsers) {
    // Check if user already has notification preferences
    const existingPrefs = await knex('notification_preferences')
      .where({ user_id: user.id })
      .first();
    
    if (!existingPrefs) {
      const preferences = notificationTypes.map(type => ({
        user_id: user.id,
        notification_type: type,
        email_enabled: type === 'security' || type === 'system',
        push_enabled: false,
        desktop_enabled: type !== 'marketing',
        sound_enabled: type === 'security' || type === 'system',
        frequency: type === 'marketing' ? 'weekly' : 'immediate'
      }));
      
      await knex('notification_preferences').insert(preferences);
    }
  }

  console.log('✅ Created default notification preferences');
  console.log('✅ Navigation and permissions seed completed successfully');
}