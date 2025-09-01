export default {
  displayName: 'Integration Tests',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/api/src/__tests__/integration'],
  testMatch: [
    '**/__tests__/integration/**/*.spec.ts',
    '**/__tests__/integration/**/*.test.ts'
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/apps/api/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '<rootDir>/coverage/integration',
  collectCoverageFrom: [
    'apps/api/src/**/*.ts',
    '!apps/api/src/**/*.spec.ts',
    '!apps/api/src/**/*.test.ts',
    '!apps/api/src/__tests__/**',
    '!apps/api/src/database/migrations/**',
    '!apps/api/src/database/seeds/**',
    '!apps/api/src/main.ts',
    '!apps/api/src/healthcheck.js'
  ],
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 70,
      functions: 75,
      lines: 75
    }
  },
  setupFilesAfterEnv: [
    '<rootDir>/apps/api/src/__tests__/integration/jest.setup.ts'
  ],
  globalSetup: '<rootDir>/apps/api/src/__tests__/integration/jest.global-setup.ts',
  globalTeardown: '<rootDir>/apps/api/src/__tests__/integration/jest.global-teardown.ts',
  testTimeout: 30000,
  maxWorkers: 2,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  // Run tests in sequence to avoid database conflicts
  maxConcurrency: 1,
  testSequencer: '<rootDir>/apps/api/src/__tests__/integration/jest.sequencer.js'
};