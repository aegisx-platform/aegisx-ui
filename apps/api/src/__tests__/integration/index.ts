/**
 * AegisX API Integration Test Suite
 * 
 * Comprehensive integration testing infrastructure for the AegisX API
 * providing full application context testing with real database operations,
 * authentication flows, and cross-module interactions.
 */

// Main setup and configuration
export { setupTestContext, globalSetup, globalTeardown } from './setup';

// Authentication helpers
export { AuthHelper, authHeaders, createTestUserData } from './auth-helper';

// Database utilities
export { DatabaseHelper } from './db-helper';

// Request helpers
export { RequestHelper, createRequestHelper } from './request-helper';

// Response assertions
export { 
  ResponseAssertions,
  expectResponse,
  commonAssertions,
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse
} from './assertions';

// Test data factories
export {
  TestDataFactory,
  TestUserFactory,
  NavigationItemFactory,
  SessionFactory,
  SettingsFactory
} from './factories';

// Type definitions
export interface TestContext {
  app: any;
  db: {
    connection: any;
    migrate: () => Promise<void>;
    seed: () => Promise<void>;
    cleanup: () => Promise<void>;
    resetSequences: () => Promise<void>;
  };
  factories: {
    user: TestUserFactory;
    data: TestDataFactory;
  };
  cleanup: () => Promise<void>;
}

export interface TestUser {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];
  emailVerified?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    field?: string;
  };
  meta?: {
    timestamp: string;
    version: string;
    [key: string]: any;
  };
}

// Re-export commonly used utilities
export { default as supertest } from 'supertest';

/**
 * Quick setup for basic integration tests
 * 
 * @example
 * ```typescript
 * import { quickSetup } from '../integration';
 * 
 * describe('My Integration Test', () => {
 *   let context;
 *   
 *   beforeAll(async () => {
 *     context = await quickSetup();
 *   });
 *   
 *   afterAll(async () => {
 *     await context.cleanup();
 *   });
 *   
 *   it('should work', async () => {
 *     const response = await context.request.get('/api/health');
 *     expect(response.status).toBe(200);
 *   });
 * });
 * ```
 */
export async function quickSetup() {
  const testContext = await setupTestContext();
  const authHelper = new AuthHelper(testContext.app, testContext.db.connection);
  const dbHelper = new DatabaseHelper(testContext.db.connection);
  const requestHelper = createRequestHelper(testContext.app);

  return {
    app: testContext.app,
    db: testContext.db,
    auth: authHelper,
    dbHelper,
    request: requestHelper,
    factories: testContext.factories,
    cleanup: testContext.cleanup,
  };
}

/**
 * Create a test user with authentication for quick testing
 * 
 * @example
 * ```typescript
 * const { user, token } = await createAuthenticatedUser(context.auth);
 * const response = await context.request.getAuth('/api/users/profile', { token });
 * ```
 */
export async function createAuthenticatedUser(
  authHelper: AuthHelper,
  userData: Partial<TestUser> = {}
) {
  const user = await authHelper.createTestUser(userData);
  const tokens = await authHelper.loginUser(user.email, user.password);
  
  return {
    user,
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokens,
  };
}

/**
 * Test utilities for common integration test patterns
 */
export const testUtils = {
  /**
   * Wait for a condition to be true with timeout
   */
  waitFor: async (
    condition: () => boolean | Promise<boolean>,
    timeout: number = 5000,
    interval: number = 100
  ): Promise<void> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const result = await condition();
        if (result) {
          return;
        }
      } catch (error) {
        // Continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  },

  /**
   * Generate unique test data
   */
  generateTestData: {
    email: () => `test${Date.now()}${Math.random().toString(36).substr(2, 5)}@example.com`,
    username: () => `user${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
    password: () => `Pass${Math.random().toString(36).substr(2, 8)}123!`,
    name: () => `Test${Math.random().toString(36).substr(2, 5)}`,
  },

  /**
   * Sleep for testing timing scenarios
   */
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a test timeout with custom message
   */
  timeout: (ms: number, message?: string) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message || `Test timed out after ${ms}ms`));
      }, ms);
    });
  },
};

// Default export for convenience
export default {
  setupTestContext,
  AuthHelper,
  DatabaseHelper,
  RequestHelper,
  expectResponse,
  commonAssertions,
  quickSetup,
  createAuthenticatedUser,
  testUtils,
};