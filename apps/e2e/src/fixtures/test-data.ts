/**
 * Test data fixtures and factories for E2E tests
 */

export interface TestUser {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  isActive?: boolean;
}

export interface TestUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface UserPreferences {
  theme: 'default' | 'dark' | 'light' | 'auto';
  scheme: 'light' | 'dark' | 'auto';
  layout: 'classic' | 'compact' | 'enterprise' | 'empty';
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  navigation: {
    collapsed: boolean;
    type: 'default' | 'compact' | 'horizontal';
    position: 'left' | 'right' | 'top';
  };
}

export interface TestCredentials {
  email: string;
  password: string;
}

/**
 * Default test users available from seed data
 */
export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@aegisx.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    isActive: true,
  },
  manager: {
    email: 'manager@aegisx.com',
    password: 'manager123',
    firstName: 'John',
    lastName: 'Manager',
    role: 'manager',
    isActive: true,
  },
  user: {
    email: 'user@aegisx.com',
    password: 'user123',
    firstName: 'Jane',
    lastName: 'User',
    role: 'user',
    isActive: true,
  },
} as const;

/**
 * Test credentials for different user types
 */
export const TEST_CREDENTIALS: Record<string, TestCredentials> = {
  admin: {
    email: TEST_USERS.admin.email,
    password: TEST_USERS.admin.password,
  },
  manager: {
    email: TEST_USERS.manager.email,
    password: TEST_USERS.manager.password,
  },
  user: {
    email: TEST_USERS.user.email,
    password: TEST_USERS.user.password,
  },
  invalid: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  },
} as const;

/**
 * Factory for creating test user data
 */
export class TestUserFactory {
  private static counter = 1;

  static create(overrides: Partial<TestUser> = {}): TestUser {
    const id = this.counter++;
    return {
      email: `testuser${id}@aegisx.com`,
      password: 'TestPassword123!',
      firstName: `Test${id}`,
      lastName: 'User',
      role: 'user',
      isActive: true,
      ...overrides,
    };
  }

  static createProfile(overrides: Partial<TestUserProfile> = {}): TestUserProfile {
    const id = this.counter++;
    return {
      firstName: `Test${id}`,
      lastName: 'User',
      email: `testuser${id}@aegisx.com`,
      phone: '+1-555-0123',
      bio: 'Test user for E2E testing',
      timezone: 'UTC',
      language: 'en',
      theme: 'light',
      ...overrides,
    };
  }
}

/**
 * Test navigation items
 */
export const TEST_NAVIGATION = {
  dashboard: {
    label: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
  },
  users: {
    label: 'Users',
    url: '/users',
    icon: 'people',
  },
  profile: {
    label: 'Profile',
    url: '/profile',
    icon: 'person',
  },
  settings: {
    label: 'Settings',
    url: '/settings',
    icon: 'settings',
  },
} as const;

/**
 * Test URLs for different environments
 */
export const TEST_URLS = {
  development: 'http://localhost:4200',
  staging: 'https://staging.aegisx.com',
  production: 'https://app.aegisx.com',
} as const;

/**
 * Test viewport sizes for responsive testing
 */
export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 },
} as const;

/**
 * Test timeouts and delays
 */
export const TEST_TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  navigation: 30000,
  action: 10000,
} as const;

/**
 * API endpoints for testing
 */
export const TEST_API_ENDPOINTS = {
  health: '/health',
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
  },
  users: {
    list: '/api/users',
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },
  profile: {
    get: '/api/profile',
    update: '/api/profile',
    avatar: '/api/profile/avatar',
    preferences: '/api/profile/preferences',
  },
} as const;

/**
 * Default user preferences for testing
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'default',
  scheme: 'light',
  layout: 'classic',
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    email: true,
    push: false,
    desktop: true,
    sound: true
  },
  navigation: {
    collapsed: false,
    type: 'default',
    position: 'left'
  }
} as const;

/**
 * Test preferences scenarios for different test cases
 */
export const TEST_PREFERENCES = {
  default: DEFAULT_USER_PREFERENCES,
  
  darkMode: {
    ...DEFAULT_USER_PREFERENCES,
    theme: 'dark',
    scheme: 'dark',
  } as UserPreferences,
  
  compactLayout: {
    ...DEFAULT_USER_PREFERENCES,
    layout: 'compact',
    navigation: {
      collapsed: true,
      type: 'compact',
      position: 'left'
    }
  } as UserPreferences,
  
  internationalUser: {
    ...DEFAULT_USER_PREFERENCES,
    language: 'th',
    timezone: 'Asia/Bangkok',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  } as UserPreferences,
  
  minimalNotifications: {
    ...DEFAULT_USER_PREFERENCES,
    notifications: {
      email: false,
      push: false,
      desktop: false,
      sound: false
    }
  } as UserPreferences,
  
  allNotificationsEnabled: {
    ...DEFAULT_USER_PREFERENCES,
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true
    }
  } as UserPreferences,
  
  horizontalNavigation: {
    ...DEFAULT_USER_PREFERENCES,
    navigation: {
      collapsed: false,
      type: 'horizontal',
      position: 'top'
    }
  } as UserPreferences,
  
  rightSideNavigation: {
    ...DEFAULT_USER_PREFERENCES,
    navigation: {
      collapsed: false,
      type: 'default',
      position: 'right'
    }
  } as UserPreferences,
  
  enterpriseLayout: {
    ...DEFAULT_USER_PREFERENCES,
    layout: 'enterprise',
    theme: 'light',
    navigation: {
      collapsed: false,
      type: 'default',
      position: 'left'
    }
  } as UserPreferences,
} as const;

/**
 * Factory for creating test preferences data
 */
export class TestPreferencesFactory {
  /**
   * Create custom preferences with overrides
   */
  static create(overrides: Partial<UserPreferences> = {}): UserPreferences {
    return {
      ...DEFAULT_USER_PREFERENCES,
      ...overrides,
      notifications: {
        ...DEFAULT_USER_PREFERENCES.notifications,
        ...overrides.notifications,
      },
      navigation: {
        ...DEFAULT_USER_PREFERENCES.navigation,
        ...overrides.navigation,
      }
    };
  }

  /**
   * Create preferences for specific theme testing
   */
  static createForTheme(theme: UserPreferences['theme']): UserPreferences {
    const scheme = theme === 'dark' ? 'dark' : 'light';
    return this.create({ theme, scheme });
  }

  /**
   * Create preferences for specific layout testing
   */
  static createForLayout(layout: UserPreferences['layout']): UserPreferences {
    const navigationConfig = {
      classic: { type: 'default', position: 'left', collapsed: false },
      compact: { type: 'compact', position: 'left', collapsed: true },
      enterprise: { type: 'default', position: 'left', collapsed: false },
      empty: { type: 'default', position: 'left', collapsed: false }
    } as const;

    return this.create({
      layout,
      navigation: {
        ...DEFAULT_USER_PREFERENCES.navigation,
        ...navigationConfig[layout]
      } as any
    });
  }

  /**
   * Create preferences for specific locale testing
   */
  static createForLocale(language: string, timezone: string): UserPreferences {
    const localeConfigs = {
      'en': { dateFormat: 'MM/DD/YYYY', timeFormat: '12h' },
      'th': { dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
      'ja': { dateFormat: 'YYYY-MM-DD', timeFormat: '24h' },
      'de': { dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
      'fr': { dateFormat: 'DD/MM/YYYY', timeFormat: '24h' },
    } as const;

    const config = localeConfigs[language as keyof typeof localeConfigs] || localeConfigs.en;

    return this.create({
      language,
      timezone,
      ...config
    });
  }

  /**
   * Create preferences for notification testing
   */
  static createForNotifications(notifications: Partial<UserPreferences['notifications']>): UserPreferences {
    return this.create({
      notifications: {
        ...DEFAULT_USER_PREFERENCES.notifications,
        ...notifications
      }
    });
  }

  /**
   * Create preferences for navigation testing
   */
  static createForNavigation(navigation: Partial<UserPreferences['navigation']>): UserPreferences {
    return this.create({
      navigation: {
        ...DEFAULT_USER_PREFERENCES.navigation,
        ...navigation
      }
    });
  }

  /**
   * Create invalid preferences for error testing
   */
  static createInvalid(): Partial<UserPreferences> {
    return {
      language: '', // Invalid empty language
      timezone: 'Invalid/Timezone',
      theme: 'invalid-theme' as any,
      notifications: undefined as any,
    };
  }
}