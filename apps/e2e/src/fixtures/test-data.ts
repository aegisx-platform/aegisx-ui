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
  },
} as const;