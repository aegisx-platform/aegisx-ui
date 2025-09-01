import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load test environment variables
dotenv.config({ path: resolve(__dirname, '../../../../../.env.test') });

// Set test environment
process.env.NODE_ENV = 'test';

// Global test configuration
jest.setTimeout(30000);

// Mock console methods in test environment to reduce noise
if (process.env.DISABLE_LOGGING === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
}

// Global error handlers for unhandled promises and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit process in tests, just log
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit process in tests, just log
});

// Setup global test utilities
global.testConfig = {
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000
  },
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    name: process.env.TEST_DB_NAME || 'aegisx_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'test-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  }
};

// Custom matchers for better test assertions
expect.extend({
  toBeValidJWT(received: string) {
    const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    const pass = jwtRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },

  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },

  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },

  toHaveApiResponseStructure(received: any) {
    const hasSuccess = typeof received.success === 'boolean';
    const hasData = received.success ? received.data !== undefined : true;
    const hasError = !received.success ? received.error !== undefined : true;
    const hasMeta = received.meta !== undefined;
    const hasTimestamp = received.meta && typeof received.meta.timestamp === 'string';
    const hasVersion = received.meta && typeof received.meta.version === 'string';
    
    const pass = hasSuccess && hasData && hasError && hasMeta && hasTimestamp && hasVersion;
    
    if (pass) {
      return {
        message: () => `expected response not to have valid API structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have valid API structure (success, data/error, meta with timestamp and version)`,
        pass: false,
      };
    }
  }
});

// Declare global types for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJWT(): R;
      toBeValidUUID(): R;
      toBeValidEmail(): R;
      toHaveApiResponseStructure(): R;
    }
  }

  var testConfig: {
    timeouts: {
      short: number;
      medium: number;
      long: number;
    };
    database: {
      host: string;
      port: number;
      name: string;
      user: string;
      password: string;
    };
    jwt: {
      secret: string;
      expiresIn: string;
    };
  };
}

// Helper function to wait for a condition
global.waitFor = async (
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
      // Continue waiting if condition throws
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
};

// Helper function to generate random test data
global.generateTestData = {
  email: () => `test${Date.now()}${Math.random().toString(36).substr(2, 5)}@example.com`,
  username: () => `user${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
  password: () => `Pass${Math.random().toString(36).substr(2, 8)}123!`,
  name: () => `Test${Math.random().toString(36).substr(2, 5)}`,
  uuid: () => require('uuid').v4(),
  timestamp: () => new Date().toISOString(),
  port: () => Math.floor(Math.random() * 10000) + 30000
};

// Declare global helper functions
declare global {
  var waitFor: (
    condition: () => boolean | Promise<boolean>,
    timeout?: number,
    interval?: number
  ) => Promise<void>;

  var generateTestData: {
    email(): string;
    username(): string;
    password(): string;
    name(): string;
    uuid(): string;
    timestamp(): string;
    port(): number;
  };
}

export {};