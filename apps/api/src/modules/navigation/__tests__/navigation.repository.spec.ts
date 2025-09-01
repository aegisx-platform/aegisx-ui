import { NavigationRepository } from '../navigation.repository';
import { NavigationType, NavigationItemType, NavigationTarget, BadgeVariant } from '../navigation.types';

// Mock Knex
const mockKnex = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  whereNull: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  orderByRaw: jest.fn().mockReturnThis(),
  first: jest.fn(),
  raw: jest.fn(),
  then: jest.fn()
};

// Mock data
const mockNavigationItems = [
  {
    id: '1',
    parent_id: null,
    key: 'dashboard',
    title: 'Dashboard',
    type: 'item' as NavigationItemType,
    icon: 'heroicons_outline:chart-pie',
    link: '/dashboard',
    target: '_self' as NavigationTarget,
    sort_order: 1,
    disabled: false,
    hidden: false,
    exact_match: false,
    badge_title: 'New',
    badge_variant: 'primary' as BadgeVariant,
    show_in_default: true,
    show_in_compact: true,
    show_in_horizontal: true,
    show_in_mobile: true,
    meta: null,
    created_at: new Date(),
    updated_at: new Date(),
    permissions: ['dashboard.view']
  },
  {
    id: '2',
    parent_id: null,
    key: 'users',
    title: 'User Management',
    type: 'collapsible' as NavigationItemType,
    icon: 'heroicons_outline:users',
    link: null,
    target: '_self' as NavigationTarget,
    sort_order: 2,
    disabled: false,
    hidden: false,
    exact_match: false,
    badge_title: null,
    badge_variant: null,
    show_in_default: true,
    show_in_compact: false,
    show_in_horizontal: false,
    show_in_mobile: true,
    meta: null,
    created_at: new Date(),
    updated_at: new Date(),
    permissions: ['users.read']
  },
  {
    id: '3',
    parent_id: '2',
    key: 'users-list',
    title: 'Users List',
    type: 'item' as NavigationItemType,
    icon: 'heroicons_outline:user-group',
    link: '/users',
    target: '_self' as NavigationTarget,
    sort_order: 1,
    disabled: false,
    hidden: false,
    exact_match: false,
    badge_title: null,
    badge_variant: null,
    show_in_default: true,
    show_in_compact: false,
    show_in_horizontal: false,
    show_in_mobile: true,
    meta: null,
    created_at: new Date(),
    updated_at: new Date(),
    permissions: ['users.read']
  }
];

const mockUserPermissions = ['dashboard.view', 'users.read'];

describe('NavigationRepository', () => {
  let repository: NavigationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new NavigationRepository(mockKnex as any);
  });

  describe('getNavigationItems', () => {
    it('should return navigation items with permissions', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);

      const result = await repository.getNavigationItems(false);

      expect(mockKnex.leftJoin).toHaveBeenCalledWith('navigation_permissions as np', 'ni.id', 'np.navigation_item_id');
      expect(mockKnex.leftJoin).toHaveBeenCalledWith('permissions as p', 'np.permission_id', 'p.id');
      expect(mockKnex.where).toHaveBeenCalledWith('ni.disabled', false);
      expect(result).toBeDefined();
      expect(result.length).toBe(2); // Should have 2 root items
    });

    it('should include disabled items when requested', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);

      await repository.getNavigationItems(true);

      expect(mockKnex.where).not.toHaveBeenCalledWith('ni.disabled', false);
    });

    it('should build hierarchical structure correctly', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);

      const result = await repository.getNavigationItems(false);

      // Find parent item
      const parentItem = result.find(item => item.key === 'users');
      expect(parentItem).toBeDefined();
      expect(parentItem?.children).toBeDefined();
      expect(parentItem?.children?.length).toBe(1);
      expect(parentItem?.children?.[0]?.key).toBe('users-list');
    });
  });

  describe('getUserNavigationItems', () => {
    it('should filter navigation by user permissions', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);
      
      // Mock getUserPermissions
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue(mockUserPermissions);

      const result = await repository.getUserNavigationItems('user-1', 'default', false);

      expect(repository.getUserPermissions).toHaveBeenCalledWith('user-1');
      expect(result).toBeDefined();
    });

    it('should apply navigation type filter', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue(mockUserPermissions);

      await repository.getUserNavigationItems('user-1', 'compact', false);

      expect(mockKnex.where).toHaveBeenCalledWith('ni.show_in_compact', true);
    });

    it('should exclude user-hidden items', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue(mockUserPermissions);

      await repository.getUserNavigationItems('user-1', 'default', false);

      expect(mockKnex.where).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions array', async () => {
      const mockPermissions = { permissions: ['dashboard.view', 'users.read'] };
      mockKnex.first.mockResolvedValueOnce(mockPermissions);

      const result = await repository.getUserPermissions('user-1');

      expect(result).toEqual(['dashboard.view', 'users.read']);
      expect(mockKnex.join).toHaveBeenCalledWith('user_roles as ur', 'u.id', 'ur.user_id');
      expect(mockKnex.join).toHaveBeenCalledWith('role_permissions as rp', 'ur.role_id', 'rp.role_id');
      expect(mockKnex.join).toHaveBeenCalledWith('permissions as p', 'rp.permission_id', 'p.id');
    });

    it('should return empty array if no permissions found', async () => {
      mockKnex.first.mockResolvedValueOnce(null);

      const result = await repository.getUserPermissions('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getNavigationItemByKey', () => {
    it('should return navigation item by key', async () => {
      const mockItem = mockNavigationItems[0];
      mockKnex.first.mockResolvedValueOnce(mockItem);

      const result = await repository.getNavigationItemByKey('dashboard');

      expect(mockKnex.where).toHaveBeenCalledWith('key', 'dashboard');
      expect(result).toEqual(mockItem);
    });

    it('should return null if item not found', async () => {
      mockKnex.first.mockResolvedValueOnce(null);

      const result = await repository.getNavigationItemByKey('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('filterByType', () => {
    it('should filter items by navigation type', () => {
      const items = mockNavigationItems.map(item => ({ ...item, children: [] }));

      const result = repository.filterByType(items, 'compact');

      expect(result.length).toBe(1); // Only dashboard should be included
      expect(result[0].key).toBe('dashboard');
    });

    it('should handle all navigation types', () => {
      const items = mockNavigationItems.map(item => ({ ...item, children: [] }));

      const types: NavigationType[] = ['default', 'compact', 'horizontal', 'mobile'];

      types.forEach(type => {
        const result = repository.filterByType(items, type);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('buildNavigationTree (private method test via public methods)', () => {
    it('should properly sort children by sort_order', async () => {
      const itemsWithMultipleChildren = [
        ...mockNavigationItems,
        {
          id: '4',
          parent_id: '2',
          key: 'users-roles',
          title: 'Roles & Permissions',
          type: 'item' as const,
          sort_order: 0, // Should come before users-list (sort_order: 1)
          show_in_default: true,
          show_in_compact: true,
          show_in_horizontal: true,
          show_in_mobile: true,
          permissions: ['roles.read']
        } as any
      ];

      mockKnex.then.mockResolvedValueOnce(itemsWithMultipleChildren);

      const result = await repository.getNavigationItems(false);
      const parentItem = result.find(item => item.key === 'users');
      
      expect(parentItem?.children?.length).toBe(2);
      expect(parentItem?.children?.[0]?.key).toBe('users-roles'); // sort_order: 0
      expect(parentItem?.children?.[1]?.key).toBe('users-list'); // sort_order: 1
    });
  });

  describe('filterByPermissions (private method test via public methods)', () => {
    it('should allow items without permissions', async () => {
      const itemsWithoutPermissions = [
        {
          ...mockNavigationItems[0],
          permissions: []
        }
      ];

      mockKnex.then.mockResolvedValueOnce(itemsWithoutPermissions);
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue([]);

      const result = await repository.getUserNavigationItems('user-1');

      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter items requiring permissions user does not have', async () => {
      const restrictedItems = [
        {
          ...mockNavigationItems[0],
          permissions: ['admin.super']
        }
      ];

      mockKnex.then.mockResolvedValueOnce(restrictedItems);
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue(['users.read']);

      const result = await repository.getUserNavigationItems('user-1');

      expect(result.length).toBe(0);
    });

    it('should allow super admin access (*:*)', async () => {
      mockKnex.then.mockResolvedValueOnce(mockNavigationItems);
      jest.spyOn(repository, 'getUserPermissions').mockResolvedValue(['*:*']);

      const result = await repository.getUserNavigationItems('admin-1');

      expect(result.length).toBeGreaterThan(0);
    });
  });
});